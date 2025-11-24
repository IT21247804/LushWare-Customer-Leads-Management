// ...existing code...
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Sidebar from './components/sidebar';
import LeadsPage from './pages/LeadsPage';
import CreateLead from './pages/CreateLead';
import CustomersPage from './pages/CustomersPage';
import CreateCustomer from './pages/CreateCustomer';
import CustomerDetailsPage from './pages/CustomerDetailsPage';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leads" element={<LeadsPage />} />
            <Route path="/leads/create" element={<CreateLead />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/customers/create" element={<CreateCustomer />} />
            <Route path="/customers/:id" element={<CustomerDetailsPage />} />
            <Route path="*" element={<div style={{ padding: 20 }}>Page not found</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
// ...existing code...