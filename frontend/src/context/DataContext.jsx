import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const DataContext = createContext(null);

const API_BASE = 'http://localhost:5075/api';

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || 'API klaida');
  }

  return data;
}

export function DataProvider({ children }) {
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [genres, setGenres] = useState([]);
  const [categories, setCategories] = useState([]);
  const [viewings, setViewings] = useState([]);
  const [watchlists, setWatchlists] = useState([]);

  const [moviesLoading, setMoviesLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [genresLoading, setGenresLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [viewingsLoading, setViewingsLoading] = useState(true);
  const [watchlistsLoading, setWatchlistsLoading] = useState(true);

  const refreshMovies = useCallback(async () => {
    setMoviesLoading(true);
    try {
      const data = await apiRequest('/movies');
      setMovies(data);
    } finally {
      setMoviesLoading(false);
    }
  }, []);

  const refreshUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const data = await apiRequest('/users');
      setUsers(data);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  const refreshGenres = useCallback(async () => {
    setGenresLoading(true);
    try {
      const data = await apiRequest('/genres');
      setGenres(data);
    } finally {
      setGenresLoading(false);
    }
  }, []);

  const refreshCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const data = await apiRequest('/categories');
      setCategories(data);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const refreshViewings = useCallback(async () => {
    setViewingsLoading(true);
    try {
      const data = await apiRequest('/viewings');
      setViewings(data);
    } finally {
      setViewingsLoading(false);
    }
  }, []);

  const refreshWatchlists = useCallback(async () => {
    setWatchlistsLoading(true);
    try {
      const data = await apiRequest('/watchlists');
      setWatchlists(data);
    } finally {
      setWatchlistsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMovies().catch(console.error);
    refreshUsers().catch(console.error);
    refreshGenres().catch(console.error);
    refreshCategories().catch(console.error);
    refreshViewings().catch(console.error);
    refreshWatchlists().catch(console.error);
  }, [
    refreshMovies,
    refreshUsers,
    refreshGenres,
    refreshCategories,
    refreshViewings,
    refreshWatchlists,
  ]);

  // --- Movies ---
  const addMovie = useCallback(async (movie) => {
    const newMovie = await apiRequest('/movies', {
      method: 'POST',
      body: JSON.stringify(movie),
    });

    setMovies(prev => [...prev, newMovie]);
    return newMovie;
  }, []);

  const updateMovie = useCallback(async (id, updates) => {
    const updatedMovie = await apiRequest(`/movies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    setMovies(prev => prev.map(m => m.id === id ? updatedMovie : m));
    return updatedMovie;
  }, []);

  const deleteMovie = useCallback(async (id) => {
    await apiRequest(`/movies/${id}`, {
      method: 'DELETE',
    });

    setMovies(prev => prev.filter(m => m.id !== id));
  }, []);

  const addComment = useCallback(async (movieId, comment) => {
    const newComment = await apiRequest(`/movies/${movieId}/comments`, {
      method: 'POST',
      body: JSON.stringify(comment),
    });

    setMovies(prev => prev.map(m =>
      m.id === movieId
        ? { ...m, comments: [...(m.comments || []), newComment] }
        : m
    ));

    return newComment;
  }, []);

  const editComment = useCallback(async (movieId, commentId, newText) => {
    const updatedComment = await apiRequest(`/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({ text: newText }),
    });

    setMovies(prev => prev.map(m =>
      m.id === movieId
        ? {
            ...m,
            comments: (m.comments || []).map(c =>
              c.id === commentId ? updatedComment : c
            ),
          }
        : m
    ));

    return updatedComment;
  }, []);

  const deleteComment = useCallback(async (movieId, commentId) => {
    await apiRequest(`/comments/${commentId}`, {
      method: 'DELETE',
    });

    setMovies(prev => prev.map(m =>
      m.id === movieId
        ? { ...m, comments: (m.comments || []).filter(c => c.id !== commentId) }
        : m
    ));
  }, []);

  const rateMovie = useCallback(async (movieId, userId, rating) => {
    const updatedMovie = await apiRequest(`/movies/${movieId}/ratings`, {
      method: 'POST',
      body: JSON.stringify({ userId, rating }),
    });

    setMovies(prev => prev.map(m => m.id === movieId ? updatedMovie : m));
    return updatedMovie;
  }, []);

  const hasUserRated = useCallback((userId, movieId) => {
    const movie = movies.find(m => m.id === movieId);

    if (!movie) return false;

    return (movie.userRatings || []).some(r => r.userId === userId);
  }, [movies]);

  // --- Users ---
  const addUser = useCallback(async (user) => {
    const newUser = await apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });

    setUsers(prev => [...prev, newUser]);
    return newUser;
  }, []);

  const updateUser = useCallback(async (id, updates) => {
    const updatedUser = await apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
    return updatedUser;
  }, []);

  const blockUser = useCallback(async (id, reason, until) => {
    const updatedUser = await apiRequest(`/users/${id}/block`, {
      method: 'PATCH',
      body: JSON.stringify({
        blockedReason: reason,
        blockedUntil: until,
      }),
    });

    setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
    return updatedUser;
  }, []);

  const unblockUser = useCallback(async (id) => {
    const updatedUser = await apiRequest(`/users/${id}/unblock`, {
      method: 'PATCH',
    });

    setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
    return updatedUser;
  }, []);

  const deleteUser = useCallback(async (id) => {
    await apiRequest(`/users/${id}`, {
      method: 'DELETE',
    });

    setUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  const changeUserRole = useCallback(async (id, newRole) => {
    const updatedUser = await apiRequest(`/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role: newRole }),
    });

    setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
    return updatedUser;
  }, []);

  // --- Genres ---
  const addGenre = useCallback(async (name) => {
    const newGenre = await apiRequest('/genres', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });

    setGenres(prev => [...prev, newGenre]);
    return newGenre;
  }, []);

  const updateGenre = useCallback(async (id, name) => {
    const updatedGenre = await apiRequest(`/genres/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });

    setGenres(prev => prev.map(g => g.id === id ? updatedGenre : g));
    return updatedGenre;
  }, []);

  const deleteGenre = useCallback(async (id) => {
    await apiRequest(`/genres/${id}`, {
      method: 'DELETE',
    });

    setGenres(prev => prev.filter(g => g.id !== id));
  }, []);

  // --- Categories ---
  const addCategory = useCallback(async (name) => {
    const newCategory = await apiRequest('/categories', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });

    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  }, []);

  const updateCategory = useCallback(async (id, name) => {
    const updatedCategory = await apiRequest(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });

    setCategories(prev => prev.map(c => c.id === id ? updatedCategory : c));
    return updatedCategory;
  }, []);

  const deleteCategory = useCallback(async (id) => {
    await apiRequest(`/categories/${id}`, {
      method: 'DELETE',
    });

    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  // --- Viewings ---
  const addViewing = useCallback(async (viewing) => {
    const newViewing = await apiRequest('/viewings', {
      method: 'POST',
      body: JSON.stringify(viewing),
    });

    setViewings(prev => [...prev, newViewing]);
    return newViewing;
  }, []);

  const registerForViewing = useCallback(async (viewingId, userId) => {
    const updatedViewing = await apiRequest(`/viewings/${viewingId}/register`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });

    setViewings(prev => prev.map(v => v.id === viewingId ? updatedViewing : v));
    return updatedViewing;
  }, []);

  const unregisterFromViewing = useCallback(async (viewingId, userId) => {
    const updatedViewing = await apiRequest(`/viewings/${viewingId}/unregister`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });

    setViewings(prev => prev.map(v => v.id === viewingId ? updatedViewing : v));
    return updatedViewing;
  }, []);

  // --- Watchlist ---
  const addToWatchlist = useCallback(async (userId, movieId) => {
    const updatedWatchlist = await apiRequest('/watchlists', {
      method: 'POST',
      body: JSON.stringify({ userId, movieId }),
    });

    setWatchlists(prev => {
      const existing = prev.find(w => w.userId === userId);

      if (existing) {
        return prev.map(w => w.userId === userId ? updatedWatchlist : w);
      }

      return [...prev, updatedWatchlist];
    });

    return updatedWatchlist;
  }, []);

  const removeFromWatchlist = useCallback(async (userId, movieId) => {
    const updatedWatchlist = await apiRequest('/watchlists/remove', {
      method: 'POST',
      body: JSON.stringify({ userId, movieId }),
    });

    setWatchlists(prev => prev.map(w =>
      w.userId === userId ? updatedWatchlist : w
    ));

    return updatedWatchlist;
  }, []);

  const getUserWatchlist = useCallback((userId) => {
    const wl = watchlists.find(w => w.userId === userId);
    return wl ? wl.movieIds : [];
  }, [watchlists]);

  return (
    <DataContext.Provider
      value={{
        movies,
        moviesLoading,
        users,
        usersLoading,
        genres,
        genresLoading,
        categories,
        categoriesLoading,
        viewings,
        viewingsLoading,
        watchlists,
        watchlistsLoading,

        refreshMovies,
        refreshUsers,
        refreshGenres,
        refreshCategories,
        refreshViewings,
        refreshWatchlists,

        addMovie,
        updateMovie,
        deleteMovie,
        addComment,
        editComment,
        deleteComment,
        rateMovie,
        hasUserRated,

        addUser,
        updateUser,
        blockUser,
        unblockUser,
        deleteUser,
        changeUserRole,

        addGenre,
        updateGenre,
        deleteGenre,

        addCategory,
        updateCategory,
        deleteCategory,

        addViewing,
        registerForViewing,
        unregisterFromViewing,

        addToWatchlist,
        removeFromWatchlist,
        getUserWatchlist,
      }}
    >
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