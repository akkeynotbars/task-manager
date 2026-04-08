import jwt from 'jsonwebtoken';

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  const user = verifyToken(token);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  req.user = user;
  next();
}