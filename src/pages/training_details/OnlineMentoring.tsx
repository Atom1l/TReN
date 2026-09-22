/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const OnlineMentoring = () => {
  const { language, t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // ถ้า URL มี hash (เช่น #video-demo) ให้เลื่อนจอไปตรงนั้น
    if (window.location.hash === '#video-demo') {
      const element = document.getElementById('video-demo');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100); // ดีเลย์นิดนึงรอหน้าเรนเดอร์เสร็จ
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  const shareToFacebook = () => {
    const currentUrl = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`, '_blank', 'width=600,height=400');
  };

  const shareToX = () => {
    const currentUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(`${t('mentoring_title') || 'การให้คำปรึกษาออนไลน์ Online Mentoring'} - TReN`);
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
        
        <div className="text-[#555555] text-sm md:text-lg mt-4 ">
          <Link to="/" className="hover:text-[#1e3a8a] transition-colors">{t('nav_home') || 'หน้าหลัก'}</Link> / <span className="text-[#1e3a8a] font-bold">การให้คำปรึกษาออนไลน์</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#1e3a8a] leading-tight mt-4 break-words">
          การให้คำปรึกษาออนไลน์
        </h1>

        <div className="w-full h-[250px] sm:h-[400px] lg:h-[450px] rounded-xl overflow-hidden mb-10 shadow-sm border border-slate-100 mt-12 mb-16">
        <img 
            src="/Homepage/cover_2.webp" 
            alt="Training Model" 
            className="w-full h-full object-cover"
        />
        </div>

        {/* ==================== เนื้อหาบทความ ==================== */}
        <article className="space-y-12">
          
          {/* --- บทนำ: จุดประสงค์ --- */}
          <section>
            <h3 className="text-4xl font-bold text-[#1e3a8a] tracking-tight mb-6">
              {t('mentoring_purpose_title') || 'จุดประสงค์ของการ Mentoring'}
            </h3>
            
            <div className="border-l-[4px] border-[#1e3a8a] pl-5 md:pl-6 my-8 py-2 bg-slate-50 rounded-r-xl">
              <p className="text-2xl text-[#1e3a8a] italic font-medium leading-relaxed">
                "{t('mentoring_purpose_quote') || 'การประคับประคองและจับมือครูเดิน (Hand-in-Hand Mentoring) โดยไม่ปล่อยให้ครูรู้สึกโดดเดี่ยว ไม่เข้าไปกำหนดชี้นำ แต่ช่วยให้ครูค้นพบคำตอบได้ด้วยตนเอง'}"
              </p>
            </div>
            
            <p className="text-2xl text-slate-800 font-light leading-relaxed mb-8">
              {t('mentoring_purpose_desc') || 'ระบบการให้คำปรึกษาออนไลน์ของ TReN ออกแบบมาเพื่อดูแลครูผู้ทำวิจัยอย่างใกล้ชิดและยืดหยุ่นผ่านช่องทางออนไลน์ โดยยึดหลักการพัฒนาที่ให้ครูเป็นศูนย์กลางของการเรียนรู้'}
            </p>

            <h4 className="text-4xl font-bold text-[#1e3a8a] mt-10 mb-4">
              {t('mentoring_concept_title') || 'แนวคิดและข้อคิดสะท้อนจาก ศ.ดร.สุวิมล ว่องวาณิช'}
            </h4>
            <div className="border-l-[4px] border-[#1e3a8a] pl-5 md:pl-6 my-8 py-6 bg-slate-50 rounded-r-xl">
              <p className="text-xl md:text-2xl text-[#1e3a8a] italic font-medium leading-relaxed mb-4">
                "{t('mentoring_concept_quote') || '......(การทำวิจัย) เป็นเรื่องที่เข้าใจยากและต้องอาศัยการฝึกปฏิบัติภายใต้พี่เลี้ยงที่เข้าใจในวิธีการวิจัยอย่างสม่ำเสมอ'}"
              </p>
              <p className="text-lg md:text-xl font-bold text-[#1e3a8a] text-right pr-14">
                {t('mentoring_concept_ref') || '— ศ.ดร.สุวิมล ว่องวาณิช (การวิจัยปฏิบัติการในชั้นเรียน, 2550, หน้า 6)'}
              </p>
            </div>
            
            <p className="text-2xl text-slate-800 font-light leading-relaxed">
              {t('mentoring_concept_desc') || 'แนวคิดนี้คือหัวใจสำคัญที่ TReN นำมาออกแบบระบบ Mentoring เพราะเราเชื่อว่า เมื่อครูมีผู้ชี้แนะที่เคยผ่านประสบการณ์จริงมาคอยเติมพลังใจและประคองความคิด ความกังวลในการทำวิจัยจะเปลี่ยนเป็นความมั่นใจ และนำไปสู่ผลสำเร็จของการพัฒนาชั้นเรียนอย่างแท้จริง'}
            </p>
          </section>

          {/* --- Section 1: บทบาทและคุณสมบัติ --- */}
          <section className="pt-12 border-t border-slate-200">
            <h3 className="text-4xl font-bold text-[#1e3a8a] tracking-tight mb-8">
              {t('mentoring_roles_title') || 'บทบาท คุณสมบัติ และทักษะหลักของ Mentor'} <span className="text-xl text-slate-500 font-medium block mt-1">(TReN Mentor Profile & Skills)</span>
            </h3>
            
            <div className="space-y-10 pl-2">
              
              {/* Item 1 */}
              <div>
                <h4 className="text-3xl font-bold text-[#1e3a8a] mb-3 flex items-start gap-3">
                  <span className="text-[#1e3a8a] mt-1 shrink-0">&bull;</span>
                  <span>{t('mentoring_role_1_title') || 'ผ่านการบ่มเพาะและเปี่ยมด้วยประสบการณ์จริง'} <span className="text-slate-500 font-medium text-xl ml-2 block sm:inline-block">(Experienced & Trained Mentors)</span></span>
                </h4>
                <p className="text-2xl text-slate-800 font-light leading-relaxed pl-7">
                  {t('mentoring_role_1_desc') || 'Mentor ทุกท่านไม่เพียงแต่เคยผ่านประสบการณ์การทำวิจัย EAR ในชั้นเรียนของตนเองมาก่อนเท่านั้น แต่ยังได้รับการ อบรมบ่มเพาะทักษะการเป็นครูพี่เลี้ยงเชิงลึกจากโครงการ TReN ควบคู่กับการสะสมประสบการณ์จริงในบทบาท Mentor มาอย่างต่อเนื่อง 2–4 ปี จึงมีความเข้าใจทั้งกระบวนการวิจัยและการประคับประคองครูอย่างมืออาชีพ'}
                </p>
              </div>
              
              {/* Item 2 */}
              <div>
                <h4 className="text-3xl font-bold text-[#1e3a8a] mb-4 flex items-start gap-3">
                  <span className="text-[#1e3a8a] mt-1 shrink-0">&bull;</span>
                  <span>{t('mentoring_role_2_title') || 'ทักษะสำคัญในการประคับประคอง'} <span className="text-slate-500 font-medium text-xl ml-2 block sm:inline-block">(Essential Mentoring Skills)</span></span>
                </h4>
                
                <div className="pl-7 space-y-4">
                  <p className="text-xl md:text-2xl text-slate-800 font-light leading-relaxed flex items-start gap-3">
                    <span className="text-slate-300 shrink-0 mt-1">&bull;</span>
                    <span>
                      <strong className="font-semibold text-[#1e3a8a] mr-2">{t('mentoring_skill_1_bold') || 'การฟังอย่างไม่ตัดสิน (Active & Non-judgmental Listening):'}</strong>
                      {t('mentoring_skill_1_desc') || 'รับฟังด้วยความตั้งใจ เปิดรับทุกปัญหาและความกังวลของครู โดยไม่ตัดสินถูก-ผิด เพื่อสร้างพื้นที่ปลอดภัยทางความคิด (Psychological Safety)'}
                    </span>
                  </p>
                  
                  <p className="text-xl md:text-2xl text-slate-800 font-light leading-relaxed flex items-start gap-3">
                    <span className="text-slate-300 shrink-0 mt-1">&bull;</span>
                    <span>
                      <strong className="font-semibold text-[#1e3a8a] mr-2">{t('mentoring_skill_2_bold') || 'การเสริมนั่งร้านทางปัญญา (Scaffolding):'}</strong>
                      {t('mentoring_skill_2_desc') || 'การคอยสนับสนุนโครงสร้างความคิดและประคับประคองเป็นระยะ เพื่อให้ครูก้าวผ่านจุดยากลำบากในการทำวิจัยไปทีละขั้นอย่างมั่นใจ'}
                    </span>
                  </p>

                  <p className="text-xl md:text-2xl text-slate-800 font-light leading-relaxed flex items-start gap-3">
                    <span className="text-slate-300 shrink-0 mt-1">&bull;</span>
                    <span>
                      <strong className="font-semibold text-[#1e3a8a] mr-2">{t('mentoring_skill_3_bold') || 'ความเห็นอกเห็นใจและความเข้าใจบริบท (Empathy & Contextual Understanding):'}</strong>
                      {t('mentoring_skill_3_desc') || 'เข้าใจข้อจำกัด ภาระงาน และบริบทความเป็นจริงของโรงเรียนในระบบการศึกษาไทยเป็นอย่างดี ทำให้คำแนะนำที่ให้สามารถนำไปปฏิบัติจริงได้ในห้องเรียน'}
                    </span>
                  </p>
                </div>
              </div>
              
              {/* Item 3 */}
              <div>
                <h4 className="text-3xl font-bold text-[#1e3a8a] mb-3 flex items-start gap-3">
                  <span className="text-[#1e3a8a] mt-1 shrink-0">&bull;</span>
                  <span>{t('mentoring_role_3_title') || 'พลังของการตั้งคำถาม เพื่อสร้าง "ครูช่างสะท้อนคิด"'} <span className="text-slate-500 font-medium text-xl ml-2 block sm:inline-block">(Reflective Teacher)</span></span>
                </h4>
                <p className="text-2xl text-slate-800 font-light leading-relaxed pl-7">
                  {t('mentoring_role_3_desc') || 'Mentor ของ TReN จะไม่ใช้วิธีบอกคำตอบสำเร็จรูปหรือสั่งให้ทำ แต่จะใช้ "การตั้งคำถามเชิงสะท้อนคิด" (Reflective Questions) ชวนคุยและตั้งคำถามตลอดเวลา การฝึกตั้งคำถามอย่างต่อเนื่องนี้ ไม่เพียงช่วยแก้ปัญหาในวิจัยเท่านั้น แต่ยังมีเป้าหมายสำคัญเพื่อปลูกฝังกระบวนการคิด ให้เมื่อครูกลับไปทำวิจัยหรือจัดการเรียนรู้ด้วยตนเอง ครูจะกลายเป็น "Reflective Teacher" ที่คอยตั้งคำถาม ประเมิน และสะท้อนคิดกับการสอนของตนเองอยู่ตลอดเวลาอย่างเป็นธรรมชาติ'}
                </p>
              </div>

              {/* Item 4 */}
              <div>
                <h4 className="text-3xl font-bold text-[#1e3a8a] mb-3 flex items-start gap-3">
                  <span className="text-[#1e3a8a] mt-1 shrink-0">&bull;</span>
                  <span>{t('mentoring_role_4_title') || 'ลีลาการ Mentoring ที่เป็นเอกลักษณ์'} <span className="text-slate-500 font-medium text-xl ml-2 block sm:inline-block">(Unique & Flexible Mentoring Style)</span></span>
                </h4>
                <p className="text-2xl text-slate-800 font-light leading-relaxed pl-7">
                  {t('mentoring_role_4_desc') || 'การ Mentoring ใน TReN ไม่มีสูตรสำเร็จหรือรูปแบบตายตัว Mentor แต่ละท่านมีสไตล์ เอกลักษณ์ และเทคนิคเฉพาะตัวในการชวนคุยและสร้างบรรยากาศที่เป็นกันเอง เพื่อให้ครูรู้สึกผ่อนคลาย กล้าเปิดใจเล่าปัญหา และพร้อมเรียนรู้ไปด้วยกัน'}
                </p>
              </div>

            </div>
          </section>

          {/* --- Section 2: คลิปตัวอย่าง --- */}
          <section id="video-demo" className="pt-12 border-t border-slate-200">
            <h3 className="text-4xl font-bold text-[#1e3a8a] tracking-tight mb-6">
              {t('mentoring_clips_title') || 'สื่อเรียนรู้และคลิปวิดีโอตัวอย่าง'} <span className="text-xl text-slate-500 font-medium block mt-1">(Mentoring Video Demonstration)</span>
            </h3>
            <p className="text-2xl text-slate-800 font-light leading-relaxed mb-10 pl-2">
              {t('mentoring_clips_desc') || 'ภายในหน้านี้ ผู้สนใจสามารถรับชม คลิปวิดีโอตัวอย่างบรรยากาศการทำ Online Mentoring จริง ของ Mentor ในแต่ละสไตล์ เพื่อให้เห็นภาพกระบวนการตั้งคำถาม การประคับประคองความคิด และบทสนทนาการสะท้อนคิดที่เป็นธรรมชาติ:'}
            </p>

            <div className="space-y-6 pl-2">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-between group hover:bg-blue-50 transition-colors cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white text-[#1e3a8a] flex items-center justify-center shrink-0 border border-slate-200 group-hover:border-[#1e3a8a] transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                  </div>
                  <div>
                    <h4 className="text-xl md:text-2xl font-bold text-[#1e3a8a] mb-1">Video Clip 1</h4>
                    <p className="text-xl md:text-2xl text-slate-700 font-light">{t('mentoring_clip_1_desc') || 'การใช้คำถามเพื่อชวนครูทบทวนและตกผลึกโจทย์วิจัย (Exploration Phase)'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-between group hover:bg-blue-50 transition-colors cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white text-[#1e3a8a] flex items-center justify-center shrink-0 border border-slate-200 group-hover:border-[#1e3a8a] transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                  </div>
                  <div>
                    <h4 className="text-xl md:text-2xl font-bold text-[#1e3a8a] mb-1">Video Clip 2</h4>
                    <p className="text-xl md:text-2xl text-slate-700 font-light">{t('mentoring_clip_2_desc') || 'เทคนิคการตั้งคำถามเพื่อแก้ปัญหาเฉพาะหน้าในชั้นเรียน (Action Phase)'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-between group hover:bg-blue-50 transition-colors cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white text-[#1e3a8a] flex items-center justify-center shrink-0 border border-slate-200 group-hover:border-[#1e3a8a] transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1"><path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" /></svg>
                  </div>
                  <div>
                    <h4 className="text-xl md:text-2xl font-bold text-[#1e3a8a] mb-1">Video Clip 3</h4>
                    <p className="text-xl md:text-2xl text-slate-700 font-light">{t('mentoring_clip_3_desc') || 'การ Mentoring สไตล์กัลยาณมิตรเพื่อเติมพลังใจและสร้างลักษณะ Reflective Teacher (Reflection Phase)'}</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-8 pl-2 text-lg text-slate-400 font-light italic">
              *{t('mentoring_note') || 'หมายเหตุ: สามารถคลิกที่ชื่อคลิปเพื่อเปิดดูตัวอย่างได้ (รอการอัปเดตลิงก์วิดีโอ)'}
            </p>
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

export default OnlineMentoring;