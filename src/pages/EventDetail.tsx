/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';

import CommentSection from '../components/CommentSection'; 
import ReportModal from '../components/ReportModal';

const EventDetail = () => {
  const { id } = useParams();
  
  const { language, t } = useLanguage(); 
  
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isReportOpen, setIsReportOpen] = useState(false);

  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    type: 'success', 
    message: '',
    onConfirm: () => {}
  });

  const showAlert = (type: 'success' | 'error', message: string, onConfirm?: () => void) => {
    setAlertModal({
      isOpen: true,
      type,
      message,
      onConfirm: onConfirm || (() => setAlertModal(prev => ({ ...prev, isOpen: false })))
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0); 
    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchEvent();
  }, [id]);

  // ==========================================
  // 🟢 ฟังก์ชันแชร์ไปยัง Social Media
  // ==========================================
  const shareToFacebook = () => {
    const currentUrl = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`, '_blank', 'width=600,height=400');
  };

  const shareToX = () => {
    const currentUrl = encodeURIComponent(window.location.href);
    const eventTitle = encodeURIComponent(event?.title || 'TReN Event');
    window.open(`https://twitter.com/intent/tweet?url=${currentUrl}&text=${eventTitle}`, '_blank', 'width=600,height=400');
  };

  const shareToLine = () => {
    const currentUrl = encodeURIComponent(window.location.href);
    window.open(`https://social-plugins.line.me/lineit/share?url=${currentUrl}`, '_blank', 'width=600,height=400');
  };

  const shareNative = async () => {
    const currentUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title || 'TReN Event',
          text: `ดูกิจกรรม: ${event?.title}\nบน TReN ได้ที่นี่\n`,
          url: currentUrl,
        });
      } catch (error) {
        console.log('Error sharing natively', error);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showAlert('success', t('link_copied') || 'คัดลอกลิงก์แล้ว!');
  };

  const renderAlertModal = () => {
    if (!alertModal.isOpen) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center max-w-sm w-full animate-scale-in">
          {alertModal.type === 'success' ? (
            <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-5 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
            </div>
          ) : (
            <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-5 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </div>
          )}
          <h3 className={`text-2xl font-bold mb-2 ${alertModal.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
            {alertModal.type === 'success' ? (t('success') || 'Success!') : (t('error') || 'Error!')}
          </h3>
          <p className="text-slate-600 text-lg mb-8">{alertModal.message}</p>
          <button
            onClick={alertModal.onConfirm}
            className={`w-full py-3 text-white font-bold rounded-xl transition-colors ${alertModal.type === 'success' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'}`}
          >
            {t('ok') || 'ตกลง'}
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-[#1e3a8a] font-bold text-xl animate-pulse">Loading Event...</div>;
  }

  if (!event) {
    return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold text-xl">Event Not Found</div>;
  }

  const formattedDate = new Date(event.event_date).toLocaleDateString(
    language === 'th' ? 'th-TH' : 'en-GB', 
    { day: 'numeric', month: 'long', year: 'numeric' }
  );

  const resourceLinks = Array.isArray(event.resource_links) ? event.resource_links : [];

  return (
    <div className="min-h-screen bg-white pb-24">
      {renderAlertModal()}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        
        {/* Breadcrumb */}
        <div className="text-[#555555] text-sm md:text-lg mt-4">
          <Link to="/events" className="hover:text-[#1e3a8a] transition-colors">{t('events') || 'Events'}</Link> / <span className="text-slate-800">{event.title}</span>
        </div>

        {/* Title & Info */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1e3a8a] leading-tight mt-4 break-words">
          {event.title}
        </h1>
        <p className="text-slate-500 mb-6 text-base sm:text-lg mt-2">
          {formattedDate} | {event.location || 'ไม่ระบุสถานที่'}
        </p>

        {/* Cover Image */}
        {event.thumbnail_url && (
          <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-xl overflow-hidden mb-10 shadow-sm border border-slate-100">
            <img 
              src={event.thumbnail_url} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* About this Event */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#1e3a8a] mb-4">{t('about_event') || 'About this Event'}</h2>
          <p className="text-slate-700 leading-relaxed text-lg whitespace-pre-wrap break-words">
            {event.full_recap_content || 'ยังไม่มีการสรุปเนื้อหาสำหรับกิจกรรมนี้'}
          </p>
        </div>

        {/* Event Resources */}
        {resourceLinks.length > 0 && (
          <div className="bg-[#F4F6F9] rounded-2xl p-8 mb-12">
            <h3 className="text-xl font-bold text-[#1e3a8a] mb-6">{t('resource_link') || 'Event Resources'}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resourceLinks.map((link: { title: string, url: string }, index: number) => (
                <a 
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center gap-4 group cursor-pointer border border-slate-100"
                >
                  <div className="w-12 h-12 bg-blue-50 text-[#1e3a8a] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                    </svg>
                  </div>
                  <span className="text-[#1e3a8a] font-medium underline decoration-1 underline-offset-4">
                    {link.title || `Resource Link ${index + 1}`}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Share and Report */}
        <div className='mb-12 border-t border-slate-200 pt-8'>
          <h3 className="text-lg font-bold text-[#1e3a8a] mb-3">{t('share_post') || 'Share this post with a friends'}</h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
            <div className="flex flex-wrap gap-2">
              <button onClick={shareToFacebook} title="Share to Facebook" className="w-10 h-10 bg-[#EBF1FA] text-[#1e3a8a] rounded-md flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-colors cursor-pointer">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
              </button>
              
              <button onClick={shareToX} title="Share to X (Twitter)" className="w-10 h-10 bg-[#EBF1FA] text-[#1e3a8a] rounded-md flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"></path></svg>
              </button>
              
              <button onClick={shareToLine} title="Share to LINE" className="w-10 h-10 bg-[#EBF1FA] text-[#1e3a8a] rounded-md flex items-center justify-center font-bold text-xs hover:bg-[#00B900] hover:text-white transition-colors cursor-pointer">
                LINE
              </button>

              <button onClick={shareNative} title="แชร์ไปแอปอื่นๆ (IG, Messenger)" className="w-10 h-10 bg-[#EBF1FA] text-[#1e3a8a] rounded-md flex items-center justify-center hover:bg-[#1e3a8a] hover:text-white transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>
              </button>

              <button onClick={handleCopyLink} title="คัดลอกลิงก์" className="w-10 h-10 bg-[#EBF1FA] text-[#1e3a8a] rounded-md flex items-center justify-center font-bold hover:bg-[#1e3a8a] hover:text-white transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
              </button>
            </div>

            <button 
              onClick={() => setIsReportOpen(true)} className="flex items-center gap-1.5 text-red-500 hover:bg-red-700 hover:text-white cursor-pointer text-sm p-2.5 rounded-md transition-colors w-10 h-10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                <line x1="4" y1="22" x2="4" y2="15" />
              </svg>
            </button>
          </div>
        </div>

        <CommentSection postId={event.id} postType="event" />
        
        <ReportModal 
          isOpen={isReportOpen} 
          onClose={() => setIsReportOpen(false)} 
          targetId={event.id} 
          targetType="event" 
          targetTitle={event.title} 
        />

      </div>
    </div>
  );
};

export default EventDetail;