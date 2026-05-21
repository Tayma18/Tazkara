import React, { useState, useEffect, useRef } from "react";
import { movieService } from "../services/movieService";
import MediaCard from "../components/MediaCard"; // مكون يعرض بوستر + عنوان + نوع (فيلم/مسلسل)
import { Link } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("movies"); // "movies" أو "tv"
  const searchRef = useRef(null);

  // إغلاق النتائج عند النقر خارج مربع البحث
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // تنفيذ البحث عند تغيير النص أو التبويب
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        fetchResults(query);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, activeTab]);

  const fetchResults = async (searchQuery) => {
    setLoading(true);
    setIsOpen(true);
    try {
      let data;
      if (activeTab === "movies") {
        data = await movieService.searchMovies(searchQuery);
      } else {
        data = await movieService.searchTv(searchQuery);
      }
      setResults(data.results || []);
    } catch (error) {
      console.error("خطأ في جلب نتائج البحث:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = () => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
  };

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      {/* حقل الإدخال والأزرار */}
      <div className="flex items-center bg-gray-800 rounded-lg overflow-hidden">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder={activeTab === "movies" ? "ابحث عن فيلم..." : "ابحث عن مسلسل..."}
          className="w-full px-4 py-2 bg-[#151515] text-white focus:outline-none"
        />
        {loading && (
          <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2"></div>
        )}
      </div>

      {/* تبويبات الأفلام والمسلسلات (تظهر فقط عندما يكون مربع البحث مفتوحاً أو هناك نتائج) */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 bg-[#151515] rounded-lg shadow-xl z-50">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab("movies")}
              className={`flex-1 py-2 text-center transition ${
                activeTab === "movies"
                  ? "text-red-500 border-b-2 border-red-500"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              أفلام
            </button>
            <button
              onClick={() => setActiveTab("tv")}
              className={`flex-1 py-2 text-center transition ${
                activeTab === "tv"
                  ? "text-red-500 border-b-2 border-red-500"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              مسلسلات
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto p-2">
            {results.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {results.map((item) => (
                  <Link
                    key={item.id}
                    to={`/${activeTab === "movies" ? "movie" : "tv"}/${item.id}`}
                    onClick={handleItemClick}
                  >
                    <MediaCard item={item} type={activeTab === "movies" ? "movie" : "tv"} />
                  </Link>
                ))}
              </div>
            ) : (
              !loading && (
                <div className="p-4 text-center text-gray-400">
                  لا توجد نتائج مطابقة
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;