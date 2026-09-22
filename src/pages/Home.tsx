/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';

// 1. นำเข้า Component ที่ต้องเห็นทันที (Above the fold)
import HeroSection from '../components/Homepage/HeroSection';

// 2. นำเข้า Component อื่นๆ แบบ Lazy Load (โหลดเมื่อจำเป็น ช่วยลดเวลา Init)
const AchievementsSection = lazy(() => import('../components/Homepage/AchievementsSection'));
const NewsSection = lazy(() => import('../components/Homepage/NewsSection'));
const GalleryCarousel = lazy(() => import('../components/Homepage/GalleryCarousel'));
const InfoModal = lazy(() => import('../components/Homepage/InfoModal'));

interface NewsItem {
  id: string;
  title: string;
  category: string;
  thumbnail_url: string;
  created_at: string;
}

const Home = () => {
  const { t } = useLanguage();

  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [showcases, setShowcases] = useState<any[]>([]);
  // 💡 ประกาศ State เก็บข้อมูลผลงานสมาชิก
  const [memberWorks, setMemberWorks] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);

  const [infoModal, setInfoModal] = useState<{ isOpen: boolean; type: 'onsite' | 'online' }>({
    isOpen: false,
    type: 'onsite'
  });

  const handleOpenInfoModal = useCallback((type: 'onsite' | 'online') => {
    setInfoModal({ isOpen: true, type });
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      setIsLoading(true);
      try {
        // 💡 เพิ่มคิวรี memberWorks เข้าไปใน Promise.all เพื่อดึงพร้อมกัน
        const [newsRes, showcaseRes, memberWorksRes] = await Promise.all([
          supabase
            .from('news')
            .select('id, title, category, thumbnail_url, created_at')
            .eq('status', 'published')
            .order('created_at', { ascending: false }),
          supabase
            .from('showcases') 
            .select('*')
            .eq('status', 'published') 
            .order('created_at', { ascending: false })
            .limit(3),
          // 💡 คิวรีใหม่สำหรับดึงข้อมูลตาราง member_works
          supabase
            .from('member_works')
            .select('id, title, thumbnail_url, created_at, author_name, author_data, tag, description')
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .limit(4)
        ]);

        if (newsRes.error) throw newsRes.error;
        if (newsRes.data) setNewsItems(newsRes.data as NewsItem[]);

        if (!showcaseRes.error && showcaseRes.data) {
          setShowcases(showcaseRes.data);
        }

        // 💡 อัปเดต State ผลงานสมาชิก ถ้าดึงมาสำเร็จ
        if (!memberWorksRes.error && memberWorksRes.data) {
          setMemberWorks(memberWorksRes.data);
        }

      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const activitySnapshots = newsItems.filter(n => n.category === 'activity_snapshot').slice(0, 3);
  const successStories = newsItems.filter(n => n.category === 'success_story').slice(0, 4);
  const announcements = newsItems.filter(n => n.category === 'announcement').slice(0, 4);
  const publicRelations = newsItems.filter(n => n.category === 'public_relations');

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 overflow-x-hidden">
      
      {/* ส่วนบนสุดที่โหลดทันที */}
      <HeroSection />

      {/* ส่วนที่เหลือถูกห่อด้วย Suspense (Lazy Loading) */}
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Loading components...</div>}>
        
        <InfoModal 
          isOpen={infoModal.isOpen} 
          onClose={() => setInfoModal({ ...infoModal, isOpen: false })}
          title={infoModal.type === 'onsite' 
            ? (t('modal_onsite_title') || 'รูปแบบการอบรม Onsite Training') 
            : (t('modal_online_title') || 'การให้คำปรึกษาออนไลน์ Online Mentoring')}
          fullLinkUrl={infoModal.type === 'onsite' ? "/training/onsite" : "/training/mentoring"}
          fullLinkText={t('read_full_details') || 'อ่านข้อมูลฉบับเต็ม'}
          content={
            infoModal.type === 'onsite' ? (
              <div className="space-y-6 text-xl text-slate-700 leading-relaxed font-light">
                <p>{t('modal_onsite_desc1')}</p>
                <p>{t('modal_onsite_desc2')} <strong className="font-bold text-[#1e3a8a]">{t('modal_onsite_bold1')}</strong>:</p>
                <ul className="space-y-4 pl-4 border-l-4 border-blue-200">
                  <li><strong className="font-bold text-[#1e3a8a]">{t('modal_onsite_li1_title')}</strong> {t('modal_onsite_li1_desc')}</li>
                  <li><strong className="font-bold text-[#1e3a8a]">{t('modal_onsite_li2_title')}</strong> {t('modal_onsite_li2_desc')}</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-6 text-xl text-slate-700 leading-relaxed font-light">
                <p>
                  {t('modal_online_desc1')} <strong className="font-bold text-[#1e3a8a]">"{t('modal_online_bold1')}"</strong> 
                  {t('modal_online_desc2')} <em className="font-medium text-[#1e3a8a]">Reflective Teacher</em> {t('modal_online_desc3')}
                </p>
              </div>
            )
          }
        />

        <AchievementsSection />
        
        {/* 💡 ส่ง Prop memberWorks ให้ NewsSection นำไปแสดงผลต่อ */}
        <NewsSection 
          announcements={announcements}
          activitySnapshots={activitySnapshots}
          successStories={successStories}
          publicRelations={publicRelations}
          memberWorks={memberWorks}
          showcases={showcases}
          isLoading={isLoading}
          onOpenInfoModal={handleOpenInfoModal} 
        />

        <GalleryCarousel />

      </Suspense>

    </div>
  );
};

export default Home;