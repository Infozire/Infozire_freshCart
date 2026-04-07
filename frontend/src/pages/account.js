import { useState, useEffect } from "react";
import axios from "axios";
import { User, MapPin, ShoppingBag, Heart, LogOut } from "lucide-react";
import "./account.css";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const user = JSON.parse(localStorage.getItem("user"));

  const menu = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "My Orders", icon: ShoppingBag },
    { id: "address", label: "Addresses", icon: MapPin },
    { id: "wishlist", label: "Wishlist", icon: Heart },
  ];

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="account-container">
      <div className="account-wrapper">

        {/* Sidebar */}
        <div className="account-sidebar">
          <h2 className="account-title">My Account</h2>

          <div className="account-menu">
            {menu.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={activeTab === item.id ? "active" : ""}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </div>

          <button className="logout-btn" onClick={logout}>
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Content */}
        <div className="account-content">
          {activeTab === "profile" && <Profile user={user} />}
          {activeTab === "orders" && <Orders user={user} />}
          {activeTab === "address" && <Addresses user={user} />}
          {activeTab === "wishlist" && <Wishlist user={user} />}
        </div>
      </div>
    </div>
  );
}

//////////////////////////////////////////////////////
/* ================= PROFILE ================= */
//////////////////////////////////////////////////////
function Profile({ user }) {
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const res = await axios.get(`http://localhost:5000/api/users/${user._id}`);
      setForm({
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        password: ""
      });
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    try {
   const res = await axios.put("http://localhost:5000/api/users/update", {
  userId: user._id,
  ...form
});

// ✅ UPDATE LOCAL STORAGE (CRITICAL FIX)
const updatedUser = {
  ...user,
  name: res.data.user.name,
  email: res.data.user.email,
  phone: res.data.user.phone
};

localStorage.setItem("user", JSON.stringify(updatedUser));

// ✅ TRIGGER HEADER REFRESH
window.dispatchEvent(new Event("userUpdated"));

alert("Profile updated ✅");
    } catch {
      alert("Update failed ❌");
    }
  };

  return (
    <div className="account-card">
      <h2>Profile Info</h2>

      <div className="form-grid">
        <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />

        {/* PASSWORD FIELD WITH EYE */}
        <div style={{ position: "relative" }}>
          <input
            className="input"
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              fontSize: "12px"
            }}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>
      </div>

      <button className="primary-btn" onClick={handleSave}>Save Changes</button>
    </div>
  );
}

//////////////////////////////////////////////////////
/* ================= ORDERS ================= */
//////////////////////////////////////////////////////
function Orders({ user }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/${user._id}`);
        setOrders(res.data || []);
      } catch {
        console.log("No orders");
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="account-card">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p className="empty-text">No orders yet</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="order-item">
            <p><b>Order ID:</b> {order._id}</p>
            <p><b>Total:</b> ₹{order.totalAmount}</p>
            <p><b>Status:</b> {order.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

//////////////////////////////////////////////////////
/* ================= ADDRESS ================= */
//////////////////////////////////////////////////////
function Addresses({ user }) {
  const [address, setAddress] = useState({
    flat: "",
    area: "",
    city: "",
    state: "",
    pincode: ""
  });

  useEffect(() => {
    if (!user) return;

    const fetchAddress = async () => {
      const res = await axios.get(`http://localhost:5000/api/users/${user._id}/address`);
      if (res.data?.address) setAddress(res.data.address);
    };

    fetchAddress();
  }, [user]);

  const saveAddress = async () => {
    try {
      await axios.put(`http://localhost:5000/api/users/${user._id}/address`, { address });
      alert("Address updated ✅");
    } catch {
      alert("Failed ❌");
    }
  };

  return (
    <div className="account-card">
      <h2>Saved Address</h2>

      <div className="form-grid">
        <input className="input" placeholder="Flat" value={address.flat} onChange={e => setAddress({ ...address, flat: e.target.value })} />
        <input className="input" placeholder="Area" value={address.area} onChange={e => setAddress({ ...address, area: e.target.value })} />
        <input className="input" placeholder="City" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} />
        <input className="input" placeholder="State" value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} />
        <input className="input" placeholder="Pincode" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} />
      </div>

      <button className="primary-btn" onClick={saveAddress}>
        Save Address
      </button>
    </div>
  );
}

//////////////////////////////////////////////////////
/* ================= WISHLIST ================= */
//////////////////////////////////////////////////////
function Wishlist({ user }) {
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    const res = await axios.get(`http://localhost:5000/api/wishlist/${user._id}`);
    setWishlist(res.data.products || []);
  };

  useEffect(() => {
    if (user) fetchWishlist();
  }, [user]);

  const remove = async (productId) => {
    await axios.post("http://localhost:5000/api/wishlist/remove", {
      userId: user._id,
      productId
    });
    fetchWishlist();
  };

  const moveToCart = async (productId) => {
    await axios.post("http://localhost:5000/api/cart/add", {
      userId: user._id,
      productId
    });
    await remove(productId);
    alert("Moved to cart ✅");
  };

  return (
    <div className="account-card">
      <h2>Wishlist</h2>

      {wishlist.length === 0 ? (
        <p className="empty-text">No items</p>
      ) : (
        wishlist.map(item => (
          <div key={item._id} className="wishlist-item">
            <img
              src={item.productId.image?.startsWith("http")
                ? item.productId.image
                : `http://localhost:5000${item.productId.image}`
              }
              alt={item.productId.name}
              className="wishlist-img"
            />

            <div className="wishlist-info">
              <p>{item.productId.name}</p>

              <div className="wishlist-actions">
                <button onClick={() => moveToCart(item.productId._id)}>
                  Move to Cart
                </button>

                <button onClick={() => remove(item.productId._id)}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
