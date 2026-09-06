import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AboutMembership: React.FC = () => {
  const { t } = useLanguage();

  const memberships = [
    {
      num: '1.',
      title: t('membership_type_1_title') || 'สมาชิกทั่วไป',
      enTitle: t('membership_type_1_en') || 'General Member',
      qualifications: t('membership_type_1_qual') || 'ครูผู้สอนและผู้สนใจงานวิจัย EAR ทุกสังกัดทั่วประเทศ (รวมถึงผู้ที่ยังไม่เคยผ่านการอบรมเชิงลึก)',
      benefits: t('membership_type_1_ben') || 'เข้าใช้งานคลังความรู้ EAR ออนไลน์ รวมถึงเข้าร่วมฟังเสวนาหรือเวทีแลกเปลี่ยนเรียนรู้ได้ตลอดปีโดยไม่มีค่าใช้จ่าย',
      opportunities: t('membership_type_1_opp') || 'สมาชิกทั่วไปที่สนใจเข้าร่วมการอบรมเชิงลึก สามารถติดตามประกาศและสมัครเข้าร่วมกระบวนการคัดเลือกผ่านช่องทางข่าวสารของเครือข่ายได้ตลอดทั้งปี',
    },
    {
      num: '2.',
      title: t('membership_type_2_title') || 'สมาชิกศิษย์เก่าและครูพี่เลี้ยง',
      enTitle: t('membership_type_2_en') || 'Alumni & Mentor Member',
      qualifications: t('membership_type_2_qual') || 'ครูผู้ผ่านการอบรมเชิงลึกตามหลักสูตร EAR กับทางเครือข่าย',
      benefits: t('membership_type_2_ben') || 'ได้รับสิทธิประโยชน์ของสมาชิกทั่วไปทั้งหมด พร้อมรับคำปรึกษาเชิงลึกจากครูพี่เลี้ยง มีสิทธิ์ส่งผลงานเข้าร่วมเวทีนำเสนอระดับชาติ/สากล และได้รับโอกาสพัฒนาตนเองก้าวสู่การเป็น "ครูพี่เลี้ยงวิจัย (EAR Mentor)" รุ่นต่อไป',
      opportunities: null,
    }
  ];

  return (
    <div className="w-full bg-[#F8FAFC] font-sans selection:bg-blue-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 md:pt-24">
        
        {/* Header Section */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
            {t('membership_title') || 'สมาชิกภาพ'} 
          </h2>
          <p className="text-xl md:text-2xl text-slate-500 font-medium tracking-wide mt-4 uppercase">
            {t('membership_en_title') || 'Membership'}
          </p>
          <div className="w-20 h-1.5 bg-[#1e3a8a] mt-6 rounded-full"></div>
          
          <p className="mt-8 text-2xl text-slate-800 font-light leading-relaxed max-w-4xl whitespace-pre-line">
            {t('membership_desc') || 'เพื่อเปิดโอกาสให้ครูทุกคนเข้าถึงการพัฒนาวิชาชีพ การสมัครสมาชิก TReN จึงไม่มีค่าใช้จ่ายใดๆ ทั้งสิ้น โดยแบ่งสมาชิกออกเป็น 2 ประเภท:'}
          </p>
        </section>

        {/* Membership List Section */}
        <div className="space-y-0">
          {memberships.map((item, index) => (
            <div 
              key={index} 
              className={`flex flex-col md:flex-row items-start gap-4 md:gap-8 lg:gap-16 py-12 border-t border-slate-300 ${index === memberships.length - 1 ? 'border-b' : ''}`}
            >
              {/* ฝั่งซ้าย: ตัวเลข และหัวข้อ */}
              <div className="md:w-4/12 lg:w-4/12 shrink-0">
                <h3 className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug flex items-start">
                  <span className="text-2xl font-bold text-[#1e3a8a] tracking-tight leading-snug mr-3">{item.num}</span>
                  <div>
                    {item.title}
                    <span className="block text-xl text-slate-500 font-medium uppercase tracking-widest mt-2">
                      {item.enTitle}
                    </span>
                  </div>
                </h3>
              </div>

              {/* ฝั่งขวา: รายละเอียด (คุณสมบัติ, สิทธิประโยชน์) */}
              <div className="md:w-8/12 lg:w-8/12 md:pt-1 space-y-6">
                <p className="text-2xl text-slate-800 font-light leading-relaxed">
                  <strong className="font-semibold text-[#1e3a8a]">{t('membership_label_qual') || 'คุณสมบัติ:'}</strong> {item.qualifications}
                </p>
                <p className="text-2xl text-slate-800 font-light leading-relaxed">
                  <strong className="font-semibold text-[#1e3a8a]">{t('membership_label_ben') || 'สิทธิประโยชน์:'}</strong> {item.benefits}
                </p>
                {item.opportunities && (
                  <p className="text-2xl text-slate-800 font-light leading-relaxed">
                    <strong className="font-semibold text-[#1e3a8a]">{t('membership_label_opp') || 'โอกาสการเรียนรู้เพิ่มเติม:'}</strong> {item.opportunities}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AboutMembership;