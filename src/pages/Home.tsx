/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';

import EventPreviewModal from '../components/EventPreviewModal';

interface HomeEvent {
  id: string;
  title: string;
  event_date: string;
  event_time: string;
  location: string;
  target_audience?: string;
  registration_url?: string;
  status: string; 
  brief_description?: string; 
  thumbnail_url?: string; 
}

interface NewsItem {
  id: string;
  title: string;
  category: string;
  thumbnail_url: string;
  created_at: string;
}

// ฟังก์ชันแปลภาษาอัตโนมัติ
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
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `q=${encodeURIComponent(text)}`,
      }
    );
    const data = await response.json();
    if (data && data[0]) return data[0].map((item: any) => item[0]).join('');
    return text;
  } catch (error) {
    console.error('Translation Error:', error);
    return text; 
  }
};

// Component สำหรับการ์ดกิจกรรมข้างปฏิทิน
const CalendarEventCard: React.FC<{
  event: HomeEvent;
  onClick: () => void;
  language: string;
  t: any;
  formatFullDate: (d: Date) => string;
  getTargetTranslation: (v: string | undefined) => string;
}> = ({ event, onClick, language, t, formatFullDate, getTargetTranslation }) => {
  
  const [translatedTitle, setTranslatedTitle] = useState(event.title);
  const [translatedLocation, setTranslatedLocation] = useState(event.location || '-');
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const translateData = async () => {
      setTranslatedTitle(event.title);
      setTranslatedLocation(event.location || '-');
      setIsTranslating(true);
      try {
        const [newTitle, newLoc] = await Promise.all([
          translateText(event.title, language),
          translateText(event.location || '-', language)
        ]);
        setTranslatedTitle(newTitle);
        setTranslatedLocation(newLoc);
      } catch (e) {
        console.error(e);
      } finally {
        setIsTranslating(false);
      }
    };
    translateData();
  }, [event, language]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col sm:flex-row relative group shrink-0">
      <div className="w-full sm:w-2 bg-[#1e3a8a] sm:h-auto h-2"></div>
      <div className="p-6 flex-1">
        <div className="mb-4">
          {isTranslating && (
            <span className="inline-block text-[10px] bg-blue-50 text-[#1e3a8a] px-2 py-0.5 rounded font-semibold animate-pulse mb-1">
              {t('translating') || 'Translating...'}
            </span>
          )}
          <h4 className="text-xl font-bold text-[#1e3a8a] line-clamp-2 py-1">{translatedTitle || event.title}</h4>
        </div>
        <div className="space-y-2.5 text-sm text-slate-600 mb-6">
          <p className="flex items-start gap-2">
            <span className="font-semibold whitespace-nowrap">{t('all_event_date') || 'วันที่และเวลา'}:</span> 
            <span>{formatFullDate(new Date(event.event_date))} | {event.event_time}</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="font-semibold whitespace-nowrap">{t('all_event_place') || 'รูปแบบและสถานที่'}:</span> 
            <span>{translatedLocation || event.location || '-'}</span>
          </p>
          {event.target_audience && (
            <p className="flex items-start gap-2">
              <span className="font-semibold whitespace-nowrap">{t('target_audience') || 'กลุ่มเป้าหมาย'}:</span> 
              <span>{getTargetTranslation(event.target_audience)}</span>
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onClick}
            className="border border-[#1e3a8a] text-[#1e3a8a] px-5 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm cursor-pointer"
          >
            {t('view_details') || 'ดูรายละเอียดเพิ่มเติม'}
          </button>
        </div>
      </div>
    </div>
  );
};


