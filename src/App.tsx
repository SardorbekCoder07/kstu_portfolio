import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import SignIn from './pages/AuthPages/SignIn';
import NotFound from './pages/OtherPage/NotFound';
import LineChart from './pages/Charts/LineChart';
import BarChart from './pages/Charts/BarChart';
import AppLayout from './layout/AppLayout';
import { ScrollToTop } from './components/common/ScrollToTop';
import Home from './pages/Dashboard/Home';
import { Toaster } from 'sonner';
import AddFaculties from './pages/Faculties/AddFaculties';
import ViewFaculties from './pages/Faculties/ViewFaculties';
import AddDepartments from './pages/Departments/AddDepartments';
import ViewDepartments from './pages/Departments/ViewDepartments';
import AddTeachers from './pages/Teachers/AddTeachers';
import ViewTeachers from './pages/Teachers/ViewTeachers';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

export default function App() {
  return (
    <>
      <Router>
        <Toaster position="bottom-right" />
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
            <Route path="/add-faculties" element={<AddFaculties />} />
            <Route path="/view-faculties" element={<ViewFaculties />} />

            {/* Tables */}
            <Route path="/add-departments" element={<AddDepartments />} />
            <Route path="/view-departments" element={<ViewDepartments />} />
            <Route path="/add-teachers" element={<AddTeachers />} />
            <Route path="/view-teachers" element={<ViewTeachers />} />
            {/* Ui Elements */}
            {/* <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} /> */}

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
