-- ============================================================
-- MAWLID THIAROYE YEUMBEUL 1 — Row Level Security
-- Migration : 002_rls_policies.sql
-- ============================================================

alter table public.profiles enable row level security;
alter table public.participants enable row level security;
alter table public.revenues enable row level security;
alter table public.expenses enable row level security;
alter table public.attachments enable row level security;
alter table public.audit_logs enable row level security;
alter table public.participation_categories enable row level security;
alter table public.revenue_categories enable row level security;
alter table public.expense_categories enable row level security;
alter table public.settings enable row level security;

-- Fonction utilitaire : rôle de l'utilisateur connecté
create or replace function public.current_user_role()
returns user_role as $$
  select role from public.profiles where id = auth.uid();
$$ language sql stable security definer;

-- ------------------------------------------------------------
-- PROFILES : chacun voit tout le monde (équipe restreinte),
-- mais seul un admin peut modifier les rôles
-- ------------------------------------------------------------
create policy "profiles_select_authenticated" on public.profiles
  for select using (auth.role() = 'authenticated');

create policy "profiles_update_admin_only" on public.profiles
  for update using (public.current_user_role() = 'admin');

-- ------------------------------------------------------------
-- CATÉGORIES : lecture pour tous les connectés, écriture admin
-- ------------------------------------------------------------
create policy "categories_select" on public.participation_categories
  for select using (auth.role() = 'authenticated');
create policy "categories_write_admin" on public.participation_categories
  for all using (public.current_user_role() = 'admin');

create policy "rev_cat_select" on public.revenue_categories
  for select using (auth.role() = 'authenticated');
create policy "rev_cat_write_admin" on public.revenue_categories
  for all using (public.current_user_role() = 'admin');

create policy "exp_cat_select" on public.expense_categories
  for select using (auth.role() = 'authenticated');
create policy "exp_cat_write_admin" on public.expense_categories
  for all using (public.current_user_role() = 'admin');

-- ------------------------------------------------------------
-- PARTICIPANTS : admin + gestionnaire_inscriptions en écriture,
-- lecture pour tous les connectés (utile pour les stats croisées)
-- ------------------------------------------------------------
create policy "participants_select" on public.participants
  for select using (auth.role() = 'authenticated');

create policy "participants_insert" on public.participants
  for insert with check (
    public.current_user_role() in ('admin', 'gestionnaire_inscriptions')
  );

create policy "participants_update" on public.participants
  for update using (
    public.current_user_role() in ('admin', 'gestionnaire_inscriptions')
  );

create policy "participants_delete" on public.participants
  for delete using (public.current_user_role() = 'admin');

-- ------------------------------------------------------------
-- RECETTES : admin + gestionnaire_finances
-- ------------------------------------------------------------
create policy "revenues_select" on public.revenues
  for select using (auth.role() = 'authenticated');

create policy "revenues_insert" on public.revenues
  for insert with check (
    public.current_user_role() in ('admin', 'gestionnaire_finances')
  );

create policy "revenues_update" on public.revenues
  for update using (
    public.current_user_role() in ('admin', 'gestionnaire_finances')
  );

create policy "revenues_delete" on public.revenues
  for delete using (public.current_user_role() = 'admin');

-- ------------------------------------------------------------
-- DÉPENSES : admin + gestionnaire_finances
-- ------------------------------------------------------------
create policy "expenses_select" on public.expenses
  for select using (auth.role() = 'authenticated');

create policy "expenses_insert" on public.expenses
  for insert with check (
    public.current_user_role() in ('admin', 'gestionnaire_finances')
  );

create policy "expenses_update" on public.expenses
  for update using (
    public.current_user_role() in ('admin', 'gestionnaire_finances')
  );

create policy "expenses_delete" on public.expenses
  for delete using (public.current_user_role() = 'admin');

-- ------------------------------------------------------------
-- PIÈCES JOINTES
-- ------------------------------------------------------------
create policy "attachments_select" on public.attachments
  for select using (auth.role() = 'authenticated');
create policy "attachments_insert" on public.attachments
  for insert with check (auth.role() = 'authenticated');

-- ------------------------------------------------------------
-- AUDIT LOGS : lecture réservée aux admins, écriture système only
-- (insertion faite via triggers/service role, jamais côté client)
-- ------------------------------------------------------------
create policy "audit_logs_select_admin" on public.audit_logs
  for select using (public.current_user_role() = 'admin');

-- ------------------------------------------------------------
-- SETTINGS : lecture tous, écriture admin
-- ------------------------------------------------------------
create policy "settings_select" on public.settings
  for select using (auth.role() = 'authenticated');
create policy "settings_write_admin" on public.settings
  for all using (public.current_user_role() = 'admin');
