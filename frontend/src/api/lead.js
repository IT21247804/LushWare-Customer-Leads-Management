const API_BASE = process.env.REACT_APP_API_URL;

async function handleRes(res) {
  const contentType = res.headers.get('content-type') || '';
  const text = await res.text();
  if (!res.ok) {
    try {
      const data = JSON.parse(text);
      throw new Error(data.error || data.message || text);
    } catch {
      throw new Error(`${res.status} ${res.statusText} - ${text}`);
    }
  }
  if (contentType.includes('application/json')) {
    return JSON.parse(text);
  }
  throw new Error('Unexpected response content-type: ' + contentType + ' - ' + text);
}

export async function getLeads() {
  const res = await fetch(`${API_BASE}/api/leads`);
  return handleRes(res);
}

export async function createLead(payload) {
  const res = await fetch(`${API_BASE}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleRes(res);
}

export async function deleteLead(id) {
  const res = await fetch(`${API_BASE}/api/leads/${id}`, { method: 'DELETE' });
  return handleRes(res);
}