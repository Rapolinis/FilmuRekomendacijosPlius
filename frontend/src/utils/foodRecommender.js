const genreFoodMap = {
  'Drama': [
    { name: 'Raminantis žolelių arbatos rinkinys', emoji: '🍵' },
    { name: 'Naminis pyragas su kava', emoji: '🍰' },
  ],
  'Veiksmo': [
    { name: 'Didysis mėsainis su frytais', emoji: '🍔' },
    { name: 'Nachos su padažais', emoji: '🌮' },
  ],
  'Komedija': [
    { name: 'Pica su draugais', emoji: '🍕' },
    { name: 'Popkornų krepšelis', emoji: '🍿' },
  ],
  'Trileris': [
    { name: 'Sushi rinkinys', emoji: '🍣' },
    { name: 'Tamsaus šokolado desertas', emoji: '🍫' },
  ],
  'Mokslinė fantastika': [
    { name: 'Kosminis buritas', emoji: '🌯' },
    { name: 'Energinis smoothie', emoji: '🥤' },
  ],
  'Siaubo': [
    { name: 'Kruvinas Merry kava', emoji: '☕' },
    { name: 'Raudonos sriubos dubuo', emoji: '🥣' },
  ],
  'Romantinis': [
    { name: 'Šokolado fondiu dviem', emoji: '🍫' },
    { name: 'Vyno ir sūrių rinkinys', emoji: '🧀' },
  ],
  'Kriminalinis': [
    { name: 'Itališka pica Margherita', emoji: '🍕' },
    { name: 'Espresso su tiramisu', emoji: '☕' },
  ],
  'Nuotykių': [
    { name: 'Egzotinių vaisių salotų dubuo', emoji: '🥗' },
    { name: 'Street food rinkinys', emoji: '🍜' },
  ],
  'Animacinis': [
    { name: 'Spalvoti makaronai vaikams', emoji: '🍝' },
    { name: 'Ledų skreperis su posūkiais', emoji: '🍦' },
  ],
  'Dokumentinis': [
    { name: 'Organiškas salotų dubuo', emoji: '🥗' },
    { name: 'Žalioji arbata su sausainiais', emoji: '🍵' },
  ],
};

export function getSmartFoodRecommendation(movie) {
  // If movie has custom recommendation, use it
  if (movie.foodRecommendation && movie.foodRecommendation.name) {
    return movie.foodRecommendation;
  }

  // Otherwise, generate from genre
  const primaryGenre = movie.genre[0];
  const options = genreFoodMap[primaryGenre] || genreFoodMap['Drama'];
  const pick = options[Math.floor(Math.random() * options.length)];

  return {
    name: `${pick.emoji} ${pick.name}`,
    woltLink: 'https://wolt.com',
    auto: true
  };
}
