import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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

const AboutPage: React.FC = () => {
  const location = useLocation();

  // ฟังก์ชันเช็คว่า URL มี # ต่อท้ายไหม ถ้ามีให้เลื่อนไปหา ID นั้น
  useEffect(() => {
    if (location.hash) {
      // หน่วงเวลาเล็กน้อยเพื่อให้หน้าเรนเดอร์คอมโพเนนต์เสร็จก่อนค่อยเลื่อน
      setTimeout(() => {
        const element = document.getElementById(location.hash.substring(1)); // ตัด '#' ออก
        if (element) {
          // ใช้ scrollIntoView แบบสมูท
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // ถ้าไม่มี hash ให้เลื่อนขึ้นบนสุด
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className="flex flex-col w-full bg-[#F8FAFC]">
      
      {/* =========================================
          1. กรอบการทำงานของเครือข่าย (Constitution) 
      ========================================= */}
      <div id="constitution">
        
        {/* หมวดที่ 1: ข้อมูลทั่วไป (Vision, Mission & Core Principles) */}
        <section id="general-info" className="scroll-mt-24">
          <AboutVisionMission />
          <AboutCorePrinciples />
        </section>

        {/* หมวดที่ 2: สมาชิกภาพ */}
        <section id="membership" className="scroll-mt-24">
          <AboutMembership />
        </section>

        {/* หมวดที่ 3: ขอบเขตการดำเนินงานและโครงการหลัก */}
        <section id="operations" className="scroll-mt-24">
          <AboutOperations />
        </section>

        {/* หมวดที่ 4: โครงสร้างเครือข่ายและการบริหารงาน */}
        <section id="governance-structure" className="scroll-mt-24">
          <AboutGovernanceStructure />
        </section>

        {/* หมวดที่ 5: การประชุมและการดำเนินงาน */}
        <section id="meetings" className="scroll-mt-24">
          <AboutMeetings />
        </section>

        {/* หมวดที่ 6: การเงิน ทรัพย์สิน และการแก้ไขข้อตกลง */}
        <section id="finances" className="scroll-mt-24">
          <AboutFinancesAndRules />
        </section>

      </div>

      {/* =========================================
          2. เส้นทางการเจริญเติบโต / TReN Journey 
      ========================================= */}
      <section id="journey" className="scroll-mt-24">
        <AboutTrenJourney />
      </section>

      {/* =========================================
          3. คณะกรรมการบริหารเครือข่าย/โครงสร้างเครือข่าย
      ========================================= */}
      <section id="team" className="scroll-mt-24">
        <AboutTeam />
      </section>

      {/* =========================================
          4. องค์กรพันธมิตรและผู้สนับสนุน
      ========================================= */}
      <section id="supporters" className="scroll-mt-24">
        <AboutSupporter />
      </section>

    </div>
  );
};

export default AboutPage;