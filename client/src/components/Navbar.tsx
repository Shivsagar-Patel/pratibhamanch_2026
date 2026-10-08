import { Link } from 'react-router-dom';
import { Trophy, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-orange-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Trophy className="h-8 w-8 text-yellow-300" />
              <span className="font-bold text-xl tracking-wide">प्रतिभामंच 2026</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-yellow-200 transition">होम</Link>
            <Link to="/#competitions" className="hover:text-yellow-200 transition">प्रतियोगिताएं</Link>
            <Link to="/#rules" className="hover:text-yellow-200 transition">नियम</Link>
            <Link to="/register" className="bg-white text-orange-600 px-4 py-2 rounded-full font-bold shadow hover:bg-orange-100 transition">
              अभी पंजीयन करें
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-yellow-200">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-orange-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium hover:bg-orange-600 rounded-md">होम</Link>
            <Link to="/#competitions" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium hover:bg-orange-600 rounded-md">प्रतियोगिताएं</Link>
            <Link to="/register" onClick={() => setIsOpen(false)} className="block px-3 py-2 mt-4 bg-white text-orange-700 text-center rounded-md font-bold">
              अभी पंजीयन करें
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
