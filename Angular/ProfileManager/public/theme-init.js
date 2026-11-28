// Apply the persisted/device theme before first paint to avoid a flash of the wrong theme.
// Kept as an external file (not inline in index.html) so a Content-Security-Policy can use
// `script-src 'self'` without allowing arbitrary inline scripts.
(function () {
  var stored = localStorage.getItem('theme-preference');
  var dark =
    stored === 'dark' ||
    (stored !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
})();
