import { Link, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store.jsx';
import Shop from './pages/Shop.jsx';
import Account from './pages/Account.jsx';
import Cart from './pages/Cart.jsx';
import Orders from './pages/Orders.jsx';
import Admin from './pages/Admin.jsx';
export default function App() {
  const { session, setSession, cart } = useStore();
  const admin = session?.user.role === 'admin';
  return <><header><Link className="brand" to="/">MERCHLAB</Link><nav>
    <Link to="/">Shop</Link><Link to="/cart">Cart ({cart.length})</Link>
    {session && <Link to="/orders">Orders</Link>}
    {admin && <Link to="/admin">Admin</Link>}
    {session ? <button onClick={() => setSession(null)}>Logout</button>
      : <Link to="/account">Sign in</Link>}
  </nav></header><main><Routes>
    <Route path="/" element={<Shop />} />
    <Route path="/account" element={<Account />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/orders" element={session ? <Orders /> : <Navigate to="/account" />} />
    <Route path="/admin" element={admin ? <Admin /> : <Navigate to="/" />} />
    <Route path="*" element={<h1>Page not found</h1>} />
  </Routes></main></>;
}
