const API = process.env.REACT_APP_API_URL || '';

async function handleRes(res) {
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.error || data?.message || res.statusText);
  return data;
}

export async function getFollowUps() {
  const res = await fetch(`${API}/api/followups`);
  return handleRes(res);
}

export async function getFollowUp(id) {
  const res = await fetch(`${API}/api/followups/${id}`);
  return handleRes(res);
}

export async function createFollowUp(payload) {
  const res = await fetch(`${API}/api/followups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleRes(res);
}

export async function updateFollowUp(id, payload) {
  const res = await fetch(`${API}/api/followups/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleRes(res);
}

export async function deleteFollowUp(id) {
  const res = await fetch(`${API}/api/followups/${id}`, { method: 'DELETE' });
  return handleRes(res);
}