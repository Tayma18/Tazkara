import { useState, useEffect, useRef } from 'react';
import { movieService } from '../services/movieService';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logoo.png';

const Nav = () => {
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navRef = useRef(null);       // مرجع لعنصر الـ Nav
  const navigate = useNavigate();

  // تغيير عنوان التبويب
  useEffect(() => {
    document.title = "تذكرة | أفلام ومسلسلات";
  }, []);

  // 🔧 حل مشكلة تغطية المحتوى: ضبط padding-top للـ body حسب ارتفاع الـ Nav
  useEffect(() => {
    const updatePaddingTop = () => {
      if (navRef.current) {
        const navHeight = navRef.current.offsetHeight;
        document.body.style.paddingTop = `${navHeight}px`;
      }
    };

    updatePaddingTop();
    window.addEventListener('resize', updatePaddingTop);
    return () => window.removeEventListener('resize', updatePaddingTop);
  }, []);

  // إغلاق النتائج عند النقر خارج مربع البحث
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // البحث عند تغيير النص
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchInput.trim()) {
        fetchSearchResults(searchInput);
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchInput]);

  const fetchSearchResults = async (query) => {
    setLoading(true);
    setShowResults(true);
    try {
      const data = await movieService.searchMulti(query);
      let filtered = (data.results || []).filter(
        item => item.media_type === 'movie' || item.media_type === 'tv'
      );
      setResults(filtered);
    } catch (error) {
      console.error('خطأ في البحث:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item) => {
    setSearchInput('');
    setResults([]);
    setShowResults(false);
    if (item.media_type === 'movie') {
      navigate(`/movie/${item.id}`);
    } else if (item.media_type === 'tv') {
      navigate(`/tv/${item.id}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput('');
      setShowResults(false);
    }
  };

  const noImageSrc = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='92' height='138' viewBox='0 0 92 138'%3E%3Crect width='92' height='138' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='12'%3ENo Image%3C/text%3E%3C/svg%3E";

  return (
    <div
      ref={navRef}
      className="bg-[#0C0C0C] text-white p-2 md:p-4 shadow-lg fixed top-0 left-0 right-0 z-50"
    >
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
        {/* Logo + Title + Links */}
        

        {/* Search Form with Dropdown */}
        <div className="relative w-full max-w-md" ref={searchRef}>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => searchInput.trim() && setShowResults(true)}
              placeholder="...ابحث عن فيلم أو مسلسل"
              className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white text-right placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-800"
            />
          </form>

          {showResults && (
            <div className="absolute left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-400">جاري البحث...</div>
              ) : results.length > 0 ? (
                <div className="py-2">
                  {results.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer transition border-b border-gray-700 last:border-0"
                    >
                      <img
                        src={item.poster_path ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : noImageSrc}
                        alt={item.title || item.name}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1 text-right">
                        <p className="font-semibold">{item.title || item.name}</p>
                        <div className="flex justify-end gap-2 text-xs text-gray-400">
                          <span>
                            {item.media_type === 'movie'
                              ? (item.release_date?.slice(0, 4) || 'فيلم')
                              : (item.first_air_date?.slice(0, 4) || 'مسلسل')
                            }
                          </span>
                          <span className="bg-red-800/50 px-1 rounded">
                            {item.media_type === 'movie' ? 'فيلم' : 'مسلسل'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-400">لا توجد نتائج</div>
              )}
            </div>
          )}
        </div>
        <div dir="rtl" className="flex items-center gap-6">
          <NavLink
            to="/home"
            className="flex items-center gap-2 text-2xl font-bold text-red-800 hover:text-red-600 transition"
          >
            <img
              src={logo}
              alt="تذكرة"
              className="h-8 w-auto md:h-10 lg:h-12 transition-all"
            />
          

          </NavLink>

          <div className="flex gap-6">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `transition ${isActive ? 'text-red-800' : 'hover:text-red-800'}`
              }
            >
              الرئيسية
            </NavLink>
            <NavLink
              to="/movies"
              className={({ isActive }) =>
                `transition ${isActive ? 'text-red-800' : 'hover:text-red-800'}`
              }
            >
              أفلام
            </NavLink>
            <NavLink
              to="/tv"
              className={({ isActive }) =>
                `transition ${isActive ? 'text-red-800' : 'hover:text-red-800'}`
              }
            >
              مسلسلات
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `transition ${isActive ? 'text-red-800' : 'hover:text-red-800'}`
              }
            >
              المفضلة
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;