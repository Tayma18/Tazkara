import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { movieService } from '../services/movieService';
import MediaCard from '../components/MediaCard';

const tabs = [
  { id: 'popular', label: 'رائجة', apiCall: movieService.getPopularTv },
  { id: 'on_the_air', label: 'على الهواء', apiCall: movieService.getOnTheAirTv },
  { id: 'top_rated', label: 'الأعلى تقييماً', apiCall: movieService.getTopRatedTv },
  { id: 'airing_today', label: 'يعرض اليوم', apiCall: movieService.getAiringTodayTv },
];

const TvPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'popular';
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const fetchTvShows = async (tabId, pageNum = 1, reset = true) => {
    setLoading(true);
    try {
      const tab = tabs.find(t => t.id === tabId);
      if (!tab) return;
      const data = await tab.apiCall(pageNum);
      if (reset) {
        setTvShows(data.results);
      } else {
        setTvShows(prev => [...prev, ...data.results]);
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
    fetchTvShows(activeTab, 1, true);
  }, [activeTab]);

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchTvShows(activeTab, page + 1, false);
    }
  };

  return (
    <div dir="rtl" className="container mx-auto px-4 py-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">قائمة المسلسلات</h1>
        {/* أزرار تبديل العرض */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-md transition ${
              viewMode === 'grid' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title="عرض شبكي"
          >
            ⊞
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-md transition ${
              viewMode === 'list' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title="عرض قائمة"
          >
            ☰
          </button>
        </div>
      </div>

      {/* تبويبات */}
      <div className="flex flex-wrap justify-end gap-1 mb-8 border-b border-gray-700 pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-2 rounded-t-lg transition ${
              activeTab === tab.id
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* عرض المسلسلات حسب viewMode */}
      {loading && tvShows.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-800"></div>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {tvShows.map(show => (
                <MediaCard key={show.id} item={show} type="tv" />
              ))}
            </div>
          ) : (
            // عرض القائمة (مشابه للأفلام ولكن مع مسلسلات)
            <div className="flex flex-col gap-3">
              {tvShows.map(show => (
                <div key={show.id} className="bg-[#0C0C0C] border border-red-800 rounded-lg overflow-hidden hover:bg-gray-700 transition flex items-center gap-4 p-3">
                  <img
                    src={
                      show.poster_path
                        ? `https://image.tmdb.org/t/p/w92${show.poster_path}`
                        : 'https://via.placeholder.com/92x138?text=No+Image'
                    }
                    alt={show.name}
                    className="w-16 h-24 object-cover rounded"
                  />
                  <div className="flex-1 text-right">
                    <h3 className="font-bold text-lg">{show.name}</h3>
                    <p className="text-gray-400 text-sm">{show.first_air_date?.slice(0, 4)}</p>
                    <p className="text-gray-300 text-sm line-clamp-2 mt-1">{show.overview}</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-1 bg-gray-900 px-2 py-1 rounded">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm font-bold">{show.vote_average?.toFixed(1)}</span>
                      <span className="text-xs text-gray-400">/10</span>
                    </div>
                    <Link to={`/tv/${show.id}`} className="bg-red-800 px-3 py-1 rounded text-sm hover:bg-red-700 whitespace-nowrap">
                      تفاصيل
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* زر تحميل المزيد */}
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

export default TvPage;