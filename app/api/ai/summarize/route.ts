import { summarizeText, translateText } from "@/lib/ai/client";
import type { SupportedLanguage } from "@/lib/ai/models";
import { NextResponse } from "next/server";

interface SummarizePayload {
  text?: string;
  language?: SupportedLanguage;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SummarizePayload;
    const text = body.text?.trim() ?? "";
    const language = body.language ?? "en";

    if (!text) {
      return NextResponse.json({ error: "Text is required." }, { status: 400 });
    }

    const summaryResult = await summarizeText(text);
    const translated =
      language === "en"
        ? { translation: summaryResult.summary, model: "identity", usedFallback: false }
        : await translateText(summaryResult.summary, language);

    return NextResponse.json({
      summary: translated.translation,
      sourceSummary: summaryResult.summary,
      language,
      metadata: {
        summarizationModel: summaryResult.model,
        translationModel: translated.model,
        usedFallback: summaryResult.usedFallback || translated.usedFallback,
      },
    });
  } catch {
    return NextResponse.json({ error: "Unable to summarize content right now." }, { status: 500 });
  }
}
