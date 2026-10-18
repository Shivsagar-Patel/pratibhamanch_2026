import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  Calendar, 
  MapPin, 
  Trophy, 
  Users, 
  Loader2, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  PhoneCall,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { motion } from 'framer-motion';
import logoImg from '../assets/logo.png';

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const Home = () => {
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#competitions') {
      const scrollTimer = setTimeout(() => {
        const el = document.getElementById('competitions');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
      return () => clearTimeout(scrollTimer);
    }
  }, [location.hash, loading]);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${apiUrl}/api/competitions`);
        setCompetitions(res.data);
      } catch (error) {
        console.error('Error fetching competitions', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompetitions();
  }, []);

  return (
    <div className="font-sans bg-[#FBFBFE] text-gray-900 selection:bg-orange-500 selection:text-white">
      
      {/* 🚀 Top Live Announcement Ticker / Marquee */}
      <div className="bg-gradient-to-r from-[#14213D] via-[#1a2d50] to-[#14213D] text-white py-2.5 px-4 overflow-hidden border-b border-orange-500/30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <span className="flex items-center gap-1.5 bg-[#FF9933] text-gray-950 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider shrink-0 shadow-sm animate-pulse">
            <Flame className="w-3.5 h-3.5 fill-current" /> सूचना
          </span>
          <div className="overflow-hidden relative w-full">
            <div className="animate-marquee inline-flex gap-8 text-sm font-medium text-gray-200">
              <span className="inline-flex items-center gap-2">
                🚩 <strong className="text-[#FF9933]">वन्दे मातरम् परिवार, रेगवाँ</strong> द्वारा आयोजित प्रतिभामंच 2026
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-2">
                📅 <strong>दिनांक:</strong> 7, 8 और 9 नवंबर 2026
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-2">
                📍 <strong>स्थान:</strong> श्रीराम मंदिर के सामने, रेगवाँ
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-2">
                ✨ गाँव कोई भी हो — मंच आपका है! सभी गाँवों के विद्यार्थी सादर आमंत्रित हैं।
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-2">
                📞 <strong>संपर्क:</strong> 9302428721, 9617125922
              </span>
              <span>•</span>
              <a 
                href="https://instagram.com/vande_matram_pariwar" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1.5 text-pink-300 font-bold hover:underline"
              >
                📸 Instagram: @vande_matram_pariwar
              </a>
              <span>•</span>
              <span className="inline-flex items-center gap-2 text-green-400 font-bold">
                ⚡ ऑनलाइन पंजीयन फॉर्म खुला है, तुरंत पंजीयन करें!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 HERO BANNER SECTION */}
      <section className="relative bg-gradient-to-b from-[#0F1C36] via-[#14213D] to-[#1A2E56] text-white overflow-hidden py-16 sm:py-24 lg:py-28">
        
        {/* Dynamic Glow Orbs Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-32 -left-32 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-[#FF9933]/25 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute -bottom-32 -right-32 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-[#138808]/20 rounded-full blur-[130px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-500/10 rounded-full blur-[150px]"></div>
          
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-60"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          
          {/* Floating decorative pills for desktop */}
          <div className="hidden lg:flex w-full justify-between items-center px-4 mb-2 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="animate-float inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-xs font-semibold text-orange-200 shadow-xl"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" /> भव्य प्रतिभा महोत्सव 2026
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="animate-float-delayed inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-xs font-semibold text-green-200 shadow-xl"
            >
              🇮🇳 राष्ट्र सर्वोपरि • युवा चेतना
            </motion.div>
          </div>

          {/* 🌟 Grand Highlighted Logo with Stationary Glow Animation */}
          <div className="relative mb-6 flex flex-col items-center">
            
            {/* Outer Stationary Pulsing Glow Aura */}
            <div className="absolute inset-0 w-32 h-32 sm:w-44 sm:h-44 -top-2 -left-2 sm:-top-3 sm:-left-3 m-auto rounded-full bg-gradient-to-tr from-[#FF9933]/50 via-white/20 to-[#138808]/40 blur-2xl animate-halo pointer-events-none"></div>

            {/* Stationary Tricolor Border Frame with Gentle Breathing Pulse */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ 
                scale: [1, 1.03, 1],
                opacity: 1
              }}
              transition={{ 
                scale: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
                opacity: { duration: 0.6 }
              }}
              className="relative p-1 sm:p-1.5 rounded-full bg-gradient-to-tr from-[#FF9933] via-yellow-200 to-[#138808] shadow-[0_0_35px_rgba(255,153,51,0.6)]"
            >
              {/* Inner dark border ring */}
              <div className="p-1 sm:p-1.5 bg-[#0F1C36] rounded-full">
                
                {/* Logo Image - Perfectly Stationary, Centered & Crisp */}
                <img 
                  src={logoImg} 
                  alt="वन्दे मातरम् परिवार लोगो" 
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-white/90 shadow-2xl" 
                />

              </div>
            </motion.div>

            {/* Organizer Title Pill */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="mt-3.5 inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-[#FF9933]/60 px-5 py-1.5 rounded-full shadow-lg"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF9933] shrink-0" />
              <p className="text-sm sm:text-base font-extrabold text-white tracking-wide">
                <span className="text-[#FF9933]">वन्दे मातरम्</span> परिवार, रेगवाँ
              </p>
              <span className="text-[10px] sm:text-xs bg-[#138808]/80 text-white font-bold px-2 py-0.5 rounded-full uppercase">
                आयोजक
              </span>
            </motion.div>

          </div>

          {/* Main Hero Title */}
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight mb-4 drop-shadow-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808]"
          >
            प्रतिभामंच 2026
          </motion.h1>

          {/* Tagline */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-[#FFFDF7] tracking-wider drop-shadow-md"
          >
            ज्ञान <span className="text-[#FF9933]">•</span> प्रतिभा <span className="text-white">•</span> प्रतियोगिता <span className="text-[#138808]">•</span> सम्मान
          </motion.p>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="text-base sm:text-lg text-gray-300 max-w-2xl mb-10 leading-relaxed font-normal"
          >
            <span className="text-[#FF9933] font-semibold">गाँव कोई भी हो — मंच आपका है!</span> अपनी प्रतिभा को पहचानें और एक बड़े मंच पर स्वयं को साबित करें।
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto mb-12"
          >
            <Link 
              to="/register" 
              className="w-full sm:w-auto group relative flex items-center justify-center gap-3 bg-gradient-to-r from-[#FF9933] via-orange-500 to-[#e68a2e] text-white px-9 py-4 rounded-full font-bold text-lg shadow-[0_10px_35px_rgba(255,153,51,0.45)] hover:shadow-[0_15px_45px_rgba(255,153,51,0.7)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                🔥 अभी पंजीयन करें <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 h-full w-full bg-white/25 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
            </Link>

            <a 
              href="#competitions" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 hover:bg-white text-white hover:text-[#14213D] border-2 border-white/40 hover:border-white px-8 py-4 rounded-full font-bold text-lg backdrop-blur-md hover:-translate-y-1 transition-all duration-300 shadow-lg"
            >
              <Trophy className="w-5 h-5 text-[#FF9933]" /> प्रतियोगिताएँ देखें
            </a>
          </motion.div>

          {/* Quick Info Grid Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-5xl"
          >
            {[
              {
                icon: <Calendar className="w-5 h-5 text-[#FF9933]" />,
                title: '7, 8 और 9 नवंबर',
                subtitle: '3 दिवसीय भव्य आयोजन'
              },
              {
                icon: <MapPin className="w-5 h-5 text-[#138808]" />,
                title: 'रेगवाँ (श्रीराम मंदिर)',
                subtitle: 'मुख्य मंच एवं परिसर'
              },
              {
                icon: <Users className="w-5 h-5 text-blue-400" />,
                title: 'कक्षा 1 से कॉलेज तक',
                subtitle: 'सभी विद्यार्थियों हेतु'
              },
              {
                icon: <Award className="w-5 h-5 text-yellow-400" />,
                title: 'आकर्षक पुरस्कार',
                subtitle: 'शानदार नकद राशि'
              }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center transition-all duration-300 hover:border-orange-400/50 hover:shadow-lg"
              >
                <div className="flex justify-center mb-2">{item.icon}</div>
                <h4 className="font-bold text-white text-sm sm:text-base">{item.title}</h4>
                <p className="text-gray-300 text-xs mt-0.5">{item.subtitle}</p>
              </div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* 🏆 KEY HIGHLIGHTS / WHY PARTICIPATE */}
      <section className="py-16 sm:py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-[#FF9933] font-extrabold text-sm uppercase tracking-widest bg-orange-50 border border-orange-200 px-4 py-1.5 rounded-full inline-block mb-3">
              ✨ विशेष आकर्षण
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#14213D]">
              प्रतिभामंच 2026 की मुख्य विशेषताएं
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#FF9933] via-orange-400 to-[#138808] mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <Sparkles className="w-8 h-8 text-[#FF9933]" />,
                title: 'मंच हर प्रतिभा के लिए',
                desc: 'शतरंज, प्रश्नोत्तरी, भाषण व अन्य रचनात्मक विधाओं में अपनी बौद्धिक व व्यावहारिक क्षमता दिखाएं।'
              },
              {
                icon: <ShieldCheck className="w-8 h-8 text-[#138808]" />,
                title: '100% निष्पक्ष मूल्यांकन',
                desc: 'वरिष्ठ एवं अनुभवी निर्णायकों की देखरेख में पारदर्शी और निष्पक्ष निर्णय प्रणाली।'
              },
              {
                icon: <CheckCircle2 className="w-8 h-8 text-blue-500" />,
                title: 'सरल पंजीयन',
                desc: 'ऑनलाइन फॉर्म के माध्यम से कुछ ही पलों में अपने मोबाइल से सरलतापूर्वक पंजीयन करें।'
              }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-[#F8F9FD] hover:bg-orange-50/50 p-6 sm:p-8 rounded-2xl border border-gray-100 hover:border-orange-200 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-5">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-[#14213D] mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ♟️ COMPETITIONS SECTION */}
      <section id="competitions" className="py-20 sm:py-24 bg-[#FFFDF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 sm:mb-20">
            <span className="text-[#FF9933] font-extrabold text-sm uppercase tracking-widest bg-orange-50 border border-orange-200 px-4 py-1.5 rounded-full inline-block mb-3">
              🎯 प्रतियोगिता सूची
            </span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold text-[#14213D] mb-4 relative inline-block"
            >
              प्रमुख प्रतियोगिताएं
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-28 h-1.5 bg-gradient-to-r from-[#FF9933] to-orange-500 rounded-full"></div>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-600 mt-6 font-medium max-w-2xl mx-auto"
            >
              गाँव कोई भी हो — मंच आपका है! किसी भी गाँव, स्कूल व कॉलेज के विद्यार्थी भाग ले सकते हैं।
            </motion.p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <Loader2 className="animate-spin h-14 w-14 text-[#FF9933]" />
                <div className="absolute inset-0 h-14 w-14 rounded-full border-4 border-orange-400 opacity-20"></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
              {competitions.map((comp, index) => (
                <motion.div 
                  key={comp._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_22px_45px_rgb(0,0,0,0.12)] overflow-hidden border border-gray-100 group relative flex flex-col justify-between"
                >
                  {/* Clean UI matching top border accent */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] to-orange-500"></div>
                  
                  <div className="p-7 sm:p-10 flex-grow">
                    <div className="flex flex-wrap justify-between items-start mb-5 gap-3">
                      <h3 className="text-2xl sm:text-3xl font-bold text-[#14213D] group-hover:text-[#FF9933] transition-colors duration-300 leading-tight">
                        {comp.name}
                      </h3>
                      {comp.entryFee === 0 ? (
                        <span className="bg-[#138808]/10 text-[#138808] text-xs sm:text-sm font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider border border-[#138808]/20 whitespace-nowrap shadow-sm">
                          Free Entry
                        </span>
                      ) : (
                        <span className="bg-[#FF9933]/15 text-[#FF9933] text-xs sm:text-sm font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider border border-[#FF9933]/30 whitespace-nowrap shadow-sm">
                          Entry: ₹{comp.entryFee}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 mb-6 text-base sm:text-lg leading-relaxed min-h-[48px]">{comp.description}</p>

                    {/* Booklet info for GK and KBC */}
                    {(comp.slug === 'gk-competition' || comp.slug === 'kbc' || comp.name?.includes('सामान्य ज्ञान') || comp.name?.includes('हजारपति')) && (
                      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start sm:items-center gap-3">
                        <span className="text-2xl shrink-0">📚</span>
                        <p className="text-amber-950 font-medium text-sm sm:text-base leading-snug">
                          <span className="font-extrabold text-orange-600">1500+ प्रश्नों की तैयारी पुस्तिका (Booklet)</span> प्रदान की जाएगी। परीक्षा में <span className="font-extrabold text-orange-600">60% प्रश्न</span> इसी पुस्तिका से पूछे जाएंगे।
                        </p>
                      </div>
                    )}

                    {/* Chess age info */}
                    {comp.slug === 'chess' && (
                      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center gap-3">
                        <span className="text-2xl shrink-0">♟️</span>
                        <p className="text-blue-900 font-semibold text-sm sm:text-base">
                          यह प्रतियोगिता <span className="text-blue-600 font-extrabold">25 वर्ष तक</span> के प्रतिभागियों के लिए है।
                        </p>
                      </div>
                    )}
                    
                    <div className="space-y-3.5 mb-8 bg-gray-50/80 p-5 sm:p-6 rounded-2xl border border-gray-100">
                      <div className="flex items-center text-[#14213D] font-medium text-sm sm:text-base">
                        <div className="w-9 h-9 rounded-full bg-[#FF9933]/15 flex items-center justify-center mr-3.5 shrink-0">
                          <Calendar className="w-4 h-4 text-[#FF9933]" />
                        </div>
                        <span>{comp.date} ({comp.time})</span>
                      </div>
                      <div className="flex items-center text-[#14213D] font-medium text-sm sm:text-base">
                        <div className="w-9 h-9 rounded-full bg-[#138808]/15 flex items-center justify-center mr-3.5 shrink-0">
                          <MapPin className="w-4 h-4 text-[#138808]" />
                        </div>
                        <span>{comp.venue}</span>
                      </div>
                      {comp.firstPrize && (
                        <div className="flex items-center text-[#14213D] font-bold text-sm sm:text-base">
                          <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center mr-3.5 shrink-0">
                            <Trophy className="w-4 h-4 text-yellow-600" />
                          </div>
                          <span>प्रथम पुरस्कार: {comp.firstPrize}</span>
                        </div>
                      )}
                      {comp.categories && comp.categories.length > 0 && (
                        <div className="flex items-start text-[#14213D] font-medium pt-1">
                          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center mr-3.5 shrink-0">
                            <Users className="w-4 h-4 text-blue-500" />
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-0.5">
                            {comp.categories.map((cat: string, i: number) => (
                              <span key={i} className="bg-white border border-gray-200 shadow-sm px-2.5 py-0.5 rounded-lg text-xs text-gray-700 font-medium">
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-7 sm:px-10 pb-7 sm:pb-10">
                    <Link 
                      to={`/register?competition=${comp._id}`}
                      className="group flex items-center justify-center gap-2 w-full text-center bg-[#14213D] text-white font-bold py-3.5 sm:py-4 rounded-xl hover:bg-[#FF9933] hover:shadow-[0_8px_25px_rgba(255,153,51,0.35)] hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-wider text-sm"
                    >
                      <span>इसमें पंजीयन करें</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 📞 HELP & DIRECT CONTACT CALLOUT */}
      <section className="bg-gradient-to-r from-[#14213D] via-[#1a2e56] to-[#14213D] text-white py-12 px-4 border-t-2 border-[#FF9933]">
        <div className="max-w-5xl mx-auto text-center flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-extrabold text-white mb-1">
              पंजीयन में कोई समस्या या प्रश्न है?
            </h3>
            <p className="text-gray-300 text-sm">
              सीधा संपर्क करें या व्हाट्सएप पर संदेश भेजें।
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <a 
              href="tel:9302428721" 
              className="inline-flex items-center gap-2 bg-[#FF9933] hover:bg-orange-500 text-gray-950 font-extrabold px-6 py-3 rounded-full shadow-lg transition-transform hover:-translate-y-0.5 text-sm"
            >
              <PhoneCall className="w-4 h-4" /> 9302428721
            </a>
            <a 
              href="tel:9617125922" 
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-[#14213D] font-extrabold px-6 py-3 rounded-full shadow-lg transition-transform hover:-translate-y-0.5 text-sm"
            >
              <PhoneCall className="w-4 h-4" /> 9617125922
            </a>
            <a 
              href="https://instagram.com/vande_matram_pariwar" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:opacity-95 text-white font-extrabold px-6 py-3 rounded-full shadow-lg transition-transform hover:-translate-y-0.5 text-sm"
            >
              <InstagramIcon className="w-4 h-4" /> @vande_matram_pariwar
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
