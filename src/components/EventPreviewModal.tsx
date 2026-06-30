/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface EventPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any; 
}

const EventPreviewModal: React.FC<EventPreviewModalProps> = ({ isOpen, onClose, event }) => {
  const { language, t } = useLanguage();

  if (!isOpen || !event) return null;

  // 1. ฟังก์ชันจัดฟอร์แมตวันที่
  const formattedDate = new Date(event.event_date).toLocaleDateString(
    language === 'th' ? 'th-TH' : 'en-GB', 
    { day: 'numeric', month: 'long', year: 'numeric' }
  );

  // 🟢 2. ฟังก์ชันสำหรับเติม A.M. / P.M. อัตโนมัติ
  const formatTimeAMPM = (timeRange: string) => {
    if (!timeRange) return '-';
    
    // แยกเวลาเริ่มกับเวลาจบออกจากกันด้วย " - "
    const times = timeRange.split(' - ');
    if (times.length !== 2) return timeRange; 

    const formatSingleTime = (time: string) => {
      const [h] = time.split(':');
      const hour = parseInt(h, 10);
      
      // เช็คว่าเป็นช่วงเช้าหรือบ่าย
      const ampm = hour >= 12 ? 'P.M.' : 'A.M.';
      
      // หมายเหตุ: ตามรูปต้นฉบับ คุณใช้ 15:00 P.M. (เลข 24 ชม. คู่กับ P.M.)
      // ผมจึงทำโค้ดให้แสดงผลเป็น 15:00 P.M. ตามดีไซน์ที่คุณแนบมาครับ
      return `${time} ${ampm}`;
      
      // *ถ้าอนาคตอยากเปลี่ยนให้เป็นระบบ 12 ชม. แท้ๆ (เช่น 03:00 P.M.) ให้ลบบรรทัดบน แล้วใช้ 2 บรรทัดล่างนี้แทนครับ*
      // const hour12 = hour % 12 || 12;
      // return `${String(hour12).padStart(2, '0')}:${m} ${ampm}`;
    };

    return `${formatSingleTime(times[0])} - ${formatSingleTime(times[1])}`;
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 animate-fade-in">
      
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-4xl max-h-[90vh] relative animate-scale-in">
        
        {/* ปุ่มกากบาท (Close) มุมขวาบน */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-white/80 backdrop-blur-sm rounded-full p-1 z-10 transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* ครึ่งซ้าย: รูปภาพ Thumbnail */}
        <div className="w-full md:w-1/2 h-64 md:h-auto bg-slate-100 flex-shrink-0 relative">
          {event.thumbnail_url ? (
            <img 
              src={event.thumbnail_url} 
              alt={event.title} 
              className="w-full h-full object-cover absolute inset-0"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 absolute inset-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
            </div>
          )}
        </div>

        {/* ครึ่งขวา: รายละเอียดเนื้อหา */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center overflow-y-auto custom-scrollbar">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1e3a8a] mb-2 pr-6 leading-tight">
            {event.title}
          </h2>
          
          <div className="space-y-1 text-base sm:text-lg text-slate-700 mb-6">
            <p className="flex items-start  gap-3">
              <span className="font-bold min-w-[60px] text-[#1e3a8a]">{t('event_date')}:</span> 
              <span className="font-medium">{formattedDate}</span>
            </p>

            {/* 🟢 3. เรียกใช้ฟังก์ชัน formatTimeAMPM ตรงนี้ */}
            <p className="flex items-start gap-3">
              <span className="font-bold min-w-[60px] text-[#1e3a8a]">{t('event_time')}:</span> 
              <span className="font-medium">{formatTimeAMPM(event.event_time)}</span>
            </p>
            
            <p className="flex items-start gap-3">
              <span className="font-bold min-w-[60px] text-[#1e3a8a]">{t('event_location')}:</span> 
              <span className="font-medium">{event.location || '-'}</span>
            </p>
          </div>
          
          <p className="text-slate-500 leading-relaxed text-sm sm:text-base border-t border-slate-200 pt-6 break-words whitespace-pre-wrap">
            {event.brief_description || 'ไม่มีคำอธิบายโดยย่อ'}
          </p>
        </div>

      </div>
    </div>
  );
};

export default EventPreviewModal;