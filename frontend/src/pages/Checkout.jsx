import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Checkout() {
  const { user, cart, cartRestaurant, getCartTotal, placeOrder } = useApp()
  const [address, setAddress] = useState('Suite 204, Feather Nest Heights, Sector 12, Tech Corridor')
  const [phone, setPhone] = useState('+91 98765 43210')
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Guard routing: redirect if not logged in or cart is empty
  useEffect(() => {
    if (!user) {
      navigate('/login')
    } else if (cart.length === 0) {
      navigate('/home')
    }
  }, [user, cart, navigate])

  if (!user || cart.length === 0) return null

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setError('')

    if (!address.trim()) {
      setError('Please provide a valid delivery address.')
      return
    }

    if (!phone.trim()) {
      setError('Please provide a contact phone number.')
      return
    }

    setSubmitting(true)
    try {
      const placedOrder = await placeOrder(address, paymentMethod)
      setSubmitting(false)
      navigate(`/tracking?id=${placedOrder._id}`)
    } catch (err) {
      setSubmitting(false)
      setError(err.response?.data?.error || 'Failed to place your order. Please try again.')
    }
  }

  const paymentOptions = [
    { name: 'Cash on Delivery', description: 'Pay with cash upon package receipt', icon: '💵' },
    { name: 'Simulated Card', description: 'Credit or Debit cards (secured mock gateway)', icon: '💳' },
    { name: 'Mock UPI Payment', description: 'Pay using instant UPI mobile apps', icon: '📱' }
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-16 font-sans transition-colors duration-300">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-150 dark:border-slate-800 px-6 py-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/cart')}
            className="text-slate-650 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-sm font-bold flex items-center space-x-1 cursor-pointer"
          >
            <span>◀</span>
            <span>Back to Cart</span>
          </button>
          <span className="text-slate-300 dark:text-slate-800">|</span>
          <h2 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight">Checkout</h2>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-4xl mx-auto px-4 mt-8">
        
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          
          {/* Left Column: Forms */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Errors */}
            {error && (
              <div className="bg-rose-50 dark:bg-rose-950/40 border-l-4 border-rose-500 p-4 rounded-r-xl text-rose-700 dark:text-rose-350 text-xs font-bold shadow-sm animate-pulse flex items-center">
                <span className="text-base mr-2">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Delivery Details */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm p-6 space-y-6">
              <h3 className="text-base font-black text-slate-800 dark:text-slate-100 border-b border-slate-50 dark:border-slate-800 pb-3 flex items-center space-x-2">
                <span>📍</span>
                <span>Delivery Details</span>
              </h3>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-wide uppercase">Nest Address</label>
                  <textarea
                    rows="3"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your full apartment, block, and landmark details..."
                    className="w-full pl-4 pr-4 py-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-800 dark:text-slate-100 font-medium placeholder-slate-400 dark:placeholder-slate-600 transition"
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-wide uppercase">Contact Number</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-550 text-sm">📞</span>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 9876543210"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-800 dark:text-slate-100 font-medium placeholder-slate-400 dark:placeholder-slate-600 transition"
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment options Selector */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm p-6 space-y-6">
              <h3 className="text-base font-black text-slate-800 dark:text-slate-100 border-b border-slate-50 dark:border-slate-800 pb-3 flex items-center space-x-2">
                <span>💳</span>
                <span>Choose Payment Method</span>
              </h3>

              <div className="space-y-3">
                {paymentOptions.map((opt) => (
                  <label
                    key={opt.name}
                    className={`flex items-center space-x-4 p-4 border rounded-2xl cursor-pointer transition select-none ${
                      paymentMethod === opt.name
                        ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-400 dark:border-rose-800 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.name}
                      checked={paymentMethod === opt.name}
                      onChange={() => setPaymentMethod(opt.name)}
                      className="w-4 h-4 text-rose-500 focus:ring-rose-500 border-slate-300 dark:border-slate-700 accent-rose-500"
                      disabled={submitting}
                    />
                    <div className="text-xl">{opt.icon}</div>
                    <div className="flex-grow">
                      <p className="text-xs font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none">{opt.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-1">{opt.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Pricing summary review */}
          <div className="space-y-4">
            
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm p-6 space-y-4">
              <h4 className="text-xs font-black text-slate-700 dark:text-slate-400 tracking-wide uppercase border-b border-slate-50 dark:border-slate-800 pb-2">
                Basket Review
              </h4>
              
              {cartRestaurant && (
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                  Ordered from: <span className="text-slate-700 dark:text-slate-200 font-extrabold">{cartRestaurant.name}</span>
                </p>
              )}

              <div className="max-h-48 overflow-y-auto space-y-2 divide-y divide-slate-50 dark:divide-slate-850">
                {cart.map((item) => (
                  <div key={item.itemId} className="flex justify-between items-center text-xs py-2 first:pt-0 last:pb-0">
                    <span className="font-semibold text-slate-650 dark:text-slate-400 truncate max-w-[150px]">
                      {item.name} <span className="text-slate-400 dark:text-slate-550 font-black">x{item.quantity}</span>
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center text-xs font-black">
                <span className="text-slate-800 dark:text-slate-200">Grand Total to Pay</span>
                <span className="text-base text-rose-500">₹{getCartTotal()}</span>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-2xl font-bold tracking-wide shadow-lg shadow-rose-500/25 hover:shadow-rose-500/30 hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center space-x-2 cursor-pointer"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Placing Order...</span>
                  </>
                ) : (
                  <>
                    <span>Place Order (₹{getCartTotal()})</span>
                    <span>➔</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </form>

      </main>
    </div>
  )
}