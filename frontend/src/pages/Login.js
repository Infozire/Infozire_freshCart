import axios from "axios";
import { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import loginImage from "../assets/LoginImage.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      console.log(res.data.token);
      console.log(res.data.user);

      localStorage.setItem("token", res.data.token);
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      toast.success("Login Successful 🚀");

      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (err) {
      toast.error("Invalid Email or Password ❌");
    }
  };

  return (
    <div className="login-container">
      {/* HEADER */}
      <div className="login-header">
        <h2>🌿 Infozire Bulk</h2>
      </div>

      {/* MAIN BOX */}
      <div className="login-box">
        {/* LEFT FORM */}
        <div className="login-form">
          <h2>Welcome Back 👋</h2>
          <p>Please login to continue</p>

          <input
            type="email"
            placeholder="Email or Mobile Number"
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

          <div className="options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <span className="link">Forgot password?</span>
          </div>

          <button onClick={login} className="login-btn">
            Sign In
          </button>

          <p className="signup-text">
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup")}>Create One</span>
          </p>

          <div className="social-login">
            <button>G</button>
            <button>f</button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="login-info">
          <h3>Smart Bulk Shopping</h3>
          <p>
            Buy groceries, vegetables & event supplies in bulk with the best
            price and fast delivery.
          </p>

          <img src={loginImage} alt="products" />
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
