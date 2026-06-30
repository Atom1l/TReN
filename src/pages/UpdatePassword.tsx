/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';

const UpdatePassword = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ show: false, type: 'success', message: '' });

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        showCustomAlert('error', t('invalid_reset_link') || 'ลิงก์ไม่ถูกต้อง หรือหมดอายุแล้ว กรุณาขอลิงก์รีเซ็ตรหัสผ่านใหม่อีกครั้ง');
      }
    };
    checkSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showCustomAlert = (type: 'success' | 'error', message: string) => {
    setAlertInfo({ show: true, type, message });
    if (type === 'success') {
      setTimeout(() => {
        setAlertInfo({ show: false, type: 'success', message: '' });
        navigate('/');
      }, 3000);
    } else {
      setTimeout(() => {
        setAlertInfo({ show: false, type: 'success', message: '' });
      }, 4000);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      showCustomAlert('error', t('password_min_length') || 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    if (password !== confirmPassword) {
      showCustomAlert('error', t('password_mismatch') || 'รหัสผ่านทั้งสองช่องไม่ตรงกัน');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      showCustomAlert('success', t('password_update_success') || 'เปลี่ยนรหัสผ่านสำเร็จ! คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้แล้ว');
      
      await supabase.auth.signOut();

    } catch (error: any) {
      console.error("Update Password Error:", error);
      
      let errorMsg = error.message || '';

      // 🟢 ดักจับข้อความ Error จาก Supabase เพื่อนำมาแปลภาษา
      const lowerCaseError = errorMsg.toLowerCase();
      
      if (lowerCaseError.includes('different from the old password') || lowerCaseError.includes('should not be the same')) {
        errorMsg = t('error_same_password') || 'รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสผ่านเดิม';
      } else if (lowerCaseError.includes('weak password')) {
        errorMsg = t('error_weak_password') || 'รหัสผ่านคาดเดาง่ายเกินไป กรุณาใช้รหัสผ่านที่รัดกุมกว่านี้';
      } else {
        // ถ้าเป็นข้อความอื่นที่ไม่ได้ดักไว้ จะครอบด้วย fallback
        errorMsg = t('password_update_error') || errorMsg || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน';
      }

      showCustomAlert('error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      
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
            <p className="text-slate-600 font-bold text-lg">{alertInfo.message}</p>
            {alertInfo.type === 'error' && (
              <button onClick={() => navigate('/')} className="mt-6 text-[#1e3a8a] font-bold hover:underline cursor-pointer">
                {t('back_to_home') || 'กลับสู่หน้าหลัก'}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 sm:p-10 border border-slate-100 animate-fade-in-up">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 text-[#1e3a8a] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">{t('update_password_title') || 'ตั้งรหัสผ่านใหม่'}</h2>
          <p className="text-slate-500">{t('update_password_desc') || 'กรุณากำหนดรหัสผ่านใหม่ของคุณเพื่อเข้าสู่ระบบ'}</p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-5">
          
          {/* New Password */}
          <div>
            <label className="block text-md font-medium text-slate-700 mb-1.5">{t('new_password') || 'รหัสผ่านใหม่'}</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                value={password}  
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={t('password_min_length_hint') || "อย่างน้อย 6 ตัวอักษร"}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all outline-none" 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1e3a8a] transition-colors cursor-pointer p-2">
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                )}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-md font-medium text-slate-700 mb-1.5">{t('confirm_new_password') || 'ยืนยันรหัสผ่านใหม่'}</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}  
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder={t('confirm_password_placeholder') || 'กรอกรหัสผ่านใหม่อีกครั้ง'}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] transition-all outline-none" 
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1e3a8a] transition-colors cursor-pointer p-2">
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                )}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || !password || !confirmPassword} 
            className="w-full bg-[#1e3a8a] hover:bg-blue-900 text-white py-3.5 rounded-xl font-bold transition-all shadow-md text-lg mt-6 cursor-pointer disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {loading ? t('edit_profile_saving') || 'กำลังประมวลผล...' : t('confirm_new_password') || 'บันทึกรหัสผ่านใหม่'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;