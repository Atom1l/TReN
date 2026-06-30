/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabaseClient';

interface BlogData {
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

const AdminBlogs = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [currentUserRole, setCurrentUserRole] = useState('user');

  const [alertModal, setAlertModal] = useState({ isOpen: false, type: 'success', message: '' });
  
  const [approveModal, setApproveModal] = useState({ isOpen: false, id: '', title: '' });
  const [rejectModal, setRejectModal] = useState({ isOpen: false, blogId: '', title: '', reason: '' });

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: '', title: '', thumbnail_url: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ 
    key: 'created_at', 
    direction: 'desc' 
  });

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlertModal({ isOpen: true, type, message });
    setTimeout(() => {
      setAlertModal({ isOpen: false, type: 'success', message: '' });
    }, 2000);
  };

  // 🟢 แก้ไขฟังก์ชัน Fetch Blogs ให้ทำงานได้ชัวร์ 100% ไม่ติดเรื่อง Foreign Key
  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      // เช็คสิทธิ์ User ปัจจุบัน
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: userData } = await supabase.from('user').select('role').eq('id', authUser.id).single();
        setCurrentUserRole((userData?.role || 'user').toLowerCase());
      }

      // ดึงข้อมูล Blogs อย่างเดียวมาก่อน
      const { data: blogsData, error: blogsError } = await supabase
        .from('blogs')
        .select('id, title, created_at, status, author_id, thumbnail_url')
        .order('created_at', { ascending: false });

      if (blogsError) throw blogsError;

      if (blogsData) {
        // ดึง ID ผู้เขียนทั้งหมดที่ไม่ซ้ำกัน
        const authorIds = [...new Set(blogsData.map(b => b.author_id).filter(Boolean))];
        const usersMap: Record<string, { first_name: string, last_name: string, role: string }> = {};
        
        // นำ ID ไปดึงข้อมูลชื่อและตำแหน่งจากตาราง user
        if (authorIds.length > 0) {
          const { data: usersData, error: usersError } = await supabase
            .from('user')
            .select('id, first_name, last_name, role')
            .in('id', authorIds);
            
          if (!usersError && usersData) {
            usersData.forEach(u => {
              usersMap[u.id] = {
                first_name: u.first_name || '',
                last_name: u.last_name || '',
                role: u.role || 'user'
              };
            });
          }
        }

        // นำข้อมูลกลับมาประกอบกัน
        const mappedData = blogsData.map(blog => ({
          ...blog,
          user: usersMap[blog.author_id] || { first_name: 'Unknown', last_name: '', role: 'user' }
        })) as BlogData[];

        setBlogs(mappedData);
      }

    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canApprove = (creatorRole: string | undefined) => {
    const cRole = (creatorRole || 'user').toLowerCase();
    if (currentUserRole === 'admin' || currentUserRole === 'developer') return true;
    if (currentUserRole === 'co_admin' && cRole === 'user') return true;
    return false;
  };

  const confirmApprove = async () => {
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ status: 'published', rejection_reason: null })
        .eq('id', approveModal.id);
      
      if (error) throw error;
      
      showAlert('success', 'อนุมัติบล็อกเรียบร้อยแล้ว');
      setBlogs(prev => prev.map(b => b.id === approveModal.id ? { ...b, status: 'published' } : b));
      setApproveModal({ isOpen: false, id: '', title: '' });
    } catch (e: any) {
      console.error("Approve error", e);
      showAlert('error', e.message || 'เกิดข้อผิดพลาดในการอนุมัติ');
    }
  };

  const confirmReject = async () => {
    if (!rejectModal.reason.trim()) {
      showAlert('error', 'กรุณาระบุเหตุผลที่ปฏิเสธ');
      return;
    }
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ status: 'rejected', rejection_reason: rejectModal.reason })
        .eq('id', rejectModal.blogId);
      
      if (error) throw error;
      
      showAlert('success', 'ปฏิเสธบล็อกเรียบร้อยแล้ว');
      setBlogs(prev => prev.map(b => b.id === rejectModal.blogId ? { ...b, status: 'rejected' } : b));
      setRejectModal({ isOpen: false, blogId: '', title: '', reason: '' });
    } catch (e: any) {
      console.error("Reject error", e);
      showAlert('error', e.message || 'เกิดข้อผิดพลาดในการปฏิเสธ');
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const { id, thumbnail_url } = deleteModal;

      // ลบรูปภาพใน Storage (ถ้ามี)
      if (thumbnail_url && thumbnail_url.includes('thumbnails/')) {
        const fileName = thumbnail_url.split('/').pop();
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from('thumbnails')
            .remove([fileName]);
          if (storageError) console.warn("Could not delete image:", storageError);
        }
      }

      // ลบข้อมูลใน Database
      const { error: dbError } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);
        
      if (dbError) throw dbError;
      
      showAlert('success', t('delete_blog_success') || 'ลบบล็อกและรูปภาพเรียบร้อยแล้ว');
      setBlogs(prev => prev.filter(b => b.id !== id));
      setDeleteModal({ isOpen: false, id: '', title: '', thumbnail_url: '' });

    } catch (e: any) {
      console.error("Delete error", e);
      showAlert('error', e.message || 'เกิดข้อผิดพลาดในการลบ');
    } finally {
      setIsDeleting(false);
    }
  };

  const renderStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'pending') return <span className="px-3 py-1.5 rounded-md bg-yellow-100 text-yellow-700 text-xs sm:text-sm font-bold uppercase tracking-wider">{t('state_pending') || 'Pending'}</span>;
    if (s === 'published') return <span className="px-3 py-1.5 rounded-md bg-emerald-100 text-emerald-700 text-xs sm:text-sm font-bold uppercase tracking-wider">{t('state_published') || 'Published'}</span>;
    if (s === 'rejected') return <span className="px-3 py-1.5 rounded-md bg-red-100 text-red-700 text-xs sm:text-sm font-bold uppercase tracking-wider">{t('state_rejected') || 'Rejected'}</span>;
    return <span className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold uppercase tracking-wider">{status}</span>;
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '-';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const filteredBlogs = blogs.filter((b) => {
    const searchLower = searchTerm.toLowerCase();
    const title = (b.title || '').toLowerCase();
    const author = b.user ? `${b.user.first_name} ${b.user.last_name}`.toLowerCase() : '';
    
    return title.includes(searchLower) || author.includes(searchLower);
  });

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const sortedBlogs = [...filteredBlogs].sort((a: any, b: any) => {
    const { key, direction } = sortConfig;
    const modifier = direction === 'asc' ? 1 : -1;

    if (key === 'created_at') return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * modifier;
    
    const valA = String((a as any)[key] || '');
    const valB = String((b as any)[key] || '');
    return valA.localeCompare(valB, 'th') * modifier;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedBlogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(sortedBlogs.length / itemsPerPage));

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  useEffect(() => {
    if (sortedBlogs.length > 0 && currentPage > totalPages) setCurrentPage(totalPages);
  }, [sortedBlogs.length, currentPage, totalPages]);

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig.key !== columnKey) {
      return <svg className="w-4 h-4 ml-1.5 inline-block text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>;
    }
    return sortConfig.direction === 'asc' 
      ? <svg className="w-4 h-4 ml-1.5 inline-block text-[#1e3a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
      : <svg className="w-4 h-4 ml-1.5 inline-block text-[#1e3a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>;
  };

  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 lg:p-8 relative w-full min-w-0">
      
      {/* Modal ยืนยันการลบ */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col w-full max-w-sm animate-scale-in text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              {t('are_you_sure_you_want_to_delete') || 'คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้?'} <br /><strong>"{deleteModal.title}"</strong>?<br/> {t('this_action_cannot_be_undone') || 'การกระทำนี้ไม่สามารถย้อนกลับได้'}
            </p>
            <div className="flex gap-3 w-full">
              <button onClick={handleConfirmDelete} disabled={isDeleting} className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center cursor-pointer">
                {isDeleting ? (t('deleting') || 'กำลังลบ...') : (t('delete') || 'ลบเลย')}
              </button>
              <button onClick={() => setDeleteModal({ isOpen: false, id: '', title: '', thumbnail_url: '' })} className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer">
                {t('cancel') || 'ยกเลิก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
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
            {/* <h3 className={`text-2xl font-bold mb-2 ${alertModal.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
              {alertModal.type === 'success' ? 'Success!' : 'Error!'}
            </h3> */}
            <p className="text-slate-600 font-bold text-lg">{alertModal.message}</p>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {approveModal.isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col w-full max-w-sm animate-scale-in text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{t('confirm_approve') || 'ยืนยันการอนุมัติ'}</h3>
            <p className="text-slate-500 text-md mb-6">
              {t('confirm_approve_message') || 'คุณแน่ใจหรือไม่ที่จะดำเนินการ'} <strong> <br/> "{approveModal.title}"</strong>? 
            </p>
            <div className="flex gap-3 w-full">
              <button onClick={confirmApprove} className="flex-1 bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition-colors shadow-sm cursor-pointer">
                {t('confirm') || 'ยืนยัน'}
              </button>
              <button onClick={() => setApproveModal({  isOpen: false, id: '', title: ''})} className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer">
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
              <h3 className="text-2xl font-bold text-red-600">{t('reject_blog_title') || 'ปฏิเสธ / ยกเลิกรายการ'}</h3>
              <button onClick={() => setRejectModal({ isOpen: false, blogId: '', title: '', reason: ''  })} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <p className="text-slate-600 mb-3">{t('reject_blog_reason') || 'กรุณาระบุเหตุผล / บันทึกการดำเนินการ:'}</p>
            <textarea
              value={rejectModal.reason}
              onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
              placeholder={t('reject_blog_placeholder') || 'เช่น เนื้อหาไม่เหมาะสม, ละเมิดลิขสิทธิ์ หรือ ตรวจสอบแล้วปกติ...'}
              className="w-full p-4 border border-slate-300 rounded-xl mb-6 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-red-500 resize-none text-slate-700"
            ></textarea>
            <div className="flex gap-3">
              <button 
                onClick={confirmReject}
                className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors cursor-pointer shadow-sm"
              >
                {t('confirm_reject') || 'ยืนยันปฏิเสธ'}
              </button>
              <button 
                onClick={() => setRejectModal({ isOpen: false, blogId: '', title: '', reason: ''  })}
                className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
              >
                {t('cancel') || 'ยกเลิก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#1e3a8a" className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
          </svg>
          <h1 className="pt-1 text-xl sm:text-2xl lg:text-4xl font-bold text-[#1e3a8a]">{t('blogs') || 'บล็อกและบทความ'}</h1>
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
            <thead className="bg-slate-200 text-slate-600 font-semibold">
              <tr className="group">
                <th className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-slate-300 transition-colors select-none" onClick={() => handleSort('status')}>
                  <div className="flex items-center">
                    {t('status') || 'สถานะ'} <SortIcon columnKey="status" />
                  </div>
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-slate-300 transition-colors select-none" onClick={() => handleSort('title')}>
                  <div className="flex items-center">
                    {t('titleSubject') || 'หัวข้อบล็อก'} <SortIcon columnKey="title" />
                  </div>
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-slate-300 transition-colors select-none" onClick={() => handleSort('user')}>
                  <div className="flex items-center">
                    {t('submittedBy') || 'สร้างโดย'} <SortIcon columnKey="user" />
                  </div>
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-slate-300 transition-colors select-none" onClick={() => handleSort('created_at')}>
                  <div className="flex items-center">
                    {t('date') || 'วันที่เขียน'} <SortIcon columnKey="created_at" />
                  </div>
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-center cursor-default">{t('action') || 'จัดการ'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr><td colSpan={5} className="px-4 py-6 sm:px-6 sm:py-8 text-center text-slate-500 font-medium">{t('loading') || 'กำลังโหลดข้อมูล...'}</td></tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors text-slate-800 font-medium">
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      {renderStatusBadge(req.status)}
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 text-[#1e3a8a] truncate max-w-[200px]" title={req.title}>
                      {truncateText(req.title, 30)}
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      {req.user ? `${req.user.first_name} ${req.user.last_name}` : 'Unknown'}
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      {new Date(req.created_at).toLocaleDateString('en-GB')}
                    </td>
                    
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <div className="flex items-center justify-center gap-2">
                        
                        <button 
                          onClick={() => navigate(`/blog/${req.id}`)}
                          className="bg-[#DBEAFE] p-1.5 sm:p-2 rounded-md text-[#1E3A8A] hover:bg-blue-200 transition-colors cursor-pointer" 
                          title="View Details"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6"><path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" /><path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                        </button>

                        {/* แสดงปุ่ม อนุมัติ/ปฏิเสธ เฉพาะสถานะ Pending */}
                        {req.status === 'pending' && canApprove(req.user?.role) && (
                          <>
                            <button 
                              onClick={() => setApproveModal({ isOpen: true, id: req.id, title: req.title })}
                              className="bg-emerald-500 p-1.5 sm:p-2 rounded-md text-white hover:bg-emerald-600 transition-colors cursor-pointer"
                              title={t('approve') || 'อนุมัติ'}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
                            </button>
                            <button 
                              onClick={() => setRejectModal({ isOpen: true, blogId: req.id, title: req.title, reason: '' })}
                              className="bg-red-500 p-1.5 sm:p-2 rounded-md text-white hover:bg-red-600 transition-colors cursor-pointer"
                              title={t('reject') || 'ปฏิเสธ'}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                            </button>
                          </>
                        )}

                        {/* 🟢 ปุ่มลบข้อมูล (แสดงตลอดเพื่อให้แอดมินลบได้ตามต้องการ) */}
                        <button 
                          onClick={() => setDeleteModal({ isOpen: true, id: req.id, title: req.title, thumbnail_url: req.thumbnail_url || '' })}
                          className="bg-slate-200 p-1.5 sm:p-2 rounded-md text-slate-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                          title={t('delete') || 'ลบบล็อก'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 sm:w-5 sm:h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="px-4 py-6 sm:px-6 sm:py-8 text-center text-slate-500 font-medium">{t('no_reports') || 'ไม่พบรายการที่ค้นหา'}</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination UI */}
        {!isLoading && totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-slate-200 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="hidden sm:block">
              <p className="text-sm text-slate-700">
                {t('showing') || 'แสดง'} <span className="font-medium">{indexOfFirstItem + 1}</span> {t('to') || 'ถึง'} <span className="font-medium">{Math.min(indexOfLastItem, sortedBlogs.length)}</span> {t('from') || 'จาก'} <span className="font-medium">{sortedBlogs.length}</span> {t('list') || 'รายการ'}
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

export default AdminBlogs;