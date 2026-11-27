import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, money } from '../api.js';
import { useStore } from '../store.jsx';
export default function Cart() {
  const { cart, quantity, clear, session } = useStore();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  async function checkout(e) {
    e.preventDefault(); setBusy(true); setError('');
    const address = new FormData(e.currentTarget).get('address');
    try { await api('/orders', { method: 'POST', token: session.token,
      body: { address, items: cart.map(p => ({ productId: p._id, qty: p.qty })) } });
      clear(); navigate('/orders'); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  return <><h1>Your cart</h1>{!cart.length && <p>Cart is empty.</p>}
    {cart.map(p => <article className="panel cart-row" key={p._id}>
      <strong>{p.name}</strong><span>{money(p.price * p.qty)}</span>
      <button onClick={() => quantity(p._id, p.qty - 1)}>−</button>{p.qty}
      <button disabled={p.qty === 10} onClick={() => quantity(p._id, p.qty + 1)}>+</button>
      <button onClick={() => quantity(p._id, 0)}>Remove</button></article>)}
    <h2>Estimated total: {money(cart.reduce((s, p) => s + p.price * p.qty, 0))}</h2>
    {session ? <form className="panel narrow" onSubmit={checkout}>
      <label>Shipping address<textarea name="address" required maxLength={500} /></label>
      <p>Payment: Cash on delivery. Final price is calculated by the server.</p>
      <button disabled={busy || !cart.length}>Place order</button></form>
      : <Link to="/account">Sign in to checkout</Link>}
    {error && <p role="alert">{error}</p>}</>;
}
