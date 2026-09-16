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
        className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[2500px] opacity-100' : 'max-h-0 opacity-0'}`}
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
  
  // State สำหรับควบคุมการเปิด/ปิด Accordion Section A
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [openCol2, setOpenCol2] = useState<string | null>(null);
  const [openCol3, setOpenCol3] = useState<string | null>(null);

  // State สำหรับควบคุมการเปิด/ปิด Accordion Section B (Clips)
  const [openClipSection, setOpenClipSection] = useState<string | null>(null);

  const toggleSection = (id: string) => setOpenSection(openSection === id ? null : id);
  const toggleCol2 = (id: string) => setOpenCol2(openCol2 === id ? null : id);
  const toggleCol3 = (id: string) => setOpenCol3(openCol3 === id ? null : id);
  const toggleClipSection = (id: string) => setOpenClipSection(openClipSection === id ? null : id);

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
    // ตรวจสอบว่าเป็นลิงก์ Google Drive หรือไม่ และแปลง /view เป็น /preview
    if (url.includes('drive.google.com')) {
      return url.replace(/\/view.*$/, '/preview');
    }
    return url;
  };

  return (
    <div className="w-full bg-[#F8FAFC] font-sans selection:bg-blue-200 min-h-screen">
      <div className="max-w-[85rem] mx-auto px-6 lg:px-8 pt-16 md:pt-24 pb-24">
        
        {/* ================= SECTION A: EAR Basic Knowledge (ห้ามเปลี่ยน) ================= */}
        <section className="mb-24">
          
          <div className="mb-16 md:mb-20 flex flex-col items-center text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
              {t('knowledge_part1_title') || 'คลังความรู้ EAR'}
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 mt-6 font-light tracking-wide leading-relaxed">
              (EAR Knowledge Hub)
            </p>
          </div>

          <div className="space-y-0">
            
            {/* --- 1. ทำความรู้จัก EAR --- */}
            <div className="flex flex-col items-start py-12 md:py-16 border-t border-slate-300">
              <div className="w-full mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] tracking-tight mb-3">
                  <span>1. </span>{t('knowledge_part1_title') || '1. ทำความรู้จัก EAR'}
                </h2>
                <p className="text-slate-500 font-light leading-relaxed text-xl md:text-2xl">
                  {t('knowledge_part1_subtitle') || 'สำรวจห้องเรียน ขับเคลื่อนการเรียนรู้ด้วยตัวคุณเอง'}
                </p>
                <div className="w-12 h-[3px] bg-[#1e3a8a] mt-6"></div>
              </div>

              <div className="w-full">
                
                <AccordionItem title={t('knowledge_why_ear_title_main') || 'ทำไมต้อง EAR?'} isOpen={openSection === '1.1'} onClick={() => toggleSection('1.1')}>
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

                <AccordionItem title={t('knowledge_what_ear_title_main') || 'EAR คืออะไร?'} isOpen={openSection === '1.2'} onClick={() => toggleSection('1.2')}>
                  <div className="my-6 space-y-6 text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                    <p><strong className="font-bold text-[#1e3a8a]">Exploratory Action Research (EAR)</strong> {t('knowledge_what_ear_desc_1') || 'คือ การวิจัยปฏิบัติการเชิงสำรวจ ที่เน้นการ "สำรวจให้ลึกซึ้งก่อนลงมือแก้ปัญหา" เปลี่ยนครูผู้สอน สู่ "ครูวิจัยหน้างาน" (Teacher-Researcher)'}</p>
                    <div className="border-l-[4px] border-[#1e3a8a] pl-6 py-4 italic text-[#1e3a8a] font-medium bg-blue-50/50 pr-6 rounded-r-2xl text-xl md:text-2xl">
                      {t('knowledge_what_ear_quote') || '"คุณครูจะมีพลังและความมั่นใจมากขึ้น เพราะสามารถตัดสินใจเกี่ยวกับการจัดการเรียนรู้ได้อย่างมีข้อมูลรองรับ บนพื้นฐานของสิ่งที่คุณครูได้ค้นพบและพิสูจน์ด้วยตนเอง"'}
                    </div>
                  </div>
                </AccordionItem>

                <AccordionItem title={t('knowledge_how_ear_title_main') || 'EAR เปลี่ยนห้องเรียนได้อย่างไร?'} isOpen={openSection === '1.3'} onClick={() => toggleSection('1.3')}>
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
                </AccordionItem>

                <AccordionItem title={t('knowledge_why_matters_title') || 'ทำไมครูต้องทำ EAR?'} isOpen={openSection === '1.4'} onClick={() => toggleSection('1.4')}>
                  <div className="my-6 space-y-8 text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                    <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100">
                      <h4 className="font-bold text-[#1e3a8a] mb-2">{t('knowledge_matter1_title') || '1. ด้านผู้เรียนและห้องเรียน'}</h4>
                      <p className="text-slate-500 italic mb-6">{t('knowledge_matter1_badge') || 'แก้ปัญหาได้ตรงจุดทันที ไม่เดาสุ่ม'}</p>
                      <ul className="space-y-4 pl-2">
                        <li className="flex items-start gap-4"><span className="text-[#1e3a8a] mt-1">&bull;</span> {t('knowledge_m1_point1_desc') || 'มองเห็นสัญญาณหน้างานผ่านข้อมูลจริง'}</li>
                        <li className="flex items-start gap-4"><span className="text-[#1e3a8a] mt-1">&bull;</span> {t('knowledge_m1_point2_desc') || 'แก้ปัญหาทันท่วงที ไม่ต้องรอจบเทอม'}</li>
                      </ul>
                    </div>
                    <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100">
                      <h4 className="font-bold text-[#1e3a8a] mb-2">{t('knowledge_matter2_title') || '2. ด้านการพัฒนาวิชาชีพ'}</h4>
                      <p className="text-slate-500 italic mb-6">{t('knowledge_matter2_badge') || 'สร้างนวัตกรรมจริง ก้าวสู่ครูผู้เชี่ยวชาญ'}</p>
                      <ul className="space-y-4 pl-2">
                        <li className="flex items-start gap-4"><span className="text-[#1e3a8a] mt-1">&bull;</span> {t('knowledge_m2_point1_desc') || 'ออกแบบนวัตกรรมการสอนที่เข้ากับบริบท'}</li>
                        <li className="flex items-start gap-4"><span className="text-[#1e3a8a] mt-1">&bull;</span> {t('knowledge_m2_point2_desc') || 'เติบโตสู่ Teacher-Researcher พึ่งพาตนเองได้'}</li>
                      </ul>
                    </div>
                    <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100">
                      <h4 className="font-bold text-[#1e3a8a] mb-2">{t('knowledge_matter3_title') || '3. ด้านชุมชนและการแบ่งปัน'}</h4>
                      <p className="text-slate-500 italic mb-6">{t('knowledge_matter3_badge') || 'ไม่โดดเดี่ยว สู่การเป็นครูพี่เลี้ยง'}</p>
                      <ul className="space-y-4 pl-2">
                        <li className="flex items-start gap-4"><span className="text-[#1e3a8a] mt-1">&bull;</span> {t('knowledge_m3_point1_desc') || 'เกิดชุมชนแลกเปลี่ยนเรียนรู้ (CoP)'}</li>
                      </ul>
                    </div>
                  </div>
                </AccordionItem>

                <AccordionItem title={t('knowledge_myth_title_main') || 'ปลดล็อกความเชื่อเดิมๆ'} isOpen={openSection === '1.5'} onClick={() => toggleSection('1.5')}>
                  <div className="my-6 space-y-8 text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                    <div className="space-y-6">
                      <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center gap-6">
                        <p className="flex items-center gap-4 text-slate-400 line-through md:w-1/2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-red-400 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                          {t('knowledge_myth_old_1') || 'ต้องแจกแบบสอบถามเป็นร้อยชุด'}
                        </p>
                        <p className="flex items-center gap-4 font-medium text-[#1e3a8a] md:w-1/2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-emerald-500 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                          {t('knowledge_myth_new_1') || 'ใช้การสังเกตและคุยกับเด็กหน้างาน'}
                        </p>
                      </div>
                      <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center gap-6">
                        <p className="flex items-center gap-4 text-slate-400 line-through md:w-1/2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-red-400 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                          {t('knowledge_myth_old_2') || 'ต้องวิเคราะห์สถิติซับซ้อน (SPSS)'}
                        </p>
                        <p className="flex items-center gap-4 font-medium text-[#1e3a8a] md:w-1/2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-emerald-500 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                          {t('knowledge_myth_new_2') || 'เน้นทำความเข้าใจข้อมูลเชิงคุณภาพง่ายๆ'}
                        </p>
                      </div>
                      <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center gap-6">
                        <p className="flex items-center gap-4 text-slate-400 line-through md:w-1/2">
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
            <div className="flex flex-col items-start py-12 md:py-16 border-t border-slate-300">
              <div className="w-full mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] tracking-tight mb-3">
                  <span>2. </span>{t('knowledge_part2_title') || '2. หลักการ EAR'}
                </h2>
                <p className="text-slate-500 font-light text-xl md:text-2xl">
                  {t('knowledge_part2_subtitle') || 'และความแตกต่างจากวิจัยอื่น'}
                </p>
                <div className="w-12 h-[3px] bg-[#1e3a8a] mt-6"></div>
              </div>

              <div className="w-full">
                <AccordionItem title={t('knowledge_ear_stages_title') || '2 stages of EAR (2 ขั้นตอนของ EAR)'} isOpen={openCol2 === '2.1'} onClick={() => toggleCol2('2.1')}>
                  <div className="my-6 space-y-10 text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 flex flex-col h-full relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-bl-full opacity-50"></div>
                        <h4 className="font-bold text-[#1e3a8a] mb-2 z-10">{t('knowledge_ear_stage1_title')}</h4>
                        <p className="text-slate-500 italic mb-6 z-10">{t('knowledge_ear_stage1_subtitle')}</p>
                        <p className="text-lg md:text-xl text-slate-600 mb-4 z-10">{t('knowledge_ear_stage1_desc')}</p>
                        <ul className="space-y-4 pl-2 text-lg md:text-xl z-10">
                          <li className="flex items-start gap-3"><strong className="text-[#1e3a8a] shrink-0">1. Reflect:</strong> {t('knowledge_ear_s1_p1')}</li>
                          <li className="flex items-start gap-3"><strong className="text-[#1e3a8a] shrink-0">2. Plan:</strong> {t('knowledge_ear_s1_p2')}</li>
                          <li className="flex items-start gap-3"><strong className="text-[#1e3a8a] shrink-0">3. Observe:</strong> {t('knowledge_ear_s1_p3')}</li>
                          <li className="flex items-start gap-3"><strong className="text-[#1e3a8a] shrink-0">4. Reflect:</strong> {t('knowledge_ear_s1_p4')}</li>
                        </ul>
                      </div>
                      <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 flex flex-col h-full relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 rounded-bl-full opacity-50"></div>
                        <h4 className="font-bold text-emerald-700 mb-2 z-10">{t('knowledge_ear_stage2_title')}</h4>
                        <p className="text-emerald-600/70 italic mb-6 z-10">{t('knowledge_ear_stage2_subtitle')}</p>
                        <p className="text-lg md:text-xl text-slate-600 mb-4 z-10">{t('knowledge_ear_stage2_desc')}</p>
                        <ul className="space-y-4 pl-2 text-lg md:text-xl z-10">
                          <li className="flex items-start gap-3"><strong className="text-emerald-600 shrink-0">5. Plan:</strong> {t('knowledge_ear_s2_p5')}</li>
                          <li className="flex items-start gap-3"><strong className="text-emerald-600 shrink-0">6. Act:</strong> {t('knowledge_ear_s2_p6')}</li>
                          <li className="flex items-start gap-3"><strong className="text-emerald-600 shrink-0">7. Observe:</strong> {t('knowledge_ear_s2_p7')}</li>
                          <li className="flex items-start gap-3"><strong className="text-emerald-600 shrink-0">8. Reflect:</strong> {t('knowledge_ear_s2_p8')}</li>
                          <li className="flex items-start gap-3"><strong className="text-emerald-600 shrink-0">9. Re-plan:</strong> {t('knowledge_ear_s2_p9')}</li>
                        </ul>
                      </div>
                    </div>
                    <div className="pt-10 border-t border-slate-200">
                      <h4 className="font-bold text-[#1e3a8a] text-2xl md:text-3xl mb-8 flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.829 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.487 1.509 1.333 1.509 2.316V18" /></svg>
                        {t('knowledge_ear_example_title')}
                      </h4>
                      <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#1e3a8a] text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow z-10 text-sm">1</div>
                          <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-blue-50/50 p-4 rounded-xl shadow-sm ml-4 md:ml-0 text-lg md:text-xl">
                            <strong className="text-[#1e3a8a] block mb-1">Reflect:</strong> {t('knowledge_ear_ex_1')}
                          </div>
                        </div>
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#1e3a8a] text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow z-10 text-sm">2</div>
                          <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-blue-50/50 p-4 rounded-xl shadow-sm ml-4 md:ml-0 text-lg md:text-xl">
                            <strong className="text-[#1e3a8a] block mb-1">Plan:</strong> {t('knowledge_ear_ex_2')}
                          </div>
                        </div>
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#1e3a8a] text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow z-10 text-sm">3</div>
                          <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-blue-50/50 p-4 rounded-xl shadow-sm ml-4 md:ml-0 text-lg md:text-xl">
                            <strong className="text-[#1e3a8a] block mb-1">Observe:</strong> {t('knowledge_ear_ex_3')}
                          </div>
                        </div>
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#1e3a8a] text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow z-10 text-sm">4</div>
                          <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-[#1e3a8a] text-white p-4 rounded-xl shadow-sm ml-4 md:ml-0 text-lg md:text-xl">
                            <strong className="text-white block mb-1">Reflect:</strong> {t('knowledge_ear_ex_4')}
                          </div>
                        </div>
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-emerald-500 text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow z-10 text-sm">5</div>
                          <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-emerald-50/50 p-4 rounded-xl shadow-sm ml-4 md:ml-0 text-lg md:text-xl">
                            <strong className="text-emerald-700 block mb-1">Plan:</strong> {t('knowledge_ear_ex_5')}
                          </div>
                        </div>
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-emerald-500 text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow z-10 text-sm">6</div>
                          <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-emerald-50/50 p-4 rounded-xl shadow-sm ml-4 md:ml-0 text-lg md:text-xl">
                            <strong className="text-emerald-700 block mb-1">Act:</strong> {t('knowledge_ear_ex_6')}
                          </div>
                        </div>
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-emerald-500 text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow z-10 text-sm">7</div>
                          <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-emerald-50/50 p-4 rounded-xl shadow-sm ml-4 md:ml-0 text-lg md:text-xl">
                            <strong className="text-emerald-700 block mb-1">Observe:</strong> {t('knowledge_ear_ex_7')}
                          </div>
                        </div>
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-emerald-500 text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow z-10 text-sm">8</div>
                          <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-emerald-600 text-white p-4 rounded-xl shadow-sm ml-4 md:ml-0 text-lg md:text-xl">
                            <strong className="text-emerald-50 block mb-1">Reflect:</strong> {t('knowledge_ear_ex_8')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionItem>

                <AccordionItem title={t('knowledge_ear_key_title_main') || 'Key of EAR (หัวใจสำคัญของการทำวิจัย EAR)'} isOpen={openCol2 === '2.2'} onClick={() => toggleCol2('2.2')}>
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

                <AccordionItem title={t('knowledge_ear_diff_title') || 'How EAR is different from other research (ไขข้อสงสัย: EAR ต่างจากการวิจัยอื่นอย่างไร)'} isOpen={openCol2 === '2.3'} onClick={() => toggleCol2('2.3')}>
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

                <AccordionItem title={t('knowledge_ear_getting_started_title') || 'จุดเริ่มต้นสำหรับครูมือใหม่ (Getting Started)'} isOpen={openCol2 === '2.4'} onClick={() => toggleCol2('2.4')}>
                  <div className="my-6 space-y-6 text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                    <p className="font-medium text-[#1e3a8a] mb-6 bg-blue-50/50 p-4 rounded-xl border-l-[4px] border-[#1e3a8a] inline-block">
                      {t('knowledge_ear_getting_started_subtitle')}
                    </p>
                    <ul className="space-y-6 pl-2">
                      <li className="flex items-start gap-4">
                        <span className="text-[#1e3a8a] mt-1">&bull;</span>
                        <div><strong className="font-bold text-[#1e3a8a]">{t('knowledge_ear_start_1_title')}</strong> {' '}{t('knowledge_ear_start_1_desc')}</div>
                      </li>
                      <li className="flex items-start gap-4">
                        <span className="text-[#1e3a8a] mt-1">&bull;</span>
                        <div><strong className="font-bold text-[#1e3a8a]">{t('knowledge_ear_start_2_title')}</strong> {' '}{t('knowledge_ear_start_2_desc')}</div>
                      </li>
                      <li className="flex items-start gap-4">
                        <span className="text-[#1e3a8a] mt-1">&bull;</span>
                        <div><strong className="font-bold text-[#1e3a8a]">{t('knowledge_ear_start_3_title')}</strong> {' '}{t('knowledge_ear_start_3_desc')}</div>
                      </li>
                    </ul>
                  </div>
                </AccordionItem>

              </div>
            </div>

            {/* --- 3. FAQ --- */}
            <div className="flex flex-col items-start py-12 md:py-16 border-t border-slate-300">
              <div className="w-full mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] tracking-tight mb-3">
                  <span>3. </span>{t('knowledge_part3_title') || '3. คำถามที่พบบ่อย'}
                </h2>
                <p className="text-slate-500 font-light text-xl md:text-2xl">
                  (FAQ)
                </p>
                <div className="w-12 h-[3px] bg-[#1e3a8a] mt-6"></div>
              </div>

              <div className="w-full">
                <AccordionItem title={t('knowledge_faq_1_q') || 'ทำ EAR แล้วต้องเขียนรายงานเล่มหนา 5 บทหรือไม่?'} isOpen={openCol3 === '3.1'} onClick={() => toggleCol3('3.1')}>
                  <div className="text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                    <strong className="font-bold text-[#1e3a8a] block mb-3">{t('answer')}</strong>
                    {t('knowledge_faq_1_a') || 'ไม่จำเป็น! EAR ให้ความสำคัญกับ "กระบวนการและการเปลี่ยนแปลงในห้องเรียน" ผลลัพธ์สามารถนำเสนอผ่าน Poster, Slide หรือบทสนทนาแลกเปลี่ยน (Oral Presentation) ได้ โดยไม่สร้างภาระงานเอกสารให้ครู'}
                  </div>
                </AccordionItem>

                <AccordionItem title={t('knowledge_faq_2_q') || 'พบว่าปัญหาเกิดจากตัวเด็กเอง จะทำอย่างไรต่อ?'} isOpen={openCol3 === '3.2'} onClick={() => toggleCol3('3.2')}>
                  <div className="text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                    <strong className="font-bold text-[#1e3a8a] block mb-3">{t('answer')}</strong>
                    {t('knowledge_faq_2_a') || 'นั่นคือจุดเด่นของ EAR! การสำรวจในรอบแรกจะช่วยให้เราเห็น "เหตุผลเบื้องหลัง" พฤติกรรมนั้น ทำให้เราออกแบบ Action ในรอบที่ 2 ได้ตรงจุด ไม่ใช่แค่สั่งบทลงโทษ'}
                  </div>
                </AccordionItem>

                <AccordionItem title={t('knowledge_faq_3_q') || 'ไม่มีเวลาทำวิจัยเลย จะแบ่งเวลามาทำ EAR ได้อย่างไร?'} isOpen={openCol3 === '3.3'} onClick={() => toggleCol3('3.3')}>
                  <div className="text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
                    <strong className="font-bold text-[#1e3a8a] block mb-3">{t('answer')}</strong>
                    {t('knowledge_faq_3_a') || 'EAR คือการ "วิจัยไปพร้อมกับการสอน" (Teaching as Research) เครื่องมือเก็บข้อมูลคือสิ่งที่คุณทำอยู่แล้วในชีวิตประจำวัน เช่น การตรวจงาน การคุยกับเด็ก จึงไม่ต้องแบ่งเวลาเพิ่มเพื่อทำวิจัยต่างหาก'}
                  </div>
                </AccordionItem>
              </div>
            </div>

          </div>
        </section>

        {/* ================= SECTION B: EAR Learning Clips (วิดีโอ Modal + Accordion Rows) ================= */}
        <section className="pt-30 border-t border-slate-300">
          
          <div className="mb-16 md:mb-20 flex flex-col items-center text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
              {t('knowledge_clip_title') || 'คลังคลิปเรียนรู้ EAR'}
            </h2>
            <p className="text-xl md:text-2xl text-slate-500 mt-6 font-light tracking-wide leading-relaxed">
              (EAR Learning Clips)
            </p>
          </div>

          <div className="flex flex-col items-start py-12 md:py-16 border-t border-slate-300">
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
              <AccordionItem title={t('knowledge_clip_u1_title') || '1. แนะนำ EAR (Introducing EAR)'} isOpen={openClipSection === 'clip.1'} onClick={() => toggleClipSection('clip.1')}>
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
                    <span className="text-base font-semibold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">Handbook: Unit 1, 2 and 3</span>
                    {/* <a href="https://drive.google.com/drive/folders/1XzhTjvq091PDTOkt4LOmCKhnOatwLMZG" target="_blank" rel="noopener noreferrer" className="text-[#1e3a8a] text-base font-bold hover:underline flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl transition-colors hover:bg-blue-100">
                      Drive <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                    </a> */}
                  </div>
                </div>
              </AccordionItem>

              {/* Unit 2 */}
              <AccordionItem title={t('knowledge_clip_u2_title') || '2. การระบุปัญหาในชั้นเรียน (Identifying problems)'} isOpen={openClipSection === 'clip.2'} onClick={() => toggleClipSection('clip.2')}>
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
                    <span className="text-base font-semibold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">Handbook: Unit 4</span>
                    {/* <a href="https://drive.google.com/drive/folders/1_OGScuP-cVUkcqQ8jpri9nVLYZH1xLf" target="_blank" rel="noopener noreferrer" className="text-[#1e3a8a] text-base font-bold hover:underline flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl transition-colors hover:bg-blue-100">
                      Drive <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                    </a> */}
                  </div>
                </div>
              </AccordionItem>

              {/* Unit 3 */}
              <AccordionItem title={t('knowledge_clip_u3_title') || '3. การตั้งคำถามวิจัย (Asking E-RQ)'} isOpen={openClipSection === 'clip.3'} onClick={() => toggleClipSection('clip.3')}>
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
                    <span className="text-base font-semibold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">Handbook: Unit 4</span>
                    {/* <a href="https://drive.google.com/drive/folders/14ZTfOY_v4tpfxjkDDfbKeMZi6oVZuxm9" target="_blank" rel="noopener noreferrer" className="text-[#1e3a8a] text-base font-bold hover:underline flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl transition-colors hover:bg-blue-100">
                      Drive <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                    </a> */}
                  </div>
                </div>
              </AccordionItem>

              {/* Unit 4 */}
              <AccordionItem title={t('knowledge_clip_u4_title') || '4. การเก็บรวบรวมข้อมูล (Data collection)'} isOpen={openClipSection === 'clip.4'} onClick={() => toggleClipSection('clip.4')}>
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
                    <span className="text-base font-semibold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">Handbook: Unit 5</span>
                    {/* <a href="https://drive.google.com/drive/folders/1YDZLAMD9JVO-Jp89N9SfBQ-TFGAubn6K" target="_blank" rel="noopener noreferrer" className="text-[#1e3a8a] text-base font-bold hover:underline flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl transition-colors hover:bg-blue-100">
                      Drive <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                    </a> */}
                  </div>
                </div>
              </AccordionItem>

              {/* Unit 5 */}
              <AccordionItem title={t('knowledge_clip_u5_title') || '5. เครื่องมือเก็บรวบรวมข้อมูล (Tools for data collection)'} isOpen={openClipSection === 'clip.5'} onClick={() => toggleClipSection('clip.5')}>
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
                    <span className="text-base font-semibold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">Handbook: Unit 5</span>
                    {/* <a href="https://drive.google.com/drive/folders/18_RpjAGqXNTdV2NAk8_5tVw2wA6EltfR" target="_blank" rel="noopener noreferrer" className="text-[#1e3a8a] text-base font-bold hover:underline flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl transition-colors hover:bg-blue-100">
                      Drive <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                    </a> */}
                  </div>
                </div>
              </AccordionItem>

              {/* Unit 6 */}
              <AccordionItem title={t('knowledge_clip_u6_title') || '6. การวิเคราะห์และการตีความข้อมูล (Data analysis)'} isOpen={openClipSection === 'clip.6'} onClick={() => toggleClipSection('clip.6')}>
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
                    <span className="text-base font-semibold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">Handbook: Unit 6 & 8</span>
                    {/* <a href="https://drive.google.com/drive/folders/150-003u9wzfbuck-3_NNcYrwD476VcKm" target="_blank" rel="noopener noreferrer" className="text-[#1e3a8a] text-base font-bold hover:underline flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl transition-colors hover:bg-blue-100">
                      Drive <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                    </a> */}
                  </div>
                </div>
              </AccordionItem>

              {/* Unit 7 */}
              <AccordionItem title={t('knowledge_clip_u7_title') || '7. การจัดทำแผนปฏิบัติการ (Action Plan)'} isOpen={openClipSection === 'clip.7'} onClick={() => toggleClipSection('clip.7')}>
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
                    <span className="text-base font-semibold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">Handbook: Unit 7</span>
                    {/* <a href="https://drive.google.com/drive/folders/18NPDPZJ_rfvn_vNz7D3ZzD3DAp9v10g" target="_blank" rel="noopener noreferrer" className="text-[#1e3a8a] text-base font-bold hover:underline flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl transition-colors hover:bg-blue-100">
                      Drive <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                    </a> */}
                  </div>
                </div>
              </AccordionItem>

              {/* Unit 8 */}
              <AccordionItem title={t('knowledge_clip_u8_title') || '8. การเผยแพร่และแบ่งปันผลงาน (Sharing results)'} isOpen={openClipSection === 'clip.8'} onClick={() => toggleClipSection('clip.8')}>
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
                    <span className="text-base font-semibold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">Handbook: Unit 9</span>
                    {/* <a href="https://drive.google.com/drive/folders/11TNOXWllavcNF3NNfOmc3ECrOSoVq9Fc" target="_blank" rel="noopener noreferrer" className="text-[#1e3a8a] text-base font-bold hover:underline flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl transition-colors hover:bg-blue-100">
                      Drive <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                    </a> */}
                  </div>
                </div>
              </AccordionItem>

            </div>
          </div>
        </section>

        {/* ================= SECTION C: EAR Handbook ================= */}
        <section className="pt-30 border-t border-slate-300">
          
          <div className="mb-16 md:mb-20 flex flex-col items-center text-center max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
              {t('knowledge_handbook_title') || 'คู่มือ EAR Handbook'}
            </h2>
            <p className="text-2xl md:text-3xl text-slate-500 mt-6 font-light tracking-wide leading-relaxed">
              (A Handbook for Exploratory Action Research)
            </p>
          </div>

          <div className="max-w-6xl mx-auto bg-white border border-slate-200 rounded-[2.5rem] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col md:flex-row group">
            
            {/* ซ้าย: ข้อความและปุ่ม */}
            <div className="p-8 md:p-14 lg:p-16 md:w-3/5 flex flex-col justify-center bg-slate-50/50 relative overflow-hidden">
              
              <h3 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-6 md:mb-8 leading-tight z-10">
                {t('knowledge_handbook_heading') || 'A Handbook for Exploratory Action Research'}
              </h3>
              
              <p className="text-xl md:text-2xl text-slate-700 font-light leading-relaxed z-10">
                {t('knowledge_handbook_desc_1') || 'EAR training and research follow '}
                <em className="font-medium text-[#1e3a8a] italic">
                  {t('knowledge_handbook_name') || 'A Handbook for Exploratory Action Research'}
                </em>
                {t('knowledge_handbook_desc_2') || ' by Prof. Dr. Richard Smith and Dr. Paula Rebolledo. Members and interested teachers are welcome to use this handbook for hands-on practice or as a self-paced review tool anytime.'}
              </p>
              
              <div className="mt-10 md:mt-12 z-10">
                <a 
                  href="https://www.teachingenglish.org.uk/sites/teacheng/files/pub_30510_BC%20Explore%20Actions%20Handbook%20ONLINE%20AW.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-3 bg-[#1e3a8a] text-white px-8 py-4 rounded-2xl font-bold text-lg md:text-xl shadow-md hover:bg-blue-800 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                  {t('knowledge_handbook_btn') || 'Click to read Handbook (PDF)'}
                </a>
              </div>
            </div>

            {/* ขวา: หน้าปกหนังสือ */}
            <div className="md:w-2/5 bg-blue-50/40 p-8 md:p-12 flex items-center justify-center border-t md:border-t-0 md:border-l border-slate-100 relative">
              <a 
                href="https://www.teachingenglish.org.uk/sites/teacheng/files/pub_30510_BC%20Explore%20Actions%20Handbook%20ONLINE%20AW.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block relative w-full max-w-[280px] lg:max-w-xs transition-transform duration-500 hover:scale-105"
              >
                {/* หากมีรูปภาพหน้าปกจริง ให้เปลี่ยน src เป็น path ของรูปครับ */}
                <img 
                  src="public/Ear_learning_clips/Handbook.JPG" 
                  alt="EAR Handbook Cover" 
                  className="w-full h-auto object-cover rounded-xl shadow-lg border border-slate-200"
                  onError={(e) => {
                    // Fallback เมื่อโหลดรูปไม่ขึ้น
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                
                {/* Placeholder กรณียังไม่มีรูปหน้าปก หรือโหลดรูปไม่ขึ้น */}
                <div className="hidden w-full aspect-[3/4] bg-[#008dbb] rounded-xl shadow-lg border border-slate-200 flex flex-col items-center justify-center p-6 text-white text-center">
                   <div className="w-16 h-16 mb-4 opacity-50">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                     </svg>
                   </div>
                   <span className="font-bold text-xl">A Handbook for Exploratory Action Research</span>
                </div>
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