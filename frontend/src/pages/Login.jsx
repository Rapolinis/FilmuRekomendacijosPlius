import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { sha256 } from '../utils/hash';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { users } = useData();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Prašome užpildyti visus laukus.');
      return;
    }

    const hashedPassword = await sha256(password);
    const user = users.find(u => u.email === email && u.password === hashedPassword);

    if (!user) {
      setError('Neteisingas el. paštas arba slaptažodis.');
      return;
    }

    if (user.blocked) {
      setError(`Jūsų paskyra užblokuota. Priežastis: ${user.blockedReason || 'Nenurodyta'}`);
      return;
    }

    login({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    });
    navigate('/movies');
  };

  return (
    <div className="auth-page">

      {/* Left Column: Cinematic Visual */}
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
            <span className="auth-visual__count">Daugiau nei 10,000+ kino entuziastų</span>
          </div>
        </div>
      </section>

      {/* Right Column: Login Form */}
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
                />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              Pradėti peržiūrą
            </button>
          </form>

          <p className="auth-switch">
            Neturite paskyros? <Link to="/register">Registruokitės dabar</Link>
          </p>

          <div className="auth-demo">
            <p><strong>Demo prisijungimai:</strong></p>
            <p>Admin: admin@filmuvercle.lt / admin</p>
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
