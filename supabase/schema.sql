-- Saboot analytics schema for Supabase (Postgres).
-- Run once: Supabase dashboard → SQL Editor → paste this file → Run. Safe to run again.
-- Stores only anonymous daily counts. Row Level Security is on with no policies, so only the
-- server (service role key, kept in Vercel) can read or write. The public anon key cannot.

create table if not exists public.pa_daily (
  day   date   not null,
  field text   not null,
  n     bigint not null default 0,
  primary key (day, field)
);
create table if not exists public.pa_uniq (
  day  date not null,
  kind text not null,          -- u = visitor (daily-salted hash), s = visit, sl = visit that made a list
  h    text not null,
  primary key (day, kind, h)
);
create table if not exists public.pa_log (
  id   bigserial primary key,
  kind text not null,          -- search | err
  t    timestamptz not null default now(),
  data jsonb not null
);
create index if not exists pa_log_kind_id on public.pa_log (kind, id desc);
create table if not exists public.pa_login (
  ip    text primary key,
  n     int not null,
  until timestamptz not null
);

alter table public.pa_daily enable row level security;
alter table public.pa_uniq  enable row level security;
alter table public.pa_log   enable row level security;
alter table public.pa_login enable row level security;

create or replace function public.pa_ingest(p_day date, p_inc jsonb, p_uniq jsonb, p_logs jsonb)
returns void language plpgsql set search_path = public as $$
begin
  insert into pa_daily (day, field, n)
    select p_day, key, value::bigint from jsonb_each_text(coalesce(p_inc, '{}'::jsonb))
  on conflict (day, field) do update set n = pa_daily.n + excluded.n;

  insert into pa_uniq (day, kind, h)
    select p_day, x->>0, x->>1 from jsonb_array_elements(coalesce(p_uniq, '[]'::jsonb)) x
  on conflict do nothing;

  insert into pa_log (kind, data)
    select x->>0, x->1 from jsonb_array_elements(coalesce(p_logs, '[]'::jsonb)) x;

  -- Housekeeping, about 1 call in 50: keep the latest 1,000 searches and 200 errors; drop counts older than 400 days.
  if random() < 0.02 then
    delete from pa_log where kind = 'search' and id < coalesce((select id from pa_log where kind = 'search' order by id desc offset 999 limit 1), 0);
    delete from pa_log where kind = 'report' and id < coalesce((select id from pa_log where kind = 'report' order by id desc offset 499 limit 1), 0);
    delete from pa_log where kind = 'err' and id < coalesce((select id from pa_log where kind = 'err' order by id desc offset 199 limit 1), 0);
    delete from pa_daily where day < current_date - 400;
    delete from pa_uniq  where day < current_date - 400;
    delete from pa_login where until < now();
  end if;
end $$;

create or replace function public.pa_stats(p_days date[], p_prev date[])
returns jsonb language sql stable set search_path = public as $$
  select jsonb_build_object(
    'days', (select coalesce(jsonb_agg(jsonb_build_object(
                'd', to_char(d, 'YYYY-MM-DD'),
                'h', (select coalesce(jsonb_object_agg(field, n), '{}'::jsonb) from pa_daily where day = d),
                'u', (select count(*) from pa_uniq where day = d and kind = 'u'),
                's', (select count(*) from pa_uniq where day = d and kind = 's'),
                'sl', (select count(*) from pa_uniq where day = d and kind = 'sl')) order by d), '[]'::jsonb)
             from unnest(p_days) d),
    'prev', (select coalesce(jsonb_object_agg(field, total), '{}'::jsonb)
             from (select field, sum(n) total from pa_daily where day = any(p_prev) group by field) x),
    'ucur',  (select count(*) from pa_uniq where day = any(p_days) and kind = 'u'),
    'uprev', (select count(*) from pa_uniq where day = any(p_prev) and kind = 'u'),
    'scur',  (select count(distinct h) from pa_uniq where day = any(p_days) and kind = 's'),
    'sprev', (select count(distinct h) from pa_uniq where day = any(p_prev) and kind = 's'),
    'slcur', (select count(distinct h) from pa_uniq where day = any(p_days) and kind = 'sl'),
    'slprev',(select count(distinct h) from pa_uniq where day = any(p_prev) and kind = 'sl'),
    'v',     (select coalesce(jsonb_object_agg(kind, c), '{}'::jsonb) from (select kind, count(distinct h) c from pa_uniq where day = any(p_days) and kind like 'v:%' group by kind) v),
    'vprev', (select coalesce(jsonb_object_agg(kind, c), '{}'::jsonb) from (select kind, count(distinct h) c from pa_uniq where day = any(p_prev) and kind like 'v:%' group by kind) v),
    'search',(select coalesce(jsonb_agg(data order by id desc), '[]'::jsonb) from (select id, data from pa_log where kind = 'search' order by id desc limit 1000) s),
    'err',   (select coalesce(jsonb_agg(data order by id desc), '[]'::jsonb) from (select id, data from pa_log where kind = 'err' order by id desc limit 60) e),
    'rep',   (select coalesce(jsonb_agg(data order by id desc), '[]'::jsonb) from (select id, data from pa_log where kind = 'report' order by id desc limit 200) r)
  )
$$;

create or replace function public.pa_login_hit(p_ip text)
returns int language sql set search_path = public as $$
  insert into pa_login (ip, n, until) values (p_ip, 1, now() + interval '15 minutes')
  on conflict (ip) do update set
    n = case when pa_login.until < now() then 1 else pa_login.n + 1 end,
    until = case when pa_login.until < now() then now() + interval '15 minutes' else pa_login.until end
  returning n
$$;

create or replace function public.pa_login_clear(p_ip text)
returns void language sql set search_path = public as $$ delete from pa_login where ip = p_ip $$;

-- Only the server may call these.
revoke all on function public.pa_ingest(date, jsonb, jsonb, jsonb) from public, anon, authenticated;
revoke all on function public.pa_stats(date[], date[])           from public, anon, authenticated;
revoke all on function public.pa_login_hit(text)                 from public, anon, authenticated;
revoke all on function public.pa_login_clear(text)               from public, anon, authenticated;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    grant execute on function public.pa_ingest(date, jsonb, jsonb, jsonb) to service_role;
    grant execute on function public.pa_stats(date[], date[])           to service_role;
    grant execute on function public.pa_login_hit(text)                 to service_role;
    grant execute on function public.pa_login_clear(text)               to service_role;
  end if;
end $$;

-- Shared translation cache: each app string is translated once per language, then reused for everyone.
create table if not exists public.pa_tr (
  lang text not null,
  h    text not null,
  src  text not null,
  tr   text not null,
  at   timestamptz not null default now(),
  primary key (lang, h)
);
alter table public.pa_tr enable row level security;

create or replace function public.pa_tr_get(p_lang text, p_h text[])
returns jsonb language sql stable set search_path = public as $$
  select coalesce(jsonb_object_agg(h, tr), '{}'::jsonb) from pa_tr where lang = p_lang and h = any(p_h)
$$;
create or replace function public.pa_tr_put(p_lang text, p_items jsonb)
returns void language sql set search_path = public as $$
  insert into pa_tr (lang, h, src, tr)
    select p_lang, x->>0, x->>1, x->>2 from jsonb_array_elements(coalesce(p_items, '[]'::jsonb)) x
  on conflict (lang, h) do update set tr = excluded.tr, src = excluded.src, at = now()
$$;
revoke all on function public.pa_tr_get(text, text[]) from public, anon, authenticated;
revoke all on function public.pa_tr_put(text, jsonb)  from public, anon, authenticated;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    grant execute on function public.pa_tr_get(text, text[]) to service_role;
    grant execute on function public.pa_tr_put(text, jsonb)  to service_role;
  end if;
end $$;

-- Verified daily totals for the public impact ledger (/api/impact): distinct networks per day where a real person did each thing.
create or replace function public.pa_ledger(p_days date[])
returns jsonb language sql stable set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object('d', to_char(d, 'YYYY-MM-DD'), 'v',
    (select coalesce(jsonb_object_agg(kind, c), '{}'::jsonb) from (select kind, count(*) c from pa_uniq where day = d and kind like 'v:%' group by kind) x),
    'rejected', (select coalesce(sum(n), 0) from pa_daily where day = d and field in ('x:origin', 'x:token'))) order by d), '[]'::jsonb)
  from unnest(p_days) d
$$;
revoke all on function public.pa_ledger(date[]) from public, anon, authenticated;
grant execute on function public.pa_ledger(date[]) to service_role;
