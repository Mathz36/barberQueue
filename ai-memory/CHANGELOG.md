# AI-Memory: Registro Histórico de Mudanças (CHANGELOG)

Todas as alterações significativas no projeto são registradas aqui em ordem cronológica reversa, acompanhadas da mensagem de commit correspondente (sempre em inglês no git).

---

## [1.2.0] - 2026-11-08

### Entregas
- **Commit:** `feat: add toast notifications and collapsible dropdown sections to admin dashboard`
  - Notificações padronizadas de feedback no admin: *"Configuração Salva"* em verde e *"Erro: <motivo>"* em vermelho com auto-fechamento e dismiss manual.
  - Seções expansíveis tipo dropdown / acordeão para **Horário de Atendimento** e **Personalização de Perfil** no painel do barbeiro, otimizando o espaço em smartphones.
  - Memória local do nome do cliente (`localStorage`) pré-preenchendo agendamentos futuros.
  - Configuração PWA (`manifest.json` e ícone SVG) para instalação na tela inicial do celular como app nativo.
  - Botão de compartilhamento rápido da agenda do dia formatada para o WhatsApp no admin.

---

## [1.1.0] - 2026-11-08

### Entregas
- **Commit:** `feat: implement direct image upload with overwrite and weekly schedule with lunch break`
  - Upload direto de imagens de perfil e banner via formulário com regra de sobrescrita automática em `public/uploads/`.
  - Configuração individual de horários de Segunda a Domingo com intervalo de almoço opcional.
  - Omissão automática de horários de almoço na grade de slots de 1h do cliente.
  - Adição de `tests/schedule.test.ts` e `tests/upload.test.ts` elevando a suíte para 20 testes passando.

---

## [1.0.0] - 2026-11-08

### Entregas
- **Commit:** `feat: build cozy mobile-first client and admin interfaces with dynamic theme`
  - Telas do Cliente e do Barbeiro em Next.js App Router com TailwindCSS.
  - Card de fila ao vivo com polling em tempo real.
  - Calendário responsivo mobile com slots de 1h e contagem anônima.
  - Modal de agendamento solicitando apenas o nome do cliente.
  - Modal com aviso mandatório de regras da barbearia (ordem de chegada).
- **Commit:** `feat: implement json storage layer with weekly retention and backend rest apis`
  - Persistência em arquivos JSON locais (`data/*.json`) com escrita atômica contra corrupção.
  - Algoritmo de limpeza semanal de 7 dias com expurgo dominical de agendamentos passados.
- **Commit:** `chore: initialize multi-agent workspace and persistent ai-memory`
  - Inicialização da estrutura multiagente (`planner`, `frontend`, `backend`, `tester`) e diretrizes de governança em `ai-memory/`.
