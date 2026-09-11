
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { organisations } from "@/db/schema";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const organisationId = Number(id);

    if (!Number.isInteger(organisationId) || organisationId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid organisation ID",
        },
        { status: 400 }
      );
    }

    const result = await db
      .select({
        id: organisations.id,
        name: organisations.name,
        tenderCount: organisations.tenderCount,
        lastScrapedAt: organisations.lastScrapedAt,
      })
      .from(organisations)
      .where(eq(organisations.id, organisationId))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Organisation not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error("Organisation API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load organisation",
      },
      { status: 500 }
    );
  }
}

