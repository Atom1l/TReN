/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';

// นำเข้า Modal สำหรับ Showcase
import ShowcasePreviewModal from '../components/ShowcasePreviewModal';

interface NewsItem {
  id: string;
  title: string;
  category: string;
  thumbnail_url: string;
  created_at: string;
}

const Home = () => {
  const { t, language } = useLanguage();

  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [showcases, setShowcases] = useState<any[]>([]); // สำหรับเก็บข้อมูลงานวิจัยเด่น
  const [isLoading, setIsLoading] = useState(true);

  // State สำหรับควบคุม Modal ของ Showcase
  const [previewShowcase, setPreviewShowcase] = useState<{ isOpen: boolean; showcase: any | null }>({
    isOpen: false,
    showcase: null
  });

  useEffect(() => {
    const fetchHomeData = async () => {
      setIsLoading(true);
      try {
        // ดึงข้อมูล ข่าวสาร และ งานวิจัยเด่น พร้อมกัน
        const [newsRes, showcaseRes] = await Promise.all([
          supabase
            .from('news')
            .select('id, title, category, thumbnail_url, created_at')
            .eq('status', 'published')
            .order('created_at', { ascending: false }),
          supabase
            .from('showcases') // หาก Database ของคุณใช้ชื่อ table ว่า 'showcase' แบบไม่มี s ให้แก้ตรงนี้นะครับ
            .select('*')
            .eq('status', 'published') // หากในโต๊ะไม่มี column status ให้ลบบรรทัดนี้ออกได้เลย
            .order('created_at', { ascending: false })
            .limit(3)
        ]);

        if (newsRes.error) throw newsRes.error;
        if (newsRes.data) setNewsItems(newsRes.data as NewsItem[]);

        if (!showcaseRes.error && showcaseRes.data) {
          setShowcases(showcaseRes.data);
        }

      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const formatNewsDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // จัดกลุ่มข้อมูลข่าว
  const announcements = newsItems.filter(n => n.category === 'announcement').slice(0, 4);
  const activitySnapshots = newsItems.filter(n => n.category === 'activity_snapshot').slice(0, 3);
  const successStories = newsItems.filter(n => n.category === 'success_story').slice(0, 4);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      
      {/* Modal งานวิจัยเด่น */}
      <ShowcasePreviewModal 
        isOpen={previewShowcase.isOpen} 
        showcase={previewShowcase.showcase} 
        onClose={() => setPreviewShowcase({ isOpen: false, showcase: null })} 
      />

      {/* ================= 1. Hero Section ================= */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24 flex flex-col items-center">
        
        {/* Top Titles */}
        <div className="text-center w-full max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-6xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight text-balance">
            {t('hero_tren_title') || 'เครือข่ายวิจัยครู TReN'}
          </h1>
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-slate-600 mt-6 font-bold tracking-tight leading-snug text-balance">
            {t('hero_tren_subtitle') || 'เปลี่ยนห้องเรียนให้เป็นพื้นที่เรียนรู้จริง ด้วยพลังของ "ครูวิจัย"'}
          </h2>
          <p className="text-xl md:text-2xl lg:text-3xl text-slate-500 mt-6 font-light tracking-wide text-balance">
            {t('hero_tren_slogan') || 'เพราะปัญหานักเรียนในห้องเรียน ครูคือคนที่เข้าใจดีที่สุด!'}
          </p>
          <div className="w-24 h-1.5 bg-[#1e3a8a] mx-auto mt-10 mb-12 rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-5xl flex flex-col gap-10 mx-auto">
          
          {/* Paragraph */}
          <p className="text-2xl md:text-3xl text-slate-800 leading-relaxed font-light text-center text-balance">
            <strong className="font-bold text-[#1e3a8a]">{t('hero_desc_bold_1') || 'เครือข่ายวิจัยครู TReN'}</strong> {t('hero_desc_text_1') || 'ชุมชนนักปฏิบัติ (CoP) ของครู 4 ภูมิภาคทั่วไทยที่พร้อมยืนเคียงข้างคุณ เปลี่ยนวิจัยเรื่องยากให้เป็น'} <strong className="font-bold text-[#1e3a8a]">{t('hero_desc_bold_2') || '"เครื่องมือเปลี่ยนชีวิตชั้นเรียน"'}</strong> {t('hero_desc_text_2') || 'ด้วยแนวคิด Exploratory Action Research (EAR) ค้นพบปัญหาง่ายๆ จากห้องเรียน แก้ไขได้ตรงจุด โดยมี'} <strong className="font-bold text-[#1e3a8a]">{t('hero_desc_bold_3') || '"ครูพี่เลี้ยง"'}</strong> {t('hero_desc_text_3') || 'คอยดูแลและประคับประคองตลอดเส้นทาง'}
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center mt-6">
            <Link 
              to="/register" 
              className="w-full sm:w-auto bg-[#1e3a8a] text-white font-bold text-xl md:text-2xl px-10 py-4 md:py-5 rounded-2xl hover:bg-blue-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center"
            >
              {t('hero_btn_register') || 'สมัครเข้าร่วมเครือข่าย'}
            </Link>
            <Link 
              to="/resources" 
              className="w-full sm:w-auto bg-white border-[3px] border-[#1e3a8a] text-[#1e3a8a] font-bold text-xl md:text-2xl px-10 py-4 md:py-5 rounded-2xl hover:bg-blue-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center"
            >
              {t('hero_btn_resources') || 'สำรวจคลังความรู้ EAR'}
            </Link>
          </div>

          <hr className="border-t-[2px] border-slate-200 mt-8 mb-8" />

          {/* Lower Content (Reference & Quotes) */}
          <div className="flex flex-col gap-16 lg:gap-24">

            {/* --- Quote 1 --- */}
            <div className="flex flex-col md:flex-row gap-10 md:gap-12 items-center justify-between">
              <div className="flex-1 max-w-2xl">
                <p className="text-[#1e3a8a] font-medium text-3xl md:text-4xl leading-relaxed italic border-l-[5px] border-[#1e3a8a] pl-6 py-2 text-balance">
                  {language === 'en' 
                    ? (t('hero_quote_1_en') || '“I realised I have to listen to my students more and I noticed that, when they trust me, they are more likely to act on my suggestions.”')
                    : (t('hero_quote_1_th') || '"ฉันเริ่มเข้าใจว่า ฉันต้องรับฟังนักเรียนให้มากขึ้น และพบว่าเมื่อเด็กๆ ไว้วางใจฉัน พวกเขาก็มีแนวโน้มจะปฏิบัติตามคำแนะนำของฉันมากขึ้น"')
                  }
                </p>
              </div>

              <a 
                href="https://www.britishcouncil.or.th/en/stories-exploratory-action-research-thai-schools" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full md:w-5/12 aspect-[4/3] border-2 border-dashed border-[#1e3a8a]/40 bg-blue-50/50 hover:bg-blue-100 hover:border-[#1e3a8a]/70 flex flex-col items-center justify-center text-[#1e3a8a] p-6 text-center rounded-3xl transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-sm hover:shadow-lg group"
                title={t('hero_img_click_hint') || 'คลิกเพื่ออ่านบทความฉบับเต็ม'}
              >
                <img 
                  src="Homepage/cover_1.JPG" 
                  alt="Exploratory Action Research" 
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
                />
              </a>
            </div>

            {/* --- Quote 2 --- */}
            <div className="flex flex-col md:flex-row-reverse gap-10 md:gap-12 items-center justify-between">
              <div className="flex-1 max-w-2xl md:text-right">
                <p className="text-[#1e3a8a] font-medium text-3xl md:text-4xl leading-relaxed italic border-l-[5px] md:border-l-0 md:border-r-[5px] border-[#1e3a8a] pl-6 md:pl-0 pr-0 md:pr-6 py-2 text-balance">
                  {language === 'en'
                    ? (t('hero_quote_2_en') || '“One of the most valuable lessons I learned was the importance of understanding students\' needs.”')
                    : (t('hero_quote_2_th') || '"หนึ่งในบทเรียนที่มีค่าที่สุดที่ฉันได้เรียนรู้ คือความสำคัญของการทำความเข้าใจความต้องการของนักเรียน"')
                  }
                </p>
              </div>

              <a 
                href="https://www.britishcouncil.or.th/en/stories-exploratory-action-research-thai-schools" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full md:w-5/12 aspect-[4/3] border-2 border-dashed border-[#1e3a8a]/40 bg-blue-50/50 hover:bg-blue-100 hover:border-[#1e3a8a]/70 flex flex-col items-center justify-center text-[#1e3a8a] p-6 text-center rounded-3xl transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-sm hover:shadow-lg group"
                title={t('hero_img_click_hint') || 'คลิกเพื่ออ่านบทความฉบับเต็ม'}
              >
                <img 
                  src="Homepage/cover_2.png" 
                  alt="Exploratory Action Research" 
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
                />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 2. Achievements Section ================= */}
      <section className="bg-[#1e3a8a] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-black text-white">{t('our_mission') || 'ผลงานตลอด 5 ปีที่ผ่านมา'}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col items-center text-center group transform hover:-translate-y-2">
              <div className="w-24 h-24 bg-blue-50 text-[#1e3a8a] rounded-full flex items-center justify-center mb-8 group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
              </div>
              <h3 className="text-5xl lg:text-7xl font-black text-[#1e3a8a] mb-4">{t('three_hundred_plus') || '300+'}</h3>
              <h4 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-3">{t('registered_teachers') || 'ครูผู้เข้าร่วมโครงการ'}</h4>
              <p className="text-xl text-slate-500 font-light leading-relaxed whitespace-pre-line">{t('over_provinces') || 'ครอบคลุม 40 \nจังหวัดทั่วประเทศ'}</p>
            </div>
            <div className="bg-white p-10 rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col items-center text-center group transform hover:-translate-y-2">
              <div className="w-24 h-24 bg-blue-50 text-[#1e3a8a] rounded-full flex items-center justify-center mb-8 group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="text-5xl lg:text-7xl font-black text-[#1e3a8a] mb-4">{t('one_hundred_fifty_plus') || '150+'}</h3>
              <h4 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-3">{t('research_projects') || 'ผลงานวิจัยในชั้นเรียน'}</h4>
              <p className="text-xl text-slate-500 font-light leading-relaxed whitespace-pre-line">{t('already_published') || 'ได้รับการตีพิมพ์เผยแพร่\nแล้วกว่า'}<br/><span className="font-bold text-[#1e3a8a]">{t('fifty_research_articles') || '50 เรื่อง'}</span></p>
            </div>
            <div className="bg-white p-10 rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col items-center text-center group transform hover:-translate-y-2">
              <div className="w-24 h-24 bg-blue-50 text-[#1e3a8a] rounded-full flex items-center justify-center mb-8 group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>
              </div>
              <h3 className="text-5xl lg:text-7xl font-black text-[#1e3a8a] mb-4">{t('fifty_teachers') || '50'}</h3>
              <h4 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-3">{t('mentors') || 'ครูพี่เลี้ยงวิจัย (Mentor)'}</h4>
              <p className="text-xl text-slate-500 font-light leading-relaxed whitespace-pre-line">{t('already_trained') || 'ที่ผ่านการพัฒนาศักยภาพและพร้อมทำหน้าที่หนุนเสริมเพื่อนครูในพื้นที่'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. เนื้อหาข่าวสารและผลงาน (News, Showcases & Network Voices) ================= */}
      <section className="bg-slate-50/50 py-16 md:py-28 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col gap-24">
          
          {/* ----- 1. ข่าวสารสำคัญ (Announcements) ----- */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 border-b-2 border-slate-200 pb-4">
              <div className="flex items-center gap-4">
                <div className="text-red-500 bg-red-50 p-3 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" /></svg>
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold text-slate-800">{t('news_announcements') || 'ข่าวสารสำคัญ'}</h3>
              </div>
              <Link to="/news?category=announcement" className="text-[#1e3a8a] text-lg font-medium hover:underline cursor-pointer flex items-center gap-2">
                {t('view_all') || 'ดูทั้งหมด'} <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                Array(4).fill(0).map((_, i) => <div key={i} className="h-32 bg-slate-200 animate-pulse rounded-2xl"></div>)
              ) : announcements.length > 0 ? (
                announcements.map(news => (
                  <Link key={news.id} to={`/news/${news.id}`} className="block bg-white p-6 rounded-2xl border-t-[4px] border-t-red-500 border-x border-b border-slate-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <p className="text-slate-400 font-semibold text-sm mb-2">{formatNewsDate(news.created_at)}</p>
                    <h4 className="text-[#1e3a8a] font-bold text-lg line-clamp-3 leading-relaxed">{news.title}</h4>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-slate-400 text-lg text-center py-10 border border-dashed rounded-2xl">{t('no_news') || 'ยังไม่มีข่าวสารสำคัญ'}</div>
              )}
            </div>
          </div>

          {/* ----- 2. ข่าวสารกิจกรรม (Activity Snapshots) ----- */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 border-b-2 border-slate-200 pb-4">
              <div className="flex items-center gap-4">
                <div className="text-emerald-500 bg-emerald-50 p-3 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold text-slate-800">{t('news_activity') || 'ข่าวสารกิจกรรม'}</h3>
              </div>
              <Link to="/news?category=activity_snapshot" className="text-[#1e3a8a] text-lg font-medium hover:underline cursor-pointer flex items-center gap-2">
                {t('view_all') || 'ดูทั้งหมด'} <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {isLoading ? (
                Array(3).fill(0).map((_, i) => <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-3xl"></div>)
               ) : activitySnapshots.length > 0 ? (
                activitySnapshots.map(news => (
                  <Link key={news.id} to={`/news/${news.id}`} className="block relative rounded-3xl overflow-hidden h-64 sm:h-72 lg:h-80 group shadow-md border border-slate-100 cursor-pointer">
                    {news.thumbnail_url ? (
                      <img src={news.thumbnail_url} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 text-xl">No Image</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <p className="text-emerald-400 font-bold text-sm mb-2">{formatNewsDate(news.created_at)}</p>
                      <h4 className="text-white font-bold line-clamp-2 text-xl sm:text-2xl leading-snug">{news.title}</h4>
                    </div>
                  </Link>
                ))
               ) : (
                <div className="col-span-full text-slate-400 text-lg text-center py-16 border border-dashed border-slate-200 rounded-3xl">{t('no_news') || 'ยังไม่มีภาพกิจกรรมล่าสุด'}</div>
               )}
            </div>
          </div>

          {/* ----- 3. งานวิจัยเด่น (Showcases) ----- */}
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
                  <div 
                    key={index} 
                    onClick={() => setPreviewShowcase({ isOpen: true, showcase })}
                    className="flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group"
                  >
                    <div className="h-48 sm:h-56 bg-slate-200 overflow-hidden relative">
                      {showcase.thumbnail_url ? (
                        <img src={showcase.thumbnail_url} alt={showcase.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
                  </div>
                ))
              ) : (
                <div className="col-span-full text-slate-400 text-lg text-center py-16 border border-dashed border-slate-200 rounded-3xl">{t('no_showcases') || 'ยังไม่มีงานวิจัยเด่น'}</div>
              )}
            </div>
          </div>

          {/* ----- 4. เสียงจากเครือข่าย (Success Stories) ----- */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 border-b-2 border-slate-200 pb-4">
              <div className="flex items-center gap-4">
                <div className="text-yellow-500 bg-yellow-50 p-3 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold text-slate-800">{t('network_voices') || 'เสียงจากเครือข่าย'}</h3>
              </div>
              <Link to="/news?category=success_story" className="text-[#1e3a8a] text-lg font-medium hover:underline cursor-pointer flex items-center gap-2">
                {t('view_all') || 'ดูทั้งหมด'} <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {isLoading ? (
                 Array(4).fill(0).map((_, i) => <div key={i} className="h-40 bg-slate-200 animate-pulse rounded-[1.5rem]"></div>)
              ) : successStories.length > 0 ? (
                successStories.map(news => (
                  <Link key={news.id} to={`/news/${news.id}`} className="flex flex-col sm:flex-row gap-6 group cursor-pointer bg-white p-5 rounded-[1.5rem] border border-slate-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="w-full sm:w-48 h-56 sm:h-full rounded-2xl overflow-hidden shrink-0 bg-slate-200 relative">
                      {news.thumbnail_url ? (
                        <img src={news.thumbnail_url} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-lg">No Image</div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center py-2 pr-4 flex-1">
                       <span className="inline-block px-4 py-1.5 bg-yellow-50 text-yellow-700 text-xs font-bold rounded-full mb-3 w-fit">{formatNewsDate(news.created_at)}</span>
                       <h4 className="text-[#1e3a8a] font-bold text-xl line-clamp-3 group-hover:underline leading-relaxed mb-3">{news.title}</h4>
                       <span className="text-slate-500 text-base font-medium mt-auto">{t('read_more') || 'อ่านเพิ่มเติม'} &rarr;</span>
                    </div>
                  </Link>
                ))
              ) : (
                 <div className="col-span-full text-slate-400 text-lg text-center py-16 border border-dashed border-slate-200 rounded-[1.5rem]">{t('no_news') || 'ยังไม่มีเรื่องเล่าจากเครือข่าย'}</div>
              )}
            </div>
          </div>

          {/* ----- 5. ภาพกิจกรรม (Gallery Placeholder) ----- */}
          <div className="mt-12 md:mt-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 border-b-2 border-slate-200 pb-4">
              <div className="flex items-center gap-4">
                <div className="text-purple-500 bg-purple-50 p-3 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold text-slate-800">{t('gallery_title') || 'ประมวลภาพกิจกรรม (Gallery)'}</h3>
              </div>
            </div>

            {/* Placeholder พื้นที่วาง Gallery */}
            <div className="w-full min-h-[400px] border-4 border-dashed border-slate-200 bg-slate-100/50 rounded-3xl flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
              <h4 className="text-2xl font-bold mb-2">พื้นที่สำหรับ Gallery</h4>
              <p className="text-lg font-light">รอการออกแบบและจัดวางเนื้อหาอีกทีหนึ่ง</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;