/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';

interface MemberWorkData {
  id: string;
  title: string;
  created_at: string;
  thumbnail_url: string;
  tag: string;
  author_id: string;
  description: string;
  author_name?: string;
  "Link to work"?: string;
  user?: any;
}

// 🟢 1. ฟังก์ชันแปลภาษาอัจฉริยะ
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
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `q=${encodeURIComponent(queryText)}`,
        }
      );
      const data = await response.json();
      if (data && data[0]) {
        return data[0].map((item: any) => item[0]).join('');
      }
      return queryText;
    } catch (error) {
      console.error('Translation Error:', error);
      return queryText; 
    }
  };

  let result = await fetchTranslate(text);

  if (result === text && targetLang === 'th' && !isThaiArticle && text.length <= 15) {
    const lowerResult = await fetchTranslate(text.toLowerCase());
    if (lowerResult !== text.toLowerCase()) {
      return lowerResult;
    }
  }

  return result;
};

// 🟢 2. MemberWorkCard Component 
const MemberWorkCard: React.FC<{ 
  work: MemberWorkData; 
  normalizeTag: (rawTag: string) => string; 
}> = ({ work, normalizeTag }) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate(); 
  
  const [translatedTitle, setTranslatedTitle] = useState(work.title);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const autoTranslateCard = async () => {
      setTranslatedTitle(work.title);
      setIsTranslating(true);

      try {
        const newTitle = await translateText(work.title, language);
        setTranslatedTitle(newTitle);
      } catch (err) {
        console.error("Card translate error:", err);
      } finally {
        setIsTranslating(false);
      }
    };

    autoTranslateCard();
  }, [language, work]);

  const firstTag = work.tag ? normalizeTag(work.tag.split(',')[0]) : 'General';

  return (
    <div 
      onClick={() => navigate(`/member-work/${work.id}`)}
      className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col h-full cursor-pointer group hover:-translate-y-1 transition-all duration-300"
    >
      <div className="h-48 sm:h-56 bg-slate-200 overflow-hidden relative">
        {work.thumbnail_url ? (
          <img src={work.thumbnail_url} alt={work.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">{t('no_image') || 'No Image'}</div>
        )}
        <div className="absolute bottom-4 left-4 bg-pink-600/90 backdrop-blur-sm px-4 py-1.5 rounded-md text-xs font-bold text-white shadow-sm">
          {firstTag}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1 items-start">
        <div className="mb-2 w-full">
          {isTranslating && (
            <span className="inline-block text-[10px] bg-blue-50 text-[#1e3a8a] px-2 py-0.5 rounded font-semibold animate-pulse mb-1">
              {t('translating') || 'Translating...'}
            </span>
          )}
          <h3 className="text-[#1e3a8a] text-xl font-bold line-clamp-2 leading-tight w-full">
            {translatedTitle || work.title}
          </h3>
        </div>
        
        <p className="text-xs text-slate-500 mb-6 font-medium">
           {t('by_author') || 'By'} {work.author_name}
        </p>
        
        <button className="mt-auto border border-slate-300 text-slate-600 px-5 py-2 rounded-full font-medium group-hover:bg-slate-50 transition-colors w-fit text-sm cursor-pointer">
          {t('read_more') || 'Read more'} &rarr;
        </button>
      </div>
    </div>
  );
};

