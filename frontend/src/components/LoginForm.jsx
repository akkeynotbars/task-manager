import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const { login, register } = useAuthStore();

  async function handleSubmit(e) {
    e.preventDefault();
    if (isRegister) await register(email, password, name);
    else await login(email, password);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320, margin: '80px auto' }}>
      <h2>{isRegister ? 'Create account' : 'Sign in'}</h2>
      {isRegister && <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />}
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      <button type="button" onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? 'Already have an account?' : 'Create an account'}
      </button>
    </form>
  );
}