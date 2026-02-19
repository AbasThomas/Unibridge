"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Brain,
  CircleAlert,
  HeartPulse,
  Languages,
  Loader2,
  ShieldCheck,
  Sparkles,
  WifiOff,
} from "lucide-react";
import { toast } from "sonner";
import { DEFAULT_OPPORTUNITIES, MVP_STATS, PLAN_PRICING } from "@/lib/mock-data";
import { formatNaira } from "@/lib/utils";
import type { SupportedLanguage } from "@/lib/ai/models";

interface SummaryResponse {
  summary: string;
  sourceSummary: string;
  language: SupportedLanguage;
  metadata: {
    summarizationModel: string;
    translationModel: string;
    usedFallback: boolean;
  };
}

interface ModerateResponse {
  flagged: boolean;
  score: number;
  categories: string[];
  recommendation: string;
  model: string;
  usedFallback: boolean;
}

interface MatchResponse {
  total: number;
  matches: Array<{
    score: number;
    reason: string;
    opportunity: {
      id: string;
      title: string;
      type: string;
      organization: string;
      amount?: number;
      currency?: string;
      deadline: string;
      isRemote: boolean;
      location: string;
      applicationUrl: string;
    };
  }>;
}

interface CheckinResponse {
  urgent: boolean;
  response: string;
  followUps: string[];
  model: string;
  usedFallback: boolean;
}

interface TranslateResponse {
  translation: string;
  metadata: {
    model: string;
    usedFallback: boolean;
  };
}

interface StatusResponse {
  configured: boolean;
}

async function postJson<T>(url: string, body: object): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(data.error ?? "Request failed.");
  }
  return data;
}

