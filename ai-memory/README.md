# AI-Memory: Central de Memória e Contexto Persistente

O diretório `ai-memory/` é a fonte única da verdade (Single Source of Truth) para todos os agentes do projeto. Nenhum agente trabalha sem antes ler o estado atual e sem atualizar a memória ao concluir ou pausar suas atividades.

---

## 📂 Estrutura de Arquivos

| Arquivo | Finalidade | Responsável Principal |
| :--- | :--- | :--- |
| [`STATE.md`](./STATE.md) | Estado em tempo real: fase atual, o que está sendo feito, onde parou e próximos passos. | Todos os agentes / Planner |
| [`TASKS.md`](./TASKS.md) | Backlog de tarefas, divisão de trabalho por agente e status de aprovação. | Planner Agent |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Visão técnica, padrões adotados, stack, schemas de dados e convenções de código. | Backend & Frontend Agents |
| [`RULES.md`](./RULES.md) | Regras inegociáveis de governança, aprovação do usuário e convenções de commit. | Planner Agent / Sistema |
| [`CHANGELOG.md`](./CHANGELOG.md) | Histórico cronológico detalhado de entregas, correções e commits. | Todos os agentes |

---

## 🔄 Protocolo de Leitura e Escrita dos Agentes

1. **Antes de Iniciar Qualquer Atividade**:
   - Ler `ai-memory/STATE.md` para entender o momento atual.
   - Ler `ai-memory/TASKS.md` para confirmar a task atribuída e os critérios de aceitação.
   - Ler `ai-memory/RULES.md` para garantir conformidade estrita.

2. **Durante a Execução**:
   - Apresentar detalhadamente o **O QUE** e o **COMO** ao usuário.
   - Aguardar **autorização expressa** antes de alterar qualquer código.

3. **Após a Conclusão / Pausa**:
   - Atualizar `ai-memory/STATE.md` indicando exatamente onde parou e o que falta.
   - Atualizar o status da task em `ai-memory/TASKS.md`.
   - Adicionar o registro de commit e mudanças em `ai-memory/CHANGELOG.md`.
