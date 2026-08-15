export default function ThemeScript() {
  const code = `
    try {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (saved === 'dark' || (!saved && prefersDark)) {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {}
  `
  return <script dangerouslySetInnerHTML={{ __html: code }} />
}
