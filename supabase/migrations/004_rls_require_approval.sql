-- ============================================================
-- MAWLID THIAROYE YEUMBEUL 1 — Renforcement RLS avec is_approved
-- Migration : 004_rls_require_approval.sql
-- ============================================================

drop policy if exists "participants_insert" on public.participants;
create policy "participants_insert" on public.participants
  for insert with check (
    public.current_user_approved()
    and public.current_user_role() in ('admin', 'gestionnaire_inscriptions')
  );

drop policy if exists "participants_update" on public.participants;
create policy "participants_update" on public.participants
  for update using (
    public.current_user_approved()
    and public.current_user_role() in ('admin', 'gestionnaire_inscriptions')
  );

drop policy if exists "revenues_insert" on public.revenues;
create policy "revenues_insert" on public.revenues
  for insert with check (
    public.current_user_approved()
    and public.current_user_role() in ('admin', 'gestionnaire_finances')
  );

drop policy if exists "revenues_update" on public.revenues;
create policy "revenues_update" on public.revenues
  for update using (
    public.current_user_approved()
    and public.current_user_role() in ('admin', 'gestionnaire_finances')
  );

drop policy if exists "expenses_insert" on public.expenses;
create policy "expenses_insert" on public.expenses
  for insert with check (
    public.current_user_approved()
    and public.current_user_role() in ('admin', 'gestionnaire_finances')
  );

drop policy if exists "expenses_update" on public.expenses;
create policy "expenses_update" on public.expenses
  for update using (
    public.current_user_approved()
    and public.current_user_role() in ('admin', 'gestionnaire_finances')
  );

-- Un admin peut approuver/modifier les rôles des autres profils
drop policy if exists "profiles_update_admin_only" on public.profiles;
create policy "profiles_update_admin_only" on public.profiles
  for update using (
    public.current_user_role() = 'admin'
    or auth.uid() = id  -- chacun peut modifier son propre nom/téléphone
  );
