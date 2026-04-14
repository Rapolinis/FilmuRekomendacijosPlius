import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import MovieCard from '../components/MovieCard';
import './Watchlist.css';

export default function Watchlist() {
  const { user } = useAuth();
  const { movies, getUserWatchlist, removeFromWatchlist } = useData();

  const watchlistIds = user ? getUserWatchlist(user.id) : [];
  const watchlistMovies = movies.filter(m => watchlistIds.includes(m.id));

  return (
    <div className="watchlist-page">
      <div className="page-header">
        <h1>Žiūrėjimo sąrašas</h1>
        <p>Jūsų pasirinktų filmų sąrašas ({watchlistMovies.length})</p>
      </div>

      {watchlistMovies.length === 0 ? (
        <div className="empty-watchlist">
          <p>Jūsų žiūrėjimo sąrašas tuščias.</p>
          <p>Pridėkite filmų iš katalogo!</p>
        </div>
      ) : (
        <div className="watchlist-grid">
          {watchlistMovies.map(movie => (
            <div key={movie.id} className="watchlist-item">
              <MovieCard movie={movie} />
              <button
                onClick={() => removeFromWatchlist(user.id, movie.id)}
                className="btn-remove"
              >
                ✕ Pašalinti
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
