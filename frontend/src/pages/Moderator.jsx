import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatDate } from '../utils/helpers';
import './Admin.css';

export default function Moderator() {
  const { user } = useAuth();
  const {
    viewings, addViewing, movies,
    users, deleteComment
  } = useData();

  const [activeTab, setActiveTab] = useState('viewings');
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');

  const [viewingForm, setViewingForm] = useState({
    movieId: '', date: '', time: '', description: ''
  });

  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCreateViewing = () => {
    if (!viewingForm.movieId || !viewingForm.date || !viewingForm.time) return;
    const movie = movies.find(m => m.id === Number(viewingForm.movieId));
    addViewing({
      movieId: Number(viewingForm.movieId),
      movieTitle: movie?.title || 'Nežinomas filmas',
      date: viewingForm.date,
      time: viewingForm.time,
      maxParticipants: 50,
      participants: [],
      createdBy: user.id,
      description: viewingForm.description
    });
    setViewingForm({ movieId: '', date: '', time: '', description: '' });
    setShowModal(false);
    showMsg('Bendra peržiūra sukurta!');
  };

  const moviesWithComments = movies.filter(m => (m.comments || []).length > 0);

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Moderatoriaus skydelis</h1>
      </div>

      {message && <div className="success-message">{message}</div>}

      <div className="admin-tabs">
        <button className={activeTab === 'viewings' ? 'active' : ''} onClick={() => setActiveTab('viewings')}>
          Bendros peržiūros ({viewings.length})
        </button>
        <button className={activeTab === 'comments' ? 'active' : ''} onClick={() => setActiveTab('comments')}>
          Komentarai
        </button>
      </div>

      {activeTab === 'viewings' && (
        <div className="admin-section">
          <button onClick={() => setShowModal(true)} className="btn-primary" style={{ width: 'auto', marginBottom: '1rem' }}>
            + Kurti naują peržiūrą
          </button>

          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Filmas</th>
                  <th>Data</th>
                  <th>Laikas</th>
                  <th>Dalyviai</th>
                  <th>Aprašymas</th>
                </tr>
              </thead>
              <tbody>
                {viewings.map(v => (
                  <tr key={v.id}>
                    <td><strong>{v.movieTitle}</strong></td>
                    <td>{formatDate(v.date)}</td>
                    <td>{v.time}</td>
                    <td>{v.participants.length}/{v.maxParticipants}</td>
                    <td>{v.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Nauja bendra peržiūra</h3>
                  <button onClick={() => setShowModal(false)} className="modal-close">✕</button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Filmas *</label>
                    <select value={viewingForm.movieId} onChange={e => setViewingForm({ ...viewingForm, movieId: e.target.value })}>
                      <option value="">Pasirinkite filmą</option>
                      {movies.map(m => (
                        <option key={m.id} value={m.id}>{m.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Data *</label>
                    <input type="date" value={viewingForm.date} onChange={e => setViewingForm({ ...viewingForm, date: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Laikas *</label>
                    <input type="time" value={viewingForm.time} onChange={e => setViewingForm({ ...viewingForm, time: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Aprašymas</label>
                    <textarea value={viewingForm.description} onChange={e => setViewingForm({ ...viewingForm, description: e.target.value })} rows="3" />
                  </div>
                </div>
                <div className="modal-actions">
                  <button onClick={handleCreateViewing} className="btn-primary btn-confirm" style={{ width: 'auto' }}>
                    ✓ Skelbti
                  </button>
                  <button onClick={() => setShowModal(false)} className="btn-primary btn-cancel" style={{ width: 'auto' }}>
                    ✕ Atšaukti
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'comments' && (
        <div className="admin-section">
          {moviesWithComments.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#a0aec0', padding: '2rem' }}>Komentarų dar nėra.</p>
          ) : (
            moviesWithComments.map(movie => (
              <div key={movie.id} className="comment-movie-group">
                <h3>{movie.title}</h3>
                {(movie.comments || []).map((comment, idx) => (
                  <div key={idx} className="comment-row">
                    <div className="comment-row-info">
                      <span className="comment-user">{users.find(u => u.id === comment.userId)?.username || '[Ištrintas vartotojas]'}</span>
                      <span className="comment-date">{formatDate(comment.date)}</span>
                      <p>{comment.text}</p>
                    </div>
                    <button onClick={() => {
                      if (confirm('Ar tikrai norite ištrinti šį komentarą?')) {
                        deleteComment(movie.id, idx);
                        showMsg('Komentaras ištrintas.');
                      }
                    }} className="btn-table-delete">
                      Trinti
                    </button>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
