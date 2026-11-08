import { NextResponse } from "next/server";
import { getBlockedDays, blockDay, unblockDay, getProfile } from "@/lib/storage";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pin = searchParams.get("pin");
    const profile = await getProfile();
    if (pin !== profile.adminPin) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const blocked = await getBlockedDays();
    return NextResponse.json(blocked);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { date, reason, pin } = await request.json();
    const profile = await getProfile();
    if (pin !== profile.adminPin) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    if (!date) {
      return NextResponse.json({ error: "Data é obrigatória." }, { status: 400 });
    }

    const blocked = await blockDay(date, reason);
    return NextResponse.json({ success: true, blockedDays: blocked });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { date, pin } = await request.json();
    const profile = await getProfile();
    if (pin !== profile.adminPin) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const blocked = await unblockDay(date);
    return NextResponse.json({ success: true, blockedDays: blocked });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
