import type { Opportunity } from "@/lib/types";
import {
  detectRisk,
  fallbackCheckinReply,
  fallbackMatchOpportunities,
  fallbackModeration,
  fallbackSummarize,
  fallbackTranslate,
  type MatchResult,
  type StudentProfile,
} from "./fallbacks";
import { AI_MODELS, type SupportedLanguage } from "./models";

const HF_BASE_URL = "https://api-inference.huggingface.co/models";
const HF_TIMEOUT_MS = 35_000;

interface HfClassificationItem {
  label: string;
  score: number;
}

function getHfToken() {
  return process.env.HUGGINGFACE_API_KEY ?? process.env.HF_TOKEN ?? "";
}

function buildHeaders() {
  const token = getHfToken();
  if (!token) {
    throw new Error("Missing Hugging Face token.");
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function safeErrorBody(response: Response) {
  try {
    const raw = await response.json();
    if (typeof raw?.error === "string") return raw.error;
    return JSON.stringify(raw);
  } catch {
    return response.statusText;
  }
}

async function queryModel<T>(model: string, payload: object): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), HF_TIMEOUT_MS);

  try {
    const response = await fetch(`${HF_BASE_URL}/${model}`, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Hugging Face ${response.status}: ${await safeErrorBody(response)}`);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function parseSummary(raw: unknown): string | null {
  if (!raw) return null;
  if (Array.isArray(raw) && raw.length > 0) {
    const first = raw[0] as Record<string, unknown>;
    if (typeof first.summary_text === "string") return first.summary_text;
    if (typeof first.generated_text === "string") return first.generated_text;
  }
  if (typeof raw === "object" && raw !== null && "summary_text" in raw) {
    const text = (raw as { summary_text?: unknown }).summary_text;
    if (typeof text === "string") return text;
  }
  return null;
}

function normalizeClassification(raw: unknown): HfClassificationItem[] {
  if (!Array.isArray(raw)) return [];
  if (raw.length === 0) return [];

  const levelOne = raw[0];
  if (Array.isArray(levelOne)) {
    return levelOne
      .filter((x): x is HfClassificationItem => typeof x?.label === "string" && typeof x?.score === "number")
      .sort((a, b) => b.score - a.score);
  }

  return raw
    .filter((x): x is HfClassificationItem => typeof x?.label === "string" && typeof x?.score === "number")
    .sort((a, b) => b.score - a.score);
}

function meanAcrossTokens(embedding: unknown): number[] | null {
  if (!Array.isArray(embedding) || embedding.length === 0) return null;

  if (embedding.every((x) => typeof x === "number")) {
    return embedding as number[];
  }

  const tokenVectors = embedding as unknown[];
  const firstVector = tokenVectors[0];
  if (!Array.isArray(firstVector) || firstVector.length === 0 || !firstVector.every((n) => typeof n === "number")) {
    return null;
  }

  const dims = firstVector.length;
  const sums = new Array(dims).fill(0);
  let validRows = 0;

  for (const row of tokenVectors) {
    if (!Array.isArray(row) || row.length !== dims || !row.every((n) => typeof n === "number")) continue;
    validRows += 1;
    for (let i = 0; i < dims; i += 1) {
      sums[i] += row[i] as number;
    }
  }

  if (validRows === 0) return null;
  return sums.map((v) => v / validRows);
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

function overlapRatio(profileWords: string[], itemWords: string[]) {
  if (profileWords.length === 0 || itemWords.length === 0) return 0;
  const set = new Set(profileWords.map((w) => w.toLowerCase()));
  const hits = itemWords.filter((w) => set.has(w.toLowerCase())).length;
  return hits / Math.max(profileWords.length, itemWords.length);
}

async function getEmbedding(text: string): Promise<number[]> {
  const raw = await queryModel<unknown>(AI_MODELS.embeddings.primary, {
    inputs: text,
    options: { wait_for_model: true, use_cache: true },
  });
  const vector = meanAcrossTokens(raw);
  if (!vector) throw new Error("Invalid embedding shape.");
  return vector;
}

export function hasHfAccess() {
  return Boolean(getHfToken());
}

export async function summarizeText(text: string) {
  const cleaned = normalizeText(text);
  if (!cleaned) {
    return {
      summary: "No text supplied for summarization.",
      model: "fallback:empty-input",
      usedFallback: true,
    };
  }

  const payload = {
    inputs: cleaned,
    parameters: {
      min_length: 40,
      max_length: 180,
      do_sample: false,
    },
    options: { wait_for_model: true, use_cache: true },
  };

  for (const model of [AI_MODELS.summarization.primary, AI_MODELS.summarization.fallback]) {
    try {
      const raw = await queryModel<unknown>(model, payload);
      const summary = parseSummary(raw);
      if (summary) return { summary, model, usedFallback: false };
    } catch {
      // Try next model and finally fallback.
    }
  }

  return {
    summary: fallbackSummarize(cleaned),
    model: "fallback:extractive-summary",
    usedFallback: true,
  };
}

export async function translateText(text: string, targetLanguage: SupportedLanguage) {
  if (targetLanguage === "en") {
    return { translation: text, model: "identity", usedFallback: false };
  }

  const targetLang = targetLanguage === "yo" ? "yor_Latn" : "pcm_Latn";
  try {
    const raw = await queryModel<unknown>(AI_MODELS.translation.primary, {
      inputs: text,
      parameters: {
        src_lang: "eng_Latn",
        tgt_lang: targetLang,
      },
      options: { wait_for_model: true, use_cache: true },
    });

    if (Array.isArray(raw) && raw.length > 0) {
      const first = raw[0] as Record<string, unknown>;
      if (typeof first.translation_text === "string") {
        return {
          translation: first.translation_text,
          model: AI_MODELS.translation.primary,
          usedFallback: false,
        };
      }
      if (typeof first.generated_text === "string") {
        return {
          translation: first.generated_text,
          model: AI_MODELS.translation.primary,
          usedFallback: false,
        };
      }
    }
  } catch {
    // Fallback below.
  }

  return {
    translation: fallbackTranslate(text, targetLanguage),
    model: "fallback:local-translation",
    usedFallback: true,
  };
}

export async function moderateText(text: string) {
  const cleaned = normalizeText(text);
  if (!cleaned) {
    return {
      flagged: false,
      score: 0,
      categories: ["clean"],
      recommendation: "No text to moderate.",
      model: "empty-input",
      usedFallback: false,
    };
  }

  try {
    const raw = await queryModel<unknown>(AI_MODELS.moderation.primary, {
      inputs: cleaned,
      parameters: { return_all_scores: true },
      options: { wait_for_model: true, use_cache: true },
    });

    const classes = normalizeClassification(raw);
    if (classes.length > 0) {
      const toxicClass = classes.find((item) =>
        /(toxic|obscene|insult|threat|identity|hate|severe)/i.test(item.label),
      );
      const top = classes[0];
      const score = toxicClass?.score ?? top.score;
      const flagged = score >= 0.65;
      const categories = classes
        .filter((item) => item.score >= 0.2)
        .map((item) => item.label.toLowerCase())
        .slice(0, 3);

      return {
        flagged,
        score: Number(score.toFixed(3)),
        categories: categories.length ? categories : [top.label.toLowerCase()],
        recommendation: flagged
          ? "Hold this resource for manual review."
          : "Safe to auto-approve with audit logging.",
        model: AI_MODELS.moderation.primary,
        usedFallback: false,
      };
    }
  } catch {
    // Fallback below.
  }

  const fallback = fallbackModeration(cleaned);
  return {
    ...fallback,
    model: "fallback:keyword-guardrail",
    usedFallback: true,
  };
}

function profileToText(profile: StudentProfile) {
  return [
    profile.university,
    profile.department,
    profile.level,
    profile.location,
    `skills: ${profile.skills.join(", ")}`,
    `interests: ${profile.interests.join(", ")}`,
    typeof profile.gpa === "number" ? `gpa: ${profile.gpa}` : "",
  ]
    .filter(Boolean)
    .join(". ");
}

function opportunityToText(opportunity: Opportunity) {
  return [
    opportunity.title,
    opportunity.type,
    opportunity.organization,
    opportunity.description,
    opportunity.location,
    opportunity.skills.join(", "),
    opportunity.requirements.join(", "),
    opportunity.tags.join(", "),
  ].join(". ");
}

export async function rankOpportunities(profile: StudentProfile, opportunities: Opportunity[]) {
  if (opportunities.length === 0) return [] as MatchResult[];

  try {
    const profileVector = await getEmbedding(profileToText(profile));
    const profileWords = [...profile.skills, ...profile.interests];

    const matches = await Promise.all(
      opportunities.map(async (opportunity) => {
        const oppVector = await getEmbedding(opportunityToText(opportunity));
        const semantic = Math.max(0, cosineSimilarity(profileVector, oppVector));
        const lexical = overlapRatio(profileWords, [...opportunity.skills, ...opportunity.tags]);
        const locationBoost =
          opportunity.isRemote ||
          (profile.location &&
            opportunity.location.toLowerCase().includes(profile.location.toLowerCase()))
            ? 0.1
            : 0;

        const blended = Math.min(1, semantic * 0.65 + lexical * 0.25 + locationBoost);
        return {
          opportunity,
          score: Number(blended.toFixed(3)),
          reason:
            blended >= 0.7
              ? "Strong semantic fit based on skills, interests, and profile context."
              : "Moderate fit. Add more relevant skills for higher ranking.",
        };
      }),
    );

    return matches.sort((a, b) => b.score - a.score);
  } catch {
    return fallbackMatchOpportunities(profile, opportunities);
  }
}

export async function generateCheckinReply(message: string, mood?: string) {
  const cleaned = normalizeText(message);
  if (!cleaned) {
    return {
      urgent: false,
      response: "Tell me how you are feeling right now and I will help you structure your next step.",
      followUps: ["What has been hardest today?"],
      model: "empty-input",
      usedFallback: false,
    };
  }

  if (detectRisk(cleaned)) {
    const emergency = fallbackCheckinReply(cleaned, mood);
    return {
      ...emergency,
      model: "safety-escalation",
      usedFallback: true,
    };
  }

  const prompt = [
    "You are a supportive Nigerian university mental wellness assistant.",
    "Respond in 2 short paragraphs with practical, non-clinical support.",
    "Do not diagnose or prescribe medication.",
    `Student mood: ${mood ?? "unknown"}`,
    `Student message: ${cleaned}`,
  ].join("\n");

  try {
    const raw = await queryModel<unknown>(AI_MODELS.checkin.primary, {
      inputs: prompt,
      parameters: {
        max_new_tokens: 120,
        temperature: 0.5,
        return_full_text: false,
      },
      options: { wait_for_model: true, use_cache: true },
    });

    if (Array.isArray(raw) && raw.length > 0) {
      const first = raw[0] as Record<string, unknown>;
      const text = typeof first.generated_text === "string" ? first.generated_text : null;
      if (text) {
        return {
          urgent: false,
          response: text.trim(),
          followUps: [
            "Would you like a focused study plan for the next 60 minutes?",
            "Should I suggest a short breathing reset before you continue?",
          ],
          model: AI_MODELS.checkin.primary,
          usedFallback: false,
        };
      }
    }
  } catch {
    // Fallback below.
  }

  return {
    ...fallbackCheckinReply(cleaned, mood),
    model: "fallback:wellness-template",
    usedFallback: true,
  };
}
