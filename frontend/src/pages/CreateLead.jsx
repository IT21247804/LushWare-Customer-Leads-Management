import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLead } from '../api/lead';

export default function CreateLead() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    source: 'manual',
    status: 'new',
    priority: 'warm'
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function onChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await createLead(form);
      navigate('/leads');
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h2>Create Lead</h2>

      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <input name="name" placeholder="Name" value={form.name} onChange={onChange} required />
          <input name="email" placeholder="Email" value={form.email} onChange={onChange} type="email" required />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <input name="phone" placeholder="Phone" value={form.phone} onChange={onChange} />
          <select name="source" value={form.source} onChange={onChange}>
            <option value="website">website</option>
            <option value="facebook">facebook</option>
            <option value="instagram">instagram</option>
            <option value="google-ads">google-ads</option>
            <option value="referral">referral</option>
            <option value="manual">manual</option>
            <option value="other">other</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <select name="status" value={form.status} onChange={onChange}>
            <option value="new">new</option>
            <option value="in-progress">in-progress</option>
            <option value="converted">converted</option>
            <option value="lost">lost</option>
          </select>

          <select name="priority" value={form.priority} onChange={onChange}>
            <option value="hot">hot</option>
            <option value="warm">warm</option>
            <option value="cold">cold</option>
          </select>
        </div>

        <textarea name="notes" placeholder="Notes" value={form.notes} onChange={onChange} style={{ minHeight: 80 }} />

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={saving}>{saving ? 'Creating...' : 'Create'}</button>
          <button type="button" onClick={() => navigate('/leads')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}