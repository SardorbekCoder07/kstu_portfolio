// src/routes/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[]; // ruxsat berilgan rollar
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");
  const location = useLocation();

  // Token yo'q bo'lsa loginga yo'naltirish
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Agar allowedRoles berilgan bo'lsa va user roli mos kelmasa
  if (allowedRoles && !allowedRoles.includes(role || "")) {
    // Role asosida home page'ga yo'naltirish
    if (role === "ROLE_ADMIN") return <Navigate to="/admin" replace />;
    if (role === "ROLE_TEACHER") return <Navigate to="/teacher" replace />;
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
