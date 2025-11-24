import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCustomer } from '../api/customer';

export default function CreateCustomer() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    address: '',
    contactPerson: { name: '', email: '', phone: '', position: '' }
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function setField(path, value) {
    setForm(prev => {
      const next = JSON.parse(JSON.stringify(prev || {}));
      const keys = path.split('.');
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!cur[keys[i]]) cur[keys[i]] = {};
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  }

  function onChange(e) {
    const { name, value } = e.target;
    if (name.startsWith('contactPerson.')) setField(name, value);
    else setForm(prev => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await createCustomer(form);
      navigate('/customers');
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h2>Create Customer</h2>

      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <input name="name" placeholder="Name" value={form.name} onChange={onChange} required />
          <input name="companyName" placeholder="Company" value={form.companyName} onChange={onChange} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <input name="email" placeholder="Email" value={form.email} onChange={onChange} type="email" />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={onChange} />
        </div>

        <input name="address" placeholder="Address" value={form.address} onChange={onChange} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <input name="contactPerson.name" placeholder="Contact name" value={form.contactPerson.name} onChange={onChange} />
          <input name="contactPerson.position" placeholder="Contact position" value={form.contactPerson.position} onChange={onChange} />
          <input name="contactPerson.email" placeholder="Contact email" value={form.contactPerson.email} onChange={onChange} />
          <input name="contactPerson.phone" placeholder="Contact phone" value={form.contactPerson.phone} onChange={onChange} />
        </div>

        <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
          <button type="submit" disabled={saving}>{saving ? 'Creating...' : 'Create Customer'}</button>
          <button type="button" onClick={() => navigate('/customers')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}