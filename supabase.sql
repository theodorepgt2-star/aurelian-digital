-- Contact requests table (current schema, applied to project cljmiqiyhgsveeplzeyb)
create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 120),
  phone text not null check (phone ~ '^[+0-9 ()-]{8,40}$'),
  project_type text not null check (project_type in ('freelancer','restaurant','other')),
  budget text check (budget in ('under_500','500_1000','1000_2500','over_2500','unsure')),
  message text check (char_length(message) <= 2000),
  email text check (char_length(email) <= 200)
);

alter table public.contact_requests enable row level security;

create policy "anon can submit contact requests"
  on public.contact_requests
  for insert
  to anon
  with check (true);

-- Table-level privilege is required in addition to the RLS policy.
grant insert on table public.contact_requests to anon;
