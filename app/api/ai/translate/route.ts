import { translateText } from "@/lib/ai/client";
import type { SupportedLanguage } from "@/lib/ai/models";
import { NextResponse } from "next/server";

interface TranslatePayload {
  text?: string;
  language?: SupportedLanguage;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TranslatePayload;
    const text = body.text?.trim() ?? "";
    const language = body.language ?? "en";

    if (!text) {
      return NextResponse.json({ error: "Text is required." }, { status: 400 });
    }

    const translated = await translateText(text, language);
    return NextResponse.json({
      translation: translated.translation,
      language,
      metadata: {
        model: translated.model,
        usedFallback: translated.usedFallback,
      },
    });
  } catch {
    return NextResponse.json({ error: "Unable to translate text right now." }, { status: 500 });
  }
}