const Home = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const [events, setEvents] = useState<HomeEvent[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  const [previewModal, setPreviewModal] = useState<{ isOpen: boolean; event: HomeEvent | null }>({
    isOpen: false,
    event: null
  });

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
    const fetchHomeData = async () => {
      setIsLoadingEvents(true);
      try {
        const [eventsRes, newsRes] = await Promise.all([
          supabase
            .from('events')
            .select('id, title, event_date, event_time, location, target_audience, registration_url, status, brief_description, thumbnail_url')
            .eq('event_state', 'published')
            .order('event_date', { ascending: true }),
          supabase
            .from('news')
            .select('id, title, category, thumbnail_url, created_at')
            .eq('status', 'published')
            .order('created_at', { ascending: false })
        ]);

        if (eventsRes.error) throw eventsRes.error;
        if (newsRes.error) throw newsRes.error;

        if (eventsRes.data) setEvents(eventsRes.data as HomeEvent[]);
        if (newsRes.data) setNewsItems(newsRes.data as NewsItem[]);

      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchHomeData();
  }, []);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const hasEventOnDay = (day: number) => {
    return events.some(e => {
      const eDate = new Date(e.event_date);
      return eDate.getDate() === day && eDate.getMonth() === currentMonth.getMonth() && eDate.getFullYear() === currentMonth.getFullYear();
    });
  };

  const selectedDayEvents = events.filter(e => {
    const eDate = new Date(e.event_date);
    return eDate.getDate() === selectedDate.getDate() && 
           eDate.getMonth() === selectedDate.getMonth() && 
           eDate.getFullYear() === selectedDate.getFullYear();
  });

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', { month: 'long', year: 'numeric' });
  };
  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  const formatNewsDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  const weekDays = language === 'th' ? ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleEventClick = (event: HomeEvent) => {
    const status = (event.status || '').toLowerCase();
    
    if (status === 'past' || status === 'done') {
      navigate(`/event/${event.id}`);
    } else {
      setPreviewModal({ isOpen: true, event });
    }
  };

  // 🟢 ปรับจำนวนการแสดงผลให้เข้ากับเลย์เอาต์ใหม่
  const announcements = newsItems.filter(n => n.category === 'announcement').slice(0, 4);
  const successStories = newsItems.filter(n => n.category === 'success_story').slice(0, 3);
  const activitySnapshots = newsItems.filter(n => n.category === 'activity_snapshot').slice(0, 2);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      
      <EventPreviewModal 
        isOpen={previewModal.isOpen} 
        event={previewModal.event} 
        onClose={() => setPreviewModal({ isOpen: false, event: null })} 
      />

      {/* ================= 1. Hero Section ================= */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24 flex flex-col-reverse lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-4 lg:pr-8">
          <h1 className="text-4xl lg:text-5xl font-black text-[#1e3a8a] leading-tight tracking-tight">
            {t('home_title') || 'Teacher-research Network (TReN)'}
          </h1>
          <h2 className="text-xl lg:text-2xl font-bold text-slate-800 leading-snug">
            {t('home_subtitle') || 'เครือข่ายวิจัยในชั้นเรียนเพื่อการเปลี่ยนแปลงที่ยั่งยืน'}
          </h2>
          <p className="mt-6 text-slate-500 text-lg leading-relaxed max-w-lg">
            {t('home_description') || 'TReN ทำหน้าที่เป็นศูนย์กลางขับเคลื่อนการพัฒนาทักษะการวิจัยเชิงปฏิบัติการแบบสำรวจ (Exploratory Action Research: EAR) ผ่านรูปแบบชุมชนนักปฏิบัติ (Community of Practice: CoP) โดยเชื่อมโยงเครือข่ายครูพี่เลี้ยงและครูทั่วไป ครอบคลุม 8 ภูมิภาคทั่วประเทศ เพื่อยกระดับการจัดการเรียนรู้และเสริมศักยภาพให้ครูสามารถแก้ปัญหาในชั้นเรียนได้ด้วยตนเอง'}
          </p>
        </div>
        <div className="flex-1 w-full">
          <div className="w-full aspect-[4/3] bg-slate-200 rounded-2xl shadow-lg overflow-hidden relative">
             <img 
               src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
               alt="Team Collaboration" 
               className="w-full h-full object-cover"
             />
          </div>
        </div>
      </section>

      {/* ================= 2. Achievements Section ================= */}
      <section className="bg-[#E6F0FA] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-black text-[#1e3a8a]">{t('our_mission') || 'ผลงานตลอด 5 ปีที่ผ่านมา'}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col items-center text-center group transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-blue-50 text-[#1e3a8a] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
              </div>
              <h3 className="text-4xl lg:text-5xl font-black text-[#1e3a8a] mb-3">{t('three_hundred_plus') || '300+'}</h3>
              <h4 className="text-xl font-bold text-slate-800 mb-2">{t('registered_teachers') || 'ครูผู้เข้าร่วมโครงการ'}</h4>
              <p className="text-slate-500 leading-relaxed whitespace-pre-line">{t('over_provinces') || 'ครอบคลุม 40 \nจังหวัดทั่วประเทศ'}</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col items-center text-center group transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-blue-50 text-[#1e3a8a] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="text-4xl lg:text-5xl font-black text-[#1e3a8a] mb-3">{t('one_hundred_fifty_plus') || '150+'}</h3>
              <h4 className="text-xl font-bold text-slate-800 mb-2">{t('research_projects') || 'ผลงานวิจัยในชั้นเรียน'}</h4>
              <p className="text-slate-500 leading-relaxed whitespace-pre-line">{t('already_published') || 'ได้รับการตีพิมพ์เผยแพร่\nแล้วกว่า'}<br/><span className="font-semibold text-[#1e3a8a]">{t('fifty_research_articles') || '50 เรื่อง'}</span></p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col items-center text-center group transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-blue-50 text-[#1e3a8a] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>
              </div>
              <h3 className="text-4xl lg:text-5xl font-black text-[#1e3a8a] mb-3">{t('fifty_teachers') || '50'}</h3>
              <h4 className="text-xl font-bold text-slate-800 mb-2">{t('mentors') || 'ครูพี่เลี้ยงวิจัย (Mentor)'}</h4>
              <p className="text-slate-500 leading-relaxed whitespace-pre-line">{t('already_trained') || 'ที่ผ่านการพัฒนาศักยภาพและพร้อมทำหน้าที่หนุนเสริมเพื่อนครูในพื้นที่'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. Interactive Calendar & Events Section ================= */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-black text-[#1e3a8a]">{t('calendar_events') || 'ปฏิทินกิจกรรม TReN'}</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          <div className="w-full lg:w-5/12 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 p-6 sm:p-8 h-fit">
            <div className="flex justify-between items-center mb-8">
              <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-slate-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
              <h3 className="text-2xl font-black text-[#1e3a8a] capitalize tracking-wide">
                {formatMonthYear(currentMonth)}
              </h3>
              <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-slate-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center mb-4">
              {weekDays.map(day => (
                <div key={day} className="text-sm font-bold text-slate-400 uppercase tracking-wider">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center">
              {blanks.map(blank => <div key={`blank-${blank}`} className="p-2"></div>)}
              {days.map(day => {
                const thisDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth.getMonth() && selectedDate.getFullYear() === currentMonth.getFullYear();
                const hasEvent = hasEventOnDay(day);

                return (
                  <div key={day} className="flex justify-center items-center relative">
                    <button
                      onClick={() => setSelectedDate(thisDate)}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-base font-medium transition-all duration-200 cursor-pointer
                        ${isSelected ? 'bg-[#1e3a8a] text-white shadow-md font-bold scale-110' : 'text-slate-700 hover:bg-blue-50'}
                      `}
                    >
                      {day}
                    </button>
                    {hasEvent && (
                      <span className={`absolute bottom-0 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500'}`}></span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full lg:w-7/12">
            <div className="border-b-2 border-slate-100 pb-4 mb-6">
              <h3 className="text-2xl font-bold text-[#1e3a8a]">
                {t('events_on') || 'กิจกรรมวันที่'} {formatFullDate(selectedDate)}
              </h3>
            </div>

            <div className="space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar pr-1 sm:pr-3 pb-4">
              {isLoadingEvents ? (
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded"></div>
                      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              ) : selectedDayEvents.length > 0 ? (
                selectedDayEvents.map(event => (
                  <CalendarEventCard 
                    key={event.id}
                    event={event}
                    onClick={() => handleEventClick(event)}
                    language={language}
                    t={t}
                    formatFullDate={formatFullDate}
                    getTargetTranslation={getTargetTranslation}
                  />
                ))
              ) : (
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-10 text-center">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-slate-600 mb-1">{t('no_events_today') || 'ไม่มีกิจกรรมในวันนี้'}</h4>
                  <p className="text-slate-500 text-sm">{t('click_other_dates') || 'ลองกดเลือกดูวันที่อื่นในปฏิทินดูสิ'}</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 🟢 4. ส่วนนำเสนอข่าว (News & Updates) เลย์เอาต์แนวนอน (Sectioned Rows) */}
      <section className="bg-slate-50/50 py-16 lg:py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          {/* ----- ชั้นบนสุด: ภาพกิจกรรมล่าสุด (Activity Snapshot) ----- */}
          <div className="mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="text-emerald-500 bg-emerald-50 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">{t('news_activity') || 'ภาพกิจกรรมล่าสุด'}</h3>
                </div>
              </div>
              <Link to="/news?category=activity_snapshot" className="text-[#1e3a8a] font-semibold hover:underline cursor-pointer flex items-center gap-1">
                {t('view_all_activities') || 'ดูแกลเลอรี่ทั้งหมด'} <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
               {activitySnapshots.length > 0 ? activitySnapshots.map(news => (
                <Link key={news.id} to={`/news/${news.id}`} className="block relative rounded-2xl overflow-hidden h-64 sm:h-72 lg:h-80 group shadow-md border border-slate-100 cursor-pointer">
                  {news.thumbnail_url ? (
                    <img src={news.thumbnail_url} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">No Image</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-emerald-400 font-bold text-sm mb-2">{formatNewsDate(news.created_at)}</p>
                    <h4 className="text-white font-bold line-clamp-2 text-xl sm:text-2xl leading-snug">{news.title}</h4>
                  </div>
                </Link>
              )) : (
                <div className="col-span-1 md:col-span-2 text-slate-400 text-center py-10 border border-dashed border-slate-200 rounded-2xl">{t('no_news') || 'ยังไม่มีภาพกิจกรรมล่าสุด'}</div>
              )}
            </div>
          </div>

          {/* ----- ชั้นล่าง: แบ่ง 2 ฝั่งซ้ายขวา (Announcements & EARC Spotlight) ----- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            
            {/* ซ้าย: ประกาศสำคัญ (กินพื้นที่ 5 ส่วน) */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="text-red-500 bg-red-50 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" /></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">{t('news_announcements') || 'ข่าวสำคัญ'}</h3>
                </div>
              </div>
              
              <div className="flex flex-col gap-4 flex-1">
                {announcements.length > 0 ? announcements.map(news => (
                  <Link key={news.id} to={`/news/${news.id}`} className="block bg-white p-5 rounded-xl border-l-4 border-l-red-500 border-y border-r border-slate-100 hover:shadow-md transition-all duration-300">
                    <p className="text-slate-400 font-semibold text-xs mb-1.5">{formatNewsDate(news.created_at)}</p>
                    <h4 className="text-[#1e3a8a] font-bold line-clamp-2 leading-relaxed">{news.title}</h4>
                  </Link>
                )) : (
                  <div className="text-slate-400 text-sm text-center py-6">{t('no_news') || 'ยังไม่มีประกาศสำคัญ'}</div>
                )}
              </div>
              
              <Link to="/news?category=announcement" className="mt-6 text-[#1e3a8a] font-semibold hover:underline cursor-pointer py-2">
                {t('view_all_announcements') || 'ดูประกาศทั้งหมด'} &rarr;
              </Link>
            </div>

            {/* ขวา: เรื่องเล่าความสำเร็จ (กินพื้นที่ 7 ส่วน) */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="text-yellow-500 bg-yellow-50 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">{t('news_earc') || 'เรื่องเล่าจากเครือข่าย'}</h3>
                </div>
              </div>

              <div className="flex flex-col gap-6 flex-1">
                {successStories.length > 0 ? successStories.map(news => (
                  <Link key={news.id} to={`/news/${news.id}`} className="flex flex-col sm:flex-row gap-5 group cursor-pointer bg-white p-4 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow duration-300">
                    <div className="w-full sm:w-48 h-36 sm:h-32 rounded-xl overflow-hidden shrink-0 bg-slate-200 relative">
                      {news.thumbnail_url ? (
                        <img src={news.thumbnail_url} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">No Image</div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center py-1">
                       <span className="inline-block px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-bold rounded-full mb-2 w-fit">{formatNewsDate(news.created_at)}</span>
                       <h4 className="text-[#1e3a8a] font-bold text-lg line-clamp-2 group-hover:underline leading-relaxed mb-2">{news.title}</h4>
                       <span className="text-slate-500 text-sm">{t('read_more') || 'อ่านเพิ่มเติม'} &rarr;</span>
                    </div>
                  </Link>
                )) : (
                   <div className="text-slate-400 text-sm text-center py-6">{t('no_news') || 'ยังไม่มีเรื่องเล่าจากเครือข่าย'}</div>
                )}
              </div>

              <Link to="/news?category=success_story" className="mt-6 text-[#1e3a8a] font-semibold hover:underline cursor-pointer py-2 text-right">
                {t('view_all_stories') || 'อ่านเรื่องราวทั้งหมด'} &rarr;
              </Link>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;