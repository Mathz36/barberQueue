# AI-Memory: Registro Histórico de Mudanças (CHANGELOG)

Todas as alterações significativas no projeto são registradas aqui em ordem cronológica reversa, acompanhadas da mensagem de commit correspondente (sempre em inglês no git).

---

## [1.2.1] - 2026-11-08

### Correções (Bugfix com Zero Regression)
- **Commit:** `fix: display appointment target date instead of creation date in admin agenda`
  - Correção na exibição dos agendamentos no painel do barbeiro: agora exibe com destaque a data real do corte (`apt.date`), como `10/11/2026`, ao invés da data de criação do registro (`createdAt`).
  - Adição de abas de filtro na agenda do admin: **"Por Dia"** e **"Toda a Semana"**.
  - Formatação segura anti-fuso horário (`formatSafeDate`) para datas brasileiras.
  - Adição do teste automatizado de regressão `tests/bug-agenda-date.test.ts` (Zero Regression).

---

## [1.2.0] - 2026-11-08

### Entregas
- **Commit:** `feat: add toast notifications and collapsible dropdown sections to admin dashboard`
  - Notificações padronizadas de feedback no admin: *"Configuração Salva"* e *"Erro: <motivo>"*.
  - Seções expansíveis tipo dropdown / acordeão para Horário de Atendimento e Personalização de Perfil.
  - Memória local do nome do cliente (`localStorage`) e PWA configurado.

---

## [1.1.0] - 2026-11-08

### Entregas
- **Commit:** `feat: implement direct image upload with overwrite and weekly schedule with lunch break`
  - Upload direto de fotos e banner com sobrescrita física em `public/uploads/`.
  - Horários detalhados de Segunda a Domingo com intervalo de almoço opcional.

---

## [1.0.0] - 2026-11-08

### Entregas
- **Commit:** `feat: build cozy mobile-first client and admin interfaces with dynamic theme`
- **Commit:** `feat: implement json storage layer with weekly retention and backend rest apis`
- **Commit:** `chore: initialize multi-agent workspace and persistent ai-memory`
