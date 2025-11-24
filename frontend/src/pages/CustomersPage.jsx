// ...existing code...
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCustomers } from '../api/customer';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Customers</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/customers/create"><button>Create Customer</button></Link>
          <button onClick={load}>Refresh</button>
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
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Company</th>
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Contact</th>
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left', padding: 8 }}>Email</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 && (
              <tr><td colSpan="5" style={{ padding: 12 }}>No customers found.</td></tr>
            )}
            {customers.map(c => (
              <tr key={c._id}>
                <td style={{ padding: 8 }}>{c.name}</td>
                <td style={{ padding: 8 }}>{c.companyName || '-'}</td>
                <td style={{ padding: 8 }}>{c.contactPerson?.name || '-'}</td>
                <td style={{ padding: 8 }}>{c.email || '-'}</td>
                <td style={{ padding: 8 }}>
                  <Link to={`/customers/${c._id}`}><button>View</button></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
// ...existing code...