export default function ThemeScript() {
  const code = `
    try {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = saved === 'dark' || (!saved && prefersDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
      if (!document.cookie.includes('theme=')) {
        document.cookie = 'theme=' + (isDark ? 'dark' : 'light') + '; path=/; max-age=31536000; SameSite=Lax';
      }
    } catch (e) {}
  `
  return <script dangerouslySetInnerHTML={{ __html: code }} />
}
