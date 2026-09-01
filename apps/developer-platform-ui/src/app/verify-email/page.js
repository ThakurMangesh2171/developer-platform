'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMsg('No verification token provided.');
      return;
    }

    const verifyToken = async () => {
      try {
        await apiFetch(`/api/v1/auth/verify-email?token=${token}`, {
          method: 'GET'
        });
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setErrorMsg(err.message || 'Verification failed. The link may have expired or is invalid.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <>
      <div className="bg-radial-glow"></div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100vw', padding: '20px' }}>
        <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '40px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
            <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold', fontSize: '28px' }}>&#x2B22;</span>
            <span style={{ fontWeight: 'bold', fontSize: '24px' }}>DevFlow</span>
          </div>

          {status === 'verifying' && (
            <div>
              <div className="loading-spinner" style={{ margin: '0 auto 24px auto', width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Verifying Email</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Please wait while we verify your email address...</p>
              <style jsx>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}

          {status === 'success' && (
            <div>
              <div style={{ fontSize: '64px', color: '#10b981', marginBottom: '16px' }}>&#x2714;&#xFE0F;</div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Email Verified!</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                Your email address has been successfully verified. You can now access all features.
              </p>
              <Link href="/" className="glow-button" style={{ display: 'inline-block', padding: '14px 24px', textDecoration: 'none' }}>
                Continue to Login
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div>
              <div style={{ fontSize: '64px', color: '#ef4444', marginBottom: '16px' }}>&#x2716;&#xFE0F;</div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Verification Failed</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                {errorMsg}
              </p>
              <Link href="/" className="glow-button" style={{ display: 'inline-block', padding: '14px 24px', textDecoration: 'none' }}>
                Return to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
