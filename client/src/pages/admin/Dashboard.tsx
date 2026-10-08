import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Users, Activity } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = Cookies.get('adminToken');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${apiUrl}/api/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (error) {
        toast.error('Failed to load dashboard stats');
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div className="text-gray-500">Loading stats...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
          <div className="bg-orange-100 p-4 rounded-lg mr-4">
            <Users className="w-8 h-8 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Participants</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalParticipants}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
          <div className="bg-blue-100 p-4 rounded-lg mr-4">
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Competitions</p>
            <p className="text-3xl font-bold text-gray-900">{stats.activeCompetitions}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">Registrations by Competition</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.statsByCompetition.map((comp: any, idx: number) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-700 mb-2">{comp.name}</h3>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-bold text-gray-900">{comp.count}</span>
              <span className="text-sm text-gray-500">participants</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
