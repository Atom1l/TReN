/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface ShowcasePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  showcase: any; 
}

const ShowcasePreviewModal: React.FC<ShowcasePreviewModalProps> = ({ isOpen, onClose, showcase }) => {
  const { language, t } = useLanguage();

  if (!isOpen || !showcase) return null;

  // 🟢 1. จัดการข้อมูลลิงก์ให้รองรับทั้งแบบใหม่ (JSONB Array) และแบบเก่า (String URL)
  let parsedLinks: { title: string, url: string }[] = [];
  if (showcase['Link to work']) {
    try {
      if (Array.isArray(showcase['Link to work'])) {
        parsedLinks = showcase['Link to work'];
      } else if (typeof showcase['Link to work'] === 'string') {
        if (showcase['Link to work'].startsWith('http')) {
          parsedLinks = [{ title: t('visit_work') || 'ไปยังหน้าผลงาน', url: showcase['Link to work'] }];
        } else {
          parsedLinks = JSON.parse(showcase['Link to work']);
        }
      }
    } catch (e) {
      // Fallback เผื่อเกิดข้อผิดพลาดในการ Parse
      parsedLinks = [{ title: t('visit_work') || 'ไปยังหน้าผลงาน', url: String(showcase['Link to work']) }];
    }
  }

  // กรองเอาเฉพาะลิงก์ที่มี URL จริงๆ
  const validLinks = parsedLinks.filter(link => link.url && link.url.trim() !== '');

  const formattedDate = new Date(showcase.created_at).toLocaleDateString(
    language === 'th' ? 'th-TH' : 'en-GB', 
    { day: 'numeric', month: 'long', year: 'numeric' }
  );

  // แยกแท็กออกมาเป็นก้อนๆ
  const tags = showcase.tag ? showcase.tag.split(',').map((t: string) => t.trim()) : [];

  // แปลงข้อมูล author_data จาก JSON กลับมาเป็น Array เพื่อเอาไปทำ Link
  let parsedAuthors: any[] = [];
  try {
    if (showcase.author_data) {
      parsedAuthors = typeof showcase.author_data === 'string' 
        ? JSON.parse(showcase.author_data) 
        : showcase.author_data;
    }
  } catch (error) {
    console.error("Error parsing author_data", error);
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 animate-fade-in">
      
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-4xl max-h-[90vh] relative animate-scale-in">
        
        {/* ปุ่มกากบาท (Close) */}
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
          {showcase.thumbnail_url ? (
            <img 
              src={showcase.thumbnail_url} 
              alt={showcase.title} 
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
          <div className="mb-4">
             {/* แสดง Tags */}
             <div className="flex flex-wrap gap-2 mb-3">
               {tags.map((tag: string, index: number) => (
                 <span key={index} className="bg-blue-50 text-[#1e3a8a] text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded">
                   {tag}
                 </span>
               ))}
             </div>
             <h2 className="text-2xl sm:text-3xl font-bold text-[#1e3a8a] mb-2 leading-tight">
               {showcase.title}
             </h2>
             
             {/* ส่วนแสดงชื่อผู้เขียนพร้อมลิงก์ */}
             <p className="text-slate-500 text-sm font-medium">
                {t('by_author') || 'โดย'}{' '}
                {parsedAuthors.length > 0 ? (
                  parsedAuthors.map((author, index) => (
                    <React.Fragment key={index}>
                      {author.id ? (
                        <Link 
                          to={`/profile/${author.id}`} 
                          className="text-[#1e3a8a] hover:underline font-semibold"
                        >
                          {author.name}
                        </Link>
                      ) : (
                        <span>{author.name}</span>
                      )}
                      {index < parsedAuthors.length - 1 && ', '}
                    </React.Fragment>
                  ))
                ) : (
                  <span>
                    {showcase.author_name || (showcase.user ? `${showcase.user.first_name} ${showcase.user.last_name}` : 'Unknown')}
                  </span>
                )}
             </p>

          </div>
          
          <div className="text-slate-600 text-sm sm:text-base mb-6 border-t border-slate-100 pt-4 leading-relaxed line-clamp-[8] overflow-y-auto break-words custom-scrollbar">
            {showcase.description || 'ไม่มีคำอธิบายผลงาน'}
          </div>

          {/* 🟢 2. วนลูปสร้างปุ่มตามจำนวนลิงก์ที่ถูกกรอกเข้ามา */}
          <div className="mt-auto space-y-3">
            {validLinks.length > 0 ? (
              validLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#1e3a8a] hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition-all shadow-md group"
                >
                  {/* ถ้าไม่มีการตั้งชื่อลิงก์ ให้แสดงคำว่า 'ไปยังหน้าผลงาน' ตามด้วยตัวเลขลำดับ */}
                  <span>{link.title || `${t('visit_work') || 'ไปยังหน้าผลงาน'} ${validLinks.length > 1 ? index + 1 : ''}`}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              ))
            ) : (
              <p className="text-center text-slate-400 text-sm italic py-2">{t('no_links_provided') || 'ไม่มีลิงก์สำหรับผลงานนี้'}</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ShowcasePreviewModal;