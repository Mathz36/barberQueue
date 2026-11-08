-- ==============================================================================
-- SCHEMA DO SUPABASE: BARBEARIA (CONFIGURAÇÃO DE 1 CLIQUE)
-- Cole este script completo no SQL Editor do painel do seu projeto no Supabase
-- ==============================================================================

-- 1. Tabela unificada para dados da barbearia (JSONB de alta performance)
create table if not exists app_data (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- Habilita Row Level Security
alter table app_data enable row level security;

-- Remove políticas antigas caso já existam para evitar conflitos
drop policy if exists "Leitura pública de dados da barbearia" on app_data;
drop policy if exists "Escrita geral de dados da barbearia" on app_data;

-- Políticas de acesso
create policy "Leitura pública de dados da barbearia"
  on app_data for select
  using (true);

create policy "Escrita geral de dados da barbearia"
  on app_data for all
  using (true)
  with check (true);

-- 2. Criação do Bucket de Armazenamento para Uploads de Fotos (Avatar e Banner)
insert into storage.buckets (id, name, public)
values ('barbearia', 'barbearia', true)
on conflict (id) do update set public = true;

-- Políticas de Storage para o bucket 'barbearia'
drop policy if exists "Acesso público às fotos da barbearia" on storage.objects;
drop policy if exists "Upload de fotos na barbearia" on storage.objects;
drop policy if exists "Atualização de fotos na barbearia" on storage.objects;
drop policy if exists "Remoção de fotos na barbearia" on storage.objects;

create policy "Acesso público às fotos da barbearia"
  on storage.objects for select
  using (bucket_id = 'barbearia');

create policy "Upload de fotos na barbearia"
  on storage.objects for insert
  with check (bucket_id = 'barbearia');

create policy "Atualização de fotos na barbearia"
  on storage.objects for update
  using (bucket_id = 'barbearia');

create policy "Remoção de fotos na barbearia"
  on storage.objects for delete
  using (bucket_id = 'barbearia');

-- 3. Carga Inicial de Dados de Exemplo (Seed Demonstrativo para Novos Clones)
insert into app_data (key, value)
values 
  ('profile', '{
    "name": "Barbearia Modelo",
    "bio": "Cortes clássicos e modernos, barba na navalha e atendimento acolhedor. Agende seu horário ou acompanhe a fila ao vivo!",
    "avatarUrl": "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=400&q=80",
    "bannerUrl": "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80",
    "whatsappNumber": "5511999999999",
    "instagramUrl": "https://instagram.com/barbearia",
    "primaryColor": "#121212",
    "secondaryColor": "#D4AF37",
    "adminPin": "1234"
  }'::jsonb),
  ('queue', '{
    "count": 0,
    "updatedAt": "2026-01-01T12:00:00.000Z"
  }'::jsonb),
  ('schedule', '{
    "days": [
      { "dayOfWeek": 1, "dayName": "Segunda-feira", "isOpen": true, "openTime": "09:00", "closeTime": "19:00", "lunchStart": "12:00", "lunchEnd": "13:00" },
      { "dayOfWeek": 2, "dayName": "Terça-feira", "isOpen": true, "openTime": "09:00", "closeTime": "19:00", "lunchStart": "12:00", "lunchEnd": "13:00" },
      { "dayOfWeek": 3, "dayName": "Quarta-feira", "isOpen": true, "openTime": "09:00", "closeTime": "19:00", "lunchStart": "12:00", "lunchEnd": "13:00" },
      { "dayOfWeek": 4, "dayName": "Quinta-feira", "isOpen": true, "openTime": "09:00", "closeTime": "19:00", "lunchStart": "12:00", "lunchEnd": "13:00" },
      { "dayOfWeek": 5, "dayName": "Sexta-feira", "isOpen": true, "openTime": "09:00", "closeTime": "20:00", "lunchStart": "12:00", "lunchEnd": "13:00" },
      { "dayOfWeek": 6, "dayName": "Sábado", "isOpen": true, "openTime": "08:00", "closeTime": "18:00", "lunchStart": "12:00", "lunchEnd": "13:00" },
      { "dayOfWeek": 0, "dayName": "Domingo", "isOpen": false, "openTime": "09:00", "closeTime": "14:00", "lunchStart": "", "lunchEnd": "" }
    ]
  }'::jsonb),
  ('blocked_days', '[]'::jsonb),
  ('appointments', '[]'::jsonb)
on conflict (key) do nothing;
