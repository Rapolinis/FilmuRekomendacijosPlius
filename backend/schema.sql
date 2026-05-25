DROP DATABASE IF EXISTS filmudb;
CREATE DATABASE filmudb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE filmudb;

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE genres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'moderator', 'viewer') NOT NULL,
  avatar TEXT,
  blocked BOOLEAN DEFAULT FALSE,
  blocked_reason TEXT,
  blocked_until DATETIME,
  created_at DATE NOT NULL
);

CREATE TABLE movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  original_title VARCHAR(255),
  description TEXT,
  director VARCHAR(255),
  duration INT,
  release_date DATE,
  rating DECIMAL(2,1),
  imdb_rating DECIMAL(2,1),
  poster TEXT,
  food_name VARCHAR(255),
  food_wolt_link TEXT,
  category_id INT,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE movie_genres (
  movie_id INT,
  genre_id INT,
  PRIMARY KEY (movie_id, genre_id),
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
  FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

CREATE TABLE movie_actors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  movie_id INT,
  actor_name VARCHAR(255),
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  movie_id INT,
  user_id INT,
  text TEXT,
  created_at DATE,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE movie_ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  movie_id INT,
  user_id INT,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE watch_parties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  movie_id INT,
  date DATE,
  time TIME,
  max_participants INT,
  created_by INT,
  description TEXT,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE watch_party_participants (
  watch_party_id INT,
  user_id INT,
  PRIMARY KEY (watch_party_id, user_id),
  FOREIGN KEY (watch_party_id) REFERENCES watch_parties(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE favorites (
  user_id INT,
  movie_id INT,
  PRIMARY KEY (user_id, movie_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

INSERT INTO categories (id, name) VALUES
(1, 'Populiarus'),
(2, 'Klasika'),
(3, 'Mokslinė fantastika'),
(4, 'Naujausias'),
(5, 'Rekomenduojamas');

INSERT INTO genres (id, name) VALUES
(1, 'Drama'),
(2, 'Veiksmo'),
(3, 'Komedija'),
(4, 'Trileris'),
(5, 'Mokslinė fantastika'),
(6, 'Kriminalinis'),
(7, 'Romantinis'),
(8, 'Siaubo'),
(9, 'Nuotykių'),
(10, 'Animacinis'),
(11, 'Dokumentinis'),
(12, 'Fantastinis');

INSERT INTO users (id, username, email, password_hash, role, avatar, blocked, blocked_reason, blocked_until, created_at) VALUES
(1, 'admin', 'admin@filmuvercle.lt', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'admin', '', false, '', NULL, '2026-01-01'),
(2, 'moderatorius', 'mod@filmuvercle.lt', 'cfde2ca5188afb7bdd0691c7bef887baba78b709aadde8e8c535329d5751e6fe', 'moderator', '', false, '', NULL, '2026-01-01'),
(3, 'ziuretojas', 'ziuretojas@filmuvercle.lt', 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f', 'viewer', '', false, '', NULL, '2026-02-15'),
(4, 'titas', 'titas@filmuvercle.lt', 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f', 'viewer', '', false, '', NULL, '2026-03-01');

INSERT INTO movies (
  id, title, original_title, description, director, duration,
  release_date, rating, imdb_rating, poster,
  food_name, food_wolt_link, category_id
) VALUES
(1, 'Tarp žvaigždžių', 'Interstellar', 'Grupė tyrinėtojų keliauja per erdvėlaikio tunelį, ieškodami naujų namų žmonijai.', 'Christopher Nolan', 169, '2014-11-07', 4.8, 8.7, 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', 'Kosminis burgeris', 'https://wolt.com', 1),
(2, 'Krikštatėvis', 'The Godfather', 'Italų kilmės amerikiečių mafijos šeimos patriarcho istorija apie valdžią, šeimą ir nusikaltimų pasaulį.', 'Francis Ford Coppola', 175, '1972-03-24', 4.9, 9.2, 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', 'Itališka pica', 'https://wolt.com', 2),
(3, 'Tamsos riteris', 'The Dark Knight', 'Betmenas susiduria su Džokeriu – nusikaltėliu, siekiančiu paskleisti chaosą Gotamo mieste.', 'Christopher Nolan', 152, '2008-07-18', 4.7, 9.0, 'https://image.tmdb.org/t/p/w600_and_h900_face/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 'Tamsaus šokolado desertas', 'https://wolt.com', 1),
(4, 'Bulvarinis skaitalas', 'Pulp Fiction', 'Kelios tarpusavyje susipynusios istorijos apie Los Andželo nusikaltėlius, smulkius vagis ir paslaptingą lagaminą.', 'Quentin Tarantino', 154, '1994-10-14', 4.6, 8.9, 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', 'Amerikietiškas mėsainis su pieno kokteiliu', 'https://wolt.com', 2),
(5, 'Matrica', 'The Matrix', 'Programuotojas Neo sužino, kad jo pažįstama realybė tėra simuliacija, ir prisijungia prie kovos prieš mašinas.', 'The Wachowskis', 136, '1999-03-31', 4.5, 8.7, 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', 'Sushi rinkinys', 'https://wolt.com', 3),
(6, 'Pradžia', 'Inception', 'Specialistas, gebantis įsiskverbti į žmonių sapnus, gauna sudėtingą užduotį – ne pavogti idėją, o ją įdiegti.', 'Christopher Nolan', 148, '2010-07-16', 4.7, 8.8, 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg', 'Prancūziški lietiniai', 'https://wolt.com', 1),
(7, 'Parazitas', 'Parasite', 'Neturtinga šeima gudriai įsilieja į turtingos šeimos gyvenimą, tačiau jų planas netikėtai ima griūti.', 'Bong Joon-ho', 132, '2019-05-30', 4.6, 8.5, 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', 'Korėjietiška rameno sriuba', 'https://wolt.com', 1),
(8, 'Kovos klubas', 'Fight Club', 'Nemigos kamuojamas pasakotojas susipažįsta su Tyleriu Durdenu ir kartu su juo įkuria pogrindinį kovos klubą.', 'David Fincher', 139, '1999-10-15', 4.8, 8.8, 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', 'Steikas su garnyru', 'https://wolt.com', 2),
(9, 'Žaislų istorija', 'Toy Story', 'Žaislai atgyja, kai žmonės jų nemato, ir patiria nuotykius bandydami išlikti kartu.', 'John Lasseter', 81, '1995-11-22', 4.4, 8.3, 'https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg', 'Šeimos pica', 'https://wolt.com', 2),
(10, 'Šrekas', 'Shrek', 'Niūrus ogre leidžiasi į netikėtą kelionę gelbėti princesės ir atranda tikrą draugystę.', 'Andrew Adamson', 90, '2001-05-18', 4.5, 7.9, 'https://image.tmdb.org/t/p/w500/iB64vpL3dIObOtMZgX3RqdVdQDc.jpg', 'Vafliai su padažu', 'https://wolt.com', 1),
(11, 'Titanikas', 'Titanic', 'Jauna aristokratė ir neturtingas menininkas įsimyli lemtingoje Titaniko kelionėje.', 'James Cameron', 194, '1997-12-19', 4.6, 7.9, 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg', 'Romantiška vakarienė', 'https://wolt.com', 2),
(12, 'Užrašų knygelė', 'The Notebook', 'Dviejų jaunų žmonių meilės istorija, kuri išbandoma laiko, šeimos ir pasirinkimų.', 'Nick Cassavetes', 123, '2004-06-25', 4.3, 7.8, 'https://image.tmdb.org/t/p/w500/rNzQyW4f8B8cQeg7Dgj3n6eT5k9.jpg', 'Desertas dviem', 'https://wolt.com', 5),
(13, 'Išvarymas', 'The Conjuring', 'Paranormalių reiškinių tyrėjai padeda šeimai, kurią persekioja tamsios jėgos.', 'James Wan', 112, '2013-07-19', 4.2, 7.5, 'https://image.tmdb.org/t/p/w500/wVYREutTvI2tmxr6ujrHT704wGF.jpg', 'Aštrūs vištienos sparneliai', 'https://wolt.com', 5),
(14, 'Pjūklas', 'Saw', 'Du vyrai pabunda paslaptingoje patalpoje ir tampa žiauraus žaidimo dalyviais.', 'James Wan', 103, '2004-10-29', 4.1, 7.6, 'https://image.tmdb.org/t/p/w500/4da0TS3iQ1IzuyhDS8elgkmOfrN.jpg', 'Nachos su sūriu', 'https://wolt.com', 2),
(15, 'Mad Max: Įniršio kelias', 'Mad Max: Fury Road', 'Postapokaliptiniame pasaulyje kariai bėga per dykumą, siekdami laisvės.', 'George Miller', 120, '2015-05-15', 4.7, 8.1, 'https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroipsir.jpg', 'Aštrus burgeris', 'https://wolt.com', 1),
(16, 'Džonas Vikas', 'John Wick', 'Buvęs samdomas žudikas grįžta į nusikaltimų pasaulį siekdamas keršto.', 'Chad Stahelski', 101, '2014-10-24', 4.4, 7.4, 'https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg', 'Juodas burgeris', 'https://wolt.com', 1),
(17, 'Marsietis', 'The Martian', 'Astronautas paliekamas Marse ir turi pasitelkti mokslą, kad išgyventų.', 'Ridley Scott', 144, '2015-10-02', 4.5, 8.0, 'https://image.tmdb.org/t/p/w500/3ndAx3weG6KDkJIRMCi5vXX6Dyb.jpg', 'Bulvytės su padažu', 'https://wolt.com', 3),
(18, 'Atvykimas', 'Arrival', 'Kalbininkė bando užmegzti ryšį su ateiviais ir suprasti jų neįprastą kalbą.', 'Denis Villeneuve', 116, '2016-11-11', 4.4, 7.9, 'https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg', 'Ramenas', 'https://wolt.com', 3),
(19, 'Free Solo', 'Free Solo', 'Dokumentika apie alpinistą Alexą Honnoldą ir jo bandymą be virvių įkopti į El Capitan.', 'Jimmy Chin', 100, '2018-12-14', 4.5, 8.1, 'https://image.tmdb.org/t/p/w500/5m2bN9j1lPKEI8oM1dS4taE5oGq.jpg', 'Energinis dubenėlis', 'https://wolt.com', 5),
(20, 'Socialinis tinklas', 'The Social Network', 'Istorija apie Facebook kūrimą, ambicijas, draugystę ir išdavystę.', 'David Fincher', 120, '2010-10-01', 4.4, 7.8, 'https://image.tmdb.org/t/p/w500/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg', 'Kava ir sumuštinis', 'https://wolt.com', 5),
(21, 'Amelija iš Monmartro', 'Amélie', 'Jauna moteris Paryžiuje slapta keičia aplinkinių gyvenimus ir ieško savo laimės.', 'Jean-Pierre Jeunet', 122, '2001-04-25', 4.6, 8.3, 'https://image.tmdb.org/t/p/w500/oTKduWL2tpIKEmkAqF4mFEAWAsv.jpg', 'Prancūziški lietiniai', 'https://wolt.com', 2),
(22, 'Grand Budapest viešbutis', 'The Grand Budapest Hotel', 'Ekscentriškas viešbučio konsjeržas įsivelia į nuotykį dėl paveikslo ir palikimo.', 'Wes Anderson', 99, '2014-03-28', 4.3, 8.1, 'https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg', 'Pyragaitis', 'https://wolt.com', 5),
(23, 'Žiedų valdovas: Žiedo brolija', 'The Lord of the Rings: The Fellowship of the Ring', 'Hobitas Frodas leidžiasi į pavojingą kelionę sunaikinti galingą žiedą.', 'Peter Jackson', 178, '2001-12-19', 4.9, 8.9, 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg', 'Viduržemio kepsnys', 'https://wolt.com', 2),
(24, 'Džiunglių knyga', 'The Jungle Book', 'Berniukas, užaugęs tarp vilkų, keliauja per džiungles ieškodamas savo vietos.', 'Jon Favreau', 106, '2016-04-15', 4.2, 7.4, 'https://image.tmdb.org/t/p/w500/9fIYVDHsW0K8Nz1zTJoULDE4O1d.jpg', 'Vaisių kokteilis', 'https://wolt.com', 5),
(25, 'Septyni', 'Se7en', 'Du detektyvai tiria serijinio žudiko nusikaltimus, paremtus septyniomis mirtinomis nuodėmėmis.', 'David Fincher', 127, '1995-09-22', 4.7, 8.6, 'https://image.tmdb.org/t/p/w500/191nKfP0ehp3uIvWqgPbFmI4lv9.jpg', 'Aštrūs užkandžiai', 'https://wolt.com', 2),
(26, 'Forestas Gampas', 'Forrest Gump', 'Paprasto, nuoširdaus žmogaus gyvenimas persipina su svarbiausiais JAV istorijos įvykiais.', 'Robert Zemeckis', 142, '1994-07-06', 4.8, 8.8, 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', 'Krevetės su ryžiais', 'https://wolt.com', 2),
(27, 'Ateivis', 'Alien', 'Kosminio laivo įgula susiduria su mirtinu nežemišku padaru.', 'Ridley Scott', 117, '1979-05-25', 4.6, 8.5, 'https://image.tmdb.org/t/p/w500/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg', 'Tamsus šokoladas', 'https://wolt.com', 2),
(28, 'Atgal į ateitį', 'Back to the Future', 'Paauglys netyčia nukeliauja į praeitį ir turi pasirūpinti, kad jo tėvai susipažintų.', 'Robert Zemeckis', 116, '1985-07-03', 4.7, 8.5, 'https://image.tmdb.org/t/p/w500/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg', 'Retro burgeris', 'https://wolt.com', 2),
(29, 'Terminatorius 2: Teismo diena', 'Terminator 2: Judgment Day', 'Kiborgas grįžta apsaugoti berniuko, nuo kurio priklauso žmonijos ateitis.', 'James Cameron', 137, '1991-07-03', 4.8, 8.6, 'https://image.tmdb.org/t/p/w500/5M0j0B18abtBI5gi2RhfjjurTqb.jpg', 'Aštrus kebabas', 'https://wolt.com', 2),
(30, 'Liūtas karalius', 'The Lion King', 'Jaunas liūtukas Simba mokosi atsakomybės, draugystės ir drąsos.', 'Roger Allers', 88, '1994-06-24', 4.7, 8.5, 'https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg', 'Vaikiškas rinkinys', 'https://wolt.com', 2);

INSERT INTO movie_genres (movie_id, genre_id) VALUES
(1,5),(1,1),(1,9),
(2,1),(2,6),
(3,2),(3,6),(3,1),
(4,6),(4,1),
(5,5),(5,2),
(6,5),(6,2),(6,4),
(7,4),(7,1),(7,3),
(8,1),(8,4),
(9,10),(9,3),(9,9),
(10,10),(10,3),(10,12),
(11,1),(11,7),
(12,7),(12,1),
(13,8),(13,4),
(14,8),(14,4),(14,6),
(15,2),(15,9),(15,5),
(16,2),(16,6),(16,4),
(17,5),(17,9),(17,3),
(18,5),(18,1),
(19,11),(19,9),
(20,1),(20,11),
(21,7),(21,3),(21,1),
(22,3),(22,9),(22,6),
(23,12),(23,9),(23,1),
(24,9),(24,12),(24,1),
(25,6),(25,1),(25,4),
(26,1),(26,7),(26,3),
(27,5),(27,8),(27,4),
(28,5),(28,9),(28,3),
(29,2),(29,5),(29,4),
(30,10),(30,9),(30,1);

INSERT INTO movie_actors (movie_id, actor_name) VALUES
(1,'Matthew McConaughey'),(1,'Anne Hathaway'),(1,'Jessica Chastain'),
(2,'Marlon Brando'),(2,'Al Pacino'),(2,'James Caan'),
(3,'Christian Bale'),(3,'Heath Ledger'),(3,'Aaron Eckhart'),
(4,'John Travolta'),(4,'Uma Thurman'),(4,'Samuel L. Jackson'),
(5,'Keanu Reeves'),(5,'Laurence Fishburne'),(5,'Carrie-Anne Moss'),
(6,'Leonardo DiCaprio'),(6,'Joseph Gordon-Levitt'),(6,'Elliot Page'),
(7,'Song Kang-ho'),(7,'Lee Sun-kyun'),(7,'Cho Yeo-jeong'),
(8,'Brad Pitt'),(8,'Edward Norton'),(8,'Helena Bonham Carter'),
(9,'Tom Hanks'),(9,'Tim Allen'),(9,'Don Rickles'),
(10,'Mike Myers'),(10,'Eddie Murphy'),(10,'Cameron Diaz'),
(11,'Leonardo DiCaprio'),(11,'Kate Winslet'),(11,'Billy Zane'),
(12,'Ryan Gosling'),(12,'Rachel McAdams'),(12,'James Garner'),
(13,'Vera Farmiga'),(13,'Patrick Wilson'),(13,'Lili Taylor'),
(14,'Cary Elwes'),(14,'Leigh Whannell'),(14,'Danny Glover'),
(15,'Tom Hardy'),(15,'Charlize Theron'),(15,'Nicholas Hoult'),
(16,'Keanu Reeves'),(16,'Michael Nyqvist'),(16,'Alfie Allen'),
(17,'Matt Damon'),(17,'Jessica Chastain'),(17,'Kristen Wiig'),
(18,'Amy Adams'),(18,'Jeremy Renner'),(18,'Forest Whitaker'),
(19,'Alex Honnold'),(19,'Jimmy Chin'),(19,'Sanni McCandless'),
(20,'Jesse Eisenberg'),(20,'Andrew Garfield'),(20,'Justin Timberlake'),
(21,'Audrey Tautou'),(21,'Mathieu Kassovitz'),(21,'Rufus'),
(22,'Ralph Fiennes'),(22,'Tony Revolori'),(22,'Saoirse Ronan'),
(23,'Elijah Wood'),(23,'Ian McKellen'),(23,'Viggo Mortensen'),
(24,'Neel Sethi'),(24,'Bill Murray'),(24,'Idris Elba'),
(25,'Brad Pitt'),(25,'Morgan Freeman'),(25,'Gwyneth Paltrow'),
(26,'Tom Hanks'),(26,'Robin Wright'),(26,'Gary Sinise'),
(27,'Sigourney Weaver'),(27,'Tom Skerritt'),(27,'John Hurt'),
(28,'Michael J. Fox'),(28,'Christopher Lloyd'),(28,'Lea Thompson'),
(29,'Arnold Schwarzenegger'),(29,'Linda Hamilton'),(29,'Edward Furlong'),
(30,'Matthew Broderick'),(30,'Jeremy Irons'),(30,'James Earl Jones');

INSERT INTO movie_ratings (movie_id, user_id, rating) VALUES
(1,3,5),(1,4,5),
(2,3,5),(2,4,4),
(3,3,5),
(6,4,5),
(7,3,4),
(8,4,5),
(9,3,4),(9,4,5),
(10,3,5),(10,4,4),
(11,3,5),(11,4,5),
(12,3,4),
(13,4,4),
(14,3,4),
(15,3,5),(15,4,5),
(16,3,4),(16,4,4),
(17,3,5),(17,4,4),
(18,3,4),(18,4,5),
(19,3,5),
(20,4,4),
(21,3,5),(21,4,5),
(22,3,4),(22,4,5),
(23,3,5),(23,4,5),
(24,3,4),
(25,3,5),(25,4,5),
(26,3,5),(26,4,5),
(27,3,5),(27,4,4),
(28,3,5),(28,4,4),
(29,3,5),(29,4,5),
(30,3,5),(30,4,5);

INSERT INTO comments (movie_id, user_id, text, created_at) VALUES
(1,3,'Vienas geriausių filmų, ką esu matęs!','2026-03-10'),
(1,4,'Nolanas genijus. Muzika nepaprasta.','2026-03-12'),
(2,3,'Klasika, kurią privalu pamatyti.','2026-02-20'),
(6,4,'Sapnas sapne – genialus konceptas!','2026-03-15'),
(10,3,'Labai smagus filmas lengvam vakarui.','2026-04-01'),
(13,4,'Puikus pasirinkimas, jei norisi įtampos.','2026-04-03'),
(15,3,'Veiksmo scena po scenos – super.','2026-04-05'),
(18,4,'Lėtas, bet labai stiprus mokslinės fantastikos filmas.','2026-04-08'),
(23,3,'Epinė klasika, kuri vis dar veikia.','2026-04-10'),
(25,3,'Tamsus ir labai stiprus trileris.','2026-04-12'),
(26,4,'Klasika, kuri tinka beveik kiekvienai nuotaikai.','2026-04-13'),
(28,3,'Puikus nuotykių ir fantastikos derinys.','2026-04-14'),
(30,4,'Trumpas, gražus ir nostalgiškas pasirinkimas.','2026-04-15');

INSERT INTO watch_parties (id, movie_id, date, time, max_participants, created_by, description) VALUES
(1,1,'2026-06-20','19:00:00',50,2,'Bendra filmo „Tarp žvaigždžių“ peržiūra su diskusija po filmo!'),
(2,3,'2026-06-25','20:00:00',50,2,'Christopherio Nolano maratonas – pradedame nuo filmo „Tamsos riteris“!'),
(3,6,'2026-06-01','18:30:00',50,2,'Bendra filmo „Pradžia“ peržiūra – ar jūs vis dar sapne?');

INSERT INTO watch_party_participants (watch_party_id, user_id) VALUES
(1,3),(1,4),(2,3);

INSERT INTO favorites (user_id, movie_id) VALUES
(3,1),(3,5),(3,7),(3,9),(3,15),(3,18),(3,23),
(4,2),(4,6),(4,8),(4,10),(4,11),(4,13),(4,21);

SELECT 'Database created and data inserted successfully' AS status;