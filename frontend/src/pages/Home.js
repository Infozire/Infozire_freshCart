import axios from "axios";
import { useEffect, useState } from "react";
import HeroCarousel from "../components/HeroCarousel";
import CategoriesSection from "../components/CategoriesSection";
import { useNavigate } from "react-router-dom";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

import "./home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
const [wishlist, setWishlist] = useState([]);
  // ✅ IMPORTANT: key = productId + bulkQty
  const [cartItems, setCartItems] = useState({});

  const [selectedBulk, setSelectedBulk] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // ✅ Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };
const fetchWishlist = async () => {
  if (!user) return;

  try {
    const res = await axios.get(
      `http://localhost:5000/api/wishlist/${user._id}`
    );

    // Map product IDs correctly
    const ids = (res.data.products || []).map((item) => item.productId._id);
    setWishlist(ids);
  } catch (err) {
    console.log(err);
  }
};

  // ✅ Fetch products
  const fetchProducts = async (categoryId = "") => {
    try {
      const url = categoryId
        ? `http://localhost:5000/api/products?category=${categoryId}`
        : `http://localhost:5000/api/products`;

      const res = await axios.get(url);
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };
useEffect(() => {
  fetchCart();
  fetchWishlist(); // ✅ ADD THIS

  window.addEventListener("cartUpdated", fetchCart);
  return () => {
    window.removeEventListener("cartUpdated", fetchCart);
  };
}, []);
const toggleWishlist = async (productId) => {
  if (!user) {
    alert("Login required");
    return;
  }

  try {
    if (wishlist.includes(productId)) {
      // Remove
      await axios.post("http://localhost:5000/api/wishlist/remove", {
        userId: user._id,
        productId,
      });
    } else {
      // Add
      await axios.post("http://localhost:5000/api/wishlist/add", {
        userId: user._id,
        productId,
      });
    }

    fetchWishlist(); // Refresh UI
  } catch (err) {
    console.log(err);
  }
};

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchProducts(categoryId);
  };

  // ✅ FETCH CART (FIXED)
  const fetchCart = async () => {
    if (!user) return;

    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${user._id}`);

      const map = {};

      res.data?.items?.forEach((item) => {
        const key = `${item.productId._id}_${item.bulkQty || "default"}`;
        map[key] = item.quantity;
      });

      setCartItems(map);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ BULK SELECT
  const handleBulkChange = (productId, value) => {
    setSelectedBulk((prev) => ({
      ...prev,
      [productId]: value ? JSON.parse(value) : null,
    }));
  };

  useEffect(() => {
    fetchCart();

    window.addEventListener("cartUpdated", fetchCart);
    return () => {
      window.removeEventListener("cartUpdated", fetchCart);
    };
  }, []);

  // ✅ ADD TO CART (FIXED)
  const addToCart = async (productId) => {
    if (!user) {
      alert("Please login");
      return;
    }

    const selected = selectedBulk[productId];

    await axios.post("http://localhost:5000/api/cart/add", {
      userId: user._id,
      productId,
      bulkQty: selected?.qty || null, // ✅ FIXED
      bulkPrice: selected?.price || null,
    });

    fetchCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // ✅ UPDATE QTY (FIXED WITH BULK)
  const updateQty = async (productId, bulkQty, type) => {
    try {
      const key = `${productId}_${bulkQty || "default"}`;

      if (type === "dec" && cartItems[key] === 1) {
        await axios.post("http://localhost:5000/api/cart/remove", {
          userId: user._id,
          productId,
          bulkQty,
        });
      } else {
        await axios.post("http://localhost:5000/api/cart/update", {
          userId: user._id,
          productId,
          bulkQty,
          type,
        });
      }

      fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <HeroCarousel />

      <CategoriesSection
        categories={categories}
        onCategoryClick={handleCategoryClick}
      />

      {/* CATEGORY FILTER */}
      <div className="category-toggle">
        <button
          className={!selectedCategory ? "active" : ""}
          onClick={() => {
            setSelectedCategory(null);
            fetchProducts();
          }}
        >
          All
        </button>

        {categories.map((c) => (
          <button
            key={c._id}
            className={selectedCategory === c._id ? "active" : ""}
            onClick={() => handleCategoryClick(c._id)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* PRODUCTS */}
      <div className="section">
        <h2>
          {selectedCategory
            ? categories.find((c) => c._id === selectedCategory)?.name
            : "All Products"}
        </h2>

        <div className="product-grid">
          {products.map((p) => {
            const selected = selectedBulk[p._id];
            const bulkQty = selected?.qty || null;
            const key = `${p._id}_${bulkQty || "default"}`;
            const qty = cartItems[key] || 0;

            return (
              <div
                className="product-card"
                key={p._id}
                onClick={() => navigate(`/product/${p._id}`)}
              >
<div
  className="wishlist-icon"
  onClick={(e) => {
    e.stopPropagation();
    toggleWishlist(p._id);
  }}
>
  {wishlist.includes(p._id) ? (
    <AiFillHeart color="#ff4d6d" size={24} />
  ) : (
    <AiOutlineHeart color="#333" size={24} />
  )}
</div>

                <img
                  src={
                    p.image?.startsWith("http")
                      ? p.image
                      : `http://localhost:5000${p.image}`
                  }
                  alt={p.name}
                />

                <h4>{p.name}</h4>

                {/* BULK DROPDOWN */}
                {p.bulkOptions?.length > 0 && (
                  <select
                    className="bulk-dropdown"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      handleBulkChange(p._id, e.target.value)
                    }
                  >
                    <option value="">Select Quantity</option>
                    {p.bulkOptions.map((b, i) => (
                      <option key={i} value={JSON.stringify(b)}>
                        {b.qty} {b.unit} - ₹{b.price}
                      </option>
                    ))}
                  </select>
                )}

                {/* PRICE */}
                <p className="price">
                  ₹{selected?.price || p.price}
                </p>

                {/* CART ACTION */}
                <div onClick={(e) => e.stopPropagation()}>
                  {qty === 0 ? (
                    <button
                      className="add-btn"
                      onClick={() => addToCart(p._id)}
                    >
                      {p.bulkOptions?.length > 0
                        ? "Add Bulk"
                        : "Add to Cart"}
                    </button>
                  ) : (
                    <div className="qty-box">
                      <button
                        onClick={() =>
                          updateQty(p._id, bulkQty, "dec")
                        }
                      >
                        -
                      </button>
                      <span>{qty}</span>
                      <button
                        onClick={() =>
                          updateQty(p._id, bulkQty, "inc")
                        }
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
