import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AboutGovernanceV4: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-[#F8FAFC] font-sans selection:bg-blue-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 md:pt-24">
        
        {/* Header Section */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
            {t('gov4_title') || 'โครงสร้างเครือข่ายและการบริหารงาน'} 
          </h2>
          <p className="text-xl md:text-2xl text-slate-500 font-medium tracking-wide mt-4 uppercase">
            {t('gov4_en_title') || 'Governance & Structure'}
          </p>
          <div className="w-20 h-1.5 bg-[#1e3a8a] mt-6 rounded-full"></div>
          
          <p className="mt-8 text-2xl text-slate-800 font-light leading-relaxed max-w-6xl whitespace-pre-line">
            {t('gov4_desc') || 'การบริหารงานยึดหลัก "ครูเป็นหัวใจหลัก โดยมีพันธมิตรช่วยหนุนหลัง" เน้นความยืดหยุ่น ทำงานเป็นทีม และแบ่งบทบาทตามความถนัด:'}
          </p>
        </section>

        {/* Governance Structure List */}
        <div className="space-y-0">
          
          {/* 4.1 ทีมที่ปรึกษาและพันธมิตรยุทธศาสตร์ */}
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8 lg:gap-16 py-12 border-t border-slate-300">
            <div className="md:w-4/12 lg:w-4/12 shrink-0">
              <h3 className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug flex items-start">
                <span className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug mr-3">1.</span>
                <div>
                  {t('gov4_1_title') || 'ทีมที่ปรึกษาและเครือข่ายความร่วมมือ'}
                  <span className="block text-xl text-slate-500 font-medium uppercase tracking-widest mt-2">
                    {t('gov4_1_en') || 'Advisors & Collaborative Partners'}
                  </span>
                </div>
              </h3>
            </div>
            <div className="md:w-8/12 lg:w-8/12 md:pt-1 space-y-6">
              <p className="text-2xl text-slate-800 font-light leading-relaxed">
                {t('gov4_1_desc') || 'กลุ่มผู้ทรงคุณวุฒิที่มาร่วมเดินทางไปด้วยกันตามความสมัครใจ ทำหน้าที่ช่วยเสนอแนะทิศทางยุทธศาสตร์ สนับสนุนทรัพยากร เชื่อมโยงโอกาสใหม่ๆ ร่วมกับภาคีเครือข่าย และช่วยดูแลธรรมาภิบาลของ TReN ประกอบด้วย:'}
              </p>
              <ul className="space-y-6">
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span><strong className="font-medium text-[#1e3a8a]">{t('gov4_1_item_1_title') || '1. ที่ปรึกษากิตติมศักดิ์ (Honorary Advisors):'}</strong> {t('gov4_1_item_1_desc') || 'ให้คำปรึกษาเชิงนโยบาย เสริมสร้างความน่าเชื่อถือ และช่วยเชื่อมโยงเครือข่ายระดับชาติ (ผู้ก่อตั้งร่วมดูแลต่อเนื่องโดยไม่มีกำหนดระยะเวลา)'}</span>
                </li>
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span><strong className="font-medium text-[#1e3a8a]">{t('gov4_1_item_2_title') || '2. ที่ปรึกษาต่างประเทศ (International Advisors):'}</strong> {t('gov4_1_item_2_desc') || 'ให้คำแนะนำและสนับสนุนการสร้างความร่วมมือในระดับนานาชาติ (วาระคราวละ 3 ปี และต่อวาระได้)'}</span>
                </li>
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span><strong className="font-medium text-[#1e3a8a]">{t('gov4_1_item_3_title') || '3. ผู้แทนองค์กรเครือข่าย (Network Representatives):'}</strong> {t('gov4_1_item_3_desc') || 'สนับสนุนทุน ทรัพยากร วิทยากร และช่วยเชื่อมโยงมาตรฐานวิชาการ (วาระคราวละ 3 ปี หรือตามที่ต้นสังกัดเสนอชื่อ)'}</span>
                </li>
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span><strong className="font-medium text-[#1e3a8a]">{t('gov4_1_item_4_title') || '4. ผู้ทรงคุณวุฒิวิชาการ (Experts):'}</strong> {t('gov4_1_item_4_desc') || 'ช่วยกลั่นกรององค์ความรู้และให้ข้อเสนอแนะเชิงลึกเพื่อพัฒนาคุณภาพโครงการ (วาระคราวละ 3 ปี และต่อวาระได้)'}</span>
                </li>
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span><strong className="font-medium text-[#1e3a8a]">{t('gov4_1_item_5_title') || '5. อดีตประธานเครือข่าย (Immediate-Past President):'}</strong> {t('gov4_1_item_5_desc') || 'ให้คำแนะนำจากประสบการณ์ตรง เพื่อส่งต่อการทำงานอย่างต่อเนื่อง (ร่วมหนุนเสริม 1 วาระ รวม 4 ปี)'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 4.2 ทีมบริหารเครือข่ายส่วนกลาง */}
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8 lg:gap-16 py-12 border-t border-slate-300">
            <div className="md:w-4/12 lg:w-4/12 shrink-0">
              <h3 className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug flex items-start">
                <span className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug mr-3">2.</span>
                <div>
                  {t('gov4_2_title') || 'ทีมบริหารเครือข่ายส่วนกลาง'}
                  <span className="block text-xl text-slate-500 font-medium uppercase tracking-widest mt-2">
                    {t('gov4_2_en') || 'Core Executive Team'}
                  </span>
                </div>
              </h3>
            </div>
            <div className="md:w-8/12 lg:w-8/12 md:pt-1 space-y-6">
              <p className="text-2xl text-slate-800 font-light leading-relaxed">
                {t('gov4_2_desc') || 'กลุ่มครูและคนทำงานที่มาร่วมกันดูแลงานประจำวัน นำนโยบายและกรอบวิชาการสู่การปฏิบัติ บริหารงบประมาณ สรุปรายงานทางการเงิน และกำกับดูแลภาระงานหลักทั้ง 4 ด้าน (ร่วมดูแลงานเป็นทีม วาระคราวละ 4 ปี ต่อเนื่องได้ไม่เกิน 1 วาระ) ประกอบด้วย:'}
              </p>
              <ul className="space-y-6">
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span><strong className="font-medium text-[#1e3a8a]">{t('gov4_2_item_1_title') || '1. ที่ปรึกษาและอดีตประธานเครือข่าย:'}</strong> {t('gov4_2_item_1_desc') || 'ให้คำปรึกษา แนะนำทิศทางการดำเนินงาน และสนับสนุนการขับเคลื่อนภารกิจของเครือข่าย'}</span>
                </li>
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span><strong className="font-medium text-[#1e3a8a]">{t('gov4_2_item_2_title') || '2. ประธานเครือข่าย:'}</strong> {t('gov4_2_item_2_desc') || 'ตัวแทนเชื่อมโยงงานภายนอก นำการประชุม และดูแล งานเผยแพร่ผลงานและเครือข่ายต่างประเทศ (ข้อ 3.3)'}</span>
                </li>
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span><strong className="font-medium text-[#1e3a8a]">{t('gov4_2_item_3_title') || '3. รองประธานเครือข่าย:'}</strong> {t('gov4_2_item_3_desc') || 'ปฏิบัติหน้าที่แทนประธาน ดูแลภาพรวมงานวิชาการ และหนุนเสริม งานพัฒนาครูและเสวนาออนไลน์ (ข้อ 3.1)'}</span>
                </li>
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span><strong className="font-medium text-[#1e3a8a]">{t('gov4_2_item_4_title') || '4. ทีมประสานงานภูมิภาค (EARC Coordinator):'}</strong> {t('gov4_2_item_4_desc') || 'ตัวกลางเชื่อมโยงส่วนกลางกับศูนย์ EARC และดูแล งานหนุนเสริมศูนย์ EARC (ข้อ 3.2)'}</span>
                </li>
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span><strong className="font-medium text-[#1e3a8a]">{t('gov4_2_item_5_title') || '5. ทีมสื่อสารและดูแลสมาชิก:'}</strong> {t('gov4_2_item_5_desc') || 'ดูแลคลังความรู้ออนไลน์ สื่อ Teacher Stories และคอยตอบคำถามสมาชิก (ข้อ 3.4)'}</span>
                </li>
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span><strong className="font-medium text-[#1e3a8a]">{t('gov4_2_item_6_title') || '6. ทีมเลขานุการและเหรัญญิก:'}</strong> {t('gov4_2_item_6_desc') || 'ดูแลงานนัดหมาย เอกสารเท่าที่จำเป็น และช่วยบริหารจัดการงบประมาณอย่างโปร่งใส'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 4.3 ทีมงานศูนย์ขับเคลื่อนวิจัยครูระดับภูมิภาค */}
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8 lg:gap-16 py-12 border-y border-slate-300">
            <div className="md:w-4/12 lg:w-4/12 shrink-0">
              <h3 className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug flex items-start">
                <span className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug mr-3">3.</span>
                <div>
                  {t('gov4_3_title') || 'ทีมงานศูนย์ขับเคลื่อนวิจัยครูระดับภูมิภาค'}
                  <span className="block text-xl text-slate-500 font-medium uppercase tracking-widest mt-2">
                    {t('gov4_3_en') || 'Regional EARC Teams'}
                  </span>
                </div>
              </h3>
            </div>
            <div className="md:w-8/12 lg:w-8/12 md:pt-1 space-y-6">
              <p className="text-2xl text-slate-800 font-light leading-relaxed">
                {t('gov4_3_desc') || 'ทีมครูในพื้นที่ที่เป็นหัวใจสำคัญในการจัดกิจกรรม อบรม ให้คำปรึกษา ดูแลครูในจังหวัดหรือภูมิภาคนั้นๆ และร่วมมือกับส่วนกลางอย่างสม่ำเสมอ (ยืดหยุ่นตามการบริหารภายในของแต่ละศูนย์ ไม่กำหนดวาระที่ตายตัว โดยร่วมทบทวนรายชื่อประจำปีกับส่วนกลาง) ประกอบด้วย:'}
              </p>
              <ul className="space-y-6">
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span><strong className="font-medium text-[#1e3a8a]">{t('gov4_3_item_1_title') || '1. ครูพี่เลี้ยงวิจัยและวิทยากร (EAR Mentors / Trainers):'}</strong> {t('gov4_3_item_1_desc') || 'ครูรุ่นพี่ที่มีประสบการณ์ จัดอบรม EAR และคอยเป็นเพื่อนคู่คิดให้คำปรึกษาแก่ครูในพื้นที่'}</span>
                </li>
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span><strong className="font-medium text-[#1e3a8a]">{t('gov4_3_item_2_title') || '2. ครูแกนนำวิจัย (Lead Teacher-Researchers):'}</strong> {t('gov4_3_item_2_desc') || 'ครูผู้ปฏิบัติจริงในพื้นที่ ร่วมวางแผนกิจกรรมและชวนเพื่อนครูมาร่วมเรียนรู้ด้วยกัน'}</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutGovernanceV4;