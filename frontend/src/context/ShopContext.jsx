import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const navigate = useNavigate();

  const addToCart = async (itemId, size) => {
  if (!token) {
    toast.error("You have to login first");
    navigate("/login");
    return;
  }

  if (!size) {
    toast.error("Select product size!");
    return;
  }

  let cartData = structuredClone(cartItems);

  if (cartData[itemId]) {
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
  } else {
    cartData[itemId] = { [size]: 1 };
  }

  setCartItems(cartData);

  try {
    await axios.post(
      backendUrl + "/api/cart/add",
      { itemId, size },
      { headers: { token } }
    );

    toast.success("Added to cart"); // ✅ THIS IS ALL YOU NEEDED

  } catch (error) {
    console.log(error);
    toast.error("Failed to add to cart");
  }
};


  const getCartCount = () => {
    let total = 0;
    for (const items in cartItems) {
      for (const size in cartItems[items]) {
        total += cartItems[items][size];
      }
    }
    return token ? total : 0;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    try {
      await axios.post(
        backendUrl + "/api/cart/update",
        { itemId, size, quantity },
        { headers: { token } }
      );
    } catch {
      toast.error("Failed to update cart");
    }
  };

  const getCartAmount = () => {
    let total = 0;
    for (const items in cartItems) {
      const itemInfo = products.find((p) => p._id === items);
      for (const size in cartItems[items]) {
        total += itemInfo.price * cartItems[items][size];
      }
    }
    return total;
  };

  const getProductsData = async () => {
    const res = await axios.get(backendUrl + "/api/product/list");
    if (res.data.success) setProducts(res.data.products);
  };

  const getUserCart = async (token) => {
    const res = await axios.post(
      backendUrl + "/api/cart/get",
      {},
      { headers: { token } }
    );
    if (res.data.success) setCartItems(res.data.cartData);
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      getUserCart(token);
    } else {
      localStorage.removeItem("token");
      setCartItems({});
    }
  }, [token]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
    setCartItems,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
