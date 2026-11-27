import { useEffect, useState } from 'react';
import { api } from '../api.js';
import ProductCard from '../components/ProductCard.jsx';
export default function Shop() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => { api('/products').then(setProducts)
    .catch(e => setError(e.message)).finally(() => setLoading(false)); }, []);
  const filtered = products.filter(p =>
    `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase()));
  return <><section className="hero"><small>MERCHLAB / COLLECTION</small>
    <h1>Everyday essentials.</h1><p>Explore products designed for your routine.</p></section>
    <input aria-label="Search products" placeholder="Search products or categories"
      value={query} onChange={e => setQuery(e.target.value)} />
    {loading && <p>Loading...</p>}{error && <p role="alert">{error}</p>}
    {!loading && !error && !filtered.length && <p>No matching products.</p>}
    <section className="grid">{filtered.map(product =>
      <ProductCard key={product._id} product={product} />)}</section></>;
}
