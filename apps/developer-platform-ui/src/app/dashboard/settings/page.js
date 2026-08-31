'use client';

import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { apiFetch } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';

export default function SettingsPage() {
  const { theme, setTheme, user, setUser } = useAppContext();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);

  // Security Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securityMessage, setSecurityMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
    }
  }, [user]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage(null);

    try {
      const response = await apiFetch(API_ENDPOINTS.AUTH.UPDATE_PROFILE, {
        method: 'PUT',
        body: JSON.stringify({ firstName, lastName })
      });

      if (response.success) {
        setUser(response.data); // Update global context immediately
        setProfileMessage({ type: 'success', text: 'Profile updated successfully.' });
      } else {
        setProfileMessage({ type: 'error', text: response.message || 'Failed to update profile.' });
      }
    } catch (err) {
      setProfileMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSecurityLoading(true);
    setSecurityMessage(null);

    try {
      const response = await apiFetch(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        method: 'PUT',
        body: JSON.stringify({ oldPassword, newPassword })
      });

      if (response.success) {
        setOldPassword('');
        setNewPassword('');
        setSecurityMessage({ type: 'success', text: 'Password changed successfully.' });
      } else {
        setSecurityMessage({ type: 'error', text: response.message || 'Failed to change password.' });
      }
    } catch (err) {
      setSecurityMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSecurityLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your personal preferences and application settings.</p>
      </div>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        {/* Sidebar Tabs */}
        <div style={{ width: '220px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { id: 'profile', label: 'Profile', icon: '&#x1F464;' },
            { id: 'security', label: 'Security', icon: '&#x1F512;' },
            { id: 'appearance', label: 'Appearance', icon: '&#x1F3A8;' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setProfileMessage(null); setSecurityMessage(null); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                borderRadius: '8px', cursor: 'pointer', border: 'none',
                background: activeTab === tab.id ? 'var(--accent-primary)' : 'transparent',
                color: activeTab === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: activeTab === tab.id ? '600' : '500',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
            >
              <span dangerouslySetInnerHTML={{ __html: tab.icon }} style={{ fontSize: '16px' }} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="glass-card" style={{ flex: 1, padding: '32px' }}>
          
          {activeTab === 'profile' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                Profile Settings
              </h2>
              
              {profileMessage && (
                <div style={{ 
                  padding: '12px 16px', marginBottom: '24px', borderRadius: '6px', fontSize: '14px',
                  background: profileMessage.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: profileMessage.type === 'success' ? '#10B981' : '#EF4444',
                  border: `1px solid ${profileMessage.type === 'success' ? '#10B981' : '#EF4444'}`
                }}>
                  {profileMessage.text}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Email (Read Only)</label>
                  <input 
                    type="email" 
                    className="premium-input" 
                    value={user?.email || ''} 
                    disabled 
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>First Name</label>
                  <input 
                    type="text" 
                    className="premium-input" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    minLength={2}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Last Name</label>
                  <input 
                    type="text" 
                    className="premium-input" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                
                <button type="submit" className="glow-button" disabled={profileLoading} style={{ marginTop: '12px', width: 'auto', alignSelf: 'flex-start' }}>
                  {profileLoading ? 'Saving...' : 'Save Profile'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                Security Settings
              </h2>
              
              {securityMessage && (
                <div style={{ 
                  padding: '12px 16px', marginBottom: '24px', borderRadius: '6px', fontSize: '14px',
                  background: securityMessage.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: securityMessage.type === 'success' ? '#10B981' : '#EF4444',
                  border: `1px solid ${securityMessage.type === 'success' ? '#10B981' : '#EF4444'}`
                }}>
                  {securityMessage.text}
                </div>
              )}

              <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Current Password</label>
                  <input 
                    type="password" 
                    className="premium-input" 
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>New Password</label>
                  <input 
                    type="password" 
                    className="premium-input" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '6px' }}>Must be at least 8 characters long.</p>
                </div>
                
                <button type="submit" className="glow-button" disabled={securityLoading} style={{ marginTop: '12px', width: 'auto', alignSelf: 'flex-start' }}>
                  {securityLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                Appearance
              </h2>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '500px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '4px' }}>Theme</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Switch between Light and Dark mode for the dashboard interface.
                  </p>
                </div>
                
                <div 
                  onClick={toggleTheme}
                  style={{
                    width: '56px',
                    height: '32px',
                    backgroundColor: theme === 'dark' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                    borderRadius: '100px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                    border: '1px solid var(--border-color)',
                    flexShrink: 0
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '3px',
                    left: theme === 'dark' ? '27px' : '4px',
                    transition: 'left 0.3s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }} />
                </div>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
