// ============================================================
// VEXORA STUDIO — analytics.js
// Tracks page views → Supabase `pageviews` table
// Include on every public page (after supabase.js)
// ============================================================

(function () {
  // Wait for sb to be available
  if (typeof sb === 'undefined') return;

  const track = async () => {
    try {
      await sb.insert('pageviews', {
        path:       window.location.pathname,
        referrer:   document.referrer || null,
        ua:         navigator.userAgent,
        created_at: new Date().toISOString()
      });
    } catch (_) {
      // Silently fail — never break the page for analytics
    }
  };

  // Track after short delay to not block page load
  setTimeout(track, 1500);
})();
