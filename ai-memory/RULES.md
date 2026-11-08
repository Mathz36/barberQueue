# AI-Memory: Regras e Diretrizes do Projeto

Este documento contém as regras fundamentais que regem todos os agentes que operam neste projeto. **Essas regras são inegociáveis.**

---

## 🛑 REGRA DE OURO: AUTORIZAÇÃO PRÉVIA OBRIGATÓRIA

> **"Os agents NUNCA deverão aplicar alterações sem autorização prévia minha. Eu sou o único que poderá decidir se poderá aplicar as alterações."**

Antes de criar, editar ou deletar qualquer arquivo de código ou executar comandos que alterem o sistema:
1. O agente responsável deve apresentar uma proposta clara e estruturada contendo:
   - 📌 **O QUE será implementado:** Descrição detalhada da funcionalidade, correção ou refatoração, seu propósito de negócio e impactos esperados.
   - 🛠️ **COMO será implementado:** Detalhamento técnico passo a passo, incluindo quais arquivos serão criados/modificados, bibliotecas/dependências utilizadas, arquitetura e fluxo de dados.
2. O agente deve explicitamente pausar e solicitar autorização: *"Você autoriza a aplicação dessas alterações conforme detalhado acima?"*
3. **NENHUM código pode ser modificado antes de uma resposta afirmativa do usuário.**

---

## 🔤 PADRÃO DE COMMITS (ENGLISH ONLY - CONVENTIONAL COMMITS)

Toda e qualquer alteração de código comitada no Git deve seguir a especificação **Conventional Commits** estritamente em **inglês**:

- `feat:` Nova funcionalidade para o usuário final.
- `fix:` Correção de bug no sistema.
- `test:` Adição de novos testes ou correção de testes existentes.
- `refactor:` Alteração de código que não corrige bug nem adiciona funcionalidade.
- `chore:` Tarefas de manutenção, dependências, configs de build.
- `docs:` Alterações em documentação.
- `perf:` Melhoria de performance.
- `style:` Formatação, pontuação, espaçamento (sem mudança de lógica).

**Exemplos:**
- `feat: add cozy appointment booking calendar for mobile view`
- `fix: resolve appointment slot collision in concurrent bookings`
- `test: add stress tests for simultaneous booking submissions`

---

## 🧠 SINCRONIZAÇÃO MANDATÓRIA COM O AI-MEMORY

Para garantir a continuidade entre múltiplos agentes e sessões:
1. **Início da Tarefa:** Consultar `ai-memory/STATE.md` e `ai-memory/TASKS.md`.
2. **Atualização Contínua:** Se uma tarefa for dividida, pausada ou bloqueada, atualizar o `ai-memory/STATE.md`.
3. **Fim da Tarefa:**
   - Registrar no `ai-memory/CHANGELOG.md` o que foi alterado e o hash/mensagem do commit.
   - Atualizar o status correspondente em `ai-memory/TASKS.md` para `DONE` ou `IN_TESTING`.
   - Atualizar `ai-memory/STATE.md` com o handover para o próximo agente.

---

## 🎯 DIRETRIZES ESPECÍFICAS POR ESPECIALIDADE

### 1. 📱 Frontend (Mobile-First & Público Leigo)
- **Foco 100% Smartphone:** Viewports de 360px a 430px são a prioridade máxima absoluta.
- **Público Leigo:**
  - Zero jargões técnicos.
  - Textos simples, humanos e acolhedores.
  - Botões grandes, fáceis de tocar (hit target mínimo de 48x48px).
  - Fluxos lineares, diretos e sem passos desnecessários.
  - Feedback visual imediato para cada ação (loading, sucesso, confirmações claras).
- **Estética Aconchegante:**
  - Visual acolhedor, tons quentes e elegantes condizentes com um ambiente de barbearia de qualidade.
  - Tipografia legível e contrastes confortáveis.

### 2. ⚙️ Backend (Escalabilidade & Boas Práticas)
- **Arquitetura Limpa:** Separação estrita de responsabilidades (controllers, services/use-cases, repositories/models).
- **Escalabilidade & Confiabilidade:**
  - Validação estrita de entrada de dados.
  - Tratamento de concorrência (ex: evitar agendamentos duplicados no mesmo horário).
  - Tratamento centralizado de erros e respostas padronizadas.
  - Código limpo, desacoplado e tipado.

### 3. 🧪 Tester (Estresse, CI/CD & Zero Regressões)
- **Cobertura Contínua:** Nenhuma feature é considerada concluída sem testes automatizados que validem caminhos felizes e de exceção.
- **Prevenção de Bugs Retornarem:**
  - Para todo bug reportado:
    1. Criar primeiro um teste automatizado que reproduza a falha (o teste deve falhar).
    2. Autorizar o backend/frontend a corrigir o bug.
    3. Validar que o teste agora passa (garantia contra regressão futura).
- **Conceitos de CI/CD:** Scripts reproduzíveis para execução automatizada de toda a suíte de testes.
