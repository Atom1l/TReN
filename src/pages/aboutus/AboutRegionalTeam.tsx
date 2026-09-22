/* eslint-disable react-hooks/static-components */
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AboutRegionalTeams: React.FC = () => {
  const { t } = useLanguage();

  // คอมโพเนนต์ป้ายกำกับ "รอประกาศรายชื่อ" (TBA Badge)
  const TbaBadge = () => (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 mt-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 opacity-80">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      <span className="text-lg font-light tracking-wide">{t('team_tba') || 'รอประกาศรายชื่ออย่างเป็นทางการ'}</span>
    </div>
  );

  // 💡 อัปเดตข้อมูลทีมภูมิภาคให้ครบ 6 ภาค ตามข้อมูลล่าสุด
  const regionalTeams = [
    {
      region: t('team_reg_north') || '1. ภาคเหนือ (EARC North)',
      zones: [
        { name: t('team_zone_upper') || 'ตอนบน', head: <TbaBadge />, deputy: <TbaBadge />, committee: <TbaBadge /> },
        { name: t('team_zone_lower') || 'ตอนล่าง', head: <TbaBadge />, deputy: <TbaBadge />, committee: <TbaBadge /> }
      ]
    },
    {
      region: t('team_reg_northeast') || '2. ภาคตะวันออกเฉียงเหนือ (EARC Northeast)',
      zones: [
        { name: t('team_zone_upper') || 'ตอนบน', head: <TbaBadge />, deputy: <TbaBadge />, committee: <TbaBadge /> },
        { name: t('team_zone_lower') || 'ตอนล่าง', head: <TbaBadge />, deputy: <TbaBadge />, committee: <TbaBadge /> }
      ]
    },
    {
      region: t('team_reg_central') || '3. ภาคกลาง (EARC Central)',
      zones: [
        { name: '', head: <TbaBadge />, deputy: <TbaBadge />, committee: <TbaBadge /> }
      ]
    },
    {
      region: t('team_reg_east') || '4. ภาคตะวันออก (EARC East)',
      zones: [
        { name: '', head: <TbaBadge />, deputy: <TbaBadge />, committee: <TbaBadge /> }
      ]
    },
    {
      region: t('team_reg_south') || '5. ภาคใต้ (EARC South)',
      zones: [
        { name: t('team_zone_upper') || 'ตอนบน', head: <TbaBadge />, deputy: <TbaBadge />, committee: <TbaBadge /> },
        { name: t('team_zone_lower') || 'ตอนล่าง', head: <TbaBadge />, deputy: <TbaBadge />, committee: <TbaBadge /> }
      ]
    },
    {
      region: t('team_reg_bkk') || '6. กรุงเทพมหานครและปริมณฑล (EARC Bangkok & Vicinity)',
      zones: [
        { name: '', head: <TbaBadge />, deputy: <TbaBadge />, committee: <TbaBadge /> }
      ]
    }
  ];

  return (
    <div className="w-full bg-[#F8FAFC] font-sans selection:bg-blue-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-10 pb-10 mt-14">
        
        {/* =========================================
            Section 4: Regional EARC Teams
        ========================================= */}
        <section>
          <div className="mb-12">
            {/* 💡 ปรับขนาดฟอนต์หัวข้อใหญ่ให้โดดเด่นขึ้น (text-4xl md:text-5xl lg:text-6xl) */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
              {t('team_sec3_title') || 'ทีมงานศูนย์ขับเคลื่อนวิจัยครูระดับภูมิภาค'}
            </h2>
            <p className="text-xl md:text-2xl text-slate-500 font-medium tracking-wide mt-4 uppercase">
              {t('team_sec3_en') || 'Regional EARC Teams'}
            </p>
            <div className="w-20 h-1.5 bg-[#1e3a8a] mt-6 rounded-full"></div>
          </div>

          <div className="space-y-16 border-t-[2px] border-[#1e3a8a] border-b border-slate-200 pb-18 pt-12">
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
                      
                      {/* รายชื่อในโซน */}
                      <div className="space-y-5 pl-4 md:pl-8">
                        {/* หัวหน้า */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 items-start sm:items-center">
                          <span className="w-28 shrink-0 text-xl font-medium text-[#1e3a8a]">{t('team_role_head') || 'หัวหน้า:'}</span>
                          <div>{zone.head}</div>
                        </div>
                        {/* รองหัวหน้า */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 items-start sm:items-center">
                          <span className="w-28 shrink-0 text-xl font-medium text-[#1e3a8a]">{t('team_role_deputy') || 'รองหัวหน้า:'}</span>
                          <div>{zone.deputy}</div>
                        </div>
                        {/* กรรมการ */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 items-start sm:items-center">
                          <span className="w-28 shrink-0 text-xl font-medium text-[#1e3a8a]">{t('team_role_committee') || 'กรรมการ:'}</span>
                          <div>{zone.committee}</div>
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

export default AboutRegionalTeams;