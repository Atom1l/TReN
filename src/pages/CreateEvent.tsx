/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';

const CreateEvent = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const { id } = useParams(); 
  const isEditMode = !!id; 

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPostDetails, setShowPostDetails] = useState(true);

  const [alertInfo, setAlertInfo] = useState({ show: false, type: 'success', message: '' });

  // 🟢 1. กำหนดค่าเริ่มต้นของเวลาเป็น 08:00 และ 16:00
  const [formData, setFormData] = useState({
    title: '',
    event_date: '',
    start_time: '08:00', 
    end_time: '16:00',   
    location: '',
    brief_description: '',
    about_event: '',
  });

  const [links, setLinks] = useState([{ title: '', url: '' }]);

  const showCustomAlert = (type: 'success' | 'error', message: string, redirectPath?: string) => {
    setAlertInfo({ show: true, type, message });
    if (type === 'success') {
      setTimeout(() => {
        setAlertInfo({ show: false, type: 'success', message: '' });
        if (redirectPath) {
           navigate(redirectPath);
        } else if (isEditMode) {
           navigate(-1); 
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
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    if (isEditMode) {
      const fetchEventData = async () => {
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
            .from('events')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;

          if (data) {
            const isOwner = data.created_by === user.id;
            const isPrivileged = ['admin', 'co_admin', 'developer'].includes(userRole);

            if (!isOwner && !isPrivileged) {
              showCustomAlert('error', t('no_permission') || 'คุณไม่มีสิทธิ์เข้าถึงหรือแก้ไขกิจกรรมนี้', '/events');
              return; 
            }

            // 🟢 2. ดึงเวลามาจากฐานข้อมูลมาแยกใส่ฟอร์ม
            let start = '08:00', end = '16:00';
            if (data.event_time) {
              const timeParts = data.event_time.split(' - ');
              start = timeParts[0] || '08:00';
              end = timeParts[1] || '16:00';
            }

            setFormData({
              title: data.title || '',
              event_date: data.event_date ? data.event_date.split('T')[0] : '', 
              start_time: start,
              end_time: end,
              location: data.location || '',
              brief_description: data.brief_description || '',
              about_event: data.full_recap_content || '',
            });

            if (data.resource_links && Array.isArray(data.resource_links) && data.resource_links.length > 0) {
              setLinks(data.resource_links);
            }

            if (data.thumbnail_url) {
              setPreviewUrl(data.thumbnail_url);
            }
          }
        } catch (error) {
          console.error("Error fetching event for edit:", error);
          showCustomAlert('error', 'ไม่สามารถดึงข้อมูลกิจกรรมได้', '/events');
        } finally {
          setIsLoading(false);
        }
      };

      fetchEventData();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    setIsLoading(true);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("กรุณาเข้าสู่ระบบก่อนดำเนินการ");

      const { data: userData } = await supabase.from('user').select('role').eq('id', user.id).single();
      const userRole = userData?.role?.toLowerCase() || 'user';
      
      const targetEventState = (userRole === 'admin' || userRole === 'developer') ? 'published' : 'pending';

      let thumbnailUrl = previewUrl; 
      
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `event-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('thumbnails') 
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('thumbnails')
          .getPublicUrl(fileName);

        thumbnailUrl = publicUrl;
      }

      const combinedTime = `${formData.start_time} - ${formData.end_time}`;
      const validLinks = links.filter(link => link.url.trim() !== '');

      const eventDataToSave: any = {
        title: formData.title,
        event_date: formData.event_date ? new Date(formData.event_date).toISOString() : null,
        event_time: combinedTime,
        location: formData.location,
        brief_description: formData.brief_description,
        full_recap_content: formData.about_event, 
        thumbnail_url: thumbnailUrl,
        resource_links: validLinks, 
        event_state: targetEventState 
      };

      if (isEditMode) {
        const { error: updateError } = await supabase
          .from('events')
          .update(eventDataToSave)
          .eq('id', id);

        if (updateError) throw updateError;

        const successMsg = targetEventState === 'pending' 
          ? t('edit_event_success_pending') || 'บันทึกการเปลี่ยนแปลงเรียบร้อยแล้ว! โปรดรอการตรวจสอบจากทีมงาน'
          : t('edit_event_success') || 'บันทึกการเปลี่ยนแปลงเรียบร้อยแล้ว!';
          
        showCustomAlert('success', successMsg);

      } else {
        eventDataToSave.created_by = user.id;
        eventDataToSave.status = 'upcoming';

        const { error: insertError } = await supabase
          .from('events')
          .insert([eventDataToSave]);

        if (insertError) throw insertError;
        showCustomAlert('success', t('create_event_success') || 'สร้างกิจกรรมเรียบร้อยแล้ว!');
      }

    } catch (error: any) {
      console.error("Error submitting event:", error);
      showCustomAlert('error', `เกิดข้อผิดพลาด: ${error.message}`);
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 6M6 6l12 12" /></svg>
              </div>
            )}
            <p className="text-slate-600 font-bold text-lg">{alertInfo.message}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mt-8 mb-10">
        <h1 className="text-4xl lg:text-5xl font-bold text-[#1e3a8a] mb-2">
          {isEditMode ? (t('edit_event_title') || 'Edit Event') : (t('create_event_title') || 'Create an Event')}
        </h1>
        <p className="text-md lg:text-lg text-slate-500">
          {isEditMode ? 'Update the details of your event below.' : (t('create_event_desc') || 'Create an event schedule for people to attend.')}
        </p>
      </div>

      <div className="max-w-3xl mx-auto bg-[#F4F6F9] rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-slate-600 font-semibold mb-2 text-lg">{t('creat_event_name') || 'Event Name'}<span className='text-red-500 ml-1'>*</span></label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] bg-white" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-600 font-semibold mb-2 text-lg">{t('event_date') || 'Date'}<span className='text-red-500 ml-1'>*</span></label>
              <input type="date" name="event_date" value={formData.event_date} onChange={handleChange} required className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] bg-white" />
            </div>

            {/* 🟢 3. เปลี่ยนจาก <input type="time"> เป็น Dropdown Custom 24H */}
            <div>
              <label className="block text-slate-600 font-semibold mb-2 text-lg">{t('event_time') || 'Time'}<span className='text-red-500 ml-1'>*</span></label>
              <div className="flex items-center gap-2">
                
                {/* เวลาเริ่มต้น */}
                <div className="flex items-center gap-1 w-full bg-white border border-slate-200 rounded-xl px-2 py-2.5 focus-within:ring-2 focus-within:ring-[#1e3a8a] transition-all">
                  <select 
                    value={formData.start_time.split(':')[0] || '08'} 
                    onChange={(e) => setFormData({ ...formData, start_time: `${e.target.value}:${formData.start_time.split(':')[1] || '00'}` })}
                    className="bg-transparent text-slate-700 outline-none cursor-pointer font-medium text-center w-full appearance-none"
                  >
                    {Array.from({ length: 24 }).map((_, i) => <option className='h-[100px]' key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</option>)}
                  </select>
                  <span className="text-slate-400 font-bold">:</span>
                  <select 
                    value={formData.start_time.split(':')[1] || '00'} 
                    onChange={(e) => setFormData({ ...formData, start_time: `${formData.start_time.split(':')[0] || '08'}:${e.target.value}` })}
                    className="bg-transparent text-slate-700 outline-none cursor-pointer font-medium text-center w-full appearance-none"
                  >
                    {Array.from({ length: 60 }).map((_, i) => <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</option>)}
                  </select>
                </div>

                <span className="text-slate-400 font-bold">-</span>
                
                {/* เวลาสิ้นสุด */}
                <div className="flex items-center gap-1 w-full bg-white border border-slate-200 rounded-xl px-2 py-2.5 focus-within:ring-2 focus-within:ring-[#1e3a8a] transition-all">
                  <select 
                    value={formData.end_time.split(':')[0] || '16'} 
                    onChange={(e) => setFormData({ ...formData, end_time: `${e.target.value}:${formData.end_time.split(':')[1] || '00'}` })}
                    className="bg-transparent text-slate-700 outline-none cursor-pointer font-medium text-center w-full appearance-none"
                  >
                    {Array.from({ length: 24 }).map((_, i) => <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</option>)}
                  </select>
                  <span className="text-slate-400 font-bold">:</span>
                  <select 
                    value={formData.end_time.split(':')[1] || '00'} 
                    onChange={(e) => setFormData({ ...formData, end_time: `${formData.end_time.split(':')[0] || '16'}:${e.target.value}` })}
                    className="bg-transparent text-slate-700 outline-none cursor-pointer font-medium text-center w-full appearance-none"
                  >
                    {Array.from({ length: 60 }).map((_, i) => <option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</option>)}
                  </select>
                </div>

              </div>
            </div>

            <div className='md:col-span-2'>
              <label className="block text-slate-600 font-semibold mb-2 text-lg">{t('event_location') || 'Location'}<span className='text-red-500 ml-1'>*</span></label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] bg-white" />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-2 text-lg">{t('event_brief_description') || 'Brief Description'}<span className='text-red-500 ml-1'>*</span></label>
            <textarea name="brief_description" value={formData.brief_description} onChange={handleChange} rows={4} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] bg-white resize-none"></textarea>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-2 text-lg">{t('add_image_cover') || 'Add Image Cover'}{!isEditMode && <span className='text-red-500 ml-1'>*</span>}</label>
            <div className="flex flex-col items-start gap-4">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/jpeg, image/png, image/webp" className="hidden" />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" /></svg>
                {t('attach_media') || (isEditMode ? 'Change Image Cover' : 'Attach Media')}
              </button>
              {previewUrl && (
                <div className="w-48 h-32 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="pt-4">
            <div className="flex items-center justify-between cursor-pointer border-b border-slate-300 pb-2" onClick={() => setShowPostDetails(!showPostDetails)}>
              <h3 className="text-[#1e3a8a] font-bold text-lg">{t('post_event_details') || 'Post Event Details'}</h3>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${showPostDetails ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
            </div>
            
            <div className={`grid transition-all duration-500 ease-in-out ${showPostDetails ? 'grid-rows-[1fr] opacity-100 mt-6 mb-8' : 'grid-rows-[0fr] opacity-0 m-0'}`}>
              <div className="overflow-hidden">
                <div className="space-y-6">
                  <div>
                    <label className="flex items-baseline gap-2 text-slate-600 font-semibold mb-2 text-lg">
                      {t('about_event') || 'About Event'}
                      <span className="text-[#1e3a8a] font-normal text-xs">{t('conclude_info') || '(Conclude info after Event end)'}</span>
                    </label>
                    <textarea name="about_event" value={formData.about_event} onChange={handleChange} rows={5} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1e3a8a] bg-white resize-none"></textarea>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-baseline gap-2 text-slate-600 font-semibold text-lg">
                        {t('resource_link') || 'Resource Links'}
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
                            placeholder="ชื่อลิงก์ เช่น สไลด์, สมัครเข้าร่วม..." 
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
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={isLoading}
              className="cursor-pointer w-full bg-[#1e3a8a] hover:bg-blue-900 text-white font-bold py-4 rounded-xl shadow-md transition-colors text-xl disabled:bg-slate-400"
            >
              {isLoading 
                ? (isEditMode ? 'Saving...' : (t('event_creating') || 'Creating...')) 
                : (isEditMode ? (t('event_save_changes') || 'Save Changes') : (t('event_submit_btn') || 'Create an Event'))}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateEvent;