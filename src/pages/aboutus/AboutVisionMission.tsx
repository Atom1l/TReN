// import React from 'react';
// import { useLanguage } from '../../contexts/LanguageContext'; // ปรับพาธให้ตรงกับโปรเจกต์ของคุณ

// const AboutVisionMission: React.FC = () => {
//   const { t } = useLanguage();

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-blue-200">
//       {/* Decorative Background */}
//       <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/70 to-transparent -z-10 pointer-events-none"></div>

//       <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24 space-y-24 md:space-y-32 mt-2">

//         {/* Intro Section - Editorial Layout */}
//         <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
//           <div className="lg:col-span-5 relative">
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
//               {t('vision_about_tren_title') || 'TReN'}
//               <span className="block text-2xl md:text-3xl text-slate-400 mt-2 font-medium tracking-normal">
//                 {t('vision_about_tren_subtitle') || 'เครือข่ายวิจัยครู'}
//               </span>
//             </h1>
//             <div className="w-16 h-1.5 bg-[#1e3a8a] mt-8 rounded-full"></div>
//           </div>
//           <div className="lg:col-span-7">
//             {/* เปลี่ยน <p> ด้านนอกเป็น <div> เพื่อไม่ให้ <p> ซ้อน <p> ผิดหลัก HTML */}
//             <div className="text-lg md:text-xl text-slate-800 leading-relaxed font-light tracking-wide">
//               <strong className="font-semibold text-[#1e3a8a]">
//                 {t('vision_about_tren_en_title') || 'Teacher-Research Network'}
//               </strong><br />
//               <p className='mt-2'>
//                 {t('vision_about_tren_desc') || 'เราคือ TReN (Teacher-Research Network) เครือข่ายวิจัยที่ขับเคลื่อนโดยพลังของครู เพื่อแก้ปัญหาในชั้นเรียนด้วยตัวเอง เรามุ่งมั่นพัฒนาทักษะการวิจัยผ่านกระบวนการ Exploratory Action Research (EAR) สร้างชุมชนนักปฏิบัติ (CoP) หรือ EAR Community (EARC) ทั้ง 4 ภูมิภาคทั่วประเทศ และพัฒนาระบบพี่เลี้ยง (Mentorship) เพื่อสร้างระบบนิเวศการเรียนรู้ที่ยั่งยืน เปลี่ยนการแก้ปัญหาในห้องเรียนให้เป็นการวิจัยที่ตอบโจทย์ และยกระดับผลสัมฤทธิ์ของผู้เรียนอย่างแท้จริง'}
//               </p>
//             </div>
//           </div>
//         </section>

//         {/* Vision Section - Bold Statement */}
//         <section className="relative bg-[#1e3a8a] rounded-[2rem] p-10 md:p-16 lg:p-20 overflow-hidden shadow-xl shadow-blue-900/10">
//           {/* Subtle Background Watermark */}
//           <div className="absolute -bottom-12 -right-6 text-[12rem] md:text-[18rem] font-black text-white/5 select-none leading-none tracking-tighter">
//             {t('vision_about_tren_title') || 'TReN'}
//           </div>
//           <div className="relative z-10 max-w-4xl">
//             <p className="text-blue-300 font-semibold tracking-widest uppercase mb-6 text-sm md:text-base flex items-center gap-3">
//               <span className="w-8 h-[1px] bg-blue-300"></span>
//               {t('vision_about_vision') || 'วิสัยทัศน์ (Vision)'}
//             </p>
//             <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight md:leading-snug tracking-wide">
//               {t('vision_about_vision_desc') || '"เครือข่ายวิจัยครูระดับประเทศ ขับเคลื่อนด้วยชุมชนนักปฏิบัติ เพื่อแก้ปัญหาในชั้นเรียนและยกระดับการเรียนรู้ของผู้เรียนอย่างยั่งยืน"'}
//             </h2>
//           </div>
//         </section>

//         {/* Mission Section - Clean Border-Top Style */}
//         <section>
//           <div className="mb-12 md:mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a]">
//               {t('vision_about_mission') || 'พันธกิจ (Mission)'}
//             </h2>
//             <p className="text-slate-500 mt-4 text-lg">
//               {t('vision_about_mission_subtitle') || 'สิ่งที่เรามุ่งมั่นลงมือทำเพื่อขับเคลื่อนการศึกษา'}
//             </p>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
//             {/* Mission 1 */}
//             <div className="group border-t-[3px] border-[#1e3a8a] pt-8 relative hover:-translate-y-2 transition-transform duration-300">
//               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none">
//                 <span className="text-8xl font-black text-blue-600">01</span>
//               </div>
//               <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 relative z-10">
//                 {t('vision_about_empowerment') || 'พัฒนาทักษะ'} <br className="hidden lg:block"/>
//                 <span className="text-[#1e3a8a] text-lg font-medium">{t('vision_about_empowerment_en') || '(Empowerment)'}</span>
//               </h3>
//               <p className="text-slate-800 leading-relaxed relative z-10">
//                 {t('vision_about_empowerment_desc') || 'ส่งเสริมความรู้ความเข้าใจและทักษะการทำ Exploratory Action Research (EAR) เพื่อให้ครูสามารถนำไปใช้แก้ปัญหาในห้องเรียนได้จริง'}
//               </p>
//             </div>
            
//             {/* Mission 2 */}
//             <div className="group border-t-[3px] border-emerald-500 pt-8 relative hover:-translate-y-2 transition-transform duration-300">
//               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none">
//                 <span className="text-8xl font-black text-emerald-500">02</span>
//               </div>
//               <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 relative z-10">
//                 {t('vision_about_community') || 'สร้างเครือข่าย'} <br className="hidden lg:block"/>
//                 <span className="text-emerald-600 text-lg font-medium">{t('vision_about_community_en') || '(Community)'}</span>
//               </h3>
//               <p className="text-slate-800 leading-relaxed relative z-10">
//                 {t('vision_about_community_desc') || 'ขยายชุมชนนักปฏิบัติ (CoP) หรือ EAR Community (EARC) ทั่วประเทศ เพื่อเป็นพื้นที่แลกเปลี่ยนเรียนรู้ร่วมกัน'}
//               </p>
//             </div>
            
//             {/* Mission 3 */}
//             <div className="group border-t-[3px] border-orange-500 pt-8 relative hover:-translate-y-2 transition-transform duration-300">
//               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none">
//                 <span className="text-8xl font-black text-orange-500">03</span>
//               </div>
//               <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 relative z-10">
//                 {t('vision_about_sustainability') || 'สร้างความยั่งยืน'} <br className="hidden lg:block"/>
//                 <span className="text-orange-600 text-lg font-medium">{t('vision_about_sustainability_en') || '(Sustainability)'}</span>
//               </h3>
//               <p className="text-slate-800 leading-relaxed relative z-10">
//                 {t('vision_about_sustainability_desc') || 'พัฒนาระบบพี่เลี้ยงและยกระดับศักยภาพของครู เพื่อให้การจัดการเรียนรู้และการทำวิจัยในห้องเรียนขับเคลื่อนได้อย่างต่อเนื่องและยั่งยืน'}
//               </p>
//             </div>
//           </div>
//         </section>

//         {/* Objectives Section - List Row Style */}
//         <section className="bg-white rounded-[2rem] border border-slate-200 p-8 md:p-12 lg:p-16 shadow-sm">
//           <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-12">
//             {t('vision_about_core_objectives') || 'ภารกิจหลัก (Core Objectives)'}
//           </h2>
          
//           <div className="space-y-10 md:space-y-12">
//             {/* Objective 1 */}
//             <div className="flex flex-col md:flex-row gap-4 md:gap-10">
//               <div className="md:w-1/3 lg:w-1/4 shrink-0">
//                 <div className="text-xs font-bold tracking-widest text-[#1e3a8a] uppercase mb-1">
//                   {t('vision_about_goal_01') || 'เป้าหมายที่ 01'}
//                 </div>
//                 <h4 className="text-lg md:text-xl font-bold text-slate-800">
//                   {t('vision_about_obj1_en') || 'Ecosystem & Support'}
//                 </h4>
//               </div>
//               <div className="md:w-2/3 lg:w-3/4">
//                 <h5 className="font-semibold text-slate-800 mb-2">
//                   {t('vision_about_obj1_th') || 'สร้างระบบนิเวศและการสนับสนุน'}
//                 </h5>
//                 <p className="text-slate-800 leading-relaxed">
//                   {t('vision_about_obj1_desc') || 'ออกแบบหลักสูตรและสร้างระบบพี่เลี้ยง (Mentorship) เพื่อให้คำปรึกษาเชิงลึก'}
//                 </p>
//               </div>
//             </div>

//             <div className="w-full h-px bg-slate-100"></div>

