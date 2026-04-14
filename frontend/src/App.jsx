import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Spinner from './components/Spinner';
import Login from './pages/Login';
import Register from './pages/Register';
import Movies from './pages/Movies';
import MovieDetail from './pages/MovieDetail';
import Viewings from './pages/Viewings';
import Recommendation from './pages/Recommendation';
import AIGenerate from './pages/AIGenerate';
import Watchlist from './pages/Watchlist';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Moderator from './pages/Moderator';
import './App.css';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/movies" />;
  }
  return children;
}

function AuthSync() {
  const { syncWithUsers } = useAuth();
  const { users } = useData();
  useEffect(() => {
    syncWithUsers(users);
  }, [users, syncWithUsers]);
  return null;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;

  return (
    <>
      <AuthSync />
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/movies" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/movies" /> : <Register />} />

          <Route path="/movies" element={
            <ProtectedRoute><Movies /></ProtectedRoute>
          } />
          <Route path="/movies/:id" element={
            <ProtectedRoute><MovieDetail /></ProtectedRoute>
          } />
          <Route path="/viewings" element={
            <ProtectedRoute allowedRoles={['viewer', 'admin', 'moderator']}><Viewings /></ProtectedRoute>
          } />
          <Route path="/recommendation" element={
            <ProtectedRoute allowedRoles={['viewer', 'admin', 'moderator']}><Recommendation /></ProtectedRoute>
          } />
          <Route path="/ai-generate" element={
            <ProtectedRoute allowedRoles={['viewer', 'admin', 'moderator']}><AIGenerate /></ProtectedRoute>
          } />
          <Route path="/watchlist" element={
            <ProtectedRoute allowedRoles={['viewer', 'admin', 'moderator']}><Watchlist /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}><Admin /></ProtectedRoute>
          } />
          <Route path="/moderator" element={
            <ProtectedRoute allowedRoles={['moderator']}><Moderator /></ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to={user ? "/movies" : "/login"} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <AppRoutes />
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
