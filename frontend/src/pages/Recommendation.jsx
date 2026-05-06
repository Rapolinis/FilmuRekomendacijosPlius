import { useState, useMemo, useEffect } from 'react';
import { useData } from '../context/DataContext';
import MovieCard from '../components/MovieCard';
import { getMoonPhase } from '../utils/helpers';
import './Recommendation.css';

// Multi-step "thinking" sequence shown while we compute recommendations.
// Each step is intentionally short — total ~2.5s — so users feel the app
// is working but never wait awkwardly long. Pure theatre, no real I/O.
const LOADING_STEPS = [
  '🎭 Analizuojam tavo nuotaiką…',
  '🐶 Lyginam su augintinių pomėgiais…',
  '🌙 Tikrinam mėnulio fazę…',
  '⭐ Lyginam su horoskopu…',
  '🎬 Renkam geriausius variantus…',
];

export default function Recommendation() {
  const { movies } = useData();

  const [mood, setMood] = useState('');
  const [weather, setWeather] = useState('');
  const [shoeSize, setShoeSize] = useState(42);
  const [zodiac, setZodiac] = useState('');
  // Pets is multi-select — user can pick any combination (e.g. "Šuo + Katė")
  // and the recommendation engine unions the genre hints from each pick.
  const [pets, setPets] = useState([]);
  const [extraCriteria, setExtraCriteria] = useState('');
  const [showResults, setShowResults] = useState(false);

  // `loadingStep` is null when idle, otherwise the index of the current
  // message in LOADING_STEPS. We advance it on a timer; when it goes past
  // the last step we surface the results.
  const [loadingStep, setLoadingStep] = useState(null);

  useEffect(() => {
    if (loadingStep === null) return;
    // The timer always advances; once we step past the last message we
    // commit to results in the same callback. Setting state inside a
    // timer (rather than synchronously in the effect body) keeps React's
    // strict effects happy.
    const timer = setTimeout(() => {
      if (loadingStep + 1 >= LOADING_STEPS.length) {
        setShowResults(true);
        setLoadingStep(null);
      } else {
        setLoadingStep(loadingStep + 1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [loadingStep]);

  const startRecommendation = () => {
    setShowResults(false);
    setLoadingStep(0);
  };

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
    { value: 'arklys', label: 'Arklys 🐴', genres: ['Nuotykių', 'Drama'] },
    { value: 'smauglys', label: 'Smauglys 🐍', genres: ['Trileris', 'Siaubo'] },
    { value: 'juruKiaulyte', label: 'Jūrų kiaulytė 🐹', genres: ['Animacinis', 'Komedija'] },
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

    // Union genre hints across all selected pets — broadens the match set
    // rather than narrowing it. "Neturiu" carries no genres, so picking it
    // alongside another pet is a no-op for the filter.
    const petGenres = pets
      .map((value) => petOptions.find((p) => p.value === value))
      .filter(Boolean)
      .flatMap((p) => p.genres);

    if (petGenres.length > 0) {
      const petFiltered = filtered.filter((movie) =>
        (movie.genre || []).some((genre) => petGenres.includes(genre)),
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
          <h3>5. Naminis augintinis (galima pasirinkti kelis)</h3>
          <div className="mood-grid">
            {petOptions.map(p => (
              <button
                key={p.value}
                className={`mood-btn ${pets.includes(p.value) ? 'active' : ''}`}
                onClick={() => {
                  setPets(prev => {
                    if (prev.includes(p.value)) {
                      return prev.filter(v => v !== p.value);
                    }
                    // "Neturiu" is exclusive — picking it clears other pets.
                    if (p.value === 'neturiu') return ['neturiu'];
                    return [...prev.filter(v => v !== 'neturiu'), p.value];
                  });
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

      {mood && loadingStep === null && (
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button
            onClick={startRecommendation}
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

      {loadingStep !== null && (
        <div className="rec-loading" role="status" aria-live="polite">
          <div className="rec-loading-spinner" aria-hidden="true" />
          <div className="rec-loading-steps">
            {LOADING_STEPS.map((step, i) => (
              <p
                key={step}
                className={`rec-loading-step ${
                  i < loadingStep
                    ? 'done'
                    : i === loadingStep
                      ? 'active'
                      : 'pending'
                }`}
              >
                {i < loadingStep ? '✓' : i === loadingStep ? '•' : '○'} {step}
              </p>
            ))}
          </div>
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
            {pets.length > 0 && `, augintinius ${pets.map(v => petOptions.find(p => p.value === v)?.label).filter(Boolean).join(', ')}`}
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