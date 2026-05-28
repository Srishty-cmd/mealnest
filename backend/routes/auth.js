const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || 'supersecretmealnesttoken',
    { expiresIn: '7d' }
  )
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' })
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' })
    }

    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({
      email: email.toLowerCase(),
      password: hash
    })

    const token = generateToken(user)

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Server error during registration' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(400).json({ error: 'User with this email does not exist' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password credentials' })
    }

    const token = generateToken(user)

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Server error during login' })
  }
})

module.exports = router