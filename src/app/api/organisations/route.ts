import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

import { db } from "@/db";
import { organisations } from "@/db/schema";

export async function GET() {
  try {
    const result = await db
      .select()
      .from(organisations)
      .orderBy(desc(organisations.createdAt));

    return NextResponse.json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Failed to fetch organisations:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch organisations",
      },
      { status: 500 }
    );
  }
}