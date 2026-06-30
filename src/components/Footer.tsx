// src/components/Footer.tsx
import { useLanguage } from '../contexts/LanguageContext'; // นำเข้า Hook ที่เราสร้างไว้

const Footer = () => {
  // เรียกใช้ State และฟังก์ชันจาก Context
  const { language, setLanguage, t } = useLanguage();

  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-auto">
      <div className="w-full px-14 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="text-slate-600 font-bold text-lg md:text-xl tracking-wide">
          {t('copyright')}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-600 font-bold text-lg md:text-xl">
            {t('languageLabel')}
          </span>
          <div className="relative">
            {/* ผูก value และ onChange เข้ากับ Context */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'th' | 'en')}
              className="appearance-none border border-slate-800 rounded-lg px-4 py-2.5 pr-10 text-primary font-bold text-lg bg-white outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="th">ภาษาไทย(TH)</option>
              <option value="en">English(EN)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;