const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authHeader = req.header('authorization')
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretmealnesttoken')
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token.' })
  }
}
