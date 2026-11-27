import { useEffect, useState } from 'react';
import { api, money } from '../api.js';
import { useStore } from '../store.jsx';
export default function Orders() {
  const { session } = useStore();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => { api('/orders/mine', { token: session.token })
    .then(setOrders).catch(e => setError(e.message)); }, [session.token]);
  return <><h1>My orders</h1>{error && <p role="alert">{error}</p>}
    {!error && !orders.length && <p>No orders to display.</p>}
    {orders.map(o => <article className="panel" key={o._id}>
      <small>#{o._id}</small><h3>{o.status} · {money(o.total)}</h3>
      {o.items.map(i => <p key={i._id}>{i.name} × {i.qty}</p>)}
      <p>{o.paymentMethod} · {o.address}</p></article>)}</>;
}
