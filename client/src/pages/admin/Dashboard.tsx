import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Users, Trophy, IndianRupee, CheckCircle2, Clock, ArrowRight, Loader2, Sparkles, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import logoImg from '../../assets/logo.png';

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = Cookies.get('adminToken');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${apiUrl}/api/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (error) {
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <Loader2 className="animate-spin h-10 w-10 text-orange-600" />
      </div>
    );
  }

  if (!stats) return <div className="text-gray-500">डेटा लोड नहीं हो सका।</div>;

  const total = stats.totalParticipants || 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* 🚩 Branded Welcome Header Banner */}
      <div className="bg-gradient-to-r from-[#14213D] via-[#1b2d52] to-[#14213D] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border-2 border-orange-500/20">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#FF9933]/15 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5 text-center sm:text-left">
            <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#FF9933] to-[#138808] shadow-[0_0_20px_rgba(255,153,51,0.5)] shrink-0">
              <img 
                src={logoImg} 
                alt="Logo" 
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover border-2 border-white/80" 
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-orange-200 font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" /> मुख्य प्रशासनिक डैशबोर्ड
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                <span className="text-[#FF9933]">वन्दे मातरम्</span> परिवार, रेगवाँ
              </h1>
              <p className="text-gray-300 text-sm mt-0.5 font-medium">
                प्रतिभामंच 2026 — पंजीकरण एवं प्रबंधन रिपोर्ट
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/participants"
              className="bg-[#FF9933] hover:bg-orange-500 text-gray-950 px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-orange-500/30 transition-all flex items-center gap-2"
            >
              प्रतिभागी सूची देखें <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 📊 Key Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Registrations */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">कुल प्रतिभागी</p>
            <p className="text-3xl sm:text-4xl font-extrabold text-[#14213D] mt-1">{stats.totalParticipants}</p>
            <p className="text-xs text-gray-500 mt-1">ऑनलाइन पंजीकृत</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FF9933] shrink-0">
            <Users className="w-7 h-7" />
          </div>
        </div>

        {/* Total Revenue Collected */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 flex items-center justify-between gap-2.5 hover:shadow-md transition">
          <div className="flex-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">कुल प्राप्त राशि</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1 tracking-tight whitespace-nowrap">
              ₹{Number(stats.totalRevenue || 0).toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-gray-500 mt-1">फीस संग्रह (नकद/UPI)</p>
          </div>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <IndianRupee className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        </div>

        {/* Paid Registrations */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">भुगतान पूर्ण (Paid)</p>
            <p className="text-3xl sm:text-4xl font-extrabold text-blue-600 mt-1">{stats.paidCount || 0}</p>
            <p className="text-xs text-gray-500 mt-1">सत्यापित प्रतिभागी</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <CheckCircle2 className="w-7 h-7" />
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">लंबित भुगतान (Pending)</p>
            <p className="text-3xl sm:text-4xl font-extrabold text-amber-600 mt-1">{stats.pendingCount || 0}</p>
            <p className="text-xs text-gray-500 mt-1">फीस बाकी</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-7 h-7" />
          </div>
        </div>

      </div>

      {/* 📖 Booklet Distribution Summary Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-md border border-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0 shadow-inner">
            <BookOpen className="w-6 h-6 text-indigo-300" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-white">तैयारी पुस्तिका (Booklet) वितरण स्थिति</h3>
            <p className="text-xs text-indigo-200/80 mt-0.5">प्रतिभागियों को दी गई और शेष बची बुकलेट की कुल संख्या</p>
          </div>
        </div>
        <div className="flex items-center gap-4 sm:gap-6 self-stretch md:self-auto justify-around">
          <div className="text-center px-4 py-2 bg-white/10 rounded-2xl border border-white/10">
            <p className="text-xs text-emerald-300 font-bold uppercase tracking-wider">दी जा चुकी (Given)</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-0.5">{stats.bookletGivenCount || 0}</p>
          </div>
          <div className="text-center px-4 py-2 bg-white/10 rounded-2xl border border-white/10">
            <p className="text-xs text-amber-300 font-bold uppercase tracking-wider">बाकी (Pending)</p>
            <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-0.5">{stats.bookletPendingCount || 0}</p>
          </div>
          <Link
            to="/admin/participants"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-sm self-center text-center hidden sm:flex items-center gap-1.5"
          >
            प्रतिभागी सूची <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 🏆 Registrations by Competition */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-gray-100 gap-2">
          <div>
            <h2 className="text-xl font-bold text-[#14213D] flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#FF9933]" /> प्रतियोगिता अनुसार पंजीकरण
            </h2>
            <p className="text-gray-500 text-xs mt-0.5">प्रत्येक प्रतियोगिता में सम्मिलित प्रतिभागियों की संख्या</p>
          </div>
          <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-full self-start sm:self-auto">
            सक्रिय प्रतियोगिताएं: {stats.activeCompetitions}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.statsByCompetition.map((comp: any, idx: number) => {
            const count = comp.count || 0;
            const percent = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div 
                key={idx} 
                className="bg-[#FBFBFE] hover:bg-orange-50/40 rounded-2xl border border-gray-200/80 p-5 transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-bold text-[#14213D] text-base leading-snug">{comp.name}</h3>
                  <span className="text-xs font-extrabold bg-orange-100 text-[#FF9933] px-2.5 py-1 rounded-full shrink-0">
                    {count}
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="space-y-1.5 mt-4">
                  <div className="flex justify-between text-xs text-gray-500 font-medium">
                    <span>कुल का हिस्सा</span>
                    <span className="font-bold text-gray-700">{percent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#FF9933] to-orange-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
