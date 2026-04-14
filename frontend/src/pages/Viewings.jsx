import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatDate, canRegisterForViewing } from '../utils/helpers';
import './Viewings.css';

function TimeUntilCutoff({ date, time }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const update = () => {
      const viewingDateTime = new Date(`${date}T${time}`);
      const cutoff = new Date(viewingDateTime.getTime() - 60 * 60 * 1000);
      const now = new Date();
      const diff = cutoff - now;

      if (diff <= 0) {
        setTimeLeft('Registracija uždaryta');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`Registracija užsidaro po ${days}d ${hours}val`);
      } else if (hours > 0) {
        setTimeLeft(`Registracija užsidaro po ${hours}val ${minutes}min`);
      } else {
        setTimeLeft(`Registracija užsidaro po ${minutes}min!`);
      }
    };

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [date, time]);

  const isUrgent = timeLeft.includes('min!');

  return (
    <span className={`cutoff-timer ${isUrgent ? 'urgent' : ''}`}>
      ⏰ {timeLeft}
    </span>
  );
}

export default function Viewings() {
  const { user } = useAuth();
  const { viewings, registerForViewing, unregisterFromViewing, movies } = useData();

  const [actionMessage, setActionMessage] = useState('');

  const handleRegister = (viewingId) => {
    if (user) {
      registerForViewing(viewingId, user.id);
      setActionMessage('Sėkmingai užsiregistravote!');
      setTimeout(() => setActionMessage(''), 3000);
    }
  };

  const handleUnregister = (viewingId) => {
    if (user) {
      unregisterFromViewing(viewingId, user.id);
      setActionMessage('Atsiregistravote iš peržiūros.');
      setTimeout(() => setActionMessage(''), 3000);
    }
  };

  // Filter out past viewings and sort by date (soonest first)
  const now = new Date();
  const upcomingViewings = viewings
    .filter(v => new Date(`${v.date}T${v.time}`) > now)
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

  const pastViewings = viewings
    .filter(v => new Date(`${v.date}T${v.time}`) <= now)
    .sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`));

  return (
    <div className="viewings-page">
      <div className="page-header">
        <h1>Bendros peržiūros</h1>
        <p>Žiūrėkite filmus kartu su bendruomene</p>
      </div>

      {actionMessage && <div className="success-message">{actionMessage}</div>}

      <div className="viewings-list">
        {upcomingViewings.length === 0 && pastViewings.length === 0 ? (
          <p className="no-viewings">Šiuo metu bendrų peržiūrų nėra.</p>
        ) : upcomingViewings.length === 0 ? (
          <p className="no-viewings">Artėjančių peržiūrų nėra.</p>
        ) : (
          upcomingViewings.map(viewing => {
            const movie = movies.find(m => m.id === viewing.movieId);
            const isRegistered = user && viewing.participants.includes(user.id);
            const canRegister = canRegisterForViewing(viewing);
            const spotsLeft = viewing.maxParticipants - viewing.participants.length;

            return (
              <div key={viewing.id} className="viewing-card">
                <div className="viewing-poster">
                  {movie && (
                    <img
                      src={movie.poster}
                      alt={viewing.movieTitle}
                      onError={(e) => {
                        e.target.src = `https://placehold.co/200x300/1a365d/ffffff?text=${encodeURIComponent(viewing.movieTitle)}`;
                      }}
                    />
                  )}
                </div>
                <div className="viewing-info">
                  <h2>{viewing.movieTitle}</h2>
                  <p className="viewing-description">{viewing.description}</p>
                  <div className="viewing-meta">
                    <span className="viewing-date">📅 {formatDate(viewing.date)}</span>
                    <span className="viewing-time">🕐 {viewing.time}</span>
                    <span className="viewing-spots">
                      👥 {viewing.participants.length}/{viewing.maxParticipants}
                      {spotsLeft <= 10 && spotsLeft > 0 && (
                        <span className="spots-warning"> (liko {spotsLeft} vietos!)</span>
                      )}
                    </span>
                  </div>

                  <TimeUntilCutoff date={viewing.date} time={viewing.time} />

                  {user && (
                    <div className="viewing-actions">
                      {isRegistered ? (
                        <button onClick={() => handleUnregister(viewing.id)} className="btn-cancel" style={{ width: 'auto', padding: '0.6rem 1.2rem' }}>
                          ✕ Atsiregistruoti
                        </button>
                      ) : canRegister ? (
                        <button onClick={() => handleRegister(viewing.id)} className="btn-primary btn-confirm" style={{ width: 'auto', padding: '0.6rem 1.2rem' }}>
                          ✓ Registruotis
                        </button>
                      ) : (
                        <span className="registration-closed">
                          {spotsLeft <= 0 ? 'Vietos užimtos' : 'Registracija uždaryta (mažiau nei 1 val. iki pradžios)'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {pastViewings.length > 0 && (
        <div className="past-viewings">
          <h2>Praėjusios peržiūros</h2>
          <div className="viewings-list">
            {pastViewings.map(viewing => (
              <div key={viewing.id} className="viewing-card past">
                <div className="viewing-info">
                  <h2>{viewing.movieTitle}</h2>
                  <div className="viewing-meta">
                    <span className="viewing-date">📅 {formatDate(viewing.date)}</span>
                    <span className="viewing-time">🕐 {viewing.time}</span>
                    <span className="viewing-spots">👥 {viewing.participants.length} dalyviai</span>
                  </div>
                  <span className="past-badge">Įvykusi</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
