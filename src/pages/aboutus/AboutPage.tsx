import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AboutVisionMission from './AboutVisionMission';
import AboutCorePrinciples from './AboutCorePrinciples';
import AboutTrenJourney from './AboutTrenJourney';
import AboutCoreRole from './AboutCoreRoles'; 
import AboutGovernance from './AboutGovernance';
import AboutSupporter from './AboutSupporters'; 

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
      {/* 1. วิสัยทัศน์และพันธกิจ */}
      {/* เพิ่ม padding-top เผื่อไว้ให้ Navbar ไม่บังหัวข้อ (scroll-mt) */}
      <section id="about-intro" className="scroll-mt-24">
        <AboutVisionMission />
      </section>

      {/* 2. หลักการดำเนินงาน 5 ข้อ */}
      <section id="about-core-principles" className="scroll-mt-24">
        <AboutCorePrinciples />
      </section>

      {/* 3. เส้นทางการเติบโต */}
      <section id="about-journey" className="scroll-mt-24">
        <AboutTrenJourney />
      </section>

      {/* 4. บทบาทและภารกิจหลัก */}
      <section id="about-core-role" className="scroll-mt-24">
        <AboutCoreRole />
      </section>

      {/* โครงสร้างเครือข่าย (ถ้ามี) */}
      <section id="about-organization" className="scroll-mt-24">
        {/* <AboutOrganization /> */}
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