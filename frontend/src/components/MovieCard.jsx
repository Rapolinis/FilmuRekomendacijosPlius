import { memo } from 'react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import './MovieCard.css';

const MovieCard = memo(function MovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie.id}`} className="movie-card" aria-label={`Žiūrėti filmą ${movie.title}`}>
      <div className="movie-poster">
        <img
          src={movie.poster}
          alt={`${movie.title} plakatas`}
          onError={(e) => {
            e.target.src = `https://placehold.co/300x450/236476/ffffff?text=${encodeURIComponent(movie.title)}`;
          }}
        />
        <div className="movie-overlay">
          <span className="movie-duration">{movie.duration} min</span>
        </div>
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p className="movie-genre">{Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}</p>
        <div className="movie-meta">
          <StarRating currentRating={movie.rating} readonly />
          <span className="imdb-badge">IMDb {movie.imdbRating}</span>
        </div>
      </div>
    </Link>
  );
});

export default MovieCard;
