/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';

// 🟢 สร้าง Type สำหรับเก็บข้อมูลผู้สร้าง
interface AuthorTag {
  id: string | null;
  name: string;
  profilepic?: string;
}

const CreateShowcase = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const { id } = useParams(); 
  const isEditMode = !!id; 

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [alertInfo, setAlertInfo] = useState({ show: false, type: 'success', message: '' });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // 🟢 State สำหรับลิงก์ผลงานแบบหลายลิงก์ (แทนที่ตัวแปร linkToWork เดิม)
  const [links, setLinks] = useState([{ title: '', url: '' }]);
  
  // State สำหรับ Tags ของ Author
  const [authors, setAuthors] = useState<AuthorTag[]>([]);
  const [authorInput, setAuthorInput] = useState('');
  const [authorSuggestions, setAuthorSuggestions] = useState<any[]>([]);
  const [isSearchingAuthor, setIsSearchingAuthor] = useState(false);

  // State สำหรับ Tags (ระบบ Smart Tags)
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

  // ฟังก์ชันค้นหาผู้ใช้งาน
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

  // ฟังก์ชันค้นหา Tags
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
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

    if (isEditMode) {
      const fetchShowcaseData = async () => {
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
            .from('showcases')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          
          if (data) {
            const isOwner = data.author_id === user.id;
            const isPrivileged = ['admin', 'co_admin', 'developer'].includes(userRole);

            if (!isOwner && !isPrivileged) {
              showCustomAlert('error', t('no_permission') || 'คุณไม่มีสิทธิ์เข้าถึงหรือแก้ไขผลงานนี้', '/showcases');
              return;
            }

            setTitle(data.title || '');
            setDescription(data.description || '');
            
            // 🟢 ดักจับข้อมูลลิงก์เผื่อของเก่าเป็น Text หรือ JSON
            if (data['Link to work']) {
              let parsedLinks = [{ title: '', url: '' }];
              try {
                // ถ้าใน Database เก็บมาเป็น Array (JSONB ที่ถูกต้อง)
                if (Array.isArray(data['Link to work'])) {
                  parsedLinks = data['Link to work'];
                } 
                // ถ้าหลงเหลือข้อมูลเก่าที่เป็น String ธรรมดา
                else if (typeof data['Link to work'] === 'string') {
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
          console.error("Error fetching showcase for edit:", error);
          showCustomAlert('error', 'ไม่สามารถดึงข้อมูลผลงานมาแก้ไขได้', '/showcases');
        } finally {
          setIsLoading(false);
        }
      };

      fetchShowcaseData();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showCustomAlert('error', t('require_title') || "กรุณาใส่หัวข้อผลงาน (Title)");
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error(t('require_login') || "กรุณาเข้าสู่ระบบก่อนดำเนินการ");

      const { data: userData } = await supabase.from('user').select('role').eq('id', user.id).single();
      const userRole = userData?.role?.toLowerCase() || 'user';
      
      const targetStatus = ['admin', 'developer'].includes(userRole) ? 'published' : 'pending';

      let thumbnailUrl = previewUrl; 
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `showcase-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('thumbnails') 
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('thumbnails')
          .getPublicUrl(fileName);

        thumbnailUrl = publicUrl;
      }

      // 🟢 กรองเอาเฉพาะลิงก์ที่ถูกกรอกจริงๆ ไปบันทึก
      const validLinks = links.filter(link => link.url.trim() !== '');

      const showcaseDataToSave: any = {
        title: title,
        description: description,
        thumbnail_url: thumbnailUrl,
        tag: tags.join(', '), 
        status: targetStatus,
        post_type: 'showcase',
        "Link to work": validLinks, // 🟢 บันทึกเป็น Array (JSONB)
        
        author_name: authors.map(a => a.name).join(', '), 
        author_data: authors
      };

      if (isEditMode) {
        const { error: updateError } = await supabase
          .from('showcases')
          .update(showcaseDataToSave)
          .eq('id', id);

        if (updateError) throw updateError;
        
        const successMsg = targetStatus === 'pending' 
          ? t('edit_showcase_pending') || 'แก้ไขและส่งตรวจสอบเรียบร้อยแล้ว!'
          : t('edit_showcase_published') || 'บันทึกและเผยแพร่การแก้ไขเรียบร้อยแล้ว!';
        showCustomAlert('success', successMsg);

      } else {
        showcaseDataToSave.author_id = user.id;

        const { error: insertError } = await supabase
          .from('showcases')
          .insert([showcaseDataToSave]);

        if (insertError) throw insertError;

        const successMsg = targetStatus === 'pending' 
          ? t('create_showcase_pending') || 'ส่งผลงานของคุณเพื่อรอตรวจสอบเรียบร้อยแล้ว!'
          : t('create_showcase_published') || 'เผยแพร่ผลงานของคุณเรียบร้อยแล้ว!';
        showCustomAlert('success', successMsg);
      }

    } catch (error: any) {
      console.error("Error submitting showcase:", error);
      showCustomAlert('error', error.message || t('error_saving') || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 relative">
      
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

      <div className="max-w-3xl mx-auto text-center mt-8 mb-10">
        <h1 className="text-4xl lg:text-5xl font-bold text-[#1e3a8a] mb-2">
          {isEditMode ? (t('edit_showcase_title') || 'Edit a Showcase') : (t('create_showcase_title') || 'Create a Showcase')}
        </h1>
        <p className="text-md lg:text-lg text-slate-500">
          {t('create_showcase_desc') || 'Share your other works with other teachers.'}
        </p>
      </div>

      <div className="max-w-3xl mx-auto bg-[#F4F6F9] rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-slate-600 font-semibold mb-2 text-lg">{t('create_showcase_title_name') || 'Title'}<span className='text-red-500 ml-1'>*</span></label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] bg-white outline-none" 
            />
          </div>

          <div className="relative">
            <label className="block text-slate-600 font-semibold mb-2 text-lg">{t('create_showcase_author') || 'Author(s)'}</label>
            <div className="w-full flex flex-wrap items-center gap-2 p-2 border border-slate-300 rounded-xl focus-within:ring-2 focus-within:ring-[#1e3a8a] transition-all bg-white min-h-[50px]">
              
              {authors.map((author, index) => (
                <span key={index} className="flex items-center gap-1.5 bg-blue-100 text-[#1e3a8a] px-3 py-1.5 rounded-md text-sm font-medium shadow-sm">
                  {author.profilepic && <img src={author.profilepic} className="w-5 h-5 rounded-full object-cover" alt="pic"/>}
                  {!author.profilepic && author.id && <div className="w-5 h-5 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-[10px]">{author.name.charAt(0)}</div>}
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
                className="flex-1 min-w-[200px] py-1 px-2 outline-none text-base bg-transparent text-slate-700"
              />
            </div>
            <p className="text-slate-400 text-xs mt-2 italic">{t('create_showcase_author_hint') || 'ค้นหาชื่อครูในระบบ หรือพิมพ์ชื่อเองแล้วกด Enter เพื่อเพิ่ม'}</p>
            
            {authorInput.trim().length > 1 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto overflow-x-hidden">
                {isSearchingAuthor ? (
                  <div className="p-4 text-center text-slate-500 text-sm">{t('searching') || 'กำลังค้นหา...'}</div>
                ) : authorSuggestions.length > 0 ? (
                  authorSuggestions.map((user) => (
                    <div 
                      key={user.id} 
                      onClick={() => handleAddAuthor(user)}
                      className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center overflow-hidden shrink-0">
                        {user.profilepic ? <img src={user.profilepic} alt="pic" className="w-full h-full object-cover" /> : user.name.charAt(0)}
                      </div>
                      <div className="flex-1 text-sm text-slate-800 font-medium">{user.name}</div>
                    </div>
                  ))
                ) : (
                  <div 
                    onClick={() => handleAddAuthor({ id: null, name: authorInput.trim() })}
                    className="p-4 text-center text-[#1e3a8a] font-medium hover:bg-slate-50 cursor-pointer flex items-center justify-center gap-2 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a.75.75 0 01.75.75v1.25h1.25a.75.75 0 110 1.5h-1.25v1.25a.75.75 0 11-1.5 0v-1.25H8a.75.75 0 110-1.5h1.25V9.25A.75.75 0 0110 8.5z" /></svg>
                    {t('add')} "{authorInput}"
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-2 text-lg">{t('showcase_brief_description') || 'Briefly Description'}</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              rows={5} 
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] bg-white outline-none resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-2 text-lg">{t('add_image_cover') || 'Add your image cover'}{!isEditMode && <span className='text-red-500 ml-1'>*</span>}</label>
            <div className="flex flex-col items-start gap-4">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/jpeg, image/png, image/webp" className="hidden" />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()} 
                className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50 shadow-sm transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" /></svg>
                {isEditMode && previewUrl ? (t('change_media') || 'Change Media') : (t('attach_media') || 'Attach Media')}
              </button>
              {previewUrl && (
                <div className="w-48 h-32 rounded-lg overflow-hidden border border-slate-200 shadow-sm relative group">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* 🟢 อัปเดตส่วนลิงก์ผลงาน ให้รองรับ JSONB */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-baseline gap-2 text-slate-600 font-semibold text-lg">
                {t('link_to_work') || 'Links to your work'}
              </label>
              <button 
                type="button" 
                onClick={() => setLinks([...links, { title: '', url: '' }])}
                className="text-sm text-[#1e3a8a] font-semibold hover:underline cursor-pointer"
              >
                + {t('add_link') || 'เพิ่มลิงก์'}
              </button>
            </div>

            <div className="space-y-3">
              {links.map((link, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center relative">
                  <input 
                    type="text" 
                    placeholder={t('link_title') || 'Link Title (เช่น YouTube, GitHub)'} 
                    value={link.title} 
                    onChange={(e) => {
                      const newLinks = [...links];
                      newLinks[index].title = e.target.value;
                      setLinks(newLinks);
                    }} 
                    className="w-full sm:w-1/3 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] bg-white outline-none" 
                  />
                  <div className="flex w-full flex-1 gap-2">
                    <input 
                      type="url" 
                      placeholder="https://" 
                      value={link.url} 
                      onChange={(e) => {
                        const newLinks = [...links];
                        newLinks[index].url = e.target.value;
                        setLinks(newLinks);
                      }} 
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] bg-white outline-none" 
                    />
                    {links.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => setLinks(links.filter((_, i) => i !== index))}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer shrink-0 border border-transparent hover:border-red-200"
                        title="ลบลิงก์นี้"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <label className="block text-slate-600 font-semibold mb-2 text-lg">{t('category_and_tags') || 'Category & Tags'}</label>
            <div className="w-full flex flex-wrap items-center gap-2 p-2 border border-slate-300 rounded-xl focus-within:ring-2 focus-within:ring-[#1e3a8a] transition-all bg-white min-h-[50px]">
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

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isLoading}
              className="cursor-pointer w-full bg-[#1e3a8a] hover:bg-blue-900 text-white font-bold py-4 rounded-xl shadow-md transition-colors text-xl disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {isLoading 
                ? (isEditMode ? 'Saving...' : (t('event_creating') || 'Creating...')) 
                : (isEditMode ? (t('save_changes') || 'Save Changes') : (t('create_showcase_btn') || 'Create a showcase'))}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateShowcase;