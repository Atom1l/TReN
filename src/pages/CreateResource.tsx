/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';

const CreateResource = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const { id } = useParams(); 
  const isEditMode = !!id; 

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [alertInfo, setAlertInfo] = useState({ show: false, type: 'success', message: '' });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    resource_type: 'document', // ค่าเริ่มต้น
  });

  // 🟢 1. State สำหรับจัดการลิงก์ผลงานแบบหลายลิงก์ (JSONB)
  const [links, setLinks] = useState([{ title: '', url: '' }]);

  const showCustomAlert = (type: 'success' | 'error', message: string, redirectPath?: string) => {
    setAlertInfo({ show: true, type, message });
    if (type === 'success') {
      setTimeout(() => {
        setAlertInfo({ show: false, type: 'success', message: '' });
        if (redirectPath) navigate(redirectPath);
        else navigate('/resources'); 
      }, 1500);
    } else {
      setTimeout(() => {
        setAlertInfo({ show: false, type: 'success', message: '' });
        if (redirectPath) navigate(redirectPath);
      }, 3000);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

    const checkPermissionAndFetchData = async () => {
      setIsLoading(true);
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          showCustomAlert('error', t('require_login') || 'กรุณาเข้าสู่ระบบก่อน', '/');
          return;
        }

        const { data: userData } = await supabase.from('user').select('role').eq('id', user.id).single();
        const userRole = (userData?.role || 'user').toLowerCase();
        const isPrivileged = ['admin', 'co_admin', 'co-admin', 'developer'].includes(userRole);

        if (!isPrivileged) {
          showCustomAlert('error', t('no_permission') || 'คุณไม่มีสิทธิ์เข้าถึงหน้านี้ เฉพาะแอดมินและผู้ช่วยเท่านั้น', '/resources');
          return;
        }

        if (isEditMode) {
          const { data, error } = await supabase.from('resources').select('*').eq('id', id).single();
          if (error) throw error;
          
          if (data) {
            setFormData({
              title: data.title || '',
              description: data.description || '',
              resource_type: data.resource_type || 'document',
            });
            if (data.thumbnail_url) setPreviewUrl(data.thumbnail_url);

            // 🟢 2. ดึงข้อมูลลิงก์เก่ามาใส่ใน State
            if (data.url) {
              let parsedLinks = [{ title: '', url: '' }];
              try {
                // ถ้าเป็น Array (JSONB ที่ถูกต้อง)
                if (Array.isArray(data.url)) {
                  parsedLinks = data.url;
                } 
                // ถ้าหลงเหลือข้อมูลเก่าที่เป็น String ธรรมดา
                else if (typeof data.url === 'string') {
                  if (data.url.startsWith('http')) {
                    parsedLinks = [{ title: 'Main Link', url: data.url }];
                  } else {
                    parsedLinks = JSON.parse(data.url);
                  }
                }
              } catch (e) {
                parsedLinks = [{ title: 'Main Link', url: String(data.url) }];
              }
              
              setLinks(parsedLinks.length > 0 ? parsedLinks : [{ title: '', url: '' }]);
            }
          }
        }
      } catch (error) {
        console.error("Error checking permissions or fetching resource:", error);
        showCustomAlert('error', 'ไม่สามารถเข้าถึงข้อมูลได้', '/resources');
      } finally {
        setIsLoading(false);
      }
    };

    checkPermissionAndFetchData();
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      
      if (!validTypes.includes(file.type)) {
        showCustomAlert('error', t('invalid_file_type') || 'ประเภทไฟล์ไม่ถูกต้อง กรุณาเลือกไฟล์ภาพ (JPEG, PNG, WEBP)');
        return;
      }

      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_FILE_SIZE) {
        showCustomAlert('error', t('file_size_exceeded') || 'ขนาดไฟล์เกิน 5MB');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🟢 3. ตรวจสอบว่ามีลิงก์อย่างน้อย 1 ลิงก์ที่ถูกกรอกจริงๆ
    const validLinks = links.filter(link => link.url.trim() !== '');

    if (!formData.title.trim() || validLinks.length === 0) {
      showCustomAlert('error', 'กรุณากรอกชื่อทรัพยากรและใส่ลิงก์อย่างน้อย 1 ลิงก์ให้ครบถ้วน');
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("กรุณาเข้าสู่ระบบก่อนดำเนินการ");

      const { data: userData } = await supabase.from('user').select('role').eq('id', user.id).single();
      const userRole = (userData?.role || 'user').toLowerCase();
      
      const targetStatus = ['admin', 'developer'].includes(userRole) ? 'published' : 'pending';

      let thumbnailUrl = previewUrl; 
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `resource-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage.from('thumbnails').upload(fileName, selectedFile);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('thumbnails').getPublicUrl(fileName);
        thumbnailUrl = publicUrl;
      }

      const resourceDataToSave: any = {
        title: formData.title,
        description: formData.description,
        resource_type: formData.resource_type,
        url: validLinks, // 🟢 บันทึกเป็น Array (JSONB)
        thumbnail_url: thumbnailUrl,
      };

      if (isEditMode) {
        const { error: updateError } = await supabase.from('resources').update(resourceDataToSave).eq('id', id);
        if (updateError) throw updateError;
        
        showCustomAlert('success', t('resource_edit_success') || 'บันทึกการเปลี่ยนแปลงเรียบร้อยแล้ว!');
      } else {
        resourceDataToSave.author_id = user.id;
        resourceDataToSave.status = targetStatus;

        const { error: insertError } = await supabase.from('resources').insert([resourceDataToSave]);
        if (insertError) throw insertError;

        const successMsg = targetStatus === 'pending' 
          ? 'ส่งข้อมูลเข้าระบบเรียบร้อย! โปรดรอ Admin อนุมัติ (Pending)'
          : 'สร้างและเผยแพร่ทรัพยากรเรียบร้อยแล้ว! (Published)';
        showCustomAlert('success', successMsg);
      }

    } catch (error: any) {
      console.error("Error submitting resource:", error);
      showCustomAlert('error', error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 relative">
      
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

      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mt-8 mb-10">
        <h1 className="text-4xl lg:text-5xl font-bold text-[#1e3a8a] mb-2">
          {isEditMode ? t('edit_resource_title') || 'แก้ไขข้อมูล' : t('create_resource_title') || 'สร้างข้อมูล'}
        </h1>
        <p className="text-md lg:text-lg text-slate-500">
          {t('create_resource_desc') || 'เพิ่มไฟล์ เอกสาร หรือวิดีโอ เพื่อแบ่งปันให้กันและกัน'}
        </p>
      </div>

      <div className="max-w-3xl mx-auto bg-[#F4F6F9] rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-slate-600 font-semibold mb-2 text-lg">
                {t('resource_title') || 'ชื่อทรัพยากร (Title)'}<span className='text-red-500 ml-1'>*</span>
              </label>
              <input 
                type="text" 
                name="title"
                placeholder={t('resource_placeholder') || 'เช่น วิดีโอสัมมนาวันที่..., เอกสารประกอบการสอน...'}
                value={formData.title} 
                onChange={handleChange} 
                required 
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] bg-white outline-none" 
              />
            </div>

            <div className="relative w-full md:col-span-2">
              <label className="block text-slate-600 font-semibold mb-2 text-lg">
                {t('resource_type') || 'ประเภทข้อมูล'}<span className='text-red-500 ml-1'>*</span>
              </label>
              <select
                name="resource_type"
                value={formData.resource_type}
                onChange={handleChange}
                required
                className="w-full p-3 pr-12 border border-slate-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-[#1e3a8a] appearance-none cursor-pointer"
              >
                <option value="document">เอกสาร / PDF</option>
                <option value="image/video">รูปภาพ/วิดีโอ</option>
                <option value="folder">โฟลเดอร์รวมไฟล์</option>
                <option value="link">ลิงก์เว็บไซต์</option>
              </select>

              <svg
                className="absolute right-4 bottom-1/16 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* 🟢 4. UI สำหรับจัดการลิงก์หลายอัน (อิงดีไซน์จาก Showcase) */}
          <div className="pt-2 border-t border-slate-200 mt-4">
            <div className="flex items-center justify-between mb-3 mt-4">
              <label className="flex items-baseline gap-2 text-slate-600 font-semibold text-lg">
                {t('resource_url') || 'ลิงก์ข้อมูล'}<span className='text-red-500 ml-1'>*</span>
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
                    placeholder={t('link_title') || 'ชื่อลิงก์ (เช่น Google Drive, YouTube)'} 
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
                      required={index === 0} // บังคับให้ช่องแรกต้องกรอกเสมอ
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

          <div>
            <label className="block text-slate-600 font-semibold mb-2 text-lg">
              {t('resource_description') || 'คำอธิบายข้อมูล'}
            </label>
            <textarea 
              name="description"
              value={formData.description} 
              onChange={handleChange} 
              rows={4} 
              placeholder={t('resource_description_placeholder') || 'คำอธิบายสั้น ๆ เกี่ยวกับข้อมูลนี้...'}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] bg-white outline-none resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-2 text-lg">
              {t('add_image_cover') || 'รูปภาพหน้าปก (Thumbnail)'}
            </label>
            <div className="flex flex-col items-start gap-4">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/jpeg, image/png, image/webp" className="hidden" />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()} 
                className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50 shadow-sm transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" /></svg>
                {/* {isEditMode && previewUrl ? 'เปลี่ยนรูปหน้าปก' : 'อัปโหลดรูปหน้าปก'} */}
                {t('attach_media') || 'อัปโหลดรูปหน้าปก'}
              </button>
              {previewUrl && (
                <div className="w-48 h-32 rounded-lg overflow-hidden border border-slate-200 shadow-sm relative group">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={isLoading}
              className="cursor-pointer w-full bg-[#1e3a8a] hover:bg-blue-900 text-white font-bold py-4 rounded-xl shadow-md transition-colors text-xl disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {isLoading 
                ? 'กำลังบันทึก...'
                : (isEditMode ? t('edit_resource_button') || 'บันทึกการแก้ไข' : t('create_resource_button') || 'สร้างข้อมูลใหม่')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateResource;