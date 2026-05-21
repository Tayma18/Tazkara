import React, { useRef, useEffect, useState } from 'react';
import heroImage from '../assets/images/t2.jpg';
import { movieService } from '../services/movieService';
import MediaCard from '../components/MediaCard'; // مكون عام
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Home = () => {
  const trendingRef = useRef(null);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularTv, setPopularTv] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   const fetchHomeData = async () => {
  try {
    const moviesRes = await movieService.getPopularMovies();
    const tvRes = await movieService.getPopularTv();
    
    console.log('Movies Response:', moviesRes);  
    console.log('TV Response:', tvRes);
    
    const movies = moviesRes?.results ?? [];
    const tv = tvRes?.results ?? [];
    
    setPopularMovies(movies.slice(0, 10));
    setPopularTv(tv.slice(0, 10));
  } catch (err) {
    console.error('خطأ في جلب البيانات:', err);
  } finally {
    setLoading(false);
  }
};
    fetchHomeData();
  }, []);

  const handleExplore = () => {
    trendingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return <div className="text-white text-center py-20">جاري التحميل...</div>;
  }

  // دالة مساعدة لإعادة استخدام إعدادات السويبر
  const swiperConfig = {
    modules: [Navigation, Pagination, Autoplay],
    navigation: true,
    pagination: { clickable: true },
    spaceBetween: 15,
    slidesPerView: 2,
    dir: 'rtl',
    breakpoints: {
      400: { slidesPerView: 3 },
      640: { slidesPerView: 4 },
      768: { slidesPerView: 5 },
      1024: { slidesPerView: 6 },
      1280: { slidesPerView: 7 },
    },
    autoplay: { delay: 5000, disableOnInteraction: false },
    className: 'pb-12 custom-slider',
    style: { overflow: 'visible' }
  };

  return (
    <>
      {/* نفس الـ style السابق لضبط overflow */}
      <style>{`
        .swiper, .swiper-wrapper, .swiper-slide { overflow: visible !important; }
        .swiper-button-next, .swiper-button-prev { z-index: 20; }
        .swiper-pagination { bottom: 0 !important; z-index: 20; }
        .custom-slider { overflow: visible !important; padding-bottom: 2rem; }
      `}</style>

      {/* Hero Section */}
      <div className="relative w-full h-[400px] md:h-[500px] ">
        <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">مرحباً بك في تذكرة</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl">
            اكتشف أحدث الأفلام والمسلسلات، وأضفها إلى مفضلتك
          </p>
          <button
            onClick={handleExplore}
            className="bg-red-800 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-lg transition"
          >
            استكشاف المحتوى
          </button>
        </div>
      </div>

      {/* قسم الأفلام الرائجة */}
      <div ref={trendingRef} className="container mx-auto px-4 py-12 ">
        <div className="flex justify-between items-center mb-4">
        {/* الرابط على اليسار */}
         <a href="/movies"  className="text-red-800 pt-10 hover:text-red-300 transition text-sm">
           مشاهدة الكل 
         </a>
           {/* العنوان على اليمين */}
          <h2 className="text-white text-3xl font-bold">: أفلام رائجة</h2>
        </div>
        <Swiper {...swiperConfig}>
          {popularMovies.map((movie) => (
            <SwiperSlide key={movie.id} className="!overflow-visible">
              <MediaCard item={movie} type="movie" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* قسم المسلسلات الرائجة */}
      <div className="container mx-auto px-4 py-12">
       <div className="flex justify-between items-center mb-6">
  <a href="/tv" className="text-red-800 pt-10 hover:text-red-300 transition text-sm">
           مشاهدة الكل 
         </a>
  <h2 className="text-white text-3xl font-bold">: مسلسلات رائجة</h2>
</div>
        <Swiper {...swiperConfig}>
          {popularTv.map((tv) => (
            <SwiperSlide key={tv.id} className="!overflow-visible">
              <MediaCard item={tv} type="tv" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default Home;