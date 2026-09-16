/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// --- คอมโพเนนต์ Accordion สำหรับสร้าง Dropdown Menu (Section A) ---
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
    <div className="mb-3 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden transition-all duration-300">
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-between p-4 text-left transition-colors ${isOpen ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
      >
        <span className="font-bold text-[#1e3a8a] text-base md:text-lg pr-4 leading-snug">{title}</span>
        <svg 
          className={`w-5 h-5 text-[#1e3a8a] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div 
        className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[2500px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-5 pt-2 border-t border-slate-100">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- คอมโพเนนต์ Card สำหรับคลิปเรียนรู้ (Section B) ---
const LearningClipCard = ({ 
  number, title, clips, handbook, driveLink 
}: { 
  number: string, title: string, clips: string[], handbook: string, driveLink: string 
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
      {/* 🎬 Video Embed Placeholder */}
      <div className="aspect-video bg-slate-100 flex items-center justify-center relative group cursor-pointer border-b border-slate-200 overflow-hidden">
        {/* ภาพปกวิดีโอจำลอง */}
        <div className="absolute inset-0 bg-slate-800/10 group-hover:bg-slate-800/20 transition-colors z-10"></div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-16 h-16 text-slate-300 absolute z-0">
          <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>

        {/* ปุ่ม Play */}
        <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#1e3a8a] group-hover:scale-110 transition-transform shadow-lg z-20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 ml-1">
            <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* เนื้อหา */}
      <div className="p-6 flex-1 flex flex-col">
        <h4 className="text-[#1e3a8a] font-bold text-lg mb-4 leading-snug">
          {number}. {title}
        </h4>
        <ul className="space-y-3 mb-6 flex-1">
          {clips.map((clip, idx) => (
            <li key={idx} className="text-sm text-slate-700 font-light flex items-start gap-2.5 leading-relaxed">
              <span className="text-[#1e3a8a] mt-0.5 text-lg leading-none">&bull;</span>
              <span>{clip}</span>
            </li>
          ))}
        </ul>
        
        {/* Footer ของ Card (คู่มือ + ลิงก์ Drive) */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 mt-auto">
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-md border border-emerald-100">
            {handbook}
          </span>
          <a href={driveLink} target="_blank" rel="noopener noreferrer" className="text-[#1e3a8a] text-xs font-bold hover:underline flex items-center gap-1 bg-blue-50 px-2.5 py-1.5 rounded-md transition-colors hover:bg-blue-100">
            Drive 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
          </a>
        </div>
      </div>
    </div>
  );
};


const KnowledgeColumn = () => {
  const { t } = useLanguage();
  
  // State สำหรับควบคุมการเปิด/ปิด Accordion แยกตามคอลัมน์
  const [openCol1, setOpenCol1] = useState<string | null>(null);
  const [openCol2, setOpenCol2] = useState<string | null>(null);
  const [openCol3, setOpenCol3] = useState<string | null>(null);

  const toggleCol1 = (id: string) => setOpenCol1(openCol1 === id ? null : id);
  const toggleCol2 = (id: string) => setOpenCol2(openCol2 === id ? null : id);
  const toggleCol3 = (id: string) => setOpenCol3(openCol3 === id ? null : id);

  return (
    <div className="w-full bg-[#F8FAFC] font-sans selection:bg-blue-200 min-h-screen">
      <div className="max-w-[90rem] mx-auto px-6 lg:px-8 pt-16 md:pt-24 pb-24">
        
        {/* ================= SECTION A: EAR Basic Knowledge ================= */}
        <section className="mb-24">
          
          {/* Section Header */}
          <div className="mb-12 flex flex-col items-center text-center max-w-4xl mx-auto">
            <span className="text-[#1e3a8a] font-bold tracking-widest uppercase mb-4 text-sm md:text-base border-b-2 border-blue-200 pb-1">
              Section A
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
              ความรู้พื้นฐาน EAR
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 mt-4 font-light tracking-wide leading-relaxed">
              (EAR Basic Knowledge)
            </p>
          </div>

          {/* 3 Columns Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
            
            {/* --- COLUMN 1: Introduction to EAR --- */}
            <div className="flex flex-col">
              <div className="mb-6 border-b-2 border-slate-200 pb-4">
                <h2 className="text-2xl font-bold text-[#1e3a8a] tracking-tight mb-2">
                  1. ทำความรู้จัก EAR
                </h2>
                <p className="text-slate-500 font-light text-sm">
                  (Introduction to EAR)
                </p>
              </div>

              {/* Dropdown 1.1 */}
              <AccordionItem title="Why EAR? (ทำไมต้อง EAR: เมื่อปัญหาในห้องเรียนไม่มี “ยาวิเศษ” ฉบับสำเร็จรูป)" isOpen={openCol1 === '1.1'} onClick={() => toggleCol1('1.1')}>
                <div className="space-y-4 text-sm text-slate-700 font-light leading-relaxed">
                  <p>ในชีวิตการทำงานจริงของคุณครู ทุกวันคือการรับมือกับความท้าทายที่ไม่เคยเหมือนกัน:</p>
                  <ul className="space-y-2 pl-2">
                    <li className="flex items-start gap-2"><span className="text-[#1e3a8a] mt-0.5">&bull;</span> ทำไมใช้นวัตกรรมใหม่ แต่เด็กๆ ก็ยังนั่งเหม่อ</li>
                    <li className="flex items-start gap-2"><span className="text-[#1e3a8a] mt-0.5">&bull;</span> ทำไมสื่อที่เตรียมมาอย่างดี ถึงใช้ไม่ได้ผลกับห้องนี้</li>
                    <li className="flex items-start gap-2"><span className="text-[#1e3a8a] mt-0.5">&bull;</span> ทำไมเด็กบางคนถึงขาดแรงจูงใจและส่งงานไม่เคยทัน</li>
                  </ul>
                  <p>
                    ที่ผ่านมา เราอาจคุ้นเคยกับนโยบายจากภายนอก... แม้สิ่งเหล่านี้จะมีประโยชน์ แต่สิ่งหนึ่งที่ปฏิเสธไม่ได้คือ 
                    <strong className="font-bold text-[#1e3a8a]"> "บริบทของแต่ละห้องเรียนแตกต่างกันอย่างสิ้นเชิง"</strong>
                  </p>
                  <p className="bg-blue-50 p-3 rounded-lg border-l-4 border-[#1e3a8a] font-medium text-[#1e3a8a]">
                    ทางออกที่ยั่งยืนที่สุด คือ การติดอาวุธให้คุณครูสามารถวิเคราะห์ แก้ปัญหา และตัดสินใจได้ด้วยตนเองจากหน้างานจริง
                  </p>
                </div>
              </AccordionItem>

              {/* Dropdown 1.2 */}
              <AccordionItem title="What is EAR? (EAR คืออะไร)" isOpen={openCol1 === '1.2'} onClick={() => toggleCol1('1.2')}>
                <div className="space-y-4 text-sm text-slate-700 font-light leading-relaxed">
                  <p><strong className="font-bold text-[#1e3a8a]">Exploratory Action Research (EAR)</strong> คือ การวิจัยปฏิบัติการเชิงสำรวจ ที่เน้นการ "สำรวจให้ลึกซึ้งก่อนลงมือแก้ปัญหา" เปลี่ยนครูผู้สอน สู่ "ครูวิจัยหน้างาน" (Teacher-Researcher)</p>
                  <div className="border-l-[3px] border-slate-300 pl-4 py-1 italic text-slate-500">
                    "คุณครูจะมีพลังและความมั่นใจมากขึ้น เพราะสามารถตัดสินใจเกี่ยวกับการจัดการเรียนรู้ได้อย่างมีข้อมูลรองรับ บนพื้นฐานของสิ่งที่คุณครูได้ค้นพบและพิสูจน์ด้วยตนเอง"
                  </div>
                </div>
              </AccordionItem>

              {/* Dropdown 1.3 */}
              <AccordionItem title="How EAR change your classroom (EAR เปลี่ยนห้องเรียนได้อย่างไร)" isOpen={openCol1 === '1.3'} onClick={() => toggleCol1('1.3')}>
                <div className="space-y-4 text-sm text-slate-700 font-light leading-relaxed border-l-2 border-slate-200 ml-2 pl-4 py-2">
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-[#1e3a8a]"></span>
                    <p><strong className="font-bold text-[#1e3a8a]">จุดเริ่มต้น (ติดขัด):</strong> เด็กไม่สนใจวิดีโอภาษาอังกฤษที่ครูเปิดให้ดู และทำงานไม่ทัน</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-[#1e3a8a]"></span>
                    <p><strong className="font-bold text-[#1e3a8a]">การสำรวจ (Exploration):</strong> สอบถามเด็กจนพบว่า ภาษาในวิดีโอยากเกินไป ฟังไม่ทัน</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-[#1e3a8a]"></span>
                    <p><strong className="font-bold text-[#1e3a8a]">การลงมือแก้ปัญหา (Action):</strong> ปรับลดระดับความยากของวิดีโอ และปูพื้นฐานศัพท์ก่อนเรียน</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-emerald-500"></span>
                    <p><strong className="font-bold text-emerald-600">ผลลัพธ์:</strong> เด็กกลับมาตื่นตัว มีส่วนร่วม และทำงานเสร็จทันเวลา</p>
                  </div>
                </div>
              </AccordionItem>

              {/* Dropdown 1.4 */}
              <AccordionItem title="Why teachers need to do EAR? (ทำไมครูต้องทำ EAR)" isOpen={openCol1 === '1.4'} onClick={() => toggleCol1('1.4')}>
                <div className="space-y-4 text-sm text-slate-700 font-light leading-relaxed">
                  <p><strong className="font-bold text-[#1e3a8a]">1. ด้านผู้เรียน:</strong> แก้ปัญหาได้ตรงจุดทันที ไม่เดาสุ่ม (มองเห็นสัญญาณหน้างาน, แก้ปัญหาทันท่วงที, เข้าใจเหตุผลที่ซ่อนอยู่)</p>
                  <p><strong className="font-bold text-[#1e3a8a]">2. ด้านวิชาชีพ:</strong> สร้างนวัตกรรมจริง ก้าวสู่ครูผู้เชี่ยวชาญ (เสริมสร้าง Teacher Agency, เติบโตสู่ Teacher-Researcher)</p>
                  <p><strong className="font-bold text-[#1e3a8a]">3. ด้านชุมชน:</strong> ไม่โดดเดี่ยว สู่การเป็นครูพี่เลี้ยง (สร้าง CoP และส่งต่อแรงบันดาลใจ)</p>
                </div>
              </AccordionItem>

              {/* Dropdown 1.5 */}
              <AccordionItem title="3 things that make EAR different from other research (ปลดล็อคความเชื่อเดิมๆ)" isOpen={openCol1 === '1.5'} onClick={() => toggleCol1('1.5')}>
                <div className="space-y-3 text-sm text-slate-700 font-light leading-relaxed">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="flex items-center gap-2 text-slate-400 line-through mb-1 text-xs"><span className="text-red-400">❌</span> ต้องแจกแบบสอบถามเป็นร้อยชุด</p>
                    <p className="flex items-center gap-2 font-medium text-[#1e3a8a]"><span className="text-emerald-500">✅</span> ใช้การสังเกตและคุยกับเด็กหน้างาน</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="flex items-center gap-2 text-slate-400 line-through mb-1 text-xs"><span className="text-red-400">❌</span> ต้องวิเคราะห์สถิติซับซ้อน (SPSS)</p>
                    <p className="flex items-center gap-2 font-medium text-[#1e3a8a]"><span className="text-emerald-500">✅</span> เน้นทำความเข้าใจข้อมูลเชิงคุณภาพง่ายๆ</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="flex items-center gap-2 text-slate-400 line-through mb-1 text-xs"><span className="text-red-400">❌</span> ต้องเขียนรายงานเล่มหนา 5 บท</p>
                    <p className="flex items-center gap-2 font-medium text-[#1e3a8a]"><span className="text-emerald-500">✅</span> เน้นสรุปผลสั้นๆ สื่อสารผ่าน Poster/Oral</p>
                  </div>
                </div>
              </AccordionItem>
            </div>


            {/* --- COLUMN 2: EAR Principles --- */}
            <div className="flex flex-col">
              <div className="mb-6 border-b-2 border-slate-200 pb-4">
                <h2 className="text-2xl font-bold text-[#1e3a8a] tracking-tight mb-2">
                  2. หลักการ EAR
                </h2>
                <p className="text-slate-500 font-light text-sm">
                  (EAR Principles)
                </p>
              </div>

              <AccordionItem title="2 stages of EAR (2 ขั้นตอนของ EAR)" isOpen={openCol2 === '2.1'} onClick={() => toggleCol2('2.1')}>
                <div className="text-sm text-slate-700 font-light italic">
                  (รายละเอียดเพิ่มเติมกำลังจัดทำ...)
                </div>
              </AccordionItem>

              <AccordionItem title="Key of EAR (หัวใจสำคัญของของการทำวิจัย EAR)" isOpen={openCol2 === '2.2'} onClick={() => toggleCol2('2.2')}>
                <div className="text-sm text-slate-700 font-light italic">
                  (รายละเอียดเพิ่มเติมกำลังจัดทำ...)
                </div>
              </AccordionItem>

              <AccordionItem title="Identifying problems" isOpen={openCol2 === '2.3'} onClick={() => toggleCol2('2.3')}>
                <div className="text-sm text-slate-700 font-light italic">
                  (รายละเอียดเพิ่มเติมกำลังจัดทำ...)
                </div>
              </AccordionItem>

              <AccordionItem title="Exploratory questions" isOpen={openCol2 === '2.4'} onClick={() => toggleCol2('2.4')}>
                <div className="text-sm text-slate-700 font-light italic">
                  (รายละเอียดเพิ่มเติมกำลังจัดทำ...)
                </div>
              </AccordionItem>

              <AccordionItem title="Data collection and data analysis" isOpen={openCol2 === '2.5'} onClick={() => toggleCol2('2.5')}>
                <div className="text-sm text-slate-700 font-light italic">
                  (รายละเอียดเพิ่มเติมกำลังจัดทำ...)
                </div>
              </AccordionItem>

              <AccordionItem title="Action stage" isOpen={openCol2 === '2.6'} onClick={() => toggleCol2('2.6')}>
                <div className="text-sm text-slate-700 font-light italic">
                  (รายละเอียดเพิ่มเติมกำลังจัดทำ...)
                </div>
              </AccordionItem>
            </div>


            {/* --- COLUMN 3: FAQ --- */}
            <div className="flex flex-col">
              <div className="mb-6 border-b-2 border-slate-200 pb-4">
                <h2 className="text-2xl font-bold text-[#1e3a8a] tracking-tight mb-2">
                  3. คำถามที่พบบ่อย
                </h2>
                <p className="text-slate-500 font-light text-sm">
                  (FAQ)
                </p>
              </div>

              <AccordionItem title="ทำ EAR แล้วต้องเขียนรายงานเล่มหนา 5 บทหรือไม่?" isOpen={openCol3 === '3.1'} onClick={() => toggleCol3('3.1')}>
                <div className="text-sm text-slate-700 font-light leading-relaxed">
                  <strong className="font-bold text-[#1e3a8a] block mb-1">Answer:</strong>
                  ไม่จำเป็น! EAR ให้ความสำคัญกับ "กระบวนการและการเปลี่ยนแปลงในห้องเรียน" ผลลัพธ์สามารถนำเสนอผ่าน Poster, Slide หรือบทสนทนาแลกเปลี่ยน (Oral Presentation) ได้ โดยไม่สร้างภาระงานเอกสารให้ครู
                </div>
              </AccordionItem>

              <AccordionItem title="หากทำรอบที่ 1 แล้วพบว่าปัญหาเกิดจากตัวเด็กเอง เช่น เด็กเกเร ไม่ยอมเรียน จะทำอย่างไรต่อ?" isOpen={openCol3 === '3.2'} onClick={() => toggleCol3('3.2')}>
                <div className="text-sm text-slate-700 font-light leading-relaxed">
                  <strong className="font-bold text-[#1e3a8a] block mb-1">Answer:</strong>
                  นั่นคือจุดเด่นของ EAR! การสำรวจในรอบแรกจะช่วยให้เราเห็น "เหตุผลเบื้องหลัง" พฤติกรรมนั้น (เช่น เด็กเกเรเพราะอ่านหนังสือไม่ออกจึงอายเพื่อน) ทำให้เราออกแบบ Action ในรอบที่ 2 ได้ตรงจุด ไม่ใช่แค่สั่งบทลงโทษ
                </div>
              </AccordionItem>

              <AccordionItem title="ไม่มีเวลาทำวิจัยเลย จะแบ่งเวลามาทำ EAR ได้อย่างไร?" isOpen={openCol3 === '3.3'} onClick={() => toggleCol3('3.3')}>
                <div className="text-sm text-slate-700 font-light leading-relaxed">
                  <strong className="font-bold text-[#1e3a8a] block mb-1">Answer:</strong>
                  EAR คือการ "วิจัยไปพร้อมกับการสอน" (Teaching as Research) เครื่องมือเก็บข้อมูลคือสิ่งที่คุณทำอยู่แล้วในชีวิตประจำวัน เช่น การตรวจงาน การคุยกับเด็ก หรือการสังเกตพฤติกรรม จึงไม่ต้องแบ่งเวลาเพิ่มเพื่อทำวิจัยต่างหาก
                </div>
              </AccordionItem>
            </div>

          </div>
        </section>


        {/* ================= SECTION B: EAR Learning Clips ================= */}
        <section className="pt-20 border-t border-slate-300">
          
          {/* Section Header */}
          <div className="mb-12 flex flex-col items-center text-center max-w-4xl mx-auto">
            <span className="text-[#1e3a8a] font-bold tracking-widest uppercase mb-4 text-sm md:text-base border-b-2 border-blue-200 pb-1">
              Section B
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
              คลังคลิปเรียนรู้ EAR
            </h2>
            <p className="text-xl md:text-2xl text-slate-500 mt-4 font-light tracking-wide leading-relaxed">
              (EAR Learning Clips)
            </p>
          </div>

          {/* 8 Grid Modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            <LearningClipCard 
              number="1"
              title="แนะนำ EAR (Introducing EAR)"
              clips={[
                "1.1 วิจัยครูและคุณค่าต่อการพัฒนาการสอน (31 นาที)",
                "1.2 EAR และผลกระทบต่อการจัดการเรียนรู้ (17 นาที)"
              ]}
              handbook="Handbook: Unit 1, 2 and 3"
              driveLink="https://drive.google.com/drive/folders/1XzhTjvq091PDTOkt4LOmCKhnOatwLMZG"
            />

            <LearningClipCard 
              number="2"
              title="การระบุปัญหาในชั้นเรียน (Identifying problems)"
              clips={[
                "การเลือกหัวข้อวิจัยของคุณ (13 นาที)"
              ]}
              handbook="Handbook: Unit 4"
              driveLink="https://drive.google.com/drive/folders/1_OGScuP-cVUkcqQ8jpri9nVLYZH1xLf"
            />

            <LearningClipCard 
              number="3"
              title="การตั้งคำถามวิจัย (Asking E-RQ)"
              clips={[
                "3.1 จากหัวข้อวิจัยสู่การตั้งคำถามวิจัย (11 นาที)",
                "3.2 ตัวอย่างจริงของคำถามวิจัยเชิงสำรวจ (21 นาที)"
              ]}
              handbook="Handbook: Unit 4"
              driveLink="https://drive.google.com/drive/folders/14ZTfOY_v4tpfxjkDDfbKeMZi6oVZuxm9"
            />

            <LearningClipCard 
              number="4"
              title="การเก็บรวบรวมข้อมูล (Data collection)"
              clips={[
                "4.1 เรียนรู้จากตัวอย่างจริง (16 นาที)",
                "4.2 ทำความเข้าใจข้อมูลวิจัย (8 นาที)",
                "4.3 เครื่องมือ วิธีการ และเทคนิคในการเก็บข้อมูล (23 นาที)"
              ]}
              handbook="Handbook: Unit 5"
              driveLink="https://drive.google.com/drive/folders/1YDZLAMD9JVO-Jp89N9SfBQ-TFGAubn6K"
            />

            <LearningClipCard 
              number="5"
              title="เครื่องมือเก็บรวบรวมข้อมูล (Tools for data collection)"
              clips={[
                "5.1 เครื่องมือ: บันทึกสะท้อนคิด การสัมภาษณ์ และสนทนากลุ่ม (22 นาที)",
                "5.2 เครื่องมือ: แบบสอบถาม และการสังเกต (19 นาที)",
                "5.3 ตัวอย่างจริงของการเก็บรวบรวมข้อมูล (13 นาที)"
              ]}
              handbook="Handbook: Unit 5"
              driveLink="https://drive.google.com/drive/folders/18_RpjAGqXNTdV2NAk8_5tVw2wA6EltfR"
            />

            <LearningClipCard 
              number="6"
              title="การวิเคราะห์และการตีความข้อมูล (Data analysis)"
              clips={[
                "6.1 การวิเคราะห์และการตีความข้อมูล (11 นาที)",
                "6.2 การเตรียมและการวิเคราะห์ข้อมูลเชิงคุณภาพ (35 นาที)",
                "6.3 การเตรียมและการวิเคราะห์ข้อมูลเชิงปริมาณ (10 นาที)",
                "6.4 สรุปภาพรวมการวิเคราะห์ข้อมูล (14 นาที)",
                "6.5 ตัวอย่างจริงของการวิเคราะห์ข้อมูล (30 นาที)"
              ]}
              handbook="Handbook: Unit 6 & 8"
              driveLink="https://drive.google.com/drive/folders/150-003u9wzfbuck-3_NNcYrwD476VcKm"
            />

            <LearningClipCard 
              number="7"
              title="การจัดทำแผนปฏิบัติการ (Action Plan)"
              clips={[
                "7.1 ปูพื้นฐานเกี่ยวกับแผนปฏิบัติการ (21 นาที)",
                "7.2 ไอเดียสำหรับการสร้างแผนปฏิบัติการ (14 นาที)",
                "7.3 การออกแบบและการนำแผนปฏิบัติการไปใช้จริง (17 นาที)",
                "7.4 การประเมินความเปลี่ยนแปลงและการเปรียบเทียบผลลัพธ์ (11 นาที)",
                "7.5 ตัวอย่างจริงของแผนปฏิบัติการ (37 นาที)"
              ]}
              handbook="Handbook: Unit 7"
              driveLink="https://drive.google.com/drive/folders/18NPDPZJ_rfvn_vNz7D3ZzD3DAp9v10g"
            />

            <LearningClipCard 
              number="8"
              title="การเผยแพร่และแบ่งปันผลงาน (Sharing results)"
              clips={[
                "8.1 ทำความรู้จักการแบ่งปันผลงาน: ทำอะไร ทำไมต้องทำ และทำอย่างไร (14 นาที)",
                "8.2 การเตรียมเนื้อหา ภาษา และเทคนิคการนำเสนอ/การพูด (31 นาที)",
                "8.3 การเตรียม E-Poster, บทคัดย่อ และรายงานวิจัยฉบับเขียน (22 นาที)"
              ]}
              handbook="Handbook: Unit 9"
              driveLink="https://drive.google.com/drive/folders/11TNOXWllavcNF3NNfOmc3ECrOSoVq9Fc"
            />

          </div>
        </section>

      </div>
    </div>
  );
};

export default KnowledgeColumn;