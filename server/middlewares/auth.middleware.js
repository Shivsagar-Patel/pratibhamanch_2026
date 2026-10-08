import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.model.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = await Admin.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'अमान्य टोकन, कृपया पुनः लॉगिन करें।' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'प्रमाणीकरण विफल, कोई टोकन नहीं मिला।' });
  }
};
