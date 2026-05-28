import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Tracking() {
  const { user, fetchOrderById, updateOrderStatusSimulated } = useApp()
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('id')
  
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tip, setTip] = useState(0)
  
  // Interactive Chat Console
  const [showChat, setShowChat] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState([
    { sender: 'rider', text: 'Hello! I am Rajesh Kumar, your assigned MealNest rider. I am heading to the kitchen.' }
  ])
  const chatEndRef = useRef(null)
  const navigate = useNavigate()

  // Guard routing: redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  // Initial order fetch
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return
      try {
        const orderData = await fetchOrderById(orderId)
        setOrder(orderData)
      } catch (error) {
        console.error('Failed fetching order details:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user && orderId) {
      fetchOrderDetails()
    }
  }, [orderId, user, fetchOrderById])

  // Background timer status progression
  useEffect(() => {
    if (!order || order.status === 'Delivered') return

    const statusFlow = ['Ordered', 'Preparing', 'Out for Delivery', 'Delivered']
    const currentIndex = statusFlow.indexOf(order.status)
    
    if (currentIndex === -1 || currentIndex === statusFlow.length - 1) return

    const interval = setTimeout(async () => {
      const nextStatus = statusFlow[currentIndex + 1]
      const updatedOrder = await updateOrderStatusSimulated(order._id, nextStatus)
      if (updatedOrder) {
        setOrder(updatedOrder)
        
        let riderText = ''
        if (nextStatus === 'Preparing') {
          riderText = 'The kitchen is preparing and packaging your fresh bites. Smells delicious!'
        } else if (nextStatus === 'Out for Delivery') {
          riderText = 'Food is loaded! Speed-dashing towards your nest. Please keep cash ready if you chose COD.'
        } else if (nextStatus === 'Delivered') {
          riderText = 'Arrived at your nest destination! Enjoy your hot meal. Please rate my delivery! 🎉'
        }
        
        setChatMessages(prev => [...prev, { sender: 'rider', text: riderText }])
      }
    }, 7500)

    return () => clearTimeout(interval)
  }, [order, updateOrderStatusSimulated])

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, showChat])

  if (!user) return null

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="flex flex-col items-center space-y-4 animate-pulse">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-extrabold tracking-wider uppercase">Connecting to Nest Tracker...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-4 transition-colors duration-300">
        <span className="text-6xl">📍</span>
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Order Tracker Error</h2>
        <p className="text-slate-500 dark:text-slate-500 text-sm max-w-sm">
          We couldn't connect with the rider tracker for this order ID. It may have expired or is incorrect.
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

  const steps = [
    { name: 'Ordered', icon: '📝', desc: 'Received by kitchen' },
    { name: 'Preparing', icon: '🍳', desc: 'Chef is baking your meal' },
    { name: 'Out for Delivery', icon: '🛵', desc: 'Rider Rajesh is speed-dashing' },
    { name: 'Delivered', icon: '🪺', desc: 'Nest delivery completed' }
  ]

  const statusFlow = ['Ordered', 'Preparing', 'Out for Delivery', 'Delivered']
  const currentStepIndex = statusFlow.indexOf(order.status)

  const handleSendChatMessage = (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMsg = { sender: 'user', text: chatInput }
    setChatMessages(prev => [...prev, userMsg])
    setChatInput('')

    setTimeout(() => {
      let riderReply = 'Got it! I am on it.'
      const text = chatInput.toLowerCase()
      
      if (text.includes('floor') || text.includes('flat') || text.includes('door')) {
        riderReply = 'Thanks for the directions! I will deliver it straight to your doorstep.'
      } else if (text.includes('outside') || text.includes('security') || text.includes('gate')) {
        riderReply = 'Sure, I will leave it with your security gate as requested.'
      } else if (text.includes('hot') || text.includes('fresh')) {
        riderReply = 'Absolutely! It is fully sealed in an insulated bag, fresh and steaming.'
      } else if (text.includes('fast') || text.includes('hurry') || text.includes('slow')) {
        riderReply = 'Navigating traffic routes as fast as possible. Dashing safely!'
      } else if (text.includes('thank') || text.includes('thanks')) {
        riderReply = 'You are very welcome! It is a pleasure serving you.'
      }

      setChatMessages(prev => [...prev, { sender: 'rider', text: riderReply }])
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-16 font-sans relative overflow-x-hidden transition-colors duration-300">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-150 dark:border-slate-800 px-6 py-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/home')}
            className="text-slate-650 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-sm font-bold flex items-center space-x-1 cursor-pointer"
          >
            <span>◀</span>
            <span>Home</span>
          </button>
          <span className="text-slate-300 dark:text-slate-800">|</span>
          <h2 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight">Order Nest-Tracker</h2>
        </div>

        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
          ID: {order._id.substring(order._id.length - 8)}
        </span>
      </header>

      {/* Main Track Workspace */}
      <main className="max-w-4xl mx-auto px-4 mt-8 space-y-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          
          {/* Left Column: Live Progress Stepper */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Delivery Progress Stepper */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm p-6 space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</h3>
                  <p className="text-xl font-black text-rose-500 mt-1">{order.status}</p>
                </div>
                
                {order.status !== 'Delivered' && (
                  <div className="text-right">
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase">Estimated Time</p>
                    <p className="text-base font-black text-slate-700 dark:text-slate-205 animate-pulse mt-0.5">
                      ⏳ {Math.max(5, 25 - (currentStepIndex * 7))} mins
                    </p>
                  </div>
                )}
              </div>

              {/* Steps Layout */}
              <div className="relative flex flex-col space-y-8 pl-8 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-1 before:bg-slate-150 dark:before:bg-slate-800">
                
                {/* Visual active progress bar overlay */}
                <div
                  className="absolute left-3.5 top-2 w-1 bg-gradient-to-b from-rose-500 to-orange-400 transition-all duration-1000"
                  style={{
                    height: `${(currentStepIndex / (steps.length - 1)) * 93}%`
                  }}
                ></div>

                {steps.map((step, idx) => {
                  const isActive = idx <= currentStepIndex
                  const isCurrent = idx === currentStepIndex
                  
                  return (
                    <div key={step.name} className="relative flex items-start space-x-5">
                      
                      {/* Circle Dot Badge */}
                      <span
                        className={`absolute -left-8 w-8 h-8 rounded-full border-2 flex items-center justify-center transition duration-500 backdrop-blur ${
                          isCurrent
                            ? 'bg-rose-500 border-rose-600 text-white shadow-lg shadow-rose-500/30 scale-110'
                            : isActive
                            ? 'bg-orange-400 border-orange-500 text-white shadow-sm'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700'
                        }`}
                      >
                        <span className="text-xs leading-none">{step.icon}</span>
                      </span>

                      <div>
                        <h4
                          className={`text-xs font-black tracking-wide uppercase transition ${
                            isActive ? 'text-slate-800 dark:text-slate-100' : 'text-slate-350 dark:text-slate-650'
                          }`}
                        >
                          {step.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-1">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

            </div>

            {/* SVG animated map widget */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm p-6 space-y-4">
              <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 tracking-wide uppercase">Live Delivery Router</h4>
              
              <div className="relative w-full h-48 bg-emerald-50 dark:bg-slate-950/60 rounded-2xl border border-emerald-100 dark:border-slate-850 overflow-hidden flex items-center justify-center">
                
                {/* Dynamic path grid */}
                <div className="absolute inset-0 opacity-15 dark:opacity-5 bg-[radial-gradient(#10b981_1.5px,transparent_1.5px)] [background-size:16px_16px]"></div>
                
                {/* Dotted delivery route */}
                <svg className="w-5/6 h-2/3 overflow-visible" viewBox="0 0 300 100">
                  <path
                    id="route-path"
                    d="M20,50 Q100,10 150,50 T280,50"
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="3"
                    strokeDasharray="6 6"
                    className="dark:stroke-slate-800"
                  />
                  <path
                    d="M20,50 Q100,10 150,50 T280,50"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="3.5"
                    strokeDasharray="200"
                    strokeDashoffset={200 - (currentStepIndex * 66.6)}
                    className="transition-all duration-1000 ease-out"
                  />
                  
                  {/* Start: Restaurant Node */}
                  <circle cx="20" cy="50" r="7" fill="#f43f5e" className="shadow" />
                  <text x="20" y="70" textAnchor="middle" className="text-[9px] font-black fill-slate-500 dark:fill-slate-400">🏬 Kitchen</text>
                  
                  {/* End: Nest Node */}
                  <circle cx="280" cy="50" r="7" fill="#10b981" />
                  <text x="280" y="70" textAnchor="middle" className="text-[9px] font-black fill-slate-500 dark:fill-slate-400">🏠 Your Nest</text>
                  
                  {/* Moving Delivery Rider Icon */}
                  {order.status !== 'Delivered' && (
                    <g className="animate-pulse">
                      <circle cx={20 + (currentStepIndex * 86.6)} cy={50 - (currentStepIndex === 1 ? 25 : 0)} r="12" fill="#f97316" className="transition-all duration-1000 ease-out shadow-lg" />
                      <text x={20 + (currentStepIndex * 86.6)} y={54 - (currentStepIndex === 1 ? 25 : 0)} textAnchor="middle" className="text-[12px] font-bold fill-white transition-all duration-1000 ease-out">🛵</text>
                    </g>
                  )}
                </svg>

                {/* Radar glow */}
                {order.status !== 'Delivered' && (
                  <div className="absolute w-24 h-24 rounded-full border border-orange-500/25 dark:border-orange-500/10 bg-orange-500/5 animate-ping"></div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Rider & Chats & Billing recap */}
          <div className="space-y-4">
            
            {/* Rider profile and Chat Launcher */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm p-6 space-y-4">
              <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 tracking-wide uppercase border-b border-slate-50 dark:border-slate-800 pb-2">
                Your Valet Rider
              </h4>

              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-slate-950 flex items-center justify-center text-2xl border border-orange-200 dark:border-slate-800">
                  🛵
                </div>
                <div>
                  <h5 className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none">Rajesh Kumar</h5>
                  <p className="text-[9px] text-slate-400 dark:text-slate-500 font-extrabold uppercase mt-1">Vehicle: KA-03-HA-8822</p>
                  <p className="text-[9px] text-amber-500 font-bold mt-0.5">★ 4.9 (420 orders)</p>
                </div>
              </div>

              {/* Tipping Partner */}
              <div className="space-y-1.5 pt-2 border-t border-slate-50 dark:border-slate-800">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-wide">
                  Tip Rajesh: {tip > 0 && <span className="text-green-500 dark:text-green-400 font-black">₹{tip} added</span>}
                </label>
                <div className="flex space-x-2">
                  {[0, 20, 30, 50].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTip(t)}
                      className={`flex-grow py-1.5 border rounded-xl text-xs font-bold transition select-none cursor-pointer ${
                        tip === t
                          ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-450 dark:border-rose-800 text-rose-500 dark:text-rose-400 font-black'
                          : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-805 text-slate-500 dark:text-slate-405 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {t === 0 ? 'None' : `₹${t}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Launcher Trigger */}
              <button
                onClick={() => setShowChat(true)}
                className="w-full mt-2 py-2.5 bg-slate-800 dark:bg-rose-500 hover:bg-slate-900 dark:hover:bg-rose-600 text-white font-bold rounded-2xl text-xs tracking-wider uppercase transition shadow-md flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>💬 Chat with Rajesh</span>
                {chatMessages.length > 0 && (
                  <span className="w-4 h-4 bg-rose-500 dark:bg-slate-850 rounded-full text-[9px] text-white dark:text-rose-400 flex items-center justify-center font-black">
                    {chatMessages.length}
                  </span>
                )}
              </button>
            </div>

            {/* Restaurant Profile summary */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm p-6 space-y-4">
              <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 tracking-wide uppercase border-b border-slate-50 dark:border-slate-800 pb-2">
                Order Items
              </h4>

              {order.restaurant && (
                <div className="flex items-center space-x-3.5">
                  <img
                    src={order.restaurant.image}
                    alt={order.restaurant.name}
                    className="w-10 h-10 rounded-xl object-cover shadow-sm border border-slate-100 dark:border-slate-800"
                  />
                  <div>
                    <h5 className="text-xs font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none">{order.restaurant.name}</h5>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">{order.restaurant.cuisine}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2 max-h-36 overflow-y-auto pt-2">
                {order.items.map((item) => (
                  <div key={item.itemId} className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-505 dark:text-slate-400">
                      {item.name} <span className="text-slate-400 dark:text-slate-550 font-black">x{item.quantity}</span>
                    </span>
                    <span className="font-extrabold text-slate-705 dark:text-slate-200">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-col space-y-2 text-xs">
                <div className="flex justify-between font-semibold text-slate-500 dark:text-slate-400">
                  <span>Food Total</span>
                  <span>₹{order.total}</span>
                </div>
                {tip > 0 && (
                  <div className="flex justify-between font-semibold text-slate-500 dark:text-slate-400">
                    <span>Valet Tip</span>
                    <span className="text-green-500 dark:text-green-400 font-extrabold">+₹{tip}</span>
                  </div>
                )}
                <div className="border-t border-dashed border-slate-200 dark:border-slate-800 pt-2 flex justify-between items-center font-black">
                  <span className="text-slate-800 dark:text-slate-200">Total Paid (COD)</span>
                  <span className="text-sm text-rose-500">₹{order.total + tip}</span>
                </div>
              </div>
            </div>

            {/* Delivered CTA: Star rate review */}
            {order.status === 'Delivered' && (
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-3xl p-6 shadow-xl space-y-4 animate-bounce-short">
                <div className="space-y-1">
                  <h4 className="text-base font-black tracking-tight">Your food has arrived! 🎉</h4>
                  <p className="text-[11px] text-white/80 font-medium">
                    Our rider has delivered your warm and fresh delights safely to your nest.
                  </p>
                </div>
                
                <button
                  onClick={() => navigate(`/review?id=${order._id}`)}
                  className="w-full py-3 bg-white text-emerald-600 font-black rounded-2xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition duration-200 cursor-pointer"
                >
                  Rate & Review meal ➔
                </button>
              </div>
            )}

          </div>

        </div>

      </main>

      {/* Floating Chat Console Widget Drawer */}
      {showChat && (
        <div className="fixed inset-0 z-50 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-fade-in flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl h-[450px] shadow-2xl flex flex-col justify-between overflow-hidden animate-scale-up">
            
            {/* Chat header */}
            <div className="bg-slate-800 dark:bg-slate-950 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-slate-700 dark:bg-slate-800 flex items-center justify-center text-sm font-bold border border-slate-650 dark:border-slate-750">
                  🛵
                </div>
                <div>
                  <h4 className="text-xs font-black tracking-wide leading-none">Valet Rajesh</h4>
                  <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider mt-1 block">Active Now</span>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="w-8 h-8 rounded-full bg-slate-700 dark:bg-slate-800 hover:bg-slate-600 text-white flex items-center justify-center transition font-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-grow p-4 overflow-y-auto bg-slate-50 dark:bg-slate-950/80 space-y-4">
              {chatMessages.map((msg, idx) => {
                const isRider = msg.sender === 'rider'
                return (
                  <div
                    key={idx}
                    className={`flex ${isRider ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs font-medium leading-relaxed shadow-sm ${
                        isRider
                          ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-800'
                          : 'bg-rose-500 text-white rounded-tr-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                )
              })}
              <div ref={chatEndRef}></div>
            </div>

            {/* Chat input form */}
            <form onSubmit={handleSendChatMessage} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-150 dark:border-slate-800 flex items-center space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Send a note (e.g. 'Ring bell', 'Leave outside')..."
                className="flex-grow pl-4 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-805 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-xs font-semibold placeholder-slate-455 dark:placeholder-slate-600 dark:text-slate-200 transition"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-black uppercase shadow cursor-pointer"
              >
                Send
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  )
}