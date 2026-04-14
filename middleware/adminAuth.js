const ADMIN_SECRET = process.env.ADMIN_SECRET || 'sevzo-admin-secret';

function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization || req.headers['x-admin-token'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  if (!token || token !== ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized admin access' });
  }

  next();
}

module.exports = adminAuth;
