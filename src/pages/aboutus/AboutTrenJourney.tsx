import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AboutTrenJourney: React.FC = () => {
  const { t } = useLanguage();

  const journeyData = [
    {
      year: t('journey_year_1_title_new') || 'พ.ศ. 2565',
      phase: t('journey_phase_1_new') || 'จุดกำเนิด',
      content: (
        <div className="space-y-6 md:space-y-8">
          <p className="text-2xl text-slate-800 font-light leading-relaxed">
            {t('journey_desc_1_1_p1') || 'เครือข่าย TReN เกิดจากความร่วมมือระหว่าง '}
            <strong className="font-semibold text-[#1e3a8a]">
              {t('journey_partner_1') || 'British Council Thailand'}
            </strong>
            {t('journey_desc_1_1_p2') || ' และ '}
            <strong className="font-semibold text-[#1e3a8a]">
              {t('journey_partner_2') || 'คณะศิลปศาสตร์ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี (มจธ.)'}
            </strong>
            {t('journey_desc_1_1_p3') || ' ที่มุ่งติดอาวุธให้ครูประจำการสามารถวิเคราะห์และแก้ปัญหาในชั้นเรียนได้ด้วยตนเอง เนื่องจากบริบทของแต่ละห้องเรียนมีความแตกต่างกัน การรอคอยความช่วยเหลือจากภายนอก หรือการตัดสินใจแก้ปัญหาด้วยความรู้สึกส่วนตัวจึงไม่ยั่งยืน'}
          </p>
          
          {/* Highlight Box */}
          <div className="bg-[#f8fafc] border-l-[6px] border-[#1e3a8a] p-8 sm:p-10 rounded-r-2xl mt-8">
            <p className="text-2xl text-slate-800 leading-relaxed font-light">
              {t('journey_desc_1_2_p1') || 'โครงการจึงส่งเสริมหลักคิด '}
              <strong className="font-semibold text-[#1e3a8a]">
                {t('journey_key_concept_1') || 'Evidence-based decision'}
              </strong>
              {t('journey_desc_1_2_p2') || ' (การตัดสินใจบนพื้นฐานของประจักษ์พยาน) ผ่านกระบวนการ '}
              <strong className="font-semibold text-[#1e3a8a]">
                {t('journey_key_concept_2') || 'Exploratory Action Research (EAR)'}
              </strong>
              {t('journey_desc_1_2_p3') || ' เพื่อให้ครูแก้ปัญหาได้ตรงจุด และสอดคล้องกับเกณฑ์พัฒนาวิชาชีพของ ก.ค.ศ.'}
            </p>
          </div>
        </div>
      ),
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-600', 
    },
    {
      year: t('journey_year_2_title_new') || 'ปีที่ 1: พ.ศ. 2565',
      phase: t('journey_phase_2_new') || 'จุดประกายและวางรากฐาน',
      content: (
        <div className="space-y-6 md:space-y-8">
          <p className="text-2xl text-slate-800 leading-relaxed font-light">
            {t('journey_desc_2_1_new') || 'นำโมเดลการวิจัย EAR ระดับโลกของ Prof. Dr. Richard Smith (University of Warwick) และ Dr. Paula Rebolledo มาใช้อบรมครูภาษาอังกฤษรุ่นแรก 21 คน โดยมีผู้เชี่ยวชาญและครูพี่เลี้ยงนานาชาติคอยประกบดูแลอย่างใกล้ชิด ซึ่งการมีครูพี่เลี้ยงหนุนเสริมนี้ถือเป็นหัวใจสำคัญของความสำเร็จ ดังที่ ดร.สุวิมล ว่องวาณิช ได้สะท้อนไว้อย่างน่าสนใจว่า:'}
          </p>
          
          {/* Editorial Pull Quote */}
          <blockquote className="my-12 md:my-16 relative">
            <svg className="absolute -top-8 -left-6 w-20 h-20 text-indigo-100 transform -scale-y-100" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true"><path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.896 3.456-8.352 9.12-8.352 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" /></svg>
            <p className="relative z-10 text-2xl sm:text-3xl font-medium text-slate-800 leading-snug italic px-6 border-l-[3px] border-indigo-200">
              {t('journey_quote_new') || '"กระบวนการต่างๆ ที่ใช้ในการทำวิจัย เป็นเรื่องที่ครูไม่คุ้นเคย เข้าใจยาก และต้องอาศัยการฝึกปฏิบัติภายใต้พี่เลี้ยงที่เข้าใจในวิธีการวิจัยอย่างสม่ำเสมอ..."'}
            </p>
            <footer className="mt-6 pl-6 text-lg md:text-xl font-semibold text-[#1e3a8a] tracking-wide">
              {t('journey_quote_author_new') || 'สุวิมล ว่องวาณิช. (2550). การวิจัยปฏิบัติการในชั้นเรียน. สำนักพิมพ์แห่งจุฬาลงกรณ์มหาวิทยาลัย.'}
            </footer>
          </blockquote>

          <p className="text-2xl text-slate-800 leading-relaxed font-light">
            {t('journey_desc_2_2_new') || 'เมื่อจบโครงการ ครูไม่เพียงมีทัศนคติต่อการทำวิจัยที่ดีขึ้น แต่ยังสามารถแก้ปัญหาในห้องเรียนได้ตรงจุด พร้อมทั้งสร้างความสัมพันธ์ที่แน่นแฟ้นยิ่งขึ้นกับนักเรียน (Dersingh & Vuong, 2023)'}
          </p>
        </div>
      ),
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-600', 
    },
    {
      year: t('journey_year_3_title_new') || 'ปีที่ 2 – 4: พ.ศ. 2566 – 2568',
      phase: t('journey_phase_3_new') || 'บ่มเพาะแกนนำสู่ 40 จังหวัด',
      content: (
        <div className="space-y-6 md:space-y-8">
          <p className="text-2xl text-slate-800 leading-relaxed font-light">
            {t('journey_desc_3_1_new') || 'เพื่อสร้างความยั่งยืนและลดการพึ่งพาผู้เชี่ยวชาญต่างชาติ โครงการจึงคัดเลือกครูรุ่นแรกมาพัฒนาต่อยอดเป็น '}
            <strong className="font-semibold text-[#1e3a8a]">{t('journey_mentor_role') || '"ครูพี่เลี้ยงวิจัย (Teacher-Research Mentors)"'}</strong>
            {t('journey_desc_3_2_new') || ' โดยได้รับเกียรติจาก Prof. Dr. Richard Smith มาถ่ายทอดองค์ความรู้โดยตรง จนกลุ่มครูพี่เลี้ยงแกนนำนี้สามารถขยายผลให้คำปรึกษาแก่เพื่อนครู ครอบคลุมถึง 40 จังหวัดทั่วประเทศ'}
          </p>
        </div>
      ),
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-600',  
    },
    {
      year: t('journey_year_4_title_new') || 'ปีที่ 5 - 6 เป็นต้นไป: พ.ศ. 2569 เป็นต้นไป',
      phase: t('journey_phase_4_new') || 'ก่อตั้ง TReN และขยายผลทั่วประเทศ',
      content: (
        <div className="space-y-6 md:space-y-8">
          <p className="text-2xl text-slate-800 leading-relaxed font-light">
            {t('journey_desc_4_1_new') || 'จากความแข็งแกร่งของกลุ่มครูวิจัยและครูพี่เลี้ยงทั่วประเทศ จึงนำไปสู่การก่อตั้ง '}
            <strong className="font-semibold text-[#1e3a8a]">{t('journey_tren_network') || 'เครือข่าย TReN (Teacher-Research Network)'}</strong>
            {t('journey_desc_4_2_new') || ' อย่างเป็นทางการ โดยขับเคลื่อนผ่านชุมชนนักปฏิบัติระดับภูมิภาค (EAR Communities: EARC) แบ่งเป็น 8 โซนทั่วประเทศ ควบคู่กับการยกระดับครูพี่เลี้ยงสู่ระดับสูง (Advanced Level) เพื่อให้แต่ละพื้นที่สามารถพึ่งพาตนเองได้ในระยะยาว พร้อมมุ่งขยายผลกระบวนการ EAR สู่ครูทั่วประเทศและประเมินผลกระทบเชิงลึกอย่างยั่งยืน'}
          </p>
        </div>
      ),
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-600',  
    }
  ];

  return (
    <div className="w-full bg-[#F8FAFC] font-sans selection:bg-blue-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 md:pt-24">
        
        {/* Intro Section */}
        <section className="max-w-4xl mb-10 relative mx-auto md:mx-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e3a8a] tracking-tight leading-tight">
            {t('journey_main_title') || 'เส้นทางการเติบโต'}
            <span className="block text-3xl md:text-4xl lg:text-5xl text-slate-400 mt-3 font-medium tracking-normal">
              {t('journey_subtitle') || 'TReN Journey'}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-800 mt-6 font-light leading-relaxed max-w-3xl">
            {t('journey_intro_desc_new') || 'จากจุดเริ่มต้นสู่เครือข่ายวิจัยระดับประเทศ (พ.ศ. 2565 - ปัจจุบัน)'}
          </p>
          <div className="w-20 h-1.5 bg-[#1e3a8a] mt-8 rounded-full"></div>
        </section>

        {/* Editorial Chapter Section */}
        <div className="space-y-0">
          {journeyData.map((item, index) => (
            <div 
              key={index} 
              className={`flex flex-col md:flex-row items-start gap-8 lg:gap-16 py-16 md:py-24 ${index !== 0 ? 'border-t border-slate-300' : ''}`}
            >
              
              {/* Left Column: Header */}
              <div className="md:w-4/12 lg:w-4/12 shrink-0">
                <div className={`text-2xl font-bold tracking-widest mb-5 flex items-center gap-4 ${item.textColor}`}>
                  <span className={`w-5 h-[3px] ${item.bgColor}`}></span>
                  {item.year}
                </div>
                <h2 className="text-4xl font-bold text-slate-800 leading-[1.3] tracking-tight">
                  {item.phase}
                </h2>
              </div>

              {/* Right Column: Content */}
              <div className="md:w-8/12 lg:w-8/12 pt-2">
                {item.content}
              </div>

            </div>
          ))}
        </div>

        {/* --- ตารางสรุปตัวเลขการเติบโต (Table Section) --- */}
        <section className="pt-24 border-t border-slate-300">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1e3a8a] mb-12 tracking-tight">
            {t('journey_table_main_title') || 'สรุปตัวเลขการเติบโตของเครือข่าย'}
          </h2>
          
          <div className="overflow-x-auto pb-4">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b-[3px] border-[#1e3a8a]">
                  <th className="py-5 px-4 text-2xl md:text-3xl font-bold text-slate-800 w-1/3">
                    {t('journey_table_col1') || 'ดัชนีชี้วัด'}
                  </th>
                  <th className="py-5 px-4 text-2xl md:text-3xl font-bold text-[#1e3a8a] w-1/4">{t('journey_table_col2') || 'ตัวเลขความสำเร็จ'}</th>
                  <th className="py-5 px-4 text-2xl md:text-3xl font-bold text-slate-800 w-5/12">{t('journey_table_col3') || 'รายละเอียดการขยายผล'}</th>
                </tr>
              </thead>
              <tbody className="text-2xl text-slate-700 font-light">
                <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors duration-200">
                  <td className="py-8 px-4 font-medium text-slate-800">{t('journey_stat_1_name') || 'ครูประจำการที่ได้รับการพัฒนา'}</td>
                  <td className="py-8 px-4 text-3xl font-extrabold text-[#1e3a8a]">{t('journey_stat_1_val') || '280 คน'}</td>
                  <td className="py-8 px-4 leading-relaxed">{t('journey_stat_1_desc') || 'จากรุ่นนำร่อง 21 คน สู่การแก้ปัญหาในชั้นเรียนด้วย EAR ทั่วประเทศ'}</td>
                </tr>
                <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors duration-200">
                  <td className="py-8 px-4 font-medium text-slate-800">{t('journey_stat_2_name') || 'ครูพี่เลี้ยงวิจัย'} <span className="text-slate-500 text-xl font-light">{t('journey_stat_2_en') || '(Mentors)'}</span></td>
                  <td className="py-8 px-4 text-3xl font-extrabold text-[#1e3a8a]">{t('journey_stat_2_val') || '50 คน'}</td>
                  <td className="py-8 px-4 leading-relaxed">{t('journey_stat_2_desc') || 'บ่มเพาะจากครูแกนนำรุ่นแรก สู่ผู้เชี่ยวชาญที่คอยหนุนเสริมเพื่อนครู'}</td>
                </tr>
                <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors duration-200">
                  <td className="py-8 px-4 font-medium text-slate-800">{t('journey_stat_3_name') || 'พื้นที่การทำงาน'}</td>
                  <td className="py-8 px-4 text-3xl font-extrabold text-[#1e3a8a]">{t('journey_stat_3_val') || '40 จังหวัด'}</td>
                  <td className="py-8 px-4 leading-relaxed">{t('journey_stat_3_desc') || 'กระจายเครือข่ายการเรียนรู้และการดูแลอย่างทั่วถึงทุกภูมิภาค'}</td>
                </tr>
                <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors duration-200">
                  <td className="py-8 px-4 font-medium text-slate-800">{t('journey_stat_4_name') || 'ชุมชนนักปฏิบัติ'} <span className="text-slate-500 text-xl font-light">{t('journey_stat_4_en') || '(EARCs)'}</span></td>
                  <td className="py-8 px-4 text-3xl font-extrabold text-[#1e3a8a]">{t('journey_stat_4_val') || '8 โซน'}</td>
                  <td className="py-8 px-4 leading-relaxed">{t('journey_stat_4_desc') || 'ยกระดับเครือข่ายเชิงพื้นที่ให้พึ่งพาตนเองได้อย่างยั่งยืน'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* อ้างอิงด้านล่างตาราง */}
          {/* <div className="mt-8 text-lg md:text-xl text-slate-500 font-light leading-relaxed">
            {t('journey_ref_author') || '* สุวิมล ว่องวาณิช. (2550).'} <span className="italic">{t('journey_ref_book') || 'การวิจัยปฏิบัติการในชั้นเรียน'}</span> {t('journey_ref_pub') || '(พิมพ์ครั้งที่ X). สำนักพิมพ์แห่งจุฬาลงกรณ์มหาวิทยาลัย.'}
          </div> */}
        </section>

      </div>
    </div>
  );
};

export default AboutTrenJourney;