'use client';

import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const { activeWorkspace, workspaces, setActiveWorkspace } = useAppContext();
  const router = useRouter();

  return (
    <aside style={{ 
      width: '260px', 
      height: '100vh', 
      background: '#121215', 
      borderRight: '1px solid var(--border-color)',
      position: 'fixed',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Brand Header */}
      <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)' }}>
        <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold', fontSize: '20px' }}>&#x2B22;</span>
        <span style={{ fontWeight: 'bold', fontSize: '18px' }}>DevFlow</span>
      </div>

      {/* Workspace Selector */}
      <div style={{ padding: '24px 24px 8px 24px' }}>
        <select 
          style={{ 
            width: '100%',
            background: 'var(--bg-primary)', 
            padding: '8px 12px', 
            borderRadius: '8px', 
            border: '1px solid var(--border-color)',
            fontSize: '14px',
            color: 'var(--text-primary)',
            outline: 'none',
            cursor: 'pointer'
          }}
          value={activeWorkspace?.id || ''}
          onChange={(e) => {
            if (e.target.value === 'create_new') {
              router.push('/dashboard/workspaces');
              return;
            }
            const ws = workspaces.find(w => w.id === e.target.value);
            if (ws) {
              setActiveWorkspace(ws);
              router.push('/dashboard');
            }
          }}
        >
          {workspaces.map(ws => (
            <option key={ws.id} value={ws.id}>{ws.name}</option>
          ))}
          <option disabled>──────────</option>
          <option value="create_new">+ Create New Workspace</option>
          {workspaces.length === 0 && <option value="">Loading...</option>}
        </select>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Link href="/dashboard" style={{
          padding: '10px 12px',
          borderRadius: '8px',
          color: 'var(--text-primary)',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(139, 92, 246, 0.1)' // Active state
        }}>
          <span style={{ color: 'var(--accent-primary)' }}>&#x25A6;</span>
          <span style={{ fontWeight: '600' }}>Dashboard</span>
        </Link>

        <Link href="/dashboard/projects" style={{
          padding: '10px 12px',
          borderRadius: '8px',
          color: 'var(--text-secondary)',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          transition: 'all 0.2s'
        }}>
          <span>&#x25F0;</span>
          <span>Projects</span>
        </Link>

        <Link href="/dashboard/workspaces" style={{
          padding: '10px 12px',
          borderRadius: '8px',
          color: 'var(--text-secondary)',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          transition: 'all 0.2s'
        }}>
          <span>&#x26BF;</span>
          <span>Workspaces</span>
        </Link>
      </nav>

      {/* Bottom Settings */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border-color)' }}>
        <Link href="/dashboard/settings" style={{
          padding: '10px 12px',
          borderRadius: '8px',
          color: 'var(--text-secondary)',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span>&#x2699;</span>
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
