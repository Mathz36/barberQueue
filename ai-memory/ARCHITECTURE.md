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
   - **Estilização:** TailwindCSS estruturado com variáveis CSS nativas (`--color-primary`, `--color-secondary`).
   - **Ícones & UI:** Lucide React (ícones mobile elegantes).
   - **Persistência Sem Banco de Dados:** Arquivos JSON estruturados no diretório `data/` com operações atômicas.
   - **Retenção Semanal (7 Dias):** Expurgador dominical automático que descarta agendamentos de semanas anteriores.

3. **Novo Módulo de Upload de Imagens:**
   - Endpoint dedicado `POST /api/admin/upload` (Form Data).
   - Salva em `public/uploads/avatar.[ext]` e `public/uploads/banner.[ext]`.
   - Sobrescreve sempre a imagem anterior, mantendo uso mínimo de disco e adicionando timestamp na URL para quebra de cache no navegador.

4. **Novo Modelo de Horários por Dia da Semana (Segunda a Domingo) com Almoço:**
   - Cada dia da semana (0=Domingo, 1=Segunda, ..., 6=Sábado) tem configuração individual de:
     - `isOpen`: se a barbearia abre ou não naquele dia.
     - `openTime`: horário de abertura (ex: `09:00`).
     - `closeTime`: horário de fechamento (ex: `19:00`).
     - `lunchStart` e `lunchEnd` (opcionais): intervalo de almoço. Se preenchidos, os slots desse período são omitidos da agenda do cliente; se vazios, não há intervalo de almoço.

---

## 📂 Estrutura de Arquivos de Dados (`data/*.json`)

```text
data/
├── profile.json       # Dados do barbeiro, bio, redes, bannerUrl, avatarUrl, cores e PIN
├── queue.json         # Fila em tempo real { count: number, updatedAt: string }
├── schedule.json      # Horários detalhados dia a dia (Segunda a Domingo) + almoço opcional
├── blocked_days.json  # Dias específicos de folga/fechamento e recados do barbeiro
└── appointments.json  # Agendamentos da semana ativa (nome, data, horário, timestamp)
public/
└── uploads/           # Imagens de perfil e banner enviadas pelo barbeiro (sobrescritas)
```

### Novo Schema de `data/schedule.json`
```json
{
  "slotDurationMinutes": 60,
  "days": [
    {
      "dayOfWeek": 1,
      "dayName": "Segunda-feira",
      "isOpen": true,
      "openTime": "09:00",
      "closeTime": "19:00",
      "lunchStart": "12:00",
      "lunchEnd": "13:00"
    },
    {
      "dayOfWeek": 2,
      "dayName": "Terça-feira",
      "isOpen": true,
      "openTime": "09:00",
      "closeTime": "19:00",
      "lunchStart": "",
      "lunchEnd": ""
    },
    ...
    {
      "dayOfWeek": 0,
      "dayName": "Domingo",
      "isOpen": false,
      "openTime": "09:00",
      "closeTime": "14:00",
      "lunchStart": "",
      "lunchEnd": ""
    }
  ]
}
```
