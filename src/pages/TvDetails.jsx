import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { movieService } from '../services/movieService';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import MediaCard from '../components/MediaCard';

const TvDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tv, setTv] = useState(null);
  const [cast, setCast] = useState([]);
  const [creator, setCreator] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [seasonDetails, setSeasonDetails] = useState(null);
  const [loadingSeason, setLoadingSeason] = useState(false);
  const [episodesLimit, setEpisodesLimit] = useState(10);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const tvData = await movieService.getTvDetails(id);
        const creditsData = await movieService.getTvCredits(id);
        let videosResult = { results: [] };
        let similarResult = { results: [] };
        
        try {
          const res = await movieService.getTvVideos(id);
          videosResult = res || { results: [] };
        } catch (e) {
          videosResult = { results: [] };
        }
        
        try {
          const res = await movieService.getSimilarTv(id);
          similarResult = res || { results: [] };
        } catch (e) {
          similarResult = { results: [] };
        }
        
        setTv(tvData);
        const creatorData = creditsData.crew?.find(member => member.job === 'Creator');
        setCreator(creatorData);
        setCast(creditsData.cast?.slice(0, 12) || []);
        
        const trailer = videosResult.results?.find(
          (video) => video.type === 'Trailer' && video.site === 'YouTube'
        );
        setTrailerKey(trailer?.key || null);
        setSimilar(similarResult.results?.slice(0, 12) || []);
        
        const favorites = JSON.parse(localStorage.getItem('favorites_tv') || '[]');
        setIsFavorite(favorites.includes(tvData.id));
        
      } catch (error) {
        console.error('خطأ في جلب تفاصيل المسلسل:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const fetchSeasonDetails = async (seasonNumber) => {
    setLoadingSeason(true);
    try {
      const data = await movieService.getTvSeasonDetails(id, seasonNumber);
      setSeasonDetails(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSeason(false);
    }
  };

  const handleSeasonClick = (seasonNumber) => {
    if (selectedSeason === seasonNumber) {
      setSelectedSeason(null);
      setSeasonDetails(null);
    } else {
      setSelectedSeason(seasonNumber);
      setEpisodesLimit(10);
      fetchSeasonDetails(seasonNumber);
    }
  };

  const loadMoreEpisodes = () => {
    setEpisodesLimit(prev => prev + 10);
  };

  const toggleFavorite = () => {
    if (!tv) return;
    const favorites = JSON.parse(localStorage.getItem('favorites_tv') || '[]');
    let newFavorites;
    if (isFavorite) {
      newFavorites = favorites.filter(favId => favId !== tv.id);
    } else {
      newFavorites = [...favorites, tv.id];
    }
    localStorage.setItem('favorites_tv', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600 border-solid mx-auto mb-4"></div>
          <p>جاري تحميل المسلسل...</p>
        </div>
      </div>
    );
  }

  if (!tv) {
    return (
      <div className="text-white text-center py-20">
        <h2 className="text-2xl mb-4">المسلسل غير موجود</h2>
        <button
          onClick={() => navigate('/')}
          className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full transition"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  const firstAirYear = tv.first_air_date ? new Date(tv.first_air_date).getFullYear() : 'غير معروف';
  const lastAirYear = tv.last_air_date ? new Date(tv.last_air_date).getFullYear() : 'غير معروف';
  const genres = tv.genres?.map((g) => g.name).join(' • ') || 'غير مصنف';
  const countries = tv.production_countries?.map(c => c.name).join(', ') || 'غير معروف';
  const languages = tv.spoken_languages?.map(l => l.english_name).join(', ') || 'غير معروف';
  const status = tv.status || 'غير معروف';
  const networks = tv.networks?.map(n => n.name).join(', ') || 'غير معروف';
  const seasonsCount = tv.number_of_seasons || 0;
  const episodesCount = tv.number_of_episodes || 0;

  return (
    <div dir="rtl" className="text-white">
      {/* Hero Section - صورة على اليسار، تفاصيل على اليمين */}
      <div className="relative w-full min-h-[70vh] md:min-h-[80vh]">
        <img
          src={`https://image.tmdb.org/t/p/original${tv.backdrop_path || tv.poster_path}`}
          alt={tv.name}
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        
        {/* الحاوية المعدلة: dir="ltr" لعكس الترتيب ثم إعادة dir="rtl" للنص */}
        <div className="relative z-10 container mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row gap-8 items-end md:items-center justify-center min-h-[70vh]" dir="ltr">
          <img
            src={`https://image.tmdb.org/t/p/w300${tv.poster_path}`}
            alt={tv.name}
            className="w-44 md:w-64 rounded-xl shadow-2xl border-2 border-gray-700"
          />
          <div className="flex-1 text-right" dir="rtl">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{tv.name}</h1>
            {tv.original_name && tv.original_name !== tv.name && (
              <p className="text-gray-400 text-sm mb-3">الاسم الأصلي: {tv.original_name}</p>
            )}
            {tv.tagline && <p className="text-gray-400 italic mb-3">{tv.tagline}</p>}
            <div className="flex flex-wrap gap-3 items-center justify-end mb-4">
              <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                ⭐ {tv.vote_average?.toFixed(1)} / 10
              </span>
              <span className="text-gray-300">{firstAirYear} - {lastAirYear}</span>
              <span className="text-gray-300">{seasonsCount} مواسم</span>
              <span className="text-gray-300">{episodesCount} حلقة</span>
              <span className="bg-gray-700 px-2 py-1 rounded text-xs">{status}</span>
            </div>
            <div className="mb-4 text-sm text-gray-300">
              <p><span className="font-semibold">التصنيفات:</span> {genres}</p>
              <p><span className="font-semibold">المبدع:</span> {creator?.name || 'غير معروف'}</p>
              <p><span className="font-semibold">البلد:</span> {countries}</p>
              {tv.origin_country && (
                <p><span className="font-semibold">بلد المنشأ:</span> {tv.origin_country.join(', ')}</p>
              )}
              <p><span className="font-semibold">اللغة:</span> {languages}</p>
              {tv.original_language && (
                <p><span className="font-semibold">اللغة الأصلية:</span> {tv.original_language.toUpperCase()}</p>
              )}
              <p><span className="font-semibold">الشبكات:</span> {networks}</p>
              <p><span className="font-semibold">الحالة:</span> {status}</p>
            </div>
           <p className="text-gray-200 text-base md:text-lg leading-relaxed text-left">
  {tv.overview}
</p>
            {(tv.homepage) && (
              <div className="flex gap-3 mt-3 justify-start text-sm">
                <a href={tv.homepage} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">الموقع الرسمي</a>
              </div>
            )}
            <div className="flex gap-3 mt-6 justify-start">
              {trailerKey && (
                <button onClick={() => setShowTrailer(true)} className="bg-red-800 hover:bg-red-700 px-5 py-2 rounded-full font-bold transition">
                  مشاهدة الدعائي
                </button>
              )}
              <button onClick={toggleFavorite} className={`px-5 py-2 rounded-full font-bold transition ${isFavorite ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
                {isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* باقي الأقسام (لم تتغير، وهي سليمة) */}
      {showTrailer && trailerKey && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setShowTrailer(false)}>
          <div className="relative w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <button className="absolute -top-10 right-0 bg-red-800 text-white text-2xl hover:text-red-800" onClick={() => setShowTrailer(false)}>✕</button>
            <iframe className="w-full h-full rounded-lg" src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`} title="Trailer" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
          </div>
        </div>
      )}

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
      <SwiperSlide key={actor.id} className="!overflow-visible h-auto">
        <div className="bg-[#0C0C0C] rounded-lg overflow-hidden text-center hover:scale-105 transition-transform duration-300 h-full flex flex-col">
          <div className="relative pt-[150%] overflow-hidden">
            <img
              src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : 'https://via.placeholder.com/185x278?text=No+Image'}
              alt={actor.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="p-2 flex-1 flex flex-col justify-center">
            <p className="font-semibold text-sm line-clamp-1">{actor.name}</p>
            <p className="text-gray-400 text-xs line-clamp-1">{actor.character}</p>
          </div>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
</div>

      {tv.seasons && tv.seasons.filter(s => s.season_number > 0).length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-right border-r-4 border-red-800 pr-4">المواسم</h2>
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
            }}
            className="custom-slider pb-16"
            style={{ overflow: 'visible' }}
          >
            {tv.seasons.filter(s => s.season_number > 0).map(season => (
              <SwiperSlide key={season.id} className="!overflow-visible">
                <div
                  onClick={() => handleSeasonClick(season.season_number)}
                  className="bg-[#0C0C0C] rounded-lg overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-xl hover:shadow-red-900/30"
                >
                  <div className="relative pt-[150%] overflow-hidden">
                    <img
                      src={season.poster_path ? `https://image.tmdb.org/t/p/w185${season.poster_path}` : 'https://via.placeholder.com/185x278?text=No+Image'}
                      alt={season.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-2 text-center">
                    <h3 className="font-bold text-sm truncate">{season.name}</h3>
                    <p className="text-gray-400 text-xs">{season.air_date?.slice(0, 4)}</p>
                    <p className="text-gray-400 text-xs">{season.episode_count} حلقة</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {selectedSeason && seasonDetails && (
        <div className="container mx-auto px-4 py-8">
          <h3 className="text-xl font-bold mb-4 text-right border-r-4 border-red-600 pr-3">
            حلقات الموسم {selectedSeason} - {seasonDetails.name}
          </h3>
          {loadingSeason ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-600"></div>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                {seasonDetails.episodes?.slice(0, episodesLimit).map(ep => (
                  <div key={ep.id} className="bg-gray-800 rounded-lg p-3 flex flex-row-reverse gap-3 hover:bg-gray-700 transition">
                    <img
                      src={ep.still_path ? `https://image.tmdb.org/t/p/w185${ep.still_path}` : 'https://via.placeholder.com/185x104?text=No+Image'}
                      alt={ep.name}
                      className="w-28 h-16 object-cover rounded"
                    />
                    <div className="flex-1 text-right">
                      <div className="flex justify-between items-center">
                        <span className="text-yellow-400 text-xs">⭐ {ep.vote_average?.toFixed(1)}</span>
                        <span className="text-gray-400 text-xs">حلقة {ep.episode_number}</span>
                      </div>
                      <h4 className="font-bold text-sm">{ep.name}</h4>
                      <p className="text-gray-400 text-xs">{ep.air_date}</p>
                      <p className="text-gray-300 text-sm mt-1 line-clamp-2">{ep.overview}</p>
                    </div>
                  </div>
                ))}
              </div>
              {seasonDetails.episodes && episodesLimit < seasonDetails.episodes.length && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={loadMoreEpisodes}
                    className="bg-red-800 hover:bg-red-700 px-5 py-2 rounded-full text-sm transition"
                  >
                    تحميل المزيد من الحلقات (+10)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {tv.production_companies?.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4 text-right border-r-4 border-red-800 pr-4">شركات الإنتاج</h2>
          <div className="flex flex-wrap gap-6 justify-center items-center">
            {tv.production_companies.map(company => (
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

      {similar.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-lg md:text-xl font-bold mb-3 text-right border-r-4 border-red-800 pr-3">مسلسلات مشابهة</h2>
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
            {similar.map(show => (
              <SwiperSlide key={show.id} className="!overflow-visible">
                <MediaCard item={show} type="tv" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default TvDetails;