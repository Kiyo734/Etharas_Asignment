const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Verify JWT access token and attach user to request
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }
      return res.status(401).json({ error: 'Invalid token' });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};

/**
 * Check global role (ADMIN, MEMBER)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

/**
 * Check project-level role
 * Attaches projectMember to req.projectMember
 */
const projectAuth = (...projectRoles) => {
  return async (req, res, next) => {
    try {
      const projectId = req.params.id || req.params.projectId || req.body.projectId;
      if (!projectId) {
        return res.status(400).json({ error: 'Project ID required' });
      }

      // Admins bypass project-level checks
      if (req.user.role === 'ADMIN') {
        return next();
      }

      const member = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId,
            userId: req.user.id,
          },
        },
      });

      if (!member) {
        return res.status(403).json({ error: 'Not a member of this project' });
      }

      if (projectRoles.length > 0 && !projectRoles.includes(member.role)) {
        return res.status(403).json({ error: 'Insufficient project permissions' });
      }

      req.projectMember = member;
      next();
    } catch (error) {
      console.error('Project auth error:', error);
      res.status(500).json({ error: 'Authorization error' });
    }
  };
};

module.exports = { authenticate, authorize, projectAuth };
