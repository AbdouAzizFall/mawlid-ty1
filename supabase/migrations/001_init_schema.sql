-- ============================================================
-- MAWLID THIAROYE YEUMBEUL 1 — Schéma initial
-- Migration : 001_init_schema.sql
-- ============================================================

-- Extensions utiles
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. RÔLES ET UTILISATEURS
-- ============================================================

create type user_role as enum ('admin', 'gestionnaire_inscriptions', 'gestionnaire_finances');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  role user_role not null default 'gestionnaire_inscriptions',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 2. CATÉGORIES DE PARTICIPATION (configurables)
-- ============================================================

create table public.participation_categories (
  id uuid primary key default uuid_generate_v4(),
  label text not null,               -- ex: "10 000 FCFA"
  amount numeric(12,2),              -- montant fixe, null si montant libre
  is_special boolean not null default false, -- true pour "Autre participation" / "Bienfaiteur"
  is_active boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Catégories de départ
insert into public.participation_categories (label, amount, is_special, display_order) values
  ('10 000 FCFA', 10000, false, 1),
  ('12 000 FCFA', 12000, false, 2),
  ('17 000 FCFA', 17000, false, 3),
  ('20 000 FCFA', 20000, false, 4),
  ('Autre participation', null, true, 5),
  ('Bienfaiteur', null, true, 6);

-- ============================================================
-- 3. PARTICIPANTS
-- ============================================================

create type sexe_enum as enum ('homme', 'femme', 'non_renseigne');

create table public.participants (
  id uuid primary key default uuid_generate_v4(),
  prenom text not null,
  nom text not null,
  sexe sexe_enum not null default 'non_renseigne',
  telephone text,
  montant numeric(12,2) not null check (montant >= 0),
  category_id uuid not null references public.participation_categories(id),
  observation text,
  registered_at date not null default current_date,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz -- soft delete pour garder l'historique
);

create index idx_participants_nom_prenom on public.participants (nom, prenom);
create index idx_participants_telephone on public.participants (telephone);
create index idx_participants_category on public.participants (category_id);
create index idx_participants_registered_at on public.participants (registered_at);
create index idx_participants_deleted_at on public.participants (deleted_at);

-- ============================================================
-- 4. RECETTES (participations + dons + autres)
-- ============================================================

create table public.revenue_categories (
  id uuid primary key default uuid_generate_v4(),
  label text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.revenue_categories (label) values
  ('Participation'), ('Don'), ('Bienfaiteur'), ('Contribution exceptionnelle'), ('Autre');

create table public.revenues (
  id uuid primary key default uuid_generate_v4(),
  source text not null,
  montant numeric(12,2) not null check (montant >= 0),
  category_id uuid references public.revenue_categories(id),
  date date not null default current_date,
  responsable_id uuid references public.profiles(id),
  moyen_paiement text,           -- espèces, wave, orange money, virement...
  commentaire text,
  justificatif_url text,         -- lien Supabase Storage
  participant_id uuid references public.participants(id), -- null si recette indépendante
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index idx_revenues_date on public.revenues (date);
create index idx_revenues_participant on public.revenues (participant_id);

-- ============================================================
-- 5. DÉPENSES
-- ============================================================

create table public.expense_categories (
  id uuid primary key default uuid_generate_v4(),
  label text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.expense_categories (label) values
  ('Alimentation'), ('Transport'), ('Sonorisation'), ('Décoration'),
  ('Communication'), ('Location'), ('Sécurité'), ('Impression'), ('Autres');

create table public.expenses (
  id uuid primary key default uuid_generate_v4(),
  description text not null,
  category_id uuid references public.expense_categories(id),
  montant numeric(12,2) not null check (montant >= 0),
  beneficiaire text,
  date date not null default current_date,
  moyen_paiement text,
  responsable_id uuid references public.profiles(id),
  commentaire text,
  justificatif_url text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index idx_expenses_date on public.expenses (date);
create index idx_expenses_category on public.expenses (category_id);

-- ============================================================
-- 6. PIÈCES JOINTES (généralisées, optionnel si tu préfères
--    les champs justificatif_url ci-dessus)
-- ============================================================

create table public.attachments (
  id uuid primary key default uuid_generate_v4(),
  entity_type text not null,     -- 'revenue' | 'expense' | 'participant'
  entity_id uuid not null,
  file_url text not null,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ============================================================
-- 7. AUDIT LOGS
-- ============================================================

create table public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references public.profiles(id),
  action text not null,          -- 'create' | 'update' | 'delete'
  entity_type text not null,     -- 'participant' | 'revenue' | 'expense'
  entity_id uuid not null,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create index idx_audit_logs_entity on public.audit_logs (entity_type, entity_id);

-- ============================================================
-- 8. PARAMÈTRES GÉNÉRAUX (nom appli, logo, etc.)
-- ============================================================

create table public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

insert into public.settings (key, value) values
  ('app_name', '"Mawlid — Thiaroye Yeumbeul 1"'),
  ('logo_url', 'null');

-- ============================================================
-- 9. TRIGGERS updated_at
-- ============================================================

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_participants_updated_at before update on public.participants
  for each row execute function public.set_updated_at();
create trigger trg_revenues_updated_at before update on public.revenues
  for each row execute function public.set_updated_at();
create trigger trg_expenses_updated_at before update on public.expenses
  for each row execute function public.set_updated_at();
create trigger trg_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============================================================
-- 10. TRIGGER : une inscription crée automatiquement sa recette
--     (évite le double comptage — une seule source de vérité)
-- ============================================================

create or replace function public.create_revenue_from_participant()
returns trigger as $$
declare
  v_category_id uuid;
begin
  select id into v_category_id from public.revenue_categories where label = 'Participation' limit 1;

  insert into public.revenues (source, montant, category_id, date, participant_id, created_by, responsable_id)
  values (
    trim(new.prenom || ' ' || new.nom),
    new.montant,
    v_category_id,
    new.registered_at,
    new.id,
    new.created_by,
    new.created_by
  );
  return new;
end;
$$ language plpgsql;

create trigger trg_participant_creates_revenue
  after insert on public.participants
  for each row execute function public.create_revenue_from_participant();

-- Si le montant d'une inscription est modifié, on met à jour la recette liée
create or replace function public.sync_revenue_on_participant_update()
returns trigger as $$
begin
  if new.montant is distinct from old.montant or new.registered_at is distinct from old.registered_at then
    update public.revenues
    set montant = new.montant, date = new.registered_at
    where participant_id = new.id;
  end if;

  if new.deleted_at is not null and old.deleted_at is null then
    update public.revenues set deleted_at = new.deleted_at where participant_id = new.id;
  end if;

  return new;
end;
$$ language plpgsql;

create trigger trg_sync_revenue_on_participant_update
  after update on public.participants
  for each row execute function public.sync_revenue_on_participant_update();
