import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { LayoutDashboard, Users, Trophy, LogOut, Image, ExternalLink, Menu, X, Shield } from 'lucide-react';
import logoImg from '../../assets/logo.png';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'प्रतिभागी सूची', path: '/admin/participants', icon: Users },
    { name: 'प्रतियोगिताएं', path: '/admin/competitions', icon: Trophy },
    { name: 'बैनर प्रबंधन', path: '/admin/banners', icon: Image },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col md:flex-row">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#14213D] text-white p-4 flex items-center justify-between shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="Logo" className="h-9 w-9 rounded-full object-cover border-2 border-[#FF9933]" />
          <div>
            <h2 className="font-bold text-sm text-[#FF9933] leading-tight">वन्दे मातरम् परिवार</h2>
            <p className="text-[10px] text-gray-300">Admin Control Panel</p>
          </div>
        </div>
        <button 
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} 
          className="p-1.5 rounded-lg bg-white/10 text-white"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-[#0F1C36] text-white flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          {/* Sidebar Header with Logo */}
          <div className="p-6 border-b border-white/10 bg-[#0A1324]">
            <div className="flex items-center gap-3.5">
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#FF9933] to-[#138808] shadow-[0_0_15px_rgba(255,153,51,0.4)] shrink-0">
                <img 
                  src={logoImg} 
                  alt="Logo" 
                  className="h-12 w-12 rounded-full object-cover border-2 border-white/80" 
                />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-[#FF9933] uppercase tracking-wider truncate">वन्दे मातरम् परिवार</p>
                <h2 className="text-base font-extrabold text-white leading-tight truncate">प्रतिभामंच 2026</h2>
                <div className="inline-flex items-center gap-1 bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 border border-green-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> एडमिन एक्टिव
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 mt-2">
            <p className="px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">मुख्य मेन्यू</p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500/20 to-orange-500/5 text-[#FF9933] border-l-4 border-[#FF9933] font-bold shadow-sm'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`mr-3 w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-[#FF9933]' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with Website Link & Logout */}
        <div className="p-4 border-t border-white/10 space-y-2 bg-[#0A1324]/60">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-300 bg-white/5 hover:bg-white/10 hover:text-white transition"
          >
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#FF9933]" /> मुख्य वेबसाइट देखें
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition"
          >
            <LogOut className="mr-3 w-4 h-4" /> लॉगआउट (Logout)
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
};

export default DashboardLayout;
