CREATE DATABASE IF NOT EXISTS filmuverkle
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE filmuverkle;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS food_recommendations;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS movie_ratings;
DROP TABLE IF EXISTS movie_actors;
DROP TABLE IF EXISTS actors;
DROP TABLE IF EXISTS movie_genres;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'viewer',
  avatar VARCHAR(500) DEFAULT '',
  blocked BOOLEAN DEFAULT FALSE,
  blockedReason TEXT,
  blockedUntil DATETIME NULL,
  createdAt DATE
);

CREATE TABLE movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  originalTitle VARCHAR(255) DEFAULT '',
  description TEXT,
  director VARCHAR(255) DEFAULT '',
  duration INT DEFAULT 0,
  releaseDate DATE,
  rating DECIMAL(3,1) DEFAULT 0.0,
  imdbRating DECIMAL(3,1) DEFAULT 0.0,
  poster VARCHAR(500) DEFAULT '',
  category VARCHAR(100) DEFAULT ''
);

CREATE TABLE genres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE movie_genres (
  movieId INT NOT NULL,
  genreId INT NOT NULL,
  PRIMARY KEY (movieId, genreId),
  FOREIGN KEY (movieId) REFERENCES movies(id) ON DELETE CASCADE,
  FOREIGN KEY (genreId) REFERENCES genres(id) ON DELETE CASCADE
);

CREATE TABLE actors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE movie_actors (
  movieId INT NOT NULL,
  actorId INT NOT NULL,
  PRIMARY KEY (movieId, actorId),
  FOREIGN KEY (movieId) REFERENCES movies(id) ON DELETE CASCADE,
  FOREIGN KEY (actorId) REFERENCES actors(id) ON DELETE CASCADE
);

