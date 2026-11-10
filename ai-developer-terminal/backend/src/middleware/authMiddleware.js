import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'brajesh-ai-studio-super-secret-key-change-in-production';

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    // If no token is provided, check if demo mode header or query parameter is set
    const demoUser = req.headers['x-demo-user'];
    if (demoUser) {
      req.user = { id: 'demo-user-1', username: demoUser, role: 'developer' };
      return next();
    }
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Include Authorization: Bearer <token> or X-Demo-User header.',
    });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired authentication token',
    });
  }
}

