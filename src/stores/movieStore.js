import { create } from 'zustand';
import { 
  getPopularMovies, 
  searchMovies, 
  getMovieDetails,
  getMovieVideos 
} from '../services/tmdbApi';

const useMovieStore = create((set, get) => ({
  // State
  movies: [],
  popularMovies: [],
  searchResults: [],
  selectedMovie: null,
  movieTrailer: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  searchQuery: '',
  
  // Actions
  fetchPopularMovies: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const response = await getPopularMovies(page);
      set({ 
        popularMovies: response.data.results,
        movies: response.data.results,
        currentPage: response.data.page,
        totalPages: response.data.total_pages,
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  searchMovies: async (query, page = 1) => {
    set({ loading: true, error: null, searchQuery: query });
    try {
      const response = await searchMovies(query, page);
      set({ 
        searchResults: response.data.results,
        movies: response.data.results,
        currentPage: response.data.page,
        totalPages: response.data.total_pages,
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  fetchMovieDetails: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await getMovieDetails(id);
      set({ selectedMovie: response.data, loading: false });
      
      // جلب التريلر بعد التفاصيل
      await get().fetchMovieTrailer(id);
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  fetchMovieTrailer: async (id) => {
    try {
      const response = await getMovieVideos(id);
      const trailer = response.data.results.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
      );
      set({ movieTrailer: trailer || null });
    } catch (error) {
      console.error('Error fetching trailer:', error);
    }
  },
  
  clearSearch: () => {
    set({ 
      searchQuery: '', 
      searchResults: [],
      movies: get().popularMovies 
    });
  },
  
  setPage: (page) => {
    const { searchQuery } = get();
    if (searchQuery) {
      get().searchMovies(searchQuery, page);
    } else {
      get().fetchPopularMovies(page);
    }
  }
}));

export default useMovieStore;