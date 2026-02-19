import { hasHfAccess } from "@/lib/ai/client";
import { AI_MODELS } from "@/lib/ai/models";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    configured: hasHfAccess(),
    modelSet: AI_MODELS,
    timestamp: new Date().toISOString(),
  });
}
