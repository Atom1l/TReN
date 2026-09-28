import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AchievementsSection = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-[#1e3a8a] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white">
            {t('our_mission') || 'ผลงานตลอด 5 ปีที่ผ่านมา'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: รูปครูนั่งสัมมนาเป็นกลุ่ม */}
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col group transform hover:-translate-y-2">
            <div className="w-full aspect-video bg-slate-100 rounded-xl mb-6 overflow-hidden relative flex items-center justify-center">
              {/* 💡 ใส่ src ของรูปครูนั่งสัมมนากันเป็นกลุ่มที่นี่ */}
              <img src="../Training/Onsite_8.webp" alt="สัมมนาครู" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-10" />
              <span className="absolute text-slate-400 text-sm font-medium px-4 text-center z-0">
                [ภาพครูนั่งสัมมนากันเป็นกลุ่ม]
              </span>
            </div>
            
            {/* 💡 ปรับฟอนต์ให้ไซส์เดียวกันทั้งหมด รวมตัวเลขและข้อความเข้าด้วยกัน */}
            <p className="text-lg md:text-xl text-slate-800 font-light leading-relaxed">
              <strong className="font-bold text-[#1e3a8a]">{t('three_hundred_plus') || '300+'} {t('registered_teachers') || 'ครูผู้เข้าร่วมโครงการ'}</strong> {t('over_provinces') || 'ครอบคลุม'} <strong className='text-[#1e3a8a] font-bold'>{t('over_provinces2') || '50 จังหวัด'}</strong> {t('over_provinces3') || 'ทั่วประเทศ'}
            </p>
          </div>

          {/* Card 2: รูป Poster งานวิจัย */}
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col group transform hover:-translate-y-2">
            <div className="w-full aspect-video bg-slate-100 rounded-xl mb-6 overflow-hidden relative flex items-center justify-center">
              {/* 💡 ใส่ src ของรูป Poster งานวิจัย (จากหนังสือเล่ม 2) ที่นี่ */}
              <img src="../Training/Poster_1.webp" alt="Poster งานวิจัย" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-10" />
              <span className="absolute text-slate-400 text-sm font-medium px-4 text-center z-0">
                [ภาพ Poster งานวิจัย จากหนังสือเล่ม 2]
              </span>
            </div>
            
            {/* 💡 ปรับฟอนต์ให้ไซส์เดียวกันทั้งหมด รวมตัวเลขและข้อความเข้าด้วยกัน */}
            <p className="text-lg md:text-xl text-slate-800 font-light leading-relaxed">
              <strong className="font-bold text-[#1e3a8a]">{t('one_hundred_fifty_plus') || '150+'} {t('research_projects') || 'ผลงานวิจัยในชั้นเรียน'}</strong> {t('already_published') || 'ได้รับการตีพิมพ์เผยแพร่แล้วกว่า'} <strong className="text-[#1e3a8a] font-bold">{t('fifty_research_articles') || '50 เรื่อง'}</strong>
            </p>
          </div>

          {/* Card 3: รูปคนยืนบรรยาย (Mentor) */}
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col group transform hover:-translate-y-2">
            <div className="w-full aspect-video bg-slate-100 rounded-xl mb-6 overflow-hidden relative flex items-center justify-center">
              {/* 💡 ใส่ src ของรูปคนยืนบรรยาย (Mentor) ที่นี่ */}
              <img src="../Training/Onsite_13.webp" alt="Mentor บรรยาย" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-10" />
              <span className="absolute text-slate-400 text-sm font-medium px-4 text-center z-0">
                [ภาพครูพี่เลี้ยง (Mentor) ยืนบรรยาย]
              </span>
            </div>
            
            {/* 💡 ปรับฟอนต์ให้ไซส์เดียวกันทั้งหมด รวมตัวเลขและข้อความเข้าด้วยกัน */}
            <p className="text-lg md:text-xl text-slate-800 font-light leading-relaxed">
              <strong className="font-bold text-[#1e3a8a]">{t('fifty_teachers') || '50'} {t('mentors') || 'ครูพี่เลี้ยงวิจัย (Mentor)'}</strong> {t('already_trained') || 'ที่ผ่านการพัฒนาศักยภาพและพร้อมทำหน้าที่หนุนเสริมเพื่อนครูในพื้นที่'}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;