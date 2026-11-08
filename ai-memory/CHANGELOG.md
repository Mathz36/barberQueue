# AI-Memory: Registro Histórico de Mudanças (CHANGELOG)

Todas as alterações significativas no projeto são registradas aqui em ordem cronológica reversa, acompanhadas da mensagem de commit correspondente (sempre em inglês no git).

---

## [1.4.0] - 2026-11-08

### Desacoplamento Completo de Arquivos Locais e 100% Supabase
- **Commit:** `chore: remove local data json directory and rely on supabase storage`
  - Remoção definitiva da pasta `data/` do repositório no GitHub (zero arquivos JSON versionados).
  - Configuração do `.gitignore` para ignorar `data/`.
  - Atualização de [`supabase/schema.sql`](supabase/schema.sql) com dados 100% modelo/demonstrativos para novos clones.
  - Constantes de fallback centralizadas em código TypeScript em [`src/lib/storage.ts`](src/lib/storage.ts).

---

## [1.3.2] - 2026-11-08

### Mensagens Claras de Horário de Encerramento e Abertura
- **Commit:** `feat: improve closed status message showing exact closing and opening hours`
  - Exibição destacada do horário exato de encerramento (`Nosso expediente de hoje encerrou às HH:MM`) quando o horário atual for posterior ao fechamento.
  - Exibição de badge dinâmico (`EXPEDIENTE ENCERRADO` vs `ABRE ÀS HH:MM`) e textos acolhedores orientando o agendamento no calendário.
  - Testes automatizados atualizados e validados.

---

## [1.3.1] - 2026-11-08

### Card Ao Vivo Inteligente (Status de Almoço e Fechamento)
- **Commit:** `feat: display closed and lunch status on client live queue card`
  - Implementação de `getLiveBarberStatus()` em [`src/lib/storage.ts`](src/lib/storage.ts) com fuso horário `America/Sao_Paulo`.
  - Exibição de card âmbar com aviso de retorno durante o horário de almoço (`Fechada para Almoço - Retorno previsto às HH:MM`).
  - Exibição de status de fechamento antes de abrir, após fechar, em dias de folga (ex: Domingo) ou dias bloqueados/feriados.
  - Testes automatizados cobrindo todos os cenários em [`tests/live-status.test.ts`](tests/live-status.test.ts) (29 testes verdes).

---

## [1.3.0] - 2026-11-08

### Migração para Supabase e Cron Keep-Alive na Vercel
- **Commit:** `feat: migrate storage to supabase with image bucket and vercel keep-alive cron`
  - Implementação de adaptador híbrido de persistência em [`src/lib/storage.ts`](src/lib/storage.ts): armazena em tabela `app_data` no Supabase (JSONB) quando configurado, com fallback automático para arquivos locais em testes/desenvolvimento.
  - Upload de avatar e banner diretamente para o Bucket de Storage público `barbearia` do Supabase em [`src/app/api/admin/upload/route.ts`](src/app/api/admin/upload/route.ts).
  - Prevenção automática de inatividade de 14 dias do Supabase via Vercel Cron Job em [`vercel.json`](vercel.json) e rota de ping [`src/app/api/cron/keep-alive/route.ts`](src/app/api/cron/keep-alive/route.ts).
  - Criação do script de 1 clique [`supabase/schema.sql`](supabase/schema.sql) com tabelas, políticas de segurança e seed inicial da Thiago Barbearia.
  - Modelos de configuração em [`.env.example`](.env.example) e [`.env.local`](.env.local).

---

## [1.2.5] - 2026-11-08

### Restauração de Dados de Produção para Repositório Privado
- **Commit:** `chore: restore production profile and appointment data for private repository`
  - Restauração do perfil real de produção em [`data/profile.json`](data/profile.json) (Thiago Barbearia, WhatsApp, Instagram e configurações visuais).
  - Restauração de agendamentos reais e bloqueios de agenda.
  - Liberação de uploads no `.gitignore` para versionamento em repositório privado.

---

## [1.2.4] - 2026-11-08

### Layout e Rodapé de Autoria
- **Commit:** `feat: add developer credits footer with github link`
  - Inclusão de rodapé (`footer`) em [`src/app/layout.tsx`](src/app/layout.tsx) com créditos "Desenvolvido por mathz36".
  - Link clicável e seguro (`target="_blank"` e `rel="noopener noreferrer"`) apontando para `https://github.com/mathz36` com destaque dourado estilizado.

---

## [1.2.3] - 2026-11-08

### Experiência do Cliente e Microinterações Mobile
- **Commit:** `feat: add fluid animation and smooth transition for day selection`
  - Transição suave e orgânica ao clicar nos dias da semana no smartphone: auto-rolagem suave centralizada (`scrollIntoView({ behavior: 'smooth', inline: 'center' })`).
  - Animação tátil nos botões de dias com escala suave (`scale-105`), realce dourado e transição com curva `cubic-bezier`.
  - Transição crossfade e slide-up suave nos slots de horário com `.animate-fade-slide-up` e skeleton cards fluidos durante troca de dia, eliminando qualquer piscar abrupto da tela.

---

## [1.2.2] - 2026-11-08

### Segurança e Integridade de Dados
- **Commit:** `fix: isolate test data directory from production storage to prevent resetting profile and appointments`
  - Separação completa do ambiente de testes automatizados (`data-test/` e `uploads-test/`) da base de dados real (`data/` e `uploads/`).
  - Blindagem permanente do perfil real da barbearia (Thiago Barbearia, avatar, banner, bio e agendamentos), garantindo que execuções de testes nunca mais resetem os dados do usuário.

---

## [1.2.1] - 2026-11-08

### Correções (Bugfix com Zero Regression)
- **Commit:** `fix: display appointment target date instead of creation date in admin agenda`
  - Exibição destacada da data real do corte (`10/11/2026`) no admin.
  - Abas de filtro na agenda ("Por Dia" e "Toda a Semana").

---

## [1.2.0] - 2026-11-08

### Entregas
- **Commit:** `feat: add toast notifications and collapsible dropdown sections to admin dashboard`
  - Notificações de feedback ("Configuração Salva" e "Erro: ...").
  - Seções expansíveis tipo dropdown / acordeão.

---

## [1.1.0] - 2026-11-08

### Entregas
- **Commit:** `feat: implement direct image upload with overwrite and weekly schedule with lunch break`

---

## [1.0.0] - 2026-11-08

### Entregas
- **Commit:** `feat: build cozy mobile-first client and admin interfaces with dynamic theme`
- **Commit:** `feat: implement json storage layer with weekly retention and backend rest apis`
- **Commit:** `chore: initialize multi-agent workspace and persistent ai-memory`
