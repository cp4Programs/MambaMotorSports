import { NextResponse } from "next/server";
import { ownerAuthStatus } from "@/server/auth";

export async function GET() {
  return NextResponse.json(ownerAuthStatus());
}
