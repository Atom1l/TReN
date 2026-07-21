/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState, useEffect } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import { supabase } from '../lib/supabaseClient';
// import { useLanguage } from '../contexts/LanguageContext';

// import ShowcasePreviewModal from '../components/ShowcasePreviewModal';
// import EventPreviewModal from '../components/EventPreviewModal';
// import ResourcePreviewModal from '../components/ResourcePreviewModal';

// export default function SearchPage() {
//   const { t, language } = useLanguage();
//   const navigate = useNavigate();
  
//   const [searchParams, setSearchParams] = useSearchParams();
//   const queryParam = searchParams.get('q') || '';

//   const [searchInput, setSearchInput] = useState(queryParam);
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasSearched, setHasSearched] = useState(!!queryParam);

//   const [previewShowcase, setPreviewShowcase] = useState<{ isOpen: boolean; showcase: any }>({ 
//     isOpen: false, 
//     showcase: null 
//   });
//   const [previewEvent, setPreviewEvent] = useState<{ isOpen: boolean; event: any }>({ 
//     isOpen: false, 
//     event: null 
//   });
//   const [previewResource, setPreviewResource] = useState<{ isOpen: boolean; resource: any }>({ 
//     isOpen: false, 
//     resource: null 
//   });

//   // 1. เพิ่ม resources ลงใน State
//   const [results, setResults] = useState({
//     blogs: [] as any[],
//     showcases: [] as any[],
//     events: [] as any[],
//     users: [] as any[],
//     resources: [] as any[]
//   });

//   const getPositionName = (val: string) => {
//     if (!val) return 'User';
//     const positionMap: Record<string, { th: string, en: string }> = {
//       'teacher': { th: 'ครู', en: 'Teacher' },
//       'assistant_teacher': { th: 'ครูผู้ช่วย', en: 'Assistant Teacher' },
//       'nanny': { th: 'พี่เลี้ยง', en: 'Nanny' },
//       'director': { th: 'ผู้อำนวยการ', en: 'Director' },
//       'deputy_director': { th: 'รองผู้อำนวยการ', en: 'Deputy Director' },
//       'admin': { th: 'ผู้ดูแลระบบ', en: 'Admin' }
//     };
//     const lowerVal = val.toLowerCase();
//     if (positionMap[lowerVal]) return language === 'th' ? positionMap[lowerVal].th : positionMap[lowerVal].en;
//     return val.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
//   };

//   const performSearch = async (searchQuery: string) => {
//     if (!searchQuery.trim()) return;
    
//     setIsLoading(true);
//     setHasSearched(true);
//     setSearchParams({ q: searchQuery });

//     const safeSearch = searchQuery.trim().replace(/"/g, ''); 
//     const searchLower = safeSearch.toLowerCase();
//     const orSearchFormat = `"%${safeSearch}%"`; 

//     const isIntentBlog = ['บล็อก', 'บล้อก', 'blog', 'blogs', 'บทความ'].includes(searchLower);
//     const isIntentShowcase = ['ผลงาน', 'ผลงานเด่น', 'showcase', 'showcases', 'แฟ้มผลงาน'].includes(searchLower);
//     const isIntentEvent = ['กิจกรรม', 'event', 'events', 'งาน'].includes(searchLower);
//     const isIntentUser = ['ครู', 'ผู้ใช้งาน', 'คุณครู', 'user', 'users', 'สมาชิก'].includes(searchLower);
//     // 2. เพิ่ม Intent สำหรับ Resources
//     const isIntentResource = ['สื่อ', 'ทรัพยากร', 'เอกสาร', 'resource', 'resources'].includes(searchLower);

//     try {
//       let blogsQuery = supabase.from('blogs').select('id, title, thumbnail_url, created_at').eq('status', 'published').limit(15);
//       let showcasesQuery = supabase.from('showcases').select('*').eq('status', 'published').limit(15);
//       let eventsQuery = supabase.from('events').select('*').eq('event_state', 'published').limit(15);
//       let usersQuery = supabase.from('user').select('id, first_name, last_name, profilepic, role, position').limit(15);
//       // 3. เพิ่ม Query สำหรับ Resource (ค้นหาจาก title และ description)
//       let resourcesQuery = supabase.from('resources').select('*').eq('status', 'published').limit(15);

