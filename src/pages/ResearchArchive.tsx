/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext'; // 💡 1. นำเข้า useLanguage

const ResearchArchive = () => {
  const { t } = useLanguage(); // 💡 2. เรียกใช้ t function

  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedSubgroup, setSelectedSubgroup] = useState<string | null>(null);
  
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 💡 ฟังก์ชันแปลงลิงก์ Google Drive ให้เป็นลิงก์บังคับดาวน์โหลด (Force Download)
  const getDirectDownloadUrl = (url: string) => {
    if (!url) return '#';
    const gDriveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (gDriveMatch && gDriveMatch[1]) {
      return `https://drive.google.com/uc?export=download&id=${gDriveMatch[1]}`;
    }
    return url; 
  };

  // 💡 ฟังก์ชันจำลองการคลิกดาวน์โหลดเพื่อเลี่ยงข้อจำกัด Cross-origin
  const handleForceDownload = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    const downloadUrl = getDirectDownloadUrl(url);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = downloadUrl;
    document.body.appendChild(iframe);
    setTimeout(() => { document.body.removeChild(iframe); }, 2000);
  };

  useEffect(() => {
    if (!selectedGroup || !selectedSubgroup) return;

    const fetchShowcases = async () => {
      setIsLoading(true);
      try {
        const { data: dbData, error } = await supabase
          .from('showcases')
          .select('*')
          .eq('status', 'published')
          .eq('subject_group', selectedGroup)
          .eq('subject_subgroup', selectedSubgroup)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (dbData) setData(dbData);
      } catch (error) {
        console.error('Error fetching research data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShowcases();
  }, [selectedGroup, selectedSubgroup]);

  const handleGroupSelect = (group: string) => {
    setSelectedGroup(group);
    setSelectedSubgroup(null); 
    setData([]);
  };

  const handleSubgroupSelect = (subgroup: string) => {
    setSelectedSubgroup(subgroup);
  };

  const filterData = (type: string) => {
    const typeData = data.filter(item => item.publication_type === type);
    const highlightItem = typeData.find(item => item.tag && item.tag.toLowerCase().includes('unshow'));
    const normalItems = typeData.filter(item => !item.tag || !item.tag.toLowerCase().includes('unshow'));
    return { highlightItem, normalItems };
  };

  const { highlightItem: anthologyHighlight, normalItems: anthologyItems } = filterData('เล่มรวมวิจัย');
  const { highlightItem: individualHighlight, normalItems: individualItems } = filterData('งานวิจัยรายเรื่อง');

  const parseLinks = (linkData: any) => {
    if (!linkData) return [];
    try {
      if (Array.isArray(linkData)) return linkData;
      if (typeof linkData === 'string' && linkData.startsWith('http')) return [{ title: t('main_link') || 'Main Link', url: linkData }];
      return JSON.parse(linkData);
    } catch {
      return [{ title: t('main_link') || 'Main Link', url: String(linkData) }];
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans selection:bg-blue-200 border-t border-slate-200 overflow-hidden flex flex-col items-center">
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeInUp 0.6s ease-out forwards; }
      `}</style>

      {/* ================= LEVEL 1: เลือกกลุ่มวิชาหลัก ================= */}
      <section 
        className={`w-full px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-in-out flex flex-col items-center justify-center
          ${!selectedGroup ? 'mt-[25vh]' : 'mt-16 mb-8'}
        `}
      >
        <div className="text-center max-w-4xl w-full">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e3a8a] mb-6 tracking-tight">
            {t('archive_title_th') || 'คลังงานวิจัยครู'} <br className="md:hidden"/> 
            <span className="text-2xl md:text-3xl font-normal text-slate-500 block mt-2">
              ({t('archive_title_en') || 'Teacher Research Archive'})
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 font-light">
            {t('archive_desc_1') || 'ยินดีต้อนรับสู่คลังงานวิจัยเพื่อการจัดการเรียนรู้ — กรุณาเลือก'} <strong className="font-bold text-[#1e3a8a]">{t('archive_desc_2') || 'กลุ่มวิชา'}</strong> {t('archive_desc_3') || 'ที่ท่านต้องการค้นหา'}
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 w-full">
            {[
              { id: 'กลุ่มวิชาภาษา', label: t('group_lang') || 'กลุ่มวิชาภาษา' },
              { id: 'กลุ่มวิชาวิทยาศาสตร์และคณิตศาสตร์', label: t('group_sci_math') || 'กลุ่มวิชาวิทยาศาสตร์และคณิตศาสตร์' },
              { id: 'กลุ่มวิชาสังคมศึกษาและอื่นๆ', label: t('group_soc_other') || 'กลุ่มวิชาสังคมศึกษาและอื่นๆ' }
            ].map((group) => {
              const isSelected = selectedGroup === group.id;
              const isDimmed = selectedGroup !== null && !isSelected;

              return (
                <button
                  key={group.id}
                  onClick={() => handleGroupSelect(group.id)}
                  className={`relative px-8 py-5 rounded-2xl font-bold text-xl transition-all duration-500 flex-1 md:flex-none cursor-pointer border shadow-sm
                    ${isSelected 
                      ? 'bg-[#1e3a8a] text-white border-[#1e3a8a] scale-105 shadow-lg shadow-blue-900/20 z-10' 
                      : 'bg-white text-[#1e3a8a] border-blue-100 hover:bg-blue-50 hover:border-[#1e3a8a]'}
                    ${isDimmed ? 'opacity-40 scale-95 grayscale-[50%] hover:opacity-100 hover:grayscale-0' : 'opacity-100'}
                  `}
                >
                  {group.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= LEVEL 2: เลือกวิชาย่อย ================= */}
      {selectedGroup === 'กลุ่มวิชาภาษา' && (
        <section className="w-full max-w-4xl px-4 animate-fade-up">
          <div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h2 className="text-xl md:text-2xl font-bold text-slate-700 mb-8">
              {t('subgroup_desc_1') || 'หมวดหมู่กลุ่มวิชาภาษา — กรุณาเลือก'} <strong className="text-[#1e3a8a] border-b-2 border-[#1e3a8a]">{t('subgroup_desc_2') || 'กลุ่มภาษา'}</strong> {t('subgroup_desc_3') || 'ที่ท่านสนใจ'}
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { id: 'ภาษาไทย', label: t('sub_lang_th') || 'ภาษาไทย' },
                { id: 'ภาษาอังกฤษ', label: t('sub_lang_en') || 'ภาษาอังกฤษ' },
                { id: 'ภาษาอื่นๆ', label: t('sub_lang_other') || 'ภาษาอื่นๆ' }
              ].map((subgroup) => {
                const isSelected = selectedSubgroup === subgroup.id;
                const isDimmed = selectedSubgroup !== null && !isSelected;

                return (
                  <button
                    key={subgroup.id}
                    onClick={() => handleSubgroupSelect(subgroup.id)}
                    className={`px-8 py-3.5 rounded-full font-bold text-lg transition-all duration-300 border cursor-pointer
                      ${isSelected 
                        ? 'bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-md' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-[#1e3a8a] hover:text-[#1e3a8a]'}
                      ${isDimmed ? 'opacity-40 hover:opacity-100' : 'opacity-100'}
                    `}
                  >
                    {subgroup.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* หน้าว่าง (Coming Soon) */}
      {(selectedGroup === 'กลุ่มวิชาวิทยาศาสตร์และคณิตศาสตร์' || selectedGroup === 'กลุ่มวิชาสังคมศึกษาและอื่นๆ') && (
        <section className="w-full max-w-4xl px-4 mt-8 animate-fade-up">
          <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-16 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-600 mb-3">{t('coming_soon_title') || 'หน้าเปล่าก่อน (Coming Soon)'}</h3>
            <p className="text-slate-500 text-lg font-light max-w-md">
              {t('coming_soon_desc') || 'ระบบกำลังรวบรวมผลงานวิจัยในหมวดหมู่นี้ เตรียมเปิดให้เข้าอ่านและดาวน์โหลดได้เร็วๆ นี้ครับ'}
            </p>
          </div>
        </section>
      )}

      {/* ================= LEVEL 3: แสดงข้อมูลผลงาน (ตีคู่ขนาน) ================= */}
      {selectedGroup === 'กลุ่มวิชาภาษา' && selectedSubgroup && (
        <section className="w-full max-w-7xl px-4 mt-12 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-[#1e3a8a] rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
              
              {/* 💡 การ์ดที่ 1: เล่มรวมวิจัย (Anthology) */}
              <div className="bg-blue-200 rounded-[2rem] shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col overflow-hidden group hover:border-blue-200 hover:shadow-[0_12px_40px_-10px_rgba(25,58,138,0.15)] ">
                <div className="p-8 md:p-10 flex-grow flex flex-col">
                  
                  <h3 className="text-3xl font-extrabold text-[#1e3a8a] mb-4 leading-tight">
                    {anthologyHighlight?.collection_name || t('anthology_title') || 'ฉบับเล่มรวมวิจัยปี 2023, 2024–2025'}
                  </h3>
                  
                  <p className="text-lg text-slate-800 font-normal leading-relaxed mb-8 flex-grow">
                    {anthologyHighlight?.intro_info || t('anthology_desc') || 'รวบรวมรายงานผลการวิจัยฉบับสมบูรณ์ที่จัดทำเป็นเล่มตีพิมพ์ เหมาะสำหรับผู้ที่ต้องการดาวน์โหลดเล่มรวมวิจัยย้อนหลัง อ่านบทนำบรรณาธิการ หรือดูภาพรวมงานวิจัยทั้งเล่ม'}
                  </p>

                  <div className="w-full h-px bg-[#1e3a8a] mb-6"></div>

                  <div className="flex flex-col gap-6">
                    <p className="text-lg font-bold text-slate-800 text-center">
                      {t('total_papers_1') || 'รวมผลงานวิจัยฉบับเต็ม'} <span className="text-[#1e3a8a]">12</span> {t('total_papers_2') || 'บทความ'}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link 
                        to={anthologyHighlight ? `/showcase/${anthologyHighlight.id}` : '#'}
                        className={`flex-1 flex justify-center items-center px-4 py-3 rounded-xl font-bold text-base transition-all duration-300 shadow-md ${
                          anthologyHighlight 
                            ? 'bg-[#1e3a8a] text-white hover:bg-[#152860] hover:scale-105' 
                            : 'bg-slate-300 text-white cursor-not-allowed'
                        }`}
                      >
                        {t('btn_read_summary') || 'ดูสารบัญ / อ่านบทนำสรุป'}
                      </Link>
                      
                      {anthologyHighlight && parseLinks(anthologyHighlight['Link to work']).map((link: any, idx: number) => (
                        <a 
                          key={idx}
                          href="#"
                          onClick={(e) => handleForceDownload(e, link.url)}
                          className="flex-1 flex justify-center items-center gap-2 bg-[#1e3a8a] text-white px-4 py-3 rounded-xl font-bold text-base transition-all duration-300 shadow-md hover:bg-[#152860] hover:scale-105"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                          {t('btn_download_pdf') || 'Download PDF ทั้งเล่ม'}
                        </a>
                      )).slice(0, 1)}
                    </div>
                  </div>

                </div>
              </div>

              {/* 💡 การ์ดที่ 2: งานวิจัยรายเรื่อง (Individual) */}
              <div className="bg-blue-200 rounded-[2rem] shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col overflow-hidden group hover:border-blue-200 hover:shadow-[0_12px_40px_-10px_rgba(25,58,138,0.15)] transition-all duration-300">
                <div className="p-8 md:p-10 flex-grow flex flex-col">
                  
                  <h3 className="text-3xl font-extrabold text-[#1e3a8a] mb-4 leading-tight">
                    {individualHighlight?.collection_name || t('individual_title') || 'งานวิจัยรายเรื่องปี 2565 เป็นต้นไป'}
                  </h3>
                  
                  <p className="text-lg text-slate-800 font-normal leading-relaxed mb-8 flex-grow">
                    {individualHighlight?.intro_info || t('individual_desc') || 'รวบรวมรายงานวิจัยฉบับเดี่ยว (ปี 2565 เป็นต้นไป) ค้นหาง่ายตามประเด็นปัญหา เหมาะสำหรับผู้ที่ต้องการพุ่งเป้าอ่านเฉพาะหัวข้อการสอนที่สนใจโดยเฉพาะ'}
                  </p>

                  <div className="w-full h-px bg-[#1e3a8a] mb-6"></div>

                  <div className="flex flex-col gap-6">
                    <p className="text-lg font-bold text-slate-800 text-center">
                      {t('total_papers_1') || 'รวมผลงานวิจัยฉบับเต็ม'} <span className="text-[#1e3a8a]">29</span> {t('total_papers_2') || 'บทความ'}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link 
                        to={individualHighlight ? `/showcase/${individualHighlight.id}` : '#'}
                        className={`flex-1 flex justify-center items-center px-4 py-3 rounded-xl font-bold text-base transition-all duration-300 shadow-md ${
                          individualHighlight 
                            ? 'bg-[#1e3a8a] text-white hover:bg-[#152860] hover:scale-105' 
                            : 'bg-slate-300 text-white cursor-not-allowed'
                        }`}
                      >
                        {t('btn_read_summary') || 'ดูสารบัญ / อ่านบทนำสรุป'}
                      </Link>
                      
                      {individualHighlight && parseLinks(individualHighlight['Link to work']).map((link: any, idx: number) => (
                        <a 
                          key={idx}
                          href="#"
                          onClick={(e) => handleForceDownload(e, link.url)}
                          className="flex-1 flex justify-center items-center gap-2 bg-[#1e3a8a] text-white px-4 py-3 rounded-xl font-bold text-base transition-all duration-300 shadow-md hover:bg-[#152860] hover:scale-105"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                          {t('btn_download_pdf') || 'Download PDF ทั้งเล่ม'}
                        </a>
                      )).slice(0, 1)}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default ResearchArchive;