import React, { useEffect, useState } from 'react';
import { getLeads, createLead, deleteLead } from '../api/lead';

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' });

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    setLoading(true);
    setError('');
    try {
      const data = await getLeads();
      setLeads(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const created = await createLead(form);
      setLeads(prev => [created, ...prev]);
      setForm({ name: '', email: '', phone: '', notes: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id) {
    if (!window.confirm('Delete this lead?')) return;
    try {
      await deleteLead(id);
      setLeads(prev => prev.filter(l => l._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: '0 auto' }}>
      <h2>Leads</h2>

      <form onSubmit={onSubmit} style={{ marginBottom: 20, display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
        <input name="name" placeholder="Name" value={form.name} onChange={onChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={onChange} type="email" required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={onChange} />
        <input name="notes" placeholder="Notes" value={form.notes} onChange={onChange} />
        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8 }}>
          <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Create Lead'}</button>
          <button type="button" onClick={() => setForm({ name: '', email: '', phone: '', notes: '' })}>Reset</button>
          <button type="button" onClick={refresh}>Refresh</button>
        </div>
      </form>

      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Name</th>
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Email</th>
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Phone</th>
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Notes</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr><td colSpan="5" style={{ padding: 12 }}>No leads found.</td></tr>
            )}
            {leads.map(lead => (
              <tr key={lead._id}>
                <td style={{ padding: 8 }}>{lead.name}</td>
                <td style={{ padding: 8 }}>{lead.email}</td>
                <td style={{ padding: 8 }}>{lead.phone || '-'}</td>
                <td style={{ padding: 8 }}>{lead.notes || '-'}</td>
                <td style={{ padding: 8 }}>
                  <button onClick={() => navigator.clipboard?.writeText(lead._id)} title="Copy ID">Copy ID</button>
                  <button onClick={() => onDelete(lead._id)} style={{ marginLeft: 8 }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}