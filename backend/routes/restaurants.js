const express = require('express')
const router = express.Router()
const Restaurant = require('../models/Restaurant')

// Get all restaurants (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query
    let query = {}

    // Apply category filter if provided and not "all"
    if (category && category.toLowerCase() !== 'all') {
      query.category = category.toLowerCase()
    }

    // Apply search filter (name or cuisine matching)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cuisine: { $regex: search, $options: 'i' } }
      ]
    }

    const restaurants = await Restaurant.find(query)
    res.json(restaurants)
  } catch (error) {
    console.error('Fetch restaurants error:', error)
    res.status(500).json({ error: 'Server error while fetching restaurants' })
  }
})

// Get single restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' })
    }
    res.json(restaurant)
  } catch (error) {
    console.error('Fetch restaurant by ID error:', error)
    res.status(500).json({ error: 'Server error while fetching restaurant details' })
  }
})

module.exports = router