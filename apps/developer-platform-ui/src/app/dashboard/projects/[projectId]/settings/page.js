'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/lib/constants';

export default function ProjectSettingsPage({ params }) {
  const { projectId } = params;
  const router = useRouter();

  const [project, setProject] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // We need to fetch the project details
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_ENDPOINTS.PROJECTS.BASE}/${projectId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        if (response.ok && data.success) {
          setProject(data.data);
          setName(data.data.name);
          setDescription(data.data.description || '');
          setStatus(data.data.status);
        } else {
          setError(data.message || 'Failed to fetch project details');
        }
      } catch (err) {
        setError('Network error while fetching project details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProject();
  }, [projectId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.PROJECTS.BASE}/${projectId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description, status })
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccessMessage('Project updated successfully!');
      } else {
        setError(data.message || 'Failed to update project');
      }
    } catch (err) {
      setError('Network error while updating project');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you absolutely sure you want to delete this project? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.PROJECTS.BASE}/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        alert('Project deleted successfully.');
        router.push('/dashboard');
      } else {
        setError(data.message || 'Failed to delete project');
        setIsDeleting(false);
      }
    } catch (err) {
      setError('Network error while deleting project');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div style={{ padding: '24px', color: 'var(--text-secondary)' }}>Loading project settings...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Project Settings</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '600px' }}>
          Manage your project details, update its status, or delete it entirely.
        </p>
      </div>

      {error && (
        <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid var(--error)', borderRadius: '8px', fontSize: '14px' }}>
          &#x26A0; {error}
        </div>
      )}
      
      {successMessage && (
        <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid #10b981', borderRadius: '8px', fontSize: '14px' }}>
          &#x2713; {successMessage}
        </div>
      )}

      <form onSubmit={handleUpdate} className="glass-card" style={{ padding: '32px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>General Information</h3>
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Project Name</label>
          <input 
            type="text" 
            className="premium-input" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ maxWidth: '400px' }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Description</label>
          <textarea 
            className="premium-input" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{ maxWidth: '600px', resize: 'vertical' }}
          />
        </div>
        
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Status</label>
          <select 
            className="premium-input" 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ maxWidth: '200px' }}
          >
            <option value="ACTIVE">Active</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="glow-button" 
          disabled={isSaving}
          style={{ width: 'auto', padding: '12px 32px' }}
        >
          {isSaving ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </form>

      <div className="glass-card" style={{ padding: '32px', border: '1px solid rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.05)' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: 'var(--error)' }}>Danger Zone</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
          Once you delete a project, there is no going back. Please be certain.
        </p>
        
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid var(--error)', 
            color: 'var(--error)', 
            padding: '12px 24px', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            fontSize: '14px', 
            fontWeight: '600',
            opacity: isDeleting ? 0.5 : 1
          }}
        >
          {isDeleting ? 'Deleting Project...' : 'Delete Project'}
        </button>
      </div>
    </div>
  );
}