const AllMemberWorks = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'all';

  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [memberWorks, setMemberWorks] = useState<MemberWorkData[]>([]);
  const [dynamicTags, setDynamicTags] = useState<string[]>(['all']);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setItemsPerPage(6); 
      } else if (width >= 768) {
        setItemsPerPage(4); 
      } else {
        setItemsPerPage(3); 
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const normalizeTag = (rawTag: string) => {
    const lower = rawTag.trim().toLowerCase();
    if (['research', 'วิจัย', 'งานวิจัย'].includes(lower)) return 'Research';
    if (['article', 'บทความ'].includes(lower)) return 'Article';
    if (['presentation', 'นำเสนอ', 'พรีเซนต์'].includes(lower)) return 'Presentation';
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchPublishedMemberWorks = async () => {
      setIsLoading(true);
      try {
        // 💡 เปลี่ยนมาดึงข้อมูลจากตาราง member_works แทน
        const { data: worksData, error } = await supabase
          .from('member_works')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (worksData && worksData.length > 0) {
          
          const tagFrequency: Record<string, number> = {};

          const enrichedWorks = await Promise.all(
            worksData.map(async (work) => {
              if (work.tag) {
                work.tag.split(',').forEach((t: string) => {
                  const standardTag = normalizeTag(t);
                  if (standardTag) {
                    tagFrequency[standardTag] = (tagFrequency[standardTag] || 0) + 1;
                  }
                });
              }
              return work;
            })
          );

          const authorIds = [...new Set(worksData.map(w => w.author_id).filter(Boolean))];
          let usersData: any[] = [];
          if (authorIds.length > 0) {
            const { data: uData } = await supabase.from('user').select('id, first_name, last_name').in('id', authorIds);
            if (uData) usersData = uData;
          }

          const finalWorks = enrichedWorks.map(work => {
            const author = usersData.find(u => u.id === work.author_id);
            return {
              ...work,
              user: author,
              author_name: work.author_name || (author ? `${author.first_name} ${author.last_name?.charAt(0) || ''}.` : 'Unknown')
            };
          });

          const topTags = Object.entries(tagFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(entry => entry[0]);

          setDynamicTags(['all', ...topTags]);
          setMemberWorks(finalWorks);
        }
      } catch (error) {
        console.error("Error fetching member works:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublishedMemberWorks();
  }, []);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    setSearchParams({ filter });
    setCurrentPage(1); 
  };

  const filteredWorks = memberWorks.filter((work) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (work.title || '').toLowerCase().includes(searchLower) ||
      (work.author_name || '').toLowerCase().includes(searchLower) ||
      (work.tag || '').toLowerCase().includes(searchLower);
    
    let matchesFilter = true;
    if (activeFilter !== 'all') {
      const workTagsArray = (work.tag || '').split(',').map(t => normalizeTag(t));
      matchesFilter = workTagsArray.includes(activeFilter);
    }

    return matchesSearch && matchesFilter;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredWorks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(filteredWorks.length / itemsPerPage));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  return (
    <div className="min-h-screen bg-white pb-24 border-t border-slate-100">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        
        <div className="text-[#555555] text-sm md:text-lg mt-4 mb-4">
          <span className="hover:text-[#1e3a8a] transition-colors cursor-pointer" onClick={() => navigate('/')}>{t('home') || 'หน้าแรก'}</span> 
          <span className='mx-2'>/</span>
          <span className="text-[#1e3a8a] font-semibold">{t('all_member_works_title') || 'All Member Works'}</span>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center text-pink-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>        
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1e3a8a] pt-2">{t('all_member_works_title') || 'ผลงานสมาชิกทั้งหมด'}</h1>
          </div>
          <p className="text-slate-600 mb-6 text-lg">{t('explore_member_works_desc') || 'ค้นหาและรับชมผลงาน กิจกรรม และความสำเร็จจากสมาชิกเครือข่ายของเรา'}</p>
          
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input 
              type="text" 
              placeholder={t('search_member_works_placeholder') || 'ค้นหาจากชื่อผลงาน ชื่อผู้สร้าง หรือคำค้นหา...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-4 py-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent text-lg shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          {dynamicTags.map((filter) => {
            let displayLabel = filter;
            if (filter === 'all') displayLabel = t('filter_all') || 'All';
            if (filter === 'Research') displayLabel = t('tag_research') || 'Research';
            if (filter === 'Article') displayLabel = t('tag_article') || 'Article';
            if (filter === 'Presentation') displayLabel = t('tag_presentation') || 'Presentation';

            return (
              <button
                key={filter}
                onClick={() => handleFilterClick(filter)}
                className={`capitalize px-6 py-2.5 rounded-full text-sm sm:text-base font-medium transition-all duration-200 border cursor-pointer ${
                  activeFilter === filter 
                    ? 'bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-md' 
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {displayLabel}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-[#1e3a8a] font-bold text-xl animate-pulse">{t('loading_member_works') || 'กำลังโหลดผลงานสมาชิก...'}</div>
        ) : currentItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentItems.map(work => (
                <MemberWorkCard 
                  key={work.id} 
                  work={work} 
                  normalizeTag={normalizeTag} 
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
            <div className="w-20 h-20 bg-white shadow-sm text-slate-400 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">{t('no_member_works_found') || 'ไม่พบผลงานสมาชิก'}</h3>
            <p className="text-slate-500">{t('no_member_works_found_desc') || 'ไม่พบผลงานที่ตรงกับการค้นหา หรือในหมวดหมู่นี้'}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default AllMemberWorks;