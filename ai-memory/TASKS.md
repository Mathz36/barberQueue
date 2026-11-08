# AI-Memory: Backlog de Tarefas (TASKS.md)

Este arquivo é gerenciado pelo **Planner Agent** e organiza a divisão de trabalho entre os agentes especializados.

---

## 🚦 Status

- `DONE`: Concluída, testada e comitada no Git em inglês.

---

## 📋 Quadro de Tarefas do Projeto

| ID | Agente | Título da Tarefa | Status | Requer Aprovação | Commits |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TSK-001** até **TSK-019** | Equipe | Fases 1 a 5: App completo, Uploads, Horários, Notificações e Bugfix de Datas | `DONE` | Concluído | Ver CHANGELOG |
| **TSK-020** | Backend / Tester | Blindagem e isolamento total do storage de testes (`data-test/`) para proteger dados reais | `DONE` | Autorizado | `fix:` |

---

## 📝 Detalhamento da Tarefa TSK-020

### [TSK-020] Blindagem e Isolamento de Storage de Teste
- **Escopo:** Configurar `DATA_DIR` e `UPLOADS_DIR` para usar `data-test/` e `public/uploads-test/` quando em ambiente de testes (`NODE_ENV === "test"`). Adicionar pastas de teste ao `.gitignore`. Garantir que nenhum teste sobrescreva a base real da barbearia (`data/profile.json`, `data/appointments.json`, etc.).
