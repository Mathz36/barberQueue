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
| **TSK-021** | Frontend / Backend | Card "Meu Horário Agendado" com botão de cancelamento autônomo pelo cliente | `AWAITING_USER_APPROVAL` | Sim | - |
| **TSK-022** | Frontend | Estimativa amigável de tempo de espera na Fila ao Vivo | `AWAITING_USER_APPROVAL` | Sim | - |
| **TSK-023** | Frontend | Alerta sonoro vintage (Web Audio API) no Admin para novos agendamentos | `AWAITING_USER_APPROVAL` | Sim | - |
| **TSK-024** | Tester | Testes automatizados para cancelamento pelo cliente e integridade da estimativa | `AWAITING_USER_APPROVAL` | Sim | - |

---

## 📝 Detalhamento das Novas Tarefas

### [TSK-021] Cancelamento de Horário pelo Próprio Cliente
- **Escopo:** Adicionar `DELETE /api/appointments` recebendo `{ id: string }` para permitir que o cliente desmarque seu próprio horário. Salvar o agendamento ativo no `localStorage` do celular e exibir um card acolhedor no topo com o botão de cancelamento.

### [TSK-022] Estimativa de Espera na Fila ao Vivo
- **Escopo:** Calcular e exibir o tempo aproximado de espera no card da fila: 0 pessoas = *"Atendimento Imediato"*, 1 pessoa = *"~40 min"*, 2 pessoas = *"~1h20"*, 3+ pessoas = *"~2h+"*.

### [TSK-023] Alerta Sonoro no Painel do Barbeiro
- **Escopo:** Sintetizador sonoro Web Audio API de sino de recepção que toca automaticamente no painel `/admin` quando um novo cliente agenda.
