import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sha256 } from '../utils/hash';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Prašome užpildyti visus laukus.');
      return;
    }

    try {
      setLoading(true);

      const hashedPassword = await sha256(password);

      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: hashedPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Neteisingas el. paštas arba slaptažodis.');
        return;
      }

      login({
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role,
        avatar: data.avatar,
      });

      navigate('/movies');
    } catch (err) {
      setError('Nepavyko prisijungti prie serverio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-visual">
        <div className="auth-visual__bg">
          <img
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1400&q=80"
            alt="Cinematic theater atmosphere"
          />
          <div className="auth-visual__overlay" />
        </div>

        <div className="auth-visual__content">
          <div className="auth-visual__logo">🎬Filmų rekomendacijos +</div>

          <div>
            <h1 className="auth-visual__headline">
              Atraskite naujas istorijas
            </h1>
            <p className="auth-visual__sub">
              Pasinerkite į kruopščiai atrinktą kino pasaulį, kuriame kiekvienas
              kadras pasakoja unikalią istoriją. Jūsų asmeninis gidas per didįjį ekraną.
            </p>
          </div>

          <div className="auth-visual__social">
            <div className="auth-visual__avatars">
              {[1, 2, 3].map(i => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/48?img=${i + 10}`}
                  alt={`User ${i}`}
                />
              ))}
            </div>
            <span className="auth-visual__count">
              Daugiau nei 10,000+ kino entuziastų
            </span>
          </div>
        </div>
      </section>

      <section className="auth-card">
        <div className="auth-card__inner">
          <div className="auth-header">
            <h1>Sveiki sugrįžę</h1>
            <p>Prisijunkite prie savo paskyros ir tęskite kelionę.</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">El. pašto adresas</label>
              <div className="input-wrapper">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vardas@pavyzdys.lt"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Slaptažodis</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Jungiamasi...' : 'Pradėti peržiūrą'}
            </button>
          </form>

          <p className="auth-switch">
            Neturite paskyros? <Link to="/register">Registruokitės dabar</Link>
          </p>

          <div className="auth-demo">
            <p><strong>Demo prisijungimai:</strong></p>
            <p>Admin: admin@filmuvercle.lt / admin</p>
            <p>Moderatorius: mod@filmuvercle.lt / moderatorius</p>
            <p>Žiūrėtojas: ziuretojas@filmuvercle.lt / 12345678</p>
          </div>
        </div>

        <footer className="auth-footer">
          <span>© 2024 Filmų rekomendacijos +</span>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#">Privatumas</a>
            <a href="#">Sąlygos</a>
          </div>
        </footer>
      </section>
    </div>
  );
}