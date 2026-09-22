/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const HeroSection = () => {
  const { t, language } = useLanguage();

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24 flex flex-col items-center">
      <div className="text-center w-full max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-6xl lg:text-6xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight text-balance">
          {t('hero_tren_title') || 'เครือข่ายวิจัยครู TReN'}
        </h1>
        <h2 className="text-2xl md:text-3xl lg:text-4xl text-slate-600 mt-6 font-bold tracking-tight leading-snug text-balance">
          {t('hero_tren_subtitle') || 'เปลี่ยนห้องเรียนให้เป็นพื้นที่เรียนรู้จริง ด้วยพลังของ "ครูวิจัย"'}
        </h2>
        <p className="text-xl md:text-2xl lg:text-3xl text-slate-500 mt-6 font-light tracking-wide text-balance">
          {t('hero_tren_slogan') || 'เพราะปัญหานักเรียนในห้องเรียน ครูคือคนที่เข้าใจดีที่สุด!'}
        </p>
        <div className="w-24 h-1.5 bg-[#1e3a8a] mx-auto mt-10 mb-12 rounded-full"></div>
      </div>

      <div className="w-full max-w-5xl flex flex-col gap-10 mx-auto">
        <p className="text-2xl md:text-3xl text-slate-800 leading-relaxed font-light text-center text-balance">
          <strong className="font-bold text-[#1e3a8a]">{t('hero_desc_bold_1') || 'เครือข่ายครูวิจัย TReN'}</strong>
          {' '}{t('hero_desc_text_1') || 'ชุมชนแห่งการเรียนรู้ทางวิชาชีพ (CoP) ที่พร้อมยืนเคียงข้างครูไทยใน 4 ภูมิภาคทั่วประเทศ'}<br/><br/>
          {' '}{t('hero_desc_text_1_1') || 'เราชวนเปลี่ยน'} <strong className="font-bold text-[#1e3a8a]">{t('hero_desc_bold_2') || '“การวิจัย”'}</strong>
          {' '}{t('hero_desc_text_2') || 'ให้เป็นกระบวนการเรียนรู้ที่ทำได้จริงในห้องเรียน ผ่านแนวคิด Exploratory Action Research (EAR) ที่เริ่มจากการค้นหาสาเหตุที่แท้จริงของปัญหา ก่อนร่วมกันหาทางพัฒนา โดยมี'} 
          {' '}<strong className="font-bold text-[#1e3a8a]">{t('hero_desc_bold_3') || 'ครูพี่เลี้ยงในพื้นที่ และ ชุมชนวิจัย EAR Community ใน 4 ภูมิภาค'}</strong>
          {' '}{t('hero_desc_text_3') || 'ที่เข้าใจบริบทครูอย่างแท้จริง พร้อมแลกเปลี่ยนเรียนรู้และให้คำปรึกษาตลอดกระบวนการ'}
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap gap-4 md:gap-6 items-center justify-center mt-8">
          <Link to="/register" className="w-full sm:w-auto bg-[#1e3a8a] text-white font-bold text-xl md:text-2xl px-8 py-4 md:py-5 rounded-2xl hover:bg-blue-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center">
            {t('hero_btn_register') || 'สมัครเข้าร่วมเครือข่าย'}
          </Link>
          <Link to="/knowledge" className="w-full sm:w-auto bg-white border-[3px] border-[#1e3a8a] text-[#1e3a8a] font-bold text-xl md:text-2xl px-8 py-4 md:py-5 rounded-2xl hover:bg-blue-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center">
            {t('hero_btn_resources') || 'สำรวจคลังความรู้ EAR'}
          </Link>
          <Link to="/about/#earc" className="w-full sm:w-auto bg-blue-50 border-[3px] border-transparent text-[#1e3a8a] font-bold text-xl md:text-2xl px-8 py-4 md:py-5 rounded-2xl hover:bg-blue-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center">
            {t('hero_btn_community') || 'ชุมชนวิจัย EARC 4 ภูมิภาค'}
          </Link>
        </div>

        <hr className="border-t-[2px] border-slate-200 mt-8 mb-8" />

        <div className="flex flex-col gap-16 lg:gap-24">
          {/* Quote 1 */}
          <div className="flex flex-col md:flex-row gap-10 md:gap-12 items-center justify-between">
            <div className="flex-1 max-w-2xl flex flex-col items-start">
              <div className="mb-6 inline-flex flex-col md:flex-row md:items-center gap-2 md:gap-4 bg-blue-50/80 p-3 pr-6 rounded-2xl border border-blue-100">
                <span className="flex items-center gap-2 font-bold text-[#1e3a8a]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" /></svg>
                  {t('hero_quote1_author') || 'ครูวิไล พันชนกุล'}
                </span>
                <span className="hidden md:block text-blue-200">|</span>
                <span className="text-slate-600 text-sm font-medium">{t('hero_quote1_school') || 'โรงเรียนบ้านดอนแสนสุข จ.อุดรธานี'}</span>
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-4 leading-snug">
                <span className="text-[#1e3a8a] font-medium mr-2">{t('research_topic') || 'หัวข้อวิจัย:'} </span>
                {t('hero_quote1_topic') || 'How I developed my teaching to promote my students’ Engagement in English classes'}
              </h4>
              <p className="text-[#1e3a8a] font-medium text-3xl leading-relaxed italic border-l-[5px] border-[#1e3a8a] pl-6 py-2 text-balance">
                {t('hero_quote1_text') || '"จาก findings ทำให้เข้าใจว่า เราต้องรับฟังนักเรียนให้มากขึ้น และเมื่อนักเรียนให้ความไว้วางใจ พวกเขาจะพร้อมทำตามคำแนะนำของเราอย่างเต็มใจ"'}
              </p>
            </div>
            <a href="https://www.britishcouncil.or.th/en/stories-exploratory-action-research-thai-schools" target="_blank" rel="noopener noreferrer" className="w-full md:w-5/12 aspect-[4/3] border-2 border-dashed border-[#1e3a8a]/40 bg-blue-50/50 hover:bg-blue-100 hover:border-[#1e3a8a]/70 flex flex-col items-center justify-center text-[#1e3a8a] p-6 text-center rounded-3xl transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-sm hover:shadow-lg group">
                <img src="/Homepage/Hero_1.webp" fetchPriority="high" alt="Exploratory Action Research by Kru Wilai" className="w-full h-full object-cover rounded-xl group-hover:opacity-90 transition-opacity duration-300"/>            
            </a>
          </div>

          {/* Quote 2 */}
          <div className="flex flex-col md:flex-row-reverse gap-10 md:gap-12 items-center justify-between">
            <div className="flex-1 max-w-2xl flex flex-col items-start md:items-end md:text-right">
              <div className="mb-6 inline-flex flex-col md:flex-row md:items-center gap-2 md:gap-4 bg-blue-50/80 p-3 md:pl-6 rounded-2xl border border-blue-100">
                <span className="flex items-center gap-2 font-bold text-[#1e3a8a]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" /></svg>
                  {t('hero_quote2_author') || 'ครูฟัยซะ หวันตะหา'}
                </span>
                <span className="hidden md:block text-blue-200">|</span>
                <span className="text-slate-600 text-sm font-medium">{t('hero_quote2_school') || 'โรงเรียนวัดนางเหล้า จ.สงขลา'}</span>
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-4 leading-snug">
                <span className="text-[#1e3a8a] font-medium md:ml-2 block md:inline md:order-2">{t('research_topic') || 'หัวข้อวิจัย:'} </span>
                <span className="md:order-1">{t('hero_quote2_topic') || 'Enhancing student engagement in speaking activities'}</span>
              </h4>
              <p className="text-[#1e3a8a] font-medium text-3xl leading-relaxed italic border-l-[5px] md:border-l-0 md:border-r-[5px] border-[#1e3a8a] pl-6 md:pl-0 pr-0 md:pr-6 py-2 text-balance">
                {t('hero_quote2_text') || '"บทเรียนสำคัญที่สุดจากการทำวิจัยครั้งนี้ คือการได้รู้ว่านักเรียนต้องการอะไรจริงๆ"'}
              </p>
            </div>
            <a href="https://www.britishcouncil.or.th/en/stories-exploratory-action-research-thai-schools" target="_blank" rel="noopener noreferrer" className="w-full md:w-5/12 aspect-[4/3] border-2 border-dashed border-[#1e3a8a]/40 bg-blue-50/50 hover:bg-blue-100 hover:border-[#1e3a8a]/70 flex flex-col items-center justify-center text-[#1e3a8a] p-6 text-center rounded-3xl transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-sm hover:shadow-lg group">
                <img src="/Homepage/Hero_2.webp" fetchPriority="high" alt="Exploratory Action Research by Kru Faisa" className="w-full h-full object-cover rounded-xl group-hover:opacity-90 transition-opacity duration-300"/>            
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;