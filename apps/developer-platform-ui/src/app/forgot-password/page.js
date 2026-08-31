'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call for now (Placeholder)
    setTimeout(() => {
      setSuccess(true);
      setIsLoading(false);
    }, 1500);
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

          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Reset Password</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px' }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {success ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>&#x2709;&#xFE0F;</div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Check your email</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
                If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly.
              </p>
              <Link href="/" style={{ color: 'var(--accent-primary)', fontSize: '14px', fontWeight: '500' }}>
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Email</label>
                <input 
                  type="email" 
                  className="premium-input" 
                  placeholder="developer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="glow-button" 
                style={{ marginTop: '8px', padding: '14px', opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
                disabled={isLoading}
              >
                {isLoading ? 'Sending Link...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          {!success && (
            <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              Remember your password? <Link href="/" style={{ color: 'var(--accent-primary)' }}>Sign In</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
