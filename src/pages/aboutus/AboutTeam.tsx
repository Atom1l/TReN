import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AboutTeam: React.FC = () => {
  const { t } = useLanguage();

  // ข้อมูลทีมภูมิภาค
  const regionalTeams = [
    {
      region: t('team_reg_north') || '1. ภาคเหนือ (EARC North)',
      zones: [
        { name: t('team_zone_upper') || 'ตอนบน', head: t('team_dummy_name'), headSchool: t('team_dummy_school'), deputy: t('team_dummy_name'), deputySchool: t('team_dummy_school'), committee: t('team_dummy_name'), committeeSchool: t('team_dummy_school') },
        { name: t('team_zone_lower') || 'ตอนล่าง', head: t('team_dummy_name'), headSchool: t('team_dummy_school'), deputy: t('team_dummy_name'), deputySchool: t('team_dummy_school'), committee: t('team_dummy_name'), committeeSchool: t('team_dummy_school') }
      ]
    },
    {
      region: t('team_reg_northeast') || '2. ภาคตะวันออกเฉียงเหนือ (EARC Northeast)',
      zones: [
        { name: t('team_zone_upper') || 'ตอนบน', head: t('team_dummy_name'), headSchool: t('team_dummy_school'), deputy: t('team_dummy_name'), deputySchool: t('team_dummy_school'), committee: t('team_dummy_name'), committeeSchool: t('team_dummy_school') },
        { name: t('team_zone_lower') || 'ตอนล่าง', head: t('team_dummy_name'), headSchool: t('team_dummy_school'), deputy: t('team_dummy_name'), deputySchool: t('team_dummy_school'), committee: t('team_dummy_name'), committeeSchool: t('team_dummy_school') }
      ]
    },
    {
      region: t('team_reg_central') || '3. ภาคกลาง (EARC Central)',
      zones: [
        { name: '', head: t('team_dummy_name'), headSchool: t('team_dummy_school'), deputy: t('team_dummy_name'), deputySchool: t('team_dummy_school'), committee: t('team_dummy_name'), committeeSchool: t('team_dummy_school') }
      ]
    },
    {
      region: t('team_reg_east') || '4. ภาคตะวันออก (EARC East)',
      zones: [
        { name: '', head: t('team_dummy_name'), headSchool: t('team_dummy_school'), deputy: t('team_dummy_name'), deputySchool: t('team_dummy_school'), committee: t('team_dummy_name'), committeeSchool: t('team_dummy_school') }
      ]
    },
    {
      region: t('team_reg_south') || '5. ภาคใต้ (EARC South)',
      zones: [
        { name: t('team_zone_upper') || 'ตอนบน', head: t('team_dummy_name'), headSchool: t('team_dummy_school'), deputy: t('team_dummy_name'), deputySchool: t('team_dummy_school'), committee: t('team_dummy_name'), committeeSchool: t('team_dummy_school') },
        { name: t('team_zone_lower') || 'ตอนล่าง', head: t('team_dummy_name'), headSchool: t('team_dummy_school'), deputy: t('team_dummy_name'), deputySchool: t('team_dummy_school'), committee: t('team_dummy_name'), committeeSchool: t('team_dummy_school') }
      ]
    }
  ];

  return (
    <div className="w-full bg-[#F8FAFC] font-sans selection:bg-blue-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 md:pt-24">
        
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
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] tracking-tight">{t('team_sec1_title') || 'ทีมที่ปรึกษาและพันธมิตรยุทธศาสตร์'}</h2>
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

            {/* อดีตประธานเครือข่าย */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-16 py-8 border-b border-slate-200">
              <div className="md:w-4/12 shrink-0">
                <h3 className="text-2xl font-bold text-[#1e3a8a]">{t('team_role_past_pres') || 'อดีตประธานเครือข่าย'}</h3>
                <span className="text-lg text-slate-500 font-medium">(Immediate-Past President)</span>
              </div>
              <div className="md:w-8/12">
                <p className="text-2xl text-slate-800 font-light">-</p>
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

            {/* อดีตประธาน */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-16 py-8 border-b border-slate-200">
              <div className="md:w-4/12 shrink-0">
                <h3 className="text-2xl font-bold text-[#1e3a8a]">{t('team_role_past_pres_short') || 'อดีตประธานเครือข่าย'}</h3>
              </div>
              <div className="md:w-8/12">
                <p className="text-2xl text-slate-800 font-light">-</p>
              </div>
            </div>

            {/* ประธาน & รองประธาน */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-16 py-8 border-b border-slate-200">
              <div className="md:w-4/12 shrink-0">
                <h3 className="text-2xl font-bold text-[#1e3a8a] mb-8">{t('team_role_pres') || 'ประธานเครือข่าย'}</h3>
                <h3 className="text-2xl font-bold text-[#1e3a8a]">{t('team_role_vp') || 'รองประธานเครือข่าย'}</h3>
              </div>
              <div className="md:w-8/12">
                <div className="mb-8 space-y-2">
                  <p className="text-2xl text-slate-800 font-light">0</p>
                  <p className="text-2xl text-slate-800 font-light">0</p>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl text-slate-800 font-light">0</p>
                  <p className="text-2xl text-slate-800 font-light">0</p>
                </div>
              </div>
            </div>

            {/* ทีมประสานงานภูมิภาค */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-16 py-8 border-b border-slate-200">
              <div className="md:w-4/12 shrink-0">
                <h3 className="text-2xl font-bold text-[#1e3a8a]">{t('team_role_coord') || 'ทีมประสานงานภูมิภาค'}</h3>
                <span className="text-lg text-slate-500 font-medium">(EARC Coordinator)</span>
              </div>
              <div className="md:w-8/12 grid grid-cols-1 sm:grid-cols-2 gap-y-3">
                <p className="text-2xl text-slate-800 font-light">0</p>
                <p className="text-2xl text-slate-800 font-light">0</p>
                <p className="text-2xl text-slate-800 font-light">0</p>
                <p className="text-2xl text-slate-800 font-light">0</p>
              </div>
            </div>

            {/* ทีมสื่อสาร */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-16 py-8 border-b border-slate-200">
              <div className="md:w-4/12 shrink-0">
                <h3 className="text-2xl font-bold text-[#1e3a8a]">{t('team_role_comms') || 'ทีมสื่อสารและดูแลสมาชิก'}</h3>
              </div>
              <div className="md:w-8/12 grid grid-cols-1 sm:grid-cols-2 gap-y-3">
                <p className="text-2xl text-slate-800 font-light">0</p>
                <p className="text-2xl text-slate-800 font-light">0</p>
                <p className="text-2xl text-slate-800 font-light">0</p>
                <p className="text-2xl text-slate-800 font-light">0</p>
              </div>
            </div>

            {/* เลขานุการ */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-16 py-8 border-b border-slate-200">
              <div className="md:w-4/12 shrink-0">
                <h3 className="text-2xl font-bold text-[#1e3a8a]">{t('team_role_sec') || 'ทีมเลขานุการและเหรัญญิก'}</h3>
              </div>
              <div className="md:w-8/12 grid grid-cols-1 sm:grid-cols-2 gap-y-3">
                <p className="text-2xl text-slate-800 font-light">0</p>
                <p className="text-2xl text-slate-800 font-light">0</p>
                <p className="text-2xl text-slate-800 font-light">0</p>
                <p className="text-2xl text-slate-800 font-light">0</p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            Section 3: Regional EARC Teams
        ========================================= */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] tracking-tight">{t('team_sec3_title') || 'ทีมงานศูนย์ขับเคลื่อนวิจัยครูระดับภูมิภาค'}</h2>
            <p className="text-lg text-slate-500 uppercase tracking-widest mt-2">{t('team_sec3_en') || 'Regional EARC Teams'}</p>
          </div>

          <div className="space-y-16 border-t-[2px] border-[#1e3a8a] pt-12">
            {regionalTeams.map((regionData, idx) => (
              <div key={idx}>
                {/* ชื่อภาค */}
                <h3 className="text-3xl font-bold text-[#1e3a8a] mb-8">{regionData.region}</h3>
                
                <div className="space-y-10 pl-0 md:pl-6 border-l-[3px] border-slate-200 ml-2">
                  {regionData.zones.map((zone, zIdx) => (
                    <div key={zIdx} className="space-y-6">
                      {/* ชื่อโซน (ตอนบน/ตอนล่าง) */}
                      {zone.name && (
                        <h4 className="text-xl font-bold text-slate-500 tracking-wide uppercase flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-slate-400"></span> {zone.name}
                        </h4>
                      )}
                      
                      {/* รายชื่อในโซน (จัดแบบซ้าย-ขวา) */}
                      <div className="space-y-6 pl-4 md:pl-8">
                        {/* หัวหน้า */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 items-start">
                          <span className="w-28 shrink-0 text-xl font-medium text-[#1e3a8a]">{t('team_role_head') || 'หัวหน้า:'}</span>
                          <div>
                            <p className="text-2xl text-slate-800 font-light">{zone.head}</p>
                            <p className="text-lg text-slate-500 mt-1">{zone.headSchool}</p>
                          </div>
                        </div>
                        {/* รองหัวหน้า */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 items-start">
                          <span className="w-28 shrink-0 text-xl font-medium text-[#1e3a8a]">{t('team_role_deputy') || 'รองหัวหน้า:'}</span>
                          <div>
                            <p className="text-2xl text-slate-800 font-light">{zone.deputy}</p>
                            <p className="text-lg text-slate-500 mt-1">{zone.deputySchool}</p>
                          </div>
                        </div>
                        {/* กรรมการ */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 items-start">
                          <span className="w-28 shrink-0 text-xl font-medium text-[#1e3a8a]">{t('team_role_committee') || 'กรรมการ:'}</span>
                          <div>
                            <p className="text-2xl text-slate-800 font-light">{zone.committee}</p>
                            <p className="text-lg text-slate-500 mt-1">{zone.committeeSchool}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </section>

      </div>
    </div>
  );
};

export default AboutTeam;