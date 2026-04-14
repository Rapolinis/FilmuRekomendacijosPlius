import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { sha256 } from '../utils/hash';
import './Auth.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [favoriteGenre, setFavoriteGenre] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { users, addUser } = useData();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password || !confirmPassword || !firstName || !lastName) {
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

    if (users.find(u => u.email === email)) {
      setError('Šis el. paštas jau užregistruotas.');
      return;
    }

    if (users.find(u => u.username === username)) {
      setError('Šis vartotojo vardas jau užimtas.');
      return;
    }

    const hashedPassword = await sha256(password);
    const newUser = addUser({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      birthYear: birthYear || null,
      favoriteGenre: favoriteGenre || null,
      role: 'viewer',
      avatar: '',
      blocked: false,
      blockedReason: '',
      blockedUntil: null,
      createdAt: new Date().toISOString().split('T')[0]
    });

    login({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar
    });
    navigate('/movies');
  };

  const genres = [
    'Veiksmo', 'Komedija', 'Drama', 'Siaubo', 'Trileris',
    'Fantastika', 'Animacija', 'Romantika', 'Dokumentinis', 'Istorinis'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 80 }, (_, i) => currentYear - 10 - i);

  return (
    <div className="auth-page">

      {/* Left Column: Cinematic Visual */}
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
            <span className="auth-visual__count">Prisijunkite prie 10,000+ narių</span>
          </div>
        </div>
      </section>

      {/* Right Column: Registration Form */}
      <section className="auth-card" style={{ overflowY: 'auto' }}>
        <div className="auth-card__inner">

          <div className="auth-header">
            <h1>Sukurti paskyrą</h1>
            <p>Užpildykite formą ir pradėkite žiūrėti.</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>

            {/* Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="firstName">Vardas *</label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Vardenis"
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
              />
            </div>

            {/* Birth year + genre row */}
            <div style={{ display: 'grid'}}>
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
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="password">Slaptažodis *</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Bent 6 simboliai"
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
                />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              Pradėti kelionę
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
