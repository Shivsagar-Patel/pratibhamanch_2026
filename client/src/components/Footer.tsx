const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white text-xl font-bold mb-4">प्रतिभामंच 2026</h3>
          <p className="text-sm">
            गाँव कोई भी हो — मंच आपका है!
            ज्ञान, प्रतिभा और प्रतियोगिता का अनूठा संगम।
          </p>
        </div>
        <div>
          <h3 className="text-white text-xl font-bold mb-4">आयोजक</h3>
          <p className="font-semibold text-orange-400">वन्दे मातरम् परिवार, रेगवां</p>
          <p className="text-sm mt-2">स्थान: श्रीराम मंदिर के सामने, रेगवां</p>
          <p className="text-sm">दिनांक: 7, 8 और 9 नवंबर 2026</p>
        </div>
        <div>
          <h3 className="text-white text-xl font-bold mb-4">संपर्क सूत्र</h3>
          <p className="text-sm">अधिक जानकारी के लिए आयोजन समिति से संपर्क करें।</p>
          <div className="mt-4">
             {/* Admin Login Link */}
             <a href="/admin/login" className="text-xs text-gray-600 hover:text-gray-400">Admin Login</a>
          </div>
        </div>
      </div>
      <div className="text-center text-sm text-gray-500 mt-10 border-t border-gray-800 pt-6">
        &copy; 2026 वन्दे मातरम् परिवार. सर्वाधिकार सुरक्षित।
      </div>
    </footer>
  );
};

export default Footer;
