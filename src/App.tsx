import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { Toaster } from "sonner";
import AddTeachers from "./pages/Teachers/AddTeachers";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import Faculties from "./pages/Faculties/Faculties";
import Departments from "./pages/Departments/Departments";
import TeacherDetail from "./pages/Teachers/TeacherDetail";
import Postion from "./pages/Position/Postion";
import NetworkListener from "./components/NetworkListener";
import HomeTeacher from "./pages/Dashboard/HomeTeacher";
import Research from "./pages/Research/Research";
import Controls from "./pages/Controls/Controls";
import Publications from "./pages/Publications/Publications";
import Awards from "./pages/Awards/Awards";
import Consultations from "./pages/Consultations/Consultations";

export default function App() {
  return (
    <>
      <NetworkListener />
      <Router>
        <Toaster position="top-right" duration={2000} richColors />
        <ScrollToTop />
        <Routes>
          <Route path="*" element={<Navigate to={"/login"} replace />} />

          {/* Dashboard Layout */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index path="/admin" element={<Home />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/faculties" element={<Faculties />} />
            <Route path="/add-teachers" element={<AddTeachers />} />
            <Route path="/position" element={<Postion />} />
            <Route path="/teachers/:id" element={<TeacherDetail />} />
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          <Route
            element={
              <ProtectedRoute allowedRoles={["ROLE_TEACHER"]}>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index path="/teacher" element={<HomeTeacher />} />
            <Route path="/research" element={<Research />} />
            <Route path="/controls" element={<Controls />} />
            <Route path="/publications" element={<Publications />} />
            <Route path="/awards" element={<Awards />} />
            <Route path="/consultations" element={<Consultations />} />
          </Route>
          {/* Auth Layout */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            }
          />
          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
