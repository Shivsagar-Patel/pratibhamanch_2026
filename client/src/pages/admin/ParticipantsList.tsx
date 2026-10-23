import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { 
  Search, 
  Download, 
  Trash2, 
  Eye, 
  X, 
  CreditCard, 
  Banknote, 
  Clock, 
  CheckCircle, 
  Edit3, 
  Loader2, 
  Filter, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  GraduationCap
} from 'lucide-react';
import logoImg from '../../assets/logo.png';

const STANDARD_CATEGORIES = ['1st to 8th', '9th to College'];
const STANDARD_CLASSES = [
  'कक्षा 1', 'कक्षा 2', 'कक्षा 3', 'कक्षा 4', 'कक्षा 5', 'कक्षा 6', 'कक्षा 7', 'कक्षा 8',
  'कक्षा 9', 'कक्षा 10', 'कक्षा 11', 'कक्षा 12',
  '1st Year (College)', '2nd Year (College)', '3rd Year (College)', '4th Year (College)'
];

const ParticipantsList = () => {
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  // Filters State
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterClass, setFilterClass] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [filterCompetition, setFilterCompetition] = useState('all');

  // Dynamic filter options from server
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);

  // Modals & Actions
  const [viewParticipant, setViewParticipant] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Payment Modal State
  const [paymentModal, setPaymentModal] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [paymentMode, setPaymentMode] = useState('cash');
  const [paidAmount, setPaidAmount] = useState<number | string>('');
  const [paymentUtr, setPaymentUtr] = useState('');

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
    utrNumber: '',
  });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  // Fetch participants whenever page, pageSize, search, or filters change
  useEffect(() => {
    fetchParticipants();
  }, [page, pageSize, searchTerm, filterCategory, filterClass, filterPayment, filterCompetition]);

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
      setLoading(true);
      const token = Cookies.get('adminToken');
      
      const queryParams = new URLSearchParams();
      queryParams.set('page', page.toString());
      queryParams.set('pageSize', pageSize.toString());
      if (searchTerm.trim()) queryParams.set('keyword', searchTerm.trim());
      if (filterCategory !== 'all') queryParams.set('category', filterCategory);
      if (filterClass !== 'all') queryParams.set('class', filterClass);
      if (filterPayment !== 'all') queryParams.set('paymentStatus', filterPayment);
      if (filterCompetition !== 'all') queryParams.set('competitionId', filterCompetition);

      const res = await axios.get(`${apiUrl}/api/admin/participants?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setParticipants(res.data.participants || []);
      setTotalPages(res.data.pages || 1);
      setTotalParticipants(res.data.total || 0);

      if (res.data.availableCategories) {
        setAvailableCategories(res.data.availableCategories);
      }
      if (res.data.availableClasses) {
        setAvailableClasses(res.data.availableClasses);
      }
    } catch (error) {
      toast.error('प्रतिभागियों की सूची लोड नहीं हो सकी');
    } finally {
      setLoading(false);
    }
  };

  const hasActiveFilters = 
    searchTerm.trim() !== '' || 
    filterCategory !== 'all' || 
    filterClass !== 'all' || 
    filterPayment !== 'all' || 
    filterCompetition !== 'all';

  const resetFilters = () => {
    setSearchTerm('');
    setFilterCategory('all');
    setFilterClass('all');
    setFilterPayment('all');
    setFilterCompetition('all');
    setPage(1);
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
      fetchParticipants();
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
    setPaymentUtr(p.utrNumber || '');
  };

  const handleUpdatePayment = async () => {
    if (!paymentModal) return;
    try {
      const token = Cookies.get('adminToken');
      const numAmount = Number(paidAmount) || 0;
      await axios.put(`${apiUrl}/api/admin/participants/${paymentModal._id}/payment`, 
        { paymentStatus, paymentMode, paidAmount: numAmount, utrNumber: paymentUtr },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Payment status updated');
      setParticipants(prev => prev.map(p => 
        p._id === paymentModal._id ? { ...p, paymentStatus, paymentMode, paidAmount: numAmount, utrNumber: paymentUtr } : p
      ));
      if (viewParticipant && viewParticipant._id === paymentModal._id) {
        setViewParticipant((prev: any) => ({ ...prev, paymentStatus, paymentMode, paidAmount: numAmount, utrNumber: paymentUtr }));
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
      utrNumber: p.utrNumber || '',
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

  const exportCSV = async () => {
    try {
      setIsExporting(true);
      toast.info('डाटा तैयार किया जा रहा है...');
      const token = Cookies.get('adminToken');
      
      const queryParams = new URLSearchParams();
      if (searchTerm.trim()) queryParams.set('keyword', searchTerm.trim());
      if (filterCategory !== 'all') queryParams.set('category', filterCategory);
      if (filterClass !== 'all') queryParams.set('class', filterClass);
      if (filterPayment !== 'all') queryParams.set('paymentStatus', filterPayment);
      if (filterCompetition !== 'all') queryParams.set('competitionId', filterCompetition);
      queryParams.set('pageSize', 'all');

      const res = await axios.get(`${apiUrl}/api/admin/participants?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const exportData = res.data.participants && res.data.participants.length > 0 ? res.data.participants : participants;

      const headers = ['Reg ID', 'Name', 'Father Name', 'Mobile', 'Village', 'Class', 'Category', 'Competition', 'Payment Status', 'Payment Mode', 'UTR / Ref ID', 'Amount Paid (₹)', 'Registered On'];
      const rows = exportData.map((p: any) => [
        p.registrationId,
        p.participantName,
        p.fatherName,
        p.mobile,
        p.village,
        p.class || '-',
        p.category || '-',
        p.competitionIds?.map((c: any) => c.name).join(' | ') || p.competitionId?.name || '-',
        p.paymentStatus || 'pending',
        p.paymentMode || 'cash',
        p.utrNumber || '-',
        p.paidAmount || 0,
        new Date(p.createdAt).toLocaleDateString('hi-IN'),
      ]);

      const csvContent = "data:text/csv;charset=utf-8,\uFEFF"
        + [headers.join(','), ...rows.map((e: any[]) => e.map((v: any) => `"${(v ?? '').toString().replace(/"/g, '""')}"`).join(','))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `pratibhamanch_participants_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`${exportData.length} प्रतिभागियों का डाटा डाउनलोड हो गया`);
    } catch (error) {
      toast.error('CSV डाउनलोड करने में त्रुटि हुई');
    } finally {
      setIsExporting(false);
    }
  };

  const getCompetitionNames = (p: any) => {
    if (p.competitionIds && p.competitionIds.length > 0) {
      return p.competitionIds.map((c: any) => c.name).join(', ');
    }
    return p.competitionId?.name || 'Unknown';
  };

  // Build merged distinct categories and classes list
  const mergedCategories = Array.from(new Set([...STANDARD_CATEGORIES, ...availableCategories])).filter(Boolean);
  const mergedClasses = Array.from(new Set([...STANDARD_CLASSES, ...availableClasses])).filter(Boolean);

  // Pagination page numbers generator
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-1 rounded-full bg-gradient-to-tr from-[#FF9933] to-[#138808] shadow-md shrink-0">
            <img src={logoImg} alt="Logo" className="w-11 h-11 rounded-full object-cover border-2 border-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] leading-tight">प्रतिभागी सूची</h1>
            <p className="text-xs text-gray-500 font-medium">
              वन्दे मातरम् परिवार, रेगवाँ • कुल प्रतिभागी: <span className="font-bold text-orange-600">{totalParticipants}</span>
            </p>
          </div>
        </div>
        <button
          onClick={exportCSV}
          disabled={isExporting}
          className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl flex items-center justify-center font-bold text-sm shadow-md transition self-start sm:self-auto cursor-pointer"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Export CSV (Excel)
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-lg">
            <input
              type="text"
              placeholder="नाम, पिता का नाम, मोबाइल, Reg ID या गाँव से खोजें..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-9 py-2.5 bg-gray-50 hover:bg-white focus:bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium transition"
            />
            <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setPage(1);
                }}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Info & Reset button */}
          <div className="flex items-center gap-2 self-end lg:self-auto">
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-xl text-xs font-bold transition cursor-pointer"
                title="सभी फ़िल्टर हटाएं"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                फ़िल्टर रीसेट करें
              </button>
            )}
          </div>
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-gray-100">
          
          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-orange-500" />
              श्रेणी (Category)
            </label>
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setPage(1);
              }}
              className="w-full bg-gray-50 hover:bg-white focus:bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            >
              <option value="all">सभी श्रेणियां (All)</option>
              {mergedCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Class Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
              कक्षा (Class)
            </label>
            <select
              value={filterClass}
              onChange={(e) => {
                setFilterClass(e.target.value);
                setPage(1);
              }}
              className="w-full bg-gray-50 hover:bg-white focus:bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            >
              <option value="all">सभी कक्षाएं (All)</option>
              {mergedClasses.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-green-500" />
              Payment Status
            </label>
            <select
              value={filterPayment}
              onChange={(e) => {
                setFilterPayment(e.target.value);
                setPage(1);
              }}
              className="w-full bg-gray-50 hover:bg-white focus:bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            >
              <option value="all">सभी भुगतान (All)</option>
              <option value="paid">पूर्ण (Paid)</option>
              <option value="pending">लंबित (Pending)</option>
            </select>
          </div>

          {/* Competition Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-purple-500" />
              प्रतियोगिता (Competition)
            </label>
            <select
              value={filterCompetition}
              onChange={(e) => {
                setFilterCompetition(e.target.value);
                setPage(1);
              }}
              className="w-full bg-gray-50 hover:bg-white focus:bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            >
              <option value="all">सभी प्रतियोगिताएं (All)</option>
              {allCompetitions.map(comp => (
                <option key={comp._id} value={comp._id}>{comp.name}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Participants Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1050px]">
            <thead>
              <tr className="bg-gray-50/90 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="p-3.5 font-bold text-center w-12">क्र.</th>
                <th className="p-3.5 font-bold">Reg ID</th>
                <th className="p-3.5 font-bold">प्रतिभागी का नाम</th>
                <th className="p-3.5 font-bold">कक्षा (Class)</th>
                <th className="p-3.5 font-bold">श्रेणी (Category)</th>
                <th className="p-3.5 font-bold">मोबाइल</th>
                <th className="p-3.5 font-bold">गाँव</th>
                <th className="p-3.5 font-bold">प्रतियोगिता</th>
                <th className="p-3.5 font-bold">Payment</th>
                <th className="p-3.5 font-bold">दिनांक</th>
                <th className="p-3.5 font-bold text-center">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={11} className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-7 h-7 text-orange-600 animate-spin" />
                      <span className="text-sm font-semibold">डाटा लोड हो रहा है...</span>
                    </div>
                  </td>
                </tr>
              ) : participants.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-base font-bold text-gray-700">कोई प्रतिभागी नहीं मिला।</p>
                      <p className="text-xs text-gray-400">फ़िल्टर बदलकर पुनः प्रयास करें।</p>
                      {hasActiveFilters && (
                        <button
                          onClick={resetFilters}
                          className="mt-2 text-xs font-bold text-orange-600 hover:text-orange-700 underline cursor-pointer"
                        >
                          फ़िल्टर हटाएं
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                participants.map((p, i) => {
                  const serialNumber = (page - 1) * pageSize + i + 1;
                  return (
                    <tr key={p._id || i} className="hover:bg-orange-50/30 transition text-sm">
                      
                      {/* Serial Number */}
                      <td className="p-3.5 text-center text-gray-500 font-bold text-xs">{serialNumber}</td>
                      
                      {/* Registration ID */}
                      <td className="p-3.5 font-bold text-gray-900 whitespace-nowrap">
                        <span className="bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-md font-mono text-xs">
                          {p.registrationId}
                        </span>
                      </td>
                      
                      {/* Name & Father's Name */}
                      <td className="p-3.5">
                        <div className="font-bold text-gray-900">{p.participantName}</div>
                        <div className="text-gray-500 text-xs">पिता: {p.fatherName}</div>
                      </td>

                      {/* Class Column */}
                      <td className="p-3.5 whitespace-nowrap">
                        {p.class ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200/80">
                            {p.class}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs italic">-</span>
                        )}
                      </td>

                      {/* Category Column */}
                      <td className="p-3.5 whitespace-nowrap">
                        {p.category ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                            {p.category}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs italic">-</span>
                        )}
                      </td>

                      {/* Mobile */}
                      <td className="p-3.5 text-gray-700 font-medium whitespace-nowrap">
                        <a href={`tel:${p.mobile}`} className="hover:text-orange-600 transition">
                          {p.mobile}
                        </a>
                      </td>

                      {/* Village */}
                      <td className="p-3.5 text-gray-600 whitespace-nowrap">{p.village}</td>

                      {/* Competition */}
                      <td className="p-3.5 text-gray-700 max-w-[200px]">
                        <span className="text-xs font-medium line-clamp-2" title={getCompetitionNames(p)}>
                          {getCompetitionNames(p)}
                        </span>
                      </td>

                      {/* Payment Status & Amount */}
                      <td className="p-3.5 whitespace-nowrap">
                        <button 
                          onClick={() => openPaymentModal(p)} 
                          className="flex flex-col items-start gap-1 group text-left cursor-pointer"
                          title="पेमेंट स्टेटस बदलने के लिए क्लिक करें"
                        >
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-2xs ${
                              p.paymentStatus === 'paid' 
                                ? 'bg-green-100 text-green-700 border border-green-200' 
                                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            }`}>
                              {p.paymentStatus === 'paid' 
                                ? <><CheckCircle className="w-3 h-3 text-green-600" /> Paid</>
                                : <><Clock className="w-3 h-3 text-yellow-600" /> Pending</>
                              }
                            </span>
                            {p.paidAmount ? (
                              <span className="font-black text-xs text-green-800 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">
                                ₹{p.paidAmount}
                              </span>
                            ) : null}
                          </div>
                          <span className="text-[11px] flex items-center gap-1 text-gray-500 group-hover:text-orange-600 font-medium">
                            {p.paymentMode === 'online' 
                              ? <><CreditCard className="w-3 h-3 text-purple-600" /> <span className="text-purple-700 font-semibold">Online</span></>
                              : <><Banknote className="w-3 h-3 text-gray-500" /> Cash</>
                            }
                          </span>
                          {p.utrNumber && (
                            <span className="text-[10px] font-mono font-bold bg-purple-50 text-purple-800 border border-purple-200 px-1.5 py-0.5 rounded mt-0.5 block max-w-[130px] truncate" title={`UTR: ${p.utrNumber}`}>
                              UTR: {p.utrNumber}
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Date */}
                      <td className="p-3.5 text-gray-600 whitespace-nowrap text-xs">
                        {new Date(p.createdAt).toLocaleDateString('hi-IN')}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setViewParticipant(p)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="देखें (View)"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                            title="विवरण बदलें (Edit)"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            disabled={deletingId === p._id}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 cursor-pointer"
                            title="हटाएं (Delete)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/70 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left info & PageSize selector */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-600 font-medium">
            <span>
              कुल <strong className="text-gray-900">{totalParticipants}</strong> प्रतिभागियों में से{' '}
              {totalParticipants > 0 ? (
                <>
                  <strong className="text-gray-900">{(page - 1) * pageSize + 1}</strong> -{' '}
                  <strong className="text-gray-900">{Math.min(page * pageSize, totalParticipants)}</strong>
                </>
              ) : (
                '0'
              )}{' '}
              दिख रहे हैं
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">प्रति पृष्ठ:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          {/* Right Pagination Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(1)}
              disabled={page <= 1}
              title="पहला पृष्ठ (First Page)"
              className="p-2 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page <= 1}
              title="पिछला पृष्ठ (Previous Page)"
              className="p-2 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page number buttons */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((pNum, idx) =>
                pNum === '...' ? (
                  <span key={`dots-${idx}`} className="px-2 py-1 text-gray-400 text-xs font-bold">
                    ...
                  </span>
                ) : (
                  <button
                    key={`page-${pNum}`}
                    onClick={() => setPage(Number(pNum))}
                    className={`min-w-8 h-8 px-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      page === pNum
                        ? 'bg-orange-600 text-white shadow-sm'
                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pNum}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              disabled={page >= totalPages}
              title="अगला पृष्ठ (Next Page)"
              className="p-2 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page >= totalPages}
              title="अंतिम पृष्ठ (Last Page)"
              className="p-2 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* View Participant Modal */}
      {viewParticipant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-orange-50">
              <h2 className="text-xl font-bold text-gray-900">प्रतिभागी विवरण</h2>
              <button onClick={() => setViewParticipant(null)} className="text-gray-500 hover:text-gray-700 cursor-pointer">
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
                { label: 'Payment Mode', value: viewParticipant.paymentMode === 'online' ? 'ऑनलाइन (Online UPI)' : 'नकद (Cash)' },
                ...(viewParticipant.utrNumber ? [{ label: 'UTR / Transaction ID', value: viewParticipant.utrNumber }] : []),
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
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-4 h-4" /> विवरण बदलें
              </button>
              <button
                onClick={() => openPaymentModal(viewParticipant)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-sm transition cursor-pointer"
              >
                Payment Update
              </button>
              <button onClick={() => setViewParticipant(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition cursor-pointer">
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
              <button onClick={() => setPaymentModal(null)} className="text-gray-500 hover:text-gray-700 cursor-pointer">
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
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold transition cursor-pointer ${
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
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold transition cursor-pointer ${
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
                <label className="block font-semibold text-gray-700 mb-1 text-xs">UTR / Transaction ID</label>
                <input
                  type="text"
                  value={paymentUtr}
                  onChange={e => setPaymentUtr(e.target.value)}
                  placeholder="उदा. 4289XXXXXXXX (यदि ऑनलाइन भुगतान है)"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 font-mono font-bold text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
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
              <button onClick={() => setPaymentModal(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition cursor-pointer">
                Cancel
              </button>
              <button onClick={handleUpdatePayment} className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition cursor-pointer">
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
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition cursor-pointer"
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
                    placeholder="उदा. कक्षा 8, कक्षा 10, BA, BSc"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900 text-sm font-semibold"
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
                    placeholder="उदा. 1st to 8th / 9th to College"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900 text-sm font-semibold"
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

                {/* UTR Number */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    UTR / Transaction ID (यदि ऑनलाइन भुगतान हो)
                  </label>
                  <input
                    type="text"
                    value={editForm.utrNumber}
                    onChange={e => setEditForm({ ...editForm, utrNumber: e.target.value })}
                    placeholder="उदा. 4289XXXXXXXX (12 अंकों का UTR)"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono font-bold text-gray-900 text-sm"
                  />
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
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold text-sm transition flex items-center gap-2 shadow-md hover:shadow-orange-500/20 disabled:opacity-50 cursor-pointer"
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
