import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CustomerHeader({ customer, onEdit, onDelete, isEditing }) {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2>{customer.name}</h2>
      <div>
        <button onClick={() => navigate('/customers')} style={{ marginRight: 8 }}>
          Back
        </button>
        <button onClick={onEdit} style={{ marginRight: 8 }}>
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
        <button onClick={onDelete} style={{ background: '#e53935', color: '#fff' }}>
          Delete
        </button>
      </div>
    </div>
  );
}