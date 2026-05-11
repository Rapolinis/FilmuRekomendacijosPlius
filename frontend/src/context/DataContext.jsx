import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const DataContext = createContext(null);

const API_BASE = 'http://localhost:5075';

export function DataProvider({ children }) {
  const [movies, setMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [genres, setGenres] = useState([]);
  const [categories, setCategories] = useState([]);
  const [viewings, setViewings] = useState([]);
  const [watchlists, setWatchlists] = useState([]);
  const [userRatings, setUserRatings] = useState({});

  const refreshMovies = useCallback(async () => {
    const res = await fetch(`${API_BASE}/api/movies`);
    const data = await res.json();
    setMovies(data);
  }, []);

  useEffect(() => {
    async function loadAllData() {
      try {
        setMoviesLoading(true);

        const moviesRes = await fetch(`${API_BASE}/api/movies`);
        if (moviesRes.ok) {
          setMovies(await moviesRes.json());
        }

        const genresRes = await fetch(`${API_BASE}/api/genres`);
        if (genresRes.ok) {
          setGenres(await genresRes.json());
        }

        const categoriesRes = await fetch(`${API_BASE}/api/categories`);
        if (categoriesRes.ok) {
          setCategories(await categoriesRes.json());
        }

        const usersRes = await fetch(`${API_BASE}/api/users`);
        if (usersRes.ok) {
          setUsers(await usersRes.json());
        }

        const viewingsRes = await fetch(`${API_BASE}/api/viewings`);
        if (viewingsRes.ok) {
          setViewings(await viewingsRes.json());
        }

        const watchlistsRes = await fetch(`${API_BASE}/api/watchlists`);
        if (watchlistsRes.ok) {
          setWatchlists(await watchlistsRes.json());
        }
      } catch (error) {
        console.error('Nepavyko gauti duomenų iš API:', error);
      } finally {
        setMoviesLoading(false);
      }
    }

    loadAllData();
  }, []);

  const addMovie = useCallback((movie) => {
    console.warn('addMovie dar neprijungtas prie API');
  }, []);

  const updateMovie = useCallback((id, updates) => {
    console.warn('updateMovie dar neprijungtas prie API');
  }, []);

  const deleteMovie = useCallback((id) => {
    console.warn('deleteMovie dar neprijungtas prie API');
  }, []);

  const addComment = useCallback((movieId, comment) => {
    setMovies(prev => prev.map(m =>
      m.id === movieId
        ? { ...m, comments: [...(m.comments || []), comment] }
        : m
    ));
  }, []);

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
  }, []);

  const deleteComment = useCallback((movieId, commentIndex) => {
    setMovies(prev => prev.map(m =>
      m.id === movieId
        ? { ...m, comments: (m.comments || []).filter((_, i) => i !== commentIndex) }
        : m
    ));
  }, []);

  const rateMovie = useCallback((movieId, userId, rating) => {
    const key = `${userId}_${movieId}`;

    setUserRatings(prev => {
      if (prev[key]) return prev;
      return { ...prev, [key]: rating };
    });

    setMovies(prev => prev.map(m => {
      if (m.id !== movieId) return m;

      const newRatings = [...(m.ratings || []), rating];

      return {
        ...m,
        ratings: newRatings,
        rating: Number((newRatings.reduce((a, b) => a + b, 0) / newRatings.length).toFixed(1))
      };
    }));
  }, []);

  const hasUserRated = useCallback((userId, movieId) => {
    return !!userRatings[`${userId}_${movieId}`];
  }, [userRatings]);

  const addUser = useCallback((user) => {
    let newUser;

    setUsers(prev => {
      const id = Math.max(0, ...prev.map(u => u.id)) + 1;
      newUser = { ...user, id };
      return [...prev, newUser];
    });

    return newUser;
  }, []);

  const updateUser = useCallback((id, updates) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  }, []);

  const blockUser = useCallback((id, reason, until) => {
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, blocked: true, blockedReason: reason, blockedUntil: until } : u
    ));
  }, []);

  const unblockUser = useCallback((id) => {
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, blocked: false, blockedReason: '', blockedUntil: null } : u
    ));
  }, []);

  const deleteUser = useCallback((id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  const changeUserRole = useCallback((id, newRole) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
  }, []);

  const addGenre = useCallback((name) => {
    setGenres(prev => {
      const id = Math.max(0, ...prev.map(g => g.id)) + 1;
      return [...prev, { id, name }];
    });
  }, []);

  const updateGenre = useCallback((id, name) => {
    setGenres(prev => prev.map(g => g.id === id ? { ...g, name } : g));
  }, []);

  const deleteGenre = useCallback((id) => {
    setGenres(prev => prev.filter(g => g.id !== id));
  }, []);

  const addCategory = useCallback((name) => {
    setCategories(prev => {
      const id = Math.max(0, ...prev.map(c => c.id)) + 1;
      return [...prev, { id, name }];
    });
  }, []);

  const updateCategory = useCallback((id, name) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name } : c));
  }, []);

  const deleteCategory = useCallback((id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  const addViewing = useCallback((viewing) => {
    let newViewing;

    setViewings(prev => {
      const id = Math.max(0, ...prev.map(v => v.id)) + 1;
      newViewing = { ...viewing, id };
      return [...prev, newViewing];
    });

    return newViewing;
  }, []);

  const registerForViewing = useCallback((viewingId, userId) => {
    setViewings(prev => prev.map(v =>
      v.id === viewingId &&
      !v.participants.includes(userId) &&
      v.participants.length < v.maxParticipants
        ? { ...v, participants: [...v.participants, userId] }
        : v
    ));
  }, []);

  const unregisterFromViewing = useCallback((viewingId, userId) => {
    setViewings(prev => prev.map(v =>
      v.id === viewingId
        ? { ...v, participants: v.participants.filter(p => p !== userId) }
        : v
    ));
  }, []);

  const addToWatchlist = useCallback((userId, movieId) => {
    setWatchlists(prev => {
      const existing = prev.find(w => w.userId === userId);

      if (existing) {
        if (existing.movieIds.includes(movieId)) return prev;

        return prev.map(w =>
          w.userId === userId
            ? { ...w, movieIds: [...w.movieIds, movieId] }
            : w
        );
      }

      return [...prev, { userId, movieIds: [movieId] }];
    });
  }, []);

  const removeFromWatchlist = useCallback((userId, movieId) => {
    setWatchlists(prev => prev.map(w =>
      w.userId === userId
        ? { ...w, movieIds: w.movieIds.filter(id => id !== movieId) }
        : w
    ));
  }, []);

  const getUserWatchlist = useCallback((userId) => {
    const wl = watchlists.find(w => w.userId === userId);
    return wl ? wl.movieIds : [];
  }, [watchlists]);

  return (
    <DataContext.Provider value={{
      movies,
      moviesLoading,
      refreshMovies,

      addMovie,
      updateMovie,
      deleteMovie,
      addComment,
      editComment,
      deleteComment,
      rateMovie,
      hasUserRated,

      users,
      addUser,
      updateUser,
      blockUser,
      unblockUser,
      deleteUser,
      changeUserRole,

      genres,
      addGenre,
      updateGenre,
      deleteGenre,

      categories,
      addCategory,
      updateCategory,
      deleteCategory,

      viewings,
      addViewing,
      registerForViewing,
      unregisterFromViewing,

      watchlists,
      addToWatchlist,
      removeFromWatchlist,
      getUserWatchlist
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }

  return context;
}