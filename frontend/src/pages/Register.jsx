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
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { users, addUser } = useData();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password || !confirmPassword) {
      setError('Prašome užpildyti visus laukus.');
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

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🎬 FilmuVerclė</h1>
          <p>Sukurkite naują paskyrą</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Vartotojo vardas</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Jūsų vardas"
            />
          </div>
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
              placeholder="Bent 6 simboliai"
            />
          </div>
          <div className="form-group">
            <label>Pakartokite slaptažodį</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Pakartokite slaptažodį"
            />
          </div>
          <button type="submit" className="btn-primary">Užsiregistruoti</button>
        </form>

        <p className="auth-switch">
          Jau turite paskyrą? <Link to="/login">Prisijunkite</Link>
        </p>
      </div>
    </div>
  );
}
