/**
 * 🎊 RuangTamu - Wedding Check-in System  
 * Main App Component (WORKING VERSION!)
 * by PutuWistika
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { ROUTES, USER_ROLES } from './utils/constants';

// Loading Component
const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-gray-600 text-sm">Loading...</p>
    </div>
  </div>
);

// Public Pages - Load immediately
import Landing from './pages/Landing';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ProfileCard from './components/ProfileCard'; // ✅ TAMBAHKAN INI!

// Admin Pages - Lazy load (hanya load saat dibutuhkan)
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const SearchGuest = lazy(() => import('./pages/Admin/SearchGuest'));
const CreateGuest = lazy(() => import('./pages/Admin/CreateGuest'));
const AllGuests = lazy(() => import('./pages/Admin/AllGuests'));
const AdminQueue = lazy(() => import('./pages/Admin/Queue'));

// Runner Pages - Lazy load
const RunnerDashboard = lazy(() => import('./pages/Runner/Dashboard'));
const RunnerSearchGuest = lazy(() => import('./pages/Runner/SearchGuest'));
const RunnerQueue = lazy(() => import('./pages/Runner/Queue'));
const RunnerMyGuests = lazy(() => import('./pages/Runner/Completed'));

// Placeholders (if needed for future pages)
const PlaceholderRunner = () => (
  <div className="flex items-center justify-center min-h-screen bg-blue-50">
    <div className="text-center p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-2">🏃‍♂️ Runner Page</h1>
      <p className="text-gray-600">Coming soon...</p>
    </div>
  </div>
);

const PlaceholderQueue = () => (
  <div className="flex items-center justify-center min-h-screen bg-green-50">
    <div className="text-center p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-2">📋 Queue</h1>
      <p className="text-gray-600">Coming soon...</p>
    </div>
  </div>
);

// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-red-50">
          <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">Oops!</h1>
            <p className="text-gray-600 mb-4">{this.state.error?.message || 'Something went wrong'}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Protected Route
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  
  if (requiredRole && user?.role !== requiredRole) {
    const redirectPath = user?.role === USER_ROLES.ADMIN
      ? ROUTES.ADMIN_DASHBOARD
      : ROUTES.RUNNER_DASHBOARD;
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

// Public Route
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  
  if (isAuthenticated) {
    const redirectPath = user?.role === USER_ROLES.ADMIN
      ? ROUTES.ADMIN_DASHBOARD
      : ROUTES.RUNNER_DASHBOARD;
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

// Routes
const AppRoutes = () => (
  <Suspense fallback={<LoadingScreen />}>
    <Routes>
      {/* Public */}
      <Route path={ROUTES.HOME} element={<Landing />} />
      <Route path={ROUTES.LOGIN} element={<PublicRoute><Login /></PublicRoute>} />
      
      {/* 🎊 ProfileCard - Guest Public Profile (✅ ROUTE BARU!) */}
      <Route path={ROUTES.GUEST_CARD} element={<ProfileCard />} />

      {/* Admin - 5 Pages */}
      <Route path={ROUTES.ADMIN_DASHBOARD} element={
        <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.ADMIN_SEARCH} element={
        <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
          <SearchGuest />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.ADMIN_CREATE_GUEST} element={
        <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
          <CreateGuest />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.ADMIN_ALL_GUESTS} element={
        <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
          <AllGuests />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.ADMIN_QUEUE} element={
        <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
          <AdminQueue />
        </ProtectedRoute>
      } />

      {/* Runner */}
      <Route path={ROUTES.RUNNER_DASHBOARD} element={
        <ProtectedRoute requiredRole={USER_ROLES.RUNNER}>
          <RunnerDashboard />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.RUNNER_SEARCH} element={
        <ProtectedRoute requiredRole={USER_ROLES.RUNNER}>
          <RunnerSearchGuest />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.RUNNER_QUEUE} element={
        <ProtectedRoute requiredRole={USER_ROLES.RUNNER}>
          <RunnerQueue />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.RUNNER_MY_GUESTS} element={
        <ProtectedRoute requiredRole={USER_ROLES.RUNNER}>
          <RunnerMyGuests />
        </ProtectedRoute>
      } />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

// Main App
const App = () => (
  <ErrorBoundary>
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          expand={true}
          richColors
          closeButton
          duration={4000}
          toastOptions={{
            style: { background: '#fff', color: '#000', border: '1px solid #e5e7eb' },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  </ErrorBoundary>
);

export default App;