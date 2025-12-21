import { verifyToken } from '../utils/jwt.js';

const auth = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No token provided. Format: Bearer <token>' 
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    // Attach user info to request
    req.user = { userId: decoded.userId };
    
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

export default auth;