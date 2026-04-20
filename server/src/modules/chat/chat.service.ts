import { createHash } from 'node:crypto';

import { env } from '../../config/env.js';
import { ServiceUnavailableError } from '../../common/errors/base-error.js';
import type { ChatHistoryItemInput, ChatRespondInput, ChatRespondRecord } from './chat.type.js';

const OUT_OF_SCOPE_REPLY =
  'Bu konuda yardımcı olamam. Yalnızca hayvanlarla ilgili soruları yanıtlıyorum.';
const AI_QUOTA_REPLY =
  'Yapay zeka yanıt kotası şu anda dolu. Biraz sonra tekrar deneyin.';
const AI_TIMEOUT_REPLY =
  'Yapay zeka servisi şu anda yavaş yanıt veriyor. Lütfen kısa bir süre sonra tekrar deneyin.';

const ANIMAL_KEYWORDS = [
  'hayvan',
  'kedi',
  'köpek',
  'kopek',
  'kuş',
  'kus',
  'tavşan',
  'tavsan',
  'hamster',
  'veteriner',
  'mama',
  'pati',
  'patili',
  'sokak hayvani',
  'sokak hayvanı',
  'barinak',
  'barınak',
  'sahipl',
  'tasma',
  'kulube',
  'kulübe',
  'parazit',
  'kisir',
  'kısır',
  'asi',
  'aşı',
  'iştah',
  'istah',
  'kusma',
  'ishal',
  'halsiz',
  'tüy',
  'tuy',
  'pire',
  'kene',
];

type GeminiStructuredReply = {
  in_scope: boolean;
  reply: string;
};

type GeminiReplyResult =
  | { kind: 'success'; inScope: boolean; reply: string }
  | { kind: 'quota_exhausted' }
  | { kind: 'timeout' }
  | { kind: 'unavailable' };

type ChatResponseContext = {
  clientId: string;
};

type CacheEntry = {
  value: ChatRespondRecord;
  expiresAt: number;
};

type ClientWindow = {
  requests: number[];
};

const chatCache = new Map<string, CacheEntry>();
const clientWindows = new Map<string, ClientWindow>();
const CHAT_CACHE_TTL_MS = 5 * 60 * 1000;
const CHAT_RATE_WINDOW_MS = 60 * 1000;
const CHAT_RATE_MAX_REQUESTS = 12;
const CHAT_MIN_INTERVAL_MS = 1500;

function buildContents(history: ChatHistoryItemInput[], message: string) {
  return [
    ...history.map((item) => ({
      role: item.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: item.content }],
    })),
    {
      role: 'user',
      parts: [{ text: message }],
    },
  ];
}

function cleanupExpiredCache(now: number) {
  for (const [key, entry] of chatCache.entries()) {
    if (entry.expiresAt <= now) {
      chatCache.delete(key);
    }
  }
}

function buildCacheKey(payload: ChatRespondInput) {
  const relevantHistory = (payload.messages ?? [])
    .slice(-6)
    .map((item) => `${item.role}:${item.content.trim()}`)
    .join('|');

  return createHash('sha256')
    .update(`${payload.message.trim()}::${relevantHistory}`)
    .digest('hex');
}

function getCachedReply(cacheKey: string, now: number) {
  cleanupExpiredCache(now);
  const entry = chatCache.get(cacheKey);

  if (!entry || entry.expiresAt <= now) {
    chatCache.delete(cacheKey);
    return null;
  }

  return entry.value;
}

function setCachedReply(cacheKey: string, value: ChatRespondRecord, now: number) {
  chatCache.set(cacheKey, {
    value,
    expiresAt: now + CHAT_CACHE_TTL_MS,
  });
}

function enforceRateLimit(clientId: string, now: number) {
  const currentWindow = clientWindows.get(clientId) ?? { requests: [] };
  currentWindow.requests = currentWindow.requests.filter((timestamp) => now - timestamp < CHAT_RATE_WINDOW_MS);

  const lastRequestAt = currentWindow.requests[currentWindow.requests.length - 1];

  if (lastRequestAt && now - lastRequestAt < CHAT_MIN_INTERVAL_MS) {
    throw new ServiceUnavailableError('Çok hızlı istek gönderiyorsunuz. Lütfen kısa bir süre bekleyin.');
  }

  if (currentWindow.requests.length >= CHAT_RATE_MAX_REQUESTS) {
    throw new ServiceUnavailableError('Çok fazla istek gönderildi. Lütfen biraz sonra tekrar deneyin.');
  }

  currentWindow.requests.push(now);
  clientWindows.set(clientId, currentWindow);
}

function extractJsonObject(text: string) {
  const fencedMatch = text.match(/```json\s*([\s\S]*?)```/i);
  const candidate = fencedMatch?.[1] ?? text;
  const startIndex = candidate.indexOf('{');
  const endIndex = candidate.lastIndexOf('}');

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    return null;
  }

  try {
    return JSON.parse(candidate.slice(startIndex, endIndex + 1)) as Partial<GeminiStructuredReply>;
  } catch {
    return null;
  }
}