//             {/* Objective 2 */}
//             <div className="flex flex-col md:flex-row gap-4 md:gap-10">
//               <div className="md:w-1/3 lg:w-1/4 shrink-0">
//                 <div className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-1">
//                   {t('vision_about_goal_02') || 'เป้าหมายที่ 02'}
//                 </div>
//                 <h4 className="text-lg md:text-xl font-bold text-slate-800">
//                   {t('vision_about_obj2_en') || 'Network & Community'}
//                 </h4>
//               </div>
//               <div className="md:w-2/3 lg:w-3/4">
//                 <h5 className="font-semibold text-slate-800 mb-2">
//                   {t('vision_about_obj2_th') || 'ขยายเครือข่ายและพื้นที่แลกเปลี่ยนเรียนรู้'}
//                 </h5>
//                 <p className="text-slate-800 leading-relaxed">
//                   {t('vision_about_obj2_desc') || 'จัดตั้งพื้นที่ CoP (EAR Community - EARC) ทั่วประเทศ และจัดเวทีแลกเปลี่ยนเรียนรู้เพื่อสร้างแรงบันดาลใจ'}
//                 </p>
//               </div>
//             </div>

//             <div className="w-full h-px bg-slate-100"></div>

//             {/* Objective 3 */}
//             <div className="flex flex-col md:flex-row gap-4 md:gap-10">
//               <div className="md:w-1/3 lg:w-1/4 shrink-0">
//                 <div className="text-xs font-bold tracking-widest text-orange-600 uppercase mb-1">
//                   {t('vision_about_goal_03') || 'เป้าหมายที่ 03'}
//                 </div>
//                 <h4 className="text-lg md:text-xl font-bold text-slate-800">
//                   {t('vision_about_obj3_en') || 'Sustainability & Impact'}
//                 </h4>
//               </div>
//               <div className="md:w-2/3 lg:w-3/4">
//                 <h5 className="font-semibold text-slate-800 mb-2">
//                   {t('vision_about_obj3_th') || 'ขับเคลื่อนความยั่งยืนและการนำไปใช้'}
//                 </h5>
//                 <p className="text-slate-800 leading-relaxed">
//                   {t('vision_about_obj3_desc') || 'จัดทำคลังความรู้จาก Best Practices และผลักดันให้เกิดวัฒนธรรมวิจัยในสถานศึกษาอย่างแท้จริง'}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>

//       </div>
//     </div>
//   );
// };

// export default AboutVisionMission;


