'use client';

import React from 'react';
import { useAppContext } from '@/context/AppContext';

export default function SettingsPage() {
  const { theme, setTheme } = useAppContext();

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your personal preferences and application settings.</p>
      </div>

      <div className="glass-card" style={{ maxWidth: '600px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          Appearance
        </h2>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
              border: '1px solid var(--border-color)'
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
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Moon / Sun Icon could go here, for now simple circle */}
            </div>
          </div>
        </div>
        
        {/* We can add more settings here in the future like User Profile, etc */}
      </div>
    </div>
  );
}
