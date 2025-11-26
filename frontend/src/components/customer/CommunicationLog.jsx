import React, { useState } from 'react';

export default function CommunicationLog({ logs, onAdd, onDelete }) {
  const [logMsg, setLogMsg] = useState('');
  const [logType, setLogType] = useState('note');
  const [adding, setAdding] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!logMsg) return;
    setAdding(true);
    try {
      await onAdd({ type: logType, message: logMsg });
      setLogMsg('');
      setLogType('note');
    } finally {
      setAdding(false);
    }
  }

  return (
    <section style={{ marginBottom: 20 }}>
      <h3>Communication Log</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
        <select value={logType} onChange={e => setLogType(e.target.value)} style={{ minWidth: 120 }}>
          <option value="note">Note</option>
          <option value="call">Call</option>
          <option value="email">Email</option>
          <option value="meeting">Meeting</option>
        </select>
        <input 
          placeholder="Log message" 
          value={logMsg} 
          onChange={e => setLogMsg(e.target.value)} 
          style={{ flex: 1 }} 
        />
        <button type="submit" disabled={adding}>
          {adding ? 'Adding...' : 'Add'}
        </button>
      </form>
      
      <ul>
        {(logs || []).slice().reverse().map((l) => (
          <li key={l._id} style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontSize: 13, color: '#666' }}>
                {new Date(l.timestamp).toLocaleString()} • {l.type}
              </div>
              <div>{l.message}</div>
            </div>
            <div>
              <button 
                onClick={() => onDelete(l._id)} 
                style={{ background: '#e53935', color: '#fff' }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}