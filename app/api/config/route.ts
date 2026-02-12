import { NextResponse } from "next/server";
import { getConfig } from "@/lib/configStore";

export async function GET() {
  const config = await getConfig();
  return NextResponse.json(config);
}
