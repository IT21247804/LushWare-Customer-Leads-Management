import React, { useEffect, useState } from 'react';
import { getNotifications, markNotificationRead, deleteNotification } from '../api/notification';

export default function NotificationWidget() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await getNotifications();
      // show unread first, then recent
      setItems((data || []).sort((a, b) => (b.read - a.read) || new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function onMarkRead(id) {
    try {
      await markNotificationRead(id);
      setItems(prev => prev.map(i => i._id === id ? { ...i, read: true } : i));
    } catch (err) {
      setError(err.message);
    }
  }

  async function onDelete(id) {
    try {
      await deleteNotification(id);
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  const unreadCount = items.filter(n => !n.read).length;

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>
          Notifications {unreadCount > 0 && <span style={{ background: '#e53935', color: '#fff', borderRadius: '50%', padding: '2px 6px', fontSize: 12, marginLeft: 8 }}>{unreadCount}</span>}
        </h3>
        <button onClick={load}>Refresh</button>
      </div>

      {error && <div style={{ color: 'red', fontSize: 12, marginBottom: 8 }}>{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : items.length === 0 ? (
        <div style={{ color: '#999', fontSize: 13 }}>No notifications</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {items.slice(0, 5).map(n => (
            <li key={n._id} style={{ marginBottom: 8, padding: 8, background: n.read ? '#fff' : '#fffacd', borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, borderLeft: `3px solid ${n.read ? '#ddd' : '#0066cc'}` }}>
              <div style={{ flex: 1, fontSize: 13 }}>
                <div style={{ fontWeight: n.read ? 400 : 700 }}>{n.message}</div>
                <div style={{ fontSize: 11, color: '#666' }}>{new Date(n.createdAt).toLocaleString()}</div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {!n.read && <button onClick={() => onMarkRead(n._id)} style={{ padding: '4px 8px', fontSize: 11 }}>Read</button>}
                <button onClick={() => onDelete(n._id)} style={{ padding: '4px 8px', fontSize: 11, background: '#e53935', color: '#fff', border: 'none', borderRadius: 3 }}>✕</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {items.length > 5 && (
        <div style={{ marginTop: 12, textAlign: 'center', fontSize: 12 }}>
          <a href="/notifications" style={{ textDecoration: 'none', color: '#0066cc' }}>View all notifications →</a>
        </div>
      )}
    </div>
  );
}