import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";

import SignIn from "./pages/AuthPages/SignIn";
import UserProfiles from "./pages/UserProfiles";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import HomeBanner from "./components/admin/HomeBanner";
// import CategoryList from "./components/admin/CategoryList";
import AddCategory from "./components/admin/AddCategory";
import AddProduct from "./components/admin/AddProduct";
import ProductList from "./components/admin/ProductList";
import AddSkuMaster from "./components/admin/AddSkuMaster";
import AddMediaMaster from "./components/admin/AddMediaMaster";
import Innovation from "./components/admin/Innovation";
import AddMedia from "./components/admin/AddMedia";
import MediaList from "./components/admin/MediaList";
// import EnquiryList from "./components/admin/EnquiryList";

import DepartmentMaster from "./components/admin/DepartmentMaster";
import DesignationMaster from "./components/admin/DesignationMaster";
import AddUser from "./components/admin/AddUser";
import UserList from "./components/admin/UserList";
import { setupInterceptors } from "./utils/axiosInstance";
import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState, store } from "./features/auth/store";
import ContactList from "./components/admin/ContactList";
import { Toaster } from 'react-hot-toast';

setupInterceptors(store);

interface ProtectedLayoutProps {
  children: ReactNode;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return isAuthenticated ? <>{children}</> : <Navigate to={`/`} replace />;
};

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
          },
        }}
      />

      <Router basename={`${import.meta.env.VITE_BASE_URL}`}>
        <ScrollToTop />
        <Routes >
        {/* <Route index path="/" element={<SignIn />} /> */}
          <Route index path="/" element={<SignIn />} />
          {/* Dashboard Layout */}

          <Route
            element={
              <ProtectedLayout>
                <AppLayout />
              </ProtectedLayout>
            }>
            <Route index path="/home" element={<Home />} />
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/add-user/:id" element={<AddUser />} />
            <Route path="/user-list" element={<UserList />} />
            <Route path="/home-banner" element={<HomeBanner />} />
            <Route path="/home-banner/:id" element={<HomeBanner />} />
            <Route path="/add-category" element={<AddCategory />} />
            <Route path="/add-category/:id" element={<AddCategory />} />
            {/* <Route path="/category-list" element={<CategoryList />} /> */}
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/add-product/:id" element={<AddProduct />} />
            <Route path="/product-list" element={<ProductList />} />
            <Route path="/add-sku-master" element={<AddSkuMaster />} />
            <Route path="/add-sku-master/:id" element={<AddSkuMaster />} />
            <Route path="/add-media-master" element={<AddMediaMaster />} />
            <Route path="/add-media-master/:id" element={<AddMediaMaster />} />
            <Route path="/department-master" element={<DepartmentMaster />} />
            <Route path="/department-master/:id" element={<DepartmentMaster />} />
            <Route path="/designation-master" element={<DesignationMaster />} />
            <Route path="/designation-master/:id" element={<DesignationMaster />} />
            <Route path="/add-innovation/:product_id/:id" element={<Innovation />} />
            <Route path="/add-innovation/:product_id" element={<Innovation />} />
            <Route path="/add-media" element={<AddMedia />} />
            <Route path="/add-media/:id" element={<AddMedia />} />
            <Route path="/media-list" element={<MediaList />} />
            <Route path="/enquiry-list" element={<ContactList />} />
          </Route>
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </Router>
    </>
  );
}
