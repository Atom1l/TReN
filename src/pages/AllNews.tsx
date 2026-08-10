/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';

interface NewsData {
  id: string;
  title: string;
  created_at: string;
  thumbnail_url: string;
  category: string;
  author_id: string;
  content: string;
  author_name?: string;
}

// 🟢 1. ฟังก์ชันแปลภาษาอัตโนมัติ
const translateText = async (text: string, targetLang: string) => {
  if (!text || !text.trim() || text === '-') return text;
  
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

  if (result === text && targetLang === 'th' && !isThaiArticle && text.length <= 15) {
    const lowerResult = await fetchTranslate(text.toLowerCase());
    if (lowerResult !== text.toLowerCase()) return lowerResult;
  }

  return result;
};

// ตัด HTML Tags
const stripHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

// 🟢 2. Component สำหรับการ์ดข่าวสาร
const NewsCard: React.FC<{ 
  newsItem: NewsData; 
  onClick: () => void; 
  getCategoryTranslation: (cat: string) => string; 
}> = ({ newsItem, onClick, getCategoryTranslation }) => {
  const { t, language } = useLanguage();

  const [translatedTitle, setTranslatedTitle] = useState(newsItem.title);
  const [translatedSnippet, setTranslatedSnippet] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const autoTranslateCard = async () => {
      const rawSnippet = stripHtml(newsItem.content) || '';
      setTranslatedTitle(newsItem.title);
      setTranslatedSnippet(rawSnippet);
      setIsTranslating(true);

      try {
        const [newTitle, newSnippet] = await Promise.all([
          translateText(newsItem.title, language),
          translateText(rawSnippet, language)
        ]);
        setTranslatedTitle(newTitle);
        setTranslatedSnippet(newSnippet);
      } catch (err) {
        console.error("Card translate error:", err);
      } finally {
        setIsTranslating(false);
      }
    };

    autoTranslateCard();
  }, [language, newsItem]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString(
      language === 'th' ? 'th-TH' : 'en-GB', 
      { day: 'numeric', month: 'long', year: 'numeric' }
    );
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col h-full cursor-pointer group hover:-translate-y-1 transition-all duration-300"
    >
      <div className="h-48 sm:h-56 bg-slate-200 overflow-hidden relative">
        {newsItem.thumbnail_url ? (
          <img src={newsItem.thumbnail_url} alt={newsItem.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">{t('no_image') || 'No Image'}</div>
        )}
        <div className="absolute bottom-4 left-4 bg-orange-500/90 backdrop-blur-sm px-4 py-1.5 rounded-md text-xs font-bold text-white shadow-sm">
          {getCategoryTranslation(newsItem.category)}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-2">
          {isTranslating && (
            <span className="inline-block text-[10px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded font-semibold animate-pulse mb-1">
              {t('translating') || 'Translating...'}
            </span>
          )}
          <h3 className="text-[#1e3a8a] text-xl font-bold line-clamp-2 leading-tight">{translatedTitle || newsItem.title}</h3>
        </div>
        
        <div className="text-xs text-slate-500 mb-3 space-y-1 mt-1">
          <p className="flex items-center gap-1.5 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-[#1e3a8a]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            <span className='pt-1'>{t('by_author') || 'โพสต์โดย'} {newsItem.author_name}</span>
          </p>
          <p className="pt-1">{formatDate(newsItem.created_at)}</p>
        </div>

        <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
          {translatedSnippet || stripHtml(newsItem.content) || t('no_content') || 'ไม่มีเนื้อหาโดยย่อ'}
        </p>
        
        <button className="mt-auto border border-slate-300 text-slate-600 px-5 py-2 rounded-full font-medium hover:bg-slate-50 transition-colors w-fit text-sm cursor-pointer">
          {t('read_more') || 'อ่านเพิ่มเติม'} &rarr;
        </button>
      </div>
    </div>
  );
};

