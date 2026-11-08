import { NextResponse } from "next/server";
import { getProfile } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const { pin } = await request.json();
    const profile = await getProfile();

    if (pin === profile.adminPin) {
      return NextResponse.json({ authenticated: true });
    }
    return NextResponse.json({ authenticated: false, error: "PIN incorreto." }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
