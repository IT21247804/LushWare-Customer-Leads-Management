const API = process.env.REACT_APP_API_URL || '';

async function handleRes(res) {
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.error || data?.message || res.statusText);
  return data;
}

export async function getNotifications() {
  const res = await fetch(`${API}/api/notifications`);
  return handleRes(res);
}

// mark read - backend has markRead controller; route below assumes PUT /api/notifications/:id/read
export async function markNotificationRead(id) {
  const res = await fetch(`${API}/api/notifications/${id}/read`, { method: 'PUT' });
  return handleRes(res);
}

export async function deleteNotification(id) {
  const res = await fetch(`${API}/api/notifications/${id}`, { method: 'DELETE' });
  return handleRes(res);
}