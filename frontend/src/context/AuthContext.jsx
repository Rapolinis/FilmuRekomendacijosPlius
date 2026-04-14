import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('filmuvercle_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('filmuvercle_user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('filmuvercle_user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('filmuvercle_user');
  }, []);

  const updateUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('filmuvercle_user', JSON.stringify(userData));
  }, []);

  // Sync auth user with DataContext users (call from components that have access to both)
  const syncWithUsers = useCallback((usersArray) => {
    if (!user) return;
    const freshUser = usersArray.find(u => u.id === user.id);
    if (!freshUser) {
      // User was deleted
      logout();
      return;
    }
    if (freshUser.blocked) {
      logout();
      return;
    }
    // Sync role changes
    if (freshUser.role !== user.role || freshUser.username !== user.username) {
      const updated = { ...user, role: freshUser.role, username: freshUser.username };
      setUser(updated);
      localStorage.setItem('filmuvercle_user', JSON.stringify(updated));
    }
  }, [user, logout]);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, syncWithUsers, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
