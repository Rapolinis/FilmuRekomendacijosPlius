-- FilmuRekomendacijosPlius – MySQL Schema
-- Run this once to set up the database:
--   mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS filmuverkle
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE filmuverkle;

CREATE TABLE IF NOT EXISTS movies (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  title                 VARCHAR(255)  NOT NULL,
  originalTitle         VARCHAR(255)  DEFAULT '',
  description           TEXT,
  genreJson             JSON,
  director              VARCHAR(255)  DEFAULT '',
  actorsJson            JSON,
  duration              INT           DEFAULT 0,
  releaseDate           VARCHAR(20)   DEFAULT '',
  rating                DECIMAL(3,1)  DEFAULT 0.0,
  ratingsJson           JSON,
  imdbRating            DECIMAL(3,1)  DEFAULT 0.0,
  poster                VARCHAR(500)  DEFAULT '',
  commentsJson          JSON,
  foodRecommendationJson JSON,
  category              VARCHAR(100)  DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Sample seed data ──────────────────────────────────────────────────────────
INSERT INTO movies
  (title, originalTitle, description, genreJson, director, actorsJson,
   duration, releaseDate, rating, ratingsJson, imdbRating,
   poster, commentsJson, foodRecommendationJson, category)
VALUES
(
  'Tarp Žvaigždžių', 'Interstellar',
  'Ūkininkas ir buvęs NASA pilotas Cooperis keliauja per kosmosą ieškodamas naujos namų planetos.',
  '["Mokslinė fantastika","Drama","Nuotykių"]',
  'Christopher Nolan',
  '["Matthew McConaughey","Anne Hathaway","Jessica Chastain"]',
  169, '2014-11-07', 4.8,
  '[5,5,5,4,5]', 8.7,
  'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
  '[]',
  '{"name":"Kosminis burgeris","woltLink":"https://wolt.com"}',
  'Populiarus'
),
(
  'Pradžia', 'Inception',
  'Vagis, sugebantis įsiskverbti į žmonių sapnus, gauna užduotį įdiegti idėją į žmogaus protą.',
  '["Trileris","Mokslinė fantastika","Veiksmo"]',
  'Christopher Nolan',
  '["Leonardo DiCaprio","Joseph Gordon-Levitt","Ellen Page"]',
  148, '2010-07-16', 4.7,
  '[5,4,5,5,4]', 8.8,
  'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
  '[]',
  '{"name":"Svajonių pica","woltLink":"https://wolt.com"}',
  'Populiarus'
),
(
  'Betmenas prieš Supermeną', 'Batman v Superman: Dawn of Justice',
  'Betmenas ir Supermenas susiduria vienas su kitu, o tuo tarpu nauja grėsmė kyla iš šešėlių.',
  '["Veiksmo","Nuotykių","Fantastinis"]',
  'Zack Snyder',
  '["Ben Affleck","Henry Cavill","Amy Adams"]',
  151, '2016-03-25', 3.5,
  '[4,3,3,4,3]', 6.3,
  'https://image.tmdb.org/t/p/w500/5UsK3grJvtQrtzEgqNlDljJW96w.jpg',
  '[]',
  NULL,
  'Veiksmo'
);
