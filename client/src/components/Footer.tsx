import logoImg from '../assets/logo.png';

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-[#0d1b36] text-gray-300 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logoImg} alt="Logo" className="h-12 w-12 rounded-full object-cover border-2 border-[#FF9933]" />
            <div>
              <h3 className="text-[#FF9933] text-base font-extrabold leading-tight">वन्दे मातरम् परिवार, रेगवाँ</h3>
              <p className="text-gray-400 text-xs">राष्ट्र सर्वोपरि</p>
            </div>
          </div>
          <h4 className="text-white text-lg font-bold mb-2">प्रतिभामंच 2026</h4>
          <p className="text-sm">
            गाँव कोई भी हो — मंच आपका है!
            ज्ञान, प्रतिभा और प्रतियोगिता का अनूठा संगम।
          </p>
        </div>
        <div>
          <h3 className="text-white text-xl font-bold mb-4">आयोजक</h3>
          <p className="font-semibold text-[#FF9933]">वन्दे मातरम् परिवार, रेगवाँ</p>
          <p className="text-sm mt-2">स्थान: श्रीराम मंदिर के सामने, रेगवां</p>
          <p className="text-sm">दिनांक: 7, 8 और 9 नवंबर 2026</p>
        </div>
        <div>
          <h3 className="text-[#FF9933] text-xl font-bold mb-4">संपर्क सूत्र</h3>
          <p className="text-sm mb-3 text-gray-300">अधिक जानकारी के लिए सीधा संपर्क करें।</p>
          <div className="space-y-2.5">
            <a href="tel:9302428721" className="flex items-center gap-2 text-[#FF9933] hover:text-orange-300 font-semibold text-base transition">
              📞 9302428721
            </a>
            <a href="tel:9617125922" className="flex items-center gap-2 text-[#FF9933] hover:text-orange-300 font-semibold text-base transition">
              📞 9617125922
            </a>
            <a 
              href="https://www.instagram.com/vande_matram_parivar" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 text-[#FF9933] hover:text-orange-300 font-semibold text-base transition pt-1"
            >
              <InstagramIcon className="w-5 h-5 text-[#FF9933]" /> @vande_matram_parivar
            </a>
          </div>
          <div className="mt-4">
             <a href="/admin/login" className="text-xs text-gray-600 hover:text-gray-400">Admin Login</a>
          </div>
        </div>
      </div>
      <div className="text-center text-sm text-gray-500 mt-10 border-t border-gray-800 pt-6">
        &copy; 2026 वन्दे मातरम् परिवार, रेगवाँ | राष्ट्र सर्वोपरि | सर्वाधिकार सुरक्षित।
      </div>
    </footer>
  );
};

export default Footer;