//       if (!isIntentBlog) blogsQuery = blogsQuery.ilike('title', `%${safeSearch}%`);
//       if (!isIntentShowcase) showcasesQuery = showcasesQuery.or(`title.ilike.${orSearchFormat},author_name.ilike.${orSearchFormat}`);
//       if (!isIntentEvent) eventsQuery = eventsQuery.ilike('title', `%${safeSearch}%`);
//       if (!isIntentResource) resourcesQuery = resourcesQuery.or(`title.ilike.${orSearchFormat},description.ilike.${orSearchFormat}`);
      
//       if (!isIntentUser) {
//         const nameParts = safeSearch.split(' ');
//         if (nameParts.length > 1) {
//           usersQuery = usersQuery
//             .ilike('first_name', `%${nameParts[0]}%`)
//             .ilike('last_name', `%${nameParts.slice(1).join(' ')}%`);
//         } else {
//           usersQuery = usersQuery.or(`first_name.ilike.${orSearchFormat},last_name.ilike.${orSearchFormat}`);
//         }
//       }

//       // ดึงข้อมูลพร้อมกันทั้งหมด รวม Resource เข้าไปด้วย
//       const [
//         { data: blogsData, error: blogsError },
//         { data: showcasesData, error: showcasesError },
//         { data: eventsData, error: eventsError },
//         { data: usersData, error: usersError },
//         { data: resourcesData, error: resourcesError }
//       ] = await Promise.all([blogsQuery, showcasesQuery, eventsQuery, usersQuery, resourcesQuery]);

//       console.log("👉 ข้อมูล Resource ที่ค้นเจอ:", resourcesData);
//       if (resourcesError) console.error("🚨 Error Resource:", resourcesError);

//       setResults({
//         blogs: blogsData || [],
//         showcases: showcasesData || [],
//         events: eventsData || [],
//         users: usersData || [],
//         resources: resourcesData || [] // อัปเดต State
//       });

//     } catch (error) {
//       console.error('Error searching:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (queryParam) performSearch(queryParam);
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const handleSearchSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     performSearch(searchInput);
//   };

//   const handleQuickSearch = (keyword: string) => {
//     setSearchInput(keyword);
//     performSearch(keyword);
//   };

//   const formatDate = (dateString: string) => {
//     if (!dateString) return '';
//     const locale = language === 'th' ? 'th-TH' : 'en-GB';
//     return new Date(dateString).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
//   };

//   // คำนวณจำนวนผลลัพธ์ทั้งหมด
//   const totalResults = results.blogs.length + results.showcases.length + results.events.length + results.users.length + results.resources.length;

//   return (
//     <div className="min-h-screen bg-white relative">
      
//       <div className="bg-[#EBF1FA] py-16 px-4 sm:px-6 flex flex-col items-center justify-center">
//         <h1 className="text-3xl sm:text-4xl font-bold text-[#1e3a8a] mb-8 text-center">
//           {t('find_info_you_need') || 'ค้นหาข้อมูลที่คุณต้องการ'}
//         </h1>
        
//         <div className="w-full max-w-2xl flex flex-col items-center">
//           <form onSubmit={handleSearchSubmit} className="w-full relative shadow-sm rounded-xl mb-4">
//             <input
//               type="text"
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               placeholder={t('search') || 'ค้นหาที่นี่.. (เช่น บล็อก, กิจกรรม, สื่อ)'}
//               className="w-full py-4 pl-6 pr-16 text-lg rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] text-slate-700 bg-white"
//             />
//             <button 
//               type="submit" 
//               className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-[#1e3a8a] transition-colors cursor-pointer"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
//               </svg>
//             </button>
//           </form>

//           {/* 🟢 ปุ่ม Quick Search สำหรับหมวดหมู่หลักๆ */}
//           <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
//             <button
//                 onClick={() => handleQuickSearch('บล็อก')}
//                 className="w-[calc(50%-0.5rem)] sm:w-auto px-4 py-1.5 bg-white border border-slate-200 text-[#1e3a8a] text-sm font-medium rounded-full hover:bg-blue-50 transition-colors shadow-sm cursor-pointer"
//             >
//                 {t('blogs') || 'บล็อก'}
//             </button>

