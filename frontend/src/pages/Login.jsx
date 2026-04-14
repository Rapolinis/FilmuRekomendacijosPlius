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
      <div className="auth-card">
        <div className="auth-header">
          <h1>🎬 FilmuVerclė</h1>
          <p>Prisijunkite prie savo paskyros</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>El. paštas</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vardas@paštas.lt"
            />
          </div>
          <div className="form-group">
            <label>Slaptažodis</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Jūsų slaptažodis"
            />
          </div>
          <button type="submit" className="btn-primary">Prisijungti</button>
        </form>

        <p className="auth-switch">
          Neturite paskyros? <Link to="/register">Užsiregistruokite</Link>
        </p>

        <div className="auth-demo">
          <p><strong>Demo prisijungimai:</strong></p>
          <p>Admin: admin@filmuvercle.lt / admin</p>
          <p>Žiūrėtojas: ziuretojas@filmuvercle.lt / 12345678</p>
        </div>
      </div>
    </div>
  );
}
