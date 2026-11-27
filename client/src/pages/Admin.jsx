import { useEffect, useState } from 'react';
import { api, money } from '../api.js';
import { useStore } from '../store.jsx';
const empty = { name: '', description: '', price: '', category: '', image: '' };
export default function Admin() {
  const { session } = useStore();
  const token = session.token;
  const [products, setProducts] = useState([]), [orders, setOrders] = useState([]);
  const [form, setForm] = useState(empty), [editing, setEditing] = useState(null);
  const [error, setError] = useState(''), [busy, setBusy] = useState(false);
  async function load() {
    const [p, o] = await Promise.all([api('/products'), api('/orders', { token })]);
    setProducts(p); setOrders(o);
  }
  useEffect(() => { load().catch(e => setError(e.message)); }, [token]);
  async function action(task) {
    setError(''); setBusy(true);
    try { await task(); await load(); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  function save(e) {
    e.preventDefault(); action(async () => {
      await api(editing ? `/products/${editing}` : '/products', {
        method: editing ? 'PUT' : 'POST', token,
        body: { ...form, price: Number(form.price) } });
      setForm(empty); setEditing(null);
    });
  }
  return <><h1>Admin dashboard</h1>{error && <p role="alert">{error}</p>}
    <form className="panel" onSubmit={save}><h2>{editing ? 'Edit' : 'New'} product</h2>
      {Object.keys(empty).map(key => <label key={key}>{key}
        <input value={form[key]} required={key !== 'image'}
          type={key === 'price' ? 'number' : key === 'image' ? 'url' : 'text'}
          onChange={e => setForm({ ...form, [key]: e.target.value })} /></label>)}
      <button disabled={busy}>Save product</button>
      <button type="button" onClick={() => { setEditing(null); setForm(empty); }}>Reset</button>
    </form><h2>Catalog</h2>{products.map(p => <div className="panel cart-row" key={p._id}>
      <strong>{p.name} · {money(p.price)}</strong>
      <button disabled={busy} onClick={() => { setEditing(p._id);
        setForm(Object.fromEntries(Object.keys(empty).map(k => [k, p[k] ?? '']))); }}>Edit</button>
      <button disabled={busy} onClick={() => {
        if (confirm('Archive product?')) action(() => api(`/products/${p._id}`,
          { method: 'DELETE', token })); }}>Archive</button></div>)}
    <h2>Orders</h2>{orders.map(o => <div className="panel" key={o._id}>
      <p>{o._id} · {money(o.total)} · {o.status}</p>
      <p>{o.address}</p>{o.status !== 'Delivered' && <button disabled={busy}
        onClick={() => action(() => api(`/orders/${o._id}/status`, {
          method: 'PATCH', token, body: { status: o.status === 'Placed' ? 'Shipped' : 'Delivered' }
        }))}>Advance status</button>}</div>)}</>;
}
