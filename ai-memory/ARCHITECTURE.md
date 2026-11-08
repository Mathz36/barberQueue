# AI-Memory: Arquitetura Técnica do Sistema (Barbearia Web App)

Este documento detalha as decisões técnicas, modelos de dados, fluxo de comunicação e padrões de engenharia adotados.

---

## 🏛️ Visão Geral e Princípios

1. **Mobile-First & Público Leigo:**
   - Telas concebidas para uso em smartphones com uma mão só.
   - Navegação sem atrito: zero necessidade de cadastro prévio, senha ou dados sensíveis para o cliente.
   - Design acolhedor e de alto contraste (paleta padrão Preto e Dourado com personalização dinâmica por CSS Variables).

2. **Fullstack Reativo & Armazenamento em JSON:**
   - **Framework:** Next.js 14+ (App Router, React 19, TypeScript).
   - **Estilização:** TailwindCSS estruturado com variáveis CSS nativas (`--color-primary`, `--color-secondary`), permitindo que a troca de cores definida pelo barbeiro reflita instantaneamente no app.
   - **Ícones & UI:** Lucide React (ícones mobile elegantes).
   - **Persistência Sem Banco de Dados:** **Arquivos JSON estruturados** no diretório `data/` com operações atômicas de leitura e escrita (Write-to-Temp + Rename) para garantir integridade e prevenir corrupção de dados em concorrência.
   - **Política de Retenção & Limpeza Semanal (7 Dias):**
     - O sistema mantém salvos apenas os agendamentos da semana atual.
     - Mecanismo automatizado: todo domingo (ou ao iniciar a semana), os agendamentos da semana anterior são expurgados do `appointments.json`, mantendo o armazenamento leve, rápido e privado.
   - **Sincronização da Fila ao Vivo:** SWR / Polling leve com revalidação de poucos segundos para que o número de pessoas presentes na barbearia atualize instantaneamente no celular do cliente.

---

## 📂 Estrutura de Arquivos de Dados (`data/*.json`)

```text
data/
├── profile.json       # Dados do barbeiro, bio, redes, banner, avatar, cores e PIN
├── queue.json         # Fila em tempo real { count: number, updatedAt: string }
├── schedule.json      # Horários de funcionamento (abertura, fechamento, dias ativos)
├── blocked_days.json  # Dias de folga/não funcionamento e mensagens do barbeiro
└── appointments.json  # Agendamentos da semana ativa (nome, data, horário, timestamp)
```

### Schemas JSON:

#### `data/profile.json`
```json
{
  "name": "Barbearia",
  "bio": "Cortes clássicos e modernos com atendimento acolhedor.",
  "avatarUrl": "/avatar-default.png",
  "bannerUrl": "/banner-default.jpg",
  "whatsappNumber": "5511999999999",
  "instagramUrl": "https://instagram.com/barbearia",
  "primaryColor": "#121212",
  "secondaryColor": "#D4AF37",
  "adminPin": "1234"
}
```

#### `data/queue.json`
```json
{
  "count": 0,
  "updatedAt": "2026-11-08T12:00:00Z"
}
```

#### `data/schedule.json`
```json
{
  "openHour": 9,
  "closeHour": 19,
  "slotDurationMinutes": 60,
  "activeDaysOfWeek": [1, 2, 3, 4, 5, 6]
}
```

#### `data/blocked_days.json`
```json
[
  {
    "date": "2026-11-15",
    "reason": "Folga de feriado. Agendamentos cancelados, favor remarcar!"
  }
]
```

#### `data/appointments.json`
```json
[
  {
    "id": "apt_1731070000000",
    "clientName": "Carlos Silva",
    "date": "2026-11-10",
    "timeSlot": "10:00",
    "createdAt": "2026-11-08T10:00:00Z"
  }
]
```

---

## 🧹 Mecanismo de Limpeza Semanal Automática (7 Dias / Domingo)

- **Regra de Negócio:** Agendamentos de semanas passadas não têm utilidade histórica para o cliente e consomem espaço desnecessário.
- **Implementação:**
  - Módulo utilitário `src/lib/storage.ts`: Toda vez que os agendamentos são consultados ou criados, executa-se a checagem `pruneOldAppointments()`.
  - Calcula o início da semana atual (segunda-feira 00:00 ou domingo conforme locale).
  - Qualquer agendamento com data anterior ao início do ciclo da semana corrente é removido do `appointments.json`.
  - Operação atômica e segura contra concorrência.

---

## 🌐 Endpoints da API

1. **Fila em Tempo Real:**
   - `GET /api/queue`: Retorna `{ count, updatedAt }`.
   - `POST /api/queue`: Ações `increment`, `decrement`, `reset`, `set` (autenticado por PIN).
2. **Perfil e Customização:**
   - `GET /api/profile`: Retorna dados públicos e cores para o tema do cliente.
   - `PUT /api/profile`: Atualiza bio, fotos, redes e cores (autenticado por PIN).
3. **Calendário e Agendamentos:**
   - `GET /api/calendar?month=YYYY-MM`: Retorna dias do mês, indicando dias bloqueados e contagem anônima de agendamentos por slot de 1h.
   - `POST /api/appointments`: Cria agendamento com `{ clientName, date, timeSlot }`. Executa a rotina de limpeza de 7 dias automaticamente.
   - `GET /api/admin/appointments?date=YYYY-MM-DD`: Retorna lista com os nomes dos clientes (autenticado por PIN).
   - `POST /api/admin/blocked-days`: Bloqueia o dia, define a mensagem do barbeiro e cancela os agendamentos existentes para aquela data.
