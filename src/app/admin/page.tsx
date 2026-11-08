"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  Minus,
  RotateCcw,
  Calendar,
  Clock,
  Palette,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  Trash2,
  Save,
  Check,
  Settings,
  X,
} from "lucide-react";
import { BarberProfile, LiveQueue, Appointment, BlockedDay, BusinessSchedule } from "@/types";
import ThemeInjector from "@/components/ThemeInjector";

export default function AdminPage() {
  // Autenticação por PIN
  const [pin, setPin] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");

  // Dados do Admin
  const [profile, setProfile] = useState<BarberProfile | null>(null);
  const [queue, setQueue] = useState<LiveQueue>({ count: 0, updatedAt: "" });
  const [schedule, setSchedule] = useState<BusinessSchedule | null>(null);
  const [blockedDays, setBlockedDays] = useState<BlockedDay[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Filtro de Data da Agenda
  const [agendaDate, setAgendaDate] = useState<string>("");

  // Formulário de Bloqueio de Dia
  const [blockDate, setBlockDate] = useState<string>("");
  const [blockReason, setBlockReason] = useState<string>("");

  // Feedbacks visuais
  const [saveSuccess, setSaveSuccess] = useState<string>("");

  // Inicializa data atual
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayStr = `${year}-${month}-${day}`;
    setAgendaDate(todayStr);
    setBlockDate(todayStr);

    // Verifica se já há PIN salvo na sessão
    const savedPin = sessionStorage.getItem("barber_admin_pin");
    if (savedPin) {
      setPin(savedPin);
      validatePin(savedPin);
    }
  }, []);

  const validatePin = async (pinToTest: string) => {
    setAuthError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinToTest }),
      });
      const data = await res.json();
      if (res.ok && data.authenticated) {
        setIsAuthenticated(true);
        sessionStorage.setItem("barber_admin_pin", pinToTest);
        loadAllAdminData(pinToTest);
      } else {
        setAuthError("PIN incorreto. Tente novamente.");
      }
    } catch {
      setAuthError("Erro de comunicação.");
    }
  };

  const loadAllAdminData = async (activePin: string) => {
    // Carrega Perfil
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => setProfile(d));

    // Carrega Fila
    fetch("/api/queue")
      .then((r) => r.json())
      .then((d) => setQueue(d));

    // Carrega Horários
    fetch("/api/admin/schedule")
      .then((r) => r.json())
      .then((d) => setSchedule(d));

    // Carrega Dias Bloqueados
    fetch(`/api/admin/blocked-days?pin=${activePin}`)
      .then((r) => r.json())
      .then((d) => setBlockedDays(Array.isArray(d) ? d : []));

    // Carrega Agendamentos
    loadAppointments(activePin, agendaDate);
  };

  const loadAppointments = (activePin: string, date?: string) => {
    const query = date ? `?pin=${activePin}&date=${date}` : `?pin=${activePin}`;
    fetch(`/api/admin/appointments${query}`)
      .then((r) => r.json())
      .then((d) => setAppointments(Array.isArray(d) ? d : []));
  };

  useEffect(() => {
    if (isAuthenticated && pin && agendaDate) {
      loadAppointments(pin, agendaDate);
    }
  }, [agendaDate, isAuthenticated, pin]);

  // CONTROLE DA FILA (+, -, ZERAR, SET)
  const handleQueueAction = async (action: "increment" | "decrement" | "reset" | "set", value?: number) => {
    try {
      const res = await fetch("/api/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, value, pin }),
      });
      const data = await res.json();
      if (res.ok) {
        setQueue(data);
      }
    } catch (err) {
      console.error("Erro ao atualizar fila:", err);
    }
  };

  // BLOQUEAR DIA (NÃO FUNCIONAMENTO)
  const handleBlockDay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockDate) return;

    try {
      const res = await fetch("/api/admin/blocked-days", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: blockDate, reason: blockReason, pin }),
      });
      const data = await res.json();
      if (res.ok) {
        setBlockedDays(data.blockedDays);
        setBlockReason("");
        setSaveSuccess("Dia bloqueado e agendamentos cancelados!");
        loadAppointments(pin, agendaDate);
        setTimeout(() => setSaveSuccess(""), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // DESBLOQUEAR DIA
  const handleUnblockDay = async (date: string) => {
    try {
      const res = await fetch("/api/admin/blocked-days", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, pin }),
      });
      const data = await res.json();
      if (res.ok) {
        setBlockedDays(data.blockedDays);
        setSaveSuccess("Dia desbloqueado com sucesso!");
        setTimeout(() => setSaveSuccess(""), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // CANCELAR AGENDAMENTO ESPECÍFICO
  const handleDeleteAppointment = async (id: string) => {
    if (!confirm("Deseja realmente cancelar este agendamento?")) return;
    try {
      const res = await fetch("/api/admin/appointments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, pin }),
      });
      if (res.ok) {
        setAppointments((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // SALVAR HORÁRIOS DE ATENDIMENTO
  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedule) return;

    try {
      const res = await fetch("/api/admin/schedule", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...schedule, pin }),
      });
      if (res.ok) {
        setSaveSuccess("Horários de funcionamento atualizados!");
        setTimeout(() => setSaveSuccess(""), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // SALVAR PERFIL, BIO, REDES E CORES
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profile, pin }),
      });
      if (res.ok) {
        setSaveSuccess("Perfil, redes e cores atualizados!");
        setTimeout(() => setSaveSuccess(""), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // TELA 1: LOGIN POR PIN (SE NÃO AUTENTICADO)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-xs space-y-6">
          <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center mx-auto text-gold shadow-glow">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-white">Painel do Barbeiro</h1>
            <p className="text-xs text-neutral-400 mt-1">
              Digite o seu PIN de 4 dígitos para gerenciar a fila e agenda.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              validatePin(pin);
            }}
            className="space-y-4"
          >
            <input
              type="password"
              maxLength={6}
              autoFocus
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full text-center text-3xl tracking-widest py-3 px-4 rounded-2xl bg-neutral-900 border-2 border-neutral-700 text-gold focus:outline-none focus:border-gold"
            />

            {authError && <p className="text-xs text-rose-400 font-medium">{authError}</p>}

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gold hover:bg-yellow-400 text-black font-extrabold text-sm shadow-glow transition active:scale-95"
            >
              Acessar Painel
            </button>
          </form>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar para a página do cliente
          </Link>
        </div>
      </div>
    );
  }

  // TELA 2: PAINEL ADMINISTRATIVO COMPLETO DO BARBEIRO
  return (
    <>
      <ThemeInjector profile={profile || undefined} />

      {/* BARRA SUPERIOR DO ADMIN */}
      <div className="sticky top-0 z-40 bg-[#141414]/95 backdrop-blur-md border-b border-neutral-800 px-5 py-3.5 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300 hover:text-gold transition active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-gold" />
          Ver como Cliente
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-gold px-2.5 py-1 rounded-full bg-gold/10 border border-gold/30">
          Admin Barbeiro
        </span>
      </div>

      <div className="px-5 py-6 space-y-7">
        {saveSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 flex-shrink-0" />
            {saveSuccess}
          </div>
        )}

        {/* ==================================================== */}
        {/* 1. CONTROLE INSTANTÂNEO DA FILA AO VIVO (+, -, ZERAR) */}
        {/* ==================================================== */}
        <section className="rounded-3xl bg-gradient-to-br from-neutral-900 via-black to-neutral-900 border-2 border-gold/40 p-6 shadow-glow text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-gold">
            <Users className="w-5 h-5" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              Quantas pessoas na barbearia agora?
            </h2>
          </div>

          <p className="text-xs text-neutral-400">
            Cada clique atualiza em tempo real a tela de todos os clientes.
          </p>

          {/* Contador Gigante com Botões Ergonômicos */}
          <div className="flex items-center justify-center gap-4 py-2">
            <button
              onClick={() => handleQueueAction("decrement")}
              className="w-16 h-16 rounded-2xl bg-neutral-800 hover:bg-neutral-700 active:scale-90 text-white flex items-center justify-center shadow-lg border border-neutral-700 transition"
              title="Diminuir 1 pessoa"
            >
              <Minus className="w-8 h-8" />
            </button>

            <div className="w-24 h-20 rounded-2xl bg-neutral-950 border-2 border-gold flex items-center justify-center shadow-inner">
              <span className="text-4xl font-black text-gold tracking-tight">
                {queue.count}
              </span>
            </div>

            <button
              onClick={() => handleQueueAction("increment")}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold active:scale-90 text-black flex items-center justify-center shadow-glow border border-gold transition"
              title="Aumentar 1 pessoa"
            >
              <Plus className="w-8 h-8 stroke-[3]" />
            </button>
          </div>

          {/* Botão de Zerar */}
          <div>
            <button
              onClick={() => handleQueueAction("reset")}
              className="inline-flex items-center gap-1.5 py-2 px-5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 active:scale-95 text-neutral-300 hover:text-white text-xs font-semibold border border-neutral-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Zerar Fila
            </button>
          </div>
        </section>

        {/* ==================================================== */}
        {/* 2. PANORAMA GERAL DA AGENDA (VISÃO DO BARBEIRO)      */}
        {/* ==================================================== */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold" />
              Agenda do Dia
            </h3>
            <input
              type="date"
              value={agendaDate}
              onChange={(e) => setAgendaDate(e.target.value)}
              className="bg-neutral-900 border border-neutral-700 text-white rounded-xl py-1.5 px-3 text-xs focus:border-gold focus:outline-none"
            />
          </div>

          {appointments.length === 0 ? (
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-center text-xs text-neutral-400">
              Nenhum agendamento registrado para {agendaDate}.
            </div>
          ) : (
            <div className="space-y-2">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gold px-2 py-0.5 rounded bg-gold/10">
                        {apt.timeSlot}
                      </span>
                      <span className="text-sm font-bold text-white">
                        {apt.clientName}
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-500">
                      Marcado em {new Date(apt.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteAppointment(apt.id)}
                    className="p-2 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 transition"
                    title="Cancelar este agendamento"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ==================================================== */}
        {/* 3. MARCAR DIA COMO NÃO FUNCIONAMENTO (BLOQUEIOS)      */}
        {/* ==================================================== */}
        <section className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-5 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            Marcar Dia de Não Funcionamento
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed">
            Ao fechar um dia, <strong>todos os agendamentos daquela data são automaticamente cancelados</strong> e o aviso com a sua mensagem é exibido no calendário dos clientes para que remarquem.
          </p>

          <form onSubmit={handleBlockDay} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-300">Data do Fechamento</label>
              <input
                type="date"
                required
                value={blockDate}
                onChange={(e) => setBlockDate(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl py-2.5 px-3 text-xs focus:border-gold focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-neutral-300">
                Motivo / Recado aos Clientes (opcional)
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Folga de feriado, retornamos na terça-feira!"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-3 text-xs focus:border-gold focus:outline-none placeholder-neutral-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow transition active:scale-95"
            >
              Fechar Este Dia & Cancelar Agendamentos
            </button>
          </form>

          {/* Lista de Dias Já Bloqueados */}
          {blockedDays.length > 0 && (
            <div className="pt-3 border-t border-neutral-800 space-y-2">
              <span className="text-xs font-semibold text-neutral-400">Dias Fechados:</span>
              {blockedDays.map((b) => (
                <div
                  key={b.date}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-950 text-xs border border-neutral-800"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-amber-400">{b.date}</span>
                    {b.reason && <p className="text-[11px] text-neutral-400">{b.reason}</p>}
                  </div>
                  <button
                    onClick={() => handleUnblockDay(b.date)}
                    className="p-1.5 text-neutral-400 hover:text-white rounded"
                    title="Desbloquear este dia"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ==================================================== */}
        {/* 4. CONFIGURAÇÃO DE HORÁRIOS DE ATENDIMENTO          */}
        {/* ==================================================== */}
        {schedule && (
          <section className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-5 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Clock className="w-4 h-4 text-gold" />
              Horário de Atendimento
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-neutral-400">Abertura (hora)</label>
                  <input
                    type="number"
                    min={0}
                    max={23}
                    value={schedule.openHour}
                    onChange={(e) =>
                      setSchedule({ ...schedule, openHour: parseInt(e.target.value, 10) })
                    }
                    className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl py-2 px-3 text-xs focus:border-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-neutral-400">Fechamento (hora)</label>
                  <input
                    type="number"
                    min={0}
                    max={23}
                    value={schedule.closeHour}
                    onChange={(e) =>
                      setSchedule({ ...schedule, closeHour: parseInt(e.target.value, 10) })
                    }
                    className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl py-2 px-3 text-xs focus:border-gold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                Salvar Horários
              </button>
            </form>
          </section>
        )}

        {/* ==================================================== */}
        {/* 5. PERSONALIZAÇÃO DE PERFIL, BIO, REDES E CORES      */}
        {/* ==================================================== */}
        {profile && (
          <section className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-5 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Palette className="w-4 h-4 text-gold" />
              Personalização de Perfil & Cores
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] text-neutral-400">Nome da Barbearia</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl py-2 px-3 text-xs focus:border-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-neutral-400">Bio Aberta</label>
                <textarea
                  rows={2}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-3 text-xs focus:border-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-neutral-400">URL da Foto de Perfil (Redonda)</label>
                <input
                  type="url"
                  value={profile.avatarUrl}
                  onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl py-2 px-3 text-xs focus:border-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-neutral-400">URL do Banner</label>
                <input
                  type="url"
                  value={profile.bannerUrl}
                  onChange={(e) => setProfile({ ...profile, bannerUrl: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl py-2 px-3 text-xs focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-neutral-400">WhatsApp (apenas números)</label>
                  <input
                    type="text"
                    value={profile.whatsappNumber}
                    onChange={(e) => setProfile({ ...profile, whatsappNumber: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl py-2 px-3 text-xs focus:border-gold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-neutral-400">Instagram URL</label>
                  <input
                    type="url"
                    value={profile.instagramUrl}
                    onChange={(e) => setProfile({ ...profile, instagramUrl: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl py-2 px-3 text-xs focus:border-gold"
                  />
                </div>
              </div>

              {/* SELETORES DE CORES (PRINCIPAL E SECUNDÁRIA) */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-[11px] text-neutral-400">Cor Principal (Fundo)</label>
                  <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-700 rounded-xl p-1.5">
                    <input
                      type="color"
                      value={profile.primaryColor}
                      onChange={(e) => setProfile({ ...profile, primaryColor: e.target.value })}
                      className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-xs text-neutral-300 uppercase font-mono">
                      {profile.primaryColor}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-neutral-400">Cor Secundária (Destaque)</label>
                  <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-700 rounded-xl p-1.5">
                    <input
                      type="color"
                      value={profile.secondaryColor}
                      onChange={(e) => setProfile({ ...profile, secondaryColor: e.target.value })}
                      className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-xs text-neutral-300 uppercase font-mono">
                      {profile.secondaryColor}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gold hover:bg-yellow-400 text-black font-extrabold text-xs shadow-glow transition active:scale-95 flex items-center justify-center gap-1.5 mt-2"
              >
                <Save className="w-4 h-4" />
                Salvar Perfil e Cores
              </button>
            </form>
          </section>
        )}
      </div>
    </>
  );
}
