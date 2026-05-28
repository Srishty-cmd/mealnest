import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Landing() {
  const { theme, toggleTheme } = useApp()
  const navigate = useNavigate()

  const marketingFeatures = [
    { title: 'Hyperlocal Thermal Express', desc: 'Custom thermal-shield valet logistics ensure your food arrives piping hot.', icon: '🛵' },
    { title: 'Split Dual-Trust Reviews', desc: 'Rate chef flavors and rider etiquette separately for complete transparency.', icon: '🌟' },
    { title: 'Responsive Light & Dark Skins', desc: 'Savor eye-pleasing layouts adjusted dynamically day or night.', icon: '☀️' }
  ]

  const trendingDishes = [
    { name: 'Margherita Basil Pizza', price: 299, desc: 'Fresh mozzarella, vine-ripened tomatoes, sweet basil leaf.', emoji: '🍕', rating: 4.8 },
    { name: 'Smoky Cheddar Craft Burger', price: 249, desc: 'Flame-grilled patty, cheddar, wood smoke barbecue glaze.', emoji: '🍔', rating: 4.6 },
    { name: 'Salmon Avocado Sushi Roll', price: 499, desc: 'Fresh Atlantic salmon, ripe avocado, tobiko sprinkles.', emoji: '🍣', rating: 4.7 }
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300 relative pb-20 selection:bg-rose-500 selection:text-white">
      
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md px-6 py-4 border-b border-slate-150 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-rose-500/20">
            🪺
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none">MealNest</h1>
            <p className="text-[9px] text-slate-400 dark:text-slate-500 font-extrabold uppercase mt-1">Premium Food Delivery</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme Toggler */}
          <button
            onClick={toggleTheme}
            className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-300 rounded-full transition cursor-pointer"
            title="Toggle Theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2 bg-slate-800 dark:bg-rose-500 hover:bg-slate-900 dark:hover:bg-rose-600 text-white rounded-2xl text-xs font-black tracking-wider uppercase transition shadow active:scale-[0.97] cursor-pointer"
          >
            Sign In / Register
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-12 md:mt-24 flex flex-col items-center text-center space-y-6 animate-fade-in">
        <span className="bg-rose-50 dark:bg-rose-950/20 text-rose-500 dark:text-rose-455 font-extrabold text-[10px] px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm inline-block">
          ✨ Culinary Nesting Perfected
        </span>
        
        <h2 className="text-4xl md:text-7xl font-black tracking-tight leading-tight leading-none text-slate-850 dark:text-slate-100 max-w-4xl">
          Gourmet perfection, <br />
          <span className="bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
            delivered to your nest.
          </span>
        </h2>
        
        <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg font-medium max-w-2xl leading-relaxed">
          Experience hand-curated menu selections prepared by local five-star chefs and delivered by thermal-insulated valet logistics. Fresh, sizzling, and customized day or night.
        </p>

        <button
          onClick={() => navigate('/login')}
          className="px-8 py-3.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-2xl text-sm font-black tracking-wider uppercase transition shadow-lg shadow-rose-500/25 hover:shadow-rose-500/35 hover:scale-[1.01] active:scale-[0.98] cursor-pointer flex items-center space-x-2"
        >
          <span>Explore Culinary Arts</span>
          <span>➔</span>
        </button>

        {/* Statistics Row */}
        <div className="grid grid-cols-3 gap-6 pt-10 text-center w-full max-w-lg">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow border border-slate-100 dark:border-slate-850">
            <span className="text-[10px] text-slate-400 dark:text-slate-555 font-extrabold uppercase">Served</span>
            <span className="text-lg md:text-xl font-black text-slate-800 dark:text-slate-100 block mt-1">15k+ nests</span>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow border border-slate-100 dark:border-slate-850">
            <span className="text-[10px] text-slate-400 dark:text-slate-555 font-extrabold uppercase">Rider Rating</span>
            <span className="text-lg md:text-xl font-black text-rose-500 block mt-1">★ 4.9</span>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow border border-slate-100 dark:border-slate-850">
            <span className="text-[10px] text-slate-400 dark:text-slate-555 font-extrabold uppercase">Chefs</span>
            <span className="text-lg md:text-xl font-black text-orange-500 block mt-1">200+ partners</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-28 space-y-12 animate-fade-in">
        <div className="text-center space-y-2">
          <h3 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">The MealNest Standard</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wide">Why food lovers choose our valet logistics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {marketingFeatures.map((feat) => (
            <div
              key={feat.title}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm hover:shadow-md transition space-y-4"
            >
              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center text-2xl border border-slate-150 dark:border-slate-850">
                {feat.icon}
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight">{feat.title}</h4>
                <p className="text-xs text-slate-450 dark:text-slate-500 font-medium leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Food Catalog Teaser Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-28 space-y-12 animate-fade-in">
        <div className="text-center space-y-2">
          <h3 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Trending Culinary Creations</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wide">Handcrafted and prepared to order by chef partners</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trendingDishes.map((dish) => (
            <div
              key={dish.name}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="p-8 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-5xl">{dish.emoji}</span>
                  <span className="bg-amber-50 dark:bg-amber-950/20 text-amber-500 font-black text-[10px] px-2.5 py-1 rounded-full uppercase">
                    ★ {dish.rating} rating
                  </span>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight">{dish.name}</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-550 font-medium line-clamp-2 leading-relaxed">{dish.desc}</p>
                </div>
              </div>

              <div className="p-6 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between">
                <span className="text-base font-black text-slate-800 dark:text-slate-200">₹{dish.price}</span>
                
                <button
                  onClick={() => navigate('/login')}
                  className="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition active:scale-[0.96] cursor-pointer"
                >
                  Order Now ➔
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Real Testimonial Review Box */}
      <section className="max-w-4xl mx-auto px-4 mt-28 animate-fade-in">
        <div className="bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-3xl p-8 md:p-12 shadow-xl space-y-6 text-center relative overflow-hidden">
          <div className="absolute -left-8 -top-8 w-24 h-24 rounded-full bg-white/10 blur-md"></div>
          <span className="text-5xl opacity-40 block leading-none">“</span>
          
          <p className="text-base md:text-xl font-bold leading-relaxed max-w-2xl mx-auto">
            MealNest completely changed how I dine at home. The dual-trust split ratings let me give Rajesh Kumar a 5-star delivery and tell the kitchen their salmon avocado MoChis were outstanding!
          </p>

          <div className="space-y-1">
            <h5 className="text-sm font-black tracking-wide uppercase">Dr. Priya Sharma</h5>
            <p className="text-[10px] text-white/80 font-bold uppercase tracking-widest">Nesting Member • Tech Corridor</p>
          </div>
        </div>
      </section>

    </div>
  )
}
