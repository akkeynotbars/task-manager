import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuthStore();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) await register(email, password, name);
      else await login(email, password);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff', padding: 32, borderRadius: 12,
        width: 360, boxShadow: '0 2px 16px rgba(0,0,0,0.08)'
      }}>
        <h2 style={{ marginBottom: 24, fontSize: 22 }}>
          {isRegister ? 'Create account' : 'Sign in'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {isRegister && (
            <input placeholder="Name" value={name}
              onChange={e => setName(e.target.value)} required />
          )}
          <input type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)} required />

          {error && <p style={{ color: '#e53e3e', fontSize: 14 }}>{error}</p>}

          <button type="submit" style={{
            background: '#6c63ff', color: '#fff',
            border: 'none', padding: '10px 16px',
            borderRadius: 6, fontWeight: 500, fontSize: 15
          }}>
            {isRegister ? 'Register' : 'Login'}
          </button>

          <button type="button" onClick={() => setIsRegister(!isRegister)}
            style={{ background: 'none', border: 'none', color: '#6c63ff', cursor: 'pointer' }}>
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
          </button>
        </form>
      </div>
    </div>
  );
}