import { api } from './api';

export const movieService = {
  getTrending: async () => {
    const response = await api.get('/trending/movie/week');
    return response.data;
  },
  getNowPlaying: async () => {
    const response = await api.get('/movie/now_playing');
    return response.data;
  },
  getTopRated: async () => {
    const response = await api.get('/movie/top_rated');
    return response.data;
  },
 getPopularMovies: async () => {
    const response = await api.get('/movie/popular', { params: { language: 'ar' } });
    return response.data;
  },
  getPopularTv: async () => {
    const response = await api.get('/tv/popular', { params: { language: 'ar' } });
    return response.data;
  },
  // ... باقي الدوال كما هي
// في movieService.js
getPopularMovies: async (page = 1) => {
  const response = await api.get('/movie/popular', { params: { language: 'ar', page } });
  return response.data;
},
getNowPlayingMovies: async (page = 1) => {
  const response = await api.get('/movie/now_playing', { params: { language: 'ar', page } });
  return response.data;
},
getTopRatedMovies: async (page = 1) => {
  const response = await api.get('/movie/top_rated', { params: { language: 'ar', page } });
  return response.data;
},
getUpcomingMovies: async (page = 1) => {
  const response = await api.get('/movie/upcoming', { params: { language: 'ar', page } });
  return response.data;
},

  getMovieDetails: async (movieId) => {
    const response = await api.get(`/movie/${movieId}`);
    return response.data;
  },
  getMovieCast: async (movieId) => {
    const response = await api.get(`/movie/${movieId}/credits`);
    return response.data;
  },
  getMovieVideos: async (movieId) => {
    const response = await api.get(`/movie/${movieId}/videos`);
    return response.data;
  },
  getSimilarMovies: async (movieId) => {
    const response = await api.get(`/movie/${movieId}/similar`);
    return response.data;
  },
  // TV Series endpoints
getPopularTv: async (page = 1) => {
  const response = await api.get('/tv/popular', { params: { language: 'ar', page } });
  return response.data;
},
getTopRatedTv: async (page = 1) => {
  const response = await api.get('/tv/top_rated', { params: { language: 'ar', page } });
  return response.data;
},
getOnTheAirTv: async (page = 1) => {
  const response = await api.get('/tv/on_the_air', { params: { language: 'ar', page } });
  return response.data;
},
getAiringTodayTv: async (page = 1) => {
  const response = await api.get('/tv/airing_today', { params: { language: 'ar', page } });
  return response.data;
},
// TV Series Details
getTvDetails: async (tvId) => {
  const response = await api.get(`/tv/${tvId}`);
  return response.data;
},
getTvCredits: async (tvId) => {
  const response = await api.get(`/tv/${tvId}/credits`);
  return response.data;
},
getTvVideos: async (tvId) => {
  const response = await api.get(`/tv/${tvId}/videos`);
  return response.data;
},

getSimilarTv: async (tvId) => {
  const response = await api.get(`/tv/${tvId}/similar`);
  return response.data;
},
getTvSeasonDetails: async (tvId, seasonNumber) => {
  const response = await api.get(`/tv/${tvId}/season/${seasonNumber}`);
  return response.data;
},
 searchMulti: (query) => {
  return api.get(`/search/multi`, { params: { query } }).then(res => res.data);
},
// داخل كائن movieService، أضف هذه الدالة الجديدة
searchTv: (query) => {
  return api.get(`/search/tv`, { params: { query } }).then(res => res.data);
},
  searchMovies: async (query) => {
    const response = await api.get('/search/movie', {
      params: {
        query: query,
        language: 'ar',
        page: 1
      }
    });
    return response.data;
  },
};