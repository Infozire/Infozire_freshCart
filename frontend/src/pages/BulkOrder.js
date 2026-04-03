import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./bulk.css";

export default function BulkOrder() {
  const [products, setProducts] = useState([]);
  const [selectedBulk, setSelectedBulk] = useState({});
  const [bulkCart, setBulkCart] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // ✅ Fetch Products
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  // ✅ Select Bulk Option
  const handleBulkChange = (productId, bulkObj) => {
    setSelectedBulk((prev) => ({
      ...prev,
      [productId]: bulkObj,
    }));
  };

  // ✅ Sync with backend (LIKE CATEGORY PAGE)
  const updateCart = async (productId, qty) => {
    if (!user) return;

    const bulk = selectedBulk[productId];

    try {
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

  // ✅ Increase Qty
  const increaseQty = (productId) => {
    if (!selectedBulk[productId]) {
      alert("Please select bulk quantity first");
      return;
    }

    const newQty = (bulkCart[productId] || 0) + 1;

    setBulkCart((prev) => ({
      ...prev,
      [productId]: newQty,
    }));

    updateCart(productId, newQty); // ✅ IMPORTANT
  };

  // ✅ Decrease Qty
  const decreaseQty = (productId) => {
    const newQty = (bulkCart[productId] || 0) - 1;

    if (newQty <= 0) {
      const updated = { ...bulkCart };
      delete updated[productId];
      setBulkCart(updated);
      updateCart(productId, 0); // ✅ REMOVE
    } else {
      setBulkCart((prev) => ({
        ...prev,
        [productId]: newQty,
      }));
      updateCart(productId, newQty);
    }
  };

  // ✅ Total
  const totalAmount = Object.keys(bulkCart).reduce((sum, productId) => {
    const product = products.find((p) => p._id === productId);
    const bulk = selectedBulk[productId];
    const price = bulk?.price || product?.price || 0;

    return sum + price * bulkCart[productId];
  }, 0);

  // ✅ Place Order → Redirect
  const placeOrder = () => {
    if (!user) {
      alert("Login required");
      return;
    }

    const items = Object.keys(bulkCart).map((productId) => {
      const product = products.find((p) => p._id === productId);
      return {
        productId,
        productName: product?.name,
        productImage: product?.image,
        quantity: bulkCart[productId],
        bulkQty: selectedBulk[productId]?.qty,
        bulkUnit: selectedBulk[productId]?.unit,
        bulkPrice: selectedBulk[productId]?.price,
      };
    });

    if (items.length === 0) {
      alert("Please select items");
      return;
    }

    // ✅ Save for checkout UI (optional but useful)
    localStorage.setItem("bulkOrder", JSON.stringify(items));

    navigate("/checkout");
  };

  return (
    <div className="bulk-container">
      {/* LEFT */}
      <div className="bulk-products">
        <h2>Bulk Groceries</h2>

        <div className="grid">
          {products.map((p) => (
            <div className="card" key={p._id}>
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

              <div className="qty-box">
                <button onClick={() => decreaseQty(p._id)}>-</button>
                <span>{bulkCart[p._id] || 0}</span>
                <button onClick={() => increaseQty(p._id)}>+</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
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

            <h2>Total: ₹{totalAmount}</h2>

            <button className="place-btn" onClick={placeOrder}>
              Place Bulk Order
            </button>
          </>
        )}
      </div>
    </div>
  );
}
