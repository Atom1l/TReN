import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AboutFinancesAndRules: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-[#F8FAFC] font-sans selection:bg-blue-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 md:pt-24">
        
        {/* Header Section */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
            {t('rules_title') || 'การดูแลทรัพยากร คลังความรู้ และข้อตกลงร่วมกัน'} 
          </h2>
          <p className="text-xl md:text-2xl text-slate-500 font-medium tracking-wide mt-4 uppercase">
            {t('rules_en_title') || 'Finances, Sharing & Community Rules'}
          </p>
          <div className="w-20 h-1.5 bg-[#1e3a8a] mt-6 rounded-full"></div>
        </section>

        {/* Rules & Finances List */}
        <div className="space-y-0">
          
          {/* 6.1 การดูแลเรื่องงบประมาณ */}
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8 lg:gap-16 py-12 border-t border-slate-300">
            <div className="md:w-4/12 lg:w-4/12 shrink-0">
              <h3 className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug flex items-start">
                <span className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug mr-3">1.</span>
                <div>
                  {t('rules_6_1_title') || 'การดูแลเรื่องงบประมาณ'}
                  <span className="block text-xl text-slate-500 font-medium uppercase tracking-widest mt-2">
                    {t('rules_6_1_en') || 'Finances & Transparency'}
                  </span>
                </div>
              </h3>
            </div>
            <div className="md:w-8/12 lg:w-8/12 md:pt-1">
              <ul className="space-y-6">
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span className="text-[#1e3a8a] mr-3 mt-1.5 text-xl leading-none">&bull;</span>
                  <span><strong className="font-medium text-[#1e3a8a]">{t('rules_6_1_item_1_title') || 'ที่มาของงบประมาณ:'}</strong> {t('rules_6_1_item_1_desc') || 'งบประมาณดำเนินงานของ TReN มาจากทุนสนับสนุนขององค์กรพันธมิตรและหน่วยงานภาคีต่างๆ'}</span>
                </li>
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span className="text-[#1e3a8a] mr-3 mt-1.5 text-xl leading-none">&bull;</span>
                  <span><strong className="font-medium text-[#1e3a8a]">{t('rules_6_1_item_2_title') || 'ความโปร่งใส:'}</strong> {t('rules_6_1_item_2_desc') || 'บริหารจัดการงบประมาณอย่างประหยัดและโปร่งใส โดยจัดทำสรุปบัญชีรายรับ-รายจ่ายที่ตรวจสอบได้ และสรุปรายงานให้สมาชิกทราบในการพบปะประจำปี'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 6.2 ทรัพย์สินทางปัญญาและการแบ่งปันเพื่อการศึกษา */}
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8 lg:gap-16 py-12 border-t border-slate-300">
            <div className="md:w-4/12 lg:w-4/12 shrink-0">
              <h3 className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug flex items-start">
                <span className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug mr-3">2.</span>
                <div>
                  {t('rules_6_2_title') || 'ทรัพย์สินทางปัญญาและการแบ่งปันเพื่อการศึกษา'}
                  <span className="block text-xl text-slate-500 font-medium uppercase tracking-widest mt-2">
                    {t('rules_6_2_en') || 'Open Sharing & Creative Commons'}
                  </span>
                </div>
              </h3>
            </div>
            <div className="md:w-8/12 lg:w-8/12 md:pt-1 space-y-6">
              <p className="text-2xl text-slate-800 font-light leading-relaxed">
                {t('rules_6_2_desc') || 'เราเชื่อว่า "ความรู้ควรถูกแบ่งปันอย่างเสรีเพื่อประโยชน์ของครูทุกคน" คู่มือ สื่อการเรียนรู้ นวัตกรรม และงานวิจัยที่ TReN ร่วมพัฒนาขึ้น จะถูกเผยแพร่ภายใต้สัญญาอนุญาตเปิด Creative Commons (CC BY-NC-SA) ซึ่งมีหลักง่ายๆ ดังนี้:'}
              </p>
              <ul className="space-y-6">
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span className="text-[#1e3a8a] mr-3 mt-1.5 text-xl leading-none">&bull;</span>
                  <span><strong className="font-medium text-[#1e3a8a]">{t('rules_6_2_item_1_title') || 'อ้างอิงที่มา (Attribution - BY):'}</strong> {t('rules_6_2_item_1_desc') || 'นำไปใช้ได้เลย เพียงอ้างอิงชื่อผู้แต่งและเครือข่าย TReN เพื่อให้เกียรติคนทำงาน'}</span>
                </li>
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span className="text-[#1e3a8a] mr-3 mt-1.5 text-xl leading-none">&bull;</span>
                  <span><strong className="font-medium text-[#1e3a8a]">{t('rules_6_2_item_2_title') || 'ไม่ใช้เพื่อการค้า (Non-Commercial - NC):'}</strong> {t('rules_6_2_item_2_desc') || 'อนุญาตให้นำไปใช้ เผยแพร่ หรือดัดแปลง เพื่อประโยชน์ทางการศึกษาและการเรียนรู้โดยไม่แสวงหากำไรเท่านั้น'}</span>
                </li>
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span className="text-[#1e3a8a] mr-3 mt-1.5 text-xl leading-none">&bull;</span>
                  <span><strong className="font-medium text-[#1e3a8a]">{t('rules_6_2_item_3_title') || 'แบ่งปันด้วยเงื่อนไขเดียวกัน (Share-Alike - SA):'}</strong> {t('rules_6_2_item_3_desc') || 'หากนำเนื้อหาไปปรับปรุงหรือต่อยอด ผลงานชิ้นใหม่นั้นต้องนำมาแบ่งปันต่อด้วยสัญญาอนุญาตแบบเดียวกันนี้'}</span>
                </li>
              </ul>
              
              <div className="mt-8 p-6 bg-blue-50/60 rounded-2xl border border-blue-100/50">
                <p className="text-2xl text-[#1e3a8a] font-medium leading-relaxed">
                  {t('rules_6_2_footer') || 'ครูและคนทำงานการศึกษาทุกคน สามารถดึงความรู้ สื่อ และคู่มือของ TReN ไปใช้ ดัดแปลง และแจกต่อในโรงเรียนได้ฟรีทุกเมื่อ โดยไม่ต้องกังวลเรื่องติดลิขสิทธิ์'}
                </p>
              </div>
            </div>
          </div>

          {/* 6.3 การปรับปรุงข้อตกลงและการดูแลคลังความรู้ */}
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8 lg:gap-16 py-12 border-y border-slate-300">
            <div className="md:w-4/12 lg:w-4/12 shrink-0">
              <h3 className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug flex items-start">
                <span className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug mr-3">3.</span>
                <div>
                  {t('rules_6_3_title') || 'การปรับปรุงข้อตกลงและการดูแลคลังความรู้'}
                  <span className="block text-xl text-slate-500 font-medium uppercase tracking-widest mt-2">
                    {t('rules_6_3_en') || 'Amendments & Legacy'}
                  </span>
                </div>
              </h3>
            </div>
            <div className="md:w-8/12 lg:w-8/12 md:pt-1">
              <ul className="space-y-6">
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span className="text-[#1e3a8a] mr-3 mt-1.5 text-xl leading-none">&bull;</span>
                  <span><strong className="font-medium text-[#1e3a8a]">{t('rules_6_3_item_1_title') || 'การปรับปรุงข้อตกลง:'}</strong> {t('rules_6_3_item_1_desc') || 'หากวันข้างหน้าเครือข่ายเติบโตขึ้นและจำเป็นต้องปรับเปลี่ยนรายละเอียดในข้อตกลงนี้ เราจะนำเข้าพูดคุยและขอความเห็นชอบร่วมกันในการพบปะประจำปี'}</span>
                </li>
                <li className="text-2xl text-slate-800 font-light leading-relaxed flex items-start">
                  <span className="text-[#1e3a8a] mr-3 mt-1.5 text-xl leading-none">&bull;</span>
                  <span><strong className="font-medium text-[#1e3a8a]">{t('rules_6_3_item_2_title') || 'การดูแลทรัพยากรในอนาคต:'}</strong> {t('rules_6_3_item_2_desc') || 'หากในอนาคตมีการยุติการดำเนินงานของเครือข่าย งบประมาณคงเหลือและคลังความรู้ดิจิทัลทั้งหมด จะถูกส่งมอบให้แก่หน่วยงานการศึกษาหรือองค์กรสาธารณประโยชน์ เพื่อให้เกิดประโยชน์ต่อวงการครูไทยต่อไป'}</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutFinancesAndRules;