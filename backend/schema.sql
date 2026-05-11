-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: filmudb
-- ------------------------------------------------------
-- Server version	9.7.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'e217fe6b-4cf7-11f1-8be9-2811a8be468b:1-117';

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (2,'Klasika'),(3,'Mokslinė fantastika'),(4,'Naujausias'),(1,'Populiarus'),(5,'Rekomenduojamas');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `movie_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `text` text,
  `created_at` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `movie_id` (`movie_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,1,3,'Vienas geriausių filmų, ką esu matęs!','2026-03-10'),(2,1,4,'Nolan genijus. Muzika nepaprasta.','2026-03-12'),(3,10,3,'Labai smagus filmas lengvam vakarui.','2026-04-01'),(4,13,4,'Puikus pasirinkimas, jei norisi įtampos.','2026-04-03'),(5,15,3,'Veiksmo scena po scenos — super.','2026-04-05'),(6,18,4,'Lėtas, bet labai stiprus mokslinės fantastikos filmas.','2026-04-08'),(7,23,3,'Epinė klasika, kuri vis dar veikia.','2026-04-10'),(8,25,3,'Tamsus ir labai stiprus trileris.','2026-04-12'),(9,26,4,'Klasika, kuri tinka beveik kiekvienai nuotaikai.','2026-04-13'),(10,28,3,'Puikus nuotykių ir fantastikos derinys.','2026-04-14'),(11,30,4,'Trumpas, gražus ir nostalgiškas pasirinkimas.','2026-04-15');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `user_id` int NOT NULL,
  `movie_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`movie_id`),
  KEY `movie_id` (`movie_id`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES (3,1),(4,2),(3,9),(4,10),(4,11),(4,13),(3,15),(3,18),(4,21),(3,23);
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genres`
--

DROP TABLE IF EXISTS `genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genres` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genres`
--

LOCK TABLES `genres` WRITE;
/*!40000 ALTER TABLE `genres` DISABLE KEYS */;
INSERT INTO `genres` VALUES (10,'Animacinis'),(11,'Dokumentinis'),(1,'Drama'),(12,'Fantastinis'),(3,'Komedija'),(6,'Kriminalinis'),(5,'Mokslinė fantastika'),(9,'Nuotykių'),(7,'Romantinis'),(8,'Siaubo'),(4,'Trileris'),(2,'Veiksmo');
/*!40000 ALTER TABLE `genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movie_actors`
--

DROP TABLE IF EXISTS `movie_actors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movie_actors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `movie_id` int DEFAULT NULL,
  `actor_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `movie_id` (`movie_id`),
  CONSTRAINT `movie_actors_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movie_actors`
--

LOCK TABLES `movie_actors` WRITE;
/*!40000 ALTER TABLE `movie_actors` DISABLE KEYS */;
INSERT INTO `movie_actors` VALUES (1,1,'Matthew McConaughey'),(2,1,'Anne Hathaway'),(3,1,'Jessica Chastain'),(4,2,'Marlon Brando'),(5,2,'Al Pacino'),(6,2,'James Caan'),(7,9,'Tom Hanks'),(8,9,'Tim Allen'),(9,9,'Don Rickles'),(10,10,'Mike Myers'),(11,10,'Eddie Murphy'),(12,10,'Cameron Diaz'),(13,11,'Leonardo DiCaprio'),(14,11,'Kate Winslet'),(15,11,'Billy Zane'),(16,12,'Ryan Gosling'),(17,12,'Rachel McAdams'),(18,12,'James Garner'),(19,13,'Vera Farmiga'),(20,13,'Patrick Wilson'),(21,13,'Lili Taylor'),(22,14,'Cary Elwes'),(23,14,'Leigh Whannell'),(24,14,'Danny Glover'),(25,15,'Tom Hardy'),(26,15,'Charlize Theron'),(27,15,'Nicholas Hoult'),(28,16,'Keanu Reeves'),(29,16,'Michael Nyqvist'),(30,16,'Alfie Allen'),(31,17,'Matt Damon'),(32,17,'Jessica Chastain'),(33,17,'Kristen Wiig'),(34,18,'Amy Adams'),(35,18,'Jeremy Renner'),(36,18,'Forest Whitaker'),(37,19,'Alex Honnold'),(38,19,'Jimmy Chin'),(39,19,'Sanni McCandless'),(40,20,'Jesse Eisenberg'),(41,20,'Andrew Garfield'),(42,20,'Justin Timberlake'),(43,21,'Audrey Tautou'),(44,21,'Mathieu Kassovitz'),(45,21,'Rufus'),(46,22,'Ralph Fiennes'),(47,22,'Tony Revolori'),(48,22,'Saoirse Ronan'),(49,23,'Elijah Wood'),(50,23,'Ian McKellen'),(51,23,'Viggo Mortensen'),(52,24,'Neel Sethi'),(53,24,'Bill Murray'),(54,24,'Idris Elba'),(55,25,'Brad Pitt'),(56,25,'Morgan Freeman'),(57,25,'Gwyneth Paltrow'),(58,26,'Tom Hanks'),(59,26,'Robin Wright'),(60,26,'Gary Sinise'),(61,27,'Sigourney Weaver'),(62,27,'Tom Skerritt'),(63,27,'John Hurt'),(64,28,'Michael J. Fox'),(65,28,'Christopher Lloyd'),(66,28,'Lea Thompson'),(67,29,'Arnold Schwarzenegger'),(68,29,'Linda Hamilton'),(69,29,'Edward Furlong'),(70,30,'Matthew Broderick'),(71,30,'Jeremy Irons'),(72,30,'James Earl Jones');
/*!40000 ALTER TABLE `movie_actors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movie_genres`
--

DROP TABLE IF EXISTS `movie_genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movie_genres` (
  `movie_id` int NOT NULL,
  `genre_id` int NOT NULL,
  PRIMARY KEY (`movie_id`,`genre_id`),
  KEY `genre_id` (`genre_id`),
  CONSTRAINT `movie_genres_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `movie_genres_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `genres` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movie_genres`
