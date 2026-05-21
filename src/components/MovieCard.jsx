import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  return (
    <Link to={`/movie/${movie.id}`}>
      <div className="bg-[#0C0C0C] rounded-xl overflow-hidden hover:scale-105 
      transition-transform duration-300 shadow-lg h-full flex flex-col hover:border-red-800 hover:border-1">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full  object-cover"
        />
        <div className="p-3 flex flex-col flex-grow">
          <h3 className="text-white font-semibold truncate text-right">{movie.title}</h3>
          <p className="text-gray-400 text-sm mt-1 ">⭐ {movie.vote_average?.toFixed(1)}</p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;