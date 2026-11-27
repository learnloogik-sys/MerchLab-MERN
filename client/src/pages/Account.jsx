import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useStore } from '../store.jsx';
export default function Account() {
  const [register, setRegister] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { setSession } = useStore();
  const navigate = useNavigate();
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('');
    const body = Object.fromEntries(new FormData(e.currentTarget));
    try { setSession(await api(`/auth/${register ? 'register' : 'login'}`,
      { method: 'POST', body })); navigate('/'); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  return <section className="panel narrow"><h1>{register ? 'Register' : 'Sign in'}</h1>
    <form onSubmit={submit}>
      {register && <label>Name<input name="name" required maxLength={80} /></label>}
      <label>Email<input name="email" type="email" required /></label>
      <label>Password<input name="password" type="password" required minLength={8} /></label>
      <button disabled={busy}>{busy ? 'Please wait' : 'Continue'}</button>
    </form>{error && <p role="alert">{error}</p>}
    <button onClick={() => { setRegister(!register); setError(''); }}>
      {register ? 'Already registered?' : 'Create account'}</button></section>;
}
