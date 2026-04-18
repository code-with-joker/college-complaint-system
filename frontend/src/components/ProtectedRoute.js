import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  try {
    const user = jwtDecode(token);

    if (role && user.role !== role) {
      return <Navigate to="/" />;
    }

    return children;
  } catch {
    return <Navigate to="/login" />;
  }
}