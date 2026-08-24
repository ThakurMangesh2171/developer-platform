'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function ProjectLayout({ children, params }) {
  const pathname = usePathname();
  const { projectId } = params;

  // Derive the active tab based on the URL path
  const isUrlShortener = pathname.includes('/url-shortener');
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Project Tabs Header */}
      <div style={{ marginBottom: '32px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '32px' }}>
        <Link 
          href={`/dashboard/projects/${projectId}`}
          style={{
            padding: '12px 0',
            color: !isUrlShortener ? 'var(--accent-primary)' : 'var(--text-secondary)',
            borderBottom: !isUrlShortener ? '2px solid var(--accent-primary)' : '2px solid transparent',
            fontWeight: !isUrlShortener ? '600' : '400',
            fontSize: '15px'
          }}
        >
          API Keys (Settings)
        </Link>
        
        <Link 
          href={`/dashboard/projects/${projectId}/url-shortener`}
          style={{
            padding: '12px 0',
            color: isUrlShortener ? 'var(--accent-primary)' : 'var(--text-secondary)',
            borderBottom: isUrlShortener ? '2px solid var(--accent-primary)' : '2px solid transparent',
            fontWeight: isUrlShortener ? '600' : '400',
            fontSize: '15px'
          }}
        >
          URL Shortener
        </Link>
      </div>

      {/* Tab Content Area */}
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
}
