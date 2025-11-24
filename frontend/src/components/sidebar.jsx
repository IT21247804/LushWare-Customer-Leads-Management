// ...existing code...
import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const linkStyle = ({ isActive }) => ({
    display: 'block',
    padding: '10px 12px',
    marginBottom: 6,
    borderRadius: 6,
    textDecoration: 'none',
    color: isActive ? '#fff' : '#111',
    background: isActive ? '#0b5fff' : 'transparent'
  });

  const subStyle = ({ isActive }) => ({
    display: 'block',
    padding: '8px 16px',
    marginLeft: 8,
    marginBottom: 6,
    borderRadius: 6,
    textDecoration: 'none',
    color: isActive ? '#fff' : '#333',
    background: isActive ? '#0b5fff' : 'transparent',
    fontSize: 14
  });

  return (
    <aside style={{ width: 220, padding: 16, borderRight: '1px solid #eee', minHeight: '100vh', boxSizing: 'border-box' }}>
      <h2 style={{ margin: '0 0 12px 0', fontSize: 18 }}>LushWare</h2>
      <nav>
        <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>

        <div>
          <NavLink to="/leads" style={linkStyle}>Leads</NavLink>
          <div>
            <NavLink to="/leads" end style={subStyle}>All Leads</NavLink>
            <NavLink to="/leads/create" style={subStyle}>Create Lead</NavLink>
          </div>
        </div>

        <div>
          <NavLink to="/customers" style={linkStyle}>Customers</NavLink>
          <div>
            <NavLink to="/customers" end style={subStyle}>All Customers</NavLink>
            <NavLink to="/customers/create" style={subStyle}>Create Customer</NavLink>
          </div>
        </div>
      </nav>
    </aside>
  );
}
// ...existing code...