export function UniBridgeDashboard() {
  const [hfConfigured, setHfConfigured] = useState<boolean | null>(null);

  const [summaryInput, setSummaryInput] = useState(
    "Data Structures lecture focused on stacks, queues, and tree traversal. The lecturer explained time complexity tradeoffs and gave practice questions for BFS and DFS. A quiz opens tomorrow by 8:00 AM and closes 11:59 PM.",
  );
  const [summaryLanguage, setSummaryLanguage] = useState<SupportedLanguage>("en");
  const [summaryResult, setSummaryResult] = useState<SummaryResponse | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [moderationInput, setModerationInput] = useState(
    "Comprehensive UNILAG GST notes with solved examples and references from 2025 sessions.",
  );
  const [moderationResult, setModerationResult] = useState<ModerateResponse | null>(null);
  const [moderationLoading, setModerationLoading] = useState(false);

  const [translationInput, setTranslationInput] = useState(
    "Mid-semester exams start next Monday. Download your revision pack now.",
  );
  const [translationLanguage, setTranslationLanguage] = useState<SupportedLanguage>("yo");
  const [translationResult, setTranslationResult] = useState<TranslateResponse | null>(null);
  const [translationLoading, setTranslationLoading] = useState(false);

  const [skills, setSkills] = useState("react, typescript, research writing");
  const [interests, setInterests] = useState("internship, scholarship, tutoring");
  const [location, setLocation] = useState("Lagos");
  const [gpa, setGpa] = useState("3.8");
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResponse | null>(null);

  const [checkinMood, setCheckinMood] = useState("stressed");
  const [checkinInput, setCheckinInput] = useState(
    "I have too many deadlines this week and I cannot focus on one course at a time.",
  );
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [checkinResult, setCheckinResult] = useState<CheckinResponse | null>(null);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const response = await fetch("/api/ai/status", { cache: "no-store" });
        const data = (await response.json()) as StatusResponse;
        setHfConfigured(data.configured);
      } catch {
        setHfConfigured(false);
      }
    };
    void loadStatus();
  }, []);

  const parseList = (value: string) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const onSummarize = async () => {
    try {
      setSummaryLoading(true);
      const result = await postJson<SummaryResponse>("/api/ai/summarize", {
        text: summaryInput,
        language: summaryLanguage,
      });
      setSummaryResult(result);
      toast.success("Lecture summary generated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to summarize.");
    } finally {
      setSummaryLoading(false);
    }
  };

  const onModerate = async () => {
    try {
      setModerationLoading(true);
      const result = await postJson<ModerateResponse>("/api/ai/moderate", {
        text: moderationInput,
      });
      setModerationResult(result);
      toast.success("Resource moderation complete.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to moderate.");
    } finally {
      setModerationLoading(false);
    }
  };

  const onTranslate = async () => {
    try {
      setTranslationLoading(true);
      const result = await postJson<TranslateResponse>("/api/ai/translate", {
        text: translationInput,
        language: translationLanguage,
      });
      setTranslationResult(result);
      toast.success("Translation complete.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to translate.");
    } finally {
      setTranslationLoading(false);
    }
  };

  const onMatch = async () => {
    try {
      setMatchLoading(true);
      const result = await postJson<MatchResponse>("/api/ai/match", {
        profile: {
          skills: parseList(skills),
          interests: parseList(interests),
          location,
          gpa: gpa ? Number(gpa) : undefined,
          university: "University of Lagos",
          department: "Computer Science",
          level: "300L",
        },
        opportunities: DEFAULT_OPPORTUNITIES,
      });
      setMatchResult(result);
      toast.success("Top opportunities ranked.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to match opportunities.");
    } finally {
      setMatchLoading(false);
    }
  };

  const onCheckin = async () => {
    try {
      setCheckinLoading(true);
      const result = await postJson<CheckinResponse>("/api/ai/checkin", {
        message: checkinInput,
        mood: checkinMood,
      });
      setCheckinResult(result);
      if (result.urgent) {
        toast.warning("Urgent support guidance returned.");
      } else {
        toast.success("Wellness check-in complete.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to run check-in.");
    } finally {
      setCheckinLoading(false);
    }
  };

  const statusLabel = useMemo(() => {
    if (hfConfigured === null) return "Checking AI access...";
    if (hfConfigured) return "Hugging Face models active";
    return "Running local fallback mode (set HUGGINGFACE_API_KEY for full AI)";
  }, [hfConfigured]);

  const statusClass = hfConfigured
    ? "bg-emerald-500/15 text-emerald-700 border-emerald-300"
    : "bg-amber-500/15 text-amber-700 border-amber-300";

  return (
    <div>
      <div className="mx-auto w-full max-w-7xl">
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 text-white shadow-2xl md:p-10 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0A8F6A]/10 to-transparent opacity-50 pointer-events-none"></div>
          <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#0A8F6A] font-semibold">UniBridge Systems Terminal</p>
              <h1 className="mt-2 text-3xl font-medium tracking-tighter md:text-5xl">Virtual Campus Intelligence</h1>
              <p className="mt-3 max-w-2xl text-sm text-neutral-400 font-light md:text-base">
                Autonomous summaries, resource deconstruction, and strategic opportunity matching in a unified academic interface.
              </p>
            </div>
            <div className={`rounded-full border px-4 py-2 text-[11px] font-medium uppercase tracking-widest ${statusClass}`}>
              {statusLabel}
            </div>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
            {MVP_STATS.map((stat) => (
              <div key={stat.label} className="glass-panel rounded-2xl p-6 hover:border-[#0A8F6A]/30 transition-all duration-300">
                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium">{stat.label}</p>
                <p className="mt-2 text-3xl font-semibold tracking-tighter text-white">{stat.value}</p>
                <div className="mt-3 h-0.5 w-8 bg-[#0A8F6A]/50"></div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="glass-panel rounded-2xl p-6 border-white/5 shadow-2xl">
            <div className="flex items-center gap-3 text-lg font-medium tracking-tight text-white mb-6">
              <Brain className="h-5 w-5 text-[#0A8F6A]" />
              AI Lecture Summarizer
            </div>
            <textarea
              value={summaryInput}
              onChange={(event) => setSummaryInput(event.target.value)}
              className="mt-3 h-32 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-neutral-300 focus:border-[#0A8F6A]/50 focus:outline-none transition-colors"
            />
            <div className="mt-6 flex flex-wrap gap-2">
              {(["en", "yo", "pcm"] as SupportedLanguage[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSummaryLanguage(lang)}
                  className={`rounded-lg border px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${summaryLanguage === lang ? "bg-[#0A8F6A] text-white shadow-[0_0_15px_rgba(10,143,106,0.4)]" : "bg-white/5 border-white/10 text-neutral-500 hover:text-white hover:border-white/20"
                    }`}
                >
                  {lang}
                </button>
              ))}
              <button
                onClick={onSummarize}
                disabled={summaryLoading}
                className="ml-auto inline-flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-[#0A8F6A] hover:border-[#0A8F6A] transition-all disabled:opacity-60"
              >
                {summaryLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate
              </button>
            </div>
            {summaryResult && (
              <div className="mt-6 rounded-xl bg-[#0A8F6A]/5 border border-[#0A8F6A]/20 p-4 text-xs font-light leading-relaxed text-neutral-300">
                <p>{summaryResult.summary}</p>
                <div className="mt-4 flex items-center gap-2 text-[10px] text-neutral-500 font-medium uppercase tracking-widest">
                  <div className="w-4 h-px bg-[#0A8F6A]"></div>
                  Logic Path: {summaryResult.metadata.summarizationModel}
                  {summaryResult.metadata.usedFallback ? " (REDUCED MODE)" : ""}
                </div>
              </div>
            )}
          </article>

          <article className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Resource Moderation
            </div>
            <textarea
              value={moderationInput}
              onChange={(event) => setModerationInput(event.target.value)}
              className="mt-3 h-32 w-full rounded-xl border px-3 py-2 text-sm"
            />
            <button
              onClick={onModerate}
              disabled={moderationLoading}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {moderationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BadgeCheck className="h-4 w-4" />}
              Run Moderation
            </button>
            {moderationResult && (
              <div
                className={`mt-4 rounded-xl border p-3 text-sm ${moderationResult.flagged
                  ? "border-red-300 bg-red-50 text-red-800"
                  : "border-emerald-300 bg-emerald-50 text-emerald-800"
                  }`}
              >
                <p className="font-medium">
                  Status: {moderationResult.flagged ? "Needs Manual Review" : "Auto-Approve Candidate"}
                </p>
                <p className="mt-1">Score: {(moderationResult.score * 100).toFixed(1)}%</p>
                <p className="mt-1">Labels: {moderationResult.categories.join(", ")}</p>
                <p className="mt-2 text-xs">{moderationResult.recommendation}</p>
              </div>
            )}
          </article>

          <article className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Languages className="h-5 w-5 text-primary" />
              Local Language Translation
            </div>
            <textarea
              value={translationInput}
              onChange={(event) => setTranslationInput(event.target.value)}
              className="mt-3 h-28 w-full rounded-xl border px-3 py-2 text-sm"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {(["yo", "pcm"] as SupportedLanguage[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setTranslationLanguage(lang)}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium uppercase ${translationLanguage === lang ? "bg-primary text-white" : "bg-white"
                    }`}
                >
                  {lang}
                </button>
              ))}
              <button
                onClick={onTranslate}
                disabled={translationLoading}
                className="ml-auto inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {translationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Languages className="h-4 w-4" />}
                Translate
              </button>
            </div>
            {translationResult && (
              <div className="mt-4 rounded-xl bg-muted p-3 text-sm">
                <p>{translationResult.translation}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Model: {translationResult.metadata.model}
                  {translationResult.metadata.usedFallback ? " (fallback used)" : ""}
                </p>
              </div>
            )}
          </article>

          <article className="glass-panel rounded-2xl p-6 border-white/5 shadow-2xl">
            <div className="flex items-center gap-3 text-lg font-medium tracking-tight text-white mb-6">
              <HeartPulse className="h-5 w-5 text-[#0A8F6A]" />
              Wellness Resonance
            </div>
            <textarea
              value={checkinInput}
              onChange={(event) => setCheckinInput(event.target.value)}
              className="mt-3 h-28 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-neutral-300 focus:border-[#0A8F6A]/50 focus:outline-none transition-colors"
            />
            <div className="mt-6 flex flex-wrap gap-2">
              {["happy", "sad", "anxious", "stressed", "neutral"].map((mood) => (
                <button
                  key={mood}
                  onClick={() => setCheckinMood(mood)}
                  className={`rounded-lg border px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${checkinMood === mood ? "bg-[#0A8F6A] text-white shadow-[0_0_15px_rgba(10,143,106,0.4)]" : "bg-white/5 border-white/10 text-neutral-500 hover:text-white hover:border-white/20"
                    }`}
                >
                  {mood}
                </button>
              ))}
            </div>
            <button
              onClick={onCheckin}
              disabled={checkinLoading}
              className="mt-6 inline-flex items-center gap-3 rounded-lg bg-white/5 border border-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-[#0A8F6A] hover:border-[#0A8F6A] transition-all disabled:opacity-60"
            >
              {checkinLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <HeartPulse className="h-4 w-4" />}
              Transmit Check-In
            </button>
            {checkinResult && (
              <div
                className={`mt-6 rounded-xl border p-4 text-xs font-light ${checkinResult.urgent ? "border-red-500/30 bg-red-500/5 text-red-200" : "border-blue-500/30 bg-blue-500/5 text-blue-200"
                  }`}
              >
                {checkinResult.urgent && (
                  <div className="mb-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">
                    <CircleAlert className="h-4 w-4 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                    Priority Protocol Triggered
                  </div>
                )}
                <p className="leading-relaxed">{checkinResult.response}</p>
                <ul className="mt-4 space-y-2 pt-4 border-t border-white/5">
                  {checkinResult.followUps.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0A8F6A]"></div>
                        {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="glass-panel rounded-2xl p-6 border-white/5 shadow-2xl">
            <div className="flex items-center gap-3 text-lg font-medium tracking-tight text-white mb-2">
              <Sparkles className="h-5 w-5 text-[#0A8F6A]" />
              Strategic Intel Matching
            </div>
            <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-[0.2em] mb-6">
              AI-driven arbitrage of scholarships & growth protocols.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={skills}
                onChange={(event) => setSkills(event.target.value)}
                className="rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-xs text-neutral-300 focus:border-[#0A8F6A]/50 focus:outline-none transition-colors"
                placeholder="SKILLS (CSV)"
              />
              <input
                value={interests}
                onChange={(event) => setInterests(event.target.value)}
                className="rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-xs text-neutral-300 focus:border-[#0A8F6A]/50 focus:outline-none transition-colors"
                placeholder="INTERESTS (CSV)"
              />
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-xs text-neutral-300 focus:border-[#0A8F6A]/50 focus:outline-none transition-colors"
                placeholder="LOCATION"
              />
              <input
                value={gpa}
                onChange={(event) => setGpa(event.target.value)}
                className="rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-xs text-neutral-300 focus:border-[#0A8F6A]/50 focus:outline-none transition-colors"
                placeholder="CGPA INDICATOR"
              />
            </div>
            <button
              onClick={onMatch}
              disabled={matchLoading}
              className="mt-6 inline-flex items-center gap-3 rounded-lg bg-white/5 border border-white/10 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white hover:bg-[#0A8F6A] hover:border-[#0A8F6A] transition-all disabled:opacity-60"
            >
              {matchLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Initialize Match Logic
            </button>
            <div className="mt-6 space-y-4">
              {(matchResult?.matches ?? []).map((item) => (
                <div key={item.opportunity.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 group hover:border-[#0A8F6A]/30 transition-all duration-300">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-neutral-200 group-hover:text-white transition-colors">{item.opportunity.title}</p>
                      <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider mt-1">
                        {item.opportunity.organization} • {item.opportunity.location}
                        {item.opportunity.isRemote ? " • Remote Access" : ""}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#0A8F6A]/10 border border-[#0A8F6A]/20 px-3 py-1 text-[10px] font-bold text-[#0A8F6A] shadow-[0_0_10px_rgba(10,143,106,0.1)]">
                      {(item.score * 100).toFixed(0)}% MATCH
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-neutral-400 font-light leading-relaxed">{item.reason}</p>
                  {item.opportunity.amount ? (
                    <div className="mt-4 flex items-center gap-3">
                      <div className="h-px w-4 bg-[#0A8F6A]"></div>
                      <p className="text-xs font-semibold text-white tracking-tight">{formatNaira(item.opportunity.amount)}</p>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </article>

          <article className="glass-panel rounded-2xl p-6 border-white/5 shadow-2xl">
            <div className="flex items-center gap-3 text-lg font-medium tracking-tight text-white mb-6">
              <BadgeCheck className="h-5 w-5 text-[#0A8F6A]" />
              Authorized Protocols
            </div>
            <div className="mt-3 space-y-4">
              {Object.entries(PLAN_PRICING).map(([plan, info]) => (
                <div key={plan} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:border-white/10 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white">{plan}</p>
                    <p className="text-[11px] text-[#0A8F6A] font-semibold">{info.price}</p>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {info.highlights.map((feature) => (
                      <li key={feature} className="text-[11px] text-neutral-500 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-white/20"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-xl border border-dashed border-white/10 bg-white/[0.01] p-5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-2">Edge Computing Protocol</p>
              <p className="text-[11px] text-neutral-600 font-light leading-relaxed">
                Localized PWA deployment and IndexedDB synchronization pending final version rollout.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-center gap-3 text-[10px] font-medium uppercase tracking-widest text-neutral-500 bg-white/5 py-3 rounded-lg border border-white/5">
              <WifiOff className="h-3.5 w-3.5" />
              Resilient Mode Active: Fallback logic operational
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
