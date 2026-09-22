/* eslint-disable react-hooks/static-components */
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AboutEARC: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-[#F8FAFC] font-sans selection:bg-blue-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 md:pt-24 pb-12 mt-14">
        
        {/* Header Section */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
            {t('earc_title') || 'ชุมชนวิจัยครู EAR Community'} 
          </h2>
          <p className="text-xl md:text-2xl text-slate-500 font-medium tracking-wide mt-4 uppercase">
            {t('earc_en_title') || 'EARC'}
          </p>
          <div className="w-20 h-1.5 bg-[#1e3a8a] mt-6 rounded-full"></div>
          
          <p className="mt-8 text-2xl text-slate-800 font-light leading-relaxed max-w-6xl whitespace-pre-line">
            {t('earc_intro_1') || 'จากจุดเริ่มต้นของการบ่มเพาะครูและครูพี่เลี้ยงครอบคลุมกว่า 50 จังหวัดทั่วประเทศตั้งแต่ปี พ.ศ. 2565 เรามุ่งมั่นยกระดับการทำวิจัยปฏิบัติการเชิงสำรวจ (EAR) ให้กลายเป็น '}
            <strong className="font-bold text-[#1e3a8a]">"{t('earc_intro_highlight') || 'วิถีการทำงานและวัฒนธรรมการเรียนรู้ที่ยั่งยืนของครูไทย'}"</strong> 
            {t('earc_intro_2') || ' เพื่อให้ครูทุกคนสามารถวิเคราะห์ แก้ปัญหา และพัฒนาการจัดการเรียนการสอนในห้องเรียนได้ด้วยตนเองอย่างแท้จริงตลอดชีวิตวิชาชีพ'}
          </p>
          <div className="mt-8 p-6 md:p-8 bg-white border-l-[4px] border-[#1e3a8a] rounded-r-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
            <p className="text-xl md:text-2xl text-slate-800 font-light leading-relaxed">
              {t('earc_intro_3') || 'เราจึงจัดตั้ง "EAR Community (EARC)" ขึ้นเพื่อทำหน้าที่เป็นกลไกขับเคลื่อนในระดับพื้นที่ โดยเน้นการสร้าง '}
              <strong className="font-bold text-[#1e3a8a]">"พื้นที่ปลอดภัย (Safe Zone)"</strong>
              {t('earc_intro_4') || ' ที่เปิดกว้างในการรับฟัง ให้คำปรึกษา และแลกเปลี่ยนเรียนรู้จากเคสงานวิจัยจริงของเพื่อนครู เพื่อนำไปปรับใช้แก้ปัญหาในห้องเรียน พร้อมหนุนเสริมให้เกิดชุมชนนักปฏิบัติ (Community of Practice) ที่สามารถดูแล พึ่งพา และพัฒนาศักยภาพร่วมกันได้อย่างยั่งยืน'}
            </p>
          </div>
        </section>

        {/* EARC Details List */}
        <div className="space-y-0">
          
          {/* 1. ภารกิจหลัก */}
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8 lg:gap-16 py-12 border-t border-slate-300">
            <div className="md:w-4/12 lg:w-4/12 shrink-0">
              <h3 className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug flex items-start">
                <span className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug mr-3">1.</span>
                <div>
                  {t('earc_mission_title') || 'ภารกิจหลักในระดับพื้นที่ของ EARC'}
                  <span className="block text-xl text-slate-500 font-medium uppercase tracking-widest mt-2">
                    {t('earc_mission_en') || 'Core Regional Missions'}
                  </span>
                </div>
              </h3>
            </div>
            <div className="md:w-8/12 lg:w-8/12 md:pt-1 space-y-6">
              <ul className="space-y-6">
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span><strong className="font-medium text-[#1e3a8a]">{t('earc_mission_1_title') || 'ขับเคลื่อนการพัฒนาครู:'}</strong> {t('earc_mission_1_desc') || 'จัดกระบวนการบ่มเพาะและพัฒนาครูในท้องถิ่น เพื่อกระจายองค์ความรู้ EAR ให้เข้าถึงครูได้อย่างทั่วถึงและตรงตามบริบทพื้นที่ โดยมีเครือข่ายส่วนกลาง (TReN) คอยเป็นกองหนุนทางวิชาการเพื่อรักษามาตรฐานความรู้'}</span>
                </li>
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span><strong className="font-medium text-[#1e3a8a]">{t('earc_mission_2_title') || 'ยกระดับคุณภาพงานวิจัยและนวัตกรรมในชั้นเรียน:'}</strong> {t('earc_mission_2_desc') || 'ให้คำปรึกษาเพื่อนครูอย่างใกล้ชิด พร้อมช่วยกลั่นกรองและถอดบทเรียนจากห้องเรียนจริง เพื่อให้ผลงานวิจัย EAR มีคุณภาพสูง มีความน่าเชื่อถือทางวิชาการ และนำไปใช้พัฒนาผู้เรียนได้จริง'}</span>
                </li>
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span><strong className="font-medium text-[#1e3a8a]">{t('earc_mission_3_title') || 'พัฒนาวิชาชีพของตนเอง:'}</strong> {t('earc_mission_3_desc') || 'เป็นฐานการเรียนรู้ให้ทีมทำงานและครูพี่เลี้ยงในภูมิภาค ได้พัฒนาทักษะผู้นำการเปลี่ยนแปลง การจัดกระบวนการเรียนรู้ และการบริหารจัดการชุมชน เพื่อยกระดับศักยภาพตนเองและเติบโตในสายวิชาชีพอย่างเป็นระบบ'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 2. กระบวนการขับเคลื่อน */}
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8 lg:gap-16 py-12 border-t border-slate-300">
            <div className="md:w-4/12 lg:w-4/12 shrink-0">
              <h3 className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug flex items-start">
                <span className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug mr-3">2.</span>
                <div>
                  {t('earc_process_title') || 'กระบวนการขับเคลื่อนตลอดภาคการศึกษา'}
                  <span className="block text-xl text-slate-500 font-medium uppercase tracking-widest mt-2">
                    {t('earc_process_en') || 'Driving Process'}
                  </span>
                </div>
              </h3>
            </div>
            <div className="md:w-8/12 lg:w-8/12 md:pt-1 space-y-6">
              <p className="text-2xl text-slate-800 font-light leading-relaxed">
                {t('earc_process_desc') || 'การพัฒนาครูในชุมชน EARC ดำเนินการอย่างเข้มข้นตลอดภาคการศึกษาที่ 1 ผ่าน 3 ขั้นตอนหลัก:'}
              </p>
              <ul className="space-y-6">
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span><strong className="font-medium text-[#1e3a8a]">{t('earc_process_1_title') || '1) EAR Workshop:'}</strong> {t('earc_process_1_desc') || 'เรียนรู้กระบวนการทำวิจัยเชิงปฏิบัติการ EAR ที่เน้นการนำไปใช้จริงในห้องเรียน เครื่องมือเข้าใจง่าย และเห็นผลลัพธ์ชัดเจน'}</span>
                </li>
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span><strong className="font-medium text-[#1e3a8a]">{t('earc_process_2_title') || '2) ลงมือปฏิบัติจริงพร้อมระบบครูพี่เลี้ยง:'}</strong> {t('earc_process_2_desc') || 'ครูนำกระบวนการ EAR ไปใช้แก้ปัญหาผู้เรียนจริง โดยมีครูพี่เลี้ยงในพื้นที่คอยให้คำปรึกษาและดูแลอย่างใกล้ชิดตลอดกระบวนการ'}</span>
                </li>
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span><strong className="font-medium text-[#1e3a8a]">{t('earc_process_3_title') || '3) เวทีถอดบทเรียนและนำเสนอผลงาน (EAR Sharing Session):'}</strong> {t('earc_process_3_desc') || 'แลกเปลี่ยนเรียนรู้ระดับพื้นที่เพื่อประมวลผลการเปลี่ยนแปลงของผู้เรียน ถอดองค์ความรู้จากห้องเรียน สะท้อนคิด และนำเสนอผลการพัฒนาห้องเรียนเมื่อสิ้นสุดกระบวนการ'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 3. การดำเนินงานครอบคลุม 8 เขตพื้นที่ */}
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8 lg:gap-16 py-12 border-y border-slate-300">
            <div className="md:w-4/12 lg:w-4/12 shrink-0">
              <h3 className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug flex items-start">
                <span className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug mr-3">3.</span>
                <div>
                  {t('earc_coverage_title') || 'การดำเนินงานครอบคลุม 8 เขตพื้นที่'}
                  <span className="block text-xl text-slate-500 font-medium uppercase tracking-widest mt-2">
                    {t('earc_coverage_en') || 'Coverage Areas'}
                  </span>
                </div>
              </h3>
            </div>
            <div className="md:w-8/12 lg:w-8/12 md:pt-1 space-y-6">
              <p className="text-2xl text-slate-800 font-light leading-relaxed">
                {t('earc_coverage_desc') || 'เพื่อให้องค์ความรู้ EAR กระจายไปถึงครูในทุกบริบทและเข้าถึงได้ง่ายที่สุด EARC จึงจัดตั้งศูนย์ขับเคลื่อนและส่งต่อองค์ความรู้ครอบคลุม 8 เขตพื้นที่ทั่วประเทศ:'}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                <div className="flex items-center gap-3 text-2xl text-slate-800 font-light">
                  <span className="w-2 h-2 rounded-full bg-[#1e3a8a] shrink-0"></span> {t('earc_zone_north') || 'ภาคเหนือ: ตอนบน / ตอนล่าง'}
                </div>
                <div className="flex items-center gap-3 text-2xl text-slate-800 font-light">
                  <span className="w-2 h-2 rounded-full bg-[#1e3a8a] shrink-0"></span> {t('earc_zone_ne') || 'ภาคตะวันออกเฉียงเหนือ: ตอนบน / ตอนล่าง'}
                </div>
                <div className="flex items-center gap-3 text-2xl text-slate-800 font-light">
                  <span className="w-2 h-2 rounded-full bg-[#1e3a8a] shrink-0"></span> {t('earc_zone_central') || 'ภาคกลาง'}
                </div>
                <div className="flex items-center gap-3 text-2xl text-slate-800 font-light">
                  <span className="w-2 h-2 rounded-full bg-[#1e3a8a] shrink-0"></span> {t('earc_zone_east') || 'ภาคตะวันออก'}
                </div>
                <div className="flex items-center gap-3 text-2xl text-slate-800 font-light">
                  <span className="w-2 h-2 rounded-full bg-[#1e3a8a] shrink-0"></span> {t('earc_zone_south') || 'ภาคใต้: ตอนบน / ตอนล่าง'}
                </div>
                <div className="flex items-center gap-3 text-2xl text-slate-800 font-light">
                  <span className="w-2 h-2 rounded-full bg-[#1e3a8a] shrink-0"></span> {t('earc_zone_bkk') || 'กรุงเทพมหานครและปริมณฑล'}
                </div>
              </div>
            </div>
          </div>
          <p className="text-xl text-slate-500 font-light italic pt-4 text-left">
            {t('earc_see_team_list') || '(สามารถดูรายชื่อคณะทำงานและทีมครูพี่เลี้ยงแต่ละพื้นที่ได้ในหัวข้อที่ 5)'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutEARC;