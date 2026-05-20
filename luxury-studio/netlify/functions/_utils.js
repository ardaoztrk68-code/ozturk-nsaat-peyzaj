import crypto from 'node:crypto';

const TOKEN_TTL_SEC = 8 * 60 * 60; // 8 hours

function base64url(buf) {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return str;
}

export function signToken(payload, secret) {
  const header = base64url(Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const now = Math.floor(Date.now() / 1000);
  const body = base64url(Buffer.from(JSON.stringify({ ...payload, iat: now, exp: now + TOKEN_TTL_SEC })));
  const data = `${header}.${body}`;
  const sig = base64url(crypto.createHmac('sha256', secret).update(data).digest());
  return `${data}.${sig}`;
}

export function verifyToken(token, secret) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, sigB64] = parts;
  const data = `${headerB64}.${payloadB64}`;
  const expectedSig = base64url(crypto.createHmac('sha256', secret).update(data).digest());
  if (sigB64 !== expectedSig) return null;
  let payload;
  try {
    const json = Buffer.from(base64urlDecode(payloadB64), 'base64').toString('utf8');
    payload = JSON.parse(json);
  } catch {
    return null;
  }
  if (Date.now() / 1000 > payload.exp) return null;
  return payload;
}

export function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}
