import { Router } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
const router = Router();
router.use(requireAuth);
router.post('/', async (req, res) => {
  const { items, address } = req.body;
  if (!Array.isArray(items) || !items.length || items.length > 50 ||
      typeof address !== 'string' || !address.trim() || address.length > 500)
    return res.status(400).json({ message: 'Invalid cart or address' });
  const lines = [], seen = new Set();
  for (const item of items) {
    if (!item || typeof item.productId !== 'string' ||
        !mongoose.isValidObjectId(item.productId) ||
        !Number.isInteger(item.qty) || item.qty < 1 || item.qty > 10 ||
        seen.has(item.productId))
      return res.status(400).json({ message: 'Invalid cart item' });
    seen.add(item.productId);
    const p = await Product.findOne({ _id: item.productId, active: true });
    if (!p) return res.status(400).json({ message: 'Product unavailable' });
    lines.push({ product: p._id, name: p.name, price: p.price, qty: item.qty });
  }
  const total = lines.reduce((sum, line) => sum + line.price * line.qty, 0);
  const order = await Order.create({ user: req.user._id,
    items: lines, address: address.trim(), total });
  res.status(201).json(order);
});
router.get('/mine', async (req, res) => {
  res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }));
});
router.get('/', requireAdmin, async (req, res) => {
  res.json(await Order.find().sort({ createdAt: -1 }));
});
router.patch('/:id/status', requireAdmin, async (req, res) => {
  const status = req.body.status;
  const previous = { Shipped: 'Placed', Delivered: 'Shipped' }[status];
  if (!previous) return res.status(400).json({ message: 'Invalid status' });
  const order = await Order.findOneAndUpdate(
    { _id: req.params.id, status: previous }, { status }, { new: true });
  if (!order) return res.status(409).json({ message: 'Invalid order transition' });
  res.json(order);
});
export default router;