import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AboutVisionMission: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-[#F8FAFC] font-sans selection:bg-blue-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 md:pt-24">
        
        {/* 1. Intro Section - อธิบาย TReN คืออะไร */}
        <section className="mb-20 md:mb-22">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
              {t('vision_about_tren_title') || 'TReN'}
              <span className="block text-2xl md:text-3xl text-slate-400 mt-2 font-medium tracking-normal">
                {t('vision_about_tren_subtitle') || 'เครือข่ายวิจัยครู'}
              </span>
            </h1>
            <div className="w-20 h-1.5 bg-[#1e3a8a] mt-8 mb-8 rounded-full"></div>
            
            <div className="text-xl md:text-2xl text-slate-800 leading-relaxed font-light tracking-wide space-y-8">
              <p>
                <strong className="font-semibold text-[#1e3a8a]">TReN (Teacher-Research Network)</strong> {t('vision_about_tren_desc_1') || 'คือเครือข่ายวิจัยที่ขับเคลื่อนโดยพลังของครู มุ่งมั่นยกระดับศักยภาพครูไทยให้สามารถแก้ปัญหาในชั้นเรียนได้ด้วยตัวเองอย่างตรงจุด ผ่านการทำวิจัยในชั้นเรียนที่เรียกว่า Exploratory Action Research (EAR) หรือการวิจัยเชิงปฏิบัติการเชิงสำรวจ ที่เน้นการนำข้อมูลและหลักฐานจริงจากห้องเรียนมาใช้พัฒนาการเรียนการสอน'}
              </p>
              
              <div>
                <strong className="font-semibold text-[#1e3a8a] block mb-3 text-2xl">
                  {t('vision_about_channels_title') || 'ช่องทางการเรียนรู้และการเข้าร่วม'}
                </strong>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-[#1e3a8a] mr-3 mt-1.5 text-2xl leading-none">&bull;</span>
                    <p>
                      <strong className="font-semibold text-[#1e3a8a]">{t('vision_about_target_general') || 'ครูทั่วไป:'}</strong> {t('vision_about_target_general_desc') || 'สามารถศึกษาแนวคิด และกระบวนการทำวิจัย EAR ได้ด้วยตนเองผ่านคลังความรู้บนเว็บไซต์นี้'}
                    </p>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#1e3a8a] mr-3 mt-1.5 text-2xl leading-none">&bull;</span>
                    <p>
                      <strong className="font-semibold text-[#1e3a8a]">{t('vision_about_target_selected') || 'ครูที่ได้รับคัดเลือกเข้าร่วมการอบรม:'}</strong> {t('vision_about_target_selected_desc') || 'จะได้เรียนรู้กระบวนการทำวิจัยอย่างเป็นขั้นตอนแบบเข้มข้น โดยมี "ครูพี่เลี้ยงวิจัย" คอยให้คำแนะนำและดูแลอย่างใกล้ชิดตลอดการทำวิจัย'}
                    </p>
                  </li>
                </ul>
              </div>

              <p>
                {t('vision_about_tren_desc_2') || 'TReN เป็นชุมชนนักปฏิบัติ (CoP) ที่เชื่อมโยงครูผู้สอนใน 4 ภูมิภาคทั่วประเทศเข้าด้วยกัน พร้อมสนับสนุนและเปิดพื้นที่ให้คุณครูได้พัฒนาวิชาชีพ แลกเปลี่ยนประสบการณ์ สร้างมิตรภาพกับเพื่อนครู และจับมือร่วมกันพัฒนาการศึกษาไทยในอนาคต'}
              </p>
            </div>
          </div>
        </section>

        {/* 2. Big Headline Section - เน้นหัวข้อตัวใหญ่ */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
            {t('vision_about_vision_headline') || 'วิสัยทัศน์'} <span>{t('vision_about_mission_headline') || 'พันธกิจ'}</span> และ  {t('vision_about_core_objectives_headline') || 'ภารกิจหลัก'}
          </h2>
        </section>

        {/* 3. Details Section - จัดฟอร์มให้คล้ายกัน เน้นเส้น ไม่มีกล่อง */}
        <div className="space-y-0">
          
          {/* --- Vision --- */}
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8 lg:gap-16 py-12 border-t border-slate-300">
            <div className="md:w-3/12 lg:w-3/12 shrink-0">
              <h3 className="text-3xl font-bold text-[#1e3a8a] tracking-tight">
                {t('vision_about_vision') || 'วิสัยทัศน์'}
                <span className="block text-base text-xl text-slate-400 font-medium uppercase tracking-widest mt-1">{t('vision_about_vision_subhead') || 'Vision'}</span>
              </h3>
            </div>
            <div className="md:w-9/12 lg:w-9/12">
              <p className="text-2xl text-slate-800 font-light leading-relaxed">
                {t('vision_about_vision_desc') || 'เครือข่ายวิจัยครูระดับประเทศ ขับเคลื่อนด้วยชุมชนนักปฏิบัติ เพื่อแก้ปัญหาในชั้นเรียนและยกระดับการเรียนรู้ของผู้เรียนอย่างยั่งยืน'}
              </p>
            </div>
          </div>

          {/* --- Mission --- */}
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8 lg:gap-16 py-12 border-t border-slate-300">
            <div className="md:w-3/12 lg:w-3/12 shrink-0">
              <h3 className="text-3xl font-bold text-[#1e3a8a] tracking-tight">
                {t('vision_about_mission') || 'พันธกิจ'}
                <span className="block text-base text-xl text-slate-400 font-medium uppercase tracking-widest mt-1">{t('vision_about_mission_subhead') || 'Mission'}</span>
              </h3>
            </div>
            <div className="md:w-9/12 lg:w-9/12">
              <div className="space-y-10">
                {/* Item 1 */}
                <div>
                  <h4 className="text-2xl font-bold text-[#1e3a8a] mb-3 flex items-center gap-4">
                    <span className="text-[#1e3a8a]">01.</span>
                    {t('vision_about_empowerment') || 'พัฒนาทักษะ'} <span className="text-slate-500 font-medium text-xl">{t('vision_about_empowerment_en') || '(Empowerment)'}</span>
                  </h4>
                  <p className="text-2xl text-slate-800 font-light leading-relaxed md:pl-12">
                    {t('vision_about_empowerment_desc') || 'ส่งเสริมความรู้ความเข้าใจและทักษะการทำ Exploratory Action Research (EAR) เพื่อให้ครูสามารถนำไปใช้แก้ปัญหาในห้องเรียนได้จริง'}
                  </p>
                </div>
                {/* Item 2 */}
                <div>
                  <h4 className="text-2xl font-bold text-[#1e3a8a] mb-3 flex items-center gap-4">
                    <span className="text-[#1e3a8a]">02.</span>
                    {t('vision_about_community') || 'สร้างเครือข่าย'} <span className="text-slate-500 font-medium text-xl">{t('vision_about_community_en') || '(Community)'}</span>
                  </h4>
                  <p className="text-2xl text-slate-800 font-light leading-relaxed md:pl-12">
                    {t('vision_about_community_desc') || 'ขยายชุมชนนักปฏิบัติ (CoP) หรือ EAR Community (EARC) ทั่วประเทศ เพื่อเป็นพื้นที่แลกเปลี่ยนเรียนรู้ร่วมกัน'}
                  </p>
                </div>
                {/* Item 3 */}
                <div>
                  <h4 className="text-2xl font-bold text-[#1e3a8a] mb-3 flex items-center gap-4">
                    <span className="text-[#1e3a8a]">03.</span>
                    {t('vision_about_sustainability') || 'สร้างความยั่งยืน'} <span className="text-slate-500 font-medium text-xl">{t('vision_about_sustainability_en') || '(Sustainability)'}</span>
                  </h4>
                  <p className="text-2xl text-slate-800 font-light leading-relaxed md:pl-12">
                    {t('vision_about_sustainability_desc') || 'พัฒนาระบบพี่เลี้ยงและยกระดับศักยภาพของครู เพื่อให้การจัดการเรียนรู้และการทำวิจัยในห้องเรียนขับเคลื่อนได้อย่างต่อเนื่องและยั่งยืน'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* --- Core Objectives --- */}
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8 lg:gap-16 py-12 border-y border-slate-300">
            <div className="md:w-3/12 lg:w-3/12 shrink-0">
              <h3 className="text-3xl font-bold text-[#1e3a8a] tracking-tight">
                {t('vision_about_core_objectives') || 'ภารกิจหลัก'}
                <span className="block text-base text-xl text-slate-400 font-medium uppercase tracking-widest mt-1">{t('vision_about_core_objectives_subhead') || 'Objectives'}</span>
              </h3>
            </div>
            <div className="md:w-9/12 lg:w-9/12">
              <div className="space-y-10">
                {/* Obj 1 */}
                <div>
                   <h4 className="text-2xl font-bold text-[#1e3a8a] mb-3 flex items-center gap-4">
                    <span className="text-[#1e3a8a]">01.</span>
                    {t('vision_about_obj1_th') || 'สร้างระบบนิเวศและการสนับสนุน'}
                  </h4>
                  <p className="text-2xl text-slate-800 font-light leading-relaxed md:pl-12">
                    <span className="font-medium text-xl text-slate-500 block mb-2">{t('vision_about_obj1_en') || 'Ecosystem & Support'}</span>
                    {t('vision_about_obj1_desc') || 'ออกแบบหลักสูตรและสร้างระบบพี่เลี้ยง (Mentorship) เพื่อให้คำปรึกษาเชิงลึก'}
                  </p>
                </div>
                {/* Obj 2 */}
                <div>
                   <h4 className="text-2xl font-bold text-[#1e3a8a] mb-3 flex items-center gap-4">
                    <span className="text-[#1e3a8a]">02.</span>
                    {t('vision_about_obj2_th') || 'ขยายเครือข่ายและพื้นที่แลกเปลี่ยนเรียนรู้'}
                  </h4>
                  <p className="text-2xl text-slate-800 font-light leading-relaxed md:pl-12">
                    <span className="font-medium text-xl text-slate-500 block mb-2">{t('vision_about_obj2_en') || 'Network & Community'}</span>
                    {t('vision_about_obj2_desc') || 'จัดตั้งพื้นที่ CoP (EAR Community - EARC) ทั่วประเทศ และจัดเวทีแลกเปลี่ยนเรียนรู้เพื่อสร้างแรงบันดาลใจ'}
                  </p>
                </div>
                {/* Obj 3 */}
                <div>
                   <h4 className="text-2xl font-bold text-[#1e3a8a] mb-3 flex items-center gap-4">
                    <span className="text-[#1e3a8a]">03.</span>
                    {t('vision_about_obj3_th') || 'ขับเคลื่อนความยั่งยืนและการนำไปใช้'}
                  </h4>
                  <p className="text-2xl text-slate-800 font-light leading-relaxed md:pl-12">
                    <span className="font-medium text-xl text-slate-500 block mb-2">{t('vision_about_obj3_en') || 'Sustainability & Impact'}</span>
                    {t('vision_about_obj3_desc') || 'จัดทำคลังความรู้จาก Best Practices และผลักดันให้เกิดวัฒนธรรมวิจัยในสถานศึกษาอย่างแท้จริง'}
                  </p>
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