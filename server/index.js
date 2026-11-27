import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(express.json({ limit: '100kb' }));
app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use((req, res) => res.status(404).json({ message: 'Not found' }));
app.use((err, req, res, next) => {
  console.error(err.message);
  if (err.code === 11000)
    return res.status(409).json({ message: 'Already exists' });
  if (['ValidationError', 'CastError'].includes(err.name))
    return res.status(400).json({ message: 'Invalid data' });
  res.status(err.status || 500).json({ message: 'Request failed' });
});
if (!process.env.JWT_SECRET || !process.env.MONGODB_URI ||
    !process.env.CLIENT_ORIGIN) throw new Error('Missing environment variables');
await mongoose.connect(process.env.MONGODB_URI);
app.listen(process.env.PORT || 5000, '0.0.0.0', () =>
  console.log('API running'));
