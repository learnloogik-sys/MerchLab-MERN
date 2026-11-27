import { Router } from 'express';
import Product from '../models/Product.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
const router = Router();
router.get('/', async (req, res) => {
  const products = await Product.find({ active: true }).sort({ createdAt: -1 });
  res.json(products);
});
router.get('/:id', async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, active: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});
function fields(body) {
  const { name, description, price, category, image } = body;
  return { name, description, price, category, image };
}
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  res.status(201).json(await Product.create(fields(req.body)));
});
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, active: true }, fields(req.body),
    { new: true, runValidators: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, active: true }, { active: false });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product archived' });
});
export default router;
