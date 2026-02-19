import { moderateText } from "@/lib/ai/client";
import { NextResponse } from "next/server";

interface ModeratePayload {
  text?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ModeratePayload;
    const text = body.text?.trim() ?? "";

    if (!text) {
      return NextResponse.json({ error: "Text is required." }, { status: 400 });
    }

    const moderation = await moderateText(text);
    return NextResponse.json(moderation);
  } catch {
    return NextResponse.json({ error: "Unable to moderate text right now." }, { status: 500 });
  }
}
