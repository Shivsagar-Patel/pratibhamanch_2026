import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { Search, Download } from 'lucide-react';

const ParticipantsList = () => {
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchParticipants();
  }, [searchTerm]);

  const fetchParticipants = async () => {
    try {
      const token = Cookies.get('adminToken');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
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

  const exportCSV = () => {
    // Simple CSV export logic
    const headers = ['Registration ID', 'Name', 'Father Name', 'Mobile', 'Village', 'Class', 'Competition'];
    const rows = participants.map(p => [
      p.registrationId, p.participantName, p.fatherName, p.mobile, p.village, p.class || '-', p.competitionId?.name || '-'
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "participants.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Participants</h1>
        <button 
          onClick={exportCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center font-medium transition"
        >
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="Search by name, mobile or Reg ID..." 
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
                <th className="p-4 font-semibold">Reg ID</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Mobile</th>
                <th className="p-4 font-semibold">Village</th>
                <th className="p-4 font-semibold">Competition</th>
                <th className="p-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-4 text-center text-gray-500">Loading...</td></tr>
              ) : participants.length === 0 ? (
                <tr><td colSpan={6} className="p-4 text-center text-gray-500">No participants found.</td></tr>
              ) : (
                participants.map((p, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 text-sm">
                    <td className="p-4 font-medium text-gray-900">{p.registrationId}</td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{p.participantName}</div>
                      <div className="text-gray-500 text-xs">S/O {p.fatherName}</div>
                    </td>
                    <td className="p-4 text-gray-600">{p.mobile}</td>
                    <td className="p-4 text-gray-600">{p.village}</td>
                    <td className="p-4 text-gray-600">{p.competitionId?.name || 'Unknown'}</td>
                    <td className="p-4 text-gray-600">{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsList;
