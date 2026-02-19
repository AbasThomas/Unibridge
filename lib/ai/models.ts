export type SupportedLanguage = "en" | "yo" | "pcm";

export const AI_MODELS = {
  summarization: {
    primary: "facebook/bart-large-cnn",
    fallback: "sshleifer/distilbart-cnn-12-6",
  },
  moderation: {
    primary: "unitary/unbiased-toxic-roberta",
  },
  embeddings: {
    primary: "sentence-transformers/all-MiniLM-L6-v2",
  },
  translation: {
    primary: "facebook/nllb-200-distilled-600M",
  },
  checkin: {
    primary: "google/flan-t5-base",
  },
} as const;

export type ModelKey = keyof typeof AI_MODELS;
