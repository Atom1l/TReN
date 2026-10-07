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
  memberWorks?: any[]; 
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
          
          {/* Card 1: Onsite Training */}
          <div onClick={() => onOpenInfoModal('onsite')} className="bg-blue-200 p-8 md:p-10 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-start group">
            <h3 className="text-2xl md:text-3xl font-bold text-[#1e3a8a] mb-4">{t('box_onsite_title') || 'รูปแบบการอบรม Onsite Training'}</h3>
            <p className="text-slate-800 text-lg md:text-xl font-light leading-relaxed mb-8 flex-1">
              {t('box_onsite_desc') || 'กระบวนการพัฒนาครูอย่างเป็นขั้นตอนตลอด 3 ระยะ เริ่มตั้งแต่ Workshop การทำวิจัย ลงมือปฏิบัติจริงในชั้นเรียน และนำเสนอผลงาน พร้อมโอบอุ้มด้วยระบบนิเวศการเรียนรู้'}
            </p>
            <div className="w-full pt-6 flex justify-end">
              <span className="bg-[#1e3a8a] text-white px-6 py-3 rounded-xl font-bold text-lg flex items-center gap-2 hover:bg-blue-900 hover:shadow-md transition-all duration-300 group-hover:translate-x-1">
                {t('read_more') || 'อ่านเพิ่มเติม'} <span aria-hidden="true">&rarr;</span>
              </span>
            </div>
          </div>

          {/* Card 2: Online Mentoring */}
          <div onClick={() => onOpenInfoModal('online')} className="bg-blue-200 p-8 md:p-10 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-start group">
            <h3 className="text-2xl md:text-3xl font-bold text-[#1e3a8a] mb-4">{t('box_online_title') || 'การให้คำปรึกษาออนไลน์ Online Mentoring'}</h3>
            <p className="text-slate-800 text-lg md:text-xl font-light leading-relaxed mb-8 flex-1">
              {t('box_online_desc') || 'การให้คำปรึกษาโดยครูพี่เลี้ยงผู้มีประสบการณ์ เน้นการสร้างพื้นที่ปลอดภัย รับฟังอย่างไม่ตัดสิน และใช้วิธีตั้งคำถามเชิงสะท้อนคิด เพื่อปลูกฝังให้ครูกลายเป็น Reflective Teacher'}
            </p>
            <div className="w-full pt-6 flex justify-end">
              <span className="bg-[#1e3a8a] text-white px-6 py-3 rounded-xl font-bold text-lg flex items-center gap-2 hover:bg-blue-900 hover:shadow-md transition-all duration-300 group-hover:translate-x-1">
                {t('read_more') || 'อ่านเพิ่มเติม'} <span aria-hidden="true">&rarr;</span>
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
            {/* 💡 ปรับปุ่ม ดูทั้งหมด */}
            <Link to="/news" className="bg-[#1e3a8a] text-white px-5 py-2 md:px-6 md:py-2.5 rounded-xl font-bold text-sm md:text-base flex items-center gap-2 hover:bg-blue-900 hover:shadow-md transition-all duration-300 group">
              {t('view_all') || 'ดูทั้งหมด'} <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">&rarr;</span>
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
            <Link to="/showcases" className="bg-[#1e3a8a] text-white px-5 py-2 md:px-6 md:py-2.5 rounded-xl font-bold text-sm md:text-base flex items-center gap-2 hover:bg-blue-900 hover:shadow-md transition-all duration-300 group">
              {t('view_all') || 'ดูทั้งหมด'} <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
               Array(3).fill(0).map((_, i) => <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-3xl"></div>)
            ) : showcases.length > 0 ? (
              // 💡 3. นำโค้ด .filter().slice() ออก เปลี่ยนกลับมาเป็น .map ปกติ
              showcases.map((showcase, index) => (
                <Link 
                  key={index} 
                  to={`/showcase/${showcase.id}`} 
                  className="flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group"
                >
                  {/* 💡 1. ส่วนเนื้อหา (หัวข้อและผู้เขียน) เอาขึ้นก่อนและปรับให้ใหญ่ขึ้น */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col bg-white relative z-10">
                    <h4 className="text-2xl font-bold text-[#1e3a8a] line-clamp-3 leading-snug group-hover:underline mb-4">
                      {showcase.title}
                    </h4>
                    <p className="text-base text-lg font-semibold text-slate-600 mt-auto px-1 pt-4 border-t border-slate-100 line-clamp-1">
                      {t('by_author') || 'โดย'} <span className="text-[#1e3a8a]">{showcase.author_data ? (typeof showcase.author_data === 'string' ? JSON.parse(showcase.author_data)[0]?.name : showcase.author_data[0]?.name) : showcase.author_name || 'Unknown'}</span>
                    </p>
                  </div>

                  {/* 💡 2. ส่วนรูปภาพ ย้ายมาไว้ด้านล่างสุด และลดขนาดลงให้ไม่แย่งซีน */}
                  <div className="h-32 sm:h-40 bg-slate-50 overflow-hidden relative border-t border-slate-100">
                    {showcase.thumbnail_url ? (
                      <img src={showcase.thumbnail_url} loading="lazy" decoding="async" alt={showcase.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 text-sm bg-slate-50">No Image</div>
                    )}
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
            <Link to="/member-works" className="bg-[#1e3a8a] text-white px-5 py-2 md:px-6 md:py-2.5 rounded-xl font-bold text-sm md:text-base flex items-center gap-2 hover:bg-blue-900 hover:shadow-md transition-all duration-300 group">
              {t('view_all') || 'ดูทั้งหมด'} <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
               Array(3).fill(0).map((_, i) => <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-3xl"></div>)
            ) : (
              <>
                {/* 💡 ฮาร์ดโค้ดการ์ดบทความของครูศิรวิชญ์ ให้โชว์เป็นใบแรกเสมอ */}
                <Link 
                  to="/member-work/sirawit" 
                  className="flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group"
                >
                  <div className="p-6 md:p-8 flex-1 flex flex-col bg-white relative z-10">
                    <h4 className="text-2xl font-bold text-[#1e3a8a] line-clamp-3 leading-snug group-hover:underline mb-4">
                      คำถามที่พาเราเดินไกลกว่าที่คิด
                    </h4>
                    <p className="text-base text-lg font-semibold text-slate-600 mt-auto px-1 pt-4 border-t border-slate-100 line-clamp-1">
                      {t('by_author') || 'โดย'} <span className="text-[#1e3a8a]">ครูศิรวิชญ์ ศรีเขียว</span>
                    </p>
                  </div>
                  <div className="h-32 sm:h-40 bg-slate-50 overflow-hidden relative border-t border-slate-100">
                    <img 
                      src="/Showcases/Sirawit.webp" // 💡 เช็ก Path รูปภาพให้ตรงกับที่ใช้จริงด้วยนะครับ
                      loading="lazy" 
                      decoding="async" 
                      alt="คำถามที่พาเราเดินไกลกว่าที่คิด" 
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                    />
                  </div>
                </Link>

                {/* 💡 วนลูปการ์ดอื่นๆ ที่ดึงมาจาก Database (ตัดเอาแค่ 2 อันแรกมาโชว์ เพื่อให้รวมกับใบฮาร์ดโค้ดแล้วเป็น 3 ใบพอดี) */}
                {memberWorks && memberWorks.length > 0 && memberWorks.slice(0, 2).map((work) => (
                  <Link 
                    key={work.id} 
                    to={`/member-work/${work.id}`} 
                    className="flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group"
                  >
                    <div className="p-6 md:p-8 flex-1 flex flex-col bg-white relative z-10">
                      <h4 className="text-2xl font-bold text-[#1e3a8a] line-clamp-3 leading-snug group-hover:underline mb-4">
                        {work.title}
                      </h4>
                      <p className="text-base text-lg font-semibold text-slate-600 mt-auto px-1 pt-4 border-t border-slate-100 line-clamp-1">
                        {t('by_author') || 'โดย'} <span className="text-[#1e3a8a]">{work.author_name || 'Unknown'}</span>
                      </p>
                    </div>
                    <div className="h-32 sm:h-40 bg-slate-50 overflow-hidden relative border-t border-slate-100">
                      {work.thumbnail_url ? (
                        <img src={work.thumbnail_url} loading="lazy" decoding="async" alt={work.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-sm bg-slate-50">No Image</div>
                      )}
                    </div>
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
});

export default NewsSection;