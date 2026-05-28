import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Review() {
  const { user } = useApp()
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('id')
  
  // Split ratings
  const [foodRating, setFoodRating] = useState(0)
  const [hoverFood, setHoverFood] = useState(0)

  const [deliveryRating, setDeliveryRating] = useState(0)
  const [hoverDelivery, setHoverDelivery] = useState(0)

  // Feedback Tags Selection
  const [selectedTags, setSelectedTags] = useState([])
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  // Guard routing: redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user) return null

  const foodTags = [
    { label: 'Steaming Hot ♨️' },
    { label: 'Spicy Delight 🌶️' },
    { label: 'Perfect Package 📦' },
    { label: 'Fresh Cuisines 🥗' }
  ]

  const deliveryTags = [
    { label: 'Extremely Fast 🛵' },
    { label: 'Polite Valet 🤝' },
    { label: 'Followed Notes 📝' },
    { label: 'Well Behaved 🌟' }
  ]

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (foodRating === 0 || deliveryRating === 0) {
      alert('Please complete both ratings first.')
      return
    }

    setSubmitting(true)
    
    // Simulate API feedback registration delay
    setTimeout(() => {
      setSubmitting(false)
      setSuccess(true)
      
      // Auto redirect back to home after 2.8 seconds
      setTimeout(() => {
        navigate('/home')
      }, 2800)
    }, 1500)
  }

  const getFoodRatingText = (score) => {
    const val = score || hoverFood || foodRating
    switch (val) {
      case 1: return '😢 Terrible Taste'
      case 2: return '😕 Below Average'
      case 3: return '🙂 Standard Flavors'
      case 4: return '😋 Lip-smacking!'
      case 5: return '😍 Ultimate Chef Gourmet!'
      default: return 'Rate the food flavors:'
    }
  }

  const getDeliveryRatingText = (score) => {
    const val = score || hoverDelivery || deliveryRating
    switch (val) {
      case 1: return '😢 Very Slow/Late'
      case 2: return '😕 Careless Valet'
      case 3: return '🙂 Average Delivery'
      case 4: return '😋 Speed-dashing Fast!'
      case 5: return '😍 Exceptionally Polite & Rapid!'
      default: return 'Rate Rajesh delivery:'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex items-center justify-center p-4 font-sans transition-colors duration-300">
      
      {success ? (
        // Animated Success State Panel
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center space-y-6 animate-scale-up">
          <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-850 flex items-center justify-center text-4xl mx-auto shadow-inner animate-pulse">
            ✅
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Review Submitted!</h3>
            <p className="text-slate-400 dark:text-slate-500 text-xs px-4">
              Thank you for sharing your thoughts. Your feedback helps us make MealNest dining experiences even better.
            </p>
          </div>
          <div className="border-t border-slate-50 dark:border-slate-800 pt-4 flex flex-col items-center">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase mt-2.5">
              Returning to Nest dashboard...
            </p>
          </div>
        </div>
      ) : (
        // Advanced Split Review Form Card
        <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-8 animate-fade-in">
          
          <div className="text-center space-y-2.5 border-b border-slate-50 dark:border-slate-800 pb-4">
            <span className="text-4xl">🌟</span>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Share Your Dining Thoughts</h2>
            <p className="text-slate-400 dark:text-slate-500 text-xs max-w-xs mx-auto mt-1">
              Provide feedback for the kitchen flavors and Rajesh delivery valet partner separately.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Food Rating Zone */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-550 tracking-wide uppercase">1. Food & Flavors</label>
              <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-805 rounded-2xl p-4 text-center space-y-3 shadow-inner">
                <div className="flex justify-center space-x-3">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isIlluminated = star <= (hoverFood || foodRating)
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverFood(star)}
                        onMouseLeave={() => setHoverFood(0)}
                        onClick={() => setFoodRating(star)}
                        className={`text-2xl transition duration-150 transform hover:scale-125 focus:outline-none ${
                          isIlluminated ? 'grayscale-0' : 'grayscale opacity-30'
                        }`}
                        disabled={submitting}
                      >
                        🍔
                      </button>
                    )
                  })}
                </div>
                <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {getFoodRatingText()}
                </p>
              </div>
            </div>

            {/* 2. Delivery Rating Zone */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-550 tracking-wide uppercase">2. Delivery Valet Partner</label>
              <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-805 rounded-2xl p-4 text-center space-y-3 shadow-inner">
                <div className="flex justify-center space-x-3">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isIlluminated = star <= (hoverDelivery || deliveryRating)
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverDelivery(star)}
                        onMouseLeave={() => setHoverDelivery(0)}
                        onClick={() => setDeliveryRating(star)}
                        className={`text-2xl transition duration-150 transform hover:scale-125 focus:outline-none ${
                          isIlluminated ? 'grayscale-0' : 'grayscale opacity-30'
                        }`}
                        disabled={submitting}
                      >
                        🛵
                      </button>
                    )
                  })}
                </div>
                <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {getDeliveryRatingText()}
                </p>
              </div>
            </div>

            {/* 3. Feedback Tag Selectors */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-550 tracking-wide uppercase">3. Choose what went well</label>
              
              <div className="space-y-3">
                {/* Food Tags */}
                <div className="flex flex-wrap gap-2">
                  {foodTags.map(tag => (
                    <button
                      key={tag.label}
                      type="button"
                      onClick={() => handleTagToggle(tag.label)}
                      className={`px-3 py-1.5 border rounded-xl text-[10px] font-extrabold uppercase transition select-none cursor-pointer ${
                        selectedTags.includes(tag.label)
                          ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-450 dark:border-rose-800 text-rose-500 dark:text-rose-400 font-black shadow-sm'
                          : 'bg-white dark:bg-slate-950 border-slate-205 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-350 dark:hover:border-slate-700'
                      }`}
                      disabled={submitting}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>

                {/* Delivery Tags */}
                <div className="flex flex-wrap gap-2">
                  {deliveryTags.map(tag => (
                    <button
                      key={tag.label}
                      type="button"
                      onClick={() => handleTagToggle(tag.label)}
                      className={`px-3 py-1.5 border rounded-xl text-[10px] font-extrabold uppercase transition select-none cursor-pointer ${
                        selectedTags.includes(tag.label)
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-450 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 font-black shadow-sm'
                          : 'bg-white dark:bg-slate-950 border-slate-205 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-350 dark:hover:border-slate-700'
                      }`}
                      disabled={submitting}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Optional Comment Box */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-550 tracking-wide uppercase">Add Comments</label>
              <textarea
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share any special feedback with our team..."
                className="w-full pl-4 pr-4 py-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-805 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-xs font-semibold placeholder-slate-455 dark:placeholder-slate-600 dark:text-slate-200 transition"
                disabled={submitting}
              />
            </div>

            {/* Submitting button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-2xl font-bold tracking-wide shadow-lg shadow-rose-500/25 hover:shadow-rose-500/30 hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center space-x-2 cursor-pointer"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving Feedback...</span>
                </>
              ) : (
                <span>Submit Feedback</span>
              )}
            </button>

          </form>

        </div>
      )}

    </div>
  )
}