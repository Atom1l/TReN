import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AboutCorePrinciples: React.FC = () => {
  const { t } = useLanguage();

  const principles = [
    {
      num: '01',
      title: t('principle_1_title') || 'ขับเคลื่อนโดยครู เพื่อครูอย่างแท้จริง',
      en: t('principle_1_en') || '(Teacher-Led)',
      desc: t('principle_1_desc') || 'บริหารและนำโดยครูโรงเรียนเป็นหลัก ทุกการตัดสินใจเกิดจากความต้องการจริง ปราศจากการสั่งการแบบ Top-down',
    },
    {
      num: '02',
      title: t('principle_2_title') || 'เน้นชุมชนและความร่วมมือ',
      en: t('principle_2_en') || '(Collaboration)',
      desc: t('principle_2_desc') || 'เป็นชุมชนแห่งการเรียนรู้ (CoP / EARC) ที่สมาชิกพร้อมแบ่งปันและช่วยเหลือเกื้อกูลกันแบบกัลยาณมิตร เพื่อเติบโตไปด้วยกัน',
    },
    {
      num: '03',
      title: t('principle_3_title') || 'มุ่งเน้นห้องเรียนและผลลัพธ์ของผู้เรียน',
      en: t('principle_3_en') || '(Classroom-Based)',
      desc: t('principle_3_desc') || 'งานวิจัย EAR เริ่มจากปัญหาจริง และปลายทางสร้างการเปลี่ยนแปลงเชิงบวกให้แก่ผู้เรียนโดยไม่เน้นสะสมเอกสารวิชาการ',
    },
    {
      num: '04',
      title: t('principle_4_title') || 'เปิดใจกว้างและเรียนรู้ร่วมกัน',
      en: t('principle_4_en') || '(Open & Reflective)',
      desc: t('principle_4_desc') || 'สร้าง "พื้นที่ปลอดภัย (Safe Space)" ให้ครูกล้าพูดคุยถึงปัญหา หรือความผิดพลาดในชั้นเรียนเพื่อหาทางออกโดยไม่ถูกตัดสิน พร้อมเปิดรับครูจากทุกสังกัด',
    },
    {
      num: '05',
      title: t('principle_5_title') || 'ส่งต่อความยั่งยืน',
      en: t('principle_5_en') || '(Sustainable Mentorship)',
      desc: t('principle_5_desc') || 'สร้างระบบส่งต่อความรู้เพื่อพัฒนาครูพี่เลี้ยงรุ่นใหม่ให้สืบสานเครือข่ายอย่างยั่งยืน',
    }
  ];

  return (
    <div className="w-full bg-[#F8FAFC] font-sans selection:bg-blue-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 md:pt-24 pb-12">
        
        {/* Intro Section - หมวดที่ 1 */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
            {t('about_principles_main') || 'หลักการดำเนินงาน 5 ข้อ'}
          </h2>
          <p className="text-xl md:text-2xl text-slate-500 font-medium tracking-wide mt-4 uppercase">
            {t('about_principles_subtitle') || "TReN’s 5 Core Principles"}
          </p>
          <div className="w-20 h-1.5 bg-[#1e3a8a] mt-6 rounded-full"></div>
        </section>

        {/* Principles List Section */}
        <div className="space-y-0 border-t-2 border-[#1e3a8a]">
          {principles.map((item, index) => (
            <div 
              key={index} 
              className="flex flex-col md:flex-row items-start gap-6 md:gap-8 lg:gap-16 py-12 border-b border-slate-300"
            >
              {/* ฝั่งซ้าย: เลขข้อ และหัวข้อ */}
              <div className="md:w-4/12 lg:w-4/12 shrink-0 flex items-start gap-3 border-l-4 border-[#1e3a8a] pl-4">
                <span className="text-xl md:text-2xl font-bold text-[#1e3a8a] shrink-0 pt-0.5">
                  {item.num}.
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug">
                    {item.title}
                  </h3>
                  <span className="block text-lg text-slate-400 font-medium uppercase tracking-widest mt-1">
                    {item.en}
                  </span>
                </div>
              </div>

              {/* ฝั่งขวา: รายละเอียด (แนวปฏิบัติ) */}
              <div className="md:w-8/12 lg:w-8/12 md:pt-1">
                <p className="text-2xl text-slate-800 font-light leading-relaxed">
                  <strong className="font-semibold text-xl text-[#1e3a8a] block mb-2">
                    {t('practice_guideline') || 'แนวปฏิบัติ:'}
                  </strong> 
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 💡 เส้นกั้นปิดจบหมวดที่ 2 เพื่อเปลี่ยนเข้าสู่หมวดที่ 3 */}
        <div className="pt-24 flex items-center justify-center gap-6">
          <div className="h-[2px] flex-1 bg-[#1e3a8a]"></div>
          <div className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-slate-100 border border-slate-300 text-[#1e3a8a] text-sm md:text-base font-bold tracking-wider uppercase">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1e3a8a]"></span>
            <span>{t('end_of_section') || 'END OF SECTION'}: 1</span>
          </div>
          <div className="h-[2px] flex-1 bg-[#1e3a8a]"></div>
        </div>

      </div>
    </div>
  );
};

export default AboutCorePrinciples;