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
import { createNotification } from '../api/notification';

// Import components
import CustomerHeader from '../components/customer/CustomerHeader';
import CustomerDetailsForm from '../components/customer/CustomerDetailsForm';
import CommunicationLog from '../components/customer/CommunicationLog';
import ProjectHistory from '../components/customer/ProjectHistory';
import DocumentManager from '../components/customer/DocumentManager';

export default function CustomerDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');

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

      await createNotification({
        message: `Customer "${form.name}" details updated`,
        read: false
      }).catch(console.error);
    } catch (err) {
      setError(err.message || String(err));
    }
  }

  async function removeCustomer() {
    if (!window.confirm('Delete this customer?')) return;
    try {
      const customerName = customer.name;
      await deleteCustomer(id);

      await createNotification({
        message: `Customer "${customerName}" deleted`,
        read: false
      }).catch(console.error);

      navigate('/customers');
    } catch (err) {
      setError(err.message || String(err));
    }
  }

  async function handleAddLog(payload) {
    setError('');
    try {
      const updated = await addCustomerLog(id, payload);
      setCustomer(updated);
      setForm(updated);

      await createNotification({
        message: `Communication log added: ${payload.message.substring(0, 50)}... for customer ${customer.name}`,
        read: false
      }).catch(console.error);
    } catch (err) {
      setError(err.message || String(err));
      throw err;
    }
  }

  async function handleDeleteLog(logId) {
    if (!window.confirm('Delete this communication log?')) return;
    setError('');
    try {
      const log = (customer.communicationLogs || []).find(l => l._id === logId);
      const updated = await deleteCustomerLog(id, logId);
      setCustomer(updated);
      setForm(updated);

      await createNotification({
        message: `Communication log deleted: "${log?.message.substring(0, 50)}..." for customer ${customer.name}`,
        read: false
      }).catch(console.error);
    } catch (err) {
      setError(err.message || String(err));
    }
  }

  async function handleAddProject(payload) {
    setError('');
    try {
      const updated = await addCustomerProject(id, payload);
      setCustomer(updated);
      setForm(updated);

      await createNotification({
        message: `Project "${payload.projectName}" added for customer ${customer.name}`,
        read: false
      }).catch(console.error);
    } catch (err) {
      setError(err.message || String(err));
      throw err;
    }
  }

  async function handleDeleteProject(projectId) {
    if (!window.confirm('Delete this project?')) return;
    setError('');
    try {
      const proj = (customer.projectHistory || []).find(p => p._id === projectId);
      const updated = await deleteCustomerProject(id, projectId);
      setCustomer(updated);
      setForm(updated);

      await createNotification({
        message: `Project "${proj?.projectName}" deleted for customer ${customer.name}`,
        read: false
      }).catch(console.error);
    } catch (err) {
      setError(err.message || String(err));
    }
  }

  async function handleUploadDocument(file) {
    setError('');
    try {
      const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
      if (!cloudName || !uploadPreset) {
        throw new Error('Missing Cloudinary config');
      }

      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: 'POST',
        body: fd
      });

      if (!res.ok) throw new Error('Cloudinary upload failed');

      const data = await res.json();
      const doc = {
        fileName: file.name,
        fileUrl: data.secure_url,
        uploadedAt: new Date().toISOString(),
        public_id: data.public_id
      };

      const next = { ...customer, documents: [...(customer.documents || []), doc] };
      const updated = await updateCustomer(id, next);
      setCustomer(updated);
      setForm(updated);

      await createNotification({
        message: `Document "${file.name}" uploaded to customer ${customer.name}`,
        read: false
      }).catch(console.error);
    } catch (err) {
      setError(err.message || String(err));
      throw err;
    }
  }

  async function handleDeleteDocument(docId) {
    if (!window.confirm('Delete this document?')) return;
    setError('');
    try {
      const doc = (customer.documents || []).find(d => d._id === docId);
      const updatedDocs = customer.documents.filter(d => d._id !== docId);
      const next = { ...customer, documents: updatedDocs };
      
      const updated = await updateCustomer(id, next);
      setCustomer(updated);
      setForm(updated);

      await createNotification({
        message: `Document "${doc?.fileName}" deleted from customer ${customer.name}`,
        read: false
      }).catch(console.error);
    } catch (err) {
      setError(err.message || String(err));
    }
  }

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!customer) return <div style={{ padding: 20 }}>Customer not found.</div>;

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: '0 auto' }}>
      <CustomerHeader
        customer={customer}
        isEditing={editing}
        onEdit={() => setEditing(prev => !prev)}
        onDelete={removeCustomer}
      />

      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}

      <CustomerDetailsForm
        customer={customer}
        form={form}
        editing={editing}
        onChange={onChange}
        setField={setField}
        onSave={saveDetails}
      />

      <CommunicationLog
        logs={customer.communicationLogs}
        onAdd={handleAddLog}
        onDelete={handleDeleteLog}
      />

      <ProjectHistory
        projects={customer.projectHistory}
        onAdd={handleAddProject}
        onDelete={handleDeleteProject}
      />

      <DocumentManager
        documents={customer.documents}
        onUpload={handleUploadDocument}
        onDelete={handleDeleteDocument}
      />
    </div>
  );
}