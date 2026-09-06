import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AboutVisionMission from './AboutVisionMission';
import AboutCorePrinciples from './AboutCorePrinciples';
import AboutTrenJourney from './AboutTrenJourney';
import AboutCoreRole from './AboutCoreRoles'; 
import AboutGovernance from './AboutGovernance';
import AboutSupporter from './AboutSupporters'; 
import AboutMembership from './AboutMembership';
import AboutGovernanceandStructure from './AboutGovernanceStructure';
import AboutOperations from './AboutOperation';
import AboutMeetings from './AboutMeeting';
import AboutFinancesAndRules from './AboutFinancesandRules';
import AboutTeam from './AboutTeam';

const AboutPage: React.FC = () => {
  const location = useLocation();

  // ฟังก์ชันนี้จะคอยเช็คว่า URL มี # ต่อท้ายไหม ถ้ามีให้เลื่อนไปหาส่วนนั้น
  useEffect(() => {
    if (location.hash) {
      // หน่วงเวลาเล็กน้อยเพื่อให้หน้าเรนเดอร์เสร็จก่อนเลื่อน
      setTimeout(() => {
        const element = document.getElementById(location.hash.substring(1)); // เอา '#' ออก
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
      {/* 1.1 วิสัยทัศน์และพันธกิจ */}
      {/* เพิ่ม padding-top เผื่อไว้ให้ Navbar ไม่บังหัวข้อ (scroll-mt) */}
      <section id="about-intro" className="scroll-mt-24">
        <AboutVisionMission />
      </section>

      {/* 1.2 หลักการดำเนินงาน 5 ข้อ */}
      <section id="about-core-principles" className="scroll-mt-24">
        <AboutCorePrinciples />
      </section>

      {/* 1.3 สมาชิกภาพ */}
      <section id="about-membership" className="scroll-mt-24">
        <AboutMembership />
      </section>

      {/* 1.4 ขอบเขตการดำเนินงาน */}
      <section id="about-operations" className="scroll-mt-24">
        <AboutOperations />
      </section>

      {/* 1.5 โครงสร้างเครือข่ายและการบริหารงาน */}
      <section id="about-governance-and-structure" className="scroll-mt-24">
        <AboutGovernanceandStructure />
      </section>

      {/* 1.6 การประชุม */}
      <section id="about-meetings" className="scroll-mt-24">
        <AboutMeetings />
      </section>

      {/* 1.7 งบประมาณ */}
      <section id="about-finances-and-rules" className="scroll-mt-24">
        <AboutFinancesAndRules />
      </section>

      {/* 3. เส้นทางการเติบโต */}
      <section id="about-journey" className="scroll-mt-24">
        <AboutTrenJourney />
      </section>

      {/* 4.โครงสร้างเครือข่าย (ถ้ามี) */}
      <section id="about-team" className="scroll-mt-24">
        <AboutTeam />
      </section>

      {/* 5. ธรรมนูญเครือข่าย */}
      <section id="about-governance" className="scroll-mt-24">
        <AboutGovernance />
      </section>

      {/* 6. องค์กรพันธมิตรและผู้สนับสนุน */}
      <section id="about-supporters" className="scroll-mt-24">
        <AboutSupporter />
      </section>
    </div>
  );
};

export default AboutPage;