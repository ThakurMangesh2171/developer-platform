'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token. Please request a new password reset.');
    }
  }, [token]);

  const handleReset = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      await apiFetch('/api/v1/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword: password })
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to reset password. The link might have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-radial-glow"></div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100vw', padding: '20px' }}>
        <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold', fontSize: '24px' }}>&#x2B22;</span>
            <span style={{ fontWeight: 'bold', fontSize: '20px' }}>DevFlow</span>
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Set New Password</h2>
          
          {success ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '48px', color: '#10b981', marginBottom: '16px' }}>&#x2714;&#xFE0F;</div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Password Reset Successful</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
                Your password has been successfully updated. Redirecting to login...
              </p>
            </div>
          ) : (
            <>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px' }}>
                Please enter your new password below.
              </p>

              <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {error && (
                  <div style={{ padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', fontSize: '14px' }}>
                    {error}
                  </div>
                )}
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>New Password</label>
                  <input 
                    type="password" 
                    className="premium-input" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    disabled={!token}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Confirm New Password</label>
                  <input 
                    type="password" 
                    className="premium-input" 
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    disabled={!token}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="glow-button" 
                  style={{ marginTop: '8px', padding: '14px', opacity: (isLoading || !token) ? 0.7 : 1, cursor: (isLoading || !token) ? 'not-allowed' : 'pointer' }}
                  disabled={isLoading || !token}
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </>
          )}

          {!success && (
            <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              Return to <Link href="/" style={{ color: 'var(--accent-primary)' }}>Sign In</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
