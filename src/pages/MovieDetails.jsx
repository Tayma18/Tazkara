import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { movieService } from '../services/movieService';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import MediaCard from '../components/MediaCard';
import 'swiper/css/pagination';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [director, setDirector] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [certification, setCertification] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const movieData = await movieService.getMovieDetails(id);
        const creditsData = await movieService.getMovieCast(id);
        let videosResult = { results: [] };
        let similarResult = { results: [] };
        let releaseResult = { results: [] };
        
        try {
          const res = await movieService.getMovieVideos(id);
          videosResult = res || { results: [] };
        } catch (e) {
          videosResult = { results: [] };
        }
        
        try {
          const res = await movieService.getSimilarMovies(id);
          similarResult = res || { results: [] };
        } catch (e) {
          similarResult = { results: [] };
        }
        
        if (movieService.getMovieReleaseDates) {
          try {
            const res = await movieService.getMovieReleaseDates(id);
            releaseResult = res || { results: [] };
          } catch (e) {
            releaseResult = { results: [] };
          }
        }
        
        setMovie(movieData);
        const directorData = creditsData.crew?.find(member => member.job === 'Director');
        setDirector(directorData);
        setCast(creditsData.cast?.slice(0, 12) || []);
        
        const trailer = videosResult.results?.find(
          (video) => video.type === 'Trailer' && video.site === 'YouTube'
        );
        setTrailerKey(trailer?.key || null);
        setSimilar(similarResult.results?.slice(0, 12) || []);
        
        if (releaseResult.results?.length) {
          const us = releaseResult.results.find(r => r.iso_3166_1 === 'US');
          if (us?.release_dates?.[0]?.certification) {
            setCertification(us.release_dates[0].certification);
          }
        }
        
        // الكود الجديد (متوافق مع صفحة المفضلة)
