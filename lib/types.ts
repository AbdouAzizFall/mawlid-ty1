export type UserRole = 'admin' | 'gestionnaire_inscriptions' | 'gestionnaire_finances'
export type Section = 'section1' | 'section2' | 'section3'

export interface Profile {
  id: string
  full_name: string
  phone: string | null
  role: UserRole
  is_active: boolean
  is_approved: boolean
}

export interface ParticipationCategory {
  id: string
  label: string
  amount: number | null
  is_special: boolean
  is_active: boolean
  display_order: number
}

export interface Participant {
  id: string
  prenom: string
  nom: string
  sexe: 'homme' | 'femme' | 'non_renseigne'
  section: Section | null
  telephone: string | null
  montant: number
  category_id: string
  observation: string | null
  registered_at: string
  participation_categories?: ParticipationCategory
}

export interface Revenue {
  id: string
  source: string
  montant: number
  category_id: string | null
  date: string
  moyen_paiement: string | null
  commentaire: string | null
  revenue_categories?: { label: string }
}

export interface Expense {
  id: string
  description: string
  category_id: string | null
  montant: number
  date: string
}

export const SECTION_LABELS: Record<Section, string> = {
  section1: 'Section 1 — moins de 13 ans',
  section2: 'Section 2 — moins de 18 ans',
  section3: 'Section 3 — 18 ans et plus',
}
