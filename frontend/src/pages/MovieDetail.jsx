import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import StarRating from '../components/StarRating';
import { formatDate } from '../utils/helpers';
import { getSmartFoodRecommendation } from '../utils/foodRecommender';
import './MovieDetail.css';

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { movies, users, rateMovie, hasUserRated, addComment, editComment, deleteComment, addToWatchlist, removeFromWatchlist, getUserWatchlist } = useData();
  const [commentText, setCommentText] = useState('');
  const [editingCommentIndex, setEditingCommentIndex] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [message, setMessage] = useState('');

  const movie = movies.find(m => m.id === Number(id));

  if (!movie) {
    return (
      <div className="movie-detail-page">
        <div className="not-found">
          <h2>Filmas nerastas</h2>
          <button onClick={() => navigate('/movies')} className="btn-primary" style={{ width: 'auto' }}>
            Grįžti į filmų sąrašą
          </button>
        </div>
      </div>
    );
  }

  const isInWatchlist = user ? getUserWatchlist(user.id).includes(movie.id) : false;
  const canInteract = user && (user.role === 'viewer' || user.role === 'admin' || user.role === 'moderator');
  const alreadyRated = user ? hasUserRated(user.id, movie.id) : false;

  const handleRate = (rating) => {
    if (!canInteract || alreadyRated) return;
    rateMovie(movie.id, user.id, rating);
    setMessage('Ačiū už įvertinimą!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!commentText.trim() || !canInteract) return;
    addComment(movie.id, {
      userId: user.id,
      text: commentText.trim(),
      date: new Date().toISOString().split('T')[0]
    });
    setCommentText('');
  };

  const handleEditComment = (index, text) => {
    setEditingCommentIndex(index);
    setEditingCommentText(text);
  };

  const handleSaveEdit = () => {
    if (!editingCommentText.trim()) return;
    editComment(movie.id, editingCommentIndex, editingCommentText.trim());
    setEditingCommentIndex(null);
    setEditingCommentText('');
  };

  const handleDeleteComment = (index, isOwnComment) => {
    const canDelete = user && (user.role === 'moderator' || user.role === 'admin' || isOwnComment);
    if (!canDelete) return;
    if (window.confirm('Ar tikrai norite ištrinti šį komentarą?')) {
      deleteComment(movie.id, index);
    }
  };

  const toggleWatchlist = () => {
    if (!canInteract) return;
    if (isInWatchlist) {
      removeFromWatchlist(user.id, movie.id);
      setMessage('Pašalinta iš žiūrėjimo sąrašo');
    } else {
      addToWatchlist(user.id, movie.id);
      setMessage('Pridėta į žiūrėjimo sąrašą!');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="movie-detail-page">
      <button onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/movies')} className="btn-back">← Grįžti</button>

      {message && <div className="success-message">{message}</div>}

      <div className="movie-detail-content">
        <div className="movie-detail-poster">
          <img
            src={movie.poster}
            alt={movie.title}
            onError={(e) => {
              e.target.src = `https://placehold.co/400x600/1a365d/ffffff?text=${encodeURIComponent(movie.title)}`;
            }}
          />
        </div>

        <div className="movie-detail-info">
          <h1>{movie.title}</h1>
          <p className="original-title">{movie.originalTitle} ({new Date(movie.releaseDate).getFullYear()})</p>

          <div className="detail-tags">
            {(movie.genre || []).map(g => (
              <span key={g} className="tag">{g}</span>
            ))}
            <span className="tag tag-category">{movie.category}</span>
          </div>

          <div className="detail-ratings">
            <div className="rating-block">
              <StarRating currentRating={movie.rating} readonly />
              <span>({(movie.ratings || []).length} įvertinimai)</span>
            </div>
            <div className="imdb-rating">
              <span className="imdb-badge-lg">IMDb {movie.imdbRating}</span>
            </div>
          </div>

          <div className="detail-meta">
            <p><strong>Režisierius:</strong> {movie.director}</p>
            <p><strong>Aktoriai:</strong> {(movie.actors || []).join(', ')}</p>
            <p><strong>Trukmė:</strong> {movie.duration} min</p>
            <p><strong>Išleidimo data:</strong> {formatDate(movie.releaseDate)}</p>
          </div>

          <p className="detail-description">{movie.description}</p>

          {canInteract && (
            <div className="detail-actions">
              {!alreadyRated ? (
                <div className="rate-section">
                  <p><strong>Įvertinkite filmą:</strong></p>
                  <StarRating onRate={handleRate} />
                </div>
              ) : (
                <p className="already-rated">✓ Jūs jau įvertinote šį filmą</p>
              )}
              <button onClick={toggleWatchlist} className={`btn-watchlist ${isInWatchlist ? 'in-list' : ''}`}>
                {isInWatchlist ? '✓ Žiūrėjimo sąraše' : '+ Į žiūrėjimo sąrašą'}
              </button>
            </div>
          )}

          {(() => {
            const food = getSmartFoodRecommendation(movie);
            return food ? (
              <div className="food-recommendation">
                <h3>🍕 Maisto rekomendacija</h3>
                <p>{food.name}</p>
                <a href={food.woltLink} target="_blank" rel="noopener noreferrer" className="wolt-link">
                  Užsisakyti per Wolt →
                </a>
              </div>
            ) : null;
          })()}
        </div>
      </div>

      <div className="comments-section">
        <h2>Komentarai ({(movie.comments || []).length})</h2>

        {canInteract && (
          <form onSubmit={handleComment} className="comment-form">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value.slice(0, 1000))}
              placeholder="Parašykite komentarą..."
              rows="3"
              maxLength={1000}
            />
            <div className="comment-form-footer">
              <span className="char-count">{commentText.length}/1000</span>
              <button type="submit" className="btn-primary" style={{ width: 'auto' }} disabled={!commentText.trim()}>
                Komentuoti
              </button>
            </div>
          </form>
        )}

        <div className="comments-list">
          {(movie.comments || []).length === 0 ? (
            <p className="no-comments">Komentarų dar nėra. Būkite pirmas!</p>
          ) : (
            (movie.comments || []).map((comment, index) => {
              const isOwnComment = user && comment.userId === user.id;
              const canModerate = user && (user.role === 'moderator' || user.role === 'admin');

              return (
                <div key={index} className="comment">
                  <div className="comment-header">
                    <span className="comment-user">
                      {users.find(u => u.id === comment.userId)?.username || '[Ištrintas vartotojas]'}
                    </span>
                    <span className="comment-date">
                      {formatDate(comment.date)}
                      {comment.edited && <span className="comment-edited"> (redaguota)</span>}
                    </span>
                    <div className="comment-actions">
                      {isOwnComment && editingCommentIndex !== index && (
                        <button onClick={() => handleEditComment(index, comment.text)} className="btn-edit-comment" title="Redaguoti">
                          ✏️
                        </button>
                      )}
                      {(canModerate || isOwnComment) && (
                        <button onClick={() => handleDeleteComment(index, isOwnComment)} className="btn-delete-comment" title="Trinti">
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                  {editingCommentIndex === index ? (
                    <div className="comment-edit-form">
                      <textarea
                        value={editingCommentText}
                        onChange={(e) => setEditingCommentText(e.target.value)}
                        rows="2"
                      />
                      <div className="comment-edit-actions">
                        <button onClick={handleSaveEdit} className="btn-primary btn-confirm" style={{ width: 'auto', padding: '0.3rem 0.8rem', fontSize: '0.85rem' }}>
                          ✓ Išsaugoti
                        </button>
                        <button onClick={() => setEditingCommentIndex(null)} className="btn-primary btn-cancel" style={{ width: 'auto', padding: '0.3rem 0.8rem', fontSize: '0.85rem' }}>
                          ✕ Atšaukti
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p>{comment.text}</p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
