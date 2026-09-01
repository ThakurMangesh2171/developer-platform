'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/lib/constants';

export default function WorkspaceMembersPage({ params }) {
  const { id: workspaceId } = params;
  const router = useRouter();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('MEMBER');
  const [inviting, setInviting] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchMembers();
  }, [workspaceId]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.ME, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data);
      }
    } catch (err) {
      console.error('Failed to fetch current user', err);
    }
  };

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.WORKSPACE.MEMBERS(workspaceId), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setMembers(data);
      } else {
        setError(data.message || 'Failed to fetch members');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviting(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.WORKSPACE.MEMBERS(workspaceId), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole })
      });
      const data = await response.json();
      if (response.ok) {
        setInviteEmail('');
        setInviteRole('MEMBER');
        fetchMembers();
      } else {
        setError(data.message || 'Failed to invite member');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setInviting(false);
    }
  };

  const handleUpdateRole = async (memberId, newRole) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.WORKSPACE.MEMBERS(workspaceId)}/${memberId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });
      if (response.ok) {
        fetchMembers();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to update role');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    try {
      const response = await fetch(`${API_ENDPOINTS.WORKSPACE.MEMBERS(workspaceId)}/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        fetchMembers();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to remove member');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const currentUserRole = members.find(m => m.userId === currentUser?.id)?.role;
  const isAdmin = currentUserRole === 'ADMIN';

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Workspace Members</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Manage who has access to this workspace and their permissions.
          </p>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid var(--error)', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      {isAdmin && (
        <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Invite New Member</h3>
          <form onSubmit={handleInvite} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
            <div style={{ flex: 2 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Email Address</label>
              <input 
                type="email" 
                className="premium-input" 
                placeholder="developer@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Role</label>
              <select 
                className="premium-input"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
              >
                <option value="VIEWER">Viewer</option>
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <button 
              type="submit" 
              className="glow-button" 
              disabled={inviting || !inviteEmail}
              style={{ padding: '12px 24px' }}
            >
              {inviting ? 'Inviting...' : 'Invite Member'}
            </button>
          </form>
        </div>
      )}

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '600' }}>User</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '600' }}>Email</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '600' }}>Role</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading members...</td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>No members found.</td>
              </tr>
            ) : (
              members.map(member => (
                <tr key={member.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500' }}>
                    {member.firstName} {member.lastName}
                    {member.userId === currentUser?.id && <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--accent-primary)', background: 'rgba(139, 92, 246, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>You</span>}
                  </td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>
                    {member.email}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    {isAdmin && member.userId !== currentUser?.id ? (
                      <select 
                        className="premium-input"
                        value={member.role}
                        onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                        style={{ padding: '6px 12px', height: 'auto', fontSize: '14px', minWidth: '120px' }}
                      >
                        <option value="VIEWER">Viewer</option>
                        <option value="MEMBER">Member</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    ) : (
                      <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{member.role}</span>
                    )}
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    {isAdmin && member.userId !== currentUser?.id && (
                      <button 
                        onClick={() => handleRemoveMember(member.id)}
                        style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', color: 'var(--error)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '500', transition: 'all 0.2s' }}
                      >
                        Remove
                      </button>
                    )}
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
