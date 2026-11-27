import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer '))
    return res.status(401).json({ message: 'Login required' });
  let payload;
  try { payload = jwt.verify(header.slice(7), process.env.JWT_SECRET); }
  catch { return res.status(401).json({ message: 'Invalid or expired token' }); }
  req.user = await User.findById(payload.sub);
  if (!req.user) return res.status(401).json({ message: 'User not found' });
  next();
}
export function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Admin access required' });
  next();
}
