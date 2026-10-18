import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { Search, Download, Trash2, Eye, X, CreditCard, Banknote, Clock, CheckCircle, Edit3, Loader2 } from 'lucide-react';
import logoImg from '../../assets/logo.png';

const ParticipantsList = () => {
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewParticipant, setViewParticipant] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [paymentModal, setPaymentModal] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [paymentMode, setPaymentMode] = useState('cash');
  const [paidAmount, setPaidAmount] = useState<number | string>('');

  // Edit Participant Modal State
  const [editModal, setEditModal] = useState<any>(null);
  const [allCompetitions, setAllCompetitions] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState({
    participantName: '',
    fatherName: '',
    village: '',
    mobile: '',
    className: '',
    category: '',
    schoolCollege: '',
    competitionIds: [] as string[],
    paymentStatus: 'pending',
    paymentMode: 'cash',
    paidAmount: 0,
  });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  useEffect(() => {
    fetchParticipants();
  }, [searchTerm]);

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/competitions`);
      setAllCompetitions(res.data);
    } catch (error) {
      console.error('Failed to load competitions list');
    }
  };

  const fetchParticipants = async () => {
    try {
      const token = Cookies.get('adminToken');
      const res = await axios.get(`${apiUrl}/api/admin/participants?keyword=${searchTerm}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setParticipants(res.data.participants);
    } catch (error) {
      toast.error('Failed to load participants');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('क्या आप इस प्रतिभागी को हटाना चाहते हैं?')) return;
    setDeletingId(id);
    try {
      const token = Cookies.get('adminToken');
      await axios.delete(`${apiUrl}/api/admin/participants/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('प्रतिभागी हटाया गया');
      setParticipants(prev => prev.filter(p => p._id !== id));
    } catch (error) {
      toast.error('हटाने में त्रुटि हुई');
    } finally {
      setDeletingId(null);
    }
  };

  const openPaymentModal = (p: any) => {
    setPaymentModal(p);
    setPaymentStatus(p.paymentStatus || 'pending');
    setPaymentMode(p.paymentMode || 'cash');
    setPaidAmount(p.paidAmount !== undefined && p.paidAmount !== null ? p.paidAmount : '');
  };

  const handleUpdatePayment = async () => {
    if (!paymentModal) return;
    try {
      const token = Cookies.get('adminToken');
      const numAmount = Number(paidAmount) || 0;
      await axios.put(`${apiUrl}/api/admin/participants/${paymentModal._id}/payment`, 
        { paymentStatus, paymentMode, paidAmount: numAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Payment status updated');
      setParticipants(prev => prev.map(p => 
        p._id === paymentModal._id ? { ...p, paymentStatus, paymentMode, paidAmount: numAmount } : p
      ));
      if (viewParticipant && viewParticipant._id === paymentModal._id) {
        setViewParticipant((prev: any) => ({ ...prev, paymentStatus, paymentMode, paidAmount: numAmount }));
      }
      setPaymentModal(null);
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const openEditModal = (p: any) => {
    setEditModal(p);
    let selectedCompIds: string[] = [];
    if (p.competitionIds && p.competitionIds.length > 0) {
      selectedCompIds = p.competitionIds.map((c: any) => c._id || c);
    } else if (p.competitionId) {
      selectedCompIds = [p.competitionId._id || p.competitionId];
    }

    setEditForm({
      participantName: p.participantName || '',
      fatherName: p.fatherName || '',
      village: p.village || '',
      mobile: p.mobile || '',
      className: p.class || '',
      category: p.category || '',
      schoolCollege: p.schoolCollege || '',
      competitionIds: selectedCompIds,
      paymentStatus: p.paymentStatus || 'pending',
      paymentMode: p.paymentMode || 'cash',
      paidAmount: p.paidAmount !== undefined ? p.paidAmount : 0,
    });
  };

  const toggleCompetitionSelection = (compId: string) => {
    setEditForm(prev => {
      const exists = prev.competitionIds.includes(compId);
      return {
        ...prev,
        competitionIds: exists 
          ? prev.competitionIds.filter(id => id !== compId)
          : [...prev.competitionIds, compId]
      };
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal) return;

    if (!editForm.participantName.trim() || !editForm.mobile.trim()) {
      toast.error('प्रतिभागी का नाम और मोबाइल नंबर अनिवार्य हैं।');
      return;
    }

    setIsUpdating(true);
    try {
      const token = Cookies.get('adminToken');
      const res = await axios.put(`${apiUrl}/api/admin/participants/${editModal._id}`, {
        ...editForm,
        paidAmount: Number(editForm.paidAmount) || 0
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('प्रतिभागी की जानकारी सफलतापूर्वक अपडेट की गई!');
      const updated = res.data.participant;
      setParticipants(prev => prev.map(p => p._id === editModal._id ? updated : p));
      if (viewParticipant && viewParticipant._id === editModal._id) {
        setViewParticipant(updated);
      }
      setEditModal(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'अपडेट करने में त्रुटि हुई');
    } finally {
      setIsUpdating(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Reg ID', 'Name', 'Father Name', 'Mobile', 'Village', 'Class', 'Competition', 'Category', 'Payment Status', 'Payment Mode', 'Amount Paid (₹)', 'Registered On'];
    const rows = participants.map(p => [
      p.registrationId,
      p.participantName,
      p.fatherName,
      p.mobile,
      p.village,
      p.class || '-',
      p.competitionIds?.map((c: any) => c.name).join(' | ') || p.competitionId?.name || '-',
      p.category || '-',
      p.paymentStatus || 'pending',
      p.paymentMode || 'cash',
      p.paidAmount || 0,
      new Date(p.createdAt).toLocaleDateString('hi-IN'),
    ]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF"
      + [headers.join(','), ...rows.map(e => e.map(v => `"${v}"`).join(','))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pratibhamanch_participants_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCompetitionNames = (p: any) => {
    if (p.competitionIds && p.competitionIds.length > 0) {
      return p.competitionIds.map((c: any) => c.name).join(', ');
    }
    return p.competitionId?.name || 'Unknown';
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-2 gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-1 rounded-full bg-gradient-to-tr from-[#FF9933] to-[#138808] shadow-md shrink-0">
            <img src={logoImg} alt="Logo" className="w-11 h-11 rounded-full object-cover border-2 border-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] leading-tight">प्रतिभागी सूची</h1>
            <p className="text-xs text-gray-500 font-medium">वन्दे मातरम् परिवार, रेगवाँ • कुल प्रतिभागी: {participants.length}</p>
          </div>
        </div>
        <button
          onClick={exportCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl flex items-center justify-center font-bold text-sm shadow-md transition self-start sm:self-auto"
        >
          <Download className="w-4 h-4 mr-2" /> Export CSV (Excel)
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="नाम, मोबाइल या Reg ID से खोजें..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="p-4 font-semibold text-center w-12">क्र.</th>
                <th className="p-4 font-semibold">Reg ID</th>
                <th className="p-4 font-semibold">नाम</th>
                <th className="p-4 font-semibold">मोबाइल</th>
                <th className="p-4 font-semibold">गाँव</th>
                <th className="p-4 font-semibold">प्रतियोगिता</th>
                <th className="p-4 font-semibold">Payment</th>
                <th className="p-4 font-semibold">दिनांक</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="p-4 text-center text-gray-500">Loading...</td></tr>
              ) : participants.length === 0 ? (
                <tr><td colSpan={9} className="p-4 text-center text-gray-500">कोई प्रतिभागी नहीं मिला।</td></tr>
              ) : (
                participants.map((p, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 text-sm">
                    <td className="p-4 text-center text-gray-500 font-medium text-xs">{i + 1}</td>
                    <td className="p-4 font-medium text-gray-900">{p.registrationId}</td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{p.participantName}</div>
                      <div className="text-gray-500 text-xs">S/O {p.fatherName}</div>
                    </td>
                    <td className="p-4 text-gray-600">{p.mobile}</td>
                    <td className="p-4 text-gray-600">{p.village}</td>
                    <td className="p-4 text-gray-600 max-w-[180px]">
                      <span className="text-xs">{getCompetitionNames(p)}</span>
                    </td>
                    <td className="p-4">
                      <button onClick={() => openPaymentModal(p)} className="flex flex-col items-start gap-1 group">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                            p.paymentStatus === 'paid' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {p.paymentStatus === 'paid' 
                              ? <><CheckCircle className="w-3 h-3" /> Paid</>
                              : <><Clock className="w-3 h-3" /> Pending</>
                            }
                          </span>
                          {p.paidAmount ? (
                            <span className="font-extrabold text-xs text-green-800 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">
                              ₹{p.paidAmount}
                            </span>
                          ) : null}
                        </div>
                        <span className={`text-xs flex items-center gap-1 text-gray-500`}>
                          {p.paymentMode === 'online' 
                            ? <><CreditCard className="w-3 h-3" /> Online</>
                            : <><Banknote className="w-3 h-3" /> Cash</>
                          }
                        </span>
                      </button>
                    </td>
                    <td className="p-4 text-gray-600">{new Date(p.createdAt).toLocaleDateString('hi-IN')}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setViewParticipant(p)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="देखें (View)"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                          title="विवरण बदलें (Edit)"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          disabled={deletingId === p._id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                          title="हटाएं (Delete)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Participant Modal */}
      {viewParticipant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-orange-50">
              <h2 className="text-xl font-bold text-gray-900">प्रतिभागी विवरण</h2>
              <button onClick={() => setViewParticipant(null)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-orange-50 rounded-xl px-4 py-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Registration ID</p>
                <p className="text-2xl font-extrabold text-orange-600">{viewParticipant.registrationId}</p>
              </div>
              {[
                { label: 'प्रतिभागी का नाम', value: viewParticipant.participantName },
                { label: 'पिता का नाम', value: viewParticipant.fatherName },
                { label: 'गाँव', value: viewParticipant.village },
                { label: 'मोबाइल', value: viewParticipant.mobile },
                { label: 'कक्षा', value: viewParticipant.class || '-' },
                { label: 'श्रेणी', value: viewParticipant.category || '-' },
                { label: 'स्कूल / कॉलेज', value: viewParticipant.schoolCollege || '-' },
                { label: 'प्रतियोगिता', value: getCompetitionNames(viewParticipant) },
                { label: 'Payment Status', value: viewParticipant.paymentStatus || 'pending' },
                { label: 'Payment Mode', value: viewParticipant.paymentMode || 'cash' },
                { label: 'प्राप्त राशि (Amount Paid)', value: `₹${viewParticipant.paidAmount || 0}` },
                { label: 'पंजीयन दिनांक', value: new Date(viewParticipant.createdAt).toLocaleString('hi-IN') },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 font-medium text-sm">{label}</span>
                  <span className="text-gray-800 font-semibold text-sm text-right max-w-[60%]">{value}</span>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 flex flex-wrap justify-end gap-2.5 border-t">
              <button
                onClick={() => {
                  const curr = viewParticipant;
                  setViewParticipant(null);
                  openEditModal(curr);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm transition flex items-center gap-1.5"
              >
                <Edit3 className="w-4 h-4" /> विवरण बदलें
              </button>
              <button
                onClick={() => openPaymentModal(viewParticipant)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-sm transition"
              >
                Payment Update
              </button>
              <button onClick={() => setViewParticipant(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition">
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Status Modal */}
      {paymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">Payment Status Update</h2>
              <button onClick={() => setPaymentModal(null)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <p className="text-sm text-gray-500 mb-1">प्रतिभागी</p>
                <p className="font-bold text-gray-900">{paymentModal.participantName} ({paymentModal.registrationId})</p>
              </div>

              <div>
                <p className="font-semibold text-gray-700 mb-2">Payment Status</p>
                <div className="grid grid-cols-2 gap-3">
                  {['pending', 'paid'].map(s => (
                    <button
                      key={s}
                      onClick={() => setPaymentStatus(s)}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold transition ${
                        paymentStatus === s
                          ? s === 'paid' ? 'border-green-500 bg-green-50 text-green-700' : 'border-yellow-500 bg-yellow-50 text-yellow-700'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {s === 'paid' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      {s === 'paid' ? 'Paid' : 'Pending'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-semibold text-gray-700 mb-2">Payment Mode</p>
                <div className="grid grid-cols-2 gap-3">
                  {['cash', 'online'].map(m => (
                    <button
                      key={m}
                      onClick={() => setPaymentMode(m)}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold transition ${
                        paymentMode === m
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {m === 'online' ? <CreditCard className="w-4 h-4" /> : <Banknote className="w-4 h-4" />}
                      {m === 'online' ? 'Online' : 'Cash'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">प्राप्त राशि (Amount Paid ₹)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                  <input
                    type="number"
                    value={paidAmount}
                    onChange={e => setPaidAmount(e.target.value)}
                    placeholder="जमा की गई राशि (उदा. 30, 50, 100)"
                    className="w-full border border-gray-300 rounded-xl pl-8 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-900"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 flex justify-end gap-3 border-t">
              <button onClick={() => setPaymentModal(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">
                Cancel
              </button>
              <button onClick={handleUpdatePayment} className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Participant Details Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-white">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500 text-white rounded-xl shadow-sm">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">प्रतिभागी विवरण संपादित करें</h2>
                  <p className="text-xs text-amber-700 font-semibold font-mono">
                    ID: {editModal.registrationId}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setEditModal(null)} 
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    प्रतिभागी का नाम *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.participantName}
                    onChange={e => setEditForm({ ...editForm, participantName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none font-semibold text-gray-900 text-sm"
                  />
                </div>

                {/* Father's Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    पिता का नाम
                  </label>
                  <input
                    type="text"
                    value={editForm.fatherName}
                    onChange={e => setEditForm({ ...editForm, fatherName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none font-semibold text-gray-900 text-sm"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    मोबाइल नंबर *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.mobile}
                    onChange={e => setEditForm({ ...editForm, mobile: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none font-semibold text-gray-900 text-sm"
                  />
                </div>

                {/* Village */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    गाँव (Village)
                  </label>
                  <input
                    type="text"
                    value={editForm.village}
                    onChange={e => setEditForm({ ...editForm, village: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none font-semibold text-gray-900 text-sm"
                  />
                </div>

                {/* Class */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    कक्षा (Class)
                  </label>
                  <input
                    type="text"
                    value={editForm.className}
                    onChange={e => setEditForm({ ...editForm, className: e.target.value })}
                    placeholder="उदा. 8th, 10th, 12th, BA, BSc"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900 text-sm"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    श्रेणी (Category)
                  </label>
                  <input
                    type="text"
                    value={editForm.category}
                    onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                    placeholder="उदा. कक्षा 1 से 8 / कक्षा 9 से कॉलेज"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900 text-sm"
                  />
                </div>

                {/* School / College */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    स्कूल / कॉलेज का नाम
                  </label>
                  <input
                    type="text"
                    value={editForm.schoolCollege}
                    onChange={e => setEditForm({ ...editForm, schoolCollege: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900 text-sm"
                  />
                </div>

                {/* Competitions Selection */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                    चयनित प्रतियोगिताएं (Competitions)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-gray-50 p-3 rounded-2xl border border-gray-200">
                    {allCompetitions.map(comp => {
                      const isSelected = editForm.competitionIds.includes(comp._id);
                      return (
                        <label
                          key={comp._id}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition ${
                            isSelected
                              ? 'bg-orange-100 border-orange-500 text-orange-950 shadow-xs'
                              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleCompetitionSelection(comp._id)}
                            className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                          />
                          <span className="truncate">{comp.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Status */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Payment Status
                  </label>
                  <select
                    value={editForm.paymentStatus}
                    onChange={e => setEditForm({ ...editForm, paymentStatus: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none font-bold text-sm bg-white"
                  >
                    <option value="pending">लंबित (Pending)</option>
                    <option value="paid">पूर्ण (Paid)</option>
                  </select>
                </div>

                {/* Payment Mode */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={editForm.paymentMode}
                    onChange={e => setEditForm({ ...editForm, paymentMode: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none font-bold text-sm bg-white"
                  >
                    <option value="cash">नकद (Cash)</option>
                    <option value="online">ऑनलाइन (Online)</option>
                  </select>
                </div>

                {/* Paid Amount */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    जमा की गई राशि (Amount Paid ₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-500">₹</span>
                    <input
                      type="number"
                      value={editForm.paidAmount}
                      onChange={e => setEditForm({ ...editForm, paidAmount: Number(e.target.value) })}
                      placeholder="उदा. 30, 50, 100"
                      className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none font-black text-gray-900 text-sm"
                    />
                  </div>
                </div>

              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditModal(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold text-sm transition flex items-center gap-2 shadow-md hover:shadow-orange-500/20 disabled:opacity-50"
                >
                  {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
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

export default ParticipantsList;

