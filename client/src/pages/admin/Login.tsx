import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { Lock, Mail, Loader2, ArrowLeft } from 'lucide-react';
import logoImg from '../../assets/logo.png';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiUrl}/api/admin/login`, { email, password });
      Cookies.set('adminToken', res.data.token, { expires: 1 });
      toast.success('लॉगिन सफल!');
      navigate('/admin/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'ईमेल या पासवर्ड गलत है।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1128] via-[#14213D] to-[#0A1128] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#FF9933]/15 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#138808]/15 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        {/* Logo with glow */}
        <div className="flex justify-center mb-4">
          <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#FF9933] via-yellow-200 to-[#138808] shadow-[0_0_25px_rgba(255,153,51,0.5)]">
            <img 
              src={logoImg} 
              alt="वन्दे मातरम् परिवार लोगो" 
              className="h-20 w-20 rounded-full object-cover border-2 border-white/80" 
            />
          </div>
        </div>
        
        <p className="text-[#FF9933] font-bold text-base tracking-wide uppercase">वन्दे मातरम् परिवार, रेगवाँ</p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          प्रतिभामंच 2026
        </h2>
        <p className="text-gray-400 text-xs mt-1">प्रशासनिक नियंत्रण कक्ष (Admin Portal)</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/10 backdrop-blur-xl border border-white/15 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-1.5">
                ईमेल आईडी (Admin Email)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-1.5">
                पासवर्ड (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-transparent transition"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-[#FF9933] via-orange-500 to-[#e68a2e] hover:shadow-[0_10px_25px_rgba(255,153,51,0.4)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-200"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'एडमिन लॉगिन करें'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center border-t border-white/10 pt-4">
            <Link 
              to="/" 
              className="inline-flex items-center gap-1.5 text-xs text-orange-300 hover:text-white transition font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> मुख्य वेबसाइट पर वापस जाएं
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
