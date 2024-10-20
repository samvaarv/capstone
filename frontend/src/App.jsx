import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";

import LoadingSpinner from "./components/LoadingSpinner";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import DashboardPage from "./pages/DashboardPage";
import AdminHomePageUpdate from "./pages/admin/HomeManagement";
import TestimonialManagement from "./pages/admin/TestimonialManagement";
import UserBookingManagement from "./pages/admin/UserBookingManagement";
import PortfolioManagement from "./pages/admin/PortfolioManagement";
import AboutManagement from "./pages/admin/AboutManagement";
import ServiceManagement from "./pages/admin/ServiceManagement";
import BookingManagement from "./pages/admin/BookingManagement";
import ContactManagement from "./pages/admin/ContactManagement";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import ContactPage from "./pages/ContactPage";
import ServicePage from "./pages/ServicePage";
import UserBookingPage from "./pages/UserBookingPage";
import AboutPage from "./pages/AboutPage";
import PortfolioDetail from "./pages/PortfolioDetailPage";
import PortfolioList from "./pages/PortfolioListPage";

import Thankyou from "./components/ThankYou";
import Profile from "./components/Profile";
import ProfileForm from "./components/ProfileForm";
import ChangePasswordForm from "./pages/ChangePasswordForm";

import ClientDashboardPage from "./pages/client/ClientDashboardPage";
import ClientBooking from "./pages/client/ClientBooking";
import ClientTestimonial from "./pages/client/ClientTestimonial";

// protect routes that require authentication
const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />; // Redirect if role doesn't match
  }

  return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="admin">
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <RedirectAuthenticatedUser>
                <SignUpPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectAuthenticatedUser>
                <LoginPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route
            path="/forgot-password"
            element={
              <RedirectAuthenticatedUser>
                <ForgotPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />

          <Route
            path="/reset-password/:token"
            element={
              <RedirectAuthenticatedUser>
                <ResetPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/manage-homepage"
            element={
              <ProtectedRoute role="admin">
                <AdminHomePageUpdate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-portfolio"
            element={
              <ProtectedRoute role="admin">
                <PortfolioManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-about"
            element={
              <ProtectedRoute role="admin">
                <AboutManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-services"
            element={
              <ProtectedRoute role="admin">
                <ServiceManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/booking"
            element={
              <ProtectedRoute role="admin">
                <BookingManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inquiries"
            element={
              <ProtectedRoute role="admin">
                <ContactManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/testimonials"
            element={
              <ProtectedRoute role="admin">
                <TestimonialManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bookings"
            element={
              <ProtectedRoute role="admin">
                <UserBookingManagement />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/portfolio" element={<PortfolioList />} />
          <Route path="/portfolio/:id" element={<PortfolioDetail />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/services" element={<ServicePage />} />
          <Route path="/book-service/:id" element={<UserBookingPage />} />

          {/* Client Routes */}
          <Route
            path="/client/dashboard"
            element={
              <ProtectedRoute role="client">
                <ClientDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/client/testimonial"
            element={
              <ProtectedRoute role="client">
                <ClientTestimonial />
              </ProtectedRoute>
            }
          />

          <Route
            path="/client/booking"
            element={
              <ProtectedRoute role="client">
                <ClientBooking />
              </ProtectedRoute>
            }
          />
          <Route path="/update-profile" element={<ProfileForm />} />
          <Route path="/change-password" element={<ChangePasswordForm />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/thank-you" element={<Thankyou />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <Toaster />
      <Footer />
    </>
  );
}

export default App;
