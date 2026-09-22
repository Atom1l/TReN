/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';

interface EventData {
  id: string;
  title: string; 
  created_at: string; 
  event_date: string;
  event_time: string;
  location: string;
  brief_description: string;
  thumbnail_url: string;
  status: string; 
  event_state: string;
  target_audience?: string; 
  registration_url?: string;
}

interface NewsData {
  id: string;
  title: string;
  created_at: string;
  thumbnail_url: string;
  category: string;
  author_id: string;
  content: string;
}

// 🟢 1. ฟังก์ชันแปลภาษาอัจฉริยะแบบนับสัดส่วนตัวอักษร
const translateText = async (text: string, targetLang: string) => {
  if (!text || !text.trim() || text === '-') return text;
  
  const cleanText = text.replace(/<[^>]*>?/gm, '');
  const thaiCharsCount = (cleanText.match(/[\u0E00-\u0E7F]/g) || []).length;
  const engCharsCount = (cleanText.match(/[a-zA-Z]/g) || []).length;
  const isThaiArticle = thaiCharsCount > engCharsCount;
  
  if (targetLang === 'th' && isThaiArticle) return text;
  if (targetLang === 'en' && !isThaiArticle) return text;

  const sourceLang = isThaiArticle ? 'th' : 'en';
  
  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `q=${encodeURIComponent(text)}`,
      }
    );
    const data = await response.json();
    
    if (data && data[0]) {
      return data[0].map((item: any) => item[0]).join('');
    }
    return text;
  } catch (error) {
    console.error('Translation Error:', error);
    return text; 
  }
};

const stripHtml = (html: string) => {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || doc.body.innerText || "";
};

// 🟢 2. EventCard Component (เหมือนเดิม)
const EventCard: React.FC<{ event: EventData; onClick: () => void; }> = ({ event, onClick }) => {
  const { t, language } = useLanguage();

  const [translatedTitle, setTranslatedTitle] = useState(event.title);
  const [translatedLocation, setTranslatedLocation] = useState(event.location || '-');
  const [translatedDesc, setTranslatedDesc] = useState(event.brief_description || '');
  const [isTranslating, setIsTranslating] = useState(false);

  const getTargetTranslation = (targetValue: string | undefined) => {
    if (!targetValue) return '-';
    switch (targetValue) {
      case 'สำหรับครูทั่วไปและบุคคลทั่วไป':
      case 'teacher': 
      case 'public': 
        return t('target_teacher') || 'สำหรับครูทั่วไป';
      case 'สำหรับครูพี่เลี้ยง (Mentor)':
      case 'assistant_teacher':
      case 'mentor':
        return t('target_mentor') || 'สำหรับครูพี่เลี้ยง';
      case 'สำหรับบุคคลทั่วไป':
      case 'everyone':
        return t('target_everyone') || 'สำหรับบุคคลทั่วไป';
      default:
        return targetValue; 
    }
  };

  useEffect(() => {
    const autoTranslateCard = async () => {
      setTranslatedTitle(event.title);
      setTranslatedLocation(event.location || '-');
      setTranslatedDesc(event.brief_description || '');
      setIsTranslating(true);

      try {
        const [newTitle, newLoc, newDesc] = await Promise.all([
          translateText(event.title, language),
          translateText(event.location || '-', language),
          translateText(event.brief_description || '', language)
        ]);

        setTranslatedTitle(newTitle);
        setTranslatedLocation(newLoc);
        setTranslatedDesc(newDesc);
      } catch (err) {
        console.error("Card translate error:", err);
      } finally {
        setIsTranslating(false);
      }
    };

    autoTranslateCard();
  }, [language, event]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString(
      language === 'th' ? 'th-TH' : 'en-GB', 
      { day: 'numeric', month: 'long', year: 'numeric' }
    );
  };

  const formatTimeAMPM = (timeRange: string) => {
    if (!timeRange) return '-';
    const times = timeRange.split(' - ');
    if (times.length !== 2) return timeRange; 
    const formatSingleTime = (time: string) => {
      const [h] = time.split(':');
      const hour = parseInt(h, 10);
      const ampm = hour >= 12 ? 'P.M.' : 'A.M.';
      return `${time} ${ampm}`;
    };
    return language === 'th' ? `${timeRange} น.` : `${formatSingleTime(times[0])} - ${formatSingleTime(times[1])}`;
  };

  return (
    <div onClick={onClick} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-slate-100 overflow-hidden flex flex-col h-full cursor-pointer group">
      <div className="h-48 sm:h-56 bg-slate-200 overflow-hidden relative">
        {event.thumbnail_url ? (
          <img src={event.thumbnail_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
        )}
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${
          ['past', 'done'].includes((event.status || '').toLowerCase()) ? 'bg-slate-800/80' : 'bg-[#1e3a8a]/90'
        }`}>
          {['past', 'done'].includes((event.status || '').toLowerCase()) ? t('filter_past') || 'Past Event' : t('filter_upcoming') || 'Upcoming'}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          {isTranslating && (
            <span className="inline-block text-[10px] bg-blue-50 text-[#1e3a8a] px-2 py-0.5 rounded font-semibold animate-pulse mb-1">
              {t('translating') || 'Translating...'}
            </span>
          )}
          <h3 className="text-[#1e3a8a] text-xl font-bold line-clamp-2">{translatedTitle || event.title}</h3>
        </div>

        <div className="space-y-1 mb-4 text-sm text-slate-700 flex-1">
          <p><span className="font-bold text-[#1e3a8a]">{t('all_event_date') || 'วันที่'}:</span> {formatDate(event.event_date)}</p>
          <p><span className="font-bold text-[#1e3a8a]">{t('all_event_time') || 'เวลา'}:</span> {formatTimeAMPM(event.event_time)}</p>
          <p className="truncate"><span className="font-bold text-[#1e3a8a]">{t('all_event_place') || 'สถานที่'}:</span> {translatedLocation || event.location || '-'}</p>
          
          {event.target_audience && (
             <p className="truncate"><span className="font-bold text-[#1e3a8a]">{t('target_audience') || 'กลุ่มเป้าหมาย'}:</span> {getTargetTranslation(event.target_audience)}</p>
          )}
        </div>
        
        <p className="text-slate-500 text-sm line-clamp-2 mb-6">{translatedDesc || event.brief_description || 'ไม่มีคำอธิบายโดยย่อ'}</p>
        
        <button className="mt-auto bg-[#1e3a8a] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-900 transition-colors w-fit text-sm">
          {t('read_more') || 'ดูเพิ่มเติม'} &rarr;
        </button>
      </div>
    </div>
  );
};

// 🟢 3. PRNewsCard สำหรับแสดงข่าวประชาสัมพันธ์
const PRNewsCard: React.FC<{ newsItem: NewsData; onClick: () => void; }> = ({ newsItem, onClick }) => {
  const { t, language } = useLanguage();
  const [translatedTitle, setTranslatedTitle] = useState(newsItem.title);
  const [translatedSnippet, setTranslatedSnippet] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const autoTranslateCard = async () => {
      const rawSnippet = stripHtml(newsItem.content) || '';
      setTranslatedTitle(newsItem.title);
      setTranslatedSnippet(rawSnippet);
      setIsTranslating(true);

      try {
        const [newTitle, newSnippet] = await Promise.all([
          translateText(newsItem.title, language),
          translateText(rawSnippet, language)
        ]);
        setTranslatedTitle(newTitle);
        setTranslatedSnippet(newSnippet);
      } catch (err) {
        console.error("Card translate error:", err);
      } finally {
        setIsTranslating(false);
      }
    };
    autoTranslateCard();
  }, [language, newsItem]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString(
      language === 'th' ? 'th-TH' : 'en-GB', 
      { day: 'numeric', month: 'short', year: 'numeric' }
    );
  };

  return (
    <div onClick={onClick} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-slate-100 overflow-hidden flex flex-col h-full cursor-pointer group">
      <div className="h-48 sm:h-56 bg-slate-200 overflow-hidden relative">
        {newsItem.thumbnail_url ? (
          <img src={newsItem.thumbnail_url} alt={newsItem.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
        )}
        <div className="absolute top-4 right-4 bg-emerald-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm">
          {t('news_public_relations') || 'ประชาสัมพันธ์'}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-2">
          {isTranslating && (
            <span className="inline-block text-[10px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded font-semibold animate-pulse mb-1">
              {t('translating') || 'Translating...'}
            </span>
          )}
          <p className="text-emerald-500 font-bold text-xs mb-1">{formatDate(newsItem.created_at)}</p>
          <h3 className="text-[#1e3a8a] text-xl font-bold line-clamp-2 leading-tight">{translatedTitle || newsItem.title}</h3>
        </div>
        <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-1 mt-2">
          {translatedSnippet || stripHtml(newsItem.content)}
        </p>
        <button className="mt-auto text-emerald-600 font-medium hover:text-emerald-700 transition-colors w-fit text-sm">
          {t('read_more') || 'อ่านรายละเอียด'} &rarr;
        </button>
      </div>
    </div>
  );
};

const Events = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [events, setEvents] = useState<EventData[]>([]);
  const [prNews, setPrNews] = useState<NewsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0); 

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const today = new Date().toISOString();
        
        await supabase
          .from('events')
          .update({ status: 'past' })
          .eq('status', 'upcoming')
          .lt('event_date', today);

        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .eq('event_state', 'published');
        if (eventsError) throw eventsError;
        if (eventsData) setEvents(eventsData as EventData[]);

        const { data: newsData, error: newsError } = await supabase
          .from('news')
          .select('id, title, created_at, thumbnail_url, category, author_id, content')
          .eq('status', 'published')
          .eq('category', 'public_relations')
          .order('created_at', { ascending: false })
          .limit(3); 
        
        if (newsError) throw newsError;
        if (newsData) setPrNews(newsData as NewsData[]);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const upcomingEvents = events
    .filter(ev => ['upcoming'].includes((ev.status || '').toLowerCase()))
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()) 
    .slice(0, 3); 

  const pastEvents = events
    .filter(ev => ['past', 'done'].includes((ev.status || '').toLowerCase()))
    .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime()) 
    .slice(0, 3); 

  const handleEventClick = (event: EventData) => {
    navigate(`/event/${event.id}`);
  };

  const handleNewsClick = (newsId: string) => {
    navigate(`/news/${newsId}`);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-[#1e3a8a] font-bold text-xl animate-pulse">{t('loading_events') || 'กำลังโหลดข้อมูล...'}</div>;
  }

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pb-24 font-sans text-slate-800">
      
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 md:pt-24">

          <header className="mb-16 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight mb-4">
              {t('events_header') || 'กิจกรรม & การอบรม'}
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-500 tracking-normal leading-snug">
              (Events & Training)
            </h2>
            <div className="w-20 h-1.5 bg-[#1e3a8a] mt-8 rounded-full mx-auto"></div>
          </header>

          <section className="mb-20 pt-16 border-t-4 border-slate-300">
            <h3 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-8">
              {t('training_model_section') || 'รูปแบบการอบรม (Training Model)'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <Link to="/training/onsite" className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col items-start cursor-pointer">
                <div className="w-16 h-16 bg-blue-50 text-[#1e3a8a] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                </div>
                <h4 className="text-2xl font-bold text-[#1e3a8a] mb-2">{t('nav_about_training') || 'รูปแบบการอบรม'}</h4>
                <p className="text-slate-500 text-lg mb-6">(Training Model)</p>
                <div className="mt-auto pt-6 w-full border-t border-slate-100 text-[#1e3a8a] font-bold group-hover:text-blue-600 transition-colors flex items-center gap-2">
                  {t('read_more') || 'อ่านเพิ่มเติม'} <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </Link>

              <Link to="/training/mentoring" className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col items-start cursor-pointer">
                <div className="w-16 h-16 bg-blue-50 text-[#1e3a8a] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                  </svg>
                </div>
                <h4 className="text-2xl font-bold text-[#1e3a8a] mb-2">{t('nav_mentoring') || 'การให้คำปรึกษา'}</h4>
                <p className="text-slate-500 text-lg mb-6">(Online Mentoring)</p>
                <div className="mt-auto pt-6 w-full border-t border-slate-100 text-[#1e3a8a] font-bold group-hover:text-blue-600 transition-colors flex items-center gap-2">
                  {t('read_more') || 'อ่านเพิ่มเติม'} <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </Link>

              <Link to="/training/mentoring#video-demo" className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col items-start cursor-pointer">
                <div className="w-16 h-16 bg-blue-50 text-[#1e3a8a] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-9 h-9">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
                  </svg>
                </div>
                <h4 className="text-2xl font-bold text-[#1e3a8a] mb-2 leading-tight">{t('nav_video_demo') || 'ตัวอย่างการให้คำปรึกษา'}</h4>
                <p className="text-slate-500 text-lg mb-6">(Mentoring Video Demonstration)</p>
                <div className="mt-auto pt-6 w-full border-t border-slate-100 text-[#1e3a8a] font-bold group-hover:text-blue-600 transition-colors flex items-center gap-2">
                  {t('read_more') || 'รับชมคลิป'} <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </Link>

            </div>
          </section>

          <section className="mb-20 pt-16 border-t-4 border-slate-300">
            <h3 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-8">
              {t('yearly_plan_section') || 'แผนกิจกรรมประจำปี'} <span className="text-xl text-slate-500 font-medium block mt-1">(Yearly Plan)</span>
            </h3>
            <div className="w-full min-h-[300px] bg-slate-100 border-2 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              <p className="text-xl font-medium">{t('yearly_plan_placeholder') || 'พื้นที่สำหรับใส่แผนภูมิรูปภาพแผนกิจกรรมประจำปี'}</p>
            </div>
          </section>

          {/* 💡 4. แก้ไขปุ่ม "ดูทั้งหมด" แยกเป็น 2 ปุ่ม สำหรับ Activities และ PR News */}
          <section className="mb-20 pt-16 border-t-4 border-slate-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-[#1e3a8a]">
                  {t('academic_sharing_section') || 'เวทีวิชาการและแลกเปลี่ยนเรียนรู้'} 
                </h3>
                <span className="text-xl text-slate-500 font-medium block mt-1">(Academic Sharing Sessions)</span>
              </div>
              
              {/* กลุ่มปุ่มลัดดูทั้งหมดแยกตามประเภท */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigate('/events/all?filter=upcoming')} 
                  className="bg-blue-50 text-[#1e3a8a] px-4 py-2 rounded-full text-sm font-bold hover:bg-[#1e3a8a] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {t('view_all_events') || 'ดูกิจกรรมทั้งหมด'}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                </button>
                <button 
                  onClick={() => navigate('/news?category=public_relations')} 
                  className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-sm font-bold hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {t('view_all_news') || 'ดูข่าวทั้งหมด'}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map(event => (
                <EventCard key={`event-${event.id}`} event={event} onClick={() => handleEventClick(event)} />
              ))}
              
              {prNews.map(news => (
                <PRNewsCard key={`news-${news.id}`} newsItem={news} onClick={() => handleNewsClick(news.id)} />
              ))}

              {upcomingEvents.length === 0 && prNews.length === 0 && (
                <div className="col-span-full bg-slate-50 rounded-2xl p-10 text-center text-slate-500 border border-slate-100">
                  {t('no_upcoming_events') || 'ยังไม่มีกิจกรรมหรือข่าวสารในขณะนี้'}
                </div>
              )}
            </div>
          </section>

          <section className="pt-16 border-t-4 border-slate-300">
            <div className="flex justify-between items-end mb-8">
              <h3 className="text-3xl md:text-4xl font-bold text-[#1e3a8a]">
                {t('past_events_section') || 'กิจกรรมที่ผ่านมา'} <span className="text-xl text-slate-500 font-medium block mt-1">(Past Events Archive)</span>
              </h3>
              <button 
                onClick={() => navigate('/events/all?filter=past')} 
                className="text-slate-500 hover:text-[#1e3a8a] font-medium underline underline-offset-4 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {t('view_all') || 'ดูทั้งหมด'} <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
            
            {pastEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastEvents.map(event => (
                  <EventCard key={`past-${event.id}`} event={event} onClick={() => handleEventClick(event)} />
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl p-10 text-center text-slate-500 border border-slate-100">
                {t('no_events_found') || 'ยังไม่มีข้อมูลกิจกรรมที่ผ่านมา'}
              </div>
            )}
          </section>

        </div>
    </div>
  );
};

export default Events;