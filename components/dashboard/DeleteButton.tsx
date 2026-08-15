'use client'

export default function DeleteButton({
  action,
  id,
  label = 'Supprimer',
}: {
  action: (formData: FormData) => void
  id: string
  label?: string
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm('Supprimer définitivement ? Cette action est irréversible.')) e.preventDefault()
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="w-full rounded-xl border border-spend/30 py-3 text-sm font-medium text-spend transition hover:bg-spend/10"
      >
        🗑️ {label}
      </button>
    </form>
  )
}
