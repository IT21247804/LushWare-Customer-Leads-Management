import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getCustomer,
  updateCustomer,
  deleteCustomer,
  addCustomerLog,
  addCustomerProject,
  deleteCustomerLog,
  deleteCustomerProject
} from '../api/customer';

export default function CustomerDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');

  // local UI state for adding logs/projects/docs
  const [logMsg, setLogMsg] = useState('');
  const [logType, setLogType] = useState('note');
  const [project, setProject] = useState({ projectName: '', description: '', startDate: '', endDate: '', status: 'ongoing' });
  const [uploading, setUploading] = useState(false);
  const [addingLog, setAddingLog] = useState(false);
  const [addingProject, setAddingProject] = useState(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [id]);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await getCustomer(id);
      setCustomer(data);
      setForm(data ? { ...data } : null);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  function onChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

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

  async function saveDetails(e) {
    e && e.preventDefault();
    if (!form || !form._id) return;
    setError('');
    try {
      const updated = await updateCustomer(form._id, form);
      setCustomer(updated);
      setEditing(false);
    } catch (err) {
      setError(err.message || String(err));
    }
  }

  async function removeCustomer() {
    if (!window.confirm('Delete this customer?')) return;
    try {
      await deleteCustomer(id);
      navigate('/customers');
    } catch (err) {
      setError(err.message || String(err));
    }
  }

  async function addLog(e) {
    e.preventDefault();
    if (!logMsg) return;
    setAddingLog(true);
    setError('');
    try {
      const payload = { type: logType, message: logMsg };
      const updated = await addCustomerLog(id, payload);
      setCustomer(updated);
      setForm(updated);
      setLogMsg('');
      setLogType('note');
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setAddingLog(false);
    }
  }

  async function addProject(e) {
    e.preventDefault();
    if (!project.projectName) return;
    setAddingProject(true);
    setError('');
    try {
      const payload = { ...project };
      const updated = await addCustomerProject(id, payload);
      setCustomer(updated);
      setForm(updated);
      setProject({ projectName: '', description: '', startDate: '', endDate: '', status: 'ongoing' });
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setAddingProject(false);
    }
  }

  async function handleDeleteLog(logId) {
    if (!window.confirm('Delete this communication log?')) return;
    setError('');
    try {
      const updated = await deleteCustomerLog(id, logId);
      setCustomer(updated);
      setForm(updated);
    } catch (err) {
      setError(err.message || String(err));
    }
  }

  async function handleDeleteProject(projectId) {
    if (!window.confirm('Delete this project?')) return;
    setError('');
    try {
      const updated = await deleteCustomerProject(id, projectId);
      setCustomer(updated);
      setForm(updated);
    } catch (err) {
      setError(err.message || String(err));
    }
  }

  async function handleDeleteDoc(docId) {
    if (!window.confirm('Delete this document?')) return;
    setError('');
    try {
      // Remove document from customer's documents array
      const updatedDocs = customer.documents.filter(d => d._id !== docId);
      const next = { ...customer, documents: updatedDocs };
      
      // Update customer via backend
      const updated = await updateCustomer(id, next);
      setCustomer(updated);
      setForm(updated);
    } catch (err) {
      setError(err.message || String(err));
    }
  }

  async function onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
      if (!cloudName || !uploadPreset) throw new Error('Missing Cloudinary config (REACT_APP_CLOUDINARY_CLOUD_NAME / UPLOAD_PRESET)');

      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: 'POST',
        body: fd
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error('Cloudinary upload failed: ' + text);
      }

      const data = await res.json();
      const doc = {
        fileName: file.name,
        fileUrl: data.secure_url,
        uploadedAt: new Date().toISOString(),
        public_id: data.public_id
      };

      // Append doc to customer documents and persist via backend
      const next = { ...customer, documents: [...(customer.documents || []), doc] };
      const updated = await updateCustomer(id, next);
      setCustomer(updated);
      setForm(updated);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  }

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!customer) return <div style={{ padding: 20 }}>Customer not found.</div>;

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{customer.name}</h2>
        <div>
          <button onClick={() => navigate('/customers')} style={{ marginRight: 8 }}>Back</button>
          <button onClick={() => setEditing(prev => !prev)} style={{ marginRight: 8 }}>{editing ? 'Cancel' : 'Edit'}</button>
          <button onClick={removeCustomer} style={{ background: '#e53935', color: '#fff' }}>Delete</button>
        </div>
      </div>

      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}

      {editing ? (
        <form onSubmit={saveDetails} style={{ display: 'grid', gap: 8, marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input name="name" value={form.name || ''} onChange={onChange} required />
            <input name="companyName" value={form.companyName || ''} onChange={onChange} />
            <input name="email" value={form.email || ''} onChange={onChange} />
            <input name="phone" value={form.phone || ''} onChange={onChange} />
            <input name="address" value={form.address || ''} onChange={onChange} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input name="contactPerson.name" value={form.contactPerson?.name || ''} onChange={e => setField('contactPerson.name', e.target.value)} />
            <input name="contactPerson.position" value={form.contactPerson?.position || ''} onChange={e => setField('contactPerson.position', e.target.value)} />
            <input name="contactPerson.email" value={form.contactPerson?.email || ''} onChange={e => setField('contactPerson.email', e.target.value)} />
            <input name="contactPerson.phone" value={form.contactPerson?.phone || ''} onChange={e => setField('contactPerson.phone', e.target.value)} />
          </div>

          <div>
            <button type="submit">Save</button>
          </div>
        </form>
      ) : (
        <div style={{ marginBottom: 20 }}>
          <div><strong>Company:</strong> {customer.companyName || '-'}</div>
          <div><strong>Email:</strong> {customer.email || '-'}</div>
          <div><strong>Phone:</strong> {customer.phone || '-'}</div>
          <div><strong>Address:</strong> {customer.address || '-'}</div>
          <div><strong>Contact:</strong> {customer.contactPerson?.name || '-'} {customer.contactPerson?.email ? `(${customer.contactPerson.email})` : ''}</div>
        </div>
      )}

      {/* Communication log */}
      <section style={{ marginBottom: 20 }}>
        <h3>Communication Log</h3>
        <form onSubmit={addLog} style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
          <select value={logType} onChange={e => setLogType(e.target.value)} style={{ minWidth: 120 }}>
            <option value="note">Note</option>
            <option value="call">Call</option>
            <option value="email">Email</option>
            <option value="meeting">Meeting</option>
          </select>
          <input placeholder="Log message" value={logMsg} onChange={e => setLogMsg(e.target.value)} style={{ flex: 1 }} />
          <button type="submit" disabled={addingLog}>{addingLog ? 'Adding...' : 'Add'}</button>
        </form>
        <ul>
          {(customer.communicationLogs || []).slice().reverse().map((l) => (
            <li key={l._id} style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ fontSize: 13, color: '#666' }}>{new Date(l.timestamp).toLocaleString()} • {l.type}</div>
                <div>{l.message}</div>
              </div>
              <div>
                <button onClick={() => handleDeleteLog(l._id)} style={{ background: '#e53935', color: '#fff' }}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Project history */}
      <section style={{ marginBottom: 20 }}>
        <h3>Project History</h3>
        <form onSubmit={addProject} style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
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
          <button type="submit" disabled={addingProject}>{addingProject ? 'Adding...' : 'Add Project'}</button>
        </form>

        <ul>
          {(customer.projectHistory || []).map((p) => (
            <li key={p._id} style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ fontWeight: 600 }}>{p.projectName} ({p.status || 'n/a'})</div>
                <div style={{ fontSize: 13, color: '#666' }}>
                  {p.startDate ? new Date(p.startDate).toLocaleDateString() : '-'} - {p.endDate ? new Date(p.endDate).toLocaleDateString() : '-'}
                </div>
                <div>{p.description}</div>
              </div>
              <div>
                <button onClick={() => handleDeleteProject(p._id)} style={{ background: '#e53935', color: '#fff' }}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Documents */}
      <section>
        <h3>Documents</h3>
        <div style={{ marginBottom: 12 }}>
          <input type="file" onChange={onFileChange} disabled={uploading} />
          {uploading && <span style={{ marginLeft: 8 }}>Uploading...</span>}
        </div>

        <ul>
          {(customer.documents || []).map((d) => (
            <li key={d._id || d.fileUrl} style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <div>
                <a href={d.fileUrl} target="_blank" rel="noreferrer">{d.fileName}</a>
                <div style={{ fontSize: 12, color: '#666' }}>{d.uploadedAt ? new Date(d.uploadedAt).toLocaleString() : ''}</div>
              </div>
              <div>
                <button onClick={() => handleDeleteDoc(d._id)} style={{ background: '#e53935', color: '#fff' }}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}