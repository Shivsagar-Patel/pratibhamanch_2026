import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const schema = yup.object({
  competitionId: yup.string().required('प्रतियोगिता का चयन करें'),
  participantName: yup.string().required('प्रतिभागी का नाम अनिवार्य है'),
  fatherName: yup.string().required('पिता का नाम अनिवार्य है'),
  village: yup.string().required('गाँव का नाम अनिवार्य है'),
  className: yup.string(),
  mobile: yup.string().matches(/^[0-9]{10}$/, 'सही 10 अंकों का मोबाइल नंबर दर्ज करें').required('मोबाइल नंबर अनिवार्य है'),
  studentStatus: yup.boolean().oneOf([true], 'विद्यार्थी होना अनिवार्य है').required(),
  category: yup.string()
});

const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      competitionId: searchParams.get('competition') || '',
      studentStatus: false
    }
  });

  const selectedCompId = watch('competitionId');
  const selectedComp = competitions.find(c => c._id === selectedCompId);

  useEffect(() => {
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

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiUrl}/api/participants/register`, data);
      toast.success('पंजीयन सफल हुआ!');
      navigate(`/receipt/${res.data.participant._id}`, { state: res.data });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'पंजीयन में त्रुटि हुई।');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-orange-600" /></div>;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-orange-600 py-6 px-8 text-center text-white">
          <h1 className="text-3xl font-bold">प्रतिभागी पंजीयन फॉर्म</h1>
          <p className="mt-2 text-orange-100">प्रतिभामंच 2026 में आपका स्वागत है</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          {/* Competition Selection */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">प्रतियोगिता चुनें *</label>
            <select 
              {...register('competitionId')} 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">-- चयन करें --</option>
              {competitions.map(comp => (
                <option key={comp._id} value={comp._id}>{comp.name}</option>
              ))}
            </select>
            {errors.competitionId && <p className="text-red-500 text-sm mt-1">{errors.competitionId.message}</p>}
          </div>

          {selectedComp && selectedComp.categories && selectedComp.categories.length > 0 && selectedComp.slug !== 'chess' && (
            <div>
              <label className="block text-gray-700 font-semibold mb-2">श्रेणी (Category) *</label>
              <select 
                {...register('category')} 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">-- चयन करें --</option>
                {selectedComp.categories.map((cat: string) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">प्रतिभागी का नाम *</label>
              <input 
                type="text" 
                {...register('participantName')} 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="पूरा नाम"
              />
              {errors.participantName && <p className="text-red-500 text-sm mt-1">{errors.participantName.message}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2">पिता का नाम *</label>
              <input 
                type="text" 
                {...register('fatherName')} 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.fatherName && <p className="text-red-500 text-sm mt-1">{errors.fatherName.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">गाँव का नाम *</label>
              <input 
                type="text" 
                {...register('village')} 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.village && <p className="text-red-500 text-sm mt-1">{errors.village.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">मोबाइल नंबर *</label>
              <input 
                type="text" 
                {...register('mobile')} 
                maxLength={10}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="10 अंकों का नंबर"
              />
              {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">कक्षा (Class)</label>
              <input 
                type="text" 
                {...register('className')} 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required={selectedComp?.slug !== 'talent-hunt'}
              />
            </div>
          </div>

          <div className="mt-6 border-t pt-6">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input 
                type="checkbox" 
                {...register('studentStatus')}
                className="mt-1 h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <span className="text-gray-700 font-medium">
                "मैं पुष्टि करता/करती हूँ कि मैं विद्यार्थी हूँ और दी गई जानकारी सही है।" *
              </span>
            </label>
            {errors.studentStatus && <p className="text-red-500 text-sm mt-1 ml-8">{errors.studentStatus.message}</p>}
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
