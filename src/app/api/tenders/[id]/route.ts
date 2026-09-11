import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { tenders } from "@/db/schema";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tenderId = Number(id);

    if (!Number.isInteger(tenderId) || tenderId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid tender ID",
        },
        { status: 400 }
      );
    }

    const result = await db
      .select()
      .from(tenders)
      .where(eq(tenders.id, tenderId))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Tender not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error("Failed to fetch tender:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch tender",
      },
      { status: 500 }
    );
  }
}