import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from './components/GlobalComponents/Layout';
import LoadingSpinner from './components/commonComponents/LoadingSpinner';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Lazy load all pages
const Overview = lazy(() => import('./pages/Overview'));
const Doctor = lazy(() => import('./pages/Doctors'));
const DoctorProfile = lazy(() => import('./pages/Doctors/DoctorProfile'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Team = lazy(() => import('./pages/Team'));
const Services = lazy(() => import('./pages/Services'));
const Blogs = lazy(() => import('./pages/Blogs'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const Careers = lazy(() => import('./pages/Careers'));
const Admin = lazy(() => import('./pages/Admin'));
const Roles = lazy(() => import('./pages/Roles&permission'));
const ActivityLogs = lazy(() => import('./pages/Activitylogs'));
const Login = lazy(() => import('./pages/Auth/Login'));
const ResetPassword = lazy(() => import('./pages/Auth/ResetPassword'));
const VerifyCode = lazy(() => import('./pages/Auth/VerifyCode'));
const UpdatePassword = lazy(() => import('./pages/Auth/UpdatePassword'));

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public / auth routes (no Layout/sidebar) */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/auth/verify-code" element={<VerifyCode />} />
            <Route path="/auth/update-password" element={<UpdatePassword />} />

            {/* Redirect old login routes to new auth routes */}
            <Route path="/login" element={<Navigate to="/auth/login" replace />} />
            <Route path="/reset-password" element={<Navigate to="/auth/reset-password" replace />} />
            <Route path="/verify-code" element={<Navigate to="/auth/verify-code" replace />} />
            <Route path="/update-password" element={<Navigate to="/auth/update-password" replace />} />

            {/* Protected routes with Layout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Overview />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/doctors" element={<Doctor />} />
              <Route path="/doctors/:id" element={<DoctorProfile />} />
              <Route path="/team" element={<Team />} />
              <Route path="/services" element={<Services />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/roles&permission" element={<Roles />} />
              <Route path='/logs' element={ <ActivityLogs/>} />
            </Route>

            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to="/auth/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
