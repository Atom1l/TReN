/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabaseClient';
import { THAI_PROVINCES } from '../../constants/Province';
import { TEACHER_RANKS } from '../../constants/TeacherRanks';

// กำหนด Type ของข้อมูล User
interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  school_name: string;
  province: string;
  position: string;
  email: string;
  register_date: string;
  rank: string;
  role: string;
  profilepic?: string;
}

const AdminUsers = () => {
  const { t, language } = useLanguage();
  
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userStats, setUserStats] = useState({ blogs: 0, showcases: 0, events: 0 });
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  // 🟢 1. เพิ่ม State สำหรับจัดการ Modal ยืนยันการแบน และ แจ้งเตือน
  const [alertModal, setAlertModal] = useState({ isOpen: false, type: 'success', message: '' });
  const [banModal, setBanModal] = useState<{ isOpen: boolean; user: UserData | null; action: 'ban' | 'unban' }>({ 
    isOpen: false, 
    user: null, 
    action: 'ban' 
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ 
    key: 'register_date', 
    direction: 'desc' 
  });

  // 🟢 ฟังก์ชันแสดง Alert (เปิดแล้วปิดเอง)
  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlertModal({ isOpen: true, type, message });
    setTimeout(() => {
      setAlertModal({ isOpen: false, type: 'success', message: '' });
    }, 2000);
  };

  // --- Helper Functions ---
  const getProvinceName = (val: string) => {
    if (!val) return '-';
    if (language === 'th') {
      const found = THAI_PROVINCES.find((p: { value: string; }) => p.value === val);
      return found ? found.label : val;
    }
    return val.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getRankName = (val: string) => {
    if (!val) return '-';
    if (language === 'th') {
      const found = TEACHER_RANKS.find(r => r.value === val);
      return found ? found.label : val;
    }
    const rankEnMap: Record<string, string> = {
      'none': 'No Academic Rank',
      'assistant': 'Assistant Teacher',
      'k1': 'Teacher (K1)',
      'k2_senior': 'Senior Teacher (K2)',
      'k3_senior_pro': 'Professional Teacher (K3)',
      'k4_expert': 'Expert Teacher (K4)',
      'k5_special_expert': 'Special Expert Teacher (K5)'
    };
    return rankEnMap[val] || val;
  };

  const getPositionName = (val: string) => {
    if (!val) return '-';
    const positionMap: Record<string, { th: string, en: string }> = {
      'teacher': { th: 'ครู', en: 'Teacher' },
      'assistant_teacher': { th: 'ครูผู้ช่วย', en: 'Assistant Teacher' }
    };
    if (positionMap[val]) {
      return language === 'th' ? positionMap[val].th : positionMap[val].en;
    }
    return val.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // 🟢 ฟังก์ชันสำหรับแปลง Role ภาษาโค้ด เป็น ภาษาคน
  const getRoleDisplayName = (role: string) => {
    if (!role) return '-';
    const r = role.toLowerCase();
    if (r === 'developer') return 'Developer';
    if (r === 'admin') return 'Admin';
    if (r === 'co_admin') return 'Co-Admin';
    if (r === 'user') return 'User';
    if (r === 'banned') return 'Banned';
    // เผื่อมีสถานะแปลกๆ หลุดมา ให้โชว์แบบพิมพ์ใหญ่ตัวแรก
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('user')
          .select('id, first_name, last_name, school_name, province, position, email, register_date, rank, role, profilepic')
          .order('register_date', { ascending: false }); 

        if (error) throw error;
        if (data) setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const fetchUserStats = async (userId: string) => {
    setIsStatsLoading(true);
    try {
      const showcasesQuery1 = supabase.from('showcases').select('id, author_data').eq('author_id', userId).eq('status', 'published');
      const showcasesQuery2 = supabase.from('showcases').select('*', { count: 'exact', head: true }).contains('author_data', JSON.stringify([{ id: userId }])).eq('status', 'published');

      const [
        { count: blogsCount, error: blogsError },
        { data: showcasesData1, error: showcasesError1 }, 
        { count: showcasesCount2, error: showcasesError2 },
        { count: eventsCount, error: eventsError }
      ] = await Promise.all([
        supabase.from('blogs').select('*', { count: 'exact', head: true }).eq('author_id', userId).eq('status', 'published'), 
        showcasesQuery1,
        showcasesQuery2,
        supabase.from('events').select('*', { count: 'exact', head: true }).eq('created_by', userId).eq('event_state', 'published')
      ]);

      if (blogsError) console.error("Error counting blogs:", blogsError);
      if (showcasesError1) console.error("Error fetching showcases 1:", showcasesError1);
      if (showcasesError2) console.error("Error counting showcases 2:", showcasesError2);
      if (eventsError) console.error("Error counting events:", eventsError);

      let showcasesCount1 = 0;
      if (showcasesData1) {
        showcasesCount1 = showcasesData1.filter((item: any) => {
          return !item.author_data || (Array.isArray(item.author_data) && item.author_data.length === 0);
        }).length;
      }

      setUserStats({
        blogs: blogsCount || 0,
        showcases: showcasesCount1 + (showcasesCount2 || 0), 
        events: eventsCount || 0
      });

    } catch (error) {
      console.error("Error fetching user stats:", error);
      setUserStats({ blogs: 0, showcases: 0, events: 0 });
    } finally {
      setIsStatsLoading(false);
    }
  };

  const handleOpenModal = (user: UserData) => {
    setSelectedUser(user);
    setUserStats({ blogs: 0, showcases: 0, events: 0 });
    fetchUserStats(user.id);
  };

  // 🟢 2. ฟังก์ชันอัปเดตสถานะการแบน (อัปเดตคอลัมน์ role)
  const handleConfirmBanStatus = async () => {
    if (!banModal.user) return;
    
    // กำหนดค่า Role ใหม่ (สมมติว่าถ้าปลดแบนให้กลับไปเป็น 'user' ธรรมดา)
    const newRole = banModal.action === 'ban' ? 'banned' : 'user';
    
    try {
      const { error } = await supabase
        .from('user')
        .update({ role: newRole })
        .eq('id', banModal.user.id);
        
      if (error) throw error;
      
      const successMsg = banModal.action === 'ban' ? 'ระงับบัญชีผู้ใช้งานเรียบร้อยแล้ว' : 'ปลดแบนผู้ใช้งานเรียบร้อยแล้ว';
      showAlert('success', successMsg);
      
      // อัปเดตข้อมูลใน State เพื่อให้ UI เปลี่ยนทันทีโดยไม่ต้องรีเฟรชหน้า
      setUsers(prev => prev.map(u => u.id === banModal.user!.id ? { ...u, role: newRole } : u));
      if (selectedUser?.id === banModal.user.id) {
        setSelectedUser(prev => prev ? { ...prev, role: newRole } : prev);
      }
      
      setBanModal({ isOpen: false, user: null, action: 'ban' });
    } catch (error: any) {
      console.error("Error updating user status:", error);
      showAlert('error', error.message || 'เกิดข้อผิดพลาดในการดำเนินการ');
    }
  };

  const truncateId = (id: string) => id ? id.substring(0, 8) + '...' : '-';
  
  const getInitials = (firstName: string, lastName?: string) => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return lastName ? `${first}${last}` : first;
  };

  const formatShortDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const formatFullDate = (dateString: string) => {
    if (!dateString) return '-';
    const locale = language === 'th' ? 'th-TH' : 'en-GB';
    return new Date(dateString).toLocaleDateString(locale, { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // 🟢 อัปเดตระบบ Filter ให้เช็คจาก Display Name แทนค่าดิบๆ จาก Database
  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
    const roleDisplay = getRoleDisplayName(user.role).toLowerCase(); // ค้นหาด้วยชื่อสวยๆ
    const email = (user.email || '').toLowerCase();
    const id = (user.id || '').toLowerCase();
    const dateStr = formatShortDate(user.register_date);

    return (
      fullName.includes(searchLower) ||
      roleDisplay.includes(searchLower) ||
      email.includes(searchLower) ||
      id.includes(searchLower) ||
      dateStr.includes(searchLower) 
    );
  });

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); 
  };

  // 🟢 อัปเดตระบบเรียงลำดับให้เรียงตามชื่อสวยๆ แทนค่าดิบๆ
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const { key, direction } = sortConfig;
    const modifier = direction === 'asc' ? 1 : -1;

    if (key === 'id') return String(a.id).localeCompare(String(b.id)) * modifier;
    if (key === 'name') {
      const nameA = `${a.first_name || ''} ${a.last_name || ''}`;
      const nameB = `${b.first_name || ''} ${b.last_name || ''}`;
      return nameA.localeCompare(nameB, 'th') * modifier;
    }
    if (key === 'role') {
      return getRoleDisplayName(a.role).localeCompare(getRoleDisplayName(b.role), 'th') * modifier;
    }
    if (key === 'register_date') return (new Date(a.register_date).getTime() - new Date(b.register_date).getTime()) * modifier;
    
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / itemsPerPage));

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  useEffect(() => {
    if (sortedUsers.length > 0 && currentPage > totalPages) setCurrentPage(totalPages);
  }, [sortedUsers.length, currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig.key !== columnKey) {
      return (
        <svg className="w-4 h-4 ml-1.5 inline-block text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortConfig.direction === 'asc' ? (
      <svg className="w-4 h-4 ml-1.5 inline-block text-[#1e3a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 ml-1.5 inline-block text-[#1e3a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 lg:p-8 relative w-full min-w-0">
      
      {/* 🟢 3. Component แจ้งเตือน Alert Modal */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center max-w-sm w-full animate-scale-in">
            {alertModal.type === 'success' ? (
              <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-5 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
              </div>
            ) : (
              <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-5 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              </div>
            )}
            <p className="text-slate-600 font-bold text-lg">{alertModal.message}</p>
          </div>
        </div>
      )}

      {/* 🟢 4. Component ยืนยันการ Ban/Unban Modal */}
      {banModal.isOpen && banModal.user && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col w-full max-w-sm animate-scale-in text-center">
            
            {banModal.action === 'ban' ? (
              <>
                <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>
                </div>
                {/* <h3 className="text-xl font-bold text-slate-800 mb-2">{t('confirm_ban') || 'ยืนยันการระงับบัญชี'}</h3> */}
                <p className="text-slate-500 text-md mb-6 leading-relaxed">
                  {t('are_you_sure_you_want_to_ban')}<br/> <strong>{banModal.user.first_name} {banModal.user.last_name}</strong>?<br/>
                  <span className="text-xs text-red-500 mt-1 block">{t('this_user_login_disabled')}</span>
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm1.5 8h-3V5.5a1.5 1.5 0 013 0V9z" clipRule="evenodd" /></svg>
                </div>
                {/* <h3 className="text-xl font-bold text-slate-800 mb-2">{t('confirm_unban') || 'ยืนยันการปลดแบน'}</h3> */}
                <p className="text-slate-500 text-md mb-6 leading-relaxed">
                  {t('are_you_sure_you_want_to_unban')}<br/> <strong>{banModal.user.first_name} {banModal.user.last_name}</strong>?
                </p>
              </>
            )}

            <div className="flex gap-3 w-full">
              <button 
                onClick={handleConfirmBanStatus} 
                className={`flex-1 text-white font-bold py-3 rounded-xl transition-colors shadow-sm cursor-pointer ${
                  banModal.action === 'ban' ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'
                }`}
              >
                {t('confirm') || 'ยืนยัน'}
              </button>
              <button 
                onClick={() => setBanModal({ isOpen: false, user: null, action: 'ban' })} 
                className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
              >
                {t('cancel') || 'ยกเลิก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#1e3a8a" className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h1 className="pt-1 text-xl sm:text-2xl lg:text-4xl font-bold text-[#1e3a8a]">{t('users') || 'ผู้ใช้งาน'}</h1>
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder={t('search') || 'ค้นหา...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-2 sm:py-2.5 border border-slate-300 rounded-lg text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent transition-all text-slate-700"
          />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full border border-slate-200 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm sm:text-base whitespace-nowrap">
            <thead className="bg-[#E2E8F0] text-slate-600 font-semibold">
              <tr className="group">
                <th className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-slate-300 transition-colors select-none focus:outline-none" onClick={() => handleSort('id')}>
                  <div className="flex items-center">
                    {t('id') || 'ID'} <SortIcon columnKey="id" />
                  </div>
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 cursor-default">
                  {t('profile_pic') || 'Profile Pic'}
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-slate-300 transition-colors select-none focus:outline-none" onClick={() => handleSort('name')}>
                  <div className="flex items-center">
                    {t('name') || 'Name'} <SortIcon columnKey="name" />
                  </div>
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-slate-300 transition-colors select-none focus:outline-none" onClick={() => handleSort('role')}>
                  <div className="flex items-center">
                    {t('role') || 'Role'} <SortIcon columnKey="role" />
                  </div>
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-slate-300 transition-colors select-none focus:outline-none" onClick={() => handleSort('register_date')}>
                  <div className="flex items-center">
                    {t('joined_date') || 'Joined Date'} <SortIcon columnKey="register_date" />
                  </div>
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-center cursor-default">{t('action') || 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr><td colSpan={6} className="px-4 py-6 sm:px-6 sm:py-8 text-center text-slate-500 font-medium">Loading users...</td></tr>
              ) : currentItems.length > 0 ? ( 
                currentItems.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors text-slate-800 font-medium">
                    <td className="px-4 py-3 sm:px-6 sm:py-4 text-slate-500 font-mono text-sm sm:text-base">{truncateId(user.id)}</td>
                    
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center font-bold text-base sm:text-lg shadow-sm overflow-hidden">
                        {user.profilepic ? (
                          <img src={user.profilepic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          getInitials(user.first_name)
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 sm:px-6 sm:py-4 truncate max-w-[150px] sm:max-w-none">{user.first_name} {user.last_name || ''}</td>
                    
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      {/* 🟢 แสดงผล Role สวยๆ ด้วยฟังก์ชันที่สร้างขึ้น */}
                      {user.role === 'banned' ? (
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider border border-red-200">Banned</span>
                      ) : (
                        <span className="font-medium text-slate-700">{getRoleDisplayName(user.role)}</span>
                      )}
                    </td>
                    
                    <td className="px-4 py-3 sm:px-6 sm:py-4">{formatShortDate(user.register_date)}</td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 text-center">
                      <button 
                        onClick={() => handleOpenModal(user)} 
                        className="bg-[#DBEAFE] p-1.5 sm:p-2 rounded-md text-[#1E3A8A] hover:bg-blue-200 transition-colors cursor-pointer" 
                        title="View Details"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6"><path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" /><path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="px-4 py-6 sm:px-6 sm:py-8 text-center text-slate-500 font-medium">{t('no_users') || 'No users found.'}</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-slate-200 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="hidden sm:block">
              <p className="text-sm text-slate-700">
                {t('showing') || 'แสดง'} <span className="font-medium">{indexOfFirstItem + 1}</span> {t('to') || 'ถึง'} <span className="font-medium">{Math.min(indexOfLastItem, sortedUsers.length)}</span> {t('from') || 'จาก'} <span className="font-medium">{sortedUsers.length}</span> {t('list') || 'รายการ'}
              </p>
            </div>
            
            <div className="flex flex-1 justify-between sm:justify-end items-center gap-2 w-full sm:w-auto">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors select-none focus:outline-none"
              >
                {t('previous') || 'ก่อนหน้า'}
              </button>

              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer select-none focus:outline-none ${
                      currentPage === i + 1 
                        ? 'z-10 bg-[#1e3a8a] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e3a8a]' 
                        : 'text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <span className="sm:hidden text-sm text-slate-700 font-medium">
                {t('page') || 'หน้า'} {currentPage} / {totalPages}
              </span>

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors select-none focus:outline-none"
              >
                {t('next') || 'ถัดไป'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL / POPUP (Responsive Version) ================= */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6">
          
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative animate-scale-in flex flex-col max-h-[90vh] sm:max-h-[85vh]">
            
            <button 
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-[#1e3a8a] hover:bg-slate-100 p-2 rounded-full transition-colors z-10 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 sm:w-8 sm:h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="p-6 sm:p-8 lg:p-10 overflow-y-auto w-full custom-scrollbar">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1e3a8a] mb-6 sm:mb-8 pr-8">{t('account_details') || 'User details'}</h2>
              
              <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center font-bold text-2xl sm:text-3xl lg:text-4xl shadow-md flex-shrink-0 overflow-hidden relative">
                  {selectedUser.profilepic ? (
                    <img src={selectedUser.profilepic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(selectedUser.first_name)
                  )}
                  {/* แสดง Status แบนในรูปโปรไฟล์ให้เห็นชัดๆ */}
                  {selectedUser.role === 'banned' && (
                    <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center">
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 text-white"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#1e3a8a] truncate">
                    {selectedUser.first_name} {selectedUser.last_name || ''}
                  </h3>
                  <p className="text-slate-500 text-sm sm:text-base lg:text-lg mt-1 truncate flex items-center gap-2">
                    <span className='font-medium'>{t('id') || 'ID'}:</span> <span className='font-mono text-xs sm:text-sm lg:text-base'>{selectedUser.id}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 sm:gap-y-6 lg:gap-y-8 gap-x-6 lg:gap-x-12 mb-8 sm:mb-10">
                <div>
                  <p className="text-slate-500 text-sm sm:text-base lg:text-lg font-semibold mb-1">{t('email') || 'Email Address'}</p>
                  <p className="text-[#1e3a8a] font-medium text-base sm:text-lg break-all">{selectedUser.email || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm sm:text-base lg:text-lg font-semibold mb-1">{t('joined_date') || 'Joined Date'}</p>
                  <p className="text-[#1e3a8a] font-medium text-base sm:text-lg">{formatFullDate(selectedUser.register_date)}</p>
                </div>
                
                <div>
                  <p className="text-slate-500 text-sm sm:text-base lg:text-lg font-semibold mb-1">{t('school') || 'School'}</p>
                  <p className="text-[#1e3a8a] font-medium text-base sm:text-lg leading-tight">{selectedUser.school_name || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm sm:text-base lg:text-lg font-semibold mb-1">{t('province') || 'Province'}</p>
                  <p className="text-[#1e3a8a] font-medium text-base sm:text-lg">{getProvinceName(selectedUser.province)}</p>
                </div>

                <div>
                  <p className="text-slate-500 text-sm sm:text-base lg:text-lg font-semibold mb-1">{t('position') || 'Position'}</p>
                  <p className="text-[#1e3a8a] font-medium text-base sm:text-lg capitalize">{getPositionName(selectedUser.position)}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm sm:text-base lg:text-lg font-semibold mb-1">{t('academic_rank') || 'Academic Rank'}</p>
                  <p className="text-[#1e3a8a] font-medium text-base sm:text-lg capitalize">{getRankName(selectedUser.rank)}</p>
                </div>

                <div>
                  <p className="text-slate-500 text-sm sm:text-base lg:text-lg font-semibold mb-1">{t('total_blogs') || 'Total Blogs'}</p>
                  <p className="text-[#1e3a8a] font-medium text-base sm:text-lg">
                    {isStatsLoading ? '...' : `${userStats.blogs} ${t('post_count') || 'Posts'}`}
                  </p> 
                </div>
                <div>
                  <p className="text-slate-500 text-sm sm:text-base lg:text-lg font-semibold mb-1">{t('total_showcases') || 'Total Showcases'}</p>
                  <p className="text-[#1e3a8a] font-medium text-base sm:text-lg">
                    {isStatsLoading ? '...' : `${userStats.showcases} ${t('showcase_count') || 'Works'}`}
                  </p> 
                </div>
              </div>

              <hr className="border-slate-200 mb-6 sm:mb-8" />

              {/* 🟢 5. เปลี่ยนปุ่ม Ban User ให้สั่งเปิด Modal แทนการ Alert และรองรับการปลดแบน */}
              {selectedUser.role === 'banned' ? (
                <button 
                  onClick={() => setBanModal({ isOpen: true, user: selectedUser, action: 'unban' })}
                  className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-6 sm:px-8 py-3 rounded-xl font-bold text-base sm:text-lg transition-colors cursor-pointer"
                >
                  {t('unban_user') || 'ปลดระงับบัญชี'}
                </button>
              ) : (
                <button 
                  onClick={() => setBanModal({ isOpen: true, user: selectedUser, action: 'ban' })}
                  className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-6 sm:px-8 py-3 rounded-xl font-bold text-base sm:text-lg transition-colors cursor-pointer"
                >
                  {t('ban_user') || 'ระงับบัญชีผู้ใช้งาน'}
                </button>
              )}

            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default AdminUsers;