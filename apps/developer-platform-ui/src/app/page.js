'use client';

import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Background Radial Glow */}
      <div className="bg-radial-glow"></div>

      {/* Navigation Bar */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '20px 40px',
        borderBottom: '1px solid var(--border-color)',
        background: 'rgba(24, 24, 27, 0.7)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '32px', height: '32px', borderRadius: '8px', 
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-hover))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold'
          }}>
            D
          </div>
          <span style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '-0.5px' }}>DevFlow</span>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link href="/login" style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'}
            onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
          >
            Log in
          </Link>
          <Link href="/signup" className="glow-button" style={{ padding: '8px 20px' }}>
            Start for Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 20px', textAlign: 'center' }}>
        <div style={{ 
          display: 'inline-block', padding: '6px 16px', borderRadius: '100px', 
          border: '1px solid var(--accent-glow)', background: 'rgba(139, 92, 246, 0.1)',
          color: 'var(--accent-primary)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase',
          letterSpacing: '1px', marginBottom: '32px'
        }}>
          Now in Public Beta
        </div>
        
        <h1 style={{ 
          fontSize: 'clamp(48px, 8vw, 72px)', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-2px',
          maxWidth: '900px', marginBottom: '24px',
          background: 'linear-gradient(to right, #FFFFFF, var(--text-secondary))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          Build the Future. <br />
          <span style={{ color: 'var(--accent-primary)', WebkitTextFillColor: 'initial', textShadow: '0 0 40px var(--accent-glow)' }}>Faster.</span>
        </h1>
        
        <p style={{ 
          fontSize: '20px', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '48px', lineHeight: '1.6' 
        }}>
          The ultimate developer platform. Manage API keys, shorten URLs, and toggle feature flags—all orchestrated in one beautiful workspace.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/signup" className="glow-button" style={{ fontSize: '16px', padding: '16px 32px' }}>
            Get Started for Free
          </Link>
          <a href="#features" style={{ 
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px 32px', borderRadius: '8px', fontSize: '16px', fontWeight: '600',
            background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)',
            transition: 'all 0.2s ease', cursor: 'pointer'
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'var(--border-color)'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'var(--bg-tertiary)'; }}>
            Explore Features
          </a>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '16px', letterSpacing: '-1px' }}>Everything you need.</h2>
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>Powerful microservices out of the box.</p>
        </div>

        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' 
        }}>
          {[
            {
              title: 'API Key Management',
              desc: 'Securely issue, rotate, and track API keys for your applications with granular permissions.',
              icon: '&#x1F5DD;',
              color: '#10B981'
            },
            {
              title: 'URL Shortener',
              desc: 'High-performance short links with click tracking and analytics built right in.',
              icon: '&#x1F517;',
              color: 'var(--accent-primary)'
            },
            {
              title: 'Feature Flags',
              desc: 'Safely decouple deployment from release. Toggle features dynamically in production.',
              icon: '&#x26A1;',
              color: '#F59E0B'
            }
          ].map((feat, idx) => (
            <div key={idx} className="glass-card" style={{ 
              padding: '32px', display: 'flex', flexDirection: 'column',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'default'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = `0 20px 40px ${feat.color}20`;
              e.currentTarget.style.borderColor = feat.color;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}>
              <div style={{ 
                width: '56px', height: '56px', borderRadius: '16px', background: `${feat.color}15`, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', color: feat.color,
                marginBottom: '24px'
              }} dangerouslySetInnerHTML={{ __html: feat.icon }} />
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>{feat.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        borderTop: '1px solid var(--border-color)', padding: '40px 20px', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '20px', marginTop: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: 'var(--text-secondary)', opacity: 0.5 }} />
          <span style={{ fontSize: '14px' }}>&copy; {new Date().getFullYear()} DevFlow. All rights reserved.</span>
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {['Twitter', 'GitHub', 'Discord'].map(link => (
            <a key={link} href="#" style={{ fontSize: '14px', color: 'var(--text-secondary)', transition: 'color 0.2s' }}
              onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'}
              onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
            >
              {link}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
