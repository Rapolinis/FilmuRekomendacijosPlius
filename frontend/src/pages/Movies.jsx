import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import MovieCard from '../components/MovieCard';
import './Movies.css';

const ITEMS_PER_PAGE = 12;

export default function Movies() {
  const { movies, genres } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedDirector, setSelectedDirector] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const directors = useMemo(() =>
    [...new Set(movies.map(m => m.director))].sort(),
    [movies]
  );

  const filteredMovies = useMemo(() => {
    let result = [...movies];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(m =>
        m.title.toLowerCase().includes(term) ||
        m.originalTitle.toLowerCase().includes(term) ||
        m.actors.some(a => a.toLowerCase().includes(term)) ||
        m.director.toLowerCase().includes(term)
      );
    }

    if (selectedGenre) result = result.filter(m => m.genre.includes(selectedGenre));
    if (selectedDirector) result = result.filter(m => m.director === selectedDirector);
    if (dateFrom) result = result.filter(m => m.releaseDate >= dateFrom);
    if (dateTo) result = result.filter(m => m.releaseDate <= dateTo);

    switch (sortBy) {
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'title': result.sort((a, b) => a.title.localeCompare(b.title, 'lt')); break;
      case 'date': result.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)); break;
      case 'imdb': result.sort((a, b) => b.imdbRating - a.imdbRating); break;
    }

    return result;
  }, [movies, searchTerm, selectedGenre, selectedDirector, sortBy, dateFrom, dateTo]);

  const totalPages = Math.ceil(filteredMovies.length / ITEMS_PER_PAGE);
  const paginatedMovies = filteredMovies.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenre('');
    setSelectedDirector('');
    setSortBy('rating');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };

  // Reset page when filters change
  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  return (
    <div className="movies-page">
      <div className="page-header">
        <h1>Filmų katalogas</h1>
        <p>Raskite savo kitą mėgstamiausią filmą</p>
      </div>

      <div className="filters-bar">
        <div className="filter-search">
          <input
            type="text"
            placeholder="Ieškoti filmų, aktorių, režisierių..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>

        <div className="filter-row">
          <select value={selectedGenre} onChange={(e) => handleFilterChange(setSelectedGenre)(e.target.value)}>
            <option value="">Visi žanrai</option>
            {genres.map(g => (
              <option key={g.id} value={g.name}>{g.name}</option>
            ))}
          </select>

          <select value={selectedDirector} onChange={(e) => handleFilterChange(setSelectedDirector)(e.target.value)}>
            <option value="">Visi režisieriai</option>
            {directors.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select value={sortBy} onChange={(e) => handleFilterChange(setSortBy)(e.target.value)}>
            <option value="rating">Rikiuoti: Įvertinimas</option>
            <option value="title">Rikiuoti: Pavadinimas</option>
            <option value="date">Rikiuoti: Data</option>
            <option value="imdb">Rikiuoti: IMDb</option>
          </select>

          <div className="date-filters">
            <input type="date" value={dateFrom} onChange={(e) => handleFilterChange(setDateFrom)(e.target.value)} />
            <span>—</span>
            <input type="date" value={dateTo} onChange={(e) => handleFilterChange(setDateTo)(e.target.value)} />
          </div>

          <button onClick={clearFilters} className="btn-clear-filters">✕ Valyti filtrus</button>
        </div>
      </div>

      <div className="movies-count">
        Rasta filmų: <strong>{filteredMovies.length}</strong>
        {totalPages > 1 && <span> (puslapis {currentPage} iš {totalPages})</span>}
      </div>

      <div className="movies-grid">
        {paginatedMovies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="page-btn">
            ← Ankstesnis
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`page-btn ${currentPage === page ? 'active' : ''}`}
            >
              {page}
            </button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="page-btn">
            Kitas →
          </button>
        </div>
      )}

      {filteredMovies.length === 0 && (
        <div className="no-results">
          <p>Filmų pagal šiuos filtrus nerasta.</p>
          <button onClick={clearFilters} className="btn-primary" style={{ width: 'auto', padding: '0.6rem 1.5rem' }}>
            Valyti filtrus
          </button>
        </div>
      )}
    </div>
  );
}
