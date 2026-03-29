import { env } from '../../config/env.js';
import type { ChatHistoryItemInput, ChatRespondInput, ChatRespondRecord } from './chat.type.js';

const RULE_BASED_RESPONSES: Record<string, string> = {
  kusma:
    'Kusma; hizli yemek yeme, yabanci cisim, mide rahatsizligi veya enfeksiyon kaynakli olabilir. Sik tekrarliyorsa, su tutamiyorsa veya halsizlik eslik ediyorsa veterinere gidin.',
  ishal:
    'Ishal durumunda su kaybi riskine dikkat edin. Kanli ishal, uzun sureli ishal veya halsizlik varsa veterinere basvurun. Gecici olarak hafif beslenme dusunulebilir.',
  ateş:
    'Yuksek ates ciddi enfeksiyon belirtisi olabilir. Hayvan cok halsizse, titriyorsa veya nefes sorunu varsa acil veteriner destegi alin.',
  kaşıntı:
    'Kasinti; pire, alerji, mantar veya cilt enfeksiyonu ile ilgili olabilir. Yogun kasinma, yara veya tüy kaybi varsa veterinere gostermek gerekir.',
  'tüy dökme':
    'Tuy dokulmesi mevsimsel olabilir ama asiriysa cilt sorunu, stres veya beslenme eksikligi dusunulur. Deride kizartilik veya acilan bolgeler varsa veteriner kontrolu gerekir.',
  tüy:
    'Tuy sorunlari cilt hastaligi, stres veya beslenme ile ilgili olabilir. Asiri dokulme veya ciltte yara varsa veterinere basvurun.',
  iştahsızlık:
    'Istahsizlik 24 saatten uzun surerse, kusma veya halsizlik eslik ederse veterinere gidilmelidir. Su tuketimi mutlaka izlenmelidir.',
  istahsizlik:
    'Istahsizlik 24 saatten uzun surerse, kusma veya halsizlik eslik ederse veterinere gidilmelidir. Su tuketimi mutlaka izlenmelidir.',
};

const HEALTH_KEYWORDS = [
  'kusma',
  'ishal',
  'ates',
  'ateş',
  'kasinti',
  'kaşıntı',
  'tuy',
  'tüy',
  'istah',
  'iştah',
  'halsiz',
  'yar',
  'yara',
  'kan',
  'öksür',
  'oksur',
  'nefes',
  'belirti',
  'hastalik',
  'hastalık',
  'enfeksiyon',
  'parazit',
  'agri',
  'ağrı',
  'deri',
];

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

function getRuleBasedReply(message: string) {
  const normalizedMessage = message.toLocaleLowerCase('tr-TR');

  for (const [keyword, reply] of Object.entries(RULE_BASED_RESPONSES)) {
    if (normalizedMessage.includes(keyword)) {
      return reply;
    }
  }

  return null;
}

function isHealthQuestion(message: string) {
  const normalizedMessage = message.toLocaleLowerCase('tr-TR');

  return HEALTH_KEYWORDS.some((keyword) => normalizedMessage.includes(keyword));
}

function buildRejectedReply(animalType: string | null) {
  if (!animalType) {
    return 'Once hayvan turunu secmelisin. Lutfen sadece kedi veya kopek sec.';
  }

  return 'Bu alan sadece kedi ve kopek sagligi ile ilgili sorular icin kullanilir. Farkli konulara cevap vermiyorum.';
}

async function generateGeminiReply(payload: ChatRespondInput, animalType: string | null) {
  if (!env.GEMINI_API_KEY || !env.GEMINI_MODEL) {
    return null;
  }

  const history: ChatHistoryItemInput[] = payload.messages ?? [];
  const systemPrompt =
    'Sen Askida Mama uygulamasinin yapay zeka asistani olarak cevap veriyorsun. Sadece kedi ve kopek sagligi, belirtileri ve hastaliklari hakkinda cevap ver. Bu alanin disina cikma. Kisa, net ve guvenli cevap ver. Tani koyma. Ciddi durumda veterinere yonlendir. Ilac dozu verme.';

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

    if (!animalType) {
      return {
        reply: buildRejectedReply(null),
        animal_type: null,
        used_fallback: true,
        model: null,
        quick_replies: ['kedi', 'köpek'],
        require_animal_type_selection: true,
      };
    }

    if (animalType !== 'cat' && animalType !== 'dog') {
      return {
        reply: 'Gecersiz secim. Lutfen sadece kedi veya kopek sec.',
        animal_type: animalType,
        used_fallback: true,
        model: null,
        quick_replies: ['kedi', 'köpek'],
        require_animal_type_selection: true,
      };
    }

    const ruleBasedReply = getRuleBasedReply(payload.message);

    if (ruleBasedReply) {
      return {
        reply: ruleBasedReply,
        animal_type: animalType,
        used_fallback: true,
        model: null,
        quick_replies: [],
        require_animal_type_selection: false,
      };
    }

    if (!isHealthQuestion(payload.message)) {
      return {
        reply: buildRejectedReply(animalType),
        animal_type: animalType,
        used_fallback: true,
        model: null,
        quick_replies: [],
        require_animal_type_selection: false,
      };
    }

    const aiReply = await generateGeminiReply(payload, animalType);

    return {
      reply:
        aiReply ??
        'Bu belirtiyi genel olarak degerlendirebilirim ama ciddi durumda mutlaka veteriner destegi alin.',
      animal_type: animalType,
      used_fallback: !aiReply,
      model: aiReply ? env.GEMINI_MODEL : null,
      quick_replies: [],
      require_animal_type_selection: false,
    };
  },
};
