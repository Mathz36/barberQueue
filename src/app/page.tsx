"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Calendar as CalendarIcon,
  Clock,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { InstagramIcon } from "@/components/Icons";
import { BarberProfile, LiveQueue, DayStatus, TimeSlotStatus } from "@/types";
import ThemeInjector from "@/components/ThemeInjector";

export default function ClientPage() {
  const [profile, setProfile] = useState<BarberProfile | null>(null);
  const [queue, setQueue] = useState<LiveQueue>({ count: 0, updatedAt: "" });
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [dayStatus, setDayStatus] = useState<DayStatus | null>(null);
  const [loadingDay, setLoadingDay] = useState<boolean>(false);

  // Modal de Agendamento
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [clientName, setClientName] = useState<string>("");
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string>("");

  // Modal de Confirmação & Regras
  const [rulesModalOpen, setRulesModalOpen] = useState<boolean>(false);
  const [confirmedSlot, setConfirmedSlot] = useState<{ date: string; time: string } | null>(null);

  // Inicializa a data atual no formato YYYY-MM-DD
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayStr = `${year}-${month}-${day}`;
    setSelectedDate(todayStr);
  }, []);

  // Busca dados do perfil
  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error("Erro ao carregar perfil:", err));
  }, []);

  // Polling em tempo real da fila da barbearia (a cada 3.5 segundos)
  useEffect(() => {
    const fetchQueue = () => {
      fetch("/api/queue")
        .then((res) => res.json())
        .then((data) => {
          if (typeof data.count === "number") {
            setQueue(data);
          }
        })
        .catch(() => {});
    };

    fetchQueue();
    const interval = setInterval(fetchQueue, 3500);
    return () => clearInterval(interval);
  }, []);

  // Busca status e slots da data selecionada
  useEffect(() => {
    if (!selectedDate) return;
    setLoadingDay(true);
    fetch(`/api/calendar?date=${selectedDate}`)
      .then((res) => res.json())
      .then((data) => {
        setDayStatus(data);
        setLoadingDay(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar slots:", err);
        setLoadingDay(false);
      });
  }, [selectedDate]);

  // Gera lista dos próximos 14 dias para o carrossel/seletor mobile
  const getUpcomingDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const dateStr = String(d.getDate()).padStart(2, "0");
      const fullDate = `${year}-${month}-${dateStr}`;

      const weekDayName = i === 0 ? "Hoje" : i === 1 ? "Amanhã" : d.toLocaleDateString("pt-BR", { weekday: "short" });
      days.push({
        fullDate,
        dayNumber: d.getDate(),
        weekDayName,
      });
    }
    return days;
  };

  const handleDaySelect = (fullDate: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (fullDate === selectedDate) return;
    e.currentTarget.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
    setSelectedDate(fullDate);
  };

  const handleOpenBooking = (timeSlot: string) => {
    setSelectedSlot(timeSlot);
    const savedName = typeof window !== "undefined" ? localStorage.getItem("barbearia_client_name") || "" : "";
    setClientName(savedName);
    setBookingError("");
    setModalOpen(true);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setBookingError("Por favor, digite seu nome.");
      return;
    }

    setBookingLoading(true);
    setBookingError("");

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: clientName.trim(),
          date: selectedDate,
          timeSlot: selectedSlot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao agendar.");
      }

      // Salva nome no localStorage para agilizar próximos agendamentos no celular
      if (typeof window !== "undefined") {
        localStorage.setItem("barbearia_client_name", clientName.trim());
        if ("vibrate" in navigator) {
          navigator.vibrate?.([30, 20, 30]);
        }
      }

      // Fecha modal de input e abre modal de regras e agradecimento
      setModalOpen(false);
      setConfirmedSlot({ date: selectedDate, time: selectedSlot });
      setRulesModalOpen(true);

      // Recarrega os slots para atualizar a contagem de agendados
      fetch(`/api/calendar?date=${selectedDate}`)
        .then((r) => r.json())
        .then((d) => setDayStatus(d));
    } catch (err: any) {
      setBookingError(err.message || "Não foi possível concluir o agendamento.");
    } finally {
      setBookingLoading(false);
    }
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-").map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  };

  return (
    <>
      <ThemeInjector profile={profile || undefined} />

      {/* HEADER: Banner & Foto Redonda do Barbeiro */}
      <header className="relative w-full">
        {/* Banner de Fundo */}
        <div className="relative w-full h-44 overflow-hidden bg-neutral-900">
          <img
            src={profile?.bannerUrl || "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80"}
            alt="Banner da Barbearia"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#141414]" />

          {/* Botão de Acesso Admin Discreto */}
          <Link
            href="/admin"
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 text-gold hover:text-white backdrop-blur-md border border-gold/30 transition shadow-lg active:scale-95"
            title="Acesso do Barbeiro"
          >
            <Lock className="w-4 h-4" />
          </Link>
        </div>

        {/* Foto de Perfil Redonda do Barbeiro & Informações */}
        <div className="px-5 -mt-16 flex flex-col items-center text-center relative z-10">
          <div className="relative w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-gold to-yellow-200 shadow-glow">
            <div className="w-full h-full rounded-full overflow-hidden bg-neutral-900 border-2 border-[#141414]">
              <img
                src={profile?.avatarUrl || "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=400&q=80"}
                alt={profile?.name || "Barbeiro"}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            {profile?.name || "Barbearia"}
          </h1>

          {profile?.bio && (
            <p className="mt-1 text-sm text-neutral-300 max-w-xs leading-relaxed font-light">
              {profile.bio}
            </p>
          )}

          {/* Botões Rápidos de Contato (WhatsApp & Instagram) */}
          <div className="mt-4 flex items-center gap-3 w-full max-w-xs justify-center">
            {profile?.whatsappNumber && (
              <a
                href={`https://wa.me/${profile.whatsappNumber.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/40 text-xs font-semibold shadow-sm transition active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            )}
            {profile?.instagramUrl && (
              <a
                href={profile.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-pink-400 border border-pink-500/40 text-xs font-semibold shadow-sm transition active:scale-95"
              >
                <InstagramIcon className="w-4 h-4" />
                Instagram
              </a>
            )}
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL (MOBILE FIRST) */}
      <main className="px-5 mt-6 space-y-6 flex-1">
        
        {/* 1. CARD DA FILA EM TEMPO REAL (DESTAQUE NO TOPO) */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 to-black border border-gold/30 p-5 shadow-glow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Ao Vivo na Barbearia
              </span>
            </div>
            <Users className="w-5 h-5 text-gold/80" />
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white tracking-tight">
              {queue.count}
            </span>
            <span className="text-sm font-medium text-neutral-300">
              {queue.count === 1 ? "pessoa na barbearia agora" : "pessoas na barbearia agora"}
            </span>
          </div>

          <p className="mt-2 text-xs text-neutral-400 leading-normal">
            Trabalhamos na modalidade de <strong>ordem de chegada</strong>. Você pode passar agora ou marcar sua intenção de horário no calendário abaixo!
          </p>
        </section>

        {/* 2. CALENDÁRIO & SELEÇÃO DE DIAS */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-gold" />
              Escolha o Dia
            </h2>
            <span className="text-xs text-neutral-400 capitalize">
              {formatDisplayDate(selectedDate)}
            </span>
          </div>

          {/* Carrossel de Dias com toque ergonômico */}
          <div className="flex gap-2.5 overflow-x-auto pb-3 scrollbar-none snap-x scroll-smooth -mx-1 px-1">
            {getUpcomingDays().map((item) => {
              const isSelected = item.fullDate === selectedDate;
              return (
                <button
                  key={item.fullDate}
                  onClick={(e) => handleDaySelect(item.fullDate, e)}
                  className={`snap-center flex-shrink-0 flex flex-col items-center justify-center w-16 py-3.5 rounded-2xl border transition-all duration-300 ease-out transform active:scale-95 ${
                    isSelected
                      ? "bg-gold text-black border-gold font-bold shadow-glow scale-105 z-10"
                      : "bg-neutral-900/90 text-neutral-300 border-neutral-800 hover:border-gold/40 scale-100 opacity-80 hover:opacity-100"
                  }`}
                >
                  <span className={`text-[11px] uppercase tracking-wider transition-colors duration-200 ${isSelected ? "text-neutral-950 font-bold" : "text-neutral-400"}`}>
                    {item.weekDayName}
                  </span>
                  <span className="text-lg font-extrabold mt-0.5">{item.dayNumber}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. SLOTS DE HORÁRIO / AVISOS DE NÃO FUNCIONAMENTO */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold" />
              Horários Disponíveis (1h por corte)
            </h3>
          </div>

          <div key={selectedDate} className="animate-fade-slide-up">
            {loadingDay && dayStatus?.date !== selectedDate ? (
              /* SKELETON CARDS FLUIDOS COM MESMO TAMANHO DOS SLOTS */
              <div className="space-y-2.5 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800/60"
                  >
                    <div className="space-y-2">
                      <div className="w-16 h-4 bg-neutral-800 rounded"></div>
                      <div className="w-24 h-3 bg-neutral-800/60 rounded"></div>
                    </div>
                    <div className="w-20 h-8 bg-neutral-800/80 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : dayStatus?.isBlocked ? (
              /* AVISO DO BARBEIRO PARA DIA FECHADO */
              <div className="rounded-2xl bg-amber-950/40 border border-amber-600/40 p-5 text-neutral-200 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <span>Barbearia Fechada Nesta Data</span>
                </div>
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  {dayStatus.blockedReason || "Não haverá atendimento neste dia."}
                </p>
                <p className="text-xs text-neutral-400 font-medium">
                  ℹ️ Caso você já tenha marcado este dia, por favor escolha uma data alternativa acima para o seu corte.
                </p>
              </div>
            ) : !dayStatus?.isOpenDay ? (
              <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 text-center text-neutral-400 text-xs">
                A barbearia não abre neste dia da semana. Escolha outro dia no calendário!
              </div>
            ) : (
              /* LISTAGEM DOS SLOTS DE HORÁRIO COM CONTAGEM ANÔNIMA */
              <div className="space-y-2.5">
                {dayStatus?.slots.map((slot) => {
                  return (
                    <div
                      key={slot.timeSlot}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800/90 hover:border-gold/30 transition"
                    >
                      <div className="space-y-1">
                        <div className="text-base font-bold text-white tracking-wide">
                          {slot.timeSlot}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                          {slot.bookedCount === 0 ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" />
                              Horário livre
                            </span>
                          ) : (
                            <span className="text-neutral-300 flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-gold" />
                              {slot.bookedCount === 1
                                ? "1 pessoa agendou"
                                : `${slot.bookedCount} pessoas agendaram`}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenBooking(slot.timeSlot)}
                        className="py-2 px-4 rounded-xl bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold text-black font-bold text-xs shadow transition active:scale-95"
                      >
                        Agendar
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* MODAL 1: FORMULÁRIO RÁPIDO DE AGENDAMENTO (APENAS NOME) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#1A1A1A] border border-gold/40 p-6 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-6">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">Marcar Horário</h3>
              <p className="text-xs text-gold font-medium">
                {formatDisplayDate(selectedDate)} às {selectedSlot}
              </p>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Como podemos te chamar?
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Seu nome ou apelido"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full py-3 px-4 rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-gold text-sm"
                />
              </div>

              {bookingError && (
                <p className="text-xs text-rose-400 font-medium text-center">
                  {bookingError}
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-neutral-800 text-neutral-300 font-medium text-xs hover:bg-neutral-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="flex-1 py-3 px-4 rounded-xl bg-gold hover:bg-yellow-400 text-black font-bold text-xs shadow-glow transition disabled:opacity-50"
                >
                  {bookingLoading ? "Confirmando..." : "Confirmar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRMAÇÃO & AVISO MANDATÓRIO DE REGRAS DA BARBEARIA */}
      {rulesModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-5">
          <div className="w-full max-w-sm rounded-3xl bg-neutral-900 border-2 border-gold p-6 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center mx-auto text-gold shadow-glow">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Agendamento Realizado!</h3>
              <p className="text-xs text-gold font-semibold uppercase tracking-wider">
                {confirmedSlot?.date && formatDisplayDate(confirmedSlot.date)} às {confirmedSlot?.time}
              </p>
            </div>

            {/* Aviso Obrigatório das Regras */}
            <div className="rounded-2xl bg-black/60 border border-neutral-800 p-4 text-xs text-neutral-200 leading-relaxed text-left space-y-2">
              <div className="font-bold text-amber-400 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4" />
                Regras da Barbearia
              </div>
              <p>
                <strong>Obrigado pelo agendamento!</strong> Informamos que a barbearia dá prioridade à <strong>ordem de chegada</strong>, portanto não se atrase.
              </p>
            </div>

            <button
              onClick={() => setRulesModalOpen(false)}
              className="w-full py-3.5 px-4 rounded-xl bg-gold hover:bg-yellow-400 text-black font-extrabold text-sm shadow-glow transition active:scale-95"
            >
              Entendido, obrigado!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
