# AI-Memory: Backlog de Tarefas (TASKS.md)

Este arquivo é gerenciado pelo **Planner Agent** e organiza a divisão de trabalho entre os agentes especializados.

---

## 🚦 Status

- `PROPOSED`: Proposta técnica elaborada aguardando autorização do usuário.
- `AWAITING_USER_APPROVAL`: Submetida formalmente para o usuário.
- `IN_PROGRESS`: Em desenvolvimento ativo pelo agente atribuído.
- `IN_TESTING`: Em validação e testes de estresse com o Tester Agent.
- `DONE`: Concluída, testada e comitada no Git em inglês.

---

## 📋 Quadro de Tarefas do Projeto

| ID | Agente | Título da Tarefa | Status | Requer Aprovação | Commits |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TSK-001** | Planner | Definição da arquitetura, stack e requisitos do app | `DONE` | Concluído | `docs:` |
| **TSK-002** | Planner / Backend | Setup do projeto (Next.js, TypeScript, TailwindCSS) sem banco/prisma | `AWAITING_USER_APPROVAL` | Sim | - |
| **TSK-003** | Backend | Módulo de Storage JSON Atômico e Algoritmo de Limpeza Semanal (7 dias) | `PROPOSED` | Sim | - |
| **TSK-004** | Backend | APIs da Fila em Tempo Real (+, -, zerar) e Perfil/Cores | `PROPOSED` | Sim | - |
| **TSK-005** | Backend | APIs do Calendário de Slots (1h), Agendamentos e Bloqueio de Dias | `PROPOSED` | Sim | - |
| **TSK-006** | Tester | Bateria de testes automatizados do Storage JSON e Expurgador Semanal | `PROPOSED` | Sim | - |
| **TSK-007** | Frontend | Header Mobile (Foto circular, Banner, Bio, Redes) & Tema Preto/Dourado | `PROPOSED` | Sim | - |
| **TSK-008** | Frontend | Card Mobile da Fila em Tempo Real (Visão do Cliente) | `PROPOSED` | Sim | - |
| **TSK-009** | Frontend | Calendário Mobile com Slots de 1h e contagem anônima | `PROPOSED` | Sim | - |
| **TSK-010** | Frontend | Modal de Agendamento (Nome) com aviso acolhedor das regras | `PROPOSED` | Sim | - |
| **TSK-011** | Frontend | Painel Admin Mobile do Barbeiro (+/- fila, agenda, bloqueio de dias, tema) | `PROPOSED` | Sim | - |
| **TSK-012** | Tester | Testes automatizados E2E mobile (Playwright) & Zero Regression | `PROPOSED` | Sim | - |

---

## 📝 Detalhamento das Tarefas Imediatas

### [TSK-002] Setup do projeto (Next.js, TypeScript, TailwindCSS)
- **Agentes:** Planner & Backend
- **Escopo:** Inicialização do ecossistema Next.js com App Router, TypeScript e TailwindCSS configurado para tema com variáveis CSS (preto e dourado dinâmicos), Lucide Icons para interface mobile. Sem dependências de Prisma ou bancos de dados SQL/NoSQL externos.

### [TSK-003] Backend: Módulo Storage JSON & Limpeza Semanal
- **Agente:** Backend & Tester
- **Escopo:** Criação do módulo `src/lib/storage.ts` com leitura e escrita atômica para arquivos `data/*.json` e a rotina `pruneOldAppointments()` que todo domingo/início de semana purga os agendamentos da semana anterior, mantendo apenas a semana corrente salva.
