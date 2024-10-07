import { Navigate, Route, Routes } from "react-router-dom";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import PortfolioManagement from "./pages/PortfolioManagement";
import AboutManagement from "./pages/AboutManagement";
import ExperienceManagement from "./pages/ExperienceManagement";
import ServiceManagement from "./pages/ServiceManagement";
import BookingManagement from "./pages/BookingManagement";
import ContactManagement from "./pages/ContactManagement";

import ClientDashboardPage from "./pages/ClientDashboardPage";
import Navbar from "./components/Navbar";

import LoadingSpinner from "./components/LoadingSpinner";

import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import ContactForm from "./pages/ContactForm";
import ProfileForm from "./pages/ProfileForm";
import ChangePasswordForm from "./pages/ChangePasswordForm";
import ServicePage from "./pages/ServicePage";
import UserBookingPage from "./pages/UserBookingPage";

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
    <div
      className="min-h-screen bg-gradient-to-br
    from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden"
    >
      <Navbar />
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
          path="/portfolio"
          element={
            <ProtectedRoute role="admin">
              <PortfolioManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute role="admin">
              <AboutManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/experience"
          element={
            <ProtectedRoute role="admin">
              <ExperienceManagement />
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

        <Route path="/contact" element={<ContactForm />} />
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

        {/* <Route
          path="/client/profile"
          element={
            <ProtectedRoute role="client">
              <ProfileManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/client/inquiries"
          element={
            <ProtectedRoute role="client">
              <ClientInquiries />
            </ProtectedRoute>
          }
        />

        <Route
          path="/client/booking"
          element={
            <ProtectedRoute role="client">
              <BookingManagement />
            </ProtectedRoute>
          }
        /> */}
      <Route path="/update-profile" element={<ProfileForm />} />
      <Route path="/change-password" element={<ChangePasswordForm />} />

        {/* catch all routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
