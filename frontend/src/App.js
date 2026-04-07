import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import MainLayout from "./components/MainLayout";

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import BulkOrder from './pages/BulkOrder';
import WishlistPage from './pages/WishlistPage';
import Checkout from './pages/Checkout';
import CategoryProducts from "./pages/CategoryProducts";
import AccountPage from './pages/account';

// ✅ ADMIN PAGES (NEW)
import Dashboard from "./admin/pages/Dashboard";
import Products from "./admin/pages/Products";
import Orders from "./admin/pages/Orders";
import AdminLayout from "./admin/components/AdminLayout";


// ==============================
// 🔐 PROTECTED ROUTES
// ==============================

// ✅ USER PROTECT
const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? children : <Navigate to="/" />;
};

// ✅ ADMIN PROTECT
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/" />;
  if (user.role !== "admin") return <Navigate to="/home" />;

  return children;
};


function App() {
  return (
    <BrowserRouter>
      <>
        <Routes>

          {/* ================= AUTH ================= */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ================= USER ================= */}
          <Route element={<MainLayout />}>

            <Route path="/home" element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } />

            <Route path="/product/:id" element={<ProductDetail />} />

            <Route path="/cart" element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            } />

            <Route path="/bulkorder" element={<BulkOrder />} />

            <Route path="/wishlist" element={
              <PrivateRoute>
                <WishlistPage />
              </PrivateRoute>
            } />

            <Route path="/checkout" element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            } />

            <Route path="/category/:id" element={<CategoryProducts />} />

            <Route path="/account" element={
              <PrivateRoute>
                <AccountPage />
              </PrivateRoute>
            } />

          </Route>

          {/* ================= ADMIN ================= */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>

            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />

          </Route>

        </Routes>

        <ToastContainer position="top-right" autoClose={2000} />
      </>
    </BrowserRouter>
  );
}

export default App;
