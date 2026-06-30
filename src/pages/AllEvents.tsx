import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';
import EventPreviewModal from '../components/EventPreviewModal';

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
}

const AllEvents = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  // 🟢 1. ดึงพารามิเตอร์จาก URL (เช่น ?filter=upcoming)
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'all';

  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [events, setEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🟢 2. Pagination State (แบบยืดหยุ่น)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const [previewModal, setPreviewModal] = useState<{ isOpen: boolean; event: EventData | null }>({
    isOpen: false,
    event: null
  });

  // 🟢 3. ดักจับขนาดหน้าจอเพื่อปรับจำนวนไอเทมที่แสดงผลต่อหน้า
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setItemsPerPage(6); // จอคอมใหญ่ (Desktop) แสดง 6 อัน
      } else if (width >= 768) {
        setItemsPerPage(4); // จอไอแพด (Tablet) แสดง 4 อัน
      } else {
        setItemsPerPage(3); // จอมือถือ (Mobile) แสดง 3 อัน
      }
    };

    // เซ็ตค่าครั้งแรกตอนโหลดเว็บ
    handleResize();

    // ดักฟังเหตุการณ์เมื่อมีการย่อขยายหน้าจอ
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchPublishedEvents = async () => {
      setIsLoading(true);
      try {
        const today = new Date().toISOString();
        await supabase
          .from('events')
          .update({ status: 'past' })
          .eq('status', 'upcoming')
          .lt('event_date', today);

        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('event_state', 'published')
          .order('event_date', { ascending: false }); // เรียงจากล่าสุด

        if (error) throw error;
        if (data) setEvents(data as EventData[]);

      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublishedEvents();
  }, []);

  // อัปเดต Filter พร้อมเปลี่ยน URL ให้ตรงกัน
  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    setSearchParams({ filter });
    setCurrentPage(1); // รีเซ็ตกลับไปหน้า 1 เสมอเวลาเปลี่ยนแท็ก
  };

  const handleEventClick = (event: EventData) => {
    const status = (event.status || '').toLowerCase();
    if (status === 'past' || status === 'done') {
      navigate(`/event/${event.id}`);
    } else {
      setPreviewModal({ isOpen: true, event });
    }
  };

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

  // ฟังก์ชันแปลภาษาสถานะบนการ์ด
  const getStatusLabel = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'upcoming') return t('status_upcoming') || 'กำลังมาถึง';
    if (s === 'past') return t('status_past') || 'ผ่านมาแล้ว';
    if (s === 'done') return t('status_done') || 'เสร็จสิ้น';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  // ฟังก์ชันกรองข้อมูล (Search + Tags)
  const filteredEvents = events.filter((event) => {
    const matchesSearch = (event.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const status = (event.status || '').toLowerCase();
    
    let matchesFilter = true;
    if (activeFilter === 'upcoming') {
      matchesFilter = status === 'upcoming';
    } else if (activeFilter === 'past') {
      matchesFilter = status === 'past' || status === 'done';
    }

    return matchesSearch && matchesFilter;
  });

  // 🟢 4. คำนวณหน้า Pagination 
  const indexOfLastEvent = currentPage * itemsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / itemsPerPage));

  // 🟢 5. ดักจับกรณีที่เปลี่ยนหน้าจอแล้วหน้าปัจจุบันเกินจำนวนหน้าที่มีอยู่จริง
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const EventCard = ({ event }: { event: EventData }) => (
    <div onClick={() => handleEventClick(event)} className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col h-full cursor-pointer group hover:-translate-y-1 transition-all duration-300">
      <div className="h-48 sm:h-56 bg-slate-200 overflow-hidden relative">
        {event.thumbnail_url ? (
          <img src={event.thumbnail_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
        )}
        <div
          className={`absolute bottom-4 left-4 px-4 py-1.5 rounded-md text-xs font-bold shadow-sm backdrop-blur-sm ${
            (event.status || '').toLowerCase() === 'past'
              ? 'bg-slate-500/90 text-white'
              : (event.status || '').toLowerCase() === 'done'
              ? 'bg-emerald-600/90 text-white'
              : 'bg-[#1e3a8a]/90 text-white'
          }`}
        >
          {getStatusLabel(event.status)}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-[#1e3a8a] text-xl font-bold mb-2 line-clamp-2">{event.title}</h3>
        <div className="space-y-1 mb-3 text-sm text-slate-700 flex-1">
          <p><span className="font-bold">{t('all_event_date') || 'วันที่'}:</span> {formatDate(event.event_date)}</p>
          <p><span className="font-bold">{t('all_event_time') || 'เวลา'}:</span> {formatTimeAMPM(event.event_time)}</p>
          <p className="truncate"><span className="font-bold">{t('all_event_place') || 'สถานที่'}:</span> {event.location || '-'}</p>
        </div>
        <p className="text-slate-500 text-sm line-clamp-2 mb-6">{event.brief_description || t('all_event_no_brief_description') || 'ไม่มีคำอธิบายโดยย่อ'}</p>
        <button className="mt-auto bg-[#1e3a8a] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-900 transition-colors w-fit text-sm cursor-pointer">
          {t('read_more') || 'อ่านเพิ่มเติม'} &rarr;
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-24">
      <EventPreviewModal 
        isOpen={previewModal.isOpen} 
        event={previewModal.event} 
        onClose={() => setPreviewModal({ isOpen: false, event: null })} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        
        {/* Breadcrumb */}
        <div className="text-slate-500 text-sm md:text-base mb-4 flex items-center gap-2">
          <span className="hover:text-[#1e3a8a] transition-colors cursor-pointer" onClick={() => navigate('/')}>{t('home') || 'หน้าแรก'}</span> 
          <span>/</span> 
          <Link to="/events" className="hover:text-[#1e3a8a] transition-colors">{t('events') || 'กิจกรรม'}</Link> 
          <span>/</span> 
          <span className="text-[#1e3a8a] font-semibold">{t('all_events') || 'กิจกรรมทั้งหมด'}</span>
        </div>

        {/* Header & Search */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#1e3a8a]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#1e3a8a" className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1e3a8a] pt-2">{t('all_events') || 'กิจกรรมทั้งหมด'}</h1>
          </div>
          <p className="text-slate-600 mb-6">{t('search_explore_events') || 'ค้นหาและสำรวจกิจกรรมทั้งหมดได้ที่นี่'}</p>
          
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input 
              type="text" 
              placeholder={t('search_events_placeholder') || 'ค้นหาโดยชื่อกิจกรรมหรือคีย์เวิร์ด..'}
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent text-lg shadow-sm"
            />
          </div>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-3 mb-10">
          {[
            { id: 'all', label: t('filter_all') || 'ทั้งหมด (All)' },
            { id: 'upcoming', label: t('filter_upcoming') || 'กำลังมาถึง (Upcoming)' },
            { id: 'past', label: t('filter_past') || 'ผ่านมาแล้ว (Past)' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterClick(filter.id)}
              className={`capitalize px-6 py-2.5 rounded-full text-sm sm:text-base font-medium capitalize transition-all duration-200 border cursor-pointer ${
                activeFilter === filter.id 
                  ? 'bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-md' 
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Event Grid */}
        {isLoading ? (
          <div className="py-20 text-center text-[#1e3a8a] font-bold text-xl animate-pulse">{t('loading_events') || 'กำลังโหลดกิจกรรม...'}</div>
        ) : currentEvents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentEvents.map(event => <EventCard key={event.id} event={event} />)}
            </div>

            {/* 🟢 6. Pagination Controls แบบยืดหยุ่น */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12 mb-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 sm:px-4 py-2 border border-slate-300 rounded-lg text-sm sm:text-base text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {t('previous') || 'ก่อนหน้า'}
                </button>
                
                <div className="flex gap-1 overflow-x-auto custom-scrollbar max-w-[200px] sm:max-w-none">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`min-w-[36px] h-9 sm:w-10 sm:h-10 px-2 rounded-lg font-medium transition-colors cursor-pointer text-sm sm:text-base flex items-center justify-center ${
                        currentPage === i + 1 
                          ? 'bg-[#1e3a8a] text-white shadow-sm' 
                          : 'text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 sm:px-4 py-2 border border-slate-300 rounded-lg text-sm sm:text-base text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {t('next') || 'ถัดไป'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className=" rounded-2xl p-16 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-slate-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">{t('no_events_found') || 'ไม่พบกิจกรรม'}</h3>
            <p className="text-slate-500">{t('no_events_found_desc') || 'ไม่พบกิจกรรมที่ตรงกับการค้นหา หรือในหมวดหมู่นี้'}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default AllEvents;