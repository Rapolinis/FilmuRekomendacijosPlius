import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import initialMovies from '../data/movies.json';
import initialUsers from '../data/users.json';
import initialGenres from '../data/genres.json';
import initialCategories from '../data/categories.json';
import initialViewings from '../data/viewings.json';
import initialWatchlists from '../data/watchlists.json';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const DataContext = createContext(null);

const API_BASE = 'http://localhost:5075';

function usePersistedState(key, fallback) {
  const [state, setState] = useState(() => loadFromStorage(key, fallback));

  useEffect(() => {
    saveToStorage(key, state);
  }, [key, state]);

  return [state, setState];
}

export function DataProvider({ children }) {
  // Movies are fetched from the MySQL backend
  const [movies, setMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/movies`)
      .then(res => {
        if (!res.ok) throw new Error('API unavailable');
        return res.json();
      })
      .then(data => {
        setMovies(data);
        setMoviesLoading(false);
      })
      .catch(() => {
        // Fallback to local JSON if backend is not running
        setMovies(loadFromStorage('movies', initialMovies));
        setMoviesLoading(false);
      });
  }, []);

  const [users, setUsers] = usePersistedState('users', initialUsers);
  const [genres, setGenres] = usePersistedState('genres', initialGenres);
  const [categories, setCategories] = usePersistedState('categories', initialCategories);
  const [viewings, setViewings] = usePersistedState('viewings', initialViewings);
  const [watchlists, setWatchlists] = usePersistedState('watchlists', initialWatchlists);
  const [userRatings, setUserRatings] = usePersistedState('userRatings', {});
  // userRatings: { "userId_movieId": rating }

  // --- Movies ---
  const addMovie = useCallback((movie) => {
    let newMovie;
    setMovies(prev => {
      const id = Math.max(0, ...prev.map(m => m.id)) + 1;
      newMovie = { ...movie, id };
      return [...prev, newMovie];
    });
    return newMovie;
  }, [setMovies]);

  const updateMovie = useCallback((id, updates) => {
    setMovies(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }, [setMovies]);

  const deleteMovie = useCallback((id) => {
    setMovies(prev => prev.filter(m => m.id !== id));
  }, [setMovies]);

  const addComment = useCallback((movieId, comment) => {
    setMovies(prev => prev.map(m =>
      m.id === movieId
        ? { ...m, comments: [...(m.comments || []), comment] }
        : m
    ));
  }, [setMovies]);

  const editComment = useCallback((movieId, commentIndex, newText) => {
    setMovies(prev => prev.map(m =>
      m.id === movieId
        ? {
          ...m,
          comments: (m.comments || []).map((c, i) =>
            i === commentIndex ? { ...c, text: newText, edited: true } : c
          )
        }
        : m
    ));
  }, [setMovies]);

  const deleteComment = useCallback((movieId, commentIndex) => {
    setMovies(prev => prev.map(m =>
      m.id === movieId
        ? { ...m, comments: (m.comments || []).filter((_, i) => i !== commentIndex) }
        : m
    ));
  }, [setMovies]);

  const rateMovie = useCallback((movieId, userId, rating) => {
    const key = `${userId}_${movieId}`;
    // Enforce: prevent duplicate ratings at data layer
    setUserRatings(prev => {
      if (prev[key]) return prev; // Already rated, do nothing
      return { ...prev, [key]: rating };
    });
    setMovies(prev => prev.map(m => {
      if (m.id !== movieId) return m;
      // Double-check not already counted (belt and suspenders)
      const newRatings = [...(m.ratings || []), rating];
      return {
        ...m,
        ratings: newRatings,
        rating: Number((newRatings.reduce((a, b) => a + b, 0) / newRatings.length).toFixed(1))
      };
    }));
  }, [setMovies, setUserRatings]);

  const hasUserRated = useCallback((userId, movieId) => {
    return !!userRatings[`${userId}_${movieId}`];
  }, [userRatings]);

  // --- Users ---
  const addUser = useCallback((user) => {
    let newUser;
    setUsers(prev => {
      const id = Math.max(0, ...prev.map(u => u.id)) + 1;
      newUser = { ...user, id };
      return [...prev, newUser];
    });
    return newUser;
  }, [setUsers]);

  const updateUser = useCallback((id, updates) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  }, [setUsers]);

  const blockUser = useCallback((id, reason, until) => {
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, blocked: true, blockedReason: reason, blockedUntil: until } : u
    ));
  }, [setUsers]);

  const unblockUser = useCallback((id) => {
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, blocked: false, blockedReason: '', blockedUntil: null } : u
    ));
  }, [setUsers]);

  const deleteUser = useCallback((id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  }, [setUsers]);

  const changeUserRole = useCallback((id, newRole) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
  }, [setUsers]);

  // --- Genres ---
  const addGenre = useCallback((name) => {
    setGenres(prev => {
      const id = Math.max(0, ...prev.map(g => g.id)) + 1;
      return [...prev, { id, name }];
    });
  }, [setGenres]);

  const updateGenre = useCallback((id, name) => {
    setGenres(prev => prev.map(g => g.id === id ? { ...g, name } : g));
  }, [setGenres]);

  const deleteGenre = useCallback((id) => {
    setGenres(prev => prev.filter(g => g.id !== id));
  }, [setGenres]);

  // --- Categories ---
  const addCategory = useCallback((name) => {
    setCategories(prev => {
      const id = Math.max(0, ...prev.map(c => c.id)) + 1;
      return [...prev, { id, name }];
    });
  }, [setCategories]);

  const updateCategory = useCallback((id, name) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name } : c));
  }, [setCategories]);

  const deleteCategory = useCallback((id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  }, [setCategories]);

  // --- Viewings ---
  const addViewing = useCallback((viewing) => {
    let newViewing;
    setViewings(prev => {
      const id = Math.max(0, ...prev.map(v => v.id)) + 1;
      newViewing = { ...viewing, id };
      return [...prev, newViewing];
    });
    return newViewing;
  }, [setViewings]);

  const registerForViewing = useCallback((viewingId, userId) => {
    setViewings(prev => prev.map(v =>
      v.id === viewingId && !v.participants.includes(userId) && v.participants.length < v.maxParticipants
        ? { ...v, participants: [...v.participants, userId] }
        : v
    ));
  }, [setViewings]);

  const unregisterFromViewing = useCallback((viewingId, userId) => {
    setViewings(prev => prev.map(v =>
      v.id === viewingId
        ? { ...v, participants: v.participants.filter(p => p !== userId) }
        : v
    ));
  }, [setViewings]);

  // --- Watchlist ---
  const addToWatchlist = useCallback((userId, movieId) => {
    setWatchlists(prev => {
      const existing = prev.find(w => w.userId === userId);
      if (existing) {
        if (existing.movieIds.includes(movieId)) return prev;
        return prev.map(w =>
          w.userId === userId ? { ...w, movieIds: [...w.movieIds, movieId] } : w
        );
      }
      return [...prev, { userId, movieIds: [movieId] }];
    });
  }, [setWatchlists]);

  const removeFromWatchlist = useCallback((userId, movieId) => {
    setWatchlists(prev => prev.map(w =>
      w.userId === userId ? { ...w, movieIds: w.movieIds.filter(id => id !== movieId) } : w
    ));
  }, [setWatchlists]);

  const getUserWatchlist = useCallback((userId) => {
    const wl = watchlists.find(w => w.userId === userId);
    return wl ? wl.movieIds : [];
  }, [watchlists]);

  return (
    <DataContext.Provider value={{
      movies, moviesLoading,
      addMovie, updateMovie, deleteMovie, addComment, editComment, deleteComment, rateMovie, hasUserRated,
      users, addUser, updateUser, blockUser, unblockUser, deleteUser, changeUserRole,
      genres, addGenre, updateGenre, deleteGenre,
      categories, addCategory, updateCategory, deleteCategory,
      viewings, addViewing, registerForViewing, unregisterFromViewing,
      watchlists, addToWatchlist, removeFromWatchlist, getUserWatchlist
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
