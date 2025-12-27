import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from "./context/ToastContext";

import LoginStaff from './pages/common/LoginStaff';
import ForgotPassword from './pages/common/ForgotPassword';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCustomer from './pages/admin/AdminCustomer';
import AdminUser from './pages/admin/AdminUser';
import AdminPawn from './pages/admin/AdminPawn';
import AdminAbout from './pages/admin/AdminAbout';
import AdminContact from './pages/admin/AdminContact';
import AdminFAQs from './pages/admin/AdminFAQs';
import AdminAccount from './pages/admin/AdminAccount';
import AdminRate from './pages/admin/AdminRate';
import AdminGallery from './pages/admin/AdminGallery';

import ManagerDashboard from './pages/manager/ManagerDashboard';
import ManagerCustomer from './pages/manager/ManagerCustomer';
import ManagerPawn from './pages/manager/ManagerPawn';
import ManagerAbout from './pages/manager/ManagerAbout';
import ManagerContact from './pages/manager/ManagerContact';
import ManagerFAQs from './pages/manager/ManagerFAQs';
import ManagerAccount from './pages/manager/ManagerAccount';
import ManagerRate from './pages/manager/ManagerRate';
import ManagerGallery from './pages/manager/ManagerGallery';

import AppraiserDashboard from './pages/appraiser/AppraiserDashboard';
import AppraiserCustomer from './pages/appraiser/AppraiserCustomer';
import AppraiserPawn from './pages/appraiser/AppraiserPawn';
import AppraiserAbout from './pages/appraiser/AppraiserAbout';
import AppraiserContact from './pages/appraiser/AppraiserContact';
import AppraiserFAQs from './pages/appraiser/AppraiserFAQs';
import AppraiserAccount from './pages/appraiser/AppraiserAccount';
import AppraiserRate from './pages/appraiser/AppraiserRate';
import AppraiserGallery from './pages/appraiser/AppraiserGallery';

import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerPawn from './pages/customer/CustomerPawn';
import CustomerAbout from './pages/customer/CustomerAbout';
import CustomerContact from './pages/customer/CustomerContact';
import CustomerFAQs from './pages/customer/CustomerFAQs';
import CustomerAccount from './pages/customer/CustomerAccount';

const App = () => {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginStaff />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/admin">
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="customers" element={<AdminCustomer />} />
            <Route path="users" element={<AdminUser />} />
            <Route path="pawn" element={<AdminPawn />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="contact" element={<AdminContact />} />
            <Route path="faqs" element={<AdminFAQs />} />
            <Route path="account" element={<AdminAccount />} />
            <Route path="rate" element={<AdminRate />} />
            <Route path="gallery" element={<AdminGallery />} />
          </Route>

          <Route path="/appraiser">
            <Route path="dashboard" element={<AppraiserDashboard />} />
            <Route path="customers" element={<AppraiserCustomer />} />
            <Route path="pawn" element={<AppraiserPawn />} />
            <Route path="about" element={<AppraiserAbout />} />
            <Route path="contact" element={<AppraiserContact />} />
            <Route path="faqs" element={<AppraiserFAQs />} />
            <Route path="account" element={<AppraiserAccount />} />
            <Route path="rate" element={<AppraiserRate />} />
            <Route path="gallery" element={<AppraiserGallery />} />
          </Route>

          <Route path="/manager">
            <Route path="dashboard" element={<ManagerDashboard />} />
            <Route path="customers" element={<ManagerCustomer />} />
            <Route path="pawn" element={<ManagerPawn />} />
            <Route path="about" element={<ManagerAbout />} />
            <Route path="contact" element={<ManagerContact />} />
            <Route path="faqs" element={<ManagerFAQs />} />
            <Route path="account" element={<ManagerAccount />} />
            <Route path="rate" element={<ManagerRate />} />
            <Route path="gallery" element={<ManagerGallery />} />
          </Route>

          <Route path="/customer">
            <Route path="dashboard" element={<CustomerDashboard />} />
            <Route path="my-pawn" element={<CustomerPawn />} />
            <Route path="about-us" element={<CustomerAbout />} />
            <Route path="contact-us" element={<CustomerContact />} />
            <Route path="faqs" element={<CustomerFAQs />} />
            <Route path="account" element={<CustomerAccount />} />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  );
};

export default App;
