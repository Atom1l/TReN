/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';

// 🟢 นำเข้า Modal ที่เราเพิ่งสร้างไว้
import ResourcePreviewModal from '../components/ResourcePreviewModal';

interface ResourceData {
  id: string;
  title: string;
  description: string;
  resource_type: string;
  url: string;
  thumbnail_url: string;
  created_at: string;
}

const Resources = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [resources, setResources] = useState<ResourceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  const [canCreate, setCanCreate] = useState(false);

  // State สำหรับควบคุมการเปิด/ปิด Modal
  const [previewModal, setPreviewModal] = useState<{ isOpen: boolean; resource: ResourceData | null }>({ 
    isOpen: false, 
    resource: null 
  });

  // 🟢 1. State สำหรับ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6); // ค่าเริ่มต้น

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

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const checkRoleAndFetchResources = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: userData } = await supabase.from('user').select('role').eq('id', user.id).single();
          const userRole = (userData?.role || 'user').toLowerCase();
          if (['admin', 'co_admin', 'co-admin', 'developer'].includes(userRole)) {
            setCanCreate(true);
          }
        }

        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setResources(data as ResourceData[]);

      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkRoleAndFetchResources();
  }, []);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'document':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        );
      case 'image/video':
      case 'video': 
      case 'image': 
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
        );
      case 'folder':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
          </svg>
        );
    }
  };

  const filteredResources = resources.filter(res => {
    const matchesSearch = 
      res.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (res.description && res.description.toLowerCase().includes(searchTerm.toLowerCase()));

    let matchesFilter = true;
    if (activeFilter !== 'all') {
      if (activeFilter === 'image/video') {
        matchesFilter = res.resource_type === 'image/video' || res.resource_type === 'image' || res.resource_type === 'video';
      } else {
        matchesFilter = res.resource_type === activeFilter;
      }
    }

    return matchesSearch && matchesFilter;
  });

  // 🟢 3. รีเซ็ตหน้ากลับไปเป็นหน้าแรกเมื่อมีการพิมพ์ค้นหา หรือ เปลี่ยนฟิลเตอร์
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilter]);

  // 🟢 4. คำนวณข้อมูลที่จะนำมาแสดงในแต่ละหน้า (Pagination Logic)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResources.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(filteredResources.length / itemsPerPage));

  // ดักจับกรณีที่ลบข้อมูลหรือเปลี่ยนหน้าจอจนหน้าปัจจุบันมีค่าเกินหน้าที่มีอยู่จริง
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const getTranslatedLabel = (key: string, defaultText: string) => {
    const translated = t(key as any);
    return translated && translated !== key ? translated : defaultText;
  };

  const filterOptions = [
    { id: 'all', label: getTranslatedLabel('filter_all', 'ทั้งหมด (All)') },
    { id: 'document', label: getTranslatedLabel('filter_document', 'เอกสาร / PDF') },
    { id: 'image/video', label: getTranslatedLabel('filter_media', 'รูปภาพ/วิดีโอ') },
    { id: 'folder', label: getTranslatedLabel('filter_folder', 'โฟลเดอร์รวมไฟล์') },
    { id: 'link', label: getTranslatedLabel('filter_link', 'ลิงก์เว็บไซต์') },
  ];

  return (
    <div className="min-h-screen bg-white pb-24 border-t border-slate-100">
      
      <ResourcePreviewModal 
        isOpen={previewModal.isOpen} 
        resource={previewModal.resource} 
        onClose={() => setPreviewModal({ isOpen: false, resource: null })} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        
        {/* Breadcrumb */}
        <div className="text-slate-500 text-sm md:text-base mb-4 flex items-center gap-2">
          <span className="hover:text-[#1e3a8a] transition-colors cursor-pointer" onClick={() => navigate('/')}>{t('home') || 'หน้าแรก'}</span> 
          <span>/</span>
          <span className="text-[#1e3a8a] font-semibold">{t('resources') || 'คลังข้อมูล'}</span>
        </div>

        {/* Header & Search Section */}
        <div>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#1e3a8a]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#1e3a8a" className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                  </svg>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-[#1e3a8a] pt-2">{t('all_resources') || 'คลังข้อมูลทั้งหมด'}</h1>
              </div>
              <p className="text-slate-600 mb-6 text-lg max-w-2xl">{t('resources_desc') || 'ค้นหาและสำรวจคลังข้อมูลทั้งหมดได้ที่นี่'}</p>
            </div>

            {canCreate && (
              <button 
                onClick={() => navigate('/create-resource')}
                className="bg-[#1e3a8a] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-900 transition-colors shadow-sm flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer w-full md:w-auto mt-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                {t('add_resource') || 'เพิ่มข้อมูล'}
              </button>
            )}
          </div>
          
          <div className="relative mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input 
              type="text" 
              placeholder={t('search_resources') || 'ค้นหาทรัพยากร...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-4 py-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent text-lg shadow-sm"
            />
          </div>
        </div>

        {/* แถบปุ่ม Tags สำหรับตัวกรอง */}
        <div className="flex flex-wrap gap-3 mb-10 mt-6">
          {filterOptions.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-2.5 rounded-full text-sm sm:text-base font-medium transition-all duration-200 border cursor-pointer ${
                activeFilter === filter.id 
                  ? 'bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-md' 
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        {isLoading ? (
          <div className="py-20 text-center text-[#1e3a8a] font-bold text-xl animate-pulse">
            {t('loading_resources') || 'กำลังโหลดข้อมูลทรัพยากร...'}
          </div>
        ) : filteredResources.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* 🟢 5. เปลี่ยนจาก filteredResources.map เป็น currentItems.map */}
              {currentItems.map((res) => (
                <div 
                  key={res.id} 
                  onClick={() => setPreviewModal({ isOpen: true, resource: res })}
                  className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col h-full cursor-pointer group hover:-translate-y-1 transition-all duration-300"
                >
                  
                  {/* ส่วนรูปภาพ */}
                  <div className="h-48 sm:h-56 bg-slate-200 overflow-hidden relative">
                    {res.thumbnail_url ? (
                      <img src={res.thumbnail_url} alt={res.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                        {getResourceIcon(res.resource_type)}
                      </div>
                    )}
                    {/* ป้ายกำกับประเภทไฟล์ลอยๆ */}
                    <div className="absolute bottom-4 left-4 bg-[#1e3a8a]/90 backdrop-blur-sm px-4 py-1.5 rounded-md text-xs font-bold text-white shadow-sm flex items-center gap-1.5 capitalize">
                      {res.resource_type === 'document' ? t('filter_document') || 'เอกสาร / PDF' :
                        ['image/video', 'image', 'video'].includes(res.resource_type) ? t('filter_media') || 'รูปภาพ/วิดีโอ' :
                        res.resource_type === 'folder' ? t('filter_folder') || 'โฟลเดอร์' : t('filter_link') || 'ลิงก์'}
                    </div>
                  </div>

                  {/* ส่วนเนื้อหา */}
                  <div className="p-6 flex flex-col flex-1">
                    
                    <div className="flex items-start gap-4 mb-4">
                      <div className="text-[#1e3a8a] bg-blue-50 border border-blue-100 p-3 rounded-xl flex-shrink-0 shadow-sm mt-1">
                        {getResourceIcon(res.resource_type)}
                      </div>
                      <div>
                        <h3 className="text-[#1e3a8a] text-xl font-bold mb-2 line-clamp-2 leading-tight">
                          {res.title}
                        </h3>
                        {res.description && (
                          <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                            {res.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto pt-2">
                      <button className="border border-slate-300 text-slate-600 px-5 py-2 rounded-full font-medium group-hover:bg-slate-50 transition-colors w-fit text-sm cursor-pointer">
                        {t('view_details') || 'ดูรายละเอียด'} &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 🟢 6. ส่วน UI ของตัวเปลี่ยนหน้า (Pagination Controls) */}
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
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-16 text-center flex flex-col items-center justify-center mt-8">
            <div className="w-20 h-20 bg-white shadow-sm text-slate-400 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">{t('no_resources_found') || 'ไม่พบคลังข้อมูลที่ค้นหา'}</h3>
            <p className="text-slate-500">{t('try_different_resource_keywords') || 'ลองค้นหาด้วยคำอื่น หรือรอการอัปเดตข้อมูลเร็วๆ นี้'}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Resources;