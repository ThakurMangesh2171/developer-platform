'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';

export default function WorkspaceSettingsPage({ params }) {
  const { workspaceId } = params;
  
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('MEMBER');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState(null);
  const [inviteSuccess, setInviteSuccess] = useState(null);
  const [mainError, setMainError] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, [workspaceId]);

  const fetchMembers = async () => {
    setIsLoading(true);
    setMainError(null);
    try {
      const response = await apiFetch(API_ENDPOINTS.WORKSPACE.MEMBERS(workspaceId));
      if (Array.isArray(response)) {
        setMembers(response);
      } else {
        setMainError(response.message || 'Failed to load workspace members. You might not have access.');
      }
    } catch (err) {
      setMainError('Network error while loading members.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setIsInviting(true);
    setInviteError(null);
    setInviteSuccess(null);
    
    try {
      const response = await apiFetch(API_ENDPOINTS.WORKSPACE.MEMBERS(workspaceId), {
        method: 'POST',
        body: JSON.stringify({ email: inviteEmail, role: inviteRole })
      });

      if (response && response.id) {
        setInviteSuccess(`Successfully invited ${inviteEmail} as ${inviteRole}`);
        setInviteEmail('');
        fetchMembers();
      } else {
        setInviteError(response.message || 'Failed to invite user');
      }
    } catch (err) {
      setInviteError('Network error while inviting user');
    } finally {
      setIsInviting(false);
    }
  };

  const handleRoleChange = async (memberId, newRole) => {
    try {
      const response = await apiFetch(`${API_ENDPOINTS.WORKSPACE.MEMBERS(workspaceId)}/${memberId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole })
      });
      if (response && response.id) {
        fetchMembers();
      } else {
        alert(response.message || 'Failed to update role');
      }
    } catch (err) {
      alert('Network error updating role');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!confirm('Are you sure you want to remove this member from the workspace?')) return;
    
    try {
      const response = await apiFetch(`${API_ENDPOINTS.WORKSPACE.MEMBERS(workspaceId)}/${memberId}`, {
        method: 'DELETE'
      });
      fetchMembers();
    } catch (err) {
      alert('Network error removing member');
    }
  };

  if (mainError) {
    return (
      <div style={{ padding: '24px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid var(--error)', borderRadius: '8px' }}>
        <h3 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Access Denied</h3>
        <p>{mainError}</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Team Members</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '800px' }}>
          Manage who has access to this workspace. Admins have full access, Members can manage resources, and Viewers can only read data.
        </p>
      </div>

      {/* Invite Member Section */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Invite New Member</h3>
        <form onSubmit={handleInvite} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ flex: 2 }}>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="user@example.com"
              required
              className="input-field"
              style={{ width: '100%' }}
              disabled={isInviting}
            />
          </div>
          <div style={{ flex: 1 }}>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="input-field"
              style={{ width: '100%', appearance: 'auto' }}
              disabled={isInviting}
            >
              <option value="ADMIN">Admin</option>
              <option value="MEMBER">Member</option>
              <option value="VIEWER">Viewer</option>
            </select>
          </div>
          <button 
            type="submit"
            className="glow-button" 
            disabled={isInviting || !inviteEmail}
            style={{ padding: '12px 24px', opacity: (isInviting || !inviteEmail) ? 0.7 : 1 }}
          >
            {isInviting ? 'Inviting...' : 'Send Invite'}
          </button>
        </form>
        
        {inviteError && (
          <div style={{ marginTop: '16px', color: 'var(--error)', fontSize: '14px' }}>
            &#x26A0; {inviteError}
          </div>
        )}
        {inviteSuccess && (
          <div style={{ marginTop: '16px', color: 'var(--success)', fontSize: '14px' }}>
            &#x2714; {inviteSuccess}
          </div>
        )}
      </div>

      {/* Members List */}
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Current Members</h3>
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '600' }}>User</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '600' }}>Role</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '600' }}>Joined</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading members...</td>
              </tr>
            ) : (
              members.map(member => (
                <tr key={member.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: '500', fontSize: '15px' }}>{member.firstName} {member.lastName}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>{member.email}</div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value)}
                      style={{ 
                        background: 'rgba(255,255,255,0.05)', 
                        border: '1px solid var(--border-color)', 
                        color: 'var(--text-primary)', 
                        padding: '6px 12px', 
                        borderRadius: '4px',
                        fontSize: '13px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="ADMIN" style={{ background: '#09090B' }}>Admin</option>
                      <option value="MEMBER" style={{ background: '#09090B' }}>Member</option>
                      <option value="VIEWER" style={{ background: '#09090B' }}>Viewer</option>
                    </select>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button 
                      style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      Remove
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
