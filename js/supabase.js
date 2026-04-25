// ── VEXORA STUDIO — SUPABASE CONFIG ──────────────────────────
// Paste your credentials below and save. That's it.

const SUPABASE_URL = 'https://wwcnzxrqnrlnoirvuqfy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3Y256eHJxbnJsbm9pcnZ1cWZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMzk3OTcsImV4cCI6MjA5MjYxNTc5N30.VVaQEmR7uNcHALF29Qo59gyyCwSyp3iHKas-ZLmiuXM';

// ─────────────────────────────────────────────────────────────
// Internal helpers
function _tok() {
  return localStorage.getItem('vx_token') || SUPABASE_KEY;
}
function _h(extra) {
  return Object.assign({
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Authorization': 'Bearer ' + _tok()
  }, extra || {});
}

// ─────────────────────────────────────────────────────────────
var sb = {

  // SELECT rows
  select: async function(table, qs) {
    var r = await fetch(SUPABASE_URL + '/rest/v1/' + table + '?' + (qs || ''), { headers: _h() });
    if (!r.ok) throw await r.json();
    return r.json();
  },

  // INSERT row(s)
  insert: async function(table, data) {
    var r = await fetch(SUPABASE_URL + '/rest/v1/' + table, {
      method: 'POST',
      headers: _h({ 'Prefer': 'return=representation' }),
      body: JSON.stringify(data)
    });
    if (!r.ok) throw await r.json();
    return r.json();
  },

  // UPDATE rows matching match object
  update: async function(table, match, data) {
    var q = Object.keys(match).map(function(k) { return k + '=eq.' + match[k]; }).join('&');
    var r = await fetch(SUPABASE_URL + '/rest/v1/' + table + '?' + q, {
      method: 'PATCH',
      headers: _h({ 'Prefer': 'return=representation' }),
      body: JSON.stringify(data)
    });
    if (!r.ok) throw await r.json();
    return r.json();
  },

  // DELETE rows matching match object
  delete: async function(table, match) {
    var q = Object.keys(match).map(function(k) { return k + '=eq.' + match[k]; }).join('&');
    var r = await fetch(SUPABASE_URL + '/rest/v1/' + table + '?' + q, {
      method: 'DELETE',
      headers: _h()
    });
    if (!r.ok) throw await r.json();
    return true;
  },

  // ── AUTH ────────────────────────────────────────────────────
  // Uses Supabase REST auth endpoint directly (no SDK needed)
  auth: {

    // Sign in with email + password (works with Supabase v2 REST)
    signInWithPassword: async function(email, password) {
      var r = await fetch(SUPABASE_URL + '/auth/v1/token?grant_type=password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY },
        body: JSON.stringify({ email: email, password: password })
      });
      var data = await r.json();
      // Supabase returns error_description on failure
      if (!r.ok || !data.access_token) {
        throw new Error(data.error_description || data.msg || data.message || 'Login failed');
      }
      localStorage.setItem('vx_token',   data.access_token);
      localStorage.setItem('vx_refresh', data.refresh_token || '');
      localStorage.setItem('vx_user',    JSON.stringify(data.user));
      return data;
    },

    // Refresh session using refresh token
    refreshSession: async function() {
      var refresh = localStorage.getItem('vx_refresh');
      if (!refresh) return false;
      try {
        var r = await fetch(SUPABASE_URL + '/auth/v1/token?grant_type=refresh_token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY },
          body: JSON.stringify({ refresh_token: refresh })
        });
        var data = await r.json();
        if (data.access_token) {
          localStorage.setItem('vx_token',   data.access_token);
          localStorage.setItem('vx_refresh', data.refresh_token || '');
          return true;
        }
      } catch(e) {}
      return false;
    },

    // Sign out
    signOut: async function() {
      try {
        await fetch(SUPABASE_URL + '/auth/v1/logout', {
          method: 'POST',
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + _tok() }
        });
      } catch(e) {}
      localStorage.removeItem('vx_token');
      localStorage.removeItem('vx_refresh');
      localStorage.removeItem('vx_user');
    },

    getUser: function() {
      try { return JSON.parse(localStorage.getItem('vx_user')); } catch(e) { return null; }
    },

    isLoggedIn: function() {
      return !!localStorage.getItem('vx_token');
    }
  }
};

window.sb = sb;
