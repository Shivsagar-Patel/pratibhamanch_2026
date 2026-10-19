import { useState, useEffect } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Download, Loader2 } from 'lucide-react';
import logoImg from '../assets/logo.png';

const Receipt = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [data, setData] = useState<any>(location.state || null);
  const [loading, setLoading] = useState<boolean>(!location.state && !!id);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!data && id) {
      const fetchReceipt = async () => {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          const res = await axios.get(`${apiUrl}/api/participants/${id}`);
          setData(res.data);
        } catch (err: any) {
          setError(err.response?.data?.message || 'रसीद लोड नहीं हो सकी।');
        } finally {
          setLoading(false);
        }
      };
      fetchReceipt();
    }
  }, [id, data]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="animate-spin h-10 w-10 text-orange-600" />
      </div>
    );
  }

  if (error || !data || !data.participant) {
    return (
      <div className="text-center p-20">
        <p className="text-gray-600 mb-4">{error || 'रसीद की जानकारी नहीं मिली।'}</p>
        <Link to="/" className="text-orange-600 underline font-semibold">होमपेज पर जाएं</Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const getCompetitionNames = () => {
    const p = data.participant;
    if (p.competitionIds && p.competitionIds.length > 0) {
      return p.competitionIds.map((c: any) => c.name || c).join(', ');
    }
    return data.competition?.name || p.competitionId?.name || '-';
  };

  return (
    <>
      {/* Print-specific CSS */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #receipt-print-area, #receipt-print-area * { visibility: visible; }
          #receipt-print-area {
            position: fixed;
            top: 0; left: 0;
            width: 100%;
            padding: 0;
            margin: 0;
          }
          @page {
            size: A4 portrait;
            margin: 8mm 12mm;
          }
        }
      `}</style>

      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
        <div id="receipt-print-area" className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#14213D] py-4 px-6 text-center text-white">
            <div className="flex items-center justify-center gap-3 mb-2">
              <img src={logoImg} alt="Logo" className="h-12 w-12 rounded-full object-cover border-2 border-[#FF9933]" />
              <div className="text-left">
                <p className="text-[#FF9933] font-extrabold text-base leading-tight">वन्दे मातरम् परिवार, रेगवाँ</p>
                <p className="text-white/70 text-xs">राष्ट्र सर्वोपरि</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-7 h-7 text-green-400" />
              <h1 className="text-2xl font-bold">पंजीयन सफल हुआ!</h1>
            </div>
            <p className="mt-0.5 text-orange-200 text-sm">प्रतिभामंच 2026 में जुड़ने के लिए धन्यवाद</p>
          </div>

          <div className="px-6 py-4">
            {/* Tricolor divider */}
            <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] rounded-full mb-4 border border-gray-100"></div>

            {/* Registration ID highlight */}
            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-3 mb-4 text-center">
              <p className="text-xs text-gray-500 mb-0.5">पंजीयन क्रमांक</p>
              <p className="text-2xl font-extrabold text-[#FF9933] tracking-wider">{data.participant.registrationId}</p>
            </div>

            {/* Details table */}
            <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
              <table className="w-full text-left text-sm">
                <tbody>
                  {[
                    { label: 'प्रतियोगिता', value: getCompetitionNames() },
                    { label: 'प्रतिभागी का नाम', value: data.participant.participantName, bold: true },
                    { label: 'पिता का नाम', value: data.participant.fatherName },
                    { label: 'मोबाइल नंबर', value: data.participant.mobile },
                    { label: 'गाँव', value: data.participant.village },
                    ...(data.participant.class ? [{ label: 'कक्षा', value: data.participant.class }] : []),
                    ...(data.participant.category ? [{ label: 'आयु वर्ग', value: data.participant.category }] : []),
                  ].map(({ label, value, bold }, i) => (
                    <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="py-2.5 px-4 text-gray-500 font-medium w-2/5">{label}</td>
                      <td className={`py-2.5 px-4 text-gray-900 ${bold ? 'font-bold' : ''}`}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Organizer info */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-center mb-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <img src={logoImg} alt="Logo" className="h-6 w-6 rounded-full object-cover" />
                <p className="font-extrabold text-[#14213D] text-sm">वन्दे मातरम् परिवार, रेगवाँ</p>
              </div>
              <p className="text-gray-500 text-xs">स्थान: श्रीराम मंदिर के सामने, रेगवां | दिनांक: 7, 8 और 9 नवंबर 2026</p>
              <p className="text-gray-500 text-xs mt-0.5">संपर्क: 9302428721 | 9617125922 | Insta: @vande_matram_parivar</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center print:hidden">
              <button
                onClick={handlePrint}
                className="flex items-center justify-center bg-[#14213D] hover:bg-[#1e3060] text-white px-6 py-2.5 rounded-lg font-bold transition text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                पंजीयन रसीद Print करें
              </button>
              <Link
                to="/"
                className="flex items-center justify-center bg-orange-100 hover:bg-orange-200 text-orange-700 px-6 py-2.5 rounded-lg font-bold transition text-sm"
              >
                होमपेज पर जाएं
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Receipt;
