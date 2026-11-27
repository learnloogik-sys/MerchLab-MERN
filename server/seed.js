import 'dotenv/config';
import mongoose from 'mongoose';
import Product from './models/Product.js';

await mongoose.connect(process.env.MONGODB_URI);
const products = [
  { name: 'Studio Headphones', price: 2499, category: 'Audio',
    description: 'Comfortable over-ear headphones for everyday listening.' },
  { name: 'Urban Backpack', price: 1499, category: 'Lifestyle',
    description: 'A versatile backpack with a laptop compartment.' },
  { name: 'Desk Lamp', price: 899, category: 'Home',
    description: 'A compact lamp for a focused workspace.' }
];
for (const product of products)
  await Product.updateOne({ name: product.name }, { $setOnInsert: product },
    { upsert: true });
console.log('Sample products ready');
await mongoose.disconnect();
