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
| **TSK-001** até **TSK-012** | Equipe | Fase 1 e 2: Estrutura base, JSON storage, Fila ao vivo e Agendamento | `DONE` | Concluído | Ver CHANGELOG |
| **TSK-013** | Backend | Endpoint de upload de imagens (Avatar/Banner) com sobrescrita automática | `AWAITING_USER_APPROVAL` | Sim | - |
| **TSK-014** | Backend | Modelagem e cálculo de slots dia a dia (Seg a Dom) com almoço opcional | `AWAITING_USER_APPROVAL` | Sim | - |
| **TSK-015** | Frontend | Interface Admin com upload de arquivo direto e gestão semanal de horários | `AWAITING_USER_APPROVAL` | Sim | - |
| **TSK-016** | Tester | Testes automatizados para slots com intervalo de almoço e upload | `AWAITING_USER_APPROVAL` | Sim | - |

---

## 📝 Detalhamento das Novas Tarefas

### [TSK-013] Backend: Upload de Imagens com Sobrescrita
- **Escopo:** Criação de `src/app/api/admin/upload/route.ts` aceitando `FormData`. Salva em `public/uploads/avatar.[ext]` e `public/uploads/banner.[ext]`. Ao enviar uma nova imagem, a anterior do mesmo tipo é sobrescrita e o caminho atualizado no `data/profile.json`.

### [TSK-014] Backend: Horários de Segunda a Domingo & Almoço Opcional
- **Escopo:** Atualização do `src/lib/storage.ts` para suportar `DayScheduleConfig`. Ao gerar slots de um dia, verifica se o dia está aberto, itera de `openTime` a `closeTime` (1h cada) e pula qualquer slot compreendido no intervalo de almoço (se preenchido).

### [TSK-015] Frontend: Controles no Admin
- **Escopo:** Substituir os inputs de URL por seletor de arquivos de foto e banner no celular. Criar seção intuitiva no `/admin` exibindo Segunda a Domingo com toggles de aberto/fechado, inputs de abertura, fechamento e horário de almoço opcional.
