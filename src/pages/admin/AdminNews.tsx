/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

interface NewsData {
  id: string;
  title: string; 
  created_at: string; 
  thumbnail_url: string;
  status: string; 
  author_id: string;
  user?: { 
    role: string;
    first_name: string;
    last_name: string;
  }; 
}

const AdminNews = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [news, setNews] = useState<NewsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [currentUserRole, setCurrentUserRole] = useState<string>('');
  const [alertInfo, setAlertInfo] = useState({ show: false, type: 'success', message: '' });
  const [confirmDialog, setConfirmDialog] = useState({ show: false, newsId: '', actionType: '' });

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: '', title: '', thumbnail_url: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ 
    key: 'status', 
    direction: 'asc' 
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const { data: userData } = await supabase.from('user').select('role').eq('id', authUser.id).single();
          setCurrentUserRole((userData?.role || 'user').toLowerCase());
        }

        const { data: newsData, error: newsError } = await supabase
          .from('news')
          .select(`id, title, created_at, thumbnail_url, status, author_id`)
          .order('created_at', { ascending: false });    

        if (newsError) {
          console.error("Error fetching news:", newsError);
          return;
        }

        if (newsData) {
          const authorIds = [...new Set(newsData.map(n => n.author_id).filter(Boolean))];
          let userMap: Record<string, any> = {};
          
          if (authorIds.length > 0) {
            const { data: usersData, error: usersError } = await supabase
              .from('user')
              .select('id, role, first_name, last_name')
              .in('id', authorIds);
              
            if (!usersError && usersData) {
              userMap = usersData.reduce((acc, u) => {
                acc[u.id] = { role: u.role || 'user', first_name: u.first_name, last_name: u.last_name };
                return acc;
              }, {} as Record<string, any>);
            }
          }

          const mappedData = newsData.map(n => ({
            ...n,
            user: userMap[n.author_id] || { role: 'user', first_name: 'Unknown', last_name: '' } 
          })) as NewsData[];

          setNews(mappedData);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const canApprove = (creatorRole: string | undefined) => {
    const cRole = (creatorRole || 'user').toLowerCase();
    if (currentUserRole === 'admin' || currentUserRole === 'developer') return true;
    if (currentUserRole === 'co-admin' && cRole === 'user') return true;
    return false;
  };

  const renderStateBadge = (state: string) => {
    const s = (state || '').toLowerCase();
    if (s === 'pending') return <span className="px-3 py-1 rounded-md bg-yellow-100 text-yellow-700 text-sm font-semibold capitalize">{t('state_pending') || 'Pending'}</span>;
    if (s === 'published') return <span className="px-3 py-1 rounded-md bg-emerald-100 text-emerald-700 text-sm font-semibold capitalize">{t('state_published') || 'Published'}</span>;
    if (s === 'rejected') return <span className="px-3 py-1 rounded-md bg-red-100 text-red-700 text-sm font-semibold capitalize">{t('state_rejected') || 'Rejected'}</span>;
    if (s === 'draft') return <span className="px-3 py-1 rounded-md bg-slate-200 text-slate-700 text-sm font-semibold capitalize">{t('save_draft') || 'Draft'}</span>;
    return <span className="px-3 py-1 rounded-md bg-slate-100 text-slate-500 text-sm font-semibold capitalize">{state || '-'}</span>;
  };

  const formatShortDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`;
  };

  const truncateText = (text: string, maxLength: number = 35) => {
    if (!text) return '-';
    return text.length > maxLength ? text.substring(0, maxLength) + '..' : text;
  };

  const filteredNews = news.filter((item) => 
    (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.user?.first_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); 
  };

  const statePriority: Record<string, number> = { 'pending': 1, 'rejected': 2, 'draft': 3, 'published': 4 };

  const sortedNews = [...filteredNews].sort((a: any, b: any) => {
    const { key, direction } = sortConfig;
    const modifier = direction === 'asc' ? 1 : -1;

    if (key === 'status') {
      const priorityA = statePriority[(a.status || '').toLowerCase()] || 99;
      const priorityB = statePriority[(b.status || '').toLowerCase()] || 99;
      if (priorityA !== priorityB) return (priorityA - priorityB) * modifier;
      return (new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    if (key === 'title') {
      return String(a.title).localeCompare(String(b.title), 'th') * modifier;
    }

    if (key === 'author') {
      const nameA = `${a.user?.first_name} ${a.user?.last_name}`;
      const nameB = `${b.user?.first_name} ${b.user?.last_name}`;
      return nameA.localeCompare(nameB, 'th') * modifier;
    }

    if (key === 'created_at') {
      return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * modifier;
    }

    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedNews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(sortedNews.length / itemsPerPage));

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  useEffect(() => {
    if (sortedNews.length > 0 && currentPage > totalPages) setCurrentPage(totalPages);
  }, [sortedNews.length, currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const showCustomAlert = (type: 'success' | 'error', message: string) => {
    setAlertInfo({ show: true, type, message });
    setTimeout(() => {
      setAlertInfo({ show: false, type: 'success', message: '' });
    }, type === 'success' ? 1500 : 3000);
  };

  const handleConfirmClick = (id: string, actionType: 'approve') => {
    setConfirmDialog({ show: true, newsId: id, actionType });
  };

  const handleViewClick = (item: NewsData) => {
    navigate(`/news/${item.id}`);
  };

  const executeAction = async () => {
    const { newsId, actionType } = confirmDialog;
    setConfirmDialog({ show: false, newsId: '', actionType: '' });

    if (!newsId) return;

    try {
      let updateData = {};
      let successMessage = '';

      if (actionType === 'approve') {
        updateData = { status: 'published' };
        successMessage = 'อนุมัติข่าวสารให้เผยแพร่เรียบร้อยแล้ว';
        successMessage = t('admin_approve_success') || successMessage;
      }

      const { data, error } = await supabase
        .from('news')
        .update(updateData)
        .eq('id', newsId)
        .select();

      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error("ไม่มีสิทธิ์ในการอนุมัติ/แก้ไขข้อมูล (ติดสิทธิ์ RLS)");
      }

      showCustomAlert('success', successMessage);

      setNews((prevNews) => 
        prevNews.map((item) => 
          item.id === newsId ? { ...item, ...updateData } : item
        )
      );

    } catch (error: any) {
      console.error(`Error updating news:`, error);
      showCustomAlert('error', t('error_updating_occurred') || 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const { id, thumbnail_url } = deleteModal;

      // 🟢 1. ลบรูปภาพออกจาก Storage (Clean Delete รูป)
      if (thumbnail_url && thumbnail_url.includes('thumbnails/')) {
        const fileName = thumbnail_url.split('/').pop();
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from('thumbnails')
            .remove([fileName]);
            
          if (storageError) {
            console.warn("Could not delete image from storage:", storageError);
          }
        }
      }

      // 🟢 2. ลบคอมเมนต์ทั้งหมดที่เชื่อมโยงกับข่าวนี้ก่อน (แก้ปัญหา Foreign Key Error)
      const { error: commentsError } = await supabase
        .from('comments')
        .delete()
        .eq('news_id', id);

      if (commentsError) throw commentsError;

      // 🟢 3. ลบข้อมูลตัวข่าวสารหลัก
      const { error: dbError } = await supabase
        .from('news')
        .delete()
        .eq('id', id);
        
      if (dbError) throw dbError;
      
      showCustomAlert('success', t('delete_success') || 'ลบข้อมูลข่าวสาร รวมถึงคอมเมนต์และรูปภาพเรียบร้อยแล้ว');
      
      // อัปเดต UI ให้ข่าวหายไปจากตาราง
      setNews(prev => prev.filter(n => n.id !== id));
      setDeleteModal({ isOpen: false, id: '', title: '', thumbnail_url: '' });

    } catch (e: any) {
      console.error("Delete error", e);
      showCustomAlert('error', e.message || 'เกิดข้อผิดพลาดในการลบ');
    } finally {
      setIsDeleting(false);
    }
  };

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
      
      {/* Modal ยืนยันการลบข้อมูล */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col w-full max-w-sm animate-scale-in text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm mb-6">
              {t('are_you_sure_you_want_to_delete') || 'คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้?'} <br /><strong>"{deleteModal.title}"</strong>?<br/> {t('this_action_cannot_be_undone') || 'การกระทำนี้ไม่สามารถย้อนกลับได้'}
            </p>
            <div className="flex gap-3 w-full">
              <button onClick={handleConfirmDelete} disabled={isDeleting} className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors shadow-sm flex items-center justify-center cursor-pointer disabled:opacity-50">
                {isDeleting ? (t('deleting') || 'กำลังลบ...') : (t('delete') || 'ลบเลย')}
              </button>
              <button onClick={() => setDeleteModal({ isOpen: false, id: '', title: '', thumbnail_url: '' })} className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer">
                {t('cancel') || 'ยกเลิก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal ยืนยันการอนุมัติ */}
      {confirmDialog.show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center max-w-sm w-full animate-scale-in">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5 shadow-inner bg-emerald-100 text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
              </svg>
            </div>
            
            <p className="break-words whitespace-pre-wrap w-[200px] text-slate-600 text-md mb-8 ">
              {t('admin_confirm_approve') || 'ยืนยันการอนุมัติให้เผยแพร่เนื้อหานี้ ใช่หรือไม่?'}
            </p>

            <div className="flex w-full gap-4">
              <button 
                onClick={executeAction}
                className="flex-1 py-3 text-white font-bold rounded-xl transition-colors cursor-pointer bg-emerald-500 hover:bg-emerald-600"
              >
                {t('confirm') || 'Confirm'}
              </button>
              <button 
                onClick={() => setConfirmDialog({ show: false, newsId: '', actionType: '' })}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
              >
                {t('cancel') || 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {alertInfo.show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center max-w-sm w-full animate-scale-in">
            {alertInfo.type === 'success' ? (
              <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-5 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
              </div>
            ) : (
              <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-5 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 6M6 6l12 12" /></svg>
              </div>
            )}
            <p className="text-slate-600 font-bold text-lg">{alertInfo.message}</p>
          </div>
        </div>
      )}

      {/* Header และ ค้นหา */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 shrink-0">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#1e3a8a" className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex-shrink-0">
               <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
             </svg>
          </div>
          <h1 className="pt-1 text-xl sm:text-2xl lg:text-4xl font-bold text-[#1e3a8a]">{t('news') || 'จัดการข่าวสาร'}</h1>
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder={t('search') || 'ค้นหา..'}
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
              <tr className="group">
                <th className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-slate-300 transition-colors select-none focus:outline-none" onClick={() => handleSort('status')}>
                  <div className="flex items-center">
                    {t('status') || 'สถานะ'} <SortIcon columnKey="status" />
                  </div>
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-slate-300 transition-colors select-none focus:outline-none" onClick={() => handleSort('title')}>
                  <div className="flex items-center">
                    {t('titleSubject') || 'ชื่อข่าวสาร'} <SortIcon columnKey="title" />
                  </div>
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-slate-300 transition-colors select-none focus:outline-none" onClick={() => handleSort('author')}>
                  <div className="flex items-center">
                    {t('submittedBy') || 'ผู้สร้าง'} <SortIcon columnKey="author" />
                  </div>
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-slate-300 transition-colors select-none focus:outline-none" onClick={() => handleSort('created_at')}>
                  <div className="flex items-center">
                    {t('date') || 'ณ วันที่'} <SortIcon columnKey="created_at" />
                  </div>
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-center cursor-default">{t('action') || 'การดำเนินการ'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr><td colSpan={5} className="px-4 py-6 sm:px-6 sm:py-8 text-center text-slate-500 font-medium">{t('loading') || 'กำลังโหลดข้อมูล...'}</td></tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors text-slate-800 font-medium">
                    
                    <td className="px-4 py-3 sm:px-6 sm:py-4">{renderStateBadge(item.status)}</td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 text-[#1e3a8a] font-semibold">{truncateText(item.title, 35)}</td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 text-slate-600">
                      {item.user?.first_name} {item.user?.last_name}
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 font-semibold text-slate-500">{formatShortDate(item.created_at)}</td>
                    
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <div className="flex items-center justify-center gap-2">
                        
                        <button 
                          onClick={() => handleViewClick(item)}
                          className="bg-[#DBEAFE] p-1.5 sm:p-2 rounded-md text-[#1E3A8A] hover:bg-blue-200 transition-colors cursor-pointer" 
                          title={t('view') || 'ดูรายละเอียด'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                            <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                            <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        </button>

                        <button 
                          onClick={() => navigate(`/edit/news/${item.id}`)}
                          className="bg-[#1e3a8a] px-4 py-1.5 sm:py-2 rounded-lg text-white hover:bg-blue-900 transition-colors cursor-pointer text-sm sm:text-base font-medium"
                          title={t('edit') || 'แก้ไข'}
                        >
                          {t('edit') || 'แก้ไข'}
                        </button>

                        {item.status === 'pending' && canApprove(item.user?.role) && (
                          <button 
                            onClick={() => handleConfirmClick(item.id, 'approve')}
                            className="bg-emerald-500 px-4 py-1.5 sm:py-2 rounded-lg text-white hover:bg-emerald-600 transition-colors cursor-pointer text-sm sm:text-base font-medium shadow-sm flex items-center gap-1"
                            title={t('approve') || 'อนุมัติ'}
                          >
                            {t('approve') || 'อนุมัติ'}
                          </button>
                        )}
                        
                        <button 
                          onClick={() => setDeleteModal({ isOpen: true, id: item.id, title: item.title, thumbnail_url: item.thumbnail_url || '' })}
                          className="bg-slate-200 p-1.5 sm:p-2 rounded-md text-slate-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                          title={t('delete') || 'ลบ'}
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
                <tr><td colSpan={5} className="px-4 py-6 sm:px-6 sm:py-8 text-center text-slate-500 font-medium">{t('no_news') || 'ไม่พบข่าวสาร'}</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination UI */}
        {!isLoading && totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-slate-200 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="hidden sm:block">
              <p className="text-sm text-slate-700">
                {t('showing') || 'แสดง'} <span className="font-medium">{indexOfFirstItem + 1}</span> {t('to') || 'ถึง'} <span className="font-medium">{Math.min(indexOfLastItem, filteredNews.length)}</span> {t('from') || 'จาก'} <span className="font-medium">{filteredNews.length}</span> {t('list') || 'รายการ'}
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

    </div>
  );
};

export default AdminNews;