import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { sha256 } from '../utils/hash';
import './Auth.css';
import './Profile.css';

export default function Profile() {
  const { user, updateUser: updateAuthUser, logout } = useAuth();
  const { users, updateUser, deleteUser } = useData();
  const navigate = useNavigate();

  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [editingUsername, setEditingUsername] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!user) return null;

  const showMsg = (msg, isError = false) => {
    if (isError) { setError(msg); setMessage(''); }
    else { setMessage(msg); setError(''); }
    setTimeout(() => { setMessage(''); setError(''); }, 3000);
  };

  const handleUpdateUsername = () => {
    if (!newUsername.trim()) {
      showMsg('Vardas negali būti tuščias.', true);
      return;
    }
    if (users.find(u => u.username === newUsername && u.id !== user.id)) {
      showMsg('Šis vardas jau užimtas.', true);
      return;
    }
    updateUser(user.id, { username: newUsername });
    updateAuthUser({ ...user, username: newUsername });
    setEditingUsername(false);
    showMsg('Vardas sėkmingai pakeistas!');
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      showMsg('Užpildykite abu slaptažodžio laukus.', true);
      return;
    }
    if (newPassword !== confirmPassword) {
      showMsg('Slaptažodžiai nesutampa.', true);
      return;
    }
    if (newPassword.length < 6) {
      showMsg('Slaptažodis turi būti bent 6 simbolių.', true);
      return;
    }
    const hashed = await sha256(newPassword);
    updateUser(user.id, { password: hashed });
    setEditingPassword(false);
    setNewPassword('');
    setConfirmPassword('');
    showMsg('Slaptažodis sėkmingai pakeistas!');
  };

  const handleDeleteAccount = () => {
    if (confirm('Ar tikrai norite ištrinti savo paskyrą? Šis veiksmas negrįžtamas.')) {
      deleteUser(user.id);
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>Mano paskyra</h1>
        <p>Tvarkykite savo asmeninę informaciją</p>
      </div>

      <div className="profile-card">
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="profile-info">
          <div className="profile-avatar">👤</div>
          <div>
            <h2>{user.username}</h2>
            <p className="profile-email">{user.email}</p>
            <span className="profile-role">
              {user.role === 'admin' ? 'Administratorius' :
                user.role === 'moderator' ? 'Moderatorius' : 'Žiūrėtojas'}
            </span>
          </div>
        </div>

        <div className="profile-section">
          <h3>Vartotojo vardas</h3>
          {editingUsername ? (
            <div className="edit-row">
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
              <button onClick={handleUpdateUsername} className="btn-primary btn-confirm" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                ✓ Išsaugoti
              </button>
              <button onClick={() => { setEditingUsername(false); setNewUsername(user.username); }}
                className="btn-primary btn-cancel" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                ✕ Atšaukti
              </button>
            </div>
          ) : (
            <div className="edit-row">
              <span>{user.username}</span>
              <button onClick={() => setEditingUsername(true)} className="btn-edit">Keisti vardą</button>
            </div>
          )}
        </div>

        <div className="profile-section">
          <h3>Slaptažodis</h3>
          {editingPassword ? (
            <div className="edit-column">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Naujas slaptažodis"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Pakartokite slaptažodį"
              />
              <div className="edit-row">
                <button onClick={handleUpdatePassword} className="btn-primary btn-confirm" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                  ✓ Išsaugoti
                </button>
                <button onClick={() => { setEditingPassword(false); setNewPassword(''); setConfirmPassword(''); }}
                  className="btn-primary btn-cancel" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                  ✕ Atšaukti
                </button>
              </div>
            </div>
          ) : (
            <div className="edit-row">
              <span>••••••••</span>
              <button onClick={() => setEditingPassword(true)} className="btn-edit">Keisti slaptažodį</button>
            </div>
          )}
        </div>

        <div className="profile-danger">
          <button onClick={handleDeleteAccount} className="btn-delete-account">
            Ištrinti paskyrą
          </button>
        </div>
      </div>
    </div>
  );
}
