import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { movieService } from '../services/movieService';

const FavoritesPage = () => {
  const [activeTab, setActiveTab] = useState('movies'); // 'movies' or 'tv'
  const [favoriteMoviesIds, setFavoriteMoviesIds] = useState([]);
  const [favoriteTvIds, setFavoriteTvIds] = useState([]);
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [loadingTv, setLoadingTv] = useState(false);

  // تحميل المعرفات من localStorage عند تحميل الصفحة
  useEffect(() => {
    const moviesIds = JSON.parse(localStorage.getItem('favorites_movies') || '[]');
    const tvIds = JSON.parse(localStorage.getItem('favorites_tv') || '[]');
    setFavoriteMoviesIds(moviesIds);
    setFavoriteTvIds(tvIds);
  }, []);

  // جلب تفاصيل الأفلام المفضلة
  useEffect(() => {
    const fetchMovies = async () => {
      if (favoriteMoviesIds.length === 0) {
        setMovies([]);
        setLoadingMovies(false);
        return;
      }
      setLoadingMovies(true);
      try {
        const promises = favoriteMoviesIds.map(id => movieService.getMovieDetails(id));
        const moviesData = await Promise.all(promises);
        setMovies(moviesData);
      } catch (error) {
        console.error('خطأ في جلب الأفلام المفضلة:', error);
      } finally {
        setLoadingMovies(false);
      }
    };
    fetchMovies();
  }, [favoriteMoviesIds]);

  // جلب تفاصيل المسلسلات المفضلة
  useEffect(() => {
    const fetchTv = async () => {
      if (favoriteTvIds.length === 0) {
        setTvShows([]);
        setLoadingTv(false);
        return;
      }
      setLoadingTv(true);
      try {
        const promises = favoriteTvIds.map(id => movieService.getTvDetails(id));
        const tvData = await Promise.all(promises);
        setTvShows(tvData);
      } catch (error) {
        console.error('خطأ في جلب المسلسلات المفضلة:', error);
      } finally {
        setLoadingTv(false);
      }
    };
    fetchTv();
  }, [favoriteTvIds]);

  // إزالة فيلم من المفضلة
  const removeMovie = (movieId) => {
    const newIds = favoriteMoviesIds.filter(id => id !== movieId);
    localStorage.setItem('favorites_movies', JSON.stringify(newIds));
    setFavoriteMoviesIds(newIds);
    // لا نحتاج لتحديث movies يدوياً لأن useEffect سيعيد الجلب
  };

  // إزالة مسلسل من المفضلة
  const removeTv = (tvId) => {
    const newIds = favoriteTvIds.filter(id => id !== tvId);
    localStorage.setItem('favorites_tv', JSON.stringify(newIds));
    setFavoriteTvIds(newIds);
  };

  // دالة مساعدة لعرض البطاقات (أفلام أو مسلسلات)
  const renderGrid = (items, type, onRemove) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-20">
          <p className="text-gray-400">لا توجد {type === 'movie' ? 'أفلام' : 'مسلسلات'} مفضلة بعد</p>
          <Link to={type === 'movie' ? '/movies' : '/tv'} className="text-red-800 underline mt-2 inline-block">
            اكتشف {type === 'movie' ? 'أفلاماً' : 'مسلسلات'}
          </Link>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
        {items.map(item => (
          <div key={item.id} className="bg-[#0C0C0C] rounded-lg overflow-hidden relative group transition hover:scale-105">
            <Link to={`/${type === 'movie' ? 'movie' : 'tv'}/${item.id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                alt={type === 'movie' ? item.title : item.name}
                className="w-full object-cover"
              />
              <div className="p-2 text-center">
                <h3 className="text-sm font-semibold truncate">
                  {type === 'movie' ? item.title : item.name}
                </h3>
                <p className="text-xs text-gray-400">
                  {type === 'movie'
                    ? item.release_date?.slice(0, 4)
                    : item.first_air_date?.slice(0, 4)}
                </p>
              </div>
            </Link>
            <button
              onClick={() => onRemove(item.id)}
              className="absolute top-1 left-1 bg-red-700 hover:bg-red-600 rounded-full w-5 h-5 text-xs flex items-center justify-center transition"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div dir="rtl" className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">المفضلة</h1>

      {/* تبويبات */}
      <div className="flex justify-center gap-4 mb-8 border-b border-gray-700 pb-2">
        <button
          onClick={() => setActiveTab('movies')}
          className={`px-6 py-2 rounded-t-lg transition font-semibold ${
            activeTab === 'movies'
              ? 'bg-red-700 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          الأفلام ({favoriteMoviesIds.length})
        </button>
        <button
          onClick={() => setActiveTab('tv')}
          className={`px-6 py-2 rounded-t-lg transition font-semibold ${
            activeTab === 'tv'
              ? 'bg-red-700 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          المسلسلات ({favoriteTvIds.length})
        </button>
      </div>

      {/* محتوى التبويب النشط */}
      <div className="mt-4">
        {activeTab === 'movies' && (
          <>
            {loadingMovies ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-red-600"></div>
              </div>
            ) : (
              renderGrid(movies, 'movie', removeMovie)
            )}
          </>
        )}

        {activeTab === 'tv' && (
          <>
            {loadingTv ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-red-600"></div>
              </div>
            ) : (
              renderGrid(tvShows, 'tv', removeTv)
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;