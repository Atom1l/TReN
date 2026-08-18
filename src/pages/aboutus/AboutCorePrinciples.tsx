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
      textAccent: 'text-[#1e3a8a]',
      borderAccent: 'border-l-[#1e3a8a]',
      bgNumColor: 'text-blue-50 group-hover:text-blue-100',
    },
    {
      num: '02',
      title: t('principle_2_title') || 'เน้นชุมชนและความร่วมมือ',
      en: t('principle_2_en') || '(Collaboration)',
      desc: t('principle_2_desc') || 'เป็นชุมชนแห่งการเรียนรู้ (CoP / EARC) ที่สมาชิกพร้อมแบ่งปันและช่วยเหลือเกื้อกูลกันแบบกัลยาณมิตร เพื่อเติบโตไปด้วยกัน',
      textAccent: 'text-emerald-600',
      borderAccent: 'border-l-emerald-500',
      bgNumColor: 'text-emerald-50 group-hover:text-emerald-100',
    },
    {
      num: '03',
      title: t('principle_3_title') || 'มุ่งเน้นห้องเรียนและผลลัพธ์ของผู้เรียน',
      en: t('principle_3_en') || '(Classroom-Based)',
      desc: t('principle_3_desc') || 'งานวิจัย EAR เริ่มจากปัญหาจริง และปลายทางสร้างการเปลี่ยนแปลงเชิงบวกให้แก่ผู้เรียนโดยไม่เน้นสะสมเอกสารวิชาการ',
      textAccent: 'text-orange-600',
      borderAccent: 'border-l-orange-500',
      bgNumColor: 'text-orange-50 group-hover:text-orange-100',
    },
    {
      num: '04',
      title: t('principle_4_title') || 'เปิดใจกว้างและเรียนรู้ร่วมกัน',
      en: t('principle_4_en') || '(Open & Reflective)',
      desc: t('principle_4_desc') || 'สร้าง "พื้นที่ปลอดภัย (Safe Space)" ให้ครูกล้าพูดคุยถึงปัญหา หรือความผิดพลาดในชั้นเรียนเพื่อหาทางออกโดยไม่ถูกตัดสิน พร้อมเปิดรับครูจากทุกสังกัด',
      textAccent: 'text-purple-600',
      borderAccent: 'border-l-purple-500',
      bgNumColor: 'text-purple-50 group-hover:text-purple-100',
    },
    {
      num: '05',
      title: t('principle_5_title') || 'ส่งต่อความยั่งยืน',
      en: t('principle_5_en') || '(Sustainable Mentorship)',
      desc: t('principle_5_desc') || 'สร้างระบบส่งต่อความรู้เพื่อพัฒนาครูพี่เลี้ยงรุ่นใหม่ให้สืบสานเครือข่ายอย่างยั่งยืน',
      textAccent: 'text-teal-600',
      borderAccent: 'border-l-teal-500',
      bgNumColor: 'text-teal-50 group-hover:text-teal-100',
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-blue-200 pb-20">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/70 to-transparent -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24 mt-1">
        
        {/* Intro Section */}
        <section className="max-w-4xl mb-10 md:mb-10 relative">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
            {t('about_principles_main') || 'หลักการดำเนินงาน 5 ข้อ'}
          </h1>
          <p className="text-lg md:text-xl text-[#1e3a8a] font-medium tracking-wide">
            {t('about_principles_subtitle') || "TReN’s 5 Core Principles"}
          </p>
          <div className="w-20 h-1.5 bg-[#1e3a8a] mt-6 rounded-full"></div>
        </section>

        {/* Principles List Section (Card Style) */}
        <section className="flex flex-col gap-8 md:gap-10">
          {principles.map((item, index) => (
            <div 
              key={index} 
              className={`group relative flex flex-col md:flex-row gap-6 md:gap-12 py-10 md:py-14 px-8 md:px-12 bg-white rounded-[2rem] shadow-sm hover:shadow-md border-y border-r border-slate-100 border-l-[6px] ${item.borderAccent} transition-all duration-300 overflow-hidden transform hover:-translate-y-1`}
            >
              {/* Background Oversized Number (Watermark effect) */}
              <div className={`absolute -bottom-8 -right-6 text-[10rem] md:text-[14rem] lg:text-[16rem] font-black transition-colors duration-500 z-0 select-none leading-none opacity-80 ${item.bgNumColor}`}>
                {item.num}
              </div>

              {/* Left Column: Title & EN */}
              <div className="md:w-5/12 shrink-0 relative z-10 flex gap-4 md:gap-5 items-start">
                <span className={`text-3xl md:text-4xl font-black mt-1 ${item.textAccent}`}>
                  {item.num}.
                </span>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-800 leading-snug">
                    {item.title}
                  </h3>
                  <div className={`font-semibold mt-3 tracking-wide text-lg ${item.textAccent}`}>
                    {item.en}
                  </div>
                </div>
              </div>

              {/* Right Column: Description */}
              <div className="md:w-7/12 relative z-10 flex items-center">
                <p className="text-slate-600 text-lg md:text-xl leading-relaxed font-light">
                  <strong className="font-semibold text-slate-800 tracking-wide">
                    {t('practice_guideline') || 'แนวปฏิบัติ:'}
                  </strong> 
                  {' '}{item.desc}
                </p>
              </div>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
};

export default AboutCorePrinciples;