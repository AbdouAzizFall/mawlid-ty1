-- ============================================================
-- MAWLID THIAROYE YEUMBEUL 1 — Auth
-- Migration : 003_auth_trigger.sql
-- ============================================================

-- Colonne pour savoir si un compte est validé par un admin
alter table public.profiles add column if not exists is_approved boolean not null default false;

create or replace function public.handle_new_user()
returns trigger as $$
declare
  v_existing_count int;
  v_role user_role;
  v_approved boolean;
begin
  select count(*) into v_existing_count from public.profiles;

  if v_existing_count = 0 then
    -- Premier compte de l'application : admin, approuvé automatiquement
    v_role := 'admin';
    v_approved := true;
  else
    -- Comptes suivants : rôle par défaut, en attente de validation par un admin
    v_role := 'gestionnaire_inscriptions';
    v_approved := false;
  end if;

  insert into public.profiles (id, full_name, role, is_active, is_approved)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    v_role,
    true,
    v_approved
  );

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Un compte non approuvé ne doit rien pouvoir faire : on adapte les policies
-- existantes pour exiger is_approved = true en plus du rôle.

create or replace function public.current_user_approved()
returns boolean as $$
  select coalesce(is_approved, false) and coalesce(is_active, false)
  from public.profiles where id = auth.uid();
$$ language sql stable security definer;
