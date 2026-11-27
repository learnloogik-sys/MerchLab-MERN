import { money } from '../api.js';
import { useStore } from '../store.jsx';
export default function ProductCard({ product }) {
  const { add } = useStore();
  return <article className="panel">
    {product.image ? <img src={product.image} alt={product.name} />
      : <div className="placeholder">{product.category}</div>}
    <small>{product.category}</small><h3>{product.name}</h3>
    <p>{product.description}</p><strong>{money(product.price)}</strong>
    <button onClick={() => add(product)}>Add to cart</button>
  </article>;
}
