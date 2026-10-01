/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const SirawitArticle = () => {
  const { t } = useLanguage();
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // State สำหรับควบคุมการเปิด/ปิดตารางและเนื้อหาย่อย
  const [openTable, setOpenTable] = useState(false);
  const [openLessonPlan, setOpenLessonPlan] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-white pb-24 relative font-sans text-slate-800">
      
      {/* Zoom Image Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick={() => setZoomedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white bg-slate-800/50 hover:bg-slate-700 p-2 rounded-full cursor-pointer transition-colors z-10"
            onClick={() => setZoomedImage(null)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
          <img 
            src={zoomedImage} 
            alt="Zoomed" 
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl transform transition-transform duration-300 scale-100" 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        
        {/* Breadcrumb */}
        <div className="text-[#555555] text-lg sm:text-xl mt-4 mb-4">
          <Link to="/member-works" className="hover:text-[#1e3a8a] transition-colors">{t('member_works') || 'ผลงานสมาชิก'}</Link> / <span className="text-slate-800">คำถามที่พาเราเดินไกลกว่าที่คิด</span>
        </div>

        {/* หัวข้อบทความ */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1e3a8a] leading-tight mb-4">
          คำถามที่พาเราเดินไกลกว่าที่คิด
        </h1>

        <div className="text-slate-500 text-lg sm:text-xl font-medium mt-4 mb-6 leading-relaxed flex flex-wrap items-center gap-y-2">
            <span className="font-medium mr-1">{t('by_author') || 'โดย'}</span><span className="font-bold text-[#1e3a8a]">ครูศิรวิชญ์ ศรีเขียว</span>
            <span className="mx-2 text-slate-300">|</span>
            <span className="font-medium text-slate-600">
                2569
            </span>
        </div>

        {/* รูปภาพหน้าปก (ตั้งเป็น placeholder ชั่วคราว หรือเปลี่ยนเป็นรูปจริงได้เลย) */}
        <div 
          className="w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden mb-12 shadow-sm border border-slate-100 bg-slate-100 flex items-center justify-center cursor-zoom-in relative group"
          onClick={() => setZoomedImage('../Showcases/Sirawit.webp')} // 💡 เปลี่ยน path รูปตรงนี้
        >
          <img 
            src="../Showcases/Sirawit.webp" // 💡 เปลี่ยน path รูปตรงนี้
            alt="คำถามที่พาเราเดินไกลกว่าที่คิด" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* ================= เนื้อหาบทความ (จัดชิดซ้าย, เว้นบรรทัดอ่านง่าย) ================= */}
        <div className="mx-auto text-lg md:text-xl lg:text-[22px] text-slate-700 leading-relaxed space-y-8 mb-16">
          
          <h3 className="text-3xl font-bold text-[#1e3a8a] mt-12 mb-4">
            Teacher’s Voice (2024): เมื่อ EAR ทำให้ผมเริ่มรักคำว่า “ยังไม่รู้”
          </h3>
          <p>
            การจะเล่าถึงที่มาของ EAR 2026 ให้เห็นภาพชัดที่สุด คงต้องย้อนกลับไปเริ่มต้นที่ปี 2024 ซึ่งเป็นจุดเริ่มต้นที่ผมได้ทำวิจัย Exploratory Action Research (EAR) อย่างจริงจังในหัวข้อ Conjunctive Adverbs in Story-Writing Tasks ในเวลานั้น จุดเริ่มต้นไม่ได้เกิดจากโจทย์ที่ซับซ้อน แต่มาจากความสงสัยพื้นฐานว่า เหตุใดนักเรียนที่ผ่านการเรียนคำเชื่อมอย่าง however, therefore, moreover หรือ consequently มาแล้ว จึงยังไม่สามารถนำมาใช้ในการเขียนจริงได้อย่างคล่องแคล่ว ข้อสงสัยเล็กๆ นี้ได้เปลี่ยนบทบาทของผมจากการเป็นเพียงผู้ตรวจทานความถูกต้อง มาสู่การพยายามเข้าใจกระบวนการคิด อุปสรรค และประสบการณ์ที่เกิดขึ้นจริงกับผู้เรียน
          </p>

          <img src="../Showcases/Sirawit_2.webp" alt="Sheet" className="w-full h-auto max-h-[600px] object-contain" />

          <p>
            ประสบการณ์จาก EAR 2024 จึงไม่ได้มอบเพียงรายงานวิจัยหนึ่งฉบับ แต่ได้หล่อหลอม “Teacher’s Voice” หรือ วิถีความเป็นครูแบบใหม่ ที่ให้ความสำคัญกับการหยุดคิดก่อนสรุป การตั้งคำถามแทนการคาดเดา และการเปิดรับข้อมูลในห้องเรียนเพื่อสะท้อนและปรับเปลี่ยนมุมมองของตนเอง ผมเริ่มยอมรับความ "ยังไม่รู้" ได้มากขึ้น และตระหนักว่าความไม่รู้ไม่ได้หมายถึงความล้มเหลวในการสอน หากแต่เป็นจุดเริ่มต้นของการเรียนรู้ที่ลึกซึ้งยิ่งขึ้น
          </p>
          <p>
            ด้วยเหตุนี้ เมื่อได้รับโอกาสทำ EAR อีกครั้งในปี 2026 ผมจึงตัดสินใจเดินหน้าต่อ ไม่ใช่เพื่อเพิ่มจำนวนผลงานวิชาการ แต่เพื่อค้นหาว่าห้องเรียนแห่งนี้จะนำพาไปสู่การเรียนรู้อะไรใหม่ๆ
          </p>
          <p className="bg-slate-50 p-6 rounded-2xl border-l-4 border-slate-300 italic text-slate-600">
            ในช่วงเริ่มต้นของปี 2026 โครงสร้างอย่าง MAGIC STORY, ชุดแผนการจัดการเรียนรู้ 5 แผน หรือการประยุกต์ใช้ AI ยังไม่ได้ถูกวางไว้ สิ่งที่มีอยู่จริงคือห้องเรียน ม.2/5 พร้อมนักเรียน 27 คน และสภาพปัญหาที่เกิดขึ้นหลากหลายมิติพร้อมกัน ทั้งด้านพื้นฐานภาษา ความมั่นใจ การมีส่วนร่วม การออกเสียง การเขียน และการสื่อสาร แม้จะมีประเด็นที่น่าสนใจอยู่โดยรอบ แต่หัวใจของการทำ EAR คือการไม่แก้ไขทุกอย่างพร้อมกันในระดับผิวสัมผัส หากแต่เป็นการเลือกโฟกัสประเด็นสำคัญเพียงเรื่องเดียว เพื่อศึกษาวิเคราะห์ให้ลึกซึ้งและตรงจุดที่สุด
          </p>

          <h3 className="text-3xl font-bold text-[#1e3a8a] mt-16 mb-4">
            ปี 2026: จากปัญหาหลายเรื่อง สู่การเลือกมอง “การพูด” ให้ลึกขึ้น
          </h3>
          <p>
            สิ่งที่ทำให้ผมหยุดอยู่กับเรื่องการพูด คือภาพที่เกิดซ้ำในชั้นเรียน เด็กหลายคนทำแบบฝึกหัดได้เมื่อมีตัวเลือก พูดตามได้เมื่อมี model หรือตอบได้เมื่อคำถามค่อนข้างตรง แต่พอผมเปิดพื้นที่ให้เขาคิดและพูดด้วยตัวเอง บรรยากาศกลับเปลี่ยนไปทันที บางคนเงียบ บางคนหันมามองครูเหมือนรอความช่วยเหลือ บางคนเริ่มต้นได้แต่ไปต่อไม่ถูก ภาพนั้นทำให้ผมเริ่มตั้งข้อสงสัยกับคำอธิบายง่าย ๆ ว่า “เด็กพูดไม่ได้” เพราะเอาเข้าจริง ผมรู้ว่าเด็กหลายคนมีภาษาอยู่ในมือ เพียงแต่เขายังไม่ใช้มันได้อย่างเป็นอิสระในจังหวะที่ต้องการ
          </p>
          <p>
            ตรงนี้เองที่ประสบการณ์จากปี 2024 กลับมาสะกิดผมอีกครั้งว่า <strong className="text-[#1e3a8a]">อย่าเพิ่งรีบแก้</strong> ผมเองก็อยากรีบหาเกม อยากหาเทคนิค อยากให้คาบต่อไปเด็กพูดกันคึกคักขึ้นเหมือนกัน แต่ EAR บอกให้ผมช้าลงอีกนิด ก่อนจะถามว่า “จะทำอย่างไรให้เด็กพูดมากขึ้น” ผมจึงเปลี่ยนไปถามว่า “ความเงียบที่เราเห็นนั้นกำลังบอกอะไร?” เด็กไม่มีคำจะพูดจริง ๆ หรือยังไม่มั่นใจ เขาคิดไม่ออกหรือแค่จัดความคิดไม่ทัน เขากลัวเสียงของตัวเองผิด หรือจริง ๆ แล้วเวลาเตรียมของเราสั้นเกินไป เมื่อคำถามเริ่มละเอียดขึ้น ปัญหาที่เคยเห็นเป็นก้อนเดียวก็เริ่มแตกออกเป็นส่วน ๆ ทั้ง content, organization, pronunciation, confidence และ rehearsal time จนผมเริ่มรู้สึกว่าแก่นของปัญหาอาจไม่ใช่ speaking เพียงอย่างเดียว แต่คือ <strong className="text-[#1e3a8a]">readiness to speak</strong> — ความพร้อมก่อนที่เด็กจะใช้เสียงของตัวเองได้อย่างมั่นใจ
          </p>
          <p>
            จากตรงนี้ ผมจึงเข้าสู่ระยะ E — Explore โดยตั้งใจไว้กับตัวเองค่อนข้างชัดว่า ช่วงนี้ยังไม่สร้าง MAGIC STORY และยังไม่ตัดสินใจว่าจะใช้อะไรเป็นคำตอบ หน้าที่ของผมมีอย่างเดียวก่อน คือฟังและเก็บหลักฐานให้พอที่จะรู้ว่าเด็กกำลังเผชิญอะไรจริง ๆ
          </p>

          <h3 className="text-3xl font-bold text-[#1e3a8a] mt-16 mb-4">
            E — Explore: ฟังคำตอบจากเด็กก่อนคิดคำตอบแทนเด็ก
          </h3>
          <p>
            ผมวาง Exploratory Questions ไว้ 3 ข้อ โดยแต่ละข้อมีหน้าที่ต่างกันเล็กน้อย ข้อแรกอยากรู้ว่าเด็ก “รู้สึกอย่างไร” ข้อที่สองอยากเห็นว่าเวลาทำจริงเด็ก “ติดตรงไหน” และข้อที่สามอยากให้เด็กเป็นคนบอกเองว่า “อะไรจะช่วยเขาได้” การแยกคำถามแบบนี้ทำให้ผมไม่ได้มองผู้เรียนเพียงจากสายตาของครู แต่พยายามเอาทั้งเสียงของเด็กและหลักฐานจากการปฏิบัติจริงมาวางข้างกัน
          </p>

          {/* 💡 ซ่อนตาราง EQ ไว้ใน Accordion */}
          <details 
            className="group bg-slate-50 border border-slate-200 rounded-2xl my-8 overflow-hidden shadow-sm"
            open={openTable}
            onClick={(e) => { e.preventDefault(); setOpenTable(!openTable); }}
          >
            <summary className="px-6 py-5 font-bold text-[#1e3a8a] text-xl cursor-pointer hover:bg-slate-100 transition-colors list-none flex justify-between items-center">
              คลิกที่นี่เพื่อขยายดูตารางรายละเอียด EQ1 - EQ3
              <svg className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${openTable ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
            </summary>
            <div className="px-6 py-6 border-t border-slate-200 bg-white">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-base md:text-lg text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-[#1e3a8a] text-white">
                      <th className="p-4 border border-blue-800 w-1/4">Exploratory Questions</th>
                      <th className="p-4 border border-blue-800 w-1/5">Tools</th>
                      <th className="p-4 border border-blue-800">Findings</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="p-4 border border-slate-200 font-bold text-[#1e3a8a]">EQ1 What are students’ perceptions of speaking English in open-ended communicative tasks?</td>
                      <td className="p-4 border border-slate-200">Student Survey</td>
                      <td className="p-4 border border-slate-200"><strong>ข้อค้นพบด้านความมั่นใจ:</strong> นักเรียนส่วนใหญ่ยังขาดความมั่นใจและมีความกังวลต่อความผิดพลาด สะท้อนให้เห็นว่า "การรู้ภาษา" ไม่อาจเท่ากับ "ความพร้อมในการใช้ภาษา" การสร้างความมั่นใจและบรรยากาศที่ปลอดภัยในการสื่อสารจึงเป็นปัจจัยวิกฤต</td>
                    </tr>
                    <tr className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="p-4 border border-slate-200 font-bold text-[#1e3a8a]">EQ2 What difficulties do students face when preparing for open-ended speaking tasks?</td>
                      <td className="p-4 border border-slate-200">Baseline Communicative Task</td>
                      <td className="p-4 border border-slate-200"><strong>อุปสรรคที่หลากหลายของผู้เรียน:</strong> ปัญหาในการสื่อสารของผู้เรียนประกอบด้วยหลายมิติ ทั้งความคิด/ไอเดีย พื้นฐานภาษา การจัดโครงสร้างประโยค การออกเสียง และระยะเวลาในการฝึกซ้อม ดังนั้น การใช้กิจกรรม Speaking เพียงรูปแบบเดียวจึงไม่เพียงพอที่จะครอบคลุมทุกปัญหา</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-4 border border-slate-200 font-bold text-[#1e3a8a]">EQ3 What kinds of support do students need before they are ready to speak independently?</td>
                      <td className="p-4 border border-slate-200">Focus-group Discussion</td>
                      <td className="p-4 border border-slate-200"><strong>การสร้างเงื่อนไขความพร้อม (Action):</strong> กระบวนการจัดการเรียนรู้ต้องมุ่งเน้นการสร้าง "เงื่อนไขแห่งความพร้อม" เช่น การจัดหา Language Support, ตัวอย่างการออกเสียง (Pronunciation Models), การซ้อมในสภาพแวดล้อมที่มีความเสี่ยงต่ำ (Low-risk Rehearsal), การให้ Feedback และการเปิดโอกาสให้ปรับแก้ไข (Retry) บนพื้นฐานการยอมรับความแตกต่างด้านระดับการสนับสนุนที่ผู้เรียนแต่ละคนต้องการ</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </details>

          <p>
            คำตอบจาก EQ1 ทำให้ผมฉุกคิดเรื่อง ความมั่นใจ มากที่สุด เพราะเด็กหลายคนไม่ได้ขาดความรู้ภาษาอังกฤษ เขามีคำตอบในหัวแต่ไม่กล้าพูด เพราะกลัวตอบผิด ไม่มั่นใจในเสียงของตัวเอง หรือไม่รู้ว่าจะพูดต่ออย่างไร ผมตระหนักอย่างจริงจังว่า <strong className="text-[#1e3a8a]">"Knowing English is not the same as being ready to speak."</strong> ข้อความนี้ไม่ใช่แค่ประโยคคมๆ แต่เป็นจุดเปลี่ยนที่ทำให้ผมมอง "ความเงียบ" ของเด็กต่างไปจากเดิม จากที่เคยคิดว่าเขาไม่รู้หรือไม่ตั้งใจ ผมเริ่มกลับมาตั้งคำถามใหม่ว่า มีปัจจัยอะไรที่ทำให้เขายังไม่พร้อมนำสิ่งที่รู้มาใช้?
          </p>
          <p>
            พอมาถึง EQ2 ภาพนี้ก็ยิ่งชัดเจนขึ้น เมื่อผลจาก Baseline Communicative Task แสดงให้เห็นว่าอุปสรรคของเด็กมีหลายมิติ บางคนคิดไอเดียไม่ออก บางคนมีคำศัพท์แต่เรียงประโยคไม่ได้ บางคนติดเรื่องการออกเสียง และอีกหลายคนต้องการเวลาซ้อมมากกว่าหนึ่งครั้ง หากเราสรุปปัญหาทั้งหมดนี้รวมกันเพียงคำว่า "พูดไม่เก่ง" เราอาจมองข้ามรายละเอียดที่สำคัญมาก เพราะแต่ละปัญหาต้องการการซัพพอร์ตที่แตกต่างกันอย่างสิ้นเชิง
          </p>
          <p>
            ส่วน EQ3 เป็นส่วนที่ผมประทับใจมากที่สุด เพราะเด็กไม่ได้เป็นเพียงผู้รับการช่วยเหลือจากครูฝ่ายเดียว แต่เขากลายเป็นผู้ชี้ทิศทางให้ครู ผ่านการพูดคุยใน Focus-group Discussion เด็กๆ ได้บอกถึงสิ่งที่ช่วยให้เขามั่นใจขึ้น ไม่ว่าจะเป็นคำศัพท์และคลังประโยคเริ่มต้น ตัวอย่างการออกเสียงที่ถูกต้อง พื้นที่ซ้อมที่ไม่สร้างความกดดัน การได้รับฟีดแบ็ก โอกาสได้แก้ไขแล้วลองใหม่ ไปจนถึงการยืดหยุ่นความช่วยเหลือให้เหมาะกับแต่ละคน
          </p>
          <p>
            เมื่อนำข้อสรุปทั้งสามส่วนมาต่อภาพรวมกัน ผมจึงพบว่าโจทย์ที่แท้จริงอาจไม่ใช่แค่ "ทำอย่างไรให้เด็กพูดมากขึ้น" แต่คือ <strong className="text-[#1e3a8a]">"เราจะสร้างความพร้อมให้เด็กได้อย่างไร และจะค่อย ๆ ถอยออกมาเพื่อให้เขาเก่งด้วยตัวเองได้อย่างไร"</strong>
          </p>

          <hr className="border-slate-200 my-12" />

          <h3 className="text-3xl font-bold text-[#1e3a8a] mt-16 mb-4">
            คำตอบของเด็ก สู่ MAGIC STORY: เมื่อ Explore พาเราไปถึง Action
          </h3>
          <p>
            หลังจากได้คำตอบจากนักเรียน ผมยังต้องผ่านการเลือกอีกชั้นหนึ่งว่า ในบรรดาปัญหาทั้งหมดที่ค้นพบ มีเรื่องไหนบ้างที่เราสามารถพัฒนาได้จริงภายใต้เงื่อนไขและบริบทของห้องเรียน
          </p>
          <p>
            ความจริงคือ ผมไม่สามารถปรับพื้นฐานภาษาของเด็กทั้ง 27 คนให้เท่ากันได้ภายในเวลาไม่กี่สัปดาห์ และคงดูเกินจริงไปหน่อยถ้าจะบอกว่า ความกลัวความผิดพลาดจะหายวับไปได้ด้วยกิจกรรมเพียงชุดเดียว ผมจึงเลือกโฟกัสในสิ่งที่ครูสามารถออกแบบให้เกิดขึ้นได้จริงอย่างเป็นรูปธรรม เช่น การจัดหา Language Support, ตัวอย่างการออกเสียง (Pronunciation Model), พื้นที่ซ้อมที่ปลอดภัย (Low-risk Rehearsal), การให้ Feedback, โอกาสในการปรับแก้ไข (Retry) ไปจนถึงการค่อยๆ ถอดนั่งร้าน (Scaffold) ออกเมื่อเด็กมีความพร้อมมากขึ้น
          </p>
          <p>
            ตรงนี้เองครับที่ MAGIC STORY เริ่มก่อตัวขึ้นเป็นรูปเป็นร่าง แม้ชื่อของมันจะถูกตั้งขึ้นในภายหลัง แต่ตรรกะในการทำงานของมันถูกขับเคลื่อนมาจากคำตอบของเด็กอย่างชัดเจน ผมต้องการสร้างเส้นทางที่ไม่ใช่การโยนเด็กลงสนามแล้วสั่งว่า "พูดเลย" แต่เป็นการค่อย ๆ นำทาง เริ่มจากภาษาในระดับที่เขาจัดการได้ ให้เขาได้ซ้อมในพื้นที่ปลอดภัย ได้รับฟีดแบ็ก แล้วลองใหม่อีกครั้ง ก่อนที่ตัวช่วยต่างๆ จะค่อยๆ ถอยออกไป ถ้าให้สรุปง่ายๆ ในแบบที่ผมชอบบอกกับตัวเองก็คือ 
          </p>
          <div className="bg-blue-50/80 p-8 rounded-2xl border-l-4 border-[#1e3a8a] my-8 shadow-sm">
            <p className="text-2xl md:text-3xl text-[#1e3a8a] font-bold italic leading-relaxed m-0 text-center">
              "ช่วงแรกเราจับมือเขาไว้แน่นหน่อย ช่วงกลางเริ่มปล่อยทีละนิ้ว <br></br>และในช่วงท้าย เราต้องกล้าปล่อยให้เขาเดินด้วยตัวเอง"
            </p>
          </div>
          <p>
            จากฐานคิดทั้งหมดนี้ จึงนำไปสู่การกำหนด Action Question (AQ) ซึ่งทำหน้าที่เป็นสะพานเชื่อมสำคัญ ระหว่างสิ่งที่ค้นพบในขั้นตอน Exploratory (E) ไปสู่สิ่งที่เราจะลงมือทดลองในขั้นตอน Action (A) อย่างมีทิศทาง
          </p>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden my-8 shadow-sm">
            <table className="w-full text-lg md:text-xl text-left border-collapse">
              <tbody>
                <tr className="border-b border-slate-200">
                  <th className="p-5 bg-slate-50 w-1/4 font-bold text-[#1e3a8a] border-r border-slate-200 align-top">A-RQ1</th>
                  <td className="p-5 align-top font-medium text-slate-800">How can I use MAGIC STORY with AI-supported rehearsal to help students move from supported preparation to independent speaking performance?</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th className="p-5 bg-slate-50 w-1/4 font-bold text-[#1e3a8a] border-r border-slate-200 align-top">บริบท</th>
                  <td className="p-5 align-top text-slate-600">นักเรียน ม.2/5 จำนวน 27 คน · ระดับโดยประมาณ A1–A2 · 5 บทเรียน × 60 นาที</td>
                </tr>
                <tr>
                  <th className="p-5 bg-slate-50 w-1/4 font-bold text-[#1e3a8a] border-r border-slate-200 align-top">ช่วงดำเนินการ</th>
                  <td className="p-5 align-top text-slate-600">3 มิถุนายน – 3 กรกฎาคม 2026</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-3xl font-bold text-[#1e3a8a] mt-16 mb-4">
            การออกแบบ AQ และบทบาทของ AI: ผู้ช่วยหลังฉาก ไม่ใช่ตัวเอกบนเวที
          </h3>
          <p>
            ผมชอบ Action Question (AQ) ข้อนี้ ตรงที่มันไม่ได้ตั้งคำถามว่า "AI ทำให้เด็กเก่งขึ้นหรือไม่" เพราะถ้าถามแบบนั้น เราอาจเผลอยกให้เทคโนโลยีกลายเป็น "ตัวเอก" โดยไม่รู้ตัว สิ่งที่ผมอยากรู้มากกว่าคือ เราจะใช้ MAGIC STORY ร่วมกับ AI-supported rehearsal มาช่วยสนับสนุนในช่วงการเตรียมตัวได้อย่างไร และที่สำคัญคือ เราควรจะค่อยๆ ถอยออกตอนไหน เพื่อให้ปลายทางของการเรียนรู้ยังคงเป็น "เสียงของเด็กเอง" นี่คือเหตุผลที่ผมมอง AI เป็นเพียง "ผู้ช่วยหลังฉาก" มากกว่าจะเป็นคนขึ้นมาแสดงบนเวทีแทนนักเรียน
          </p>
          <p>
            แผนการจัดการเรียนรู้ทั้ง 5 แผนจึงถูกออกแบบให้ร้อยเรียงเป็นเรื่องราวเดียวกันอย่างต่อเนื่อง โดยแต่ละแผนมีบทบาทในการขยับเพิ่มความรับผิดชอบ (Learner Autonomy) ให้กับผู้เรียนทีละน้อย ในบทแรกๆ นักเรียนอาจจะยังคงมีโครงสร้างและกรอบภาษาให้พึ่งพาอยู่มาก แต่เมื่อเดินทางไปถึงบทที่ห้า เด็กๆ ควรจะกลายเป็นผู้ลงมือวางแผน เลือกใช้ภาษา ฝึกซ้อม และนำเสนอ (Perform) ด้วยตัวของเขาเองมากขึ้น
          </p>

          {/* 💡 ซ่อนตารางแผนการสอนไว้ใน Accordion */}
          <details 
            className="group bg-slate-50 border border-slate-200 rounded-2xl my-8 overflow-hidden shadow-sm"
            open={openLessonPlan}
            onClick={(e) => { e.preventDefault(); setOpenLessonPlan(!openLessonPlan); }}
          >
            <summary className="px-6 py-5 font-bold text-[#1e3a8a] text-xl cursor-pointer hover:bg-slate-100 transition-colors list-none flex justify-between items-center">
              อ่านรายละเอียดแผนการจัดการเรียนรู้ MAGIC STORY 1-5 และบทบาท AI Coach อย่างละเอียดที่นี่
              <svg className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${openLessonPlan ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
            </summary>
            <div className="px-6 py-6 border-t border-slate-200 bg-white">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-base md:text-lg text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-[#1e3a8a] text-white">
                      <th className="p-4 border border-blue-800 w-1/5">Lesson Plan</th>
                      <th className="p-4 border border-blue-800 w-1/4">Content</th>
                      <th className="p-4 border border-blue-800 w-1/4">Activity</th>
                      <th className="p-4 border border-blue-800 w-1/4">Function (AI Role)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="p-4 border border-slate-200 font-bold text-[#1e3a8a]">1) Meet the Characters</td>
                      <td className="p-4 border border-slate-200">introducing a character; describing personality and ability; asking for character information โดยใช้ brave, kind, funny, clever, strong และรูปประโยค เช่น He/She is…, He/She can…</td>
                      <td className="p-4 border border-slate-200">ปิด/คว่ำอุปกรณ์ดิจิทัล แล้วหมุนเวียนพบคู่สนทนา 3 รอบ แต่ละรอบต้องแนะนำตัวละครและถามอย่างน้อย 2 คำถาม</td>
                      <td className="p-4 border border-slate-200">ใช้ภาพ, word bank และ sentence frames; AI Coach ตรวจ character description ที่ผู้เรียนสร้างเองด้าน meaning, simple grammar และ natural wording โดยให้ข้อเสนอแนะสั้น ๆ ไม่ rewrite ทั้งคำตอบ</td>
                    </tr>
                    <tr className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="p-4 border border-slate-200 font-bold text-[#1e3a8a]">2) The Story Begins</td>
                      <td className="p-4 border border-slate-200">sequencing events; retelling a story beginning; connecting ideas ด้วย First, Next, Then, After that, Finally</td>
                      <td className="p-4 border border-slate-200">ปิดอุปกรณ์ดิจิทัล สมาชิกต่อเรื่องคนละ 1-2 ประโยค และต้องเชื่อมสิ่งที่ตนพูดกับประโยคของเพื่อนก่อนหน้า</td>
                      <td className="p-4 border border-slate-200">ใช้ picture cards, sentence strips และ timeline; AI Coach ตรวจ logical order หลังผู้เรียนแต่งเรื่องของตนเองแล้ว ระหว่าง Practice ครูค่อย ๆ ถอด sentence strips ออก</td>
                    </tr>
                    <tr className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="p-4 border border-slate-200 font-bold text-[#1e3a8a]">3) The Problem Appears</td>
                      <td className="p-4 border border-slate-200">asking about a problem; expressing feelings; giving suggestions; accepting an idea เช่น What happened?, You should…, Let’s…, That’s a good idea.</td>
                      <td className="p-4 border border-slate-200">ปิดอุปกรณ์ดิจิทัล สุ่ม rescue mission แล้ว role-play ให้เห็นปัญหา ความรู้สึก และข้อเสนอแนะอย่างน้อย 2 ข้อ</td>
                      <td className="p-4 border border-slate-200">ใช้ problem/emotion /solution cards และ sentence frames; AI Coach ให้ feedback เรื่อง politeness และ clarity ก่อน role-play โดยคำตอบสุดท้ายยังเป็นของผู้เรียน</td>
                    </tr>
                    <tr className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="p-4 border border-slate-200 font-bold text-[#1e3a8a]">4) Choose the Ending</td>
                      <td className="p-4 border border-slate-200">giving opinions; agreeing/disagreeing politely; giving reasons; predicting เช่น I think…, I agree/disagree because…, Maybe it will…</td>
                      <td className="p-4 border border-slate-200">ปิดอุปกรณ์ดิจิทัล สมาชิกทุกคนต้องแสดงความคิดเห็นอย่างน้อย 1 ครั้ง ตอบเพื่อนอย่างน้อย 1 ครั้ง แล้วกลุ่มลงมติเลือก ending พร้อมนำเสนอเหตุผล</td>
                      <td className="p-4 border border-slate-200">ใช้ ending cards, response cards และ listening checklist; AI Coach ช่วยตรวจความสมเหตุสมผลของเหตุผล แต่ไม่ตัดสินใจเลือก ending แทนผู้เรียน</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-4 border border-slate-200 font-bold text-[#1e3a8a]">5) Magic Story Live</td>
                      <td className="p-4 border border-slate-200">integrated storytelling; performance; problem solving; opinion and ending โดยเรียกใช้ภาษาและรูปประโยคจากแผน 1-4</td>
                      <td className="p-4 border border-slate-200">ปิด/เก็บอุปกรณ์ดิจิทัล แล้วแสดง Magic Story Live เป็นกลุ่ม ผู้ชมให้ peer feedback แบบ One strength - One question</td>
                      <td className="p-4 border border-slate-200">ใช้ story planning sheet และ cue cards; ซ้อมรอบแรกด้วย cue cards แล้วซ้อมรอบสองโดยลดการพึ่ง cue cards; AI Coach ใช้สำหรับ rehearsal feedback เท่านั้น</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </details>

          <h3 className="text-3xl font-bold text-[#1e3a8a] mt-16 mb-6">
            ผลลัพธ์: ตัวเลขที่ค่อย ๆ ขยับ และสิ่งที่ตัวเลขบอกไม่หมด
          </h3>
          
          <div className="overflow-x-auto mb-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <table className="w-full text-base md:text-lg text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#1e3a8a] text-white">
                  <th className="p-4 border-r border-blue-800 text-center">จุดวัด</th>
                  <th className="p-4 border-r border-blue-800 text-center">Pre</th>
                  <th className="p-4 border-r border-blue-800 text-center">L1</th>
                  <th className="p-4 border-r border-blue-800 text-center">L2</th>
                  <th className="p-4 border-r border-blue-800 text-center">L3</th>
                  <th className="p-4 border-r border-blue-800 text-center">L4</th>
                  <th className="p-4 border-r border-blue-800 text-center">L5</th>
                  <th className="p-4 text-center">Post</th>
                </tr>
              </thead>
              <tbody className="text-center font-medium">
                <tr className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-4 border-r border-slate-200 text-left text-[#1e3a8a] font-bold">Mean /20</td>
                  <td className="p-4 border-r border-slate-200 text-slate-500">8.50</td>
                  <td className="p-4 border-r border-slate-200 text-slate-600">9.52</td>
                  <td className="p-4 border-r border-slate-200 text-slate-600">10.52</td>
                  <td className="p-4 border-r border-slate-200 text-slate-600">11.46</td>
                  <td className="p-4 border-r border-slate-200 text-slate-600">12.37</td>
                  <td className="p-4 border-r border-slate-200 text-slate-600">13.35</td>
                  <td className="p-4 text-emerald-600 font-bold">14.20</td>
                </tr>
                <tr className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-4 border-r border-slate-200 text-left text-[#1e3a8a] font-bold">Mean gain</td>
                  <td colSpan={7} className="p-4 text-slate-700 text-left px-8">เพิ่มขึ้น <strong>5.70</strong> คะแนน จาก 20 คะแนน</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 border-r border-slate-200 text-left text-[#1e3a8a] font-bold">ผ่านเกณฑ์หลังเรียน</td>
                  <td colSpan={7} className="p-4 text-slate-700 text-left px-8"><strong>22 จาก 27 คน (81.48%)</strong> · เกณฑ์ 12 คะแนนขึ้นไป</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="text-2xl font-bold text-slate-800 mt-10 mb-4">ร่องรอยของการเติบโตระหว่างทาง</h4>
          <p>
            เมื่อมองภาพรวม Performance ตลอดการเดินทาง ค่าเฉลี่ยของนักเรียนค่อยๆ ขยับสูงขึ้นอย่างต่อเนื่อง ตั้งแต่ Pretest ผ่านบทเรียนทั้ง 5 บท ไปจนถึง Posttest ความสวยงามของภาพนี้มีความหมายกับผมมาก เพราะมันไม่ได้บอกเล่าแค่จุด "ก่อน" หรือ "หลัง" การพัฒนาเท่านั้น แต่มันได้ทิ้ง "ร่องรอยของการเติบโต" ให้เราได้เห็นความเปลี่ยนแปลงที่เกิดขึ้นจริงในทุกๆ ก้าวระหว่างทาง
          </p>
          <p>
            ถ้าถามว่าผมหยุดมองตรงไหนนานที่สุด... คงไม่ใช่ตัวเลข 14.20 ที่ปลายทาง แต่เป็นเส้นทางยาวไกลจาก 8.50 เดินทางไปหา 14.20 มากกว่า คะแนนของเด็กๆไม่ได้กระโดดขึ้นอย่างก้าวกระโดดเพียงเพราะคาบใดคาบหนึ่งดู "ว้าว" เป็นพิเศษ แต่มันค่อยๆ ขยับขึ้นทีละนิด ตั้งแต่ 9.52 ➔ 10.52 ➔ 11.46 ➔ 12.37 ➔ 13.35 แล้วจึงไปถึง 14.20 ความค่อยเป็นค่อยไปนี้มีความสวยงามในแบบของมันเอง เพราะมันสะท้อนภาพสิ่งที่เราตั้งใจทำกับเด็กๆ มาตลอด นั่นคือการค่อยๆ สะสมความพร้อมผ่านการเตรียมตัว ฝึกซ้อม รับฟีดแบ็ก แก้ไข แล้วลองใหม่อีกครั้ง
          </p>
          <p>
            ในขณะเดียวกัน ผมไม่อยากให้ตัวเลขเหล่านี้ถูกเล่าจนสวยงามเกินจริง หลังจบกระบวนการ มีนักเรียนผ่านเกณฑ์ 22 คน จากทั้งหมด 27 คน นั่นแปลว่า <strong className="text-red-500">ยังมีอีก 5 คนที่ไม่ผ่าน</strong> และสำหรับผม ตัวเลข 5 คนนั้นมีความสำคัญไม่แพ้ 22 คนแรกเลยครับ เพราะมันคือเครื่องเตือนใจชั้นดีว่าเรายังมีโจทย์ที่ต้องหาคำถามและพัฒนาต่อไป
          </p>
          <p>
            งานวิจัยชิ้นนี้ไม่ได้สร้างสูตรสำเร็จที่ใช้ได้กับห้องเรียนทุกห้อง และเราไม่ควรนำผลลัพธ์ของเด็กกลุ่มนี้ไปอ้างอิงแทนเด็กทุกคน สิ่งเดียวที่ผมพูดได้อย่างรับผิดชอบในฐานะครูผู้สอนคือ ในบริบทของห้อง ม.2/5 เราได้เห็นแนวโน้มของพัฒนาการที่เติบโตขึ้นอย่างสอดคล้องกับหลักฐานตลอดกระบวนการ และได้เห็นพื้นที่ที่เราต้องเดินหน้าพัฒนาต่ออย่างชัดเจนที่สุดครับ
          </p>

          <hr className="border-slate-200 my-12" />

          <h3 className="text-3xl font-bold text-[#1e3a8a] mt-16 mb-4">
            Teacher’s Voice on Stage: จากเรื่องเล่าในห้องเรียน สู่การส่งเสียงที่ ICELS
          </h3>
          <p>
            เมื่อรายงานค่อยๆ เป็นรูปเป็นร่าง ผมเริ่มรู้สึกว่าเรื่องราวของห้อง ม.2/5 มีบางมิติที่ควรร่วมแบ่งปัน... ไม่ใช่เพราะผมคิดว่าตัวเองค้นพบวิธีที่ดีที่สุด และไม่ใช่เพราะอยากจะอวดอ้างว่า AI ทำให้ทุกอย่างประสบความสำเร็จ แต่นวัตกรรมนี้มี "เส้นทางที่เกิดขึ้นจริง" มันเริ่มจากการโอบรับปัญหาที่หลากหลาย การเลือกมองเพียงเรื่องเดียวให้ลึกซึ้ง การรับฟังคำตอบจากเด็ก การเลือกสิ่งที่เราพัฒนาได้จริง แล้วจึงค่อยๆ ก่อร่างสร้าง Intervention ขึ้นมาจากจุดนั้น จากนั้นเราลงมือทดลอง สังเกต เก็บหลักฐานเชิงประจักษ์ แล้วกลับมาทบทวนสะท้อนคิดอีกครั้ง ผมเชื่อว่ากระบวนการเรียนรู้เช่นนี้จะเป็นประโยชน์ต่อเพื่อนครูท่านอื่น แม้ว่าเขาจะไม่ได้ใช้ MAGIC STORY เหมือนเราก็ตาม
          </p>
          <p>
            ผมจึงตัดสินใจส่งผลงานไปที่ The 8th International Conference in English Language Studies 2026 (ICELS 2026) คำว่า "ลอง" ดูจะเข้ากับความรู้สึกของผมที่สุดในตอนนั้น เพราะมันไม่ใช่ความยโสที่คิดว่า "งานนี้ต้องได้ไปแน่" แต่มาจากความรู้สึกซื่อๆ ว่า เราทำงานนี้กับเด็กจริง เก็บข้อมูลจริง และมีเรื่องราวที่อยากแบ่งปัน... งั้นลองพามันเดินทางออกจากห้องเรียนดูสักครั้ง
          </p>
          <p>
            ในวันที่ได้ขึ้นไปเล่าเรื่องนี้บนเวที ผมไม่ได้รู้สึกว่าตัวเองกำลังพา "ผลิตภัณฑ์" ที่ชื่อ MAGIC STORY ไปจัดแสดง แต่ผมรู้สึกเหมือนได้นำพา "เส้นทางทั้งหมด" ขึ้นไปด้วย... ตั้งแต่จุดเริ่มต้นใน EAR 2024 ที่เปลี่ยนให้ผมกลายเป็นครูที่รักการตั้งคำถาม, สภาพปัญหาอันซับซ้อนในปี 2026, วันที่ตัดสินใจปักหมุดเรื่องการพูด, เสียงสะท้อนจาก Student Survey, Baseline Communicative Task, Focus-group Discussion, แผนการเรียนรู้ทั้ง 5 แผนที่เกิดขึ้นจากคำตอบของเด็ก, การดึง AI มาสนับสนุนโดยไม่กลบเสียงของผู้เรียน ไปจนถึงผลลัพธ์ที่ดีขึ้นที่มาพร้อมกับคำถามท้าทายใหม่ๆ ที่ยังไม่สิ้นสุด วินาทีนั้น แม้ผมจะยืนอยู่บนเวทีเพียงคนเดียว... แต่เรื่องราวที่เล่าออกไป คือ <strong>Teacher’s Voice</strong> ที่สะท้อนเสียงของผมและนักเรียน ม.2/5 และมันไม่เคยเป็นเรื่องของผมเพียงคนเดียวเลยครับ
          </p>

          {/* 💡 กล่องสรุป TReN Reflection พื้นสีฟ้า */}
          <div className="bg-[#EBF1FA] border-l-[6px] border-[#1e3a8a] p-8 md:p-10 rounded-r-3xl mt-16 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none"></div>
            
            <h3 className="text-3xl font-black text-[#1e3a8a] mb-6 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" /></svg>
              TReN Reflection <span className="font-medium text-xl md:text-2xl text-slate-500 ml-2 hidden sm:inline">(ถอดบทเรียนโดยกองบรรณาธิการ)</span>
            </h3>
            <p className="text-xl md:text-2xl text-slate-700 mb-8 font-medium">
              จากการเดินทางตลอด 3 ปีในเส้นทาง EAR ของครูศิรวิชญ์ ศรีเขียว ทีมงาน TReN ขอสรุป 4 มิติสำคัญที่สะท้อนถึงการเติบโตและการเปลี่ยนแปลงวิถีความเป็นครู (Teacher Transformation) ไว้ดังนี้:
            </p>
            
            <ul className="space-y-6 text-lg md:text-xl text-slate-700 leading-relaxed">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold shrink-0 mt-1">1</div>
                <div>
                  <strong className="font-bold text-[#1e3a8a] block mb-1">เปลี่ยนจากการคาดเดา เป็นการรับฟัง (From Assumption to Evidence):</strong>
                  เปลี่ยนจากการสรุปปัญหาในชั้นเรียนผ่านสายตาของครู มาเป็นการเปิดใจยอมรับความ "ยังไม่รู้" แล้วหันมาตั้งคำถาม เก็บหลักฐาน และฟังเสียงของนักเรียนอย่างแท้จริง
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold shrink-0 mt-1">2</div>
                <div>
                  <strong className="font-bold text-[#1e3a8a] block mb-1">ปรับบทบาทจากผู้ควบคุม สู่ผู้สร้างสภาพแวดล้อมแห่งความพร้อม (From Control to Readiness):</strong>
                  มองความเงียบของนักเรียนใหม่ว่าไม่ใช่เพราะ "พูดไม่ได้" แต่คือ "ขาดความพร้อม" เปลี่ยนบทบาทจากผู้ตรวจทานมาเป็นผู้สร้างพื้นที่ซ้อมที่ปลอดภัย และค่อยๆ ช่วยให้ผู้เรียนพัฒนาการเรียนรู้ได้ด้วยตนเอง
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold shrink-0 mt-1">3</div>
                <div>
                  <strong className="font-bold text-[#1e3a8a] block mb-1">เปลี่ยนเทคโนโลยีจาก "ตัวแสดงเอก" เป็น "ผู้ช่วยหลังฉาก" (From Hero to Backstage Support):</strong>
                  ใช้ AI อย่างมีเป้าหมายเพื่อเป็นเครื่องมือฝึกซ้อมและให้ฟีดแบ็ก โดยไม่แย่งพื้นที่แสดงออกซึ่งเป็นเสียงที่แท้จริงของนักเรียน (Students’ Voice)
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold shrink-0 mt-1">4</div>
                <div>
                  <strong className="font-bold text-[#1e3a8a] block mb-1">เปลี่ยนเป้าหมายวิจัย จาก "งานเอกสาร" สู่ "การแบ่งปันเพื่อเพื่อนครู" (From Compliance to Community):</strong>
                  เปลี่ยนมุมมองการทำวิจัยในชั้นเรียน จากภาระงานตามระเบียบปฏิบัติ ไปสู่กระบวนการเรียนรู้และสั่งสมประสบการณ์ระหว่างทาง จนเกิดความมั่นใจและพร้อมนำบทเรียนในห้องเรียนไปแบ่งปัน เพื่อสร้างแรงบันดาลใจให้แก่กันในเครือข่ายครู
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SirawitArticle;