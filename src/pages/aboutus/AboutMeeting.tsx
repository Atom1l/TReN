import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AboutMeetings: React.FC = () => {
  const { t } = useLanguage();

  const meetingsData = [
    {
      num: '1.',
      title: t('meetings_item_1_title') || 'การพบปะคณะที่ปรึกษาและภาคีเครือข่าย',
      enTitle: t('meetings_item_1_en') || '(Advisory & Partner)',
      desc: t('meetings_item_1_desc') || 'พูดคุยแลกเปลี่ยนทิศทางร่วมกันปีละ 1 ครั้ง (ผ่านระบบออนไลน์ หรือจัดร่วมกับงานประชุมใหญ่ประจำปี) เพื่อขอคำแนะนำและเติมพลังใจในการทำงาน'
    },
    {
      num: '2.',
      title: t('meetings_item_2_title') || 'การประชุมใหญ่ประจำปี',
      enTitle: t('meetings_item_2_en') || '(Annual Gathering)',
      desc: t('meetings_item_2_desc') || 'จัดปีละ 1 ครั้ง เพื่อสรุปผลงานที่ร่วมกันทำมาตลอดปี แถลงเรื่องงบประมาณอย่างโปร่งใส และเปิดพื้นที่รับฟังความท้าทายและความคิดใหม่ๆ จากสมาชิก'
    },
    {
      num: '3.',
      title: t('meetings_item_3_title') || 'การพูดคุยทีมบริหารส่วนกลาง',
      enTitle: t('meetings_item_3_en') || '(Core Team Catch-up)',
      desc: t('meetings_item_3_desc') || 'นัดคุยสบายๆ ผ่านออนไลน์ทุก 3 เดือน เพื่อติดตามงาน ช่วยกันแก้ปัญหา และเตรียมกิจกรรมถัดไป'
    },
    {
      num: '4.',
      title: t('meetings_item_4_title') || 'การแลกเปลี่ยนระดับพื้นที่',
      enTitle: t('meetings_item_4_en') || '(EARC Community Spaces)',
      desc: t('meetings_item_4_desc') || 'จัดขึ้นตามความพร้อมและความสะดวกของครูในแต่ละภูมิภาค ผ่านกลุ่ม Line, กิจกรรม PLC หรือวงเสวนาออนไลน์ย่อยตามหัวข้อที่ครูสนใจ'
    }
  ];

  return (
    <div className="w-full bg-[#F8FAFC] font-sans selection:bg-blue-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 md:pt-24">
        
        {/* Header Section */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
            {t('meetings_title') || 'การประชุมและการดำเนินงาน'} 
          </h2>
          <p className="text-xl md:text-2xl text-slate-500 font-medium tracking-wide mt-4 uppercase">
            {t('meetings_en_title') || 'Meetings'}
          </p>
          <div className="w-20 h-1.5 bg-[#1e3a8a] mt-6 rounded-full"></div>
          
          <p className="mt-8 text-2xl text-slate-800 font-light leading-relaxed max-w-6xl whitespace-pre-line">
            {t('meetings_desc') || 'เครือข่าย TReN ยึดหลัก "เน้นทำงานจริง ไม่สร้างภาระเอกสาร และไม่กระทบเวลาสอนของครู" การพูดคุยส่วนใหญ่จึงเน้นช่องทางออนไลน์ที่ยืดหยุ่นและเป็นกันเอง ดังนี้:'}
          </p>
        </section>

        {/* Meetings List */}
        <div className="space-y-0">
          {meetingsData.map((item, index) => (
            <div 
              key={index} 
              className="flex flex-col md:flex-row items-start gap-4 md:gap-8 lg:gap-16 py-12 border-t border-slate-300"
            >
              {/* Left Column: Number & Title */}
              <div className="md:w-4/12 lg:w-4/12 shrink-0">
                <h3 className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug flex items-start">
                  <span className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug mr-3">{item.num}</span>
                  <div>
                    {item.title}
                    <span className="block text-xl text-slate-500 font-medium uppercase tracking-widest mt-2">
                      {item.enTitle}
                    </span>
                  </div>
                </h3>
              </div>

              {/* Right Column: Description */}
              <div className="md:w-8/12 lg:w-8/12 md:pt-1">
                <p className="text-2xl text-slate-800 font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}

            {/* Footer Decision Making Section (แยกส่วน ทิ้งระยะห่าง และเรียงซ้ายทั้งหมด) */}
        <div className=" pt-16 border-t-[2px] border-slate-200 mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] tracking-tight">
            {t('meetings_footer_title') || 'การตัดสินใจและการสื่อสาร'}
          </h3>
          <p className="text-xl text-slate-500 font-medium uppercase tracking-widest mt-3">
            {t('meetings_footer_en') || 'Decision Making & Communication'}
          </p>
          
          <p className="text-2xl text-slate-800 font-light leading-relaxed mt-3">
            {t('meetings_footer_desc') || 'เน้นการปรึกษาหารือแบบหารือร่วมกัน (Consensus) ด้วยบรรยากาศกัลยาณมิตร โดยทีมเลขานุการจะช่วยสรุปประเด็นสำคัญและแชร์ให้สมาชิกทุกคนรับทราบผ่านช่องทางออนไลน์ของเครือข่ายอย่างสม่ำเสมอ'}
          </p>
        </div>

        </div>
      </div>
    </div>
  );
};

export default AboutMeetings;