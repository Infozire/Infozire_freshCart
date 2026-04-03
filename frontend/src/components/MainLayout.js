import Header from "../pages/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout(categories) {
  return (
    <>
      <Header categories={categories} />

      <Outlet /> {/* 🔥 All pages render here */}

      <Footer />
    </>
  );
}
