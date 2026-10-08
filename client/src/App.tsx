import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Receipt from './pages/Receipt';
import AdminLogin from './pages/admin/Login';
import DashboardLayout from './pages/admin/DashboardLayout';
import Dashboard from './pages/admin/Dashboard';
import ParticipantsList from './pages/admin/ParticipantsList';

function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-orange-50 font-sans text-gray-900 flex flex-col">
        {/* We don't want Navbar/Footer on admin routes, so we can conditionally render or restructure. For simplicity, we can use wildcards or layout routes. But let's restructure slightly. */}
        <Routes>
          {/* Public Routes with Navbar and Footer */}
          <Route path="/*" element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/receipt/:id" element={<Receipt />} />
                </Routes>
              </main>
              <Footer />
            </div>
          } />
          
          {/* Admin Routes (No public Navbar/Footer) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<DashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="participants" element={<ParticipantsList />} />
            {/* Fallback for competitions & banners */}
            <Route path="competitions" element={<div className="p-8 text-2xl">Competitions Management (Coming soon)</div>} />
            <Route path="banners" element={<div className="p-8 text-2xl">Banners Management (Coming soon)</div>} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
