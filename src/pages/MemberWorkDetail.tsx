/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';
import CommentSection from '../components/CommentSection'; 
import ReportModal from '../components/ReportModal';
import React from 'react';

// 🟢 1. ฟังก์ชันแปลภาษาอัตโนมัติ
const translateText = async (text: string, targetLang: string) => {
  if (!text || !text.trim()) return text;
  
  const cleanText = text.replace(/<[^>]*>?/gm, '');
  const thaiCharsCount = (cleanText.match(/[\u0E00-\u0E7F]/g) || []).length;
  const engCharsCount = (cleanText.match(/[a-zA-Z]/g) || []).length;
  
  const isThaiArticle = thaiCharsCount > 5;
  
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

const MemberWorkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  
  const [work, setWork] = useState<any>(null); // เปลี่ยนชื่อ State เป็น work
  const [primaryAuthor, setPrimaryAuthor] = useState<any>(null); 
  const [relatedWorks, setRelatedWorks] = useState<any[]>([]); // เปลี่ยนชื่อ State เป็น relatedWorks
  const [isLoading, setIsLoading] = useState(true);

  // State สำหรับจัดเก็บเนื้อหาที่แปลภาษาแล้ว
  const [translatedTitle, setTranslatedTitle] = useState('');
  const [translatedContent, setTranslatedContent] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

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
    
    const fetchWorkData = async () => {
      try {
        setIsLoading(true);

        const { data: { user } } = await supabase.auth.getUser();
        let currentUserRole = 'user';
        if (user) {
          const { data: userData } = await supabase.from('user').select('role').eq('id', user.id).single();
          currentUserRole = userData?.role?.toLowerCase() || 'user';
        }

        // 💡 ดึงข้อมูลจากตาราง member_works แทน
        const { data: workData, error: workError } = await supabase
          .from('member_works')
          .select('*')
          .eq('id', id)
          .single();

        if (workError) throw workError;

        if (workData.status !== 'published') {
          const isAdmin = ['admin', 'developer', 'co_admin', 'co-admin'].includes(currentUserRole);
          const isAuthor = user && user.id === workData.author_id;

          if (!isAdmin && !isAuthor) {
            setIsLoading(false); 
            showAlert(
              'error',
              t('no_permission') || 'คุณไม่มีสิทธิ์เข้าถึงเนื้อหานี้ หรือผลงานนี้ยังไม่ได้รับการเผยแพร่',
              () => {
                setAlertModal(prev => ({ ...prev, isOpen: false }));
                navigate('/profile', { replace: true });
              }
            );
            return; 
          }
        }

        setWork(workData);

        if (workData?.author_id) {
          const { data: authorData } = await supabase
            .from('user')
            .select('id, first_name, last_name, bio, profilepic')
            .eq('id', workData.author_id)
            .single();
          setPrimaryAuthor(authorData);
        }

        if (workData?.tag) {
          const mainTag = workData.tag.split(',')[0].trim();
          const { data: relatedData } = await supabase
            .from('member_works') // ดึงจากตาราง member_works
            .select('id, title, thumbnail_url, created_at, tag, author_id, description, author_data, author_name')
            .eq('status', 'published')
            .ilike('tag', `%${mainTag}%`)
            .neq('id', id)
            .limit(3);
            
          if (relatedData && relatedData.length > 0) {
            setRelatedWorks(relatedData);
          } else {
            setRelatedWorks([]);
          }
        }

      } catch (error) {
        console.error("Error fetching work details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchWorkData();
  }, [id, navigate, t]);

  useEffect(() => {
    const handleContentImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName === 'IMG' && target.closest('.article-content')) {
        setZoomedImage((target as HTMLImageElement).src);
      } else if (target && target.closest('.image-wrapper-click')) {
        const img = target.closest('.image-wrapper-click')?.querySelector('img');
        if (img) setZoomedImage(img.src);
      }
    };

    document.addEventListener('click', handleContentImageClick);

    const contentDiv = document.querySelector('.article-content');
    if (contentDiv) {
      const images = contentDiv.querySelectorAll('img:not(.processed)');
      images.forEach(img => {
        img.classList.add('processed'); 
        
        const wrapper = document.createElement('div');
        wrapper.className = 'image-wrapper-click relative group cursor-zoom-in my-8 inline-block w-fit max-w-full';
        
        img.parentNode?.insertBefore(wrapper, img);
        wrapper.appendChild(img);
        
        img.classList.add('rounded-xl', 'shadow-md', 'max-w-full', 'h-auto');
        (img as HTMLImageElement).style.margin = '0'; 

        const label = document.createElement('div');
        label.className = 'absolute bottom-3 right-3 bg-slate-900/75 text-white text-[11px] sm:text-xs md:text-sm px-3 py-1.5 rounded-lg backdrop-blur-md flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg';
        label.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
          </svg>
          <span>${t('click_to_view_full') || 'คลิกเพื่อดูภาพเต็มๆ'}</span>
        `;
        wrapper.appendChild(label);
      });
    }

    return () => document.removeEventListener('click', handleContentImageClick);
  }, [translatedContent, work, t]); 

  useEffect(() => {
    const autoTranslate = async () => {
      if (!work) return;

      setTranslatedTitle(work.title);
      setTranslatedContent(work.description);

      setIsTranslating(true);

      try {
        const [newTitle, newContent] = await Promise.all([
          translateText(work.title, language),
          translateText(work.description || '', language)
        ]);

        setTranslatedTitle(newTitle);
        setTranslatedContent(newContent);
      } catch (err) {
        console.error("Auto translate error:", err);
      } finally {
        setIsTranslating(false);
      }
    };

    autoTranslate();
  }, [language, work]);

  const tags = work?.tag ? work.tag.split(',').map((t: string) => t.trim()).filter(Boolean) : [];

  let parsedLinks: { title: string, url: string }[] = [];
  if (work && work['Link to work']) {
    try {
      if (Array.isArray(work['Link to work'])) {
        parsedLinks = work['Link to work'];
      } else if (typeof work['Link to work'] === 'string') {
        if (work['Link to work'].startsWith('http')) {
          parsedLinks = [{ title: t('visit_work') || 'ไปยังหน้าผลงาน', url: work['Link to work'] }];
        } else {
          parsedLinks = JSON.parse(work['Link to work']);
        }
      }
    } catch (e) {
      parsedLinks = [{ title: t('visit_work') || 'ไปยังหน้าผลงาน', url: String(work['Link to work']) }];
    }
  }
  const validLinks = parsedLinks.filter(link => link.url && link.url.trim() !== '');

  let parsedAuthors: any[] = [];
  try {
    if (work && work.author_data) {
      parsedAuthors = typeof work.author_data === 'string' 
        ? JSON.parse(work.author_data) 
        : work.author_data;
    }
  } catch (error) {
    console.error("Error parsing author_data", error);
  }

  const shareToFacebook = () => {
    const currentUrl = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`, '_blank', 'width=600,height=400');
  };

  const shareToX = () => {
    const currentUrl = encodeURIComponent(window.location.href);
    const postTitle = encodeURIComponent(work?.title || 'TReN Member Work');
    window.open(`https://twitter.com/intent/tweet?url=${currentUrl}&text=${postTitle}`, '_blank', 'width=600,height=400');
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
          title: work?.title || 'TReN Member Work',
          text: `อ่านผลงาน: ${work?.title}\nบน TReN ได้ที่นี่\n`,
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
    showAlert('success', t('link_copied') || 'คัดลอกลิงก์เรียบร้อยแล้ว!');
  };

  const stripHtml = (html: string) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
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
            className={`w-full py-3 text-white font-bold rounded-xl transition-colors cursor-pointer ${alertModal.type === 'success' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'}`}
          >
            {t('ok') || 'ตกลง'}
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <>
        {renderAlertModal()}
        <div className="min-h-screen flex items-center justify-center text-[#1e3a8a] font-bold text-xl animate-pulse">{t('loading') || 'กำลังโหลดข้อมูล...'}</div>
      </>
    );
  }

  if (!work) {
    return (
      <>
        {renderAlertModal()}
        <div className="min-h-screen flex items-center justify-center text-red-500 font-bold text-xl">ไม่พบผลงานนี้</div>
      </>
    );
  }

  const translateStatus = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'pending') return t('state_pending') || 'รอตรวจสอบ (Pending)';
    if (s === 'published') return t('state_published') || 'เผยแพร่แล้ว (Published)';
    if (s === 'rejected') return t('state_rejected') || 'ไม่อนุมัติ (Rejected)';
    if (s === 'draft' || s === 'in_progress') return t('status_in_progress') || 'แบบร่าง (Draft)';
    return status;
  };

  return (
    <div className="min-h-screen bg-white pb-24 relative">
      {renderAlertModal()}

      {zoomedImage && (
        <div 
          className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick={() => setZoomedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white bg-slate-800/50 hover:bg-slate-700 p-2 rounded-full cursor-pointer transition-colors z-10"
            onClick={() => setZoomedImage(null)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
          <img 
            src={zoomedImage} 
            alt="Zoomed" 
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl transform transition-transform duration-300 scale-100" 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        
        {/* Breadcrumb */}
        <div className="text-[#555555] text-sm md:text-lg mt-4 mb-4">
          <Link to="/member-works" className="hover:text-[#1e3a8a] transition-colors">{t('member_works') || 'ผลงานสมาชิก'}</Link> / <span className="text-slate-800">{translatedTitle || work.title}</span>
        </div>

        {/* Warning Bar (Preview Mode) */}
        {work.status !== 'published' && (
          <div className={`px-4 py-3 rounded-xl mt-5 mb-6 flex items-center gap-3 border ${
            work.status === 'rejected' 
              ? 'bg-red-50 border-red-400 text-red-800'
              : 'bg-yellow-50 border-yellow-400 text-yellow-800' 
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-6 h-6 flex-shrink-0 ${work.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <div className="flex flex-col">
              <span className="font-medium">
                {t('preview_warning') || 'คุณกำลังดูตัวอย่าง (Preview) สถานะปัจจุบัน:'} <strong className="capitalize">{translateStatus(work.status)}</strong> 
              </span>
              {work.status === 'rejected' && work.rejection_reason && (
                <span className="text-sm mt-1 text-red-700 font-semibold opacity-90">
                  เหตุผล: {work.rejection_reason}
                </span>
              )}
            </div>
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1e3a8a] leading-tight mt-4 break-words">
          {translatedTitle || work.title}
        </h1>
        
        {isTranslating && (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#1e3a8a] text-xs font-semibold rounded-full mt-2 animate-pulse">
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {t('translating') || 'กำลังแปลเนื้อหาอัตโนมัติ...'}
          </div>
        )}

        {/* 🟢 4. ส่วนแสดงชื่อผู้เขียน และ ปีที่สร้างผลงาน */}
        <div className="text-slate-500 text-base sm:text-lg mt-4 mb-6 leading-relaxed flex flex-wrap items-center gap-y-2">
            <span className="font-medium mr-1">{t('by_author') || 'โดย'}</span>{' '}
            {parsedAuthors.length > 0 ? (
              parsedAuthors.map((auth, index) => (
                <React.Fragment key={index}>
                  {auth.id ? (
                    <Link to={`/profile/${auth.id}`} className="text-[#1e3a8a] hover:underline font-bold">
                      {auth.name}
                    </Link>
                  ) : (
                    <span className="font-bold text-[#1e3a8a]">{auth.name}</span>
                  )}
                  {index < parsedAuthors.length - 1 && <span className="mr-1">, </span>}
                </React.Fragment>
              ))
            ) : (
              <span className="font-bold text-[#1e3a8a]">
                {work.author_name || 'Unknown'}
              </span>
            )}

            {/* แสดงปีที่สร้างผลงาน */}
            {work.year_created && (
              <>
                <span className="mx-2 text-slate-300">|</span>
                <span className="font-medium text-slate-600">
                  {work.year_created}
                </span>
              </>
            )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {tags.map((tag: string, index: number) => (
              <span key={index} className="bg-[#1e3a8a] text-white text-xs sm:text-sm px-4 py-1.5 rounded-full font-medium shadow-sm">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* ภาพหน้าปก */}
        {work.thumbnail_url && (
          <div 
            className="w-full h-[250px] sm:h-[400px] lg:h-[450px] rounded-xl overflow-hidden mb-10 shadow-sm border border-slate-100 bg-slate-100 flex items-center justify-center cursor-zoom-in relative group"
            onClick={() => setZoomedImage(work.thumbnail_url)}
          >
            <img 
              src={work.thumbnail_url} 
              alt={work.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 right-4 bg-slate-900/75 text-white text-xs md:text-sm px-3 py-1.5 rounded-lg backdrop-blur-md flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
              </svg>
              <span>{t('click_to_view_full') || 'คลิกเพื่อดูภาพเต็มๆ'}</span>
            </div>
          </div>
        )}

        {/* เนื้อหาหลัก */}
        <div 
          className="article-content max-w-none text-slate-700 leading-relaxed mb-12 
                     whitespace-pre-wrap break-words overflow-hidden
                     text-lg md:text-xl lg:text-[22px]
                     [&>p]:text-lg md:[&>p]:text-xl lg:[&>p]:text-[22px] [&>p]:mb-6
                     [&>h1]:text-3xl md:[&>h1]:text-4xl lg:[&>h1]:text-5xl [&>h1]:font-bold [&>h1]:text-[#1e3a8a] [&>h1]:mb-6 [&>h1]:mt-10
                     [&>h2]:text-2xl md:[&>h2]:text-3xl lg:[&>h2]:text-4xl [&>h2]:font-bold [&>h2]:text-[#1e3a8a] [&>h2]:mb-4 [&>h2]:mt-8
                     [&>img]:rounded-xl [&>img]:shadow-md [&>img]:my-8 [&>img]:max-w-full [&>img]:h-auto [&>img]:cursor-zoom-in hover:[&>img]:opacity-95 transition-opacity
                     [&>ul]:text-lg md:[&>ul]:text-xl lg:[&>ul]:text-[22px] [&>ul]:list-disc [&>ul]:pl-8 [&>ul]:mb-6 [&>ul>li]:mb-3
                     [&>ol]:text-lg md:[&>ol]:text-xl lg:[&>ol]:text-[22px] [&>ol]:list-decimal [&>ol]:pl-8 [&>ol]:mb-6 [&>ol>li]:mb-3
                     [&>pre]:overflow-x-auto [&>pre]:bg-slate-100 [&>pre]:p-5 [&>pre]:rounded-xl [&>pre]:text-base"
          dangerouslySetInnerHTML={{ __html: translatedContent || work.description || '' }}
        />

        {/* ปุ่ม Link to Work (ถ้ามี) */}
        {validLinks.length > 0 && (
          <div className="mb-12 border-t border-slate-200 pt-8">
            <h3 className="text-xl font-bold text-[#1e3a8a] mb-4">{t('link_to_teacher_work') || 'ลิงก์ผลงานเพิ่มเติม'}</h3>
            <div className="flex flex-wrap gap-4">
              {validLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#1e3a8a] hover:bg-blue-900 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md group"
                >
                  <span>{link.title || `${t('visit_work') || 'ไปยังหน้าผลงาน'} ${validLinks.length > 1 ? index + 1 : ''}`}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Share & Report Box */}
        <div className='mb-12 border-t border-slate-200 pt-8'>
          <h3 className="text-xl font-bold text-[#1e3a8a] mb-3">{t('share_post') || 'Share this post with friends'}</h3>
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
              onClick={() => setIsReportOpen(true)} className="flex items-center gap-1.5 text-red-500 hover:bg-red-700 hover:text-white cursor-pointer text-sm p-2.5 rounded-md transition-colors w-10 h-10 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                <line x1="4" y1="22" x2="4" y2="15" />
              </svg>
            </button>

          </div>
        </div>

        {/* กล่องประวัติผู้เขียน */}
        {primaryAuthor && (
          <div className="mb-16">
            <h3 className="text-xl font-bold text-[#1e3a8a] mb-3">{t('posted_by') || 'ผู้โพสต์ผลงาน'}</h3>
            <div className="bg-[#F8FAFC] p-6 rounded-2xl flex flex-col sm:flex-row gap-6 items-start sm:items-center border border-slate-100">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#1e3a8a] rounded-xl flex-shrink-0 flex items-center justify-center text-white text-2xl font-bold overflow-hidden shadow-inner">
                {primaryAuthor.profilepic ? (
                  <img src={primaryAuthor.profilepic} alt="Author" className="w-full h-full object-cover" />
                ) : (
                  `${primaryAuthor.first_name?.charAt(0) || ''}`
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#1e3a8a] mb-2">{primaryAuthor.first_name} {primaryAuthor.last_name}</h3>
                <p className="text-slate-600 text-sm mb-3 leading-relaxed">
                  {primaryAuthor.bio || t('no_bio') || 'ผู้เขียนยังไม่ได้เพิ่มคำอธิบายตัวเอง (Bio)'}
                </p>
                <Link to={`/profile/${primaryAuthor.id}`} className="text-[#1e3a8a] hover:underline font-semibold">
                  <button className="text-[#1e3a8a] text-sm font-bold underline underline-offset-4 hover:text-blue-900 transition-colors cursor-pointer">
                    {t('more_posts') || 'ดูผลงานทั้งหมดของผู้เขียน'}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Related Works (Member Works) */}
        {relatedWorks.length > 0 && (
          <div className="mb-16 border-t border-slate-200 pt-12">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-[#1e3a8a]">{t('related_member_works') || 'ผลงานสมาชิกที่เกี่ยวข้อง:'}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedWorks.map((relWork) => {
                 let rAuthors: any[] = [];
                 try {
                   if (relWork.author_data) {
                     rAuthors = typeof relWork.author_data === 'string' ? JSON.parse(relWork.author_data) : relWork.author_data;
                   }
                 } catch (e) { console.error(e); }

                 return (
                  <div key={relWork.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col group cursor-pointer" onClick={() => navigate(`/member-work/${relWork.id}`)}>
                    <div className="h-40 bg-slate-200 relative overflow-hidden">
                      {relWork.thumbnail_url ? (
                        <img src={relWork.thumbnail_url} alt={relWork.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                      )}
                      {relWork.tag && (
                        <span className="absolute bottom-3 left-3 bg-[#1e3a8a] text-white text-[10px] font-bold px-3 py-1 rounded-md shadow-sm">
                          {relWork.tag.split(',')[0].trim()}
                        </span>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-[#1e3a8a] font-bold mb-2 line-clamp-1">{relWork.title}</h3>
                      <div className="text-xs text-slate-400 mb-3 space-y-1">
                        <p>{t('by_author') || 'โดย'} <span>{rAuthors.length > 0 ? rAuthors[0].name : relWork.author_name}</span></p>
                        <p>{new Date(relWork.created_at).toLocaleDateString()}</p>
                      </div>
                      <p className="text-slate-500 text-xs line-clamp-3 mb-4 flex-1">
                        {stripHtml(relWork.description)}
                      </p>
                      <button className="text-slate-500 text-xs font-medium border border-slate-300 rounded-full px-4 py-1.5 w-fit hover:bg-slate-50 transition-colors cursor-pointer mt-auto">
                        {t('read_more') || 'อ่านเพิ่มเติม'} &rarr;
                      </button>
                    </div>
                  </div>
                 )
              })}
            </div>
          </div>
        )}

        {/* เรียกใช้ Component แสดงคอมเมนต์ โดยตั้ง postType เป็น member_work */}
        <CommentSection
          postId={work.id}
          postType={"member_work" as "news" | "blog" | "event" | "showcase"}
        />

        <ReportModal 
          isOpen={isReportOpen} 
          onClose={() => setIsReportOpen(false)} 
          targetId={work.id} 
          targetType="member_work" 
          targetTitle={work.title} 
        />

      </div>
    </div>
  );
};

export default MemberWorkDetail;