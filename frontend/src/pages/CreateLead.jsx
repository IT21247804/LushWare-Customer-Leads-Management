import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLead } from '../api/lead';
import { createFollowUp } from '../api/followup';

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
  const [followUpConfig, setFollowUpConfig] = useState({
    createFollowUp: true,
    followUpMinutes: 1, // default: follow up in 1 minute
    followUpTitle: 'Follow up on new lead'
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function onChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function onFollowUpChange(e) {
    const { name, value, checked, type } = e.target;
    setFollowUpConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const lead = await createLead(form);

      if (followUpConfig.createFollowUp && lead._id) {
        const followUpDate = new Date();
        followUpDate.setMinutes(followUpDate.getMinutes() + Number(followUpConfig.followUpMinutes));

        await createFollowUp({
          leadId: lead._id,
          title: followUpConfig.followUpTitle,
          notes: `Auto-created follow-up for new lead: ${form.name}`,
          followUpDate: followUpDate.toISOString(),
          status: 'scheduled'
        });
      }

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

        {/* Follow-up creation section */}
        <div style={{ background: '#f0f0f0', padding: 12, borderRadius: 6, marginTop: 12 }}>
          <h4 style={{ margin: '0 0 8px 0' }}>Auto Follow-up</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <input
              type="checkbox"
              name="createFollowUp"
              checked={followUpConfig.createFollowUp}
              onChange={onFollowUpChange}
              id="createFollowUp"
            />
            <label htmlFor="createFollowUp" style={{ margin: 0 }}>Create follow-up for this lead</label>
          </div>

          {followUpConfig.createFollowUp && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <label style={{ fontSize: 12, color: '#666' }}>Follow-up in (minutes)</label>
                <input
                  type="number"
                  name="followUpMinutes"
                  value={followUpConfig.followUpMinutes}
                  onChange={onFollowUpChange}
                  min="0"
                  max="10080"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#666' }}>Title</label>
                <input
                  type="text"
                  name="followUpTitle"
                  value={followUpConfig.followUpTitle}
                  onChange={onFollowUpChange}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={saving}>{saving ? 'Creating...' : 'Create'}</button>
          <button type="button" onClick={() => navigate('/leads')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}