import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Login() {
  const { login, register, authLoading, authError, user, theme, toggleTheme } = useApp()
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [validationError, setValidationError] = useState('')
  const navigate = useNavigate()

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/home')
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setValidationError('')

    if (!email || !password) {
      setValidationError('Please fill in all fields.')
      return
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.')
      return
    }

    let success = false
    if (isRegister) {
      success = await register(email, password)
    } else {
      success = await login(email, password)
    }

    if (success) {
      navigate('/home')
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-6 font-sans transition-colors duration-300 relative selection:bg-rose-500 selection:text-white">
      
      {/* Back to Storefront Link */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm text-xs font-bold cursor-pointer hover:scale-103 transition text-slate-650 dark:text-slate-400"
        title="Back to Storefront"
      >
        ◀ Storefront
      </button>

      {/* Theme Toggler */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-slate-200 dark:border-slate-700 rounded-full shadow-md text-sm cursor-pointer hover:scale-105 active:scale-95 transition"
        title="Toggle Theme"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      {/* Glassmorphic Auth Panel */}
      <div className="w-full max-w-md bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-slate-800/50 animate-scale-up space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-rose-500/20 mx-auto">
            🪺
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-850 dark:text-slate-100 tracking-tight leading-none">
              {isRegister ? 'Join MealNest' : 'Access Your Nest'}
            </h2>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold mt-2 leading-relaxed">
              {isRegister 
                ? 'Register with your email to start ordering delicacies.' 
                : 'Sign in to access your customized dashboard and cart.'
              }
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Errors */}
          {(validationError || authError) && (
            <div className="bg-rose-50 dark:bg-rose-950/20 border-l-4 border-rose-500 p-4 rounded-r-xl text-rose-700 dark:text-rose-350 text-xs font-bold shadow-sm animate-pulse flex items-center">
              <span className="text-base mr-2">⚠️</span>
              <span>{validationError || authError}</span>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-wide uppercase">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-600 text-xs">✉️</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-850 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-slate-800 dark:text-slate-100 text-xs font-semibold placeholder-slate-400 dark:placeholder-slate-700 transition"
                disabled={authLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-wide uppercase">Password</label>
              {!isRegister && (
                <button type="button" className="text-[10px] text-rose-500 font-extrabold hover:underline">Forgot?</button>
              )}
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-600 text-xs">🔒</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-850 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-slate-800 dark:text-slate-100 text-xs font-semibold placeholder-slate-400 dark:placeholder-slate-700 transition"
                disabled={authLoading}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-2xl font-bold tracking-wider uppercase text-xs shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 hover:scale-[1.01] active:scale-[0.99] transition duration-250 flex items-center justify-center space-x-2 cursor-pointer"
            disabled={authLoading}
          >
            {authLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
            )}
          </button>

        </form>

        {/* Toggle */}
        <div className="text-center text-xs font-semibold text-slate-500 dark:text-slate-455 border-t border-slate-150 dark:border-slate-800 pt-4">
          {isRegister ? 'Already have an account?' : "New to MealNest?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister)
              setValidationError('')
            }}
            className="text-rose-500 font-black hover:underline cursor-pointer"
            disabled={authLoading}
          >
            {isRegister ? 'Sign in' : 'Create an account'}
          </button>
        </div>

      </div>
    </div>
  )
}