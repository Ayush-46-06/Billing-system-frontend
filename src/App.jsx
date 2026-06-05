import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import LegalPrivacy from "./pages/LegalPrivacy";
import TermsOfService from "./pages/TermsOfService";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import CreateInvoice from "./pages/CreateInvoice";
import Invoices from "./pages/Invoices";
import Customers from "./pages/Customers";
import Profile from "./pages/Profile";
import Services from "./pages/Services";
import CustomerDetails from "./pages/CustomerDetails";
import Layout from "./components/Layout";
import ServiceDetails from "./pages/ServiceDetails";
import InvoiceDetails from "./pages/InvoiceDetails";
import Managers from "./pages/Managers";
import Taxes from "./pages/Taxes";
import ManagerInvoices from "./pages/ManagerInvoices";
import ForgotPassword from "./pages/ForgotPassword";
import ScrollToTop from "./components/ScrollToTop";


import ResetPassword from "./pages/ResetPassword"; 

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
     <ScrollToTop />
      <Routes>
        
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/privacy-policy" element={<LegalPrivacy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
       
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/invoices/create" element={<CreateInvoice />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/invoices/:id" element={<InvoiceDetails />} />
          <Route path="/taxes" element={<Taxes />} />

          <Route
            path="/managers"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Managers />
              </ProtectedRoute>
            }
          />

          <Route path="/managers/:managerId/invoices" element={<ManagerInvoices />} />

          <Route
            path="/services"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Services />
              </ProtectedRoute>
            }
          />

          <Route
            path="/services/:id"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <ServiceDetails />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;