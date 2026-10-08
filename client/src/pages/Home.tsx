import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Trophy, Users, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-600 to-yellow-500 text-white overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-md"
          >
            प्रतिभामंच 2026
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-3xl font-medium mb-4 text-yellow-100"
          >
            ज्ञान • प्रतिभा • प्रतियोगिता • सम्मान
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl mb-10 text-orange-100"
          >
            आयोजक: <span className="font-bold text-white">वन्दे मातरम् परिवार, रेगवां</span>
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/register" className="bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-gray-100 hover:scale-105 transition transform">
              अभी पंजीयन करें
            </Link>
            <a href="#competitions" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-orange-600 transition">
              प्रतियोगिताएँ देखें
            </a>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-yellow-300 rounded-full mix-blend-overlay filter blur-3xl"></div>
        </div>
      </section>

      {/* Competitions Section */}
      <section id="competitions" className="py-20 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">प्रमुख प्रतियोगिताएं</h2>
            <p className="text-lg text-gray-600">गाँव कोई भी हो — मंच आपका है! किसी भी गाँव के विद्यार्थी भाग ले सकते हैं।</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="animate-spin h-10 w-10 text-orange-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {competitions.map((comp) => (
                <motion.div 
                  key={comp._id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100"
                >
                  <div className="p-1 bg-gradient-to-r from-orange-400 to-yellow-400"></div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-gray-900">{comp.name}</h3>
                      {comp.entryFee === 0 ? (
                        <span className="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full">Free</span>
                      ) : (
                        <span className="bg-orange-100 text-orange-800 text-sm font-bold px-3 py-1 rounded-full">Entry: ₹{comp.entryFee}</span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-6 min-h-[48px]">{comp.description}</p>
                    
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="w-5 h-5 mr-3 text-orange-500" />
                        <span>{comp.date} ({comp.time})</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <MapPin className="w-5 h-5 mr-3 text-orange-500" />
                        <span>{comp.venue}</span>
                      </div>
                      {comp.firstPrize && (
                        <div className="flex items-center text-gray-700 font-semibold">
                          <Trophy className="w-5 h-5 mr-3 text-yellow-500" />
                          <span>प्रथम पुरस्कार: {comp.firstPrize}</span>
                        </div>
                      )}
                      <div className="flex items-start text-gray-700">
                        <Users className="w-5 h-5 mr-3 text-orange-500 mt-1" />
                        <div>
                          {comp.categories.map((cat: string, i: number) => (
                            <span key={i} className="block text-sm bg-gray-100 px-2 py-1 rounded mt-1">{cat}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <Link 
                      to={`/register?competition=${comp._id}`}
                      className="block w-full text-center bg-orange-100 text-orange-700 font-bold py-3 rounded-lg hover:bg-orange-600 hover:text-white transition"
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
