import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AboutOperations: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-[#F8FAFC] font-sans selection:bg-blue-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 md:pt-24">
        
        {/* Header Section */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
            {t('ops_title') || 'ขอบเขตการดำเนินงานและโครงการหลัก'} 
          </h2>
          <p className="text-xl md:text-2xl text-slate-500 font-medium tracking-wide mt-4 uppercase">
            {t('ops_en_title') || 'Key Operational Areas'}
          </p>
          <div className="w-20 h-1.5 bg-[#1e3a8a] mt-6 rounded-full"></div>
          
          {/* ขยายความกว้างเป็น max-w-6xl เพื่อไม่ให้ข้อความโดนปัดตกบรรทัดเร็วเกินไป */}
          <p className="mt-8 text-2xl text-slate-800 font-light leading-relaxed max-w-6xl whitespace-pre-line">
            {t('ops_desc') || 'TReN ทำหน้าที่เป็น "ทีมสนับสนุนหลัก" เพื่อขับเคลื่อนและเสริมพลังให้ชุมชนวิจัยครู EARC ในทุกพื้นที่ โดยแบ่งเนื้องานหลักออกเป็น 4 ด้าน:'}
          </p>
        </section>

        {/* Operations List */}
        <div className="space-y-0">
          
          {/* 3.1 งานพัฒนาศักยภาพและระบบครูพี่เลี้ยงส่วนกลาง */}
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8 lg:gap-16 py-12 border-t border-slate-300">
            <div className="md:w-4/12 lg:w-4/12 shrink-0">
              <h3 className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug flex items-start">
                <span className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug mr-3">1.</span>
                <div>
                  {t('ops_3_1_title') || 'งานพัฒนาศักยภาพและระบบครูพี่เลี้ยงส่วนกลาง'}
                  <span className="block text-xl text-slate-500 font-medium uppercase tracking-widest mt-2">
                    {t('ops_3_1_en') || 'Central Capacity & Mentoring'}
                  </span>
                </div>
              </h3>
            </div>
            <div className="md:w-8/12 lg:w-8/12 md:pt-1">
              <ul className="space-y-6">
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span className="text-[#1e3a8a] mr-3 mt-1.5 text-xl leading-none">&bull;</span>
                  <span><strong className="font-medium text-[#1e3a8a]">{t('ops_3_1_item_1_title') || 'อบรมวิจัยครูระดับชาติ:'}</strong> {t('ops_3_1_item_1_desc') || 'จัดการอบรมการทำวิจัย EAR ออนไลน์ (ปีละ 1–2 ครั้ง) เน้นนำไปใช้ได้จริงในห้องเรียน ปลูกฝังเจตคติเชิงบวกต่อการทำวิจัย และขยายโอกาสให้ครูในพื้นที่ห่างไกล'}</span>
                </li>
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span className="text-[#1e3a8a] mr-3 mt-1.5 text-xl leading-none">&bull;</span>
                  <span><strong className="font-medium text-[#1e3a8a]">{t('ops_3_1_item_2_title') || 'พัฒนาครูพี่เลี้ยงวิจัย (Train the Trainer & Mentor Community):'}</strong> {t('ops_3_1_item_2_desc') || 'เติมทักษะครูพี่เลี้ยงรุ่นพี่และบ่มเพาะครูพี่เลี้ยงรุ่นใหม่ ควบคู่กับการจัด "ชุมชนแลกเปลี่ยนเรียนรู้ออนไลน์" เพื่อให้ครูพี่เลี้ยงได้ร่วมแบ่งปันประสบการณ์และคอยดูแลเพื่อนครูอย่างต่อเนื่อง'}</span>
                </li>
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span className="text-[#1e3a8a] mr-3 mt-1.5 text-xl leading-none">&bull;</span>
                  <span><strong className="font-medium text-[#1e3a8a]">{t('ops_3_1_item_3_title') || 'เสวนาเติมความรู้ออนไลน์:'}</strong> {t('ops_3_1_item_3_desc') || 'จัดเสวนาวิชาการออนไลน์สั้นๆ ร่วมกับผู้เชี่ยวชาญ เพื่อเติมองค์ความรู้และเทคนิคใหม่ๆ ในการจัดการเรียนการสอนอย่างสม่ำเสมอ'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 3.2 งานบริหารและหนุนเสริมเครือข่ายภูมิภาค */}
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8 lg:gap-16 py-12 border-t border-slate-300">
            <div className="md:w-4/12 lg:w-4/12 shrink-0">
              <h3 className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug flex items-start">
                <span className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug mr-3">2.</span>
                <div>
                  {t('ops_3_2_title') || 'งานบริหารและหนุนเสริมเครือข่ายภูมิภาค'}
                  <span className="block text-xl text-slate-500 font-medium uppercase tracking-widest mt-2">
                    {t('ops_3_2_en') || 'EARC Hub & Network Management'}
                  </span>
                </div>
              </h3>
            </div>
            <div className="md:w-8/12 lg:w-8/12 md:pt-1">
              <ul className="space-y-6">
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span className="text-[#1e3a8a] mr-3 mt-1.5 text-xl leading-none">&bull;</span>
                  <span><strong className="font-medium text-[#1e3a8a]">{t('ops_3_2_item_1_title') || 'สนับสนุนสื่อและเครื่องมือวิชาการ:'}</strong> {t('ops_3_2_item_1_desc') || 'ส่งต่อคู่มือ สื่อ ตัวอย่างงานวิจัย และชุดเครื่องมือ ให้ศูนย์ EARC แต่ละแห่งนำไปปรับใช้ตามบริบทพื้นที่ได้ทันที'}</span>
                </li>
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span className="text-[#1e3a8a] mr-3 mt-1.5 text-xl leading-none">&bull;</span>
                  <span><strong className="font-medium text-[#1e3a8a]">{t('ops_3_2_item_2_title') || 'เวทีแลกเปลี่ยนระหว่างศูนย์ (Cross-EARC Collaboration):'}</strong> {t('ops_3_2_item_2_desc') || 'ชวนตัวแทนศูนย์ EARC ทุกภูมิภาคมานั่งคุย ถ่ายทอดประสบการณ์ แชร์ความท้าทาย และวางแผนงานร่วมกัน'}</span>
                </li>
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span className="text-[#1e3a8a] mr-3 mt-1.5 text-xl leading-none">&bull;</span>
                  <span><strong className="font-medium text-[#1e3a8a]">{t('ops_3_2_item_3_title') || 'ประเมินผลกระทบเชิงลึก:'}</strong> {t('ops_3_2_item_3_desc') || 'ประเมินผลลัพธ์ของการทำวิจัย (Impact) ที่เกิดกับตัวครูและผู้เรียน เพื่อนำข้อมูลมาปรับปรุงการทำงานของเครือข่ายให้ตอบโจทย์ครูมากที่สุด'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 3.3 งานเผยแพร่ผลงานและเครือข่ายต่างประเทศ */}
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8 lg:gap-16 py-12 border-t border-slate-300">
            <div className="md:w-4/12 lg:w-4/12 shrink-0">
              <h3 className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug flex items-start">
                <span className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug mr-3">3.</span>
                <div>
                  {t('ops_3_3_title') || 'งานเผยแพร่ผลงานและเครือข่ายต่างประเทศ'}
                  <span className="block text-xl text-slate-500 font-medium uppercase tracking-widest mt-2">
                    {t('ops_3_3_en') || 'Dissemination & International Network'}
                  </span>
                </div>
              </h3>
            </div>
            <div className="md:w-8/12 lg:w-8/12 md:pt-1">
              <ul className="space-y-6">
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span className="text-[#1e3a8a] mr-3 mt-1.5 text-xl leading-none">&bull;</span>
                  <span><strong className="font-medium text-[#1e3a8a]">{t('ops_3_3_item_1_title') || 'งานประชุมวิชาการเสนอผลงานวิจัยครูระดับชาติ:'}</strong> {t('ops_3_3_item_1_desc') || 'จัดเวทีนำเสนอผลงานวิจัยครูในบรรยากาศ "พื้นที่ปลอดภัยเพื่อการเรียนรู้" ที่เปิดกว้าง ไม่ตัดสิน เน้นแลกเปลี่ยน ให้กำลังใจกัน เพื่อสร้างแรงบันดาลใจและยกระดับวิชาชีพครู'}</span>
                </li>
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span className="text-[#1e3a8a] mr-3 mt-1.5 text-xl leading-none">&bull;</span>
                  <span><strong className="font-medium text-[#1e3a8a]">{t('ops_3_3_item_2_title') || 'เชื่อมโยงเครือข่ายสากล:'}</strong> {t('ops_3_3_item_2_desc') || 'แสวงหาความร่วมมือกับเครือข่ายการศึกษาในต่างประเทศและประเทศเพื่อนบ้าน (ลาว กัมพูชา เวียดนาม เมียนมา) พร้อมส่งเสริมให้ครูไทยได้มีโอกาสนำเสนอผลงานในระดับสากล'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 3.4 งานคลังความรู้ ดิจิทัล และการดูแลสมาชิก */}
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8 lg:gap-16 py-12 border-y border-slate-300">
            <div className="md:w-4/12 lg:w-4/12 shrink-0">
              <h3 className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug flex items-start">
                <span className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug mr-3">4.</span>
                <div>
                  {t('ops_3_4_title') || 'งานคลังความรู้ ดิจิทัล และการดูแลสมาชิก'}
                  <span className="block text-xl text-slate-500 font-medium uppercase tracking-widest mt-2">
                    {t('ops_3_4_en') || 'Knowledge Hub & Community'}
                  </span>
                </div>
              </h3>
            </div>
            <div className="md:w-8/12 lg:w-8/12 md:pt-1">
              <ul className="space-y-6">
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span className="text-[#1e3a8a] mr-3 mt-1.5 text-xl leading-none">&bull;</span>
                  <span><strong className="font-medium text-[#1e3a8a]">{t('ops_3_4_item_1_title') || 'คลังความรู้ออนไลน์ (EAR Digital Knowledge Bank):'}</strong> {t('ops_3_4_item_1_desc') || 'รวบรวมงานวิจัย EAR ตัวอย่างแผนการสอน และคู่มือ จัดไว้ในระบบที่เข้าถึงง่ายทุกที่ทุกเวลา โดยไม่มีค่าใช้จ่าย'}</span>
                </li>
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span className="text-[#1e3a8a] mr-3 mt-1.5 text-xl leading-none">&bull;</span>
                  <span><strong className="font-medium text-[#1e3a8a]">{t('ops_3_4_item_2_title') || 'สื่อสารเรื่องราวแรงบันดาลใจ (Teacher Stories):'}</strong> {t('ops_3_4_item_2_desc') || 'ถ่ายทอดเรื่องเล่าของครูทำวิจัยผ่านช่องทางออนไลน์ เพื่อสร้างพลังใจและเจตคติเชิงบวกต่อการทำวิจัยครู'}</span>
                </li>
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span className="text-[#1e3a8a] mr-3 mt-1.5 text-xl leading-none">&bull;</span>
                  <span><strong className="font-medium text-[#1e3a8a]">{t('ops_3_4_item_3_title') || 'ดูแลระบบสมาชิก:'}</strong> {t('ops_3_4_item_3_desc') || 'บริหารจัดการระบบลงทะเบียน ฐานข้อมูล และช่องทางสื่อสารหลัก (Line/เพจ) เพื่อคอยตอบคำถามและช่วยเหลือสมาชิกทุกคนอย่างใกล้ชิด'}</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutOperations;