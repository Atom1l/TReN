// src/components/Footer.tsx
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 md:py-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        
        {/* ข้อมูลการติดต่อ */}
        <div className="flex flex-col gap-1.5 text-slate-600 font-light text-base md:text-lg">
          <strong className="text-[#1e3a8a] font-bold text-xl md:text-2xl mb-2 tracking-wide">
            TReN
          </strong>
          <p>{t('footer_faculty') || 'คณะศิลปศาสตร์'} {t('footer_uni') || 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี'}</p>
          <p>{t('footer_address_1') || '126 ถนนประชาอุทิศ'} {t('footer_address_2') || 'บางมด ทุ่งครุ กรุงเทพฯ 10140'}</p>
          <p className="mt-2">
            <strong className="font-medium text-slate-700">{t('footer_email') || 'อีเมล:'}</strong> 
            <span className="ml-2 text-slate-400">-</span> {/* พื้นที่เว้นว่างสำหรับใส่อีเมลในอนาคต */}
          </p>
        </div>

        {/* ลิขสิทธิ์ (Copyright) */}
        <div className="w-full md:w-auto text-slate-500 text-sm md:text-base border-t md:border-t-0 border-slate-200 pt-6 md:pt-0 text-left md:text-right">
          {t('footer_copyright') || 'ลิขสิทธิ์ © 2026 - TReN.org'}
        </div>

      </div>
    </footer>
  );
};

export default Footer;