const AllNews = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = searchParams.get('category') || 'all';

  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [news, setNews] = useState<NewsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6); 

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) setItemsPerPage(6); 
      else if (width >= 768) setItemsPerPage(4); 
      else setItemsPerPage(3); 
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCategoryTranslation = (category: string) => {
    if (!category) return '';
    const catLower = category.toLowerCase();
    if (catLower.includes('announcement')) return t('news_announcements') || 'ประกาศสำคัญ';
    if (catLower.includes('earc') || catLower.includes('success')) return t('news_earc') || 'เรื่องเล่าเครือข่าย';
    if (catLower.includes('activity')) return t('news_activity') || 'ภาพกิจกรรม';
    return category;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString(
      language === 'th' ? 'th-TH' : 'en-GB', 
      { day: 'numeric', month: 'long', year: 'numeric' }
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchPublishedNews = async () => {
      setIsLoading(true);
      try {
        const { data: newsData, error: newsError } = await supabase
          .from('news')
          .select('id, title, created_at, thumbnail_url, category, author_id, content')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (newsError) throw newsError;

        if (newsData && newsData.length > 0) {
          const authorIds = [...new Set(newsData.map(n => n.author_id).filter(Boolean))];
          let usersData: any[] = [];
          if (authorIds.length > 0) {
            const { data: uData } = await supabase.from('user').select('id, first_name, last_name').in('id', authorIds);
            if (uData) usersData = uData;
          }

          const finalNews = newsData.map(item => {
            const author = usersData.find(u => u.id === item.author_id);
            return {
              ...item,
              author_name: author ? `${author.first_name} ${author.last_name?.charAt(0) || ''}.` : 'TReN Admin'
            };
          });

          setNews(finalNews as NewsData[]);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublishedNews();
  }, []);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    setSearchParams({ category: filter });
    setCurrentPage(1); 
  };

  const filteredNews = news.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    
    // ค้นหาแบบกว้างขึ้น (ครอบคลุมวันที่ด้วย)
    const matchesSearch = 
      (item.title || '').toLowerCase().includes(searchLower) ||
      (item.author_name || '').toLowerCase().includes(searchLower) ||
      (stripHtml(item.content) || '').toLowerCase().includes(searchLower) ||
      formatDate(item.created_at).toLowerCase().includes(searchLower);
    
    let matchesFilter = true;
    if (activeFilter !== 'all') {
      matchesFilter = (item.category || '').toLowerCase() === activeFilter.toLowerCase();
    }

    return matchesSearch && matchesFilter;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNews = filteredNews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(filteredNews.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const filterOptions = [
    { id: 'all', label: t('filter_all') || 'ข่าวสารทั้งหมด' },
    { id: 'announcement', label: t('news_announcements') || 'ประกาศสำคัญ' },
    { id: 'success_story', label: t('news_earc') || 'เรื่องเล่าความสำเร็จ' },
    { id: 'activity_snapshot', label: t('news_activity') || 'ภาพกิจกรรมล่าสุด' },
  ];

  return (
    <div className="min-h-screen bg-white pb-24 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        
        <div className="text-[#555555] text-sm md:text-lg mt-4 mb-4">
          <span className="hover:text-[#1e3a8a] transition-colors cursor-pointer" onClick={() => navigate('/')}>{t('home') || 'หน้าแรก'}</span> 
          <span className='mx-2'>/</span>
          <span className="text-[#1e3a8a] font-semibold">{t('news') || 'ข่าวสารและอัปเดต'}</span> 
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#1e3a8a]">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#1e3a8a" className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1e3a8a] pt-2">{t('all_news') || 'ข่าวสารทั้งหมด'}</h1>
          </div>
          <p className="text-slate-600 mb-6 text-lg">{t('search_explore_news') || 'ติดตามประกาศและข่าวสารความเคลื่อนไหวล่าสุดได้ที่นี่'}</p>
          
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input 
              type="text" 
              placeholder={t('search_news_placeholder') || 'ค้นหาโดยหัวข้อข่าว, เนื้อหา หรือวันที่...'}
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-14 pr-4 py-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent text-lg shadow-sm"
            />
          </div>
        </div>

        {/* 🟢 3. ปุ่มตัวกรองหมวดหมู่ข่าวสาร (Filter) */}
        <div className="flex flex-wrap gap-3 mb-10">
          {filterOptions.map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterClick(filter.id)}
              className={`px-6 sm:px-8 py-2.5 rounded-full text-sm sm:text-base font-medium transition-all duration-200 border cursor-pointer ${
                activeFilter === filter.id 
                  ? 'bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-md' 
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-[#1e3a8a] font-bold text-xl animate-pulse">{t('loading_news') || 'กำลังโหลดข่าวสาร...'}</div>
        ) : currentNews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentNews.map(newsItem => (
                <NewsCard 
                  key={newsItem.id} 
                  newsItem={newsItem} 
                  onClick={() => navigate(`/news/${newsItem.id}`)} 
                  getCategoryTranslation={getCategoryTranslation} 
                />
              ))}
            </div>

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
          <div className="rounded-2xl p-16 text-center flex flex-col items-center justify-center border border-slate-100 bg-slate-50 mt-8">
            <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mb-4 text-slate-400">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
               </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">{t('no_news') || 'ไม่พบข่าวสาร'}</h3>
            <p className="text-slate-500">{t('try_different_keywords') || 'ลองใช้คำค้นหาที่แตกต่างกัน หรือ ลองดูเนื้อหาทั้งหมด หรือในหมวดหมู่นี้'}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default AllNews;