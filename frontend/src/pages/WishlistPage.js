import { useEffect, useState } from "react";
import axios from "axios";
import "./wishlist.css";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch Wishlist from backend
  const fetchWishlist = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/wishlist/${user._id}`);
      setWishlist(res.data.products || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      await axios.post("http://localhost:5000/api/wishlist/remove", {
        userId: user._id,
        productId,
      });
      fetchWishlist();
    } catch (err) {
      console.log(err);
    }
  };

  // Move to cart
  const moveToCart = async (productId) => {
    try {
      // Add to cart
      await axios.post("http://localhost:5000/api/cart/add", {
        userId: user._id,
        productId,
        quantity: 1,
      });
      // Remove from wishlist
      await removeFromWishlist(productId);

      // Optional: Show success toast
      alert("Moved to cart!");
    } catch (err) {
      console.log(err);
    }
  };

  if (wishlist.length === 0)
    return <h2 className="empty">Your wishlist is empty 🖤</h2>;

  return (
    <div className="wishlist-page">
      <h2>My Wishlist</h2>
      <div className="wishlist-grid">
        {wishlist.map((item) => {
          const product = item.productId;
          return (
            <div className="wishlist-card" key={product._id}>
              <img
                src={
                  product.image?.startsWith("http")
                    ? product.image
                    : `http://localhost:5000${product.image}`
                }
                alt={product.name}
              />
              <div className="wishlist-details">
                <h4>{product.name}</h4>
                {item.bulkQty && (
                  <p className="bulk-info">
                    {item.bulkQty} {product.unit || "kg"}
                  </p>
                )}
                <p className="price">₹{product.price}</p>
                <div className="wishlist-buttons">
                  <button
                    className="move-cart"
                    onClick={() => moveToCart(product._id)}
                  >
                    Move to Cart
                  </button>
                  <button
                    className="remove"
                    onClick={() => removeFromWishlist(product._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
