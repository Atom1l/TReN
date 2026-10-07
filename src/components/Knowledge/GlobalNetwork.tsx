/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useLocation } from 'react-router-dom';

const GlobalNetwork = () => {
  const { t } = useLanguage();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    return tabParam || 'resources'; // ถ้าไม่มีให้ใช้ 'resources' เป็นค่าเริ่มต้น
  });
  
  // 💡 State สำหรับควบคุม Pop-up (Modal)
  const [selectedResource, setSelectedResource] = useState<any | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    
    if (tabParam) {
      setActiveTab(tabParam);
      
      // หน่วงเวลาเล็กน้อยเพื่อให้ Layout อัปเดตก่อนเลื่อนจอ
      setTimeout(() => {
        const element = document.getElementById('global-network');
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - 100; // ลบ 100 เผื่อพื้นที่ Navbar
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.search]);

  // ป้องกันการ Scroll หน้าเว็บหลักเวลาเปิด Pop-up
  useEffect(() => {
    if (selectedResource) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedResource]);

  const tabs = [
    { id: 'resources', label: t('global_tab_resources') || '1. คลังงานวิจัย & คู่มือครู' },
    { id: 'mentoring', label: t('global_tab_mentoring') || '2. คู่มือครูพี่เลี้ยง (Mentors)' },
    { id: 'networks', label: t('global_tab_networks') || '3. เครือข่ายการเรียนรู้สากล' },
    { id: 'articles', label: t('global_tab_articles') || '4. บทความวิชาการ & วารสาร' },
    { id: 'tools', label: t('global_tab_tools') || '5. คลังเครื่องมือทำวิจัย' }
  ];

  const resourcesData = [
    {
      title: t('global_res_book1_title') || 'Teacher Research! (E-Book)',
      imgSrc: '../Knowledge/Global_Network/Teacher_Research.JPG',
      detail: t('global_res_book1_detail') || 'รวบรวมเรื่องเล่าการทำวิจัยของครูที่ถ่ายทอดด้วยสไตล์การเขียนที่เป็นมิตร อ่านง่าย พร้อมไฮเปอร์ลิงก์เชื่อมโยงไปยังคลิปวิดีโอ การนำเสนอโปสเตอร์ และสื่อมัลติมีเดียต่างๆ',
      benefit: t('global_res_book1_benefit') || 'ได้เรียนรู้ตัวอย่างการทำวิจัยชั้นเรียนในชีวิตจริงที่ไม่ซับซ้อน เข้าใจแนวคิดการพัฒนาตนเองผ่านการสะท้อนคิด (Reflective Practice) และเทคนิคการนำเสนอผลงานอย่างน่าสนใจ',
      btnText: t('global_res_book1_btn') || 'อ่าน E-Book ฉบับเต็ม (IATEFL ReSIG)',
      link: 'https://resig.weebly.com/uploads/2/6/3/6/26368747/teachers_research__online_version.pdf'
    },
    {
      title: t('global_res_book2_title') || 'Champion Teachers: stories of exploratory action research',
      imgSrc: '../Knowledge/Global_Network/Story_EAR.JPG',
      detail: t('global_res_book2_detail') || 'หนังสือรวบรวมกรณีศึกษาและเรื่องเล่าความสำเร็จของครูที่ใช้วิธีการ EAR ในการแก้ปัญหาจริงในชั้นเรียน',
      benefit: t('global_res_book2_benefit') || 'เข้าใจวิธีการสำรวจต้นตอของปัญหาอย่างถี่ถ้วนก่อนลงมือแก้ไข พร้อมรับแรงบันดาลใจและแนวทางแก้ปัญหาจากครูท่านอื่น',
      btnText: t('global_res_book2_btn') || 'อ่านกรณีศึกษาฉบับเต็ม (British Council)',
      link: 'https://www.teachingenglish.org.uk/sites/teacheng/files/pub_30510_BC%20Explore%20Actions%20Handbook%20ONLINE%20AW.pdf'
    },
    {
      title: t('global_res_book3_title') || 'Camtree Digital Library',
      imgSrc: '../Knowledge/Global_Network/Camtree.webp',
      isLogo: true, 
      detail: t('global_res_book3_detail') || 'คลังทรัพยากรดิจิทัลแบบเข้าถึงฟรี (Open-Access) พัฒนาโดยมหาวิทยาลัย Cambridge รวบรวมผลงานวิจัย EAR ของครูผู้สอนจากโครงการ British Council ทั่วโลก',
      benefit: t('global_res_book3_benefit') || 'ศึกษาตัวอย่างรายงานการปฏิบัติงานจริงในห้องเรียนจากเครือข่ายครูทั่วโลก เพื่อนำไอเดียมาปรับใช้ในบริบทของตนเอง',
      btnText: t('global_res_book3_btn') || 'เข้าสู่คลังงานวิจัย Camtree',
      link: 'https://library.camtree.org/home'
    }
  ];

  return (
    <section id="global-network" className="pt-22 pb-16 bg-[#F8FAFC]">
      <div className="mb-12 flex flex-col items-center text-center mx-auto px-4 border-t-4 border-slate-300 relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight mt-30">
          {t('knowledge_global_title') || 'แหล่งเรียนรู้และเครือข่ายสากล'}
        </h2>
        <p className="text-2xl md:text-3xl text-slate-500 mt-6 font-light tracking-wide leading-relaxed max-w-4xl">
          {t('knowledge_global_desc') || '(Global EAR Resources & Networks)'}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 max-w-4xl mx-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer px-6 py-3 rounded-full font-bold text-xl transition-all shadow-sm ${
                activeTab === tab.id 
                  ? 'bg-[#1e3a8a] text-white' 
                  : 'bg-white text-slate-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 lg:p-16 border border-slate-200 shadow-lg min-h-[500px]">
          
          {/* ================= TAB 1: Resources & Handbook ================= */}
          {activeTab === 'resources' && (
            <div className="animate-fade-in space-y-16">
              <div className="text-center max-w-4xl mx-auto mb-12">
                <h3 className="text-4xl md:text-5xl font-bold text-[#1e3a8a] mb-4 max-w-4xl mx-auto leading-tight">
                  {t('global_resources_title') || 'คลังงานวิจัยครูพี่เลี้ยงและคู่มือการทำวิจัยครู EAR'}
                </h3>
                <p className="text-xl md:text-2xl text-slate-800 leading-relaxed font-light max-w-2xl mx-auto">
                  {t('global_resources_desc') || 'แหล่งรวบรวมงานวิจัยในชั้นเรียน (Classroom Action Research)...'}
                </p>
              </div>

              {/* 1.1 Stories of Teacher Research */}
              <div className="space-y-10">
                <h4 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] border-l-4 border-[#1e3a8a] pl-4">
                  {t('global_res_1_1_title') || '1.1 ตัวอย่างและเรื่องเล่าการทำวิจัยของครู'}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {resourcesData.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 flex flex-col h-full hover:shadow-xl transition-all duration-300 group">
                      
                      {/* Image Area */}
                      {item.isLogo ? (
                        <div className="w-full h-56 bg-slate-50 rounded-2xl shadow-inner mb-6 flex items-center justify-center p-6 border border-slate-100">
                           <img src={item.imgSrc} alt={item.title} className="max-w-full max-h-full object-contain" />
                        </div>
                      ) : (
                         <div className="relative w-full h-56 mb-6 rounded-2xl shadow-sm overflow-hidden bg-[#1e3a8a]">
                            <img 
                                src={item.imgSrc} 
                                alt={item.title} 
                                className="w-full h-full object-cover relative z-10" 
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                            />
                            {/* Fallback Icon */}
                            <div className="hidden absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center z-0">
                                <div className="w-16 h-16 mb-3 opacity-50">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                                    </svg>
                                </div>
                                <span className="font-bold text-lg">{item.title}</span>
                            </div>
                        </div>
                      )}
                      
                      {/* Title Area */}
                      <h5 className="font-bold text-[#1e3a8a] text-2xl mb-4 flex-grow line-clamp-2" title={item.title}>{item.title}</h5>
                      
                      {/* 💡 ปุ่มกดเพื่อเปิด Pop-up */}
                      <button 
                        onClick={() => setSelectedResource(item)}
                        className="mt-auto w-full flex items-center justify-center gap-2 bg-[#1e3a8a] text-white py-3.5 rounded-xl font-bold text-lg cursor-pointer"
                      >
                        {t('view_details_btn') || 'ดูรายละเอียด'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-slate-200" />

              {/* 1.2 Handbook */}
              <div id="ear-handbook" className="max-w-7xl mx-auto flex flex-col pt-8">     
                
                {/* 💡 1. ปรับหัวข้อและคำเปรยให้ชิดซ้าย และใส่เส้นขอบซ้ายเหมือน 1.1 */}
                <div className="mb-10">
                    <h4 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] border-l-4 border-[#1e3a8a] pl-4 mb-6 leading-tight">
                        1.2 {t('knowledge_handbook_heading') || 'คู่มือการทำ Exploratory Action Research (EAR)'}
                    </h4>
                    <p className="text-xl md:text-2xl text-slate-700 font-light leading-relaxed max-w-4xl">
                        {t('knowledge_handbook_desc_1') || 'การอบรมและการทำวิจัย EAR ในเครือข่ายอ้างอิงจาก '}
                        <em className="font-medium text-[#1e3a8a] italic">
                        {t('knowledge_handbook_name') || 'A Handbook for Exploratory Action Research'}
                        </em>
                        {' '}<span className='font-medium'>{t('knowledge_handbook_desc_1_1')}</span> {t('and')} <span className='font-medium'>{t('knowledge_handbook_desc_1_2')}</span>{' '}
                        {t('knowledge_handbook_desc_2') || 'สมาชิกและคุณครูที่สนใจสามารถใช้คู่มือเล่มนี้เพื่อฝึกปฏิบัติจริง หรือใช้เป็นเครื่องมือทบทวนความรู้ด้วยตนเองได้ตลอดเวลา'}
                    </p>
                </div>

                {/* 💡 2. ปรับ Layout หนังสือเป็น Horizontal Card (รูปซ้าย เนื้อหาขวา) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* ฉบับภาษาไทย (Coming Soon) */}
                    <div className="flex flex-col sm:flex-row bg-slate-50/50 p-6 md:p-8 rounded-3xl border border-slate-200 gap-6 lg:gap-8 items-start">
                        {/* ปกหนังสือ */}
                        <div className="w-full sm:w-2/5 max-w-[180px] mx-auto sm:mx-0 aspect-[3/4] bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center shrink-0 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-slate-300 mb-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                            </svg>
                            <span className="text-slate-400 font-medium text-lg">Coming Soon</span>
                        </div>
                        
                        {/* รายละเอียด */}
                        <div className="flex flex-col flex-1 h-full text-center sm:text-left">
                            <h5 className="text-2xl md:text-3xl font-bold text-[#1e3a8a] mb-4">
                                {t('knowledge_handbook_th_version') || 'ฉบับภาษาไทย'}
                            </h5>
                            <p className="text-lg md:text-xl text-slate-500 italic mb-6 leading-relaxed flex-grow">
                                {t('knowledge_handbook_th_desc_1') || 'คู่มือทำวิจัย EAR ฉบับภาษาไทย อยู่ระหว่าง'} {t('knowledge_handbook_th_desc_2') || 'การแปลและจัดทำ เตรียมพบกันเร็วๆ นี้'}
                            </p>
                            
                            <button disabled className="mt-auto inline-flex justify-center sm:justify-start items-center w-full sm:w-fit gap-2 bg-slate-200 text-slate-400 px-6 py-3.5 rounded-xl font-bold text-lg cursor-not-allowed">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg>
                                {t('knowledge_handbook_btn_read') || 'คลิกเพื่ออ่าน'}
                            </button>
                        </div>
                    </div>

                    {/* ฉบับภาษาอังกฤษ */}
                    <div className="flex flex-col sm:flex-row bg-blue-50/40 p-6 md:p-8 rounded-3xl border border-blue-100 gap-6 lg:gap-8 items-start hover:shadow-md transition-shadow">
                        {/* ปกหนังสือ */}
                        <a 
                            href="https://www.teachingenglish.org.uk/sites/teacheng/files/pub_30510_BC%20Explore%20Actions%20Handbook%20ONLINE%20AW.pdf" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full sm:w-2/5 max-w-[180px] mx-auto sm:mx-0 shrink-0 block relative transition-transform duration-500 hover:scale-105"
                        >
                            <img 
                                src="Ear_learning_clips/Handbook.JPG" 
                                alt="EAR Handbook Cover" 
                                className="w-full h-auto aspect-[3/4] object-cover rounded-xl shadow-md border border-slate-200"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                            />
                            <div className="hidden w-full aspect-[3/4] bg-[#1e3a8a] rounded-xl shadow-md border border-slate-200 flex flex-col items-center justify-center p-4 text-white text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-3 opacity-50">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                                </svg>
                                <span className="font-bold text-lg leading-tight">A Handbook for EAR</span>
                            </div>
                        </a>
                        
                        {/* รายละเอียด */}
                        <div className="flex flex-col flex-1 h-full text-center sm:text-left">
                            <h5 className="text-2xl md:text-3xl font-bold text-[#1e3a8a] mb-4">
                                {t('knowledge_handbook_en_version') || 'ฉบับภาษาอังกฤษ'}
                            </h5>
                            <p className="text-lg md:text-xl text-slate-600 mb-6 leading-relaxed font-light flex-grow">
                                {t('knowledge_handbook_en_desc') || '(A Handbook for Exploratory Action Research)'}
                            </p>
                            
                            <a 
                                href="https://www.teachingenglish.org.uk/sites/teacheng/files/pub_30510_BC%20Explore%20Actions%20Handbook%20ONLINE%20AW.pdf" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="mt-auto inline-flex justify-center sm:justify-start items-center w-full sm:w-fit gap-3 bg-[#1e3a8a] text-white px-6 py-3.5 rounded-xl font-bold text-lg shadow-sm hover:bg-blue-900 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                                {t('knowledge_handbook_btn_read') || 'คลิกเพื่ออ่าน'}
                            </a>
                        </div>
                    </div>

                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: Mentoring ================= */}
          {activeTab === 'mentoring' && (
            <div className="animate-fade-in space-y-16">
               <div className="text-center max-w-4xl mx-auto mb-12">
                <h3 className="text-4xl md:text-5xl font-bold text-[#1e3a8a] mb-6">{t('global_mentoring_title')}</h3>
                <p className="text-xl md:text-2xl text-slate-800 leading-relaxed font-light">{t('global_mentoring_desc')}</p>
              </div>

              <div className="space-y-12 max-w-5xl mx-auto">
                 {/* 2.1 Stories of Mentoring (แนวนอน) */}
                 <div className="flex flex-col md:flex-row bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                    
                    {/* ฝั่งรูปภาพ (ซ้าย) */}
                    <div className="w-full md:w-2/6 relative bg-[#1e3a8a] min-h-[300px] shrink-0">
                        <img 
                            src="../Knowledge/Global_Network/Story_MTR.JPG" 
                            alt="Stories of Mentoring" 
                            className="absolute inset-0 w-full h-full object-cover z-10" 
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                        />
                         {/* Fallback Icon */}
                         <div className="hidden absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center z-0">
                            <div className="w-16 h-16 mb-4 opacity-50">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                                </svg>
                            </div>
                            <span className="font-bold text-2xl">{t('global_men_2_1_title')}</span>
                        </div>
                    </div>

                    {/* ฝั่งเนื้อหา (ขวา) */}
                    <div className="w-full p-8 md:p-10 flex flex-col justify-center">
                        <h4 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-6 leading-tight">{t('global_men_2_1_title')}</h4>
                        
                        <div className="space-y-6 flex-grow">
                          <div>
                            <span className="block font-bold text-[#1e3a8a] text-xl md:text-2xl mb-2">{t('global_detail_label')}</span>
                            <p className="text-slate-800 text-xl md:text-2xl font-light leading-relaxed">{t('global_men_2_1_detail')}</p>
                          </div>
                          
                          <div>
                            <span className="block font-bold text-[#1e3a8a] text-xl md:text-2xl mb-2">{t('global_benefit_label')}</span>
                            <p className="text-slate-800 text-xl md:text-2xl font-light leading-relaxed">{t('global_men_2_1_benefit')}</p>
                          </div>
                        </div>

                        <div className="mt-4 pt-6 border-t border-slate-100">
                          <a href="https://mentrnet.net/wp-content/uploads/2026/05/Smith-Eraldemir-Tuyan-Serra-Bekes-2024-published-version.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 bg-[#1e3a8a] text-white px-8 py-4 rounded-xl font-bold text-xl hover:bg-blue-800 hover:-translate-y-1 transition-all shadow-md">
                            {t('global_men_2_1_btn')}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                          </a>
                        </div>
                    </div>
                 </div>

                 {/* 2.2 Mentoring Handbook (แนวนอน) */}
                 <div className="flex flex-col md:flex-row bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                    
                    {/* ฝั่งรูปภาพ (ซ้าย) */}
                    <div className="w-full md:w-2/6 relative bg-[#1e3a8a] min-h-[300px] shrink-0">
                        <img 
                            src="../Knowledge/Global_Network/Mentor_Teacher.JPG" 
                            alt="Mentoring Handbook" 
                            className="absolute inset-0 w-full h-full object-cover z-10" 
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                        />
                         {/* Fallback Icon */}
                         <div className="hidden absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center z-0">
                            <div className="w-16 h-16 mb-4 opacity-50">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                                </svg>
                            </div>
                            <span className="font-bold text-2xl">{t('global_men_2_2_title')}</span>
                        </div>
                    </div>

                    {/* ฝั่งเนื้อหา (ขวา) */}
                    <div className="w-full p-8 md:p-10 flex flex-col justify-center">
                        <h4 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-6 leading-tight">{t('global_men_2_2_title')}</h4>
                        
                        <div className="space-y-6 flex-grow">
                          <div>
                            <span className="block font-bold text-[#1e3a8a] text-xl md:text-2xl mb-2">{t('global_detail_label')}</span>
                            <p className="text-slate-800 text-xl md:text-2xl font-light leading-relaxed">{t('global_men_2_2_detail')}</p>
                          </div>
                          
                          <div>
                            <span className="block font-bold text-[#1e3a8a] text-xl md:text-2xl mb-2">{t('global_benefit_label')}</span>
                            <p className="text-slate-800 text-xl md:text-2xl font-light leading-relaxed">{t('global_men_2_2_benefit')}</p>
                          </div>
                        </div>

                        <div className="mt-4 pt-6 border-t border-slate-100">
                          <a href="https://www.britishcouncil.in/sites/default/files/mentoring_teachers_to_research_their_classrooms_a_practical_handbook.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 bg-[#1e3a8a] text-white px-8 py-4 rounded-xl font-bold text-xl hover:bg-blue-800 hover:-translate-y-1 transition-all shadow-md">
                            {t('global_men_2_2_btn')}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                          </a>
                        </div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: Networks ================= */}
          {activeTab === 'networks' && (
             <div className="animate-fade-in space-y-12">
               <div className="text-center max-w-4xl mx-auto mb-12">
                <h3 className="text-4xl md:text-5xl font-bold text-[#1e3a8a] mb-4">{t('global_networks_title')}</h3>
                <p className="text-xl md:text-2xl text-slate-800 leading-relaxed font-light">{t('global_networks_desc')}</p>
              </div>

              <div className="space-y-8">
                 {/* IATEFL */}
                 <div className="flex flex-col md:flex-row gap-8 bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow items-center">
                    <div className="w-full md:w-1/3 flex justify-center p-6 rounded-2xl">
                       <img src="../Knowledge/Global_Network/Iatefl.webp" alt="IATEFL ReSIG" className="max-w-[200px] h-auto object-contain" onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/200x100?text=IATEFL'} />
                    </div>
                    <div className="w-full md:w-2/3 space-y-4">
                       <h4 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] border-l-4 border-[#1e3a8a] pl-4">{t('global_net_3_1_title')}</h4>
                       <p className="py-4 text-xl md:text-2xl text-slate-800 font-light"><strong className="text-[#1e3a8a] font-bold">{t('global_detail_label')}</strong> {t('global_net_3_1_detail')}</p>
                       <p className="text-xl md:text-2xl text-slate-800 font-light"><strong className="text-[#1e3a8a] font-bold">{t('global_benefit_label')}</strong> {t('global_net_3_1_benefit')}</p>
                       <div className="pt-4">
                         <a href="https://x.com/IATEFLResig" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#1e3a8a] text-white px-8 py-4 rounded-full font-bold text-xl">{t('global_net_3_1_btn')}</a>
                       </div>
                    </div>
                 </div>

                 {/* MenTRnet */}
                 <div className="flex flex-col md:flex-row gap-8 bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow items-center">
                    <div className="w-full md:w-1/3 flex justify-center p-6 rounded-2xl">
                       <img src="../Knowledge/Global_Network/Mentrnet.webp" alt="MenTRnet" className="max-w-[150px] h-auto object-contain" onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/200x100?text=MenTRnet'} />
                    </div>
                    <div className="w-full md:w-2/3 space-y-4">
                       <h4 className="text-3xl md:text-4xl font-bold text-[#1e3a8a]  border-l-4 border-[#1e3a8a]  pl-4">{t('global_net_3_2_title')}</h4>
                       <p className="py-4 text-xl md:text-2xl text-slate-800 font-light"><strong className="text-[#1e3a8a] font-bold">{t('global_detail_label')}</strong> {t('global_net_3_2_detail')}</p>
                       <p className="text-xl md:text-2xl text-slate-800 font-light"><strong className="text-[#1e3a8a] font-bold">{t('global_benefit_label')}</strong> {t('global_net_3_2_benefit')}</p>
                       <div className="pt-4">
                         <a href="https://mentrnet.net" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#1e3a8a] text-white px-8 py-4 rounded-full font-bold text-xl">{t('global_net_3_2_btn')}</a>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* ================= TAB 4: Articles & Journals ================= */}
          {activeTab === 'articles' && (
            <div className="animate-fade-in space-y-12">
               <div className="text-center max-w-4xl mx-auto mb-12">
                <h3 className="text-4xl md:text-5xl font-bold text-[#1e3a8a] mb-4 max-w-xl mx-auto">{t('global_articles_title')}</h3>
                <p className="text-xl md:text-2xl text-slate-800 leading-relaxed font-light max-w-2xl mx-auto">{t('global_articles_desc')}</p>
              </div>

              <div className="space-y-10">
                 <h4 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] border-l-4 border-[#1e3a8a] pl-4">{t('global_art_4_1_title')}</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-100 p-8 rounded-2xl border border-slate-200 hover:border-blue-300 transition-colors flex flex-col h-full">
                       <h5 className="text-2xl font-bold text-[#1e3a8a] mb-2">{t('global_art_book1_title')}</h5>
                       <p className="text-base text-lg text-slate-800 mb-4">(Burns, 2023)</p>
                       <p className="text-lg md:text-xl text-slate-800 font-normal mb-6 flex-grow">{t('global_art_book1_detail')}</p>
                       <a href="https://www.teachingenglish.org.uk/sites/teacheng/files/2023-10/Pub_Exploratory_action_research_in_thai_schools.pdf" target="_blank" rel="noopener noreferrer" className="text-[#1e3a8a] font-bold text-xl underline mt-auto">{t('global_art_book1_btn')} &rarr;</a>
                    </div>
                    <div className="bg-blue-100 p-8 rounded-2xl border border-slate-200 hover:border-blue-300 transition-colors flex flex-col h-full">
                       <h5 className="text-2xl font-bold text-[#1e3a8a] mb-2">{t('global_art_book2_title')}</h5>
                       <p className="text-base text-lg text-slate-800 mb-4">(Dersingh & Vuong, 2024)</p>
                       <p className="text-lg md:text-xl text-slate-800 font-normal mb-6 flex-grow">{t('global_art_book2_detail')}</p>
                       <a href="https://so07.tci-thaijo.org/index.php/PasaaParitat/article/view/5466/3928" target="_blank" rel="noopener noreferrer" className="text-[#1e3a8a] font-bold text-xl underline mt-auto">{t('global_art_book2_btn')} &rarr;</a>
                    </div>
                 </div>

                 <hr className="border-slate-200" />

                 <h4 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] border-l-4 border-[#1e3a8a] pl-4">{t('global_art_4_2_title')}</h4>
                 <div className="bg-white border border-slate-200 p-8 md:p-12 rounded-3xl shadow-sm flex flex-col md:flex-row gap-8 items-center">
                     <div className="w-full md:w-1/4 flex justify-center p-6 rounded-2xl">
                       <img src="../Knowledge/Global_Network/Eltcrj.webp" alt="ELTCRJ" className="max-w-[200px] object-contain" onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/150x150?text=ELTCRJ'} />
                     </div>
                     <div className="w-full md:w-3/4 space-y-4">
                        <h5 className="text-3xl md:text-4xl font-bold text-[#1e3a8a]">{t('global_art_j1_title')}</h5>
                        <p className="py-4 text-xl md:text-2xl text-slate-800 font-light"><strong className="text-[#1e3a8a] font-bold">{t('global_detail_label')}</strong> {t('global_art_j1_detail')}</p>
                        <p className="text-xl md:text-2xl text-slate-800 font-light rounded-xl"><strong className="text-[#1e3a8a] font-bold">{t('global_benefit_label')}</strong> {t('global_art_j1_benefit')}</p>
                        <div className="pt-4">
                           <a href="https://eltcrj.com/v2-i1-htut/" target="_blank" rel="noopener noreferrer" className="text-[#1e3a8a] font-bold text-2xl underline">{t('global_art_j1_btn')} &rarr;</a>
                        </div>
                     </div>
                 </div>
              </div>
            </div>
          )}

          {/* ================= TAB 5: Tools & Templates ================= */}
          {activeTab === 'tools' && (
            <div className="animate-fade-in space-y-12">
               <div className="text-center max-w-4xl mx-auto mb-12">
                <h3 className="text-4xl md:text-5xl font-bold text-[#1e3a8a] mb-4">{t('global_tools_title')}</h3>
                <p className="text-xl md:text-2xl text-slate-800 leading-relaxed font-light">{t('global_tools_desc')}</p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-3xl p-16 text-center flex flex-col items-center justify-center min-h-[400px]">
                 <h4 className="text-4xl md:text-5xl font-bold text-amber-700 mb-6">{t('global_tools_coming_soon')}</h4>
                 <p className="text-xl md:text-2xl text-amber-600/80 max-w-3xl font-light leading-relaxed">{t('global_tools_coming_soon_desc')}</p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ================= 💡 Modal สำหรับแสดงรายละเอียดทรัพยากร (Minimal Design) ================= */}
      {selectedResource && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedResource(null)}
        >
          <div 
            className="bg-white rounded-[2rem] w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ปุ่มปิด (X) */}
            <button 
              onClick={() => setSelectedResource(null)}
              className="cursor-pointer absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-full flex items-center justify-center transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            {/* ส่วน Header ของ Modal (รูปภาพ) */}
            {selectedResource.isLogo ? (
              <div className="w-full h-48 sm:h-64 bg-slate-50 flex items-center justify-center p-8 border-b border-slate-100 shrink-0">
                 <img src={selectedResource.imgSrc} alt={selectedResource.title} className="max-w-full max-h-full object-contain" />
              </div>
            ) : (
              <div className="w-full h-48 sm:h-64 bg-[#1e3a8a] relative shrink-0">
                  <img 
                      src={selectedResource.imgSrc} 
                      alt={selectedResource.title} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                  />
                  {/* Fallback Icon */}
                  <div className="hidden absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                      <div className="w-20 h-20 mb-4 opacity-50">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                          </svg>
                      </div>
                  </div>
              </div>
            )}

            {/* ส่วนเนื้อหาของ Modal (ดีไซน์เรียบง่าย มินิมอล) */}
            <div className="p-6 md:p-8 lg:p-10 overflow-y-auto flex-grow">
              <h3 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-8 leading-snug">{selectedResource.title}</h3>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-xl md:text-2xl font-bold text-[#1e3a8a] mb-3">
                    {t('global_detail_label') || 'รายละเอียด:'}
                  </h4>
                  <p className="text-lg md:text-xl text-slate-800 font-normal leading-relaxed">
                    {selectedResource.detail}
                  </p>
                </div>

                <div>
                  <h4 className="text-xl md:text-2xl font-bold text-[#1e3a8a] mb-3">
                    {t('global_benefit_label') || 'ประโยชน์ที่ได้รับ:'}
                  </h4>
                  <p className="text-lg md:text-xl text-slate-800 font-normal leading-relaxed">
                    {selectedResource.benefit}
                  </p>
                </div>
              </div>
            </div>

            {/* ส่วน Action Button ล่างสุด */}
            <div className="p-6 md:p-8 pt-0 mt-auto shrink-0">
              <a 
                href={selectedResource.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full flex items-center justify-center gap-3 bg-[#1e3a8a] text-white py-4 rounded-xl font-bold text-xl hover:bg-blue-800 hover:-translate-y-1 hover:shadow-lg transition-all"
              >
                {selectedResource.btnText}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};

export default GlobalNetwork;