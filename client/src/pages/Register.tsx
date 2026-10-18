import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, CheckSquare } from 'lucide-react';
import logoImg from '../assets/logo.png';

// Class options based on category
const CLASS_OPTIONS: Record<string, string[]> = {
  '1st to 8th': ['कक्षा 1', 'कक्षा 2', 'कक्षा 3', 'कक्षा 4', 'कक्षा 5', 'कक्षा 6', 'कक्षा 7', 'कक्षा 8'],
  '9th to College': ['कक्षा 9', 'कक्षा 10', 'कक्षा 11', 'कक्षा 12', '1st Year (College)', '2nd Year (College)', '3rd Year (College)', '4th Year (College)'],
};

const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedCompIds, setSelectedCompIds] = useState<string[]>(() => {
    const preselected = searchParams.get('competition');
    return preselected ? [preselected] : [];
  });

  const [formData, setFormData] = useState({
    participantName: '',
    fatherName: '',
    village: '',
    className: '',
    mobile: '',
    studentStatus: false,
    category: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const fetchCompetitions = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${apiUrl}/api/competitions`);
        const activeComps = res.data.filter((c: any) => c.isActive && c.registrationOpen);
        setCompetitions(activeComps);
      } catch (error) {
        toast.error('प्रतियोगिताओं की जानकारी लोड नहीं हो सकी');
      } finally {
        setLoading(false);
      }
    };
    fetchCompetitions();
  }, []);

  const toggleCompetition = (id: string) => {
    setSelectedCompIds(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
    // Reset category and class when competition changes
    setFormData(prev => ({ ...prev, category: '', className: '' }));
  };

  const handleCategoryChange = (cat: string) => {
    setFormData(prev => ({ ...prev, category: cat, className: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (selectedCompIds.length === 0) newErrors.competitions = 'कम से कम एक प्रतियोगिता चुनें';
    if (!formData.participantName.trim()) newErrors.participantName = 'प्रतिभागी का नाम अनिवार्य है';
    if (!formData.fatherName.trim()) newErrors.fatherName = 'पिता का नाम अनिवार्य है';
    if (!formData.village.trim()) newErrors.village = 'गाँव का नाम अनिवार्य है';
    if (!/^[0-9]{10}$/.test(formData.mobile)) newErrors.mobile = 'सही 10 अंकों का मोबाइल नंबर दर्ज करें';
    if (!formData.studentStatus) newErrors.studentStatus = 'विद्यार्थी होना अनिवार्य है';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiUrl}/api/participants/register`, {
        competitionIds: selectedCompIds,
        ...formData,
      });
      toast.success('पंजीयन सफल हुआ!');
      navigate(`/receipt/${res.data.participant._id}`, { state: res.data });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'पंजीयन में त्रुटि हुई।');
    } finally {
      setSubmitting(false);
    }
  };

  // Class options depend on category
  const classOptions = formData.category ? CLASS_OPTIONS[formData.category] || null : null;

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-orange-600" /></div>;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#14213D] py-6 px-8 text-center text-white">
          <div className="flex items-center justify-center gap-4 mb-3">
            <img src={logoImg} alt="वन्दे मातरम् परिवार" className="h-16 w-16 rounded-full object-cover border-2 border-[#FF9933]" />
            <div className="text-left">
              <p className="text-[#FF9933] font-bold text-base leading-tight">वन्दे मातरम् परिवार, रेगवाँ</p>
              <p className="text-white/70 text-xs">राष्ट्र सर्वोपरि</p>
            </div>
          </div>
          <h1 className="text-3xl font-bold">प्रतिभागी पंजीयन फॉर्म</h1>
          <p className="mt-1 text-orange-200">प्रतिभामंच 2026 में आपका स्वागत है</p>
        </div>
        
        <form onSubmit={onSubmit} className="p-8 space-y-6">

          {/* Multiple Competition Selection */}
          <div>
            <label className="block text-gray-700 font-semibold mb-3">
              प्रतियोगिता चुनें * <span className="text-gray-400 font-normal text-sm">(एक या अधिक चुन सकते हैं)</span>
            </label>
            <div className="space-y-3">
              {competitions.map(comp => (
                <label
                  key={comp._id}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    selectedCompIds.includes(comp._id)
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedCompIds.includes(comp._id)}
                    onChange={() => toggleCompetition(comp._id)}
                    className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-gray-800">{comp.name}</span>
                    {comp.entryFee > 0 && (
                      <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                        ₹{comp.entryFee}
                      </span>
                    )}
                    {comp.entryFee === 0 && (
                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        Free
                      </span>
                    )}
                  </div>
                  {selectedCompIds.includes(comp._id) && (
                    <CheckSquare className="w-5 h-5 text-orange-500 shrink-0" />
                  )}
                </label>
              ))}
            </div>
            {errors.competitions && <p className="text-red-500 text-sm mt-1">{errors.competitions}</p>}
          </div>

          {/* Category Selection (1st-8th or 9th-College) */}
          <div>
            <label className="block text-gray-700 font-semibold mb-3">
              Category *
            </label>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(CLASS_OPTIONS).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`py-4 px-4 rounded-xl border-2 font-semibold text-sm transition-all duration-200 ${
                    formData.category === cat
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 text-gray-600 hover:border-orange-300 hover:bg-orange-50/40'
                  }`}
                >
                  <div className="text-lg mb-1">{cat === '1st to 8th' ? '📚' : '🎓'}</div>
                  <div>{cat === '1st to 8th' ? 'कक्षा 1 से 8' : 'कक्षा 9 से कॉलेज'}</div>
                  <div className="text-xs text-gray-500 mt-1">({cat})</div>
                </button>
              ))}
            </div>
          </div>

          {/* Class Selection based on category */}
          {classOptions && (
            <div>
              <label className="block text-gray-700 font-semibold mb-2">कक्षा चुनें *</label>
              <select
                value={classOptions.includes(formData.className) ? formData.className : (formData.className ? '__manual__' : '')}
                onChange={e => {
                  if (e.target.value === '__manual__') {
                    setFormData(prev => ({ ...prev, className: '' }));
                  } else {
                    setFormData(prev => ({ ...prev, className: e.target.value }));
                  }
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 mb-2"
              >
                <option value="">-- कक्षा चुनें --</option>
                {classOptions.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
                <option value="__manual__">✏️ मैन्युअल टाइप करें (अन्य)</option>
              </select>
              {/* Manual class input */}
              {(!classOptions.includes(formData.className)) && (
                <input
                  type="text"
                  value={formData.className}
                  onChange={e => setFormData(prev => ({ ...prev, className: e.target.value }))}
                  placeholder="कक्षा लिखें जैसे: 5th, BA 2nd Year, आदि"
                  className="w-full border border-orange-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-orange-50"
                />
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">प्रतिभागी का नाम *</label>
              <input
                type="text"
                value={formData.participantName}
                onChange={e => setFormData(prev => ({ ...prev, participantName: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="पूरा नाम"
              />
              {errors.participantName && <p className="text-red-500 text-sm mt-1">{errors.participantName}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2">पिता का नाम *</label>
              <input
                type="text"
                value={formData.fatherName}
                onChange={e => setFormData(prev => ({ ...prev, fatherName: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.fatherName && <p className="text-red-500 text-sm mt-1">{errors.fatherName}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">गाँव का नाम *</label>
              <input
                type="text"
                value={formData.village}
                onChange={e => setFormData(prev => ({ ...prev, village: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.village && <p className="text-red-500 text-sm mt-1">{errors.village}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">मोबाइल नंबर *</label>
              <input
                type="text"
                value={formData.mobile}
                onChange={e => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                maxLength={10}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="10 अंकों का नंबर"
              />
              {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
            </div>
          </div>

          <div className="mt-6 border-t pt-6">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.studentStatus}
                onChange={e => setFormData(prev => ({ ...prev, studentStatus: e.target.checked }))}
                className="mt-1 h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <span className="text-gray-700 font-medium">
                "मैं पुष्टि करता/करती हूँ कि मैं विद्यार्थी हूँ और दी गई जानकारी सही है।" *
              </span>
            </label>
            {errors.studentStatus && <p className="text-red-500 text-sm mt-1 ml-8">{errors.studentStatus}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-4 rounded-lg font-bold text-white text-lg transition ${submitting ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 shadow-lg'}`}
          >
            {submitting ? (
              <span className="flex items-center justify-center"><Loader2 className="animate-spin mr-2" /> सबमिट कर रहे हैं...</span>
            ) : 'पंजीयन सबमिट करें'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Register;
