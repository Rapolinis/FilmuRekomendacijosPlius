import { useState } from 'react';
import './AIGenerate.css';

const genreProfiles = {
  'Veiksmo': { themes: ['kovos', 'gelbėjimo misija', 'persekiojimas'], tone: 'intensyvus' },
  'Drama': { themes: ['šeimos paslaptys', 'asmeninis augimas', 'prarastos meilės'], tone: 'emocinis' },
  'Komedija': { themes: ['chaotiška kelionė', 'nesusipratimas', 'draugų nuotykiai'], tone: 'linksmas' },
  'Siaubo': { themes: ['namas miške', 'sena prakeiksmas', 'dingusio žmogaus paieška'], tone: 'bauginantis' },
  'Mokslinė fantastika': { themes: ['laiko kelionės', 'pirmasis kontaktas', 'dirbtinis intelektas'], tone: 'filosofinis' },
  'Romantinis': { themes: ['netikėtas susitikimas', 'antra šansa', 'tarpkultūrinė meilė'], tone: 'švelnus' },
  'Trileris': { themes: ['dvigubas gyvenimas', 'sąmokslas', 'detektyvinis tyrimas'], tone: 'įtemptas' },
  'Dokumentinis': { themes: ['gamtos stebuklas', 'paslėpta istorija', 'mokslo atradimas'], tone: 'informatyvus' },
  'Animacinis': { themes: ['stebuklinga karalystė', 'draugystės galia', 'mažojo herojaus kelionė'], tone: 'žaismingas' },
  'Kriminalinis': { themes: ['tobulas nusikaltimas', 'mafijos šeima', 'dvigubas agentas'], tone: 'tamsus' },
};

const directors = ['DI Režisierius', 'A. Neuronas', 'Deep Visionary', 'Mašinų Menininkas', 'Algoritmų Auteuris'];
const years = ['2024', '2025', '2026', '2027'];

function generateSmartFilm(prompt, preferences) {
  const genres = preferences.length > 0 ? preferences : ['Drama', 'Mokslinė fantastika'];
  const primaryGenre = genres[0];
  const profile = genreProfiles[primaryGenre] || genreProfiles['Drama'];
  const theme = profile.themes[Math.floor(Math.random() * profile.themes.length)];
  const director = directors[Math.floor(Math.random() * directors.length)];
  const year = years[Math.floor(Math.random() * years.length)];
  const duration = Math.floor(Math.random() * 60) + 90;
  const rating = (Math.random() * 1.5 + 3.5).toFixed(1);

  const words = prompt.split(' ').filter(w => w.length > 3);
  const keyWord = words[Math.floor(Math.random() * words.length)] || 'Paslaptis';
  const cappedKey = keyWord.charAt(0).toUpperCase() + keyWord.slice(1);

  const titleTemplates = [
    `${cappedKey}: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`,
    `Paskutinis ${cappedKey.toLowerCase()}`,
    `${cappedKey} ir ${profile.tone} dienos`,
    `Kai ${cappedKey.toLowerCase()} keičia viską`,
    `${theme.charAt(0).toUpperCase() + theme.slice(1)}: ${cappedKey}`,
  ];

  const descTemplates = [
    `${year} metų ${profile.tone} filmas, kuriame ${theme} tema susipina su "${prompt}" konceptu. Pagrindinis veikėjas susiduria su neįmanomais pasirinkimais, o žiūrovas yra įtraukiamas į ${genres.join(' ir ')} pasaulį, kuris vis labiau atskleidžia savo gelmes.`,
    `Remiantis jūsų užklausa "${prompt}", DI sukūrė istoriją apie ${theme}. Tai ${profile.tone} kelionė per ${genres.slice(0, 2).join(' ir ')} žanro peizažą, kur kiekvienas personažas slepia savo paslaptį. Filmas kviečia susimąstyti apie pasirinkimus, kuriuos darome kiekvieną dieną.`,
    `Inovatyvus ${genres[0]} filmas, įkvėptas "${prompt}". Istorija prasideda nuo ${theme} ir išauga į daugiasluoksnį pasakojimą apie žmogaus prigimtį. Režisierius ${director} meistriškai sujungia ${genres.join(', ')} elementus į vientisą ir jaudinantį kūrinį.`,
  ];

  return {
    title: titleTemplates[Math.floor(Math.random() * titleTemplates.length)],
    description: descTemplates[Math.floor(Math.random() * descTemplates.length)],
    genre: genres.slice(0, 3),
    duration,
    director,
    rating,
    year,
    tone: profile.tone
  };
}

