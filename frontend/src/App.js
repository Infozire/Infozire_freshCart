import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";              // ✅ IMPORT THIS
import MainLayout from "./components/MainLayout";

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BulkOrder from './pages/BulkOrder';
import WishlistPage from './pages/WishlistPage';
import Checkout from './pages/Checkout';
import CategoryProducts from "./pages/CategoryProducts";


function App() {
  return (
    <BrowserRouter>
      <>
        <Routes>

          {/* ❌ NO HEADER/FOOTER */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ✅ WITH HEADER + FOOTER */}
          <Route element={<MainLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />

            {/* ✅ ADD HERE */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/bulkorder" element={<BulkOrder />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/checkout" element={<Checkout />} />
<Route path="/category/:id" element={<CategoryProducts />} />

          </Route>

        </Routes>

        <ToastContainer position="top-right" autoClose={2000} />
      </>
    </BrowserRouter>
  );
}

export default App;
