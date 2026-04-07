import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserCircle, FaBars } from "react-icons/fa";
import "./header.css";
import axios from "axios";

export default function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
const [cartCount, setCartCount] = useState(0);
useEffect(() => {
  const loadUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };

  loadUser();

  // ✅ LISTEN FOR PROFILE UPDATE
  window.addEventListener("userUpdated", loadUser);

  return () => {
    window.removeEventListener("userUpdated", loadUser);
  };
}, []);

  const handleLogout = () => {
    localStorage.removeItem("user"); // remove user
    setUser(null); // reset state
    setProfileOpen(false);
    navigate("/"); // redirect
  };
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  }, []);

  const onCategoryClick = (id) => {
    navigate(`/category/${id}`);
    setDropdownOpen(false); // close dropdown after click
    setMenuOpen(false); // optional: close mobile menu
  };
useEffect(() => {
  const fetchCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        setCartCount(0);
        return;
      }

      const res = await axios.get(
        `http://localhost:5000/api/cart/${user._id}`
      );

      const count = res.data?.items?.reduce(
        (acc, item) => acc + item.quantity,
        0
      );

      setCartCount(count || 0);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ initial load
  fetchCart();

  // ✅ listen for cart updates (VERY IMPORTANT)
  window.addEventListener("cartUpdated", fetchCart);

  // ✅ cleanup
  return () => {
    window.removeEventListener("cartUpdated", fetchCart);
  };
}, []);


  return (
    <header className="header">
      {/* LEFT */}
      <div className="logo" onClick={() => navigate("/home")}>
        🌿 <span>Infozire</span> <b>Bulk</b>
      </div>

      {/* HAMBURGER (MOBILE) */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        <FaBars />
      </div>

      {/* NAV LINKS */}
      <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
        {/* PRODUCE CATEGORY DROPDOWN */}
        <div
          className={`nav-item dropdown ${dropdownOpen ? "active" : ""}`}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span style={{ color: "#fff" }}>Product Categories ▾</span>

          <div className="dropdown-menu">
            {categories?.map((cat) => (
              <div
                key={cat._id}
                className="dropdown-item"
                onClick={() => onCategoryClick(cat._id)}
              >
                {cat.name}
              </div>
            ))}
          </div>
        </div>

<span onClick={() => navigate("/bulkorder")}>
  Bulk Groceries
</span>
        <span>Event Services</span>
        <span>Track Order</span>
      </nav>

      {/* RIGHT */}
      <div className="header-right">
        <input
          type="text"
          placeholder="Search bulk products..."
          className="search-box"
        />

        <div
          className="user profile"
          onClick={() =>
            window.innerWidth <= 768 && setProfileOpen(!profileOpen)
          }
        >
          <FaUserCircle />
          <span>Hi, {user?.name ? user.name : "Guest"} ▾</span>

          {/* PROFILE DROPDOWN */}
          <div className={`profile-dropdown ${profileOpen ? "active" : ""}`}>
            <div className="profile-item" onClick={() => navigate("/account")}>
              Your Account
            </div>

            <div className="profile-item" onClick={() => navigate("/orders")}>
              Your Orders
            </div>

            <div className="profile-item" onClick={() => navigate("/wishlist")}>
              Wishlist
            </div>

            <div className="profile-divider"></div>

            <div
              className="profile-item logout"
              onClick={(e) => {
                e.stopPropagation();
                handleLogout();
              }}
            >
              Logout
            </div>
          </div>
        </div>

        <div className="cart" onClick={() => navigate("/cart")}>
          <FaShoppingCart />
<span>{cartCount}</span>
        </div>
      </div>
    </header>
  );
}
