import Nav from './components/Nav';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FavoritesPage from './pages/FavoritesPage';
import Home from './pages/Home';
import Fotter from './components/Fotter';
import MovieDetails from './pages/MovieDetails';
import MoviesPage from './pages/MoviesPage';
import TvPage from './pages/TvPage';
import TvDetails from './pages/TvDetails';

function App() {
  return (
    <BrowserRouter>
      {/* حاوية رئيسية تأخذ كامل ارتفاع الشاشة وتستخدم flex باتجاه العمود */}
      <div className="min-h-screen bg-[#151515] overflow-x-hidden flex flex-col">
        <Nav />
        {/* المحتوى يأخذ كل المساحة المتبقية ليدفع الـ Footer للأسفل */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />  
            <Route path="/tv/:id" element={<TvDetails />} />
            <Route path="/movies" element={<MoviesPage />} />   
            <Route path="/tv" element={<TvPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        </div>
        <Fotter />
      </div>
    </BrowserRouter>
  );
}

export default App;