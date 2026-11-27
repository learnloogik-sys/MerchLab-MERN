import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, maxlength: 1000 },
  price: { type: Number, required: true, min: 1, max: 1000000,
    validate: Number.isInteger },
  category: { type: String, required: true, maxlength: 50 },
  image: { type: String, default: '' },
  active: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model('Product', schema);
