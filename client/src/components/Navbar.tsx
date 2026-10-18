import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import logoImg from '../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleCompetitionsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById('competitions');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState(null, '', '/#competitions');
      }
    } else {
      navigate('/#competitions');
    }
  };

  return (
    <nav className="bg-[#14213D] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-full bg-[#FF9933]/40 blur-[3px] group-hover:blur-md transition-all"></div>
                <img src={logoImg} alt="Logo" className="relative h-10 w-10 rounded-full object-cover border-2 border-[#FF9933] group-hover:scale-105 transition-all duration-300 shadow-md" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-base text-[#FF9933] tracking-wide">वन्दे मातरम् परिवार, रेगवाँ</span>
                <span className="text-xs text-white/70">प्रतिभामंच 2026</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-[#FF9933] transition font-medium">होम</Link>
            <a 
              href="#competitions" 
              onClick={handleCompetitionsClick} 
              className="hover:text-[#FF9933] transition font-medium cursor-pointer"
            >
              प्रतियोगिताएं
            </a>
            <Link to="/register" className="bg-[#FF9933] text-white px-4 py-2 rounded-full font-bold shadow hover:bg-orange-400 transition">
              अभी पंजीयन करें
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-[#FF9933]">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#1a2d50]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium hover:bg-[#14213D] rounded-md">होम</Link>
            <a 
              href="#competitions" 
              onClick={handleCompetitionsClick} 
              className="block px-3 py-2 text-base font-medium hover:bg-[#14213D] rounded-md cursor-pointer"
            >
              प्रतियोगिताएं
            </a>
            <Link to="/register" onClick={() => setIsOpen(false)} className="block px-3 py-2 mt-4 bg-[#FF9933] text-white text-center rounded-md font-bold">
              अभी पंजीयन करें
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
