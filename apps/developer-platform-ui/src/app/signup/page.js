'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import Link from 'next/link';

export default function SignUpPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await apiFetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        body: JSON.stringify({ firstName, lastName, email, password })
      });

      if (response.success) {
        setSuccess(true);
        // Automatically redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setError(response.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-radial-glow"></div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100vw', padding: '20px' }}>
        <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold', fontSize: '24px' }}>&#x2B22;</span>
            <span style={{ fontWeight: 'bold', fontSize: '20px' }}>DevFlow</span>
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Create an Account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px' }}>
            Join DevFlow and start building instantly.
          </p>

          {error && (
            <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid var(--error)', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid var(--success)', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
              Registration successful! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>First Name</label>
                <input 
                  type="text" 
                  className="premium-input" 
                  placeholder="Jane"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Last Name</label>
                <input 
                  type="text" 
                  className="premium-input" 
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            
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
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Password</label>
              <input 
                type="password" 
                className="premium-input" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '6px' }}>Must be at least 8 characters long.</p>
            </div>
            
            <button 
              type="submit" 
              className="glow-button" 
              style={{ marginTop: '8px', padding: '14px', opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
              disabled={isLoading || success}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Already have an account? <Link href="/" style={{ color: 'var(--accent-primary)' }}>Sign In</Link>
          </div>
        </div>
      </div>
    </>
  );
}
