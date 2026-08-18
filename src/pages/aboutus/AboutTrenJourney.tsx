import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AboutTrenJourney: React.FC = () => {
  const { t } = useLanguage();

  const journeyData = [
    {
      year: t('journey_year_1_title') || 'พ.ศ. 2565',
      phase: t('journey_phase_1') || 'จุดกำเนิดและความท้าทายในห้องเรียน',
      content: (
        <div className="space-y-6">
          <p className="text-xl text-slate-700 font-medium leading-relaxed">
            {t('journey_desc_1_1') || 'จุดเริ่มต้นของเครือข่าย Teacher-Research Network (TReN) เกิดขึ้นจากความร่วมมือระหว่าง British Council Thailand และ คณะศิลปศาสตร์ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี (มจธ.) ที่มีเป้าหมายสำคัญในการติดอาวุธให้ครูประจำการสามารถแก้ไขปัญหาในชั้นเรียนได้ด้วยตนเอง'}
          </p>
          <p className="text-lg text-slate-600 leading-relaxed font-light">
            {t('journey_desc_1_2') || 'ในชีวิตการทำงานจริง ครูต้องเผชิญกับความท้าทายหลากหลายรูปแบบ แม้ที่ผ่านมาภาครัฐจะมีมาตรการช่วยเหลือ เช่น การส่งศึกษานิเทศก์เข้าเยี่ยมชั้นเรียน นโยบาย PLC หรือการจัดอบรม แต่เพราะบริบทและปัญหาของแต่ละห้องเรียนมีความแตกต่างกันอย่างสิ้นเชิง การรอความช่วยเหลือจากภายนอกจึงไม่เพียงพอ'}
          </p>
          
          {/* Highlight Box */}
          <div className="bg-[#f8fafc] border-l-[6px] border-[#1e3a8a] p-6 sm:p-8 rounded-r-2xl mt-8">
            <strong className="block mb-2 text-xl font-bold text-[#1e3a8a]">
              {t('journey_key_takeaway') || 'ทางออกที่ยั่งยืนที่สุด'}
            </strong>
            <p className="text-lg text-slate-700 leading-relaxed">
              {t('journey_desc_1_3') || 'ต้องเริ่มต้นจากการปรับมุมมอง โดยยึดหลักคิดว่า ทุกการตัดสินใจของครูต้องอยู่บนพื้นฐานของประจักษ์พยาน (evidence-based decision) การใช้กระบวนการ Exploratory Action Research (EAR) จึงเป็นคำตอบที่ตอบโจทย์และสอดคล้องกับเกณฑ์ ก.ค.ศ.'}
            </p>
          </div>
        </div>
      ),
      textColor: 'text-[#1e3a8a]',
      bgColor: 'bg-[#1e3a8a]', // เพิ่ม bgColor ตรงตัว
      borderColor: 'border-[#1e3a8a]',
    },
    {
      year: t('journey_year_1_2_title') || 'ปีที่ 1 (พ.ศ. 2565)',
      phase: t('journey_phase_1_2') || 'จุดประกายและวางรากฐาน',
      content: (
        <div className="space-y-6">
          <p className="text-lg text-slate-600 leading-relaxed font-light">
            {t('journey_desc_2_1') || 'โครงการเริ่มต้นจากการอบรมครูสอนภาษาอังกฤษจำนวน 21 คน โดยใช้โมเดลการอบรม EAR ซึ่งพัฒนาขึ้นโดย Professor Dr. Richard Smith และ Dr. Paula Rebolledo'}
          </p>
          <p className="text-lg text-slate-600 leading-relaxed font-light">
            {t('journey_desc_2_2') || 'ครูได้ลงมือทำวิจัยจริง พร้อมได้รับคำปรึกษาอย่างใกล้ชิดจากผู้เชี่ยวชาญและครูพี่เลี้ยงนานาชาติ ซึ่งการมีครูพี่เลี้ยงคอยหนุนเสริมเช่นนี้ถือเป็นหัวใจสำคัญที่ช่วยให้ครูทำวิจัยจนเสร็จสิ้น'}
          </p>
          
          {/* Editorial Pull Quote */}
          <blockquote className="my-10 relative">
            <svg className="absolute -top-6 -left-6 w-16 h-16 text-indigo-100 transform -scale-y-100" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true"><path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.896 3.456-8.352 9.12-8.352 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" /></svg>
            <p className="relative z-10 text-xl sm:text-2xl font-medium text-slate-800 leading-snug italic px-4 border-l-2 border-indigo-200">
              {t('journey_quote') || 'กระบวนการต่างๆ ที่ใช้ในการทำวิจัย เป็นเรื่องที่ครูไม่คุ้นเคย เข้าใจยาก และต้องอาศัยการฝึกปฏิบัติภายใต้พี่เลี้ยงที่เข้าใจ... ในสภาพจริงหลังการฝึกอบรม ครูที่ทำวิจัยกลับขาดพี่เลี้ยงคอยช่วยเหลือ ส่งผลให้รายงานวิจัยมีข้อบกพร่อง'}
            </p>
            <footer className="mt-4 pl-4 text-base font-semibold text-indigo-600 uppercase tracking-wide">
              — {t('journey_quote_author') || 'ดร.สุวิมล ว่องวาณิช'}
            </footer>
          </blockquote>

          <p className="text-lg text-slate-600 leading-relaxed font-light">
            {t('journey_desc_2_3') || 'ผลลัพธ์คือครูมีทัศนคติต่อการทำวิจัยที่ดีขึ้น ความสัมพันธ์กับนักเรียนแน่นแฟ้นขึ้น และแก้ปัญหาได้ตรงจุด ความสำเร็จนี้ทำให้โครงการพร้อมเดินหน้าขยายผลต่อไป'}
          </p>
        </div>
      ),
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-600', // เพิ่ม bgColor ตรงตัว
      borderColor: 'border-indigo-600',
    },
    {
      year: t('journey_year_2_4_title') || 'ปีที่ 2 - 4 (พ.ศ. 2566 - 2568)',
      phase: t('journey_phase_2_4') || 'บ่มเพาะแกนนำและความพร้อมสู่เครือข่าย',
      content: (
        <div className="space-y-6">
          <p className="text-lg text-slate-600 leading-relaxed font-light">
            {t('journey_desc_3_1') || 'เนื่องจากการใช้ครูพี่เลี้ยงชาวต่างชาติมีต้นทุนสูง โครงการจึงมุ่งเน้นความยั่งยืน โดยคัดเลือกครูที่มีศักยภาพจากรุ่นแรกมาเข้ารับการพัฒนาเป็น "ครูพี่เลี้ยงวิจัย (Teacher-Research Mentor)" โดยได้รับเกียรติจาก Professor Dr. Richard Smith มาถ่ายทอดองค์ความรู้'}
          </p>
          <p className="text-lg text-slate-600 leading-relaxed font-light">
            {t('journey_desc_3_2') || 'ตลอด 3 ปีนี้ ครูพี่เลี้ยงได้ทำหน้าที่ให้คำปรึกษาแก่เพื่อนครู ขยายผลการอบรมครอบคลุมถึง 40 จังหวัดทั่วประเทศ ทำให้มีสมาชิกและครูพี่เลี้ยงกระจายตัวอย่างทั่วถึง เตรียมพร้อมสู่การยกระดับความร่วมมือครั้งสำคัญ'}
          </p>
        </div>
      ),
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-600', // เพิ่ม bgColor ตรงตัว
      borderColor: 'border-emerald-600',
    },
    {
      year: t('journey_year_5_6_title') || 'ปีที่ 5 - 6 (พ.ศ. 2569 - 2571)',
      phase: t('journey_phase_5_6') || 'กำเนิดเครือข่าย TReN และขับเคลื่อนระดับประเทศ',
      content: (
        <div className="space-y-6">
          <p className="text-lg text-slate-600 leading-relaxed font-light">
            {t('journey_desc_4_1') || 'จากการเติบโตของกลุ่มครูนักวิจัยทั่วประเทศ นำมาสู่การก่อตั้ง "เครือข่าย Teacher-Research Network (TReN)" อย่างเป็นทางการ'}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" /></svg>
              </div>
              <strong className="block text-lg font-bold text-slate-800 mb-2">{t('journey_bullet_4_1_strong') || 'ยกระดับเครือข่ายเชิงพื้นที่'}</strong>
              <p className="text-slate-600 font-light">{t('journey_bullet_4_1_desc') || 'ขยายผลผ่านชุมชนนักปฏิบัติระดับภูมิภาค (Regional CoP - EARC) แบ่งเป็น 8 โซนทั่วประเทศ'}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.433 4.433 0 002.736-2.736m5.936-3.01v0a3 3 0 003.9-3.9v0a3 3 0 00-3.9 3.9z" /></svg>
              </div>
              <strong className="block text-lg font-bold text-slate-800 mb-2">{t('journey_bullet_4_2_strong') || 'พัฒนาศักยภาพครูพี่เลี้ยง'}</strong>
              <p className="text-slate-600 font-light">{t('journey_bullet_4_2_desc') || 'สู่ระดับสูง (Advanced Level) เพื่อให้แต่ละภูมิภาคพึ่งพาตนเองได้ โดยมี TReN ส่วนกลางคอยหนุนเสริม'}</p>
            </div>
          </div>
        </div>
      ),
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-600', // เพิ่ม bgColor ตรงตัว
      borderColor: 'border-orange-600',
    },
    {
      year: t('journey_future_title') || 'พ.ศ. 2571 เป็นต้นไป',
      phase: t('journey_phase_future') || 'ขยายผลสู่ความยั่งยืนระดับประเทศ',
      content: (
        <div className="space-y-6">
          <p className="text-lg text-slate-600 leading-relaxed font-light">
            {t('journey_desc_5_1') || 'ขยายผลกระบวนการวิจัย EAR สู่ครูทั่วประเทศผ่านเครือข่าย TReN พร้อมทั้งประเมินผลกระทบเชิงลึก (Impact Analysis) เพื่อวัดการเปลี่ยนแปลงที่เกิดขึ้นต่อตัวครู ห้องเรียน นักเรียน และชุมชนอย่างเป็นรูปธรรม'}
          </p>
        </div>
      ),
      textColor: 'text-teal-600',
      bgColor: 'bg-teal-600', // เพิ่ม bgColor ตรงตัว
      borderColor: 'border-teal-600',
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-blue-200 pb-20 tracking-wide">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/70 to-transparent -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24 mt-1">
        
        {/* Intro Section */}
        <section className="max-w-4xl mb-20 md:mb-32 relative mx-auto md:mx-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
            {t('journey_main_title') || 'เส้นทางการเติบโต'}
            <span className="block text-3xl md:text-4xl lg:text-5xl text-slate-400 mt-3 font-medium tracking-normal">
              {t('journey_subtitle') || 'TReN Journey'}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mt-6 font-light leading-relaxed max-w-3xl">
            {t('journey_intro_desc') || 'จากจุดเริ่มต้นเล็กๆ ในห้องเรียน สู่การขับเคลื่อนเครือข่ายครูนักวิจัยระดับประเทศ เพื่อยกระดับผลสัมฤทธิ์ของผู้เรียนอย่างยั่งยืน (พ.ศ. 2565 - ปัจจุบัน)'}
          </p>
          <div className="w-20 h-1.5 bg-[#1e3a8a] mt-8 rounded-full"></div>
        </section>

        {/* Editorial Chapter Section */}
        <div className="space-y-0">
          {journeyData.map((item, index) => (
            <div 
              key={index} 
              className={`flex flex-col md:flex-row items-start gap-8 lg:gap-16 py-16 md:py-24 ${index !== 0 ? 'border-t border-slate-200/80' : ''}`}
            >
              
              {/* Left Column: Header (35%) */}
              <div className="md:w-4/12 lg:w-4/12 shrink-0">
                <div className={`text-sm md:text-base font-bold tracking-widest uppercase mb-3 flex items-center gap-3 ${item.textColor}`}>
                  {/* เปลี่ยนมาใช้ item.bgColor แทนการ replace */}
                  <span className={`w-8 h-[2px] ${item.bgColor}`}></span>
                  {item.year}
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-slate-800 leading-[1.5] tracking-tight">
                  {item.phase}
                </h2>
              </div>

              {/* Right Column: Content (65%) */}
              <div className="md:w-8/12 lg:w-8/12">
                {item.content}
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AboutTrenJourney;