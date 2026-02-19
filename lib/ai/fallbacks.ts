import type { Opportunity } from "@/lib/types";
import type { SupportedLanguage } from "./models";

export interface StudentProfile {
  university?: string;
  department?: string;
  level?: string;
  gpa?: number;
  location?: string;
  skills: string[];
  interests: string[];
}

export interface MatchResult {
  opportunity: Opportunity;
  score: number;
  reason: string;
}

const TOXIC_KEYWORDS = [
  "idiot",
  "stupid",
  "kill",
  "hate",
  "useless",
  "trash",
  "nonsense",
  "fool",
  "bastard",
];

const RISK_KEYWORDS = ["suicide", "self-harm", "harm myself", "end my life", "die"];

export function fallbackSummarize(text: string): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return "No content provided.";

  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length <= 3) return sentences.join(" ");

  const first = sentences[0];
  const middle = sentences[Math.floor(sentences.length / 2)];
  const last = sentences[sentences.length - 1];
  return [first, middle, last].join(" ");
}

export function fallbackModeration(text: string) {
  const lowered = text.toLowerCase();
  const hits = TOXIC_KEYWORDS.filter((word) => lowered.includes(word));
  const rawScore = Math.min(1, hits.length * 0.2 + (hits.length > 0 ? 0.25 : 0.05));

  return {
    flagged: rawScore >= 0.65,
    score: Number(rawScore.toFixed(2)),
    categories: hits.length ? hits : ["clean"],
    recommendation:
      rawScore >= 0.65
        ? "Send to admin review before publishing."
        : "Looks safe for public listing.",
  };
}

export function fallbackTranslate(text: string, targetLanguage: SupportedLanguage): string {
  if (targetLanguage === "en") return text;
  if (targetLanguage === "yo") {
    return `Akopọ (Yoruba fallback): ${text}`;
  }
  return `Pidgin fallback: ${text}`;
}

function overlapScore(a: string[], b: string[]) {
  if (a.length === 0 || b.length === 0) return 0;
  const aSet = new Set(a.map((x) => x.toLowerCase()));
  const common = b.filter((x) => aSet.has(x.toLowerCase()));
  return common.length / Math.max(a.length, b.length);
}

export function fallbackMatchOpportunities(
  profile: StudentProfile,
  opportunities: Opportunity[],
): MatchResult[] {
  const profileTags = [...profile.skills, ...profile.interests].map((x) => x.toLowerCase());

  return opportunities
    .map((opportunity) => {
      const oppTags = [...opportunity.skills, ...opportunity.tags, ...opportunity.requirements].map((x) =>
        x.toLowerCase(),
      );
      const skillOverlap = overlapScore(profileTags, oppTags);
      const locationBoost =
        opportunity.isRemote ||
        (profile.location && opportunity.location.toLowerCase().includes(profile.location.toLowerCase()))
          ? 0.1
          : 0;
      const score = Math.min(1, skillOverlap * 0.85 + locationBoost);

      return {
        opportunity,
        score: Number(score.toFixed(3)),
        reason:
          score > 0.65
            ? "Strong match on skills and profile context."
            : "Moderate match. Improve profile skills for better fit.",
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function detectRisk(text: string): boolean {
  const lowered = text.toLowerCase();
  return RISK_KEYWORDS.some((word) => lowered.includes(word));
}

export function fallbackCheckinReply(message: string, mood?: string) {
  const normalizedMood = mood ?? "neutral";
  if (detectRisk(message)) {
    return {
      urgent: true,
      response:
        "I am really glad you reached out. Please contact immediate support now: Lagos Suicide Hotlines +234 806 210 6493 / +234 809 111 6262, or emergency services near you.",
      followUps: [
        "Can you contact a trusted friend or family member right now?",
        "Would you like me to help you with quick grounding steps while you call?",
      ],
    };
  }

  return {
    urgent: false,
    response: `Thanks for checking in. I hear that you feel ${normalizedMood}. Start with one small step today: review one topic for 20 minutes, then take a 5-minute reset.`,
    followUps: [
      "What is the one course task causing the most stress today?",
      "Do you want a short study plan for tonight?",
    ],
  };
}
