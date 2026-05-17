'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Sends password payload to POST /api/auth/login via api wrapper
      const response = await api.login(password);
      
      // Persist the signed JWT token in local storage
      localStorage.setItem('admin_token', response.token);
      
      // Force navigation back to home page and refresh stateful elements
      router.push('/');
      router.refresh();
    } catch (err) {
      // Captures backend 401 error message ("Invalid admin password")
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <div className="form-card" style={{ width: '100%', maxWidth: '400px' }}>

        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '11px', fontWeight: 500, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            GlobalTNA
          </p>
          <h1 className="page-title">Admin Access</h1>
          <p className="page-sub">Enter your password to post and manage services</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-password">
              Password <span className="req">*</span>
            </label>
            <input
              id="admin-password"
              type="password"
              className={`input${error ? ' error' : ''}`}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="••••••••"
              disabled={loading}
              required
              autoFocus
            />
            {error && <p className="err-msg">{error}</p>}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
            disabled={loading}
          >
            {loading ? 'Authenticating…' : 'Sign in'}
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '0.5px solid var(--border)', textAlign: 'center' }}>
          <Link href="/" className="back-link" style={{ margin: 0, display: 'inline-flex' }}>
            ← Back to listings
          </Link>
        </div>
      </div>
    </main>
  );
}