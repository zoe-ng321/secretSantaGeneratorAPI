const jwt = require("jsonwebtoken");

// middleware to validate token
const verifyToken = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const verified = await jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Token is not valid" });
  }
};

module.exports = verifyToken;
