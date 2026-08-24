'use client';

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { apiFetch } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import Link from 'next/link';

export default function WorkspacesPage() {
  const { workspaces, activeWorkspace, setActiveWorkspace, fetchWorkspaces } = useAppContext();
  
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await apiFetch(API_ENDPOINTS.WORKSPACE.BASE, {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (response.success) {
        await fetchWorkspaces(); // refresh the list
        setShowModal(false);
        setFormData({ name: '', description: '' });
      } else {
        setError(response.message || 'Failed to create workspace');
      }
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderModal = () => (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="glass-card" style={{ width: '400px', padding: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>Create New Workspace</h2>
        <form onSubmit={handleCreateWorkspace}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Name</label>
            <input 
              type="text" 
              className="premium-input" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              minLength={3}
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Description (Optional)</label>
            <textarea 
              className="premium-input" 
              style={{ minHeight: '80px', resize: 'vertical' }}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setShowModal(false)} style={{ padding: '8px 16px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" className="glow-button" disabled={isSubmitting} style={{ padding: '8px 16px', width: 'auto' }}>
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Workspaces</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Manage all your team workspaces here.</p>
        </div>
        
        <button 
          className="glow-button" 
          onClick={() => setShowModal(true)}
          style={{ padding: '10px 20px', width: 'auto' }}
        >
          + New Workspace
        </button>
      </div>

      {error && (
        <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid var(--error)', borderRadius: '8px', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {workspaces.length === 0 ? (
        <div className="glass-card" style={{ padding: '48px', textAlign: 'center', borderStyle: 'dashed' }}>
          <div style={{ fontSize: '48px', color: 'var(--text-secondary)', marginBottom: '16px' }}>&#x26BF;</div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No workspaces found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
            Get started by creating your first workspace.
          </p>
          <button className="glow-button" onClick={() => setShowModal(true)} style={{ width: 'auto', padding: '10px 20px' }}>Create Workspace</button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '24px' 
        }}>
          {workspaces.map(ws => (
            <div key={ws.id} className="glass-card" style={{ 
              padding: '24px', 
              border: activeWorkspace?.id === ws.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>{ws.name}</h3>
                {activeWorkspace?.id === ws.id && (
                  <span style={{ fontSize: '12px', padding: '4px 8px', background: 'rgba(139, 92, 246, 0.2)', color: 'var(--accent-primary)', borderRadius: '12px' }}>Active</span>
                )}
              </div>
              
              {ws.description && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
                  {ws.description.substring(0, 100)}{ws.description.length > 100 ? '...' : ''}
                </p>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                {activeWorkspace?.id !== ws.id && (
                  <button 
                    onClick={() => setActiveWorkspace(ws)}
                    style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                  >
                    Switch to Workspace
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && renderModal()}
    </div>
  );
}
