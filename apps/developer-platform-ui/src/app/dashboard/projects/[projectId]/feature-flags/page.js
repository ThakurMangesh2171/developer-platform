'use client';

import { useState } from 'react';
import { API_ENDPOINTS } from '@/lib/constants';

export default function FeatureFlagsPage({ params }) {
  const { projectId } = params;
  
  const [apiKey, setApiKey] = useState('');
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  
  const [flags, setFlags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  // We can only fetch Flags if they provide an API key
  const handleFetchFlags = async (e) => {
    e?.preventDefault();
    if (!apiKey) {
      setError('Please enter your API Key to view Feature Flags');
      return;
    }
    
    setIsFetching(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_ENDPOINTS.FEATURE_FLAGS.BASE}?projectId=${projectId}`, {
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setFlags(data);
      } else {
        setError(data.message || 'Invalid API Key or failed to fetch Feature Flags');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setIsFetching(false);
    }
  };

  const handleCreateFlag = async (e) => {
    e.preventDefault();
    if (!apiKey) {
      setError('Please enter your API Key to create Feature Flags');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_ENDPOINTS.FEATURE_FLAGS.BASE}?projectId=${projectId}`, {
        method: 'POST',
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          name, 
          key,
          description,
          enabled: isEnabled
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setName('');
        setKey('');
        setDescription('');
        setIsEnabled(false);
        handleFetchFlags(); // Refresh the list
      } else {
        setError(data.message || 'Failed to create Feature Flag');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFlag = async (flagKey) => {
    if (!apiKey) return;
    
    try {
      const response = await fetch(`${API_ENDPOINTS.FEATURE_FLAGS.BASE}/${flagKey}/toggle`, {
        method: 'PUT',
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        handleFetchFlags(); // Refresh list to get new state
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to toggle flag');
      }
    } catch (err) {
      setError('Network error while toggling flag');
    }
  };

  const handleDeleteFlag = async (id) => {
    if (!apiKey) return;
    if (!confirm('Are you sure you want to delete this feature flag?')) return;
    
    try {
      const response = await fetch(`${API_ENDPOINTS.FEATURE_FLAGS.BASE}/${id}`, {
        method: 'DELETE',
        headers: {
          'X-API-Key': apiKey
        }
      });
      
      if (response.ok) {
        handleFetchFlags();
      } else {
        setError('Failed to delete flag');
      }
    } catch (err) {
      setError('Network error while deleting flag');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Feature Flags</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '600px' }}>
          Toggle application features on and off in real-time. You must provide a valid API Key from the <strong>API Keys</strong> tab to authenticate these requests.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '24px', marginBottom: '32px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#F59E0B', fontWeight: '600' }}>Authenticate with API Key</label>
            <input 
              type="password" 
              className="premium-input" 
              placeholder="Paste your active API Key here..."
              value={apiKey}
              onChange={(e) => { setApiKey(e.target.value); setError(null); }}
              style={{ borderColor: error ? 'var(--error)' : 'rgba(245, 158, 11, 0.3)' }}
            />
          </div>
          <button 
            className="glow-button" 
            onClick={handleFetchFlags}
            disabled={isFetching || !apiKey}
            style={{ width: 'auto', padding: '12px 24px', background: '#F59E0B', boxShadow: '0 4px 14px 0 rgba(245, 158, 11, 0.4)' }}
          >
            {isFetching ? 'Connecting...' : 'Connect & Fetch'}
          </button>
        </div>
        
        {error && (
          <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid var(--error)', borderRadius: '6px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>&#x26A0;</span> {error}
          </div>
        )}
      </div>

      <form onSubmit={handleCreateFlag} className="glass-card" style={{ padding: '24px', marginBottom: '32px', position: 'relative', zIndex: 50 }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Create Feature Flag</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Display Name</label>
            <input 
              type="text" 
              className="premium-input" 
              placeholder="Beta UI Redesign"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Flag Key</label>
            <input 
              type="text" 
              className="premium-input" 
              placeholder="beta-ui-redesign"
              value={key}
              onChange={(e) => setKey(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
              required
            />
          </div>
          <div style={{ flex: '2 1 300px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Description</label>
            <input 
              type="text" 
              className="premium-input" 
              placeholder="Enables the new dashboard layout for beta testers."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
             <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Enabled by Default</label>
             <input 
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#F59E0B' }}
             />
          </div>
          <div style={{ flex: '0 0 auto', marginTop: '29px' }}>
            <button 
              type="submit" 
              className="glow-button" 
              disabled={isLoading || !apiKey}
              style={{ padding: '12px 24px', width: 'auto', opacity: (!apiKey || isLoading) ? 0.5 : 1, background: '#F59E0B', boxShadow: '0 4px 14px 0 rgba(245, 158, 11, 0.4)' }}
            >
              {isLoading ? 'Creating...' : 'Create Flag'}
            </button>
          </div>
        </div>
      </form>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '600' }}>Flag Details</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '600' }}>Key</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {flags.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  {apiKey ? "No feature flags found. Create one above!" : "Connect your API key to view feature flags."}
                </td>
              </tr>
            ) : (
              flags.map(flag => (
                <tr key={flag.key} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: '500', fontSize: '15px' }}>{flag.name}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>{flag.description || 'No description provided'}</div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <code style={{ background: 'var(--bg-tertiary)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#F59E0B' }}>
                      {flag.key}
                    </code>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                    {/* Toggle Switch UI */}
                    <div 
                      onClick={() => handleToggleFlag(flag.key)}
                      style={{
                        display: 'inline-flex',
                        width: '48px',
                        height: '24px',
                        background: flag.enabled ? '#10B981' : 'var(--bg-tertiary)',
                        borderRadius: '24px',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'background 0.3s',
                        border: '1px solid',
                        borderColor: flag.enabled ? '#10B981' : 'var(--border-color)'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '2px',
                        left: flag.enabled ? '26px' : '2px',
                        width: '18px',
                        height: '18px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        transition: 'left 0.3s',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }} />
                    </div>
                    <div style={{ fontSize: '11px', marginTop: '4px', color: flag.enabled ? '#10B981' : 'var(--text-secondary)', fontWeight: 'bold' }}>
                      {flag.enabled ? 'ENABLED' : 'DISABLED'}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleDeleteFlag(flag.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '8px', fontSize: '16px' }}
                      title="Delete Flag"
                    >
                      &#x1F5D1;
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
