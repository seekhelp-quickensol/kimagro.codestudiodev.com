
const jwt = require('jsonwebtoken');

const authenticateAdmin = (req, res, next) => {
  const token = req.cookies?.accessToken; // 🍪 Extract from cookie
  console.log(req.cookies);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: No token provided',
      data: null,
      error: { message: 'No token provided' },
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or expired token',
      data: null,
      error: { message: err.message },
    });
  }
};

module.exports = authenticateAdmin;