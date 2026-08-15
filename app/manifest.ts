import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mawlid — Thiaroye Yeumbeul 1',
    short_name: 'Mawlid TY1',
    description: 'Gestion du Mawlid — section Thiaroye Yeumbeul 1 (DMWM)',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#0f172a',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
