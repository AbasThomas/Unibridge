import { generateCheckinReply } from "@/lib/ai/client";
import { NextResponse } from "next/server";

interface CheckinPayload {
  message?: string;
  mood?: "happy" | "sad" | "anxious" | "stressed" | "neutral";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckinPayload;
    const message = body.message?.trim() ?? "";
    const mood = body.mood ?? "neutral";

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const result = await generateCheckinReply(message, mood);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Unable to process check-in right now." }, { status: 500 });
  }
}
