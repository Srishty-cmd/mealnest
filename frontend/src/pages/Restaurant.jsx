import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useApp } from '../context/AppContext'

export default function Restaurant() {
  const { user, cart, cartShake, addToCart, updateQuantity, API_URL } = useApp()
  const [searchParams] = useSearchParams()
  const restaurantId = searchParams.get('id')
  
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Menu filters & Search
  const [menuSearch, setMenuSearch] = useState('')
  const [activeMenuCategory, setActiveMenuCategory] = useState('All')
  const [menuVegOnly, setMenuVegOnly] = useState(false)

  const navigate = useNavigate()

  // Guard routing: redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  // Fetch restaurant details and menu items
  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      if (!restaurantId) return
      setLoading(true)
      try {
        const response = await axios.get(`${API_URL}/restaurants/${restaurantId}`)
        setRestaurant(response.data)
      } catch (error) {
        console.error('Error fetching restaurant details:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user && restaurantId) {
      fetchRestaurantDetails()
    }
  }, [restaurantId, user, API_URL])

  if (!user) return null

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="flex flex-col items-center space-y-4 animate-pulse">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-extrabold tracking-wider uppercase">Loading Restaurant Menu...</p>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-4 transition-colors duration-300">
        <span className="text-6xl">🏚️</span>
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Restaurant Not Found</h2>
        <p className="text-slate-550 dark:text-slate-500 text-sm max-w-sm">
          The restaurant you are trying to view does not exist or has been removed from our nest.
        </p>
        <button
          onClick={() => navigate('/home')}
          className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold transition"
        >
          Back to Discover
        </button>
      </div>
    )
  }

  const getFilteredMenu = () => {
    return restaurant.menu.filter(item => {
      const categoryMatch = activeMenuCategory === 'All' || item.category === activeMenuCategory
      const vegMatch = !menuVegOnly || item.isVeg
      const searchMatch = item.name.toLowerCase().includes(menuSearch.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(menuSearch.toLowerCase()))

      return categoryMatch && vegMatch && searchMatch
    })
  }

  const filteredMenu = getFilteredMenu()
  const menuCategories = ['All', ...new Set(restaurant.menu.map(item => item.category))]

  const getCartStats = () => {
    const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    return { itemsCount, cartTotal }
  }

  const { itemsCount, cartTotal } = getCartStats()

  const renderSpicyPeppers = (spicyLevel) => {
    if (spicyLevel === 0) return null
    return (
      <span className="text-xs ml-1" title={`${spicyLevel} Spicy level`}>
        {Array(spicyLevel).fill('🌶️').join('')}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-28 font-sans transition-colors duration-300">
      
      {/* Restaurant Banner Cover */}
      <div className="relative h-60 md:h-80 w-full bg-slate-200 dark:bg-slate-850">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent"></div>
        
        {/* Back button */}
        <button
          onClick={() => navigate('/home')}
          className="absolute top-6 left-6 w-11 h-11 bg-white/20 dark:bg-black/35 hover:bg-white/30 text-white rounded-full flex items-center justify-center backdrop-blur-md shadow-lg border border-white/25 dark:border-white/10 transition duration-200 cursor-pointer"
        >
          ◀
        </button>

        {/* Floating details on cover */}
        <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
          <div className="flex flex-wrap gap-2">
            <span className="bg-rose-500 text-white font-extrabold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
              {restaurant.category}
            </span>
            <span className="bg-black/40 backdrop-blur-md text-white font-extrabold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider">
              🛵 Free Delivery above ₹199
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight drop-shadow-md">
            {restaurant.name}
          </h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs md:text-sm font-semibold">
            <div className="flex items-center space-x-1.5">
              <span className="text-amber-400 font-bold text-base">★</span>
              <span className="font-extrabold">{restaurant.rating.toFixed(1)}</span>
              <span className="text-white/70">({restaurant.reviewsCount} reviews)</span>
            </div>
            <span className="text-white/50">•</span>
            <span>{restaurant.cuisine}</span>
            <span className="text-white/50">•</span>
            <span>🕒 {restaurant.deliveryTime} mins delivery</span>
          </div>
        </div>
      </div>

      {/* Categories Tabs & Menu Grid Layout */}
      <main className="max-w-5xl mx-auto px-4 md:px-8 mt-8 space-y-6">
        
        {/* Menu Search and Local veg toggling */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-3xl shadow-sm">
          
          <div className="relative flex-grow max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">🔍</span>
            <input
              type="text"
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              placeholder="Search dishes within this menu..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-850 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-slate-800 dark:text-slate-100 text-xs font-semibold placeholder-slate-455 dark:placeholder-slate-600 transition"
            />
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <button
              onClick={() => setMenuVegOnly(!menuVegOnly)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-2xl font-black border transition select-none active:scale-[0.97] cursor-pointer ${
                menuVegOnly
                  ? 'bg-green-50 dark:bg-green-950/20 border-green-500 text-green-700 dark:text-green-400 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-350 dark:hover:border-slate-700'
              }`}
            >
              <span className={`w-3.5 h-3.5 border-2 rounded flex items-center justify-center border-green-600`}>
                <span className={`w-1.5 h-1.5 rounded-full bg-green-600 ${menuVegOnly ? 'opacity-100' : 'opacity-0'}`}></span>
              </span>
              <span>Pure Veg 🟢</span>
            </button>
          </div>

        </div>

        {/* Horizontal Category Pill List */}
        <div className="flex space-x-2.5 overflow-x-auto pb-3 border-b border-slate-200 dark:border-slate-800 scrollbar-none">
          {menuCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveMenuCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black tracking-wide uppercase border transition duration-200 whitespace-nowrap cursor-pointer ${
                activeMenuCategory === cat
                  ? 'bg-slate-800 dark:bg-rose-500 border-slate-800 dark:border-rose-500 text-white shadow'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items Listings */}
        <div className="space-y-6">
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span>🍽️</span>
              <span>{activeMenuCategory === 'All' ? 'Dishes' : activeMenuCategory}</span>
            </div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{filteredMenu.length} items</span>
          </h3>

          {filteredMenu.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm space-y-3">
              <span className="text-4xl block">🥗</span>
              <h4 className="text-sm font-black text-slate-700 dark:text-slate-200">No dishes match filters</h4>
              <p className="text-xs text-slate-400 dark:text-slate-500">Try clearing search terms or pure-veg selections.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMenu.map((item) => {
                const cartItem = cart.find(c => c.itemId === item._id)
                
                return (
                  <div
                    key={item._id}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition duration-200 flex space-x-4 h-full"
                  >
                    <div className="flex-grow space-y-2 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          
                          {/* Veg / Non-Veg Indicator */}
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

                          {/* Spicy pepper */}
                          {renderSpicyPeppers(item.spicyLevel)}

                          {/* Calories Metric */}
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase bg-slate-50 dark:bg-slate-950/60 border border-slate-150 dark:border-slate-800 rounded px-1.5 py-0.5">
                            ⚡ {item.calories || 250} kcal
                          </span>

                          {/* Tags */}
                          {(item.tag || item.isPopular) && (
                            <span className="bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-450 font-extrabold text-[8px] px-2 py-0.5 rounded-md uppercase tracking-wider animate-pulse">
                              {item.tag || 'Must Try'}
                            </span>
                          )}
                        </div>

                        <h4 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight leading-snug">
                          {item.name}
                        </h4>

                        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium line-clamp-2 max-w-sm">
                          {item.description || 'Crafted with premium selected seasonal ingredients.'}
                        </p>
                      </div>

                      <p className="text-slate-800 dark:text-slate-200 font-black text-sm pt-2">
                        ₹{item.price}
                      </p>
                    </div>

                    {/* Image and cart button */}
                    <div className="flex flex-col items-center justify-between w-28 shrink-0 relative">
                      <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-850 overflow-hidden shadow-inner border border-slate-100 dark:border-slate-800">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl bg-orange-50">🍔</div>
                        )}
                      </div>

                      {/* Quantity Selector */}
                      <div className="absolute -bottom-2">
                        {cartItem ? (
                          <div className="flex items-center bg-rose-500 text-white rounded-full px-3 py-1 shadow-lg shadow-rose-500/25 border border-rose-600/30 select-none">
                            <button
                              onClick={() => updateQuantity(item._id, -1)}
                              className="w-5 h-5 font-black hover:scale-110 active:scale-90 flex items-center justify-center leading-none text-base"
                            >
                              -
                            </button>
                            <span className="w-6 text-center text-xs font-black">{cartItem.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item._id, 1)}
                              className="w-5 h-5 font-black hover:scale-110 active:scale-90 flex items-center justify-center leading-none text-base"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item, restaurant)}
                            className="bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-slate-700 border border-rose-200 dark:border-slate-700 text-rose-500 dark:text-rose-400 px-5 py-1 rounded-full text-xs font-black shadow-md shadow-rose-500/5 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition duration-200 whitespace-nowrap cursor-pointer"
                          >
                            ADD +
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </main>

      {/* Sliding Bottom Cart Summary Bar */}
      {itemsCount > 0 && (
        <div className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-40">
          <div className={`bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-2xl p-4.5 shadow-xl flex items-center justify-between border border-rose-600/25 backdrop-blur-lg ${
            cartShake ? 'animate-shake-cart' : 'animate-bounce-short'
          }`}>
            <div className="flex items-center space-x-3.5 pl-2">
              <span className="text-xl">🛒</span>
              <div>
                <p className="text-xs font-extrabold text-white/80 uppercase tracking-wide">
                  {itemsCount} {itemsCount === 1 ? 'Item' : 'Items'} selected
                </p>
                <p className="text-lg font-black leading-none">
                  ₹{cartTotal} <span className="text-[10px] text-white/70 font-medium font-sans">plus taxes</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/cart')}
              className="bg-white hover:bg-slate-50 text-rose-500 font-black rounded-xl px-5 py-2.5 text-xs tracking-wider uppercase shadow-md active:scale-[0.97] transition flex items-center space-x-1.5 cursor-pointer"
            >
              <span>View Cart</span>
              <span>➔</span>
            </button>
          </div>
        </div>
      )}

    </div>
  )
}