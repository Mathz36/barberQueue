import { NextResponse } from "next/server";
import { getDayStatus, getBlockedDays, getSchedule, getAppointments } from "@/lib/storage";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const month = searchParams.get("month"); // Formato YYYY-MM

    if (date) {
      const status = await getDayStatus(date);
      return NextResponse.json(status);
    }

    if (month) {
      const [yearStr, monthStr] = month.split("-");
      const year = parseInt(yearStr, 10);
      const m = parseInt(monthStr, 10);

      // Quantidade de dias no mês
      const daysInMonth = new Date(year, m, 0).getDate();
      const schedule = await getSchedule();
      const blockedDays = await getBlockedDays();
      const allMonthAppointments = await getAppointments();

      const days = [];
      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const dayOfWeek = new Date(year, m - 1, d).getDay();
        const blocked = blockedDays.find((b) => b.date === dateStr);
        const isOpenDay = schedule.activeDaysOfWeek.includes(dayOfWeek) && !blocked;
        const count = allMonthAppointments.filter((a) => a.date === dateStr).length;

        days.push({
          date: dateStr,
          day: d,
          dayOfWeek,
          isOpenDay,
          isBlocked: !!blocked,
          blockedReason: blocked?.reason,
          totalBooked: count,
        });
      }

      return NextResponse.json({ month, days });
    }

    return NextResponse.json({ error: "Informe date (YYYY-MM-DD) ou month (YYYY-MM)." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
