/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface EventPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any; 
}

// 1. ฟังก์ชันแปลภาษาอัจฉริยะ (ใช้แปลแค่ ชื่อ, สถานที่, รายละเอียด)
const translateText = async (text: string, targetLang: string) => {
  if (!text || !text.trim()) return text;
  
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

const EventPreviewModal: React.FC<EventPreviewModalProps> = ({ isOpen, onClose, event }) => {
  const { language, t } = useLanguage();

  const [translatedTitle, setTranslatedTitle] = useState('');
  const [translatedLocation, setTranslatedLocation] = useState('');
  const [translatedDesc, setTranslatedDesc] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const autoTranslate = async () => {
      if (!isOpen || !event) return;

      setTranslatedTitle(event.title);
      setTranslatedLocation(event.location || '');
      setTranslatedDesc(event.brief_description || '');
      
      // 🟢 นำ target_audience ออกจากการแปลอัตโนมัติของ Google
      setIsTranslating(true);

      try {
        const [newTitle, newLocation, newDesc] = await Promise.all([
          translateText(event.title, language),
          translateText(event.location || '', language),
          translateText(event.brief_description || '', language)
        ]);

        setTranslatedTitle(newTitle);
        setTranslatedLocation(newLocation);
        setTranslatedDesc(newDesc);
      } catch (err) {
        console.error("Modal translate error:", err);
      } finally {
        setIsTranslating(false);
      }
    };

    autoTranslate();
  }, [isOpen, language, event]);

  if (!isOpen || !event) return null;

  const formattedDate = new Date(event.event_date).toLocaleDateString(
    language === 'th' ? 'th-TH' : 'en-GB', 
    { day: 'numeric', month: 'long', year: 'numeric' }
  );

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

    return `${formatSingleTime(times[0])} - ${formatSingleTime(times[1])}`;
  };

  // 🟢 2. ฟังก์ชันตรวจสอบค่าจาก DB เพื่อแสดงคำแปลแบบ Manual ที่สละสลวย
  const getTargetTranslation = (targetValue: string) => {
    if (!targetValue) return '-';
    
    // เช็คว่าค่าจาก Database คืออะไร แล้วดึง t('...') มาโชว์
    switch (targetValue) {
      // ตัวอย่างที่ 1: ถ้าใน DB เก็บค่านี้ ให้ดึงคำแปลจาก key 'target_public'
      case 'สำหรับครูทั่วไปและบุคคลทั่วไป':
      case 'teacher': 
        return t('target_teacher') || 'สำหรับครูทั่วไป';
        
      // ตัวอย่างที่ 2: ถ้าใน DB เก็บค่านี้ ให้ดึงคำแปลจาก key 'target_mentor'
      case 'สำหรับครูพี่เลี้ยง (Mentor)':
      case 'assistant_teacher':
        return t('target_mentor') || 'สำหรับครูพี่เลี้ยง';
      
      case 'สำหรับบุคคลทั่วไป':
      case 'everyone':
        return t('target_everyone') || 'สำหรับบุคคลทั่วไป';
        
      // ถ้าข้อมูลไม่ตรงกับเคสข้างบนเลย ให้ใช้ค่าดั้งเดิมจากฐานข้อมูลโชว์ไปเลย
      default:
        return targetValue; 
    }
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
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-start overflow-y-auto custom-scrollbar">
          
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1e3a8a] mb-1 pr-6 leading-tight">
              {translatedTitle || event.title}
            </h2>
            
            {isTranslating && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 text-[#1e3a8a] text-[11px] font-semibold rounded-full mb-3 w-fit animate-pulse">
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                {t('translating') || 'Translating...'}
              </div>
            )}
            
            <div className="space-y-1 text-base sm:text-lg text-slate-700 mb-6 mt-3">
              <p className="flex items-start gap-3">
                <span className="font-bold min-w-[70px] text-[#1e3a8a]">{t('event_date') || 'วันที่'}:</span> 
                <span className="font-medium">{formattedDate}</span>
              </p>

              <p className="flex items-start gap-3">
                <span className="font-bold min-w-[70px] text-[#1e3a8a]">{t('event_time') || 'เวลา'}:</span> 
                <span className="font-medium">{formatTimeAMPM(event.event_time)}</span>
              </p>
              
              <p className="flex items-start gap-3">
                <span className="font-bold min-w-[70px] text-[#1e3a8a]">{t('event_location') || 'สถานที่'}:</span> 
                <span className="font-medium">{translatedLocation || event.location || '-'}</span>
              </p>

              {/* 🟢 3. เรียกใช้งานการดึงคำแปลแบบ Manual */}
              {event.target_audience && (
                <p className="flex items-start gap-3">
                  <span className="font-bold min-w-[70px] text-[#1e3a8a] whitespace-nowrap">{t('target_audience') || 'กลุ่มเป้าหมาย'}:</span> 
                  <span className="font-medium">{getTargetTranslation(event.target_audience)}</span>
                </p>
              )}
            </div>
            
            <p className="text-slate-500 leading-relaxed text-sm sm:text-base border-t border-slate-200 pt-6 break-words whitespace-pre-wrap">
              {translatedDesc || event.brief_description || 'ไม่มีคำอธิบายโดยย่อ'}
            </p>
          </div>

          {/* 🟢 4. ปรับปุ่มให้เต็มความกว้าง (w-full) และจัดเนื้อหาให้อยู่ตรงกลาง (justify-center) */}
          {event.registration_url && (
            <div className="mt-8 pt-4 shrink-0 border-t border-slate-100">
              <a 
                href={event.registration_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#1e3a8a] text-white px-6 py-3.5 rounded-xl font-bold hover:bg-blue-900 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                {t('register_join') || 'ลงทะเบียนเข้าร่วม'}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default EventPreviewModal;