//             <button
//                 onClick={() => handleQuickSearch('ผลงาน')}
//                 className="w-[calc(50%-0.5rem)] sm:w-auto px-4 py-1.5 bg-white border border-slate-200 text-[#1e3a8a] text-sm font-medium rounded-full hover:bg-blue-50 transition-colors shadow-sm cursor-pointer"
//             >
//                 {t('showcases') || 'ผลงาน'}
//             </button>

//             <button
//                 onClick={() => handleQuickSearch('กิจกรรม')}
//                 className="w-[calc(50%-0.5rem)] sm:w-auto px-4 py-1.5 bg-white border border-slate-200 text-[#1e3a8a] text-sm font-medium rounded-full hover:bg-blue-50 transition-colors shadow-sm cursor-pointer"
//             >
//                 {t('events') || 'กิจกรรม'}
//             </button>

//             {/* 4. เพิ่มปุ่ม Quick Search หมวดหมู่สื่อ/ทรัพยากร */}
//             <button
//                 onClick={() => handleQuickSearch('สื่อ')}
//                 className="w-[calc(50%-0.5rem)] sm:w-auto px-4 py-1.5 bg-white border border-slate-200 text-[#1e3a8a] text-sm font-medium rounded-full hover:bg-blue-50 transition-colors shadow-sm cursor-pointer"
//             >
//                 {t('resources') || 'สื่อ/ทรัพยากร'}
//             </button>

//             <button
//                 onClick={() => handleQuickSearch('ผู้ใช้งาน')}
//                 className="w-[calc(50%-0.5rem)] sm:w-auto px-4 py-1.5 bg-white border border-slate-200 text-[#1e3a8a] text-sm font-medium rounded-full hover:bg-blue-50 transition-colors shadow-sm cursor-pointer"
//             >
//                 {t('users') || 'ผู้ใช้งาน'}
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        
//         {isLoading && (
//           <div className="text-center text-slate-500 py-20 text-lg animate-pulse font-medium">
//             {t('searching') || 'กำลังค้นหา...'}
//           </div>
//         )}

//         {!isLoading && hasSearched && totalResults === 0 && (
//           <div className="text-center py-20">
//             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-slate-300 mb-4">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
//             </svg>
//             <h2 className="text-2xl font-bold text-slate-700 mb-2">{t('No_results_found') || 'ไม่พบผลลัพธ์สำหรับ'} "{queryParam}"</h2>
//             <p className="text-slate-500">{t('try_different_keywords') || 'ลองใช้คำค้นหาที่แตกต่างกัน หรือ ลองดูเนื้อหาทั้งหมด'}</p>
//           </div>
//         )}

//         {!isLoading && hasSearched && totalResults > 0 && (
//           <div className="space-y-12">
//             <p className="text-slate-500 border-b border-slate-200 pb-4">
//               {t('found')} {totalResults} {t('found_for')} <strong>"{queryParam}"</strong>
//             </p>

//             {/* หมวดหมู่: Users */}
//             {results.users.length > 0 && (
//               <section>
//                 <h2 className="text-xl font-bold text-[#1e3a8a] mb-4 border-l-4 border-[#1e3a8a] pl-3">{t('users') || 'ผู้ใช้งาน'} ({results.users.length})</h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   {results.users.map(u => (
//                     <div key={u.id} onClick={() => navigate(`/profile/${u.id}`)} className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-[#1e3a8a] transition-all cursor-pointer group">
//                       <div className="w-14 h-14 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center font-bold text-xl overflow-hidden shrink-0">
//                         {u.profilepic ? <img src={u.profilepic} className="w-full h-full object-cover" alt="pic" /> : u.first_name?.charAt(0)}
//                       </div>
//                       <div>
//                         <h3 className="font-bold text-slate-800 group-hover:text-[#1e3a8a] transition-colors">{u.first_name} {u.last_name}</h3>
//                         <p className="text-sm text-slate-500 capitalize">{getPositionName(u.position)}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </section>
//             )}

