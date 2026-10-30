import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AboutVisionMission: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-[#F8FAFC] font-sans selection:bg-blue-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 md:pt-24">

        {/* หัวข้อใหญ่ประจำกรอบการทำงาน */}
        <div className="mb-10 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
            {t('const_main_title') || 'กรอบการทำงานของเครือข่าย'}
          </h2>
          <p className="text-2xl md:text-3xl text-slate-500 font-medium tracking-wide mt-2">
            {t('const_main_en_title') || 'TReN Constitution'}
          </p>
          <div className="w-full h-1.5 bg-[#1e3a8a] rounded-full mx-auto md:mx-0 mt-14"></div>
        </div>

        {/* หัวข้อหมวดที่ 1 */}
        <section className="mb-10 mt-16">
          <span className="text-slate-500 font-bold block text-2xl md:text-3xl mb-2">
            {t('const_cat_1') || 'หมวดที่ 1: ข้อมูลทั่วไป'}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
            <span>{t('vision_about_name_headline') || 'ชื่อ'}</span> {t('vision_about_vision_headline') || 'วิสัยทัศน์'} <span> {t('and') || 'และ'} {t('vision_about_mission_headline') || 'พันธกิจ'}</span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-500 font-medium tracking-wide mt-2 uppercase">
            {t('vision_sub_text') || "General Information, Vision and Mission"}
          </p>
        </section>

        {/* รายละเอียด - ใช้เส้นคั่นและแถบสีเพื่อแยกสัดส่วน */}
        <div className="space-y-0 border-t-2 border-[#1e3a8a]">
          
          {/* 💡 เพิ่มส่วน: ชื่อเครือข่าย (Network Name) อยู่ก่อนวิสัยทัศน์ */}
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8 lg:gap-16 py-12 border-b border-slate-300">
            <div className="md:w-3/12 lg:w-3/12 shrink-0">
              <div className="border-l-4 border-[#1e3a8a] pl-4">
                <h3 className="text-3xl font-bold text-[#1e3a8a] tracking-tight">
                  {t('vision_about_name_title') || 'ชื่อเครือข่าย'}
                </h3>
                <span className="block text-xl text-slate-500 font-medium uppercase tracking-widest mt-1">
                  {t('vision_about_name_subhead') || 'Network Name'}
                </span>
              </div>
            </div>
            <div className="md:w-9/12 lg:w-9/12">
              <p className="text-2xl text-slate-800 font-light leading-relaxed">
                <strong className="font-semibold text-[#1e3a8a]">
                  {t('vision_about_network_name_th') || 'เครือข่ายวิจัยครู TReN'}
                </strong>{' '} <br></br>
                <span className="text-slate-600 font-normal">
                  {t('vision_about_network_name_en') || '(Teacher-Research Network)'}
                </span>
              </p>
            </div>
          </div>

          {/* --- วิสัยทัศน์ (Vision) --- */}
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8 lg:gap-16 py-12 border-b border-slate-300">
            <div className="md:w-3/12 lg:w-3/12 shrink-0">
              <div className="border-l-4 border-[#1e3a8a] pl-4">
                <h3 className="text-3xl font-bold text-[#1e3a8a] tracking-tight">
                  {t('vision_about_vision') || 'วิสัยทัศน์'}
                </h3>
                <span className="block text-xl text-slate-500 font-medium uppercase tracking-widest mt-1">
                  {t('vision_about_vision_subhead') || 'Vision'}
                </span>
              </div>
            </div>
            <div className="md:w-9/12 lg:w-9/12">
              <p className="text-2xl text-slate-800 font-light leading-relaxed">
                {t('vision_about_vision_desc') || 'มุ่งเป็นพื้นที่เรียนรู้ร่วมกันของครูไทยทั่วประเทศ ที่สนับสนุนให้ครูใช้การวิจัยปฏิบัติการเชิงสำรวจ (Exploratory Action Research: EAR) เป็นเครื่องมือพัฒนาการเรียนการสอนได้ด้วยตนเองอย่างยั่งยืน'}
              </p>
            </div>
          </div>

          {/* --- พันธกิจ (Mission) --- */}
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8 lg:gap-16 py-12 border-b border-slate-300">
            <div className="md:w-3/12 lg:w-3/12 shrink-0">
              <div className="border-l-4 border-[#1e3a8a] pl-4">
                <h3 className="text-3xl font-bold text-[#1e3a8a] tracking-tight">
                  {t('vision_about_mission') || 'พันธกิจ'}
                </h3>
                <span className="block text-xl text-slate-500 font-medium uppercase tracking-widest mt-1">
                  {t('vision_about_mission_subhead') || 'Mission'}
                </span>
              </div>
            </div>
            <div className="md:w-9/12 lg:w-9/12">
              <div className="space-y-10">
                
                {/* ข้อ 1 */}
                <div className="flex items-start gap-4">
                  <div>
                    <h4 className="text-2xl font-bold text-[#1e3a8a] mb-2">
                      {t('vision_about_empowerment') || 'พัฒนาทักษะ'} <span className="text-slate-500 font-medium text-xl">{t('vision_about_empowerment_en') || '(Empowerment)'}</span>
                    </h4>
                    <p className="text-2xl text-slate-800 font-light leading-relaxed">
                      {t('vision_about_empowerment_desc') || 'ส่งเสริมความรู้ความเข้าใจ ทักษะ และเจตคติเชิงบวกในการทำวิจัย EAR เพื่อให้ครูนำไปใช้แก้ปัญหาในห้องเรียนได้จริง'}
                    </p>
                  </div>
                </div>

                {/* ข้อ 2 */}
                <div className="flex items-start gap-4">
                  <div>
                    <h4 className="text-2xl font-bold text-[#1e3a8a] mb-2">
                      {t('vision_about_community') || 'สร้างเครือข่าย'} <span className="text-slate-500 font-medium text-xl">{t('vision_about_community_en') || '(Community)'}</span>
                    </h4>
                    <p className="text-2xl text-slate-800 font-light leading-relaxed">
                      {t('vision_about_community_desc') || 'ขยายชุมชนนักปฏิบัติ (CoP) หรือ EAR Community (EARC) ทั่วประเทศ เพื่อเป็นพื้นที่แลกเปลี่ยนเรียนรู้ร่วมกัน'}
                    </p>
                  </div>
                </div>

                {/* ข้อ 3 */}
                <div className="flex items-start gap-4">
                  <div>
                    <h4 className="text-2xl font-bold text-[#1e3a8a] mb-2">
                      {t('vision_about_sustainability') || 'สร้างความยั่งยืน'} <span className="text-slate-500 font-medium text-xl">{t('vision_about_sustainability_en') || '(Sustainability)'}</span>
                    </h4>
                    <p className="text-2xl text-slate-800 font-light leading-relaxed">
                      {t('vision_about_sustainability_desc') || 'พัฒนาระบบพี่เลี้ยงและยกระดับศักยภาพของครู เพื่อให้การจัดการเรียนรู้และการทำวิจัยในห้องเรียนขับเคลื่อนได้อย่างต่อเนื่องและยั่งยืน'}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
        
      </div>
    </div>
  );
};

export default AboutVisionMission;