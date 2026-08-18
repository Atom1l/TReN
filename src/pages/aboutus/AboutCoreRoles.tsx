import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AboutCoreRole: React.FC = () => {
  const { t } = useLanguage();

  const pillars = [
    {
      id: '01',
      title: t('role_pillar_1_title') || 'ด้านการพัฒนาศักยภาพและยกระดับวิชาการ',
      en: t('role_pillar_1_en') || '(Capacity Building & Mentor Training)',
      theme: 'blue',
      bgLight: 'bg-blue-50/50',
      textAccent: 'text-[#1e3a8a]',
      borderAccent: 'border-blue-200',
      iconBg: 'bg-blue-100',
      items: [
        {
          name: t('role_p1_item1_name') || 'การอบรมการทำวิจัยในชั้นเรียนระดับชาติ (Centralized EAR Workshop)',
          desc: t('role_p1_item1_desc') || 'จัดการอบรมส่วนกลางปีละ 1–2 ครั้ง เพื่อสร้างมาตรฐานการทำวิจัยปฏิบัติเชิงสำรวจ EAR และขยายโอกาสให้ครูในพื้นที่ห่างไกลเข้าถึงกระบวนการพัฒนาตนเอง'
        },
        {
          name: t('role_p1_item2_name') || 'การพัฒนาศักยภาพครูพี่เลี้ยงขั้นสูง (Mentor Advanced Training)',
          desc: t('role_p1_item2_desc') || 'จัด Workshop เติมทักษะขั้นสูง (เช่น Co-coaching และ Advanced Reflective Practice) ให้แก่กลุ่มครูพี่เลี้ยงเดิม ควบคู่กับการบ่มเพาะครูพี่เลี้ยงรุ่นใหม่เพื่อรองรับการขยายตัวของเครือข่าย'
        },
        {
          name: t('role_p1_item3_name') || 'การเสวนาวิชาการออนไลน์ (TReN Webinar Series)',
          desc: t('role_p1_item3_desc') || 'จัดสัมมนาออนไลน์อย่างต่อเนื่องเพื่อพัฒนาองค์ความรู้ใหม่ โดยเชิญผู้เชี่ยวชาญจากสถาบันอุดมศึกษา, British Council และ RELO ร่วมถ่ายทอดแนวโน้มการจัดการเรียนรู้ยุคใหม่'
        }
      ]
    },
    {
      id: '02',
      title: t('role_pillar_2_title') || 'ด้านการบริหารเครือข่ายและการติดตามประเมินผล',
      en: t('role_pillar_2_en') || '(Governance & Network Management)',
      theme: 'emerald',
      bgLight: 'bg-emerald-50/50',
      textAccent: 'text-emerald-600',
      borderAccent: 'border-emerald-200',
      iconBg: 'bg-emerald-100',
      items: [
        {
          name: t('role_p2_item1_name') || 'การประชุมติดตามผลและวางยุทธศาสตร์เครือข่ายระดับชาติ (Annual EARC Review & Strategy Meeting / TReN Retreat)',
          desc: t('role_p2_item1_desc') || 'เวทีสำหรับตัวแทน EARC เข้ามารายงานผลการดำเนินงาน แลกเปลี่ยนความท้าทาย และเข้ารับการเติมเต็มทักษะใหม่ (Retraining) เพื่อนำกลับไปขับเคลื่อนพื้นที่ตนเองได้อย่างเข้มแข็งและพึ่งพาตนเองได้'
        },
        {
          name: t('role_p2_item2_name') || 'การประเมินผลกระทบเชิงลึก (Impact Analysis)',
          desc: t('role_p2_item2_desc') || 'ประเมินและติดตามผลกระทบของการทำวิจัย EAR อย่างเป็นรูปธรรม ทั้งในมิติการเปลี่ยนแปลงของตัวครู ห้องเรียน นักเรียน และชุมชน เพื่อนำข้อมูลมาใช้ปรับปรุงยุทธศาสตร์การพัฒนาการศึกษาในระยะยาว'
        }
      ]
    },
    {
      id: '03',
      title: t('role_pillar_3_title') || 'ด้านการเผยแพร่ผลงานและเชื่อมโยงสู่สากล',
      en: t('role_pillar_3_en') || '(Dissemination, Impact Analysis & Internationalization)',
      theme: 'orange',
      bgLight: 'bg-orange-50/50',
      textAccent: 'text-orange-600',
      borderAccent: 'border-orange-200',
      iconBg: 'bg-orange-100',
      items: [
        {
          name: t('role_p3_item1_name') || 'การประชุมวิชาการระดับชาติและภูมิภาค (EAR Conference)',
          desc: t('role_p3_item1_desc') || 'จัดเวทีนำเสนอผลงานวิจัยในชั้นเรียน (ทั้งรูปแบบ Oral และ Poster Presentation) เพื่อส่งเสริมความก้าวหน้าทางวิชาชีพและสร้างความภาคภูมิใจให้แก่ครูในเครือข่าย'
        },
        {
          name: t('role_p3_item2_name') || 'โครงการแลกเปลี่ยนวิจัยเชิงปฏิบัติการระดับภูมิภาค (Cross-Border AR Fellowship Program)',
          desc: t('role_p3_item2_desc') || 'ผนึกกำลังร่วมกับ British Council และ RELO ในการขยายผลกระบวนการ EAR สู่ประเทศเพื่อนบ้าน (ลาว กัมพูชา เวียดนาม และเมียนมา) พร้อมผลักดันให้ครูพี่เลี้ยงไทยก้าวสู่การเป็นผู้เชี่ยวชาญและให้คำปรึกษาในระดับภูมิภาค'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-blue-200 pb-20 tracking-wide">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/70 to-transparent -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24 mt-1">
        
        {/* Header Section */}
        <section className="max-w-4xl mb-16 relative text-center md:text-left mx-auto md:mx-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
            {t('role_main_title') || 'บทบาทและภารกิจหลัก'}
            <span className="block text-3xl md:text-4xl lg:text-5xl text-slate-400 mt-3 font-medium tracking-normal">
              {t('role_subtitle') || 'TReN Core Roles & Missions'}
            </span>
          </h1>
          <div className="w-20 h-1.5 bg-[#1e3a8a] mt-8 rounded-full mx-auto md:mx-0"></div>
        </section>

        {/* Intro Highlight Box */}
        <section className="mb-20">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 relative overflow-hidden">
            {/* Abstract Background Shape */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
              <div className="lg:w-1/3 shrink-0">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-800 leading-snug">
                  {t('role_intro_headline') || 'องค์กรสนับสนุนหลัก'}
                  <span className="block text-[#1e3a8a] mt-1">{t('role_intro_headline_en') || '(Supporting Body)'}</span>
                </h3>
              </div>
              <div className="lg:w-2/3 space-y-6">
                <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-light">
                  {t('role_intro_p1') || 'TReN ทำหน้าที่เพื่อสร้างความยั่งยืนให้แก่ระบบการพัฒนาครูอย่างแท้จริง โดยมุ่งเน้นการส่งเสริมและสนับสนุนให้ครูไทยสามารถวิเคราะห์และแก้ไขปัญหาในชั้นเรียนได้ด้วยตนเองผ่านกระบวนการ Exploratory Action Research (EAR)'}
                </p>
                <div className="bg-blue-50/50 p-6 rounded-2xl border-l-4 border-[#1e3a8a] text-slate-700 leading-relaxed">
                  {t('role_intro_p2') || 'TReN ยึดเอา ชุมชน EAR Community (EARC) ในระดับพื้นที่เป็นหัวใจสำคัญ และเข้ามาบริหารจัดการความยั่งยืนด้วยการส่งเสริม หนุนเสริม และสร้างความเข้มแข็ง ให้ชุมชน EARC ในแต่ละภูมิภาคสามารถบริหารจัดการตนเอง พัฒนาศักยภาพสมาชิกด้านการทำวิจัย EAR ได้อย่างต่อเนื่อง พร้อมทั้งขยายผลการอบรมให้ครอบคลุมครูทั่วประเทศได้อย่างพึ่งพาตนเองได้ในระยะยาว'}
                </div>
                <p className="text-xl font-semibold text-slate-800 pt-4">
                  {t('role_intro_bridge') || 'โดยขับเคลื่อนภารกิจผ่าน 3 เสาหลัก ได้แก่:'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Pillars Grid Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {pillars.map((pillar) => (
            <div key={pillar.id} className={`flex flex-col h-full bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300`}>
              
              {/* Pillar Header */}
              <div className={`p-8 md:p-10 ${pillar.bgLight} border-b ${pillar.borderAccent} relative overflow-hidden`}>
                <div className={`absolute -right-6 -top-6 text-8xl font-black opacity-5 select-none ${pillar.textAccent}`}>
                  {pillar.id}
                </div>
                <div className="relative z-10">
                  <div className={`text-sm font-bold tracking-widest uppercase mb-4 ${pillar.textAccent}`}>
                    {t('role_pillar_prefix') || 'เสาหลักที่'} {pillar.id}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 leading-snug">
                    {pillar.title}
                  </h3>
                  <div className={`font-semibold mt-2 text-sm leading-snug ${pillar.textAccent}`}>
                    {pillar.en}
                  </div>
                </div>
              </div>

              {/* Pillar Content / Items */}
              <div className="p-8 md:p-10 flex-1 bg-white">
                <div className="space-y-8">
                  {pillar.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start group">
                      {/* Custom Bullet Icon */}
                      <div className={`shrink-0 w-8 h-8 rounded-full ${pillar.iconBg} ${pillar.textAccent} flex items-center justify-center mt-1 group-hover:scale-110 transition-transform`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                        </svg>
                      </div>
                      
                      {/* Item Text */}
                      <div>
                        <h4 className="text-lg font-bold text-slate-800 mb-2 leading-snug group-hover:text-[#1e3a8a] transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-slate-600 font-light leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </section>

      </div>
    </div>
  );
};

export default AboutCoreRole;