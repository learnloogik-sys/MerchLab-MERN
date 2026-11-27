import { createContext, useContext, useState, useEffect } from 'react';
const Store = createContext(null);
function read(key, fallback) {
  try { return JSON.parse(sessionStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
export function StoreProvider({ children }) {
  const [session, setSession] = useState(() => read('ml-session', null));
  const [cart, setCart] = useState(() => read('ml-cart', []));
  useEffect(() => { sessionStorage.setItem('ml-session', JSON.stringify(session)); }, [session]);
  useEffect(() => { sessionStorage.setItem('ml-cart', JSON.stringify(cart)); }, [cart]);
  function add(product) {
    setCart(old => old.some(p => p._id === product._id)
      ? old.map(p => p._id === product._id ? { ...p, qty: Math.min(10, p.qty + 1) } : p)
      : [...old, { ...product, qty: 1 }]);
  }
  function quantity(id, qty) {
    setCart(old => old.map(p => p._id === id ? { ...p, qty } : p)
      .filter(p => p.qty > 0));
  }
  return <Store.Provider value={{ session, setSession, cart, add, quantity,
    clear: () => setCart([]) }}>{children}</Store.Provider>;
}
export const useStore = () => useContext(Store);
