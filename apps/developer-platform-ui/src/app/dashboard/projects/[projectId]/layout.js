'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function ProjectLayout({ children, params }) {
  const pathname = usePathname();
  const { projectId } = params;

  // Derive the active tab based on the URL path
  const isUrlShortener = pathname.includes('/url-shortener');
  const isFeatureFlags = pathname.includes('/feature-flags');
  const isApiKeys = pathname.includes('/api-keys');
  const isWebhooks = pathname.includes('/webhooks');
  const isOverview = !isUrlShortener && !isFeatureFlags && !isApiKeys && !isWebhooks;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Project Tabs Header */}
      <div style={{ marginBottom: '32px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '32px' }}>
        <Link 
          href={`/dashboard/projects/${projectId}`}
          style={{
            padding: '12px 0',
            color: isOverview ? 'var(--accent-primary)' : 'var(--text-secondary)',
            borderBottom: isOverview ? '2px solid var(--accent-primary)' : '2px solid transparent',
            fontWeight: isOverview ? '600' : '400',
            fontSize: '15px'
          }}
        >
          Overview
        </Link>
        <Link 
          href={`/dashboard/projects/${projectId}/api-keys`}
          style={{
            padding: '12px 0',
            color: isApiKeys ? 'var(--accent-primary)' : 'var(--text-secondary)',
            borderBottom: isApiKeys ? '2px solid var(--accent-primary)' : '2px solid transparent',
            fontWeight: isApiKeys ? '600' : '400',
            fontSize: '15px'
          }}
        >
          API Keys
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

        <Link 
          href={`/dashboard/projects/${projectId}/feature-flags`}
          style={{
            padding: '12px 0',
            color: isFeatureFlags ? 'var(--accent-primary)' : 'var(--text-secondary)',
            borderBottom: isFeatureFlags ? '2px solid var(--accent-primary)' : '2px solid transparent',
            fontWeight: isFeatureFlags ? '600' : '400',
            fontSize: '15px'
          }}
        >
          Feature Flags
        </Link>
        
        <Link 
          href={`/dashboard/projects/${projectId}/webhooks`}
          style={{
            padding: '12px 0',
            color: isWebhooks ? 'var(--accent-primary)' : 'var(--text-secondary)',
            borderBottom: isWebhooks ? '2px solid var(--accent-primary)' : '2px solid transparent',
            fontWeight: isWebhooks ? '600' : '400',
            fontSize: '15px'
          }}
        >
          Webhooks
        </Link>
      </div>

      {/* Tab Content Area */}
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
}
