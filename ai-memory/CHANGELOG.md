# AI-Memory: Registro Histórico de Mudanças (CHANGELOG)

Todas as alterações significativas no projeto são registradas aqui em ordem cronológica reversa, acompanhadas da mensagem de commit correspondente (sempre em inglês no git).

---

## [1.0.0] - 2026-11-08

### Entregas
- **Commit:** `feat: build cozy mobile-first client and admin interfaces with dynamic theme`
  - Telas do Cliente e do Barbeiro em Next.js App Router com TailwindCSS.
  - Card de fila ao vivo com polling em tempo real.
  - Calendário responsivo mobile com slots de 1h e contagem anônima.
  - Modal de agendamento solicitando apenas o nome do cliente.
  - Modal com aviso mandatório de regras da barbearia (ordem de chegada).
  - Painel do barbeiro com controle tátil da fila (+, -, zerar), agenda com nomes, bloqueio de dias com cancelamento automático e customização visual completa (foto, banner, bio, redes, cores).
- **Commit:** `feat: implement json storage layer with weekly retention and backend rest apis`
  - Persistência em arquivos JSON locais (`data/*.json`) com escrita atômica contra corrupção.
  - Algoritmo de limpeza semanal de 7 dias com expurgo dominical de agendamentos passados.
  - Suíte de testes unitários para a fila, storage e expurgador dominical.
- **Commit:** `docs: update architecture with json storage and weekly cleanup retention`
  - Ajuste de arquitetura para remover dependências de banco de dados/Prisma e formalizar o expurgo de 7 dias.
- **Commit:** `chore: initialize multi-agent workspace and persistent ai-memory`
  - Inicialização da estrutura multiagente (`planner`, `frontend`, `backend`, `tester`) e diretrizes de governança em `ai-memory/`.
