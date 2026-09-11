import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Odisha Tender Monitor API is running",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
}