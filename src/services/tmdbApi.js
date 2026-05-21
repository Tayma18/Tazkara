import axios from 'axios';

const API_KEY = import.meta.env.API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const getPopularMovies = (page = 1) => {
  return axios.get(`${BASE_URL}/movie/popular`, {
    params: {
      api_key: API_KEY,
      language: 'ar-SA',
      page
    }
  });
};

export const searchMovies = (query, page = 1) => {
  return axios.get(`${BASE_URL}/search/movie`, {
    params: {
      api_key: API_KEY,
      language: 'ar-SA',
      query,
      page
    }
  });
};