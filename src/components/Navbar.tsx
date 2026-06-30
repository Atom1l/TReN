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
  
  const dropdownRef = useRef<HTMLDivElement>(null);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const menuItems = [
    { name: t('home') || 'Home', path: '/' },
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
      path: '#', 
      dropdown: [
        { name: t('what_is_tren_about_us') || 'TReN คืออะไร', path: '/about/whatistren' },
        { name: t('mission_about_us') || 'ภารกิจของเรา', path: '/about/mission' },
        { name: t('ear_team_about_us') || 'ทีม EAR', path: '/about/earteam' },
        { name: t('history_of_tren_about_us') || 'ประวัติ TReN', path: '/about/historytren' },

        { name: t('history_of_ear_about_us') || 'ประวัติ EAR', path: '/about/historyear' },
        { name: t('organization_about_us') || 'องค์กรของเรา', path: '/about/organization' },

        { name: t('supporter_about_us') || 'ผู้สนับสนุน', path: '/about/supporter' },
        { name: t('constitution_about_us') || 'รัฐธรรมนูญ', path: '/about/constitution' },
        { name: t('timeline_about_us') || 'ไทมไลน์', path: '/about/timeline' },
      ]
    },
  ];

  return (
    <>
      <nav className="z-50 font-sans top-0 left-0 w-full bg-white backdrop-blur-md border-b border-slate-200 drop-shadow-sm sticky">
        <div className="w-full px-4 lg:px-10 xl:px-14 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-2 cursor-pointer flex-shrink-0">
            <Link to="/" className="pt-1.5 lg:pt-0 text-4xl font-black text-primary tracking-tighter hover:opacity-80 transition-opacity">
              TReN
            </Link>
          </div>

          <div className="flex items-center ml-auto lg:gap-8 xl:gap-12 gap-2">
            
            <div className="hidden lg:flex items-center gap-2 xl:gap-6 pt-2">
              {menuItems.map((menu) => {
                const isActive = location.pathname === menu.path;
                return (
                  <div key={menu.name} className="relative group py-6 px-2">
                    <Link 
                      to={menu.path}
                      className={`text-lg xl:text-xl transition-colors whitespace-nowrap flex items-center gap-1 ${
                        isActive ? 'text-primary font-bold' : 'text-dark font-medium hover:text-primary'
                      }`}
                    >
                      {menu.name}
                      {menu.dropdown && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 mt-0.5 transition-transform group-hover:rotate-180">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      )}
                    </Link>

                    {menu.dropdown && (
                      <div className="absolute top-[80%] left-1/2 -translate-x-1/2 mt-2 w-56 bg-white border border-slate-100 shadow-xl rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden transform group-hover:translate-y-0 translate-y-2">
                        {menu.dropdown.map(sub => (
                          <Link 
                            key={sub.name} 
                            to={sub.path} 
                            className="block px-5 py-3.5 text-slate-600 hover:bg-[#EBF1FA] hover:text-[#1e3a8a] transition-colors font-medium border-b border-slate-50 last:border-0"
                          >
                            {sub.name}
                          </Link>
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
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </button>
              </Link>

              <div className="hidden lg:flex items-center">
                {isAuthLoading ? (
                  <div className="w-[115px] h-[40px] bg-slate-100 animate-pulse rounded-lg"></div>
                ) : user && userData ? (
                  <div className="relative ml-4 xl:ml-8" ref={dropdownRef}>
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-11 h-11 bg-primary hover:bg-secondary text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md transition-transform active:scale-95 flex-shrink-0 overflow-hidden cursor-pointer"
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
                    className="ml-4 xl:ml-8 bg-primary hover:bg-secondary text-white px-6 py-2 font-medium transition-all active:scale-95 shadow-md shadow-primary/10 rounded-lg flex-shrink-0 cursor-pointer">
                    Join TReN
                  </button>
                )}
              </div>

              {/* Mobile Hamburger Button */}
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

      {/* Mobile Sidebar Overlay*/}
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
              // 🟢 เปลี่ยนจาก div ธรรมดา เป็น Link ให้กดเข้าไปหน้าโปรไฟล์ได้
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
                      <Link
                        to={menu.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex-1 px-8 py-3.5 text-xl transition-colors ${
                          isActive 
                            ? 'text-[#0a2558] font-semibold' 
                            : 'text-slate-800 font-medium hover:bg-slate-50'
                        }`}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-[#1e3a8a] rounded-r-md"></div>
                        )}
                        {menu.name}
                      </Link>
                      
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

                    {menu.dropdown && isExpanded && (
                      <div className="bg-slate-50/70 flex flex-col border-y border-slate-100">
                        {menu.dropdown.map(sub => (
                          <Link
                            key={sub.name}
                            to={sub.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="pl-14 pr-8 py-3.5 text-[1.1rem] text-slate-600 hover:text-[#1e3a8a] hover:bg-blue-50/50 font-medium transition-colors cursor-pointer"
                          >
                            {sub.name}
                          </Link>
                        ))}
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
                  className="text-2xl font-bold text-red-500 hover:text-red-700 transition-colors py-4 w-full cursor-pointer"
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