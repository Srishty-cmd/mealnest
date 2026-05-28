import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useApp } from '../context/AppContext'

export default function Home() {
  const {
    user,
    logout,
    cart,
    cartShake,
    reorderPastItems,
    vegOnly,
    setVegOnly,
    sortBy,
    setSortBy,
    theme,
    toggleTheme,
    ordersHistory,
    fetchOrders,
    API_URL
  } = useApp()

  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  // Drawer & Modal Toggles
  const [showHistory, setShowHistory] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  // Banner Slideshow State
  const [currentSlide, setCurrentSlide] = useState(0)

  const navigate = useNavigate()

  // Guard routing: redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  // Fetch orders history on load
  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  // Auto Scroll Carousel
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide(prev => (prev === 2 ? 0 : prev + 1))
    }, 4500)
    return () => clearInterval(slideTimer)
  }, [])

  // Fetch restaurants from backend based on filters
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${API_URL}/restaurants`, {
          params: {
            category: selectedCategory === 'All' ? '' : selectedCategory.toLowerCase(),
            search
          }
        })

        let data = response.data

        // Apply Pure Veg filter locally if active
        if (vegOnly) {
          data = data.filter(res => res.menu.some(item => item.isVeg))
        }

        // Apply Sorting preferences
        if (sortBy === 'rating') {
          data = [...data].sort((a, b) => b.rating - a.rating)
        } else if (sortBy === 'time') {
          data = [...data].sort((a, b) => a.deliveryTime - b.deliveryTime)
        } else if (sortBy === 'costLow') {
          data = [...data].sort((a, b) => a.deliveryFee - b.deliveryFee)
        } else if (sortBy === 'costHigh') {
          data = [...data].sort((a, b) => b.deliveryFee - a.deliveryFee)
        }

        setRestaurants(data)
      } catch (error) {
        console.error('Error fetching restaurants:', error)
      } finally {
        setLoading(false)
      }
    }

    const delayDebounce = setTimeout(() => {
      if (user) fetchRestaurants()
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [selectedCategory, search, vegOnly, sortBy, user, API_URL])

  const categories = [
    { name: 'All', emoji: '🍽️' },
    { name: 'Pizza', emoji: '🍕' },
    { name: 'Burgers', emoji: '🍔' },
    { name: 'Sushi', emoji: '🍣' },
    { name: 'Desserts', emoji: '🍩' }
  ]

  const slides = [
    {
      title: 'Free Delivery Week!',
      desc: 'Get absolute zero delivery cost on all standard gourmet nests.',
      code: 'NESTFREE',
      bg: 'from-rose-500 to-orange-500'
    },
    {
      title: 'Craving Sushi Platter?',
      desc: 'Flat 50% discount on Japanese rolls at Sakura Sushi this evening.',
      code: 'SAKURA50',
      bg: 'from-purple-600 to-indigo-500'
    },
    {
      title: 'Weekend Dessert Feast',
      desc: 'Buy any red-velvet waffle and get free MoChis instantly.',
      code: 'SWEETMAGIC',
      bg: 'from-amber-500 to-pink-500'
    }
  ]

  const handleReorder = (pastOrder) => {
    reorderPastItems(pastOrder.items, pastOrder.restaurant)
    setShowHistory(false)
    navigate('/cart')
  }

  if (!user) return null

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-16 font-sans relative overflow-x-hidden transition-colors duration-300">
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-150 dark:border-slate-800 px-6 py-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-rose-500/20">
            🪺
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none">MealNest</h1>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase mt-1">Tech Corridor Nest • Bangalore</p>
          </div>
        </div>

        {/* Dynamic header options */}
        <div className="flex items-center space-x-3">
          
          {/* Dual Theme Switch Button */}
          <button
            onClick={toggleTheme}
            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-300 rounded-xl transition duration-200 cursor-pointer"
            title="Toggle Theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* History Icon Trigger */}
          <button
            onClick={() => setShowHistory(true)}
            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition duration-200 relative cursor-pointer"
            title="Order History"
          >
            📋
            {ordersHistory.length > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            )}
          </button>

          {/* Wobbling Cart Count Badge */}
          <button
            onClick={() => cartItemsCount > 0 && navigate('/cart')}
            className={`p-2 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-slate-700/50 hover:text-rose-500 text-slate-600 dark:text-slate-300 rounded-xl transition duration-200 relative cursor-pointer ${
              cartShake ? 'animate-shake-cart' : ''
            }`}
            title="Shopping Cart"
          >
            🛒
            {cartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-black text-[9px] w-5 h-5 rounded-full flex items-center justify-center border border-white dark:border-slate-800 shadow">
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* User Profile Modal Trigger */}
          <button
            onClick={() => setShowProfile(true)}
            className="w-9 h-9 rounded-full bg-orange-100 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-slate-700 shadow-sm cursor-pointer"
          >
            👤
          </button>

          <button 
            onClick={logout}
            className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 dark:hover:text-rose-450 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl transition duration-200 active:scale-[0.98]"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main descoberta */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-8 space-y-8 animate-fade-in">
        
        {/* Auto Scrolling Promotional Slideshow */}
        <div className="relative w-full h-56 md:h-64 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
          {slides.map((slide, idx) => (
            <div
              key={slide.title}
              className={`absolute inset-0 bg-gradient-to-r ${slide.bg} p-6 md:p-10 text-white transition-opacity duration-1000 flex flex-col justify-between ${
                currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <div className="max-w-xl space-y-3">
                <span className="bg-white/20 text-white font-extrabold text-[9px] px-3 py-1 rounded-full uppercase tracking-wider">
                  Promo Offer Code
                </span>
                <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
                  {slide.title}
                </h2>
                <p className="text-white/80 text-xs md:text-sm font-medium">
                  {slide.desc}
                </p>
              </div>

              {/* Coupon Code Pill */}
              <div className="flex items-center space-x-3 mt-4">
                <span className="bg-black/25 border border-white/20 rounded-xl px-4 py-2 text-xs font-black tracking-widest uppercase">
                  🔑 {slide.code}
                </span>
                <span className="text-[10px] font-bold text-white/70">Click to auto-copy</span>
              </div>
            </div>
          ))}

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'bg-white w-6' : 'bg-white/40'
                }`}
              ></button>
            ))}
          </div>
        </div>

        {/* Filter Controls Panels */}
        <div className="space-y-4">
          
          {/* Search Panel */}
          <div className="relative max-w-lg">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by restaurant name, dish, or cuisines..."
              className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-slate-800 dark:text-slate-100 text-sm font-medium placeholder-slate-400 dark:placeholder-slate-650 shadow-sm transition"
            />
          </div>

          {/* Dynamic Sorting, Veg-Only row */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2 text-xs">
            
            {/* Pure Veg toggle */}
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`flex items-center space-x-2 px-4.5 py-2.5 rounded-2xl font-black border transition select-none active:scale-[0.97] cursor-pointer ${
                vegOnly
                  ? 'bg-green-50 dark:bg-green-950/20 border-green-500 text-green-700 dark:text-green-400 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-350 dark:hover:border-slate-700'
              }`}
            >
              <span className={`w-3.5 h-3.5 border-2 rounded flex items-center justify-center border-green-600`}>
                <span className={`w-1.5 h-1.5 rounded-full bg-green-600 ${vegOnly ? 'opacity-100' : 'opacity-0'}`}></span>
              </span>
              <span>Pure Veg 🟢</span>
            </button>

            {/* Separator */}
            <span className="text-slate-300 dark:text-slate-800 hidden sm:block">|</span>

            {/* Sorting pill selector */}
            <span className="text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wide">Sort by:</span>
            {[
              { id: 'default', label: 'Recommended' },
              { id: 'rating', label: 'Top Rated ★' },
              { id: 'time', label: 'Fastest 🕒' },
              { id: 'costLow', label: 'Low delivery' }
            ].map(pill => (
              <button
                key={pill.id}
                onClick={() => setSortBy(pill.id)}
                className={`px-4 py-2.5 rounded-2xl font-bold border transition cursor-pointer ${
                  sortBy === pill.id
                    ? 'bg-slate-800 dark:bg-rose-500 border-slate-800 dark:border-rose-500 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-350 dark:hover:border-slate-700'
                }`}
              >
                {pill.label}
              </button>
            ))}

          </div>

          {/* Scrolling Categories Pillbar */}
          <div className="flex space-x-3 overflow-x-auto py-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-sm font-bold border transition duration-200 whitespace-nowrap active:scale-[0.97] cursor-pointer ${
                  selectedCategory === cat.name
                    ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/25'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-450 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Restaurant Section Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Popular Restaurants</h3>
            <span className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-400 px-3 py-1 rounded-full">
              {restaurants.length} nearby
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 animate-pulse">
                  <div className="w-full h-44 bg-slate-200 dark:bg-slate-850 rounded-2xl"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-850 rounded w-2/3"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-850 rounded w-1/2"></div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-850 rounded w-1/4"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-850 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : restaurants.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 max-w-md mx-auto rounded-3xl">
              <span className="text-5xl block">🥡</span>
              <h4 className="text-lg font-black text-slate-800 dark:text-slate-100">No Nests Found</h4>
              <p className="text-slate-400 dark:text-slate-500 text-xs px-6">
                We couldn't find any restaurants matching your combination of search, vegetarian preference, and category filters.
              </p>
              <button
                onClick={() => { setSearch(''); setSelectedCategory('All'); setVegOnly(false); setSortBy('default'); }}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-2">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant._id}
                  onClick={() => navigate(`/restaurant?id=${restaurant._id}`)}
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-xl hover:scale-[1.02] active:scale-[0.99] transition duration-300 cursor-pointer shadow-sm flex flex-col h-full"
                >
                  <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-850">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                    {restaurant.isFeatured && (
                      <span className="absolute top-3.5 left-3.5 bg-rose-500 text-white font-extrabold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                        Featured
                      </span>
                    )}
                    <span className="absolute bottom-3.5 right-3.5 bg-black/60 backdrop-blur-md text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full">
                      🕒 {restaurant.deliveryTime} mins
                    </span>
                  </div>

                  <div className="p-5 flex-grow flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
                        {restaurant.name}
                      </h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">
                        {restaurant.cuisine}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800 pt-3 text-xs">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-amber-500 font-bold text-sm">★</span>
                        <span className="font-extrabold text-slate-700 dark:text-slate-200">{restaurant.rating.toFixed(1)}</span>
                        <span className="text-slate-400 dark:text-slate-500 font-medium">({restaurant.reviewsCount})</span>
                      </div>
                      <span className="text-slate-500 dark:text-slate-400 font-bold">
                        {restaurant.deliveryFee === 0 ? (
                          <span className="text-green-500 dark:text-green-400 font-extrabold">FREE DEL</span>
                        ) : (
                          `₹${restaurant.deliveryFee} delivery`
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* --- DRAWERS AND MODALS (REAL-WORLD PREMIUM) --- */}

      {/* Sliding Order History Sidebar Drawer */}
      {showHistory && (
        <div className="fixed inset-0 z-50 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-fade-in flex justify-end">
          {/* Backdrop click close */}
          <div className="flex-grow" onClick={() => setShowHistory(false)}></div>
          
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between animate-slide-in-right p-6 border-l border-slate-100 dark:border-slate-800">
            <div className="space-y-6 flex-grow overflow-y-auto pr-1">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">📋</span>
                  <h3 className="text-lg font-black text-slate-850 dark:text-slate-100">Your Past Orders</h3>
                </div>
                <button
                  onClick={() => setShowHistory(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-slate-700 hover:text-rose-500 text-slate-600 dark:text-slate-400 flex items-center justify-center transition font-black cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {ordersHistory.length === 0 ? (
                <div className="text-center py-20 space-y-3">
                  <span className="text-4xl block">🥡</span>
                  <h4 className="text-sm font-black text-slate-700 dark:text-slate-400">No Past Orders</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 px-8">
                    Your order history is currently empty. Order warm dishes and they will show up here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ordersHistory.map((pastOrder) => (
                    <div
                      key={pastOrder._id}
                      className="border border-slate-100 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-50 dark:hover:bg-slate-950/80 transition space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 leading-none">
                            {pastOrder.restaurant?.name || 'Local Kitchen'}
                          </h4>
                          <span className="text-[10px] text-slate-450 dark:text-slate-500 mt-1 block">
                            {new Date(pastOrder.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 font-extrabold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">
                          Delivered ✓
                        </span>
                      </div>

                      {/* Items Summary list */}
                      <div className="space-y-1 pl-2 border-l border-slate-200 dark:border-slate-700">
                        {pastOrder.items.map(item => (
                          <p key={item.itemId} className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            {item.name} <span className="font-extrabold text-slate-700 dark:text-slate-200">x{item.quantity}</span>
                          </p>
                        ))}
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2.5">
                        <span className="text-xs text-slate-450 dark:text-slate-450 font-bold">Paid: <span className="text-rose-500 font-black">₹{pastOrder.total}</span></span>
                        
                        <button
                          onClick={() => handleReorder(pastOrder)}
                          className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[10px] font-black tracking-wider uppercase transition shadow-sm active:scale-[0.96] cursor-pointer"
                        >
                          Reorder ↻
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 bg-white dark:bg-slate-900">
              <button
                onClick={() => setShowHistory(false)}
                className="w-full py-3 bg-slate-800 dark:bg-slate-750 hover:bg-slate-900 text-white font-bold rounded-2xl text-xs transition cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sliding User Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 z-50 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-fade-in flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative animate-scale-up space-y-6">
            
            <button
              onClick={() => setShowProfile(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-slate-700 hover:text-rose-500 text-slate-600 dark:text-slate-400 flex items-center justify-center transition font-black cursor-pointer"
            >
              ✕
            </button>

            {/* Profile Header */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/30 border-2 border-rose-450 dark:border-rose-800 flex items-center justify-center text-3xl">
                🧁
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-850 dark:text-slate-100 tracking-tight leading-none">
                  {user.email.split('@')[0]}
                </h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase mt-1">
                  Food Enthusiast Member 🥇
                </p>
              </div>
            </div>

            {/* Custom Foodie Stats */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-3 border border-slate-100/50 dark:border-slate-800">
                <span className="text-xs text-slate-450 dark:text-slate-500 font-extrabold uppercase">Total Orders</span>
                <span className="text-lg font-black text-slate-800 dark:text-slate-150 block mt-1">
                  {ordersHistory.length}
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-3 border border-slate-100/50 dark:border-slate-800">
                <span className="text-xs text-slate-455 dark:text-slate-500 font-extrabold uppercase">Fav Food</span>
                <span className="text-lg font-black text-rose-500 block mt-1">
                  🍕 Pizza
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-3 border border-slate-100/50 dark:border-slate-800">
                <span className="text-xs text-slate-455 dark:text-slate-500 font-extrabold uppercase">Tier Status</span>
                <span className="text-lg font-black text-amber-500 block mt-1">
                  Gold
                </span>
              </div>
            </div>

            {/* Saved Address Book */}
            <div className="space-y-2 text-xs">
              <h4 className="font-black text-slate-700 dark:text-slate-400 uppercase tracking-wide">Saved Delivery Nest</h4>
              <div className="p-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200/50 dark:border-slate-800 rounded-xl flex items-center space-x-2 text-slate-550 dark:text-slate-400">
                <span>📍</span>
                <span className="font-semibold leading-relaxed">
                  Apartment 204, Feather Nest Heights, Sector 12, Tech Corridor, Bangalore.
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowProfile(false)}
              className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl text-xs transition cursor-pointer"
            >
              Done Reviewing Profile
            </button>
          </div>
        </div>
      )}

    </div>
  )
}