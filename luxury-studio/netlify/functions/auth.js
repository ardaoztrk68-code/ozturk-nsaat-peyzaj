import crypto from 'node:crypto';
import { signToken, json } from './_utils.js';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  const { password } = body;
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return json(500, { error: 'Server misconfigured' });
  }

  if (!password || password !== expected) {
    return json(401, { error: 'Hatalı parola' });
  }

  const secret = process.env.SESSION_SECRET || crypto.randomUUID();
  const token = signToken({ sub: 'admin' }, secret);

  return json(200, { token });
};
