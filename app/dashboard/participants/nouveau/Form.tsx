'use client'

import { useState } from 'react'
import type { ParticipationCategory, Section } from '@/lib/types'
import { SECTION_LABELS } from '@/lib/types'

export default function NouveauParticipantForm({
  categories,
  createParticipant,
}: {
  categories: ParticipationCategory[]
  createParticipant: (formData: FormData) => void
}) {
  const defaultCategory = categories.find((c) => !c.is_special) ?? categories[0]
  const autreCategory = categories.find((c) => c.is_special)
  const [categoryId, setCategoryId] = useState(defaultCategory?.id ?? '')

  return (
    <div className="space-y-4">
      <h1 className="font-display text-xl font-semibold tracking-tight text-ink dark:text-white">Nouveau participant</h1>

      <form action={createParticipant} className="space-y-4 rounded-2xl bg-white p-4 shadow-soft dark:bg-surfacedark">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-inkmuted dark:text-white/60">Prénom</label>
            <input name="prenom" required className="w-full rounded-xl border border-paperline bg-transparent px-3 py-2.5 text-sm dark:border-white/10" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-inkmuted dark:text-white/60">Nom</label>
            <input name="nom" required className="w-full rounded-xl border border-paperline bg-transparent px-3 py-2.5 text-sm dark:border-white/10" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-inkmuted dark:text-white/60">Sexe</label>
          <div className="flex gap-2">
            {[['homme', 'Homme'], ['femme', 'Femme']].map(([v, l]) => (
              <label key={v} className="flex flex-1 items-center justify-center rounded-xl border border-paperline py-2 text-sm has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-white dark:border-white/10 dark:has-[:checked]:border-gold dark:has-[:checked]:bg-gold dark:has-[:checked]:text-ink">
                <input type="radio" name="sexe" value={v} required className="sr-only" />
                {l}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-inkmuted dark:text-white/60">Section</label>
          <div className="space-y-2">
            {(Object.keys(SECTION_LABELS) as Section[]).map((s) => (
              <label key={s} className="flex items-center gap-2 rounded-xl border border-paperline px-3 py-2.5 text-sm has-[:checked]:border-gold has-[:checked]:bg-gold/10 dark:border-white/10">
                <input type="radio" name="section" value={s} required className="accent-gold" />
                {SECTION_LABELS[s]}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-inkmuted dark:text-white/60">Téléphone</label>
          <input name="telephone" type="tel" className="w-full rounded-xl border border-paperline bg-transparent px-3 py-2.5 text-sm dark:border-white/10" />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-inkmuted dark:text-white/60">Montant (FCFA)</label>
          <input
            name="montant"
            type="number"
            required
            className="w-full rounded-xl border border-paperline bg-transparent px-3 py-2.5 text-sm dark:border-white/10"
            placeholder="ex : 19000"
          />
          <p className="mt-1 text-xs text-inkmuted dark:text-white/50">
            N'importe quel montant est accepté, même s'il ne tombe pas sur un chiffre rond.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-inkmuted dark:text-white/60">Catégorie</label>
          <div className="flex gap-2">
            {defaultCategory && (
              <label className="flex flex-1 items-center justify-center rounded-xl border border-paperline py-2.5 text-sm has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-white dark:border-white/10 dark:has-[:checked]:border-gold dark:has-[:checked]:bg-gold dark:has-[:checked]:text-ink">
                <input
                  type="radio"
                  name="category_id"
                  value={defaultCategory.id}
                  checked={categoryId === defaultCategory.id}
                  onChange={() => setCategoryId(defaultCategory.id)}
                  className="sr-only"
                />
                Participation
              </label>
            )}
            {autreCategory && (
              <label className="flex flex-1 items-center justify-center rounded-xl border border-paperline py-2.5 text-sm has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-white dark:border-white/10 dark:has-[:checked]:border-gold dark:has-[:checked]:bg-gold dark:has-[:checked]:text-ink">
                <input
                  type="radio"
                  name="category_id"
                  value={autreCategory.id}
                  checked={categoryId === autreCategory.id}
                  onChange={() => setCategoryId(autreCategory.id)}
                  className="sr-only"
                />
                Autre
              </label>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-inkmuted dark:text-white/60">Observation (optionnel)</label>
          <textarea name="observation" rows={2} className="w-full rounded-xl border border-paperline bg-transparent px-3 py-2.5 text-sm dark:border-white/10" />
        </div>

        <button type="submit" className="w-full rounded-xl bg-ink py-3 text-sm font-medium text-white transition hover:bg-ink/90 dark:bg-gold dark:text-ink dark:hover:bg-gold/90">
          Enregistrer
        </button>
      </form>
    </div>
  )
}
