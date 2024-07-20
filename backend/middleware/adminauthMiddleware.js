const jwt=require('jsonwebtoken')
const protected = async (req, res, next) => {
    try {
      let token;
       console.log("Request headers:", req.headers);
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded.email;
        next();
      } else {
        res.status(401);
        throw new Error('Not authorized, no token');
      }
    } catch (error) {
      res.status(401).json({ message: 'Not authorized' });
    }
  };
  
  module.exports = { protected };