CREATE TABLE movie_ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  movieId INT NOT NULL,
  userId INT NOT NULL,
  rating INT NOT NULL,
  createdAt DATE,
  FOREIGN KEY (movieId) REFERENCES movies(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  movieId INT NOT NULL,
  userId INT NOT NULL,
  text TEXT NOT NULL,
  date DATE,
  FOREIGN KEY (movieId) REFERENCES movies(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE food_recommendations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  movieId INT NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  woltLink VARCHAR(500),
  FOREIGN KEY (movieId) REFERENCES movies(id) ON DELETE CASCADE
);

INSERT INTO users
(id, username, email, password, role, avatar, blocked, blockedReason, blockedUntil, createdAt)
VALUES
(1, 'admin', 'admin@filmuvercle.lt', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'admin', '', FALSE, '', NULL, '2026-01-01'),
(2, 'moderatorius', 'mod@filmuvercle.lt', 'cfde2ca5188afb7bdd0691c7bef887baba78b709aadde8e8c535329d5751e6fe', 'moderator', '', FALSE, '', NULL, '2026-01-01'),
(3, 'ziuretojas', 'ziuretojas@filmuvercle.lt', 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f', 'viewer', '', FALSE, '', NULL, '2026-02-15'),
(4, 'titas', 'titas@filmuvercle.lt', 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f', 'viewer', '', FALSE, '', NULL, '2026-03-01');

INSERT INTO movies
(id, title, originalTitle, description, director, duration, releaseDate, rating, imdbRating, poster, category)
VALUES
(1, 'Tarp Žvaigždžių', 'Interstellar', 'Grupė tyrinėtojų keliauja per erdvėlaikio tunelį, ieškodami naujo žmonijos namų.', 'Christopher Nolan', 169, '2014-11-07', 4.8, 8.7, 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', 'Populiarus'),
(2, 'Krikštatėvis', 'The Godfather', 'Italų-amerikiečių mafijos šeimos patriarcho pasakojimas apie valdžią, šeimą ir nusikaltimą.', 'Francis Ford Coppola', 175, '1972-03-24', 4.9, 9.2, 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', 'Klasika'),
(3, 'Tamsos Riteris', 'The Dark Knight', 'Betmenas susiduria su nauju priešu - Džokeriu, kuris kelia chaosą Gotamo mieste.', 'Christopher Nolan', 152, '2008-07-18', 4.7, 9.0, 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911BTUgME76Nz1.jpg', 'Populiarus'),
(4, 'Pulp Fiction', 'Pulp Fiction', 'Kelios susipynusios istorijos apie Los Andželo nusikaltėlius, smulkius vagišius ir paslaptingą lagaminą.', 'Quentin Tarantino', 154, '1994-10-14', 4.6, 8.9, 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', 'Klasika'),
(5, 'Matrica', 'The Matrix', 'Programuotojas Neo atranda, kad realybė yra simuliacija, ir prisijungia prie kovos prieš mašinas.', 'The Wachowskis', 136, '1999-03-31', 4.5, 8.7, 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', 'Mokslinė fantastika'),
(6, 'Pradžia', 'Inception', 'Specialistas, galintis įsiskverbti į žmonių sapnus, gauna paskutinę užduotį - įdiegti idėją.', 'Christopher Nolan', 148, '2010-07-16', 4.7, 8.8, 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg', 'Populiarus'),
(7, 'Parazitas', 'Parasite', 'Varguomenės šeima pamažu infiltruojasi į turtingos šeimos gyvenimą.', 'Bong Joon-ho', 132, '2019-05-30', 4.6, 8.5, 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', 'Populiarus'),
(8, 'Kovos Klubas', 'Fight Club', 'Bevardis pasakotojas ir muilo pardavėjas Tyler Durden įkuria pogrindžio kovos klubą.', 'David Fincher', 139, '1999-10-15', 4.8, 8.8, 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', 'Klasika');

INSERT INTO genres (name)
VALUES
('Mokslinė fantastika'),
('Drama'),
('Nuotykių'),
('Kriminalinis'),
('Veiksmo'),
('Trileris'),
('Komedija');

INSERT INTO movie_genres (movieId, genreId)
SELECT 1, id FROM genres WHERE name IN ('Mokslinė fantastika', 'Drama', 'Nuotykių');

INSERT INTO movie_genres (movieId, genreId)
SELECT 2, id FROM genres WHERE name IN ('Drama', 'Kriminalinis');

INSERT INTO movie_genres (movieId, genreId)
SELECT 3, id FROM genres WHERE name IN ('Veiksmo', 'Kriminalinis', 'Drama');

INSERT INTO movie_genres (movieId, genreId)
SELECT 4, id FROM genres WHERE name IN ('Kriminalinis', 'Drama');

INSERT INTO movie_genres (movieId, genreId)
SELECT 5, id FROM genres WHERE name IN ('Mokslinė fantastika', 'Veiksmo');

INSERT INTO movie_genres (movieId, genreId)
SELECT 6, id FROM genres WHERE name IN ('Mokslinė fantastika', 'Veiksmo', 'Trileris');

INSERT INTO movie_genres (movieId, genreId)
SELECT 7, id FROM genres WHERE name IN ('Trileris', 'Drama', 'Komedija');

INSERT INTO movie_genres (movieId, genreId)
SELECT 8, id FROM genres WHERE name IN ('Drama', 'Trileris');

INSERT INTO actors (name)
VALUES
('Matthew McConaughey'),
('Anne Hathaway'),
('Jessica Chastain'),
('Marlon Brando'),
('Al Pacino'),
('James Caan'),
('Christian Bale'),
('Heath Ledger'),
('Aaron Eckhart'),
('John Travolta'),
('Uma Thurman'),
('Samuel L. Jackson'),
('Keanu Reeves'),
('Laurence Fishburne'),
('Carrie-Anne Moss'),
('Leonardo DiCaprio'),
('Joseph Gordon-Levitt'),
('Elliot Page'),
('Song Kang-ho'),
('Lee Sun-kyun'),
('Cho Yeo-jeong'),
('Brad Pitt'),
('Edward Norton'),
('Helena Bonham Carter');

INSERT INTO movie_actors (movieId, actorId)
SELECT 1, id FROM actors WHERE name IN ('Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain');

INSERT INTO movie_actors (movieId, actorId)
SELECT 2, id FROM actors WHERE name IN ('Marlon Brando', 'Al Pacino', 'James Caan');

INSERT INTO movie_actors (movieId, actorId)
SELECT 3, id FROM actors WHERE name IN ('Christian Bale', 'Heath Ledger', 'Aaron Eckhart');

INSERT INTO movie_actors (movieId, actorId)
SELECT 4, id FROM actors WHERE name IN ('John Travolta', 'Uma Thurman', 'Samuel L. Jackson');

INSERT INTO movie_actors (movieId, actorId)
SELECT 5, id FROM actors WHERE name IN ('Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss');

INSERT INTO movie_actors (movieId, actorId)
SELECT 6, id FROM actors WHERE name IN ('Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page');

INSERT INTO movie_actors (movieId, actorId)
SELECT 7, id FROM actors WHERE name IN ('Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong');

INSERT INTO movie_actors (movieId, actorId)
SELECT 8, id FROM actors WHERE name IN ('Brad Pitt', 'Edward Norton', 'Helena Bonham Carter');

INSERT INTO movie_ratings (movieId, userId, rating, createdAt)
VALUES
(1, 3, 5, '2026-03-10'),
(1, 4, 5, '2026-03-12'),
(1, 3, 5, '2026-03-13'),
(1, 4, 4, '2026-03-14'),
(1, 3, 5, '2026-03-15'),

(2, 3, 5, '2026-02-20'),
(2, 4, 5, '2026-02-21'),
(2, 3, 5, '2026-02-22'),
(2, 4, 5, '2026-02-23'),
(2, 3, 4, '2026-02-24'),

(3, 3, 5, '2026-02-25'),
(3, 4, 5, '2026-02-26'),
(3, 3, 4, '2026-02-27'),
(3, 4, 5, '2026-02-28'),
(3, 3, 4, '2026-03-01'),

(4, 3, 5, '2026-02-10'),
(4, 4, 4, '2026-02-11'),
(4, 3, 5, '2026-02-12'),
(4, 4, 4, '2026-02-13'),
(4, 3, 5, '2026-02-14'),

(5, 3, 5, '2026-02-01'),
(5, 4, 4, '2026-02-02'),
(5, 3, 5, '2026-02-03'),
(5, 4, 4, '2026-02-04'),
(5, 3, 5, '2026-02-05'),

(6, 3, 5, '2026-03-15'),
(6, 4, 5, '2026-03-16'),
(6, 3, 4, '2026-03-17'),
(6, 4, 5, '2026-03-18'),
(6, 3, 4, '2026-03-19'),

(7, 3, 5, '2026-03-20'),
(7, 4, 4, '2026-03-21'),
(7, 3, 5, '2026-03-22'),
(7, 4, 5, '2026-03-23'),
(7, 3, 4, '2026-03-24'),

(8, 3, 5, '2026-03-25'),
(8, 4, 5, '2026-03-26'),
(8, 3, 5, '2026-03-27'),
(8, 4, 4, '2026-03-28'),
(8, 3, 5, '2026-03-29');

INSERT INTO comments (movieId, userId, text, date)
VALUES
(1, 3, 'Vienas geriausių filmų, ką esu matęs!', '2026-03-10'),
(1, 4, 'Nolan genijus. Muzika nepaprasta.', '2026-03-12'),
(2, 3, 'Klasika, kurią privalu pamatyti.', '2026-02-20'),
(6, 4, 'Sapnas sapne - genialus konceptas!', '2026-03-15');

INSERT INTO food_recommendations (movieId, name, woltLink)
VALUES
(1, 'Kosminis burgeris', 'https://wolt.com'),
(2, 'Itališka pica', 'https://wolt.com'),
(3, 'Tamsaus šokolado desertas', 'https://wolt.com'),
(4, 'Amerikiečių mėsainis su kokteiliu', 'https://wolt.com'),
(5, 'Sushi rinkinys', 'https://wolt.com'),
(6, 'Prancūziški krepaliai', 'https://wolt.com'),
(7, 'Korėjiečių rameno sriuba', 'https://wolt.com'),
(8, 'Steikas su šoninėmis', 'https://wolt.com');