import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Trophy, Users, Loader2, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRules, setExpandedRules] = useState<Record<string, boolean>>({});

  const toggleRules = (id: string) => {
    setExpandedRules(prev => ({ ...prev, [id]: !prev[id] }));
  };

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
    <div className="font-sans">
      {/* Hero Section */}
      <section className="relative bg-[#14213D] text-white overflow-hidden py-24 lg:py-36">
        {/* Tricolor Background effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] bg-[#FF9933] rounded-full mix-blend-screen filter blur-[140px] opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-[20%] -right-[10%] w-[800px] h-[800px] bg-[#138808] rounded-full mix-blend-screen filter blur-[140px] opacity-20"></div>
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdHRlcm4gaWQ9InNtYWxsR3JpZCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMTAgMEwwIDBMMCAxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvcGF0dGVybj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9InVybCgjc21hbGxHcmlkKSIvPjxwYXRoIGQ9Ik00MCAwTDAgMEwwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
          <motion.div
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.6 }}
             className="mb-10 inline-block border-b-2 border-t-2 border-[#FF9933]/60 py-3 px-8 rounded-2xl bg-white/5 backdrop-blur-md shadow-2xl"
          >
             <p className="text-xl md:text-2xl font-bold tracking-wide text-white">
               आयोजक: <span className="text-[#FF9933] drop-shadow-md">वन्दे मातरम्</span> <span className="text-white drop-shadow-md">परिवार,</span> <span className="text-[#138808] drop-shadow-md">रेगवां</span>
             </p>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tight mb-6 drop-shadow-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-[#FFFDF7] to-[#138808]"
          >
            प्रतिभामंच 2026
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl md:text-4xl font-semibold mb-12 text-[#FFFDF7]/90 drop-shadow-lg tracking-wide"
          >
            ज्ञान • प्रतिभा • प्रतियोगिता • सम्मान
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-6 w-full sm:w-auto"
          >
            <Link to="/register" className="group relative flex justify-center items-center bg-gradient-to-r from-[#FF9933] to-[#e68a2e] text-white px-10 py-4 rounded-full font-bold text-xl shadow-[0_10px_30px_rgba(255,153,51,0.4)] hover:shadow-[0_15px_40px_rgba(255,153,51,0.6)] hover:-translate-y-1 transition-all transform duration-300 overflow-hidden">
              <span className="relative z-10">अभी पंजीयन करें</span>
              <div className="absolute inset-0 h-full w-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
            </Link>
            <a href="#competitions" className="flex justify-center items-center bg-transparent border-2 border-white/60 text-white px-10 py-4 rounded-full font-bold text-xl hover:bg-white hover:text-[#14213D] hover:border-white transition-all duration-300 backdrop-blur-sm">
              प्रतियोगिताएँ देखें
            </a>
          </motion.div>
        </div>
      </section>

      {/* Competitions Section */}
      <section id="competitions" className="py-24 bg-[#FFFDF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold text-[#14213D] mb-6 relative inline-block"
            >
              प्रमुख प्रतियोगिताएं
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-[#FF9933] via-gray-300 to-[#138808] rounded-full"></div>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 mt-8 font-medium max-w-2xl mx-auto"
            >
              गाँव कोई भी हो — मंच आपका है! किसी भी गाँव के विद्यार्थी भाग ले सकते हैं।
            </motion.p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <Loader2 className="animate-spin h-14 w-14 text-[#FF9933]" />
                <div className="absolute inset-0 h-14 w-14 rounded-full border-4 border-[#138808] opacity-20"></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {competitions.map((comp, index) => (
                <motion.div 
                  key={comp._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] overflow-hidden border border-gray-100 group relative"
                >
                  {/* Tricolor top border accent */}
                  <div className="h-2.5 w-full bg-gradient-to-r from-[#FF9933] via-[#FFFDF7] to-[#138808]"></div>
                  
                  <div className="p-8 md:p-10">
                    <div className="flex flex-wrap justify-between items-start mb-6 gap-4">
                      <h3 className="text-3xl font-bold text-[#14213D] group-hover:text-[#FF9933] transition-colors duration-300 leading-tight">
                        {comp.name}
                      </h3>
                      {comp.entryFee === 0 ? (
                        <span className="bg-[#138808]/10 text-[#138808] text-sm font-extrabold px-5 py-2 rounded-full uppercase tracking-wider border border-[#138808]/20 whitespace-nowrap">
                          Free Entry
                        </span>
                      ) : (
                        <span className="bg-[#FF9933]/10 text-[#FF9933] text-sm font-extrabold px-5 py-2 rounded-full uppercase tracking-wider border border-[#FF9933]/20 whitespace-nowrap">
                          Entry: ₹{comp.entryFee}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-8 text-lg leading-relaxed min-h-[56px]">{comp.description}</p>
                    
                    <div className="space-y-4 mb-8 bg-gray-50/80 p-6 rounded-2xl border border-gray-100">
                      <div className="flex items-center text-[#14213D] font-medium">
                        <div className="w-10 h-10 rounded-full bg-[#FF9933]/10 flex items-center justify-center mr-4 shrink-0">
                          <Calendar className="w-5 h-5 text-[#FF9933]" />
                        </div>
                        <span className="text-[1.05rem]">{comp.date} ({comp.time})</span>
                      </div>
                      <div className="flex items-center text-[#14213D] font-medium">
                        <div className="w-10 h-10 rounded-full bg-[#138808]/10 flex items-center justify-center mr-4 shrink-0">
                          <MapPin className="w-5 h-5 text-[#138808]" />
                        </div>
                        <span className="text-[1.05rem]">{comp.venue}</span>
                      </div>
                      {comp.firstPrize && (
                        <div className="flex items-center text-[#14213D] font-bold">
                          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-4 shrink-0">
                            <Trophy className="w-5 h-5 text-yellow-600" />
                          </div>
                          <span className="text-[1.05rem]">प्रथम पुरस्कार: {comp.firstPrize}</span>
                        </div>
                      )}
                      <div className="flex items-start text-[#14213D] font-medium pt-1">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-4 shrink-0">
                          <Users className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {comp.categories.map((cat: string, i: number) => (
                            <span key={i} className="bg-white border border-gray-200 shadow-sm px-3 py-1 rounded-lg text-sm text-gray-700 font-medium">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Rules & Info Expand Button */}
                    <div className="mb-8">
                      <button 
                        onClick={() => toggleRules(comp._id)}
                        className="flex items-center justify-between w-full px-5 py-3 bg-[#14213D]/5 hover:bg-[#14213D]/10 text-[#14213D] rounded-xl font-bold transition-colors"
                      >
                        <span className="flex items-center">
                          <Info className="w-5 h-5 mr-3 text-[#FF9933]" />
                          नियम और अतिरिक्त जानकारी
                        </span>
                        {expandedRules[comp._id] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>

                      {/* Expanded Content */}
                      {expandedRules[comp._id] && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="overflow-hidden mt-4 bg-white border border-gray-100 rounded-xl p-6 shadow-inner"
                        >
                          {comp.rules && comp.rules.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-bold text-[#14213D] mb-3 border-b pb-2">सामान्य नियम:</h4>
                              <ul className="list-disc pl-5 space-y-2 text-gray-700 text-[0.95rem]">
                                {comp.rules.map((rule: string, i: number) => (
                                  <li key={i}>{rule}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {comp.slug === 'kbc' && (
                            <div className="mt-8 border-t-2 border-gray-100 pt-6">
                              <h4 className="font-extrabold text-[#14213D] text-xl mb-4 text-center">
                                <span className="text-[#FF9933]">कौन बनेगा</span> हजार पति
                              </h4>
                              
                              <div className="overflow-x-auto mb-6 rounded-lg border border-gray-200 shadow-sm">
                                <table className="w-full text-sm text-left border-collapse">
                                  <thead>
                                    <tr className="bg-[#14213D] text-white">
                                      <th className="px-4 py-3 font-semibold text-center border-r border-[#2a3b61]">सवाल</th>
                                      <th className="px-4 py-3 font-semibold text-center border-r border-[#2a3b61]">राशि</th>
                                      <th className="px-4 py-3 font-semibold text-center">स्तर</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {[
                                      { q: 12, amount: '₹2,100', level: '🏆 Jackpot', style: 'bg-yellow-100 font-bold text-yellow-800 border-b-2 border-yellow-300' },
                                      { q: 11, amount: '₹1,600', level: 'बहुत कठिन', style: 'bg-white' },
                                      { q: 10, amount: '₹1,200', level: 'कठिन', style: 'bg-gray-50' },
                                      { q: 9, amount: '₹800', level: 'कठिन', style: 'bg-white' },
                                      { q: 8, amount: '₹500', level: 'मध्यम-कठिन', style: 'bg-gray-50' },
                                      { q: 7, amount: '₹300', level: 'मध्यम', style: 'bg-white' },
                                      { q: 6, amount: '₹200', level: 'मध्यम', style: 'bg-gray-50' },
                                      { q: 5, amount: '₹100', level: '🔒 सुरक्षित स्तर', style: 'bg-green-100 font-bold text-green-800 border-y-2 border-green-300' },
                                      { q: 4, amount: '₹50', level: 'आसान-मध्यम', style: 'bg-white' },
                                      { q: 3, amount: '₹30', level: 'आसान', style: 'bg-gray-50' },
                                      { q: 2, amount: '₹20', level: 'आसान', style: 'bg-white' },
                                      { q: 1, amount: '₹10', level: 'आसान', style: 'bg-gray-50' },
                                    ].map((row) => (
                                      <tr key={row.q} className={`border-b border-gray-200 text-center ${row.style}`}>
                                        <td className="px-4 py-2 border-r border-gray-200">Q{row.q}</td>
                                        <td className="px-4 py-2 border-r border-gray-200 text-[#138808] font-semibold">{row.amount}</td>
                                        <td className="px-4 py-2">{row.level}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>

                              <h4 className="font-bold text-[#14213D] mb-3 border-b pb-2">लाइफलाइन (Lifelines):</h4>
                              <ul className="list-decimal pl-5 space-y-2 text-gray-700 text-[0.95rem] mb-6">
                                <li><strong className="text-[#FF9933]">50–50:</strong> चार विकल्पों में से दो गलत विकल्प हटा दिए जाएँगे।</li>
                                <li><strong className="text-[#FF9933]">Audience Poll:</strong> हॉल में बैठे दर्शक हाथ उठाकर/कार्ड के माध्यम से अपना जवाब देंगे।</li>
                                <li><strong className="text-[#FF9933]">Ask an Expert:</strong> आयोजकों द्वारा पहले से तय किसी शिक्षक/विशेषज्ञ से मदद ली जा सकती है।</li>
                                <li><strong className="text-[#FF9933]">Flip the Question:</strong> प्रतिभागी चाहे तो सवाल बदल सकता है। (केवल एक बार)</li>
                              </ul>

                              <h4 className="font-bold text-[#14213D] mb-3 border-b pb-2">खेल के नियम:</h4>
                              <ul className="list-disc pl-5 space-y-2 text-gray-700 text-[0.95rem]">
                                <li>हर lifeline केवल एक बार इस्तेमाल हो सकती है।</li>
                                <li>प्रतिभागी चाहे तो सवाल का जवाब देने से पहले <strong>Quit</strong> कर सकता है और उस समय तक जीती हुई राशि लेकर जा सकता है।</li>
                                <li>अगर जवाब <strong>Lock</strong> करने के बाद गलत हुआ, तो वह पिछले <strong>Safe Level</strong> पर चला जाएगा।
                                  <br/><span className="text-sm text-red-600 mt-1 block bg-red-50 p-2 rounded">उदाहरण: ₹500 तक पहुँचा → Q9 गलत → वापस ₹100 पर।</span>
                                </li>
                              </ul>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                    
                    <Link 
                      to={`/register?competition=${comp._id}`}
                      className="block w-full text-center bg-[#14213D] text-white font-bold py-4 rounded-xl hover:bg-[#FF9933] hover:shadow-[0_8px_20px_rgba(255,153,51,0.3)] hover:-translate-y-1 transition-all duration-300 uppercase tracking-wider text-sm"
                    >
                      इसमें पंजीयन करें
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
