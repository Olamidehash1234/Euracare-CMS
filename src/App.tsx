import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from './components/GlobalComponents/Layout';
import LoadingSpinner from './components/commonComponents/LoadingSpinner';

// Lazy load all pages
const Overview = lazy(() => import('./pages/Overview'));
const Doctor = lazy(() => import('./pages/Doctors'));
const DoctorProfile = lazy(() => import('./pages/Doctors/DoctorProfile'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Team = lazy(() => import('./pages/Team'));
const Services = lazy(() => import('./pages/Services'));
const Blogs = lazy(() => import('./pages/Blogs'));
const Careers = lazy(() => import('./pages/Careers'));
const Admin = lazy(() => import('./pages/Admin'));
const Department = lazy(() => import('./pages/Department'));
const Logs = lazy(() => import('./pages/Logs'));
const Accreditations = lazy(() => import('./pages/Accreditations'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Overview />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/doctors" element={<Doctor />} />
            <Route path="/doctors/:id" element={<DoctorProfile />} />
            <Route path="/team" element={<Team />} />
            <Route path="/services" element={<Services />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/department" element={<Department />} />
            <Route path="/logs" element={<Logs />} />
            <Route path='/accreditations' element={ <Accreditations/>} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
