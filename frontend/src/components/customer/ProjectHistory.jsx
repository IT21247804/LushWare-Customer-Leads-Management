import React, { useState } from 'react';

export default function ProjectHistory({ projects, onAdd, onDelete }) {
  const [project, setProject] = useState({ 
    projectName: '', 
    description: '', 
    startDate: '', 
    endDate: '', 
    status: 'ongoing' 
  });
  const [adding, setAdding] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!project.projectName) return;
    setAdding(true);
    try {
      await onAdd(project);
      setProject({ projectName: '', description: '', startDate: '', endDate: '', status: 'ongoing' });
    } finally {
      setAdding(false);
    }
  }

  return (
    <section style={{ marginBottom: 20 }}>
      <h3>Project History</h3>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
        <input 
          placeholder="Project Name" 
          value={project.projectName} 
          onChange={e => setProject(prev => ({ ...prev, projectName: e.target.value }))} 
          required 
        />
        <input 
          placeholder="Description" 
          value={project.description} 
          onChange={e => setProject(prev => ({ ...prev, description: e.target.value }))} 
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <input 
            type="date" 
            placeholder="Start Date" 
            value={project.startDate} 
            onChange={e => setProject(prev => ({ ...prev, startDate: e.target.value }))} 
          />
          <input 
            type="date" 
            placeholder="End Date" 
            value={project.endDate} 
            onChange={e => setProject(prev => ({ ...prev, endDate: e.target.value }))} 
          />
          <select 
            value={project.status} 
            onChange={e => setProject(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <button type="submit" disabled={adding}>
          {adding ? 'Adding...' : 'Add Project'}
        </button>
      </form>

      <ul>
        {(projects || []).map((p) => (
          <li key={p._id} style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 600 }}>{p.projectName} ({p.status || 'n/a'})</div>
              <div style={{ fontSize: 13, color: '#666' }}>
                {p.startDate ? new Date(p.startDate).toLocaleDateString() : '-'} - 
                {p.endDate ? new Date(p.endDate).toLocaleDateString() : '-'}
              </div>
              <div>{p.description}</div>
            </div>
            <div>
              <button 
                onClick={() => onDelete(p._id)} 
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