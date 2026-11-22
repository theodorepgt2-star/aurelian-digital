-- Contact requests table (already applied to project cljmiqiyhgsveeplzeyb)
create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 200),
  phone text check (char_length(phone) <= 40),
  project_type text not null check (project_type in ('freelancer','restaurant','other')),
  message text not null check (char_length(message) between 1 and 2000)
);

alter table public.contact_requests enable row level security;

create policy "anon can submit contact requests"
  on public.contact_requests
  for insert
  to anon
  with check (true);

-- Table-level privilege is required in addition to the RLS policy.
grant insert on table public.contact_requests to anon;