--

LOCK TABLES `movie_genres` WRITE;
/*!40000 ALTER TABLE `movie_genres` DISABLE KEYS */;
INSERT INTO `movie_genres` VALUES (1,1),(2,1),(11,1),(12,1),(18,1),(20,1),(21,1),(23,1),(24,1),(25,1),(26,1),(30,1),(15,2),(16,2),(29,2),(9,3),(10,3),(17,3),(21,3),(22,3),(26,3),(28,3),(13,4),(14,4),(16,4),(25,4),(27,4),(29,4),(1,5),(15,5),(17,5),(18,5),(27,5),(28,5),(29,5),(2,6),(14,6),(16,6),(22,6),(25,6),(11,7),(12,7),(21,7),(26,7),(13,8),(14,8),(27,8),(1,9),(9,9),(15,9),(17,9),(19,9),(22,9),(23,9),(24,9),(28,9),(30,9),(9,10),(10,10),(30,10),(19,11),(20,11),(10,12),(23,12),(24,12);
/*!40000 ALTER TABLE `movie_genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movie_ratings`
--

DROP TABLE IF EXISTS `movie_ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movie_ratings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `movie_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `movie_id` (`movie_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `movie_ratings_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `movie_ratings_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `movie_ratings_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movie_ratings`
--

LOCK TABLES `movie_ratings` WRITE;
/*!40000 ALTER TABLE `movie_ratings` DISABLE KEYS */;
INSERT INTO `movie_ratings` VALUES (1,9,3,4,'2026-05-11 07:36:56'),(2,9,4,5,'2026-05-11 07:36:56'),(3,10,3,5,'2026-05-11 07:36:56'),(4,10,4,4,'2026-05-11 07:36:56'),(5,11,3,5,'2026-05-11 07:36:56'),(6,11,4,5,'2026-05-11 07:36:56'),(7,12,3,4,'2026-05-11 07:36:56'),(8,13,4,4,'2026-05-11 07:36:56'),(9,14,3,4,'2026-05-11 07:36:56'),(10,15,3,5,'2026-05-11 07:36:56'),(11,15,4,5,'2026-05-11 07:36:56'),(12,16,3,4,'2026-05-11 07:36:56'),(13,16,4,4,'2026-05-11 07:36:56'),(14,17,3,5,'2026-05-11 07:36:56'),(15,17,4,4,'2026-05-11 07:36:56'),(16,18,3,4,'2026-05-11 07:36:56'),(17,18,4,5,'2026-05-11 07:36:56'),(18,19,3,5,'2026-05-11 07:36:56'),(19,20,4,4,'2026-05-11 07:36:56'),(20,21,3,5,'2026-05-11 07:36:56'),(21,21,4,5,'2026-05-11 07:36:56'),(22,22,3,4,'2026-05-11 07:36:56'),(23,22,4,5,'2026-05-11 07:36:56'),(24,23,3,5,'2026-05-11 07:36:56'),(25,23,4,5,'2026-05-11 07:36:56'),(26,24,3,4,'2026-05-11 07:36:56'),(27,25,3,5,'2026-05-11 07:39:50'),(28,25,4,5,'2026-05-11 07:39:50'),(29,26,3,5,'2026-05-11 07:39:50'),(30,26,4,5,'2026-05-11 07:39:50'),(31,27,3,5,'2026-05-11 07:39:50'),(32,27,4,4,'2026-05-11 07:39:50'),(33,28,3,5,'2026-05-11 07:39:50'),(34,28,4,4,'2026-05-11 07:39:50'),(35,29,3,5,'2026-05-11 07:39:50'),(36,29,4,5,'2026-05-11 07:39:50'),(37,30,3,5,'2026-05-11 07:39:50'),(38,30,4,5,'2026-05-11 07:39:50');
/*!40000 ALTER TABLE `movie_ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movies`
--

DROP TABLE IF EXISTS `movies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `original_title` varchar(255) DEFAULT NULL,
  `description` text,
  `director` varchar(255) DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `release_date` date DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT NULL,
  `imdb_rating` decimal(2,1) DEFAULT NULL,
  `poster` text,
  `food_name` varchar(255) DEFAULT NULL,
  `food_wolt_link` text,
  `category_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `movies_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movies`
--

LOCK TABLES `movies` WRITE;
/*!40000 ALTER TABLE `movies` DISABLE KEYS */;
INSERT INTO `movies` VALUES (1,'Tarp žvaigždžių','Interstellar','Grupė tyrinėtojų keliauja per erdvėlaikio tunelį, ieškodami naujų namų žmonijai.','Christopher Nolan',169,'2014-11-07',4.8,8.7,'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg','Kosminis burgeris','https://wolt.com',1),(2,'Krikštatėvis','The Godfather','Italų kilmės amerikiečių mafijos šeimos patriarcho istorija apie valdžią, šeimą ir nusikaltimų pasaulį.','Francis Ford Coppola',175,'1972-03-24',4.9,9.2,'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg','Itališka pica','https://wolt.com',2),(3,'Tamsos riteris','The Dark Knight','Betmenas susiduria su Džokeriu – nusikaltėliu, siekiančiu paskleisti chaosą Gotamo mieste.','Christopher Nolan',152,'2008-07-18',4.7,9.0,'https://image.tmdb.org/t/p/w600_and_h900_face/qJ2tW6WMUDux911r6m7haRef0WH.jpg','Tamsaus šokolado desertas','https://wolt.com',1),(4,'Bulvarinis skaitalas','Pulp Fiction','Kelios tarpusavyje susipynusios istorijos apie Los Andželo nusikaltėlius, smulkius vagis ir paslaptingą lagaminą.','Quentin Tarantino',154,'1994-10-14',4.6,8.9,'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg','Amerikietiškas mėsainis su pieno kokteiliu','https://wolt.com',2),(5,'Matrica','The Matrix','Programuotojas Neo sužino, kad jo pažįstama realybė tėra simuliacija, ir prisijungia prie kovos prieš mašinas.','The Wachowskis',136,'1999-03-31',4.5,8.7,'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg','Sushi rinkinys','https://wolt.com',3),(6,'Pradžia','Inception','Specialistas, gebantis įsiskverbti į žmonių sapnus, gauna sudėtingą užduotį – ne pavogti idėją, o ją įdiegti.','Christopher Nolan',148,'2010-07-16',4.7,8.8,'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg','Prancūziški lietiniai','https://wolt.com',1),(7,'Parazitas','Parasite','Neturtinga šeima gudriai įsilieja į turtingos šeimos gyvenimą, tačiau jų planas netikėtai ima griūti.','Bong Joon-ho',132,'2019-05-30',4.6,8.5,'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg','Korėjietiška rameno sriuba','https://wolt.com',1),(8,'Kovos klubas','Fight Club','Nemigos kamuojamas pasakotojas susipažįsta su Tyleriu Durdenu ir kartu su juo įkuria pogrindinį kovos klubą.','David Fincher',139,'1999-10-15',4.8,8.8,'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg','Steikas su garnyru','https://wolt.com',2),(9,'Žaislų istorija','Toy Story','Žaislai atgyja, kai žmonės jų nemato, ir patiria nuotykius bandydami išlikti kartu.','John Lasseter',81,'1995-11-22',4.4,8.3,'https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg','Šeimos pica','https://wolt.com',2),(10,'Šrekas','Shrek','Niūrus ogre leidžiasi į netikėtą kelionę gelbėti princesės ir atranda tikrą draugystę.','Andrew Adamson',90,'2001-05-18',4.5,7.9,'https://image.tmdb.org/t/p/w500/iB64vpL3dIObOtMZgX3RqdVdQDc.jpg','Vafliai su padažu','https://wolt.com',1),(11,'Titanikas','Titanic','Jauna aristokratė ir neturtingas menininkas įsimyli lemtingoje Titaniko kelionėje.','James Cameron',194,'1997-12-19',4.6,7.9,'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg','Romantiška vakarienė','https://wolt.com',2),(12,'Užrašų knygelė','The Notebook','Dviejų jaunų žmonių meilės istorija, kuri išbandoma laiko, šeimos ir pasirinkimų.','Nick Cassavetes',123,'2004-06-25',4.3,7.8,'https://image.tmdb.org/t/p/w500/rNzQyW4f8B8cQeg7Dgj3n6eT5k9.jpg','Desertas dviem','https://wolt.com',5),(13,'Išvarymas','The Conjuring','Paranormalių reiškinių tyrėjai padeda šeimai, kurią persekioja tamsios jėgos.','James Wan',112,'2013-07-19',4.2,7.5,'https://image.tmdb.org/t/p/w500/wVYREutTvI2tmxr6ujrHT704wGF.jpg','Aštrūs vištienos sparneliai','https://wolt.com',5),(14,'Pjūklas','Saw','Du vyrai pabunda paslaptingoje patalpoje ir tampa žiauraus žaidimo dalyviais.','James Wan',103,'2004-10-29',4.1,7.6,'https://image.tmdb.org/t/p/w500/4da0TS3iQ1IzuyhDS8elgkmOfrN.jpg','Nachos su sūriu','https://wolt.com',2),(15,'Mad Max: Įniršio kelias','Mad Max: Fury Road','Postapokaliptiniame pasaulyje kariai bėga per dykumą, siekdami laisvės.','George Miller',120,'2015-05-15',4.7,8.1,'https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroipsir.jpg','Aštrus burgeris','https://wolt.com',1),(16,'Džonas Vikas','John Wick','Buvęs samdomas žudikas grįžta į nusikaltimų pasaulį siekdamas keršto.','Chad Stahelski',101,'2014-10-24',4.4,7.4,'https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg','Juodas burgeris','https://wolt.com',1),(17,'Marsietis','The Martian','Astronautas paliekamas Marse ir turi pasitelkti mokslą, kad išgyventų.','Ridley Scott',144,'2015-10-02',4.5,8.0,'https://image.tmdb.org/t/p/w500/3ndAx3weG6KDkJIRMCi5vXX6Dyb.jpg','Bulvytės su padažu','https://wolt.com',3),(18,'Atvykimas','Arrival','Kalbininkė bando užmegzti ryšį su ateiviais ir suprasti jų neįprastą kalbą.','Denis Villeneuve',116,'2016-11-11',4.4,7.9,'https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg','Ramenas','https://wolt.com',3),(19,'Free Solo','Free Solo','Dokumentika apie alpinistą Alexą Honnoldą ir jo bandymą be virvių įkopti į El Capitan.','Jimmy Chin',100,'2018-12-14',4.5,8.1,'https://image.tmdb.org/t/p/w500/5m2bN9j1lPKEI8oM1dS4taE5oGq.jpg','Energinis dubenėlis','https://wolt.com',5),(20,'Socialinis tinklas','The Social Network','Istorija apie Facebook kūrimą, ambicijas, draugystę ir išdavystę.','David Fincher',120,'2010-10-01',4.4,7.8,'https://image.tmdb.org/t/p/w500/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg','Kava ir sumuštinis','https://wolt.com',5),(21,'Amelija iš Monmartro','Amélie','Jauna moteris Paryžiuje slapta keičia aplinkinių gyvenimus ir ieško savo laimės.','Jean-Pierre Jeunet',122,'2001-04-25',4.6,8.3,'https://image.tmdb.org/t/p/w500/oTKduWL2tpIKEmkAqF4mFEAWAsv.jpg','Prancūziški lietiniai','https://wolt.com',2),(22,'Grand Budapest viešbutis','The Grand Budapest Hotel','Ekscentriškas viešbučio konsjeržas įsivelia į nuotykį dėl paveikslo ir palikimo.','Wes Anderson',99,'2014-03-28',4.3,8.1,'https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg','Pyragaitis','https://wolt.com',5),(23,'Žiedų valdovas: Žiedo brolija','The Lord of the Rings: The Fellowship of the Ring','Hobitas Frodas leidžiasi į pavojingą kelionę sunaikinti galingą žiedą.','Peter Jackson',178,'2001-12-19',4.9,8.9,'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg','Viduržemio kepsnys','https://wolt.com',2),(24,'Džiunglių knyga','The Jungle Book','Berniukas, užaugęs tarp vilkų, keliauja per džiungles ieškodamas savo vietos.','Jon Favreau',106,'2016-04-15',4.2,7.4,'https://image.tmdb.org/t/p/w500/9fIYVDHsW0K8Nz1zTJoULDE4O1d.jpg','Vaisių kokteilis','https://wolt.com',5),(25,'Septyni','Se7en','Du detektyvai tiria serijinio žudiko nusikaltimus, paremtus septyniomis mirtinomis nuodėmėmis.','David Fincher',127,'1995-09-22',4.7,8.6,'https://image.tmdb.org/t/p/w500/191nKfP0ehp3uIvWqgPbFmI4lv9.jpg','Aštrūs užkandžiai','https://wolt.com',2),(26,'Forestas Gampas','Forrest Gump','Paprasto, nuoširdaus žmogaus gyvenimas persipina su svarbiausiais JAV istorijos įvykiais.','Robert Zemeckis',142,'1994-07-06',4.8,8.8,'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg','Krevetės su ryžiais','https://wolt.com',2),(27,'Ateivis','Alien','Kosminio laivo įgula susiduria su mirtinu nežemišku padaru.','Ridley Scott',117,'1979-05-25',4.6,8.5,'https://image.tmdb.org/t/p/w500/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg','Tamsus šokoladas','https://wolt.com',2),(28,'Atgal į ateitį','Back to the Future','Paauglys netyčia nukeliauja į praeitį ir turi pasirūpinti, kad jo tėvai susipažintų.','Robert Zemeckis',116,'1985-07-03',4.7,8.5,'https://image.tmdb.org/t/p/w500/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg','Retro burgeris','https://wolt.com',2),(29,'Terminatorius 2: Teismo diena','Terminator 2: Judgment Day','Kiborgas grįžta apsaugoti berniuko, nuo kurio priklauso žmonijos ateitis.','James Cameron',137,'1991-07-03',4.8,8.6,'https://image.tmdb.org/t/p/w500/5M0j0B18abtBI5gi2RhfjjurTqb.jpg','Aštrus kebabas','https://wolt.com',2),(30,'Liūtas karalius','The Lion King','Jaunas liūtukas Simba mokosi atsakomybės, draugystės ir drąsos.','Roger Allers',88,'1994-06-24',4.7,8.5,'https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg','Vaikiškas rinkinys','https://wolt.com',2);
/*!40000 ALTER TABLE `movies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','moderator','viewer') NOT NULL,
  `avatar` text,
  `blocked` tinyint(1) DEFAULT '0',
  `blocked_reason` text,
  `blocked_until` datetime DEFAULT NULL,
  `created_at` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin@filmuvercle.lt','8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918','admin','',0,'',NULL,'2026-01-01'),(2,'moderatorius','mod@filmuvercle.lt','cfde2ca5188afb7bdd0691c7bef887baba78b709aadde8e8c535329d5751e6fe','moderator','',0,'',NULL,'2026-01-01'),(3,'ziuretojas','ziuretojas@filmuvercle.lt','ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f','viewer','',0,'',NULL,'2026-02-15'),(4,'titas','titas@filmuvercle.lt','ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f','viewer','',0,'',NULL,'2026-03-01');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `watch_parties`
--

DROP TABLE IF EXISTS `watch_parties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `watch_parties` (
  `id` int NOT NULL AUTO_INCREMENT,
  `movie_id` int DEFAULT NULL,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `max_participants` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  KEY `movie_id` (`movie_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `watch_parties_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `watch_parties_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `watch_parties`
--

LOCK TABLES `watch_parties` WRITE;
/*!40000 ALTER TABLE `watch_parties` DISABLE KEYS */;
INSERT INTO `watch_parties` VALUES (1,1,'2026-04-20','19:00:00',50,2,'Bendra filmo „Tarp žvaigždžių“ peržiūra su diskusija po filmo!');
/*!40000 ALTER TABLE `watch_parties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `watch_party_participants`
--

DROP TABLE IF EXISTS `watch_party_participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `watch_party_participants` (
  `watch_party_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`watch_party_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `watch_party_participants_ibfk_1` FOREIGN KEY (`watch_party_id`) REFERENCES `watch_parties` (`id`) ON DELETE CASCADE,
  CONSTRAINT `watch_party_participants_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `watch_party_participants`
--

LOCK TABLES `watch_party_participants` WRITE;
/*!40000 ALTER TABLE `watch_party_participants` DISABLE KEYS */;
INSERT INTO `watch_party_participants` VALUES (1,3),(1,4);
/*!40000 ALTER TABLE `watch_party_participants` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-11 11:12:13
