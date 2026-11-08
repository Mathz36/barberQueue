# AI-Memory: Backlog de Tarefas (TASKS.md)

Este arquivo é gerenciado pelo **Planner Agent** e organiza a divisão de trabalho entre os agentes especializados.

---

## 🚦 Status

- `DONE`: Concluída, testada e comitada no Git em inglês.

---

## 📋 Quadro de Tarefas do Projeto

| ID | Agente | Título da Tarefa | Status | Requer Aprovação | Commits |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TSK-001** até **TSK-018** | Equipe | Fases 1 a 4: Funcionalidades completas, Upload, Horários e Notificações | `DONE` | Concluído | Ver CHANGELOG |
| **TSK-019** | Tester / Frontend | Zero Regression: Teste e correção da exibição da data real do corte no Admin | `DONE` | Autorizado | `fix:` |

---

## 📝 Detalhamento da Tarefa TSK-019

### [TSK-019] Zero Regression: Exibição da Data Correta do Agendamento
- **Escopo:** Criação do teste de reprodução `tests/bug-agenda-date.test.ts`. Correção em `src/app/admin/page.tsx` para exibir no card a data do corte `apt.date` formatada (`10/11/2026`) com abas de visualização ("Por Dia" e "Toda a Semana").
