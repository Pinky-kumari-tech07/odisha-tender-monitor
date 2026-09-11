import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

import { db } from "@/db";
import { tenders } from "@/db/schema";

export async function GET() {
  try {
    const result = await db
      .select()
      .from(tenders)
      .orderBy(desc(tenders.createdAt));

    return NextResponse.json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Failed to fetch tenders:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch tenders",
      },
      { status: 500 }
    );
  }
}