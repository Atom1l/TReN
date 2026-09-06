import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AboutSupporter: React.FC = () => {
  const { t } = useLanguage();

  const sponsors = [
    {
      name: t('sponsor_british_council') || 'British Council Thailand',
      logoUrl: '/Sponsors_logo/BritishCouncil_Logo.png', 
    },
    {
      name: t('sponsor_obec') || 'สำนักวิชาการและมาตรฐานการศึกษา สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน (สพฐ.) กระทรวงศึกษาธิการ',
      logoUrl: '/Sponsors_logo/Spt_Logo.png', 
    },
    {
      name: t('sponsor_eef') || 'กองทุนเพื่อความเสมอภาคทางการศึกษา (กสศ.)',
      logoUrl: '/Sponsors_logo/Eef_Logo.png', 
    },
    {
      name: t('sponsor_ptt') || 'บริษัท ปตท. จำกัด (มหาชน)',
      logoUrl: '/Sponsors_logo/PTT_Logo.jpg', 
    },
    {
      name: t('sponsor_relo') || 'Regional English Language Office (RELO) สถานเอกอัครราชทูตสหรัฐอเมริกา',
      logoUrl: '/Sponsors_logo/USA_Logo.jpg', 
    },
    {
      name: t('sponsor_kmutt') || 'คณะศิลปศาสตร์ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี (มจธ.)',
      logoUrl: '/Sponsors_logo/Kmutt_Logo.png', 
    },
    {
      name: t('sponsor_thailand_tesol') || 'สมาคมครูผู้สอนภาษาอังกฤษแห่งประเทศไทย (Thailand TESOL)',
      logoUrl: '/Sponsors_logo/TESOL_Logo.jpg', //
    }
  ];

  return (
    <div className="w-full bg-[#F8FAFC] font-sans selection:bg-blue-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 md:pt-24 pb-24">
        
        {/* Header Section */}
        <section className="max-w-4xl mb-12 md:mb-16 relative text-center md:text-left mx-auto md:mx-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
            {t('sponsors_main_title') || 'องค์กรพันธมิตรและผู้สนับสนุน'}
            <span className="block text-3xl md:text-4xl lg:text-5xl text-slate-400 mt-3 font-medium tracking-normal">
              {t('sponsors_subtitle') || 'Our Partners & Sponsors'}
            </span>
          </h1>
          <div className="w-20 h-1.5 bg-[#1e3a8a] mt-8 rounded-full mx-auto md:mx-0"></div>
        </section>

        {/* Intro Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto md:mx-0 space-y-8">
            <p className="text-2xl text-slate-800 leading-relaxed font-light">
              {t('sponsors_intro') || 'ความสำเร็จและการเติบโตอย่างยั่งยืนของเครือข่าย TReN เกิดขึ้นได้ด้วยวิสัยทัศน์และการสนับสนุนอันทรงคุณค่าจากองค์กรพันธมิตรทุกภาคส่วน ที่ร่วมผสานพลังในการพัฒนาศักยภาพครูไทย และยกระดับคุณภาพการศึกษาอย่างต่อเนื่อง'}
            </p>
            <p className="text-2xl font-bold text-[#1e3a8a]">
              {t('sponsors_thank_you') || 'ทางเครือข่าย TReN ขอขอบพระคุณองค์กรพันธมิตรทุกแห่งเป็นอย่างยิ่ง:'}
            </p>
          </div>
        </section>

        {/* Sponsor Logos Grid */}
        <section className="mb-20">
          {/* ปรับเป็น Grid 12 คอลัมน์ สำหรับจอ Desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-8">
            {sponsors.map((sponsor, index) => {
              // เช็กว่าเป็น 3 ตัวแรก (แถวบน) หรือไม่
              const isTopRow = index < 3;

              return (
                <div 
                  key={index} 
                  className={`
                    bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all duration-300 group
                    flex flex-col h-full
                    col-span-1 sm:col-span-1 
                    ${isTopRow ? 'lg:col-span-4' : 'lg:col-span-3'} 
                  `}
                >
                  {/* Logo Image Area */}
                  {/* ล็อกความสูง h-32 เพื่อไม่ให้โลโก้ดันโครงสร้างการ์ดจนเบี้ยว */}
                  <div className="w-full h-32 flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-105 shrink-0">
                    {sponsor.logoUrl ? (
                      <img 
                        src={sponsor.logoUrl} 
                        alt={sponsor.name} 
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <span className="text-slate-300 font-medium text-sm border-2 border-dashed border-slate-200 p-4 rounded-xl w-full h-full flex items-center justify-center">
                        [ Logo Placeholder ]
                      </span>
                    )}
                  </div>
                  
                  {/* Partner Name */}
                  {/* flex-grow และ justify-end ช่วยดันข้อความที่ความยาวไม่เท่ากันให้ไปชิดขอบล่างเสมอ */}
                  <div className="flex-grow flex flex-col justify-end w-full text-center mt-auto">
                    <h3 className="text-base md:text-lg font-bold text-[#1e3a8a] leading-snug">
                      {sponsor.name}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Outro Section */}
        <section>
          <div className="bg-gradient-to-br from-[#1e3a8a] to-blue-800 rounded-3xl p-10 md:p-16 text-center shadow-lg relative overflow-hidden">
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-white rounded-full blur-3xl opacity-10 pointer-events-none"></div>
            <p className="text-2xl md:text-3xl text-blue-50 font-medium leading-relaxed relative z-10 max-w-5xl mx-auto">
              "{t('sponsors_outro') || 'ทุกการสนับสนุนคือพลังสำคัญในการขับเคลื่อนครูไทยสู่การเป็นผู้นำการเปลี่ยนแปลง เพื่อส่งต่อการเรียนรู้ที่มีคุณภาพให้แก่นักเรียนทั่วประเทศ'}"
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutSupporter;