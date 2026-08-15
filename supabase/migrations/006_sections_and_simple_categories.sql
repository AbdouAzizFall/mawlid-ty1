-- ============================================================
-- MAWLID THIAROYE YEUMBEUL 1 — Sections d'âge + catégories simplifiées
-- Migration : 006_sections_and_simple_categories.sql
-- ============================================================

-- Section d'âge du participant
create type section_enum as enum ('section1', 'section2', 'section3');
-- section1 = moins de 13 ans / section2 = moins de 18 ans / section3 = 18 ans et plus

alter table public.participants add column if not exists section section_enum;

-- On désactive les anciennes catégories basées sur des montants fixes
-- (sans les supprimer, pour ne pas casser les inscriptions déjà existantes)
update public.participation_categories set is_active = false;

-- Nouvelles catégories : Participation (par défaut) ou Autre
insert into public.participation_categories (label, amount, is_special, display_order) values
  ('Participation', null, false, 1),
  ('Autre', null, true, 2);
