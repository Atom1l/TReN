import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

// นำเข้า Components ที่สร้างไว้
import AboutVisionMission from './AboutVisionMission';
import AboutCorePrinciples from './AboutCorePrinciples';
import AboutMembership from './AboutMembership';
import AboutOperations from './AboutOperation';
import AboutMeetings from './AboutMeeting';
import AboutFinancesAndRules from './AboutFinancesandRules';
import AboutTrenJourney from './AboutTrenJourney';
import AboutTeam from './AboutTeam';
import AboutSupporter from './AboutSupporters';
import AboutGovernanceStructure from './AboutGovernanceStructure';
import AboutRegionalTeams from './AboutRegionalTeam';
import AboutEARC from './AboutEARC';

const AboutPage: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();

  // ฟังก์ชันเช็คว่า URL มี # ต่อท้ายไหม ถ้ามีให้เลื่อนไปหา ID นั้น
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        // หักลบความสูงของ Sticky Navbar ด้านบนเวลาเลื่อน (ประมาณ 120px)
        const element = document.getElementById(location.hash.substring(1)); 
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - 120;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className="flex flex-col w-full bg-[#F8FAFC]">

      {/* 1. Intro Section - อธิบาย TReN คืออะไร */}
      <section className="mb-2 mt-26">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
            {t('about') || 'TReN'}
            <span className="block text-2xl md:text-3xl text-slate-400 mt-2 font-medium tracking-normal">
              {t('vision_about_tren_subtitle') || 'เครือข่ายวิจัยครู'}
            </span>
          </h1>
          
          <div className="text-xl md:text-2xl text-slate-800 leading-relaxed font-light tracking-wide space-y-8 mt-2">
            <p>
              <strong className="font-semibold text-[#1e3a8a]">(Teacher-Research Network)</strong>
            </p>
          </div>
          
          <div className="w-20 h-1.5 bg-[#1e3a8a] mt-6 mb-10 rounded-full mx-auto"></div>
        </div>

        {/* 💡 รูปภาพขนาดใหญ่คั่นกลางเพื่อพักสายตาและเพิ่มความน่าสนใจ */}
        {/* <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="w-full h-[300px] md:h-[450px] lg:h-[550px] rounded-[2rem] overflow-hidden shadow-2xl relative group">
            <img 
              src="../public/Homepage/cover_2.webp" 
              alt="TReN Community" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#1e3a8a]/10 pointer-events-none mix-blend-multiply"></div>
          </div>
        </div> */}
      </section>
      
      {/* 1. กรอบการทำงานของเครือข่าย (Constitution) */}
      <div id="constitution" className="scroll-mt-32">
        <section id="general-info"><AboutVisionMission /><AboutCorePrinciples /></section>
        <section id="membership"><AboutMembership /></section>
        <section id="operations"><AboutOperations /></section>
        <section id="governance-structure"><AboutGovernanceStructure /></section>
        <section id="meetings"><AboutMeetings /></section>
        <section id="finances"><AboutFinancesAndRules /></section>
      </div>

      {/* 2. เส้นทางการเจริญเติบโต / TReN Journey */}
      <section id="journey" className="scroll-mt-32">
        <AboutTrenJourney />
      </section>

      {/* 3. เกี่ยวกับ EARC */}
      <section id="earc" className="scroll-mt-32">
        <AboutEARC />
      </section>

      {/* 4. คณะกรรมการบริหารเครือข่าย/โครงสร้างเครือข่าย */}
      <section id="team" className="scroll-mt-32">
        <AboutTeam />
      </section>

      {/* 5. คณะกรรมการบริหารระดับภูมิภาค (Regional EARC Teams) */}
      <section id="regional-teams" className="scroll-mt-32">
        <AboutRegionalTeams />
      </section>

      {/* 6. องค์กรพันธมิตรและผู้สนับสนุน */}
      <section id="supporters" className="scroll-mt-32">
        <AboutSupporter />
      </section>

    </div>
  );
};

export default AboutPage;