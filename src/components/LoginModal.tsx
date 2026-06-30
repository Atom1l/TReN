/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useLanguage } from '../contexts/LanguageContext';

import { TEACHER_RANKS } from '../constants/TeacherRanks';
import { TEACHER_POSITIONS } from '../constants/TeacherPosition';
import { THAI_PROVINCES } from '../constants/Province';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

const LoginModal = ({ isOpen, onClose, defaultTab = 'login' }: LoginModalProps) => {
  const { t, language } = useLanguage();

  // 🟢 เพิ่มสถานะ 'forgot_password' เข้ามาใน Tab
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot_password'>(defaultTab);
  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [alertInfo, setAlertInfo] = useState({ show: false, type: 'success', message: '' });

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    school_name: '',
    province: '',
    position: 'teacher',
    rank: '',
    role: 'user',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showCustomAlert = (type: 'success' | 'error', message: string) => {
    setAlertInfo({ show: true, type, message });
    
    if (type === 'success') {
      setTimeout(() => {
        setAlertInfo({ show: false, type: 'success', message: '' });
        if (activeTab !== 'forgot_password') {
          onClose(); 
        }
      }, 1500);
    } else {
      setTimeout(() => {
        setAlertInfo({ show: false, type: 'success', message: '' });
      }, 3000); 
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;

      if (data.user) {
        const { data: userData, error: userError } = await supabase
          .from('user')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (userError) throw userError;

        if (userData?.role === 'banned') {
          await supabase.auth.signOut();
          throw new Error(t('account_suspended') || 'บัญชีของคุณถูกระงับการใช้งาน');
        }

        if (rememberMe) {
          localStorage.setItem('wasRememberMe', 'true');
        } else {
          localStorage.setItem('wasRememberMe', 'false');
          sessionStorage.setItem('tabSession', 'active');
        }
      }
      
      showCustomAlert('success', t('login_success') || 'เข้าสู่ระบบสำเร็จ!');
      
    } catch (error) {
      if (error instanceof Error) {
        showCustomAlert('error', error.message);
      } else {
        showCustomAlert('error', t('unknown_error') || 'เกิดข้อผิดพลาดที่ไม่รู้จัก');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const now = new Date();
        const thailandTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
        const { error: dbError } = await supabase
          .from('user')
          .insert([
            {
              id: authData.user.id,
              email: formData.email,
              first_name: formData.first_name, 
              last_name: formData.last_name,
              school_name: formData.school_name,
              province: formData.province,
              position: formData.position,
              rank: formData.rank,
              role: formData.role,
              register_date: thailandTime.toISOString()
            },
          ]);

        if (dbError) throw dbError;

        localStorage.setItem('wasRememberMe', 'true');
        showCustomAlert('success', t('register_success') || 'สมัครสมาชิกสำเร็จ!');
      }
    } catch (error) { 
      console.error("FULL ERROR:", error);
      
      let errorMsg = t('unknown_error') || 'เกิดข้อผิดพลาดที่ไม่รู้จัก';
      if (error instanceof Error) {
        errorMsg = error.message;
      } else if (typeof error === 'object' && error && 'error_description' in error) {
        errorMsg = (error as { error_description: string }).error_description;
      } else if (typeof error === 'object' && error) {
        errorMsg = JSON.stringify(error);
      }
      
      showCustomAlert('error', errorMsg); 
    } finally {
      setLoading(false);
    }
  };

  // 🟢 ฟังก์ชันสำหรับส่งอีเมลรีเซ็ตรหัสผ่าน
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      showCustomAlert('error', 'กรุณากรอกอีเมลของคุณ');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        // ให้ redirect กลับไปที่หน้าสร้างรหัสผ่านใหม่ (หน้านี้เดี๋ยวเราค่อยสร้าง)
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;
      
      showCustomAlert('success', 'ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณเรียบร้อยแล้ว!');
      // หน่วงเวลาให้คนใช้อ่าน Alert ทัน แล้วพากลับไปหน้า Login
      setTimeout(() => {
        setActiveTab('login');
      }, 2500);

    } catch (error: any) {
      console.error("Reset Password Error:", error);
      showCustomAlert('error', error.message || 'เกิดข้อผิดพลาดในการส่งอีเมล');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 min-h-screen bg-slate-900/70 backdrop-blur-2xl z-[100] flex items-center justify-center p-4 transition-opacity duration-300">
      
      <div className="max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-slate-100 p-8 transform transition-all duration-300 scale-100 opacity-100 relative custom-scrollbar">
        
        {alertInfo.show && (
          <div className={`absolute top-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-3.5 rounded-xl shadow-lg text-white font-semibold transition-all duration-300 w-max max-w-[90%] ${alertInfo.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
            {alertInfo.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 flex-shrink-0"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 flex-shrink-0"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
            )}
            <span className="text-center">{alertInfo.message}</span>
          </div>
        )}

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 🟢 ซ่อนปุ่มสลับ Login/Register ถ้าย้ายมาอยู่หน้า Forgot Password */}
        {activeTab !== 'forgot_password' && (
          <div className="flex border-b border-slate-100 mt-6 mb-8">
            <button 
              onClick={() => setActiveTab('login')}
              className={`flex-1 text-center py-3 text-xl font-bold transition-colors relative cursor-pointer ${activeTab === 'login' ? 'text-primary' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {t('login_tab') || 'เข้าสู่ระบบ'}
              {activeTab === 'login' && <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-primary rounded-t-full"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('register')}
              className={`flex-1 text-center py-3 text-xl font-bold transition-colors relative cursor-pointer ${activeTab === 'register' ? 'text-primary' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {t('register_tab') || 'สมัครสมาชิก'}
              {activeTab === 'register' && <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-primary rounded-t-full"></div>}
            </button>
          </div>
        )}

        <div className="space-y-6">
          {/* 🟢 แยกฟอร์มแสดงผลตาม activeTab */}
          {activeTab === 'forgot_password' ? (
            <form onSubmit={handleResetPassword} className="space-y-5 mt-6 animate-fade-in">
              <div className="mb-6 text-center">
                <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{t('forgot_password') || 'ลืมรหัสผ่าน?'}</h3>
                <p className="text-slate-500 text-sm">กรุณากรอกอีเมลของคุณที่ใช้ลงทะเบียน<br/>ระบบจะทำการส่งลิงก์รีเซ็ตรหัสผ่านไปให้</p>
              </div>

              <div>
                <label className="block text-md md:text-lg font-medium text-slate-700 mb-1">{t('email') || 'อีเมล'}</label>
                <input type="email"
                  name="email"             
                  value={formData.email}  
                  onChange={handleChange} 
                  required className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-input-bg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" placeholder="your.name@kmutt.ac.th" />
              </div>

              <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-secondary text-white py-3.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-primary/20 text-xl mt-4 cursor-pointer disabled:bg-slate-400">
                {loading ? (t('processing') || 'กำลังส่งอีเมล...') : 'ส่งลิงก์รีเซ็ตรหัสผ่าน'}
              </button>

              <div className="mt-4 text-center">
                <button 
                  type="button" 
                  onClick={() => {
                    setActiveTab('login');
                    setAlertInfo({ show: false, type: 'success', message: '' }); 
                  }} 
                  className="text-slate-500 hover:text-primary font-medium hover:underline transition-all cursor-pointer"
                >
                  ย้อนกลับไปหน้าเข้าสู่ระบบ
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={activeTab === 'login' ? handleLogin : handleRegister} className="space-y-5 animate-fade-in">
              
              {activeTab === 'login' && (
                <>
                  <div>
                    <label className="block text-md md:text-lg font-medium text-slate-700 mb-1">{t('email') || 'อีเมล'}</label>
                    <input type="email"
                      name="email"             
                      value={formData.email}  
                      onChange={handleChange} 
                      required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-input-bg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" placeholder="your.name@kmutt.ac.th" />
                  </div>

                  <div>
                    <label className="block text-md md:text-lg font-medium text-slate-700 mb-1">{t('password') || 'รหัสผ่าน'}</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"}
                        name="password"    
                        value={formData.password}  
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-input-bg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" 
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors cursor-pointer p-2">
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer accent-primary" 
                      />
                      <span className="text-md md:text-lg pt-1 text-slate-600 group-hover:text-slate-900 transition-colors select-none">{t('remember_me') || 'จดจำฉันไว้'}</span>
                    </label>
                    <button 
                      type="button" 
                      onClick={() => {
                        setActiveTab('forgot_password');
                        setAlertInfo({ show: false, type: 'success', message: '' }); 
                      }}
                      className="text-md md:text-lg pt-1 text-primary font-semibold hover:underline decoration-2 underline-offset-1 cursor-pointer"
                    >
                      {t('forgot_password') || 'ลืมรหัสผ่าน?'}
                    </button>
                  </div>
                </>
              )}

              {activeTab === 'register' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-md md:text-lg font-medium text-slate-700 mb-1.5">{t('first_name') || 'ชื่อจริง'}</label>
                      <input 
                        type="text" 
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required 
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-input-bg text-md md:text-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-md md:text-lg font-medium text-slate-700 mb-1.5">{t('last_name') || 'นามสกุล'}</label>
                      <input 
                        type="text" 
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required 
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-input-bg text-md md:text-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-md md:text-lg font-medium text-slate-700 mb-1.5">{t('school') || 'โรงเรียน'}</label>
                      <input 
                        type="text" 
                        name="school_name"
                        value={formData.school_name}
                        onChange={handleChange}
                        required 
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-input-bg text-md md:text-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-md md:text-lg font-medium text-slate-700 mb-1.5">{t('province') || 'จังหวัด'}</label>
                      <select 
                          name="province"
                          value={formData.province}
                          onChange={handleChange}
                          required 
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white 
                          transition-all outline-none focus:outline-none focus-visible:outline-none
                          focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer
                          appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%2364748b%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22m19%209-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] 
                          bg-[length:1.25rem] bg-no-repeat 
                          bg-[right_0.6rem_center]"
                      >
                          <option value="" disabled>{t('school_province_placeholder') || 'จังหวัดของโรงเรียน'}</option>
                          {THAI_PROVINCES.map((province) => (
                          <option key={province.value} value={province.value}>
                              {/* 🟢 ใช้เงื่อนไขให้แปลง key ของจังหวัดเป็นภาษาอังกฤษ (เช่น chiang_mai -> Chiang Mai) */}
                              {language === 'en' 
                                ? province.value.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') 
                                : province.label}
                          </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-md md:text-lg font-medium text-slate-700 mb-1.5">{t('position') || 'ตำแหน่ง'}</label>
                      <div className="flex flex-col md:flex-row gap-4">
                      {TEACHER_POSITIONS.map((pos: any) => (
                        <label key={pos.value} className={`flex-1 flex items-center justify-between px-4 py-3 border-2 rounded-2xl cursor-pointer transition-all ${formData.position === pos.value ? 'border-primary bg-slate-50 text-primary' : 'border-slate-100 bg-slate-50 text-slate-500'}`}>
                          <div className="flex items-center gap-3">
                            <input type="radio" name="position" value={pos.value} checked={formData.position === pos.value} onChange={handleChange} className="w-5 h-5 accent-primary cursor-pointer" />
                            <span className="font-semibold">
                              {/* 🟢 แสดงภาษาอังกฤษถ้าถูกกำหนดไว้ */}
                              {language === 'en' && pos.labelEn ? pos.labelEn : pos.label}
                            </span>
                          </div>
                          {formData.position === pos.value && <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" /></svg>}
                        </label>
                      ))}
                    </div>
                    </div>
                    <div>
                      <label className="block text-md md:text-lg font-medium text-slate-700 mb-1.5">{t('academic_rank') || 'วิทยฐานะ'}</label>
                      <select 
                          required 
                          name="rank" 
                          value={formData.rank} 
                          onChange={handleChange} 
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white 
                          transition-all outline-none focus:outline-none focus-visible:outline-none
                          focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer
                          appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%2364748b%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22m19%209-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] 
                          bg-[length:1.25rem] bg-no-repeat 
                          bg-[right_0.6rem_center]"
                      >
                        <option value="" disabled>{t('teacher_rank_placeholder') || 'วิทยฐานะของคุณครู'}</option>
                          {TEACHER_RANKS.map((rank: any) => (
                              <option key={rank.value} value={rank.value}>
                                {/* 🟢 แสดงภาษาอังกฤษถ้าถูกกำหนดไว้ */}
                                {language === 'en' && rank.labelEn ? rank.labelEn : rank.label}
                              </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-md md:text-lg font-medium text-slate-700 mb-1.5">{t('email') || 'อีเมล'}</label>
                      <input name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-input-bg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                    </div>
                    <div>
                      <label className="block text-md md:text-lg font-medium text-slate-700 mb-1.5">{t('password') || 'รหัสผ่าน'}</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          name="password" 
                          value={formData.password} 
                          onChange={handleChange} 
                          required 
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-primary/20 outline-none pr-12" 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors cursor-pointer p-1"
                        >
                          {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-secondary text-white py-3.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-primary/20 text-2xl mt-4 cursor-pointer disabled:bg-slate-400">
                {loading ? (t('processing') || 'กำลังดำเนินการ...') : (activeTab === 'login' ? (t('login_tab') || 'เข้าสู่ระบบ') : (t('register_tab') || 'สมัครสมาชิก'))}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  )
}

export default LoginModal