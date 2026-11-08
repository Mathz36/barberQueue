import { describe, it, expect, beforeEach } from "vitest";
import {
  getLiveBarberStatus,
  updateSchedule,
  blockDay,
  unblockDay,
  getQueue,
} from "../src/lib/storage";

describe("Live Barber Status (Detecção de Fechamento e Almoço ao Vivo)", () => {
  beforeEach(async () => {
    // Configura agenda padrão: Segunda a Sábado aberto das 09:00 às 19:00 com almoço das 12:00 às 13:00.
    // Domingo fechado.
    await updateSchedule({
      days: [
        { dayOfWeek: 1, dayName: "Segunda-feira", isOpen: true, openTime: "09:00", closeTime: "19:00", lunchStart: "12:00", lunchEnd: "13:00" },
        { dayOfWeek: 2, dayName: "Terça-feira", isOpen: true, openTime: "09:00", closeTime: "19:00", lunchStart: "12:00", lunchEnd: "13:00" },
        { dayOfWeek: 3, dayName: "Quarta-feira", isOpen: true, openTime: "09:00", closeTime: "19:00", lunchStart: "12:00", lunchEnd: "13:00" },
        { dayOfWeek: 4, dayName: "Quinta-feira", isOpen: true, openTime: "09:00", closeTime: "19:00", lunchStart: "12:00", lunchEnd: "13:00" },
        { dayOfWeek: 5, dayName: "Sexta-feira", isOpen: true, openTime: "09:00", closeTime: "19:00", lunchStart: "12:00", lunchEnd: "13:00" },
        { dayOfWeek: 6, dayName: "Sábado", isOpen: true, openTime: "09:00", closeTime: "19:00", lunchStart: "12:00", lunchEnd: "13:00" },
        { dayOfWeek: 0, dayName: "Domingo", isOpen: false, openTime: "09:00", closeTime: "14:00" },
      ],
    });

    await unblockDay("2026-11-09");
    await unblockDay("2026-11-10");
  });

  it("deve acusar 'lunch' (fechada para almoço) durante o intervalo de almoço do barbeiro", async () => {
    // Segunda-feira (09/11/2026) às 12:30 no horário de Brasília (UTC-3 = 15:30 UTC)
    const lunchTime = new Date("2026-11-09T15:30:00Z");
    const status = await getLiveBarberStatus(lunchTime);

    expect(status.isOpenNow).toBe(false);
    expect(status.statusType).toBe("lunch");
    expect(status.statusTitle).toBe("Fechada para Almoço");
    expect(status.lunchReturnTime).toBe("13:00");
  });

  it("deve acusar 'open' quando estiver dentro do horário de funcionamento e fora do almoço", async () => {
    // Segunda-feira (09/11/2026) às 10:15 no horário de Brasília (UTC-3 = 13:15 UTC)
    const openTime = new Date("2026-11-09T13:15:00Z");
    const status = await getLiveBarberStatus(openTime);

    expect(status.isOpenNow).toBe(true);
    expect(status.statusType).toBe("open");
    expect(status.statusTitle).toBe("Ao Vivo na Barbearia");
  });

  it("deve acusar 'closed' antes do horário de abertura", async () => {
    // Segunda-feira (09/11/2026) às 07:45 no horário de Brasília (UTC-3 = 10:45 UTC)
    const earlyMorning = new Date("2026-11-09T10:45:00Z");
    const status = await getLiveBarberStatus(earlyMorning);

    expect(status.isOpenNow).toBe(false);
    expect(status.statusType).toBe("closed");
    expect(status.statusMessage).toContain("09:00");
  });

  it("deve acusar 'closed' após o horário de encerramento", async () => {
    // Segunda-feira (09/11/2026) às 21:00 no horário de Brasília (UTC-3 = 00:00 UTC do dia seguinte)
    const lateNight = new Date("2026-11-10T00:00:00Z");
    const status = await getLiveBarberStatus(lateNight);

    expect(status.isOpenNow).toBe(false);
    expect(status.statusType).toBe("closed");
  });

  it("deve acusar 'day_off' em dias que a barbearia não abre (ex: Domingo)", async () => {
    // Domingo (08/11/2026) às 11:00 no horário de Brasília (UTC-3 = 14:00 UTC)
    const sunday = new Date("2026-11-08T14:00:00Z");
    const status = await getLiveBarberStatus(sunday);

    expect(status.isOpenNow).toBe(false);
    expect(status.statusType).toBe("day_off");
    expect(status.statusTitle).toBe("Fechada Hoje");
  });

  it("deve acusar 'blocked' quando o dia estiver marcado com folga ou feriado", async () => {
    await blockDay("2026-11-10", "Feriado Municipal");

    // Terça-feira bloqueada (10/11/2026) às 14:00 no horário de Brasília (UTC-3 = 17:00 UTC)
    const blockedTime = new Date("2026-11-10T17:00:00Z");
    const status = await getLiveBarberStatus(blockedTime);

    expect(status.isOpenNow).toBe(false);
    expect(status.statusType).toBe("blocked");
    expect(status.statusMessage).toBe("Feriado Municipal");
  });

  it("deve incluir o liveStatus no retorno de getQueue()", async () => {
    const queue = await getQueue();
    expect(queue).toHaveProperty("count");
    expect(queue).toHaveProperty("liveStatus");
    expect(queue.liveStatus).toHaveProperty("isOpenNow");
  });
});