export default function AIGenerate() {
  const [prompt, setPrompt] = useState('');
  const [preferences, setPreferences] = useState([]);
  const [generatedFilm, setGeneratedFilm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);

  const preferenceOptions = [
    'Veiksmo', 'Drama', 'Komedija', 'Siaubo', 'Mokslinė fantastika',
    'Romantinis', 'Trileris', 'Dokumentinis', 'Animacinis', 'Kriminalinis'
  ];

  const togglePreference = (pref) => {
    setPreferences(prev =>
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const generateFilm = () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setGeneratedFilm(null);

    setTimeout(() => {
      setGeneratedFilm(generateSmartFilm(prompt, preferences));
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="ai-page">
      <div className="page-header">
        <h1>DI Filmo generavimas</h1>
        <p>Leiskite dirbtiniam intelektui sukurti filmą pagal jūsų norus</p>
      </div>

      <div className="ai-card">
        <button onClick={() => setShowSurvey(!showSurvey)} className="survey-toggle">
          {showSurvey ? '▲ Paslėpti pomėgių anketą' : '▼ Pildyti pomėgių anketą DI generavimui'}
        </button>

        {showSurvey && (
          <div className="survey-section">
            <h3>Jūsų pomėgiai</h3>
            <p>Pasirinkite mėgstamus žanrus (DI atsižvelgs generuodamas):</p>
            <div className="preference-grid">
              {preferenceOptions.map(pref => (
                <button
                  key={pref}
                  className={`pref-btn ${preferences.includes(pref) ? 'active' : ''}`}
                  onClick={() => togglePreference(pref)}
                >
                  {pref}
                </button>
              ))}
            </div>
            {preferences.length > 0 && (
              <p className="selected-prefs">Pasirinkta: {preferences.join(', ')}</p>
            )}
          </div>
        )}

        <div className="generate-section">
          <h3>Aprašykite filmą, kurį norėtumėte pamatyti</h3>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Pvz.: Filmas apie laiko keliones, kur mokslininkas bando išgelbėti pasaulį nuo katastrofos..."
            rows="4"
          />
          <button
            onClick={generateFilm}
            disabled={!prompt.trim() || loading}
            className="btn-primary btn-generate"
          >
            {loading ? '⏳ Generuojama...' : '✨ Generuoti filmą'}
          </button>
        </div>
      </div>

      {loading && (
        <div className="ai-loading">
          <div className="ai-spinner"></div>
          <p>DI analizuoja jūsų pageidavimus ir kuria filmą...</p>
        </div>
      )}

      {generatedFilm && !loading && (
        <div className="generated-result">
          <h2>🎬 Sugeneruotas filmas</h2>
          <div className="generated-card">
            <div className="generated-poster">
              <div className="ai-poster-placeholder">
                <span>🤖</span>
                <p>DI</p>
                <small>{generatedFilm.year}</small>
              </div>
            </div>
            <div className="generated-info">
              <h3>{generatedFilm.title}</h3>
              <div className="detail-tags">
                {generatedFilm.genre.map(g => (
                  <span key={g} className="tag">{g}</span>
                ))}
                <span className="tag" style={{ background: '#e9d8fd', color: '#6b46c1' }}>
                  {generatedFilm.tone}
                </span>
              </div>
              <p className="generated-desc">{generatedFilm.description}</p>
              <div className="generated-meta">
                <span>🎬 {generatedFilm.director}</span>
                <span>⏱ {generatedFilm.duration} min</span>
                <span>⭐ {generatedFilm.rating}/5</span>
                <span>📅 {generatedFilm.year}</span>
              </div>
              <button onClick={generateFilm} className="btn-primary" style={{ width: 'auto', marginTop: '1rem', padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>
                🔄 Generuoti iš naujo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
