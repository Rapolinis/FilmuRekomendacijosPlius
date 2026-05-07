import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sha256 } from '../utils/hash';
import './Auth.css';

const API_BASE = 'http://localhost:5075/api';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    if (
      !trimmedUsername ||
      !trimmedEmail ||
      !password ||
      !confirmPassword ||
      !trimmedFirstName ||
      !trimmedLastName
    ) {
      setError('Prašome užpildyti visus privalomus laukus.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Slaptažodžiai nesutampa.');
      return;
    }

    if (password.length < 6) {
      setError('Slaptažodis turi būti bent 6 simbolių.');
      return;
    }

    try {
      setLoading(true);

      const hashedPassword = await sha256(password);

      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: trimmedUsername,
          email: trimmedEmail,
          password: hashedPassword,
          firstName: trimmedFirstName,
          lastName: trimmedLastName,
          birthYear: birthYear || null,
          role: 'viewer',
          avatar: '',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registracija nepavyko.');
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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 80 }, (_, i) => currentYear - 10 - i);

  return (
    <div className="auth-page">
      <section className="auth-visual">
        <div className="auth-visual__bg">
          <img
            src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1400&q=80"
            alt="Cinematic film atmosphere"
          />
          <div className="auth-visual__overlay" />
        </div>

        <div className="auth-visual__content">
          <div className="auth-visual__logo">Filmų rekomendacijos +</div>

          <div>
            <h1 className="auth-visual__headline">
              Pradėkite savo kino kelionę
            </h1>
            <p className="auth-visual__sub">
              Sukurkite paskyrą ir gaukite personalizuotas filmų rekomendacijas,
              pagrįstas jūsų skoniu. Prisijunkite prie bendruomenės, kuri myli kiną.
            </p>
          </div>

          <div className="auth-visual__social">
            <div className="auth-visual__avatars">
              {[4, 5, 6].map(i => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/48?img=${i + 10}`}
                  alt={`User ${i}`}
                />
              ))}
            </div>
            <span className="auth-visual__count">
              Prisijunkite prie 10,000+ narių
            </span>
          </div>
        </div>
      </section>

      <section className="auth-card" style={{ overflowY: 'auto' }}>
        <div className="auth-card__inner">
          <div className="auth-header">
            <h1>Sukurti paskyrą</h1>
            <p>Užpildykite formą ir pradėkite žiūrėti.</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="firstName">Vardas *</label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Vardenis"
                  autoComplete="given-name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Pavardė *</label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Pavardenis"
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="username">Vartotojo vardas *</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="kino_megejas"
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">El. pašto adresas *</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vardas@pavyzdys.lt"
                autoComplete="email"
              />
            </div>

            <div style={{ display: 'grid' }}>
              <div className="form-group">
                <label htmlFor="birthYear">Gimimo metai</label>
                <select
                  id="birthYear"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  style={{ height: '3.5rem' }}
                >
                  <option value="">Pasirinkite</option>
                  {years.map(y => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="password">Slaptažodis *</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Bent 6 simboliai"
                  autoComplete="new-password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Pakartokite *</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Kuriama paskyra...' : 'Pradėti kelionę'}
            </button>
          </form>

          <p className="auth-switch">
            Jau turite paskyrą? <Link to="/login">Prisijunkite</Link>
          </p>
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