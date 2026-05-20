import { Navigate } from 'react-router-dom';

function isTokenValid() {
  const token = sessionStorage.getItem('atelier_admin_token');
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export default function ProtectedRoute({ children }) {
  if (!isTokenValid()) return <Navigate to="/admin" replace />;
  return children;
}
