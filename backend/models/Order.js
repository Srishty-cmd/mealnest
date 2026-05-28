const mongoose = require('mongoose')

const OrderItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
})

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [OrderItemSchema],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Ordered', 'Preparing', 'Out for Delivery', 'Delivered'],
    default: 'Ordered'
  },
  address: { type: String, required: true },
  paymentMethod: { type: String, default: 'Cash on Delivery' },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Order', OrderSchema)
