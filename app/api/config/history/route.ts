import { NextResponse } from "next/server";
import { getHistory } from "@/lib/configStore";

export async function GET() {
  const history = await getHistory();
  return NextResponse.json({ history: history.slice().reverse() });
}
