import React, { useState } from 'react';

export default function DocumentManager({ documents, onUpload, onDelete }) {
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await onUpload(file);
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  }

  async function downloadFile(url, filename) {
    try {
      const res = await fetch(url, { mode: 'cors' });
      if (!res.ok) throw new Error('Failed to fetch file for download');
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename || 'file';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  return (
    <section>
      <h3>Documents</h3>
      <div style={{ marginBottom: 12 }}>
        <input type="file" onChange={handleFileChange} disabled={uploading} />
        {uploading && <span style={{ marginLeft: 8 }}>Uploading...</span>}
      </div>

      <ul>
        {(documents || []).map((d) => (
          <li 
            key={d._id || d.fileUrl} 
            style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}
          >
            <div>
              <div>
                <a href={d.fileUrl} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600 }}>
                  {d.fileName}
                </a>
              </div>
              <div style={{ fontSize: 12, color: '#666' }}>
                {d.uploadedAt ? new Date(d.uploadedAt).toLocaleString() : ''}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                onClick={() => window.open(d.fileUrl, '_blank', 'noopener,noreferrer')} 
                title="View" 
                style={{ padding: '6px 10px' }}
              >
                View
              </button>
              <button 
                onClick={() => downloadFile(d.fileUrl, d.fileName)} 
                title="Download" 
                style={{ padding: '6px 10px' }}
              >
                Download
              </button>
              <button 
                onClick={() => onDelete(d._id)} 
                style={{ background: '#e53935', color: '#fff', padding: '6px 10px' }}
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