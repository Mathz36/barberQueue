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
  Upload,
  Coffee,
  X,
  Image as ImageIcon,
  ChevronDown,
  AlertCircle,
  Share2,
} from "lucide-react";
import { BarberProfile, LiveQueue, Appointment, BlockedDay, BusinessSchedule, DayScheduleConfig } from "@/types";
import ThemeInjector from "@/components/ThemeInjector";

interface NotificationState {
  type: "success" | "error";
  message: string;
}

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
  const [agendaFilterMode, setAgendaFilterMode] = useState<"day" | "all">("day");

  // Helper para formatar data sem desvio de fuso horário
  const formatSafeDate = (dateStr: string) => {
    if (!dateStr || !dateStr.includes("-")) return dateStr;
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  // Formulário de Bloqueio de Dia
  const [blockDate, setBlockDate] = useState<string>("");
  const [blockReason, setBlockReason] = useState<string>("");

  // Estados de Upload
  const [uploadingAvatar, setUploadingAvatar] = useState<boolean>(false);
  const [uploadingBanner, setUploadingBanner] = useState<boolean>(false);

  // Estados dos Dropdowns / Acordeões
  const [isScheduleOpen, setIsScheduleOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  // Sistema de Notificações (Toast)
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  // Inicializa data atual
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayStr = `${year}-${month}-${day}`;
    setAgendaDate(todayStr);
    setBlockDate(todayStr);

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
      setAuthError("Erro de comunicação ao validar PIN.");
    }
  };

  const loadAllAdminData = async (activePin: string) => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => setProfile(d))
      .catch((err) => showNotification("error", `Erro ao carregar perfil: ${err.message}`));

    fetch("/api/queue")
      .then((r) => r.json())
      .then((d) => setQueue(d))
      .catch((err) => showNotification("error", `Erro ao carregar fila: ${err.message}`));

    fetch("/api/admin/schedule")
      .then((r) => r.json())
      .then((d) => setSchedule(d))
      .catch((err) => showNotification("error", `Erro ao carregar horários: ${err.message}`));

    fetch(`/api/admin/blocked-days?pin=${activePin}`)
      .then((r) => r.json())
      .then((d) => setBlockedDays(Array.isArray(d) ? d : []))
      .catch((err) => showNotification("error", `Erro ao carregar bloqueios: ${err.message}`));

    const targetDate = agendaDate || new Date().toISOString().split("T")[0];
    loadAppointments(activePin, agendaFilterMode === "day" ? targetDate : undefined);
  };

  const loadAppointments = (activePin: string, date?: string) => {
    const query = date ? `?pin=${activePin}&date=${date}` : `?pin=${activePin}`;
    fetch(`/api/admin/appointments${query}`)
      .then((r) => r.json())
      .then((d) => setAppointments(Array.isArray(d) ? d : []))
      .catch((err) => showNotification("error", `Erro ao carregar agenda: ${err.message}`));
  };

  useEffect(() => {
    if (isAuthenticated && pin) {
      if (agendaFilterMode === "day" && agendaDate) {
        loadAppointments(pin, agendaDate);
      } else if (agendaFilterMode === "all") {
        loadAppointments(pin);
      }
    }
  }, [agendaDate, agendaFilterMode, isAuthenticated, pin]);

  // CONTROLE DA FILA (+, -, ZERAR, SET)
  const handleQueueAction = async (action: "increment" | "decrement" | "reset" | "set", value?: number) => {
    // Feedback háptico tátil no celular se disponível
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate?.(25);
    }

    try {
      const res = await fetch("/api/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, value, pin }),
      });
      const data = await res.json();
      if (res.ok) {
        setQueue(data);
      } else {
        showNotification("error", `Erro: ${data.error || "Não foi possível atualizar a fila"}`);
      }
    } catch (err: any) {
      showNotification("error", `Erro: ${err.message || "Falha de conexão"}`);
    }
  };

  // UPLOAD DE IMAGEM COM SOBRESCRITA
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "banner") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "avatar") setUploadingAvatar(true);
    else setUploadingBanner(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    formData.append("pin", pin);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        if (type === "avatar") {
          setProfile((prev) => (prev ? { ...prev, avatarUrl: data.url } : prev));
        } else {
          setProfile((prev) => (prev ? { ...prev, bannerUrl: data.url } : prev));
        }
        showNotification("success", "Configuração Salva");
      } else {
        showNotification("error", `Erro: ${data.error || "Falha no envio da imagem"}`);
      }
    } catch (err: any) {
      showNotification("error", `Erro: ${err.message || "Falha de conexão no upload"}`);
    } finally {
      if (type === "avatar") setUploadingAvatar(false);
      else setUploadingBanner(false);
      e.target.value = "";
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
        showNotification("success", "Configuração Salva");
        loadAppointments(pin, agendaDate);
      } else {
        showNotification("error", `Erro: ${data.error || "Não foi possível bloquear o dia"}`);
      }
    } catch (err: any) {
      showNotification("error", `Erro: ${err.message || "Falha ao bloquear dia"}`);
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
        showNotification("success", "Configuração Salva");
      } else {
        showNotification("error", `Erro: ${data.error || "Não foi possível desbloquear o dia"}`);
      }
    } catch (err: any) {
      showNotification("error", `Erro: ${err.message || "Falha ao desbloquear"}`);
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
        showNotification("success", "Configuração Salva");
      } else {
        const data = await res.json();
        showNotification("error", `Erro: ${data.error || "Não foi possível cancelar o agendamento"}`);
      }
    } catch (err: any) {
      showNotification("error", `Erro: ${err.message || "Falha de comunicação"}`);
    }
  };

  // COMPARTILHAR AGENDA NO WHATSAPP
  const handleShareAgenda = () => {
    if (!appointments.length) {
      showNotification("error", "Erro: Não há agendamentos para compartilhar.");
      return;
    }
    const titleDate = agendaFilterMode === "day" ? formatSafeDate(agendaDate) : "Semana Atual";
    let text = `💈 *Agenda Barbearia - ${titleDate}*\n\n`;
    [...appointments]
      .sort((a, b) => a.date.localeCompare(b.date) || a.timeSlot.localeCompare(b.timeSlot))
      .forEach((apt) => {
        text += `✂️ ${formatSafeDate(apt.date)} às ${apt.timeSlot} - ${apt.clientName}\n`;
      });
    text += `\n_Total: ${appointments.length} pessoas agendadas_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  // ATUALIZAR CONFIGURAÇÃO DE UM DIA DA SEMANA
  const updateDaySchedule = (dayOfWeek: number, patch: Partial<DayScheduleConfig>) => {
    if (!schedule) return;
    const updatedDays = schedule.days.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, ...patch } : d));
    setSchedule({ ...schedule, days: updatedDays });
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
      const data = await res.json();
      if (res.ok) {
        showNotification("success", "Configuração Salva");
      } else {
        showNotification("error", `Erro: ${data.error || "Não foi possível salvar os horários"}`);
      }
    } catch (err: any) {
      showNotification("error", `Erro: ${err.message || "Falha ao salvar horários"}`);
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
      const data = await res.json();
      if (res.ok) {
        showNotification("success", "Configuração Salva");
      } else {
        showNotification("error", `Erro: ${data.error || "Não foi possível salvar o perfil"}`);
      }
    } catch (err: any) {
      showNotification("error", `Erro: ${err.message || "Falha ao salvar perfil"}`);
    }
  };

  // Ordena os dias para exibição de Segunda a Domingo (1, 2, 3, 4, 5, 6, 0)
  const getOrderedDays = (): DayScheduleConfig[] => {
    if (!schedule?.days) return [];
    const order = [1, 2, 3, 4, 5, 6, 0];
    return [...schedule.days].sort((a, b) => order.indexOf(a.dayOfWeek) - order.indexOf(b.dayOfWeek));
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
              className="w-full max-w-full box-border text-center text-3xl tracking-widest py-3 px-4 rounded-2xl bg-neutral-900 border-2 border-neutral-700 text-gold focus:outline-none focus:border-gold"
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
      <div className="sticky top-0 z-40 bg-[#141414]/95 backdrop-blur-md border-b border-neutral-800 px-4 sm:px-5 py-3.5 flex items-center justify-between">
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

      {/* NOTIFICAÇÃO PADRONIZADA (CONFIGURAÇÃO SALVA / ERRO) */}
      {notification && (
        <div className="sticky top-14 z-50 px-3.5 sm:px-5 pt-3 animate-in fade-in slide-in-from-top-2">
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between shadow-2xl text-xs font-bold ${
              notification.type === "success"
                ? "bg-emerald-950/95 border-emerald-500/70 text-emerald-200"
                : "bg-rose-950/95 border-rose-500/70 text-rose-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === "success" ? (
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="p-1 rounded hover:bg-black/30 transition text-neutral-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="px-3.5 sm:px-5 py-4 sm:py-5 space-y-5 sm:space-y-6 w-full max-w-full overflow-x-hidden">
        {/* ==================================================== */}
        {/* 1. CONTROLE INSTANTÂNEO DA FILA AO VIVO (+, -, ZERAR) */}
        {/* ==================================================== */}
        <section className="rounded-3xl bg-gradient-to-br from-neutral-900 via-black to-neutral-900 border-2 border-gold/40 p-5 sm:p-6 shadow-glow text-center space-y-4">
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
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold" />
                Agenda do Barbeiro
              </h3>
              {appointments.length > 0 && (
                <button
                  onClick={handleShareAgenda}
                  title="Compartilhar no WhatsApp"
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-400 active:scale-95 transition text-xs font-semibold"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Compartilhar
                </button>
              )}
            </div>

            {/* Abas de Filtro: Por Dia ou Toda a Semana */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-900 border border-neutral-800 self-start">
                <button
                  type="button"
                  onClick={() => setAgendaFilterMode("day")}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition ${
                    agendaFilterMode === "day"
                      ? "bg-gold text-black font-bold shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Por Dia
                </button>
                <button
                  type="button"
                  onClick={() => setAgendaFilterMode("all")}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition ${
                    agendaFilterMode === "all"
                      ? "bg-gold text-black font-bold shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Toda a Semana
                </button>
              </div>

              {agendaFilterMode === "day" && (
                <div className="w-full sm:w-auto">
                  <input
                    type="date"
                    value={agendaDate}
                    onChange={(e) => setAgendaDate(e.target.value)}
                    className="w-full sm:w-auto bg-neutral-900 border border-neutral-700 text-white rounded-xl py-2 px-3 text-xs focus:border-gold focus:outline-none max-w-full"
                  />
                </div>
              )}
            </div>
          </div>

          {appointments.length === 0 ? (
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-center text-xs text-neutral-400">
              {agendaFilterMode === "day"
                ? `Nenhum agendamento registrado para ${formatSafeDate(agendaDate)}.`
                : "Nenhum agendamento registrado para esta semana."}
            </div>
          ) : (
            <div className="space-y-2">
              {[...appointments]
                .sort((a, b) => a.date.localeCompare(b.date) || a.timeSlot.localeCompare(b.timeSlot))
                .map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between hover:border-gold/30 transition"
                  >
                    <div className="space-y-1.5">
                      <div className="text-sm font-bold text-white tracking-wide">
                        {apt.clientName}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold text-gold px-2.5 py-0.5 rounded-lg bg-gold/15 border border-gold/30">
                          📅 {formatSafeDate(apt.date)} às {apt.timeSlot}
                        </span>
                      </div>
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
        <section className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-4 sm:p-5 space-y-4">
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
                className="w-full max-w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl py-2.5 px-3 text-xs focus:border-gold focus:outline-none"
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
                className="w-full max-w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-3 text-xs focus:border-gold focus:outline-none placeholder-neutral-600 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow transition active:scale-95"
            >
              Fechar Este Dia & Cancelar Agendamentos
            </button>
          </form>

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
        {/* 4. SEÇÃO EXPANSÍVEL (DROPDOWN): HORÁRIOS DE ATENDIMENTO */}
        {/* ==================================================== */}
        {schedule && (
          <section className="rounded-2xl bg-neutral-900/90 border border-neutral-800 overflow-hidden transition-all shadow-md">
            {/* Header clicável do Dropdown */}
            <button
              type="button"
              onClick={() => setIsScheduleOpen(!isScheduleOpen)}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-neutral-800/40 transition active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Horário de Atendimento</h3>
                  <p className="text-[11px] text-neutral-400">
                    Segunda a Domingo com intervalo de almoço
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gold transition-transform duration-300 ${
                  isScheduleOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Conteúdo Expansível */}
            {isScheduleOpen && (
              <div className="p-3.5 sm:p-5 pt-1 border-t border-neutral-800 space-y-4 animate-in fade-in slide-in-from-top-2">
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Configure abertura, fechamento e o <strong>horário de almoço</strong> para cada dia. Deixe o almoço vazio caso não faça pausa.
                </p>

                <form onSubmit={handleSaveSchedule} className="space-y-4">
                  <div className="space-y-3">
                    {getOrderedDays().map((dayConfig) => (
                      <div
                        key={dayConfig.dayOfWeek}
                        className="p-3 sm:p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/90 space-y-3"
                      >
                        {/* Header do Dia com Toggle Aberto/Fechado */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white tracking-wide">
                            {dayConfig.dayName}
                          </span>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <span className={`text-[11px] font-semibold ${dayConfig.isOpen ? "text-emerald-400" : "text-neutral-500"}`}>
                              {dayConfig.isOpen ? "Aberto" : "Fechado"}
                            </span>
                            <input
                              type="checkbox"
                              checked={dayConfig.isOpen}
                              onChange={(e) =>
                                updateDaySchedule(dayConfig.dayOfWeek, { isOpen: e.target.checked })
                              }
                              className="w-4 h-4 accent-gold cursor-pointer"
                            />
                          </label>
                        </div>

                        {dayConfig.isOpen && (
                          <div className="space-y-2.5 pt-1 border-t border-neutral-900">
                            {/* Abertura e Fechamento */}
                            <div className="grid grid-cols-2 gap-2 sm:gap-2.5 min-w-0">
                              <div className="space-y-1 min-w-0">
                                <label className="text-[10px] text-neutral-400 uppercase font-semibold">
                                  Abertura
                                </label>
                                <input
                                  type="time"
                                  value={dayConfig.openTime}
                                  onChange={(e) =>
                                    updateDaySchedule(dayConfig.dayOfWeek, { openTime: e.target.value })
                                  }
                                  className="w-full max-w-full min-w-0 bg-neutral-900 border border-neutral-700 text-white rounded-lg p-2 text-xs focus:border-gold box-border"
                                />
                              </div>
                              <div className="space-y-1 min-w-0">
                                <label className="text-[10px] text-neutral-400 uppercase font-semibold">
                                  Fechamento
                                </label>
                                <input
                                  type="time"
                                  value={dayConfig.closeTime}
                                  onChange={(e) =>
                                    updateDaySchedule(dayConfig.dayOfWeek, { closeTime: e.target.value })
                                  }
                                  className="w-full max-w-full min-w-0 bg-neutral-900 border border-neutral-700 text-white rounded-lg p-2 text-xs focus:border-gold box-border"
                                />
                              </div>
                            </div>

                            {/* Intervalo de Almoço Opcional */}
                            <div className="rounded-lg bg-neutral-900/60 p-2.5 space-y-2 border border-neutral-800">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-300">
                                  <Coffee className="w-3.5 h-3.5 text-gold" />
                                  <span>Horário de Almoço (opcional)</span>
                                </div>
                                {(dayConfig.lunchStart || dayConfig.lunchEnd) && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateDaySchedule(dayConfig.dayOfWeek, { lunchStart: "", lunchEnd: "" })
                                    }
                                    className="text-[10px] text-neutral-400 hover:text-amber-400 underline"
                                  >
                                    Limpar (Sem almoço)
                                  </button>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-2 min-w-0">
                                <div className="space-y-0.5 min-w-0">
                                  <span className="text-[9px] text-neutral-500">Início do Almoço</span>
                                  <input
                                    type="time"
                                    value={dayConfig.lunchStart || ""}
                                    onChange={(e) =>
                                      updateDaySchedule(dayConfig.dayOfWeek, { lunchStart: e.target.value })
                                    }
                                    placeholder="--:--"
                                    className="w-full max-w-full min-w-0 bg-neutral-950 border border-neutral-700 text-white rounded p-1.5 text-xs focus:border-gold box-border"
                                  />
                                </div>
                                <div className="space-y-0.5 min-w-0">
                                  <span className="text-[9px] text-neutral-500">Fim do Almoço</span>
                                  <input
                                    type="time"
                                    value={dayConfig.lunchEnd || ""}
                                    onChange={(e) =>
                                      updateDaySchedule(dayConfig.dayOfWeek, { lunchEnd: e.target.value })
                                    }
                                    placeholder="--:--"
                                    className="w-full max-w-full min-w-0 bg-neutral-950 border border-neutral-700 text-white rounded p-1.5 text-xs focus:border-gold box-border"
                                  />
                                </div>
                              </div>
                              {!dayConfig.lunchStart && !dayConfig.lunchEnd && (
                                <p className="text-[10px] text-neutral-500 italic">
                                  Sem pausa: todos os horários entre abertura e fechamento estarão livres.
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gold hover:bg-yellow-400 text-black font-extrabold text-xs shadow-glow transition active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    Salvar Horários da Semana
                  </button>
                </form>
              </div>
            )}
          </section>
        )}

        {/* ==================================================== */}
        {/* 5. SEÇÃO EXPANSÍVEL (DROPDOWN): PERFIL, FOTOS E CORES */}
        {/* ==================================================== */}
        {profile && (
          <section className="rounded-2xl bg-neutral-900/90 border border-neutral-800 overflow-hidden transition-all shadow-md">
            {/* Header clicável do Dropdown */}
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-neutral-800/40 transition active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Personalização do Perfil</h3>
                  <p className="text-[11px] text-neutral-400">
                    Fotos, Bio, WhatsApp, Instagram e Cores
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gold transition-transform duration-300 ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Conteúdo Expansível */}
            {isProfileOpen && (
              <div className="p-3.5 sm:p-5 pt-1 border-t border-neutral-800 space-y-4 sm:space-y-5 animate-in fade-in slide-in-from-top-2">
                {/* SEÇÃO DE UPLOAD DIRETO DE IMAGENS (SOBRESCRITA) */}
                <div className="space-y-4 p-3.5 sm:p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                  <span className="text-xs font-bold text-gold flex items-center gap-1.5">
                    <Upload className="w-4 h-4" />
                    Upload Direto de Fotos
                  </span>

                  {/* Upload da Foto de Perfil Redonda */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-neutral-300">
                      Foto de Perfil Redonda
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gold shadow-glow flex-shrink-0 bg-neutral-900">
                        <img
                          src={profile.avatarUrl}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <label className="cursor-pointer inline-flex items-center gap-2 py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold border border-neutral-700 transition active:scale-95 max-w-full">
                          <Upload className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                          <span className="truncate">{uploadingAvatar ? "Enviando..." : "Escolher Foto de Perfil"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingAvatar}
                            onChange={(e) => handleFileUpload(e, "avatar")}
                            className="hidden"
                          />
                        </label>
                        <p className="text-[10px] text-neutral-500">
                          A nova foto substitui a anterior automaticamente.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Upload da Imagem de Banner */}
                  <div className="space-y-2 pt-2 border-t border-neutral-900">
                    <label className="text-[11px] font-semibold text-neutral-300">
                      Imagem do Banner de Fundo
                    </label>
                    <div className="space-y-2">
                      <div className="w-full h-20 rounded-xl overflow-hidden border border-neutral-700 bg-neutral-900">
                        <img
                          src={profile.bannerUrl}
                          alt="Banner"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <label className="cursor-pointer inline-flex items-center gap-2 py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold border border-neutral-700 transition active:scale-95 max-w-full">
                        <ImageIcon className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                        <span className="truncate">{uploadingBanner ? "Enviando..." : "Escolher Novo Banner"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingBanner}
                          onChange={(e) => handleFileUpload(e, "banner")}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[10px] text-neutral-500">
                        O novo banner substitui o anterior automaticamente.
                      </p>
                    </div>
                  </div>
                </div>

                {/* FORMULÁRIO DE DADOS GERAIS (NOME, BIO, REDES E CORES) */}
                <form onSubmit={handleSaveProfile} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-neutral-400">Nome da Barbearia</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full max-w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl py-2 px-3 text-xs focus:border-gold box-border"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-neutral-400">Bio Aberta</label>
                    <textarea
                      rows={2}
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="w-full max-w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl p-3 text-xs focus:border-gold box-border resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1 min-w-0">
                      <label className="text-[11px] text-neutral-400">WhatsApp (apenas números)</label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={profile.whatsappNumber}
                        onChange={(e) => setProfile({ ...profile, whatsappNumber: e.target.value })}
                        className="w-full max-w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl py-2 px-3 text-xs focus:border-gold box-border"
                      />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <label className="text-[11px] text-neutral-400">Instagram URL</label>
                      <input
                        type="url"
                        value={profile.instagramUrl}
                        onChange={(e) => setProfile({ ...profile, instagramUrl: e.target.value })}
                        className="w-full max-w-full bg-neutral-950 border border-neutral-700 text-white rounded-xl py-2 px-3 text-xs focus:border-gold box-border"
                      />
                    </div>
                  </div>

                  {/* SELETORES DE CORES */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1 min-w-0">
                      <label className="text-[11px] text-neutral-400">Cor Principal (Fundo)</label>
                      <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-700 rounded-xl p-1.5 min-w-0">
                        <input
                          type="color"
                          value={profile.primaryColor}
                          onChange={(e) => setProfile({ ...profile, primaryColor: e.target.value })}
                          className="w-7 h-7 rounded cursor-pointer bg-transparent border-0 flex-shrink-0"
                        />
                        <span className="text-xs text-neutral-300 uppercase font-mono truncate">
                          {profile.primaryColor}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <label className="text-[11px] text-neutral-400">Cor Secundária (Destaque)</label>
                      <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-700 rounded-xl p-1.5 min-w-0">
                        <input
                          type="color"
                          value={profile.secondaryColor}
                          onChange={(e) => setProfile({ ...profile, secondaryColor: e.target.value })}
                          className="w-7 h-7 rounded cursor-pointer bg-transparent border-0 flex-shrink-0"
                        />
                        <span className="text-xs text-neutral-300 uppercase font-mono truncate">
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
              </div>
            )}
          </section>
        )}
      </div>
    </>
  );
}
