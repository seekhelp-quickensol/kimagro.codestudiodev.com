import {Route, Routes, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import './i18n'; // Import i18n configuration


// ✅ Lazy load all your pages
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const ProductsCategories = lazy(() => import("./pages/ProductCategories"));
const ProductsByCategories = lazy(() => import("./pages/ProductsByCategories"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Innovations = lazy(() => import("./pages/Innovations"));
const InnovationDetails = lazy(() => import("./pages/InnovationDetails"));
const Media = lazy(() => import("./pages/Media"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Search = lazy(() => import("./pages/Search"));

// ✅ Loader Component
function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
    </div>
  );
}

// ✅ ScrollToTop Component (inside App.tsx)
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" }); // change to "smooth" if you want smooth scroll
  }, [pathname]);

  return null;
}

// ✅ Main App
export default function App() {
  return (
    // <BrowserRouter basename={`${import.meta.env.VITE_BASE_URL}`}>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-grow">
          {/* Scroll reset */}
          <ScrollToTop />

          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product-categories" element={<ProductsCategories />} />
              {/* <Route path="/product-details" element={<ProductDetails />} /> */}
              <Route path="/product-details/:id" element={<ProductDetails />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product-categories/:id" element={<ProductsByCategories />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/innovations" element={<Innovations />} />
              <Route path="/innovation-details/:id" element={<InnovationDetails />} />
              <Route path="/media" element={<Media />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </Suspense>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    // </BrowserRouter>
  );
}
