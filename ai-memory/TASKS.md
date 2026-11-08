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
| **TSK-002** | Planner / Backend | Setup do projeto (Next.js, Tailwind, Prisma/SQLite) | `AWAITING_USER_APPROVAL` | Sim | - |
| **TSK-003** | Backend | Modelagem de dados e serviço da Fila em Tempo Real (+, -, zerar) | `PROPOSED` | Sim | - |
| **TSK-004** | Backend | APIs de Perfil, Redes Sociais e Cores Dinâmicas | `PROPOSED` | Sim | - |
| **TSK-005** | Backend | APIs do Calendário de Slots (1h), Agendamentos e Bloqueio de Dias | `PROPOSED` | Sim | - |
| **TSK-006** | Tester | Bateria de testes unitários e de estresse para Backend/Regras | `PROPOSED` | Sim | - |
| **TSK-007** | Frontend | Header Mobile (Foto circular, Banner, Bio, Redes) & Tema Preto/Dourado | `PROPOSED` | Sim | - |
| **TSK-008** | Frontend | Card Mobile da Fila em Tempo Real (Visão do Cliente) | `PROPOSED` | Sim | - |
| **TSK-009** | Frontend | Calendário Mobile com Slots de 1h e contagem anônima | `PROPOSED` | Sim | - |
| **TSK-010** | Frontend | Modal de Agendamento (Nome) com aviso acolhedor das regras | `PROPOSED` | Sim | - |
| **TSK-011** | Frontend | Painel Admin Mobile do Barbeiro (+/- fila, agenda, bloqueio de dias, tema) | `PROPOSED` | Sim | - |
| **TSK-012** | Tester | Testes automatizados E2E mobile (Playwright) & Zero Regression | `PROPOSED` | Sim | - |

---

## 📝 Detalhamento das Tarefas Imediatas

### [TSK-002] Setup do projeto (Next.js, Tailwind, Prisma/SQLite)
- **Agentes:** Planner & Backend
- **Escopo:** Inicialização do ecossistema Next.js com App Router, TypeScript, TailwindCSS configurado para tema com variáveis CSS (preto e dourado dinâmicos), Prisma ORM com SQLite para persistência rápida local e biblioteca de ícones mobile.
- **Arquivos:** `package.json`, `tsconfig.json`, `tailwind.config.ts`, `prisma/schema.prisma`.

### [TSK-003] Backend: Fila em Tempo Real & Bloqueio de Dias
- **Agente:** Backend
- **Escopo:** Endpoints de leitura e ajuste da contagem de pessoas presentes na barbearia no momento (+, -, zerar), além do serviço de cancelamento em lote ao marcar dias de folga com mensagem personalizada.
