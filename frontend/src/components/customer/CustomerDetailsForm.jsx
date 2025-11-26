import React from 'react';

export default function CustomerDetailsForm({ customer, form, editing, onChange, setField, onSave }) {
  if (editing) {
    return (
      <form onSubmit={onSave} style={{ display: 'grid', gap: 8, marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <input name="name" value={form.name || ''} onChange={onChange} required placeholder="Name" />
          <input name="companyName" value={form.companyName || ''} onChange={onChange} placeholder="Company Name" />
          <input name="email" value={form.email || ''} onChange={onChange} placeholder="Email" />
          <input name="phone" value={form.phone || ''} onChange={onChange} placeholder="Phone" />
          <input name="address" value={form.address || ''} onChange={onChange} placeholder="Address" />
        </div>

        <h4>Contact Person</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <input 
            placeholder="Contact Name" 
            value={form.contactPerson?.name || ''} 
            onChange={e => setField('contactPerson.name', e.target.value)} 
          />
          <input 
            placeholder="Position" 
            value={form.contactPerson?.position || ''} 
            onChange={e => setField('contactPerson.position', e.target.value)} 
          />
          <input 
            placeholder="Contact Email" 
            value={form.contactPerson?.email || ''} 
            onChange={e => setField('contactPerson.email', e.target.value)} 
          />
          <input 
            placeholder="Contact Phone" 
            value={form.contactPerson?.phone || ''} 
            onChange={e => setField('contactPerson.phone', e.target.value)} 
          />
        </div>

        <div>
          <button type="submit">Save</button>
        </div>
      </form>
    );
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <div><strong>Company:</strong> {customer.companyName || '-'}</div>
      <div><strong>Email:</strong> {customer.email || '-'}</div>
      <div><strong>Phone:</strong> {customer.phone || '-'}</div>
      <div><strong>Address:</strong> {customer.address || '-'}</div>
      <div>
        <strong>Contact:</strong> {customer.contactPerson?.name || '-'} 
        {customer.contactPerson?.email ? ` (${customer.contactPerson.email})` : ''}
      </div>
    </div>
  );
}