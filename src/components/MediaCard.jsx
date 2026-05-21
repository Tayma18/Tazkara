// src/components/MediaCard.jsx
import { Link } from 'react-router-dom';
import noImage from '../assets/images/cover.jpg';

const MediaCard = ({ item, type }) => {
  const posterUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
    : noImage;
 const title = type === 'movie' ? item.title : item.name;
const year = (type === 'movie' ? item.release_date : item.first_air_date)?.slice(0, 4) || '';

  return (
    <Link to={`/${type}/${item.id}`}>
      {/* لا يوجد عرض ثابت، الحاوية تأخذ كامل مساحة الشريحة */}
      <div className="bg-[#0C0C0C] rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl hover:shadow-red-900/30">
        {/* حاوية بنسبة ارتفاع 150% من العرض (نسبة 2:3) */}
        <div className="relative pt-[150%] overflow-hidden">
          <img
            src={posterUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>
        <div className="p-2 text-center">
          <h3 className="text-sm font-semibold truncate text-white">{title}</h3>
          <p className="text-gray-400 text-xs">{year}</p>
          <div className="flex justify-center items-center gap-1 mt-1">
            <span className="text-yellow-500 text-xs">⭐</span>
            <span className="text-xs text-white">{item.vote_average?.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MediaCard;