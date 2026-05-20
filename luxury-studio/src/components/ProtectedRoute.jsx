import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const authed = sessionStorage.getItem('atelier_admin_auth') === 'true';
  if (!authed) return <Navigate to="/admin" replace />;
  return children;
}