async function generateGeminiReply(payload: ChatRespondInput) {
  if (!env.GEMINI_API_KEY || !env.GEMINI_MODEL) {
    return { kind: 'unavailable' } satisfies GeminiReplyResult;
  }

  const history: ChatHistoryItemInput[] = payload.messages ?? [];
  const systemPrompt = [
    'Sen Askida Mama uygulamasinin yapay zeka asistani olarak cevap veriyorsun.',
    'Önce kullanici mesajinin hayvanlarla ilgili olup olmadigina karar ver.',
    'Hayvan sagligi, bakimi, davranisi, beslenmesi, sahiplendirme, veterinerlik, urunler, barinma ve hayvan refahi hayvan kapsamina dahildir.',
    'Hayvan disi konular kapsama dahil degildir.',
    'Sadece gecerli JSON dondur. Aciklama, markdown veya ek metin yazma.',
    'JSON formati tam olarak soyle olmali:',
    '{"in_scope": true, "reply": "kisa yanit"}',
    `Eger soru hayvanlarla ilgili degilse reply tam olarak "${OUT_OF_SCOPE_REPLY}" olmali.`,
    'Eger soru hayvanlarla ilgiliyse reply kisa, net, yardimci ve guvenli olmali. Emin olmadigin noktalari belirt. Acil veya riskli durumlarda profesyonel destek oner.',
  ].join('\n');

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${env.GEMINI_MODEL}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: buildContents(history, payload.message),
          generationConfig: {
            temperature: 0.4,
          },
        }),
        signal: AbortSignal.timeout(20000),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      if (response.status === 429 || errorText.includes('RESOURCE_EXHAUSTED')) {
        return { kind: 'quota_exhausted' } satisfies GeminiReplyResult;
      }

      return { kind: 'unavailable' } satisfies GeminiReplyResult;
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{
            text?: string;
          }>;
        };
      }>;
    };

    const text =
      data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('').trim() ?? null;

    if (!text) {
      return { kind: 'unavailable' } satisfies GeminiReplyResult;
    }

    const parsed = extractJsonObject(text);

    if (typeof parsed?.in_scope !== 'boolean' || typeof parsed?.reply !== 'string') {
      return { kind: 'unavailable' } satisfies GeminiReplyResult;
    }

    return {
      kind: 'success',
      inScope: parsed.in_scope,
      reply: parsed.reply.trim(),
    } satisfies GeminiReplyResult;
  } catch (error) {
    console.error('Gemini chat request failed:', error);

    if (error instanceof Error && error.name === 'TimeoutError') {
      return { kind: 'timeout' } satisfies GeminiReplyResult;
    }

    return { kind: 'unavailable' } satisfies GeminiReplyResult;
  }
}

function isLikelyAnimalQuestion(message: string) {
  const normalizedMessage = message.toLocaleLowerCase('tr-TR');
  return ANIMAL_KEYWORDS.some((keyword) => normalizedMessage.includes(keyword));
}

export const chatService = {
  async getStatus() {
    return {
      module: 'chat',
      gemini_configured: Boolean(env.GEMINI_API_KEY && env.GEMINI_MODEL),
      model: env.GEMINI_MODEL,
    };
  },

  async respond(payload: ChatRespondInput, context: ChatResponseContext): Promise<ChatRespondRecord> {
    const now = Date.now();
    const cacheKey = buildCacheKey(payload);
    const cachedReply = getCachedReply(cacheKey, now);

    if (cachedReply) {
      return cachedReply;
    }

    enforceRateLimit(context.clientId, now);

    if (!isLikelyAnimalQuestion(payload.message)) {
      const reply = {
        reply: OUT_OF_SCOPE_REPLY,
        animal_type: null,
        used_fallback: true,
        model: null,
        quick_replies: [],
        require_animal_type_selection: false,
      };

      setCachedReply(cacheKey, reply, now);
      return reply;
    }

    const aiResult = await generateGeminiReply(payload);

    const reply = {
      reply:
        aiResult.kind === 'success' && aiResult.inScope === false
          ? OUT_OF_SCOPE_REPLY
          : aiResult.kind === 'success'
          ? aiResult.reply
          : aiResult.kind === 'quota_exhausted'
          ? AI_QUOTA_REPLY
          : aiResult.kind === 'timeout'
          ? AI_TIMEOUT_REPLY
          : 'Şu anda yanıt oluşturamıyorum. Lütfen kısa bir süre sonra tekrar deneyin.',
      animal_type: null,
      used_fallback: aiResult.kind !== 'success',
      model: aiResult.kind === 'success' ? env.GEMINI_MODEL : null,
      quick_replies: [],
      require_animal_type_selection: false,
    };

    if (aiResult.kind === 'success' || aiResult.kind === 'quota_exhausted') {
      setCachedReply(cacheKey, reply, now);
    }

    return reply;
  },
};
