import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom'; // 🔥 إضافة Link
import { movieService } from '../services/movieService';
import MediaCard from '../components/MediaCard';

const tabs = [
  { id: 'popular', label: 'رائجة', apiCall: movieService.getPopularMovies },
  { id: 'now_playing', label: 'الآن في السينما', apiCall: movieService.getNowPlayingMovies },
  { id: 'top_rated', label: 'الأعلى تقييماً', apiCall: movieService.getTopRatedMovies },
  { id: 'upcoming', label: 'قريباً', apiCall: movieService.getUpcomingMovies },
];

const MoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'popular';
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  const fetchMovies = async (tabId, pageNum = 1, reset = true) => {
    setLoading(true);
    try {
      const tab = tabs.find(t => t.id === tabId);
      if (!tab) return;
      const data = await tab.apiCall(pageNum);
      if (reset) {
        setMovies(data.results);
      } else {
        setMovies(prev => [...prev, ...data.results]);
      }
      setHasMore(pageNum < data.total_pages);
      setPage(pageNum);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(activeTab, 1, true);
  }, [activeTab]);

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchMovies(activeTab, page + 1, false);
    }
  };

  return (
    <div dir="rtl" className="container mx-auto px-4 py-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">قائمة الأفلام</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-md transition ${
              viewMode === 'grid' ? 'bg-red-800' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title="عرض شبكي"
          >
            ⊞
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-md transition ${
              viewMode === 'list' ? 'bg-red-800' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title="عرض قائمة"
          >
            ☰
          </button>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-1 mb-8 border-b border-gray-700 pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-2 rounded-t-lg transition ${
              activeTab === tab.id
                ? 'bg-red-800 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && movies.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-800"></div>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {movies.map(movie => (
                <MediaCard key={movie.id} item={movie} type="movie" />
              ))}
            </div>
          ) : (
           <div className="flex flex-col gap-3">
  {movies.map(movie => (
    <div key={movie.id} className="bg-[#0C0C0C] border border-red-800 rounded-lg overflow-hidden hover:bg-gray-700 transition flex items-center gap-4 p-3">
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
            : 'https://via.placeholder.com/92x138?text=No+Image'
        }
        alt={movie.title}
        className="w-16 h-24 object-cover rounded"
      />
      <div className="flex-1 text-right">
        <h3 className="font-bold text-lg">{movie.title}</h3>
        <p className="text-gray-400 text-sm">{movie.release_date?.slice(0, 4)}</p>
        <p className="text-gray-300 text-sm line-clamp-2 mt-1">{movie.overview}</p>
      </div>
      {/* التقييم وزر التفاصيل في نفس الصف */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-1  px-2 py-1 rounded">
          <span className="text-yellow-500">⭐</span>
          <span className="text-sm font-bold">{movie.vote_average?.toFixed(1)}</span>
          <span className="text-sm font-bold text-gray-400">/10</span>
        </div>
        <Link to={`/movie/${movie.id}`} className="bg-red-800 px-3 py-1 rounded text-sm hover:bg-red-700 whitespace-nowrap">
          تفاصيل
        </Link>
      </div>
    </div>
  ))}
</div>
          )}

          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                disabled={loading}
                className="bg-red-800 hover:bg-[#0C0C0C] px-6 py-2 rounded-full transition disabled:opacity-50"
              >
                {loading ? 'جاري التحميل...' : 'تحميل المزيد +'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MoviesPage;