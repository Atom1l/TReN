/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;      
  targetType: string;    
  targetTitle?: string;  
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, targetId, targetType, targetTitle }) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  
  const [reportCategory, setReportCategory] = useState('เนื้อหาไม่เหมาะสม');
  const [description, setDescription] = useState('');

  // 🟢 State สำหรับ Alert Modal ตัวใหม่
  const [alertModal, setAlertModal] = useState({ isOpen: false, type: 'success', message: '' });

  // 🟢 ฟังก์ชันเรียกใช้งาน Alert
  const showAlert = (type: 'success' | 'error', message: string, shouldCloseModal: boolean = false) => {
    setAlertModal({ isOpen: true, type, message });
    setTimeout(() => {
      setAlertModal({ isOpen: false, type: 'success', message: '' });
      // ถ้าส่งค่า shouldCloseModal เป็น true ให้ทำการปิด Modal แจ้งรายงานไปด้วยเลย (หลัง Alert หาย)
      if (shouldCloseModal) {
        onClose();
        setDescription(''); // เคลียร์ฟอร์ม
      }
    }, 2000);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      showAlert('error', 'กรุณาระบุรายละเอียดเพิ่มเติม');
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("กรุณาเข้าสู่ระบบก่อนทำการรายงาน");

      const currentUrl = window.location.href;

      const ticketData = {
        reporter_id: user.id, 
        target_id: targetId,  
        target_url: currentUrl, 
        type: 'comment_report', 
        status: 'in_progress',
        report_category: reportCategory,  
        // title: `[${targetType.toLocaleUpperCase()}] ${reportCategory} "${targetTitle || 'Untitled'}"`,
        title: `[${targetType.toLocaleUpperCase()}] : "${targetTitle}"`,
        description: description,
      };

      const { error } = await supabase.from('tickets').insert([ticketData]);
      if (error) throw error;

      // 🟢 แจ้งเตือนสำเร็จและบอกให้ฟังก์ชันปิด Modal หลักด้วย
      showAlert('success', t('report_submitted_success') || 'รายงานถูกส่งเรียบร้อยแล้ว', true);

    } catch (error: any) {
      console.error("Error submitting report:", error);
      // 🟢 แจ้งเตือน Error
      showAlert('error', error.message || t('report_submitted_error') || 'เกิดข้อผิดพลาดขณะส่งรายงาน. กรุณาลองใหม่อีกครั้ง.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      
      {/* 🟢 Alert Modal (เด้งทับ Modal นี้อีกทีด้วย z-[500]) */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
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
            {/* <h3 className={`text-2xl font-bold mb-2 ${alertModal.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
              <h3 className={`text-2xl font-bold mb-2 ${alertModal.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                {alertModal.type === 'success' ? (t('report_success') || 'Success!') : (t('report_error') || 'Error!')}
              </h3>
            </h3> */}
            <p className="text-slate-600 text-lg font-bold">{alertModal.message}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col w-full max-w-md animate-scale-in relative">
        
        {/* ปุ่มปิด */}
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center flex-shrink-0">
            {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg> */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="red" className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">{t('report_modal_title')}</h3>
            <p className="text-sm text-slate-500">{t('report_modal_desc')}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-2">{t('report_modal_category')}</label>
            <select 
              value={reportCategory} 
              onChange={(e) => setReportCategory(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none bg-white text-slate-700 cursor-pointer"
            >
              <option value="เนื้อหาไม่เหมาะสม">{t('report_category_inappropriate')}</option>
              <option value="ละเมิดลิขสิทธิ์">{t('report_category_copyright_infringement')}</option>
              <option value="สแปม / โฆษณาแอบแฝง">{t('report_category_spam_ads')}</option>
              <option value="ข้อมูลเท็จ">{t('report_category_false_information')}</option>
              <option value="ลิงก์เสีย / ใช้งานไม่ได้">{t('report_category_broken_links')}</option>
              <option value="อื่นๆ">{t('report_category_other')}</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-2">{t('report_modal_description')}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('report_modal_placeholder')}
              rows={4}
              required
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none resize-none text-slate-700"
            ></textarea>
          </div>

          <div className="pt-2 flex gap-3">
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors shadow-sm disabled:bg-slate-400 cursor-pointer"
            >
              {isLoading ? t('loading') : t('submit_report')}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-50"
            >
              {t('cancel')}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ReportModal;