# AI-Memory: Backlog de Tarefas (TASKS.md)

Este arquivo é gerenciado pelo **Planner Agent** em consonância com as aprovações do usuário.

---

## 🚦 Status Possíveis

- `PROPOSED`: Tarefa proposta pelo Planner aguardando discussão ou detalhamento.
- `AWAITING_USER_APPROVAL`: Tarefa detalhada (O QUE e COMO) aguardando o "SIM" do usuário.
- `IN_PROGRESS`: Tarefa autorizada em implementação ativa.
- `IN_TESTING`: Implementação concluída, transferida para o Tester Agent para validação e testes de estresse.
- `DONE`: Implementação e testes aprovados, commit realizado e documentado.
- `BLOCKED`: Impedimento identificado.

---

## 📋 Quadro de Tarefas

| ID | Agente | Título | Status | Requer Aprovação | Commits |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TSK-000** | Planner | Inicialização da estrutura multiagente e ai-memory | `DONE` | Concluído | - |
| **TSK-001** | Planner | Recepção da ideia do usuário e elaboração da arquitetura inicial | `IN_PROGRESS` | Sim (no plano) | - |
| **TSK-002** | Planner / Equipe | Decomposição técnica e backlog das primeiras features | `PROPOSED` | Sim | - |

---

## 📝 Detalhamento de Tarefas

### [TSK-000] Inicialização da estrutura multiagente e ai-memory
- **Agente:** Planner
- **Status:** `DONE`
- **Descrição:** Criação dos arquivos de memória persistente (`ai-memory/`), definição dos agentes especializados (Planner, Frontend, Backend, Tester), regras inegociáveis de aprovação e commits em inglês.

### [TSK-001] Recepção da ideia do usuário e elaboração da arquitetura inicial
- **Agente:** Planner
- **Status:** `IN_PROGRESS`
- **Descrição:** Coletar a descrição da ideia do usuário, definir as tecnologias mais adequadas e propor a arquitetura macro do app de barbearia.
