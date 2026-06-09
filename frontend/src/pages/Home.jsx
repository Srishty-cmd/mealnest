import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useApp } from "../context/AppContext";

export default function Home() {
  const {
    user,
    logout,
    cart,
    cartShake,
    reorderPastItems,
    theme,
    toggleTheme,
    ordersHistory,
    fetchOrders,
    API_URL,
  } = useApp();

  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("fav_restaurants");
    return saved ? JSON.parse(saved) : [];
  });

  // Load More Pagination State
  const [visibleCount, setVisibleCount] = useState(8);

  // Drawer & Modal Toggles
  const [showHistory, setShowHistory] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const navigate = useNavigate();

  // Guard routing: redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch orders history on load
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Fetch restaurants from backend
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/restaurants`);
        // Filter out unavailable menu items / restaurants if needed
        // For now, load all restaurants
        setRestaurants(response.data);
        setFilteredRestaurants(response.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchRestaurants();
  }, [user, API_URL]);

  // Handle Search and Category Filter locally for instantaneous updates
  useEffect(() => {
    let result = restaurants;

    // Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter(res => 
        res.category.toLowerCase() === selectedCategory.toLowerCase() ||
        res.cuisine.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Filter by Search Query
    if (search.trim() !== "") {
      const query = search.toLowerCase();
      result = result.filter(res => 
        res.name.toLowerCase().includes(query) ||
        res.cuisine.toLowerCase().includes(query) ||
        res.category.toLowerCase().includes(query) ||
        res.menu.some(item => item.name.toLowerCase().includes(query))
      );
    }

    setFilteredRestaurants(result);
    setVisibleCount(8); // Reset visible count on search/filter change
  }, [search, selectedCategory, restaurants]);

  // Sync Favorites to LocalStorage
  const toggleFavorite = (resId, e) => {
    e.stopPropagation();
    const updated = favorites.includes(resId)
      ? favorites.filter(id => id !== resId)
      : [...favorites, resId];
    setFavorites(updated);
    localStorage.setItem("fav_restaurants", JSON.stringify(updated));
  };

  const handleReorder = (pastOrder) => {
    reorderPastItems(pastOrder.items, pastOrder.restaurant);
    setShowHistory(false);
    navigate("/cart");
  };

  if (!user) return null;

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // 14 Category Filters
  const categories = [
    { name: "All", emoji: "🍽️" },
    { name: "Pizza", emoji: "🍕" },
    { name: "Burgers", emoji: "🍔" },
    { name: "Sushi", emoji: "🍣" },
    { name: "Desserts", emoji: "🍩" },
    { name: "Indian", emoji: "🍛" },
    { name: "Chinese", emoji: "🥡" },
    { name: "South Indian", emoji: "🍘" },
    { name: "Biryani", emoji: "🍚" },
    { name: "Fast Food", emoji: "🍟" },
    { name: "Cafe", emoji: "☕" },
    { name: "Healthy Food", emoji: "🥗" },
    { name: "Seafood", emoji: "🦐" },
    { name: "BBQ", emoji: "🍖" }
  ];

  // Specific Highlight Sections
  const trendingRestaurants = filteredRestaurants.filter(r => r.isFeatured).slice(0, 4);
  const topRatedRestaurants = [...filteredRestaurants].sort((a, b) => b.rating - a.rating).slice(0, 5);
  const popularNearYou = filteredRestaurants.filter(r => r.deliveryTime <= 25).slice(0, 5);
  const recommendedForYou = [...filteredRestaurants].sort(() => 0.5 - Math.random()).slice(0, 5);

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 8, filteredRestaurants.length));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16 font-sans relative overflow-x-hidden transition-colors duration-300">
      
      {/* Background Neon Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-pink-900/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[0%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-blue-900/10 blur-[120px] pointer-events-none"></div>

      {/* Futuristic Sticky Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900 px-6 py-4 shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/home")}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 via-purple-600 to-blue-500 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-purple-500/20">
            🪺
          </div>
          <div>
            <h1 className="text-xl font-black bg-gradient-to-r from-pink-500 via-purple-400 to-blue-400 bg-clip-text text-transparent tracking-tight leading-none">
              MealNest
            </h1>
            <p className="text-[10px] text-slate-500 font-extrabold uppercase mt-1 tracking-wider">
              Food Marketplace • Bangalore
            </p>
          </div>
        </div>

        {/* Dynamic header options */}
        <div className="flex items-center space-x-3">
          
          {/* Quick link to Rewards Dashboard */}
          <button
            onClick={() => navigate("/rewards")}
            className="hidden md:flex items-center space-x-1 px-3.5 py-2 bg-gradient-to-r from-pink-500/10 to-purple-600/10 hover:from-pink-500/20 hover:to-purple-600/20 border border-purple-500/30 text-pink-400 text-xs font-black rounded-xl transition duration-200 cursor-pointer"
          >
            <span>✨</span>
            <span>Rewards ({user.rewardPoints || 0} pts)</span>
          </button>

          {/* Quick link to Merchant Console */}
          {(user?.role === "merchant" || user?.role === "admin") && (
            <button
              onClick={() => navigate("/merchant")}
              className="hidden md:flex items-center space-x-1 px-3.5 py-2 bg-gradient-to-r from-purple-600/10 to-blue-500/10 hover:from-purple-600/20 hover:to-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-black rounded-xl transition duration-200 cursor-pointer"
            >
              <span>🏬</span>
              <span>Merchant Panel</span>
            </button>
          )}

          {/* Theme Toggle (Kept for compatibility) */}
          <button
            onClick={toggleTheme}
            className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition duration-200 cursor-pointer text-sm"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {/* History Icon Trigger */}
          <button
            onClick={() => setShowHistory(true)}
            className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition duration-200 relative cursor-pointer"
            title="Order History"
          >
            📋
            {ordersHistory.length > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-pink-500 shadow-lg shadow-pink-500/40"></span>
            )}
          </button>

          {/* Shopping Cart Trigger */}
          <button
            onClick={() => cartItemsCount > 0 && navigate("/cart")}
            className={`p-2 bg-slate-900 border border-slate-800 hover:border-slate-750 rounded-xl transition duration-200 relative cursor-pointer ${
              cartShake ? "animate-bounce" : ""
            }`}
            title="Shopping Cart"
          >
            🛒
            {cartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-[9px] w-5 h-5 rounded-full flex items-center justify-center shadow">
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* User Profile Trigger */}
          <button
            onClick={() => setShowProfile(true)}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white border border-slate-800 shadow cursor-pointer"
          >
            👤
          </button>

          {/* Admin Panel (If user is Admin) */}
          {user?.role === "admin" && (
            <button
              onClick={() => navigate("/admin")}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white text-xs font-bold rounded-xl transition duration-200"
            >
              Admin
            </button>
          )}

          <button
            onClick={logout}
            className="px-3.5 py-1.5 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-400 text-xs font-bold rounded-xl transition duration-200"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-8 space-y-12">
        
        {/* Mobile quick links */}
        <div className="flex md:hidden justify-between space-x-2 pt-2 text-xs">
          <button
            onClick={() => navigate("/rewards")}
            className="flex-grow py-2.5 bg-slate-900/60 backdrop-blur-md border border-slate-850 rounded-2xl text-center text-pink-400 font-bold"
          >
            ✨ Rewards ({user.rewardPoints || 0} pts)
          </button>
          {(user?.role === "merchant" || user?.role === "admin") && (
            <button
              onClick={() => navigate("/merchant")}
              className="flex-grow py-2.5 bg-slate-900/60 backdrop-blur-md border border-slate-850 rounded-2xl text-center text-blue-400 font-bold"
            >
              🏬 Merchant Panel
            </button>
          )}
        </div>

        {/* Hero Section Banner */}
        <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-900 bg-gradient-to-r from-purple-950 via-slate-950 to-pink-950 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-[9px] px-3.5 py-1 rounded-full uppercase tracking-wider shadow">
              Week 3 Premium Upgrade
            </span>
            <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight text-transparent bg-gradient-to-r from-white via-slate-100 to-purple-300 bg-clip-text">
              Futuristic Food <br />At Your Doorstep
            </h2>
            <p className="text-slate-400 text-xs md:text-sm font-medium max-w-md">
              Order from over 30+ premium nests. Earn double reward points, unlock achievements, and track your meals in real time.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setSelectedCategory("All")}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/35 hover:scale-[1.01] active:scale-[0.99] transition cursor-pointer"
              >
                Explore Marketplace ➔
              </button>
            </div>
          </div>
          <div className="w-56 h-56 rounded-3xl overflow-hidden border border-slate-800 shadow-xl shadow-purple-500/5 rotate-3 hover:rotate-0 transition duration-500 hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400"
              alt="Premium Meal"
              className="w-full h-full object-cover scale-110 hover:scale-100 transition duration-500"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">
            Search & Categories
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Bar */}
            <div className="relative md:col-span-1">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 text-sm">
                🔍
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search restaurant, cuisine, category or dish..."
                className="w-full pl-11 pr-4 py-3.5 bg-slate-900/60 border border-slate-850 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-200 text-sm font-medium placeholder-slate-600 transition shadow-inner"
              />
            </div>

            {/* Scrolling Category Pillbar */}
            <div className="md:col-span-2 flex space-x-2.5 overflow-x-auto py-1.5 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-bold border transition duration-200 whitespace-nowrap active:scale-[0.97] cursor-pointer ${
                    selectedCategory === cat.name
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 border-pink-500 text-white shadow-lg shadow-pink-500/25"
                      : "bg-slate-900/60 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-800"
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 1. Trending Section (Featured) */}
        {trendingRestaurants.length > 0 && selectedCategory === "All" && search === "" && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🔥</span>
              <h3 className="text-lg font-black tracking-tight text-white uppercase">
                Trending Highlights
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingRestaurants.map(restaurant => (
                <RestaurantCard
                  key={restaurant._id}
                  restaurant={restaurant}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  navigate={navigate}
                />
              ))}
            </div>
          </div>
        )}

        {/* 2. Top Rated Section */}
        {topRatedRestaurants.length > 0 && selectedCategory === "All" && search === "" && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-2">
              <span className="text-xl">⭐</span>
              <h3 className="text-lg font-black tracking-tight text-white uppercase">
                Top Rated Culinary Nests
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {topRatedRestaurants.map(restaurant => (
                <RestaurantCard
                  key={restaurant._id}
                  restaurant={restaurant}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  navigate={navigate}
                  compact
                />
              ))}
            </div>
          </div>
        )}

        {/* 3. Popular Near You (Quick Delivery) */}
        {popularNearYou.length > 0 && selectedCategory === "All" && search === "" && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🕒</span>
              <h3 className="text-lg font-black tracking-tight text-white uppercase">
                Popular Near You (Fast Delivery)
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {popularNearYou.map(restaurant => (
                <RestaurantCard
                  key={restaurant._id}
                  restaurant={restaurant}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  navigate={navigate}
                  compact
                />
              ))}
            </div>
          </div>
        )}

        {/* 4. Complete Marketplace Grid */}
        <div className="space-y-6 pt-4 border-t border-slate-900">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-white tracking-tight uppercase">
                {selectedCategory === "All" ? "Complete Marketplace" : `${selectedCategory} Marketplace`}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Showing {Math.min(visibleCount, filteredRestaurants.length)} of {filteredRestaurants.length} active restaurants
              </p>
            </div>
            <span className="text-[10px] font-black text-pink-400 bg-pink-500/10 border border-pink-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
              {filteredRestaurants.length} matching
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-slate-900/40 rounded-3xl p-4 border border-slate-900 shadow-lg space-y-4 animate-pulse"
                >
                  <div className="w-full h-44 bg-slate-850 rounded-2xl"></div>
                  <div className="h-4 bg-slate-850 rounded w-2/3"></div>
                  <div className="h-3 bg-slate-850 rounded w-1/2"></div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-4 bg-slate-850 rounded w-1/4"></div>
                    <div className="h-4 bg-slate-850 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredRestaurants.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/30 border border-slate-900 shadow-inner space-y-4 max-w-md mx-auto rounded-3xl">
              <span className="text-5xl block">🥡</span>
              <h4 className="text-lg font-black text-white">No Restaurants Found</h4>
              <p className="text-slate-500 text-xs px-6">
                We couldn't find any nests matching your filters or search keywords. Try searching for "Dosa", "Roll" or "Italian".
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 py-2">
              {filteredRestaurants.slice(0, visibleCount).map((restaurant) => (
                <RestaurantCard
                  key={restaurant._id}
                  restaurant={restaurant}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  navigate={navigate}
                />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {visibleCount < filteredRestaurants.length && (
            <div className="flex justify-center pt-8">
              <button
                onClick={handleLoadMore}
                className="px-8 py-3.5 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-white rounded-2xl font-bold text-xs tracking-wider uppercase shadow-lg hover:scale-[1.01] active:scale-[0.99] transition flex items-center space-x-2 cursor-pointer"
              >
                <span>Load More Restaurants</span>
                <span>🔽</span>
              </button>
            </div>
          )}
        </div>

      </main>

      {/* --- DRAWERS AND MODALS (PRESERVED & FUTURISTIC BEAUTY) --- */}

      {/* Sliding Order History Sidebar Drawer */}
      {showHistory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in flex justify-end">
          <div className="flex-grow" onClick={() => setShowHistory(false)}></div>
          <div className="w-full max-w-md bg-slate-950 border-l border-slate-900 h-full shadow-2xl flex flex-col justify-between p-6 animate-slide-in">
            
            <div className="space-y-6 flex-grow overflow-y-auto pr-1">
              <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                <div className="flex items-center space-x-2 text-pink-400">
                  <span className="text-xl">📋</span>
                  <h3 className="text-lg font-black text-white">Your Past Orders</h3>
                </div>
                <button
                  onClick={() => setShowHistory(false)}
                  className="w-8 h-8 rounded-full bg-slate-900 hover:bg-pink-500/10 hover:text-pink-400 border border-slate-800 text-slate-400 flex items-center justify-center transition font-black cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {ordersHistory.length === 0 ? (
                <div className="text-center py-20 space-y-3">
                  <span className="text-4xl block">🥡</span>
                  <h4 className="text-sm font-black text-slate-500">No Past Orders</h4>
                  <p className="text-xs text-slate-600 px-8">
                    Your order history is empty. Order some delicious food and track them in real time!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ordersHistory.map((pastOrder) => (
                    <div
                      key={pastOrder._id}
                      className="border border-slate-900 rounded-2xl p-4 bg-slate-900/30 hover:bg-slate-900/60 transition space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-black text-white leading-none">
                            {pastOrder.restaurant?.name || "Local Kitchen"}
                          </h4>
                          <span className="text-[10px] text-slate-500 mt-1 block">
                            {new Date(pastOrder.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <span className="bg-pink-500/10 border border-pink-500/20 text-pink-400 font-extrabold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">
                          {pastOrder.status}
                        </span>
                      </div>

                      <div className="space-y-1 pl-2 border-l border-slate-850">
                        {pastOrder.items.map((item) => (
                          <p key={item.itemId} className="text-[11px] text-slate-400 font-medium">
                            {item.name} <span className="font-extrabold text-slate-300">x{item.quantity}</span>
                          </p>
                        ))}
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-900 pt-2.5">
                        <span className="text-xs text-slate-500 font-bold">
                          Paid: <span className="text-pink-400 font-black">₹{pastOrder.total}</span>
                        </span>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/tracking?id=${pastOrder._id}`)}
                            className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-[10px] font-bold uppercase transition"
                          >
                            Track
                          </button>
                          <button
                            onClick={() => handleReorder(pastOrder)}
                            className="px-3.5 py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl text-[10px] font-black uppercase transition shadow-sm cursor-pointer"
                          >
                            Reorder
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-slate-900 pt-4 bg-slate-950">
              <button
                onClick={() => setShowHistory(false)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-850 text-white font-bold rounded-2xl text-xs border border-slate-850 transition cursor-pointer"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sliding User Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-950 border border-slate-900 rounded-3xl p-6 shadow-2xl relative space-y-6">
            <button
              onClick={() => setShowProfile(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900 hover:bg-pink-500/10 hover:text-pink-400 border border-slate-800 text-slate-400 flex items-center justify-center transition font-black cursor-pointer"
            >
              ✕
            </button>

            {/* Profile Header */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-3xl border border-slate-800">
                🧁
              </div>
              <div>
                <h3 className="text-lg font-black text-white tracking-tight leading-none">
                  {user.name || user.email.split("@")[0]}
                </h3>
                <p className="text-[10px] text-pink-400 font-extrabold uppercase mt-1.5 tracking-widest">
                  Level {user.level || "Beginner"} Member 🥇
                </p>
              </div>
            </div>

            {/* Custom Foodie Stats */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-900 shadow-inner">
                <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider">
                  Total Orders
                </span>
                <span className="text-lg font-black text-white block mt-1">
                  {ordersHistory.length}
                </span>
              </div>
              <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-900 shadow-inner">
                <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider">
                  Total Points
                </span>
                <span className="text-lg font-black text-pink-450 block mt-1 text-pink-500">
                  {user.rewardPoints || 0}
                </span>
              </div>
              <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-900 shadow-inner">
                <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider">
                  Badges Earned
                </span>
                <span className="text-lg font-black text-purple-400 block mt-1">
                  {user.badges?.length || 0}
                </span>
              </div>
            </div>

            {/* Badges Preview */}
            <div className="space-y-2 text-xs">
              <h4 className="font-black text-slate-500 uppercase tracking-widest text-[10px]">
                Active Badges
              </h4>
              <div className="flex flex-wrap gap-2">
                {user.badges && user.badges.length > 0 ? (
                  user.badges.slice(0, 4).map(badge => (
                    <span key={badge} className="px-3 py-1.5 bg-slate-900 border border-slate-850 rounded-xl text-[10px] font-black text-slate-300">
                      {badge}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-650 italic text-[11px]">Submit your first review to earn a badge!</span>
                )}
              </div>
            </div>

            {/* Buttons for rewards navigation */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowProfile(false);
                  navigate("/rewards");
                }}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-2xl text-xs tracking-widest uppercase hover:opacity-95 transition cursor-pointer"
              >
                Go to Rewards Dashboard ➔
              </button>
              <button
                onClick={() => setShowProfile(false)}
                className="w-full py-3 bg-slate-900 border border-slate-850 hover:bg-slate-850 text-slate-300 font-bold rounded-2xl text-xs transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Reusable Restaurant Card Component (Glassmorphism + Neon Styling)
function RestaurantCard({ restaurant, favorites, toggleFavorite, navigate, compact = false }) {
  const isFav = favorites.includes(restaurant._id);

  if (compact) {
    return (
      <div
        onClick={() => navigate(`/restaurant?id=${restaurant._id}`)}
        className="group bg-slate-900/60 backdrop-blur-md border border-slate-900 hover:border-purple-500/30 rounded-2xl overflow-hidden cursor-pointer shadow hover:shadow-purple-500/5 transition-all duration-300 flex items-center p-3.5 space-x-3.5"
      >
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-850 flex-shrink-0">
          <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
        </div>
        <div className="flex-grow min-w-0">
          <h4 className="text-xs font-black text-white truncate leading-none">{restaurant.name}</h4>
          <p className="text-[10px] text-slate-500 font-bold mt-1 truncate">{restaurant.cuisine}</p>
          <div className="flex items-center space-x-2 mt-1 text-[10px]">
            <span className="text-amber-500 font-bold">★ {restaurant.rating.toFixed(1)}</span>
            <span className="text-slate-650">•</span>
            <span className="text-slate-500">{restaurant.deliveryTime}m</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate(`/restaurant?id=${restaurant._id}`)}
      className="group bg-slate-900/60 backdrop-blur-md border border-slate-900 hover:border-purple-500/30 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-purple-500/10 transition-all duration-300 flex flex-col h-full hover:scale-[1.01]"
    >
      <div className="relative h-44 w-full bg-slate-850 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
          loading="lazy"
        />
        
        {/* Featured Tag */}
        {restaurant.isFeatured && (
          <span className="absolute top-3.5 left-3.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
            Featured
          </span>
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => toggleFavorite(restaurant._id, e)}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/55 backdrop-blur-md border border-white/10 flex items-center justify-center text-xs transition duration-200 hover:scale-110 active:scale-95 cursor-pointer text-slate-300"
          title={isFav ? "Remove from Favorites" : "Add to Favorites"}
        >
          <span className={`transition-transform duration-300 ${isFav ? 'text-pink-500 scale-125' : 'text-slate-400'}`}>
            {isFav ? '❤️' : '🤍'}
          </span>
        </button>

        {/* Delivery Time Overlay */}
        <span className="absolute bottom-3.5 right-3.5 bg-slate-950/75 backdrop-blur-md text-slate-300 font-extrabold text-[10px] px-2.5 py-1 rounded-full border border-white/5">
          🕒 {restaurant.deliveryTime} mins
        </span>
      </div>

      <div className="p-5 flex-grow flex flex-col justify-between space-y-3.5">
        <div>
          <h4 className="text-base font-black text-white group-hover:text-purple-300 transition tracking-tight leading-tight">
            {restaurant.name}
          </h4>
          <p className="text-xs text-slate-500 font-medium mt-1 truncate">
            {restaurant.cuisine}
          </p>
        </div>

        <div className="border-t border-slate-900 pt-3.5 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="text-amber-500 font-bold text-sm">★</span>
            <span className="font-extrabold text-slate-350">
              {restaurant.rating.toFixed(1)}
            </span>
            <span className="text-slate-600 font-bold">
              ({restaurant.reviewsCount})
            </span>
          </div>

          <span className="text-slate-400 font-bold">
            {restaurant.deliveryFee === 0 ? (
              <span className="text-emerald-500 font-extrabold tracking-wider text-[10px] uppercase">
                FREE DEL
              </span>
            ) : (
              `₹${restaurant.deliveryFee} delivery`
            )}
          </span>
        </div>

        <div className="pt-1.5">
          <button className="w-full py-2 bg-slate-950 group-hover:bg-gradient-to-r from-pink-500 to-purple-600 text-slate-400 group-hover:text-white border border-slate-850 group-hover:border-transparent text-xs font-black uppercase tracking-wider rounded-xl transition duration-300 shadow flex items-center justify-center space-x-1">
            <span>Order Now</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
}
