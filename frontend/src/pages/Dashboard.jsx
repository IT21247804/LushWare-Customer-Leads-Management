import React from 'react';
import { useNavigate } from 'react-router-dom';
import FollowUpWidget from '../components/dashboard/FollowUpWidget';
import NotificationWidget from '../components/dashboard/NotificationWidget';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto' }}>
      <h1>Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <NotificationWidget />
        <FollowUpWidget />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <button onClick={() => navigate('/leads')} style={{ padding: 12 }}>View Leads</button>
        <button onClick={() => navigate('/customers')} style={{ padding: 12 }}>View Customers</button>
      </div>
    </div>
  );
}