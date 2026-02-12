import { NextRequest, NextResponse } from "next/server";
import { saveConfig } from "@/lib/configStore";

export async function POST(request: NextRequest) {
  const { yaml, updatedBy } = (await request.json()) as { yaml?: string; updatedBy?: string };

  if (typeof yaml !== "string") {
    return NextResponse.json({ ok: false, errors: [{ line: 1, message: "yaml is required." }] }, { status: 400 });
  }

  const result = await saveConfig(yaml, updatedBy ?? "admin");

  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result);
}
