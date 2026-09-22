/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

interface NewsSectionProps {
  announcements: any[];
  activitySnapshots: any[];
  successStories: any[];
  showcases: any[];
  publicRelations?: any[]; 
  memberWorks?: any[]; // 🟢 เพิ่ม prop สำหรับรับข้อมูล member_works 
  isLoading: boolean;
  onOpenInfoModal: (type: 'onsite' | 'online') => void;
}

const NewsSection: React.FC<NewsSectionProps> = memo(({ 
  announcements, activitySnapshots, successStories, showcases, publicRelations = [], memberWorks = [], isLoading, onOpenInfoModal 
}) => {
  const { t, language } = useLanguage();

  const formatNewsDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const combinedGeneralNews = [...publicRelations, ...announcements, ...activitySnapshots]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3); 

  return (
    <section className="bg-slate-50/50 py-16 md:py-28 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col gap-24">

        {/* ----- Info Cards สำหรับ Onsite / Online Mentoring ----- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
          <div onClick={() => onOpenInfoModal('onsite')} className="bg-white p-8 md:p-10 rounded-[2rem] border border-blue-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-start group">
            <div className="w-16 h-16 bg-blue-50 text-[#1e3a8a] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-[#1e3a8a] mb-4">{t('box_onsite_title') || 'รูปแบบการอบรม Onsite Training'}</h3>
            <p className="text-slate-500 text-lg md:text-xl font-light leading-relaxed mb-8 flex-1">{t('box_onsite_desc') || 'กระบวนการพัฒนาครูอย่างเป็นขั้นตอนตลอด 3 ระยะ เริ่มตั้งแต่ Workshop การทำวิจัย ลงมือปฏิบัติจริงในชั้นเรียน และนำเสนอผลงาน พร้อมโอบอุ้มด้วยระบบนิเวศการเรียนรู้'}</p>
            <div className="w-full pt-6 border-t border-slate-100 flex justify-end">
              <span className="text-[#1e3a8a] font-bold text-lg flex items-center gap-2 group-hover:underline group-hover:text-blue-600 transition-colors">
                {t('read_more') || 'อ่านเพิ่มเติม'} <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </span>
            </div>
          </div>

          <div onClick={() => onOpenInfoModal('online')} className="bg-white p-8 md:p-10 rounded-[2rem] border border-blue-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-start group">
            <div className="w-16 h-16 bg-blue-50 text-[#1e3a8a] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" /></svg>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-[#1e3a8a] mb-4">{t('box_online_title') || 'การให้คำปรึกษาออนไลน์ Online Mentoring'}</h3>
            <p className="text-slate-500 text-lg md:text-xl font-light leading-relaxed mb-8 flex-1">{t('box_online_desc') || 'การให้คำปรึกษาโดยครูพี่เลี้ยงผู้มีประสบการณ์ เน้นการสร้างพื้นที่ปลอดภัย รับฟังอย่างไม่ตัดสิน และใช้วิธีตั้งคำถามเชิงสะท้อนคิด เพื่อปลูกฝังให้ครูกลายเป็น Reflective Teacher'}</p>
            <div className="w-full pt-6 border-t border-slate-100 flex justify-end">
              <span className="text-[#1e3a8a] font-bold text-lg flex items-center gap-2 group-hover:underline group-hover:text-blue-600 transition-colors">
                {t('read_more') || 'อ่านเพิ่มเติม'} <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </span>
            </div>
          </div>
        </div>

        {/* ----- 1. ประชาสัมพันธ์และกิจกรรม (PR & Activity Snapshots) ----- */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 border-b-2 border-slate-200 pb-4">
            <div className="flex items-center gap-4">
              <div className="text-emerald-500 bg-emerald-50 p-3 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold text-slate-800">{t('news_activity') || 'ข่าวสารกิจกรรม'}</h3>
            </div>
            <Link to="/news" className="text-[#1e3a8a] text-lg font-medium hover:underline cursor-pointer flex items-center gap-2">
              {t('view_all') || 'ดูทั้งหมด'} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {isLoading ? (
              Array(3).fill(0).map((_, i) => <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-3xl"></div>)
             ) : combinedGeneralNews.length > 0 ? (
              combinedGeneralNews.map(news => (
                <Link 
                  key={news.id} 
                  to={`/news/${news.id}`} 
                  className="block relative rounded-3xl overflow-hidden h-64 sm:h-72 lg:h-80 group shadow-md border border-slate-100 cursor-pointer transform-gpu"
                >
                  {news.thumbnail_url ? (
                    <img 
                      src={news.thumbnail_url} 
                      loading="lazy" 
                      decoding="async" 
                      alt={news.title} 
                      className="w-full h-full object-cover transform-gpu will-change-transform backface-hidden group-hover:scale-105 transition-transform duration-700 ease-out" 
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 text-xl">No Image</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
                    <p className="text-emerald-400 font-bold text-sm mb-2">{formatNewsDate(news.created_at)}</p>
                    <h4 className="text-white font-bold line-clamp-2 text-xl sm:text-2xl leading-snug">{news.title}</h4>
                  </div>
                </Link>
              ))
             ) : (
              <div className="col-span-full text-slate-400 text-lg text-center py-16 border border-dashed border-slate-200 rounded-3xl">{t('no_news') || 'ยังไม่มีข่าวประชาสัมพันธ์ล่าสุด'}</div>
             )}
          </div>
        </div>

        {/* ----- 2. งานวิจัยเด่น (Showcases) ----- */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 border-b-2 border-slate-200 pb-4">
            <div className="flex items-center gap-4">
              <div className="text-blue-500 bg-blue-50 p-3 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold text-slate-800">{t('showcases') || 'งานวิจัยเด่น (EAR Showcases)'}</h3>
            </div>
            <Link to="/showcases" className="text-[#1e3a8a] text-lg font-medium hover:underline cursor-pointer flex items-center gap-2">
              {t('view_all') || 'ดูทั้งหมด'} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
               Array(3).fill(0).map((_, i) => <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-3xl"></div>)
            ) : showcases.length > 0 ? (
              showcases.map((showcase, index) => (
                <Link 
                  key={index} 
                  to={`/showcase/${showcase.id}`} 
                  className="flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group"
                >
                  <div className="h-48 sm:h-56 bg-slate-200 overflow-hidden relative">
                    {showcase.thumbnail_url ? (
                      <img src={showcase.thumbnail_url} loading="lazy" decoding="async" alt={showcase.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-lg bg-slate-100">No Image</div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h4 className="text-xl font-bold text-[#1e3a8a] line-clamp-2 leading-snug group-hover:underline mb-2">{showcase.title}</h4>
                    <p className="text-sm text-slate-500 mt-auto pt-4 border-t border-slate-50 line-clamp-1">
                      {t('by_author') || 'โดย'} {showcase.author_data ? (typeof showcase.author_data === 'string' ? JSON.parse(showcase.author_data)[0]?.name : showcase.author_data[0]?.name) : showcase.author_name || 'Unknown'}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-slate-400 text-lg text-center py-16 border border-dashed border-slate-200 rounded-3xl">{t('no_showcases') || 'ยังไม่มีงานวิจัยเด่น'}</div>
            )}
          </div>
        </div>

        {/* 🟢 3. รวมผลงานสมาชิก (Member Portfolios/Works) ----- */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 border-b-2 border-slate-200 pb-4">
            <div className="flex items-center gap-4">
              <div className="text-pink-600/90 bg-pink-50 p-3 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" /></svg>
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold text-slate-800">{t('member_portfolios') || 'รวมผลงานสมาชิก'}</h3>
            </div>
            {/* 💡 ลิงก์ไปยังหน้า AllMemberWorks.tsx */}
            <Link to="/member-works" className="text-[#1e3a8a] text-lg font-medium hover:underline cursor-pointer flex items-center gap-2">
              {t('view_all') || 'ดูทั้งหมด'} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
               /* 💡 ปรับให้ Loading แสดง 3 กล่องขนาดเท่า Showcase */
               Array(3).fill(0).map((_, i) => <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-3xl"></div>)
            ) : memberWorks && memberWorks.length > 0 ? (
              memberWorks.map((work) => (
                <Link 
                  key={work.id} 
                  to={`/member-work/${work.id}`} 
                  className="flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group"
                >
                  <div className="h-48 sm:h-56 bg-slate-200 overflow-hidden relative">
                    {work.thumbnail_url ? (
                      <img src={work.thumbnail_url} loading="lazy" decoding="async" alt={work.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-lg bg-slate-100">No Image</div>
                    )}
                  </div>
                  {/* 💡 ปรับ Padding เป็น p-6 ให้เท่า Showcase */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h4 className="text-xl font-bold text-[#1e3a8a] line-clamp-2 leading-snug group-hover:underline mb-2">{work.title}</h4>
                    {/* 💡 ปรับ text-sm และ pt-4 ให้เท่า Showcase */}
                    <p className="text-sm text-slate-500 mt-auto pt-4 border-t border-slate-50 line-clamp-1">
                      {t('by_author') || 'โดย'} {work.author_name || 'Unknown'}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-slate-400 text-lg text-center py-16 border border-dashed border-slate-200 rounded-3xl">
                {t('no_member_works_found') || 'ยังไม่มีผลงานสมาชิกในขณะนี้'}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
});

export default NewsSection;