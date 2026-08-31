'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { apiFetch } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import Link from 'next/link';

export default function ProjectsPage() {
  const { activeWorkspace } = useAppContext();
  
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const fetchProjects = async () => {
    if (!activeWorkspace) return;
    setIsLoading(true);
    try {
      const response = await apiFetch(`${API_ENDPOINTS.PROJECT.BASE}?workspaceId=${activeWorkspace.id}`);
      if (response.success) {
        setProjects(response.data);
      }
    } catch (err) {
      console.error("Failed to load projects", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [activeWorkspace]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await apiFetch(API_ENDPOINTS.PROJECT.BASE, {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          workspaceId: activeWorkspace.id
        })
      });

      if (response.success) {
        await fetchProjects();
        setShowModal(false);
        setFormData({ name: '', description: '' });
      } else {
        setError(response.message || 'Failed to create project');
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
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>Create New Project</h2>
        <form onSubmit={handleCreateProject}>
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

  if (!activeWorkspace) {
    return <div style={{ color: 'var(--text-secondary)' }}>Please select a workspace first.</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Projects</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Managing projects for workspace <strong>{activeWorkspace.name}</strong>
          </p>
        </div>
        
        <button 
          className="glow-button" 
          onClick={() => setShowModal(true)}
          style={{ padding: '10px 20px', width: 'auto' }}
        >
          + New Project
        </button>
      </div>

      {error && (
        <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid var(--error)', borderRadius: '8px', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {isLoading ? (
        <div style={{ color: 'var(--text-secondary)' }}>Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="glass-card" style={{ padding: '48px', textAlign: 'center', borderStyle: 'dashed' }}>
          <div style={{ fontSize: '48px', color: 'var(--text-secondary)', marginBottom: '16px' }}>&#x1F4C2;</div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No projects found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
            Get started by creating your first project in this workspace.
          </p>
          <button className="glow-button" onClick={() => setShowModal(true)} style={{ width: 'auto', padding: '10px 20px' }}>Create Project</button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '24px' 
        }}>
          {projects.map(project => (
            <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
              <div className="glass-card" style={{ 
                padding: '24px', 
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(139, 92, 246, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>{project.name}</h3>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>&#x2197;</span>
                </div>
                
                {project.description && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
                    {project.description.substring(0, 100)}{project.description.length > 100 ? '...' : ''}
                  </p>
                )}

                <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                  <span style={{ padding: '4px 8px', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-primary)', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>
                    API Keys
                  </span>
                  <span style={{ padding: '4px 8px', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-primary)', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>
                    URL Shortener
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showModal && renderModal()}
    </div>
  );
}
