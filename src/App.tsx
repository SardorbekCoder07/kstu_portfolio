import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import SignIn from './pages/AuthPages/SignIn';
import NotFound from './pages/OtherPage/NotFound';
import LineChart from './pages/Charts/LineChart';
import BarChart from './pages/Charts/BarChart';
import AppLayout from './layout/AppLayout';
import { ScrollToTop } from './components/common/ScrollToTop';
import Home from './pages/Dashboard/Home';
import { Toaster } from 'sonner';
import AddDepartments from './pages/Departments/AddDepartments';
import ViewDepartments from './pages/Departments/ViewDepartments';
import AddTeachers from './pages/Teachers/AddTeachers';
import ViewTeachers from './pages/Teachers/ViewTeachers';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import Faculties from './pages/Faculties/Faculties';

export default function App() {
  return (
    <>
      <Router>
        <Toaster position="top-right" duration={2000} richColors   />
        <ScrollToTop />
        <Routes>
          <Route path="*" element={<Navigate to={'/login'} replace />} />

          {/* Dashboard Layout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index path="/admin" element={<Home />} />

            {/* Others Page */}

            {/* Forms */}
            <Route path="/faculties" element={<Faculties />} />

            <Route path="/add-departments" element={<AddDepartments />} />
            <Route path="/view-departments" element={<ViewDepartments />} />
            <Route path="/add-teachers" element={<AddTeachers />} />
            <Route path="/view-teachers" element={<ViewTeachers />} />
            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
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
