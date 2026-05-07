import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../pages/Layout/Layout";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // While AuthContext is still checking, show a loading indicator
  if (loading) {
    return <div>Loading...</div>; // or a spinner component
  }

  // If no user after check, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the protected children
  return children;
}

export default ProtectedRoute;
