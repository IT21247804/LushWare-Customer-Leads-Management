const API_BASE = process.env.REACT_APP_API_URL || '';

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

export async function getCustomers() {
  const res = await fetch(`${API_BASE}/api/customer`);
  return handleRes(res);
}

export async function getCustomer(id) {
  const res = await fetch(`${API_BASE}/api/customer/${id}`);
  return handleRes(res);
}

export async function createCustomer(payload) {
  const res = await fetch(`${API_BASE}/api/customer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleRes(res);
}

export async function updateCustomer(id, payload) {
  const res = await fetch(`${API_BASE}/api/customer/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleRes(res);
}

export async function deleteCustomer(id) {
  const res = await fetch(`${API_BASE}/api/customer/${id}`, { method: 'DELETE' });
  return handleRes(res);
}

export async function addCustomerLog(id, payload) {
  const res = await fetch(`${API_BASE}/api/customer/${id}/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleRes(res);
}

export async function addCustomerProject(id, payload) {
  const res = await fetch(`${API_BASE}/api/customer/${id}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleRes(res);
}

// new: delete log
export async function deleteCustomerLog(id, logId) {
  const res = await fetch(`${API_BASE}/api/customer/${id}/logs/${logId}`, {
    method: 'DELETE'
  });
  return handleRes(res);
}

// new: delete project
export async function deleteCustomerProject(id, projectId) {
  const res = await fetch(`${API_BASE}/api/customer/${id}/projects/${projectId}`, {
    method: 'DELETE'
  });
  return handleRes(res);
}