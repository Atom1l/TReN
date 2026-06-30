/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabaseClient';

import ShowcasePreviewModal from '../../components/ShowcasePreviewModal';

interface ShowcaseData {
  id: string;
  title: string;
  created_at: string;
  status: string;
  author_id: string;
  thumbnail_url?: string;
  user?: { 
    first_name: string; 
    last_name: string; 
    role: string; 
  }; 
}

const AdminShowcases = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [viewModal, setViewModal] = useState<{ isOpen: boolean; showcase: ShowcaseData | null }>({ isOpen: false, showcase: null });
  
  const [showcases, setShowcases] = useState<ShowcaseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [currentUserRole, setCurrentUserRole] = useState('user');

  const [alertModal, setAlertModal] = useState({ isOpen: false, type: 'success', message: '' });
  
  const [approveModal, setApproveModal] = useState({ isOpen: false, id: '', title: '' });
  const [rejectModal, setRejectModal] = useState({ isOpen: false, showcaseId: '', title: '', reason: '' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: '', title: '', thumbnail_url: '' });

  // 🟢 State สำหรับจัดการ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // โชว์ 5 รายการต่อหน้า

  // 🟢 State สำหรับจัดการ Sorting (เรียงลำดับ) กำหนดค่าเริ่มต้นเรียงตามสถานะ
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ 
    key: 'status', 
    direction: 'asc' 
  });

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlertModal({ isOpen: true, type, message });
    setTimeout(() => {
      setAlertModal({ isOpen: false, type: 'success', message: '' });
    }, 2000);
  };

  useEffect(() => {
    const fetchAllShowcasesAndUserRole = async () => {
      setIsLoading(true);
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          const { data: currentUserData } = await supabase.from('user').select('role').eq('id', currentUser.id).single();
          setCurrentUserRole((currentUserData?.role || 'user').toLowerCase());
        }

        const { data: showcasesData, error: showcasesError } = await supabase
          .from('showcases')
          .select('*')
          .order('created_at', { ascending: false });

        if (showcasesError) throw showcasesError;

        if (showcasesData && showcasesData.length > 0) {
          const authorIds = [...new Set(showcasesData.map(s => s.author_id).filter(Boolean))];

          let usersData: any[] = [];
          if (authorIds.length > 0) {
            const { data: uData, error: uError } = await supabase
              .from('user')
              .select('id, first_name, last_name, role')
              .in('id', authorIds);
              
            if (!uError && uData) usersData = uData;
          }

          const enrichedShowcases = showcasesData.map(showcase => {
            const author = usersData.find(u => u.id === showcase.author_id);
            return {
              ...showcase,
              user: author ? { first_name: author.first_name, last_name: author.last_name, role: author.role } : undefined
            };
          });

          const statusPriority: Record<string, number> = {
            'pending': 1,
            'rejected': 2,
            'published': 3,
            'in_progress': 4
          };

          const sortedData = (enrichedShowcases as unknown as ShowcaseData[]).sort((a, b) => {
            const priorityA = statusPriority[(a.status || '').toLowerCase()] || 99;
            const priorityB = statusPriority[(b.status || '').toLowerCase()] || 99;
            return priorityA - priorityB;
          });

          setShowcases(sortedData);
        } else {
          setShowcases([]);
        }
      } catch (error) {
        console.error("Error fetching showcases:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllShowcasesAndUserRole();
  }, []);

  const renderStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'pending') return <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold capitalize">{t('state_pending') || 'Pending'}</span>;
    if (s === 'published') return <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold capitalize">{t('state_published') || 'Published'}</span>;
    if (s === 'rejected') return <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold capitalize">{t('state_rejected') || 'Rejected'}</span>;
    if (s === 'in_progress') return <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold capitalize">{t('status_in_progress') || 'In Progress'}</span>;
    return <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold capitalize">{status}</span>;
  };

  const formatShortDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`;
  };

  const truncateText = (text: string, maxLength: number = 25) => {
    if (!text) return '-';
    return text.length > maxLength ? text.substring(0, maxLength) + '..' : text;
  };

  const filteredShowcases = showcases.filter((showcase) => 
    (showcase.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🟢 2. ฟังก์ชันจัดการการคลิกหัวข้อตารางเพื่อ Sort
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // เมื่อเรียงข้อมูลใหม่ ให้กลับไปหน้า 1
  };

  // 🟢 3. เรียงลำดับข้อมูล (Sort) หลังจาก Filter แล้ว
  const statusPriority: Record<string, number> = {
    'pending': 1,
    'rejected': 2,
    'published': 3,
    'in_progress': 4
  };

  const sortedShowcases = [...filteredShowcases].sort((a: any, b: any) => {
    const { key, direction } = sortConfig;
    const modifier = direction === 'asc' ? 1 : -1;

    if (key === 'status') {
      const priorityA = statusPriority[(a.status || '').toLowerCase()] || 99;
      const priorityB = statusPriority[(b.status || '').toLowerCase()] || 99;
      if (priorityA !== priorityB) return (priorityA - priorityB) * modifier;
      // ถ้าสถานะเท่ากัน ให้เรียงตามวันที่สร้างล่าสุด
      return (new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    if (key === 'created_at') {
      return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * modifier;
    }

    if (key === 'author') {
      const nameA = a.user ? `${a.user.first_name} ${a.user.last_name}` : '';
      const nameB = b.user ? `${b.user.first_name} ${b.user.last_name}` : '';
      return nameA.localeCompare(nameB, 'th') * modifier;
    }

    if (key === 'title') {
      return String(a.title).localeCompare(String(b.title), 'th') * modifier;
    }

    return 0;
  });

  // 4. คำนวณข้อมูลสำหรับ Pagination (ใช้ข้อมูลที่ Sort แล้ว)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedShowcases.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(sortedShowcases.length / itemsPerPage));

  // ฟังก์ชันเปลี่ยนหน้า
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // เช็คถ้าลบไอเทมหน้าสุดท้ายจนหมด หรือ Search แล้วรายการน้อยลง ให้ถอยกลับมา 1 หน้า
  useEffect(() => {
    if (sortedShowcases.length > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [sortedShowcases.length, currentPage, totalPages]);

  // 🟢 รีเซ็ตกลับไปหน้าแรกเสมอ เมื่อมีการพิมพ์ค้นหา
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleApproveClick = (id: string, title: string) => {
    setApproveModal({ isOpen: true, id, title });
  };

  const confirmApprove = async () => {
    try {
      const { error } = await supabase.from('showcases').update({ status: 'published', rejection_reason: null }).eq('id', approveModal.id);
      if (error) throw error;
      showAlert('success', 'อนุมัติผลงานเพื่อเผยแพร่เรียบร้อยแล้ว');
      setShowcases(showcases.map(s => s.id === approveModal.id ? { ...s, status: 'published' } : s));
      setApproveModal({ isOpen: false, id: '', title: '' });
    } catch (error: any) {
      console.error(error);
      showAlert('error', error.message || 'เกิดข้อผิดพลาดในการอนุมัติ');
    }
  };

  const openRejectModal = (id: string, title: string) => {
    setRejectModal({ isOpen: true, showcaseId: id, title, reason: '' });
  };

  const handleConfirmReject = async () => {
    if (!rejectModal.reason.trim()) {
      showAlert('error', 'กรุณาระบุเหตุผลที่ปฏิเสธผลงานนี้');
      return;
    }
    try {
      const { error } = await supabase.from('showcases').update({ status: 'rejected', rejection_reason: rejectModal.reason }).eq('id', rejectModal.showcaseId);
      if (error) throw error;
      showAlert('success', 'ปฏิเสธผลงานและส่งเหตุผลเรียบร้อยแล้ว');
      setShowcases(showcases.map(s => s.id === rejectModal.showcaseId ? { ...s, status: 'rejected' } : s));
      setRejectModal({ isOpen: false, showcaseId: '', title: '', reason: '' });
    } catch (error: any) {
      console.error(error);
      showAlert('error', error.message || 'เกิดข้อผิดพลาดในการปฏิเสธ');
    }
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      if (deleteModal.thumbnail_url) {
        const urlParts = deleteModal.thumbnail_url.split('/public/thumbnails/');
        if (urlParts.length > 1) {
          const filePath = urlParts[1];
          const { error: storageError } = await supabase.storage.from('thumbnails').remove([filePath]);
          if (storageError) console.error("Error deleting image:", storageError);
        }
      }

      const { error } = await supabase.from('showcases').delete().eq('id', deleteModal.id);
      if (error) throw error;

      showAlert('success', 'ลบผลงานเรียบร้อยแล้ว');
      setShowcases(showcases.filter(s => s.id !== deleteModal.id));
      setDeleteModal({ isOpen: false, id: '', title: '', thumbnail_url: '' });
      
    } catch (error: any) {
      console.error("Error deleting showcase:", error);
      showAlert('error', error.message || 'เกิดข้อผิดพลาดในการลบผลงาน');
    } finally {
      setIsLoading(false);
    }
  };

  // 🟢 Component ไอคอนสำหรับแสดงการ Sort (ขึ้น/ลง)
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
      
      <ShowcasePreviewModal 
        isOpen={viewModal.isOpen} 
        showcase={viewModal.showcase} 
        onClose={() => setViewModal({ isOpen: false, showcase: null })} 
      />

      {/* Alert Modal */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
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
            {/* <h3 className={`text-2xl font-bold mb-2 ${alertModal.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
              {alertModal.type === 'success' ? 'Success!' : 'Error!'}
            </h3> */}
            <p className="text-slate-600 font-bold text-lg">{alertModal.message}</p>
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {approveModal.isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col w-full max-w-sm animate-scale-in text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
            </div>
            {/* <h3 className="text-xl font-bold text-slate-800 mb-2">{t('confirm_approve') || 'ยืนยันการอนุมัติ'}</h3> */}
            <p className="text-slate-500 text-md mb-6">
              {t('confirm_approve_message') || 'คุณแน่ใจหรือไม่ที่จะอนุมัติ'} <br/> <strong>"{approveModal.title}"</strong>? <br/> {t('content_will_be_published') || 'เนื้อหานี้จะถูกเผยแพร่สู่สาธารณะทันที'}
            </p>
            <div className="flex gap-3 w-full">
              <button onClick={confirmApprove} className="flex-1 bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition-colors shadow-sm cursor-pointer">
                {t('confirm') || 'ยืนยัน'}
              </button>
              <button onClick={() => setApproveModal({ isOpen: false, id: '', title: '' })} className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer">
                {t('cancel') || 'ยกเลิก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal.isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col w-full max-w-md animate-scale-in">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-2xl font-bold text-red-600">{t('reject_blog_title') || 'ปฏิเสธผลงาน'}</h3>
              <button onClick={() => setRejectModal({ isOpen: false, showcaseId: '', title: '', reason: '' })} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <p className="text-slate-700 text-sm mb-4">คุณกำลังปฏิเสธผลงาน: <br/><strong>"{rejectModal.title}"</strong></p>
            <p className="text-slate-600 mb-3">{t('reject_blog_reason') || 'กรุณาระบุเหตุผล:'}</p>
            <textarea
              value={rejectModal.reason}
              onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
              placeholder={t('reject_blog_placeholder') || 'เช่น เนื้อหาไม่เหมาะสม, ลิงก์เสีย...'}
              className="w-full p-4 border border-slate-300 rounded-xl mb-6 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-red-500 resize-none text-slate-700"
            ></textarea>
            <div className="flex gap-3">
              <button onClick={handleConfirmReject} className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors cursor-pointer shadow-sm">
                {t('confirm_reject') || 'ยืนยันปฏิเสธ'}
              </button>
              <button onClick={() => setRejectModal({ isOpen: false, showcaseId: '', title: '', reason: '' })} className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer">
                {t('cancel') || 'ยกเลิก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col w-full max-w-sm animate-scale-in text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </div>
            {/* <h3 className="text-xl font-bold text-slate-800 mb-2">{t('confirm_delete') || 'ยืนยันการลบข้อมูล'}</h3> */}
            <p className="text-slate-500 text-sm mb-6">
              {t('are_you_sure_you_want_to_delete') || 'คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้?'} <br /><strong>"{deleteModal.title}"</strong>?<br/> {t('this_action_cannot_be_undone') || 'การกระทำนี้ไม่สามารถย้อนกลับได้'}
            </p>
            <div className="flex gap-3 w-full">
              <button onClick={handleConfirmDelete} className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors shadow-sm flex items-center justify-center cursor-pointer">
                {isLoading ? (t('deleting') || 'กำลังลบ...') : (t('delete') || 'ลบเลย')}
              </button>
              <button onClick={() => setDeleteModal({ isOpen: false, id: '', title: '', thumbnail_url: '' })} className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer">
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h1 className="pt-1 text-xl sm:text-2xl lg:text-4xl font-bold text-[#1e3a8a]">{t('showcase_title') || 'ผลงานเด่น'}</h1>
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

      <div className="w-full border border-slate-200 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm sm:text-base whitespace-nowrap">
            <thead className="bg-[#E2E8F0] text-slate-600 font-semibold">
              {/* <tr>
                <th className="px-4 py-3 sm:px-6 sm:py-4">{t('status') || 'Status'}</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4">{t('titleSubject') || 'Title/Subject'}</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4">{t('submittedBy') || 'Submitted by'}</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4">{t('date') || 'Date'}</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-center">{t('view') || 'View'}</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-center">{t('action') || 'Actions'}</th>
              </tr> */}
              <tr className="group">
                {/* 🟢 อัปเดตส่วนหัวของตาราง ให้สามารถคลิกเพื่อ Sort ข้อมูลได้ */}
                <th className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-slate-300 transition-colors" onClick={() => handleSort('status')}>
                  <div className="flex items-center">
                    {t('status') || 'สถานะ'} <SortIcon columnKey="status" />
                  </div>
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-slate-300 transition-colors" onClick={() => handleSort('title')}>
                  <div className="flex items-center">
                    {t('titleSubject') || 'ชื่อ/หัวข้อ'} <SortIcon columnKey="title" />
                  </div>
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-slate-300 transition-colors" onClick={() => handleSort('author')}>
                  <div className="flex items-center">
                    {t('submittedBy') || 'สร้างโดย'} <SortIcon columnKey="author" />
                  </div>
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-slate-300 transition-colors" onClick={() => handleSort('created_at')}>
                  <div className="flex items-center">
                    {t('date') || 'วันที่'} <SortIcon columnKey="created_at" />
                  </div>
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-center cursor-default">{t('view') || 'รายละเอียด'}</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-center cursor-default">{t('action') || 'การดำเนินการ'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr><td colSpan={6} className="px-4 py-6 sm:px-6 sm:py-8 text-center text-slate-500 font-medium">{t('loading') || 'กำลังโหลดผลงาน...'}</td></tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((showcase) => { // 🟢 เปลี่ยนมา map จาก currentItems แทน
                  const isAuthorCoAdmin = (showcase.user?.role || '').toLowerCase() === 'co_admin';
                  const isViewerAdmin = currentUserRole === 'admin' || currentUserRole === 'developer';
                  const canAction = !isAuthorCoAdmin || isViewerAdmin;

                  return (
                    <tr key={showcase.id} className="hover:bg-slate-50 transition-colors text-slate-800 font-medium">
                      
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        {renderStatusBadge(showcase.status)}
                      </td>
                      
                      <td className="px-4 py-3 sm:px-6 sm:py-4 text-[#1e3a8a]">
                        {truncateText(showcase.title, 25)}
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        {showcase.user 
                          ? `${showcase.user.first_name} ${showcase.user.last_name?.charAt(0) || ''}.` 
                          : 'Unknown'}
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4 text-slate-600">{formatShortDate(showcase.created_at)}</td>
                      
                      <td className="px-4 py-3 sm:px-6 sm:py-4 text-center">
                        <button 
                          onClick={() => setViewModal({ isOpen: true, showcase: showcase })} 
                          className="bg-[#DBEAFE] p-1.5 sm:p-2 rounded-md text-[#1E3A8A] hover:bg-blue-200 transition-colors cursor-pointer" 
                          title={t('view') || 'รายละเอียด'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                            <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                            <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </td>

                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        <div className="flex items-center justify-center gap-2">
                          {showcase.status.toLowerCase() === 'pending' && canAction && (
                            <>
                              <button 
                                onClick={() => handleApproveClick(showcase.id, showcase.title)}
                                className="bg-emerald-500 p-1.5 sm:p-2 rounded-md text-white hover:bg-emerald-600 transition-colors cursor-pointer"
                                title={t('approve') || 'อนุมัติ'}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                </svg>
                              </button>
                              <button 
                                onClick={() => openRejectModal(showcase.id, showcase.title)}
                                className="bg-red-500 p-1.5 sm:p-2 rounded-md text-white hover:bg-red-600 transition-colors cursor-pointer"
                                title={t('reject') || 'ปฏิเสธ'}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                </svg>
                              </button>
                            </>
                          )}
                          
                          {canAction && (
                            <button 
                              onClick={() => setDeleteModal({ isOpen: true, id: showcase.id, title: showcase.title, thumbnail_url: showcase.thumbnail_url || '' })}
                              className="bg-slate-200 p-1.5 sm:p-2 rounded-md text-slate-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer ml-1"
                              title={t('delete') || 'ลบ'}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan={6} className="px-4 py-6 sm:px-6 sm:py-8 text-center text-slate-500 font-medium">{t('no_showcases') || 'No showcases found.'}</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 🟢 ส่วนของ Pagination UI */}
        {!isLoading && totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-slate-200 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="hidden sm:block">
              <p className="text-sm text-slate-700">
                {/* {t('showing') || 'แสดง'} <span className="font-medium">{indexOfFirstItem + 1}</span> {t('to') || 'ถึง'} <span className="font-medium">{Math.min(indexOfLastItem, filteredShowcases.length)}</span> {t('from') || 'จาก'} <span className="font-medium">{filteredShowcases.length}</span> {t('list') || 'รายการ'} */}
                {t('showing') || 'แสดง'} <span className="font-medium">{indexOfFirstItem + 1}</span> {t('to') || 'ถึง'} <span className="font-medium">{Math.min(indexOfLastItem, sortedShowcases.length)}</span> {t('from') || 'จาก'} <span className="font-medium">{sortedShowcases.length}</span> {t('list') || 'รายการ'}
              </p>
            </div>
            
            <div className="flex flex-1 justify-between sm:justify-end items-center gap-2 w-full sm:w-auto">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                {t('previous') || 'ก่อนหน้า'}
              </button>

              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
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
                className="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                {t('next') || 'ถัดไป'}
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminShowcases;