import { createClient } from '@sanity/client';
import { verifyToken, json } from './_utils.js';

function getClient() {
  const token = process.env.SANITY_WRITE_TOKEN;
  const projectId = process.env.SANITY_PROJECT_ID;

  if (!token || !projectId) {
    return null;
  }

  return createClient({
    projectId,
    dataset: process.env.SANITY_DATASET || 'production',
    apiVersion: '2026-05-19',
    useCdn: false,
    token,
  });
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    return json(500, { error: 'Server misconfigured' });
  }

  const authHeader = event.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const payload = verifyToken(token, secret);
  if (!payload) {
    return json(401, { error: 'Unauthorized' });
  }

  const sanity = getClient();
  if (!sanity) {
    return json(500, { error: 'Sanity not configured' });
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  const { action, doc, id, patch } = body;

  try {
    let result;
    switch (action) {
      case 'create':
        result = await sanity.create(doc);
        break;
      case 'patch':
        if (!id || !patch) {
          return json(400, { error: 'id and patch are required for patch action' });
        }
        result = await sanity.patch(id).set(patch).commit();
        break;
      case 'delete':
        if (!id) {
          return json(400, { error: 'id is required for delete action' });
        }
        result = await sanity.delete(id);
        break;
      default:
        return json(400, { error: `Unknown action: ${action}` });
    }
    return json(200, { ok: true, result });
  } catch (err) {
    return json(500, { error: err.message });
  }
};
