import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { 
  Trophy, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Award
} from 'lucide-react';
import logoImg from '../../assets/logo.png';

interface Competition {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  date?: string;
  time?: string;
  venue?: string;
  entryFee?: number;
  firstPrize?: string;
  secondPrize?: string;
  categories?: string[];
  rules?: string[];
  isActive?: boolean;
  registrationOpen?: boolean;
  createdAt?: string;
}

const CompetitionsManagement = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingComp, setEditingComp] = useState<Competition | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    date: '7, 8, 9 नवंबर 2026',
    time: 'प्रातः 10:00 बजे',
    venue: 'श्रीराम मंदिर के सामने, रेगवां',
    entryFee: 30,
    firstPrize: '',
    secondPrize: '',
    categories: 'कक्षा 1 से 8, कक्षा 9 से कॉलेज',
    rules: '',
    isActive: true,
    registrationOpen: true,
  });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      const token = Cookies.get('adminToken');
      const res = await axios.get(`${apiUrl}/api/admin/competitions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompetitions(res.data);
    } catch (error) {
      toast.error('प्रतियोगिताएं लोड करने में विफल');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setForm({
      name: '',
      slug: '',
      description: '',
      date: '7, 8, 9 नवंबर 2026',
      time: 'प्रातः 10:00 बजे',
      venue: 'श्रीराम मंदिर के सामने, रेगवां',
      entryFee: 30,
      firstPrize: 'नकद पुरस्कार',
      secondPrize: '',
      categories: 'कक्षा 1 से 8, कक्षा 9 से कॉलेज',
      rules: '1. सभी प्रतिभागियों को निर्धारित समय से 30 मिनट पूर्व उपस्थित होना अनिवार्य है।\n2. पहचान पत्र साथ लाना अनिवार्य है।',
      isActive: true,
      registrationOpen: true,
    });
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (comp: Competition) => {
    setEditingComp(comp);
    setForm({
      name: comp.name || '',
      slug: comp.slug || '',
      description: comp.description || '',
      date: comp.date || '7, 8, 9 नवंबर 2026',
      time: comp.time || '',
      venue: comp.venue || 'श्रीराम मंदिर के सामने, रेगवां',
      entryFee: comp.entryFee !== undefined ? comp.entryFee : 30,
      firstPrize: comp.firstPrize || '',
      secondPrize: comp.secondPrize || '',
      categories: Array.isArray(comp.categories) ? comp.categories.join(', ') : '',
      rules: Array.isArray(comp.rules) ? comp.rules.join('\n') : '',
      isActive: comp.isActive !== undefined ? comp.isActive : true,
      registrationOpen: comp.registrationOpen !== undefined ? comp.registrationOpen : true,
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('कृपया प्रतियोगिता का नाम दर्ज करें');
      return;
    }

    setSubmitting(true);
    try {
      const token = Cookies.get('adminToken');
      const payload = {
        ...form,
        entryFee: Number(form.entryFee) || 0,
        categories: form.categories.split(',').map(c => c.trim()).filter(Boolean),
        rules: form.rules.split('\n').map(r => r.trim()).filter(Boolean)
      };

      const res = await axios.post(`${apiUrl}/api/admin/competitions`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('प्रतियोगिता सफलतापूर्वक जोड़ी गई!');
      setCompetitions(prev => [...prev, res.data.competition]);
      setIsCreateOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'जोड़ने में त्रुटि हुई');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComp) return;
    if (!form.name.trim()) {
      toast.error('कृपया प्रतियोगिता का नाम दर्ज करें');
      return;
    }

    setSubmitting(true);
    try {
      const token = Cookies.get('adminToken');
      const payload = {
        ...form,
        entryFee: Number(form.entryFee) || 0,
        categories: form.categories.split(',').map(c => c.trim()).filter(Boolean),
        rules: form.rules.split('\n').map(r => r.trim()).filter(Boolean)
      };

      const res = await axios.put(`${apiUrl}/api/admin/competitions/${editingComp._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('प्रतियोगिता सफलतापूर्वक अपडेट की गई!');
      setCompetitions(prev => prev.map(c => c._id === editingComp._id ? res.data.competition : c));
      setEditingComp(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'अपडेट में त्रुटि हुई');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (comp: Competition) => {
    if (!window.confirm(`क्या आप सचमुच "${comp.name}" प्रतियोगिता को हटाना चाहते हैं?`)) {
      return;
    }

    setDeletingId(comp._id);
    try {
      const token = Cookies.get('adminToken');
      await axios.delete(`${apiUrl}/api/admin/competitions/${comp._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('प्रतियोगिता हटा दी गई');
      setCompetitions(prev => prev.filter(c => c._id !== comp._id));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'हटाने में त्रुटि हुई');
    } finally {
      setDeletingId(null);
    }
  };

  const toggleStatus = async (comp: Competition, field: 'isActive' | 'registrationOpen') => {
    try {
      const token = Cookies.get('adminToken');
      const updatedValue = !comp[field];
      const res = await axios.put(`${apiUrl}/api/admin/competitions/${comp._id}`, {
        [field]: updatedValue
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(field === 'isActive' 
        ? `प्रतियोगिता ${updatedValue ? 'सक्रिय' : 'निष्क्रिय'} की गई` 
        : `पंजीकरण ${updatedValue ? 'चालू' : 'बंद'} किया गया`
      );
      setCompetitions(prev => prev.map(c => c._id === comp._id ? res.data.competition : c));
    } catch (error) {
      toast.error('स्थिति बदलने में त्रुटि हुई');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-1 rounded-full bg-gradient-to-tr from-[#FF9933] to-[#138808] shadow-md shrink-0">
            <img src={logoImg} alt="Logo" className="w-11 h-11 rounded-full object-cover border-2 border-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] leading-tight">
              प्रतियोगिता प्रबंधन
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              वन्दे मातरम् परिवार • कुल प्रतियोगिताएं: {competitions.length}
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-gradient-to-r from-[#FF9933] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-2.5 rounded-xl flex items-center justify-center font-bold text-sm shadow-md hover:shadow-orange-500/25 transition self-start sm:self-auto gap-2"
        >
          <Plus className="w-4 h-4" /> नई प्रतियोगिता जोड़ें
        </button>
      </div>

      {/* Competitions Table / Card Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-500">
            <Loader2 className="animate-spin w-8 h-8 text-[#FF9933] mr-2" />
            <span>लोड हो रहा है...</span>
          </div>
        ) : competitions.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-700">कोई प्रतियोगिता मौजूद नहीं है</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">नई प्रतियोगिता जोड़ने के लिए ऊपर दिए बटन पर क्लिक करें।</p>
            <button
              onClick={handleOpenCreate}
              className="bg-[#FF9933] hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold"
            >
              + अभी जोड़ें
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
                  <th className="p-4 font-bold text-center w-12">क्र.</th>
                  <th className="p-4 font-bold">प्रतियोगिता का नाम</th>
                  <th className="p-4 font-bold">दिनांक व स्थान</th>
                  <th className="p-4 font-bold">प्रवेश शुल्क</th>
                  <th className="p-4 font-bold">पुरस्कार</th>
                  <th className="p-4 font-bold">स्थिति (Status)</th>
                  <th className="p-4 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {competitions.map((comp, idx) => (
                  <tr key={comp._id} className="hover:bg-orange-50/20 transition-colors">
                    <td className="p-4 text-center text-xs font-bold text-gray-400">
                      {idx + 1}
                    </td>

                    {/* Name & Slug & Categories */}
                    <td className="p-4">
                      <div className="font-bold text-gray-900 text-sm">{comp.name}</div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">/{comp.slug}</div>
                      {comp.categories && comp.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {comp.categories.map((cat, cIdx) => (
                            <span key={cIdx} className="text-[10px] bg-orange-100/70 text-orange-800 font-medium px-2 py-0.5 rounded-full">
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Date & Venue */}
                    <td className="p-4 text-xs text-gray-600 space-y-1">
                      <div className="flex items-center gap-1 font-medium text-gray-800">
                        <Calendar className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        <span>{comp.date || '7, 8, 9 नवंबर 2026'}</span>
                      </div>
                      {comp.time && (
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{comp.time}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-gray-500 truncate max-w-[200px]" title={comp.venue}>
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{comp.venue || 'रेगवां'}</span>
                      </div>
                    </td>

                    {/* Entry Fee */}
                    <td className="p-4">
                      <span className="inline-flex items-center font-extrabold text-sm text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-lg">
                        ₹{comp.entryFee || 0}
                      </span>
                    </td>

                    {/* Prize */}
                    <td className="p-4 text-xs">
                      {comp.firstPrize ? (
                        <div className="flex items-center gap-1 text-amber-800 font-semibold bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded-md inline-block">
                          <Award className="w-3.5 h-3.5 text-amber-600 inline mr-1" />
                          {comp.firstPrize}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>

                    {/* Status Toggles */}
                    <td className="p-4 space-y-1.5">
                      <button
                        onClick={() => toggleStatus(comp, 'isActive')}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold transition ${
                          comp.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title="क्लिक करके सक्रिय/निष्क्रिय करें"
                      >
                        {comp.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {comp.isActive ? 'Active' : 'Inactive'}
                      </button>

                      <div>
                        <button
                          onClick={() => toggleStatus(comp, 'registrationOpen')}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition ${
                            comp.registrationOpen
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              : 'bg-red-100 text-red-600 hover:bg-red-200'
                          }`}
                          title="क्लिक करके पंजीकरण स्थिति बदलें"
                        >
                          {comp.registrationOpen ? 'पंजीकरण चालू' : 'पंजीकरण बंद'}
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(comp)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="संपादित करें (Edit)"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(comp)}
                          disabled={deletingId === comp._id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                          title="हटाएं (Delete)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE COMPETITION MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#FF9933]" />
                <h2 className="text-xl font-bold text-gray-900">नई प्रतियोगिता जोड़ें</h2>
              </div>
              <button 
                onClick={() => setIsCreateOpen(false)} 
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Competition Name */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    प्रतियोगिता का नाम *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="उदा. सामान्य ज्ञान प्रतियोगिता"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none font-semibold text-gray-800"
                  />
                </div>

                {/* Slug (URL key) */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Slug (URL पहचान)
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={e => setForm({ ...form, slug: e.target.value })}
                    placeholder="उदा. gk-competition (खाली छोड़ने पर स्वतः बनेगा)"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm text-gray-700 font-mono"
                  />
                </div>

                {/* Entry Fee */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    प्रवेश शुल्क (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-500">₹</span>
                    <input
                      type="number"
                      value={form.entryFee}
                      onChange={e => setForm({ ...form, entryFee: Number(e.target.value) })}
                      placeholder="30"
                      className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm font-bold text-gray-800"
                    />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    दिनांक (Date)
                  </label>
                  <input
                    type="text"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    placeholder="7, 8, 9 नवंबर 2026"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm text-gray-800"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    समय (Time)
                  </label>
                  <input
                    type="text"
                    value={form.time}
                    onChange={e => setForm({ ...form, time: e.target.value })}
                    placeholder="प्रातः 10:00 बजे"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm text-gray-800"
                  />
                </div>

                {/* Venue */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    स्थान (Venue)
                  </label>
                  <input
                    type="text"
                    value={form.venue}
                    onChange={e => setForm({ ...form, venue: e.target.value })}
                    placeholder="श्रीराम मंदिर के सामने, रेगवां"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm text-gray-800"
                  />
                </div>

                {/* First Prize */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    प्रथम पुरस्कार (First Prize)
                  </label>
                  <input
                    type="text"
                    value={form.firstPrize}
                    onChange={e => setForm({ ...form, firstPrize: e.target.value })}
                    placeholder="उदा. ₹5,100 नकद पुरस्कार"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm text-gray-800"
                  />
                </div>

                {/* Second Prize */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    द्वितीय पुरस्कार (Second Prize)
                  </label>
                  <input
                    type="text"
                    value={form.secondPrize}
                    onChange={e => setForm({ ...form, secondPrize: e.target.value })}
                    placeholder="उदा. ₹3,100 नकद पुरस्कार"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm text-gray-800"
                  />
                </div>

                {/* Categories */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    श्रेणियां (Categories - कॉमा से अलग करें)
                  </label>
                  <input
                    type="text"
                    value={form.categories}
                    onChange={e => setForm({ ...form, categories: e.target.value })}
                    placeholder="उदा. कक्षा 1 से 8, कक्षा 9 से कॉलेज"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm text-gray-800"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    विवरण (Description)
                  </label>
                  <textarea
                    rows={2}
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="प्रतियोगिता का संक्षिप्त विवरण लिखें..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm text-gray-800"
                  />
                </div>

                {/* Rules */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    नियम व शर्तें (Rules - प्रत्येक लाइन में एक नियम)
                  </label>
                  <textarea
                    rows={3}
                    value={form.rules}
                    onChange={e => setForm({ ...form, rules: e.target.value })}
                    placeholder="1. नियम 1&#10;2. नियम 2"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm text-gray-800 font-sans"
                  />
                </div>

                {/* Toggles */}
                <div className="md:col-span-2 flex flex-wrap gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={e => setForm({ ...form, isActive: e.target.checked })}
                      className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm font-semibold text-gray-800">प्रतियोगिता सक्रिय रखें (Is Active)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.registrationOpen}
                      onChange={e => setForm({ ...form, registrationOpen: e.target.checked })}
                      className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm font-semibold text-gray-800">पंजीकरण चालू रखें (Registration Open)</span>
                  </label>
                </div>

              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#FF9933] to-orange-600 text-white rounded-xl font-bold text-sm hover:from-orange-600 hover:to-orange-700 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  प्रतियोगिता जोड़ें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT COMPETITION MODAL */}
      {editingComp && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#FF9933]" />
                <h2 className="text-xl font-bold text-gray-900">प्रतियोगिता संपादित करें</h2>
              </div>
              <button 
                onClick={() => setEditingComp(null)} 
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Competition Name */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    प्रतियोगिता का नाम *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none font-semibold text-gray-800"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={e => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm text-gray-700 font-mono"
                  />
                </div>

                {/* Entry Fee */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    प्रवेश शुल्क (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-500">₹</span>
                    <input
                      type="number"
                      value={form.entryFee}
                      onChange={e => setForm({ ...form, entryFee: Number(e.target.value) })}
                      className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm font-bold text-gray-800"
                    />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    दिनांक (Date)
                  </label>
                  <input
                    type="text"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm text-gray-800"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    समय (Time)
                  </label>
                  <input
                    type="text"
                    value={form.time}
                    onChange={e => setForm({ ...form, time: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm text-gray-800"
                  />
                </div>

                {/* Venue */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    स्थान (Venue)
                  </label>
                  <input
                    type="text"
                    value={form.venue}
                    onChange={e => setForm({ ...form, venue: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm text-gray-800"
                  />
                </div>

                {/* First Prize */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    प्रथम पुरस्कार
                  </label>
                  <input
                    type="text"
                    value={form.firstPrize}
                    onChange={e => setForm({ ...form, firstPrize: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm text-gray-800"
                  />
                </div>

                {/* Second Prize */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    द्वितीय पुरस्कार
                  </label>
                  <input
                    type="text"
                    value={form.secondPrize}
                    onChange={e => setForm({ ...form, secondPrize: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm text-gray-800"
                  />
                </div>

                {/* Categories */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    श्रेणियां (Categories - कॉमा से अलग करें)
                  </label>
                  <input
                    type="text"
                    value={form.categories}
                    onChange={e => setForm({ ...form, categories: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm text-gray-800"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    विवरण (Description)
                  </label>
                  <textarea
                    rows={2}
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm text-gray-800"
                  />
                </div>

                {/* Rules */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    नियम व शर्तें (Rules - प्रत्येक लाइन में एक नियम)
                  </label>
                  <textarea
                    rows={3}
                    value={form.rules}
                    onChange={e => setForm({ ...form, rules: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm text-gray-800 font-sans"
                  />
                </div>

                {/* Toggles */}
                <div className="md:col-span-2 flex flex-wrap gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={e => setForm({ ...form, isActive: e.target.checked })}
                      className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm font-semibold text-gray-800">सक्रिय रखें (Is Active)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.registrationOpen}
                      onChange={e => setForm({ ...form, registrationOpen: e.target.checked })}
                      className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm font-semibold text-gray-800">पंजीकरण चालू रखें (Registration Open)</span>
                  </label>
                </div>

              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingComp(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm hover:from-blue-700 hover:to-indigo-700 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  अपडेट सहेजें (Save Changes)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CompetitionsManagement;
