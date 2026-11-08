import { describe, it, expect, beforeEach } from "vitest";
import { GET as getQueueRoute, POST as postQueueRoute } from "@/app/api/queue/route";
import { GET as getProfileRoute, PUT as putProfileRoute } from "@/app/api/profile/route";
import { GET as getCalendarRoute } from "@/app/api/calendar/route";
import { POST as postAppointmentRoute } from "@/app/api/appointments/route";
import { POST as postBlockedDayRoute } from "@/app/api/admin/blocked-days/route";
import { unblockDay } from "@/lib/storage";

describe("Integração de APIs REST do App", () => {
  beforeEach(async () => {
    // Limpa bloqueios de teste
    await unblockDay("2026-11-20");
  });

  it("deve responder status da fila via GET /api/queue", async () => {
    const res = await getQueueRoute();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(typeof data.count).toBe("number");
  });

  it("deve impedir ajuste da fila sem PIN correto", async () => {
    const req = new Request("http://localhost/api/queue", {
      method: "POST",
      body: JSON.stringify({ action: "increment", pin: "0000" }),
    });
    const res = await postQueueRoute(req);
    expect(res.status).toBe(401);
  });

  it("deve permitir ajuste da fila com PIN correto", async () => {
    const req = new Request("http://localhost/api/queue", {
      method: "POST",
      body: JSON.stringify({ action: "set", value: 4, pin: "1234" }),
    });
    const res = await postQueueRoute(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.count).toBe(4);
  });

  it("deve criar agendamento e retornar aviso de regras da barbearia", async () => {
    const req = new Request("http://localhost/api/appointments", {
      method: "POST",
      body: JSON.stringify({
        clientName: "Marcelo Teste",
        date: "2026-11-18",
        timeSlot: "11:00",
      }),
    });
    const res = await postAppointmentRoute(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.rulesNotice).toContain("ordem de chegada");
  });

  it("deve bloquear dia e cancelar agendamentos via POST /api/admin/blocked-days", async () => {
    const req = new Request("http://localhost/api/admin/blocked-days", {
      method: "POST",
      body: JSON.stringify({
        date: "2026-11-20",
        reason: "Manutenção no espaço",
        pin: "1234",
      }),
    });
    const res = await postBlockedDayRoute(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.blockedDays.some((b: any) => b.date === "2026-11-20")).toBe(true);
  });
});