//             {/* หมวดหมู่: Blogs */}
//             {results.blogs.length > 0 && (
//               <section>
//                 <h2 className="text-xl font-bold text-[#1e3a8a] mb-4 border-l-4 border-[#1e3a8a] pl-3">{t('blogs') || 'บล็อก'} ({results.blogs.length})</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {results.blogs.map(b => (
//                     <div key={b.id} onClick={() => navigate(`/blog/${b.id}`)} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
//                       <div className="h-40 bg-slate-100 overflow-hidden">
//                         {b.thumbnail_url ? <img src={b.thumbnail_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="thumb"/> : <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>}
//                       </div>
//                       <div className="p-4">
//                         <h3 className="font-bold text-[#1e3a8a] line-clamp-2 mb-1 group-hover:underline">{b.title}</h3>
//                         <p className="text-xs text-slate-500">{formatDate(b.created_at)}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </section>
//             )}

//             {/* หมวดหมู่: Showcases */}
//             {results.showcases.length > 0 && (
//               <section>
//                 <h2 className="text-xl font-bold text-[#1e3a8a] mb-4 border-l-4 border-[#1e3a8a] pl-3">{t('showcases') || 'ผลงาน'} ({results.showcases.length})</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {results.showcases.map(s => (
//                     <div 
//                       key={s.id} 
//                       onClick={() => setPreviewShowcase({ isOpen: true, showcase: s })} 
//                       className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
//                     >
//                       <div className="h-40 bg-slate-100 overflow-hidden">
//                         {s.thumbnail_url ? <img src={s.thumbnail_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="thumb"/> : <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>}
//                       </div>
//                       <div className="p-4">
//                         <h3 className="font-bold text-[#1e3a8a] line-clamp-2 mb-1 group-hover:underline">{s.title}</h3>
//                         <p className="text-xs text-slate-500">{t('by_author') || 'โดย'} {s.author_name || 'Unknown'} • {formatDate(s.created_at)}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </section>
//             )}

//             {/* หมวดหมู่: Events */}
//             {results.events.length > 0 && (
//               <section>
//                 <h2 className="text-xl font-bold text-[#1e3a8a] mb-4 border-l-4 border-[#1e3a8a] pl-3">{t('events') || 'กิจกรรม'} ({results.events.length})</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {results.events.map(e => (
//                     <div 
//                       key={e.id} 
//                       onClick={() => {
//                         const sStatus = (e.status || '').toLowerCase();
//                         if (sStatus === 'upcoming' || sStatus === 'pending') {
//                           setPreviewEvent({ isOpen: true, event: e });
//                         } else {
//                           navigate(`/event/${e.id}`);
//                         }
//                       }}
//                       className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
//                     >
//                       <div className="h-40 bg-slate-100 overflow-hidden">
//                         {e.thumbnail_url ? (
//                           <img src={e.thumbnail_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="thumb" />
//                         ) : (
//                           <div className="w-full h-full bg-blue-50 text-[#1e3a8a] flex flex-col items-center justify-center font-bold">
//                             <span className="text-sm">{new Date(e.event_date).toLocaleString('default', { month: 'short' })}</span>
//                             <span className="text-4xl">{new Date(e.event_date).getDate()}</span>
//                           </div>
//                         )}
//                       </div>
//                       <div className="p-4">
//                         <h3 className="font-bold text-[#1e3a8a] line-clamp-2 mb-1 group-hover:underline">{e.title}</h3>
//                         <p className="text-xs text-slate-500">{t('date') || 'จัดวันที่'}: {formatDate(e.event_date)}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </section>
//             )}

//             {/* 5. หมวดหมู่ใหม่: Resources */}
//             {results.resources.length > 0 && (
//               <section>
//                 <h2 className="text-xl font-bold text-[#1e3a8a] mb-4 border-l-4 border-[#1e3a8a] pl-3">{t('resources') || 'สื่อ/ทรัพยากร'} ({results.resources.length})</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {results.resources.map(r => (
//                     <div 
//                       key={r.id} 
//                       // 🟢 3. เปลี่ยนจาก navigate ไปใช้การ set state เพื่อเปิด Modal แทน
//                       onClick={() => setPreviewResource({ isOpen: true, resource: r })} 
//                       className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
//                     >
//                       <div className="h-40 bg-slate-100 overflow-hidden">
//                         {r.thumbnail_url ? (
//                           <img src={r.thumbnail_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="thumb"/>
//                         ) : (
//                           <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
//                         )}
//                       </div>
//                       <div className="p-4">
//                         <h3 className="font-bold text-[#1e3a8a] line-clamp-2 mb-1 group-hover:underline">{r.title}</h3>
//                         <p className="text-xs text-slate-500">{formatDate(r.created_at)}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </section>
//             )}

