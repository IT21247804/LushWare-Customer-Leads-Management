// ...existing code...
import React, { useEffect, useState } from 'react';
import { getLeads, deleteLead, updateLead, convertLead } from '../api/lead';
import { createFollowUp } from '../api/followup';
import { Link } from 'react-router-dom';

const SOURCE_OPTS = [
  'website',
  'facebook',
  'instagram',
  'google-ads',
  'referral',
  'manual',
  'other'
];

const STATUS_OPTS = ['new', 'in-progress', 'converted', 'lost'];
const PRIORITY_OPTS = ['hot', 'warm', 'cold'];

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // edit modal state
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    _id: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
    source: 'manual',
    status: 'new',
    priority: 'warm'
  });
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

  function onEditChange(e) {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  }

  function openEditModal(lead) {
    setEditForm({
      _id: lead._id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      notes: lead.notes || '',
      source: lead.source || 'manual',
      status: lead.status || 'new',
      priority: lead.priority || 'warm'
    });
    setEditModal(true);
    setError('');
  }

  function closeEditModal() {
    setEditModal(false);
    setEditForm({ _id: '', name: '', email: '', phone: '', notes: '', source: 'manual', status: 'new', priority: 'warm' });
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

   async function onConvert(id) {
    if (!window.confirm('Convert this lead to a customer?')) return;
    setError('');
    try {
      const result = await convertLead(id);
      if (result.lead) {
        setLeads(prev => prev.map(l => l._id === result.lead._id ? result.lead : l));
      }

      // Create a follow-up for the newly converted customer
      if (result.customer && result.customer._id) {
        const followUpDate = new Date();
        followUpDate.setMinutes(followUpDate.getMinutes() + 1); // follow up in 1 minute

        try {
          await createFollowUp({
            customerId: result.customer._id,
            title: 'Follow-up on converted customer',
            notes: `Auto-created follow-up for newly converted customer: ${result.customer.name}`,
            followUpDate: followUpDate.toISOString(),
            status: 'scheduled'
          });
        } catch (followUpErr) {
          console.error('Failed to create follow-up:', followUpErr);
        }
      }

      alert(result.message || 'Converted lead to customer');
    } catch (err) {
      setError(err.message || String(err));
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Leads</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/leads/create"><button>Create Lead</button></Link>
          <button onClick={refresh}>Refresh</button>
        </div>
      </div>

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
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Source</th>
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Status</th>
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Priority</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr><td colSpan="7" style={{ padding: 12 }}>No leads found.</td></tr>
            )}
            {leads.map(lead => (
              <tr key={lead._id}>
                <td style={{ padding: 8 }}>{lead.name}</td>
                <td style={{ padding: 8 }}>{lead.email}</td>
                <td style={{ padding: 8 }}>{lead.phone || '-'}</td>
                <td style={{ padding: 8 }}>{lead.source || '-'}</td>
                <td style={{ padding: 8 }}>{lead.status || '-'}</td>
                <td style={{ padding: 8 }}>{lead.priority || '-'}</td>
                <td style={{ padding: 8 }}>
                  <button onClick={() => openEditModal(lead)} style={{ marginRight: 8 }}>Edit</button>
                  <button
                    onClick={() => onConvert(lead._id)}
                    style={{ marginRight: 8 }}
                    disabled={lead.status === 'converted'}
                  >
                    {lead.status === 'converted' ? 'Converted' : 'Convert'}
                  </button>
                  <button onClick={() => navigator.clipboard?.writeText(lead._id)} title="Copy ID">Copy ID</button>
                  <button onClick={() => onDelete(lead._id)} style={{ marginLeft: 8 }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Modal (unchanged) */}
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
            maxWidth: 600,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <h3 style={{ marginTop: 0 }}>Edit Lead</h3>
            <form onSubmit={onUpdate}>
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 4 }}>Name</label>
                    <input name="name" value={editForm.name} onChange={onEditChange} required style={{ width: '100%', padding: 8 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 4 }}>Email</label>
                    <input name="email" type="email" value={editForm.email} onChange={onEditChange} required style={{ width: '100%', padding: 8 }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 4 }}>Phone</label>
                    <input name="phone" value={editForm.phone} onChange={onEditChange} style={{ width: '100%', padding: 8 }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: 4 }}>Source</label>
                    <select name="source" value={editForm.source} onChange={onEditChange} style={{ width: '100%', padding: 8 }}>
                      {SOURCE_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 4 }}>Status</label>
                    <select name="status" value={editForm.status} onChange={onEditChange} style={{ width: '100%', padding: 8 }}>
                      {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: 4 }}>Priority</label>
                    <select name="priority" value={editForm.priority} onChange={onEditChange} style={{ width: '100%', padding: 8 }}>
                      {PRIORITY_OPTS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 4 }}>Notes</label>
                  <textarea name="notes" value={editForm.notes} onChange={onEditChange} style={{ width: '100%', padding: 8, minHeight: 80 }} />
                </div>
              </div>

              <div style={{ marginTop: 20, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" onClick={closeEditModal} disabled={updating}>Cancel</button>
                <button type="submit" disabled={updating}>{updating ? 'Updating...' : 'Update Lead'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
// ...existing code...