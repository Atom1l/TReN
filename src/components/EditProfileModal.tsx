/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react'; // เพิ่ม useRef
import { supabase } from '../lib/supabaseClient';
import { THAI_PROVINCES } from '../constants/Province';
import { TEACHER_RANKS } from '../constants/TeacherRanks';
import { useLanguage } from '../contexts/LanguageContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: any; 
  onSaveSuccess: () => void; 
}

const EditProfileModal = ({ isOpen, onClose, userData, onSaveSuccess }: EditProfileModalProps) => {
  const { t } = useLanguage();

  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ show: false, type: 'success', message: '' });

  // State สำหรับจัดการไฟล์รูปภาพ
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    school_name: '',
    province: '',
    position: '',
    rank: '',
    email: '',
    password: '', 
    bio: '',
  });

  useEffect(() => {
    if (userData && isOpen) {
      setFormData({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        school_name: userData.school_name || '',
        province: userData.province || '',
        position: userData.position || '',
        rank: userData.rank || '',
        email: userData.email || '',
        password: '',
        bio: userData.bio || '',
      });
      // เคลียร์ไฟล์รูปภาพที่เลือกไว้ทุกครั้งที่เปิด Modal
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [userData, isOpen]);

  // คืนหน่วยความจำเมื่อ Component ถูกปิด
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!isOpen) return null;

  const getInitials = (first: string) => {
    return `${first?.charAt(0) || ''}`.toUpperCase();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ฟังก์ชันจัดการเมื่อผู้ใช้เลือกไฟล์
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // ตรวจสอบนามสกุลไฟล์
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        showCustomAlert('error', 'รองรับเฉพาะไฟล์ JPG, PNG และ WEBP เท่านั้น');
        return;
      }

      // ตรวจสอบขนาดไฟล์ (ไม่เกิน 5MB - อันนี้เผื่อไว้)
      if (file.size > 5 * 1024 * 1024) {
        showCustomAlert('error', 'ขนาดไฟล์ต้องไม่เกิน 5MB');
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const showCustomAlert = (type: 'success' | 'error', message: string) => {
    setAlertInfo({ show: true, type, message });
    
    if (type === 'success') {
      setTimeout(() => {
        setAlertInfo({ show: false, type: 'success', message: '' });
        onSaveSuccess();
        onClose();
      }, 1500);
    } else {
      setTimeout(() => {
        setAlertInfo({ show: false, type: 'success', message: '' });
      }, 3000);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let finalProfilePicUrl = userData?.profilepic;

      // 1. ถ้ามีการเลือกไฟล์ใหม่
      if (selectedFile) {
        // --- ส่วนที่เพิ่มเข้ามาใหม่: ลบรูปเก่า ---
        if (userData?.profilepic) {
          try {
            // ดึงชื่อไฟล์จาก URL เดิม (ปกติจะเป็นส่วนสุดท้ายของ URL)
            const oldFileName = userData.profilepic.split('/').pop();
            if (oldFileName) {
              await supabase.storage
                .from('avatars')
                .remove([oldFileName]);
            }
          } catch (error) {
            console.error("Error deleting old avatar:", error);
            // ไม่ต้อง throw error เพื่อให้การอัปโหลดใหม่ดำเนินต่อไปได้
          }
        }
        // ------------------------------------

        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${userData.id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, selectedFile, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        finalProfilePicUrl = publicUrl;
      }

      // 2. อัปเดตข้อมูลในตาราง user
      const { error: dbError } = await supabase
        .from('user')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          school_name: formData.school_name,
          province: formData.province,
          position: formData.position,
          rank: formData.rank,
          bio: formData.bio,
          profilepic: finalProfilePicUrl
        })
        .eq('id', userData.id);

      if (dbError) throw dbError;

      // ... ส่วนรหัสผ่านเดิม ...
      if (formData.password.trim() !== '') {
        const { error: authError } = await supabase.auth.updateUser({
          password: formData.password
        });
        if (authError) throw authError;
      }

      showCustomAlert('success', t('save_success') || 'บันทึกข้อมูลเรียบร้อยแล้ว');

      window.dispatchEvent(new Event('profileUpdated'));
      
    } catch (error: any) {
      console.error('Error updating profile:', error);
      showCustomAlert('error', `${t('save_error') || 'เกิดข้อผิดพลาด:'} ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // กำหนดรูปที่จะแสดง: ถ้ามีรูป preview ให้โชว์ก่อน ถ้าไม่มีไปโชว์รูปจาก DB
  const displayImage = previewUrl || userData?.profilepic;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      
      <div className="bg-[#F8FAFC] rounded-2xl w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[90vh] animate-scale-in">
        
        {/* === Custom Alert Pop-up === */}
        {alertInfo.show && (
          <div className={`absolute top-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-3.5 rounded-xl shadow-lg text-white font-semibold transition-all duration-300 ${alertInfo.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
            {alertInfo.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 flex-shrink-0"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 flex-shrink-0"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
            )}
            <span>{alertInfo.message}</span>
          </div>
        )}

        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-200 flex justify-between items-center bg-white rounded-t-2xl">
          <h2 className="text-2xl font-bold text-[#1e3a8a]">{t('edit_profile_title') || 'Edit Profile Info'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-white">
          
          {/* Photo Edit */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-[#1e3a8a] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md overflow-hidden relative group">
              {displayImage ? (
                <img src={displayImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                getInitials(formData.first_name)
              )}
            </div>

            {/* Input ซ่อนเอาไว้รับค่าไฟล์ */}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/jpeg, image/png, image/webp" 
              onChange={handleFileChange} 
            />
            
            <button 
              onClick={() => fileInputRef.current?.click()} // กดปุ่มนี้ให้ไปเรียก click ที่ input ที่ซ่อนไว้
              className="border border-slate-300 text-slate-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
            >
              {t('edit_profile_change_photo') || 'Change Photo'}
            </button>
            {/* แสดงชื่อไฟล์เมื่ออัปโหลด */}
            {selectedFile && <span className="text-xs text-emerald-600 font-medium">เลือกไฟล์แล้ว: {selectedFile.name}</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-slate-500 font-semibold mb-2">{t('first_name') || 'First Name'}</label>
              <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-2">{t('last_name') || 'Last Name'}</label>
              <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none" />
            </div>
            
            <div>
              <label className="block text-slate-500 font-semibold mb-2">{t('school') || 'School'}</label>
              <input type="text" name="school_name" value={formData.school_name} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none" />
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-2">{t('province') || 'Province'}</label>
              <select name="province" value={formData.province} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none bg-white cursor-pointer">
                <option value="">{t('select_province') || 'เลือกจังหวัด'}</option>
                {THAI_PROVINCES.map((prov) => (
                  <option key={prov.value} value={prov.value}>{prov.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Position (Radio) */}
          <div className="mb-6">
            <label className="block text-slate-500 font-semibold mb-3">{t('position') || 'Position'}</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                <input type="radio" name="position" value="teacher" checked={formData.position === 'teacher'} onChange={handleChange} className="w-4 h-4 text-[#1e3a8a] focus:ring-[#1e3a8a] cursor-pointer" />
                {t('teacher') || 'Teacher'}
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                <input type="radio" name="position" value="assistant_teacher" checked={formData.position === 'assistant_teacher'} onChange={handleChange} className="w-4 h-4 text-[#1e3a8a] focus:ring-[#1e3a8a] cursor-pointer" />
                {t('assistant_teacher') || 'Nanny teacher / Assistant'}
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-slate-500 font-semibold mb-2">{t('academic_rank') || 'Academic Rank'}</label>
            <select name="rank" value={formData.rank} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none bg-white cursor-pointer">
              <option value="">{t('select_rank') || 'เลือกวิทยฐานะ'}</option>
              {TEACHER_RANKS.map((rank) => (
                <option key={rank.value} value={rank.value}>{rank.label}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-slate-500 font-semibold mb-2">{t('email') || 'Email'}</label>
            <input type="email" name="email" value={formData.email} disabled className="w-full p-3 border border-slate-300 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed" />
            <p className="text-xs text-slate-400 mt-1">{t('cannot_change_email') || '* ไม่สามารถเปลี่ยนอีเมลได้ในหน้านี้'}</p>
          </div>

          <div className="mb-6">
            <label className="block text-slate-500 font-semibold mb-2">{t('password_label') || 'Password (Leave blank to keep current)'}</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full p-3 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1e3a8a] cursor-pointer transition-colors">
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                )}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-slate-500 font-semibold mb-2">{t('bio') || 'Bio'}</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none custom-scrollbar resize-none"></textarea>
          </div>
        </div>

        {/* Footer (Buttons) */}
        <div className="px-8 py-5 border-t border-slate-200 bg-white rounded-b-2xl flex gap-4">
          <button onClick={handleSave} disabled={isSaving} className="bg-[#1e3a8a] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-900 transition-colors disabled:bg-slate-400 cursor-pointer">
            {isSaving ? t('edit_profile_saving') || 'Saving...' : t('edit_profile_save') || 'Save Changes'}
          </button>
          <button onClick={onClose} className="bg-white text-slate-600 border border-slate-300 px-6 py-2.5 rounded-lg font-bold hover:bg-slate-50 transition-colors cursor-pointer">
            {t('edit_profile_cancel') || 'Cancel'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditProfileModal;