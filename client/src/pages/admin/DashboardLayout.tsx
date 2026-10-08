import { useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { LayoutDashboard, Users, Trophy, LogOut, Image } from 'lucide-react';

const DashboardLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    Cookies.remove('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col fixed h-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-orange-500 tracking-wider">Admin Panel</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link to="/admin/dashboard" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition">
            <LayoutDashboard className="mr-3 w-5 h-5" /> Dashboard
          </Link>
          <Link to="/admin/participants" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition">
            <Users className="mr-3 w-5 h-5" /> Participants
          </Link>
          <Link to="/admin/competitions" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition">
            <Trophy className="mr-3 w-5 h-5" /> Competitions
          </Link>
          <Link to="/admin/banners" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition">
            <Image className="mr-3 w-5 h-5" /> Banners
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-lg transition">
            <LogOut className="mr-3 w-5 h-5" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
