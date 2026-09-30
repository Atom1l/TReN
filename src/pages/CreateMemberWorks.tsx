/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';

// 💡 Import Constants จังหวัด
import { THAI_PROVINCES } from '../constants/Province';

import { Editor } from '@tinymce/tinymce-react';

interface AuthorTag {
  id: string | null;
  name: string;
  profilepic?: string;
}

const CreateMemberWorks = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const { id } = useParams(); 
  const isEditMode = !!id; 

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<'draft' | 'publish' | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [alertInfo, setAlertInfo] = useState({ show: false, type: 'success', message: '' });

  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); 
  const [links, setLinks] = useState([{ title: '', url: '' }]);
  
  const [authors, setAuthors] = useState<AuthorTag[]>([]);
  const [authorInput, setAuthorInput] = useState('');
  const [authorSuggestions, setAuthorSuggestions] = useState<any[]>([]);
  const [isSearchingAuthor, setIsSearchingAuthor] = useState(false);

  const [schoolName, setSchoolName] = useState('');
  const [yearCreated, setYearCreated] = useState('');
  const [schoolProvince, setSchoolProvince] = useState('');
  const [provinceSearch, setProvinceSearch] = useState('');
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [isSearchingTag, setIsSearchingTag] = useState(false);

  const showCustomAlert = (type: 'success' | 'error', message: string, redirectPath?: string) => {
    setAlertInfo({ show: true, type, message });
    if (type === 'success') {
      setTimeout(() => {
        setAlertInfo({ show: false, type: 'success', message: '' });
        if (redirectPath) {
          navigate(redirectPath);
        } else {
          navigate('/profile'); 
        }
      }, 1500);
    } else {
      setTimeout(() => {
        setAlertInfo({ show: false, type: 'success', message: '' });
        if (redirectPath) navigate(redirectPath);
      }, 3000);
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (authorInput.trim().length < 2) {
        setAuthorSuggestions([]);
        return;
      }
      setIsSearchingAuthor(true);
      
      const safeSearch = authorInput.trim().replace(/"/g, ''); 
      const nameParts = safeSearch.split(' ');
      const orSearchFormat = `"%${safeSearch}%"`; 

      try {
        let usersQuery = supabase
          .from('user')
          .select('id, first_name, last_name, profilepic')
          .limit(5);

        if (nameParts.length > 1) {
          usersQuery = usersQuery
            .ilike('first_name', `%${nameParts[0]}%`)
            .ilike('last_name', `%${nameParts.slice(1).join(' ')}%`);
        } else {
          usersQuery = usersQuery.or(`first_name.ilike.${orSearchFormat},last_name.ilike.${orSearchFormat}`);
        }

        const { data, error } = await usersQuery;

        if (!error && data) {
          setAuthorSuggestions(data.map(u => ({
            id: u.id,
            name: `${u.first_name} ${u.last_name || ''}`.trim(),
            profilepic: u.profilepic
          })));
        }
      } finally {
        setIsSearchingAuthor(false);
      }
    };

    const timer = setTimeout(() => fetchSuggestions(), 300);
    return () => clearTimeout(timer);
  }, [authorInput]);

  useEffect(() => {
    const fetchTagSuggestions = async () => {
      if (tagInput.trim().length < 1) {
        setTagSuggestions([]);
        return;
      }
      setIsSearchingTag(true);
      try {
        const { data, error } = await supabase.from('member_works').select('tag').ilike('tag', `%${tagInput}%`).limit(50);

        if (!error && data) {
          const allTags = new Set<string>();
          const lowerInput = tagInput.toLowerCase();

          data.forEach(row => {
            if (row.tag) {
              const rowTags = row.tag.split(',').map((t: string) => t.trim());
              rowTags.forEach((t: string) => {
                if (t.toLowerCase().includes(lowerInput)) {
                  allTags.add(t); 
                }
              });
            }
          });
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
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

    if (isEditMode) {
      const fetchWorkData = async () => {
        setIsLoading(true);
        try {
          const { data: { user }, error: authError } = await supabase.auth.getUser();
          if (authError || !user) {
            showCustomAlert('error', t('require_login') || 'กรุณาเข้าสู่ระบบก่อน', '/');
            return;
          }

          const { data: userData } = await supabase.from('user').select('role').eq('id', user.id).single();
          const userRole = userData?.role?.toLowerCase() || 'user';

          const { data, error } = await supabase
            .from('member_works')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          
          if (data) {
            const isOwner = data.author_id === user.id;
            const isPrivileged = ['admin', 'co_admin', 'developer'].includes(userRole);

            if (!isOwner && !isPrivileged) {
              showCustomAlert('error', t('no_permission') || 'คุณไม่มีสิทธิ์เข้าถึงหรือแก้ไขผลงานนี้', '/member-works');
              return;
            }

            setTitle(data.title || '');
            setContent(data.description || ''); 
            
            setSchoolName(data.school_name || '');
            setYearCreated(data.year_created || '');
            
            setSchoolProvince(data.school_province || '');
            if (data.school_province) {
              const foundProv = THAI_PROVINCES.find(
                (p: (typeof THAI_PROVINCES)[number]) => p.value === data.school_province
              );
              if (foundProv) setProvinceSearch(foundProv.label);
            }

            if (data['Link to work']) {
              let parsedLinks = [{ title: '', url: '' }];
              try {
                if (Array.isArray(data['Link to work'])) {
                  parsedLinks = data['Link to work'];
                } else if (typeof data['Link to work'] === 'string') {
                  if (data['Link to work'].startsWith('http')) {
                    parsedLinks = [{ title: 'Main Link', url: data['Link to work'] }];
                  } else {
                    parsedLinks = JSON.parse(data['Link to work']);
                  }
                }
              } catch (e) {
                parsedLinks = [{ title: 'Main Link', url: String(data['Link to work']) }];
              }
              setLinks(parsedLinks.length > 0 ? parsedLinks : [{ title: '', url: '' }]);
            }
            
            if (data.author_name) {
              const oldAuthors = data.author_name
                .split(',')
                .map((n: string) => ({ id: null, name: n.trim() }))
                .filter((a: any) => a.name);
              setAuthors(oldAuthors);
            }
            
            if (data.tag) {
              setTags(data.tag.split(',').map((t: string) => t.trim()).filter(Boolean));
            }
            if (data.thumbnail_url) {
              setPreviewUrl(data.thumbnail_url);
            }
          }
        } catch (error) {
          console.error("Error fetching work for edit:", error);
          showCustomAlert('error', t('error_loading_data') || 'ไม่สามารถดึงข้อมูลมาแก้ไขได้', '/member-works');
        } finally {
          setIsLoading(false);
        }
      };

      fetchWorkData();
    } else {
      const checkLogin = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          showCustomAlert('error', t('require_login') || 'กรุณาเข้าสู่ระบบก่อน', '/');
        }
      };
      checkLogin();
    }
  }, [id, isEditMode]);

  const handleAddAuthor = (authorItem: AuthorTag) => {
    if (!authors.find(a => a.name === authorItem.name)) {
      setAuthors([...authors, authorItem]);
    }
    setAuthorInput('');
    setAuthorSuggestions([]);
  };

  const handleKeyDownAuthor = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = authorInput.trim();
      if (val) {
        handleAddAuthor({ id: null, name: val });
      }
    }
  };

  const handleRemoveAuthor = (nameToRemove: string) => {
    setAuthors(authors.filter(a => a.name !== nameToRemove));
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      
      if (!validTypes.includes(file.type)) {
        showCustomAlert('error', t('invalid_file_type') || 'ประเภทไฟล์ไม่ถูกต้อง กรุณาเลือกไฟล์ภาพ (JPEG, PNG, WEBP)');
        return;
      }

      const MAX_FILE_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        showCustomAlert('error', t('file_size_exceeded') || 'ขนาดไฟล์เกิน 5MB กรุณาเลือกไฟล์ที่มีขนาดเล็กกว่า');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (isDraft: boolean) => {
    if (!title.trim()) {
      showCustomAlert('error', t('require_title') || "กรุณาใส่ชื่อผลงาน (Title)");
      return;
    }

    setIsLoading(true);
    setLoadingAction(isDraft ? 'draft' : 'publish');

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error(t('require_login') || "กรุณาเข้าสู่ระบบก่อนดำเนินการ");

      const { data: userData } = await supabase.from('user').select('role').eq('id', user.id).single();
      const userRole = userData?.role?.toLowerCase() || 'user';
      
      let targetStatus = 'draft';
      if (!isDraft) {
        targetStatus = ['admin', 'developer', 'co_admin'].includes(userRole) ? 'published' : 'pending';
      }

      let thumbnailUrl = previewUrl; 
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `memberwork-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('thumbnails').upload(fileName, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('thumbnails').getPublicUrl(fileName);
        thumbnailUrl = publicUrl;
      }

      const validLinks = links.filter(link => link.url.trim() !== '');

      const workDataToSave: any = {
        title: title,
        description: content, 
        thumbnail_url: thumbnailUrl,
        tag: tags.join(', '), 
        status: targetStatus,
        post_type: 'member_work',
        "Link to work": validLinks,
        author_name: authors.map(a => a.name).join(', '), 
        author_data: authors,
        school_name: schoolName.trim() || null, 
        school_province: schoolProvince || null, 
        year_created: yearCreated.trim() || null
      };

      if (isEditMode) {
        const { error: updateError } = await supabase.from('member_works').update(workDataToSave).eq('id', id);
        if (updateError) throw updateError;
        
        let msg = t('edit_work_success') || "อัปเดตข้อมูลผลงานเรียบร้อยแล้ว!";
        if (isDraft) msg = t('msg_edit_draft') || "อัปเดตแบบร่างสำเร็จ!";
        else if (targetStatus === 'published') msg = t('edit_work_published') || "บันทึกและเผยแพร่เรียบร้อยแล้ว!";
        showCustomAlert('success', msg);

      } else {
        workDataToSave.author_id = user.id;

        const { error: insertError } = await supabase.from('member_works').insert([workDataToSave]);
        if (insertError) throw insertError;

        let msg = t('create_work_pending') || "ส่งผลงานเพื่อรอตรวจสอบเรียบร้อยแล้ว!";
        if (isDraft) msg = t('msg_create_draft') || "บันทึกแบบร่างสำเร็จ!";
        else if (targetStatus === 'published') msg = t('create_work_published') || "เผยแพร่ผลงานเรียบร้อยแล้ว!";
        showCustomAlert('success', msg);
      }

    } catch (error: any) {
      console.error("Error submitting work:", error);
      showCustomAlert('error', error.message || t('error_saving') || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] relative">
      
      {/* Alert Modal */}
      {alertInfo.show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center max-w-sm w-full animate-scale-in">
            {alertInfo.type === 'success' ? (
              <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-5 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
              </div>
            ) : (
              <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-5 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              </div>
            )}
            <p className="text-slate-600 text-lg font-bold">{alertInfo.message}</p>
          </div>
        </div>
      )}

      {/* Navbar แถบบน */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-full mx-auto px-4 sm:px-8 lg:px-16 py-3 sm:py-4 h-auto sm:h-20 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          
          <button 
            onClick={() => navigate('/profile')}
            className="text-slate-500 hover:text-slate-700 font-medium flex items-center gap-2 cursor-pointer text-sm sm:text-base self-start sm:self-auto"
          >
            &lt; {t('back_to_dashboard') || 'ย้อนกลับไปยังแดชบอร์ด'}
          </button>
          
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            <button 
              onClick={() => handleSave(true)}
              disabled={isLoading}
              className="flex-1 sm:flex-initial px-4 sm:px-6 py-2 bg-white border border-[#1e3a8a] text-[#1e3a8a] rounded-lg font-medium hover:bg-slate-50 disabled:opacity-50 cursor-pointer transition-colors text-sm sm:text-base"
            >
              {loadingAction === 'draft' ? (t('processing') || 'กำลังดำเนินการ...') : (t('save_draft') || 'บันทึกแบบร่าง')}
            </button>

            <button 
              onClick={() => handleSave(false)}
              disabled={isLoading}
              className="flex-1 sm:flex-initial px-4 sm:px-6 py-2 bg-[#1e3a8a] text-white rounded-lg font-medium hover:bg-blue-900 disabled:opacity-50 cursor-pointer transition-colors text-sm sm:text-base shadow-sm"
            >
              {loadingAction === 'publish' 
                ? (t('processing') || 'กำลังดำเนินการ...') 
                : (isEditMode ? t('publish') || 'เผยแพร่' : t('publish') || 'เผยแพร่')}
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8"> {/* 💡 ปรับให้แคบลงนิดนึงเพื่อให้ทรง Card ดูสวยขึ้น */}
        
        <div className="text-center mb-10 mt-6 sm:mt-10">
          <h1 className="text-4xl lg:text-6xl font-bold text-[#1e3a8a] mb-3">
            {isEditMode ? (t('edit_member_work_title') || 'แก้ไขผลงานสมาชิก') : (t('create_member_work') || 'เพิ่มผลงานสมาชิก')}
          </h1>
          <p className="text-lg text-slate-500">
            {t('create_member_work_desc') || 'แบ่งปันผลงาน กิจกรรม และความสำเร็จของคุณให้กับสมาชิกเครือข่าย'}
          </p>
        </div>

        {/* ==================== ก้อนที่ 1: Header (Title & Thumbnail) ==================== */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-10 mb-8">
          {/* Title Input */}
          <input
            type="text"
            placeholder={t('member_work_title_placeholder') || 'ชื่อผลงาน หรือชื่อกิจกรรม...'}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-auto text-3xl sm:text-4xl leading-[1.5] font-bold text-[#1e3a8a] placeholder-slate-300 border-b border-slate-200 pt-2 pb-5 mb-8 focus:outline-none focus:border-[#1e3a8a] transition-colors bg-transparent"
          />

          {/* Thumbnail Upload */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`w-full h-48 sm:h-64 sm:mb-2 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors relative overflow-hidden group`}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/jpeg, image/png, image/webp" className="hidden" />
            
            {previewUrl ? (
              <>
                <img src={previewUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-medium">{t('click_change_image') || 'กดเพื่อเปลี่ยนรูปภาพ'}</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-slate-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                <span className="text-lg text-slate-500 font-medium">{t('add_member_work_cover') || 'อัปโหลดรูปภาพปกผลงาน'}</span>
              </div>
            )}
          </div>
        </div>

        {/* ==================== ก้อนที่ 2: Content (TinyMCE) ==================== */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#1e3a8a] mt-16 mb-4 flex items-center justify-center gap-2 pl-1">
            {t('view')}
          </h2>
          <div className="editor-container shadow-sm rounded-2xl overflow-hidden">
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              value={content}
              onEditorChange={(newContent) => setContent(newContent)}
              init={{
                height: 550,
                menubar: true, 
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic forecolor backcolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'table image link | removeformat | help', 
                content_style: `
                  body { font-family: "Sarabun", "Prompt", sans-serif; font-size: 1.125rem; color: #334155; } 
                  table { border-collapse: collapse; width: 100%; } 
                  td, th { border: 1px solid #cbd5e1; padding: 8px; }
                `,
                placeholder: 'อธิบายรายละเอียดผลงาน กรณีศึกษา หรือข้อค้นพบของคุณที่นี่... \n(คลิกที่เมนู Table ด้านบน หรือปุ่มตารางที่แถบเครื่องมือเพื่อสร้างตาราง)',
                skin: 'oxide',
                content_css: 'default',
                branding: false,
                elementpath: false,
                // 💡 ซ่อนกรอบของ TinyMCE ให้กลายเป็น 0 เพราะเราคลุมด้วย shadow-sm และ rounded-2xl ไว้ด้านนอกแล้ว
                setup: (editor: any) => {
                  editor.on('init', () => {
                    const container = editor.getContainer();
                    if (container) {
                      container.style.border = '1px solid #e2e8f0'; 
                      container.style.borderRadius = '1rem'; 
                      container.style.boxShadow = 'none'; 
                    }
                  });
                }
              }}
            />
          </div>
        </div>

        {/* ==================== ก้อนที่ 3: Metadata Section (Authors, School, Links, Tags) ==================== */}
        <h2 className="text-3xl font-bold text-[#1e3a8a] mt-16 mb-4 flex items-center justify-center gap-2 pl-1">
          {t('additinal_info')}
        </h2>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-10 space-y-10 mb-20">
          {/* Authors */}
          <div className="relative">
            <label className="block text-slate-700 text-xl font-bold mb-3">{t('create_member_work_author') || 'ชื่อผู้สร้างผลงาน (Author)'}</label>
            <div className="w-full flex flex-wrap items-center gap-2 p-3 border border-slate-300 rounded-xl focus-within:ring-2 focus-within:ring-[#1e3a8a] transition-all bg-white min-h-[55px]">
              {authors.map((author, index) => (
                <span key={index} className="flex items-center gap-1.5 bg-blue-100 text-[#1e3a8a] px-3 py-1.5 rounded-md text-lg font-medium shadow-sm">
                  {author.profilepic && <img src={author.profilepic} className="w-6 h-6 rounded-full object-cover" alt="pic"/>}
                  {!author.profilepic && author.id && <div className="w-6 h-6 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-xs">{author.name.charAt(0)}</div>}
                  {author.name}
                  <button type="button" onClick={() => handleRemoveAuthor(author.name)} className="text-[#1e3a8a] hover:text-red-500 transition-colors cursor-pointer ml-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                  </button>
                </span>
              ))}
              <input 
                type="text" 
                value={authorInput}
                onChange={(e) => setAuthorInput(e.target.value)}
                onKeyDown={handleKeyDownAuthor}
                className="flex-1 min-w-[200px] py-1 px-2 outline-none text-xl bg-transparent text-slate-700"
              />
            </div>
            <p className="text-slate-400 text-sm mt-2 italic">{t('create_author_hint') || 'ค้นหาชื่อสมาชิกในระบบ หรือพิมพ์ชื่อเองแล้วกด Enter เพื่อเพิ่ม'}</p>
            
            {authorInput.trim().length > 1 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto overflow-x-hidden">
                {isSearchingAuthor ? (
                  <div className="p-4 text-center text-slate-500 text-lg">{t('searching') || 'กำลังค้นหา...'}</div>
                ) : authorSuggestions.length > 0 ? (
                  authorSuggestions.map((user) => (
                    <div 
                      key={user.id} 
                      onClick={() => handleAddAuthor(user)}
                      className="flex items-center gap-3 p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center overflow-hidden shrink-0 text-lg font-bold">
                        {user.profilepic ? <img src={user.profilepic} alt="pic" className="w-full h-full object-cover" /> : user.name.charAt(0)}
                      </div>
                      <div className="flex-1 text-xl text-slate-800 font-medium">{user.name}</div>
                    </div>
                  ))
                ) : (
                  <div 
                    onClick={() => handleAddAuthor({ id: null, name: authorInput.trim() })}
                    className="p-4 text-center text-[#1e3a8a] font-bold text-xl hover:bg-slate-50 cursor-pointer flex items-center justify-center gap-2 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6"><path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a.75.75 0 01.75.75v1.25h1.25a.75.75 0 110 1.5h-1.25v1.25a.75.75 0 11-1.5 0v-1.25H8a.75.75 0 110-1.5h1.25V9.25A.75.75 0 0110 8.5z" /></svg>
                    {t('add') || 'เพิ่ม'} "{authorInput}"
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-3">
              <label className="text-slate-700 text-xl font-bold">{t('school_name') || 'ชื่อโรงเรียนต้นสังกัด'}</label>
              <input 
                type="text" 
                placeholder={t('school_name_placeholder') || 'เช่น โรงเรียนเตรียมอุดมศึกษา...'} 
                value={schoolName} 
                onChange={(e) => setSchoolName(e.target.value)} 
                className="w-full p-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] bg-white outline-none text-xl text-slate-700" 
              />
            </div>
            
            <div className="flex flex-col gap-3 relative">
              <label className="text-slate-700 text-xl font-bold">{t('province') || 'จังหวัด'}</label>
              <input
                type="text"
                placeholder={t('search_province') || '-- พิมพ์เพื่อค้นหาจังหวัด --'}
                value={provinceSearch}
                onChange={(e) => {
                  setProvinceSearch(e.target.value);
                  setSchoolProvince('');
                  setIsProvinceOpen(true);
                }}
                onFocus={() => setIsProvinceOpen(true)}
                onBlur={() => setTimeout(() => setIsProvinceOpen(false), 200)}
                className="w-full p-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] bg-white outline-none text-xl text-slate-700"
              />
              <div className="absolute right-4 top-[55px] pointer-events-none text-slate-400">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                   <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                 </svg>
              </div>

              {isProvinceOpen && (
                <div className="absolute top-[80px] z-20 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
                  {THAI_PROVINCES.filter((p: { value: string; label: string }) => p.label.includes(provinceSearch)).length > 0 ? (
                    THAI_PROVINCES.filter((p: { value: string; label: string }) => p.label.includes(provinceSearch)).map((prov: { value: string; label: string }) => (
                      <div 
                        key={prov.value} 
                        onClick={() => {
                          setSchoolProvince(prov.value);
                          setProvinceSearch(prov.label);
                          setIsProvinceOpen(false);
                        }}
                        className="p-3 hover:bg-slate-50 cursor-pointer text-slate-700 text-lg border-b border-slate-100 last:border-0 transition-colors"
                      >
                        {prov.label}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-slate-500 text-lg">{t('no_province_found') || 'ไม่พบจังหวัดที่ค้นหา'}</div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-slate-700 text-xl font-bold">{t('year_created') || 'ปีที่สร้างผลงาน'}</label>
              <input 
                type="text" 
                placeholder={t('year_created_placeholder') || 'เช่น พ.ศ. 2567, 2024'} 
                value={yearCreated} 
                onChange={(e) => setYearCreated(e.target.value)} 
                className="w-full p-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] bg-white outline-none text-xl text-slate-700" 
              />
            </div>
          </div>

          {/* Links */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-baseline gap-2 text-slate-700 text-xl font-bold">
                {t('link_to_work_member') || 'ลิงก์แนบผลงานเพิ่มเติม'}
              </label>
              <button 
                type="button" 
                onClick={() => setLinks([...links, { title: '', url: '' }])}
                className="text-base text-[#1e3a8a] font-bold hover:underline cursor-pointer bg-blue-50 px-4 py-2 rounded-xl"
              >
                + {t('add_link') || 'เพิ่มลิงก์'}
              </button>
            </div>
            <div className="space-y-3">
              {links.map((link, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center relative">
                  <input 
                    type="text" 
                    placeholder={t('link_title') || 'ชื่อลิงก์ (เช่น YouTube, รูปภาพ)'} 
                    value={link.title} 
                    onChange={(e) => {
                      const newLinks = [...links];
                      newLinks[index].title = e.target.value;
                      setLinks(newLinks);
                    }} 
                    className="w-full sm:w-1/3 p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] bg-white outline-none text-xl" 
                  />
                  <div className="flex w-full flex-1 gap-3">
                    <input 
                      type="url" 
                      placeholder="https://" 
                      value={link.url} 
                      onChange={(e) => {
                        const newLinks = [...links];
                        newLinks[index].url = e.target.value;
                        setLinks(newLinks);
                      }} 
                      className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] bg-white outline-none text-xl" 
                    />
                    {links.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => setLinks(links.filter((_, i) => i !== index))}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer shrink-0 border border-transparent hover:border-red-200 flex items-center justify-center"
                        title={t('delete_link') || 'ลบลิงก์นี้'}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="relative">
            <label className="block text-slate-700 text-xl font-bold mb-3">{t('category_and_tags') || 'Tags'}</label>
            <div className="w-full flex flex-wrap items-center gap-2 p-3 border border-slate-300 rounded-xl focus-within:ring-2 focus-within:ring-[#1e3a8a] transition-all bg-white min-h-[55px]">
              {tags.map((tag, index) => (
                <span key={index} className="flex items-center gap-1.5 bg-[#EBF1FA] text-[#1e3a8a] px-3.5 py-1.5 rounded-md text-lg font-medium shadow-sm">
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="text-[#1e3a8a] hover:text-red-500 transition-colors cursor-pointer ml-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                  </button>
                </span>
              ))}
              <input 
                type="text" 
                placeholder={tags.length === 0 ? (t('add_tags') || "+ พิมพ์แท็กใหม่แล้วกด Enter") : (t('add_tag') || "เพิ่มแท็ก...")} 
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDownTag}
                className="flex-1 min-w-[150px] py-1 px-2 outline-none text-xl bg-transparent text-slate-700"
              />
            </div>
            <p className="text-slate-400 text-sm mt-2 italic">{t('tag_input_hint') || '* ค้นหาแท็กที่เคยใช้ หรือพิมพ์แท็กใหม่แล้วกด Enter เพื่อเพิ่ม'}</p>
            
            {tagInput.trim().length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto overflow-x-hidden">
                {isSearchingTag ? (
                  <div className="p-4 text-center text-slate-500 text-lg">{t('searching') || 'กำลังค้นหา...'}</div>
                ) : (
                  <>
                    {tagSuggestions.map((suggestedTag) => (
                      <div 
                        key={suggestedTag} 
                        onClick={() => handleAddTag(suggestedTag)}
                        className="flex items-center gap-3 p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-md bg-[#EBF1FA] text-[#1e3a8a] flex items-center justify-center shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd" /></svg>
                        </div>
                        <div className="flex-1 text-xl text-slate-800 font-medium">{suggestedTag}</div>
                      </div>
                    ))}
                    {!tagSuggestions.some(t => t.toLowerCase() === tagInput.trim().toLowerCase()) && (
                      <div 
                        onClick={() => handleAddTag()}
                        className="p-4 text-center text-[#1e3a8a] font-bold text-xl hover:bg-slate-50 cursor-pointer flex items-center justify-center gap-2 transition-colors border-t border-slate-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6"><path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a.75.75 0 01.75.75v1.25h1.25a.75.75 0 110 1.5h-1.25v1.25a.75.75 0 11-1.5 0v-1.25H8a.75.75 0 110-1.5h1.25V9.25A.75.75 0 0110 8.5z" /></svg>
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

    </div>
  );
};

export default CreateMemberWorks;