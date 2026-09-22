import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AboutCorePrinciples: React.FC = () => {
  const { t } = useLanguage();

  const principles = [
    {
      num: '1',
      title: t('principle_1_title') || 'ขับเคลื่อนโดยครู เพื่อครูอย่างแท้จริง',
      en: t('principle_1_en') || '(Teacher-Led)',
      desc: t('principle_1_desc') || 'บริหารและนำโดยครูโรงเรียนเป็นหลัก ทุกการตัดสินใจเกิดจากความต้องการจริง ปราศจากการสั่งการแบบ Top-down',
    },
    {
      num: '2',
      title: t('principle_2_title') || 'เน้นชุมชนและความร่วมมือ',
      en: t('principle_2_en') || '(Collaboration)',
      desc: t('principle_2_desc') || 'เป็นชุมชนแห่งการเรียนรู้ (CoP / EARC) ที่สมาชิกพร้อมแบ่งปันและช่วยเหลือเกื้อกูลกันแบบกัลยาณมิตร เพื่อเติบโตไปด้วยกัน',
    },
    {
      num: '3',
      title: t('principle_3_title') || 'มุ่งเน้นห้องเรียนและผลลัพธ์ของผู้เรียน',
      en: t('principle_3_en') || '(Classroom-Based)',
      desc: t('principle_3_desc') || 'งานวิจัย EAR เริ่มจากปัญหาจริง และปลายทางสร้างการเปลี่ยนแปลงเชิงบวกให้แก่ผู้เรียนโดยไม่เน้นสะสมเอกสารวิชาการ',
    },
    {
      num: '4',
      title: t('principle_4_title') || 'เปิดใจกว้างและเรียนรู้ร่วมกัน',
      en: t('principle_4_en') || '(Open & Reflective)',
      desc: t('principle_4_desc') || 'สร้าง "พื้นที่ปลอดภัย (Safe Space)" ให้ครูกล้าพูดคุยถึงปัญหา หรือความผิดพลาดในชั้นเรียนเพื่อหาทางออกโดยไม่ถูกตัดสิน พร้อมเปิดรับครูจากทุกสังกัด',
    },
    {
      num: '5',
      title: t('principle_5_title') || 'ส่งต่อความยั่งยืน',
      en: t('principle_5_en') || '(Sustainable Mentorship)',
      desc: t('principle_5_desc') || 'สร้างระบบส่งต่อความรู้เพื่อพัฒนาครูพี่เลี้ยงรุ่นใหม่ให้สืบสานเครือข่ายอย่างยั่งยืน',
    }
  ];

  return (
    <div className="w-full bg-[#F8FAFC] font-sans selection:bg-blue-200">
      {/* ใช้ padding top/bottom ให้เชื่อมต่อกับ section อื่นได้เนียนขึ้น */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-10">
        
        {/* Intro Section */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
            {t('about_principles_main') || 'หลักการดำเนินงาน 5 ข้อ'}
          </h2>
          <p className="text-xl md:text-2xl text-slate-500 font-medium tracking-wide mt-4">
            {t('about_principles_subtitle') || "TReN’s 5 Core Principles"}
          </p>
        </section>

        {/* Principles List Section - ไม่มี Box เน้นเส้นคั่นและฟอร์มเดียวกัน */}
        <div className="space-y-0">
          {principles.map((item, index) => (
            <div 
              key={index} 
              className={`flex flex-col md:flex-row items-start gap-4 md:gap-8 lg:gap-16 py-12 border-t border-slate-300 ${index === principles.length - 1 ? 'border-b' : ''}`}
            >
              {/* ฝั่งซ้าย: ตัวเลข หัวข้อภาษาไทย และภาษาอังกฤษ */}
              <div className="md:w-4/12 lg:w-4/12 shrink-0">
                <h3 className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug">
                  <span className="mr-3">{item.num}.</span>
                  {item.title}
                  <span className="block text-xl text-slate-500 font-medium uppercase tracking-widest mt-2">
                    {item.en}
                  </span>
                </h3>
              </div>

              {/* ฝั่งขวา: รายละเอียด (แนวปฏิบัติ) */}
              <div className="md:w-8/12 lg:w-8/12 md:pt-1">
                <p className="text-2xl text-slate-800 font-light leading-relaxed">
                  <strong className="font-bold text-xl text-[#1e3a8a] block mb-2">
                    {t('practice_guideline') || 'แนวปฏิบัติ:'}
                  </strong> 
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AboutCorePrinciples;