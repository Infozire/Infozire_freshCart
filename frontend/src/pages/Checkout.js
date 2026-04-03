import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./checkout.css";

export default function Checkout() {
  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState({
    flat: "",
    area: "",
    city: "",
    state: "",
    pincode: ""
  });
  const [locationLoading, setLocationLoading] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const states = ["Pondicherry", "Tamil Nadu", "Kerala", "Karnataka"];

  // ✅ Memoized fetchCart
  const fetchCart = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${user._id}`);
      setCart(res.data);
    } catch (err) {
      console.log("Error fetching cart:", err);
    }
  }, [user._id]);

  // ✅ Memoized fetchSavedAddress
  const fetchSavedAddress = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${user._id}/address`);
      if (res.data?.address) setAddress(res.data.address);
    } catch {
      console.log("No saved address found");
    }
  }, [user._id]);

  useEffect(() => {
    const bulkOrder = JSON.parse(localStorage.getItem("bulkOrder")) || [];

    // Fetch existing cart first
    fetchCart();

    // Merge bulk order items if any
    if (bulkOrder.length > 0) {
      setCart(prev => {
        const bulkItems = bulkOrder.map(item => ({
          _id: item.productId,
          quantity: item.quantity,
          bulkPrice: item.bulkPrice,
          bulkQty: item.bulkQty,
          bulkUnit: item.bulkUnit,
          productId: {
            _id: item.productId,
            name: item.productName || "Product",
            image: item.productImage || "/default-product.png",
            price: item.bulkPrice || 0
          }
        }));

        return {
          items: prev?.items ? [...prev.items, ...bulkItems] : bulkItems
        };
      });
      localStorage.removeItem("bulkOrder");
    }

    fetchSavedAddress();
  }, [fetchCart, fetchSavedAddress]); // ✅ Dependencies added

  const saveAddress = async () => {
    try {
      setSavingAddress(true);
      await axios.put(`http://localhost:5000/api/users/${user._id}/address`, { address });
      alert("Address saved successfully ✅");
    } catch (err) {
      console.log("Failed to save address:", err);
      alert("Failed to save address ❌");
    } finally {
      setSavingAddress(false);
    }
  };

  const getLocation = () => {
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.get(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY`
          );
          const components = res.data.results[0].components;
          setAddress({
            flat: components.house_number || "",
            area: components.road || components.suburb || "",
            city: components.city || components.town || "",
            state: components.state || "",
            pincode: components.postcode || ""
          });
          saveAddress();
        } catch {
          alert("Could not fetch location");
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        alert("Location access denied");
        setLocationLoading(false);
      }
    );
  };

  const handlePayment = async () => {
    await saveAddress();
    const total = cart.items.reduce(
      (acc, item) => acc + (item.bulkPrice || item.productId.price) * item.quantity,
      0
    );
    try {
      const { data } = await axios.post("http://localhost:5000/api/payment/create-order", { amount: total });

      const options = {
        key: "YOUR_RAZORPAY_KEY",
        amount: data.amount,
        currency: "INR",
        name: "Infozire Bulk",
        description: "Order Payment",
        order_id: data.id,
        handler: async (response) => {
          await axios.post("http://localhost:5000/api/payment/verify", response);
          alert("Payment Successful ✅");
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: "#ff6600" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err);
      alert("Payment failed ❌");
    }
  };

  if (!cart) return <h2>Loading...</h2>;

  const total = cart.items.reduce(
    (acc, item) => acc + (item.bulkPrice || item.productId.price) * item.quantity,
    0
  );

  return (
    <div className="checkout-container">
      {/* Left Column */}
      <div className="checkout-left">
        {/* Delivery Address */}
        <div className="address-card">
          <h2>Delivery Address</h2>
          <input
            type="text"
            placeholder="Flat / House No"
            value={address.flat}
            onChange={(e) => setAddress({ ...address, flat: e.target.value })}
          />
          <input
            type="text"
            placeholder="Area / Locality"
            value={address.area}
            onChange={(e) => setAddress({ ...address, area: e.target.value })}
          />
          <input
            type="text"
            placeholder="City"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
          />
          <select
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
          >
            <option value="">Select State</option>
            {states.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Pincode"
            value={address.pincode}
            onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
          />

          <div className="address-actions">
            <button onClick={getLocation} className="location-btn">
              {locationLoading ? "Fetching..." : "Use Current Location 📍"}
            </button>
            <button onClick={saveAddress} className="save-btn">
              {savingAddress ? "Saving..." : "Save Address 💾"}
            </button>
          </div>
        </div>

        {/* Order Items */}
        <div className="order-card">
          <h2>Order Items</h2>
          {cart.items.map((item) => (
            <div className="order-item" key={item._id}>
              <img
                src={
                  item.productId.image?.startsWith("http")
                    ? item.productId.image
                    : `http://localhost:5000${item.productId.image}`
                }
                alt={item.productId.name}
                className="order-item-img"
              />
              <div className="order-item-info">
                <span className="order-item-name">{item.productId.name}</span>
                <span className="order-item-qty">
                 {item.bulkQty
  ? `${item.bulkQty} ${item.bulkUnit || item.productId.unit || "kg"} × ${item.quantity}`
  : `${item.quantity} ×`}

                  ₹{item.bulkPrice || item.productId.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column */}
      <div className="checkout-right">
        {/* Order Summary */}
        <div className="summary-card order-summary">
          <h2>Order Summary</h2>
          {cart.items.map((item) => (
            <div className="summary-item" key={item._id}>
              <img
                src={
                  item.productId.image?.startsWith("http")
                    ? item.productId.image
                    : `http://localhost:5000${item.productId.image}`
                }
                alt={item.productId.name}
                className="summary-item-img"
              />
              <div className="summary-item-info">
                <span className="summary-item-name">{item.productId.name}</span>
                <span className="summary-item-qty">
{item.bulkQty
  ? `${item.bulkQty} ${item.bulkUnit || item.productId.unit || "kg"} × ${item.quantity}`
  : `${item.quantity} ×`}
                  ₹{item.bulkPrice || item.productId.price}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Summary */}
        <div className="summary-card payment-summary">
          <h2>Total</h2>
          <p>₹{total}</p>
          <button className="pay-btn" onClick={handlePayment}>
            Place Order & Pay
          </button>
        </div>
      </div>
    </div>
  );
}
