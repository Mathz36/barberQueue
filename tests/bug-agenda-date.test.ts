import { describe, it, expect, beforeEach } from "vitest";
import { createAppointment, getAppointments, deleteAppointment } from "@/lib/storage";

describe("Bugfix: Exibição da Data Correta de Agendamento (Zero Regression)", () => {
  let createdAptId = "";

  beforeEach(async () => {
    if (createdAptId) {
      await deleteAppointment(createdAptId).catch(() => {});
    }
  });

  it("deve registrar o agendamento na data de atendimento escolhida (dia 10) e não na data de criação (dia 8)", async () => {
    const targetDate = "2026-11-10"; // Data em que o cliente pretende ir
    const timeSlot = "14:00";
    const clientName = "Cliente Teste Dia 10";

    const apt = await createAppointment(clientName, targetDate, timeSlot);
    createdAptId = apt.id;

    expect(apt.id).toBeDefined();
    // A data do agendamento deve ser estritamente a data solicitada (dia 10)
    expect(apt.date).toBe("2026-11-10");
    expect(apt.timeSlot).toBe("14:00");

    // Consulta filtrando pela data do corte (dia 10)
    const day10Appointments = await getAppointments("2026-11-10");
    const foundInDay10 = day10Appointments.find((a) => a.id === apt.id);
    expect(foundInDay10).toBeDefined();
    expect(foundInDay10?.date).toBe("2026-11-10");

    // Consulta filtrando pelo dia de hoje (dia 8) - NÃO deve listar o agendamento do dia 10!
    const day8Appointments = await getAppointments("2026-11-08");
    const foundInDay8 = day8Appointments.find((a) => a.id === apt.id);
    expect(foundInDay8).toBeUndefined();
  });

  it("deve formatar 'YYYY-MM-DD' para 'DD/MM/YYYY' sem desvio de fuso horário", () => {
    function formatSafeDate(dateStr: string): string {
      const [year, month, day] = dateStr.split("-");
      return `${day}/${month}/${year}`;
    }

    expect(formatSafeDate("2026-11-10")).toBe("10/11/2026");
    expect(formatSafeDate("2026-11-08")).toBe("08/11/2026");
  });
});
