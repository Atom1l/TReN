import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const galleryImages = [
  "/Training/Onsite_12.webp",
  "/Training/Onsite_10.webp",
  "/Training/Onsite_25.webp",
  "/Homepage/cover_3.webp",
  "/Homepage/cover_1.webp",
  "/Training/Onsite_24.webp",
  "/Training/Onsite_26.webp", 
  "/Training/Onsite_16.webp",
  "/Training/Onsite_17.webp",
  "/Training/Onsite_23.webp",
  "/Homepage/cover_4.webp",
  "/Homepage/cover_2.webp",

  "/Homepage/Carousel/Day1/8274.JPG",
  "/Homepage/Carousel/Day1/8283.JPG",
  "/Homepage/Carousel/Day1/8284.JPG",
  "/Homepage/Carousel/Day1/8377.JPG",
  "/Homepage/Carousel/Day1/8392.JPG",
  "/Homepage/Carousel/Day1/8462.JPG",

  "/Homepage/Carousel/Day3/8949.JPG",
  "/Homepage/Carousel/Day3/8982.JPG",
  "/Homepage/Carousel/Day3/9031.JPG",
  "/Homepage/Carousel/Day3/9108.JPG",
  "/Homepage/Carousel/Day3/9118.JPG",

  "/Homepage/Carousel/Day4/9326.JPG",
  "/Homepage/Carousel/Day4/9343.JPG",
  "/Homepage/Carousel/Day4/9394.JPG",
  "/Homepage/Carousel/Day4/9398.JPG",
  "/Homepage/Carousel/Day4/09418.JPG",
  "/Homepage/Carousel/Day4/9423.JPG",
  "/Homepage/Carousel/Day4/9427.JPG",
  "/Homepage/Carousel/Day4/9440.JPG",
  "/Homepage/Carousel/Day4/09442.JPG",
  "/Homepage/Carousel/Day4/9451.JPG",
  "/Homepage/Carousel/Day4/09465.JPG",

  "/Homepage/Carousel/Day5/0006.JPG",
  "/Homepage/Carousel/Day5/0057.JPG",
  "/Homepage/Carousel/Day5/0072.JPG",
  "/Homepage/Carousel/Day5/9812.JPG",
  "/Homepage/Carousel/Day5/0125.JPG",
  "/Homepage/Carousel/Day5/9527.JPG",
  "/Homepage/Carousel/Day5/9577.JPG",
  "/Homepage/Carousel/Day5/09662.JPG",
  
  "/Homepage/Carousel/Day6/0336.JPG",
  "/Homepage/Carousel/Day6/0606.JPG",
  "/Homepage/Carousel/Day6/0610.JPG",
  "/Homepage/Carousel/Day6/0619.JPG",
  "/Homepage/Carousel/Day6/0620.JPG",
  "/Homepage/Carousel/Day6/0681.JPG",
  "/Homepage/Carousel/Day6/0742.JPG",
  "/Homepage/Carousel/Day6/0755.JPG",
  "/Homepage/Carousel/Day6/0757.JPG",
  "/Homepage/Carousel/Day6/0759.JPG",
  "/Homepage/Carousel/Day6/0761.JPG",
  "/Homepage/Carousel/Day6/0763.JPG",
  "/Homepage/Carousel/Day6/0769.JPG",
  "/Homepage/Carousel/Day6/0774.JPG",
  "/Homepage/Carousel/Day6/0777.JPG",
  "/Homepage/Carousel/Day6/09834.JPG",
  "/Homepage/Carousel/Day6/09863.JPG",
  "/Homepage/Carousel/Day6/09866.JPG",
  "/Homepage/Carousel/Day6/09892.JPG",
];

const GalleryCarousel = () => {
  const { t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (isHovered || touchStartX !== null) return; 
    const timer = setInterval(() => {
      nextImage();
    }, 4000);

    return () => clearInterval(timer);
  }, [currentImageIndex, isHovered, touchStartX]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextImage();
    } else if (distance < -minSwipeDistance) {
      prevImage();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  const getVisibleDots = () => {
    const total = galleryImages.length;
    const maxDots = 7;
    
    if (total <= maxDots) {
      return Array.from({ length: total }, (_, i) => i);
    }

    let start = currentImageIndex - Math.floor(maxDots / 2);
    let end = currentImageIndex + Math.floor(maxDots / 2);

    if (start < 0) {
      start = 0;
      end = maxDots - 1;
    } else if (end >= total) {
      end = total - 1;
      start = total - maxDots;
    }

    const dots = [];
    for (let i = start; i <= end; i++) {
      dots.push(i);
    }
    return dots;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 border-b-2 border-slate-200 pb-4">
        <div className="flex items-center gap-4">
          <div className="text-purple-500 bg-purple-50 p-3 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </div>
          <h3 className="text-3xl lg:text-4xl font-bold text-slate-800">{t('gallery_title') || 'ประมวลภาพกิจกรรม (Gallery)'}</h3>
        </div>
      </div>

      <div 
        className="relative w-full max-w-5xl mx-auto h-[300px] sm:h-[450px] lg:h-[550px] rounded-3xl overflow-hidden shadow-lg group bg-slate-950 select-none touch-pan-y"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        
        {galleryImages.map((imgUrl, index) => (
          <div 
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* 💡 1. ภาพพื้นหลังแบบเบลอเติมเต็มขอบ (ป้องกันช่องว่างและดูพรีเมียม) */}
            <img 
              src={imgUrl} 
              alt="" 
              className="absolute inset-0 w-full h-full object-cover filter blur-2xl scale-110 opacity-40 pointer-events-none"
            />
            {/* 💡 2. ภาพหลักแสดงเต็มใบแบบสัดส่วนจริง (ไม่โดนตัดหัวหรือล้นขอบ) */}
            <img 
              src={imgUrl} 
              alt={`Gallery image ${index + 1}`} 
              loading="lazy"
              className="relative w-full h-full object-contain pointer-events-none"
            />
          </div>
        ))}

        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/70 to-transparent pointer-events-none z-20"></div>

        {/* ตัวบอกลำดับภาพ (Image Counter) ด้านขวาบน */}
        <div className="absolute top-4 right-4 bg-slate-900/60 backdrop-blur-md text-white text-sm font-semibold px-3 py-1.5 rounded-full z-30 pointer-events-none">
          {currentImageIndex + 1} / {galleryImages.length}
        </div>

        {/* ปุ่มย้อนกลับ */}
        <button 
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-3 rounded-full shadow-md backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-30 cursor-pointer"
          aria-label="Previous image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* ปุ่มถัดไป */}
        <button 
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-3 rounded-full shadow-md backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-30 cursor-pointer"
          aria-label="Next image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* แสดงเฉพาะจุดรอบๆ ภาพปัจจุบัน ป้องกันจุดล้นขอบ */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-30 bg-slate-900/40 backdrop-blur-md px-4 py-2 rounded-full">
          {getVisibleDots().map((index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                index === currentImageIndex 
                  ? 'w-8 h-2.5 bg-white shadow-sm' 
                  : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/90'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default GalleryCarousel;