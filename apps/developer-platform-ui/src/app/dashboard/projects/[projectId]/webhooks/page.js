'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';

export default function ProjectWebhooksPage({ params }) {
  const { projectId } = params;
  
  const [webhooks, setWebhooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newWebhook, setNewWebhook] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWebhooks();
  }, [projectId]);

  const fetchWebhooks = async () => {
    setIsLoading(true);
    try {
      const response = await apiFetch(API_ENDPOINTS.WEBHOOKS.BASE(projectId));
      if (response) {
        setWebhooks(response);
      } else {
        setError('Failed to load webhooks');
      }
    } catch (err) {
      setError('Network error while loading webhooks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWebhook = async (e) => {
    e.preventDefault();
    if (!newUrl) return;

    setIsAdding(true);
    setError(null);
    setNewWebhook(null);
    try {
      const response = await apiFetch(API_ENDPOINTS.WEBHOOKS.BASE(projectId), {
        method: 'POST',
        body: JSON.stringify({ url: newUrl })
      });

      if (response && response.id) {
        setNewWebhook(response);
        setNewUrl('');
        fetchWebhooks(); // Refresh list
      } else {
        setError(response.message || 'Failed to add webhook');
      }
    } catch (err) {
      setError('Network error while adding webhook');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteWebhook = async (webhookId) => {
    if (!confirm('Are you sure you want to delete this webhook endpoint?')) return;
    
    try {
      const response = await apiFetch(`${API_ENDPOINTS.WEBHOOKS.BASE(projectId)}/${webhookId}`, {
        method: 'DELETE'
      });
      fetchWebhooks(); // Refresh list after deletion
    } catch (err) {
      setError('Network error while deleting webhook');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Webhook Endpoints</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '800px' }}>
          Webhooks allow you to build or set up integrations that subscribe to certain events on the platform. 
          When one of those events is triggered (like a feature flag being toggled), we'll send a HTTP POST payload to the webhook's configured URL.
        </p>
      </div>

      {error && (
        <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid var(--error)', borderRadius: '8px', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {/* Add Webhook Form */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Add Endpoint</h3>
        <form onSubmit={handleAddWebhook} style={{ display: 'flex', gap: '16px' }}>
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://api.yourcompany.com/webhooks"
            required
            className="input-field"
            style={{ flex: 1 }}
            disabled={isAdding}
          />
          <button 
            type="submit"
            className="glow-button" 
            disabled={isAdding || !newUrl}
            style={{ padding: '0 24px', opacity: (isAdding || !newUrl) ? 0.7 : 1 }}
          >
            {isAdding ? 'Adding...' : 'Add Webhook'}
          </button>
        </form>
      </div>

      {/* Show newly generated signing secret prominently (only once) */}
      {newWebhook && (
        <div style={{ padding: '24px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid var(--success)', borderRadius: '8px', marginBottom: '32px' }}>
          <h3 style={{ color: 'var(--success)', fontWeight: 'bold', marginBottom: '12px' }}>&#x2714; Endpoint Added Successfully</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
            Please copy this <strong>Signing Secret</strong>. You will use it to verify that incoming payloads are legitimately from our platform (using HMAC SHA256). For security reasons, we cannot show it to you again.
          </p>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <code style={{ flex: 1, padding: '12px', background: '#09090B', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '14px', color: 'var(--text-primary)' }}>
              {newWebhook.signingSecret}
            </code>
            <button 
              style={{ padding: '12px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', cursor: 'pointer' }}
              onClick={() => navigator.clipboard.writeText(newWebhook.signingSecret)}
            >
              Copy Secret
            </button>
          </div>
        </div>
      )}

      {/* Webhooks List */}
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Configured Endpoints</h3>
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '600' }}>URL</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '600' }}>Created At</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading endpoints...</td>
              </tr>
            ) : webhooks.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No webhook endpoints configured yet.
                </td>
              </tr>
            ) : (
              webhooks.map(webhook => (
                <tr key={webhook.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500' }}>{webhook.url}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      background: webhook.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                      color: webhook.isActive ? 'var(--success)' : 'var(--error)', 
                      borderRadius: '4px', 
                      fontSize: '12px', 
                      fontWeight: '600' 
                    }}>
                      {webhook.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {new Date(webhook.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button 
                      style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
                      onClick={() => handleDeleteWebhook(webhook.id)}
                    >
                      Delete
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
