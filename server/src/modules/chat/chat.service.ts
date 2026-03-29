import { env } from '../../config/env.js';
import type { ChatHistoryItemInput, ChatRespondInput, ChatRespondRecord } from './chat.type.js';

function normalizeAnimalType(animalType?: string | null) {
  if (!animalType) {
    return null;
  }

  const normalized = animalType.trim().toLocaleLowerCase('tr-TR');

  if (normalized === 'kedi' || normalized === 'cat') {
    return 'cat';
  }

  if (normalized === 'köpek' || normalized === 'kopek' || normalized === 'dog') {
    return 'dog';
  }

  return normalized;
}

function buildFallbackReply(message: string, animalType: string | null) {
  const normalizedMessage = message.toLocaleLowerCase('tr-TR');

  if (normalizedMessage.includes('kus') || normalizedMessage.includes('ishal') || normalizedMessage.includes('ates')) {
    return 'Belirtiler ciddi gorunuyorsa en yakin veterinere yonelin. Nefes darligi, surekli kusma, kanama veya bilinc degisikligi varsa acil destek alin.';
  }

  if (animalType === 'cat') {
    return 'Kedi icin daha net belirti yazarsan daha iyi yonlendirebilirim. Ciddi durumda veterinere basvurmalisin.';
  }

  if (animalType === 'dog') {
    return 'Kopek icin daha net belirti yazarsan daha iyi yonlendirebilirim. Ciddi durumda veterinere basvurmalisin.';
  }

  return 'Sorunu biraz daha detaylandir. Acil bir durum varsa en yakin veterinere yonelmen gerekir.';
}

async function generateGeminiReply(payload: ChatRespondInput, animalType: string | null) {
  if (!env.GEMINI_API_KEY || !env.GEMINI_MODEL) {
    return null;
  }

  const history: ChatHistoryItemInput[] = payload.messages ?? [];
  const systemPrompt =
    'Sen Askida Mama uygulamasinin yapay zeka asistani olarak cevap veriyorsun. Kisa, net ve guvenli cevap ver. Tani koyma. Ciddi durumda veterinere yonlendir. Kullaniciya korku yayma. Ilac dozu verme.';

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
        parts: [
          {
            text: `${systemPrompt}\nHayvan turu: ${animalType ?? 'belirtilmedi'}`,
          },
        ],
      },
      contents: [
        ...history.map((item) => ({
          role: item.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: item.content }],
        })),
        {
          role: 'user',
          parts: [{ text: payload.message }],
        },
      ],
      generationConfig: {
        temperature: 0.4,
      },
    }),
    },
  );

  if (!response.ok) {
    return null;
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

  return data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('').trim() ?? null;
}

export const chatService = {
  async getStatus() {
    return {
      module: 'chat',
      gemini_configured: Boolean(env.GEMINI_API_KEY && env.GEMINI_MODEL),
      model: env.GEMINI_MODEL,
    };
  },

  async respond(payload: ChatRespondInput): Promise<ChatRespondRecord> {
    const animalType = normalizeAnimalType(payload.animal_type);
    const aiReply = await generateGeminiReply(payload, animalType);

    return {
      reply: aiReply ?? buildFallbackReply(payload.message, animalType),
      animal_type: animalType,
      used_fallback: !aiReply,
      model: aiReply ? env.GEMINI_MODEL : null,
    };
  },
};
