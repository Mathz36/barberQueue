# AI-Memory: Current Project State (Estado Atual)

> **Última Atualização:** 2026-11-08  
> **Status Geral:** CONCLUÍDO - TSK-031 (Responsividade do Admin no Mobile / iPhone 11)  
> **Fase Atual:** Fase 12 - Refinamento Mobile UX / Admin Responsivo  

---

## 📌 Contexto Atual e Entregas Recentes

- **TSK-031 Concluído:** Otimização dos formulários, inputs de data/hora, grids e espaçamento no painel administrativo eliminando qualquer estouro lateral em smartphones finos (iPhone 11, iPhone SE).
- **Ajustes de WebKit:** Normalização de `input[type="date"]` e `input[type="time"]` para o Safari no iOS com neutralização de largura mínima intrínseca e alinhamento de texto.
- **Campos Mobile Confortáveis:** Empilhamento de WhatsApp e Instagram (`grid-cols-1 sm:grid-cols-2`) para digitação com polegar sem compressão.
- **Trava de Viewport:** Adicionado `overflow-x: hidden` no layout principal e no body.
- **Suíte de Testes:** 29 testes automatizados passando 100% verde (`npm test`).
- **Build de Produção:** Next.js 15 compilando sem nenhum erro.

**Onde Paramos:**
Painel do Admin 100% responsivo, alinhado e sem estouro de layout em telas de qualquer tamanho.

- **Remoção de Arquivos JSON:** A pasta `data/` foi completamente removida do repositório no GitHub. Zero arquivos JSON de dados estão versionados.
- **Supabase como Fonte Única:** Toda a persistência em produção é gerenciada diretamente no Supabase (`app_data` e bucket `barbearia`).
- **Schema Demonstrativo:** Criado [`supabase/schema.sql`](supabase/schema.sql) com sementes 100% mockadas/demonstrativas (`Barbearia Modelo`, telefone `(11) 99999-9999`) para permitir que qualquer pessoa que clone o projeto possa inicializar seu próprio banco sem expor dados reais.
- **Suíte de Testes:** 29 testes automatizados passando 100% verde (`npm test`).
- **Build de Produção:** Next.js 15 compilando sem nenhum alerta ou erro.

**Onde Paramos:**
Repositório no GitHub 100% anônimo e seguro. Dados reais operando exclusivamente dentro do Supabase pessoal do usuário.
