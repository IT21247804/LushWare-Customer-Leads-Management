import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>

      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        <div style={{ flex: 1, padding: 16, border: '1px solid #e6e6e6', borderRadius: 8 }}>
          <div style={{ fontSize: 14, color: '#666' }}>Leads</div>
          <div style={{ fontSize: 24, fontWeight: 600 }}>—</div>
          <button style={{ marginTop: 12 }} onClick={() => navigate('/leads')}>View Leads</button>
        </div>

        <div style={{ flex: 1, padding: 16, border: '1px solid #e6e6e6', borderRadius: 8 }}>
          <div style={{ fontSize: 14, color: '#666' }}>Customers</div>
          <div style={{ fontSize: 24, fontWeight: 600 }}>—</div>
          <button style={{ marginTop: 12 }} onClick={() => navigate('/customers')}>View Customers</button>
        </div>
      </div>
    </div>
  );
}