'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { apiFetch } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import Link from 'next/link';

export default function DashboardOverview() {
  const { activeWorkspace, setActiveWorkspace, workspaces, setWorkspaces, user, isLoading: contextLoading } = useAppContext();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ totalProjects: 0, totalApiKeys: 0, totalShortenedUrls: 0, totalUrlClicks: 0 });
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProjects = async () => {
    if (!activeWorkspace) return;
    
    setIsLoadingProjects(true);
    setError(null);
    
    try {
      const [projectsResponse, statsResponse] = await Promise.all([
        apiFetch(`${API_ENDPOINTS.PROJECT.BASE}?workspaceId=${activeWorkspace.id}`),
        apiFetch(API_ENDPOINTS.WORKSPACE.STATS(activeWorkspace.id))
      ]);
      
      if (projectsResponse.success) {
        setProjects(projectsResponse.data);
      } else {
        setError(projectsResponse.message || 'Failed to fetch projects');
      }
      
      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setIsLoadingProjects(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [activeWorkspace]);

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
        const newWorkspace = response.data;
        setWorkspaces([...workspaces, newWorkspace]);
        setActiveWorkspace(newWorkspace);
        setShowWorkspaceModal(false);
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
        fetchProjects(); // refresh the list
        setShowProjectModal(false);
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

  if (contextLoading) {
    return <div style={{ color: 'var(--text-secondary)' }}>Loading Workspace...</div>;
  }

  const renderModal = (title, onSubmit, onCancel) => (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="glass-card" style={{ width: '400px', padding: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>{title}</h2>
        <form onSubmit={onSubmit}>
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
            <button type="button" onClick={onCancel} style={{ padding: '8px 16px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" className="glow-button" disabled={isSubmitting} style={{ padding: '8px 16px', width: 'auto' }}>
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (!activeWorkspace) {
    return (
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Welcome to DevFlow</h1>
        <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>You don't have any workspaces yet.</p>
          <button 
            className="glow-button" 
            onClick={() => setShowWorkspaceModal(true)}
            style={{ padding: '8px 16px', marginTop: '16px', width: 'auto' }}
          >
            Create Workspace
          </button>
        </div>
        {showWorkspaceModal && renderModal('Create New Workspace', handleCreateWorkspace, () => setShowWorkspaceModal(false))}
        {error && <div style={{ color: 'var(--error)', marginTop: '16px' }}>{error}</div>}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
            Welcome back, {user?.firstName}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Here's what's happening in <strong>{activeWorkspace.name}</strong>
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link href={`/dashboard/workspaces/${activeWorkspace.id}/settings`}>
            <button 
              style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
            >
              Workspace Settings
            </button>
          </Link>
          <Link href={`/dashboard/workspaces/${activeWorkspace.id}/members`}>
            <button 
              style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
            >
              Members
            </button>
          </Link>
          <button 
            className="glow-button" 
            onClick={() => setShowProjectModal(true)}
            style={{ padding: '10px 20px', width: 'auto' }}
          >
            + New Project
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid var(--error)', borderRadius: '8px', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {/* Stats Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        {[
          { label: 'Total Projects', value: stats.totalProjects, icon: '&#x1F4C2;', color: 'var(--accent-primary)' },
          { label: 'API Keys', value: stats.totalApiKeys, icon: '&#x1F5DD;', color: '#10B981' },
          { label: 'Shortened URLs', value: stats.totalShortenedUrls, icon: '&#x1F517;', color: '#F59E0B' },
          { label: 'URL Clicks', value: stats.totalUrlClicks, icon: '&#x1F5B1;', color: '#3B82F6' }
        ].map((stat, idx) => (
          <div key={idx} className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              width: '48px', height: '48px', borderRadius: '12px', background: `${stat.color}15`, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: stat.color
            }} dangerouslySetInnerHTML={{ __html: stat.icon }} />
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>
                {stat.label}
              </p>
              <h3 style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '4px' }}>
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Projects</h2>

      {isLoadingProjects ? (
        <div style={{ color: 'var(--text-secondary)' }}>Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="glass-card" style={{ padding: '48px', textAlign: 'center', borderStyle: 'dashed' }}>
          <div style={{ fontSize: '48px', color: 'var(--text-secondary)', marginBottom: '16px' }}>&#x1F4C2;</div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No projects found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
            Get started by creating your first project in this workspace.
          </p>
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

      {showWorkspaceModal && renderModal('Create New Workspace', handleCreateWorkspace, () => setShowWorkspaceModal(false))}
      {showProjectModal && renderModal('Create New Project', handleCreateProject, () => setShowProjectModal(false))}
    </div>
  );
}
