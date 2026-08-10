/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { supabase } from '../lib/supabaseClient';

const CreateNews = () => {
  const navigate = useNavigate();
  
  const { t, language } = useLanguage();
  const { id } = useParams();
  const isEditMode = !!id;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(''); // 🟢 State สำหรับหมวดหมู่ข่าว
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<'draft' | 'publish' | null>(null);

  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    type: 'success', 
    message: ''
  });

  const showAlert = (type: 'success' | 'error', message: string, onConfirm?: () => void) => {
    setAlertModal({
      isOpen: true,
      type,
      message
    });

    setTimeout(() => {
      setAlertModal(prev => ({ ...prev, isOpen: false }));
      if (onConfirm) {
        onConfirm();
      }
    }, type === 'success' ? 1500 : 3000);
  };

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike', { 'color': [] }, 'link', { 'list': 'ordered'}, { 'list': 'bullet' }],
    ],
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (isEditMode) {
      const fetchNewsData = async () => {
        setIsLoading(true);
        try {
          const { data: { user }, error: authError } = await supabase.auth.getUser();
          if (authError || !user) {
            showAlert('error', t('require_login') || 'กรุณาเข้าสู่ระบบก่อน', () => navigate('/'));
            return;
          }

          const { data: userData } = await supabase.from('user').select('role').eq('id', user.id).single();
          const userRole = userData?.role?.toLowerCase() || 'user';

          // 🟢 ดึงข้อมูลจากตาราง news
          const { data, error } = await supabase
            .from('news')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          
          if (data) {
            const isOwner = data.author_id === user.id;
            const isPrivileged = ['admin', 'co_admin', 'developer'].includes(userRole);

            if (!isOwner && !isPrivileged) {
              showAlert('error', t('no_permission') || 'คุณไม่มีสิทธิ์เข้าถึงหรือแก้ไขข่าวนี้', () => navigate('/news'));
              return;
            }

            // นำข้อมูลมาใส่ฟอร์ม
            setTitle(data.title || '');
            setContent(data.content || '');
            setCategory(data.category || '');
            
            if (data.thumbnail_url) {
              setPreviewUrl(data.thumbnail_url);
            }
          }
        } catch (error) {
          console.error("Error fetching news for edit:", error);
          showAlert('error', 'ไม่สามารถดึงข้อมูลข่าวสารมาแก้ไขได้', () => navigate('/news'));
        } finally {
          setIsLoading(false);
        }
      };

      fetchNewsData();
    } else {
      const checkLogin = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          showAlert('error', t('require_login') || 'กรุณาเข้าสู่ระบบก่อน', () => navigate('/'));
        }
      };
      checkLogin();
    }
  }, [id, isEditMode, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        showAlert('error', t('invalid_file_type') || 'ประเภทไฟล์ไม่ถูกต้อง กรุณาเลือกไฟล์ภาพ');
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (isDraft: boolean) => {
    if (!title.trim()) {
      showAlert('error', "กรุณาใส่หัวข้อข่าวสาร");
      return;
    }
    
    // 🟢 บังคับให้ต้องเลือกหมวดหมู่ข่าวก่อน
    if (!category.trim()) {
      showAlert('error', "กรุณาเลือกหมวดหมู่ข่าวสาร");
      return;
    }

    setIsLoading(true);
    setLoadingAction(isDraft ? 'draft' : 'publish');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("กรุณาเข้าสู่ระบบ");

      const { data: userData } = await supabase.from('user').select('role').eq('id', user.id).single();
      const userRole = userData?.role?.toLowerCase() || 'user';

      let thumbnailUrl = isEditMode ? previewUrl : null;

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `news-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('thumbnails').upload(fileName, selectedFile);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage.from('thumbnails').getPublicUrl(fileName);
        thumbnailUrl = publicUrl;
      }

      let newsStatus = 'draft'; 
      if (!isDraft) {
        if (userRole === 'admin' || userRole === 'developer') {
          newsStatus = 'published'; 
        } else {
          newsStatus = 'pending'; 
        }
      }

      // 🟢 บันทึกข้อมูลลงตาราง news
      const newsDataToSave = {
        title: title,
        content: content,
        thumbnail_url: thumbnailUrl,
        category: category, // เก็บค่าหมวดหมู่ข่าว
        author_id: user.id,
        status: newsStatus,
      };

      if (isEditMode) {
        const { error } = await supabase.from('news').update(newsDataToSave).eq('id', id);
        if (error) throw error;
        
        let msg = t('msg_edit_pending') || "ส่งข้อมูลที่แก้ไขเรียบร้อยแล้ว!";
        if (isDraft) msg = t('msg_edit_draft') || "อัปเดตแบบร่างสำเร็จ!";
        else if (newsStatus === 'published') msg = t('msg_edit_published') || "บันทึกและเผยแพร่เรียบร้อยแล้ว!";
        
        showAlert('success', msg, () => {
          navigate('/profile');
        });

      } else {
        const { error } = await supabase.from('news').insert([newsDataToSave]);
        if (error) throw error;
        
        let msg = t('msg_create_pending') || "ส่งข่าวสารเรียบร้อยแล้ว รอการอนุมัติ!";
        if (isDraft) msg = t('msg_create_draft') || "บันทึกแบบร่างสำเร็จ!";
        else if (newsStatus === 'published') msg = t('msg_create_published') || "เผยแพร่ข่าวสารเรียบร้อยแล้ว!";
        
        showAlert('success', msg, () => {
          navigate('/profile');
        });
      }

    } catch (error: any) {
      console.error(error);
      showAlert('error', error.message || t('error') || "เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
      setLoadingAction(null); 
    }
  };

  const renderAlertModal = () => {
    if (!alertModal.isOpen) return null;
    return (
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
          <p className="text-slate-600 text-lg font-bold">{alertModal.message}</p>
        </div>
      </div>
    );
  };

  if (isLoading && isEditMode && !title && !loadingAction) {
    return <div className="min-h-screen flex items-center justify-center text-[#1e3a8a] font-bold text-xl animate-pulse">{t('loading_news_editor') || 'กำลังโหลดเครื่องมือเขียนข่าว...'}</div>;
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      {renderAlertModal()}
      
      {/* 🟢 Top Navbar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-full mx-auto px-4 sm:px-16 py-10 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate('/profile')}
            className="text-slate-500 hover:text-slate-700 font-medium flex items-center gap-2 cursor-pointer"
          >
            &lt; {t('back_to_dashboard') || 'ย้อนกลับไปยังแดชบอร์ด'}
          </button>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleSave(true)}
              disabled={isLoading}
              className="px-6 py-2 bg-white border border-[#1e3a8a] text-[#1e3a8a] rounded-md font-medium hover:bg-slate-50 disabled:opacity-50 cursor-pointer transition-colors"
            >
              {loadingAction === 'draft' ? (t('processing') || 'กำลังดำเนินการ...') : (t('save_draft') || 'บันทึกแบบร่าง')}
            </button>

            <button 
              onClick={() => handleSave(false)}
              disabled={isLoading}
              className="px-6 py-2 bg-[#1e3a8a] text-white rounded-md font-medium hover:bg-blue-900 disabled:opacity-50 cursor-pointer transition-colors"
            >
              {loadingAction === 'publish' 
                ? (t('processing') || 'กำลังดำเนินการ...') 
                : (isEditMode ? t('publish') || 'เผยแพร่' : t('publish') || 'เผยแพร่')}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* 🟢 Dropdown เลือกหมวดหมู่ข่าว (Category) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 p-6 sm:px-12 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label className="text-[#1e3a8a] font-bold whitespace-nowrap text-lg">
            {t('news_category') || 'หมวดหมู่ข่าวสาร'}<span className="text-red-500 ml-1">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full sm:w-auto flex-1 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] bg-white cursor-pointer outline-none text-slate-700 font-medium"
          >
            <option value="" disabled>-- {t('select_category') || 'เลือกหมวดหมู่ข่าวที่นี่'} --</option>
            <option value="announcement">{t('news_announcements') || 'ประกาศสำคัญ (Announcements)'}</option>
            <option value="success_story">{t('news_earc') || 'เรื่องเล่าความสำเร็จ (EARC Spotlight)'}</option>
            <option value="activity_snapshot">{t('news_activity') || 'ภาพบรรยายกิจกรรมล่าสุด (Activity Snapshot)'}</option>
          </select>
        </div>

        {/* 🟢 พื้นที่พิมพ์บทความ (Editor) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 sm:p-12">
            
            {/* Title */}
            <input
              type="text"
              placeholder={t('enter_news_title') || 'พิมพ์หัวข้อข่าวสารที่นี่...'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-auto text-3xl sm:text-4xl leading-[1.5] font-bold text-[#1e3a8a] placeholder-slate-300 border-b border-slate-200 pt-2 pb-4 mb-8 focus:outline-none focus:border-[#1e3a8a] transition-colors bg-transparent"
            />

            {/* Thumbnail */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`w-full h-48 sm:h-[400px] mb-8 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors relative overflow-hidden group`}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-medium px-4 py-2 border border-white rounded-lg backdrop-blur-sm">
                      {t('click_change_image') || 'คลิกเพื่อเปลี่ยนรูปภาพหน้าปก'}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                  <span className="font-medium text-lg">{t('add_news_cover') || 'อัปโหลดภาพหน้าปกข่าว'}</span>
                </div>
              )}
            </div>

            {/* ReactQuill Editor */}
            <div className="editor-container">
              <ReactQuill 
                theme="snow" 
                value={content} 
                onChange={setContent} 
                modules={modules}
                placeholder={t('start_writing_news') || 'เริ่มต้นเขียนเนื้อหาข่าวสารที่นี่...'}
                className="min-h-[400px] text-lg text-slate-700"
              />
            </div>
          </div>
        </div>

      </div>

      {/* สไตล์สำหรับ ReactQuill */}
      <style>{`
        .editor-container .ql-container {
          font-family: inherit;
          font-size: 1.125rem;
          border: none !important;
        }
        .editor-container .ql-toolbar {
          position: sticky;
          top: 80px; 
          z-index: 40;
          background-color: white;
          border: none !important;
          border-bottom: 1px solid #e2e8f0 !important;
          margin-bottom: 1.5rem;
          padding: 12px 0;
        }
        .editor-container .ql-editor {
          padding: 0;
          min-height: 400px;
          line-height: 1.8;
        }
        .editor-container .ql-editor.ql-blank::before {
          font-style: normal;
          color: #94a3b8;
          left: 0;
        }
      `}</style>
    </div>
  );
};

export default CreateNews;