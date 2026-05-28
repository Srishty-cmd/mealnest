import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Home from './pages/Home'
import Restaurant from './pages/Restaurant'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Tracking from './pages/Tracking'
import Review from './pages/Review'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/restaurant" element={<Restaurant />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/review" element={<Review />} />
      </Routes>
    </BrowserRouter>
  )
}