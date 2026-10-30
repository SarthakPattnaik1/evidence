// Public setup check: shows WHICH services are configured (true/false), never any values.
const { backend, store, send } = require('./_lib.js');
const has = (...ks) => ks.some((k) => !!process.env[k]);
module.exports = async function handler(req, res) {
  const b = backend(); let storeOk = null; let storeMsg = '';
  if (b) { try { await store.ping(); storeOk = true; } catch (e) { storeOk = false; storeMsg = /pa_stats|PGRST202|42883|schema cache/i.test(String(e.body || e.message)) ? 'connected, but run supabase/schema.sql' : 'cannot reach store (' + (e.status || 'network') + ')'; } }
  send(res, 200, {
    analytics: { backend: b || 'none', working: storeOk, note: storeMsg || undefined,
      supabase_env: { url: has('SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_PROJECT_URL'), service_key: has('SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_SECRET_KEY', 'SUPABASE_SERVICE_KEY'), anon_key_only: has('SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY') && !has('SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_SECRET_KEY', 'SUPABASE_SERVICE_KEY') },
      upstash_env: has('KV_REST_API_URL', 'UPSTASH_REDIS_REST_URL') && has('KV_REST_API_TOKEN', 'UPSTASH_REDIS_REST_TOKEN') },
    admin: { password_set: has('ADMIN_PASSWORD'), secret_set: has('ADMIN_SECRET') },
    translation: { bhashini: has('BHASHINI_USER_ID') && has('BHASHINI_API_KEY'), gemini: has('GEMINI_API_KEY'), anthropic: has('ANTHROPIC_API_KEY') },
    checked: new Date().toISOString()
  });
};
