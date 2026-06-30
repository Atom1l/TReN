/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabaseClient';

import EventPreviewModal from '../../components/EventPreviewModal';
import ShowcasePreviewModal from '../../components/ShowcasePreviewModal';
import ResourcePreviewModal from '../../components/ResourcePreviewModal'; // 🟢 1. Import Modal สำหรับ Resource

const DashboardOverview = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    pending: 0,
    reports: 0,
    users: 0
  });
  
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  // Sorting 
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ 
    key: 'raw_date', 
    direction: 'desc' 
  });

  const [currentUserRole, setCurrentUserRole] = useState('user');

  const [previewEvent, setPreviewEvent] = useState<{ isOpen: boolean, event: any }>({ isOpen: false, event: null });
  const [previewShowcase, setPreviewShowcase] = useState<{ isOpen: boolean, showcase: any }>({ isOpen: false, showcase: null });
  const [previewResource, setPreviewResource] = useState<{ isOpen: boolean, resource: any }>({ isOpen: false, resource: null }); // 🟢 2. State สำหรับ Preview Resource
  
  const [viewReportModal, setViewReportModal] = useState<{ isOpen: boolean, ticket: any | null }>({ isOpen: false, ticket: null }); 
  
  const [alertModal, setAlertModal] = useState({ isOpen: false, type: 'success', message: '' });
  
  const [approveModal, setApproveModal] = useState({ isOpen: false, type: '', id: '', title: '' });
  const [rejectModal, setRejectModal] = useState({ isOpen: false, type: '', id: '', title: '', reason: '' });

  const [resolveReportModal, setResolveReportModal] = useState({ isOpen: false, id: '', title: '', note: '' });
  const [rejectReportModal, setRejectReportModal] = useState({ isOpen: false, id: '', title: '', note: '' });

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlertModal({ isOpen: true, type, message });
    setTimeout(() => {
      setAlertModal({ isOpen: false, type: 'success', message: '' });
    }, 2000);
  };

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

  const renderStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    
    if (s === 'pending' || s === 'in_progress') {
      return <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold capitalize">{t('state_pending') || 'รอดำเนินการ'}</span>;
    }
    if (s === 'published' || s === 'approved' || s === 'resolved') {
      return <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold capitalize">{t('resolved') || 'เสร็จสิ้น'}</span>;
    }
    if (s === 'rejected' || s === 'done') {
      return <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold capitalize">{t('state_rejected') || 'ถูกปฏิเสธ'}</span>;
    }
    if (s === 'upcoming') {
      return <span className="px-3 py-1 rounded-full bg-[#1e3a8a] text-white text-sm font-semibold capitalize">{t('status_upcoming') || 'กำลังมาถึง'}</span>;
    }
    if (s === 'past') {
      return <span className="px-3 py-1 rounded-full bg-[#DBEAFE] text-[#1e3a8a] text-sm font-semibold capitalize">{t('status_past') || 'ผ่านมาแล้ว'}</span>;
    }

    return <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold capitalize">{status}</span>;
  };

  const renderTypeBadge = (type: string) => {
    const tType = (type || '').toLowerCase();
    if (tType === 'report') return <span className="bg-[#FEE2E2] text-[#991B1B] px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold inline-block">{t('type_report') || 'รายงานปัญหา'}</span>;
    if (tType === 'showcase') return <span className="bg-[#EDE9FE] text-[#5B21B6] px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold inline-block">{t('type_showcase') || 'โชว์ผลงาน'}</span>;
    if (tType === 'blog' || tType === 'blogs') return <span className="bg-[#DBEAFE] text-[#1E40AF] px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold inline-block">{t('type_blog') || 'บทความ'}</span>;
    if (tType === 'event' || tType === 'events') return <span className="bg-[#DCFCE7] text-[#166534] px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold inline-block">{t('type_event') || 'กิจกรรม'}</span>;
    if (tType === 'resource') return <span className="bg-[#CCFBF1] text-[#0F766E] px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold inline-block">{t('resource') || 'ทรัพยากร'}</span>; // 🟢 3. Badge สีใหม่สำหรับ Resource
    return <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold inline-block">{type}</span>;
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        const { data: currentUserData } = await supabase.from('user').select('role').eq('id', currentUser.id).single();
        setCurrentUserRole((currentUserData?.role || 'user').toLowerCase());
      }

      // 🟢 4. เพิ่มการดึง Count ของ Resources (ที่ pending)
      const [
        { count: blogsCount },
        { count: eventsCount },
        { count: showcasesCount },
        { count: resourcesCount }, 
        { count: reportsCount },
        { count: usersCount }
      ] = await Promise.all([
        supabase.from('blogs').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('events').select('*', { count: 'exact', head: true }).eq('event_state', 'pending'), 
        supabase.from('showcases').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('resources').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'), 
        supabase.from('user').select('*', { count: 'exact', head: true })
      ]);

      const totalPending = (blogsCount || 0) + (eventsCount || 0) + (showcasesCount || 0) + (resourcesCount || 0);

      setStats({
        pending: totalPending,
        reports: reportsCount || 0,
        users: usersCount || 0
      });

      // 🟢 5. เพิ่มการดึงข้อมูล Pending Resources มาโชว์ในตาราง
      const [
        { data: pendingBlogs },
        { data: pendingEvents },
        { data: pendingShowcases },
        { data: pendingResources },
        { data: pendingReports }
      ] = await Promise.all([
        supabase.from('blogs').select('*').eq('status', 'pending'),
        supabase.from('events').select('*').eq('event_state', 'pending'),
        supabase.from('showcases').select('*').eq('status', 'pending'),
        supabase.from('resources').select('*').eq('status', 'pending'),
        supabase.from('tickets').select('*').eq('status', 'in_progress') 
      ]);

      let combinedItems: any[] = [];

      if (pendingBlogs) combinedItems.push(...pendingBlogs.map(b => ({ ...b, _type: 'Blog', _originalId: b.id, _authorId: b.author_id, _status: b.status })));
      if (pendingEvents) combinedItems.push(...pendingEvents.map(e => ({ ...e, _type: 'Event', _originalId: e.id, _authorId: e.created_by, _status: e.event_state, _timeStatus: e.status })));
      if (pendingShowcases) combinedItems.push(...pendingShowcases.map(s => ({ ...s, _type: 'Showcase', _originalId: s.id, _authorId: s.author_id, _status: s.status })));
      if (pendingResources) combinedItems.push(...pendingResources.map(r => ({ ...r, _type: 'Resource', _originalId: r.id, _authorId: r.author_id, _status: r.status }))); 
      
      if (pendingReports) combinedItems.push(...pendingReports.map(r => ({ 
        ...r, 
        _type: 'Report', 
        _originalId: r.id, 
        title: r.title || `Report #${r.id.toString().substring(0,6)}`,
        _authorId: r.reporter_id, 
        _status: r.status,
        target_url: r.target_url,
        report_category: r.report_category 
      })));

      const authorIds = [...new Set(combinedItems.map(item => item._authorId).filter(Boolean))];
      let usersMap: Record<string, { name: string, role: string }> = {};
      
      if (authorIds.length > 0) {
        const { data: usersData } = await supabase.from('user').select('id, first_name, last_name, role').in('id', authorIds);
        if (usersData) {
          usersData.forEach(u => {
            usersMap[u.id] = {
              name: `${u.first_name} ${u.last_name?.charAt(0) || ''}.`,
              role: (u.role || 'user').toLowerCase()
            };
          });
        }
      }

      const formattedItems = combinedItems.map(item => {
        const authorInfo = usersMap[item._authorId] || { name: 'System/Anonymous', role: 'user' };
        return {
          ...item,
          id: `${item._type}-${item._originalId}`,
          original_id: item._originalId,
          type: item._type,
          original_type: item.type, 
          status: item._status || 'pending',
          title: item.title || 'Untitled',
          author: authorInfo.name,
          author_role: authorInfo.role, 
          author_name: item.author_name || authorInfo.name, 
          date: new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }),
          raw_date: new Date(item.created_at).getTime() 
        };
      });

      setRecentRequests(formattedItems);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleView = (req: any) => {
    if (req.type === 'Blog') navigate(`/blog/${req.original_id}`); 
    else if (req.type === 'Event') {
      const timeStatus = (req._timeStatus || '').toLowerCase(); 
      if (timeStatus === 'past' || timeStatus === 'done') navigate(`/event/${req.original_id}`); 
      else setPreviewEvent({ isOpen: true, event: req }); 
    } 
    else if (req.type === 'Showcase') setPreviewShowcase({ isOpen: true, showcase: req }); 
    else if (req.type === 'Resource') setPreviewResource({ isOpen: true, resource: req }); // 🟢 6. เพิ่มให้กดดู Resource ได้
    else if (req.type === 'Report') setViewReportModal({ isOpen: true, ticket: req }); 
  };

  const openApproveModal = (type: string, id: string, title: string) => {
    setApproveModal({ isOpen: true, type, id, title });
  };

  const confirmApprove = async () => {
    try {
      let tableName = '';
      let updateData = {};
      
      // 🟢 7. ผูก Logic อนุมัติ Resource เข้าฐานข้อมูล
      if (approveModal.type === 'Blog') { tableName = 'blogs'; updateData = { status: 'published', rejection_reason: null }; }
      else if (approveModal.type === 'Showcase') { tableName = 'showcases'; updateData = { status: 'published', rejection_reason: null }; }
      else if (approveModal.type === 'Event') { tableName = 'events'; updateData = { event_state: 'published' }; }
      else if (approveModal.type === 'Resource') { tableName = 'resources'; updateData = { status: 'published', rejection_reason: null }; }

      if (!tableName) return;

      const { error } = await supabase.from(tableName).update(updateData).eq('id', approveModal.id);
      if (error) throw error;
      
      showAlert('success', 'อนุมัติรายการเรียบร้อยแล้ว');
      setRecentRequests(prev => prev.filter(req => req.original_id !== approveModal.id));
      setStats(prev => ({ ...prev, pending: Math.max(0, prev.pending - 1) }));
      setApproveModal({ isOpen: false, type: '', id: '', title: '' });
    } catch(e: any) {
      console.error("Approve error", e);
      showAlert('error', e.message || 'เกิดข้อผิดพลาดในการอนุมัติ');
    }
  };

  const openRejectModal = (type: string, id: string, title: string) => {
    setRejectModal({ isOpen: true, type, id, title, reason: '' });
  };

  const confirmReject = async () => {
    if (!rejectModal.reason.trim() && rejectModal.type !== 'Event') {
      showAlert('error', 'กรุณาระบุเหตุผลที่ปฏิเสธ'); return;
    }

    try {
      let tableName = '';
      let updateData = {};
      
      // 🟢 8. ผูก Logic ปฏิเสธ Resource เข้าฐานข้อมูล
      if (rejectModal.type === 'Blog') { tableName = 'blogs'; updateData = { status: 'rejected', rejection_reason: rejectModal.reason }; }
      else if (rejectModal.type === 'Showcase') { tableName = 'showcases'; updateData = { status: 'rejected', rejection_reason: rejectModal.reason }; }
      else if (rejectModal.type === 'Event') { tableName = 'events'; updateData = { event_state: 'rejected' }; } 
      else if (rejectModal.type === 'Resource') { tableName = 'resources'; updateData = { status: 'rejected', rejection_reason: rejectModal.reason }; } 

      if (!tableName) return;

      const { error } = await supabase.from(tableName).update(updateData).eq('id', rejectModal.id);
      if (error) throw error;
      
      showAlert('success', 'ปฏิเสธรายการเรียบร้อยแล้ว');
      setRecentRequests(prev => prev.filter(req => req.original_id !== rejectModal.id));
      setStats(prev => ({ ...prev, pending: Math.max(0, prev.pending - 1) }));
      setRejectModal({ isOpen: false, type: '', id: '', title: '', reason: '' });
    } catch(e: any) {
      console.error("Reject error", e);
      showAlert('error', e.message || 'เกิดข้อผิดพลาดในการปฏิเสธ');
    }
  };

  const openResolveReportModal = (id: string, title: string) => {
    setResolveReportModal({ isOpen: true, id, title, note: '' });
  };

  const confirmResolveReport = async () => {
    if (!resolveReportModal.note.trim()) {
      showAlert('error', 'กรุณาระบุรายละเอียดการดำเนินการแก้ไข');
      return;
    }
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status: 'resolved', admin_note: resolveReportModal.note })
        .eq('id', resolveReportModal.id);
      
      if (error) throw error;
      
      showAlert('success', 'บันทึกการแก้ไขปัญหาเรียบร้อยแล้ว');
      setRecentRequests(prev => prev.filter(req => req.original_id !== resolveReportModal.id));
      setStats(prev => ({ ...prev, reports: Math.max(0, prev.reports - 1) }));
      setResolveReportModal({ isOpen: false, id: '', title: '', note: '' });
    } catch (e: any) {
      console.error(e);
      showAlert('error', e.message || 'เกิดข้อผิดพลาดในการอัปเดต');
    }
  };

  const openRejectReportModal = (id: string, title: string) => {
    setRejectReportModal({ isOpen: true, id, title, note: '' });
  };

  const confirmRejectReport = async () => {
    if (!rejectReportModal.note.trim()) {
      showAlert('error', 'กรุณาระบุเหตุผลที่ปฏิเสธคำร้องเรียนนี้');
      return;
    }
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status: 'done', admin_note: rejectReportModal.note })
        .eq('id', rejectReportModal.id);
      
      if (error) throw error;
      
      showAlert('success', 'บันทึกการปฏิเสธคำร้องเรียนเรียบร้อยแล้ว');
      setRecentRequests(prev => prev.filter(req => req.original_id !== rejectReportModal.id));
      setStats(prev => ({ ...prev, reports: Math.max(0, prev.reports - 1) }));
      setRejectReportModal({ isOpen: false, id: '', title: '', note: '' });
    } catch (e: any) {
      console.error(e);
      showAlert('error', e.message || 'เกิดข้อผิดพลาดในการอัปเดต');
    }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); 
  };

  const sortedRequests = [...recentRequests].sort((a, b) => {
    const { key, direction } = sortConfig;
    const modifier = direction === 'asc' ? 1 : -1;

    if (key === 'raw_date') {
      return (a.raw_date - b.raw_date) * modifier;
    }

    const valA = String(a[key] || '');
    const valB = String(b[key] || '');
    return valA.localeCompare(valB, 'th') * modifier;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(sortedRequests.length / itemsPerPage));

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  useEffect(() => {
    if (sortedRequests.length > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [sortedRequests.length, currentPage, totalPages]);

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig.key !== columnKey) {
      return (
        <svg className="w-4 h-4 ml-1.5 inline-block text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortConfig.direction === 'asc' ? (
      <svg className="w-4 h-4 ml-1.5 inline-block text-[#1e3a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 ml-1.5 inline-block text-[#1e3a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-8 relative">
      
      <EventPreviewModal isOpen={previewEvent.isOpen} event={previewEvent.event} onClose={() => setPreviewEvent({ isOpen: false, event: null })} />
      <ShowcasePreviewModal isOpen={previewShowcase.isOpen} showcase={previewShowcase.showcase} onClose={() => setPreviewShowcase({ isOpen: false, showcase: null })} />
      {/* 🟢 9. วาง ResourcePreviewModal เพื่อให้กดดูจากตารางได้ */}
      <ResourcePreviewModal isOpen={previewResource.isOpen} resource={previewResource.resource} onClose={() => setPreviewResource({ isOpen: false, resource: null })} />

      {/* View Full Report Modal */}
      {viewReportModal.isOpen && viewReportModal.ticket && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col w-full max-w-2xl max-h-[90vh] relative animate-scale-in">
            <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
              <div>
                <h2 className="mt-1 text-2xl font-bold text-[#1e3a8a]">{viewReportModal.ticket.title}</h2>
              </div>
              <button onClick={() => setViewReportModal({ isOpen: false, ticket: null })} className="text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full p-2 transition-colors cursor-pointer flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="overflow-y-auto custom-scrollbar pr-2 mb-6">
              <div className="mb-5">
                <p className="text-sm text-slate-500 font-medium mb-1">{t('report_category') || 'หัวข้อการรายงาน (Category)'}:</p>
                <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-2.5 pt-3.5 rounded-xl font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  {getCategoryDisplayName(viewReportModal.ticket.report_category || '')}
                </div>
              </div>
              <div className="mb-6">
                <p className="text-sm text-slate-500 font-medium mb-1">{t('report_desc') || 'รายละเอียด (Description)'}:</p>
                <div className="bg-slate-50 p-4 rounded-xl text-slate-700 leading-relaxed whitespace-pre-wrap border border-slate-100">
                  {viewReportModal.ticket.description || 'ไม่มีรายละเอียดเพิ่มเติม'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <p className="text-slate-400 font-medium mb-1">{t('reporter') || 'ผู้รายงาน (Reporter)'}:</p>
                  <p className="text-slate-800 font-semibold">{viewReportModal.ticket.author}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium mb-1">{t('report_date') || 'วันที่รายงาน (Date)'}:</p>
                  <p className="text-slate-800 font-semibold">{new Date(viewReportModal.ticket.created_at).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </div>
              </div>

              {viewReportModal.ticket.admin_note && (
                <div className="mb-4 p-4 rounded-xl border border-blue-100 bg-blue-50">
                  <p className="text-[#1e3a8a] text-sm font-bold mb-1 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 001.065.682L10 15.032l5.935 2.9A.75.75 0 0017 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0010 2z" clipRule="evenodd" /></svg>
                    {t('admin_note') || 'บันทึกการดำเนินการ (Admin Note)'}:
                  </p>
                  <p className="text-blue-900 text-sm whitespace-pre-wrap mt-3 border border-blue-200 p-3 bg-white">{viewReportModal.ticket.admin_note}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <button 
                onClick={() => {
                  if (viewReportModal.ticket?.target_url) window.open(viewReportModal.ticket.target_url, '_blank');
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
            <p className="text-slate-600 font-bold text-lg">{alertModal.message}</p>
          </div>
        </div>
      )}

      {/* Approve Modal (สำหรับ Content ปกติ) */}
      {approveModal.isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col w-full max-w-sm animate-scale-in text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
            </div>
            <p className="text-slate-500 text-md mb-6">
              {t('confirm_approve_message') || 'คุณแน่ใจหรือไม่ที่จะดำเนินการ'} <strong> <br/> "{approveModal.title}"</strong>? 
            </p>
            <div className="flex gap-3 w-full">
              <button onClick={confirmApprove} className="flex-1 bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition-colors shadow-sm cursor-pointer">
                {t('confirm') || 'ยืนยัน'}
              </button>
              <button onClick={() => setApproveModal({  isOpen: false, type: '', id: '', title: ''})} className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer">
                {t('cancel') || 'ยกเลิก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal (สำหรับ Content ปกติ) */}
      {rejectModal.isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col w-full max-w-md animate-scale-in">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-2xl font-bold text-red-600">{t('reject_blog_title') || 'ปฏิเสธ / ยกเลิกรายการ'}</h3>
              <button onClick={() => setRejectModal({ isOpen: false, type: '', id: '', title: '', reason: ''  })} className="text-slate-400 hover:text-slate-600 cursor-pointer">
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
                onClick={() => setRejectModal({ isOpen: false, type: '', id: '', title: '', reason: ''  })}
                className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
              >
                {t('cancel') || 'ยกเลิก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Modal (เฉพาะ Report) */}
      {resolveReportModal.isOpen && (
        <div className="fixed inset-0 z-[350] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col w-full max-w-md animate-scale-in text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{t('confirm_resolved') || 'แก้ไขปัญหาเรียบร้อย'}</h3>
            <p className="text-slate-500 text-sm mb-4">
              {t('confirm_resolved_message') || 'คุณกำลังอัปเดตสถานะของ'} <strong>"{resolveReportModal.title}"</strong>
            </p>
            
            <div className="text-left mb-6">
              <label className="block text-slate-700 font-semibold mb-2 text-sm">{t('admin_note') || 'บันทึกการดำเนินการ'}:</label>
              <textarea
                value={resolveReportModal.note}
                onChange={(e) => setResolveReportModal({ ...resolveReportModal, note: e.target.value })}
                placeholder={t('resolve_modal_placeholder') || 'เช่น ทำการลบบล็อกนี้ออกจากระบบแล้ว, ทำการแบนผู้ใช้งานชั่วคราว...'}
                className="w-full p-4 border border-slate-300 rounded-xl min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-slate-700 text-sm"
              ></textarea>
            </div>

            <div className="flex gap-3 w-full">
              <button onClick={confirmResolveReport} className="flex-1 bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition-colors shadow-sm cursor-pointer">
                {t('save_report_status') || 'บันทึกสถานะ'}
              </button>
              <button onClick={() => setResolveReportModal({ isOpen: false, id: '', title: '', note: '' })} className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer">
                {t('cancel') || 'ยกเลิก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal (เฉพาะ Report) */}
      {rejectReportModal.isOpen && (
        <div className="fixed inset-0 z-[350] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col w-full max-w-md animate-scale-in text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{t('confirm_reject') || 'ปฏิเสธคำร้องเรียน'}</h3>
            <p className="text-slate-500 text-sm mb-4">
              {t('confirm_reject_message') || 'คุณกำลังปฏิเสธคำร้องเรียน'} <strong>"{rejectReportModal.title}"</strong>
            </p>

            <div className="text-left mb-6">
              <label className="block text-slate-700 font-semibold mb-2 text-sm">{t('reject_reason') || 'เหตุผลในการปฏิเสธ'}:</label>
              <textarea
                value={rejectReportModal.note}
                onChange={(e) => setRejectReportModal({ ...rejectReportModal, note: e.target.value })}
                placeholder={t('reject_modal_placeholder') || 'เช่น ตรวจสอบแล้วไม่พบการละเมิดกฎ, ข้อมูลไม่เพียงพอ...'}
                className="w-full p-4 border border-slate-300 rounded-xl min-h-[100px] focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none text-slate-700 text-sm"
              ></textarea>
            </div>

            <div className="flex gap-3 w-full">
              <button onClick={confirmRejectReport} className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors shadow-sm cursor-pointer">
                {t('save_rejection') || 'บันทึกการปฏิเสธ'}
              </button>
              <button onClick={() => setRejectReportModal({ isOpen: false, id: '', title: '', note: '' })} className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer">
                {t('cancel') || 'ยกเลิก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#1e3a8a" className="w-12 h-12">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h1 className="pt-1.5 text-2xl lg:text-4xl font-bold text-[#1e3a8a]">{t('dashboard')}</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-slate-400 text-lg font-medium mb-2">{t('pendingRequests')}</p>
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#eab308" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
            <span className="pt-2.5 text-4xl font-bold text-[#1e3a8a]">
              {isLoading ? '...' : stats.pending}
            </span>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-slate-400 text-lg font-medium mb-2">{t('reports_overall')}</p>
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#ef4444" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
            <span className="pt-2.5 text-4xl font-bold text-[#1e3a8a]">
              {isLoading ? '...' : stats.reports}
            </span>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-slate-400 text-lg font-medium mb-2">{t('totalUsers')}</p>
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="#10b981" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
            <span className="pt-2.5 text-4xl font-bold text-[#1e3a8a]">
              {isLoading ? '...' : stats.users}
            </span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <h2 className="text-xl font-bold text-[#1e3a8a] mb-4">{t('recentPendingRequests') || 'รายการที่รอตรวจสอบล่าสุด'}</h2>
      
      <div className="w-full border border-slate-200 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm sm:text-base whitespace-nowrap">
            <thead className="bg-slate-200 text-slate-600 font-semibold">
              <tr className="group">
                <th className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-slate-300 transition-colors" onClick={() => handleSort('type')}>
                  <div className="flex items-center">
                    {t('type') || 'ประเภท'} <SortIcon columnKey="type" />
                  </div>
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 cursor-default">
                  {t('status') || 'สถานะ'}
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-slate-300 transition-colors" onClick={() => handleSort('title')}>
                  <div className="flex items-center">
                    {t('titleSubject') || 'หัวข้อ'} <SortIcon columnKey="title" />
                  </div>
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-slate-300 transition-colors" onClick={() => handleSort('author')}>
                  <div className="flex items-center">
                    {t('submittedBy') || 'สร้างโดย'} <SortIcon columnKey="author" />
                  </div>
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 cursor-pointer hover:bg-slate-300 transition-colors" onClick={() => handleSort('raw_date')}>
                  <div className="flex items-center">
                    {t('date') || 'วันที่'} <SortIcon columnKey="raw_date" />
                  </div>
                </th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-center cursor-default">{t('view') || 'รายละเอียด'}</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 text-center cursor-default">{t('action') || 'จัดการ'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr><td colSpan={7} className="px-4 py-6 sm:px-6 sm:py-8 text-center text-slate-500 font-medium">{t('loading') || 'กำลังโหลดข้อมูล...'}</td></tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((req) => {
                  
                  const isAuthorCoAdmin = req.author_role === 'co_admin';
                  const isViewerAdmin = currentUserRole === 'admin' || currentUserRole === 'developer';
                  const canAction = !isAuthorCoAdmin || isViewerAdmin;

                  return (
                    <tr key={req.id} className="hover:bg-slate-50 transition-colors text-slate-800 font-medium">
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        {renderTypeBadge(req.type)}
                      </td>
                      
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        {renderStatusBadge(req.status)}
                      </td>
                      
                      <td className="px-4 py-3 sm:px-6 sm:py-4 text-[#1e3a8a] truncate max-w-[150px] sm:max-w-none" title={req.title}>{req.title}</td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4">{req.author}</td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4">{req.date}</td>
                      
                      <td className="px-4 py-3 sm:px-6 sm:py-4 text-center">
                        <button 
                            onClick={() => handleView(req)}
                            className="bg-[#DBEAFE] p-1.5 sm:p-2 rounded-md text-[#1E3A8A] hover:bg-blue-200 transition-colors cursor-pointer" 
                            title="View Details"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                              <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                              <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                      </td>
                      
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        <div className="flex items-center justify-center gap-2">
                          {canAction ? (
                            <>
                              <button 
                                onClick={() => req.type === 'Report' 
                                  ? openResolveReportModal(req.original_id, req.title)
                                  : openApproveModal(req.type, req.original_id, req.title)
                                }
                                className="bg-emerald-500 p-1.5 sm:p-2 rounded-md text-white hover:bg-emerald-600 transition-colors cursor-pointer"
                                title={t('approve') || 'อนุมัติ/แก้ไข'}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
                              </button>

                              <button 
                                onClick={() => req.type === 'Report'
                                  ? openRejectReportModal(req.original_id, req.title)
                                  : openRejectModal(req.type, req.original_id, req.title)
                                }
                                className="bg-red-500 p-1.5 sm:p-2 rounded-md text-white hover:bg-red-600 transition-colors cursor-pointer"
                                title={t('reject') || 'ปฏิเสธ'}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                              </button>
                            </>
                          ) : (
                            <span className="text-slate-400 text-xs italic">{t('only_admin_can_perform_this_action') || 'เฉพาะผู้ดูแลระบบ'}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan={7} className="px-4 py-6 sm:px-6 sm:py-8 text-center text-slate-500 font-medium">{t('no_pending_requests') || 'ไม่มีรายการรอตรวจสอบ'}</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ส่วนของ Pagination UI */}
        {!isLoading && totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-slate-200 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="hidden sm:block">
              <p className="text-sm text-slate-700">
                {t('showing')} <span className="font-medium">{indexOfFirstItem + 1}</span> {t('to')} <span className="font-medium">{Math.min(indexOfLastItem, sortedRequests.length)}</span> {t('from')} <span className="font-medium">{sortedRequests.length}</span> {t('list')}
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
                {t('page')} {currentPage} / {totalPages}
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

export default DashboardOverview;