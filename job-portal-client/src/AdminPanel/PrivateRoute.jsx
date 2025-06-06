import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

function PrivateRoute({ children, requiredRole, requiredRoles }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole || requiredRoles) {
    const allowedRoles = requiredRoles || [requiredRole];

    if (!allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard based on user role
      const redirectPath = getRoleBasedRedirect(user.role);
      return <Navigate to={redirectPath} replace />;
    }
  }

  // Check if user account is active
  if (user.status !== 'active') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
          <div className="text-red-500 text-5xl mb-4">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Inactive</h2>
          <p className="text-gray-600 mb-4">
            Your account is currently {user.status}. Please contact the administrator for assistance.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="btn btn-primary"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return children;
}

// Helper function to get role-based redirect path
const getRoleBasedRedirect = (role) => {
  switch (role) {
    case 'admin':
      return '/dashboard';
    case 'company':
      return '/company-dashboard';
    case 'applicant':
      return '/applicant-dashboard';
    default:
      return '/';
  }
};

export default PrivateRoute;