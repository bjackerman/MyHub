import { NextRequest, NextResponse } from "next/server";
import { rollbackConfig } from "@/lib/configStore";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ version: string }> }
) {
  const parsedParams = await params;
  const version = Number(parsedParams.version);

  if (Number.isNaN(version) || version < 1) {
    return NextResponse.json({ ok: false, message: "Invalid version." }, { status: 400 });
  }

  const result = await rollbackConfig(version);

  if (!result.ok) {
    return NextResponse.json(result, { status: 404 });
  }

  return NextResponse.json(result);
}
