import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./category.css";

export default function CategoryProducts() {
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingWishlist, setLoadingWishlist] = useState(true);

  // BULK
  const [selectedBulk, setSelectedBulk] = useState({});
  const [bulkCart, setBulkCart] = useState({});

  // Wishlist
  const [wishlist, setWishlist] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch wishlist for logged-in user
  const fetchWishlist = async () => {
    if (!user) {
      setWishlist([]);
      setLoadingWishlist(false);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/wishlist/${user._id}`
      );
      // Map to product IDs
      const ids = (res.data.products || []).map(
        (item) => item.productId._id || item.productId
      );
      setWishlist(ids);
    } catch (err) {
      console.log(err);
      setWishlist([]);
    } finally {
      setLoadingWishlist(false);
    }
  };

  // FETCH PRODUCTS + CATEGORY
  const fetchCategoryProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);

      const res = await axios.get(
        `http://localhost:5000/api/products/category/${id}`
      );
      setProducts(res.data);

      const catRes = await axios.get(`http://localhost:5000/api/categories`);
      const selected = catRes.data.find((c) => c._id === id);
      setCategoryName(selected?.name || "Products");
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingProducts(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchCategoryProducts();
    fetchWishlist();
  }, [fetchCategoryProducts, id]);

  // BULK
  const handleBulkChange = (productId, bulkObj) => {
    setSelectedBulk((prev) => ({ ...prev, [productId]: bulkObj }));
  };

  const increaseQty = (productId) => {
    if (!selectedBulk[productId]) return alert("Select bulk first");
    const newQty = (bulkCart[productId] || 0) + 1;
    setBulkCart((prev) => ({ ...prev, [productId]: newQty }));
    updateCart(productId, newQty);
  };

  const decreaseQty = (productId) => {
    const newQty = (bulkCart[productId] || 0) - 1;
    if (newQty <= 0) {
      const updated = { ...bulkCart };
      delete updated[productId];
      setBulkCart(updated);
      updateCart(productId, 0);
    } else {
      setBulkCart((prev) => ({ ...prev, [productId]: newQty }));
      updateCart(productId, newQty);
    }
  };

  const updateCart = async (productId, qty) => {
    if (!user) return;
    try {
      const bulk = selectedBulk[productId];
      await axios.post("http://localhost:5000/api/cart/add", {
        userId: user._id,
        productId,
        quantity: qty,
        bulkQty: bulk?.qty,
        bulkUnit: bulk?.unit,
        bulkPrice: bulk?.price,
      });
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.log(err);
    }
  };

  // ❤️ Wishlist toggle
  const toggleWishlist = async (productId) => {
    if (!user) return alert("Login required");
    try {
      let updated;
      if (wishlist.includes(productId)) {
        updated = wishlist.filter((id) => id !== productId);
        toast.info("Removed from wishlist");
        await axios.post("http://localhost:5000/api/wishlist/remove", {
          userId: user._id,
          productId,
        });
      } else {
        updated = [...wishlist, productId];
        toast.success("Added to wishlist");
        await axios.post("http://localhost:5000/api/wishlist/add", {
          userId: user._id,
          productId,
        });
      }
      setWishlist(updated);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  // ✅ Wait until both products and wishlist are loaded
  if (loadingProducts || loadingWishlist)
    return <h2 className="loading">Loading...</h2>;

  return (
    <div className="bulk-container">
      {/* LEFT SIDE */}
      <div className="bulk-products">
        <h2>{categoryName}</h2>

        <div className="grid">
          {products.map((p) => (
            <div className="card" key={p._id}>
              {/* ❤️ Wishlist */}
              <div
                className="wishlist-icon"
                onClick={() => toggleWishlist(p._id)}
              >
                {wishlist.includes(p._id) ? <FaHeart /> : <FaRegHeart />}
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

              {/* BULK OPTIONS */}
              {p.bulkOptions?.length > 0 && (
                <div className="bulk-options">
                  {p.bulkOptions.map((b, i) => (
                    <button
                      key={i}
                      className={
                        selectedBulk[p._id]?.qty === b.qty
                          ? "bulk-btn active"
                          : "bulk-btn"
                      }
                      onClick={() => handleBulkChange(p._id, b)}
                    >
                      {b.qty} {b.unit}
                    </button>
                  ))}
                </div>
              )}

              <p>₹{selectedBulk[p._id]?.price || p.price}</p>

              {/* QTY */}
              <div className="qty-box">
                <button onClick={() => decreaseQty(p._id)}>-</button>
                <span>{bulkCart[p._id] || 0}</span>
                <button onClick={() => increaseQty(p._id)}>+</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE SUMMARY */}
      <div className="bulk-summary">
        <h3>Bulk Summary</h3>

        {Object.keys(bulkCart).length === 0 ? (
          <p>No items selected</p>
        ) : (
          <>
            {Object.keys(bulkCart).map((productId) => {
              const product = products.find((p) => p._id === productId);
              const bulk = selectedBulk[productId];

              return (
                <div key={productId} className="summary-item">
                  <p>{product?.name}</p>
                  <p>
                    {bulk?.qty} {bulk?.unit} × {bulkCart[productId]}
                  </p>
                </div>
              );
            })}

            <h2>
              Total: ₹
              {Object.keys(bulkCart).reduce((sum, productId) => {
                const product = products.find((p) => p._id === productId);
                const bulk = selectedBulk[productId];
                const price = bulk?.price || product?.price || 0;

                return sum + price * bulkCart[productId];
              }, 0)}
            </h2>

            <button className="place-btn">Place Order</button>
          </>
        )}
      </div>
    </div>
  );
}
