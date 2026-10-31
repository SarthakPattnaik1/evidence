// Issues a signed, short-lived session token when the real page loads. /api/e only trusts events that carry one.
// The token is bound to the browser (user-agent hash) and expires after 24 h. Nothing personal is in it.
const { hmac, send, crypto } = require('./_lib.js');
const uaHash = (ua) => crypto.createHash('sha256').update(String(ua || '')).digest('base64url').slice(0, 10);
function make(ua) {
  const sid = crypto.randomBytes(9).toString('base64url').replace(/[^a-zA-Z0-9]/g, '').slice(0, 12).toLowerCase().padEnd(12, '0');
  const iat = Math.floor(Date.now() / 1000);
  return sid + '.' + iat + '.' + hmac('tok|' + sid + '|' + iat + '|' + uaHash(ua)).slice(0, 22);
}
function check(tok, ua) {
  const m = /^([a-z0-9]{12})\.(\d{9,11})\.([A-Za-z0-9_-]{22})$/.exec(String(tok || ''));
  if (!m) return null;
  const age = Date.now() / 1000 - Number(m[2]); if (age < -60 || age > 86400) return null;
  const want = hmac('tok|' + m[1] + '|' + m[2] + '|' + uaHash(ua)).slice(0, 22);
  return crypto.timingSafeEqual(Buffer.from(want), Buffer.from(m[3])) ? { sid: m[1], age } : null;
}
module.exports = (req, res) => {
  if (req.method !== 'GET') return send(res, 405, { error: 'GET only' });
  return send(res, 200, { k: make(req.headers['user-agent']) });
};
module.exports.check = check;
