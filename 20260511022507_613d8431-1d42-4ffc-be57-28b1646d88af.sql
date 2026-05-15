
create table public.saved_experiences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  experience_slug text not null,
  note text,
  saved_at timestamptz not null default now(),
  unique (user_id, experience_slug)
);

create index saved_experiences_user_idx on public.saved_experiences (user_id, saved_at desc);

alter table public.saved_experiences enable row level security;

create policy "view own saved experiences" on public.saved_experiences
  for select using (auth.uid() = user_id);
create policy "save own experiences" on public.saved_experiences
  for insert with check (auth.uid() = user_id);
create policy "update own saved experiences" on public.saved_experiences
  for update using (auth.uid() = user_id);
create policy "delete own saved experiences" on public.saved_experiences
  for delete using (auth.uid() = user_id);
