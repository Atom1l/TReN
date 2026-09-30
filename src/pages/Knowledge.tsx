/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// --- คอมโพเนนต์ Accordion (รูปแบบ Row มาตรฐาน) ---
const AccordionItem = ({ 
  title, 
  isOpen, 
  onClick, 
  children 
}: { 
  title: string, 
  isOpen: boolean, 
  onClick: () => void, 
  children: React.ReactNode 
}) => {
  return (
    <div className="mb-4 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-between p-6 text-left transition-colors ${isOpen ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
      >
        <span className="font-bold text-[#1e3a8a] text-xl md:text-2xl pr-4 leading-snug">{title}</span>
        <svg 
          className={`w-6 h-6 text-[#1e3a8a] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div 
        className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-6 md:p-8 pt-2 md:pt-2 border-t border-slate-100">
          {children}
        </div>
      </div>
    </div>
  );
};

const Knowledge = () => {
  const { t } = useLanguage();
  
  // 💡 เปลี่ยน State เป็น Array (string[]) เพื่อให้เปิดพร้อมกันได้หลายหัวข้อ (Manual Close)
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [openCol2s, setOpenCol2s] = useState<string[]>([]);
  const [openCol3s, setOpenCol3s] = useState<string[]>([]);
  const [openClipSections, setOpenClipSections] = useState<string[]>([]);

  // 💡 อัปเดตฟังก์ชัน Toggle เพื่อเพิ่ม/ลบ ID ออกจาก Array แทนการทับค่าเดิม
  const toggleSection = (id: string) => setOpenSections(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const toggleCol2 = (id: string) => setOpenCol2s(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const toggleCol3 = (id: string) => setOpenCol3s(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const toggleClipSection = (id: string) => setOpenClipSections(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  // State สำหรับควบคุม Video Modal
  const [videoModal, setVideoModal] = useState<{ isOpen: boolean; videoTitle: string; videoUrl: string }>({
    isOpen: false,
    videoTitle: '',
    videoUrl: ''
  });

  const openVideo = (title: string, url: string) => {
    setVideoModal({ isOpen: true, videoTitle: title, videoUrl: url });
  };

  const closeVideo = () => {
    setVideoModal({ isOpen: false, videoTitle: '', videoUrl: '' });
  };

  // Helper สำหรับแปลงลิงก์ Google Drive ให้อยู่ในรูปแบบที่ Iframe อ่านได้
  const getEmbedUrl = (url: string) => {
    if (!url || url === '#') return '';
    if (url.includes('drive.google.com')) {
      return url.replace(/\/view.*$/, '/preview');
    }
    return url;
  };

  return (
    <div className="w-full bg-[#F8FAFC] font-sans selection:bg-blue-200 min-h-screen">
      <div className="max-w-[85rem] mx-auto px-6 lg:px-8 pt-16 md:pt-24 pb-24">
        
        {/* ================= SECTION A: EAR Basic Knowledge ================= */}
        <section className="pb-24 border-b-4 border-slate-300">
          
          <div className="mb-16 md:mb-20 flex flex-col items-center text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
              {t('knowledge_title') || 'คลังความรู้ EAR'}
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 mt-6 font-light tracking-wide leading-relaxed">
              (EAR Knowledge Hub)
            </p>
          </div>

          {/* Hero Image Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-16 ">
             <div className="md:col-span-2 relative rounded-3xl overflow-hidden border-2 border-slate-200 group">
                <img src="/Homepage/cover_1.webp" alt="EAR Workshop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/10 transition-colors"></div>
             </div>
             <div className="hidden md:flex flex-col gap-4">
                <div className="flex-1 relative rounded-3xl overflow-hidden border-2 border-slate-200 group">
                   <img src="/Homepage/cover_2.webp" alt="EAR Presentation" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                   <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/10 transition-colors"></div>
                </div>
                <div className="flex-1 relative rounded-3xl overflow-hidden border-2 border-slate-200 group bg-blue-100 flex items-center justify-center">
                   <img src="/Homepage/cover_3.webp" alt="EAR Presentation" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                   <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/10 transition-colors"></div>
                </div>
             </div>
          </div>

          <div className="space-y-0 relative">
            
            {/* --- 1. ทำความรู้จัก EAR --- */}
            <div className="flex flex-col items-start pt-16 pb-12 md:pb-16 md:pt-20 mt-10 relative z-10 bg-[#F8FAFC]">
              <div className="w-full mb-10 flex items-start md:items-center gap-6">
                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-[#1e3a8a] text-white font-bold text-2xl shadow-md shrink-0 mt-1 md:mt-0">1</div>
                <div className="flex-1">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] tracking-tight mb-2">
                    {t('knowledge_part1_title') || 'ทำความรู้จัก EAR'}
                  </h2>
                  <p className="text-[#1e3a8a] font-medium text-xl md:text-2xl mb-3">
                    {t('knowledge_part1_subtitle') || 'สำรวจห้องเรียน ขับเคลื่อนการเรียนรู้ด้วยตัวของครูเอง'}
                  </p>
                  <p className="text-slate-600 font-light leading-relaxed text-lg md:text-xl max-w-5xl">
                    {t('knowledge_part1_desc') || '"ห้องเรียนของคุณครู…ไม่มีใครรู้จักดีไปกว่าตัวคุณครูเอง" เปลี่ยนงานวิจัยจาก "เรื่องน่าปวดหัว" ให้กลายเป็น "เครื่องมือคู่ใจ" มาสำรวจ ค้นหา และขับเคลื่อนการเรียนรู้ของเด็กๆ ด้วยตัวคุณครูเองผ่าน Exploratory Action Research (EAR)'}
                  </p>
                </div>
              </div>

              <div className="w-full pl-0 md:pl-16">
                <AccordionItem title={t('knowledge_why_ear_title_main') || 'ทำไมต้อง EAR?'} isOpen={openSections.includes('1.1')} onClick={() => toggleSection('1.1')}>
                  <div className="my-6 space-y-6 text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                    <p>{t('knowledge_why_ear_desc_1') || 'ในชีวิตการทำงานจริงของคุณครู ทุกวันคือการรับมือกับความท้าทายที่ไม่เคยเหมือนกัน:'}</p>
                    <ul className="space-y-4 pl-2">
                      <li className="flex items-start gap-4"><span className="text-[#1e3a8a] mt-1">&bull;</span> {t('knowledge_why_ear_point_1') || 'ทำไมใช้นวัตกรรมใหม่ แต่เด็กๆ ก็ยังนั่งเหม่อ'}</li>
                      <li className="flex items-start gap-4"><span className="text-[#1e3a8a] mt-1">&bull;</span> {t('knowledge_why_ear_point_2') || 'ทำไมสื่อที่เตรียมมาอย่างดี ถึงใช้ไม่ได้ผลกับห้องนี้'}</li>
                      <li className="flex items-start gap-4"><span className="text-[#1e3a8a] mt-1">&bull;</span> {t('knowledge_why_ear_point_3') || 'ทำไมเด็กบางคนถึงขาดแรงจูงใจและส่งงานไม่เคยทัน'}</li>
                    </ul>
                    <p>
                      {t('knowledge_why_ear_desc_2') || 'ที่ผ่านมา เราอาจคุ้นเคยกับนโยบายจากภายนอก... แม้สิ่งเหล่านี้จะมีประโยชน์ แต่สิ่งหนึ่งที่ปฏิเสธไม่ได้คือ '}
                      <strong className="font-bold text-[#1e3a8a]"> {t('knowledge_why_ear_highlight') || '"บริบทของแต่ละห้องเรียนแตกต่างกันอย่างสิ้นเชิง"'}</strong>
                    </p>
                    <div className="bg-blue-50/50 p-6 md:p-8 rounded-2xl border-l-[4px] border-[#1e3a8a]">
                      <p className="font-medium text-[#1e3a8a] text-xl md:text-2xl">{t('knowledge_why_ear_conclusion') || 'ทางออกที่ยั่งยืนที่สุด คือ การติดอาวุธให้คุณครูสามารถวิเคราะห์ แก้ปัญหา และตัดสินใจได้ด้วยตนเองจากหน้างานจริง'}</p>
                    </div>
                  </div>
                </AccordionItem>

                <AccordionItem title={t('knowledge_what_ear_title_main') || 'EAR คืออะไร?'} isOpen={openSections.includes('1.2')} onClick={() => toggleSection('1.2')}>
                  <div className="my-6 space-y-6 text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                    <p><strong className="font-bold text-[#1e3a8a]">Exploratory Action Research (EAR)</strong> {t('knowledge_what_ear_desc_1') || 'คือ การวิจัยปฏิบัติการเชิงสำรวจ ที่เน้นการ "สำรวจให้ลึกซึ้งก่อนลงมือแก้ปัญหา" เปลี่ยนครูผู้สอน สู่ "ครูวิจัยหน้างาน" (Teacher-Researcher)'}</p>
                    <p>{t('knowledge_what_ear_desc_1_1')}</p>
                    <div className="border-l-[4px] border-[#1e3a8a] pl-6 py-4 italic text-[#1e3a8a] font-medium bg-blue-50/50 pr-6 rounded-r-2xl text-xl md:text-2xl">
                      {t('knowledge_what_ear_quote') || '"คุณครูจะมีพลังและความมั่นใจมากขึ้น เพราะสามารถตัดสินใจเกี่ยวกับการจัดการเรียนรู้ได้อย่างมีข้อมูลรองรับ บนพื้นฐานของสิ่งที่คุณครูได้ค้นพบและพิสูจน์ด้วยตนเอง"'}
                    </div>
                  </div>
                </AccordionItem>

                <AccordionItem title={t('knowledge_how_ear_title_main') || 'EAR เปลี่ยนห้องเรียนได้อย่างไร?'} isOpen={openSections.includes('1.3')} onClick={() => toggleSection('1.3')}>
                  <div className="my-6 space-y-6 text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                    <p>{t('knowledge_how_ear_subtitle')}</p>
                    <div className="space-y-8 text-xl md:text-2xl text-slate-800 font-light leading-relaxed border-l-[3px] border-slate-200 ml-4 pl-8 py-4">
                      <div className="relative">
                        <span className="absolute -left-[41px] top-2 w-4 h-4 rounded-full bg-[#1e3a8a] ring-[6px] ring-white"></span>
                        <p><strong className="font-bold text-[#1e3a8a] block mb-2">{t('knowledge_step1_title') || 'จุดเริ่มต้น (ติดขัด):'}</strong> {t('knowledge_step1_desc') || 'เด็กไม่สนใจวิดีโอภาษาอังกฤษที่ครูเปิดให้ดู และทำงานไม่ทัน'}</p>
                      </div>
                      <div className="relative">
                        <span className="absolute -left-[41px] top-2 w-4 h-4 rounded-full bg-[#1e3a8a] ring-[6px] ring-white"></span>
                        <p><strong className="font-bold text-[#1e3a8a] block mb-2">{t('knowledge_step2_title') || 'การสำรวจ (Exploration):'}</strong> {t('knowledge_step2_desc') || 'สอบถามเด็กจนพบว่า ภาษาในวิดีโอยากเกินไป ฟังไม่ทัน'}</p>
                      </div>
                      <div className="relative">
                        <span className="absolute -left-[41px] top-2 w-4 h-4 rounded-full bg-[#1e3a8a] ring-[6px] ring-white"></span>
                        <p><strong className="font-bold text-[#1e3a8a] block mb-2">{t('knowledge_step3_title') || 'การลงมือแก้ปัญหา (Action):'}</strong> {t('knowledge_step3_desc') || 'ปรับลดระดับความยากของวิดีโอ และปูพื้นฐานศัพท์ก่อนเรียน'}</p>
                      </div>
                      <div className="relative">
                        <span className="absolute -left-[41px] top-2 w-4 h-4 rounded-full bg-emerald-500 ring-[6px] ring-white"></span>
                        <p><strong className="font-bold text-emerald-600 block mb-2">{t('knowledge_step4_title') || 'ผลลัพธ์:'}</strong> {t('knowledge_step4_desc') || 'เด็กกลับมาตื่นตัว มีส่วนร่วม และทำงานเสร็จทันเวลา'}</p>
                      </div>
                    </div>
                  </div>
                </AccordionItem>

                <AccordionItem title={t('knowledge_why_matters_title') || 'ทำไมครูต้องทำ EAR?'} isOpen={openSections.includes('1.4')} onClick={() => toggleSection('1.4')}>
                  <div className="my-6 space-y-8 text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                    <p className="mb-6">{t('knowledge_matter_intro') || 'การทำ EAR ให้คุณค่าที่จับต้องได้มากกว่าที่คิด โดยแบ่งออกเป็น 3 มิติหลัก:'}</p>

                    <div className="bg-blue-50/50 p-6 md:p-8 rounded-2xl border-l-[4px] border-[#1e3a8a] space-y-4 md:space-y-3 text-lg md:text-xl shadow-sm mb-8">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                        <span className="font-bold text-[#1e3a8a] shrink-0">&bull; {t('knowledge_matter_sum1_topic') || 'ผู้เรียน & ห้องเรียน'}</span>
                        <span className="hidden sm:inline text-slate-400">➜</span>
                        <span className="text-slate-700 font-medium">{t('knowledge_matter_sum1_desc') || 'แก้ปัญหาได้ตรงจุดทันที ไม่เดาสุ่ม'}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                        <span className="font-bold text-[#1e3a8a] shrink-0">&bull; {t('knowledge_matter_sum2_topic') || 'การพัฒนาวิชาชีพ'}</span>
                        <span className="hidden sm:inline text-slate-400">➜</span>
                        <span className="text-slate-700 font-medium">{t('knowledge_matter_sum2_desc') || 'สร้างนวัตกรรมจริง ก้าวสู่ครูผู้เชี่ยวชาญ'}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                        <span className="font-bold text-[#1e3a8a] shrink-0">&bull; {t('knowledge_matter_sum3_topic') || 'ชุมชนเพื่อนครู'}</span>
                        <span className="hidden sm:inline text-slate-400">➜</span>
                        <span className="text-slate-700 font-medium">{t('knowledge_matter_sum3_desc') || 'ไม่โดดเดี่ยว สู่การเป็นครูพี่เลี้ยง'}</span>
                      </div>
                    </div>

                    {/* ก้อนที่ 1 */}
                    <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100">
                      <h4 className="font-bold text-[#1e3a8a] mb-2">{t('knowledge_matter1_title') || '1. ด้านผู้เรียนและห้องเรียน'}</h4>
                      <p className="text-slate-500 italic mb-6">{t('knowledge_matter1_badge') || 'แก้ปัญหาได้ตรงจุดทันที ไม่เดาสุ่ม'}</p>
                      <ul className="space-y-4 pl-2">
                        <li className="flex items-start gap-4">
                          <span className="text-[#1e3a8a] mt-1 shrink-0">&bull;</span>
                          <span><strong className="font-bold text-[#1e3a8a]">{t('knowledge_m1_p1_title') || 'มองเห็นสัญญาณหน้างาน:'}</strong> {t('knowledge_m1_p1_desc') || 'ก้าวข้ามการสะท้อนคิดแบบเดิมๆ ด้วยการเก็บข้อมูลเชิงประจักษ์ ทำให้เห็นสถานการณ์จริงอย่างแม่นยำ'}</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="text-[#1e3a8a] mt-1 shrink-0">&bull;</span>
                          <span><strong className="font-bold text-[#1e3a8a]">{t('knowledge_m1_p2_title') || 'แก้ปัญหาทันท่วงที:'}</strong> {t('knowledge_m1_p2_desc') || 'นำข้อค้นพบมาปรับวิธีสอนเพื่อช่วยเด็กได้ทันทีในภาคเรียนนั้น โดยไม่ต้องรอจบปีการศึกษา'}</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="text-[#1e3a8a] mt-1 shrink-0">&bull;</span>
                          <span><strong className="font-bold text-[#1e3a8a]">{t('knowledge_m1_p3_title') || 'เข้าใจเหตุผลที่ซ่อนอยู่:'}</strong> {t('knowledge_m1_p3_desc') || 'รู้ว่าเด็กทำแบบฝึกหัดหรือโครงงานได้เพราะอะไรเพื่อต่อยอด และรู้ว่าทำไม่ได้เพราะอะไรเพื่อแก้ไข ไม่ต้องลองผิดลองถูกแบบเดาสุ่ม'}</span>
                        </li>
                      </ul>
                    </div>

                    {/* ก้อนที่ 2 */}
                    <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100">
                      <h4 className="font-bold text-[#1e3a8a] mb-2">{t('knowledge_matter2_title') || '2. ด้านการพัฒนาวิชาชีพ'}</h4>
                      <p className="text-slate-500 italic mb-6">{t('knowledge_matter2_badge') || 'สร้างนวัตกรรมจริง ก้าวสู่ครูผู้เชี่ยวชาญ'}</p>
                      <ul className="space-y-4 pl-2">
                        <li className="flex items-start gap-4">
                          <span className="text-[#1e3a8a] mt-1 shrink-0">&bull;</span>
                          <span><strong className="font-bold text-[#1e3a8a]">{t('knowledge_m2_p1_title') || 'เสริมสร้างพลังตนเอง (Teacher Agency):'}</strong> {t('knowledge_m2_p1_desc') || 'ออกแบบนวัตกรรมการสอนด้วยความเข้าใจบริบทอย่างแท้จริง'}</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="text-[#1e3a8a] mt-1 shrink-0">&bull;</span>
                          <span><strong className="font-bold text-[#1e3a8a]">{t('knowledge_m2_p2_title') || 'เติบโตสู่ Teacher-Researcher:'}</strong> {t('knowledge_m2_p2_desc') || 'พึ่งพาตนเองได้ พัฒนาจนเป็นผู้เชี่ยวชาญในการจัดกระบวนการเรียนรู้'}</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="text-[#1e3a8a] mt-1 shrink-0">&bull;</span>
                          <span><strong className="font-bold text-[#1e3a8a]">{t('knowledge_m2_p3_title') || 'ต่อยอดสู่นวัตกรรมต้นแบบ:'}</strong> {t('knowledge_m2_p3_desc') || 'ผลงานจาก EAR สามารถพัฒนาเป็นนวัตกรรม ผลงานวิชาการ หรือใช้ประกอบการประเมินประจำปี'}</span>
                        </li>
                      </ul>
                    </div>

                    {/* ก้อนที่ 3 */}
                    <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100">
                      <h4 className="font-bold text-[#1e3a8a] mb-2">{t('knowledge_matter3_title') || '3. ด้านชุมชนและการแบ่งปัน'}</h4>
                      <p className="text-slate-500 italic mb-6">{t('knowledge_matter3_badge') || 'ไม่โดดเดี่ยว สู่การเป็นครูพี่เลี้ยง'}</p>
                      <ul className="space-y-4 pl-2">
                        <li className="flex items-start gap-4">
                          <span className="text-[#1e3a8a] mt-1 shrink-0">&bull;</span>
                          <span><strong className="font-bold text-[#1e3a8a]">{t('knowledge_m3_p1_title') || 'สร้างชุมชนแห่งการเรียนรู้ (CoP):'}</strong> {t('knowledge_m3_p1_desc') || 'เกิดการแลกเปลี่ยนเรียนรู้กับเพื่อนครูเคียงบ่าเคียงไหล่'}</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="text-[#1e3a8a] mt-1 shrink-0">&bull;</span>
                          <span><strong className="font-bold text-[#1e3a8a]">{t('knowledge_m3_p2_title') || 'ส่งต่อแรงบันดาลใจ:'}</strong> {t('knowledge_m3_p2_desc') || 'ต่อยอดประสบการณ์ไปสู่การเป็น "ครูพี่เลี้ยง" ให้กับครูรุ่นน้องในอนาคต'}</span>
                        </li>
                      </ul>
                    </div>

                  </div>
                </AccordionItem>

                <AccordionItem title={t('knowledge_myth_title_main') || 'ปลดล็อกความเชื่อเดิมๆ'} isOpen={openSections.includes('1.5')} onClick={() => toggleSection('1.5')}>
                  <div className="my-6 space-y-8 text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                    <p>{t('knowledge_myth_subtitle')}</p>
                    <div className="space-y-6">
                      {/* ส่วน Header สำหรับกำกับคอลัมน์ */}
                      <div className="hidden md:flex items-center gap-6 px-8 pb-2 border-b-2 border-slate-200 border-dashed">
                        <div className="w-1/2 flex items-center gap-4 text-slate-500 font-bold">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 24" strokeWidth={3} stroke="currentColor" className="w-7 h-7 text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                          {t('knowledge_myth_col1') || 'ความเชื่อเดิม'}
                        </div>
                        <div className="w-1/2 flex items-center gap-4 text-[#1e3a8a] font-bold">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-7 h-7 text-emerald-500"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                          {t('knowledge_myth_col2') || 'ภาพจริงของ EAR'}
                        </div>
                      </div>

                      <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center gap-6">
                        <p className="flex items-center gap-4 text-slate-400 md:w-1/2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-red-400 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                          {t('knowledge_myth_old_1') || 'ต้องแจกแบบสอบถามเป็นร้อยชุด'}
                        </p>
                        <p className="flex items-center gap-4 font-medium text-[#1e3a8a] md:w-1/2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-emerald-500 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                          {t('knowledge_myth_new_1') || 'ใช้การสังเกตและคุยกับเด็กหน้างาน'}
                        </p>
                      </div>
                      <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center gap-6">
                        <p className="flex items-center gap-4 text-slate-400 md:w-1/2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-red-400 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                          {t('knowledge_myth_old_2') || 'ต้องวิเคราะห์สถิติซับซ้อน (SPSS)'}
                        </p>
                        <p className="flex items-center gap-4 font-medium text-[#1e3a8a] md:w-1/2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-emerald-500 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                          {t('knowledge_myth_new_2') || 'เน้นทำความเข้าใจข้อมูลเชิงคุณภาพง่ายๆ'}
                        </p>
                      </div>
                      <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center gap-6">
                        <p className="flex items-center gap-4 text-slate-400 md:w-1/2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-red-400 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                          {t('knowledge_myth_old_3') || 'ต้องเขียนรายงานเล่มหนา 5 บท'}
                        </p>
                        <p className="flex items-center gap-4 font-medium text-[#1e3a8a] md:w-1/2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-emerald-500 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                          {t('knowledge_myth_new_3') || 'เน้นสรุปผลสั้นๆ สื่อสารผ่าน Poster/Oral'}
                        </p>
                      </div>
                    </div>
                    <div className="pt-8 border-t border-slate-100 space-y-6">
                      <div className="flex gap-4 md:gap-6 items-start">
                        <p><strong className="font-bold text-[#1e3a8a] mr-2">1. {t('knowledge_myth_detail1_title')}</strong>{t('knowledge_myth_detail1_desc')}</p>
                      </div>
                      <div className="flex gap-4 md:gap-6 items-start">
                        <p><strong className="font-bold text-[#1e3a8a] mr-2">2. {t('knowledge_myth_detail2_title')}</strong>{t('knowledge_myth_detail2_desc')}</p>
                      </div>
                      <div className="flex gap-4 md:gap-6 items-start">
                        <p><strong className="font-bold text-[#1e3a8a] mr-2">3. {t('knowledge_myth_detail3_title')}</strong>{t('knowledge_myth_detail3_desc')}</p>
                      </div>
                    </div>
                  </div>
                </AccordionItem>

              </div>
            </div>

            {/* --- 2. หลักการ EAR --- */}
            <div className="flex flex-col items-start py-12 md:py-16 border-t-4 border-slate-300 relative z-10 bg-[#F8FAFC]">
              <div className="w-full mb-10 flex items-center gap-6">
                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-[#1e3a8a] text-white font-bold text-2xl shadow-md shrink-0">2</div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] tracking-tight mb-2">
                    {t('knowledge_part2_title') || 'หลักการ EAR'}
                  </h2>
                  <p className="text-slate-500 font-light text-xl md:text-2xl">
                    {t('knowledge_part2_subtitle') || 'และความแตกต่างจากวิจัยอื่น'}
                  </p>
                </div>
              </div>

              <div className="w-full pl-0 md:pl-16">
                
                <AccordionItem title={t('knowledge_ear_stages_title') || '2 stages of EAR (2 ขั้นตอนของ EAR)'} isOpen={openCol2s.includes('2.1')} onClick={() => toggleCol2('2.1')}>
                  <div className="my-6 space-y-16 text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                    <p><span className='font-bold'>{t('ear_title')}</span> {t('knowledge_ear_stages_subtitle')}</p>
                    {/* 🟢 ส่วนที่ 1: รูปภาพ 1 คู่กับคำอธิบาย Stage 1 & Stage 2 */}
                    <div className="space-y-10">
                      {/* รูปภาพที่ 1 */}
                      <div className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white p-2">
                        <img src="../Knowledge/Ear_Diagram_1.webp" alt="EAR Stages Diagram" className="w-full h-auto object-contain" />
                      </div>

                      {/* เนื้อหาอธิบาย */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                        <div className="space-y-4">
                          <h4 className="font-bold text-[#1e3a8a] text-2xl md:text-3xl">{t('knowledge_ear_stage1_title')}</h4>
                          <p className="text-slate-500 italic">{t('knowledge_ear_stage1_subtitle')}</p>
                          <p className="text-slate-700">{t('knowledge_ear_stage1_desc')}</p>
                          <ul className="space-y-3 pl-2 list-none text-slate-700">
                            <li className="flex items-start gap-3"><span className="font-bold text-[#1e3a8a] shrink-0">1. Reflect:</span> <span>{t('knowledge_ear_s1_p1')}</span></li>
                            <li className="flex items-start gap-3"><span className="font-bold text-[#1e3a8a] shrink-0">2. Plan:</span> <span>{t('knowledge_ear_s1_p2')}</span></li>
                            <li className="flex items-start gap-3"><span className="font-bold text-[#1e3a8a] shrink-0">3. Observe:</span> <span>{t('knowledge_ear_s1_p3')}</span></li>
                            <li className="flex items-start gap-3"><span className="font-bold text-[#1e3a8a] shrink-0">4. Reflect:</span> <span>{t('knowledge_ear_s1_p4')}</span></li>
                          </ul>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="font-bold text-emerald-700 text-2xl md:text-3xl">{t('knowledge_ear_stage2_title')}</h4>
                          <p className="text-emerald-600/70 italic">{t('knowledge_ear_stage2_subtitle')}</p>
                          <p className="text-slate-700">{t('knowledge_ear_stage2_desc')}</p>
                          <ul className="space-y-3 pl-2 list-none text-slate-700">
                            <li className="flex items-start gap-3"><span className="font-bold text-emerald-700 shrink-0">5. Plan:</span> <span>{t('knowledge_ear_s2_p5')}</span></li>
                            <li className="flex items-start gap-3"><span className="font-bold text-emerald-700 shrink-0">6. Act:</span> <span>{t('knowledge_ear_s2_p6')}</span></li>
                            <li className="flex items-start gap-3"><span className="font-bold text-emerald-700 shrink-0">7. Observe:</span> <span>{t('knowledge_ear_s2_p7')}</span></li>
                            <li className="flex items-start gap-3"><span className="font-bold text-emerald-700 shrink-0">8. Reflect:</span> <span>{t('knowledge_ear_s2_p8')}</span></li>
                            <li className="flex items-start gap-3"><span className="font-bold text-emerald-700 shrink-0">9. Re-plan:</span> <span>{t('knowledge_ear_s2_p9')}</span></li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <p className="text-slate-500 italic mt-8 text-center md:text-left text-lg md:text-xl">
                      ( รายละเอียดของแต่ละขั้นตอนสามารถดูคลิปได้ที่{' '}
                      <button 
                        onClick={() => document.getElementById('ear-learning-clips')?.scrollIntoView({ behavior: 'smooth' })}
                        className="text-[#1e3a8a] underline underline-offset-4 hover:text-blue-800 font-bold cursor-pointer transition-colors"
                      >
                        คลังคลิป EAR
                      </button>
                      {' '} )
                    </p>
                    <hr className="border-slate-200" />

                    {/* 🟢 ส่วนที่ 2: รูปภาพ 2 คู่กับเนื้อหาตัวอย่าง 8 ขั้นตอน */}
                    <div className="space-y-10">
                      <h4 className="font-bold text-[#1e3a8a] text-2xl md:text-3xl flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.829 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.487 1.509 1.333 1.509 2.316V18" /></svg>
                        {t('knowledge_ear_example_title') || 'ตามมาดูครูใช้ EAR อย่างไร'}
                      </h4>

                      {/* รูปภาพที่ 2 */}
                      <div className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white p-2">
                        <img src="../Knowledge/Ear_Diagram_2.webp" alt="EAR Example Timeline" className="w-full h-auto object-contain" />
                      </div>

                      {/* เนื้อหา List เรียงจากซ้ายไปขวา */}
                      <div className="my-6 space-y-6 text-xl md:text-2xl text-slate-800 font-light leading-relaxed pt-4">
                        <ul className="space-y-6 pl-2">
                          <li className="flex items-start gap-4">
                            <div><strong className="font-bold text-[#1e3a8a]">1. Reflect:</strong> {t('knowledge_ear_ex_1') || 'นักเรียนขาดแรงจูงใจในการเรียน'}</div>
                          </li>
                          <li className="flex items-start gap-4">
                            <div><strong className="font-bold text-[#1e3a8a]">2. Plan:</strong> {t('knowledge_ear_ex_2') || 'ฉันวางแผนหาวิธีเก็บข้อมูลเพื่อเข้าใจปัญหานี้'}</div>
                          </li>
                          <li className="flex items-start gap-4">
                            <div><strong className="font-bold text-[#1e3a8a]">3. Observe:</strong> {t('knowledge_ear_ex_3') || 'ฉันสอบถามมุมมองความคิดเห็นของนักเรียน และขอให้เพื่อนครูเข้ามาช่วยสังเกตการสอนในห้องเรียน'}</div>
                          </li>
                          <li className="flex items-start gap-4">
                            <div><strong className="font-bold text-[#1e3a8a]">4. Reflect:</strong> {t('knowledge_ear_ex_4') || 'ฉันวิเคราะห์ข้อมูลและสรุปผลได้ว่า: นักเรียนอยากมีโอกาสพูดสื่อสารในชั้นเรียนมากขึ้น'}</div>
                          </li>
                          <li className="flex items-start gap-4">
                            <div><strong className="font-bold text-emerald-700">5. Plan:</strong> {t('knowledge_ear_ex_5') || 'ฉันวางแผนและออกแบบแผนการจัดการเรียนรู้ (Action Plan)'}</div>
                          </li>
                          <li className="flex items-start gap-4">
                            <div><strong className="font-bold text-emerald-700">6. Act:</strong> {t('knowledge_ear_ex_6') || 'ฉันปรับการสอนโดยเน้นเน้นกิจกรรมการสนทนาแลกเปลี่ยนมากขึ้น'}</div>
                          </li>
                          <li className="flex items-start gap-4">
                            <div><strong className="font-bold text-emerald-700">7. Observe:</strong> {t('knowledge_ear_ex_7') || 'ฉันสอบถามมุมมองความคิดเห็นของนักเรียนอีกครั้ง และขอให้เพื่อนครูเข้ามาช่วยสังเกตการสอน'}</div>
                          </li>
                          <li className="flex items-start gap-4">
                            <div><strong className="font-bold text-emerald-700">8. Reflect:</strong> {t('knowledge_ear_ex_8') || 'ฉันวิเคราะห์ข้อมูลและสรุปผลได้ว่า: นักเรียนมีส่วนร่วมกับการเรียนมากขึ้น แต่ยังต้องการฝึกฝนเพิ่มเติมอีก'}</div>
                          </li>
                        </ul>
                      </div>
                    </div>

                  </div>
                </AccordionItem>

                <AccordionItem title={t('knowledge_ear_key_title_main') || 'Key of EAR (หัวใจสำคัญของการทำวิจัย EAR)'} isOpen={openCol2s.includes('2.2')} onClick={() => toggleCol2('2.2')}>
                  <div className="my-6 space-y-8 text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                    <ul className="space-y-4 pl-2">
                      <li className="flex items-start gap-4"><span className="text-[#1e3a8a] mt-1">&bull;</span><span>{t('knowledge_ear_key_1')}</span></li>
                      <li className="flex items-start gap-4"><span className="text-[#1e3a8a] mt-1">&bull;</span><span>{t('knowledge_ear_key_2')}</span></li>
                      <li className="flex items-start gap-4"><span className="text-[#1e3a8a] mt-1">&bull;</span><span>{t('knowledge_ear_key_3')}</span></li>
                      <li className="flex items-start gap-4"><span className="text-[#1e3a8a] mt-1">&bull;</span><span>{t('knowledge_ear_key_4')}</span></li>
                      <li className="flex items-start gap-4"><span className="text-[#1e3a8a] mt-1">&bull;</span><span>{t('knowledge_ear_key_5')}</span></li>
                      <li className="flex items-start gap-4"><span className="text-[#1e3a8a] mt-1">&bull;</span><span>{t('knowledge_ear_key_6')}</span></li>
                      <li className="flex items-start gap-4"><span className="text-[#1e3a8a] mt-1">&bull;</span><span>{t('knowledge_ear_key_7')}</span></li>
                      <li className="flex items-start gap-4"><span className="text-[#1e3a8a] mt-1">&bull;</span><span>{t('knowledge_ear_key_8')}</span></li>
                      <li className="flex items-start gap-4"><span className="text-[#1e3a8a] mt-1">&bull;</span><span>{t('knowledge_ear_key_9')}</span></li>
                    </ul>
                    <div className="border-l-[4px] border-slate-300 pl-6 py-4 mt-6 text-lg md:text-xl italic text-slate-500 bg-slate-50/50 rounded-r-2xl">
                      {t('knowledge_ear_key_ref')}
                    </div>
                  </div>
                </AccordionItem>

                <AccordionItem title={t('knowledge_ear_getting_started_title') || 'จุดเริ่มต้นสำหรับครูมือใหม่ (Getting Started)'} isOpen={openCol2s.includes('2.4')} onClick={() => toggleCol2('2.4')}>
                  <div className="my-6 space-y-6 text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                    <p className="font-medium text-[#1e3a8a] mb-6 bg-blue-50/50 p-4 rounded-xl border-l-[4px] border-[#1e3a8a] inline-block">
                      {t('knowledge_ear_getting_started_subtitle')}
                    </p>
                    <ul className="space-y-6 pl-2">
                      <li className="flex items-start gap-4">
                        <div><strong className="font-bold text-[#1e3a8a]">{t('knowledge_ear_start_1_title')}</strong> {' '}{t('knowledge_ear_start_1_desc')}</div>
                      </li>
                      <li className="flex items-start gap-4">
                        <div><strong className="font-bold text-[#1e3a8a]">{t('knowledge_ear_start_2_title')}</strong> {' '}{t('knowledge_ear_start_2_desc')}</div>
                      </li>
                      <li className="flex items-start gap-4">
                        <div><strong className="font-bold text-[#1e3a8a]">{t('knowledge_ear_start_3_title')}</strong> {' '}{t('knowledge_ear_start_3_desc')}</div>
                      </li>
                    </ul>
                  </div>
                </AccordionItem>

                <AccordionItem title={t('knowledge_ear_diff_title') || 'How EAR is different from other research (ไขข้อสงสัย: EAR ต่างจากการวิจัยอื่นอย่างไร)'} isOpen={openCol2s.includes('2.3')} onClick={() => toggleCol2('2.3')}>
                  <div className="my-6 space-y-6 text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                    <p>{t('knowledge_ear_diff_intro')}</p>
                    <div className="overflow-x-auto mt-8 rounded-2xl border border-slate-200 shadow-sm">
                      <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                          <tr className="bg-[#1e3a8a] text-white">
                            <th className="p-5 font-bold border-r border-blue-800 w-1/5">{t('knowledge_ear_diff_col1')}</th>
                            <th className="p-5 font-bold border-r border-blue-800 w-1/5">{t('knowledge_ear_diff_col2')}</th>
                            <th className="p-5 font-bold border-r border-blue-800 w-1/5">{t('knowledge_ear_diff_col3')}</th>
                            <th className="p-5 font-bold border-r border-blue-800 w-1/5">{t('knowledge_ear_diff_col4')}</th>
                            <th className="p-5 font-bold text-yellow-300 w-1/5">{t('knowledge_ear_diff_col5')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="p-5 font-bold text-[#1e3a8a] border-r border-slate-200 align-top">{t('knowledge_ear_diff_row1')}</td>
                            <td className="p-5 border-r border-slate-200 align-top">{t('knowledge_ear_diff_r1_c2')}</td>
                            <td className="p-5 border-r border-slate-200 align-top">{t('knowledge_ear_diff_r1_c3')}</td>
                            <td className="p-5 border-r border-slate-200 align-top">{t('knowledge_ear_diff_r1_c4')}</td>
                            <td className="p-5 font-medium text-[#1e3a8a] bg-blue-50/50 align-top">{t('knowledge_ear_diff_r1_c5')}</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="p-5 font-bold text-[#1e3a8a] border-r border-slate-200 align-top">{t('knowledge_ear_diff_row2')}</td>
                            <td className="p-5 border-r border-slate-200 align-top">{t('knowledge_ear_diff_r2_c2')}</td>
                            <td className="p-5 border-r border-slate-200 align-top">{t('knowledge_ear_diff_r2_c3')}</td>
                            <td className="p-5 border-r border-slate-200 align-top">{t('knowledge_ear_diff_r2_c4')}</td>
                            <td className="p-5 font-medium text-[#1e3a8a] bg-blue-50/50 align-top">{t('knowledge_ear_diff_r2_c5')}</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="p-5 font-bold text-[#1e3a8a] border-r border-slate-200 align-top">{t('knowledge_ear_diff_row3')}</td>
                            <td className="p-5 border-r border-slate-200 align-top">{t('knowledge_ear_diff_r3_c2')}</td>
                            <td className="p-5 border-r border-slate-200 align-top">{t('knowledge_ear_diff_r3_c3')}</td>
                            <td className="p-5 border-r border-slate-200 align-top">{t('knowledge_ear_diff_r3_c4')}</td>
                            <td className="p-5 font-medium text-[#1e3a8a] bg-blue-50/50 align-top">{t('knowledge_ear_diff_r3_c5')}</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="p-5 font-bold text-[#1e3a8a] border-r border-slate-200 align-top">{t('knowledge_ear_diff_row4')}</td>
                            <td className="p-5 border-r border-slate-200 align-top">{t('knowledge_ear_diff_r4_c2')}</td>
                            <td className="p-5 border-r border-slate-200 align-top">{t('knowledge_ear_diff_r4_c3')}</td>
                            <td className="p-5 border-r border-slate-200 align-top">{t('knowledge_ear_diff_r4_c4')}</td>
                            <td className="p-5 font-medium text-[#1e3a8a] bg-blue-50/50 align-top">{t('knowledge_ear_diff_r4_c5')}</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="p-5 font-bold text-[#1e3a8a] border-r border-slate-200 align-top">{t('knowledge_ear_diff_row5')}</td>
                            <td className="p-5 border-r border-slate-200 align-top">{t('knowledge_ear_diff_r5_c2')}</td>
                            <td className="p-5 border-r border-slate-200 align-top">{t('knowledge_ear_diff_r5_c3')}</td>
                            <td className="p-5 border-r border-slate-200 align-top">{t('knowledge_ear_diff_r5_c4')}</td>
                            <td className="p-5 font-medium text-[#1e3a8a] bg-blue-50/50 align-top">{t('knowledge_ear_diff_r5_c5')}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </AccordionItem>

              </div>
            </div>
          </div>
        </section>

        <div id="ear-learning-clips"></div>
        {/* ================= SECTION B: EAR Learning Clips ================= */}
        <section className="mt-16 pt-16 pb-30 border-b-4 border-slate-300">
          
          <div className="mb-16 md:mb-20 flex flex-col items-center text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
              {t('knowledge_clip_title') || 'คลังคลิปเรียนรู้ EAR'}
            </h2>
            <p className="text-2xl md:text-3xl text-slate-600 mt-3 font-normal tracking-wide leading-relaxed">
              {t('knowledge_clip_title2')}
            </p>
          </div>

          <div className="flex flex-col items-start py-0 md:py-4"> 
            <div className="w-full mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] tracking-tight mb-3">
                  {t('knowledge_clip_subtitle') || 'บทเรียนออนไลน์'}
                </h2>
                <p className="text-slate-500 font-light text-xl md:text-2xl">
                  {t('knowledge_clip_desc') || 'เลือกหัวข้อเพื่อรับชมวิดีโอคลิป และดาวน์โหลดคู่มือที่เกี่ยวข้อง'}
                </p>
                <div className="w-12 h-[3px] bg-[#1e3a8a] mt-6"></div>
              </div>
            </div>

            <div className="w-full">
              
              {/* Unit 1 */}
              <AccordionItem title={t('knowledge_clip_u1_title') || '1. แนะนำ EAR (Introducing EAR)'} isOpen={openClipSections.includes('clip.1')} onClick={() => toggleClipSection('clip.1')}>
                <div className="space-y-2">
                  <div onClick={() => openVideo(t('knowledge_clip_u1_1') || '1.1 วิจัยครูและคุณค่าต่อการพัฒนาการสอน', 'https://drive.google.com/file/d/1fRFGnokYHfjojp8VvD399FRWriuKwgMG/view?usp=sharing')} className="flex items-center justify-between p-4 md:p-5 rounded-2xl hover:bg-blue-50 cursor-pointer transition-all border border-transparent hover:border-blue-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-[#1e3a8a] flex items-center justify-center group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="text-xl md:text-2xl text-slate-700 font-light group-hover:font-medium transition-all">{t('knowledge_clip_u1_1') || '1.1 วิจัยครูและคุณค่าต่อการพัฒนาการสอน'}</span>
                    </div>
                  </div>
                  <div onClick={() => openVideo(t('knowledge_clip_u1_2') || '1.2 EAR และผลกระทบต่อการจัดการเรียนรู้', 'https://drive.google.com/file/d/1sh3onXvoTskpPmlGFxsaZfWza8z8Ht_x/view?usp=sharing')} className="flex items-center justify-between p-4 md:p-5 rounded-2xl hover:bg-blue-50 cursor-pointer transition-all border border-transparent hover:border-blue-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-[#1e3a8a] flex items-center justify-center group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="text-xl md:text-2xl text-slate-700 font-light group-hover:font-medium transition-all">{t('knowledge_clip_u1_2') || '1.2 EAR และผลกระทบต่อการจัดการเรียนรู้'}</span>
                    </div>
                  </div>
                  <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                    <span className="text-base font-semibold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">{t('handbook')}: {t('unit')} 1, 2 {t('and')} 3</span>
                  </div>
                </div>
              </AccordionItem>

              {/* Unit 2 */}
              <AccordionItem title={t('knowledge_clip_u2_title') || '2. การระบุปัญหาในชั้นเรียน (Identifying problems)'} isOpen={openClipSections.includes('clip.2')} onClick={() => toggleClipSection('clip.2')}>
                <div className="space-y-2">
                  <div onClick={() => openVideo(t('knowledge_clip_u2_1') || '2.1 การเลือกหัวข้อวิจัยของคุณ', 'https://drive.google.com/file/d/1cuvaSl7QUeiuw2x5hnNgkdJX76sLw2ip/view?usp=drive_link')} className="flex items-center justify-between p-4 md:p-5 rounded-2xl hover:bg-blue-50 cursor-pointer transition-all border border-transparent hover:border-blue-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-[#1e3a8a] flex items-center justify-center group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="text-xl md:text-2xl text-slate-700 font-light group-hover:font-medium transition-all">{t('knowledge_clip_u2_1') || '2.1 การเลือกหัวข้อวิจัยของคุณ'}</span>
                    </div>
                  </div>
                  <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                    <span className="text-base font-semibold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">{t('handbook')}: {t('unit')} 4</span>
                  </div>
                </div>
              </AccordionItem>

              {/* Unit 3 */}
              <AccordionItem title={t('knowledge_clip_u3_title') || '3. การตั้งคำถามวิจัย (Asking E-RQ)'} isOpen={openClipSections.includes('clip.3')} onClick={() => toggleClipSection('clip.3')}>
                <div className="space-y-2">
                  <div onClick={() => openVideo(t('knowledge_clip_u3_1') || '3.1 จากหัวข้อวิจัยสู่การตั้งคำถามวิจัย', 'https://drive.google.com/file/d/1lBf3h5Q9LTWHXLad9ZNYFMczL4pv6XT6/view?usp=drive_link')} className="flex items-center justify-between p-4 md:p-5 rounded-2xl hover:bg-blue-50 cursor-pointer transition-all border border-transparent hover:border-blue-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-[#1e3a8a] flex items-center justify-center group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="text-xl md:text-2xl text-slate-700 font-light group-hover:font-medium transition-all">{t('knowledge_clip_u3_1') || '3.1 จากหัวข้อวิจัยสู่การตั้งคำถามวิจัย'}</span>
                    </div>
                  </div>
                  <div onClick={() => openVideo(t('knowledge_clip_u3_2') || '3.2 ตัวอย่างจริงของคำถามวิจัยเชิงสำรวจ', 'https://drive.google.com/file/d/15UUAfiAvUvLE8ztckcCQ2AdsiePKgbaE/view?usp=drive_link')} className="flex items-center justify-between p-4 md:p-5 rounded-2xl hover:bg-blue-50 cursor-pointer transition-all border border-transparent hover:border-blue-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-[#1e3a8a] flex items-center justify-center group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="text-xl md:text-2xl text-slate-700 font-light group-hover:font-medium transition-all">{t('knowledge_clip_u3_2') || '3.2 ตัวอย่างจริงของคำถามวิจัยเชิงสำรวจ'}</span>
                    </div>
                  </div>
                  <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                    <span className="text-base font-semibold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">{t('handbook')}: {t('unit')} 4</span>
                  </div>
                </div>
              </AccordionItem>

              {/* Unit 4 */}
              <AccordionItem title={t('knowledge_clip_u4_title') || '4. การเก็บรวบรวมข้อมูล (Data collection)'} isOpen={openClipSections.includes('clip.4')} onClick={() => toggleClipSection('clip.4')}>
                <div className="space-y-2">
                  <div onClick={() => openVideo(t('knowledge_clip_u4_1') || '4.1 เรียนรู้จากตัวอย่างจริง', 'https://drive.google.com/file/d/1AHY1h10kDcc9J6OMcnarP0RnYiUETe_x/view?usp=drive_link')} className="flex items-center justify-between p-4 md:p-5 rounded-2xl hover:bg-blue-50 cursor-pointer transition-all border border-transparent hover:border-blue-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-[#1e3a8a] flex items-center justify-center group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="text-xl md:text-2xl text-slate-700 font-light group-hover:font-medium transition-all">{t('knowledge_clip_u4_1') || '4.1 เรียนรู้จากตัวอย่างจริง'}</span>
                    </div>
                  </div>
                  <div onClick={() => openVideo(t('knowledge_clip_u4_2') || '4.2 ทำความเข้าใจข้อมูลวิจัย', 'https://drive.google.com/file/d/1Jf_UZ6q1_obKUu_7RDMAM1IgCsV2PBUP/view?usp=drive_link')} className="flex items-center justify-between p-4 md:p-5 rounded-2xl hover:bg-blue-50 cursor-pointer transition-all border border-transparent hover:border-blue-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-[#1e3a8a] flex items-center justify-center group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="text-xl md:text-2xl text-slate-700 font-light group-hover:font-medium transition-all">{t('knowledge_clip_u4_2') || '4.2 ทำความเข้าใจข้อมูลวิจัย'}</span>
                    </div>
                  </div>
                  <div onClick={() => openVideo(t('knowledge_clip_u4_3') || '4.3 เครื่องมือ วิธีการ และเทคนิคในการเก็บข้อมูล', 'https://drive.google.com/file/d/1x3UmgjrGSBhNtiD18LvOf7yyQsexxS79/view?usp=drive_link')} className="flex items-center justify-between p-4 md:p-5 rounded-2xl hover:bg-blue-50 cursor-pointer transition-all border border-transparent hover:border-blue-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-[#1e3a8a] flex items-center justify-center group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="text-xl md:text-2xl text-slate-700 font-light group-hover:font-medium transition-all">{t('knowledge_clip_u4_3') || '4.3 เครื่องมือ วิธีการ และเทคนิคในการเก็บข้อมูล'}</span>
                    </div>
                  </div>
                  <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                    <span className="text-base font-semibold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">{t('handbook')}: {t('unit')} 5</span>
                  </div>
                </div>
              </AccordionItem>

              {/* Unit 5 */}
              <AccordionItem title={t('knowledge_clip_u5_title') || '5. เครื่องมือเก็บรวบรวมข้อมูล (Tools for data collection)'} isOpen={openClipSections.includes('clip.5')} onClick={() => toggleClipSection('clip.5')}>
                <div className="space-y-2">
                  <div onClick={() => openVideo(t('knowledge_clip_u5_1') || '5.1 เครื่องมือ: บันทึกสะท้อนคิด การสัมภาษณ์ และสนทนากลุ่ม', 'https://drive.google.com/file/d/1Ut86IX20awwftQncdfFgZNah8RVQ218Q/view?usp=drive_link')} className="flex items-center justify-between p-4 md:p-5 rounded-2xl hover:bg-blue-50 cursor-pointer transition-all border border-transparent hover:border-blue-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-[#1e3a8a] flex items-center justify-center group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="text-xl md:text-2xl text-slate-700 font-light group-hover:font-medium transition-all">{t('knowledge_clip_u5_1') || '5.1 เครื่องมือ: บันทึกสะท้อนคิด การสัมภาษณ์ และสนทนากลุ่ม'}</span>
                    </div>
                  </div>
                  <div onClick={() => openVideo(t('knowledge_clip_u5_2') || '5.2 เครื่องมือ: แบบสอบถาม และการสังเกต', 'https://drive.google.com/file/d/1gTIU9nAGwh4A3TCNJ-sugH12eLwaorIk/view?usp=drive_link')} className="flex items-center justify-between p-4 md:p-5 rounded-2xl hover:bg-blue-50 cursor-pointer transition-all border border-transparent hover:border-blue-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-[#1e3a8a] flex items-center justify-center group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="text-xl md:text-2xl text-slate-700 font-light group-hover:font-medium transition-all">{t('knowledge_clip_u5_2') || '5.2 เครื่องมือ: แบบสอบถาม และการสังเกต'}</span>
                    </div>
                  </div>
                  <div onClick={() => openVideo(t('knowledge_clip_u5_3') || '5.3 ตัวอย่างจริงของการเก็บรวบรวมข้อมูล', 'https://drive.google.com/file/d/13idIcQrOyPYjVCg-MAFxzwyGFtFphVMn/view?usp=drive_link')} className="flex items-center justify-between p-4 md:p-5 rounded-2xl hover:bg-blue-50 cursor-pointer transition-all border border-transparent hover:border-blue-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-[#1e3a8a] flex items-center justify-center group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="text-xl md:text-2xl text-slate-700 font-light group-hover:font-medium transition-all">{t('knowledge_clip_u5_3') || '5.3 ตัวอย่างจริงของการเก็บรวบรวมข้อมูล'}</span>
                    </div>
                  </div>
                  <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                    <span className="text-base font-semibold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">{t('handbook')}: {t('unit')} 5</span>
                  </div>
                </div>
              </AccordionItem>

              {/* Unit 6 */}
              <AccordionItem title={t('knowledge_clip_u6_title') || '6. การวิเคราะห์และการตีความข้อมูล (Data analysis)'} isOpen={openClipSections.includes('clip.6')} onClick={() => toggleClipSection('clip.6')}>
                <div className="space-y-2">
                  <div onClick={() => openVideo(t('knowledge_clip_u6_1') || '6.1 การวิเคราะห์และการตีความข้อมูล', 'https://drive.google.com/file/d/1kzqnORo184NJaFUQjn76hXd1d4Ntq2ob/view?usp=drive_link')} className="flex items-center justify-between p-4 md:p-5 rounded-2xl hover:bg-blue-50 cursor-pointer transition-all border border-transparent hover:border-blue-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-[#1e3a8a] flex items-center justify-center group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="text-xl md:text-2xl text-slate-700 font-light group-hover:font-medium transition-all">{t('knowledge_clip_u6_1') || '6.1 การวิเคราะห์และการตีความข้อมูล'}</span>
                    </div>
                  </div>
                  <div onClick={() => openVideo(t('knowledge_clip_u6_2') || '6.2 การเตรียมและการวิเคราะห์ข้อมูลเชิงคุณภาพ', 'https://drive.google.com/file/d/1FRC6GqqwE40UhECtyNTfD_MyPV1BvzQp/view?usp=drive_link')} className="flex items-center justify-between p-4 md:p-5 rounded-2xl hover:bg-blue-50 cursor-pointer transition-all border border-transparent hover:border-blue-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-[#1e3a8a] flex items-center justify-center group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="text-xl md:text-2xl text-slate-700 font-light group-hover:font-medium transition-all">{t('knowledge_clip_u6_2') || '6.2 การเตรียมและการวิเคราะห์ข้อมูลเชิงคุณภาพ'}</span>
                    </div>
                  </div>
                  <div onClick={() => openVideo(t('knowledge_clip_u6_3') || '6.3 การเตรียมและการวิเคราะห์ข้อมูลเชิงปริมาณ', 'https://drive.google.com/file/d/1PfeMmKpo98ypmc7YdE1fTfL9Y-uWXuJz/view?usp=drive_link')} className="flex items-center justify-between p-4 md:p-5 rounded-2xl hover:bg-blue-50 cursor-pointer transition-all border border-transparent hover:border-blue-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-[#1e3a8a] flex items-center justify-center group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="text-xl md:text-2xl text-slate-700 font-light group-hover:font-medium transition-all">{t('knowledge_clip_u6_3') || '6.3 การเตรียมและการวิเคราะห์ข้อมูลเชิงปริมาณ'}</span>
                    </div>
                  </div>
                  <div onClick={() => openVideo(t('knowledge_clip_u6_4') || '6.4 สรุปภาพรวมการวิเคราะห์ข้อมูล', 'https://drive.google.com/file/d/1pbr6YVemMh91CqJCgANYDJqgdjo9DxXW/view?usp=drive_link')} className="flex items-center justify-between p-4 md:p-5 rounded-2xl hover:bg-blue-50 cursor-pointer transition-all border border-transparent hover:border-blue-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-[#1e3a8a] flex items-center justify-center group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="text-xl md:text-2xl text-slate-700 font-light group-hover:font-medium transition-all">{t('knowledge_clip_u6_4') || '6.4 สรุปภาพรวมการวิเคราะห์ข้อมูล'}</span>
                    </div>
                  </div>
                  <div onClick={() => openVideo(t('knowledge_clip_u6_5') || '6.5 ตัวอย่างจริงของการวิเคราะห์ข้อมูล', 'https://drive.google.com/file/d/1V8CkQD0XqGUa6vbokQrh9mgA9TvFdTTn/view?usp=drive_link')} className="flex items-center justify-between p-4 md:p-5 rounded-2xl hover:bg-blue-50 cursor-pointer transition-all border border-transparent hover:border-blue-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-[#1e3a8a] flex items-center justify-center group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="text-xl md:text-2xl text-slate-700 font-light group-hover:font-medium transition-all">{t('knowledge_clip_u6_5') || '6.5 ตัวอย่างจริงของการวิเคราะห์ข้อมูล'}</span>
                    </div>
                  </div>
                  <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                    <span className="text-base font-semibold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">{t('handbook')}: {t('unit')} 6 & 8</span>
                  </div>
                </div>
              </AccordionItem>

              {/* Unit 7 */}
              <AccordionItem title={t('knowledge_clip_u7_title') || '7. การจัดทำแผนปฏิบัติการ (Action Plan)'} isOpen={openClipSections.includes('clip.7')} onClick={() => toggleClipSection('clip.7')}>
                <div className="space-y-2">
                  <div onClick={() => openVideo(t('knowledge_clip_u7_1') || '7.1 ปูพื้นฐานเกี่ยวกับแผนปฏิบัติการ', 'https://drive.google.com/file/d/1LqoGRBdqL6hIUblvzRY8Fom0GOcLkOok/view?usp=drive_link')} className="flex items-center justify-between p-4 md:p-5 rounded-2xl hover:bg-blue-50 cursor-pointer transition-all border border-transparent hover:border-blue-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-[#1e3a8a] flex items-center justify-center group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="text-xl md:text-2xl text-slate-700 font-light group-hover:font-medium transition-all">{t('knowledge_clip_u7_1') || '7.1 ปูพื้นฐานเกี่ยวกับแผนปฏิบัติการ'}</span>
                    </div>
                  </div>
                  <div onClick={() => openVideo(t('knowledge_clip_u7_2') || '7.2 ไอเดียสำหรับการสร้างแผนปฏิบัติการ', 'https://drive.google.com/file/d/16gmJaNoPhnxag__EX4_2qK6n1tpPnU5q/view?usp=drive_link')} className="flex items-center justify-between p-4 md:p-5 rounded-2xl hover:bg-blue-50 cursor-pointer transition-all border border-transparent hover:border-blue-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-[#1e3a8a] flex items-center justify-center group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="text-xl md:text-2xl text-slate-700 font-light group-hover:font-medium transition-all">{t('knowledge_clip_u7_2') || '7.2 ไอเดียสำหรับการสร้างแผนปฏิบัติการ'}</span>
                    </div>
                  </div>
                  <div onClick={() => openVideo(t('knowledge_clip_u7_3') || '7.3 การออกแบบและการนำแผนปฏิบัติการไปใช้จริง', 'https://drive.google.com/file/d/10d5XeoO5WHahB0GR1fb5N0CTncM4PCUL/view?usp=drive_link')} className="flex items-center justify-between p-4 md:p-5 rounded-2xl hover:bg-blue-50 cursor-pointer transition-all border border-transparent hover:border-blue-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-[#1e3a8a] flex items-center justify-center group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="text-xl md:text-2xl text-slate-700 font-light group-hover:font-medium transition-all">{t('knowledge_clip_u7_3') || '7.3 การออกแบบและการนำแผนปฏิบัติการไปใช้จริง'}</span>
                    </div>
                  </div>
                  <div onClick={() => openVideo(t('knowledge_clip_u7_4') || '7.4 การประเมินความเปลี่ยนแปลงและการเปรียบเทียบผลลัพธ์', 'https://drive.google.com/file/d/1sOZu9_BNbqwxHWrOwmT9mJwY3VoQxxds/view?usp=drive_link')} className="flex items-center justify-between p-4 md:p-5 rounded-2xl hover:bg-blue-50 cursor-pointer transition-all border border-transparent hover:border-blue-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-[#1e3a8a] flex items-center justify-center group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="text-xl md:text-2xl text-slate-700 font-light group-hover:font-medium transition-all">{t('knowledge_clip_u7_4') || '7.4 การประเมินความเปลี่ยนแปลงและการเปรียบเทียบผลลัพธ์'}</span>
                    </div>
                  </div>
                  <div onClick={() => openVideo(t('knowledge_clip_u7_5') || '7.5 ตัวอย่างจริงของแผนปฏิบัติการ', 'https://drive.google.com/file/d/11xfDEQBwf1uf50cHTCWyYVCSOKTjW-ts/view?usp=drive_link')} className="flex items-center justify-between p-4 md:p-5 rounded-2xl hover:bg-blue-50 cursor-pointer transition-all border border-transparent hover:border-blue-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-[#1e3a8a] flex items-center justify-center group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="text-xl md:text-2xl text-slate-700 font-light group-hover:font-medium transition-all">{t('knowledge_clip_u7_5') || '7.5 ตัวอย่างจริงของแผนปฏิบัติการ'}</span>
                    </div>
                  </div>
                  <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                    <span className="text-base font-semibold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">{t('handbook')}: {t('unit')} 7</span>
                  </div>
                </div>
              </AccordionItem>

              {/* Unit 8 */}
              <AccordionItem title={t('knowledge_clip_u8_title') || '8. การเผยแพร่และแบ่งปันผลงาน (Sharing results)'} isOpen={openClipSections.includes('clip.8')} onClick={() => toggleClipSection('clip.8')}>
                <div className="space-y-2">
                  <div onClick={() => openVideo(t('knowledge_clip_u8_1') || '8.1 ทำความรู้จักการแบ่งปันผลงาน: ทำอะไร ทำไมต้องทำ และทำอย่างไร', 'https://drive.google.com/file/d/1Z69k6N7yOwSAJKQHTW-U2XCXcH0r6VGE/view?usp=drive_link')} className="flex items-center justify-between p-4 md:p-5 rounded-2xl hover:bg-blue-50 cursor-pointer transition-all border border-transparent hover:border-blue-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-[#1e3a8a] flex items-center justify-center group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="text-xl md:text-2xl text-slate-700 font-light group-hover:font-medium transition-all">{t('knowledge_clip_u8_1') || '8.1 ทำความรู้จักการแบ่งปันผลงาน: ทำอะไร ทำไมต้องทำ และทำอย่างไร'}</span>
                    </div>
                  </div>
                  <div onClick={() => openVideo(t('knowledge_clip_u8_2') || '8.2 การเตรียมเนื้อหา ภาษา และเทคนิคการนำเสนอ/การพูด', 'https://drive.google.com/file/d/14vn-3z-TdLT-cKHidgD-rtbqfttfHCMt/view?usp=drive_link')} className="flex items-center justify-between p-4 md:p-5 rounded-2xl hover:bg-blue-50 cursor-pointer transition-all border border-transparent hover:border-blue-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-[#1e3a8a] flex items-center justify-center group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="text-xl md:text-2xl text-slate-700 font-light group-hover:font-medium transition-all">{t('knowledge_clip_u8_2') || '8.2 การเตรียมเนื้อหา ภาษา และเทคนิคการนำเสนอ/การพูด'}</span>
                    </div>
                  </div>
                  <div onClick={() => openVideo(t('knowledge_clip_u8_3') || '8.3 การเตรียม E-Poster, บทคัดย่อ และรายงานวิจัยฉบับเขียน', 'https://drive.google.com/file/d/19ilU1KeB4BlrRhBI7QM0--ieTO6MJWAW/view?usp=drive_link')} className="flex items-center justify-between p-4 md:p-5 rounded-2xl hover:bg-blue-50 cursor-pointer transition-all border border-transparent hover:border-blue-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-[#1e3a8a] flex items-center justify-center group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="text-xl md:text-2xl text-slate-700 font-light group-hover:font-medium transition-all">{t('knowledge_clip_u8_3') || '8.3 การเตรียม E-Poster, บทคัดย่อ และรายงานวิจัยฉบับเขียน'}</span>
                    </div>
                  </div>
                  <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                    <span className="text-base font-semibold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">{t('handbook')}: {t('unit')} 9</span>
                  </div>
                </div>
              </AccordionItem>

            </div>
          </div>
        </section>

        {/* ================= SECTION C: EAR Handbook ================= */}
        <section className="pt-30">
          
          <div className="mb-12 md:mb-16 flex flex-col items-center text-center max-w-5xl mx-auto">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
              {t('knowledge_handbook_title') || 'คู่มือ EAR Handbook'}
            </h2>
            <p className="text-2xl md:text-3xl text-slate-500 mt-6 font-light tracking-wide leading-relaxed">
              (A Handbook for Exploratory Action Research)
            </p>
          </div>

          <div className="max-w-6xl mx-auto bg-white border border-slate-200 rounded-[2.5rem] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col p-8 md:p-14 lg:p-16">
            
            {/* ส่วนบน: ข้อความอธิบายภาพรวม */}
            <div className="text-center pb-10 mb-10 border-b border-slate-100">
              <h3 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-6 leading-tight">
                {t('knowledge_handbook_heading') || 'คู่มือการทำ Exploratory Action Research (EAR)'}
              </h3>
              <p className="text-xl md:text-2xl text-slate-700 font-light leading-relaxed max-w-4xl mx-auto">
                {t('knowledge_handbook_desc_1') || 'การอบรมและการทำวิจัย EAR ในเครือข่ายอ้างอิงจาก '}
                <em className="font-medium text-[#1e3a8a] italic">
                  {t('knowledge_handbook_name') || 'A Handbook for Exploratory Action Research'}
                </em>
                <span className='font-medium'>{t('knowledge_handbook_desc_1_1')}</span> {t('and')} <span className='font-medium'>{t('knowledge_handbook_desc_1_2')}</span>
                {t('knowledge_handbook_desc_2') || 'สมาชิกและคุณครูที่สนใจสามารถใช้คู่มือเล่มนี้เพื่อฝึกปฏิบัติจริง หรือใช้เป็นเครื่องมือทบทวนความรู้ด้วยตนเองได้ตลอดเวลา'}
              </p>
            </div>

            {/* ส่วนล่าง: แบ่ง 2 คอลัมน์ (ไทย / อังกฤษ) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 lg:gap-16">
              
              {/* คอลัมน์ซ้าย: ฉบับภาษาไทย */}
              <div className="flex flex-col items-center text-center bg-slate-50/50 p-6 md:p-8 rounded-3xl border border-slate-100">
                <h4 className="text-2xl md:text-3xl font-bold text-[#1e3a8a] mb-8">
                  {t('knowledge_handbook_th_version') || 'ฉบับภาษาไทย'}
                </h4>
                
                {/* Placeholder Image */}
                <div className="w-full max-w-[240px] aspect-[3/4] bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center mb-6 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-slate-300 mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                  </svg>
                  <span className="text-slate-400 font-medium text-xl">
                    {t('knowledge_handbook_coming_soon') || 'Coming Soon'}
                  </span>
                </div>
                
                <p className="text-lg md:text-xl text-slate-500 italic mb-8 min-h-[60px] flex items-center justify-center text-center">
                  <span>
                    {t('knowledge_handbook_th_desc_1') || 'คู่มือทำวิจัย EAR ฉบับภาษาไทย อยู่ระหว่าง'}
                    <br />
                    {t('knowledge_handbook_th_desc_2') || 'การแปลและจัดทำ เตรียมพบกันเร็วๆ นี้'}
                  </span>
                </p>
                
                <button disabled className="inline-flex justify-center items-center w-full max-w-[240px] gap-2 bg-slate-200 text-slate-400 px-6 py-4 rounded-xl font-bold text-xl cursor-not-allowed">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                  {t('knowledge_handbook_btn_read') || 'คลิกเพื่ออ่าน'}
                </button>
              </div>

              {/* คอลัมน์ขวา: ฉบับภาษาอังกฤษ */}
              <div className="flex flex-col items-center text-center bg-blue-50/30 p-6 md:p-8 rounded-3xl border border-blue-50">
                <h4 className="text-2xl md:text-3xl font-bold text-[#1e3a8a] mb-8">
                  {t('knowledge_handbook_en_version') || 'ฉบับภาษาอังกฤษ'}
                </h4>
                
                <a 
                  href="https://www.teachingenglish.org.uk/sites/teacheng/files/pub_30510_BC%20Explore%20Actions%20Handbook%20ONLINE%20AW.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block relative w-full max-w-[240px] transition-transform duration-500 hover:scale-105 mb-6"
                >
                  <img 
                    src="Ear_learning_clips/Handbook.JPG" 
                    alt="EAR Handbook Cover" 
                    className="w-full h-auto aspect-[3/4] object-cover rounded-xl shadow-lg border border-slate-200"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  {/* Fallback ถ้าโหลดรูปไม่ขึ้น */}
                  <div className="hidden w-full aspect-[3/4] bg-[#008dbb] rounded-xl shadow-lg border border-slate-200 flex flex-col items-center justify-center p-6 text-white text-center">
                    <div className="w-16 h-16 mb-4 opacity-50">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                      </svg>
                    </div>
                    <span className="font-bold text-xl">
                      {t('knowledge_handbook_fallback') || 'A Handbook for EAR'}
                    </span>
                  </div>
                </a>
                
                <p className="text-lg md:text-xl text-slate-500 mb-8 min-h-[60px] flex items-center justify-center text-center">
                  {t('knowledge_handbook_en_desc') || '(A Handbook for Exploratory Action Research)'}
                </p>
                
                <a 
                  href="https://www.teachingenglish.org.uk/sites/teacheng/files/pub_30510_BC%20Explore%20Actions%20Handbook%20ONLINE%20AW.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex justify-center items-center w-full max-w-[240px] gap-3 bg-[#1e3a8a] text-white px-6 py-4 rounded-xl font-bold text-xl shadow-md hover:bg-blue-800 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                  {t('knowledge_handbook_btn_read') || 'คลิกเพื่ออ่าน'}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="pt-30 mt-12">
          {/* --- 3. FAQ --- */}
            <div className="flex flex-col items-start py-12 md:py-16 border-t-4 border-slate-300 relative z-10 bg-[#F8FAFC]">
              <div className="mb-12 mt-16 flex flex-col items-center text-center max-w-5xl mx-auto">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
                  {t('knowledge_part3_title') || 'คำถามที่พบบ่อย (FAQ)'}
                </h2>
                <p className="text-lg md:text-xl text-slate-500 mt-6 font-light tracking-wide leading-relaxed max-w-3xl">
                  {t('knowledge_faq_intro') || 'เรารวบรวมข้อสงสัยจริงจากประสบการณ์ของครูผู้ทำวิจัย โดยแบ่งออกตามขั้นตอนการทำงาน เพื่อให้คุณค้นหาคำตอบได้สะดวกรวดเร็วที่สุด'}
                </p>
              </div>

              <div className="w-full max-w-5xl mx-auto">
                {/* 💡 ระบบ Tabs ของ FAQ */}
                <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-16">
                  <button 
                    onClick={() => setOpenCol3s([])} // ใช้ state เดิมในการเก็บ Tab ที่กำลัง Active
                    className={`px-6 py-3 rounded-full font-bold text-lg transition-all ${openCol3s.length === 0 ? 'bg-[#1e3a8a] text-white shadow-md' : 'bg-white text-slate-500 hover:bg-blue-50 border border-slate-200'}`}
                  >
                    {t('faq_tab_all') || 'ทั้งหมด (All)'}
                  </button>
                  <button 
                    onClick={() => setOpenCol3s(['general'])} 
                    className={`px-6 py-3 rounded-full font-bold text-lg transition-all ${openCol3s.includes('general') ? 'bg-[#1e3a8a] text-white shadow-md' : 'bg-white text-slate-500 hover:bg-blue-50 border border-slate-200'}`}
                  >
                    {t('faq_tab_general') || 'ทั่วไป'}
                  </button>
                  <button 
                    onClick={() => setOpenCol3s(['explore'])} 
                    className={`px-6 py-3 rounded-full font-bold text-lg transition-all ${openCol3s.includes('explore') ? 'bg-[#1e3a8a] text-white shadow-md' : 'bg-white text-slate-500 hover:bg-blue-50 border border-slate-200'}`}
                  >
                    {t('faq_tab_explore') || 'ขั้นสำรวจ (Explore)'}
                  </button>
                  <button 
                    onClick={() => setOpenCol3s(['action'])} 
                    className={`px-6 py-3 rounded-full font-bold text-lg transition-all ${openCol3s.includes('action') ? 'bg-[#1e3a8a] text-white shadow-md' : 'bg-white text-slate-500 hover:bg-blue-50 border border-slate-200'}`}
                  >
                    {t('faq_tab_action') || 'ขั้นวางแผนแก้ปัญหา (Action)'}
                  </button>
                  <button 
                    onClick={() => setOpenCol3s(['sharing'])} 
                    className={`px-6 py-3 rounded-full font-bold text-lg transition-all ${openCol3s.includes('sharing') ? 'bg-[#1e3a8a] text-white shadow-md' : 'bg-white text-slate-500 hover:bg-blue-50 border border-slate-200'}`}
                  >
                    {t('faq_tab_sharing') || 'การเผยแพร่ผลงาน'}
                  </button>
                </div>

                {/* 💡 เนื้อหา FAQ ตามหมวดหมู่ */}
                <div className="space-y-4">
                  
                  {/* หมวดทั่วไป */}
                  {(openCol3s.length === 0 || openCol3s.includes('general')) && (
                    <div className="space-y-4 py-3">
                      <div className="flex items-center gap-4 mb-4 mt-8 px-2">
                         <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#1e3a8a]">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                         </div>
                         <h3 className="text-2xl font-bold text-[#1e3a8a]">{t('faq_tab_general') || 'หมวดคำถามทั่วไป'}</h3>
                      </div>
                      
                      <AccordionItem title={t('faq_gen_q1') || 'ไม่มีเวลาทำวิจัยเลย จะแบ่งเวลามาทำ EAR ได้อย่างไร?'} isOpen={openClipSections.includes('faq.g.1')} onClick={() => toggleClipSection('faq.g.1')}>
                        <div className="text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                          <strong className="font-bold text-[#1e3a8a] block mb-3">{t('answer') || 'คำตอบ:'}</strong>
                          {t('faq_gen_a1') || 'EAR คือการ "วิจัยไปพร้อมกับการสอน" (Teaching as Research) เครื่องมือเก็บข้อมูลคือสิ่งที่คุณทำอยู่แล้วในชีวิตประจำวัน เช่น การตรวจงาน การคุยกับเด็ก หรือการสังเกตพฤติกรรม จึงไม่ต้องแบ่งเวลาเพิ่มเพื่อทำวิจัยต่างหาก'}
                        </div>
                      </AccordionItem>
                      <AccordionItem title={t('faq_gen_q2') || 'วิจัย EAR ต่างจากการทำวิจัยในชั้นเรียน (CAR) แบบทั่วไปอย่างไร?'} isOpen={openClipSections.includes('faq.g.2')} onClick={() => toggleClipSection('faq.g.2')}>
                        <div className="text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                          <strong className="font-bold text-[#1e3a8a] block mb-3">{t('answer') || 'คำตอบ:'}</strong>
                          {t('faq_gen_a2') || 'EAR เน้นกระบวนการทำสะท้อนคิด (Reflection) ที่ยืดหยุ่น ทำงานเป็นวงรอบ (Cycles) และเน้นความเข้าใจบริบทเชิงลึก ไม่ได้มุ่งเน้นการทำเอกสารรูปเล่มที่ซับซ้อนหรือการใช้สถิติขั้นสูง'}
                        </div>
                      </AccordionItem>
                      <AccordionItem title={t('faq_gen_q3') || 'หากไม่มีพื้นฐานด้านการทำวิจัยมาก่อน สามารถทำ EAR ได้ไหม?'} isOpen={openClipSections.includes('faq.g.3')} onClick={() => toggleClipSection('faq.g.3')}>
                        <div className="text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                          <strong className="font-bold text-[#1e3a8a] block mb-3">{t('answer') || 'คำตอบ:'}</strong>
                          {t('faq_gen_a3') || 'ทำได้แน่นอนครับ EAR ออกแบบมาให้ครูทุกคนเข้าถึงได้ง่าย เริ่มต้นจากการตั้งคำถามกับห้องเรียนของตนเอง และใช้วิธีเก็บข้อมูลพื้นฐานที่ครูคุ้นเคยอยู่แล้ว'}
                        </div>
                      </AccordionItem>
                      <AccordionItem title={t('faq_gen_q4') || 'การทำ EAR ต้องใช้เวลานานแค่ไหนถึงจะเห็นผล?'} isOpen={openClipSections.includes('faq.g.4')} onClick={() => toggleClipSection('faq.g.4')}>
                        <div className="text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                          <strong className="font-bold text-[#1e3a8a] block mb-3">{t('answer') || 'คำตอบ:'}</strong>
                          {t('faq_gen_a4') || 'ขึ้นอยู่กับขนาดของปัญหาที่คุณครูเลือกครับ บางวงรอบ (Cycle) อาจใช้เวลาเพียง 1–2 สัปดาห์ในการทดลองปรับเทคนิคเล็กๆ ในคาบเรียน หรืออาจทำต่อเนื่องตลอด 1 ภาคการศึกษา'}
                        </div>
                      </AccordionItem>
                      <AccordionItem title={t('faq_gen_q5') || 'ถ้าสอนหลายห้อง/หลายรายวิชา ควรเลือกทำ EAR กับห้องไหนก่อนดี?'} isOpen={openClipSections.includes('faq.g.5')} onClick={() => toggleClipSection('faq.g.5')}>
                        <div className="text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                          <strong className="font-bold text-[#1e3a8a] block mb-3">{t('answer') || 'คำตอบ:'}</strong>
                          {t('faq_gen_a5') || 'แนะนำให้เริ่มจากห้องเรียนหรือกลุ่มนักเรียนที่คุณครูรู้สึกว่า "อยากแก้ไขปัญหามากที่สุด" หรือเป็นห้องที่เราสามารถทดลองปรับเปลี่ยนวิธีการสอนได้สะดวกที่สุดก่อนครับ'}
                        </div>
                      </AccordionItem>
                    </div>
                  )}

                  {/* หมวด Explore */}
                  {(openCol3s.length === 0 || openCol3s.includes('explore')) && (
                    <div className="space-y-4 py-3">
                      <div className="flex items-center gap-4 mb-4 mt-12 px-2">
                         <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#1e3a8a]">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                         </div>
                         <h3 className="text-2xl font-bold text-[#1e3a8a]">{t('faq_tab_explore') || 'หมวดคำถามขั้นสำรวจ (Exploratory Stage)'}</h3>
                      </div>

                      <AccordionItem title={t('faq_exp_q1') || 'มีปัญหาในห้องเรียนเยอะมาก จะเลือกปัญหาไหนมาทำ EAR ก่อนดี?'} isOpen={openClipSections.includes('faq.e.1')} onClick={() => toggleClipSection('faq.e.1')}>
                        <div className="text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                          <strong className="font-bold text-[#1e3a8a] block mb-3">{t('answer') || 'คำตอบ:'}</strong>
                          {t('faq_exp_a1_1') || 'ใช้หลัก MUSE ในการคัดเลือก โดยประเมินว่าปัญหาไหนมีความ เร่งด่วน สำคัญ และเป็นสิ่งที่ครู สามารถจัดการได้จริง (Manageable) ในขอบเขตของห้องเรียนตนเอง'}
                        </div>
                      </AccordionItem>
                      <AccordionItem title={t('faq_exp_q2') || 'หากทำรอบที่ 1 แล้วพบว่าปัญหาเกิดจากตัวเด็กเอง เช่น เด็กเกเร ไม่ยอมเรียน จะทำอย่างไรต่อ?'} isOpen={openClipSections.includes('faq.e.2')} onClick={() => toggleClipSection('faq.e.2')}>
                        <div className="text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                          <strong className="font-bold text-[#1e3a8a] block mb-3">{t('answer') || 'คำตอบ:'}</strong>
                          {t('faq_exp_a2') || 'นั่นคือจุดเด่นของ EAR! การสำรวจในรอบแรกจะช่วยให้เราเห็น "เหตุผลเบื้องหลัง" พฤติกรรมนั้น (เช่น เด็กเกเรเพราะอ่านหนังสือไม่ออกจึงอายเพื่อน) ทำให้เราออกแบบ Action ในรอบที่ 2 ได้ตรงจุด ไม่ใช่แค่สั่งบทลงโทษ'}
                        </div>
                      </AccordionItem>
                      <AccordionItem title={t('faq_exp_q3') || 'จะเก็บข้อมูลในขั้นสำรวจอย่างไร โดยไม่ให้กระทบเวลาสอนปกติ?'} isOpen={openClipSections.includes('faq.e.3')} onClick={() => toggleClipSection('faq.e.3')}>
                        <div className="text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                          <strong className="font-bold text-[#1e3a8a] block mb-3">{t('answer') || 'คำตอบ:'}</strong>
                          {t('faq_exp_a3') || 'ใช้ข้อมูลที่มีอยู่แล้วในชั้นเรียน เช่น การจดบันทึกหลังสอนสั้นๆ 2-3 บรรทัด การถ่ายภาพบรรยากาศการทำกิจกรรม หรือการสุ่มพูดคุยกับเด็กๆ หลังเลิกเรียน'}
                        </div>
                      </AccordionItem>
                      <AccordionItem title={t('faq_exp_q4') || 'จะรู้ได้อย่างไรว่าปัญหาที่เราคิดเอง ไม่ใช่แค่ "การคาดเดา" ของครูฝ่ายเดียว?'} isOpen={openClipSections.includes('faq.e.4')} onClick={() => toggleClipSection('faq.e.4')}>
                        <div className="text-xl md:text-2xl text-slate-800 font-light leading-relaxed space-y-4">
                          <strong className="font-bold text-[#1e3a8a] block mb-3">{t('answer') || 'คำตอบ:'}</strong>
                          <p>{t('faq_exp_a4_intro') || 'คุณครูต้องมี "หลักฐานเชิงประจักษ์ (evidence)" ในห้องเรียนมาช่วยยืนยัน โดยลองจับคู่ความรู้สึกของครูกับสิ่งที่เกิดขึ้นจริง ผ่าน 3 แหล่งข้อมูลหลัก ดังนี้'}</p>
                          <ul className="space-y-4 pl-4 border-l-[3px] border-[#1e3a8a]">
                            <li>
                              <strong className="font-bold text-[#1e3a8a]">1. {t('faq_exp_a4_p1_t') || 'เสียงสะท้อนและพฤติกรรมของเด็ก:'}</strong>
                              <br/>- {t('faq_exp_a4_p1_1') || 'กรณีไม่มีแรงจูงใจ: ได้ยินเด็กบ่นว่า "ไม่อยากเรียนเลย ไม่สนุก" หรือแสดงพฤติกรรมฟุบหลับ นั่งก้มหน้า ไม่สบตาเวลาถาม'}
                              <br/>- {t('faq_exp_a4_p1_2') || 'กรณีปัญหาทักษะเขียน: เด็กไม่ยอมมีส่วนร่วมในกิจกรรม (Non-participation) หลีกเลี่ยงการลงมือทำ หรือนั่งนิ่งเมื่อถึงเวลาต้องเขียน'}
                            </li>
                            <li>
                              <strong className="font-bold text-[#1e3a8a]">2. {t('faq_exp_a4_p2_t') || 'ภาระงานและการส่งงาน:'}</strong>
                              <br/>{t('faq_exp_a4_p2_1') || 'มีการส่งงานช้า ไม่ยอมส่งการบ้าน การเขียนได้เพียงไม่กี่คำ หรือเว้นหน้ากระดาษว่างเปล่า'}
                            </li>
                            <li>
                              <strong className="font-bold text-[#1e3a8a]">3. {t('faq_exp_a4_p3_t') || 'ชิ้นงานและผลการประเมิน:'}</strong>
                              <br/>{t('faq_exp_a4_p3_1') || 'คะแนนแบบทดสอบสั้นๆ (Exit Ticket) หรือคะแนนการประเมินทักษะการเขียนต่ำกว่าเกณฑ์อย่างเห็นได้ชัด'}
                            </li>
                          </ul>
                          <p className="bg-blue-50 p-4 rounded-xl text-[#1e3a8a] italic">
                            {t('faq_exp_a4_outro') || 'เมื่อนำความรู้สึกของครูไปจับคู่กับ คำพูด พฤติกรรม การส่งงาน และคะแนนจริง จะช่วยยืนยันได้อย่างมั่นใจว่าปัญหานั้นมีอยู่จริง ไม่ใช่แค่การคาดเดา'}
                          </p>
                        </div>
                      </AccordionItem>
                      <AccordionItem title={t('faq_exp_q5') || 'ถ้าลองสำรวจแล้ว แต่ยังหา "สาเหตุที่แท้จริง" ของปัญหาไม่เจอ ต้องทำอย่างไร?'} isOpen={openClipSections.includes('faq.e.5')} onClick={() => toggleClipSection('faq.e.5')}>
                        <div className="text-xl md:text-2xl text-slate-800 font-light leading-relaxed space-y-4">
                          <strong className="font-bold text-[#1e3a8a] block mb-3">{t('answer') || 'คำตอบ:'}</strong>
                          <p>{t('faq_exp_a5_intro') || 'เกิดจากเรา "รีบหาทางแก้เร็วเกินไป" จนมองข้ามบริบทจริงในห้องเรียนในขั้นสำรวจ ให้ครูถอยกลับมาตั้งคำถามกับ พฤติกรรมและความคิดเห็น ของทั้งตัวครูและนักเรียนก่อน:'}</p>
                          <ul className="space-y-4 pl-4">
                            <li>
                              <strong className="font-bold text-[#1e3a8a]">&bull; {t('faq_exp_a5_p1_t') || 'พฤติกรรมและการกระทำที่สังเกตได้ (Behavior):'}</strong>
                              <br/> <span className="font-medium text-[#1e3a8a]">{t('faq_exp_a5_p1_1t') || 'ฝั่งครู:'}</span> {t('faq_exp_a5_p1_1d') || 'เราสอนอย่างไร ตรวจการบ้าน ให้ข้อมูลย้อนกลับ หรือตอบสนองคำถามของเด็กแบบไหน'}
                              <br/> <span className="font-medium text-[#1e3a8a]">{t('faq_exp_a5_p1_2t') || 'ฝั่งนักเรียน:'}</span> {t('faq_exp_a5_p1_2d') || 'เด็กแสดงพฤติกรรม การพูด การเขียน การยกมือตอบ หรือหลีกเลี่ยงการมีส่วนร่วมอย่างไร'}
                            </li>
                            <li>
                              <strong className="font-bold text-[#1e3a8a]">&bull; {t('faq_exp_a5_p2_t') || 'ความคิดเห็น มุมมอง และความรู้สึก (Perception & Attitude):'}</strong>
                              <br/> <span className="font-medium text-[#1e3a8a]">{t('faq_exp_a5_p2_1t') || 'ฝั่งครู:'}</span> {t('faq_exp_a5_p2_1d') || 'ครูประเมินบรรยากาศในคาบนั้นอย่างไร รู้สึกว่าจุดไหนที่การสอนติดขัดหรือราบรื่น'}
                              <br/> <span className="font-medium text-[#1e3a8a]">{t('faq_exp_a5_p2_2t') || 'ฝั่งนักเรียน:'}</span> {t('faq_exp_a5_p2_2d') || 'เด็ก รู้สึก อย่างไรกับบทเรียน (เช่น มองว่ายากเกินไป รู้สึกกลัวตอบผิด หรืออายเพื่อน)'}
                            </li>
                          </ul>
                        </div>
                      </AccordionItem>
                    </div>
                  )}

                  {/* หมวด Action */}
                  {(openCol3s.length === 0 || openCol3s.includes('action')) && (
                    <div className="space-y-4 py-3">
                      <div className="flex items-center gap-4 mb-4 mt-12 px-2">
                         <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.829 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.487 1.509 1.333 1.509 2.316V18" /></svg>
                         </div>
                         <h3 className="text-2xl font-bold text-emerald-700">{t('faq_tab_action') || 'หมวดขั้นวางแผนและดำเนินการแก้ไข (Action Stage)'}</h3>
                      </div>

                      <AccordionItem title={t('faq_act_q1') || 'จะเลือกวิธีแก้ปัญหา (Action) อย่างไรให้ตรงจุด และไม่สร้างภาระงานเพิ่ม?'} isOpen={openClipSections.includes('faq.a.1')} onClick={() => toggleClipSection('faq.a.1')}>
                        <div className="text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                          <strong className="font-bold text-[#1e3a8a] block mb-3">{t('answer') || 'คำตอบ:'}</strong>
                          {t('faq_act_a1') || 'เน้นวิธีที่ ทำได้จริงทันที (Manageable) และ เกิดประโยชน์ชัดเจน (Useful) เช่น การปรับเทคนิคการถาม-ตอบ การใช้กิจกรรมเพื่อนช่วยเพื่อน โดยไม่ต้องสร้างนวัตกรรมราคาแพงหรือซับซ้อน'}
                        </div>
                      </AccordionItem>
                      <AccordionItem title={t('faq_act_q2') || 'ถ้าลองใช้วิธีแก้ปัญหาแล้ว แต่เด็กยังไม่เปลี่ยนพฤติกรรมหรือไม่เห็นผล ต้องทำอย่างไร?'} isOpen={openClipSections.includes('faq.a.2')} onClick={() => toggleClipSection('faq.a.2')}>
                        <div className="text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                          <strong className="font-bold text-[#1e3a8a] block mb-3">{t('answer') || 'คำตอบ:'}</strong>
                          {t('faq_act_a2') || 'ถือเป็นเรื่องปกติของ EAR! EAR ไม่ได้วัดที่ถูกหรือผิด แต่วัดที่การเรียนรู้ คุณครูสามารถนำข้อมูลจากการสังเกตมาปรับแผน (Reflect & Adjust) เพื่อทดลองใช้วิธีใหม่ในวงรอบถัดไป (Cycle 2) ได้ทันที'}
                        </div>
                      </AccordionItem>
                      <AccordionItem title={t('faq_act_q3') || 'จะรู้ได้อย่างไรว่า Action ที่เราลงมือทำไปนั้นประสบความสำเร็จ?'} isOpen={openClipSections.includes('faq.a.3')} onClick={() => toggleClipSection('faq.a.3')}>
                        <div className="text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                          <strong className="font-bold text-[#1e3a8a] block mb-3">{t('answer') || 'คำตอบ:'}</strong>
                          {t('faq_act_a3') || 'สังเกตจากการเปลี่ยนแปลงพฤติกรรมและความเข้าใจของเด็กในห้องเรียนจริง โดยบันทึกผ่านภาพถ่าย ชิ้นงาน หรือรอยยิ้มและการมีส่วนร่วมของเด็กๆ ในคาบเรียน'}
                        </div>
                      </AccordionItem>
                      <AccordionItem title={t('faq_act_q4') || 'สามารถปรับเปลี่ยนแผนการสอนระหว่างที่กำลังทำ Action อยู่ได้ไหม?'} isOpen={openClipSections.includes('faq.a.4')} onClick={() => toggleClipSection('faq.a.4')}>
                        <div className="text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                          <strong className="font-bold text-[#1e3a8a] block mb-3">{t('answer') || 'คำตอบ:'}</strong>
                          {t('faq_act_a4') || 'ทำได้ทันทีครับ EAR มีความยืดหยุ่นสูง หากพบว่าวิธีที่วางไว้ไม่เหมาะกับสถานการณ์จริงในวันนั้น คุณครูสามารถปรับเปลี่ยนแผนหน้างานได้เลย แล้วบันทึกเหตุผลไว้'}
                        </div>
                      </AccordionItem>
                      <AccordionItem title={t('faq_act_q5') || 'จำเป็นต้องทำ Action หลายๆ วงรอบ (Multiple Cycles) เสมอไปไหม?'} isOpen={openClipSections.includes('faq.a.5')} onClick={() => toggleClipSection('faq.a.5')}>
                        <div className="text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                          <strong className="font-bold text-[#1e3a8a] block mb-3">{t('answer') || 'คำตอบ:'}</strong>
                          {t('faq_act_a5') || 'ไม่จำเป็นครับ หาก Action ในวงรอบแรก (Cycle 1) สามารถแก้ปัญหาและบรรลุเป้าหมายที่ตั้งไว้ได้น่าพึงพอใจแล้ว คุณครูสามารถสรุปผลและส่งต่อบทเรียนนั้นได้เลย'}
                        </div>
                      </AccordionItem>
                    </div>
                  )}

                  {/* หมวด Sharing */}
                  {(openCol3s.length === 0 || openCol3s.includes('sharing')) && (
                    <div className="space-y-4 py-3">
                      <div className="flex items-center gap-4 mb-4 mt-12 px-2">
                         <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>
                         </div>
                         <h3 className="text-2xl font-bold text-yellow-600">{t('faq_tab_sharing') || 'หมวดการเผยแพร่และแบ่งปันผลงาน'}</h3>
                      </div>

                      <AccordionItem title={t('faq_sha_q1') || 'ทำ EAR แล้วต้องเขียนรายงานเล่มหนา 5 บทหรือไม่?'} isOpen={openClipSections.includes('faq.s.1')} onClick={() => toggleClipSection('faq.s.1')}>
                        <div className="text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                          <strong className="font-bold text-[#1e3a8a] block mb-3">{t('answer') || 'คำตอบ:'}</strong>
                          {t('faq_sha_a1') || 'ไม่จำเป็น! EAR ให้ความสำคัญกับ "กระบวนการและการเปลี่ยนแปลงในห้องเรียน" ผลลัพธ์สามารถนำเสนอผ่าน Poster, Slide หรือบทสนทนาแลกเปลี่ยน (Oral Presentation) ได้ โดยไม่สร้างภาระงานเอกสารให้ครู'}
                        </div>
                      </AccordionItem>
                      <AccordionItem title={t('faq_sha_q2') || 'ผลงาน EAR ที่ดี ต้องมีรูปแบบหน้าตาหรือโครงสร้างอย่างไร?'} isOpen={openClipSections.includes('faq.s.2')} onClick={() => toggleClipSection('faq.s.2')}>
                        <div className="text-xl md:text-2xl text-slate-800 font-light leading-relaxed space-y-4">
                          <strong className="font-bold text-[#1e3a8a] block mb-3">{t('answer') || 'คำตอบ:'}</strong>
                          <p>{t('faq_sha_a2_intro') || 'ไม่มีรูปแบบตายตัวครับ! ผลงาน EAR ที่ดีวัดจาก "ความชัดเจนของเรื่องเล่าและการเปลี่ยนแปลงในห้องเรียน" โดยโครงสร้างหลักมีเพียง 3 ส่วนง่ายๆ คือ:'}</p>
                          <ul className="space-y-3 pl-4 border-l-[3px] border-[#1e3a8a]">
                            <li><strong className="font-bold text-[#1e3a8a]">&bull; {t('faq_sha_a2_p1_t') || 'บริบทและปัญหา:'}</strong> {t('faq_sha_a2_p1_d') || 'ห้องเรียนเกิดอะไรขึ้น และเราเห็นหลักฐานอะไร'}</li>
                            <li><strong className="font-bold text-[#1e3a8a]">&bull; {t('faq_sha_a2_p2_t') || 'สิ่งที่ได้ลงมือทำ:'}</strong> {t('faq_sha_a2_p2_d') || 'เราเลือกวิธีแก้ปัญหา (Action) อะไร และทำอย่างไร'}</li>
                            <li><strong className="font-bold text-[#1e3a8a]">&bull; {t('faq_sha_a2_p3_t') || 'ผลลัพธ์บทเรียนที่ได้:'}</strong> {t('faq_sha_a2_p3_d') || 'เด็กเปลี่ยนไปอย่างไร และครูได้เรียนรู้อะไรจากกระบวนการนี้'}</li>
                          </ul>
                        </div>
                      </AccordionItem>
                      <AccordionItem title={t('faq_sha_q3') || 'หากผลการทำ EAR ไม่เป็นไปตามเป้าหมายที่ตั้งไว้ ยังนำมาเผยแพร่หรือแบ่งปันได้ไหม?'} isOpen={openClipSections.includes('faq.s.3')} onClick={() => toggleClipSection('faq.s.3')}>
                        <div className="text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                          <strong className="font-bold text-[#1e3a8a] block mb-3">{t('answer') || 'คำตอบ:'}</strong>
                          {t('faq_sha_a3') || 'นำมาเผยแพร่ได้ และมีคุณค่ามาก! EAR ไม่ได้มองหาแค่เรื่องราวความสำเร็จ (Success Story) แต่ให้ความสำคัญกับ "กระบวนการเรียนรู้ของครู" การนำเสนอวิธีที่ไม่ได้ผลพร้อมเหตุผลวิเคราะห์ จะช่วยให้เพื่อนครูคนอื่นได้เรียนรู้และไม่ต้องลองผิดลองถูกซ้ำ ถือเป็นการแบ่งปันบทเรียน (Lessons Learned) ที่มีประโยชน์อย่างยิ่ง'}
                        </div>
                      </AccordionItem>
                      <AccordionItem title={t('faq_sha_q4') || 'นอกจากการเขียนเล่มรายงาน เราสามารถเผยแพร่ผลงาน EAR ผ่านช่องทางไหนได้อีกบ้าง?'} isOpen={openClipSections.includes('faq.s.4')} onClick={() => toggleClipSection('faq.s.4')}>
                        <div className="text-xl md:text-2xl text-slate-800 font-light leading-relaxed space-y-4">
                          <strong className="font-bold text-[#1e3a8a] block mb-3">{t('answer') || 'คำตอบ:'}</strong>
                          <p>{t('faq_sha_a4_intro') || 'ทำได้หลากหลายช่องทางตามที่คุณครูถนัดเลย เช่น:'}</p>
                          <ul className="space-y-3 pl-4 border-l-[3px] border-[#1e3a8a]">
                            <li><strong className="font-bold text-[#1e3a8a]">&bull; {t('faq_sha_a4_p1_t') || 'สื่ออินโฟกราฟิก / โปสเตอร์ (Poster):'}</strong> {t('faq_sha_a4_p1_d') || 'สรุปภาพรวมและผลลัพธ์สั้นๆ ลงใน 1 หน้า'}</li>
                            <li><strong className="font-bold text-[#1e3a8a]">&bull; {t('faq_sha_a4_p2_t') || 'คลิปวิดีโอสั้น / สไลด์นำเสนอ:'}</strong> {t('faq_sha_a4_p2_d') || 'ถ่ายทอดบรรยากาศในห้องเรียนและการเปลี่ยนแปลงของเด็ก'}</li>
                            <li><strong className="font-bold text-[#1e3a8a]">&bull; {t('faq_sha_a4_p3_t') || 'วงสนทนาแลกเปลี่ยน (PLC & Oral):'}</strong> {t('faq_sha_a4_p3_d') || 'นำเรื่องเล่าไปพูดคุย เล่าสู่กันฟังในกลุ่มเพื่อนครู หรือจัดเป็นบทความสั้นลงบล็อก/โซเชียลมีเดียของโรงเรียน'}</li>
                          </ul>
                        </div>
                      </AccordionItem>
                    </div>
                  )}

                </div>

                {/* 💡 ส่วนท้าย: ส่งคำถามถึงทีมงาน */}
                <div className="mt-16 text-center border-t border-slate-200 pt-10">
                  <p className="text-2xl md:text-3xl text-[#1e3a8a] mb-6 font-bold mt-4 mb-1">
                    {t('faq_contact_intro') || 'ยังไม่พบคำตอบที่คุณกำลังมองหาอยู่ใช่ไหม?'}
                    <br className="hidden md:block" />
                    <span className="font-light text-xl md:text-2xl">{t('faq_contact_sub') || 'ถามคำถามเพิ่ม หรือส่งข้อสงสัยเกี่ยวกับการทำวิจัย EAR ได้ที่นี่'}</span>
                  </p>
                  <a 
                    href="mailto:tren@kmutt.ac.th" // 💡 เปลี่ยนลิงก์ปลายทางเป็น Email หรือ Form ตามต้องการได้ที่นี่
                    className="inline-flex items-center gap-3 bg-[#1e3a8a] text-white px-8 py-4 rounded-full font-bold text-xl shadow-md hover:bg-blue-800 hover:-translate-y-1 transition-all duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                    {t('faq_contact_btn') || 'ส่งคำถามถึงทีมงาน'}
                  </a>
                </div>

              </div>
            </div>     
        </section>

        {/* ================= SECTION D: Global Network ================= */}
        <section className="pt-24 pb-16">
          <div className="mb-12 flex flex-col items-center text-center max-w-5xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
              {t('knowledge_global_title') || 'แหล่งเรียนรู้และเครือข่ายสากล'}
            </h2>
            <p className="text-lg md:text-xl text-slate-500 mt-4 font-light tracking-wide">
              (Global EAR Resources & Networks)
            </p>
            <p className="text-xl md:text-2xl text-slate-700 mt-6 font-medium leading-relaxed max-w-3xl">
              {t('knowledge_global_desc') || '"เชื่อมโยงการเรียนรู้สู่นวัตกรรมการสอนระดับสากล" รวบรวมคลังความรู้ เครื่องมือ และเครือข่ายงานวิจัยครูจากองค์กรและผู้เชี่ยวชาญระดับโลก เพื่อการศึกษาค้นคว้าเพิ่มเติมและต่อยอดการทำวิจัยในชั้นเรียน'}
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
            
            {/* กล่องที่ 1: Prof. Richard Smith */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#1e3a8a] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-[#1e3a8a] mb-4">
                {t('global_net1_title') || 'Prof. Richard Smith & EAR Resources'}
              </h3>
              <p className="text-slate-500 font-medium mb-6">
                (University of Warwick)
              </p>
              
              <div className="space-y-4 mb-8 flex-grow">
                <div>
                  <strong className="text-slate-800 block mb-1">{t('global_net_detail_label') || 'รายละเอียด:'}</strong>
                  <p className="text-slate-600 font-light leading-relaxed">
                    {t('global_net1_detail') || 'คลังข้อมูลและเอกสารคู่มือการทำวิจัยปฏิบัติการเชิงสำรวจ (Exploratory Action Research: EAR) โดย Prof. Richard Smith ผู้บุกเบิกและพัฒนากระบวนการ EAR สำหรับครูผู้สอนภาษาและนักการศึกษาร่วมกับ British Council'}
                  </p>
                </div>
                <div>
                  <strong className="text-emerald-700 block mb-1">{t('global_net_learn_label') || 'สิ่งที่จะได้เรียนรู้:'}</strong>
                  <p className="text-slate-600 font-light leading-relaxed">
                    {t('global_net1_learn') || 'คู่มือ EAR ฉบับสมบูรณ์, ตัวอย่างเคสงานวิจัยครูจากทั่วโลก และบทความวิชาการต้นฉบับ'}
                  </p>
                </div>
              </div>

              <a 
                href="#" // 💡 ใส่ลิงก์เว็บ Prof. Richard Smith ตรงนี้
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-between w-full bg-slate-50 hover:bg-[#1e3a8a] text-[#1e3a8a] hover:text-white px-6 py-4 rounded-xl font-bold transition-colors border border-slate-200 hover:border-transparent group/btn"
              >
                <span>{t('global_net1_btn') || 'เข้าสู่เว็บไซต์ Prof. Richard Smith'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
              </a>
            </div>

            {/* กล่องที่ 2: MentorNet */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-[#1e3a8a] mb-4">
                {t('global_net2_title') || 'MentorNet'}
              </h3>
              <p className="text-slate-500 font-medium mb-6">
                (International Mentoring Network for Teacher Research)
              </p>
              
              <div className="space-y-4 mb-8 flex-grow">
                <div>
                  <strong className="text-slate-800 block mb-1">{t('global_net_detail_label') || 'รายละเอียด:'}</strong>
                  <p className="text-slate-600 font-light leading-relaxed">
                    {t('global_net2_detail') || 'เครือข่ายสากลที่มุ่งเน้นการพัฒนาศักยภาพครูพี่เลี้ยง (Mentors) และการสร้างระบบสนับสนุนครูผู้ทำวิจัยในชั้นเรียน'}
                  </p>
                </div>
                <div>
                  <strong className="text-emerald-700 block mb-1">{t('global_net_learn_label') || 'สิ่งที่จะได้เรียนรู้:'}</strong>
                  <p className="text-slate-600 font-light leading-relaxed">
                    {t('global_net2_learn') || 'แนวปฏิบัติที่ดี (Best Practices) ในการทำ Mentoring, เครื่องมือการตั้งคำถามเชิงสะท้อนคิด (Reflective Questions) และเครือข่ายความร่วมมือระดับนานาชาติ'}
                  </p>
                </div>
              </div>

              <a 
                href="#" // 💡 ใส่ลิงก์เว็บ MentorNet ตรงนี้
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-between w-full bg-slate-50 hover:bg-[#1e3a8a] text-[#1e3a8a] hover:text-white px-6 py-4 rounded-xl font-bold transition-colors border border-slate-200 hover:border-transparent group/btn"
              >
                <span>{t('global_net2_btn') || 'เข้าสู่เว็บไซต์ MentorNet'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
              </a>
            </div>

          </div>
        </section>

      </div>

      {/* ================= Video Modal (Pop-up) ================= */}
      {videoModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/80 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl transform transition-all flex flex-col">
            <div className="flex items-center justify-between px-6 md:px-8 py-4 md:py-6 border-b border-slate-100 shrink-0">
              <h3 className="text-2xl md:text-3xl font-bold text-[#1e3a8a] truncate pr-4">{videoModal.videoTitle}</h3>
              <button onClick={closeVideo} className="text-slate-400 hover:text-red-500 transition-colors bg-slate-50 hover:bg-red-50 p-2 rounded-full shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            {/* พื้นที่สำหรับ Iframe Video */}
            <div className="aspect-video bg-slate-900 w-full relative overflow-hidden">
              {videoModal.videoUrl && videoModal.videoUrl !== '#' ? (
                <iframe 
                  src={getEmbedUrl(videoModal.videoUrl)} 
                  className="absolute inset-0 w-full h-full border-0" 
                  allow="autoplay; encrypted-media" 
                  allowFullScreen
                  title={videoModal.videoTitle}
                ></iframe>
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <p className="text-slate-400 text-lg md:text-xl font-light text-center px-4">
                    {t('knowledge_clip_placeholder') || 'พื้นที่สำหรับเล่นวิดีโอ (รอเพิ่มลิงก์ Google Drive)'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Knowledge;