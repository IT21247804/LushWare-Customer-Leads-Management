import React, { useEffect, useState } from 'react';
import { getLeads, createLead, deleteLead, updateLead } from '../api/lead';

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' });
  
  // Edit modal state
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ _id: '', name: '', email: '', phone: '', notes: '' });
  const [updating, setUpdating] = useState(false);

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

  function onEditChange(e) {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
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

  function openEditModal(lead) {
    setEditForm({
      _id: lead._id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      notes: lead.notes || ''
    });
    setEditModal(true);
    setError('');
  }

  function closeEditModal() {
    setEditModal(false);
    setEditForm({ _id: '', name: '', email: '', phone: '', notes: '' });
  }

  async function onUpdate(e) {
    e.preventDefault();
    setUpdating(true);
    setError('');
    try {
      const { _id, ...payload } = editForm;
      const updated = await updateLead(_id, payload);
      setLeads(prev => prev.map(l => l._id === _id ? updated : l));
      closeEditModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
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
                  <button onClick={() => openEditModal(lead)} style={{ marginRight: 8 }}>Edit</button>
                  <button onClick={() => navigator.clipboard?.writeText(lead._id)} title="Copy ID">Copy ID</button>
                  <button onClick={() => onDelete(lead._id)} style={{ marginLeft: 8 }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: 24,
            borderRadius: 8,
            width: '90%',
            maxWidth: 500,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <h3 style={{ marginTop: 0 }}>Edit Lead</h3>
            <form onSubmit={onUpdate}>
              <div style={{ display: 'grid', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Name</label>
                  <input 
                    name="name" 
                    value={editForm.name} 
                    onChange={onEditChange} 
                    required 
                    style={{ width: '100%', padding: 8 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Email</label>
                  <input 
                    name="email" 
                    type="email"
                    value={editForm.email} 
                    onChange={onEditChange} 
                    required 
                    style={{ width: '100%', padding: 8 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Phone</label>
                  <input 
                    name="phone" 
                    value={editForm.phone} 
                    onChange={onEditChange} 
                    style={{ width: '100%', padding: 8 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Notes</label>
                  <textarea 
                    name="notes" 
                    value={editForm.notes} 
                    onChange={onEditChange} 
                    style={{ width: '100%', padding: 8, minHeight: 80 }}
                  />
                </div>
              </div>
              <div style={{ marginTop: 20, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" onClick={closeEditModal} disabled={updating}>Cancel</button>
                <button type="submit" disabled={updating}>
                  {updating ? 'Updating...' : 'Update Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}