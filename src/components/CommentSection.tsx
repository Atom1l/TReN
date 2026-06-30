/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';

import ReportModal from '../components/ReportModal';

interface CommentSectionProps {
  postId: string;
  postType: 'event' | 'blog';
}

interface CommentData {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  parent_id: string | null;
  userProfile?: {
    first_name: string;
    last_name: string;
    profilepic: string;
  };
}

const CommentSection = ({ postId, postType }: CommentSectionProps) => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newComment, setNewComment] = useState('');
  
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  // 🟢 State สำหรับ Modal ลบคอมเมนต์
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, commentId: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  const { t, language } = useLanguage();
  
  const [isReportOpen, setIsReportOpen] = useState(false);

  const fetchComments = async () => {
    try {
      const targetColumn = postType === 'event' ? 'event_id' : 'blog_id';
      
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq(targetColumn, postId)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;

      if (commentsData && commentsData.length > 0) {
        const userIds = [...new Set(commentsData.map(c => c.user_id))];
        const { data: usersData, error: usersError } = await supabase
          .from('user')
          .select('id, first_name, last_name, profilepic')
          .in('id', userIds);

        if (!usersError && usersData) {
          const enrichedComments = commentsData.map(comment => ({
            ...comment,
            userProfile: usersData.find(u => u.id === comment.user_id)
          }));
          setComments(enrichedComments);
        } else {
          setComments(commentsData);
        }
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });
    fetchComments();
  }, [postId]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    
    if (language === 'th') {
      const thaiDate = date.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      const thaiTime = date.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
      });
      return `${thaiDate} เวลา ${thaiTime} น.`;
    } else {
      const enDate = date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).toUpperCase();
      const enTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).toUpperCase();
      return `${enDate} AT ${enTime}`;
    }
  };

  const handleSubmitComment = async (parentId: string | null = null) => {
    if (!currentUser) return alert('กรุณาเข้าสู่ระบบก่อนคอมเมนต์');
    
    const content = parentId ? replyContent : newComment;
    if (!content.trim()) return;

    setIsLoading(true);
    try {
      const targetColumn = postType === 'event' ? 'event_id' : 'blog_id';
      const insertData: any = {
        content: content.trim(),
        user_id: currentUser.id,
        [targetColumn]: postId
      };

      if (parentId) {
        insertData.parent_id = parentId;
      }

      const { error } = await supabase.from('comments').insert([insertData]);
      if (error) throw error;

      if (parentId) {
        setReplyContent('');
        setReplyingTo(null);
      } else {
        setNewComment('');
      }
      fetchComments();

    } catch (error: any) {
      console.error("Error posting comment:", error);
      alert('ไม่สามารถส่งคอมเมนต์ได้: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 🟢 เปลี่ยนมาเรียก Modal แทน window.confirm
  const handleDeleteClick = (commentId: string) => {
    setDeleteModal({ isOpen: true, commentId });
  };

  // 🟢 ฟังก์ชันยืนยันการลบที่เชื่อมกับ Modal
  const confirmDeleteComment = async () => {
    if (!deleteModal.commentId) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', deleteModal.commentId)
        .eq('user_id', currentUser?.id);

      if (error) throw error;
      
      fetchComments();
      setDeleteModal({ isOpen: false, commentId: '' });
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const renderComment = (comment: CommentData, depth: number = 0) => {
    const replies = comments.filter(c => c.parent_id === comment.id);
    const isMain = depth === 0;
    const maxDepthReached = depth >= 3; 

    return (
      <div key={comment.id} className={`${isMain ? 'border-b border-slate-100 pb-6 mb-6 last:border-0 last:mb-0' : `mt-5 ${maxDepthReached ? 'ml-2' : 'ml-8 sm:ml-12'}`} animate-fade-in`}>
        
        <div className="flex gap-3 sm:gap-4">
          <div className={`${isMain ? 'w-10 h-10 sm:w-12 sm:h-12' : 'w-8 h-8 sm:w-10 sm:h-10'} rounded-full bg-[#1e3a8a] flex-shrink-0 overflow-hidden text-white flex items-center justify-center font-bold text-sm sm:text-base`}>
            {comment.userProfile?.profilepic ? (
              <img src={comment.userProfile.profilepic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              comment.userProfile?.first_name?.charAt(0) || 'U'
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-bold text-slate-800 text-sm sm:text-base">
                {comment.userProfile?.first_name} {comment.userProfile?.last_name}
              </h4>
              <div className="text-xs text-slate-400 flex items-center gap-2 sm:gap-3 ">
                <span className="hidden sm:inline">{formatTime(comment.created_at)}</span>
                
                {currentUser && (
                  <button onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)} className="cursor-pointer hover:text-[#1e3a8a] font-medium transition-colors">
                    {t('reply') || 'ตอบกลับ'}
                  </button>
                )}
                {currentUser?.id === comment.user_id && (
                  // 🟢 กดลบเรียก Modal ขึ้นมาแทน
                  <button onClick={() => handleDeleteClick(comment.id)} className="cursor-pointer hover:text-red-500 font-medium transition-colors text-red-400">
                    {t('comment_delete') || 'ลบความคิดเห็น'}
                  </button>
                )}

                <button 
                  onClick={() => setIsReportOpen(true)} className="flex items-center gap-1.5 text-red-500 cursor-pointer text-sm pb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                    <line x1="4" y1="22" x2="4" y2="15" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="text-[10px] text-slate-400 sm:hidden mb-1">
              {formatTime(comment.created_at)}
            </div>

            <p className="text-slate-600 text-sm sm:text-base whitespace-pre-wrap break-words">{comment.content}</p>

            {replyingTo === comment.id && (
              <div className="mt-4 flex gap-2 sm:gap-3 animate-fade-in-up">
                <input 
                  type="text" 
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={t('write_a_comment') || 'เขียนความคิดเห็นของคุณที่นี่...'} 
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  autoFocus
                />
                <button 
                  onClick={() => handleSubmitComment(comment.id)}
                  disabled={isLoading || !replyContent.trim()}
                  className="cursor-pointer bg-[#1e3a8a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-900 transition-colors disabled:bg-slate-300"
                >
                  {t('post') || 'โพสต์'}
                </button>
              </div>
            )}
          </div>
        </div>

        {replies.length > 0 && (
          <div className={`${isMain ? '' : 'border-l-2 border-slate-100 pl-2 sm:pl-4'}`}>
            {replies.map(reply => renderComment(reply, depth + 1))}
          </div>
        )}
        
      </div>
    );
  };

  const topLevelComments = comments.filter(c => !c.parent_id);

  return (
    <div className="border-t border-slate-200 pt-10 relative">
      
      {/* 🟢 Modal ยืนยันการลบคอมเมนต์ */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col w-full max-w-sm animate-scale-in text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </div>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              {t('confirm_delete_comment') || 'คุณต้องการลบคอมเมนต์นี้ใช่หรือไม่?'} <br/>
              <span className="text-xs text-red-500 mt-1 inline-block">{t('delete_comment_warning') || '(การลบจะลบการตอบกลับย่อยทั้งหมดด้วย)'}</span>
            </p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={confirmDeleteComment} 
                disabled={isDeleting} 
                className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center cursor-pointer"
              >
                {isDeleting ? (t('deleting') || 'กำลังลบ...') : (t('delete') || 'ลบเลย')}
              </button>
              <button 
                onClick={() => setDeleteModal({ isOpen: false, commentId: '' })} 
                className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
              >
                {t('cancel') || 'ยกเลิก'}
              </button>
            </div>
          </div>
        </div>
      )}

      <h3 className="text-xl font-bold text-[#1e3a8a] mb-8">{t('share_comments')} ({comments.length})</h3>
      
      <div className="space-y-6 mb-10">
        {topLevelComments.length === 0 ? (
          <p className="text-slate-500 italic text-center py-4">{t('no_comments_yet')}</p>
        ) : (
          topLevelComments.map(comment => renderComment(comment, 0))
        )}
      </div>

      <div>
        <h3 className="text-xl font-bold text-[#1e3a8a] mb-2">{t('leave_a_reply')}</h3>
        {currentUser ? (
          <div className="mt-4 flex flex-col items-end gap-3">
            <textarea 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={t('write_a_comment') || 'เขียนความคิดเห็นของคุณที่นี่...'}
              rows={3}
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] resize-none text-slate-700"
            ></textarea>
            <button 
              onClick={() => handleSubmitComment(null)}
              disabled={isLoading || !newComment.trim()}
              className="cursor-pointer bg-[#1e3a8a] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-900 transition-colors shadow-sm disabled:bg-slate-300"
            >
              {t('post_comment') || 'โพสต์ความคิดเห็น'}
            </button>
          </div>
        ) : (
          <p className="text-slate-500 text-sm mb-4">{t('must_log_in_to_comment') || 'คุณต้องเข้าสู่ระบบก่อนจึงจะสามารถคอมเมนต์ได้'}</p>
        )}
      </div>

      <ReportModal 
        isOpen={isReportOpen} 
        onClose={() => setIsReportOpen(false)} 
        targetId={comments.length > 0 ? comments[0].id : postId} 
        targetType="comment" 
        targetTitle={comments.length > 0 ? comments[0].content : (postType === 'event' ? `Event ID: ${postId}` : `Blog ID: ${postId}`)}
      />
    </div>
  );
};

export default CommentSection;