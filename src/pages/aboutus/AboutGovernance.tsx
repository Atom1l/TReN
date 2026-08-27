// import React from 'react';
// import { useLanguage } from '../../contexts/LanguageContext';

// const AboutGovernance: React.FC = () => {
//   const { t } = useLanguage();

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-blue-200 pb-20 tracking-wide">
//       {/* Decorative Background */}
//       <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/70 to-transparent -z-10 pointer-events-none"></div>

//       {/* ใช้ max-w-4xl เพื่อให้เนื้อหาที่สั้น ดูไม่โล่งจนเกินไปและจัดกึ่งกลางได้สวยงาม */}
//       <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16 md:py-24 mt-1">
        
//         {/* Header Section */}
//         <section className="mb-12 md:mb-16 relative text-center md:text-left">
//           <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
//             {t('governance_main_title') || 'กรอบการทำงาน'}
//             <span className="block text-3xl md:text-4xl lg:text-5xl text-slate-400 mt-3 font-medium tracking-normal">
//               {t('governance_subtitle') || 'Governance & Charter'}
//             </span>
//           </h1>
//           <div className="w-20 h-1.5 bg-[#1e3a8a] mt-8 rounded-full mx-auto md:mx-0"></div>
//         </section>

//         {/* Document Card Section */}
//         <section className="mt-12">
//           <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center gap-8 md:gap-12 hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group">
            
//             {/* Subtle Abstract Background */}
//             <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none group-hover:bg-blue-100 transition-colors duration-500"></div>

//             {/* Document Icon (Red tint for PDF) */}
//             <div className="shrink-0 w-28 h-28 md:w-32 md:h-32 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
//               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-14 h-14 md:w-16 md:h-16">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
//               </svg>
//             </div>

//             {/* Content & Button */}
//             <div className="flex-1 text-center md:text-left relative z-10">
//               <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 leading-snug">
//                 {t('governance_doc_title') || 'ธรรมนูญเครือข่าย (TReN Charter)'}
//               </h3>
//               <p className="text-slate-600 font-light mb-8 text-lg leading-relaxed">
//                 {t('governance_doc_desc') || 'เอกสารระบุโครงสร้างการบริหารจัดการ บทบาทหน้าที่ ข้อตกลงร่วมกัน และแนวทางการดำเนินงานของเครือข่าย TReN อย่างเป็นทางการ'}
//               </p>
              
//               {/* PDF Button */}
//               <a 
//                 href="/path-to-your-tren-charter.pdf" 
//                 target="_blank" 
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center gap-3 bg-[#1e3a8a] hover:bg-blue-800 text-white font-medium text-lg px-8 py-4 rounded-xl transition-all hover:-translate-y-1 shadow-md hover:shadow-blue-900/20 active:scale-95"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
//                 </svg>
//                 {t('governance_btn_download') || 'เปิดอ่าน / ดาวน์โหลด PDF'}
//               </a>
//             </div>

//           </div>
//         </section>

//       </div>
//     </div>
//   );
// };

// export default AboutGovernance;

import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AboutGovernance: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-[#F8FAFC] font-sans selection:bg-blue-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 md:pt-24 pb-10">
        
        {/* Header Section */}
        <section className="max-w-4xl mb-12 relative mx-auto md:mx-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
            {t('governance_main_title') || 'กรอบการทำงาน'}
            <span className="block text-3xl md:text-4xl lg:text-5xl text-slate-400 mt-3 font-medium tracking-normal">
              {t('governance_subtitle') || 'Governance & Charter'}
            </span>
          </h1>
          <div className="w-20 h-1.5 bg-[#1e3a8a] mt-8 mb-10 rounded-full"></div>
        </section>

        {/* Content & PDF Embed Section */}
        <section className="space-y-8">
          
          {/* ข้อความอธิบายแบบเรียบง่าย (Boxless) */}
          <div className="max-w-4xl">
            <h3 className="text-3xl font-bold text-[#1e3a8a] mb-4">
              {t('governance_doc_title') || 'ธรรมนูญเครือข่าย (TReN Charter)'}
            </h3>
            <p className="text-2xl text-slate-800 font-light leading-relaxed">
              {t('governance_doc_desc') || 'เอกสารระบุโครงสร้างการบริหารจัดการ บทบาทหน้าที่ ข้อตกลงร่วมกัน และแนวทางการดำเนินงานของเครือข่าย TReN อย่างเป็นทางการ'}
            </p>
          </div>

          {/* PDF Embed Area */}
          <div className="w-full bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden flex flex-col">
            
            {/* 
              จุดฝัง PDF: 
              กำหนด height ให้คงที่ (เช่น h-[60vh] สำหรับมือถือ และ h-[800px] สำหรับจอคอม) 
              เพื่อให้ผู้ใช้เลื่อนอ่านในกรอบได้ 
            */}
            <object 
              data="/public/pdf/tst1.pdf" 
              type="application/pdf" 
              className="w-full h-[60vh] md:h-[800px]"
            >
              {/* Fallback สำหรับเบราว์เซอร์หรือมือถือที่ไม่รองรับการแสดงผล PDF แบบฝัง */}
              <div className="flex flex-col items-center justify-center p-10 text-center h-64 bg-slate-50">
                <p className="text-xl text-slate-600 font-light mb-4">
                  {t('governance_pdf_fallback') || 'เบราว์เซอร์ของคุณไม่รองรับการแสดงผล PDF ในหน้าเว็บ'}
                </p>
              </div>
            </object>

            {/* แถบด้านล่าง (Footer) ของกรอบ PDF สำหรับปุ่มดาวน์โหลด */}
            <div className="bg-slate-50 border-t border-slate-200 p-4 md:px-8 flex justify-end items-center">
              <a 
                href="/public/pdf/tst1.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#1e3a8a] hover:bg-blue-800 text-white font-medium text-xl px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5 shadow-md hover:shadow-blue-900/20 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                {t('governance_btn_download') || 'ดาวน์โหลด PDF'}
              </a>
            </div>
            
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutGovernance;