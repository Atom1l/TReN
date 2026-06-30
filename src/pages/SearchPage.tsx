/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';

import ShowcasePreviewModal from '../components/ShowcasePreviewModal';
import EventPreviewModal from '../components/EventPreviewModal';

export default function SearchPage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [searchInput, setSearchInput] = useState(queryParam);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!queryParam);

  const [previewShowcase, setPreviewShowcase] = useState<{ isOpen: boolean; showcase: any }>({ 
    isOpen: false, 
    showcase: null 
  });
  const [previewEvent, setPreviewEvent] = useState<{ isOpen: boolean; event: any }>({ 
    isOpen: false, 
    event: null 
  });

  const [results, setResults] = useState({
    blogs: [] as any[],
    showcases: [] as any[],
    events: [] as any[],
    users: [] as any[]
  });

  const getPositionName = (val: string) => {
    if (!val) return 'User';
    const positionMap: Record<string, { th: string, en: string }> = {
      'teacher': { th: 'ครู', en: 'Teacher' },
      'assistant_teacher': { th: 'ครูผู้ช่วย', en: 'Assistant Teacher' },
      'nanny': { th: 'พี่เลี้ยง', en: 'Nanny' },
      'director': { th: 'ผู้อำนวยการ', en: 'Director' },
      'deputy_director': { th: 'รองผู้อำนวยการ', en: 'Deputy Director' },
      'admin': { th: 'ผู้ดูแลระบบ', en: 'Admin' }
    };
    const lowerVal = val.toLowerCase();
    if (positionMap[lowerVal]) return language === 'th' ? positionMap[lowerVal].th : positionMap[lowerVal].en;
    return val.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    setSearchParams({ q: searchQuery });

    const safeSearch = searchQuery.trim().replace(/"/g, ''); 
    const searchLower = safeSearch.toLowerCase();
    const orSearchFormat = `"%${safeSearch}%"`; 

    const isIntentBlog = ['บล็อก', 'บล้อก', 'blog', 'blogs', 'บทความ'].includes(searchLower);
    const isIntentShowcase = ['ผลงาน', 'ผลงานเด่น', 'showcase', 'showcases', 'แฟ้มผลงาน'].includes(searchLower);
    const isIntentEvent = ['กิจกรรม', 'event', 'events', 'งาน'].includes(searchLower);
    const isIntentUser = ['ครู', 'ผู้ใช้งาน', 'คุณครู', 'user', 'users', 'สมาชิก'].includes(searchLower);

    try {
      let blogsQuery = supabase.from('blogs').select('id, title, thumbnail_url, created_at').eq('status', 'published').limit(15);
      let showcasesQuery = supabase.from('showcases').select('*').eq('status', 'published').limit(15);
      let eventsQuery = supabase.from('events').select('*').eq('event_state', 'published').limit(15);
      let usersQuery = supabase.from('user').select('id, first_name, last_name, profilepic, role, position').limit(15);

      if (!isIntentBlog) blogsQuery = blogsQuery.ilike('title', `%${safeSearch}%`);
      if (!isIntentShowcase) showcasesQuery = showcasesQuery.or(`title.ilike.${orSearchFormat},author_name.ilike.${orSearchFormat}`);
      if (!isIntentEvent) eventsQuery = eventsQuery.ilike('title', `%${safeSearch}%`);
      
      if (!isIntentUser) {
        const nameParts = safeSearch.split(' ');
        if (nameParts.length > 1) {
          usersQuery = usersQuery
            .ilike('first_name', `%${nameParts[0]}%`)
            .ilike('last_name', `%${nameParts.slice(1).join(' ')}%`);
        } else {
          usersQuery = usersQuery.or(`first_name.ilike.${orSearchFormat},last_name.ilike.${orSearchFormat}`);
        }
      }

      const [
        { data: blogsData },
        { data: showcasesData },
        { data: eventsData },
        { data: usersData }
      ] = await Promise.all([blogsQuery, showcasesQuery, eventsQuery, usersQuery]);

      setResults({
        blogs: blogsData || [],
        showcases: showcasesData || [],
        events: eventsData || [],
        users: usersData || []
      });

    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (queryParam) performSearch(queryParam);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchInput);
  };

  const handleQuickSearch = (keyword: string) => {
    setSearchInput(keyword);
    performSearch(keyword);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const locale = language === 'th' ? 'th-TH' : 'en-GB';
    return new Date(dateString).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const totalResults = results.blogs.length + results.showcases.length + results.events.length + results.users.length;

  return (
    <div className="min-h-screen bg-white relative">
      
      <div className="bg-[#EBF1FA] py-16 px-4 sm:px-6 flex flex-col items-center justify-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1e3a8a] mb-8 text-center">
          {t('find_info_you_need') || 'ค้นหาข้อมูลที่คุณต้องการ'}
        </h1>
        
        <div className="w-full max-w-2xl flex flex-col items-center">
          <form onSubmit={handleSearchSubmit} className="w-full relative shadow-sm rounded-xl mb-4">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t('search') || 'ค้นหาที่นี่.. (เช่น บล็อก, กิจกรรม, ผลงาน)'}
              className="w-full py-4 pl-6 pr-16 text-lg rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] text-slate-700 bg-white"
            />
            <button 
              type="submit" 
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-[#1e3a8a] transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
          </form>

          {/* 🟢 ปุ่ม Quick Search สำหรับหมวดหมู่หลักๆ */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <button
                onClick={() => handleQuickSearch('บล็อก')}
                className="w-[calc(50%-0.5rem)] sm:w-auto px-4 py-1.5 bg-white border border-slate-200 text-[#1e3a8a] text-sm font-medium rounded-full hover:bg-blue-50 transition-colors shadow-sm cursor-pointer"
            >
                {t('blogs') || 'บล็อก'}
            </button>

            <button
                onClick={() => handleQuickSearch('ผลงาน')}
                className="w-[calc(50%-0.5rem)] sm:w-auto px-4 py-1.5 bg-white border border-slate-200 text-[#1e3a8a] text-sm font-medium rounded-full hover:bg-blue-50 transition-colors shadow-sm cursor-pointer"
            >
                {t('showcases') || 'ผลงาน'}
            </button>

            <button
                onClick={() => handleQuickSearch('กิจกรรม')}
                className="w-[calc(50%-0.5rem)] sm:w-auto px-4 py-1.5 bg-white border border-slate-200 text-[#1e3a8a] text-sm font-medium rounded-full hover:bg-blue-50 transition-colors shadow-sm cursor-pointer"
            >
                {t('events') || 'กิจกรรม'}
            </button>

            <button
                onClick={() => handleQuickSearch('ผู้ใช้งาน')}
                className="w-[calc(50%-0.5rem)] sm:w-auto px-4 py-1.5 bg-white border border-slate-200 text-[#1e3a8a] text-sm font-medium rounded-full hover:bg-blue-50 transition-colors shadow-sm cursor-pointer"
            >
                {t('users') || 'ผู้ใช้งาน'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        
        {isLoading && (
          <div className="text-center text-slate-500 py-20 text-lg animate-pulse font-medium">
            {t('searching') || 'กำลังค้นหา...'}
          </div>
        )}

        {!isLoading && hasSearched && totalResults === 0 && (
          <div className="text-center py-20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-slate-300 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <h2 className="text-2xl font-bold text-slate-700 mb-2">{t('No_results_found') || 'ไม่พบผลลัพธ์สำหรับ'} "{queryParam}"</h2>
            <p className="text-slate-500">{t('try_different_keywords') || 'ลองใช้คำค้นหาที่แตกต่างกัน หรือ ลองดูเนื้อหาทั้งหมด'}</p>
          </div>
        )}

        {!isLoading && hasSearched && totalResults > 0 && (
          <div className="space-y-12">
            <p className="text-slate-500 border-b border-slate-200 pb-4">
              {t('found')} {totalResults} {t('found_for')} <strong>"{queryParam}"</strong>
            </p>

            {/* หมวดหมู่: Users */}
            {results.users.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-[#1e3a8a] mb-4 border-l-4 border-[#1e3a8a] pl-3">{t('users') || 'ผู้ใช้งาน'} ({results.users.length})</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {results.users.map(u => (
                    <div key={u.id} onClick={() => navigate(`/profile/${u.id}`)} className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-[#1e3a8a] transition-all cursor-pointer group">
                      <div className="w-14 h-14 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center font-bold text-xl overflow-hidden shrink-0">
                        {u.profilepic ? <img src={u.profilepic} className="w-full h-full object-cover" alt="pic" /> : u.first_name?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 group-hover:text-[#1e3a8a] transition-colors">{u.first_name} {u.last_name}</h3>
                        <p className="text-sm text-slate-500 capitalize">{getPositionName(u.position)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* หมวดหมู่: Blogs */}
            {results.blogs.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-[#1e3a8a] mb-4 border-l-4 border-[#1e3a8a] pl-3">{t('blogs') || 'บล็อก'} ({results.blogs.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.blogs.map(b => (
                    <div key={b.id} onClick={() => navigate(`/blog/${b.id}`)} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                      <div className="h-40 bg-slate-100 overflow-hidden">
                        {b.thumbnail_url ? <img src={b.thumbnail_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="thumb"/> : <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-[#1e3a8a] line-clamp-2 mb-1 group-hover:underline">{b.title}</h3>
                        <p className="text-xs text-slate-500">{formatDate(b.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* หมวดหมู่: Showcases */}
            {results.showcases.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-[#1e3a8a] mb-4 border-l-4 border-[#1e3a8a] pl-3">{t('showcases') || 'ผลงาน'} ({results.showcases.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.showcases.map(s => (
                    <div 
                      key={s.id} 
                      onClick={() => setPreviewShowcase({ isOpen: true, showcase: s })} 
                      className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                    >
                      <div className="h-40 bg-slate-100 overflow-hidden">
                        {s.thumbnail_url ? <img src={s.thumbnail_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="thumb"/> : <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-[#1e3a8a] line-clamp-2 mb-1 group-hover:underline">{s.title}</h3>
                        <p className="text-xs text-slate-500">{t('by_author') || 'โดย'} {s.author_name || 'Unknown'} • {formatDate(s.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* หมวดหมู่: Events (อัปเดตเป็น Grid Layout แล้ว) */}
            {results.events.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-[#1e3a8a] mb-4 border-l-4 border-[#1e3a8a] pl-3">{t('events') || 'กิจกรรม'} ({results.events.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.events.map(e => (
                    <div 
                      key={e.id} 
                      onClick={() => {
                        const sStatus = (e.status || '').toLowerCase();
                        if (sStatus === 'upcoming' || sStatus === 'pending') {
                          setPreviewEvent({ isOpen: true, event: e });
                        } else {
                          navigate(`/event/${e.id}`);
                        }
                      }}
                      className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                    >
                      <div className="h-40 bg-slate-100 overflow-hidden">
                        {e.thumbnail_url ? (
                          <img src={e.thumbnail_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="thumb" />
                        ) : (
                          <div className="w-full h-full bg-blue-50 text-[#1e3a8a] flex flex-col items-center justify-center font-bold">
                            <span className="text-sm">{new Date(e.event_date).toLocaleString('default', { month: 'short' })}</span>
                            <span className="text-4xl">{new Date(e.event_date).getDate()}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-[#1e3a8a] line-clamp-2 mb-1 group-hover:underline">{e.title}</h3>
                        <p className="text-xs text-slate-500">{t('date') || 'จัดวันที่'}: {formatDate(e.event_date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>
        )}
      </div>

      <ShowcasePreviewModal 
        isOpen={previewShowcase.isOpen} 
        showcase={previewShowcase.showcase} 
        onClose={() => setPreviewShowcase({ isOpen: false, showcase: null })} 
      />

      <EventPreviewModal 
        isOpen={previewEvent.isOpen} 
        event={previewEvent.event} 
        onClose={() => setPreviewEvent({ isOpen: false, event: null })} 
      />

    </div>
  );
}