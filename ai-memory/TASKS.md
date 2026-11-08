# AI-Memory: Backlog de Tarefas (TASKS.md)

Este arquivo é gerenciado pelo **Planner Agent** e organiza a divisão de trabalho entre os agentes especializados.

---

## 🚦 Status

- `PROPOSED`: Proposta técnica aguardando autorização do usuário.
- `AWAITING_USER_APPROVAL`: Submetida formalmente para o usuário.
- `IN_PROGRESS`: Em desenvolvimento ativo pelo agente atribuído.
- `IN_TESTING`: Em validação e testes de estresse com o Tester Agent.
- `DONE`: Concluída, testada e comitada no Git em inglês.

---

## 📋 Quadro de Tarefas do Projeto

| ID | Agente | Título da Tarefa | Status | Requer Aprovação | Commits |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TSK-001** até **TSK-020** | Equipe | Fases 1 a 6: Base completa, Uploads, Horários, Notificações e Blindagem de Dados | `DONE` | Concluído | Ver CHANGELOG |
| **TSK-025** | Frontend | Transição fluida e suave na seleção de dias da semana e troca de slots no cliente | `DONE` | Sim | `feat: add fluid animation and smooth transition for day selection` |
| **TSK-026** | Frontend | Rodapé de autoria com link do GitHub (`mathz36`) em layout global | `DONE` | Sim | `feat: add developer credits footer with github link` |
| **TSK-027** | Backend / DevOps | Migração para Supabase, Bucket de imagens e Vercel Keep-Alive Cron | `DONE` | Sim | `feat: migrate storage to supabase with image bucket and vercel keep-alive cron` |
| **TSK-028** | Frontend / Tester | Status inteligente de almoço e fechamento no card Ao Vivo do cliente | `DONE` | Sim | `feat: display closed and lunch status on client live queue card` |
| **TSK-029** | Frontend / Tester | Mensagem detalhada com horário de fechamento ("encerrado às HH:MM") e abertura | `DONE` | Sim | `feat: improve closed status message showing exact closing and opening hours` |
| **TSK-030** | Backend / DevOps | Remoção completa da pasta local data/ e migração exclusiva para o Supabase | `DONE` | Sim | `chore: remove local data json directory and rely on supabase storage` |
| **TSK-031** | Frontend / Tester | Otimização de responsividade e inputs do painel admin para telas móveis (iPhone 11) | `DONE` | Sim | `fix: improve mobile responsiveness and input layout on admin panel for narrow screens` |
| **TSK-032** | Planner / Docs | Documentação completa do projeto no README.md (Arquitetura, Setup e Motivação) | `DONE` | Sim | `docs: add comprehensive readme with architecture, setup guide, and motivation` |

---

## 📝 Detalhamento da Tarefa TSK-025

### [TSK-025] Transição Fluida no Seletor de Dias da Semana
- **Escopo:**
  1. Suavização tátil nos botões do dia (`transition-all duration-300 cubic-bezier`), com sutil elevação e expansão suave ao selecionar.
  2. Centralização automática e suave (`scrollIntoView({ behavior: 'smooth', inline: 'center' })`) ao tocar no dia.
  3. Transição suave de opacidade e deslize (*fade & slide crossfade*) na lista de slots de horário correspondente, eliminando o piscar abrupto da tela.
