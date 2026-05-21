import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// نتأكد إن المفتاح وصل بشكل صحيح
console.log('API Key from env:', API_KEY); 

export const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'ar-SA',
  },
});