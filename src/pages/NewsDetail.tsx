/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';
import CommentSection from '../components/CommentSection'; 
import ReportModal from '../components/ReportModal';

// 🟢 1. ฟังก์ชันแปลภาษาอัจฉริยะ (Proportion Detection + Retry Trick)
const translateText = async (text: string, targetLang: string) => {
  if (!text || !text.trim() || text === '-') return text;
  
  // นับสัดส่วนภาษาเพื่อล็อคภาษาต้นทาง ป้องกัน Google เดามั่ว
  const cleanText = text.replace(/<[^>]*>?/gm, '');
  const thaiCharsCount = (cleanText.match(/[\u0E00-\u0E7F]/g) || []).length;
  const engCharsCount = (cleanText.match(/[a-zA-Z]/g) || []).length;
  const isThaiArticle = thaiCharsCount > engCharsCount;
  
  if (targetLang === 'th' && isThaiArticle) return text;
  if (targetLang === 'en' && !isThaiArticle) return text;

  const sourceLang = isThaiArticle ? 'th' : 'en';
  
  const fetchTranslate = async (queryText: string) => {
    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `q=${encodeURIComponent(queryText)}`,
        }
      );
      const data = await response.json();
      if (data && data[0]) return data[0].map((item: any) => item[0]).join('');
      return queryText;
    } catch (error) {
      console.error('Translation Error:', error);
      return queryText; 
    }
  };

  let result = await fetchTranslate(text);

  // ระบบแปลซ้ำสำหรับคำสั้นๆ
  if (result === text && targetLang === 'th' && !isThaiArticle && text.length <= 15) {
    const lowerResult = await fetchTranslate(text.toLowerCase());
    if (lowerResult !== text.toLowerCase()) return lowerResult;
  }

  return result;
};

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  
  const [newsItem, setNewsItem] = useState<any>(null);
  const [author, setAuthor] = useState<any>(null);
  const [relatedNews, setRelatedNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🟢 2. State สำหรับแปลภาษา
  const [translatedTitle, setTranslatedTitle] = useState('');
  const [translatedContent, setTranslatedContent] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

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

  const getCategoryTranslation = (category: string) => {
    if (!category) return '';
    const catLower = category.toLowerCase();
    
    if (catLower.includes('announcement')) {
      return t('news_announcements') || 'ประกาศสำคัญ (Announcements)';
    } else if (catLower.includes('earc') || catLower.includes('success')) {
      return t('news_earc') || 'เรื่องเล่าความสำเร็จ (EARC Spotlight)';
    } else if (catLower.includes('activity')) {
      return t('news_activity') || 'ภาพบรรยายกิจกรรมล่าสุด (Activity Snapshot)';
    }
    return category;
  };

  useEffect(() => {
    window.scrollTo(0, 0); 
    
    const fetchNewsData = async () => {
      try {
        setIsLoading(true);

        const { data: { user } } = await supabase.auth.getUser();
        let currentUserRole = 'user';
        if (user) {
          const { data: userData } = await supabase.from('user').select('role').eq('id', user.id).single();
          currentUserRole = userData?.role?.toLowerCase() || 'user';
        }

        const { data: newsData, error: newsError } = await supabase
          .from('news')
          .select('*')
          .eq('id', id)
          .single();

        if (newsError) throw newsError;

        if (newsData.status !== 'published') {
          const isAdmin = ['admin', 'developer', 'co_admin', 'co-admin'].includes(currentUserRole);
          const isAuthor = user && user.id === newsData.author_id;

          if (!isAdmin && !isAuthor) {
            setIsLoading(false); 
            showAlert(
              'error',
              t('no_permission_news') || 'คุณไม่มีสิทธิ์เข้าถึงเนื้อหานี้ หรือข่าวนี้ยังไม่ได้รับการเผยแพร่',
              () => {
                setAlertModal(prev => ({ ...prev, isOpen: false }));
                navigate('/news', { replace: true });
              }
            );
            return; 
          }
        }

        setNewsItem(newsData);

        if (newsData?.author_id) {
          const { data: authorData } = await supabase
            .from('user')
            .select('id, first_name, last_name, bio, profilepic')
            .eq('id', newsData.author_id)
            .single();
          setAuthor(authorData);
        }

        if (newsData?.category) {
          const { data: relatedData } = await supabase
            .from('news')
            .select('id, title, thumbnail_url, created_at, category, author_id, content')
            .eq('status', 'published')
            .eq('category', newsData.category)
            .neq('id', id)
            .limit(3);
            
          if (relatedData && relatedData.length > 0) {
            const authorIds = [...new Set(relatedData.map(n => n.author_id).filter(Boolean))];
            
            const { data: authorsData } = await supabase
              .from('user')
              .select('id, first_name, last_name')
              .in('id', authorIds);

            const enrichedRelatedNews = relatedData.map(n => {
              const relAuthor = authorsData?.find(a => a.id === n.author_id);
              return { 
                ...n, 
                author_name: relAuthor ? `${relAuthor.first_name} ${relAuthor.last_name}` : 'Unknown' 
              };
            });
            setRelatedNews(enrichedRelatedNews);
          } else {
            setRelatedNews([]);
          }
        }

      } catch (error) {
        console.error("Error fetching news details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchNewsData();
  }, [id, navigate, t]);

  // 🟢 3. เรียกใช้งานการแปลเนื้อหาข่าว (Trigger on language switch)
  useEffect(() => {
    const autoTranslate = async () => {
      if (!newsItem) return;

      setTranslatedTitle(newsItem.title);
      setTranslatedContent(newsItem.content);
      setIsTranslating(true);

      try {
        const [newTitle, newContent] = await Promise.all([
          translateText(newsItem.title, language),
          translateText(newsItem.content, language)
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
  }, [language, newsItem]);

  const formattedDate = newsItem ? new Date(newsItem.created_at).toLocaleDateString(
    language === 'th' ? 'th-TH' : 'en-GB', 
    { day: 'numeric', month: 'long', year: 'numeric' }
  ) : '';

  const shareToFacebook = () => {
    const currentUrl = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`, '_blank', 'width=600,height=400');
  };

  const shareToX = () => {
    const currentUrl = encodeURIComponent(window.location.href);
    const newsTitle = encodeURIComponent(newsItem?.title || 'TReN News');
    window.open(`https://twitter.com/intent/tweet?url=${currentUrl}&text=${newsTitle}`, '_blank', 'width=600,height=400');
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
          title: newsItem?.title || 'TReN News',
          text: `อ่านข่าวสาร: ${newsItem?.title}\nบน TReN ได้ที่นี่\n`,
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
        <div className="min-h-screen flex items-center justify-center text-[#1e3a8a] font-bold text-xl animate-pulse">{t('loading_news') || 'กำลังโหลดข่าวสาร...'}</div>
      </>
    );
  }

  if (!newsItem) {
    return (
      <>
        {renderAlertModal()}
        <div className="min-h-screen flex items-center justify-center text-red-500 font-bold text-xl">{t('news_not_found') || 'ไม่พบเนื้อหาข่าวสาร'}</div>
      </>
    );
  }

  const translateStatus = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'pending') return t('state_pending') || 'รอตรวจสอบ (Pending)';
    if (s === 'published') return t('state_published') || 'เผยแพร่แล้ว (Published)';
    if (s === 'rejected') return t('state_rejected') || 'ไม่อนุมัติ (Rejected)';
    if (s === 'draft') return t('save_draft') || 'แบบร่าง (Draft)';
    return status;
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {renderAlertModal()}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        
        <div className="text-[#555555] text-sm md:text-lg mt-4 mb-4">
          <Link to="/" className="hover:text-[#1e3a8a] transition-colors">{t('home') || 'Home'}</Link> / <Link to="/news" className="hover:text-[#1e3a8a] transition-colors">{t('news') || 'News'}</Link> / <span className="text-slate-800">{translatedTitle || newsItem.title}</span>
        </div>

        {newsItem.status !== 'published' && (
          <div className={`px-4 py-3 rounded-xl mt-5 mb-6 flex items-center gap-3 border ${
            newsItem.status === 'rejected' 
              ? 'bg-red-50 border-red-400 text-red-800'
              : 'bg-yellow-50 border-yellow-400 text-yellow-800' 
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-6 h-6 flex-shrink-0 ${newsItem.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            
            <div className="flex flex-col">
              <span className="font-medium">
                {t('preview_warning') || 'คุณกำลังดูตัวอย่าง (Preview) สถานะปัจจุบัน:'} <strong className="capitalize">{translateStatus(newsItem.status)}</strong> 
              </span>
              {newsItem.status === 'rejected' && newsItem.rejection_reason && (
                <span className="text-sm mt-1 text-red-700 font-semibold opacity-90">
                  เหตุผล: {newsItem.rejection_reason}
                </span>
              )}
            </div>
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1e3a8a] leading-tight mt-4 break-words">
          {translatedTitle || newsItem.title}
        </h1>
        
        {isTranslating && (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 text-xs font-semibold rounded-full mt-2 animate-pulse">
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            {t('translating') || 'กำลังแปลเนื้อหาอัตโนมัติ...'}
          </div>
        )}

        <p className="text-slate-500 mb-6 text-base sm:text-lg mt-2 flex items-center gap-3">
          <span>{formattedDate}</span>
          <span className="text-slate-300">|</span>
          <span className="bg-[#EBF1FA] text-[#1e3a8a] text-xs sm:text-sm px-3 py-1 rounded-full font-medium shadow-sm">
            {getCategoryTranslation(newsItem.category)}
          </span>
        </p>

        {newsItem.thumbnail_url && (
          <div className="w-full h-[250px] sm:h-[400px] lg:h-[450px] rounded-xl overflow-hidden mb-10 shadow-sm border border-slate-100">
            <img 
              src={newsItem.thumbnail_url} 
              alt={newsItem.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div 
          className="prose prose-lg max-w-none text-slate-700 leading-relaxed mb-12 
                     whitespace-pre-wrap break-words overflow-hidden
                     [&>p]:mb-4 [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:text-[#1e3a8a] [&>h1]:mb-4 
                     [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-[#1e3a8a] [&>h2]:mb-3
                     [&>img]:rounded-xl [&>img]:shadow-sm [&>img]:my-6 [&>img]:max-w-full [&>img]:h-auto
                     [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4
                     [&>pre]:overflow-x-auto [&>pre]:bg-slate-100 [&>pre]:p-4 [&>pre]:rounded-lg"
          dangerouslySetInnerHTML={{ __html: translatedContent || newsItem.content || '' }}
        />

        <div className='mb-12'>
          <h3 className="text-lg font-bold text-[#1e3a8a] mb-3">{t('share_post') || 'Share this post with friends'}</h3>
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

        {author && (
          <div className="bg-[#F8FAFC] p-6 rounded-2xl flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-16 border border-slate-100">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#1e3a8a] rounded-xl flex-shrink-0 flex items-center justify-center text-white text-2xl font-bold overflow-hidden shadow-inner">
              {author.profilepic ? (
                <img src={author.profilepic} alt="Author" className="w-full h-full object-cover" />
              ) : (
                `${author.first_name?.charAt(0) || ''}`
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#1e3a8a] mb-2">{author.first_name} {author.last_name}</h3>
              <p className="text-slate-600 text-sm mb-3 leading-relaxed">
                {author.bio || t('no_bio') || 'ผู้เขียนยังไม่ได้เพิ่มคำอธิบายตัวเอง (Bio)'}
              </p>
              <Link to={`/profile/${author.id}`} className="text-[#1e3a8a] hover:underline font-semibold">
                <button className="text-[#1e3a8a] text-sm font-bold underline underline-offset-4 hover:text-blue-900 transition-colors cursor-pointer">
                  {t('more_posts') || 'ดูผลงานทั้งหมดของผู้เขียน'}
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* 🟢 ข่าวสารที่เกี่ยวข้อง (Related News) */}
        {relatedNews.length > 0 && (
          <div className="mb-16 border-t border-slate-200 pt-12">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-[#1e3a8a]">{t('related_news') || 'ข่าวสารที่เกี่ยวข้อง:'}</h2>
              <Link to={`/news?category=${newsItem?.category}`} className="text-[#1e3a8a] text-sm font-bold underline underline-offset-4 hover:text-blue-900 transition-colors cursor-pointer">
                {t('view_all') || 'View all'}
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedNews.map((relNews) => (
                <div key={relNews.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col group cursor-pointer" onClick={() => navigate(`/news/${relNews.id}`)}>
                  <div className="h-40 bg-slate-200 relative overflow-hidden">
                    {relNews.thumbnail_url ? (
                      <img src={relNews.thumbnail_url} alt={relNews.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                    )}
                    {relNews.category && (
                      <span className="absolute bottom-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-md shadow-sm">
                        {getCategoryTranslation(relNews.category)}
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-[#1e3a8a] font-bold mb-2 line-clamp-1">{relNews.title}</h3>
                    <div className="text-xs text-slate-400 mb-3 space-y-1">
                      <p>{t('by_author') || 'โดย'} <span className="">{relNews.author_name}</span></p>
                      <p>{new Date(relNews.created_at).toLocaleDateString()}</p>
                    </div>
                    <p className="text-slate-500 text-xs line-clamp-3 mb-4 flex-1">
                      {stripHtml(relNews.content)}
                    </p>
                    <button className="text-slate-500 text-xs font-medium border border-slate-300 rounded-full px-4 py-1.5 w-fit hover:bg-slate-50 transition-colors cursor-pointer mt-auto">
                      {t('read_more') || 'อ่านเพิ่มเติม'} &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <CommentSection postId={newsItem.id} postType="news" />

        <ReportModal 
          isOpen={isReportOpen} 
          onClose={() => setIsReportOpen(false)} 
          targetId={newsItem.id} 
          targetType="news" 
          targetTitle={newsItem.title} 
        />

      </div>
    </div>
  );
};

export default NewsDetail;