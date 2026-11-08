import { describe, it, expect, beforeEach } from "vitest";
import { getDayStatus, updateSchedule, getSchedule, unblockDay } from "@/lib/storage";

describe("Horários de Atendimento Dia a Dia (Segunda a Domingo) & Almoço Opcional", () => {
  beforeEach(async () => {
    // Garante que o dia de teste não esteja com bloqueio temporário
    await unblockDay("2026-11-09"); // Segunda-feira
    await unblockDay("2026-11-15"); // Domingo
  });

  it("deve excluir slots que caiam no intervalo de almoço quando configurado", async () => {
    // Configura Segunda-feira (dayOfWeek: 1): das 09:00 às 14:00, com almoço das 12:00 às 13:00
    const currentSchedule = await getSchedule();
    const updatedDays = currentSchedule.days.map((d) =>
      d.dayOfWeek === 1
        ? {
            ...d,
            isOpen: true,
            openTime: "09:00",
            closeTime: "14:00",
            lunchStart: "12:00",
            lunchEnd: "13:00",
          }
        : d
    );
    await updateSchedule({ days: updatedDays });

    // 2026-11-09 é Segunda-feira
    const status = await getDayStatus("2026-11-09");
    expect(status.isOpenDay).toBe(true);

    const slotLabels = status.slots.map((s) => s.timeSlot);
    // Deve conter 09:00, 10:00, 11:00, 13:00
    expect(slotLabels).toContain("09:00");
    expect(slotLabels).toContain("10:00");
    expect(slotLabels).toContain("11:00");
    expect(slotLabels).toContain("13:00");
    // O horário do almoço (12:00) NÃO deve estar presente!
    expect(slotLabels).not.toContain("12:00");
  });

  it("deve disponibilizar todos os slots contínuos quando o horário de almoço estiver vazio", async () => {
    // Configura Segunda-feira sem almoço (vazio)
    const currentSchedule = await getSchedule();
    const updatedDays = currentSchedule.days.map((d) =>
      d.dayOfWeek === 1
        ? {
            ...d,
            isOpen: true,
            openTime: "09:00",
            closeTime: "13:00",
            lunchStart: "",
            lunchEnd: "",
          }
        : d
    );
    await updateSchedule({ days: updatedDays });

    const status = await getDayStatus("2026-11-09");
    const slotLabels = status.slots.map((s) => s.timeSlot);
    // Sem intervalo de almoço: 09:00, 10:00, 11:00, 12:00
    expect(slotLabels).toEqual(["09:00", "10:00", "11:00", "12:00"]);
  });

  it("deve retornar isOpenDay = false e 0 slots para dias configurados como fechados", async () => {
    // 2026-11-15 é Domingo (dayOfWeek: 0), fechado por padrão
    const status = await getDayStatus("2026-11-15");
    expect(status.isOpenDay).toBe(false);
    expect(status.slots.length).toBe(0);
  });
});
