/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface ResourcePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: any; 
}

const ResourcePreviewModal: React.FC<ResourcePreviewModalProps> = ({ isOpen, onClose, resource }) => {
  const { language, t } = useLanguage();

  if (!isOpen || !resource) return null;

  const formattedDate = new Date(resource.created_at).toLocaleDateString(
    language === 'th' ? 'th-TH' : 'en-GB', 
    { day: 'numeric', month: 'long', year: 'numeric' }
  );

  // ฟังก์ชันเลือกไอคอนตามประเภทไฟล์ (ใช้กรณีไม่มีรูปภาพหน้าปก)
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'document':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        );
      case 'image/video':
      case 'video': 
      case 'image': 
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
        );
      case 'folder':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
          </svg>
        );
    }
  };

  const getResourceTypeName = (type: string) => {
    if (type === 'document') return t('filter_document') || 'เอกสาร/PDF';
    if (['image/video', 'image', 'video'].includes(type)) return t('filter_media') || 'รูปภาพ/วิดีโอ';
    if (type === 'folder') return t('filter_folder') || 'โฟลเดอร์';
    if (type === 'link') return t('filter_link') || 'ลิงก์เว็บไซต์';
    return type;
  };

  // 🟢 1. จัดการข้อมูลลิงก์ (URL) ให้รองรับ JSONB Array และ String ของเก่า
  let parsedLinks: { title: string, url: string }[] = [];
  if (resource.url) {
    try {
      if (Array.isArray(resource.url)) {
        parsedLinks = resource.url;
      } else if (typeof resource.url === 'string') {
        if (resource.url.startsWith('http')) {
          parsedLinks = [{ title: '', url: resource.url }];
        } else {
          parsedLinks = JSON.parse(resource.url);
        }
      }
    } catch (e) {
      parsedLinks = [{ title: '', url: String(resource.url) }];
    }
  }

  // กรองเอาเฉพาะลิงก์ที่กรอกข้อมูลมาจริงๆ
  const validLinks = parsedLinks.filter(link => link.url && link.url.trim() !== '');

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
          {resource.thumbnail_url ? (
            <img 
              src={resource.thumbnail_url} 
              alt={resource.title} 
              className="w-full h-full object-cover absolute inset-0"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 absolute inset-0">
               {getResourceIcon(resource.resource_type)}
            </div>
          )}
        </div>

        {/* ครึ่งขวา: รายละเอียดเนื้อหา */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center overflow-y-auto custom-scrollbar">
          <div className="mb-4">
             {/* แสดงประเภทของ Resource (Badge) */}
             <div className="flex flex-wrap gap-2 mb-3">
               <span className="bg-emerald-50 text-emerald-700 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded">
                 {getResourceTypeName(resource.resource_type)}
               </span>
             </div>
             
             <h2 className="text-2xl sm:text-3xl font-bold text-[#1e3a8a] mb-2 leading-tight">
               {resource.title}
             </h2>
             
             <p className="text-slate-400 text-sm font-medium">
                {t('added_on') || 'เพิ่มเมื่อ'} {formattedDate}
             </p>

          </div>
          
          <div className="text-slate-600 text-sm sm:text-base mb-6 border-t border-slate-100 pt-4 leading-relaxed line-clamp-[8] overflow-y-auto break-words custom-scrollbar">
            {resource.description || (t('no_description_provided') || 'ไม่มีคำอธิบายสำหรับทรัพยากรนี้')}
          </div>

          <div className="mt-auto space-y-3">
            {/* 🟢 2. วนลูปแสดงลิงก์ทั้งหมดที่มี */}
            {validLinks.length > 0 ? (
              validLinks.map((link, index) => {
                // คำนวณหา Default Label กรณีที่ผู้ใช้ไม่ได้กรอกชื่อลิงก์
                let defaultText = '';
                if (resource.resource_type === 'folder') defaultText = t('open_folder') || 'เปิดโฟลเดอร์';
                else if (['image/video', 'image', 'video'].includes(resource.resource_type)) defaultText = t('view_media') || 'ดูสื่อ (Media)';
                else if (resource.resource_type === 'document') defaultText = t('open_document') || 'เปิดเอกสาร';
                else defaultText = t('open_link') || 'เปิดลิงก์';

                const linkTitle = link.title || `${defaultText} ${validLinks.length > 1 ? index + 1 : ''}`.trim();

                return (
                  <a 
                    key={index}
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-[#1e3a8a] hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition-all shadow-md group"
                  >
                    <span>{linkTitle}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                );
              })
            ) : (
              <p className="text-center text-slate-400 text-sm italic py-2">{t('no_links_provided') || 'ไม่มีลิงก์แนบสำหรับทรัพยากรนี้'}</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResourcePreviewModal;