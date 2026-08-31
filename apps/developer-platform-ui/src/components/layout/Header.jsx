'use client';

import { useAppContext } from '@/context/AppContext';

export default function Header() {
  const { user, activeWorkspace } = useAppContext();

  return (
    <header style={{
      height: '72px',
      background: 'var(--bg-primary)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
        <span>{activeWorkspace?.name || 'Workspace'}</span>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>Projects</span>
      </div>

      {/* Profile & Notifications */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '18px' }}>
          &#x1F514; {/* Bell Icon */}
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, #4F46E5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px',
            textTransform: 'uppercase'
          }}>
            {user?.firstName?.charAt(0) || 'U'}
          </div>
          <span style={{ fontSize: '14px', fontWeight: '500' }}>
            {user ? `${user.firstName} ${user.lastName?.charAt(0) || ''}.` : 'Loading...'}
          </span>
        </div>
      </div>
    </header>
  );
}
