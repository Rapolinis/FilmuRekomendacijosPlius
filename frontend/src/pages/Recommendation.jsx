import { useState, useMemo, useEffect } from 'react';
import { useData } from '../context/DataContext';
import MovieCard from '../components/MovieCard';
import { getMoonPhase } from '../utils/helpers';
import './Recommendation.css';

const LOADING_STEPS = [
  '🎭 Analizuojam tavo nuotaiką…',
  '🐶 Lyginam su augintinių pomėgiais…',
  '🌙 Tikrinam mėnulio fazę…',
  '⭐ Lyginam su horoskopu…',
  '🎬 Renkam geriausius variantus…',
];

export default function Recommendation() {
  const { movies } = useData();

  const [moods_selected, setMoodsSelected] = useState([]);
  const [weather, setWeather] = useState([]);
  const [liveWeather, setLiveWeather] = useState(null);
  const [liveWeatherError, setLiveWeatherError] = useState(null);
  const [shoeSize, setShoeSize] = useState(42);
  const [zodiac, setZodiac] = useState('');
  const [pets, setPets] = useState([]);
  const [extraCriteria, setExtraCriteria] = useState({
    duration: '',
    date: '',
    rating: '',
  });
  const [showResults, setShowResults] = useState(false);
  const [loadingStep, setLoadingStep] = useState(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_OWM_API_KEY;
    if (!apiKey) return;

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=54.687&lon=25.279&units=metric&appid=${apiKey}`;
    let cancelled = false;

    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('weather-fetch-failed'))))
      .then((data) => {
        if (cancelled) return;

        const main = (data?.weather?.[0]?.main || '').toLowerCase();

        let mapped = 'debesuota';
        if (main.includes('clear')) mapped = 'sauleta';
        else if (main.includes('rain') || main.includes('drizzle')) mapped = 'lietinga';
        else if (main.includes('snow')) mapped = 'snieginga';
        else if (main.includes('thunder')) mapped = 'audra';
        else if (main.includes('cloud')) mapped = 'debesuota';

        setLiveWeather({
          mapped,
          temp: Math.round(data?.main?.temp ?? 0),
          description: data?.weather?.[0]?.description ?? '',
          city: data?.name ?? 'Vilnius',
        });

        setWeather([mapped]);
      })
      .catch(() => {
        if (cancelled) return;
        setLiveWeatherError('Nepavyko gauti orų — pasirinkite rankiniu būdu.');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (loadingStep === null) return;

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
      'new moon': 'Jaunatis',
      'waxing crescent': 'Jaunėjantis pjautuvas',
      'first quarter': 'Priešpilnis',
      'waxing gibbous': 'Pilnėjantis mėnulis',
      'full moon': 'Pilnatis',
      'waning gibbous': 'Delčiantis mėnulis',
      'last quarter': 'Delčia',
      'waning crescent': 'Senstantis pjautuvas',
    };

    return map[name?.trim().toLowerCase()] || name;
  };

  const currentMoon = normalizeMoonPhase(moonPhase.name);

  // DEBUG - ištrink kai veiks
  console.log('moonPhase raw:', moonPhase);
  console.log('currentMoon normalized:', currentMoon);

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
    { value: 'piktas', label: 'Piktas 😡', genres: ['Veiksmo', 'Trileris'] },
    { value: 'nuobodu', label: 'Nuobodu 😴', genres: ['Veiksmo', 'Mokslinė fantastika'] },
    { value: 'romantiskas', label: 'Romantiškas ❤️', genres: ['Romantinis', 'Drama', 'Komedija'] },
    { value: 'smalsus', label: 'Smalsus 🤔', genres: ['Dokumentinis', 'Mokslinė fantastika', 'Kriminalinis'] },
    { value: 'nostalgiskas', label: 'Nostalgiškas 🥹', genres: ['Drama', 'Animacinis', 'Romantinis'] },
    { value: 'juoktis', label: 'Noriu pasijuokti 😂', genres: ['Komedija', 'Animacinis'] },
    { value: 'motyvacija', label: 'Reikia motyvacijos 💪', genres: ['Dokumentinis', 'Nuotykių', 'Veiksmo'] },
    { value: 'pavargęs', label: 'Pavargęs 😪', genres: ['Animacinis', 'Komedija', 'Drama'] },
    { value: 'itemptas', label: 'Įsitempęs 😬', genres: ['Trileris', 'Drama', 'Siaubo'] },
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
    { value: 'suo', label: 'Šuo', image: '/dog.jpg', genres: ['Nuotykių', 'Komedija'] },
    { value: 'kate', label: 'Katė', image: '/cat.jpg', genres: ['Drama', 'Trileris'] },
    { value: 'arklys', label: 'Arklys', image: '/horse.jpg', genres: ['Nuotykių', 'Drama'] },
    { value: 'smauglys', label: 'Smauglys', image: '/boa.jpg', genres: ['Trileris', 'Siaubo'] },
    { value: 'juruKiaulyte', label: 'Jūrų kiaulytė', image: '/guineapig.jpg', genres: ['Animacinis', 'Komedija'] },
    { value: 'neturiu', label: 'Neturiu augintinio', image: null, genres: [] },
  ];

  const extraCriteriaGroups = [
    {
      key: 'duration',
      title: 'Trukmė',
      options: [
        { value: 'apie2val', label: 'Apie 2 val. ⏱️' },
        { value: 'trumpas', label: 'Trumpas filmas (< 2 val)' },
        { value: 'ilgas', label: 'Ilgas filmas (> 2.5 val)' },
      ],
    },
    {
      key: 'date',
      title: 'Data',
      options: [
        { value: 'naujas', label: 'Naujesnis filmas (po 2010)' },
        { value: 'klasika', label: 'Klasika (prieš 2000)' },
      ],
    },
    {
      key: 'rating',
      title: 'Įvertinimas',
      options: [
        { value: 'auksciausia', label: 'Aukščiausias IMDb' },
      ],
    },
  ];

  const getRecommendations = () => {
    if (!moods_selected.length) return [];

    const selectedMoodGenres = [...new Set(
      moods_selected
        .map(v => moods.find(m => m.value === v))
        .filter(Boolean)
        .flatMap(m => m.genres)
    )];

    let filtered = movies.filter(movie =>
      (movie.genre || []).some(genre => selectedMoodGenres.includes(genre))
    );

    // Weather: use first selected weather for sorting influence
    const selectedWeather = weather.length > 0 ? weatherOptions.find(w => w.value === weather[0]) : null;

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

    const petGenres = pets
      .map((value) => petOptions.find((p) => p.value === value))
      .filter(Boolean)
      .flatMap((p) => p.genres);

    if (petGenres.length > 0) {
      const petFiltered = filtered.filter((movie) =>
        (movie.genre || []).some((genre) => petGenres.includes(genre))
      );

      if (petFiltered.length > 0) {
        filtered = petFiltered;
      }
    }

    if (extraCriteria.duration === 'trumpas') {
      filtered = filtered.filter(movie => movie.duration < 120);
    }

    if (extraCriteria.duration === 'ilgas') {
      filtered = filtered.filter(movie => movie.duration > 150);
    }

    if (extraCriteria.duration === 'apie2val') {
      filtered = filtered.filter(movie =>
        movie.duration >= 105 && movie.duration <= 135
      );
    }

    if (extraCriteria.date === 'naujas') {
      filtered = filtered.filter(movie =>
        new Date(movie.releaseDate).getFullYear() > 2010
      );
    }

    if (extraCriteria.date === 'klasika') {
      filtered = filtered.filter(movie =>
        new Date(movie.releaseDate).getFullYear() < 2000
      );
    }

    const scoreCriterion = (movie, criterion) => {
      const duration = movie.duration ?? 0;
      const year = new Date(movie.releaseDate).getFullYear() || 0;
      const imdb = movie.imdbRating ?? movie.rating ?? 0;

      switch (criterion) {
        case 'apie2val':
          return -Math.abs(duration - 120);
        case 'trumpas':
          return duration < 120 ? 1000 - duration : -duration;
        case 'ilgas':
          return duration > 150 ? 1000 + duration : duration;
        case 'naujas':
          return year > 2010 ? 1000 + year : year;
        case 'klasika':
          return year < 2000 && year > 0 ? 1000 + (2000 - year) : -year;
        case 'auksciausia':
          return imdb * 100;
        default:
          return 0;
      }
    };

    const selectedExtraCriteria = Object.values(extraCriteria).filter(Boolean);

    const scoreFor = (movie) => {
      if (selectedExtraCriteria.length === 0) {
        return -Math.abs((movie.duration ?? 0) - 120) * 0.1;
      }

      return selectedExtraCriteria.reduce(
        (score, criterion) => score + scoreCriterion(movie, criterion),
        0
      );
    };

    filtered = [...filtered].sort((a, b) => scoreFor(b) - scoreFor(a));

    if (filtered.length === 0) {
      let fallback = [...movies];

      if (extraCriteria.duration === 'trumpas') {
        fallback = fallback.filter(movie => movie.duration < 120);
      }

      if (extraCriteria.duration === 'ilgas') {
        fallback = fallback.filter(movie => movie.duration > 150);
      }

      if (extraCriteria.duration === 'apie2val') {
        fallback = fallback.filter(movie =>
          movie.duration >= 105 && movie.duration <= 135
        );
      }

      if (extraCriteria.date === 'naujas') {
        fallback = fallback.filter(movie =>
          new Date(movie.releaseDate).getFullYear() > 2010
        );
      }

      if (extraCriteria.date === 'klasika') {
        fallback = fallback.filter(movie =>
          new Date(movie.releaseDate).getFullYear() < 2000
        );
      }

      return fallback
        .sort((a, b) => b.imdbRating - a.imdbRating)
        .slice(0, 6);
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
                className={`mood-btn ${moods_selected.includes(m.value) ? 'active' : ''}`}
                onClick={() => {
                  setMoodsSelected(prev =>
                    prev.includes(m.value) ? prev.filter(v => v !== m.value) : [...prev, m.value]
                  );
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

          {liveWeather && (
            <p className="live-weather-banner">
              📍 {liveWeather.city}: {liveWeather.temp}°C, {liveWeather.description}
              {' '}— pasirinkimas atnaujintas pagal realius orus.
            </p>
          )}

          {liveWeatherError && (
            <p className="live-weather-error">{liveWeatherError}</p>
          )}

          <div className="mood-grid">
            {weatherOptions.map(w => (
              <button
                key={w.value}
                className={`mood-btn ${weather.includes(w.value) ? 'active' : ''}`}
                onClick={() => {
                  setWeather(prev =>
                    prev.includes(w.value) ? prev.filter(v => v !== w.value) : [...prev, w.value]
                  );
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
            <div
              className="shoe-value-floating"
              style={{
                left: `calc(${((shoeSize - 35) / (48 - 35)) * 100}% + ${12 - ((shoeSize - 35) / (48 - 35)) * 24}px)`,
              }}
            >
              {shoeSize}
            </div>

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
                className={`mood-btn ${pets.includes(p.value) ? 'active' : ''}`}
                onClick={() => {
                  setPets(prev => {
                    if (prev.includes(p.value)) {
                      return prev.filter(v => v !== p.value);
                    }

                    if (p.value === 'neturiu') return ['neturiu'];

                    return [...prev.filter(v => v !== 'neturiu'), p.value];
                  });

                  setShowResults(false);
                }}
              >
                {p.image && (
                  <img
                    src={p.image}
                    alt={p.label}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '6px',
                    }}
                  />
                )}
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="slider-section">
          <h3>6. Papildomas kriterijus</h3>
          <div className="extra-criteria-grid">
            {extraCriteriaGroups.map(group => (
              <div key={group.key} className="extra-criteria-column">
                <h4>{group.title}</h4>
                <div className="extra-criteria-options">
                  {group.options.map(c => (
                    <button
                      key={c.value}
                      className={`mood-btn ${extraCriteria[group.key] === c.value ? 'active' : ''}`}
                      onClick={() => {
                        setExtraCriteria(prev => ({
                          ...prev,
                          [group.key]: prev[group.key] === c.value ? '' : c.value,
                        }));

                        setShowResults(false);
                      }}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {moods_selected.length > 0 && loadingStep === null && (
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
            Atsižvelgiant į nuotaiką ({moods_selected.map(v => moods.find(m => m.value === v)?.label).filter(Boolean).join(', ')}), {moonPhase.emoji} mėnulio fazę ({currentMoon}),
            {weather.length > 0 && ` ${weather.map(v => weatherOptions.find(w => w.value === v)?.label).filter(Boolean).join(', ')} orus,`}
            {` batų dydį ${shoeSize}`}
            {zodiac && `, horoskopą ${zodiacOptions.find(z => z.value === zodiac)?.label}`}
            {pets.length > 0 && `, augintinius ${pets.map(v => petOptions.find(p => p.value === v)?.label).filter(Boolean).join(', ')}`}
            {Object.values(extraCriteria).some(Boolean) && ', papildomus kriterijus'}:
          </p>

          <div className="movies-grid">
            {recommendations.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}

      {showResults && recommendations.length === 0 && (
        <div className="no-results">
          <p>Pagal pasirinktus kriterijus filmų nerasta.</p>
        </div>
      )}
    </div>
  );
}