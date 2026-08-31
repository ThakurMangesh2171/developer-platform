'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';

export default function ProjectApiKeysPage({ params }) {
  const { projectId } = params;
  
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newKey, setNewKey] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApiKeys();
  }, [projectId]);

  const fetchApiKeys = async () => {
    setIsLoading(true);
    try {
      const response = await apiFetch(`${API_ENDPOINTS.API_KEYS.BASE}?projectId=${projectId}`);
      if (response.success) {
        setApiKeys(response.data);
      } else {
        setError(response.message || 'Failed to fetch API keys');
      }
    } catch (err) {
      setError('Network error loading API keys');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateKey = async () => {
    setIsGenerating(true);
    setError(null);
    setNewKey(null);
    try {
      // Hardcode a default name for now
      const response = await apiFetch(API_ENDPOINTS.API_KEYS.BASE, {
        method: 'POST',
        body: JSON.stringify({
          projectId: projectId,
          name: `API Key - ${new Date().getTime()}`
        })
      });

      if (response.success) {
        setNewKey(response.data.rawKey);
        fetchApiKeys(); // Refresh the list
      } else {
        setError(response.message || 'Failed to generate API key');
      }
    } catch (err) {
      setError('Network error generating key');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRevokeKey = async (keyId) => {
    if (!confirm('Are you sure you want to revoke this API key? Any applications using it will immediately lose access.')) return;
    
    try {
      const response = await apiFetch(`${API_ENDPOINTS.API_KEYS.BASE}/${keyId}`, {
        method: 'DELETE'
      });
      if (response.success) {
        fetchApiKeys(); // Refresh list
      } else {
        setError(response.message || 'Failed to revoke API key');
      }
    } catch (err) {
      setError('Network error revoking API key');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>API Keys</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '600px' }}>
            These keys grant full access to your project's microservices (like the URL Shortener). 
            Do not share them in publicly accessible areas such as GitHub, client-side code, and so forth.
          </p>
        </div>
        <button 
          className="glow-button" 
          onClick={handleGenerateKey} 
          disabled={isGenerating}
          style={{ padding: '10px 20px', width: 'auto', opacity: isGenerating ? 0.7 : 1 }}
        >
          {isGenerating ? 'Generating...' : '+ Generate New Key'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid var(--error)', borderRadius: '8px', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {/* Show newly generated key prominently (only once) */}
      {newKey && (
        <div style={{ padding: '24px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid var(--success)', borderRadius: '8px', marginBottom: '32px' }}>
          <h3 style={{ color: 'var(--success)', fontWeight: 'bold', marginBottom: '12px' }}>&#x2714; New API Key Generated</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
            Please copy this key and save it somewhere safe. For security reasons, <strong>we cannot show it to you again.</strong>
          </p>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <code style={{ flex: 1, padding: '12px', background: '#09090B', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '14px', color: 'var(--text-primary)' }}>
              {newKey}
            </code>
            <button 
              style={{ padding: '12px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', cursor: 'pointer' }}
              onClick={() => navigator.clipboard.writeText(newKey)}
            >
              Copy
            </button>
          </div>
        </div>
      )}

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '600' }}>Name</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '600' }}>Key Preview</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '600' }}>Created At</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading keys...</td>
              </tr>
            ) : apiKeys.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No API keys found. Generate one to get started.
                </td>
              </tr>
            ) : (
              apiKeys.map(key => (
                <tr key={key.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500' }}>{key.name}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <code style={{ background: '#09090B', padding: '4px 8px', borderRadius: '4px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {key.keyPrefix}••••••••••••••••
                    </code>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {new Date(key.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button 
                      style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
                      onClick={() => handleRevokeKey(key.id)}
                    >
                      Revoke
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
