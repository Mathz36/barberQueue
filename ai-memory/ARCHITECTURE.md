# AI-Memory: Arquitetura Técnica do Sistema (Barbearia Web App)

Este documento detalha as decisões técnicas, modelos de dados, fluxo de comunicação e padrões de engenharia adotados.

---

## 🏛️ Visão Geral e Princípios

1. **Mobile-First & Público Leigo:**
   - Telas concebidas para uso em smartphones com uma mão só.
   - Navegação sem fricção: zero necessidade de cadastro prévio, senha ou dados sensíveis para o cliente.
   - Design acolhedor e de alto contraste (paleta padrão Preto e Dourado com personalização dinâmica por CSS Variables).

2. **Fullstack Reativo e Escalável:**
   - **Framework:** Next.js 14+ (App Router, React, TypeScript).
   - **Estilização:** TailwindCSS estruturado com variáveis CSS nativas (`--color-primary`, `--color-secondary`) permitindo a customização em tempo real definida pelo barbeiro.
   - **Ícones & UI:** Lucide React, Radix UI / Headless UI (modais e drawers táteis mobile).
   - **Banco de Dados:** Prisma ORM com SQLite (ideal para desenvolvimento local e simples portabilidade para PostgreSQL no deploy).
   - **Sincronização em Tempo Real (Fila ao Vivo):** Polling leve / SWR com revalidação de poucos segundos ou Server-Sent Events (SSE).

---

## 📊 Modelagem de Dados (Schema Proposto)

```prisma
// Configurações do Barbeiro e Identidade Visual
model BarberProfile {
  id              String   @id @default("barber-main")
  name            String   @default("Barbeiro")
  bio             String   @default("")
  avatarUrl       String?
  bannerUrl       String?
  whatsappNumber  String?
  instagramUrl    String?
  primaryColor    String   @default("#121212") // Preto elegante
  secondaryColor  String   @default("#D4AF37") // Dourado
  adminPin        String   @default("1234")    // PIN de acesso rápido para o barbeiro
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// Contador da Fila em Tempo Real
model LiveQueue {
  id           String   @id @default("current-queue")
  currentCount Int      @default(0) // Quantidade de pessoas no momento
  updatedAt    DateTime @updatedAt
}

// Horário de Atendimento e Duração
model BusinessSchedule {
  id        String   @id @default("schedule-main")
  openHour  Int      @default(9)  // ex: 09:00
  closeHour Int      @default(19) // ex: 19:00
  slotDurationMinutes Int @default(60) // 1 hora em média
  activeDaysOfWeek String @default("1,2,3,4,5,6") // Segunda a Sábado
}

// Dias de Não Funcionamento / Folgas / Feriados
model BlockedDay {
  id          String   @id @default(cuid())
  date        String   @unique // Formato YYYY-MM-DD
  reason      String?  // Mensagem personalizada do barbeiro exibida ao cliente
  createdAt   DateTime @default(now())
}

// Agendamento de Intenção do Cliente
model Appointment {
  id          String   @id @default(cuid())
  clientName  String   // Nome simples informado pelo cliente
  date        String   // YYYY-MM-DD
  timeSlot    String   // HH:00 (ex: "10:00")
  status      String   @default("CONFIRMED") // "CONFIRMED" ou "CANCELLED"
  cancelledReason String?
  createdAt   DateTime @default(now())

  @@index([date, timeSlot])
}
```

---

## 🌐 Endpoints & Contratos de API

### 1. Fila em Tempo Real
- `GET /api/queue/status` -> `{ count: number, updatedAt: string }`
- `POST /api/admin/queue/adjust` -> `{ action: "increment" | "decrement" | "reset" | "set", value?: number }` (Protegido por PIN)

### 2. Perfil e Customização
- `GET /api/barber/profile` -> Retorna foto, banner, bio, redes sociais e cores primária/secundária.
- `PUT /api/admin/barber/profile` -> Atualiza dados do perfil e cores (Protegido por PIN).

### 3. Calendário & Agendamentos
- `GET /api/calendar/month?year=2026&month=11` -> Retorna dias bloqueados e horários disponíveis.
- `GET /api/calendar/day?date=2026-11-10` -> Retorna slots de 1h com a contagem anônima (`bookedCount: 2`). Se o dia estiver bloqueado, retorna o aviso do barbeiro.
- `POST /api/appointments` -> Cria agendamento com `{ clientName, date, timeSlot }`. Valida se o dia não está bloqueado.
- `GET /api/admin/appointments?date=YYYY-MM-DD` -> Visão administrativa completa (com nomes dos clientes e lista por horário).
- `POST /api/admin/blocked-days` -> Cria bloqueio para a data e cancela em lote os agendamentos existentes com a mensagem do barbeiro.
- `DELETE /api/admin/blocked-days/:date` -> Desbloqueia o dia.
- `PUT /api/admin/schedule` -> Atualiza horários de abertura/fechamento.

---

## 🧪 Estratégia de Testes Automatizados (CI/CD)

- **Testes Unitários:**
  - Validação da fila: `increment` soma 1, `decrement` diminui 1 (sem ficar negativo), `reset` zera para 0.
  - Geração de slots de 1h entre horário de abertura e fechamento.
  - Bloqueio de dia: cancelamento atômico de agendamentos e persistência do motivo.
- **Testes de Concorrência e Estresse:**
  - 10 clientes tentando agendar simultaneamente no mesmo slot de 1h -> contagem precisa sem perda de registros.
  - Disparos simultâneos de incremento/decremento da fila -> integridade da contagem.
- **Testes End-to-End (Playwright):**
  - Simulação Mobile (Viewport 390x844):
    1. Cliente visualiza fila ao vivo.
    2. Cliente escolhe dia e horário com contagem de inscritos.
    3. Cliente insere nome, agenda e visualiza as regras da barbearia.
    4. Barbeiro acessa admin, incrementa a fila, bloqueia um dia com aviso e confere o aviso refletido no lado do cliente.
