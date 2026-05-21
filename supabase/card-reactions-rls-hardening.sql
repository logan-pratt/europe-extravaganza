-- Apply in the Supabase SQL editor for project dyquwyawnueostbegbyg.
-- This removes broad anonymous update rights from card_reactions and replaces
-- direct table writes with a narrow RPC used by the static site.

alter table public.card_reactions enable row level security;

drop policy if exists "anon_read" on public.card_reactions;
drop policy if exists "anon_insert" on public.card_reactions;
drop policy if exists "anon_update" on public.card_reactions;
drop policy if exists "anon_read_reaction_feedback" on public.card_reactions;
drop policy if exists "admin_manage_card_reactions" on public.card_reactions;

alter table public.card_reactions
  drop constraint if exists card_reactions_upsert_key;

drop index if exists public.card_reactions_upsert_key;

alter table public.card_reactions
  add constraint card_reactions_owner_upsert_key
  unique (trip_slug, card_id, author_key, client_id);

revoke all on public.card_reactions from anon;

grant select (trip_slug, card_id, card_type, author_name, author_key, reaction, note, updated_at)
  on public.card_reactions to anon;

create policy "anon_read_reaction_feedback"
on public.card_reactions
for select
to anon
using (true);

create policy "admin_manage_card_reactions"
on public.card_reactions
for all
to authenticated
using (true)
with check (true);

create or replace function public.upsert_card_reaction(
  p_trip_slug text,
  p_card_id text,
  p_card_type text,
  p_author_name text,
  p_reaction text,
  p_note text,
  p_client_id text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  clean_trip text := lower(trim(p_trip_slug));
  clean_card_id text := trim(p_card_id);
  clean_author text := trim(p_author_name);
  clean_reaction text := lower(trim(coalesce(p_reaction, '')));
  clean_client_id text := trim(p_client_id);
begin
  if clean_trip not in ('lisbon', 'galway', 'dublin', 'london') then
    raise exception 'Invalid trip slug';
  end if;

  if clean_card_id = '' or clean_author = '' or clean_client_id = '' then
    raise exception 'Missing required reaction field';
  end if;

  if clean_author not in ('Logan', 'Emily', 'Ashley', 'Max') then
    raise exception 'Invalid author';
  end if;

  if clean_reaction not in ('', 'love', 'maybe', 'nope', 'concern') then
    raise exception 'Invalid reaction';
  end if;

  insert into public.card_reactions (
    trip_slug,
    card_id,
    card_type,
    author_name,
    author_key,
    reaction,
    note,
    client_id,
    updated_at
  )
  values (
    clean_trip,
    clean_card_id,
    coalesce(nullif(trim(p_card_type), ''), 'activity'),
    clean_author,
    lower(clean_author),
    clean_reaction,
    left(coalesce(p_note, ''), 2000),
    clean_client_id,
    now()
  )
  on conflict (trip_slug, card_id, author_key, client_id)
  do update set
    card_type = excluded.card_type,
    author_name = excluded.author_name,
    reaction = excluded.reaction,
    note = excluded.note,
    updated_at = excluded.updated_at;
end;
$$;

revoke all on function public.upsert_card_reaction(text, text, text, text, text, text, text) from public;
grant execute on function public.upsert_card_reaction(text, text, text, text, text, text, text) to anon;

