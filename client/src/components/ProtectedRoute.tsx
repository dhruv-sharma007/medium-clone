import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import type { JSX } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn } = useAuthStore();
  return isLoggedIn ? children : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
