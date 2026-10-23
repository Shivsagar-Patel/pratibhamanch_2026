import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, CheckSquare, CreditCard, Banknote, QrCode } from 'lucide-react';
import logoImg from '../assets/logo.png';
import paymentQrImg from '../assets/payment-qr.jpg';

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
    paymentMode: 'cash', // 'cash' | 'online'
    utrNumber: '',
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

  // Calculate total entry fee for selected competitions
  const selectedComps = competitions.filter(c => selectedCompIds.includes(c._id));
  const totalFee = selectedComps.reduce((acc, c) => acc + (c.entryFee || 0), 0);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (selectedCompIds.length === 0) newErrors.competitions = 'कम से कम एक प्रतियोगिता चुनना अनिवार्य है';
    if (!formData.category) newErrors.category = 'श्रेणी (Category) चुनना अनिवार्य है';
    if (!formData.className.trim()) newErrors.className = 'कक्षा (Class) चुनना या दर्ज करना अनिवार्य है';
    if (!formData.participantName.trim()) newErrors.participantName = 'प्रतिभागी का नाम अनिवार्य है';
    if (!formData.fatherName.trim()) newErrors.fatherName = 'पिता का नाम अनिवार्य है';
    if (!formData.village.trim()) newErrors.village = 'गाँव का नाम अनिवार्य है';
    if (!/^[0-9]{10}$/.test(formData.mobile)) newErrors.mobile = 'सही 10 अंकों का मोबाइल नंबर दर्ज करना अनिवार्य है';
    if (!formData.studentStatus) newErrors.studentStatus = 'विद्यार्थी होने की पुष्टि करना अनिवार्य है';

    if (totalFee > 0 && formData.paymentMode === 'online') {
      if (!formData.utrNumber.trim()) {
        newErrors.utrNumber = 'कृपया UPI भुगतान के बाद प्राप्त 12 अंकों का UTR / Transaction ID दर्ज करें';
      } else if (formData.utrNumber.trim().length < 6) {
        newErrors.utrNumber = 'कृपया सही UTR / Transaction ID दर्ज करें';
      }
    }

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
            {errors.category && <p className="text-red-500 text-sm mt-1.5">{errors.category}</p>}
          </div>

          {/* Class Selection based on category */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">कक्षा चुनें *</label>
            {classOptions ? (
              <>
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
              </>
            ) : (
              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 text-sm">
                पहले ऊपर से <strong>Category</strong> चुनें, जिसके बाद कक्षा के विकल्प दिखेंगे।
              </div>
            )}
            {errors.className && <p className="text-red-500 text-sm mt-1">{errors.className}</p>}
          </div>

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

          {/* Payment Section - Only show if at least one competition is selected */}
          {selectedCompIds.length > 0 && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-gray-800 font-bold text-base flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-orange-600" />
                  प्रवेश शुल्क एवं भुगतान विकल्प (Payment Option)
                </label>
                {totalFee > 0 ? (
                  <span className="text-base font-extrabold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
                    कुल शुल्क: ₹{totalFee}
                  </span>
                ) : (
                  <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                    निःशुल्क (Free Entry)
                  </span>
                )}
              </div>

              {totalFee > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Option 1: Cash at Venue */}
                    <label
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                        formData.paymentMode === 'cash'
                          ? 'border-orange-500 bg-orange-50 text-orange-950 shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMode"
                        value="cash"
                        checked={formData.paymentMode === 'cash'}
                        onChange={() => setFormData(prev => ({ ...prev, paymentMode: 'cash', utrNumber: '' }))}
                        className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                      />
                      <div>
                        <div className="font-bold flex items-center gap-1.5 text-sm">
                          <Banknote className="w-4 h-4 text-amber-600" />
                          नकद भुगतान (Cash)
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">कार्यक्रम स्थल पर नकद जमा करें</div>
                      </div>
                    </label>

                    {/* Option 2: Online UPI (PhonePe QR) */}
                    <label
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                        formData.paymentMode === 'online'
                          ? 'border-orange-500 bg-orange-50 text-orange-950 shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMode"
                        value="online"
                        checked={formData.paymentMode === 'online'}
                        onChange={() => setFormData(prev => ({ ...prev, paymentMode: 'online' }))}
                        className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                      />
                      <div>
                        <div className="font-bold flex items-center gap-1.5 text-sm">
                          <QrCode className="w-4 h-4 text-purple-600" />
                          ऑनलाइन भुगतान (PhonePe / UPI QR)
                        </div>
                        <div className="text-xs text-purple-700 font-semibold mt-0.5">QR स्कैन कर तुरंत भुगतान करें</div>
                      </div>
                    </label>
                  </div>

                  {/* If Online is chosen, show PhonePe QR Card & UTR Input */}
                  {formData.paymentMode === 'online' && (
                    <div className="bg-gradient-to-b from-purple-50/60 to-white border-2 border-purple-200 rounded-2xl p-5 space-y-4">
                      <div className="text-center space-y-1">
                        <span className="inline-block px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                          PhonePe / Any UPI App
                        </span>
                        <h3 className="text-lg font-extrabold text-gray-900">QR कोड स्कैन करके भुगतान करें</h3>
                        <p className="text-xs text-gray-600">
                          PhonePe, Google Pay, Paytm या किसी भी UPI ऐप से भुगतान किया जा सकता है।
                        </p>
                      </div>

                      {/* QR Code Image Container */}
                      <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-purple-100 shadow-sm max-w-xs mx-auto">
                        <img
                          src={paymentQrImg}
                          alt="PhonePe QR Code - Shivsagar Patel"
                          className="w-56 sm:w-60 h-auto rounded-xl shadow-xs border border-gray-100"
                        />
                        <div className="mt-3 text-center">
                          <p className="text-xs font-bold text-gray-800">SHIVSAGAR PATEL</p>
                          <p className="text-sm font-black text-purple-700 mt-0.5">देय राशि: ₹{totalFee}</p>
                        </div>
                      </div>

                      {/* UTR / Transaction ID Input Field */}
                      <div className="max-w-md mx-auto pt-2">
                        <label className="block text-xs font-extrabold text-gray-800 uppercase tracking-wide mb-1.5">
                          UPI Transaction ID / UTR नंबर दर्ज करें *
                        </label>
                        <input
                          type="text"
                          value={formData.utrNumber}
                          onChange={e => setFormData(prev => ({ ...prev, utrNumber: e.target.value.trim() }))}
                          placeholder="उदा. 4289XXXXXXXX (12 अंकों का UTR)"
                          className="w-full px-4 py-3 border-2 border-purple-300 focus:border-purple-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 font-mono font-bold text-gray-900 bg-white"
                        />
                        {errors.utrNumber && (
                          <p className="text-red-500 text-xs font-semibold mt-1">{errors.utrNumber}</p>
                        )}
                        <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
                          💡 भुगतान सफल होने पर बैंक मैसेज या UPI ऐप (PhonePe / GPay) में 12 अंकों का <strong className="text-gray-700">UTR / UPI Ref No.</strong> दिखाई देगा, उसे यहाँ दर्ज करें। आयोजक इसे सत्यापित कर स्टेटस अपडेट करेंगे।
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600">
                  चयनित प्रतियोगिताओं के लिए कोई प्रवेश शुल्क नहीं है।
                </div>
              )}
            </div>
          )}

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
