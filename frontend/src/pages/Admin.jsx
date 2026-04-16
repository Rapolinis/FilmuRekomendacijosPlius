import { useState } from 'react';
import { useData } from '../context/DataContext';
import { formatDate } from '../utils/helpers';
import './Admin.css';

export default function Admin() {
  const {
    movies, addMovie, updateMovie, deleteMovie,
    genres, addGenre, updateGenre, deleteGenre,
    categories, addCategory, updateCategory, deleteCategory,
    users, blockUser, unblockUser, changeUserRole
  } = useData();

  const [activeTab, setActiveTab] = useState('movies');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [message, setMessage] = useState('');

  const switchTab = (tab) => {
    setActiveTab(tab);
    setEditItem(null);
    setItemName('');
    setShowModal(false);
  };

  // Movie form state
  const [movieForm, setMovieForm] = useState({
    title: '', originalTitle: '', description: '', genre: [],
    director: '', actors: '', duration: '', releaseDate: '',
    imdbRating: '', poster: '', category: '', foodName: '', foodLink: ''
  });

  // Genre/Category form
  const [itemName, setItemName] = useState('');

  // Block form
  const [blockReason, setBlockReason] = useState('');
  const [blockDuration, setBlockDuration] = useState('');
  const [blockingUserId, setBlockingUserId] = useState(null);

  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const resetMovieForm = () => {
    setMovieForm({
      title: '', originalTitle: '', description: '', genre: [],
      director: '', actors: '', duration: '', releaseDate: '',
      imdbRating: '', poster: '', category: '', foodName: '', foodLink: ''
    });
    setEditItem(null);
    setShowModal(false);
  };

  const [formError, setFormError] = useState('');

  const handleAddMovie = () => {
    setFormError('');
    if (!movieForm.title.trim()) { setFormError('Pavadinimas privalomas.'); return; }
    if (movieForm.genre.length === 0) { setFormError('Pasirinkite bent vieną žanrą.'); return; }
    if (!movieForm.director.trim()) { setFormError('Režisierius privalomas.'); return; }
    if (!movieForm.releaseDate) { setFormError('Išleidimo data privaloma.'); return; }
    if (!movieForm.duration || Number(movieForm.duration) <= 0) { setFormError('Trukmė turi būti teigiamas skaičius.'); return; }
    if (movieForm.imdbRating && (Number(movieForm.imdbRating) < 0 || Number(movieForm.imdbRating) > 10)) { setFormError('IMDb įvertinimas turi būti tarp 0 ir 10.'); return; }
    const movieData = {
      title: movieForm.title,
      originalTitle: movieForm.originalTitle || movieForm.title,
      description: movieForm.description,
      genre: movieForm.genre,
      director: movieForm.director,
      actors: movieForm.actors.split(',').map(a => a.trim()).filter(Boolean),
      duration: Number(movieForm.duration) || 0,
      releaseDate: movieForm.releaseDate,
      imdbRating: Number(movieForm.imdbRating) || 0,
      poster: movieForm.poster,
      foodRecommendation: movieForm.foodName ? { name: movieForm.foodName, woltLink: movieForm.foodLink || 'https://wolt.com' } : null,
      category: movieForm.category
    };

    if (editItem) {
      // Preserve existing ratings and comments when editing
      updateMovie(editItem.id, movieData);
      showMsg('Filmas atnaujintas!');
    } else {
      addMovie({ ...movieData, rating: 0, ratings: [], comments: [] });
      showMsg('Filmas pridėtas!');
    }
    resetMovieForm();
  };

  const handleEditMovie = (movie) => {
    setMovieForm({
      title: movie.title,
      originalTitle: movie.originalTitle,
      description: movie.description,
      genre: movie.genre,
      director: movie.director,
      actors: (movie.actors || []).join(', '),
      duration: movie.duration,
      releaseDate: movie.releaseDate,
      imdbRating: movie.imdbRating,
      poster: movie.poster,
      category: movie.category,
      foodName: movie.foodRecommendation?.name || '',
      foodLink: movie.foodRecommendation?.woltLink || ''
    });
    setEditItem(movie);
    setShowModal(true);
  };

  const handleDeleteMovie = (id) => {
    if (confirm('Ar tikrai norite pašalinti šį filmą?')) {
      deleteMovie(id);
      showMsg('Filmas pašalintas.');
    }
  };

  const handleBlockUser = (userId) => {
    if (!blockReason) return;
    const until = blockDuration ? new Date(Date.now() + Number(blockDuration) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null;
    blockUser(userId, blockReason, until);
    setBlockingUserId(null);
    setBlockReason('');
    setBlockDuration('');
    showMsg('Paskyra užblokuota.');
  };

  const toggleGenre = (genreName) => {
    setMovieForm(prev => ({
      ...prev,
      genre: prev.genre.includes(genreName)
        ? prev.genre.filter(g => g !== genreName)
        : [...prev.genre, genreName]
    }));
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Administratoriaus skydelis</h1>
      </div>

      {message && <div className="success-message">{message}</div>}

      <div className="admin-tabs">
        <button className={activeTab === 'movies' ? 'active' : ''} onClick={() => switchTab('movies')}>
          Filmai ({movies.length})
        </button>
        <button className={activeTab === 'genres' ? 'active' : ''} onClick={() => switchTab('genres')}>
          Žanrai ({genres.length})
        </button>
        <button className={activeTab === 'categories' ? 'active' : ''} onClick={() => switchTab('categories')}>
          Kategorijos ({categories.length})
        </button>
        <button className={activeTab === 'users' ? 'active' : ''} onClick={() => switchTab('users')}>
          Paskyros ({users.length})
        </button>
      </div>

      {/* MOVIES TAB */}
      {activeTab === 'movies' && (
        <div className="admin-section">
          <button onClick={() => { resetMovieForm(); setShowModal(true); }} className="btn-primary" style={{ width: 'auto', marginBottom: '1rem' }}>
            + Įkelti filmą
          </button>

          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Pavadinimas</th>
                  <th>Žanras</th>
                  <th>Režisierius</th>
                  <th>Įvertinimas</th>
                  <th>Veiksmai</th>
                </tr>
              </thead>
              <tbody>
                {movies.map(movie => (
                  <tr key={movie.id}>
                    <td><strong>{movie.title}</strong></td>
                    <td>{(movie.genre || []).join(', ')}</td>
                    <td>{movie.director}</td>
                    <td>⭐ {movie.rating}</td>
                    <td className="action-btns">
                      <button onClick={() => handleEditMovie(movie)} className="btn-table-edit">✏️</button>
                      <button onClick={() => handleDeleteMovie(movie.id)} className="btn-table-delete">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GENRES TAB */}
      {activeTab === 'genres' && (
        <div className="admin-section">
          <div className="inline-form">
            <input
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Naujo žanro pavadinimas"
            />
            <button onClick={() => {
              if (itemName.trim()) {
                if (editItem) { updateGenre(editItem.id, itemName); setEditItem(null); showMsg('Žanras atnaujintas!'); }
                else { addGenre(itemName); showMsg('Žanras pridėtas!'); }
                setItemName('');
              }
            }} className="btn-primary btn-confirm" style={{ width: 'auto' }}>
              {editItem ? '✓ Išsaugoti' : '+ Pridėti'}
            </button>
            {editItem && (
              <button onClick={() => { setEditItem(null); setItemName(''); }}
                className="btn-primary btn-cancel" style={{ width: 'auto' }}>✕ Atšaukti</button>
            )}
          </div>
          <div className="items-list">
            {genres.map(genre => (
              <div key={genre.id} className="item-row">
                <span>{genre.name}</span>
                <div className="action-btns">
                  <button onClick={() => { setEditItem(genre); setItemName(genre.name); }} className="btn-table-edit">Keisti</button>
                  <button onClick={() => {
                    if (confirm('Ar tikrai norite ištrinti šį žanrą?')) {
                      deleteGenre(genre.id); showMsg('Žanras ištrintas.');
                    }
                  }} className="btn-table-delete">Trinti</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CATEGORIES TAB */}
      {activeTab === 'categories' && (
        <div className="admin-section">
          <div className="inline-form">
            <input
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Naujos kategorijos pavadinimas"
            />
            <button onClick={() => {
              if (itemName.trim()) {
                if (editItem) { updateCategory(editItem.id, itemName); setEditItem(null); showMsg('Kategorija atnaujinta!'); }
                else { addCategory(itemName); showMsg('Kategorija pridėta!'); }
                setItemName('');
              }
            }} className="btn-primary btn-confirm" style={{ width: 'auto' }}>
              {editItem ? '✓ Išsaugoti' : '+ Pridėti'}
            </button>
            {editItem && (
              <button onClick={() => { setEditItem(null); setItemName(''); }}
                className="btn-primary btn-cancel" style={{ width: 'auto' }}>✕ Atšaukti</button>
            )}
          </div>
          <div className="items-list">
            {categories.map(cat => (
              <div key={cat.id} className="item-row">
                <span>{cat.name}</span>
                <div className="action-btns">
                  <button onClick={() => { setEditItem(cat); setItemName(cat.name); }} className="btn-table-edit">Keisti</button>
                  <button onClick={() => {
                    if (confirm('Ar tikrai norite ištrinti šią kategoriją?')) {
                      deleteCategory(cat.id); showMsg('Kategorija ištrinta.');
                    }
                  }} className="btn-table-delete">Trinti</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="admin-section">
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Vardas</th>
                  <th>El. paštas</th>
                  <th>Tipas</th>
                  <th>Būsena</th>
                  <th>Veiksmai</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-badge role-${u.role}`}>
                        {u.role === 'admin' ? 'Admin' : u.role === 'moderator' ? 'Mod' : 'Žiūr.'}
                      </span>
                    </td>
                    <td>
                      {u.blocked ? (
                        <span className="status-blocked">🔒 Užblokuotas</span>
                      ) : (
                        <span className="status-active">✓ Aktyvus</span>
                      )}
                    </td>
                    <td className="action-btns">
                      {u.role !== 'admin' && (
                        <>
                          <select
                            value={u.role}
                            onChange={(e) => {
                              changeUserRole(u.id, e.target.value);
                              showMsg(`Vartotojo ${u.username} rolė pakeista į ${e.target.value === 'moderator' ? 'Moderatorius' : 'Žiūrėtojas'}.`);
                            }}
                            className="role-select"
                          >
                            <option value="viewer">Žiūrėtojas</option>
                            <option value="moderator">Moderatorius</option>
                          </select>
                          {u.blocked ? (
                            <button onClick={() => { unblockUser(u.id); showMsg('Paskyra atblokuota.'); }}
                              className="btn-table-edit">Atblokuoti</button>
                          ) : (
                            <button onClick={() => setBlockingUserId(u.id)}
                              className="btn-table-delete">Blokuoti</button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {blockingUserId && (
            <div className="modal-overlay" onClick={() => setBlockingUserId(null)}>
              <div className="modal" onClick={e => e.stopPropagation()}>
                <h3>Blokuoti paskyrą</h3>
                <div className="form-group">
                  <label>Priežastis</label>
                  <input value={blockReason} onChange={e => setBlockReason(e.target.value)} placeholder="Užblokavimo priežastis" />
                </div>
                <div className="form-group">
                  <label>Trukmė (dienomis, palikite tuščią - neribotam)</label>
                  <input type="number" value={blockDuration} onChange={e => setBlockDuration(e.target.value)} placeholder="Dienų skaičius" />
                </div>
                <div className="modal-actions">
                  <button onClick={() => handleBlockUser(blockingUserId)} className="btn-primary btn-cancel" style={{ width: 'auto' }}>
                    🔒 Blokuoti
                  </button>
                  <button onClick={() => setBlockingUserId(null)} className="btn-primary" style={{ width: 'auto', background: '#a0aec0' }}>
                    Atšaukti
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MOVIE MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => resetMovieForm()}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editItem ? 'Redaguoti filmą' : 'Įkelti naują filmą'}</h3>
              <button onClick={resetMovieForm} className="modal-close">✕</button>
            </div>

            <div className="modal-body">
              {formError && <div className="error-message">{formError}</div>}
              <div className="form-row">
                <div className="form-group">
                  <label>Pavadinimas *</label>
                  <input value={movieForm.title} onChange={e => setMovieForm({ ...movieForm, title: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Originalus pavadinimas</label>
                  <input value={movieForm.originalTitle} onChange={e => setMovieForm({ ...movieForm, originalTitle: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label>Aprašymas</label>
                <textarea value={movieForm.description} onChange={e => setMovieForm({ ...movieForm, description: e.target.value })} rows="3" />
              </div>

              <div className="form-group">
                <label>Žanrai</label>
                <div className="genre-selector">
                  {genres.map(g => (
                    <button key={g.id} type="button"
                      className={`pref-btn ${movieForm.genre.includes(g.name) ? 'active' : ''}`}
                      onClick={() => toggleGenre(g.name)}>
                      {g.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Režisierius</label>
                  <input value={movieForm.director} onChange={e => setMovieForm({ ...movieForm, director: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Aktoriai (per kablelį)</label>
                  <input value={movieForm.actors} onChange={e => setMovieForm({ ...movieForm, actors: e.target.value })} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Trukmė (min)</label>
                  <input type="number" value={movieForm.duration} onChange={e => setMovieForm({ ...movieForm, duration: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Išleidimo data</label>
                  <input type="date" value={movieForm.releaseDate} onChange={e => setMovieForm({ ...movieForm, releaseDate: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>IMDb įvertinimas</label>
                  <input type="number" step="0.1" value={movieForm.imdbRating} onChange={e => setMovieForm({ ...movieForm, imdbRating: e.target.value })} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Plakato URL</label>
                  <input value={movieForm.poster} onChange={e => setMovieForm({ ...movieForm, poster: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Kategorija</label>
                  <select value={movieForm.category} onChange={e => setMovieForm({ ...movieForm, category: e.target.value })}>
                    <option value="">Pasirinkite</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Maisto rekomendacija</label>
                  <input value={movieForm.foodName} onChange={e => setMovieForm({ ...movieForm, foodName: e.target.value })} placeholder="Maisto pavadinimas" />
                </div>
                <div className="form-group">
                  <label>Wolt nuoroda</label>
                  <input value={movieForm.foodLink} onChange={e => setMovieForm({ ...movieForm, foodLink: e.target.value })} placeholder="https://wolt.com/..." />
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={handleAddMovie} className="btn-primary btn-confirm" style={{ width: 'auto', padding: '0.7rem 1.5rem' }}>
                {editItem ? '✓ Išsaugoti' : '✓ Skelbti'}
              </button>
              <button onClick={resetMovieForm} className="btn-primary btn-cancel" style={{ width: 'auto', padding: '0.7rem 1.5rem' }}>
                ✕ Atšaukti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
