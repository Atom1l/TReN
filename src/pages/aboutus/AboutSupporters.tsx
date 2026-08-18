import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AboutSupporter: React.FC = () => {
  const { t } = useLanguage();

  const sponsors = [
    {
      name: t('sponsor_british_council') || 'British Council Thailand',
      logoUrl: '/Sponsors_logo/BritishCouncil_Logo.png', // เปลี่ยนเป็น path รูปโลโก้เมื่อมีไฟล์ เช่น '/logos/british-council.png'
    },
    {
      name: t('sponsor_kmutt') || 'คณะศิลปศาสตร์ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี (มจธ.)',
      logoUrl: '/Sponsors_logo/Kmutt_Logo.png', 
    },
    {
      name: t('sponsor_eef') || 'กองทุนเพื่อความเสมอภาคทางการศึกษา (กสศ.)',
      logoUrl: '/Sponsors_logo/Eef_Logo.png', 
    },
    {
      name: t('sponsor_obec') || 'สำนักวิชาการและมาตรฐานการศึกษา สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน (สพฐ.) กระทรวงศึกษาธิการ',
      logoUrl: '/Sponsors_logo/Spt_Logo.png', 
    },
    {
      name: t('sponsor_relo') || 'Regional English Language Office (RELO) สถานเอกอัครราชทูตสหรัฐอเมริกา',
      logoUrl: '/Sponsors_logo/USA_Logo.jpg', 
    },
    {
      name: t('sponsor_ptt') || 'บริษัท ปตท. จำกัด (มหาชน)',
      logoUrl: '/Sponsors_logo/PTT_Logo.jpg', 
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-blue-200 pb-20 tracking-wide">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/70 to-transparent -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24 mt-1">
        
        {/* Header Section */}
        <section className="max-w-4xl mb-16 relative text-center md:text-left mx-auto md:mx-0">
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
          <div className="max-w-4xl mx-auto md:mx-0">
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-light mb-6">
              {t('sponsors_intro') || 'ความสำเร็จและการเติบโตอย่างยั่งยืนของเครือข่าย TReN เกิดขึ้นได้ด้วยวิสัยทัศน์และการสนับสนุนอันทรงคุณค่าจากองค์กรพันธมิตรทุกภาคส่วน ที่ร่วมผสานพลังในการพัฒนาศักยภาพครูไทย และยกระดับคุณภาพการศึกษาอย่างต่อเนื่อง'}
            </p>
            <p className="text-xl font-bold text-slate-800">
              {t('sponsors_thank_you') || 'ทางเครือข่าย TReN ขอขอบพระคุณองค์กรพันธมิตรทุกแห่งเป็นอย่างยิ่ง:'}
            </p>
          </div>
        </section>

        {/* Sponsor Logos Grid */}
        <section className="mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {sponsors.map((sponsor, index) => (
              <div 
                key={index} 
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all duration-300 flex flex-col items-center text-center group"
              >
                {/* Logo Image Placeholder */}
                <div className="w-full h-32 md:h-40 bg-slate-50 rounded-2xl flex items-center justify-center p-4 mb-6 group-hover:bg-blue-50/50 transition-colors">
                  {sponsor.logoUrl ? (
                    <img 
                      src={sponsor.logoUrl} 
                      alt={sponsor.name} 
                      className="max-w-full max-h-full object-contain mix-blend-multiply filter group-hover:grayscale-0 transition-all duration-500"
                    />
                  ) : (
                    <span className="text-slate-300 font-medium text-sm">
                      [ Logo Placeholder ]
                    </span>
                  )}
                </div>
                
                {/* Partner Name */}
                <h3 className="text-base md:text-lg font-bold text-slate-700 leading-snug mt-auto">
                  {sponsor.name}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* Outro Section */}
        <section>
          <div className="bg-gradient-to-br from-[#1e3a8a] to-blue-800 rounded-3xl p-8 md:p-12 text-center shadow-lg relative overflow-hidden">
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-white rounded-full blur-3xl opacity-10 pointer-events-none"></div>
            <p className="text-xl md:text-2xl text-blue-50 font-medium leading-relaxed relative z-10 max-w-4xl mx-auto">
              "{t('sponsors_outro') || 'ทุกการสนับสนุนคือพลังสำคัญในการขับเคลื่อนครูไทยสู่การเป็นผู้นำการเปลี่ยนแปลง เพื่อส่งต่อการเรียนรู้ที่มีคุณภาพให้แก่นักเรียนทั่วประเทศ'}"
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutSupporter;