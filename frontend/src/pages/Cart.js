import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import "./cart.css";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchCart = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${user._id}`);
      setCart(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchWishlist = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/wishlist/${user._id}`);
      setWishlist(res.data.products.map((p) => p.productId._id.toString()));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchWishlist();
    window.addEventListener("cartUpdated", fetchCart);
    window.addEventListener("wishlistUpdated", fetchWishlist);
    return () => {
      window.removeEventListener("cartUpdated", fetchCart);
      window.removeEventListener("wishlistUpdated", fetchWishlist);
    };
  }, []);

  // ✅ FIXED: supports both normal + bulk
  const updateQty = async (item, type) => {
    try {
      await axios.post("http://localhost:5000/api/cart/update", {
        userId: user._id,
        productId: item.productId._id,
        bulkQty: item.bulkQty || null,
        bulkUnit: item.bulkUnit || null,
        type,
      });

      fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ FIXED: supports both normal + bulk
  const removeItem = async (item) => {
    try {
      await axios.post("http://localhost:5000/api/cart/remove", {
        userId: user._id,
        productId: item.productId._id,
        bulkQty: item.bulkQty || null,
        bulkUnit: item.bulkUnit || null,
      });

      fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.log(err);
    }
  };

  const toggleWishlist = async (productId) => {
    try {
      if (wishlist.includes(productId.toString())) {
        await axios.post("http://localhost:5000/api/wishlist/remove", {
          userId: user._id,
          productId,
        });
        setWishlist((prev) => prev.filter((id) => id !== productId.toString()));
      } else {
        await axios.post("http://localhost:5000/api/wishlist/add", {
          userId: user._id,
          productId,
        });
        setWishlist((prev) => [...prev, productId.toString()]);
      }
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      console.log(err);
    }
  };

  if (!cart || cart.items.length === 0)
    return <h2 className="empty">Your cart is empty 🛒</h2>;

  const total = cart.items.reduce((acc, item) => {
    const price = item.bulkPrice || item.productId.price;
    return acc + price * item.quantity;
  }, 0);

  return (
    <div className="cart-page">
      <div className="cart-items">
        <h2>Shopping Cart</h2>
        {cart.items.map((item) => {
          const product = item.productId;
          const price = item.bulkPrice || product.price;
          const itemTotal = price * item.quantity;
          const isInWishlist = wishlist.includes(product._id.toString());

          return (
            <div className="cart-item" key={item._id}>
              <img
                src={
                  product.image?.startsWith("http")
                    ? product.image
                    : `http://localhost:5000${product.image}`
                }
                alt={product.name}
              />
              <div className="details">
                <h4>{product.name}</h4>

                {item.bulkQty && (
                  <p className="bulk-info">
                    {item.bulkQty} {item.bulkUnit || product.unit || "kg"}
                  </p>
                )}

                <p>₹{price}</p>

                <div className="qty">
                  {/* ✅ FIXED HERE */}
                  <button onClick={() => updateQty(item, "dec")}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQty(item, "inc")}>+</button>
                </div>

                <div className="cart-buttons">
                  {/* ✅ FIXED HERE */}
                  <button className="remove" onClick={() => removeItem(item)}>
                    Remove
                  </button>

                  <button
                    className={`wishlist ${isInWishlist ? "added" : ""}`}
                    onClick={() => toggleWishlist(product._id)}
                  >
                    {isInWishlist ? "♥ Wishlist" : "♡ Add to Wishlist"}
                  </button>
                </div>
              </div>

              <h4>₹{itemTotal}</h4>
            </div>
          );
        })}
      </div>

      <div className="cart-summary">
        <h3>Order Summary</h3>
        <p>Total Items: {cart.items.reduce((acc, i) => acc + i.quantity, 0)}</p>
        <h2>₹{total}</h2>

        <button className="checkout-btn" onClick={() => navigate("/checkout")}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
