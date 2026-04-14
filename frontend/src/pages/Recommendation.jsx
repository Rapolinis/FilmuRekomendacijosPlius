import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import MovieCard from '../components/MovieCard';
import { getMoonPhase } from '../utils/helpers';
import './Recommendation.css';

export default function Recommendation() {
  const { movies } = useData();
  const [mood, setMood] = useState('');
  const [weather, setWeather] = useState('');
  const [shoeSize, setShoeSize] = useState(42);
  const [extraCriteria, setExtraCriteria] = useState('');
  const [showResults, setShowResults] = useState(false);

  const moonPhase = useMemo(() => getMoonPhase(), []);

  const moods = [
    { value: 'laimingas', label: 'Laimingas 😊', genres: ['Komedija', 'Nuotykių', 'Animacinis'] },
    { value: 'liudnas', label: 'Liūdnas 😢', genres: ['Drama', 'Romantinis'] },
    { value: 'issigandes', label: 'Noriu adrenalino 😱', genres: ['Siaubo', 'Trileris'] },
    { value: 'nuobodu', label: 'Nuobodu 😴', genres: ['Veiksmo', 'Mokslinė fantastika'] },
    { value: 'romantiskas', label: 'Romantiškas ❤️', genres: ['Romantinis', 'Drama', 'Komedija'] },
    { value: 'smalsus', label: 'Smalsus 🤔', genres: ['Dokumentinis', 'Mokslinė fantastika', 'Kriminalinis'] },
  ];

  const weatherOptions = [
    { value: 'sauleta', label: '☀️ Saulėta', influence: 'short', mood: 'energinga' },
    { value: 'debesuota', label: '☁️ Debesuota', influence: 'medium', mood: 'rami' },
    { value: 'lietinga', label: '🌧️ Lietinga', influence: 'long', mood: 'melancholiška' },
    { value: 'snieginga', label: '❄️ Snieginga', influence: 'cozy', mood: 'jaukiai' },
    { value: 'audra', label: '⛈️ Audra', influence: 'intense', mood: 'intensyvi' },
  ];

  const extraCriteriaOptions = [
    { value: 'trumpas', label: 'Trumpas filmas (< 2 val)' },
    { value: 'ilgas', label: 'Ilgas filmas (> 2.5 val)' },
    { value: 'naujas', label: 'Naujesnis filmas (po 2010)' },
    { value: 'klasika', label: 'Klasika (prieš 2000)' },
    { value: 'auksciausia', label: 'Aukščiausias IMDb' },
  ];

  const getRecommendations = () => {
    if (!mood) return [];
    const selectedMood = moods.find(m => m.value === mood);
    if (!selectedMood) return [];

    let filtered = movies.filter(m =>
      m.genre.some(g => selectedMood.genres.includes(g))
    );

    // Weather influence on duration preference
    const selectedWeather = weatherOptions.find(w => w.value === weather);
    if (selectedWeather) {
      if (selectedWeather.influence === 'short') {
        filtered.sort((a, b) => a.duration - b.duration);
      } else if (selectedWeather.influence === 'long' || selectedWeather.influence === 'cozy') {
        filtered.sort((a, b) => b.duration - a.duration);
      } else if (selectedWeather.influence === 'intense') {
        filtered = filtered.filter(m => m.genre.some(g => ['Trileris', 'Veiksmo', 'Siaubo'].includes(g))).length > 0
          ? filtered.filter(m => m.genre.some(g => ['Trileris', 'Veiksmo', 'Siaubo'].includes(g)))
          : filtered;
      }
    }

    // Shoe size: quirky factor — odd sizes get more obscure picks, even get popular
    if (shoeSize % 2 === 0) {
      filtered.sort((a, b) => b.ratings.length - a.ratings.length);
    } else {
      filtered.sort((a, b) => a.ratings.length - b.ratings.length);
    }

    // Moon phase influence
    if (moonPhase.name === 'Pilnatis') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    // Extra criteria
    if (extraCriteria === 'trumpas') {
      filtered = filtered.filter(m => m.duration < 120);
    } else if (extraCriteria === 'ilgas') {
      filtered = filtered.filter(m => m.duration > 150);
    } else if (extraCriteria === 'naujas') {
      filtered = filtered.filter(m => new Date(m.releaseDate).getFullYear() > 2010);
    } else if (extraCriteria === 'klasika') {
      filtered = filtered.filter(m => new Date(m.releaseDate).getFullYear() < 2000);
    } else if (extraCriteria === 'auksciausia') {
      filtered.sort((a, b) => b.imdbRating - a.imdbRating);
    }

    // If no results after filtering, return top rated
    if (filtered.length === 0) {
      filtered = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 4);
    }

    return filtered.slice(0, 6);
  };

  const recommendations = showResults ? getRecommendations() : [];

  return (
    <div className="recommendation-page">
      <div className="page-header">
        <h1>Filmo rekomendacija</h1>
        <p>Leiskite mums parinkti filmą pagal jūsų nuotaiką ir sąlygas</p>
      </div>

      <div className="rec-conditions">
        <div className="condition-card">
          <span className="condition-emoji">{moonPhase.emoji}</span>
          <div>
            <strong>Mėnulio fazė</strong>
            <p>{moonPhase.name}</p>
          </div>
        </div>
      </div>

      <div className="rec-sliders">
        {/* Slider 1: Mood */}
        <div className="slider-section">
          <h3>1. Nuotaika</h3>
          <div className="mood-grid">
            {moods.map(m => (
              <button
                key={m.value}
                className={`mood-btn ${mood === m.value ? 'active' : ''}`}
                onClick={() => { setMood(m.value); setShowResults(false); }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Slider 2: Weather */}
        <div className="slider-section">
          <h3>2. Oro sąlygos</h3>
          <div className="mood-grid">
            {weatherOptions.map(w => (
              <button
                key={w.value}
                className={`mood-btn ${weather === w.value ? 'active' : ''}`}
                onClick={() => { setWeather(w.value); setShowResults(false); }}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>

        {/* Slider 3: Shoe Size */}
        <div className="slider-section">
          <h3>3. Batų dydis</h3>
          <div className="shoe-slider">
            <input
              type="range"
              min="35"
              max="48"
              value={shoeSize}
              onChange={(e) => { setShoeSize(Number(e.target.value)); setShowResults(false); }}
              className="range-slider"
            />
            <span className="shoe-value">{shoeSize}</span>
            <p className="slider-hint">
              {shoeSize % 2 === 0 ? 'Lyginis — populiaresni filmai' : 'Nelyginis — mažiau žinomi perliukai'}
            </p>
          </div>
        </div>

        {/* Extra criteria */}
        <div className="slider-section">
          <h3>4. Papildomas kriterijus</h3>
          <div className="mood-grid">
            {extraCriteriaOptions.map(c => (
              <button
                key={c.value}
                className={`mood-btn ${extraCriteria === c.value ? 'active' : ''}`}
                onClick={() => { setExtraCriteria(prev => prev === c.value ? '' : c.value); setShowResults(false); }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {mood && (
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button
            onClick={() => setShowResults(true)}
            className="btn-primary"
            style={{ width: 'auto', padding: '0.8rem 2.5rem', fontSize: '1.05rem' }}
          >
            Gauti rekomendacijas
          </button>
        </div>
      )}

      {showResults && recommendations.length > 0 && (
        <div className="rec-results">
          <h2>Jūsų rekomendacijos</h2>
          <p className="rec-note">
            Atsižvelgiant į nuotaiką, {moonPhase.emoji} mėnulio fazę ({moonPhase.name}),
            {weather && ` ${weatherOptions.find(w => w.value === weather)?.label || ''} orus,`}
            {` batų dydį ${shoeSize}`}
            {extraCriteria && `, papildomą kriterijų`}:
          </p>
          <div className="movies-grid">
            {recommendations.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
