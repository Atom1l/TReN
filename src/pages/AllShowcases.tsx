/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';
import ShowcasePreviewModal from '../components/ShowcasePreviewModal';

interface ShowcaseData {
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

const AllShowcases = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'all';

  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showcases, setShowcases] = useState<ShowcaseData[]>([]);
  const [dynamicTags, setDynamicTags] = useState<string[]>(['all']);
  const [isLoading, setIsLoading] = useState(true);

  // 🟢 1. State สำหรับ Pagination เปลี่ยนให้ปรับค่าได้ (ไม่ตายตัว)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // State สำหรับควบคุมการเปิด/ปิด Pop-up Modal
  const [viewModal, setViewModal] = useState<{ isOpen: boolean, showcase: ShowcaseData | null }>({ 
    isOpen: false, 
    showcase: null 
  });

  // 🟢 2. ดักจับขนาดหน้าจอเพื่อปรับจำนวนไอเทมที่แสดงผลต่อหน้า
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setItemsPerPage(6); // จอคอมใหญ่ (Desktop) แสดง 6 อัน
      } else if (width >= 768) {
        setItemsPerPage(4); // จอไอแพด (Tablet) แสดง 4 อัน
      } else {
        setItemsPerPage(3); // จอมือถือ (Mobile) แสดง 3 อัน
      }
    };

    // เซ็ตค่าครั้งแรกตอนโหลดเว็บ
    handleResize();

    // ดักฟังเหตุการณ์เมื่อมีการย่อขยายหน้าจอ
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

    const fetchPublishedShowcases = async () => {
      setIsLoading(true);
      try {
        const { data: showcasesData, error } = await supabase
          .from('showcases')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (showcasesData && showcasesData.length > 0) {
          
          const tagFrequency: Record<string, number> = {};

          const enrichedShowcases = await Promise.all(
            showcasesData.map(async (sc) => {
              if (sc.tag) {
                sc.tag.split(',').forEach((t: string) => {
                  const standardTag = normalizeTag(t);
                  if (standardTag) {
                    tagFrequency[standardTag] = (tagFrequency[standardTag] || 0) + 1;
                  }
                });
              }
              return sc;
            })
          );

          const authorIds = [...new Set(showcasesData.map(s => s.author_id).filter(Boolean))];
          let usersData: any[] = [];
          if (authorIds.length > 0) {
            const { data: uData } = await supabase.from('user').select('id, first_name, last_name').in('id', authorIds);
            if (uData) usersData = uData;
          }

          const finalShowcases = enrichedShowcases.map(sc => {
            const author = usersData.find(u => u.id === sc.author_id);
            return {
              ...sc,
              user: author,
              author_name: sc.author_name || (author ? `${author.first_name} ${author.last_name?.charAt(0) || ''}.` : 'Unknown')
            };
          });

          const topTags = Object.entries(tagFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(entry => entry[0]);

          setDynamicTags(['all', ...topTags]);
          setShowcases(finalShowcases);
        }
      } catch (error) {
        console.error("Error fetching showcases:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublishedShowcases();
  }, []);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    setSearchParams({ filter });
    setCurrentPage(1); 
  };

  const filteredShowcases = showcases.filter((sc) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (sc.title || '').toLowerCase().includes(searchLower) ||
      (sc.author_name || '').toLowerCase().includes(searchLower) ||
      (sc.tag || '').toLowerCase().includes(searchLower);
    
    let matchesFilter = true;
    if (activeFilter !== 'all') {
      const scTagsArray = (sc.tag || '').split(',').map(t => normalizeTag(t));
      matchesFilter = scTagsArray.includes(activeFilter);
    }

    return matchesSearch && matchesFilter;
  });

  // 🟢 3. คำนวณข้อมูลที่จะนำมาแสดง (Pagination Logic)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredShowcases.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(filteredShowcases.length / itemsPerPage));

  // 🟢 4. รีเซ็ตหน้ากลับไปเป็นหน้าแรกเมื่อมีการพิมพ์ค้นหา
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // 🟢 5. ดักจับกรณีที่เปลี่ยนหน้าจอ (Resize) แล้วหน้าปัจจุบันเกินจำนวนหน้าที่มีอยู่จริง
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const ShowcaseCard = ({ showcase }: { showcase: ShowcaseData }) => {
    const firstTag = showcase.tag ? normalizeTag(showcase.tag.split(',')[0]) : 'General';

    return (
      <div 
        onClick={() => setViewModal({ isOpen: true, showcase })}
        className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col h-full cursor-pointer group hover:-translate-y-1 transition-all duration-300"
      >
        <div className="h-48 sm:h-56 bg-slate-200 overflow-hidden relative">
          {showcase.thumbnail_url ? (
            <img src={showcase.thumbnail_url} alt={showcase.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">{t('no_image') || 'No Image'}</div>
          )}
          <div className="absolute bottom-4 left-4 bg-[#1e3a8a]/90 backdrop-blur-sm px-4 py-1.5 rounded-md text-xs font-bold text-white shadow-sm">
            {firstTag}
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-1 items-start">
          <h3 className="text-[#1e3a8a] text-xl font-bold mb-2 line-clamp-2 leading-tight">{showcase.title}</h3>
          
          <p className="text-xs text-slate-500 mb-6 font-medium">
             {t('by_author') || 'By'} {showcase.author_name}
          </p>
          
          <button className="mt-auto border border-slate-300 text-slate-600 px-5 py-2 rounded-full font-medium group-hover:bg-slate-50 transition-colors w-fit text-sm cursor-pointer">
            {t('read_more') || 'Read more'} &rarr;
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white pb-24 border-t border-slate-100">
      
      <ShowcasePreviewModal 
        isOpen={viewModal.isOpen} 
        showcase={viewModal.showcase} 
        onClose={() => setViewModal({ isOpen: false, showcase: null })} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        
        <div className="text-slate-500 text-sm md:text-base mb-4 flex items-center gap-2">
          <span className="hover:text-[#1e3a8a] transition-colors cursor-pointer" onClick={() => navigate('/')}>{t('home') || 'หน้าแรก'}</span> 
          <span>/</span>
          <span className="text-[#1e3a8a] font-semibold">{t('all_showcases_title') || 'All Showcases'}</span>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#1e3a8a]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#1e3a8a" className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>            
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1e3a8a] pt-2">{t('all_showcases_title') || 'ผลงานทั้งหมด'}</h1>
          </div>
          <p className="text-slate-600 mb-6 text-lg">{t('explore_showcases_desc') || 'Explore the works, presentations, and research from our members.'}</p>
          
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input 
              type="text" 
              placeholder={t('search_showcases_placeholder') || 'Search by title, author or keyword..'}
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
          <div className="py-20 text-center text-[#1e3a8a] font-bold text-xl animate-pulse">{t('loading_showcases') || 'Loading Showcases...'}</div>
        ) : currentItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentItems.map(sc => <ShowcaseCard key={sc.id} showcase={sc} />)}
            </div>

            {/* 🟢 6. ส่วน UI ของตัวเปลี่ยนหน้า (Pagination Controls) แบบยืดหยุ่น */}
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
            <h3 className="text-xl font-bold text-slate-700 mb-2">{t('no_showcases_found') || 'No showcases found'}</h3>
            <p className="text-slate-500">{t('no_showcases_found_desc') || 'ไม่พบผลงานที่ตรงกับการค้นหา หรือในหมวดหมู่นี้'}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default AllShowcases;