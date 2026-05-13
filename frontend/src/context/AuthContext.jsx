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
      } catch {
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

  const syncWithUsers = useCallback((usersArray) => {
    if (!user) return;

    const freshUser = usersArray.find(u => u.id === user.id);

    if (!freshUser || freshUser.blocked) {
      logout();
      return;
    }

    if (freshUser.role !== user.role || freshUser.username !== user.username) {
      const updated = {
        ...user,
        role: freshUser.role,
        username: freshUser.username
      };

      setUser(updated);
      localStorage.setItem('filmuvercle_user', JSON.stringify(updated));
    }
  }, [user, logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser: user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        updateUser,
        syncWithUsers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}