import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const AdminSidebar = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  // State สำหรับเปิด/ปิด Sidebar บนมือถือ
  const [isOpen, setIsOpen] = useState(false);

  // ปิด Sidebar อัตโนมัติเมื่อกดเปลี่ยนหน้า (สำหรับมือถือ)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
  }, [location.pathname]);

  // ป้องกันการ Scroll หน้าจอหลักเวลาเปิด Sidebar ขึ้นมาทับ
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const menuItems = [
    { name: t('overview') || 'ภาพรวม', path: '/admin-dashboard', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: t('blog') || 'บล็อก', path: '/admin-dashboard/blogs', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15' },
    { name: t('event') || 'กิจกรรม', path: '/admin-dashboard/events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: t('showcase') || 'ผลงาน', path: '/admin-dashboard/showcases', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: t('resource') || 'ทรัพยากร', path: '/admin-dashboard/resources', icon: 'M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z' },
    { name: t('reports') || 'รายงานปัญหา', path: '/admin-dashboard/reports', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    { name: t('users') || 'ผู้ใช้งาน', path: '/admin-dashboard/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  ];

  return (
    <>
      {/* 1. ปุ่มเปิด Menu สำหรับ Mobile (ซ่อนไว้บนจอคอม lg:hidden) */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-800 font-bold mb-0.5 w-fit hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#1e3a8a" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
        <span className='pt-0.5 text-lg text-[#1e3a8a]'>{t('menu') || 'เมนู'}</span>
      </button>

      {/* 2. Overlay สีดำพื้นหลัง (แสดงเฉพาะตอนเปิดบนหน้าจอเล็ก) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[40] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 3. ตัว Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-[50]
        w-[280px] lg:w-[300px] h-full lg:h-auto
        bg-white shadow-2xl lg:shadow-sm
        border-r lg:border border-slate-200 lg:rounded-xl
        p-6 flex-shrink-0 self-start
        transform transition-transform duration-300 ease-in-out
        overflow-y-auto lg:overflow-visible
        /* หัวใจหลัก: มือถือเลื่อนซ้ายขวา / คอมพิวเตอร์อยู่กับที่เสมอ */
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Header + ปุ่มปิด X (แสดงเฉพาะมือถือ) */}
        <div className="flex justify-between items-center mb-6 lg:hidden border-b border-slate-100 pb-4">
          <span className="text-xl font-bold text-[#1e3a8a] pt-1">{t('admin_menu') || 'เมนูผู้ดูแลระบบ'}</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* รายการ Menu Items */}
        <div className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/admin-dashboard' && location.pathname === '/admin-dashboard');
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-lg font-medium transition-colors ${
                  isActive 
                    ? 'bg-[#DBEAFE] text-[#1e3a8a]' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900' 
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke={isActive ? '#1e3a8a' : 'currentColor'} className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;