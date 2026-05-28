const express = require('express')
const router = express.Router()
const Order = require('../models/Order')
const authMiddleware = require('../middleware/auth')

// Create a new order (Protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      restaurantId,
      items,
      subtotal,
      deliveryFee,
      tax,
      total,
      address,
      paymentMethod
    } = req.body

    if (!restaurantId || !items || !items.length || !address || !total) {
      return res.status(400).json({ error: 'Missing required order details' })
    }

    const order = await Order.create({
      user: req.user.id,
      restaurant: restaurantId,
      items,
      subtotal,
      deliveryFee,
      tax,
      total,
      address,
      paymentMethod,
      status: 'Ordered'
    })

    res.status(201).json(order)
  } catch (error) {
    console.error('Create order error:', error)
    res.status(500).json({ error: 'Server error while placing order' })
  }
})

// Get active user's orders (Protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('restaurant', 'name image')
      .sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    console.error('Fetch user orders error:', error)
    res.status(500).json({ error: 'Server error while fetching orders' })
  }
})

// Get a specific order by ID (Protected)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurant', 'name image cuisine rating deliveryTime')
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    // Ensure the order belongs to the requesting user
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to view this order' })
    }

    res.json(order)
  } catch (error) {
    console.error('Fetch order by ID error:', error)
    res.status(500).json({ error: 'Server error while fetching order status' })
  }
})

// Update order status (Used by frontend to simulate order tracking progression)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    if (!['Ordered', 'Preparing', 'Out for Delivery', 'Delivered'].includes(status)) {
      return res.status(400).json({ error: 'Invalid order status value' })
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.json(order)
  } catch (error) {
    console.error('Update order status error:', error)
    res.status(500).json({ error: 'Server error while updating order status' })
  }
})

module.exports = router