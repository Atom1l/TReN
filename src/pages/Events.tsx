import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const Events = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [events, setEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State สำหรับเปิดปิด Pop-up ของ Upcoming Events
  const [previewModal, setPreviewModal] = useState<{ isOpen: boolean; event: EventData | null }>({
    isOpen: false,
    event: null
  });

  useEffect(() => {
    window.scrollTo(0, 0); // รีเซ็ตหน้าจอไปบนสุด

    const fetchPublishedEvents = async () => {
      setIsLoading(true);
      try {
        // 1. อัปเดต Past อัตโนมัติเผื่อไว้
        const today = new Date().toISOString();
        await supabase
          .from('events')
          .update({ status: 'past' })
          .eq('status', 'upcoming')
          .lt('event_date', today);

        // 2. ดึงเฉพาะกิจกรรมที่อนุมัติแล้ว (published)
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('event_state', 'published');

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

  // ฟังก์ชันแยกหมวดหมู่กิจกรรม
  const upcomingEvents = events
    .filter(ev => (ev.status || '').toLowerCase() === 'upcoming')
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()) // เรียงจากใกล้ถึงก่อน
    .slice(0, 3); // แสดงแค่ 3 อันแรก

  const pastEvents = events
    .filter(ev => ['past', 'done'].includes((ev.status || '').toLowerCase()))
    .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime()) // เรียงจากล่าสุดไปอดีต
    .slice(0, 3); // แสดงแค่ 3 อันแรก

  // ฟังก์ชันคลิกการ์ด (แยกตามสถานะ)
  const handleEventClick = (event: EventData) => {
    const status = (event.status || '').toLowerCase();
    if (status === 'past' || status === 'done') {
      navigate(`/event/${event.id}`);
    } else {
      setPreviewModal({ isOpen: true, event });
    }
  };

  // Helper Functions สำหรับฟอร์แมตวันและเวลา
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

  // คอมโพเนนต์ย่อยสำหรับการ์ดกิจกรรม
  const EventCard = ({ event }: { event: EventData }) => (
    <div onClick={() => handleEventClick(event)} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-slate-100 overflow-hidden flex flex-col h-full cursor-pointer group">
      <div className="h-48 sm:h-56 bg-slate-200 overflow-hidden relative">
        {event.thumbnail_url ? (
          <img src={event.thumbnail_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
        )}
        {/* ป้ายกำกับสถานะ */}
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${
          ['past', 'done'].includes((event.status || '').toLowerCase()) ? 'bg-slate-800/80' : 'bg-[#1e3a8a]/90'
        }`}>
          {['past', 'done'].includes((event.status || '').toLowerCase()) ? 'Past Event' : 'Upcoming'}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-[#1e3a8a] text-xl font-bold mb-4 line-clamp-2">{event.title}</h3>
        <div className="space-y-1 mb-4 text-sm text-slate-700 flex-1">
          <p><span className="font-bold">Date:</span> {formatDate(event.event_date)}</p>
          <p><span className="font-bold">Time:</span> {formatTimeAMPM(event.event_time)}</p>
          <p className="truncate"><span className="font-bold">Place:</span> {event.location || '-'}</p>
        </div>
        <p className="text-slate-500 text-sm line-clamp-2 mb-6">{event.brief_description || 'ไม่มีคำอธิบายโดยย่อ'}</p>
        <button className="mt-auto bg-[#1e3a8a] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-900 transition-colors w-fit text-sm">
          See more &rarr;
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-[#1e3a8a] font-bold text-xl animate-pulse">{t('loading_events')}</div>;
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      
      {/* 🟢 Modal สำหรับ Upcoming Events */}
      <EventPreviewModal 
        isOpen={previewModal.isOpen} 
        event={previewModal.event} 
        onClose={() => setPreviewModal({ isOpen: false, event: null })} 
      />

      {/* 🟢 Hero Section */}
      <div className="bg-[#EBF1FA] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1e3a8a] mb-6">
              {t('events') || 'Events'}
            </h1>
            <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum gravida, eros eget ullamcorper posuere, ligula diam sagittis erat, eget tristique dui mi acn ut libero. Ut eros lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          <div className="flex-1 w-full">
            <div className="w-full h-[250px] sm:h-[350px] rounded-2xl overflow-hidden shadow-lg">
              {/* เปลี่ยนลิงก์รูปภาพ Hero ตรงนี้ได้เลยครับ */}
              <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop" alt="Events Hero" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* 🟢 Upcoming Events Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1e3a8a]">Upcoming Events</h2>
          <button 
            onClick={() => navigate('/events/all?filter=upcoming')} 
            className="text-slate-500 hover:text-[#1e3a8a] font-medium underline underline-offset-4 transition-colors cursor-pointer"
            >
            {t('view_all') || 'ดูทั้งหมด'}
          </button>
        </div>
        
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map(event => <EventCard key={event.id} event={event} />)}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl p-10 text-center text-slate-500 border border-slate-100">
            {t('no_events_found') || 'ยังไม่มีกิจกรรมที่กำลังจะเกิดขึ้น'}
          </div>
        )}
      </div>

      {/* 🟢 Past Events Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1e3a8a]">Past Events</h2>
          <button 
            onClick={() => navigate('/events/all?filter=past')} 
            className="text-slate-500 hover:text-[#1e3a8a] font-medium underline underline-offset-4 transition-colors cursor-pointer"
            >
            {t('view_all') || 'ดูทั้งหมด'}
          </button>
        </div>
        
        {pastEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map(event => <EventCard key={event.id} event={event} />)}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl p-10 text-center text-slate-500 border border-slate-100">
            {t('no_events_found') || 'ยังไม่มีกิจกรรมที่ผ่านมา'}
          </div>
        )}
      </div>

    </div>
  );
};

export default Events;