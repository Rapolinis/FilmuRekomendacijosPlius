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
  const [zodiac, setZodiac] = useState('');
  const [pet, setPet] = useState('');
  const [extraCriteria, setExtraCriteria] = useState('');
  const [showResults, setShowResults] = useState(false);

  const moonPhase = useMemo(() => getMoonPhase(), []);

  const normalizeMoonPhase = (name) => {
    const map = {
      'New Moon': 'Jaunatis',
      'Waxing Crescent': 'Jaunėjantis pjautuvas',
      'First Quarter': 'Priešpilnis',
      'Waxing Gibbous': 'Pilnėjantis mėnulis',
      'Full Moon': 'Pilnatis',
      'Waning Gibbous': 'Delčiantis mėnulis',
      'Last Quarter': 'Delčia',
      'Waning Crescent': 'Senstantis pjautuvas',
    };

    return map[name] || name;
  };

  const currentMoon = normalizeMoonPhase(moonPhase.name);

  const moonPhases = [
    { name: 'Jaunatis', emoji: '🌑' },
    { name: 'Jaunėjantis pjautuvas', emoji: '🌒' },
    { name: 'Priešpilnis', emoji: '🌓' },
    { name: 'Pilnėjantis mėnulis', emoji: '🌔' },
    { name: 'Pilnatis', emoji: '🌕' },
    { name: 'Delčiantis mėnulis', emoji: '🌖' },
    { name: 'Delčia', emoji: '🌗' },
    { name: 'Senstantis pjautuvas', emoji: '🌘' },
  ];

  const moods = [
    { value: 'laimingas', label: 'Laimingas 😊', genres: ['Komedija', 'Nuotykių', 'Animacinis'] },
    { value: 'liudnas', label: 'Liūdnas 😢', genres: ['Drama', 'Romantinis'] },
    { value: 'issigandes', label: 'Noriu adrenalino 😱', genres: ['Siaubo', 'Trileris'] },
    { value: 'nuobodu', label: 'Nuobodu 😴', genres: ['Veiksmo', 'Mokslinė fantastika'] },
    { value: 'romantiskas', label: 'Romantiškas ❤️', genres: ['Romantinis', 'Drama', 'Komedija'] },
    { value: 'smalsus', label: 'Smalsus 🤔', genres: ['Dokumentinis', 'Mokslinė fantastika', 'Kriminalinis'] },
  ];

  const weatherOptions = [
    { value: 'sauleta', label: '☀️ Saulėta', influence: 'short' },
    { value: 'debesuota', label: '☁️ Debesuota', influence: 'medium' },
    { value: 'lietinga', label: '🌧️ Lietinga', influence: 'long' },
    { value: 'snieginga', label: '❄️ Snieginga', influence: 'cozy' },
    { value: 'audra', label: '⛈️ Audra', influence: 'intense' },
  ];

  const zodiacOptions = [
    { value: 'avinas', label: 'Avinas ♈', genres: ['Veiksmo', 'Nuotykių'] },
    { value: 'jautis', label: 'Jautis ♉', genres: ['Drama', 'Romantinis'] },
    { value: 'dvyniai', label: 'Dvyniai ♊', genres: ['Komedija', 'Kriminalinis'] },
    { value: 'vezys', label: 'Vėžys ♋', genres: ['Animacinis', 'Romantinis'] },
    { value: 'liutas', label: 'Liūtas ♌', genres: ['Veiksmo', 'Komedija'] },
    { value: 'mergele', label: 'Mergelė ♍', genres: ['Dokumentinis', 'Kriminalinis'] },
    { value: 'svarstykles', label: 'Svarstyklės ♎', genres: ['Romantinis', 'Drama'] },
    { value: 'skorpionas', label: 'Skorpionas ♏', genres: ['Trileris', 'Siaubo'] },
    { value: 'saulys', label: 'Šaulys ♐', genres: ['Nuotykių', 'Mokslinė fantastika'] },
    { value: 'oziaragis', label: 'Ožiaragis ♑', genres: ['Drama', 'Dokumentinis'] },
    { value: 'vandenis', label: 'Vandenis ♒', genres: ['Mokslinė fantastika', 'Animacinis'] },
    { value: 'zuvys', label: 'Žuvys ♓', genres: ['Romantinis', 'Drama'] },
  ];

  const petOptions = [
    { value: 'suo', label: 'Šuo 🐶', genres: ['Nuotykių', 'Komedija'] },
    { value: 'kate', label: 'Katė 🐱', genres: ['Drama', 'Trileris'] },
    { value: 'ziurkenas', label: 'Žiurkėnas 🐹', genres: ['Animacinis', 'Komedija'] },
    { value: 'papuga', label: 'Papūga 🦜', genres: ['Nuotykių', 'Animacinis'] },
    { value: 'zuvis', label: 'Žuvis 🐟', genres: ['Romantinis', 'Mokslinė fantastika'] },
    { value: 'neturiu', label: 'Neturiu augintinio 🚫', genres: [] },
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

    let filtered = movies.filter(movie =>
      (movie.genre || []).some(genre => selectedMood.genres.includes(genre))
    );

    const selectedWeather = weatherOptions.find(w => w.value === weather);

    if (selectedWeather) {
      if (selectedWeather.influence === 'short') {
        filtered.sort((a, b) => a.duration - b.duration);
      }

      if (selectedWeather.influence === 'long' || selectedWeather.influence === 'cozy') {
        filtered.sort((a, b) => b.duration - a.duration);
      }

      if (selectedWeather.influence === 'intense') {
        const intenseMovies = filtered.filter(movie =>
          (movie.genre || []).some(genre =>
            ['Trileris', 'Veiksmo', 'Siaubo'].includes(genre)
          )
        );

        if (intenseMovies.length > 0) {
          filtered = intenseMovies;
        }
      }
    }

    if (shoeSize % 2 === 0) {
      filtered.sort((a, b) => (b.ratings || []).length - (a.ratings || []).length);
    } else {
      filtered.sort((a, b) => (a.ratings || []).length - (b.ratings || []).length);
    }

    if (currentMoon === 'Pilnatis') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    if (currentMoon === 'Jaunatis') {
      filtered.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    }

    if (currentMoon === 'Delčia') {
      filtered.sort((a, b) => a.duration - b.duration);
    }

    const selectedZodiac = zodiacOptions.find(z => z.value === zodiac);

    if (selectedZodiac) {
      const zodiacFiltered = filtered.filter(movie =>
        (movie.genre || []).some(genre => selectedZodiac.genres.includes(genre))
      );

      if (zodiacFiltered.length > 0) {
        filtered = zodiacFiltered;
      }
    }

    const selectedPet = petOptions.find(p => p.value === pet);

    if (selectedPet && selectedPet.genres.length > 0) {
      const petFiltered = filtered.filter(movie =>
        (movie.genre || []).some(genre => selectedPet.genres.includes(genre))
      );

      if (petFiltered.length > 0) {
        filtered = petFiltered;
      }
    }

    if (extraCriteria === 'trumpas') {
      filtered = filtered.filter(movie => movie.duration < 120);
    }

    if (extraCriteria === 'ilgas') {
      filtered = filtered.filter(movie => movie.duration > 150);
    }

    if (extraCriteria === 'naujas') {
      filtered = filtered.filter(movie =>
        new Date(movie.releaseDate).getFullYear() > 2010
      );
    }

    if (extraCriteria === 'klasika') {
      filtered = filtered.filter(movie =>
        new Date(movie.releaseDate).getFullYear() < 2000
      );
    }

    if (extraCriteria === 'auksciausia') {
      filtered.sort((a, b) => b.imdbRating - a.imdbRating);
    }

    if (filtered.length === 0) {
      filtered = [...movies]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);
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

      <div className="rec-conditions moon-phases">
        {moonPhases.map(phase => {
          const isActive = currentMoon === phase.name;

          return (
            <div
              key={phase.name}
              className={`condition-card ${isActive ? 'active-moon' : ''}`}
            >
              <span className="condition-emoji">{phase.emoji}</span>
              <div>
                <strong>{phase.name}</strong>
                {isActive && <p>Dabartinė fazė</p>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rec-sliders">
        <div className="slider-section">
          <h3>1. Nuotaika</h3>
          <div className="mood-grid">
            {moods.map(m => (
              <button
                key={m.value}
                className={`mood-btn ${mood === m.value ? 'active' : ''}`}
                onClick={() => {
                  setMood(m.value);
                  setShowResults(false);
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="slider-section">
          <h3>2. Oro sąlygos</h3>
          <div className="mood-grid">
            {weatherOptions.map(w => (
              <button
                key={w.value}
                className={`mood-btn ${weather === w.value ? 'active' : ''}`}
                onClick={() => {
                  setWeather(w.value);
                  setShowResults(false);
                }}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>

        <div className="slider-section">
          <h3>3. Batų dydis</h3>
          <div className="shoe-slider">
            <input
              type="range"
              min="35"
              max="48"
              value={shoeSize}
              onChange={(e) => {
                setShoeSize(Number(e.target.value));
                setShowResults(false);
              }}
              className="range-slider"
            />

            <span className="shoe-value">{shoeSize}</span>

            <p className="slider-hint">
              {shoeSize % 2 === 0
                ? 'Lyginis — populiaresni filmai'
                : 'Nelyginis — mažiau žinomi perliukai'}
            </p>
          </div>
        </div>

        <div className="slider-section">
          <h3>4. Horoskopo ženklas</h3>
          <div className="mood-grid">
            {zodiacOptions.map(z => (
              <button
                key={z.value}
                className={`mood-btn ${zodiac === z.value ? 'active' : ''}`}
                onClick={() => {
                  setZodiac(prev => (prev === z.value ? '' : z.value));
                  setShowResults(false);
                }}
              >
                {z.label}
              </button>
            ))}
          </div>
        </div>

        <div className="slider-section">
          <h3>5. Naminis augintinis</h3>
          <div className="mood-grid">
            {petOptions.map(p => (
              <button
                key={p.value}
                className={`mood-btn ${pet === p.value ? 'active' : ''}`}
                onClick={() => {
                  setPet(prev => (prev === p.value ? '' : p.value));
                  setShowResults(false);
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="slider-section">
          <h3>6. Papildomas kriterijus</h3>
          <div className="mood-grid">
            {extraCriteriaOptions.map(c => (
              <button
                key={c.value}
                className={`mood-btn ${extraCriteria === c.value ? 'active' : ''}`}
                onClick={() => {
                  setExtraCriteria(prev => (prev === c.value ? '' : c.value));
                  setShowResults(false);
                }}
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
            style={{
              width: 'auto',
              padding: '0.8rem 2.5rem',
              fontSize: '1.05rem',
            }}
          >
            Gauti rekomendacijas
          </button>
        </div>
      )}

      {showResults && recommendations.length > 0 && (
        <div className="rec-results">
          <h2>Jūsų rekomendacijos</h2>

          <p className="rec-note">
            Atsižvelgiant į nuotaiką, {moonPhase.emoji} mėnulio fazę ({currentMoon}),
            {weather && ` ${weatherOptions.find(w => w.value === weather)?.label || ''} orus,`}
            {` batų dydį ${shoeSize}`}
            {zodiac && `, horoskopą ${zodiacOptions.find(z => z.value === zodiac)?.label}`}
            {pet && `, augintinį ${petOptions.find(p => p.value === pet)?.label}`}
            {extraCriteria && ', papildomą kriterijų'}:
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