//           </div>
//         )}
//       </div>

//       <ShowcasePreviewModal 
//         isOpen={previewShowcase.isOpen} 
//         showcase={previewShowcase.showcase} 
//         onClose={() => setPreviewShowcase({ isOpen: false, showcase: null })} 
//       />

//       <EventPreviewModal 
//         isOpen={previewEvent.isOpen} 
//         event={previewEvent.event} 
//         onClose={() => setPreviewEvent({ isOpen: false, event: null })} 
//       />

//       <ResourcePreviewModal 
//         isOpen={previewResource.isOpen}
//         resource={previewResource.resource}
//         onClose={() => setPreviewResource({ isOpen: false, resource: null })}
//       />

//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';

import ShowcasePreviewModal from '../components/ShowcasePreviewModal';
import EventPreviewModal from '../components/EventPreviewModal';
import ResourcePreviewModal from '../components/ResourcePreviewModal';

// 🟢 1. ฟังก์ชันแปลภาษาอัจฉริยะแบบนับสัดส่วนตัวอักษร (Proportion Detection + Retry Trick)
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

// 🟢 2. แยก Component การ์ดแต่ละหมวดหมู่ออกมา เพื่อให้แปลภาษาในตัวเองได้อิสระ
const SearchBlogCard = ({ blog, onClick, formatDate }: any) => {
  const { t, language } = useLanguage();
  const [translatedTitle, setTranslatedTitle] = useState(blog.title);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const autoTranslate = async () => {
      setTranslatedTitle(blog.title);
      setIsTranslating(true);
      try {
        const res = await translateText(blog.title, language);
        setTranslatedTitle(res);
      } finally {
        setIsTranslating(false);
      }
    };
    autoTranslate();
  }, [blog.title, language]);

  return (
    <div onClick={onClick} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
      <div className="h-40 bg-slate-100 overflow-hidden">
        {blog.thumbnail_url ? <img src={blog.thumbnail_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="thumb"/> : <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>}
      </div>
      <div className="p-4">
        {isTranslating && <span className="inline-block text-[10px] bg-blue-50 text-[#1e3a8a] px-2 py-0.5 rounded font-semibold animate-pulse mb-1">{t('translating') || 'Translating...'}</span>}
        <h3 className="font-bold text-[#1e3a8a] line-clamp-2 mb-1 group-hover:underline">{translatedTitle || blog.title}</h3>
        <p className="text-xs text-slate-500">{formatDate(blog.created_at)}</p>
      </div>
    </div>
  );
};

const SearchShowcaseCard = ({ showcase, onClick, formatDate }: any) => {
  const { t, language } = useLanguage();
  const [translatedTitle, setTranslatedTitle] = useState(showcase.title);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const autoTranslate = async () => {
      setTranslatedTitle(showcase.title);
      setIsTranslating(true);
      try {
        const res = await translateText(showcase.title, language);
        setTranslatedTitle(res);
      } finally {
        setIsTranslating(false);
      }
    };
    autoTranslate();
  }, [showcase.title, language]);

  return (
    <div onClick={onClick} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
      <div className="h-40 bg-slate-100 overflow-hidden">
        {showcase.thumbnail_url ? <img src={showcase.thumbnail_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="thumb"/> : <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>}
      </div>
      <div className="p-4">
        {isTranslating && <span className="inline-block text-[10px] bg-blue-50 text-[#1e3a8a] px-2 py-0.5 rounded font-semibold animate-pulse mb-1">{t('translating') || 'Translating...'}</span>}
        <h3 className="font-bold text-[#1e3a8a] line-clamp-2 mb-1 group-hover:underline">{translatedTitle || showcase.title}</h3>
        <p className="text-xs text-slate-500">{t('by_author') || 'โดย'} {showcase.author_name || 'Unknown'} • {formatDate(showcase.created_at)}</p>
      </div>
    </div>
  );
};

