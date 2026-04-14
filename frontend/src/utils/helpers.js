export function getMoonPhase() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let c = Math.floor(365.25 * (year + 4716));
  let e = Math.floor(30.6001 * (month + 1));
  let jd = c + e + day - 1524.5;
  let daysSinceNew = jd - 2451549.5;
  let newMoons = daysSinceNew / 29.53059;
  let phase = (newMoons - Math.floor(newMoons));

  if (phase < 0.0625) return { name: 'Jaunatis', emoji: '🌑', value: phase };
  if (phase < 0.1875) return { name: 'Jaunas mėnulis', emoji: '🌒', value: phase };
  if (phase < 0.3125) return { name: 'Pirmas ketvirtis', emoji: '🌓', value: phase };
  if (phase < 0.4375) return { name: 'Priešpilnis', emoji: '🌔', value: phase };
  if (phase < 0.5625) return { name: 'Pilnatis', emoji: '🌕', value: phase };
  if (phase < 0.6875) return { name: 'Nykstantis', emoji: '🌖', value: phase };
  if (phase < 0.8125) return { name: 'Paskutinis ketvirtis', emoji: '🌗', value: phase };
  if (phase < 0.9375) return { name: 'Senasis mėnulis', emoji: '🌘', value: phase };
  return { name: 'Jaunatis', emoji: '🌑', value: phase };
}

export function getWeatherMood() {
  const conditions = [
    { name: 'Saulėta', emoji: '☀️', mood: 'energinga' },
    { name: 'Debesuota', emoji: '☁️', mood: 'rami' },
    { name: 'Lietinga', emoji: '🌧️', mood: 'melancholiška' },
    { name: 'Snieginga', emoji: '❄️', mood: 'jaukiai' },
    { name: 'Audra', emoji: '⛈️', mood: 'intensyvi' },
  ];
  return conditions[Math.floor(Math.random() * conditions.length)];
}

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('lt-LT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function getAverageRating(ratings) {
  if (!ratings || ratings.length === 0) return 0;
  return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
}

export function canRegisterForViewing(viewing) {
  const viewingDateTime = new Date(`${viewing.date}T${viewing.time}`);
  const now = new Date();
  const oneHourBefore = new Date(viewingDateTime.getTime() - 60 * 60 * 1000);
  return now < oneHourBefore && viewing.participants.length < viewing.maxParticipants;
}
