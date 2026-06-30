/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { supabase } from '../lib/supabaseClient';

const CreateBlog = () => {
  const navigate = useNavigate();
  
  const { t, language } = useLanguage();
  const { id } = useParams();
  const isEditMode = !!id;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [isSearchingTag, setIsSearchingTag] = useState(false);
  
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
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image', 'video'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      [{ 'align': [] }],
      ['clean']
    ],
  };

  useEffect(() => {
    const fetchTagSuggestions = async () => {
      if (tagInput.trim().length < 1) {
        setTagSuggestions([]);
        return;
      }
      setIsSearchingTag(true);
      try {
        const [
          { data: blogsData, error: blogsError },
          { data: showcasesData, error: showcasesError }
        ] = await Promise.all([
          supabase.from('blogs').select('tag').ilike('tag', `%${tagInput}%`).limit(50),
          supabase.from('showcases').select('tag').ilike('tag', `%${tagInput}%`).limit(50)
        ]);

        if (!blogsError && !showcasesError) {
          const allTags = new Set<string>();
          const lowerInput = tagInput.toLowerCase();

          const extractTags = (dataArray: any[]) => {
            if (!dataArray) return;
            dataArray.forEach(row => {
              if (row.tag) {
                const rowTags = row.tag.split(',').map((t: string) => t.trim());
                rowTags.forEach((t: string) => {
                  if (t.toLowerCase().includes(lowerInput)) {
                    allTags.add(t); 
                  }
                });
              }
            });
          };

          extractTags(blogsData || []);
          extractTags(showcasesData || []);

          setTagSuggestions(Array.from(allTags).slice(0, 5));
        }
      } finally {
        setIsSearchingTag(false);
      }
    };

    const timer = setTimeout(() => fetchTagSuggestions(), 300);
    return () => clearTimeout(timer);
  }, [tagInput]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (isEditMode) {
      const fetchBlogData = async () => {
        setIsLoading(true);
        try {
          // 🟢 1. ตรวจสอบสถานะการล็อกอิน
          const { data: { user }, error: authError } = await supabase.auth.getUser();
          if (authError || !user) {
            showAlert('error', t('require_login') || 'กรุณาเข้าสู่ระบบก่อน', () => navigate('/'));
            return;
          }

          // 🟢 2. ดึงข้อมูล Role ของ User เพื่อนำมาเช็คสิทธิ์ (Co-admin, Admin, Developer)
          const { data: userData } = await supabase.from('user').select('role').eq('id', user.id).single();
          const userRole = userData?.role?.toLowerCase() || 'user';

          // 🟢 3. ดึงข้อมูล Blog เพื่อนำมาเช็คว่าใครเป็นเจ้าของ (author_id)
          const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          
          if (data) {
            // 🟢 4. ตรวจสอบสิทธิ์แบบ 2 เงื่อนไข (Ownership + RBAC)
            const isOwner = data.author_id === user.id; // เงื่อนไข 1: เป็นคนสร้างบทความนี้เอง
            const isPrivileged = ['admin', 'co_admin', 'developer'].includes(userRole); // เงื่อนไข 2: เป็นทีมงาน

            // ถ้าไม่ใช่ทั้งคนสร้าง และ ไม่ใช่ทีมงาน -> เตะออกทันที
            if (!isOwner && !isPrivileged) {
              showAlert('error', t('no_permission') || 'คุณไม่มีสิทธิ์เข้าถึงหรือแก้ไขบล็อกนี้', () => navigate('/blogs'));
              return;
            }

            // ถ้ามีสิทธิ์ ให้ดึงข้อมูลมาแสดงผลในฟอร์มตามปกติ
            setTitle(data.title || '');
            setContent(data.content || '');
            if (data.tag) {
              setTags(data.tag.split(',').map((t: string) => t.trim()).filter(Boolean));
            }
            if (data.thumbnail_url) {
              setPreviewUrl(data.thumbnail_url);
            }
          }
        } catch (error) {
          console.error("Error fetching blog for edit:", error);
          showAlert('error', 'ไม่สามารถดึงข้อมูลบล็อกมาแก้ไขได้', () => navigate('/blogs'));
        } finally {
          setIsLoading(false);
        }
      };

      fetchBlogData();
    } else {
      // 🟢 5. กรณีโหมดสร้างบล็อกใหม่ (Create) ก็เช็คแค่ว่าล็อกอินหรือยัง
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
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddTag = (selectedTag?: string) => {
    const newTag = (selectedTag || tagInput).trim();
    if (!newTag) return;

    const isDuplicate = tags.some(t => t.toLowerCase() === newTag.toLowerCase());
    if (!isDuplicate) {
      setTags([...tags, newTag]); 
    }
    setTagInput(''); 
    setTagSuggestions([]);
  };

  const handleKeyDownTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async (isDraft: boolean) => {
    if (!title.trim()) {
      showAlert('error', "กรุณาใส่หัวข้อบล็อก");
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
        const fileName = `blog-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('thumbnails').upload(fileName, selectedFile);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage.from('thumbnails').getPublicUrl(fileName);
        thumbnailUrl = publicUrl;
      }

      let blogStatus = 'draft'; 
      if (!isDraft) {
        if (userRole === 'admin' || userRole === 'developer') {
          blogStatus = 'published'; 
        } else {
          blogStatus = 'pending'; 
        }
      }

      const blogDataToSave = {
        title: title,
        content: content,
        thumbnail_url: thumbnailUrl,
        tag: tags.join(', '), 
        author_id: user.id,
        status: blogStatus,
        post_type: 'blog'
      };

      if (isEditMode) {
        const { error } = await supabase.from('blogs').update(blogDataToSave).eq('id', id);
        if (error) throw error;
        
        let msg = t('msg_edit_pending') || "ส่งข้อมูลที่แก้ไขเรียบร้อยแล้ว!";
        if (isDraft) msg = t('msg_edit_draft') || "อัปเดตแบบร่างสำเร็จ!";
        else if (blogStatus === 'published') msg = t('msg_edit_published') || "บันทึกและเผยแพร่เรียบร้อยแล้ว!";
        
        showAlert('success', msg, () => {
          navigate('/profile');
        });

      } else {
        const { error } = await supabase.from('blogs').insert([blogDataToSave]);
        if (error) throw error;
        
        let msg = t('msg_create_pending') || "ส่งบล็อกบทความเรียบร้อยแล้ว!";
        if (isDraft) msg = t('msg_create_draft') || "บันทึกแบบร่างสำเร็จ!";
        else if (blogStatus === 'published') msg = t('msg_create_published') || "เผยแพร่บล็อกบทความเรียบร้อยแล้ว!";
        
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
    return <div className="min-h-screen flex items-center justify-center text-[#1e3a8a] font-bold text-xl animate-pulse">{t('loading_blogs_editor') || 'กำลังโหลดบล็อก...'}</div>;
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      {renderAlertModal()}
      
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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          
          <div className="p-8 sm:p-12">
            <input
              type="text"
              placeholder={t('enter_blog_title') || 'Enter Blog\'s Title...'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-auto text-3xl sm:text-4xl leading-[1.5] text-slate-800 placeholder-slate-300 italic border-b border-slate-200 pt-6 pb-4 mb-8 focus:outline-none focus:border-[#1e3a8a] transition-colors bg-transparent"
            />

            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`w-full h-48 sm:h-64 mb-8 bg-slate-200 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors relative overflow-hidden group`}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-medium">{t('click_change_image') || 'กดเพื่อเปลี่ยนรูปภาพ'}</span>
                  </div>
                </>
              ) : (
                <span className="text-slate-500 italic">{t('add_blog_cover') || 'เพิ่มรูปหน้าปกบล็อกที่นี่'}</span>
              )}
            </div>

            <div className="editor-container">
              <ReactQuill 
                theme="snow" 
                value={content} 
                onChange={setContent} 
                modules={modules}
                placeholder={t('start_writing') || 'Start Writing your content here...'}
                className="min-h-[300px] text-lg text-slate-700"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mt-6 p-6">
          <h3 className="text-[#1e3a8a] font-bold mb-4">{t('category_and_tags') || 'Category & Tags'}</h3>
          
          <div className="relative w-full sm:w-3/4">
            <div className="w-full flex flex-wrap items-center gap-2 p-2 border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-[#1e3a8a] transition-all bg-white min-h-[50px]">
              {tags.map((tag, index) => (
                <span key={index} className="flex items-center gap-1 bg-[#EBF1FA] text-[#1e3a8a] px-3 py-1.5 rounded-md text-sm font-medium shadow-sm">
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="text-[#1e3a8a] hover:text-red-500 transition-colors cursor-pointer ml-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                  </button>
                </span>
              ))}
              
              <input 
                type="text" 
                placeholder={tags.length === 0 ? (t('add_tags') || "+ Add tag (พิมพ์แล้วกด Enter)") : (t('add_tag') || "เพิ่มแท็ก...")} 
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDownTag}
                className="flex-1 min-w-[150px] py-1 px-2 outline-none text-base bg-transparent text-slate-700"
              />
            </div>
            <p className="text-slate-400 text-xs mt-2 italic">{t('tag_input_hint') || '* ค้นหาแท็กที่เคยใช้ หรือพิมพ์แท็กใหม่แล้วกด Enter เพื่อเพิ่ม'}</p>

            {tagInput.trim().length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto overflow-x-hidden">
                {isSearchingTag ? (
                  <div className="p-4 text-center text-slate-500 text-sm">{t('searching') || 'กำลังค้นหา...'}</div>
                ) : (
                  <>
                    {tagSuggestions.map((suggestedTag) => (
                      <div 
                        key={suggestedTag} 
                        onClick={() => handleAddTag(suggestedTag)}
                        className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0 transition-colors"
                      >
                        <div className="w-6 h-6 rounded-md bg-[#EBF1FA] text-[#1e3a8a] flex items-center justify-center shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd" /></svg>
                        </div>
                        <div className="flex-1 text-sm text-slate-800 font-medium">{suggestedTag}</div>
                      </div>
                    ))}

                    {!tagSuggestions.some(t => t.toLowerCase() === tagInput.trim().toLowerCase()) && (
                      <div 
                        onClick={() => handleAddTag()}
                        className="p-4 text-center text-[#1e3a8a] font-medium hover:bg-slate-50 cursor-pointer flex items-center justify-center gap-2 transition-colors border-t border-slate-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a.75.75 0 01.75.75v1.25h1.25a.75.75 0 110 1.5h-1.25v1.25a.75.75 0 11-1.5 0v-1.25H8a.75.75 0 110-1.5h1.25V9.25A.75.75 0 0110 8.5z" /></svg>
                        {t('add') || 'เพิ่ม'} "{tagInput}" {t('as_new_tag') || 'เป็นแท็กใหม่'}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

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
          margin-bottom: 1rem;
          padding: 10px 0;
        }
        .editor-container .ql-editor {
          padding: 0;
          min-height: 300px;
        }
        .editor-container .ql-editor.ql-blank::before {
          font-style: italic;
          color: #94a3b8;
          left: 0;
        }
      `}</style>
    </div>
  );
};

export default CreateBlog;