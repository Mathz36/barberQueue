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
| **TSK-001** até **TSK-016** | Equipe | Fases 1 a 3: Multiagente, JSON Storage, Fila, Upload, Horários e 20 Testes | `DONE` | Concluído | Ver CHANGELOG |
| **TSK-017** | Frontend | Sistema de notificações toast/banner no Admin ("Configuração Salva" e "Erro: ...") | `AWAITING_USER_APPROVAL` | Sim | - |
| **TSK-018** | Frontend | Seções dropdown / acordeão para Horário de Atendimento e Perfil no Admin | `AWAITING_USER_APPROVAL` | Sim | - |

---

## 📝 Detalhamento das Novas Tarefas

### [TSK-017] Notificações Padronizadas de Sucesso e Erro no Admin
- **Escopo:** Criação de componente de notificação flutuante com auto-fechamento (4s) e botão fechar. Exibe *"Configuração Salva"* em verde com ícone de check e *"Erro: <motivo>"* em vermelho em qualquer operação (salvar horários, salvar perfil, upload de fotos, bloqueio de dias).

### [TSK-018] Seções Expansíveis (Dropdown / Acordeão) no Admin
- **Escopo:** Transformar as seções de Horário de Atendimento e Personalização de Perfil em acordeões com chevron animado. O barbeiro clica para abrir e fechar, mantendo a tela do celular compacta e sem rolagem excessiva.
