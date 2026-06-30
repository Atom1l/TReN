/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabaseClient';

interface TicketData {
  id: string;
  type: string; 
  title: string; 
  description: string;
  created_at: string;
  status: string;
  reporter_id: string;
  target_url: string;
  admin_note?: string; 
  report_category?: string;
  user?: { 
    first_name: string; 
    last_name: string; 
    role: string;
  }; 
}

const AdminReports = () => {
  const { t } = useLanguage();
  
  const [reports, setReports] = useState<TicketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [alertModal, setAlertModal] = useState({ isOpen: false, type: 'success', message: '' });
  const [viewModal, setViewModal] = useState<{ isOpen: boolean; ticket: TicketData | null }>({ isOpen: false, ticket: null });
  const [resolveModal, setResolveModal] = useState({ isOpen: false, id: '', title: '', note: '' });
  const [rejectModal, setRejectModal] = useState({ isOpen: false, id: '', title: '', note: '' });
  
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: '', title: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  // Sorting
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

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          user:reporter_id (first_name, last_name, role)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setReports(data as TicketData[]);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const openResolveModal = (id: string, title: string) => {
    setResolveModal({ isOpen: true, id, title, note: '' });
  };

  const confirmResolve = async () => {
    if (!resolveModal.note.trim()) {
      showAlert('error', 'กรุณาระบุรายละเอียดการดำเนินการแก้ไข');
      return;
    }
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status: 'resolved', admin_note: resolveModal.note })
        .eq('id', resolveModal.id);
      
      if (error) throw error;
      
      showAlert('success', 'บันทึกการแก้ไขปัญหาเรียบร้อยแล้ว');
      setReports(prev => prev.map(r => r.id === resolveModal.id ? { ...r, status: 'resolved', admin_note: resolveModal.note } : r));
      setResolveModal({ isOpen: false, id: '', title: '', note: '' });
    } catch (e: any) {
      console.error(e);
      showAlert('error', e.message || 'เกิดข้อผิดพลาดในการอัปเดต');
    }
  };

  const openRejectModal = (id: string, title: string) => {
    setRejectModal({ isOpen: true, id, title, note: '' });
  };

  const confirmReject = async () => {
    if (!rejectModal.note.trim()) {
      showAlert('error', 'กรุณาระบุเหตุผลที่ปฏิเสธคำร้องเรียนนี้');
      return;
    }
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status: 'done', admin_note: rejectModal.note })
        .eq('id', rejectModal.id);
      
      if (error) throw error;
      
      showAlert('success', 'บันทึกการปฏิเสธคำร้องเรียนเรียบร้อยแล้ว');
      setReports(prev => prev.map(r => r.id === rejectModal.id ? { ...r, status: 'done', admin_note: rejectModal.note } : r));
      setRejectModal({ isOpen: false, id: '', title: '', note: '' });
    } catch (e: any) {
      console.error(e);
      showAlert('error', e.message || 'เกิดข้อผิดพลาดในการอัปเดต');
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', deleteModal.id);
        
      if (error) throw error;
      
      showAlert('success', t('delete_report_success') || 'ลบรายงานเรียบร้อยแล้ว');
      setReports(prev => prev.filter(r => r.id !== deleteModal.id));
      setDeleteModal({ isOpen: false, id: '', title: '' });
    } catch (e: any) {
      console.error("Delete error", e);
      showAlert('error', e.message || 'เกิดข้อผิดพลาดในการลบ');
    } finally {
      setIsDeleting(false);
    }
  };

  // 🟢 ฟังก์ชันสำหรับแปลงประเภทการรายงาน (Report Category) เป็นภาษาตาม Context i18n
  const getCategoryDisplayName = (category: string) => {
    if (!category) return '-';
    const categoryMap: Record<string, string> = {
      'เนื้อหาไม่เหมาะสม': t('report_category_inappropriate') || 'Inappropriate Content',
      'ละเมิดลิขสิทธิ์': t('report_category_copyright_infringement') || 'Copyright Infringement',
      'สแปม / โฆษณาแอบแฝง': t('report_category_spam_ads') || 'Spam / Hidden Ads',
      'ข้อมูลเท็จ': t('report_category_false_information') || 'False Information',
      'ลิงก์เสีย / ใช้งานไม่ได้': t('report_category_broken_links') || 'Broken Links',
      'อื่นๆ': t('report_category_other') || 'Other'
    };
    return categoryMap[category.trim()] || category;
  };

  // ฟังก์ชันจัดรูปแบบสีและแปลภาษาสถานะ (Status)
  const renderStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'in_progress' || s === 'pending') {
      return <span className="px-3 py-1.5 rounded-md bg-yellow-100 text-yellow-700 text-xs sm:text-sm font-bold uppercase tracking-wider">{t('report_pending') || 'รอดำเนินการ'}</span>;
    }
    if (s === 'resolved' || s === 'published' || s === 'approved') {
      return <span className="px-3 py-1.5 rounded-md bg-emerald-100 text-emerald-700 text-xs sm:text-sm font-bold uppercase tracking-wider">{t('resolved') || 'เสร็จสิ้น'}</span>;
    }
    if (s === 'done' || s === 'rejected') {
      return <span className="px-3 py-1.5 rounded-md bg-red-100 text-red-700 text-xs sm:text-sm font-bold uppercase tracking-wider">{t('status_rejected') || 'ถูกปฏิเสธ'}</span>;
    }
    return <span className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold uppercase tracking-wider">{status}</span>;
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '-';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const filteredReports = reports.filter((req) => {
    const searchLower = searchTerm.toLowerCase();
    const title = (req.title || '').toLowerCase();
    const type = (req.type || '').toLowerCase();
    // 🟢 ค้นหาด้วยชื่อหมวดหมู่ที่แปลแล้วได้ด้วย
    const categoryDisplay = getCategoryDisplayName(req.report_category || '').toLowerCase();
    const reporter = req.user ? `${req.user.first_name} ${req.user.last_name}`.toLowerCase() : '';
    
    return title.includes(searchLower) || type.includes(searchLower) || reporter.includes(searchLower) || categoryDisplay.includes(searchLower);
  });

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const sortedReports = [...filteredReports].sort((a, b) => {
    const { key, direction } = sortConfig;
    const modifier = direction === 'asc' ? 1 : -1;

    if (key === 'created_at') return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * modifier;
    
    // 🟢 ถ้าสั่งจัดเรียงตามหมวดหมู่ ให้เรียงตาม Display Name ที่แปลแล้ว
    if (key === 'report_category') {
      return getCategoryDisplayName(a.report_category || '').localeCompare(getCategoryDisplayName(b.report_category || ''), 'th') * modifier;
    }

    const valA = String((a as any)[key] || '');
    const valB = String((b as any)[key] || '');
    return valA.localeCompare(valB, 'th') * modifier;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(sortedReports.length / itemsPerPage));

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  useEffect(() => {
    if (sortedReports.length > 0 && currentPage > totalPages) setCurrentPage(totalPages);
  }, [sortedReports.length, currentPage, totalPages]);

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
      
      {/* Modal ลบข้อมูล */}
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
              <button onClick={() => setDeleteModal({ isOpen: false, id: '', title: '' })} className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer">
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
            <h3 className={`text-2xl font-bold mb-2 ${alertModal.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
              {alertModal.type === 'success' ? 'Success!' : 'Error!'}
            </h3>
            <p className="text-slate-600 text-lg">{alertModal.message}</p>
          </div>
        </div>
      )}

      {/* Resolve Modal */}
      {resolveModal.isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col w-full max-w-md animate-scale-in text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{t('confirm_resolved') || 'แก้ไขปัญหาเรียบร้อย'}</h3>
            <p className="text-slate-500 text-sm mb-4">
              {t('confirm_resolved_message') || 'คุณกำลังอัปเดตสถานะของ'} <strong>"{resolveModal.title}"</strong>
            </p>
            
            <div className="text-left mb-6">
              <label className="block text-slate-700 font-semibold mb-2 text-sm">{t('admin_note') || 'บันทึกการดำเนินการ'}:</label>
              <textarea
                value={resolveModal.note}
                onChange={(e) => setResolveModal({ ...resolveModal, note: e.target.value })}
                placeholder={t('resolve_modal_placeholder') || 'เช่น ทำการลบบล็อกนี้ออกจากระบบแล้ว, ทำการแบนผู้ใช้งานชั่วคราว...'}
                className="w-full p-4 border border-slate-300 rounded-xl min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-slate-700 text-sm"
              ></textarea>
            </div>

            <div className="flex gap-3 w-full">
              <button onClick={confirmResolve} className="flex-1 bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition-colors shadow-sm cursor-pointer">
                {t('save_report_status') || 'บันทึกสถานะ'}
              </button>
              <button onClick={() => setResolveModal({ isOpen: false, id: '', title: '', note: '' })} className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer">
                {t('cancel') || 'ยกเลิก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal.isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col w-full max-w-md animate-scale-in text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{t('confirm_reject') || 'ปฏิเสธคำร้องเรียน'}</h3>
            <p className="text-slate-500 text-sm mb-4">
              {t('confirm_reject_message') || 'คุณกำลังปฏิเสธคำร้องเรียน'} <strong>"{rejectModal.title}"</strong>
            </p>

            <div className="text-left mb-6">
              <label className="block text-slate-700 font-semibold mb-2 text-sm">{t('reject_reason') || 'เหตุผลในการปฏิเสธ'}:</label>
              <textarea
                value={rejectModal.note}
                onChange={(e) => setRejectModal({ ...rejectModal, note: e.target.value })}
                placeholder={t('reject_modal_placeholder') || 'เช่น ตรวจสอบแล้วไม่พบการละเมิดกฎ, ข้อมูลไม่เพียงพอ...'}
                className="w-full p-4 border border-slate-300 rounded-xl min-h-[100px] focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none text-slate-700 text-sm"
              ></textarea>
            </div>

            <div className="flex gap-3 w-full">
              <button onClick={confirmReject} className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors shadow-sm cursor-pointer">
                {t('save_rejection') || 'บันทึกการปฏิเสธ'}
              </button>
              <button onClick={() => setRejectModal({ isOpen: false, id: '', title: '', note: '' })} className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer">
                {t('cancel') || 'ยกเลิก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Full Report Modal */}
      {viewModal.isOpen && viewModal.ticket && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col w-full max-w-2xl max-h-[90vh] relative animate-scale-in">
            <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
              <div>
                <h2 className="mt-1 text-2xl font-bold text-[#1e3a8a]">{viewModal.ticket.title}</h2>
              </div>
              <button onClick={() => setViewModal({ isOpen: false, ticket: null })} className="text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full p-2 transition-colors cursor-pointer flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="overflow-y-auto custom-scrollbar pr-2 mb-6">
              <div className="mb-5">
                <p className="text-sm text-slate-500 font-medium mb-1">{t('report_category') || 'หัวข้อการรายงาน (Category)'}:</p>
                {/* 🟢 อัปเดตส่วนแสดงชื่อประเภทในตัว Modal รายละเอียด ให้ดึงข้อมูลภาษาที่ถูกแปลมาโชว์ */}
                <div className="grid-rows-[1fr] inline-flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-2.5 pt-3 rounded-xl font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  {getCategoryDisplayName(viewModal.ticket.report_category || '')}
                </div>
              </div>
              <div className="mb-6">
                <p className="text-sm text-slate-500 font-medium mb-1">{t('report_desc') || 'รายละเอียด (Description)'}:</p>
                <div className="bg-slate-50 p-4 rounded-xl text-slate-700 leading-relaxed whitespace-pre-wrap border border-slate-100">
                  {viewModal.ticket.description || 'ไม่มีรายละเอียดเพิ่มเติม'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <p className="text-slate-400 font-medium mb-1">{t('reporter') || 'ผู้รายงาน (Reporter)'}:</p>
                  <p className="text-slate-800 font-semibold">{viewModal.ticket.user ? `${viewModal.ticket.user.first_name} ${viewModal.ticket.user.last_name}` : 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium mb-1">{t('report_date') || 'วันที่รายงาน (Date)'}:</p>
                  <p className="text-slate-800 font-semibold">{new Date(viewModal.ticket.created_at).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </div>
              </div>

              {viewModal.ticket.admin_note && (
                <div className="mb-4 p-4 rounded-xl border border-blue-100 bg-blue-50">
                  <p className="text-[#1e3a8a] text-sm font-bold mb-1 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 001.065.682L10 15.032l5.935 2.9A.75.75 0 0017 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0010 2z" clipRule="evenodd" /></svg>
                    {t('admin_note') || 'บันทึกการดำเนินการ (Admin Note)'}:
                  </p>
                  <p className="text-blue-900 text-sm whitespace-pre-wrap mt-3 border border-blue-200 p-3 bg-white">{viewModal.ticket.admin_note}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <button 
                onClick={() => {
                  if (viewModal.ticket?.target_url) window.open(viewModal.ticket.target_url, '_blank');
                  else showAlert('error', 'ไม่พบลิงก์ต้นทางของเนื้อหานี้');
                }}
                className="flex-1 bg-[#1e3a8a] text-white font-bold py-3 rounded-xl hover:bg-blue-900 transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{t('view_source') || 'ไปยังแหล่งที่มา (Source)'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      

      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#1e3a8a" className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex-shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="pt-1 text-xl sm:text-2xl lg:text-4xl font-bold text-[#1e3a8a]">{t('reports_overall') || 'รายงานปัญหา'}</h1>
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
                <th className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-slate-300 transition-colors select-none" onClick={() => handleSort('report_category')}>
                  <div className="flex items-center">
                    {t('report_category') || 'หมวดหมู่'} <SortIcon columnKey="report_category" />
                  </div>
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-slate-300 transition-colors select-none" onClick={() => handleSort('title')}>
                  <div className="flex items-center">
                    {t('titleSubject') || 'หัวข้อ'} <SortIcon columnKey="title" />
                  </div>
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-slate-300 transition-colors select-none" onClick={() => handleSort('reporter_id')}>
                  <div className="flex items-center">
                    {t('reporter') || 'ผู้รายงาน'} <SortIcon columnKey="reporter_id" />
                  </div>
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-slate-300 transition-colors select-none" onClick={() => handleSort('created_at')}>
                  <div className="flex items-center">
                    {t('date') || 'วันที่'} <SortIcon columnKey="created_at" />
                  </div>
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-center cursor-default">{t('action') || 'จัดการ'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr><td colSpan={6} className="px-4 py-6 sm:px-6 sm:py-8 text-center text-slate-500 font-medium">{t('loading') || 'กำลังโหลดข้อมูล...'}</td></tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors text-slate-800 font-medium">
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      {renderStatusBadge(req.status)}
                    </td>
                    {/* 🟢 อัปเดตส่วนแสดงชื่อประเภทในแถวตารางให้ดึงข้อมูลภาษาที่ถูกแปลมาโชว์ */}
                    <td className="px-4 py-3 sm:px-6 sm:py-4 text-red-500 font-bold">
                      {getCategoryDisplayName(req.report_category || '')}
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 text-red-700 font-medium truncate max-w-[200px]" title={req.title}>
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
                          onClick={() => setViewModal({ isOpen: true, ticket: req })}
                          className="bg-[#DBEAFE] p-1.5 sm:p-2 rounded-md text-[#1E3A8A] hover:bg-blue-200 transition-colors cursor-pointer" 
                          title="View Details"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6"><path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" /><path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                        </button>

                        {req.status === 'in_progress' && (
                          <>
                            <button 
                              onClick={() => openResolveModal(req.id, req.title)}
                              className="bg-emerald-500 p-1.5 sm:p-2 rounded-md text-white hover:bg-emerald-600 transition-colors cursor-pointer"
                              title={t('approve') || 'แก้ไขปัญหาแล้ว'}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
                            </button>
                            <button 
                              onClick={() => openRejectModal(req.id, req.title)}
                              className="bg-red-500 p-1.5 sm:p-2 rounded-md text-white hover:bg-red-600 transition-colors cursor-pointer"
                              title={t('reject') || 'ปฏิเสธ/ยกเลิกคำร้อง'}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                            </button>
                          </>
                        )}

                        {(req.status === 'resolved' || req.status === 'done') && (
                          <button 
                            onClick={() => setDeleteModal({ isOpen: true, id: req.id, title: req.title })}
                            className="bg-slate-200 p-1.5 sm:p-2 rounded-md text-slate-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                            title={t('delete') || 'ลบข้อมูล'}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        )}

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="px-4 py-6 sm:px-6 sm:py-8 text-center text-slate-500 font-medium">{t('no_reports') || 'ไม่พบรายการที่ค้นหา'}</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-slate-200 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="hidden sm:block">
              <p className="text-sm text-slate-700">
                {t('showing') || 'แสดง'} <span className="font-medium">{indexOfFirstItem + 1}</span> {t('to') || 'ถึง'} <span className="font-medium">{Math.min(indexOfLastItem, sortedReports.length)}</span> {t('from') || 'จาก'} <span className="font-medium">{sortedReports.length}</span> {t('list') || 'รายการ'}
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

export default AdminReports;