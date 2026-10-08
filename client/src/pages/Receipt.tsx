import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Download } from 'lucide-react';

const Receipt = () => {
  const location = useLocation();
  const data = location.state;

  if (!data) {
    return <div className="text-center p-20">No receipt data found. <Link to="/" className="text-orange-600 underline">Go Home</Link></div>;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden" id="receipt-card">
        <div className="bg-green-600 py-8 px-8 text-center text-white">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-200" />
          <h1 className="text-3xl font-bold">पंजीयन सफल हुआ!</h1>
          <p className="mt-2 text-green-100">प्रतिभामंच 2026 में जुड़ने के लिए धन्यवाद</p>
        </div>
        
        <div className="p-8">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 mb-8 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-4 text-gray-500 text-sm font-bold tracking-widest">
              रसीद विवरण
            </div>
            
            <table className="w-full text-left">
              <tbody>
                <tr className="border-b border-gray-100">
                  <th className="py-3 text-gray-600 font-medium w-1/3">Registration ID</th>
                  <td className="py-3 text-gray-900 font-bold text-lg">{data.participant.registrationId}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <th className="py-3 text-gray-600 font-medium">प्रतियोगिता</th>
                  <td className="py-3 text-gray-900 font-semibold">{data.competition.name}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <th className="py-3 text-gray-600 font-medium">प्रतिभागी का नाम</th>
                  <td className="py-3 text-gray-900">{data.participant.participantName}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <th className="py-3 text-gray-600 font-medium">पिता का नाम</th>
                  <td className="py-3 text-gray-900">{data.participant.fatherName}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <th className="py-3 text-gray-600 font-medium">मोबाइल नंबर</th>
                  <td className="py-3 text-gray-900">{data.participant.mobile}</td>
                </tr>
                <tr>
                  <th className="py-3 text-gray-600 font-medium">गाँव</th>
                  <td className="py-3 text-gray-900">{data.participant.village}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center print:hidden">
            <button 
              onClick={handlePrint}
              className="flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-bold transition"
            >
              <Download className="w-5 h-5 mr-2" />
              पंजीयन रसीद डाउनलोड करें / Print
            </button>
            <Link 
              to="/"
              className="flex items-center justify-center bg-orange-100 hover:bg-orange-200 text-orange-700 px-6 py-3 rounded-lg font-bold transition"
            >
              होमपेज पर जाएं
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
