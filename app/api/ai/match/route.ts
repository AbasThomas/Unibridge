import { rankOpportunities } from "@/lib/ai/client";
import type { StudentProfile } from "@/lib/ai/fallbacks";
import { DEFAULT_OPPORTUNITIES } from "@/lib/mock-data";
import type { Opportunity } from "@/lib/types";
import { NextResponse } from "next/server";

interface MatchPayload {
  profile?: Partial<StudentProfile>;
  opportunities?: Opportunity[];
}

const EMPTY_PROFILE: StudentProfile = {
  skills: [],
  interests: [],
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MatchPayload;
    const profile: StudentProfile = {
      ...EMPTY_PROFILE,
      ...body.profile,
      skills: body.profile?.skills ?? [],
      interests: body.profile?.interests ?? [],
    };

    const opportunities = body.opportunities?.length ? body.opportunities : DEFAULT_OPPORTUNITIES;
    const ranked = await rankOpportunities(profile, opportunities);

    return NextResponse.json({
      profile,
      total: ranked.length,
      matches: ranked.slice(0, 5),
    });
  } catch {
    return NextResponse.json({ error: "Unable to rank opportunities right now." }, { status: 500 });
  }
}
