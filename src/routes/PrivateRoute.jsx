import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Custom hook for accessing auth state.

/**
 * A wrapper component that protects private routes.
 * It checks the user's authentication status and redirects unauthenticated users to /login.
 */
const PrivateRoute = ({ children }) => {
  // Get authentication and loading state from the context.
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Helpful log for debugging in development.
  console.log(`PrivateRoute - Loading: ${loading}, IsAuthenticated: ${isAuthenticated}`);

  // Show a loading indicator while verifying auth status.
  if (loading) {
    return <div>Loading session...</div>;
  }
  if (!isAuthenticated) {
    // `replace` prevents the user from returning to the protected page
    // using the browser's "Back" button.
    // `state={{ from: location }}` is optional but useful for redirecting
    // the user back to where they were trying to go after logging in.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render protected content if authenticated; otherwise, redirect to /login.
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

