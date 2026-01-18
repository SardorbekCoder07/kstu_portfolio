import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: Props) {
  const token = localStorage.getItem('access_token');
  const role = localStorage.getItem('role');

  if (token) {
    if (role === "ROLE_ADMIN") {
      return <Navigate to="/admin" replace />;
    } else if (role === "ROLE_TEACHER") {
      return <Navigate to="/teacher" replace />;
    }
  }
  return <>{children}</>;
}