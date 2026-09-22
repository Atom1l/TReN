/* eslint-disable react-hooks/static-components */
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AboutTeam: React.FC = () => {
  const { t } = useLanguage();

  // คอมโพเนนต์ป้ายกำกับ "รอประกาศรายชื่อ" (TBA Badge) ให้ดูสะอาดตาและเป็นมืออาชีพ
  const TbaBadge = () => (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 mt-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 opacity-80">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      <span className="text-lg font-light tracking-wide">{t('team_tba') || 'รอประกาศรายชื่ออย่างเป็นทางการ'}</span>
    </div>
  );

  return (
    <div className="w-full bg-[#F8FAFC] font-sans selection:bg-blue-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 md:pt-24 pb-12 mt-14">
        
        {/* Header Section */}
        <section className="mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
            {t('team_main_title') || 'ทีมบริหารเครือข่าย'} 
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 font-medium tracking-widest mt-4 uppercase">
            {t('team_main_en_title') || 'Network Management Team'}
          </p>
          <div className="w-20 h-1.5 bg-[#1e3a8a] mt-8 rounded-full"></div>
        </section>

        {/* =========================================
            Section 1: Advisory & Strategic Partners
        ========================================= */}
        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] tracking-tight">{t('team_sec1_title') || 'ทีมที่ปรึกษาและผู้แทนองค์กรเครือข่าย'}</h2>
            <p className="text-lg text-slate-500 uppercase tracking-widest mt-2">{t('team_sec1_en') || 'Advisory & Strategic Partners'}</p>
          </div>
          
          <div className="space-y-0 border-t-[2px] border-[#1e3a8a]">
            {/* ที่ปรึกษากิตติมศักดิ์ */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-16 py-8 border-b border-slate-200">
              <div className="md:w-4/12 shrink-0">
                <h3 className="text-2xl font-bold text-[#1e3a8a]">{t('team_role_honorary') || 'ที่ปรึกษากิตติมศักดิ์'}</h3>
                <span className="text-lg text-slate-500 font-medium">(Honorary Advisors)</span>
              </div>
              <div className="md:w-8/12">
                <p className="text-2xl text-slate-800 font-medium">{t('team_p1_name') || 'ดร. รัชนี เดอร์ซิงห์'}</p>
                <p className="text-xl text-slate-500 mt-1 font-light">{t('team_p1_desc') || 'คณะศิลปศาสตร์ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี'}</p>
              </div>
            </div>

            {/* ที่ปรึกษาต่างประเทศ */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-16 py-8 border-b border-slate-200">
              <div className="md:w-4/12 shrink-0">
                <h3 className="text-2xl font-bold text-[#1e3a8a]">{t('team_role_inter') || 'ที่ปรึกษาต่างประเทศ'}</h3>
                <span className="text-lg text-slate-500 font-medium">(International Advisors)</span>
              </div>
              <div className="md:w-8/12">
                <p className="text-2xl text-slate-800 font-medium">{t('team_p2_name') || 'Professor Richard Smith'}</p>
                <p className="text-xl text-slate-500 mt-1 font-light">{t('team_p2_desc') || 'Warwick University, UK'}</p>
              </div>
            </div>

            {/* ผู้ทรงคุณวุฒิวิชาการ */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-16 py-8 border-b border-slate-200">
              <div className="md:w-4/12 shrink-0">
                <h3 className="text-2xl font-bold text-[#1e3a8a]">{t('team_role_expert') || 'ผู้ทรงคุณวุฒิวิชาการ'}</h3>
                <span className="text-lg text-slate-500 font-medium">(Experts)</span>
              </div>
              <div className="md:w-8/12">
                <p className="text-2xl text-slate-800 font-medium">{t('team_p3_name') || 'รศ. สนธิดา เกยูรวงศ์'}</p>
                <p className="text-xl text-slate-500 mt-1 font-light leading-relaxed">{t('team_p3_desc') || 'ผู้เชี่ยวชาญอิสระด้านการพัฒนาครู / อดีตอาจารย์ประจำคณะศิลปศาสตร์ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี'}</p>
              </div>
            </div>

            {/* ผู้แทนองค์กรภาคี */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-16 py-8 border-b border-slate-200">
              <div className="md:w-4/12 shrink-0">
                <h3 className="text-2xl font-bold text-[#1e3a8a]">{t('team_role_partner') || 'ผู้แทนองค์กรภาคี'}</h3>
                <span className="text-lg text-slate-500 font-medium">(Partner Representatives)</span>
              </div>
              <div className="md:w-8/12">
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-2xl text-slate-800 font-light"><span className="w-1.5 h-1.5 rounded-full bg-[#1e3a8a]"></span> {t('team_partner_1') || 'ผู้แทนจาก British Council Thailand'}</li>
                  <li className="flex items-center gap-3 text-2xl text-slate-800 font-light"><span className="w-1.5 h-1.5 rounded-full bg-[#1e3a8a]"></span> {t('team_partner_2') || 'ผู้แทนจาก RELO'}</li>
                  <li className="flex items-center gap-3 text-2xl text-slate-800 font-light"><span className="w-1.5 h-1.5 rounded-full bg-[#1e3a8a]"></span> {t('team_partner_3') || 'ผู้แทนจาก HCEC'}</li>
                  <li className="flex items-center gap-3 text-2xl text-slate-800 font-light"><span className="w-1.5 h-1.5 rounded-full bg-[#1e3a8a]"></span> {t('team_partner_4') || 'ผู้แทนจาก...'}</li>
                </ul>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================
            Section 2: Core Executive Team
        ========================================= */}
        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] tracking-tight">{t('team_sec2_title') || 'ทีมบริหารเครือข่ายส่วนกลาง'}</h2>
            <p className="text-lg text-slate-500 uppercase tracking-widest mt-2">{t('team_sec2_en') || 'Core Executive Team'}</p>
          </div>
          
          <div className="space-y-0 border-t-[2px] border-[#1e3a8a]">
            {/* ที่ปรึกษา */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-16 py-8 border-b border-slate-200">
              <div className="md:w-4/12 shrink-0">
                <h3 className="text-2xl font-bold text-[#1e3a8a]">{t('team_role_advisor') || 'ที่ปรึกษา'}</h3>
              </div>
              <div className="md:w-8/12">
                <p className="text-2xl text-slate-800 font-medium">{t('team_p1_name') || 'ดร. รัชนี เดอร์ซิงห์'}</p>
                <p className="text-xl text-slate-500 mt-1 font-light">{t('team_p1_desc') || 'คณะศิลปศาสตร์ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี'}</p>
              </div>
            </div>

            {/* อดีตประธานเครือข่าย */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-16 py-8 border-b border-slate-200">
              <div className="md:w-4/12 shrink-0">
                <h3 className="text-2xl font-bold text-[#1e3a8a]">{t('team_role_past_pres_short') || 'อดีตประธานเครือข่าย'}</h3>
              </div>
              <div className="md:w-8/12">
                <p className="text-2xl text-slate-400 font-light">-</p>
              </div>
            </div>

            {/* ประธาน & รองประธาน */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-16 py-8 border-b border-slate-200">
              <div className="md:w-4/12 shrink-0">
                <h3 className="text-2xl font-bold text-[#1e3a8a] mb-8">{t('team_role_pres') || 'ประธานเครือข่าย'}</h3>
                <h3 className="text-2xl font-bold text-[#1e3a8a]">{t('team_role_vp') || 'รองประธานเครือข่าย'}</h3>
              </div>
              <div className="md:w-8/12">
                <div className="mb-6">
                  <p className="text-2xl text-slate-800 font-medium">{t('team_role_pres1') || 'ครูจิติมา ดวงมณี'}</p>
                  <p className="text-xl text-slate-500 mt-1 font-light">{t('team_role_pres1_desc') || 'โรงเรียนสุรธรรมพิทักษ์ นครราชสีมา'}</p>
                </div>
                <div>
                  <p className="text-2xl text-slate-800 font-medium">{t('team_role_vp1') || 'ครูพัชรินทร์ กุลณา'}</p>
                  <p className="text-xl text-slate-500 mt-1 font-light">{t('team_role_vp1_desc') || 'โรงเรียนดำรงราษฏร์สงเคราะห์ เชียงราย'}</p>
                </div>
              </div>
            </div>

            {/* ทีมประสานงานภูมิภาค */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-16 py-8 border-b border-slate-200">
              <div className="md:w-4/12 shrink-0">
                <h3 className="text-2xl font-bold text-[#1e3a8a]">{t('team_role_coord') || 'ทีมประสานงานภูมิภาค'}</h3>
                <span className="text-lg text-slate-500 font-medium">(EARC Coordinator)</span>
              </div>
              <div className="md:w-8/12 flex items-center">
                <TbaBadge />
              </div>
            </div>

            {/* ทีมสื่อสาร */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-16 py-8 border-b border-slate-200">
              <div className="md:w-4/12 shrink-0">
                <h3 className="text-2xl font-bold text-[#1e3a8a]">{t('team_role_comms') || 'ทีมสื่อสารและดูแลสมาชิก'}</h3>
              </div>
              <div className="md:w-8/12 flex items-center">
                <TbaBadge />
              </div>
            </div>

            {/* เลขานุการ */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-16 py-8 border-b border-slate-200">
              <div className="md:w-4/12 shrink-0">
                <h3 className="text-2xl font-bold text-[#1e3a8a]">{t('team_role_sec') || 'ทีมเลขานุการและเหรัญญิก'}</h3>
              </div>
              <div className="md:w-8/12 flex items-center">
                <TbaBadge />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutTeam;