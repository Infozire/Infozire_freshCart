import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import SignupImage from "../assets/SignupImage.jpg";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const register = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      toast.success("Signup Successful ✅");
      navigate("/login");

    } catch (err) {
      toast.error("Signup Failed ❌");
    }
  };

  return (
    <div className="login-container">

      {/* HEADER */}
      <div className="login-header">
        <h2>🌿 Infozire Bulk</h2>
        <div className="nav-links">
          <span>Produce</span>
          <span>Event Supplies</span>
          <span>Orders</span>
        </div>
      </div>

      <div className="login-box">

        {/* LEFT FORM */}
        <div className="login-form">
          <h2>Create Your Account</h2>
          <p>Start your bulk shopping journey</p>

          <input
            type="text"
            placeholder="Full Name"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email Address"
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button onClick={register} className="login-btn">
            Sign Up
          </button>

          <p className="signup-text">
            Already have an account?{" "}
            <span onClick={() => navigate("/")}>Login</span>
          </p>

          <div className="social-login">
            <button>G</button>
            <button>f</button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="login-info">
          <h3>Join Infozire Bulk</h3>
          <p>
            Buy vegetables, groceries & event supplies in bulk with the best
            prices and fast delivery.
          </p>
        <img src={SignupImage} alt="products" />

        </div>

      </div>

      {/* FOOTER */}
      <div className="login-footer">
        <span>Privacy Policy</span>
        <span>Terms</span>
        <span>Contact</span>
      </div>

    </div>
  );
}
