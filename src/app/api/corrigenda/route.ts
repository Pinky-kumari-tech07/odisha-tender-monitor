import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { tenders } from "@/db/schema";

export async function GET() {
  try {
    const result = await db
      .select()
      .from(tenders)
      .where(eq(tenders.isCorrigendum, true))
      .orderBy(desc(tenders.createdAt));

    return NextResponse.json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Failed to fetch corrigenda:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch corrigenda",
      },
      { status: 500 }
    );
  }
}