const favorites = JSON.parse(localStorage.getItem('favorites_movies') || '[]');
localStorage.setItem('favorites_movies', JSON.stringify(newFavorites));
        
      } catch (error) {
        console.error('خطأ في جلب التفاصيل:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

 // داخل MovieDetails component
const toggleFavorite = () => {
  if (!movie) return;
  // استخدم المفتاح favorites_movies للأفلام
  const favorites = JSON.parse(localStorage.getItem('favorites_movies') || '[]');
  let newFavorites;
  if (isFavorite) {
    newFavorites = favorites.filter(favId => favId !== movie.id);
  } else {
    newFavorites = [...favorites, movie.id];
  }
  localStorage.setItem('favorites_movies', JSON.stringify(newFavorites));
  setIsFavorite(!isFavorite);
};
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600 border-solid mx-auto mb-4"></div>
          <p>جاري تحميل الفيلم...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-white text-center py-20">
        <h2 className="text-2xl mb-4">الفيلم غير موجود</h2>
        <button
          onClick={() => navigate('/')}
          className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full transition"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'غير معروف';
  const genres = movie.genres?.map((g) => g.name).join(' • ') || 'غير مصنف';
  const runtimeHours = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'غير معروف';
  const countries = movie.production_countries?.map(c => c.name).join(', ') || 'غير معروف';
  const languages = movie.spoken_languages?.map(l => l.english_name).join(', ') || 'غير معروف';
  const budget = movie.budget ? ' $ ' + movie.budget.toLocaleString()  : 'غير معروفة';
  const revenue = movie.revenue ? ' $ ' + movie.revenue.toLocaleString() : 'غير معروفة';
  const status = movie.status || 'غير معروف';

  return (
    <div className="text-white">
      {/* Hero Section */}
      <div className="relative w-full min-h-[70vh] md:min-h-[80vh]">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`}
          alt={movie.title}
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        <div className="relative z-10 container mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row gap-8 items-end md:items-center justify-center min-h-[70vh]">
          <img
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            alt={movie.title}
            className="w-44 md:w-64 rounded-xl shadow-2xl border-2 border-gray-700"
          />
          <div className="flex-1 text-right">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{movie.title}</h1>
            {movie.original_title && movie.original_title !== movie.title && (
              <p className="text-gray-400 text-sm mb-3"> {movie.original_title} : العنوان الأصلي</p>
            )}
            {movie.tagline && <p className="text-gray-400 italic mb-3">{movie.tagline}</p>}
            <div className="flex flex-wrap gap-3 items-center justify-end mb-4">
              <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                ⭐ {movie.vote_average?.toFixed(1)} / 10 ({movie.vote_count} صوت)
              </span>
              <span className="text-gray-300">{releaseYear}</span>
              <span className="text-gray-300">{runtimeHours}</span>
              {certification && <span className="bg-gray-700 px-2 py-1 rounded text-xs">{certification}</span>}
            </div>
            <div className="mb-4 text-sm text-gray-300">
              <p><span className="font-semibold">التصنيفات:</span> {genres}</p>
              <p> {director?.name || 'غير معروف'} <span className="font-semibold">:المخرج</span></p>
              <p> {countries} <span className="font-semibold">:البلد</span></p>
              {movie.origin_country && (
                <p> {movie.origin_country.join(', ')} <span className="font-semibold"> :بلد المنشأ </span></p>
              )}
              <p>{languages} <span className="font-semibold">:اللغة</span> </p>
              {movie.original_language && (
                <p> {movie.original_language.toUpperCase()}<span className="font-semibold"> :اللغة الأصلية </span></p>
              )}
              <p><span className="font-semibold">الميزانية:</span> {budget}</p>
              <p><span className="font-semibold">الإيرادات:</span> {revenue}</p>
              <p> {status} <span className="font-semibold">:الحالة</span></p>
            </div>
            <p className="text-gray-200 max-w-3xl text-base md:text-lg leading-relaxed">
              {movie.overview}
            </p>
            {/* روابط خارجية */}
            {(movie.homepage || movie.imdb_id) && (
              <div className="flex gap-3 mt-3 justify-end text-sm">
                {movie.homepage && (
                  <a href={movie.homepage} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">الموقع الرسمي</a>
                )}
                {movie.imdb_id && (
                  <a href={`https://www.imdb.com/title/${movie.imdb_id}`} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">IMDb</a>
                )}
              </div>
            )}
            {/* معلومات السلسلة (belongs_to_collection) */}
            {movie.belongs_to_collection && (
              <div className="mt-4 bg-gray-800/50 p-3 rounded-lg text-right">
                <p>   هذا الفيلم جزء من سلسلة : <strong>{movie.belongs_to_collection.name}</strong></p>
                {/* يمكن إضافة رابط للسلسلة مستقبلاً */}
              </div>
            )}
            <div className="flex gap-3 mt-6 justify-end">
              {trailerKey && (
                <button onClick={() => setShowTrailer(true)} className="bg-red-800 hover:bg-red-700 px-5 py-2 rounded-full font-bold transition">
                   مشاهدة الدعائي
                </button>
              )}
              <button onClick={toggleFavorite} className={`px-5 py-2 rounded-full font-bold transition ${isFavorite ? 'bg-red-800' : 'bg-gray-700 hover:bg-gray-600'}`}>
                {isFavorite ? ' إزالة من المفضلة' : ' إضافة إلى المفضلة'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal trailer (نفسه) */}

      {/* طاقم التمثيل */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-right border-r-4 border-red-800 pr-4">طاقم التمثيل</h2>
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={15}
          slidesPerView={2}
          dir="rtl"
          breakpoints={{
            400: { slidesPerView: 4 },
            640: { slidesPerView: 5 },
            768: { slidesPerView: 6 },
            1024: { slidesPerView: 8 },
          }}
          className="custom-slider pb-16"
          style={{ overflow: 'visible' }}
        >
          {cast.map((actor) => (
            <SwiperSlide key={actor.id} className="!overflow-visible" style={{ overflow: 'visible' }}>
              <div className="bg-[#0C0C0C] rounded-lg overflow-hidden text-center hover:scale-105 transition-transform duration-300">
                <img
                  src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : 'https://via.placeholder.com/185x278?text=No+Image'}
                  alt={actor.name}
                  className="w-full object-cover"
                />
                <div className="p-2">
                  <p className="font-semibold text-sm">{actor.name}</p>
                  <p className="text-gray-400 text-xs">{actor.character}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* شركات الإنتاج */}
      {movie.production_companies?.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4 text-right border-r-4 border-red-800 pr-4">شركات الإنتاج</h2>
          <div className="flex flex-wrap gap-6 justify-center items-center">
            {movie.production_companies.map(company => (
              <div key={company.id} className="bg-gray-700 p-3 rounded-lg text-center w-32 h-28 flex flex-col justify-center items-center">
                {company.logo_path ? (
                  <img src={`https://image.tmdb.org/t/p/w92${company.logo_path}`} alt={company.name} className="mx-auto h-10 object-contain" />
                ) : (
                  <span className="text-xs">{company.name}</span>
                )}
                <p className="text-xs mt-1">{company.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* أفلام مشابهة */}
{similar.length > 0 && (
  <div className="container mx-auto px-4 py-12">
    <h2 className="text-lg md:text-xl font-bold mb-3 text-right border-r-4 border-red-800 pr-3">أفلام مشابهة</h2>
    <Swiper
      modules={[Navigation, Pagination]}
      navigation
      pagination={{ clickable: true }}
      spaceBetween={15}
      slidesPerView={2}
      dir="rtl"
      breakpoints={{
        400: { slidesPerView: 3 },
        640: { slidesPerView: 4 },
        768: { slidesPerView: 5 },
        1024: { slidesPerView: 6 },
        1280: { slidesPerView: 7 },
      }}
      className="custom-slider pb-16"
      style={{ overflow: 'visible' }}
    >
      {similar.map((simMovie) => (
        <SwiperSlide key={simMovie.id} className="!overflow-visible">
          <MediaCard item={simMovie} type="movie" />
        </SwiperSlide>
      ))}
    </Swiper>
  </div>

)}</div>
  );
};

export default MovieDetails;