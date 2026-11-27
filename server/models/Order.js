import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String, price: Number, qty: Number
  }],
  address: { type: String, required: true, maxlength: 500 },
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['COD'], default: 'COD' },
  status: { type: String, enum: ['Placed', 'Shipped', 'Delivered'],
    default: 'Placed' }
}, { timestamps: true });
export default mongoose.model('Order', schema);
