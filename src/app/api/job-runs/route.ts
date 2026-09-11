import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

import { db } from "@/db";
import { jobRuns } from "@/db/schema";

export async function GET() {
  try {
    const result = await db
      .select()
      .from(jobRuns)
      .orderBy(desc(jobRuns.startedAt));

    return NextResponse.json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Failed to fetch job runs:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch job runs",
      },
      { status: 500 }
    );
  }
}
