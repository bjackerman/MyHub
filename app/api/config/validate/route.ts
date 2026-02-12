import { NextRequest, NextResponse } from "next/server";
import { validateLayoutYaml } from "@/lib/configStore";

export async function POST(request: NextRequest) {
  const { yaml } = (await request.json()) as { yaml?: string };

  if (typeof yaml !== "string") {
    return NextResponse.json({ valid: false, errors: [{ line: 1, message: "yaml is required." }] }, { status: 400 });
  }

  const errors = validateLayoutYaml(yaml);
  return NextResponse.json({ valid: errors.length === 0, errors });
}
