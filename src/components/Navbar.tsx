import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../contexts/LanguageContext';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import LoginModal from './LoginModal'
import { supabase } from '../lib/supabaseClient'
import type { User } from '@supabase/supabase-js'

interface UserProfile {
  first_name: string;
  last_name: string;
  role: string;
  profilepic?: string;
}

const Navbar = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  const [isAuthLoading, setIsAuthLoading] = useState(true); 
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  
  const [expandedMobileMenus, setExpandedMobileMenus] = useState<string[]>([]);
  
  // สถานะสำหรับดักจับ Touch Device บนจอ Desktop
  const [forceOpenDropdown, setForceOpenDropdown] = useState<string | null>(null);
  const [forceOpenSubDropdown, setForceOpenSubDropdown] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const desktopNavRef = useRef<HTMLDivElement>(null); // สำหรับดักการคลิกนอกเมนู Desktop

  const location = useLocation(); 
  const navigate = useNavigate(); 

  const { t } = useLanguage();

  useEffect(() => {
    let isMounted = true; 

    const refreshUserData = async (userId: string) => {
      const { data, error } = await supabase
        .from('user')
        .select('first_name, last_name, role, profilepic')
        .eq('id', userId)
        .single();
      if (!error && data && isMounted) {
        setUserData(data);
      }
    };

    const handleProfileUpdate = () => {
      if (user?.id) refreshUserData(user.id);
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);

    const loadAuthData = async () => {
      try {
        const wasRememberMe = localStorage.getItem('wasRememberMe');
        const tabSession = sessionStorage.getItem('tabSession');

        if (wasRememberMe === 'false' && !tabSession) {
          await supabase.auth.signOut(); 
          localStorage.removeItem('wasRememberMe');
          if (isMounted) {
            setUser(null);
            setUserData(null);
            setIsAuthLoading(false);
          }
          return; 
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (session?.user) {
          if (isMounted) setUser(session.user);
          
          const { data, error: dbError } = await supabase
            .from('user')
            .select('first_name, last_name, role, profilepic') 
            .eq('id', session.user.id)
            .single();
            
          if (!dbError && data && isMounted) {
            setUserData(data);
          }
        } else {
          if (isMounted) {
            setUser(null);
            setUserData(null);
          }
        }
      } catch (err) {
        console.error("Auth Error (Session พัง):", err);
        supabase.auth.signOut().catch(() => {});
        
        for (const key in localStorage) {
          if (key.startsWith('sb-')) {
            localStorage.removeItem(key);
          }
        }
        localStorage.removeItem('wasRememberMe'); 
        
        if (isMounted) {
          setUser(null);
          setUserData(null);
        }
      } finally {
        if (isMounted) setIsAuthLoading(false);
      }
    };

    loadAuthData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        if (isMounted) setUser(session.user);
        supabase
          .from('user')
          .select('first_name, last_name, role, profilepic') 
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data && isMounted) setUserData(data);
            if (isMounted) setIsAuthLoading(false);
          });
      } else {
        if (isMounted) {
          setUser(null);
          setUserData(null);
          setIsAuthLoading(false);
        }
      }
    });

    const fallbackTimeout = setTimeout(() => {
      if (isMounted && isAuthLoading) {
        setIsAuthLoading(false);
      }
    }, 2500);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      clearTimeout(fallbackTimeout);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [user?.id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  // จัดการการคลิกหรือสัมผัสนอกพื้นที่เมนู
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // ปิดเมนู Profile
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      // ปิดเมนู Desktop Dropdown
      if (desktopNavRef.current && !desktopNavRef.current.contains(event.target as Node)) {
        setForceOpenDropdown(null);
        setForceOpenSubDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside); // ดักจับ Touch บน iPad ด้วย
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('wasRememberMe');
    sessionStorage.removeItem('tabSession');
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false); 
    navigate('/'); 
  };

  const toggleMobileMenu = (menuName: string, e: React.MouseEvent) => {
    e.preventDefault();
    setExpandedMobileMenus(prev => 
      prev.includes(menuName) ? prev.filter(n => n !== menuName) : [...prev, menuName]
    );
  };

  // ฟังก์ชันดักจับการแตะสำหรับหน้าจอ Desktop (Touch Devices)
  const handleDesktopMenuClick = (e: React.MouseEvent, menuName: string, hasDropdown: boolean) => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (hasDropdown && isTouchDevice) {
      if (forceOpenDropdown !== menuName) {
        e.preventDefault(); // หยุดการเปลี่ยนหน้า
        setForceOpenDropdown(menuName); // กางเมนู
        setForceOpenSubDropdown(null); // รีเซ็ตเมนูย่อย
      }
    } else {
      setForceOpenDropdown(null);
      setForceOpenSubDropdown(null);
    }
  };

  const handleDesktopSubMenuClick = (e: React.MouseEvent, subName: string, hasSubDropdown: boolean) => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (hasSubDropdown && isTouchDevice) {
      if (forceOpenSubDropdown !== subName) {
        e.preventDefault();
        setForceOpenSubDropdown(subName);
      }
    } else {
      setForceOpenDropdown(null);
      setForceOpenSubDropdown(null);
    }
  };

  const menuItems = [
    { name: t('home') || 'Home', path: '/' },
    { name: t('news') || 'News', path: '/news' },
    { 
      name: t('events') || 'Events', 
      path: '#',
      dropdown: [
        { name: t('all_events') || 'All Events (กิจกรรมทั้งหมด)', path: '/events' }, 
        { name: t('upcoming_events_navbar') || 'Upcoming (กำลังมาถึง)', path: '/events/all?filter=upcoming' },
        { name: t('past_events_navbar') || 'Past (ผ่านมาแล้ว)', path: '/events/all?filter=past' }
      ]
    },
    { name: t('blogs') || 'Blogs', path: '/blogs' },
    { name: t('resources') || 'Resource', path: '/resources' },
    { name: t('showcases') || 'Showcases', path: '/showcases' },
    { 
      name: t('about') || 'About us', 
      path: '/about',
      dropdown: [
        { 
          name: t('nav_about_1') || '1. กรอบการทำงานของเครือข่าย (ธรรมนูญ/constitution)', 
          path: '/about#constitution',
          subDropdown: [
            { name: t('nav_about_1_1') || 'หมวดที่ 1: ข้อมูลทั่วไป', path: '/about#general-info' },
            { name: t('nav_about_1_2') || 'หมวดที่ 2: สมาชิกภาพ', path: '/about#membership' },
            { name: t('nav_about_1_3') || 'หมวดที่ 3: ขอบเขตการดำเนินงานและโครงการหลัก', path: '/about#operations' },
            { name: t('nav_about_1_4') || 'หมวดที่ 4: โครงสร้างเครือข่ายและการบริหารงาน', path: '/about#governance-structure' },
            { name: t('nav_about_1_5') || 'หมวดที่ 5: การประชุมและการดำเนินงาน (Meetings)', path: '/about#meetings' },
            { name: t('nav_about_1_6') || 'หมวดที่ 6: การเงิน ทรัพย์สิน และการแก้ไขข้อตกลง', path: '/about#finances' },
          ]
        },
        { name: t('nav_about_2') || '2. เส้นทางการเจริญเติบโต / TReN Journey', path: '/about#journey' },
        { name: t('nav_about_3') || '3. คณะกรรมการบริหารเครือข่าย/โครงสร้างเครือข่าย', path: '/about#team' },
        { name: t('nav_about_4') || '4. องค์กรพันธมิตร', path: '/about#supporters' },
      ]
    },
  ];

  return (
    <>
      <nav className="z-50 font-sans top-0 left-0 w-full bg-white backdrop-blur-md border-b border-slate-200 drop-shadow-sm sticky">
        <div className="w-full px-4 lg:px-4 xl:px-10 2xl:px-14 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-2 cursor-pointer flex-shrink-0">
            <Link to="/" className="pt-1.5 lg:pt-0 text-3xl lg:text-3xl xl:text-4xl font-black text-primary tracking-tighter hover:opacity-80 transition-opacity">
              TReN
            </Link>
          </div>

          <div className="flex items-center ml-auto lg:gap-2 xl:gap-8 2xl:gap-12 gap-2">
            
            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-0 lg:gap-1 xl:gap-6 pt-2" ref={desktopNavRef}>
              {menuItems.map((menu) => {
                const isActive = location.pathname === menu.path;
                return (
                  <div key={menu.name} className="relative group py-6 px-1 lg:px-1.5 xl:px-2">
                    <Link 
                      to={menu.path}
                      onClick={(e) => handleDesktopMenuClick(e, menu.name, !!menu.dropdown)}
                      className={`text-[0.95rem] lg:text-[0.9rem] xl:text-[1.1rem] 2xl:text-xl transition-colors whitespace-nowrap flex items-center gap-0.5 lg:gap-1 ${
                        isActive ? 'text-primary font-bold' : 'text-dark font-medium hover:text-primary'
                      }`}
                    >
                      {menu.name}
                      {menu.dropdown && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 lg:w-4 lg:h-4 mt-0.5 transition-transform lg:group-hover:rotate-180">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      )}
                    </Link>

                    {menu.dropdown && (
                      <div className={`absolute top-[80%] left-1/2 -translate-x-1/2 mt-2 w-[24rem] bg-white border border-slate-100 shadow-xl rounded-2xl transition-all duration-300 z-50 transform py-2 ${
                        forceOpenDropdown === menu.name
                          ? 'opacity-100 visible translate-y-0'
                          : 'opacity-0 invisible translate-y-2 lg:group-hover:opacity-100 lg:group-hover:visible lg:group-hover:translate-y-0'
                      }`}>
                        {menu.dropdown.map(sub => (
                          <div key={sub.name} className="relative group/sub">
                            <Link 
                              to={sub.path} 
                              onClick={(e) => handleDesktopSubMenuClick(e, sub.name, !!sub.subDropdown)}
                              className="w-full text-left flex items-center justify-between px-5 py-3.5 text-[1rem] text-slate-600 hover:bg-[#EBF1FA] hover:text-[#1e3a8a] transition-colors font-medium border-b border-slate-50 last:border-0 whitespace-normal leading-relaxed"
                            >
                              <span>{sub.name}</span>
                              {sub.subDropdown && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-3 flex-shrink-0 text-slate-400 lg:group-hover/sub:text-[#1e3a8a]" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </Link>

                            {/* Nested Sub Dropdown */}
                            {sub.subDropdown && (
                              <div className={`absolute top-0 right-full mr-1 w-[26rem] bg-white border border-slate-100 shadow-xl rounded-2xl transition-all duration-300 z-50 transform py-2 ${
                                forceOpenSubDropdown === sub.name
                                  ? 'opacity-100 visible translate-x-0'
                                  : 'opacity-0 invisible translate-x-2 lg:group-hover/sub:opacity-100 lg:group-hover/sub:visible lg:group-hover/sub:translate-x-0'
                              }`}>
                                {sub.subDropdown.map(nested => (
                                  <Link 
                                    key={nested.name} 
                                    to={nested.path} 
                                    onClick={() => { setForceOpenDropdown(null); setForceOpenSubDropdown(null); }}
                                    className="block px-5 py-3 text-[0.95rem] text-slate-600 hover:bg-[#EBF1FA] hover:text-[#1e3a8a] transition-colors font-medium border-b border-slate-50 last:border-0 whitespace-normal leading-relaxed"
                                  >
                                    {nested.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              
              <Link to="/search" className="cursor-pointer">
                <button className={`p-2 text-primary hover:bg-slate-100 rounded-full transition-all active:scale-90 group cursor-pointer`} title="Search">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 lg:w-5 lg:h-5 xl:w-7 xl:h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </button>
              </Link>

              <div className="hidden lg:flex items-center">
                {isAuthLoading ? (
                  <div className="w-[85px] lg:w-[95px] xl:w-[115px] h-[36px] lg:h-[38px] xl:h-[40px] bg-slate-100 animate-pulse rounded-lg"></div>
                ) : user && userData ? (
                  <div className="relative ml-2 lg:ml-2 xl:ml-8" ref={dropdownRef}>
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-9 h-9 lg:w-10 lg:h-10 xl:w-11 xl:h-11 bg-primary hover:bg-secondary text-white rounded-full flex items-center justify-center font-bold text-base lg:text-lg shadow-md transition-transform active:scale-95 flex-shrink-0 overflow-hidden cursor-pointer"
                    >
                      {userData.profilepic ? (
                        <img src={userData.profilepic} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        userData.first_name?.[0]
                      )}
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 transform transition-all">
                        <div className="px-5 py-4 border-b border-slate-100">
                          <p className="text-[1.15rem] font-bold text-slate-800 leading-tight">
                            {userData.first_name} {userData.last_name}
                          </p>
                          <p className="text-md text-slate-500 mt-1 truncate">
                            {user.email}
                          </p>
                        </div>

                        <div className="py-2">
                          <Link to="/profile" className="block px-5 py-3 text-lg font-normal text-dark hover:bg-slate-50 hover:text-primary transition-colors">
                            {t('profile') || 'Profile'}
                          </Link>
                          
                          {['admin', 'co_admin', 'developer'].includes(userData.role.toLowerCase()) && (
                            <Link to="/admin-dashboard" className="block px-5 py-3 text-lg font-normal text-dark hover:bg-slate-50 hover:text-primary transition-colors">
                              {t('adminDashboard') || 'Admin Dashboard'}
                            </Link>
                          )}
                          
                          <button 
                            onClick={handleLogout} 
                            className="w-full text-left px-5 py-3 text-lg font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            {t('logout') || 'Log Out'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="ml-2 lg:ml-2 xl:ml-8 bg-primary hover:bg-secondary text-white px-3 py-1.5 lg:px-4 lg:py-1.5 xl:px-6 xl:py-2 text-sm lg:text-[0.85rem] xl:text-base font-medium transition-all active:scale-95 shadow-md shadow-primary/10 rounded-lg flex-shrink-0 cursor-pointer">
                    Join TReN
                  </button>
                )}
              </div>

              <button 
                className="lg:hidden p-2 text-primary hover:bg-slate-100 rounded-lg transition-colors ml-2 flex-shrink-0 cursor-pointer"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
            </div>
          </div>
          
          <LoginModal 
            isOpen={isLoginModalOpen} 
            onClose={() => setIsLoginModalOpen(false)} 
            defaultTab="login" 
          />
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex lg:hidden">
          <div 
            className="w-1/3 bg-black/40 backdrop-blur-sm relative"
            onClick={() => setIsMobileMenuOpen(false)}
          >
          </div>

          <div className="w-2/3 bg-white h-full shadow-2xl flex flex-col relative animate-slide-in-right">
            <button 
              className="w-full flex justify-end px-4 py-4 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#0a2558" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            {user && userData ? (
              <Link 
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-[#e6f0fa] hover:bg-[#d8e8f8] transition-colors px-6 py-8 flex flex-col gap-2 relative cursor-pointer group"
                title={t('profile') || "Profile"}
              >
                <div className="flex items-center gap-4">        
                  <div className="shrink-0 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl shadow-sm overflow-hidden group-hover:scale-105 transition-transform">
                    {userData.profilepic ? (
                      <img src={userData.profilepic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      userData.first_name?.[0]
                    )}
                  </div>    

                  <div className="flex flex-col flex-1 min-w-0">               
                    <span className="truncate block text-xl font-bold text-slate-800 leading-tight group-hover:text-primary transition-colors">
                      {userData.first_name} {userData.last_name}
                    </span>                 
                    <span className="truncate block text-[1.05rem] text-slate-600">
                      {user.email}
                    </span>       
                  </div>
                </div>
              </Link>
            ) : (
               <div className="px-6 py-8 pt-20 flex flex-col gap-4 border-b border-slate-100">
                  <span className="text-xl font-bold text-slate-800">ยินดีต้อนรับ</span>
                  <button 
                    onClick={() => { setIsLoginModalOpen(true); setIsMobileMenuOpen(false); }} 
                    className="bg-primary hover:bg-secondary text-white py-3 rounded-xl font-medium text-lg w-full transition-colors cursor-pointer"
                  >
                    Join TReN
                  </button>
               </div>
            )}

            <div className="flex-1 overflow-y-auto py-6 flex flex-col">
              {menuItems.map((menu) => {
                const isActive = location.pathname === menu.path;
                const isExpanded = expandedMobileMenus.includes(menu.name);

                return (
                  <div key={menu.name} className="flex flex-col">
                    <div className="flex justify-between items-center relative pr-4">
                      {menu.dropdown ? (
                        <button
                          onClick={(e) => toggleMobileMenu(menu.name, e)}
                          className={`flex-1 text-left px-8 py-3.5 text-[1.15rem] transition-colors cursor-pointer ${
                            isActive || isExpanded
                              ? 'text-[#0a2558] font-bold' 
                              : 'text-slate-800 font-medium hover:bg-slate-50'
                          }`}
                        >
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-[#1e3a8a] rounded-r-md"></div>
                          )}
                          {menu.name}
                        </button>
                      ) : (
                        <Link
                          to={menu.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex-1 px-8 py-3.5 text-[1.15rem] transition-colors ${
                            isActive 
                              ? 'text-[#0a2558] font-bold' 
                              : 'text-slate-800 font-medium hover:bg-slate-50'
                          }`}
                        >
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-[#1e3a8a] rounded-r-md"></div>
                          )}
                          {menu.name}
                        </Link>
                      )}
                      
                      {menu.dropdown && (
                        <button 
                          onClick={(e) => toggleMobileMenu(menu.name, e)}
                          className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors z-10 cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180 text-[#1e3a8a]' : ''}`}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Level 2 Dropdown Mobile */}
                    {menu.dropdown && isExpanded && (
                      <div className="bg-slate-50/70 flex flex-col border-y border-slate-100">
                        {menu.dropdown.map((sub, index) => {
                          const isSubExpanded = expandedMobileMenus.includes(sub.name);
                          return (
                            <div key={index} className="flex flex-col">
                              <div className="flex justify-between items-center pr-4">
                                {sub.subDropdown ? (
                                  <button
                                    onClick={(e) => toggleMobileMenu(sub.name, e)}
                                    className="flex-1 text-left pl-14 pr-4 py-3.5 text-[1.05rem] text-slate-700 hover:text-[#1e3a8a] font-medium transition-colors cursor-pointer whitespace-normal"
                                  >
                                    {sub.name}
                                  </button>
                                ) : (
                                  <Link
                                    to={sub.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex-1 pl-14 pr-8 py-3.5 text-[1.05rem] text-slate-700 hover:text-[#1e3a8a] font-medium transition-colors cursor-pointer whitespace-normal"
                                  >
                                    {sub.name}
                                  </Link>
                                )}
                                {sub.subDropdown && (
                                  <button 
                                    onClick={(e) => toggleMobileMenu(sub.name, e)}
                                    className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors z-10 cursor-pointer flex-shrink-0"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-4 h-4 transition-transform ${isSubExpanded ? 'rotate-180 text-[#1e3a8a]' : ''}`}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                  </button>
                                )}
                              </div>

                              {/* Level 3 Dropdown Mobile (Nested) */}
                              {sub.subDropdown && isSubExpanded && (
                                <div className="bg-slate-100/50 flex flex-col border-y border-slate-100">
                                  {sub.subDropdown.map((nested, nIdx) => (
                                    <Link
                                      key={nIdx}
                                      to={nested.path}
                                      onClick={() => setIsMobileMenuOpen(false)}
                                      className="pl-20 pr-8 py-3 text-[0.95rem] text-slate-600 hover:text-[#1e3a8a] font-normal transition-colors cursor-pointer whitespace-normal"
                                    >
                                      {nested.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {user && userData && ['admin', 'co-admin', 'developer'].includes(userData.role.toLowerCase()) && (
                <div className="mt-2 border-t border-slate-100 pt-2">
                  <Link
                    to="/admin-dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`relative block px-8 py-3.5 text-xl font-medium transition-colors cursor-pointer ${
                      location.pathname === '/admin-dashboard' 
                        ? 'text-[#0a2558] font-semibold' 
                        : 'text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {location.pathname === '/admin-dashboard' && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-[#1e3a8a] rounded-r-md"></div>
                    )}
                    {t('adminDashboard') || 'Admin Dashboard'}
                  </Link>
                </div>
              )}
            </div>

            {user && (
              <div className="mt-auto mb-10 px-8 text-center border-t border-slate-100 pt-6">
                <button
                  onClick={handleLogout}
                  className="text-xl font-bold text-red-500 hover:text-red-700 transition-colors py-4 w-full cursor-pointer"
                >
                  {t('logout') || 'Log Out'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar