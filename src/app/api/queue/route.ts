import { NextResponse } from "next/server";
import { getQueue, adjustQueue, getProfile } from "@/lib/storage";

export async function GET() {
  try {
    const queue = await getQueue();
    return NextResponse.json(queue);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, value, pin } = body;

    const profile = await getProfile();
    if (pin !== profile.adminPin) {
      return NextResponse.json({ error: "PIN de acesso inválido." }, { status: 401 });
    }

    if (!["increment", "decrement", "reset", "set"].includes(action)) {
      return NextResponse.json({ error: "Ação inválida." }, { status: 400 });
    }

    const updated = await adjustQueue(action, value);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