const SearchEventCard = ({ event, onClick, formatDate }: any) => {
  const { t, language } = useLanguage();
  const [translatedTitle, setTranslatedTitle] = useState(event.title);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const autoTranslate = async () => {
      setTranslatedTitle(event.title);
      setIsTranslating(true);
      try {
        const res = await translateText(event.title, language);
        setTranslatedTitle(res);
      } finally {
        setIsTranslating(false);
      }
    };
    autoTranslate();
  }, [event.title, language]);

  return (
    <div onClick={onClick} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
      <div className="h-40 bg-slate-100 overflow-hidden">
        {event.thumbnail_url ? (
          <img src={event.thumbnail_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="thumb" />
        ) : (
          <div className="w-full h-full bg-blue-50 text-[#1e3a8a] flex flex-col items-center justify-center font-bold">
            <span className="text-sm">{new Date(event.event_date).toLocaleString('default', { month: 'short' })}</span>
            <span className="text-4xl">{new Date(event.event_date).getDate()}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        {isTranslating && <span className="inline-block text-[10px] bg-blue-50 text-[#1e3a8a] px-2 py-0.5 rounded font-semibold animate-pulse mb-1">{t('translating') || 'Translating...'}</span>}
        <h3 className="font-bold text-[#1e3a8a] line-clamp-2 mb-1 group-hover:underline">{translatedTitle || event.title}</h3>
        <p className="text-xs text-slate-500">{t('date') || 'จัดวันที่'}: {formatDate(event.event_date)}</p>
      </div>
    </div>
  );
};

const SearchResourceCard = ({ resource, onClick, formatDate }: any) => {
  const { t, language } = useLanguage();
  const [translatedTitle, setTranslatedTitle] = useState(resource.title);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const autoTranslate = async () => {
      setTranslatedTitle(resource.title);
      setIsTranslating(true);
      try {
        const res = await translateText(resource.title, language);
        setTranslatedTitle(res);
      } finally {
        setIsTranslating(false);
      }
    };
    autoTranslate();
  }, [resource.title, language]);

  return (
    <div onClick={onClick} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
      <div className="h-40 bg-slate-100 overflow-hidden">
        {resource.thumbnail_url ? (
          <img src={resource.thumbnail_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="thumb"/>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
        )}
      </div>
      <div className="p-4">
        {isTranslating && <span className="inline-block text-[10px] bg-blue-50 text-[#1e3a8a] px-2 py-0.5 rounded font-semibold animate-pulse mb-1">{t('translating') || 'Translating...'}</span>}
        <h3 className="font-bold text-[#1e3a8a] line-clamp-2 mb-1 group-hover:underline">{translatedTitle || resource.title}</h3>
        <p className="text-xs text-slate-500">{formatDate(resource.created_at)}</p>
      </div>
    </div>
  );
};

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
  const [previewResource, setPreviewResource] = useState<{ isOpen: boolean; resource: any }>({ 
    isOpen: false, 
    resource: null 
  });

  const [results, setResults] = useState({
    blogs: [] as any[],
    showcases: [] as any[],
    events: [] as any[],
    users: [] as any[],
    resources: [] as any[]
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
    const isIntentResource = ['สื่อ', 'ทรัพยากร', 'เอกสาร', 'resource', 'resources'].includes(searchLower);

    try {
      let blogsQuery = supabase.from('blogs').select('id, title, thumbnail_url, created_at').eq('status', 'published').limit(15);
      let showcasesQuery = supabase.from('showcases').select('*').eq('status', 'published').limit(15);
      let eventsQuery = supabase.from('events').select('*').eq('event_state', 'published').limit(15);
      let usersQuery = supabase.from('user').select('id, first_name, last_name, profilepic, role, position').limit(15);
      let resourcesQuery = supabase.from('resources').select('*').eq('status', 'published').limit(15);

      if (!isIntentBlog) blogsQuery = blogsQuery.ilike('title', `%${safeSearch}%`);
      if (!isIntentShowcase) showcasesQuery = showcasesQuery.or(`title.ilike.${orSearchFormat},author_name.ilike.${orSearchFormat}`);
      if (!isIntentEvent) eventsQuery = eventsQuery.ilike('title', `%${safeSearch}%`);
      if (!isIntentResource) resourcesQuery = resourcesQuery.or(`title.ilike.${orSearchFormat},description.ilike.${orSearchFormat}`);
      
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
        { data: blogsData, error: blogsError },
        { data: showcasesData, error: showcasesError },
        { data: eventsData, error: eventsError },
        { data: usersData, error: usersError },
        { data: resourcesData, error: resourcesError }
      ] = await Promise.all([blogsQuery, showcasesQuery, eventsQuery, usersQuery, resourcesQuery]);

      if (resourcesError) console.error("🚨 Error Resource:", resourcesError);

      setResults({
        blogs: blogsData || [],
        showcases: showcasesData || [],
        events: eventsData || [],
        users: usersData || [],
        resources: resourcesData || [] 
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

  const totalResults = results.blogs.length + results.showcases.length + results.events.length + results.users.length + results.resources.length;

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
              placeholder={t('search') || 'ค้นหาที่นี่.. (เช่น บล็อก, กิจกรรม, สื่อ)'}
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
                onClick={() => handleQuickSearch('สื่อ')}
                className="w-[calc(50%-0.5rem)] sm:w-auto px-4 py-1.5 bg-white border border-slate-200 text-[#1e3a8a] text-sm font-medium rounded-full hover:bg-blue-50 transition-colors shadow-sm cursor-pointer"
            >
                {t('resources') || 'สื่อ/ทรัพยากร'}
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

            {/* 🟢 หมวดหมู่: Users (แสดงชื่อเดิม ไม่มีการแปลภาษา) */}
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

            {/* หมวดหมู่: Blogs (ใช้ Component แยก) */}
            {results.blogs.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-[#1e3a8a] mb-4 border-l-4 border-[#1e3a8a] pl-3">{t('blogs') || 'บล็อก'} ({results.blogs.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.blogs.map(b => (
                    <SearchBlogCard key={b.id} blog={b} onClick={() => navigate(`/blog/${b.id}`)} formatDate={formatDate} />
                  ))}
                </div>
              </section>
            )}

            {/* หมวดหมู่: Showcases (ใช้ Component แยก) */}
            {results.showcases.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-[#1e3a8a] mb-4 border-l-4 border-[#1e3a8a] pl-3">{t('showcases') || 'ผลงาน'} ({results.showcases.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.showcases.map(s => (
                    <SearchShowcaseCard key={s.id} showcase={s} onClick={() => setPreviewShowcase({ isOpen: true, showcase: s })} formatDate={formatDate} />
                  ))}
                </div>
              </section>
            )}

            {/* หมวดหมู่: Events (ใช้ Component แยก) */}
            {results.events.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-[#1e3a8a] mb-4 border-l-4 border-[#1e3a8a] pl-3">{t('events') || 'กิจกรรม'} ({results.events.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.events.map(e => (
                    <SearchEventCard 
                      key={e.id} 
                      event={e} 
                      onClick={() => {
                        const sStatus = (e.status || '').toLowerCase();
                        if (sStatus === 'upcoming' || sStatus === 'pending') {
                          setPreviewEvent({ isOpen: true, event: e });
                        } else {
                          navigate(`/event/${e.id}`);
                        }
                      }} 
                      formatDate={formatDate} 
                    />
                  ))}
                </div>
              </section>
            )}

            {/* หมวดหมู่: Resources (ใช้ Component แยก) */}
            {results.resources.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-[#1e3a8a] mb-4 border-l-4 border-[#1e3a8a] pl-3">{t('resources') || 'สื่อ/ทรัพยากร'} ({results.resources.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.resources.map(r => (
                    <SearchResourceCard key={r.id} resource={r} onClick={() => setPreviewResource({ isOpen: true, resource: r })} formatDate={formatDate} />
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

      <ResourcePreviewModal 
        isOpen={previewResource.isOpen}
        resource={previewResource.resource}
        onClose={() => setPreviewResource({ isOpen: false, resource: null })}
      />

    </div>
  );
}