import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AchievementsSection = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-[#1e3a8a] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-black text-white">{t('our_mission') || 'ผลงานตลอด 5 ปีที่ผ่านมา'}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col items-center text-center group transform hover:-translate-y-2">
            <div className="w-24 h-24 bg-blue-50 text-[#1e3a8a] rounded-full flex items-center justify-center mb-8 group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
            </div>
            <h3 className="text-5xl lg:text-7xl font-black text-[#1e3a8a] mb-4">{t('three_hundred_plus') || '300+'}</h3>
            <h4 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-3">{t('registered_teachers') || 'ครูผู้เข้าร่วมโครงการ'}</h4>
            <div className="text-xl text-slate-500 font-light leading-relaxed whitespace-pre-line">{t('over_provinces') || 'ครอบคลุม'}<span className='text-[#1e3a8a] font-bold'> {t('over_provinces2') || '50 จังหวัด'}</span><p>{t('over_provinces3') || 'ทั่วประเทศ'}</p></div>
          </div>
          <div className="bg-white p-10 rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col items-center text-center group transform hover:-translate-y-2">
            <div className="w-24 h-24 bg-blue-50 text-[#1e3a8a] rounded-full flex items-center justify-center mb-8 group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
            </div>
            <h3 className="text-5xl lg:text-7xl font-black text-[#1e3a8a] mb-4">{t('one_hundred_fifty_plus') || '150+'}</h3>
            <h4 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-3">{t('research_projects') || 'ผลงานวิจัยในชั้นเรียน'}</h4>
            <p className="text-xl text-slate-500 font-light leading-relaxed whitespace-pre-line">{t('already_published') || 'ได้รับการตีพิมพ์เผยแพร่\nแล้วกว่า'}<br/><span className="font-bold text-[#1e3a8a]">{t('fifty_research_articles') || '50 เรื่อง'}</span></p>
          </div>
          <div className="bg-white p-10 rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col items-center text-center group transform hover:-translate-y-2">
            <div className="w-24 h-24 bg-blue-50 text-[#1e3a8a] rounded-full flex items-center justify-center mb-8 group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" /></svg>
            </div>
            <h3 className="text-5xl lg:text-7xl font-black text-[#1e3a8a] mb-4">{t('fifty_teachers') || '50'}</h3>
            <h4 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-3">{t('mentors') || 'ครูพี่เลี้ยงวิจัย (Mentor)'}</h4>
            <p className="text-xl text-slate-500 font-light leading-relaxed whitespace-pre-line">{t('already_trained') || 'ที่ผ่านการพัฒนาศักยภาพและพร้อมทำหน้าที่หนุนเสริมเพื่อนครูในพื้นที่'}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;