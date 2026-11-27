import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { rateLimit } from 'express-rate-limit';
import User from '../models/User.js';
const router = Router();
router.use(rateLimit({ windowMs: 60000, limit: 15 }));
function session(user) {
  return { token: jwt.sign({ sub: String(user._id) },
    process.env.JWT_SECRET, { expiresIn: '2h' }),
    user: { id: user._id, name: user.name, role: user.role } };
}
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (typeof name !== 'string' || !name.trim() || name.length > 80 ||
      typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email) ||
      typeof password !== 'string' || password.length < 8 ||
      Buffer.byteLength(password) > 72)
    return res.status(400).json({ message: 'Invalid registration data' });
  const user = await User.create({ name, email,
    password: await bcrypt.hash(password, 12) });
  res.status(201).json(session(user));
});
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (typeof email !== 'string' || typeof password !== 'string')
    return res.status(400).json({ message: 'Invalid credentials' });
  const user = await User.findOne({ email: email.trim().toLowerCase() })
    .select('+password');
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: 'Invalid credentials' });
  res.json(session(user));
});
export default router;
