/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const OnsiteTraining = () => {
  const { language, t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const shareToFacebook = () => {
    const currentUrl = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`, '_blank', 'width=600,height=400');
  };

  const shareToX = () => {
    const currentUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(`${t('training_model_title') || 'รูปแบบการอบรม Onsite Training'} - TReN`);
    window.open(`https://twitter.com/intent/tweet?url=${currentUrl}&text=${pageTitle}`, '_blank', 'width=600,height=400');
  };

  const shareToLine = () => {
    const currentUrl = encodeURIComponent(window.location.href);
    window.open(`https://social-plugins.line.me/lineit/share?url=${currentUrl}`, '_blank', 'width=600,height=400');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert(t('link_copied') || 'คัดลอกลิงก์เรียบร้อยแล้ว!');
  };

  return (
    <div className="w-full min-h-screen bg-white pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">

        {/* Breadcrumb */}
        <div className="text-[#555555] text-sm md:text-lg mt-4 ">
          <Link to="/" className="hover:text-[#1e3a8a] transition-colors">{t('nav_home') || 'หน้าหลัก'}</Link> / <span className="text-[#1e3a8a] font-bold">{t('training_model_title') || 'รูปแบบการอบรม'}</span>
        </div>

        {/* Header Title */}
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#1e3a8a] leading-tight mt-2 break-words">
          {t('training_model_title') || 'รูปแบบการอบรม'}
        </h1>

        {/* Hero Image */}
        <div className="w-full h-[250px] sm:h-[400px] lg:h-[450px] rounded-xl overflow-hidden mb-10 shadow-sm border border-slate-100 mt-12 mb-16">
          <img 
            src="/Homepage/cover_1.webp" 
            alt="Training Model" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* ==================== เนื้อหาบทความ (Blog Style) ==================== */}
        <article className="space-y-12">
          
          {/* --- บทนำ --- */}
          <section>
            <h3 className="text-5xl font-bold text-[#1e3a8a] tracking-tight mb-3">
              {t('training_intro_title') || 'กระบวนการพัฒนา 3 ระยะ & ระบบสนับสนุน 2 ระดับ'}
            </h3>
            <p className="text-2xl text-slate-800 font-light leading-relaxed mb-8">
              {t('training_intro_desc_1') || 'โครงการพัฒนาครูผ่าน EAR ออกแบบระบบให้ครูเติบโตอย่างเป็นขั้นตอน โดยมีโครงสร้างกระบวนการพัฒนา 3 ระยะ ควบคู่ไปกับ '}
              <strong className="font-semibold text-[#1e3a8a]">"{t('training_intro_desc_bold1') || 'ระบบสนับสนุน 2 ระดับ'}"</strong> 
              {' '}{t('training_intro_desc_2') || 'ที่เปรียบเสมือนระบบนิเวศแห่งการเรียนรู้ (Learning Ecology) ที่คอยโอบอุ้ม เพื่อให้มั่นใจว่าครูทุกคนจะได้รับความช่วยเหลืออย่างทั่วถึง และ '}
              <strong className="font-semibold text-[#1e3a8a]">"{t('training_intro_desc_bold2') || 'ไม่ถูกทิ้งไว้ข้างหลัง'}"</strong> 
              {' '}{t('training_intro_desc_3') || 'ตลอดเส้นทางการทำวิจัย'}
            </p>
          </section>

          {/* --- Section A: 3 ระยะ --- */}
          <section className="pt-2">
            <h3 className="text-4xl font-bold text-[#1e3a8a] tracking-tight mb-8">
              {t('training_sec_a_title') || 'ก. กระบวนการพัฒนา 3 ระยะ'} <span className="text-xl text-slate-500 font-medium block mt-1">(Core Training Phases)</span>
            </h3>
            
            <div className="space-y-10 pl-2">
              {/* ระยะที่ 1 */}
              <div>
                <h4 className="text-2xl font-bold text-[#1e3a8a] mb-3 flex items-start gap-3">
                  <span className="text-[#1e3a8a] mt-1 shrink-0">&bull;</span>
                  <span>{t('training_phase1_title') || 'ระยะที่ 1: บ่มเพาะฐานคิด'} <span className="text-slate-500 font-medium text-xl ml-2 inline-block">(Inception Phase)</span></span>
                </h4>
                <p className="text-2xl text-slate-800 font-light leading-relaxed pl-7">
                  {t('training_phase1_desc') || 'เข้าร่วมการอบรม Onsite Workshop เพื่อเสริมสร้างองค์ความรู้ กรอบแนวคิด และเข้าใจกระบวนการวิจัยปฏิบัติการเชิงสำรวจ (Exploratory Action Research: EAR) อย่างเป็นระบบ'}
                </p>
              </div>
              
              {/* ระยะที่ 2 */}
              <div>
                <h4 className="text-2xl font-bold text-[#1e3a8a] mb-3 flex items-start gap-3">
                  <span className="text-[#1e3a8a] mt-1 shrink-0">&bull;</span>
                  <span>{t('training_phase2_title') || 'ระยะที่ 2: ปฏิบัติการจริง'} <span className="text-slate-500 font-medium text-xl ml-2 inline-block">(Implementation Phase)</span></span>
                </h4>
                <p className="text-2xl text-slate-800 font-light leading-relaxed pl-7">
                  {t('training_phase2_desc') || 'ครูนำความรู้ลงไปปฏิบัติจริงในชั้นเรียนของตนเองผ่านกระบวนการ 7 Research Tasks โดยใช้เวลาต่อเนื่องตลอดภาคเรียน'}
                </p>
              </div>
              
              {/* ระยะที่ 3 */}
              <div>
                <h4 className="text-2xl font-bold text-[#1e3a8a] mb-3 flex items-start gap-3">
                  <span className="text-[#1e3a8a] mt-1 shrink-0">&bull;</span>
                  <span>{t('training_phase3_title') || 'ระยะที่ 3: สังเคราะห์และแบ่งปัน'} <span className="text-slate-500 font-medium text-xl ml-2 inline-block">(Synthesis & Dissemination)</span></span>
                </h4>
                <p className="text-2xl text-slate-800 font-light leading-relaxed pl-7">
                  {t('training_phase3_desc') || 'รวบรวม เรียบเรียง และนำเสนอผลงานวิจัยผ่านเวทีออนไลน์ EAR Sharing Session เพื่อแลกเปลี่ยนเรียนรู้ สรุปบทเรียนร่วมกัน และขยายผลสู่เครือข่ายวิชาชีพ'}
                </p>
              </div>
            </div>
          </section>

          {/* --- Section B: ระบบสนับสนุน --- */}
          <section className="pt-12 border-t-4 border-slate-300">
            <h3 className="text-4xl font-bold text-[#1e3a8a] tracking-tight mb-6">
              {t('training_sec_b_title') || 'ข. ระบบสนับสนุน 2 ระดับ'} <span className="text-xl text-slate-500 font-medium block mt-1">(Two-Tier Support System: The Safety Net)</span>
            </h3>
            <p className="text-2xl text-slate-800 font-light leading-relaxed mb-10 pl-2">
              {t('training_sec_b_desc') || 'เพื่อป้องกันไม่ให้การทำวิจัยกลายเป็นภาระที่โดดเดี่ยว และเพื่อให้ครูก้าวผ่านความท้าทายได้อย่างราบรื่นถูกต้องตามหลักวิชาการ โครงการจึงวางระบบสนับสนุนไว้ 2 ระดับ:'}
            </p>

            <div className="space-y-16 pl-2">
              
              {/* ระดับที่ 1 */}
              <div>
                <h4 className="text-3xl font-bold text-[#1e3a8a] mb-6 inline-block pb-2 border-b-4 border-[#1e3a8a]">
                  {t('training_tier1_title') || '1) ระดับรายบุคคล'} <span className="text-slate-500 font-medium text-xl">(Mentorship Level – {t('ratio') || 'อัตราส่วน'} 1 : 2)</span>
                </h4>
                
                <div className="border-l-[4px] border-[#1e3a8a] pl-5 md:pl-6 my-8 py-2 bg-slate-50 rounded-r-xl">
                  <p className="text-2xl text-[#1e3a8a] italic font-medium leading-relaxed">
                    "{t('training_tier1_quote') || 'การวิจัยของครูไม่ใช่การปล่อยให้ลงไปว่ายน้ำคนเดียวลำพังกลางมหาสมุทรแห่งปัญหา แต่มีคนคอยประคองให้ก้าวไปข้างหน้าได้อย่างมั่นใจ'}"
                  </p>
                </div>

                <div className="space-y-6">
                  <p className="text-2xl text-slate-800 font-light leading-relaxed flex items-start gap-3">
                    <span className="text-[#1e3a8a] mt-1 shrink-0">&bull;</span>
                    <span>
                      <strong className="font-semibold text-[#1e3a8a] mr-2">{t('training_tier1_p1_bold') || 'การดูแลแบบเข้มข้น:'}</strong>
                      {t('training_tier1_p1_desc') || 'จับคู่ครูพี่เลี้ยง (Mentor) 1 คน ต่อ ครูผู้ทำวิจัย 2 คน เพื่อให้การดูแลเป็นไปอย่างทั่วถึง ลึกซึ้ง และตรงจุด'}
                    </span>
                  </p>
                  <p className="text-2xl text-slate-800 font-light leading-relaxed flex items-start gap-3">
                    <span className="text-[#1e3a8a] mt-1 shrink-0">&bull;</span>
                    <span>
                      <strong className="font-semibold text-[#1e3a8a] mr-2">{t('training_tier1_p2_bold') || 'การสะท้อนคิดอย่างต่อเนื่อง (Reflective Dialogue):'}</strong>
                      {t('training_tier1_p2_desc') || 'ครูพี่เลี้ยงจะคอยให้คำปรึกษา ติดตามความก้าวหน้าอย่างใกล้ชิดทุก 1–2 สัปดาห์ ไม่เพียงแต่คอยตรวจทานงานวิจัยให้ถูกต้องตามหลักวิชาการเท่านั้น แต่ยังเป็นผู้ฟังที่คอยช่วยสะท้อนคิด (Reflection) คลายข้อสงสัย และช่วยหาแนวทางแก้ไขปัญหาที่เกิดขึ้นจริงในชั้นเรียน'}
                    </span>
                  </p>
                </div>
              </div>

              {/* ระดับที่ 2 */}
              <div>
                <h4 className="text-3xl font-bold text-[#1e3a8a] mb-6 inline-block pb-2 border-b-4 border-[#1e3a8a]">
                  {t('training_tier2_title') || '2) ระดับชุมชนวิชาชีพ'} <span className="text-slate-500 font-medium text-xl">(Community Level – EAR Community: EARC)</span>
                </h4>
                
                <div className="border-l-[4px] border-[#1e3a8a] pl-5 md:pl-6 my-8 py-2 bg-slate-50 rounded-r-xl">
                  <p className="text-2xl text-[#1e3a8a] italic font-medium leading-relaxed">
                    "{t('training_tier2_quote') || 'สร้างระบบนิเวศการเรียนรู้ (Ecology of Training) ที่เชื่อมโยงครูเข้าด้วยกัน เพื่อให้เห็นว่าเราต่างเผชิญความท้าทายร่วมกัน และไม่มีใครต้องต่อสู้เพียงลำพัง'}"
                  </p>
                </div>

                <div className="space-y-8">
                  <p className="text-2xl text-slate-800 font-light leading-relaxed flex items-start gap-3">
                    <span className="text-[#1e3a8a] mt-1 shrink-0">&bull;</span>
                    <span>
                      <strong className="font-semibold text-[#1e3a8a] mr-2">{t('training_tier2_p1_bold') || 'เครือข่ายเพื่อนร่วมทาง (Peer Support):'}</strong>
                      {t('training_tier2_p1_desc') || 'จัดกลุ่มชุมชนย่อยขนาด 7–12 คน (ประกอบด้วยครูผู้ทำวิจัยและครูพี่เลี้ยง) เพื่อสร้างพื้นที่ปลอดภัยทางวิชาการและการเรียนรู้'}
                    </span>
                  </p>
                  
                  <div className="text-2xl text-slate-800 font-light leading-relaxed flex items-start gap-3">
                    <span className="text-[#1e3a8a] mt-1 shrink-0">&bull;</span>
                    <div>
                      <strong className="font-semibold text-[#1e3a8a] block mb-3">{t('training_tier2_p2_bold') || 'เวทีสะท้อนคิดแลกเปลี่ยน (Roundtable Discussion 2 ครั้งสำคัญ):'}</strong>
                      <ul className="pl-6 space-y-3">
                        <li className="flex items-start">
                          <span className="text-slate-400 mr-3 mt-1.5 leading-none text-xl">-</span>
                          <span><strong className="font-medium text-[#1e3a8a]">{t('training_tier2_p2_1_bold') || 'ครั้งที่ 1:'}</strong> {t('training_tier2_p2_1_desc') || 'หลังสิ้นสุดขั้นตอนการสำรวจปัญหา (Exploratory Phase) เพื่อทบทวนโจทย์วิจัยและแผนการจัดการเรียนรู้ร่วมกัน'}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-slate-400 mr-3 mt-1.5 leading-none text-xl">-</span>
                          <span><strong className="font-medium text-[#1e3a8a]">{t('training_tier2_p2_2_bold') || 'ครั้งที่ 2:'}</strong> {t('training_tier2_p2_2_desc') || 'หลังสิ้นสุดขั้นตอนการปฏิบัติการและเก็บข้อมูล (Action Phase) เพื่อสรุปบทเรียนและผลลัพธ์ที่เกิดขึ้น'}</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <p className="text-2xl text-slate-800 font-light leading-relaxed flex items-start gap-3">
                    <span className="text-[#1e3a8a] mt-1 shrink-0">&bull;</span>
                    <span>
                      <strong className="font-semibold text-[#1e3a8a] mr-2">{t('training_tier2_p3_bold') || 'เติมพลังใจและป้องกันภาวะหมดไฟ (Burnout Prevention):'}</strong>
                      {t('training_tier2_p3_desc') || 'เป็นพื้นที่แลกเปลี่ยนประสบการณ์ อุปสรรค และทางออกภายใต้บรรยากาศกัลยาณมิตร การได้ยินได้ฟังปัญหาและวิธีแก้จากเพื่อนครู (Peers) ช่วยให้เกิดแรงบันดาลใจ ถอดบทเรียนร่วมกัน และขับเคลื่อนการทำงานไปด้วยกันโดยไม่มีใครถูกทิ้งไว้เบื้องหลัง'}
                    </span>
                  </p>
                </div>
              </div>

            </div>
          </section>

        </article>

        {/* ==================== ปุ่ม Share ==================== */}
        <div className='mt-16 pt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-slate-200'>
          <h3 className="text-xl font-bold text-[#1e3a8a] tracking-wide m-0">{t('share_post') || 'แชร์เนื้อหานี้ให้เพื่อนครู'}</h3>
          <div className="flex flex-wrap gap-4">
            <button onClick={shareToFacebook} title="Share to Facebook" className="w-12 h-12 bg-[#EBF1FA] text-[#1e3a8a] rounded-lg flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all cursor-pointer shadow-sm">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
            </button>
            <button onClick={shareToX} title="Share to X (Twitter)" className="w-12 h-12 bg-[#EBF1FA] text-[#1e3a8a] rounded-lg flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer shadow-sm">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"></path></svg>
            </button>
            <button onClick={shareToLine} title="Share to LINE" className="w-12 h-12 bg-[#EBF1FA] text-[#1e3a8a] rounded-lg flex items-center justify-center font-black text-sm hover:bg-[#00B900] hover:text-white transition-all cursor-pointer shadow-sm">
              LINE
            </button>
            <button onClick={handleCopyLink} title="คัดลอกลิงก์" className="w-12 h-12 bg-[#EBF1FA] text-[#1e3a8a] rounded-lg flex items-center justify-center hover:bg-[#1e3a8a] hover:text-white transition-all cursor-pointer shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OnsiteTraining;