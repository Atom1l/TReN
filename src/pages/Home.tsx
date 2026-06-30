import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Home = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      
      {/* ================= 1. Hero Section ================= */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24 flex flex-col-reverse lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl lg:text-5xl font-black text-[#1e3a8a] leading-tight tracking-tight">
            {t('home_title') || 'ชื่อโปรเจกต์'} <br />
            <span className="text-2xl lg:text-3xl font-bold text-slate-600">(TReN.org)</span>
          </h1>
          <h2 className="text-xl lg:text-2xl font-bold text-slate-800">
            {t('home_subtitle') || 'แพลตฟอร์มการอบรมเชิงวิชาการ'}
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed max-w-xl">
            {t('home_description') || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum gravida, eros eget ullamcorper posuere, ligula diam sagittis erat, eget tristique dui mi acn ut libero. Ut eros lectus'}
          </p>
        </div>
        <div className="flex-1 w-full">
          {/* Placeholder สำหรับรูปภาพ หรือใส่ <img src="..." /> ของจริงตรงนี้ */}
          <div className="w-full aspect-[4/3] bg-slate-200 rounded-2xl shadow-lg overflow-hidden relative">
             <img 
               src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
               alt="Team Collaboration" 
               className="w-full h-full object-cover"
             />
          </div>
        </div>
      </section>

      {/* ================= 2. Mission Section (แถบสีฟ้า) ================= */}
      <section className="bg-[#E6F0FA] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-4">
            <h3 className="text-2xl font-bold text-slate-700">{t('what_we_do') || 'เราทำอะไรบ้าง?'}</h3>
            <h2 className="text-4xl lg:text-5xl font-black text-[#1e3a8a]">{t('our_mission') || 'ภารกิจของเรา'}</h2>
            <p className="text-slate-600 text-lg leading-relaxed max-w-xl pt-4">
              {t('mission_description') || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum gravida, eros eget ullamcorper posuere, ligula diam sagittis erat, eget tristique dui mi acn ut.'}
            </p>
            <div className="pt-4">
              <Link to="/about" className="text-[#1e3a8a] font-bold text-lg hover:underline underline-offset-4 decoration-2 transition-all">
                {t('learn_more') || 'เรียนรู้เพิ่มเติม'}
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center lg:justify-end w-full">
            {/* ไอคอนจำลองจากในรูป (วาดด้วย SVG) */}
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-64 h-64 sm:w-80 sm:h-80 drop-shadow-md">
              {/* Video Icon */}
              <rect x="110" y="30" width="60" height="45" rx="8" transform="rotate(-15 110 30)" stroke="#1e3a8a" strokeWidth="8" strokeLinejoin="round" fill="#E6F0FA"/>
              <path d="M175 20L190 35L180 50" stroke="#1e3a8a" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Folder Icon */}
              <path d="M30 110H70L85 130H130C135.5 130 140 134.5 140 140V180C140 185.5 135.5 190 130 190H30C24.5 190 20 185.5 20 180V120C20 114.5 24.5 110 30 110Z" stroke="#1e3a8a" strokeWidth="8" strokeLinejoin="round" fill="#E6F0FA"/>
              {/* Document Icon */}
              <rect x="100" y="90" width="55" height="75" rx="4" transform="rotate(15 100 90)" stroke="#1e3a8a" strokeWidth="8" strokeLinejoin="round" fill="#E6F0FA"/>
              <line x1="120" y1="110" x2="140" y2="115" stroke="#1e3a8a" strokeWidth="6" strokeLinecap="round"/>
              <line x1="115" y1="130" x2="145" y2="138" stroke="#1e3a8a" strokeWidth="6" strokeLinecap="round"/>
              <line x1="110" y1="150" x2="135" y2="157" stroke="#1e3a8a" strokeWidth="6" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </section>

      {/* ================= 3. Timeline Section ================= */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-700 mb-1">{t('timeline_subtitle') || 'แผนการดำเนินงาน'}</h3>
        <h2 className="text-3xl sm:text-4xl font-black text-[#1e3a8a]">{t('timeline_title') || 'ของ TReN.org'}</h2>

        <div className="relative w-full max-w-3xl mx-auto my-16 sm:my-20">
          {/* เส้นขีดแนวนอน */}
          <div className="absolute top-[14px] left-[10%] right-[10%] h-1 bg-[#D1E0F3]"></div>
          
          {/* จุดและข้อความ */}
          <div className="flex justify-between relative z-10">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center w-1/3">
              <div className="w-8 h-8 bg-[#1e3a8a] rounded-full border-4 border-white shadow-sm"></div>
              <h4 className="font-bold text-[#1e3a8a] text-sm sm:text-lg mt-4 sm:mt-6">{t('timeline_step1') || 'เริ่มต้นโปรเจกต์'}</h4>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">{t('timeline_date1') || 'มกราคม 2026'}</p>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center w-1/3">
              <div className="w-8 h-8 bg-[#1e3a8a] rounded-full border-4 border-white shadow-sm"></div>
              <h4 className="font-bold text-[#1e3a8a] text-sm sm:text-lg mt-4 sm:mt-6">{t('timeline_step2') || 'ขยับทำงาน'}</h4>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">{t('timeline_date2') || 'กุมภาพันธ์ 2026'}</p>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center w-1/3">
              <div className="w-8 h-8 bg-[#1e3a8a] rounded-full border-4 border-white shadow-sm"></div>
              <h4 className="font-bold text-[#1e3a8a] text-sm sm:text-lg mt-4 sm:mt-6">{t('timeline_step3') || 'เผยแพร่เว็บไซต์'}</h4>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">{t('timeline_date3') || 'กรกฎาคม 2026'}</p>
            </div>

          </div>
        </div>

        <Link 
          to="/about" // เปลี่ยน Path ไปยังหน้าที่ต้องการ
          className="inline-block border-2 border-[#1e3a8a] text-[#1e3a8a] font-bold px-8 py-3 rounded-full hover:bg-[#1e3a8a] hover:text-white transition-colors duration-300"
        >
          {t('view_full_timeline') || 'ดูไทม์ไลน์ฉบับเต็มที่นี่!'}
        </Link>
      </section>

      {/* ================= 4. Org Chart Section ================= */}
      <section className="max-w-5xl mx-auto px-6 py-12 pb-24 text-center">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-700 mb-1">{t('org_chart_subtitle') || 'แผนผังองค์กร'}</h3>
        <h2 className="text-3xl sm:text-4xl font-black text-[#1e3a8a] mb-12 sm:mb-16">{t('org_chart_title') || 'แผนผังองค์กรของเรา'}</h2>

        {/* CSS Tree Structure */}
        <div className="flex flex-col items-center w-full max-w-3xl mx-auto mb-12 sm:mb-16">
          
          {/* Top Node */}
          <div className="w-48 sm:w-64 h-16 sm:h-20 bg-[#253e7d] rounded-sm shadow-md"></div>
          
          {/* Stem from Top */}
          <div className="w-[2px] h-8 sm:h-10 bg-slate-400"></div>
          
          {/* Branching Container */}
          <div className="w-full sm:w-[85%] border-t-2 border-slate-400 flex justify-between">
            {/* Node 1 */}
            <div className="w-1/3 flex flex-col items-center relative">
              <div className="w-[2px] h-8 sm:h-10 bg-slate-400"></div>
              <div className="w-[90%] sm:w-48 h-16 sm:h-20 bg-[#253e7d] rounded-sm shadow-md"></div>
            </div>
            
            {/* Node 2 */}
            <div className="w-1/3 flex flex-col items-center relative">
              <div className="w-[2px] h-8 sm:h-10 bg-slate-400"></div>
              <div className="w-[90%] sm:w-48 h-16 sm:h-20 bg-[#253e7d] rounded-sm shadow-md"></div>
            </div>
            
            {/* Node 3 */}
            <div className="w-1/3 flex flex-col items-center relative">
              <div className="w-[2px] h-8 sm:h-10 bg-slate-400"></div>
              <div className="w-[90%] sm:w-48 h-16 sm:h-20 bg-[#253e7d] rounded-sm shadow-md"></div>
            </div>
          </div>

        </div>

        <Link 
          to="/about" // เปลี่ยน Path ไปยังหน้าที่ต้องการ
          className="inline-block border-2 border-[#1e3a8a] text-[#1e3a8a] font-bold px-8 py-3 rounded-full hover:bg-[#1e3a8a] hover:text-white transition-colors duration-300"
        >
          {t('view_full_org_chart') || 'ดูแผนผังองค์กรฉบับเต็มที่นี่!'}
        </Link>
      </section>

    </div>
  );
};

export default Home;