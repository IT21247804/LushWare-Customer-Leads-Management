import React, { useEffect, useState } from 'react';
import { getFollowUps, updateFollowUp, deleteFollowUp } from '../../api/followup';
import { Link } from 'react-router-dom';

export default function FollowUpWidget() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await getFollowUps();
      // show only pending/due, sorted by date
      setItems((data || []).filter(f => ['pending', 'scheduled', 'due'].includes(f.status)).sort((a, b) => new Date(a.followUpDate) - new Date(b.followUpDate)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function toggleComplete(f) {
    try {
      const updated = await updateFollowUp(f._id, { status: f.status === 'completed' ? 'pending' : 'completed' });
      setItems(prev => prev.map(i => i._id === f._id ? updated : i).filter(x => ['pending', 'scheduled', 'due'].includes(x.status)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function onDelete(id) {
    if (!window.confirm('Delete follow-up?')) return;
    try {
      await deleteFollowUp(id);
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Follow-ups ({items.length})</h3>
        <button onClick={load}>Refresh</button>
      </div>

      {error && <div style={{ color: 'red', fontSize: 12, marginBottom: 8 }}>{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : items.length === 0 ? (
        <div style={{ color: '#999', fontSize: 13 }}>No pending follow-ups</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {items.slice(0, 5).map(f => (
            <li key={f._id} style={{ marginBottom: 8, padding: 8, background: '#f9f9f9', borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, fontSize: 13 }}>
                <div style={{ fontWeight: 600 }}>{f.title}</div>
                <div style={{ fontSize: 11, color: '#666' }}>{new Date(f.followUpDate).toLocaleDateString()} {new Date(f.followUpDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                {f.leadId && <Link to={`/leads/${f.leadId._id}`} style={{ fontSize: 11, color: '#0066cc', textDecoration: 'none' }}>Lead: {f.leadId.name}</Link>}
                {f.customerId && <Link to={`/customers/${f.customerId._id}`} style={{ fontSize: 11, color: '#0066cc', textDecoration: 'none', marginLeft: 8 }}>Customer: {f.customerId.name}</Link>}
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => toggleComplete(f)} style={{ padding: '4px 8px', fontSize: 11 }}>{f.status === 'completed' ? 'Redo' : 'Done'}</button>
                <button onClick={() => onDelete(f._id)} style={{ padding: '4px 8px', fontSize: 11, background: '#e53935', color: '#fff', border: 'none', borderRadius: 3 }}>✕</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {items.length > 5 && (
        <div style={{ marginTop: 12, textAlign: 'center', fontSize: 12 }}>
          <Link to="/follow-ups" style={{ textDecoration: 'none', color: '#0066cc' }}>View all follow-ups →</Link>
        </div>
      )}
    </div>
  );
}