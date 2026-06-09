import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // Base API URL config
  const API_URL = "http://localhost:5000/api";

  // Auth State
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem("token");
    return savedToken || "";
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Cart State
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [cartRestaurant, setCartRestaurant] = useState(() => {
    const savedRestaurant = localStorage.getItem("cartRestaurant");
    return savedRestaurant ? JSON.parse(savedRestaurant) : null; // Stores { id, name }
  });
  const [cartShake, setCartShake] = useState(false);

  // Filtering & Sorting State
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default"); // default | rating | time | costLow | costHigh

  // Theme State
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
  });

  // Order & History State
  const [activeOrder, setActiveOrder] = useState(null);
  const [ordersHistory, setOrdersHistory] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminError, setAdminError] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);

  // Setup Axios Auth headers whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  // Sync Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    if (cart.length === 0) {
      localStorage.removeItem("cartRestaurant");
      setCartRestaurant(null);
    } else if (cartRestaurant) {
      localStorage.setItem("cartRestaurant", JSON.stringify(cartRestaurant));
    }
  }, [cart, cartRestaurant]);

  // Sync Theme to HTML root class prefix
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Theme Actions
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Authentication Actions
  const login = async (email, password) => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const { token, user: userData } = response.data;

      setUser(userData);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(userData));
      setAuthLoading(false);
      return true;
    } catch (error) {
      setAuthLoading(false);
      const resp = error.response?.data;
      const msg =
        resp?.error ||
        resp?.message ||
        (Array.isArray(resp?.errors) && resp.errors[0]?.msg) ||
        (typeof resp === "string" && resp) ||
        "Login failed. Please try again.";
      setAuthError(msg);
      return false;
    }
  };

  const register = async (name, email, phone, password) => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        phone,
        password,
      });
      const { token, user: userData } = response.data;

      setUser(userData);
      setToken(token);
      localStorage.setItem("user", JSON.stringify(userData));
      setAuthLoading(false);
      return true;
    } catch (error) {
      setAuthLoading(false);
      const resp = error.response?.data;
      const msg =
        resp?.error ||
        resp?.message ||
        (Array.isArray(resp?.errors) && resp.errors[0]?.msg) ||
        (typeof resp === "string" && resp) ||
        "Registration failed. Try again.";
      setAuthError(msg);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    clearCart();
    setActiveOrder(null);
  };

  // Cart Actions
  const triggerCartShake = () => {
    setCartShake(true);
    setTimeout(() => setCartShake(false), 450);
  };

  const addToCart = (item, restaurant) => {
    // If cart has items and they are from a different restaurant
    if (
      cartRestaurant &&
      cartRestaurant.id !== restaurant._id &&
      cartRestaurant.id !== restaurant.id
    ) {
      const confirmClear = window.confirm(
        `Your cart contains items from "${cartRestaurant.name}". Clear cart to add items from "${restaurant.name}"?`,
      );
      if (confirmClear) {
        setCart([
          {
            itemId: item._id,
            name: item.name,
            price: item.price,
            quantity: 1,
            isVeg: item.isVeg,
          },
        ]);
        setCartRestaurant({
          id: restaurant._id || restaurant.id,
          name: restaurant.name,
        });
        triggerCartShake();
      }
      return;
    }

    if (!cartRestaurant) {
      setCartRestaurant({
        id: restaurant._id || restaurant.id,
        name: restaurant.name,
      });
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.itemId === item._id,
      );
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.itemId === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }
      return [
        ...prevCart,
        {
          itemId: item._id,
          name: item.name,
          price: item.price,
          quantity: 1,
          isVeg: item.isVeg,
        },
      ];
    });

    triggerCartShake();
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.itemId !== itemId));
  };

  const updateQuantity = (itemId, change) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.itemId === itemId) {
            const newQty = item.quantity + change;
            if (change > 0) triggerCartShake();
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const clearCart = () => {
    setCart([]);
    setCartRestaurant(null);
    localStorage.removeItem("cart");
    localStorage.removeItem("cartRestaurant");
  };

  // One-click Re-order of past order items
  const reorderPastItems = (items, restaurant) => {
    clearCart();

    const loadedCart = items.map((item) => ({
      itemId: item.itemId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      isVeg: item.isVeg !== undefined ? item.isVeg : true,
    }));

    setCart(loadedCart);
    setCartRestaurant({
      id: restaurant._id || restaurant.id,
      name: restaurant.name,
    });
    triggerCartShake();
  };

  // Calculations
  const getCartSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getDeliveryFee = () => {
    return getCartSubtotal() > 199 ? 0 : getCartSubtotal() > 0 ? 30 : 0;
  };

  const getTax = () => {
    return Math.round(getCartSubtotal() * 0.18); // 18% GST
  };

  const getCartTotal = () => {
    return getCartSubtotal() + getDeliveryFee() + getTax();
  };

  // Orders API
  const placeOrder = async (address, paymentMethod) => {
    try {
      if (!user) throw new Error("Must be logged in to order");
      const orderPayload = {
        restaurantId: cartRestaurant.id,
        items: cart,
        subtotal: getCartSubtotal(),
        deliveryFee: getDeliveryFee(),
        tax: getTax(),
        total: getCartTotal(),
        address,
        paymentMethod,
      };

      const response = await axios.post(`${API_URL}/orders`, orderPayload);
      const newOrder = response.data;
      setActiveOrder(newOrder);
      clearCart();
      return newOrder;
    } catch (error) {
      console.error("Failed placing order:", error);
      throw error;
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      setOrdersHistory(response.data);
    } catch (error) {
      console.error("Failed fetching order history:", error);
    }
  };

  const fetchOrderById = async (orderId) => {
    try {
      const response = await axios.get(`${API_URL}/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Failed fetching single order status:", error);
      throw error;
    }
  };

  const updateOrderStatusSimulated = async (orderId, status) => {
    try {
      const response = await axios.put(`${API_URL}/orders/${orderId}/status`, {
        status,
      });
      if (activeOrder && activeOrder._id === orderId) {
        setActiveOrder(response.data);
      }
      return response.data;
    } catch (error) {
      console.error("Failed updating simulated order status:", error);
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || "Unable to request password reset.";
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        token,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || "Unable to reset password.";
    }
  };

  const fetchAdminUsers = async () => {
    setAdminLoading(true);
    setAdminError("");
    try {
      const response = await axios.get(`${API_URL}/auth/admin/users`);
      setAdminUsers(response.data);
    } catch (error) {
      setAdminError(error.response?.data?.error || "Unable to fetch users.");
    } finally {
      setAdminLoading(false);
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      const response = await axios.put(
        `${API_URL}/auth/admin/user/${userId}/role`,
        { role },
      );
      setAdminUsers((prevUsers) =>
        prevUsers.map((item) =>
          item._id === response.data._id ? response.data : item,
        ),
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || "Unable to update role.";
    }
  };

  return (
    <AppContext.Provider
      value={{
        API_URL,
        user,
        token,
        authLoading,
        authError,
        login,
        register,
        logout,
        cart,
        cartRestaurant,
        cartShake,
        triggerCartShake,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        reorderPastItems,
        vegOnly,
        setVegOnly,
        sortBy,
        setSortBy,
        theme,
        toggleTheme,
        getCartSubtotal,
        deliveryFee: getDeliveryFee(),
        tax: getTax(),
        getCartTotal,
        activeOrder,
        setActiveOrder,
        ordersHistory,
        placeOrder,
        fetchOrders,
        fetchOrderById,
        updateOrderStatusSimulated,
        forgotPassword,
        resetPassword,
        adminUsers,
        adminLoading,
        adminError,
        fetchAdminUsers,
        updateUserRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
