import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Cart() {
  const {
    user,
    cart,
    cartRestaurant,
    updateQuantity,
    removeFromCart,
    getCartSubtotal,
    deliveryFee,
    tax,
    getCartTotal
  } = useApp()
  
  const navigate = useNavigate()

  // Guard routing: redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user) return null

  const subtotal = getCartSubtotal()
  const total = getCartTotal()

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-16 font-sans transition-colors duration-300">
      
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-150 dark:border-slate-800 px-6 py-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              if (cartRestaurant) {
                navigate(`/restaurant?id=${cartRestaurant.id}`)
              } else {
                navigate('/home')
              }
            }}
            className="text-slate-650 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-sm font-bold flex items-center space-x-1 cursor-pointer"
          >
            <span>◀</span>
            <span>Back</span>
          </button>
          <span className="text-slate-300 dark:text-slate-850">|</span>
          <h2 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight">Your Cart</h2>
        </div>

        {cartRestaurant && (
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Ordering from <span className="text-rose-500 font-extrabold">{cartRestaurant.name}</span>
          </span>
        )}
      </header>

      {/* Main Cart Workspace */}
      <main className="max-w-4xl mx-auto px-4 mt-8 animate-fade-in">
        
        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm space-y-6 max-w-md mx-auto">
            <span className="text-6xl block">🛒</span>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Your Cart is Empty</h3>
            <p className="text-slate-400 dark:text-slate-500 text-xs px-8">
              Looks like you haven't nested any treats in here yet. Explore local delicacies and satisfy your hunger.
            </p>
            <button
              onClick={() => navigate('/home')}
              className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-black shadow-md tracking-wider uppercase transition duration-200 cursor-pointer"
            >
              Start Ordering
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Side: Items List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm p-6 space-y-6">
                <h3 className="text-base font-black text-slate-800 dark:text-slate-100 border-b border-slate-50 dark:border-slate-800 pb-3 flex items-center space-x-2">
                  <span>🍱</span>
                  <span>Items Summary</span>
                </h3>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {cart.map((item) => (
                    <div key={item.itemId} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                      
                      {/* Item details */}
                      <div className="space-y-1 pr-4">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`w-3.5 h-3.5 border-2 rounded flex items-center justify-center ${
                              item.isVeg ? 'border-green-600' : 'border-rose-600'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                item.isVeg ? 'bg-green-600' : 'bg-rose-600'
                              }`}
                            ></span>
                          </span>
                          <span className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight">{item.name}</span>
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-extrabold uppercase">
                          ₹{item.price} per unit
                        </p>
                      </div>

                      {/* Quantities adjusters */}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center bg-slate-100 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-full px-2.5 py-1">
                          <button
                            onClick={() => updateQuantity(item.itemId, -1)}
                            className="w-5 h-5 font-black hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-650 dark:text-slate-400 flex items-center justify-center leading-none text-sm transition"
                          >
                            -
                          </button>
                          <span className="w-7 text-center text-xs font-black text-slate-800 dark:text-slate-100">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.itemId, 1)}
                            className="w-5 h-5 font-black hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-650 dark:text-slate-400 flex items-center justify-center leading-none text-sm transition"
                          >
                            +
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right w-16">
                          <span className="text-sm font-black text-slate-800 dark:text-slate-200">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>

                        {/* Trash Button */}
                        <button
                          onClick={() => removeFromCart(item.itemId)}
                          className="text-slate-300 dark:text-slate-605 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 w-7 h-7 rounded-full flex items-center justify-center transition cursor-pointer"
                          title="Remove item"
                        >
                          🗑️
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side: Billing Breakdown */}
            <div className="space-y-4">
              
              {/* Promo Coupon Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm p-6 space-y-4">
                <h4 className="text-xs font-black text-slate-700 dark:text-slate-400 tracking-wide uppercase">Apply Promo Code</h4>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="NESTFREE"
                    className="flex-grow pl-3 pr-2 py-2 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-xs font-bold uppercase placeholder-slate-400 dark:placeholder-slate-600 dark:text-slate-200 transition"
                  />
                  <button className="px-3.5 py-2 bg-slate-800 dark:bg-rose-500 hover:bg-slate-900 dark:hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition cursor-pointer">
                    Apply
                  </button>
                </div>
              </div>

              {/* Billing Summary Receipt */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm p-6 space-y-4">
                <h3 className="text-xs font-black text-slate-700 dark:text-slate-400 tracking-wide uppercase border-b border-slate-50 dark:border-slate-800 pb-2">
                  Bill Details
                </h3>

                <div className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  <div className="flex justify-between">
                    <span>Cart Subtotal</span>
                    <span className="text-slate-800 dark:text-slate-200 font-extrabold">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST & Restaurant Taxes (18%)</span>
                    <span className="text-slate-800 dark:text-slate-200 font-extrabold">₹{tax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Partner Fee</span>
                    <span className="text-slate-800 dark:text-slate-250 font-extrabold">
                      {deliveryFee === 0 ? (
                        <span className="text-green-500 dark:text-green-400 font-black">FREE</span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>
                </div>

                <div className="border-t border-dashed border-slate-200 dark:border-slate-800 pt-3 flex justify-between items-center">
                  <span className="text-sm font-black text-slate-800 dark:text-slate-100">Grand Total</span>
                  <span className="text-lg font-black text-rose-500">₹{total}</span>
                </div>

                {/* CTA checkout button */}
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full mt-4 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-2xl font-bold tracking-wide shadow-lg shadow-rose-500/25 hover:shadow-rose-500/30 hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <span>➔</span>
                </button>
              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  )
}