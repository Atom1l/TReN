/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabaseClient';

import EditProfileModal from '../components/EditProfileModal';
import ShowcasePreviewModal from '../components/ShowcasePreviewModal';
import EventPreviewModal from '../components/EventPreviewModal';
import ResourcePreviewModal from '../components/ResourcePreviewModal'; // 🟢 เพิ่มการ Import Modal ของ Resource

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  school_name: string; 
  province: string;
  position: string;  
  rank: string;   
  email: string;  
  bio: string;
  role: string;
  profilepic?: string;
}

interface ContentItem {
  id: string;
  title: string;
  created_at: string;
  status: string;
  type: 'blog' | 'showcase' | 'event' | 'resource'; // 🟢 เพิ่ม type resource
  rejection_reason?: string;
  thumbnail_url?: string;
  schedule_status?: string; 
  [key: string]: any; 
}

const Profile = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const { id: paramId } = useParams();

  const [activeTab, setActiveTab] = useState<'published' | 'in_progress'>('published');
  const [isFabOpen, setIsFabOpen] = useState(false);
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isOwnProfile, setIsOwnProfile] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [isBlogsOpen, setIsBlogsOpen] = useState(true);
  const [isEventsOpen, setIsEventsOpen] = useState(true);
  const [isShowcasesOpen, setIsShowcasesOpen] = useState(true);
  const [isResourcesOpen, setIsResourcesOpen] = useState(true); // 🟢 เพิ่ม State สำหรับเปิดปิดแถบ Resource

  const [reasonModal, setReasonModal] = useState({ isOpen: false, text: '' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: '', type: '', title: '' });

  const [alertModal, setAlertModal] = useState({ isOpen: false, type: 'success', message: '' });

  const [previewShowcase, setPreviewShowcase] = useState<{ isOpen: boolean; showcase: any }>({ 
    isOpen: false, 
    showcase: null 
  });

  const [previewEvent, setPreviewEvent] = useState<{ isOpen: boolean; event: any }>({ 
    isOpen: false, 
    event: null 
  });

  // 🟢 เพิ่ม State สำหรับ Preview Resource
  const [previewResource, setPreviewResource] = useState<{ isOpen: boolean; resource: any }>({ 
    isOpen: false, 
    resource: null 
  });

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlertModal({ isOpen: true, type, message });
    setTimeout(() => {
      setAlertModal({ isOpen: false, type: 'success', message: '' });
    }, 2000);
  };

  const fetchProfileAndContents = async () => {
    setIsLoading(true);
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      const targetUserId = paramId || authUser?.id;
      
      if (!targetUserId) {
        setIsLoading(false);
        return;
      }

      const isOwn = !paramId || (authUser ? paramId === authUser.id : false);
      setIsOwnProfile(isOwn);

      const { data: profileData, error: profileError } = await supabase
        .from('user')
        .select('id, first_name, last_name, school_name, province, position, rank, email, bio, role, profilepic')
        .eq('id', targetUserId)
        .single();

      if (profileError) console.error("Error fetching profile:", profileError);
      
      if (profileData) {
        setUser({
          ...profileData,
          email: isOwn ? (profileData.email || authUser?.email) : 'Hidden' 
        } as UserProfile);
      }

      let showcasesQuery1 = supabase.from('showcases').select('*').eq('author_id', targetUserId);
      let showcasesQuery2 = supabase.from('showcases').select('*').contains('author_data', JSON.stringify([{ id: targetUserId }]));
      
      let blogsQuery = supabase.from('blogs').select('id, title, created_at, status, rejection_reason, thumbnail_url').eq('author_id', targetUserId);
      let eventsQuery = supabase.from('events').select('*').eq('created_by', targetUserId);
      
      // 🟢 เพิ่ม Query สำหรับดึง Resource
      let resourcesQuery = supabase.from('resources').select('*').eq('author_id', targetUserId);

      if (!isOwn) {
        blogsQuery = blogsQuery.eq('status', 'published');
        showcasesQuery1 = showcasesQuery1.eq('status', 'published');
        showcasesQuery2 = showcasesQuery2.eq('status', 'published');
        eventsQuery = eventsQuery.eq('event_state', 'published');
        resourcesQuery = resourcesQuery.eq('status', 'published');
      }

      const [
        { data: blogsData, error: blogsError },
        { data: showcasesData1, error: showcasesError1 },
        { data: showcasesData2, error: showcasesError2 },
        { data: eventsData, error: eventsError },
        { data: resourcesData, error: resourcesError } // 🟢 รับค่า Resource Data
      ] = await Promise.all([blogsQuery, showcasesQuery1, showcasesQuery2, eventsQuery, resourcesQuery]);

      if (blogsError) console.error("Error fetching blogs:", blogsError);
      if (showcasesError1) console.error("Error fetching showcases 1:", showcasesError1);
      if (showcasesError2) console.error("Error fetching showcases 2:", showcasesError2);
      if (eventsError) console.error("Error fetching events:", eventsError);
      if (resourcesError) console.error("Error fetching resources:", resourcesError);

      const combinedContents: ContentItem[] = [];
      
      if (blogsData) combinedContents.push(...blogsData.map((b: any) => ({ ...b, type: 'blog' as const })));
      
      const rawShowcases = [...(showcasesData1 || []), ...(showcasesData2 || [])];
      const uniqueShowcases = Array.from(new Map(rawShowcases.map(item => [item.id, item])).values());
      
      if (uniqueShowcases.length > 0) {
        combinedContents.push(...uniqueShowcases.map((s: any) => ({ ...s, type: 'showcase' as const })));
      }

      if (isOwn && eventsData) {
        combinedContents.push(...eventsData.map((e: any) => ({ 
            ...e,
            id: e.id, 
            title: e.title, 
            created_at: e.created_at, 
            status: e.event_state, 
            schedule_status: e.status,
            type: 'event' as const 
        })));
      }

      // 🟢 เพิ่มข้อมูล Resource ลงใน combinedContents (เฉพาะเจ้าของเท่านั้นที่จะถูกนำมาแสดง)
      if (isOwn && resourcesData) {
        combinedContents.push(...resourcesData.map((r: any) => ({
            ...r,
            id: r.id,
            title: r.title,
            created_at: r.created_at,
            status: r.status,
            type: 'resource' as const
        })));
      }

      combinedContents.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setContents(combinedContents);

    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const translateStatus = (status: string) => {
    const s = (status || '').toLowerCase().trim();
    if (s === 'pending') return t('state_pending') || 'รอตรวจสอบ (Pending)';
    if (s === 'published') return t('state_published') || 'เผยแพร่แล้ว (Published)';
    if (s === 'rejected') return t('state_rejected') || 'ไม่อนุมัติ (Rejected)';
    if (s === 'in_progress') return t('status_in_progress') || 'กำลังดำเนินการ (In Progress)';
    if (s === 'draft') return t('save_draft') || 'แบบร่าง (Draft)';
    return status;
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    fetchProfileAndContents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramId]); 

  const getInitials = (first?: string, last?: string) => {
    return `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const locale = language === 'th' ? 'th-TH' : 'en-GB';
    return new Date(dateString).toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const filteredContents = isOwnProfile ? contents.filter(item => {
    const currentStatus = (item.status || '').toLowerCase().trim();
    if (activeTab === 'published') {
      return currentStatus === 'published';
    } else {
      return currentStatus !== 'published';
    }
  }) : contents;

  const blogs = filteredContents.filter(c => c.type === 'blog');
  const showcases = filteredContents.filter(c => c.type === 'showcase');
  const eventsList = filteredContents.filter(c => c.type === 'event'); 
  const resourcesList = filteredContents.filter(c => c.type === 'resource'); // 🟢 จัดกลุ่ม Resources

  const allowedRoles = ['admin', 'co_admin', 'developer'];
  const canCreateSpecialContent = isOwnProfile && user && allowedRoles.includes((user.role || '').toLowerCase());

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      let tableName = '';
      if (deleteModal.type === 'blog') tableName = 'blogs';
      if (deleteModal.type === 'event') tableName = 'events';
      if (deleteModal.type === 'showcase') tableName = 'showcases';
      if (deleteModal.type === 'resource') tableName = 'resources'; // 🟢 เพิ่มเคสลบตาราง resource

      const itemToDelete = contents.find(item => item.id === deleteModal.id);

      // โค้ดส่วนนี้จะจัดการลบรูปใน storage thumbnails ให้เลย ครอบคลุมทั้ง blog, event, showcase และ resource
      if (itemToDelete?.thumbnail_url) {
        const urlParts = itemToDelete.thumbnail_url.split('/public/thumbnails/');
        if (urlParts.length > 1) {
          const filePath = urlParts[1]; 
          const { error: storageError } = await supabase.storage.from('thumbnails').remove([filePath]);
          if (storageError) console.error(`Error deleting image:`, storageError);
        }
      }

      const { error } = await supabase.from(tableName).delete().eq('id', deleteModal.id);
      if (error) throw error;

      setContents(prev => prev.filter(item => item.id !== deleteModal.id));
      setDeleteModal({ isOpen: false, id: '', type: '', title: '' });
      
      showAlert('success', t('delete_success') || 'ลบข้อมูลเรียบร้อยแล้ว');
      
    } catch (error: any) {
      console.error("Error deleting content:", error);
      showAlert('error', error.message || 'เกิดข้อผิดพลาดในการลบข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && contents.length === 0) {
    return (
      <div className="flex-1 bg-[#F8FAFC] min-h-screen flex items-center justify-center">
        <div className="text-[#1e3a8a] text-xl font-bold animate-pulse">{t('loading_profile') || 'กำลังโหลดข้อมูล...'}</div>
      </div>
    );
  }

  if (!user && !isLoading) {
    return (
      <div className="flex-1 bg-[#F8FAFC] min-h-screen flex items-center justify-center flex-col">
        <h2 className="text-2xl font-bold text-slate-700 mb-2">ไม่พบโปรไฟล์นี้</h2>
        <button onClick={() => navigate(-1)} className="text-[#1e3a8a] hover:underline">ย้อนกลับ</button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#F8FAFC] min-h-screen pb-24 relative">
      
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center max-w-sm w-full animate-scale-in">
            {alertModal.type === 'success' ? (
              <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-5 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
              </div>
            ) : (
              <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-5 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 6M6 6l12 12" /></svg>
              </div>
            )}
            <p className="text-slate-600 font-bold text-lg">{alertModal.message}</p>
          </div>
        </div>
      )}

      {reasonModal.isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col w-full max-w-sm animate-scale-in">
            <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              {t('rejection_reason') || 'เหตุผลที่ถูกปฏิเสธ'}
            </h3>
            <div className="bg-red-50 text-red-800 p-4 rounded-xl mb-6 text-sm leading-relaxed whitespace-pre-wrap">
              {reasonModal.text}
            </div>
            <button 
              onClick={() => setReasonModal({ isOpen: false, text: '' })}
              className="w-full bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
            >
              {t('close') || 'ปิด'}
            </button>
          </div>
        </div>
      )}

      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col w-full max-w-sm animate-scale-in text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm mb-6">
              {t('are_you_sure_you_want_to_delete')}<br/> <strong>"{deleteModal.title}"</strong>?<br/> {t('this_action_cannot_be_undone') || 'การกระทำนี้ไม่สามารถย้อนกลับได้'}
            </p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={handleConfirmDelete}
                className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors shadow-sm flex items-center justify-center cursor-pointer"
              >
                {isLoading ? (t('deleting') || 'กำลังลบ...') : (t('delete') || 'ลบเลย')}
              </button>
              <button 
                onClick={() => setDeleteModal({ isOpen: false, id: '', type: '', title: '' })}
                className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
              >
                {t('cancel') || 'ยกเลิก'}
              </button> 
            </div>
          </div>
        </div>
      )}

      <div className="h-32 sm:h-48 w-full bg-slate-600"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative">
        <div className="absolute -top-16 sm:-top-20">
          <div className="w-32 h-32 sm:w-40 sm:h-40 bg-[#1e3a8a] rounded-full border-4 border-[#F8FAFC] shadow-md flex items-center justify-center text-white text-5xl sm:text-6xl font-bold overflow-hidden">
            {user?.profilepic ? (
              <img src={user.profilepic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              getInitials(user?.first_name)
            )}
          </div>
        </div>

        <div className="pt-0 sm:pt-24 flex flex-col sm:flex-row justify-between items-start gap-4 relative z-10">
          <div className="pt-20 pr-24 flex flex-col gap-2 sm:pt-0 sm:pr-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1e3a8a]">
              {user?.first_name || 'Unknown'} {user?.last_name || ''}
            </h1>
            <p className="text-slate-500 text-base sm:text-lg max-w-2xl">
              {user?.bio || 'ยังไม่มีการเพิ่มคำอธิบายตัวเอง (Bio)'}
            </p>
          </div>

          {isOwnProfile && (
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="bg-[#1e3a8a] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-900 transition-colors shadow-sm text-sm md:text-lg font-medium flex-shrink-0 cursor-pointer absolute right-0 top-6"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M2.695 14.763l-1.262 3.155a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
              </svg>
              {t('edit_profile') || 'Edit profile'}
            </button>
          )}
        </div>

        {isOwnProfile ? (
          <div className="flex gap-3 sm:gap-4 mt-10 border-b border-slate-200 pb-5 overflow-x-auto custom-scrollbar">
            <button 
              onClick={() => setActiveTab('published')}
              className={`px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'published' ? 'bg-[#1e3a8a] text-white shadow-sm' : 'border border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {t('published') || 'Published'}
            </button>
            <button 
              onClick={() => setActiveTab('in_progress')}
              className={`px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'in_progress' ? 'bg-[#1e3a8a] text-white shadow-sm' : 'border border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {t('in_progress') || 'In Process'}
            </button>
          </div>
        ) : (
          <div className="mt-10 border-b border-slate-200 pb-4">
             <h2 className="text-xl font-bold text-slate-700">ผลงานทั้งหมดที่เผยแพร่</h2>
          </div>
        )}

        <div className="mt-8 space-y-10">
          
          {/* ================= Section: Blogs ================= */}
          {blogs.length > 0 && (
            <div>
              <div 
                className="flex items-center gap-4 mb-4 cursor-pointer group"
                onClick={() => setIsBlogsOpen(!isBlogsOpen)}
              >
                <h2 className="text-[#1e3a8a] font-bold text-xl group-hover:text-blue-900 transition-colors">{t('blogs') || 'Blogs'} ({blogs.length})</h2>
                <hr className="flex-1 border-slate-200" />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isBlogsOpen ? 'rotate-180' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
              
              <div className={`grid transition-all duration-500 ease-in-out ${isBlogsOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <div className="space-y-4 pb-2 pt-1">
                    {blogs.map(blog => (
                      <div key={blog.id} className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                        <div 
                          className="flex items-start gap-4 cursor-pointer flex-1"
                          onClick={() => navigate(`/blog/${blog.id}`)}
                        >
                          <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${blog.status === 'published' ? 'bg-emerald-500' : blog.status === 'rejected' ? 'bg-red-500' : blog.status === 'draft' ? 'bg-slate-400' : 'bg-yellow-500'}`}></div>
                          <div>
                            <h3 className="text-[#1e3a8a] font-bold text-lg hover:underline line-clamp-2">{blog.title}</h3>
                            <p className="text-slate-500 text-sm mt-0.5">
                              {formatDate(blog.created_at)} 
                              {isOwnProfile && ` | ${translateStatus(blog.status)}`}
                            </p>
                          </div>
                        </div>

                        {isOwnProfile && (
                          <div className="flex items-center justify-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                            {blog.status === 'rejected' && (
                              <button 
                                onClick={() => setReasonModal({ isOpen: true, text: blog.rejection_reason || 'ไม่มีการระบุเหตุผล' })}
                                className="text-red-600 bg-red-50 font-semibold px-4 py-2 hover:bg-red-100 rounded-lg transition-colors text-sm whitespace-nowrap cursor-pointer"
                              >
                                {t('view_rejection_reason') || 'ดูเหตุผล'}
                              </button>
                            )}
                            <button 
                              onClick={() => navigate(`/edit/blog/${blog.id}`)}
                              className="text-[#1e3a8a] bg-blue-50 font-semibold px-4 py-2 hover:bg-blue-100 rounded-lg transition-colors text-sm whitespace-nowrap cursor-pointer"
                            >
                              {t('edit') || 'แก้ไข'}
                            </button>
                            <button 
                              onClick={() => setDeleteModal({ isOpen: true, id: blog.id, type: 'blog', title: blog.title })}
                              className="text-slate-500 bg-slate-50 font-semibold px-4 py-2 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors text-sm whitespace-nowrap cursor-pointer"
                            >
                              {t('delete') || 'ลบ'}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= Section: Events ================= */}
          {isOwnProfile && eventsList.length > 0 && (
            <div>
              <div 
                className="flex items-center gap-4 mb-4 cursor-pointer group"
                onClick={() => setIsEventsOpen(!isEventsOpen)}
              >
                <h2 className="text-[#1e3a8a] font-bold text-xl group-hover:text-blue-900 transition-colors">{t('events') || 'Events'} ({eventsList.length})</h2>
                <hr className="flex-1 border-slate-200" />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isEventsOpen ? 'rotate-180' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
              
              <div className={`grid transition-all duration-500 ease-in-out ${isEventsOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <div className="space-y-4 pb-2 pt-1">
                    {eventsList.map(ev => (
                      <div key={ev.id} className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                        
                        <div 
                          className="flex items-start gap-4 cursor-pointer flex-1"
                          onClick={() => {
                            const sStatus = (ev.schedule_status || '').toLowerCase();
                            if (sStatus === 'upcoming' || sStatus === 'pending') {
                              setPreviewEvent({ isOpen: true, event: ev });
                            } else {
                              navigate(`/event/${ev.id}`);
                            }
                          }}
                        >
                          <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${ev.status === 'published' ? 'bg-emerald-500' : ev.status === 'rejected' ? 'bg-red-500' : ev.status === 'draft' ? 'bg-slate-400' : 'bg-yellow-500'}`}></div>
                          <div>
                            <h3 className="text-[#1e3a8a] font-bold text-lg hover:underline line-clamp-2">{ev.title}</h3>
                            <p className="text-slate-500 text-sm mt-0.5">
                              {formatDate(ev.created_at)} 
                              {isOwnProfile && ` | ${translateStatus(ev.status)}`}
                            </p>
                          </div>
                        </div>

                        {isOwnProfile && (
                          <div className="flex items-center justify-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                            <button 
                              onClick={() => navigate(`/edit/event/${ev.id}`)}
                              className="text-[#1e3a8a] bg-blue-50 font-semibold px-4 py-2 hover:bg-blue-100 rounded-lg transition-colors text-sm whitespace-nowrap cursor-pointer"
                            >
                              {t('edit') || 'แก้ไข'}
                            </button>
                            <button 
                              onClick={() => setDeleteModal({ isOpen: true, id: ev.id, type: 'event', title: ev.title })}
                              className="text-slate-500 bg-slate-50 font-semibold px-4 py-2 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors text-sm whitespace-nowrap cursor-pointer"
                            >
                              {t('delete') || 'ลบ'}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= Section: Showcases ================= */}
          {showcases.length > 0 && (
            <div>
              <div 
                className="flex items-center gap-4 mb-4 cursor-pointer group"
                onClick={() => setIsShowcasesOpen(!isShowcasesOpen)}
              >
                <h2 className="text-[#1e3a8a] font-bold text-xl group-hover:text-blue-900 transition-colors">{t('showcases') || 'Showcases'} ({showcases.length})</h2>
                <hr className="flex-1 border-slate-200" />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isShowcasesOpen ? 'rotate-180' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>

              <div className={`grid transition-all duration-500 ease-in-out ${isShowcasesOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <div className="space-y-4 pb-2 pt-1">
                    {showcases.map(sc => (
                      <div key={sc.id} className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                        
                        <div 
                          className="flex items-start gap-4 cursor-pointer flex-1"
                          onClick={() => setPreviewShowcase({ isOpen: true, showcase: sc })}
                        >
                          <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${sc.status === 'published' ? 'bg-emerald-500' : sc.status === 'rejected' ? 'bg-red-500' : sc.status === 'draft' ? 'bg-slate-400' : 'bg-yellow-500'}`}></div>
                          <div>
                            <h3 className="text-[#1e3a8a] font-bold text-lg hover:underline line-clamp-2">{sc.title}</h3>
                            <p className="text-slate-500 text-sm mt-0.5">
                              {formatDate(sc.created_at)}
                              {isOwnProfile && ` | ${translateStatus(sc.status)}`}
                            </p>
                          </div>
                        </div>

                        {isOwnProfile && (
                          <div className="flex items-center justify-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                            {sc.status === 'rejected' && (
                              <button 
                                onClick={() => setReasonModal({ isOpen: true, text: sc.rejection_reason || 'ไม่มีการระบุเหตุผล' })}
                                className="text-red-600 bg-red-50 font-semibold px-4 py-2 hover:bg-red-100 rounded-lg transition-colors text-sm whitespace-nowrap cursor-pointer"
                              >
                                {t('view_rejection_reason') || 'ดูเหตุผล'}
                              </button>
                            )}
                            <button 
                              onClick={() => navigate(`/edit/showcase/${sc.id}`)}
                              className="text-[#1e3a8a] bg-blue-50 font-semibold px-4 py-2 hover:bg-blue-100 rounded-lg transition-colors text-sm whitespace-nowrap cursor-pointer"
                            >
                              {t('edit') || 'แก้ไข'}
                            </button>
                            <button 
                              onClick={() => setDeleteModal({ isOpen: true, id: sc.id, type: 'showcase', title: sc.title })}
                              className="text-slate-500 bg-slate-50 font-semibold px-4 py-2 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors text-sm whitespace-nowrap cursor-pointer"
                            >
                              {t('delete') || 'ลบ'}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 🟢 ================= Section: Resources ================= */}
          {isOwnProfile && resourcesList.length > 0 && (
            <div>
              <div 
                className="flex items-center gap-4 mb-4 cursor-pointer group"
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
              >
                <h2 className="text-[#1e3a8a] font-bold text-xl group-hover:text-blue-900 transition-colors">{t('resources') || 'Resources'} ({resourcesList.length})</h2>
                <hr className="flex-1 border-slate-200" />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isResourcesOpen ? 'rotate-180' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>

              <div className={`grid transition-all duration-500 ease-in-out ${isResourcesOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <div className="space-y-4 pb-2 pt-1">
                    {resourcesList.map(res => (
                      <div key={res.id} className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                        
                        <div 
                          className="flex items-start gap-4 cursor-pointer flex-1"
                          onClick={() => setPreviewResource({ isOpen: true, resource: res })}
                        >
                          <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${res.status === 'published' ? 'bg-emerald-500' : res.status === 'rejected' ? 'bg-red-500' : res.status === 'draft' ? 'bg-slate-400' : 'bg-yellow-500'}`}></div>
                          <div>
                            <h3 className="text-[#1e3a8a] font-bold text-lg hover:underline line-clamp-2">{res.title}</h3>
                            <p className="text-slate-500 text-sm mt-0.5">
                              {formatDate(res.created_at)}
                              {isOwnProfile && ` | ${translateStatus(res.status)}`}
                            </p>
                          </div>
                        </div>

                        {isOwnProfile && (
                          <div className="flex items-center justify-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                            {res.status === 'rejected' && (
                              <button 
                                onClick={() => setReasonModal({ isOpen: true, text: res.rejection_reason || 'ไม่มีการระบุเหตุผล' })}
                                className="text-red-600 bg-red-50 font-semibold px-4 py-2 hover:bg-red-100 rounded-lg transition-colors text-sm whitespace-nowrap cursor-pointer"
                              >
                                {t('view_rejection_reason') || 'ดูเหตุผล'}
                              </button>
                            )}
                            <button 
                              onClick={() => navigate(`/edit/resource/${res.id}`)}
                              className="text-[#1e3a8a] bg-blue-50 font-semibold px-4 py-2 hover:bg-blue-100 rounded-lg transition-colors text-sm whitespace-nowrap cursor-pointer"
                            >
                              {t('edit') || 'แก้ไข'}
                            </button>
                            <button 
                              onClick={() => setDeleteModal({ isOpen: true, id: res.id, type: 'resource', title: res.title })}
                              className="text-slate-500 bg-slate-50 font-semibold px-4 py-2 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors text-sm whitespace-nowrap cursor-pointer"
                            >
                              {t('delete') || 'ลบ'}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {filteredContents.length === 0 && (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-slate-300 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <h3 className="text-xl font-bold text-slate-700 mb-1">
                {isOwnProfile 
                  ? (activeTab === 'published' ? (t('no_contents_desc') || 'ยังไม่มีผลงานที่เผยแพร่') : (t('no_pending_contents_desc') || 'ยังไม่มีผลงานที่อยู่ระหว่างดำเนินการ'))
                  : 'ยังไม่มีผลงานที่เผยแพร่'
                }
              </h3>
            </div>
          )}

        </div>
      </div>

      {isOwnProfile && (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
          {isFabOpen && (
            <div className="bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.1)] border border-slate-100 p-2 flex flex-col w-56 animate-fade-in-up">
              <button onClick={() => { setIsFabOpen(false); navigate('/create/blog'); }} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl text-left text-slate-700 font-medium transition-colors cursor-pointer">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-[#1e3a8a] flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                </span>
                {t('create_blog') || 'สร้างบล็อก'}
              </button>
              {canCreateSpecialContent && (
                <>
                  <button onClick={() => { setIsFabOpen(false); navigate('/create/showcase'); }} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl text-left text-slate-700 font-medium transition-colors cursor-pointer">
                    <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </span>
                    {t('create_showcase') || 'สร้างผลงาน'}
                  </button>
                  <button onClick={() => { setIsFabOpen(false); navigate('/create/event'); }} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl text-left text-slate-700 font-medium transition-colors cursor-pointer">
                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" /></svg>
                    </span>
                    {t('create_event') || 'สร้างกิจกรรม'}
                  </button>
                </>
              )}
            </div>
          )}

          <button 
            onClick={() => setIsFabOpen(!isFabOpen)}
            className={`w-16 h-16 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center shadow-[0_8px_16px_rgba(30,58,138,0.3)] hover:bg-blue-900 transition-all duration-300 transform cursor-pointer ${isFabOpen ? 'rotate-45' : 'hover:scale-105'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      )}

      {/* ฝัง Component Modal ไว้สำหรับเรียกใช้งาน */}
      <ShowcasePreviewModal 
        isOpen={previewShowcase.isOpen} 
        showcase={previewShowcase.showcase} 
        onClose={() => setPreviewShowcase({ isOpen: false, showcase: null })} 
      />

      <EventPreviewModal 
        isOpen={previewEvent.isOpen} 
        event={previewEvent.event} 
        onClose={() => setPreviewEvent({ isOpen: false, event: null })} 
      />

      {/* 🟢 ฝัง ResourcePreviewModal */}
      <ResourcePreviewModal 
        isOpen={previewResource.isOpen} 
        resource={previewResource.resource} 
        onClose={() => setPreviewResource({ isOpen: false, resource: null })} 
      />

      {user && isOwnProfile && (
        <EditProfileModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          userData={user} 
          onSaveSuccess={fetchProfileAndContents} 
        />
      )}

    </div>
  );
};

export default Profile;