-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: kho_will
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `candidate_documents`
--

DROP TABLE IF EXISTS `candidate_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidate_documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `candidateId` int NOT NULL,
  `documentType` varchar(100) NOT NULL,
  `fileName` varchar(255) NOT NULL,
  `fileUrl` varchar(512) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `candidateId` (`candidateId`),
  CONSTRAINT `candidate_documents_ibfk_1` FOREIGN KEY (`candidateId`) REFERENCES `candidates` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate_documents`
--

LOCK TABLES `candidate_documents` WRITE;
/*!40000 ALTER TABLE `candidate_documents` DISABLE KEYS */;
/*!40000 ALTER TABLE `candidate_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidate_education`
--

DROP TABLE IF EXISTS `candidate_education`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidate_education` (
  `id` int NOT NULL AUTO_INCREMENT,
  `candidateId` int NOT NULL,
  `degree` varchar(150) NOT NULL,
  `institution` varchar(200) NOT NULL,
  `board` varchar(200) DEFAULT NULL,
  `year` varchar(20) DEFAULT NULL,
  `percentage` varchar(20) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `candidateId` (`candidateId`),
  CONSTRAINT `candidate_education_ibfk_1` FOREIGN KEY (`candidateId`) REFERENCES `candidates` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate_education`
--

LOCK TABLES `candidate_education` WRITE;
/*!40000 ALTER TABLE `candidate_education` DISABLE KEYS */;
/*!40000 ALTER TABLE `candidate_education` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidate_experience`
--

DROP TABLE IF EXISTS `candidate_experience`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidate_experience` (
  `id` int NOT NULL AUTO_INCREMENT,
  `candidateId` int NOT NULL,
  `companyName` varchar(200) NOT NULL,
  `location` varchar(150) DEFAULT NULL,
  `designation` varchar(150) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date DEFAULT NULL,
  `totalExperienceYears` decimal(4,2) DEFAULT NULL,
  `reasonForLeaving` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `candidateId` (`candidateId`),
  CONSTRAINT `candidate_experience_ibfk_1` FOREIGN KEY (`candidateId`) REFERENCES `candidates` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate_experience`
--

LOCK TABLES `candidate_experience` WRITE;
/*!40000 ALTER TABLE `candidate_experience` DISABLE KEYS */;
/*!40000 ALTER TABLE `candidate_experience` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidate_languages`
--

DROP TABLE IF EXISTS `candidate_languages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidate_languages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `candidateId` int NOT NULL,
  `languageName` varchar(100) NOT NULL,
  `speakLevel` enum('Basic','Intermediate','Fluent','Native') NOT NULL,
  `readLevel` enum('Basic','Intermediate','Fluent','Native') NOT NULL,
  `writeLevel` enum('Basic','Intermediate','Fluent','Native') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `candidateId` (`candidateId`),
  CONSTRAINT `candidate_languages_ibfk_1` FOREIGN KEY (`candidateId`) REFERENCES `candidates` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate_languages`
--

LOCK TABLES `candidate_languages` WRITE;
/*!40000 ALTER TABLE `candidate_languages` DISABLE KEYS */;
/*!40000 ALTER TABLE `candidate_languages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidate_references`
--

DROP TABLE IF EXISTS `candidate_references`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidate_references` (
  `id` int NOT NULL AUTO_INCREMENT,
  `candidateId` int NOT NULL,
  `referenceName` varchar(150) NOT NULL,
  `referenceEmail` varchar(150) NOT NULL,
  `referencePhone` varchar(20) NOT NULL,
  `consentConfirmed` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `candidateId` (`candidateId`),
  CONSTRAINT `candidate_references_ibfk_1` FOREIGN KEY (`candidateId`) REFERENCES `candidates` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate_references`
--

LOCK TABLES `candidate_references` WRITE;
/*!40000 ALTER TABLE `candidate_references` DISABLE KEYS */;
/*!40000 ALTER TABLE `candidate_references` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidate_skills`
--

DROP TABLE IF EXISTS `candidate_skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidate_skills` (
  `id` int NOT NULL AUTO_INCREMENT,
  `candidateId` int NOT NULL,
  `skillName` varchar(150) NOT NULL,
  `skillLevel` enum('Beginner','Intermediate','Advanced','Expert') NOT NULL,
  `experienceYears` decimal(4,2) DEFAULT NULL,
  `provider` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `candidateId` (`candidateId`),
  CONSTRAINT `candidate_skills_ibfk_1` FOREIGN KEY (`candidateId`) REFERENCES `candidates` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate_skills`
--

LOCK TABLES `candidate_skills` WRITE;
/*!40000 ALTER TABLE `candidate_skills` DISABLE KEYS */;
/*!40000 ALTER TABLE `candidate_skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidate_software`
--

DROP TABLE IF EXISTS `candidate_software`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidate_software` (
  `id` int NOT NULL AUTO_INCREMENT,
  `candidateId` int NOT NULL,
  `toolName` varchar(150) NOT NULL,
  `proficiencyLevel` enum('Excellent','Good','Average') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `candidateId` (`candidateId`),
  CONSTRAINT `candidate_software_ibfk_1` FOREIGN KEY (`candidateId`) REFERENCES `candidates` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate_software`
--

LOCK TABLES `candidate_software` WRITE;
/*!40000 ALTER TABLE `candidate_software` DISABLE KEYS */;
/*!40000 ALTER TABLE `candidate_software` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidates`
--

DROP TABLE IF EXISTS `candidates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullName` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phoneNumber` varchar(20) NOT NULL,
  `dob` date DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `maritalStatus` enum('Single','Married','Divorced','Widowed') DEFAULT NULL,
  `currentAddress` varchar(255) DEFAULT NULL,
  `currentCity` varchar(100) DEFAULT NULL,
  `currentState` varchar(100) DEFAULT NULL,
  `currentPincode` varchar(20) DEFAULT NULL,
  `permanentAddress` varchar(255) DEFAULT NULL,
  `permanentCity` varchar(100) DEFAULT NULL,
  `permanentState` varchar(100) DEFAULT NULL,
  `permanentPincode` varchar(20) DEFAULT NULL,
  `portfolioLink` varchar(255) DEFAULT NULL,
  `resumeUrl` varchar(255) DEFAULT NULL,
  `appliedPosition` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `appliedPosition` (`appliedPosition`),
  CONSTRAINT `candidates_ibfk_1` FOREIGN KEY (`appliedPosition`) REFERENCES `openings` (`jobid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidates`
--

LOCK TABLES `candidates` WRITE;
/*!40000 ALTER TABLE `candidates` DISABLE KEYS */;
INSERT INTO `candidates` VALUES (1,'Dummy Candidate','dummy.1788188591484@example.com','9000000001','1995-01-15','Male','Single','1 Test Street','Bengaluru','Karnataka','560001',NULL,NULL,NULL,NULL,'https://example.com/portfolio',NULL,1,'2026-08-31 15:03:11','2026-08-31 15:03:11',NULL),(2,'Dummy Candidate','dummy.1788189652212@example.com','9000000001','1995-01-15','Male','Single','1 Test Street','Bengaluru','Karnataka','560001',NULL,NULL,NULL,NULL,'https://example.com/portfolio',NULL,1,'2026-08-31 15:20:52','2026-08-31 15:20:52',NULL),(3,'Dummy Candidate','dummy.1788189858404@example.com','9000000001','1995-01-15','Male','Single','1 Test Street','Bengaluru','Karnataka','560001',NULL,NULL,NULL,NULL,'https://example.com/portfolio',NULL,1,'2026-08-31 15:24:18','2026-08-31 15:24:18',NULL),(4,'Amber Fulton','fokikyheb@mailinator.com','+1 (922) 899-7924','1981-05-12','Male','Single','Delectus quo sunt , Non ullamco facilis ','Eiusmod lorem recusa','Quia et aut mollitia','Cupidatat est est r',NULL,NULL,NULL,NULL,'https://example.com/portfolio',NULL,1,'2026-08-31 15:24:33','2026-08-31 16:01:42',NULL),(5,'Dummy Candidate','dummy.1788189893249@example.com','9000000001','1995-01-15','Male','Single','1 Test Street','Bengaluru','Karnataka','560001',NULL,NULL,NULL,NULL,'https://example.com/portfolio',NULL,1,'2026-08-31 15:24:53','2026-08-31 15:24:53',NULL);
/*!40000 ALTER TABLE `candidates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cif_academics`
--

DROP TABLE IF EXISTS `cif_academics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cif_academics` (
  `academicid` int NOT NULL AUTO_INCREMENT,
  `cifid` int NOT NULL,
  `degree` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `university` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `graduationYear` int NOT NULL,
  `grade` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `city` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`academicid`),
  KEY `cifid` (`cifid`),
  CONSTRAINT `cif_academics_ibfk_1` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cif_academics`
--

LOCK TABLES `cif_academics` WRITE;
/*!40000 ALTER TABLE `cif_academics` DISABLE KEYS */;
INSERT INTO `cif_academics` VALUES (1,1,'B.E Computer Science','Anna University',2020,'A','Coimbatore','2026-08-12 05:11:51','2026-08-12 05:11:51',NULL),(2,2,'Explicabo Id a dele','Sed ex suscipit repr',2008,'Minus ex n','Qui nobis ullamco Na','2026-08-17 08:48:06','2026-08-17 08:48:06',NULL),(3,3,'Et libero cupidatat ','Porro vel voluptatib',1907,'Qui est de','Consequat Est minus','2026-08-18 04:51:10','2026-08-18 04:51:10',NULL),(4,4,'Ut impedit cupidita','Ut in consequatur l',2061,'Amet ut ev','Quas amet cum culpa','2026-08-29 06:39:16','2026-08-29 06:39:16',NULL),(5,5,'In rerum dolorem ut ','Exercitation quam se',1904,'Dolore nis','Sed delectus deseru','2026-08-29 12:23:05','2026-08-29 12:23:05',NULL),(6,6,'Aut aspernatur magni','Nesciunt repellendu',1988,'Voluptate ','Modi libero adipisic','2026-08-31 09:19:33','2026-08-31 09:19:33',NULL),(7,7,'dummy','http://localhost:5173/cif-form?jobid=1',2002,'http://loc','http://localhost:5173/cif-form?jobid=1','2026-08-31 09:55:38','2026-08-31 09:55:38',NULL),(8,8,'Aut voluptatibus nat','Placeat minim cum q',1979,'Mollitia s','Ipsam ab est est al','2026-08-31 10:13:47','2026-08-31 10:13:47',NULL);
/*!40000 ALTER TABLE `cif_academics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cif_experiences`
--

DROP TABLE IF EXISTS `cif_experiences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cif_experiences` (
  `eid` int NOT NULL AUTO_INCREMENT,
  `cifid` int NOT NULL,
  `companyName` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `location` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `role` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date DEFAULT NULL,
  `totalExperience` float NOT NULL,
  `reasonForLeaving` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`eid`),
  KEY `cifid` (`cifid`),
  CONSTRAINT `cif_experiences_ibfk_1` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cif_experiences`
--

LOCK TABLES `cif_experiences` WRITE;
/*!40000 ALTER TABLE `cif_experiences` DISABLE KEYS */;
INSERT INTO `cif_experiences` VALUES (1,1,'ABC Technologies','Coimbatore','Digital Marketing Executive','2022-01-10','2024-05-31',0,'Career growth','2026-08-12 05:11:59','2026-08-12 05:11:59',NULL),(2,2,'Laborum Sint aut er','Impedit tempore ma','Sed aspernatur delen','1975-07-14','1973-10-06',-1.77,NULL,'2026-08-17 08:48:06','2026-08-17 08:48:06',NULL),(3,3,'Non modi velit sit a','Omnis cillum vero ma','Sit numquam rem ea i','2002-05-17','1992-06-28',-9.88,NULL,'2026-08-18 04:51:10','2026-08-18 04:51:10',NULL),(4,1,'ABC Technologies','Coimbatore','Digital Marketing Executive','2022-01-10','2024-05-31',0,'Career growth','2026-08-26 12:07:51','2026-08-26 12:07:51',NULL),(5,4,'Reprehenderit conse','Mollitia tenetur exp','Elit ea aute tempor','2021-12-24','2022-08-12',0.63,NULL,'2026-08-29 06:39:16','2026-08-29 06:39:16',NULL),(6,5,'Proident explicabo','Quis ipsa dolor ea ','Non consequatur Nat','1973-05-13','1996-09-15',23.34,NULL,'2026-08-29 12:23:05','2026-08-29 12:23:05',NULL),(7,6,'Quisquam nulla exped','Consequatur hic dele','Fugiat amet esse p','1974-05-13','2007-02-22',32.78,NULL,'2026-08-31 09:19:33','2026-08-31 09:19:33',NULL),(8,7,'http://localhost:5173/cif-form?jobid=1','http://localhost:5173/cif-form?jobid=1','http://localhost:5173/cif-form?jobid=1','2026-08-20','2026-08-14',-0.02,NULL,'2026-08-31 09:55:38','2026-08-31 09:55:38',NULL),(9,8,'Alias sit alias del','Laborum Deserunt do','Nihil animi volupta','2015-12-19','1974-11-18',-41.08,NULL,'2026-08-31 10:13:47','2026-08-31 10:13:47',NULL);
/*!40000 ALTER TABLE `cif_experiences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cif_languages`
--

DROP TABLE IF EXISTS `cif_languages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cif_languages` (
  `languageid` int NOT NULL AUTO_INCREMENT,
  `cifid` int NOT NULL,
  `Speak` enum('basic','intermediate','fluent','native') COLLATE utf8mb4_general_ci NOT NULL,
  `Read` enum('basic','intermediate','fluent','native') COLLATE utf8mb4_general_ci NOT NULL,
  `Write` enum('basic','intermediate','fluent','native') COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`languageid`),
  KEY `cifid` (`cifid`),
  CONSTRAINT `cif_languages_ibfk_1` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cif_languages`
--

LOCK TABLES `cif_languages` WRITE;
/*!40000 ALTER TABLE `cif_languages` DISABLE KEYS */;
INSERT INTO `cif_languages` VALUES (1,1,'basic','basic','basic','2026-08-12 05:12:04','2026-08-12 05:12:04',NULL),(2,2,'basic','fluent','native','2026-08-17 08:48:06','2026-08-17 08:48:06',NULL),(3,3,'fluent','native','fluent','2026-08-18 04:51:10','2026-08-18 04:51:10',NULL),(4,1,'basic','basic','basic','2026-08-26 12:08:03','2026-08-26 12:08:03',NULL),(5,4,'basic','basic','native','2026-08-29 06:39:16','2026-08-29 06:39:16',NULL),(6,5,'basic','fluent','intermediate','2026-08-29 12:23:05','2026-08-29 12:23:05',NULL),(7,6,'basic','fluent','basic','2026-08-31 09:19:33','2026-08-31 09:19:33',NULL),(8,6,'intermediate','fluent','fluent','2026-08-31 09:19:33','2026-08-31 09:19:33',NULL),(9,6,'native','basic','fluent','2026-08-31 09:19:33','2026-08-31 09:19:33',NULL),(10,7,'intermediate','intermediate','basic','2026-08-31 09:55:38','2026-08-31 09:55:38',NULL),(11,8,'intermediate','fluent','fluent','2026-08-31 10:13:47','2026-08-31 10:13:47',NULL);
/*!40000 ALTER TABLE `cif_languages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cif_personals`
--

DROP TABLE IF EXISTS `cif_personals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cif_personals` (
  `cifid` int NOT NULL AUTO_INCREMENT,
  `fullName` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `phoneNumber` varchar(15) COLLATE utf8mb4_general_ci NOT NULL,
  `DOB` date NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `city` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `state` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `pinCode` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `gender` enum('Male','Female') COLLATE utf8mb4_general_ci NOT NULL,
  `maritalStatus` enum('Single','Married') COLLATE utf8mb4_general_ci NOT NULL,
  `portfolioLink` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `resume` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `appliedPosition` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`cifid`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `email_19` (`email`),
  UNIQUE KEY `email_20` (`email`),
  UNIQUE KEY `email_21` (`email`),
  UNIQUE KEY `email_22` (`email`),
  KEY `appliedPosition` (`appliedPosition`),
  CONSTRAINT `cif_personals_ibfk_1` FOREIGN KEY (`appliedPosition`) REFERENCES `openings` (`jobid`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cif_personals`
--

LOCK TABLES `cif_personals` WRITE;
/*!40000 ALTER TABLE `cif_personals` DISABLE KEYS */;
INSERT INTO `cif_personals` VALUES (1,'Ira Pennington','quju@mailinator.com','+1 (883) 675-24','1984-08-28','Quasi voluptate dese, Sed ut nobis quia vo','Voluptatem At nostr','Iure id hic aute con','Provident ','Male','Married','https://example.com','resume.pdf',1,'2026-08-12 05:10:41','2026-08-31 10:25:16',NULL),(2,'Shay Chan','riwuqowid@mailinator.com','+1 (895) 857-99','1996-10-17','Aut ut at facilis si','Quis sunt temporibus','Omnis est ipsam cor','Ut non con','Male','','https://www.cymalipasoguhyk.ca',NULL,1,'2026-08-17 08:48:06','2026-08-17 08:48:06',NULL),(3,'Dustin Little','rybaduhefi@mailinator.com','+1 (508) 749-18','2005-10-17','Ullamco do aut aliqu','In adipisicing conse','Autem est sapiente e','Culpa veri','Female','','https://www.wyfudaxyt.co',NULL,3,'2026-08-18 04:51:10','2026-08-18 04:51:10',NULL),(4,'Fatima Smith','vezaqabeq@mailinator.com','+1 (241) 756-87','1981-09-21','Quo est sed qui et h, Aut dignissimos quas','Mollitia mollitia si','Sed eiusmod aut culp','Ad tenetur','Male','Single','https://www.xewaqe.in',NULL,1,'2026-08-29 06:39:16','2026-08-31 10:25:00',NULL),(5,'Joel Shepard','dure@mailinator.com','+1 (531) 316-35','2009-08-14','Corrupti voluptas l','Commodi ut distincti','Natus pariatur Sit ','Praesentiu','Female','','https://www.secumogipom.ca',NULL,1,'2026-08-29 12:23:05','2026-08-29 12:23:05',NULL),(6,'Echo Lott','vasi@mailinator.com','+1 (473) 742-62','1980-05-12','In illo alias invent','Debitis sed eveniet','Vitae omnis ullamco ','Deleniti q','Female','','https://www.pizudusevu.info',NULL,3,'2026-08-31 09:19:33','2026-08-31 09:19:33',NULL),(7,'abi a','geethaa199712@gmail.com','+916374503801','1980-05-12','kho social','cbe','Tamil Nadu','637450','Female','Single','https://www.rurocasom.org.uk',NULL,1,'2026-08-31 09:55:38','2026-08-31 09:55:38',NULL),(8,'Timothy Craft','qodytina@mailinator.com','+1 (647) 252-95','2016-11-20','Dolores consequat E','Recusandae Ullamco ','Nobis odit quisquam ','Doloribus ','Female','','https://www.xeberazotypuxuw.us','1788171227430-424839890.pdf',3,'2026-08-31 10:13:47','2026-08-31 10:13:47',NULL);
/*!40000 ALTER TABLE `cif_personals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cif_references`
--

DROP TABLE IF EXISTS `cif_references`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cif_references` (
  `referenceid` int NOT NULL AUTO_INCREMENT,
  `cifid` int NOT NULL,
  `referenceName` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `referenceEmail` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `referencePhone` varchar(15) COLLATE utf8mb4_general_ci NOT NULL,
  `consentConfirmed` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`referenceid`),
  KEY `cifid` (`cifid`),
  CONSTRAINT `cif_references_ibfk_1` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cif_references`
--

LOCK TABLES `cif_references` WRITE;
/*!40000 ALTER TABLE `cif_references` DISABLE KEYS */;
INSERT INTO `cif_references` VALUES (3,3,'Commodi praesentium ','fekoc@mailinator.com','+1 (912) 209-62',1,'2026-08-18 04:51:10','2026-08-18 04:51:10',NULL),(4,1,'Raj Kumar','raj@example.com','9876543210',1,'2026-08-26 12:08:09','2026-08-26 12:08:09',NULL),(5,4,'Laborum Quia qui ul','dene@mailinator.com','+1 (416) 719-43',1,'2026-08-29 06:39:16','2026-08-29 06:39:16',NULL),(6,5,'Labore pariatur Lib','caxikuh@mailinator.com','+1 (786) 269-30',1,'2026-08-29 12:23:05','2026-08-29 12:23:05',NULL),(7,6,'Deleniti et omnis es','qedy@mailinator.com','+1 (793) 594-92',1,'2026-08-31 09:19:33','2026-08-31 09:19:33',NULL),(8,8,'Excepturi et maxime ','jitin@mailinator.com','+1 (671) 277-38',1,'2026-08-31 10:13:47','2026-08-31 10:13:47',NULL);
/*!40000 ALTER TABLE `cif_references` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cif_skills`
--

DROP TABLE IF EXISTS `cif_skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cif_skills` (
  `skillid` int NOT NULL AUTO_INCREMENT,
  `cifid` int NOT NULL,
  `skillName` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `skillLevel` enum('Beginner','Intermediate','Advanced','Expert') COLLATE utf8mb4_general_ci NOT NULL,
  `year` datetime NOT NULL,
  `provider` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`skillid`),
  KEY `cifid` (`cifid`),
  CONSTRAINT `cif_skills_ibfk_1` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cif_skills`
--

LOCK TABLES `cif_skills` WRITE;
/*!40000 ALTER TABLE `cif_skills` DISABLE KEYS */;
INSERT INTO `cif_skills` VALUES (1,1,'Google Ads','Advanced','2024-01-01 00:00:00','Google','2026-08-12 05:11:46','2026-08-12 05:11:46',NULL),(2,2,'Est assumenda incidu','Advanced','2000-12-31 18:30:00','Maxime a doloribus v','2026-08-17 08:48:06','2026-08-17 08:48:06',NULL),(3,3,'Ullam et qui aliquam','Beginner','2000-12-31 18:30:00','Nulla perspiciatis ','2026-08-18 04:51:10','2026-08-18 04:51:10',NULL),(4,4,'Eveniet accusantium','Intermediate','2000-12-31 18:30:00','Adipisicing qui dict','2026-08-29 06:39:16','2026-08-29 06:39:16',NULL),(5,5,'Labore facere quis v','Advanced','2000-12-31 18:30:00','Ullamco reiciendis m','2026-08-29 12:23:05','2026-08-29 12:23:05',NULL),(6,6,'Non ut porro aut lau','Advanced','2000-12-31 18:30:00','Aut laboris ducimus','2026-08-31 09:19:33','2026-08-31 09:19:33',NULL),(7,6,'Eos alias odio aut ','Advanced','2000-12-31 18:30:00','Laborum Quia pariat','2026-08-31 09:19:33','2026-08-31 09:19:33',NULL),(8,7,'http://localhost:5173/cif-form?jobid=1','Advanced','2000-12-31 18:30:00','http://localhost:5173/cif-form?jobid=1','2026-08-31 09:55:38','2026-08-31 09:55:38',NULL),(9,8,'Tenetur cillum tempo','Intermediate','2000-12-31 18:30:00','Est dolorem sed qui ','2026-08-31 10:13:47','2026-08-31 10:13:47',NULL);
/*!40000 ALTER TABLE `cif_skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cif_softwares`
--

DROP TABLE IF EXISTS `cif_softwares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cif_softwares` (
  `softwareid` int NOT NULL AUTO_INCREMENT,
  `cifid` int NOT NULL,
  `tools` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `levels` enum('Excellent','Good','Average') COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`softwareid`),
  KEY `cifid` (`cifid`),
  CONSTRAINT `cif_softwares_ibfk_1` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cif_softwares`
--

LOCK TABLES `cif_softwares` WRITE;
/*!40000 ALTER TABLE `cif_softwares` DISABLE KEYS */;
INSERT INTO `cif_softwares` VALUES (1,1,'Google Analytics','','2026-08-12 05:11:41','2026-08-12 05:11:41',NULL),(2,2,'Aut enim quas impedi','Good','2026-08-17 08:48:06','2026-08-17 08:48:06',NULL),(3,3,'In esse ','Excellent','2026-08-18 04:51:10','2026-08-18 04:51:10',NULL),(4,3,'voluptatibu','Good','2026-08-18 04:51:10','2026-08-18 04:51:10',NULL),(5,1,'Google Analytics','','2026-08-26 12:08:18','2026-08-26 12:08:18',NULL),(6,4,'Ut velit soluta sed ','Good','2026-08-29 06:39:16','2026-08-29 06:39:16',NULL),(7,5,'Laudantium elit as','Excellent','2026-08-29 12:23:05','2026-08-29 12:23:05',NULL),(8,6,'Non dolorem laboris ','Good','2026-08-31 09:19:33','2026-08-31 09:19:33',NULL),(9,6,'In vero vel hic do a','Good','2026-08-31 09:19:33','2026-08-31 09:19:33',NULL),(10,7,'http://localhost:5173/cif-form?jobid=1','Average','2026-08-31 09:55:38','2026-08-31 09:55:38',NULL),(11,8,'Laborum Excepteur v','Good','2026-08-31 10:13:47','2026-08-31 10:13:47',NULL);
/*!40000 ALTER TABLE `cif_softwares` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cif_submissions`
--

DROP TABLE IF EXISTS `cif_submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cif_submissions` (
  `cifappid` int NOT NULL AUTO_INCREMENT,
  `cifid` int NOT NULL,
  `appliedStatus` enum('Shortlist','Reject','Pending') COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`cifappid`),
  KEY `cifid` (`cifid`),
  CONSTRAINT `cif_submissions_ibfk_1` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cif_submissions`
--

LOCK TABLES `cif_submissions` WRITE;
/*!40000 ALTER TABLE `cif_submissions` DISABLE KEYS */;
INSERT INTO `cif_submissions` VALUES (1,2,'Reject','2026-08-19 07:53:29','2026-08-19 07:53:29',NULL),(2,3,'Reject','2026-08-19 07:53:35','2026-08-29 06:38:23',NULL),(3,1,'Shortlist','2026-08-26 04:07:57','2026-08-26 04:07:57',NULL),(4,4,'Shortlist','2026-08-29 06:39:16','2026-08-29 06:40:14',NULL),(5,5,'Shortlist','2026-08-29 12:23:05','2026-08-29 12:23:21',NULL),(6,6,'Shortlist','2026-08-31 09:19:33','2026-08-31 09:19:38',NULL),(7,7,'Pending','2026-08-31 09:55:38','2026-08-31 09:55:38',NULL),(8,8,'Pending','2026-08-31 10:13:47','2026-08-31 10:13:47',NULL);
/*!40000 ALTER TABLE `cif_submissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `name_2` (`name`),
  UNIQUE KEY `name_3` (`name`),
  UNIQUE KEY `name_4` (`name`),
  UNIQUE KEY `name_5` (`name`),
  UNIQUE KEY `name_6` (`name`),
  UNIQUE KEY `name_7` (`name`),
  UNIQUE KEY `name_8` (`name`),
  UNIQUE KEY `name_9` (`name`),
  UNIQUE KEY `name_10` (`name`),
  UNIQUE KEY `name_11` (`name`),
  UNIQUE KEY `name_12` (`name`),
  UNIQUE KEY `name_13` (`name`),
  UNIQUE KEY `name_14` (`name`),
  UNIQUE KEY `name_15` (`name`),
  UNIQUE KEY `name_16` (`name`),
  UNIQUE KEY `name_17` (`name`),
  UNIQUE KEY `name_18` (`name`),
  UNIQUE KEY `name_19` (`name`),
  UNIQUE KEY `name_20` (`name`),
  UNIQUE KEY `name_21` (`name`),
  UNIQUE KEY `name_22` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'Operations',1,'2026-08-12 05:10:08','2026-08-12 05:10:08',NULL),(2,'Content',1,'2026-08-13 07:46:47','2026-08-13 09:57:10',NULL),(3,'designer',1,'2026-08-13 07:47:42','2026-08-13 07:48:18','2026-08-13 07:48:18'),(9,'dd',1,'2026-08-13 07:55:41','2026-08-13 07:56:48','2026-08-13 07:56:48'),(34,'Geetha',1,'2026-08-13 09:26:07','2026-08-13 09:47:45','2026-08-13 09:47:45'),(40,'Digital Marketing',1,'2026-08-13 10:01:45','2026-08-13 10:01:57',NULL),(41,'Web development',1,'2026-08-14 04:32:44','2026-08-14 04:32:44',NULL),(42,'Media',1,'2026-08-14 04:35:35','2026-08-14 04:35:35',NULL),(43,'Designs',1,'2026-08-14 04:37:47','2026-08-14 04:37:47',NULL);
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employeeCode` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `jobPosition` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `fullName` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `dateOfBirth` date DEFAULT NULL,
  `city` varchar(120) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pinCode` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `gender` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `portfolioLink` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `resumeOriginalName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `resumeStoredName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `resumeMimeType` varchar(120) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `resumeSize` int DEFAULT NULL,
  `education` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `workExperience` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `skills` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `softwareTools` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `languages` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `references` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `consent` tinyint(1) NOT NULL DEFAULT '0',
  `status` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Onboarding',
  `createdBy` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employeeCode` (`employeeCode`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `employeeCode_2` (`employeeCode`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `employeeCode_3` (`employeeCode`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `employeeCode_4` (`employeeCode`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `employeeCode_5` (`employeeCode`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `employeeCode_6` (`employeeCode`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `employeeCode_7` (`employeeCode`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `employeeCode_8` (`employeeCode`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `employeeCode_9` (`employeeCode`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `employeeCode_10` (`employeeCode`),
  UNIQUE KEY `email_10` (`email`),
  KEY `createdBy` (`createdBy`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `employees_chk_1` CHECK (json_valid(`education`)),
  CONSTRAINT `employees_chk_2` CHECK (json_valid(`workExperience`)),
  CONSTRAINT `employees_chk_3` CHECK (json_valid(`skills`)),
  CONSTRAINT `employees_chk_4` CHECK (json_valid(`softwareTools`)),
  CONSTRAINT `employees_chk_5` CHECK (json_valid(`languages`)),
  CONSTRAINT `employees_chk_6` CHECK (json_valid(`references`))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'KHO-0001','Omnis laudantium au','Ira Pennington','xetodoceh@mailinator.com','+1 (971) 323-2317','1984-08-28','Voluptatem At nostr','Provident et nostru','Male',NULL,NULL,NULL,NULL,NULL,'[{\"qualification\":\"Qui ex veniam sunt\",\"institution\":\"Vero impedit eum en\",\"board\":\"Ipsum ea dolor volu\",\"year\":\"Aliquip et ut evenie\",\"percentage\":\"Omnis unde cumque qu\"}]','[{\"company\":\"Est aut iste magni o\",\"designation\":\"Esse est sed tempor\",\"startDate\":\"1982-12-05\",\"endDate\":\"2002-08-15\",\"totalExp\":\"Duis voluptas et nih\",\"reason\":\"Sint porro doloremqu\"}]','[{\"skillid\":1,\"cifid\":1,\"skillName\":\"Google Ads\",\"skillLevel\":\"Advanced\",\"year\":\"2024-01-01T00:00:00.000Z\",\"provider\":\"Google\",\"createdAt\":\"2026-08-12T05:11:46.000Z\",\"updatedAt\":\"2026-08-12T05:11:46.000Z\",\"deletedAt\":null}]','[{\"softwareid\":1,\"cifid\":1,\"tools\":\"Google Analytics\",\"levels\":\"\",\"createdAt\":\"2026-08-12T05:11:41.000Z\",\"updatedAt\":\"2026-08-12T05:11:41.000Z\",\"deletedAt\":null},{\"softwareid\":5,\"cifid\":1,\"tools\":\"Google Analytics\",\"levels\":\"\",\"createdAt\":\"2026-08-26T12:08:18.000Z\",\"updatedAt\":\"2026-08-26T12:08:18.000Z\",\"deletedAt\":null}]','[{\"languageid\":1,\"cifid\":1,\"Speak\":\"basic\",\"Read\":\"basic\",\"Write\":\"basic\",\"createdAt\":\"2026-08-12T05:12:04.000Z\",\"updatedAt\":\"2026-08-12T05:12:04.000Z\",\"deletedAt\":null},{\"languageid\":4,\"cifid\":1,\"Speak\":\"basic\",\"Read\":\"basic\",\"Write\":\"basic\",\"createdAt\":\"2026-08-26T12:08:03.000Z\",\"updatedAt\":\"2026-08-26T12:08:03.000Z\",\"deletedAt\":null}]','[{\"referenceid\":4,\"cifid\":1,\"referenceName\":\"Raj Kumar\",\"referenceEmail\":\"raj@example.com\",\"referencePhone\":\"9876543210\",\"consentConfirmed\":true,\"createdAt\":\"2026-08-26T12:08:09.000Z\",\"updatedAt\":\"2026-08-26T12:08:09.000Z\",\"deletedAt\":null}]',1,'Active',NULL,'2026-08-29 07:37:05','2026-08-31 10:25:16',NULL),(4,'KHO-0002','Temporibus et ipsum','Amber Fulton','final.auto.code.4@example.com','+1 (553) 767-2427','1981-05-12','Eiusmod lorem recusa','Cupidatat est est r','Male',NULL,NULL,NULL,NULL,NULL,'[{\"qualification\":\"Est sit incidunt\",\"institution\":\"Officia elit ut eu\",\"board\":\"Quia vel similique c\",\"year\":\"Enim cupidatat enim\",\"percentage\":\"Aliquam molestiae in\"}]','[{\"company\":\"Quo cupiditate sed e\",\"designation\":\"Tempor dolorum labor\",\"startDate\":\"2002-01-15\",\"endDate\":\"1979-10-17\",\"totalExp\":\"Numquam ad mollitia\",\"reason\":\"Rerum quo quo tempor\"}]','[]','[]','[]','[]',1,'Active',NULL,'2026-08-31 16:12:30','2026-08-31 16:16:04',NULL);
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inductions`
--

DROP TABLE IF EXISTS `inductions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inductions` (
  `iid` int NOT NULL AUTO_INCREMENT,
  `cifid` int NOT NULL,
  `onboardinginfoid` int NOT NULL,
  `companyIntroduction` tinyint(1) NOT NULL DEFAULT '0',
  `hrPolicies` tinyint(1) NOT NULL DEFAULT '0',
  `attendanceRules` tinyint(1) NOT NULL DEFAULT '0',
  `leavePolicy` tinyint(1) NOT NULL DEFAULT '0',
  `securityGuidelines` tinyint(1) NOT NULL DEFAULT '0',
  `teamIntroduction` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`iid`),
  KEY `cifid` (`cifid`),
  KEY `onboardinginfoid` (`onboardinginfoid`),
  CONSTRAINT `inductions_ibfk_17` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`),
  CONSTRAINT `inductions_ibfk_18` FOREIGN KEY (`onboardinginfoid`) REFERENCES `onboard_info` (`onboardinginfoid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inductions`
--

LOCK TABLES `inductions` WRITE;
/*!40000 ALTER TABLE `inductions` DISABLE KEYS */;
INSERT INTO `inductions` VALUES (1,4,1,1,1,1,1,1,1,'2026-08-29 07:23:12','2026-08-29 07:27:48',NULL),(2,1,2,0,0,0,0,0,0,'2026-08-29 07:37:52','2026-08-31 15:51:00',NULL);
/*!40000 ALTER TABLE `inductions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_applications`
--

DROP TABLE IF EXISTS `job_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `candidateId` int NOT NULL,
  `openingId` int DEFAULT NULL,
  `status` enum('APPLIED','SHORTLISTED','INTERVIEW','REJECTED','OFFERED','JOINED') NOT NULL DEFAULT 'APPLIED',
  `source` varchar(100) DEFAULT NULL,
  `notes` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `candidateId` (`candidateId`),
  KEY `openingId` (`openingId`),
  CONSTRAINT `job_applications_ibfk_1` FOREIGN KEY (`candidateId`) REFERENCES `candidates` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `job_applications_ibfk_2` FOREIGN KEY (`openingId`) REFERENCES `openings` (`jobid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_applications`
--

LOCK TABLES `job_applications` WRITE;
/*!40000 ALTER TABLE `job_applications` DISABLE KEYS */;
INSERT INTO `job_applications` VALUES (1,1,1,'APPLIED','manual-test','Dummy flow validation','2026-08-31 15:03:11','2026-08-31 15:03:11',NULL),(2,2,1,'APPLIED','manual-test','Dummy flow validation','2026-08-31 15:20:52','2026-08-31 15:20:52',NULL),(3,3,1,'APPLIED','manual-test','Dummy flow validation','2026-08-31 15:24:18','2026-08-31 15:24:18',NULL),(4,4,1,'APPLIED','manual-test','Dummy flow validation','2026-08-31 15:24:33','2026-08-31 15:24:33',NULL),(5,5,1,'APPLIED','manual-test','Dummy flow validation','2026-08-31 15:24:53','2026-08-31 15:24:53',NULL);
/*!40000 ALTER TABLE `job_applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lead_history`
--

DROP TABLE IF EXISTS `lead_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lead_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `leadId` int NOT NULL,
  `oldStatusId` int DEFAULT NULL,
  `newStatusId` int DEFAULT NULL,
  `notes` text COLLATE utf8mb4_general_ci,
  `changedBy` int NOT NULL,
  `createdAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `leadId` (`leadId`),
  KEY `changedBy` (`changedBy`),
  CONSTRAINT `lead_history_ibfk_43` FOREIGN KEY (`leadId`) REFERENCES `leads` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `lead_history_ibfk_44` FOREIGN KEY (`changedBy`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lead_history`
--

LOCK TABLES `lead_history` WRITE;
/*!40000 ALTER TABLE `lead_history` DISABLE KEYS */;
INSERT INTO `lead_history` VALUES (1,2,NULL,NULL,'Lead Created',1,'2026-08-12 05:29:48'),(2,2,2,2,'Lead Updated',1,'2026-08-12 06:30:04'),(3,3,NULL,NULL,'Lead Created',1,'2026-08-12 10:42:38'),(4,3,3,3,'Lead Updated',1,'2026-08-13 07:00:05'),(5,3,4,4,'Lead Updated',1,'2026-08-13 07:00:13'),(6,3,5,5,'Lead Updated',1,'2026-08-13 07:00:18'),(7,3,5,5,'Lead Updated',1,'2026-08-13 07:00:37'),(8,3,6,6,'Lead Updated',1,'2026-08-13 07:00:43'),(9,3,7,7,'Lead Updated',1,'2026-08-13 07:00:50'),(10,3,6,6,'Lead Updated',1,'2026-08-13 07:01:00'),(11,2,2,2,'Lead Updated',1,'2026-08-13 08:56:39'),(12,2,2,2,'Lead Updated',1,'2026-08-17 04:16:07'),(13,3,6,6,'Lead Updated',1,'2026-08-28 06:37:36'),(14,3,7,7,'Lead Updated',1,'2026-08-28 06:37:50'),(15,4,NULL,NULL,'Lead Created',1,'2026-08-29 04:21:39'),(16,2,2,2,'Lead Updated',1,'2026-08-29 04:22:00');
/*!40000 ALTER TABLE `lead_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lead_priorities`
--

DROP TABLE IF EXISTS `lead_priorities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lead_priorities` (
  `COL 1` varchar(2) DEFAULT NULL,
  `COL 2` varchar(4) DEFAULT NULL,
  `COL 3` varchar(4) DEFAULT NULL,
  `COL 4` varchar(5) DEFAULT NULL,
  `COL 5` varchar(11) DEFAULT NULL,
  `COL 6` varchar(8) DEFAULT NULL,
  `COL 7` varchar(9) DEFAULT NULL,
  `COL 8` varchar(9) DEFAULT NULL,
  `COL 9` varchar(9) DEFAULT NULL,
  `COL 10` varchar(9) DEFAULT NULL,
  `COL 11` varchar(9) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lead_priorities`
--

LOCK TABLES `lead_priorities` WRITE;
/*!40000 ALTER TABLE `lead_priorities` DISABLE KEYS */;
INSERT INTO `lead_priorities` VALUES ('id','name','code','color','description','isActive','createdBy','updatedBy','createdAt','updatedAt','deletedAt');
/*!40000 ALTER TABLE `lead_priorities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lead_services`
--

DROP TABLE IF EXISTS `lead_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lead_services` (
  `leadId` int NOT NULL,
  `serviceId` int NOT NULL,
  PRIMARY KEY (`leadId`,`serviceId`),
  UNIQUE KEY `lead_services_serviceId_leadId_unique` (`leadId`,`serviceId`),
  KEY `serviceId` (`serviceId`),
  CONSTRAINT `lead_services_ibfk_1` FOREIGN KEY (`leadId`) REFERENCES `leads` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `lead_services_ibfk_2` FOREIGN KEY (`serviceId`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lead_services`
--

LOCK TABLES `lead_services` WRITE;
/*!40000 ALTER TABLE `lead_services` DISABLE KEYS */;
INSERT INTO `lead_services` VALUES (2,1),(3,1),(4,1),(2,2),(4,2),(3,6),(4,7),(4,8);
/*!40000 ALTER TABLE `lead_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lead_sources`
--

DROP TABLE IF EXISTS `lead_sources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lead_sources` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `code` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `displayOrder` int DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `name_2` (`name`),
  UNIQUE KEY `code_2` (`code`),
  UNIQUE KEY `name_3` (`name`),
  UNIQUE KEY `code_3` (`code`),
  UNIQUE KEY `name_4` (`name`),
  UNIQUE KEY `code_4` (`code`),
  UNIQUE KEY `name_5` (`name`),
  UNIQUE KEY `code_5` (`code`),
  UNIQUE KEY `name_6` (`name`),
  UNIQUE KEY `code_6` (`code`),
  UNIQUE KEY `name_7` (`name`),
  UNIQUE KEY `code_7` (`code`),
  UNIQUE KEY `name_8` (`name`),
  UNIQUE KEY `code_8` (`code`),
  UNIQUE KEY `name_9` (`name`),
  UNIQUE KEY `code_9` (`code`),
  UNIQUE KEY `name_10` (`name`),
  UNIQUE KEY `code_10` (`code`),
  UNIQUE KEY `name_11` (`name`),
  UNIQUE KEY `code_11` (`code`),
  UNIQUE KEY `name_12` (`name`),
  UNIQUE KEY `code_12` (`code`),
  UNIQUE KEY `name_13` (`name`),
  UNIQUE KEY `code_13` (`code`),
  UNIQUE KEY `name_14` (`name`),
  UNIQUE KEY `code_14` (`code`),
  UNIQUE KEY `name_15` (`name`),
  UNIQUE KEY `code_15` (`code`),
  UNIQUE KEY `name_16` (`name`),
  UNIQUE KEY `code_16` (`code`),
  UNIQUE KEY `name_17` (`name`),
  UNIQUE KEY `code_17` (`code`),
  UNIQUE KEY `name_18` (`name`),
  UNIQUE KEY `code_18` (`code`),
  UNIQUE KEY `name_19` (`name`),
  UNIQUE KEY `code_19` (`code`),
  UNIQUE KEY `name_20` (`name`),
  UNIQUE KEY `code_20` (`code`),
  UNIQUE KEY `name_21` (`name`),
  UNIQUE KEY `code_21` (`code`),
  UNIQUE KEY `name_22` (`name`),
  UNIQUE KEY `code_22` (`code`),
  UNIQUE KEY `name_23` (`name`),
  UNIQUE KEY `code_23` (`code`),
  UNIQUE KEY `name_24` (`name`),
  UNIQUE KEY `code_24` (`code`),
  UNIQUE KEY `name_25` (`name`),
  UNIQUE KEY `code_25` (`code`),
  UNIQUE KEY `name_26` (`name`),
  UNIQUE KEY `code_26` (`code`),
  UNIQUE KEY `name_27` (`name`),
  UNIQUE KEY `code_27` (`code`),
  UNIQUE KEY `name_28` (`name`),
  UNIQUE KEY `code_28` (`code`),
  UNIQUE KEY `name_29` (`name`),
  UNIQUE KEY `code_29` (`code`),
  UNIQUE KEY `name_30` (`name`),
  UNIQUE KEY `code_30` (`code`),
  UNIQUE KEY `name_31` (`name`),
  UNIQUE KEY `code_31` (`code`),
  UNIQUE KEY `name_32` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lead_sources`
--

LOCK TABLES `lead_sources` WRITE;
/*!40000 ALTER TABLE `lead_sources` DISABLE KEYS */;
INSERT INTO `lead_sources` VALUES (1,'Email Campaign','EMAIL_CAMPAIGN','Lead generated from Email Campaign.',1,2,'2026-08-12 05:09:23','2026-08-13 07:03:41',NULL),(2,'Whatsapp','WHATSAPP','',1,1,'2026-08-13 07:03:14','2026-08-13 07:03:14',NULL),(3,'Instagram','INSTA','',1,3,'2026-08-13 07:03:56','2026-08-13 07:04:58',NULL),(4,'Facebook','FB','',1,4,'2026-08-13 07:04:48','2026-08-13 07:05:06',NULL),(5,'LinkedIn','LINKEDIN','',1,5,'2026-08-13 07:06:19','2026-08-13 07:06:19',NULL);
/*!40000 ALTER TABLE `lead_sources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lead_statuses`
--

DROP TABLE IF EXISTS `lead_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lead_statuses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `code` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `color` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `isDefault` tinyint(1) DEFAULT '0',
  `isClosed` tinyint(1) DEFAULT '0',
  `displayOrder` int DEFAULT '1',
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `name_2` (`name`),
  UNIQUE KEY `code_2` (`code`),
  UNIQUE KEY `name_3` (`name`),
  UNIQUE KEY `code_3` (`code`),
  UNIQUE KEY `name_4` (`name`),
  UNIQUE KEY `code_4` (`code`),
  UNIQUE KEY `name_5` (`name`),
  UNIQUE KEY `code_5` (`code`),
  UNIQUE KEY `name_6` (`name`),
  UNIQUE KEY `code_6` (`code`),
  UNIQUE KEY `name_7` (`name`),
  UNIQUE KEY `code_7` (`code`),
  UNIQUE KEY `name_8` (`name`),
  UNIQUE KEY `code_8` (`code`),
  UNIQUE KEY `name_9` (`name`),
  UNIQUE KEY `code_9` (`code`),
  UNIQUE KEY `name_10` (`name`),
  UNIQUE KEY `code_10` (`code`),
  UNIQUE KEY `name_11` (`name`),
  UNIQUE KEY `code_11` (`code`),
  UNIQUE KEY `name_12` (`name`),
  UNIQUE KEY `code_12` (`code`),
  UNIQUE KEY `name_13` (`name`),
  UNIQUE KEY `code_13` (`code`),
  UNIQUE KEY `name_14` (`name`),
  UNIQUE KEY `code_14` (`code`),
  UNIQUE KEY `name_15` (`name`),
  UNIQUE KEY `code_15` (`code`),
  UNIQUE KEY `name_16` (`name`),
  UNIQUE KEY `code_16` (`code`),
  UNIQUE KEY `name_17` (`name`),
  UNIQUE KEY `code_17` (`code`),
  UNIQUE KEY `name_18` (`name`),
  UNIQUE KEY `code_18` (`code`),
  UNIQUE KEY `name_19` (`name`),
  UNIQUE KEY `code_19` (`code`),
  UNIQUE KEY `name_20` (`name`),
  UNIQUE KEY `code_20` (`code`),
  UNIQUE KEY `name_21` (`name`),
  UNIQUE KEY `code_21` (`code`),
  UNIQUE KEY `name_22` (`name`),
  UNIQUE KEY `code_22` (`code`),
  UNIQUE KEY `name_23` (`name`),
  UNIQUE KEY `code_23` (`code`),
  UNIQUE KEY `name_24` (`name`),
  UNIQUE KEY `code_24` (`code`),
  UNIQUE KEY `name_25` (`name`),
  UNIQUE KEY `code_25` (`code`),
  UNIQUE KEY `name_26` (`name`),
  UNIQUE KEY `code_26` (`code`),
  UNIQUE KEY `name_27` (`name`),
  UNIQUE KEY `code_27` (`code`),
  UNIQUE KEY `name_28` (`name`),
  UNIQUE KEY `code_28` (`code`),
  UNIQUE KEY `name_29` (`name`),
  UNIQUE KEY `code_29` (`code`),
  UNIQUE KEY `name_30` (`name`),
  UNIQUE KEY `code_30` (`code`),
  UNIQUE KEY `name_31` (`name`),
  UNIQUE KEY `code_31` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lead_statuses`
--

LOCK TABLES `lead_statuses` WRITE;
/*!40000 ALTER TABLE `lead_statuses` DISABLE KEYS */;
INSERT INTO `lead_statuses` VALUES (1,'On Hold','ON_HOLD','#9e9e9e','Lead is temporarily on hold and will be revisited later.',0,0,7,1,'2026-08-12 05:09:30','2026-08-13 06:59:01',NULL),(2,'New','NEW','#2563EB','A new lead awaiting initial contact.',1,0,1,1,'2026-08-12 06:29:01','2026-08-12 06:29:01',NULL),(3,'Contacted','CONTACTED','#eb9824',' Initial contact has been made with the lead.',0,0,2,1,'2026-08-13 06:55:28','2026-08-13 06:55:28',NULL),(4,'Discussion','DISCUSSION','#eb248e','',0,0,3,1,'2026-08-13 06:57:10','2026-08-13 06:57:10',NULL),(5,'Proposal','PROPOSAL','#9124eb','A quotation or proposal has been shared with the lead.',0,0,4,1,'2026-08-13 06:57:32','2026-08-13 06:57:42',NULL),(6,'Negotiation','NEGOTIATION','#eb5524','',0,0,1,1,'2026-08-13 06:58:41','2026-08-13 07:01:21',NULL),(7,'Converted','CONVERTED','#24eb94','',0,0,6,1,'2026-08-13 06:59:36','2026-08-13 07:01:31',NULL);
/*!40000 ALTER TABLE `lead_statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leads`
--

DROP TABLE IF EXISTS `leads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leads` (
  `id` int NOT NULL AUTO_INCREMENT,
  `companyName` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `contactPerson` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `requirement` text COLLATE utf8mb4_general_ci,
  `budget` decimal(12,2) DEFAULT NULL,
  `leadSourceId` int NOT NULL,
  `leadStatusId` int NOT NULL,
  `assignedTo` int DEFAULT NULL,
  `referralName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_general_ci,
  `nextFollowupDate` date DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `leadSourceId` (`leadSourceId`),
  KEY `leadStatusId` (`leadStatusId`),
  KEY `assignedTo` (`assignedTo`),
  CONSTRAINT `leads_ibfk_83` FOREIGN KEY (`leadSourceId`) REFERENCES `lead_sources` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `leads_ibfk_84` FOREIGN KEY (`leadStatusId`) REFERENCES `lead_statuses` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `leads_ibfk_85` FOREIGN KEY (`assignedTo`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leads`
--

LOCK TABLES `leads` WRITE;
/*!40000 ALTER TABLE `leads` DISABLE KEYS */;
INSERT INTO `leads` VALUES (2,'Morris Flowers Plc','Consectetur eius vol','9638520741','dohibomode@mailinator.com','Enim ea atque sed la',12000.00,3,2,1,NULL,'Minus ut ad consequat Corporis consequuntur alias quos proident do sed accusamus dolor libero consectetur distinctio Rerum','2026-08-20',1,'2026-08-12 05:29:48','2026-08-29 04:22:00',NULL),(3,'Gibson Crawford Associates','Veniam quibusdam mo','9876543210','deba@mailinator.com','Incididunt fuga Et ',82000.00,1,7,1,NULL,'Vel dolor non error modi odio expedita excepturi et','2026-08-17',1,'2026-08-12 10:42:38','2026-08-28 06:37:49',NULL),(4,'Sampson Byrd Traders','Maxime veritatis ame','9638520741','huxamoxezi@mailinator.com','Ad eiusmod ipsum qui',50000.00,5,1,1,NULL,'Voluptatum nemo et duis inventore earum obcaecati anim sint quos sapiente qui vel','2022-07-01',1,'2026-08-29 04:21:39','2026-08-29 04:21:39',NULL);
/*!40000 ALTER TABLE `leads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_categories`
--

DROP TABLE IF EXISTS `leave_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(80) NOT NULL,
  `name` varchar(120) NOT NULL,
  `unit` enum('DAY','HOUR') NOT NULL DEFAULT 'DAY',
  `allocatedValue` decimal(8,2) NOT NULL DEFAULT '0.00',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_categories`
--

LOCK TABLES `leave_categories` WRITE;
/*!40000 ALTER TABLE `leave_categories` DISABLE KEYS */;
INSERT INTO `leave_categories` VALUES (1,'CASUAL_LEAVE','Casual Leave','DAY',12.00,1,'2026-08-31 17:21:34','2026-08-31 17:21:34',NULL),(2,'LEAVE_WITHOUT_PAY','Leave Without Pay','DAY',12.00,1,'2026-08-31 17:21:34','2026-08-31 17:21:34',NULL),(3,'PERMISSION','Permission','HOUR',16.00,1,'2026-08-31 17:21:34','2026-08-31 17:21:34',NULL),(4,'ON_THE_DUTY','On The Duty','DAY',0.00,1,'2026-08-31 17:21:34','2026-08-31 17:21:34',NULL);
/*!40000 ALTER TABLE `leave_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_requests`
--

DROP TABLE IF EXISTS `leave_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `employeeCode` varchar(40) DEFAULT NULL,
  `employeeName` varchar(255) DEFAULT NULL,
  `categoryId` int NOT NULL,
  `fromDate` date NOT NULL,
  `toDate` date NOT NULL,
  `durationType` enum('FULL_DAY','HALF_DAY','QUARTER_DAY','HOURS') NOT NULL DEFAULT 'FULL_DAY',
  `session` enum('MORNING','NOON') DEFAULT NULL,
  `quarterSlot` int DEFAULT NULL,
  `startTime` varchar(5) DEFAULT NULL,
  `endTime` varchar(5) DEFAULT NULL,
  `requestedDays` decimal(8,2) NOT NULL DEFAULT '0.00',
  `requestedHours` decimal(8,2) NOT NULL DEFAULT '0.00',
  `reason` text,
  `status` enum('PENDING','APPROVED','REJECTED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `approverId` int DEFAULT NULL,
  `approverRemarks` varchar(500) DEFAULT NULL,
  `approvedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `categoryId` (`categoryId`),
  KEY `approverId` (`approverId`),
  KEY `idx_leave_requests_user_date_status` (`userId`,`fromDate`,`status`),
  CONSTRAINT `leave_requests_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `leave_requests_ibfk_2` FOREIGN KEY (`categoryId`) REFERENCES `leave_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `leave_requests_ibfk_3` FOREIGN KEY (`approverId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_requests`
--

LOCK TABLES `leave_requests` WRITE;
/*!40000 ALTER TABLE `leave_requests` DISABLE KEYS */;
INSERT INTO `leave_requests` VALUES (1,4,'Superadmin (admin@gmail.com)','nandhu',1,'2026-09-01','2026-09-03','FULL_DAY',NULL,NULL,NULL,NULL,3.00,0.00,NULL,'APPROVED',4,NULL,'2026-08-31 17:31:55','2026-08-31 17:22:58','2026-08-31 17:31:55',NULL);
/*!40000 ALTER TABLE `leave_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modules`
--

DROP TABLE IF EXISTS `modules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `code` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `route` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `icon` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `displayOrder` int DEFAULT '0',
  `parentId` int DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `name_2` (`name`),
  UNIQUE KEY `code_2` (`code`),
  UNIQUE KEY `name_3` (`name`),
  UNIQUE KEY `code_3` (`code`),
  UNIQUE KEY `name_4` (`name`),
  UNIQUE KEY `code_4` (`code`),
  UNIQUE KEY `name_5` (`name`),
  UNIQUE KEY `code_5` (`code`),
  UNIQUE KEY `name_6` (`name`),
  UNIQUE KEY `code_6` (`code`),
  UNIQUE KEY `name_7` (`name`),
  UNIQUE KEY `code_7` (`code`),
  UNIQUE KEY `name_8` (`name`),
  UNIQUE KEY `code_8` (`code`),
  UNIQUE KEY `name_9` (`name`),
  UNIQUE KEY `code_9` (`code`),
  UNIQUE KEY `name_10` (`name`),
  UNIQUE KEY `code_10` (`code`),
  UNIQUE KEY `name_11` (`name`),
  UNIQUE KEY `code_11` (`code`),
  UNIQUE KEY `name_12` (`name`),
  UNIQUE KEY `code_12` (`code`),
  UNIQUE KEY `name_13` (`name`),
  UNIQUE KEY `code_13` (`code`),
  UNIQUE KEY `name_14` (`name`),
  UNIQUE KEY `code_14` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modules`
--

LOCK TABLES `modules` WRITE;
/*!40000 ALTER TABLE `modules` DISABLE KEYS */;
/*!40000 ALTER TABLE `modules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `office_tours`
--

DROP TABLE IF EXISTS `office_tours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `office_tours` (
  `otid` int NOT NULL AUTO_INCREMENT,
  `cifid` int NOT NULL,
  `onboardinginfoid` int NOT NULL,
  `reception` tinyint(1) NOT NULL DEFAULT '0',
  `workstationSheet` tinyint(1) NOT NULL DEFAULT '0',
  `meetingRoom` tinyint(1) NOT NULL DEFAULT '0',
  `cafeteria` tinyint(1) NOT NULL DEFAULT '0',
  `hrCabin` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`otid`),
  KEY `cifid` (`cifid`),
  KEY `onboardinginfoid` (`onboardinginfoid`),
  CONSTRAINT `office_tours_ibfk_17` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`),
  CONSTRAINT `office_tours_ibfk_18` FOREIGN KEY (`onboardinginfoid`) REFERENCES `onboard_info` (`onboardinginfoid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `office_tours`
--

LOCK TABLES `office_tours` WRITE;
/*!40000 ALTER TABLE `office_tours` DISABLE KEYS */;
INSERT INTO `office_tours` VALUES (1,4,1,1,1,1,1,1,'2026-08-29 07:23:12','2026-08-29 07:27:40',NULL),(2,1,2,0,0,0,0,0,'2026-08-29 07:37:52','2026-08-31 15:51:00',NULL);
/*!40000 ALTER TABLE `office_tours` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `onboard_info`
--

DROP TABLE IF EXISTS `onboard_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `onboard_info` (
  `onboardinginfoid` int NOT NULL AUTO_INCREMENT,
  `officialemail` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `officialphone` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `doj` date DEFAULT NULL,
  `emptype` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `erprole` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hiresource` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `department` int NOT NULL,
  `designation` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reportHead` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `photo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `uanno` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `aadharno` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `panno` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `salary` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `eid` int NOT NULL,
  `academicid` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `cifid` int NOT NULL,
  `employeeId` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `firstName` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastName` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nickName` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `personalEmail` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `personalPhone` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `gender` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `maritalStatus` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dateOfBirth` date DEFAULT NULL,
  `manager` varchar(120) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `referral` varchar(120) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `permanent` varchar(120) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `systemAdmin` varchar(120) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `superAdmin` varchar(120) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `currentAddressLine1` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `currentAddressLine2` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `currentCity` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `currentState` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `currentPincode` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `permanentAddressLine1` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `permanentAddressLine2` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `permanentCity` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `permanentState` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `permanentPincode` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `favoriteCake` varchar(120) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `favoriteColor` varchar(120) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `favoriteSong` varchar(120) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `favoriteMovie` varchar(120) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `favoriteFood` varchar(120) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `favoriteActor` varchar(120) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dreamVacation` varchar(120) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `weekendActivity` varchar(120) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `coffeeOrTea` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `favoriteSports` varchar(120) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`onboardinginfoid`),
  UNIQUE KEY `officialphone` (`officialphone`),
  UNIQUE KEY `officialphone_2` (`officialphone`),
  UNIQUE KEY `officialphone_3` (`officialphone`),
  UNIQUE KEY `officialphone_4` (`officialphone`),
  UNIQUE KEY `officialphone_5` (`officialphone`),
  UNIQUE KEY `officialphone_6` (`officialphone`),
  UNIQUE KEY `officialphone_7` (`officialphone`),
  UNIQUE KEY `officialphone_8` (`officialphone`),
  UNIQUE KEY `officialphone_9` (`officialphone`),
  UNIQUE KEY `officialemail` (`officialemail`),
  UNIQUE KEY `officialemail_2` (`officialemail`),
  UNIQUE KEY `officialemail_3` (`officialemail`),
  UNIQUE KEY `officialemail_4` (`officialemail`),
  UNIQUE KEY `officialemail_5` (`officialemail`),
  UNIQUE KEY `officialemail_6` (`officialemail`),
  UNIQUE KEY `officialemail_7` (`officialemail`),
  UNIQUE KEY `officialemail_8` (`officialemail`),
  UNIQUE KEY `officialemail_9` (`officialemail`),
  UNIQUE KEY `officialemail_10` (`officialemail`),
  UNIQUE KEY `officialphone_10` (`officialphone`),
  UNIQUE KEY `officialemail_11` (`officialemail`),
  UNIQUE KEY `officialphone_11` (`officialphone`),
  UNIQUE KEY `officialemail_12` (`officialemail`),
  UNIQUE KEY `officialphone_12` (`officialphone`),
  UNIQUE KEY `officialemail_13` (`officialemail`),
  UNIQUE KEY `officialphone_13` (`officialphone`),
  KEY `department` (`department`),
  KEY `eid` (`eid`),
  KEY `academicid` (`academicid`),
  KEY `cifid` (`cifid`),
  CONSTRAINT `onboard_info_ibfk_28` FOREIGN KEY (`department`) REFERENCES `departments` (`id`),
  CONSTRAINT `onboard_info_ibfk_29` FOREIGN KEY (`eid`) REFERENCES `cif_experiences` (`eid`),
  CONSTRAINT `onboard_info_ibfk_30` FOREIGN KEY (`academicid`) REFERENCES `cif_academics` (`academicid`),
  CONSTRAINT `onboard_info_ibfk_31` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `onboard_info`
--

LOCK TABLES `onboard_info` WRITE;
/*!40000 ALTER TABLE `onboard_info` DISABLE KEYS */;
INSERT INTO `onboard_info` VALUES (1,'final.auto.code.4@example.com','+1 (553) 767-2427','1984-05-21','Trainee','Team Member','Referal',1,'Temporibus et ipsum ','Est amet in ratione',NULL,'325','0','26','0',5,4,'2026-08-29 07:23:12','2026-08-31 16:16:04',NULL,4,'KHO-0002','Amber','Fulton','Reuben Brock','fokikyheb@mailinator.com','+1 (922) 899-7924','Male','Single','1981-05-12',NULL,NULL,NULL,'System Admin','Super_admin','Delectus quo sunt ','Non ullamco facilis ','Eiusmod lorem recusa','Quia et aut mollitia','Cupidatat est est r','Qui voluptate offici','Aliquam commodo corr','Et in quas ipsa non','In exercitationem pr','Aliquip repudiandae ','Et fugiat et ullamco','Enim cillum quo anim','Consequuntur minus v','Ex porro eligendi de','Voluptatem consequat','Est consequatur Mi','Quia nemo sint itaq','Enim optio aut ad v','Neither','Ea omnis sunt sint q'),(2,'qa.onboard@example.com','9000000002','2026-09-01','Permanent','Admin','Referal',1,'Operations Executive','Manager',NULL,'0','0','ABCDE1234F','25000',4,1,'2026-08-29 07:37:52','2026-08-31 15:50:59',NULL,1,NULL,'Test','Candidate',NULL,'qa.personal@example.com','9000000001','Male','Single','1995-01-15',NULL,NULL,NULL,NULL,NULL,'A',NULL,'Bengaluru','KA','560001','A',NULL,'Bengaluru','KA','560001',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Reading',NULL,NULL);
/*!40000 ALTER TABLE `onboard_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `onboarding_banks`
--

DROP TABLE IF EXISTS `onboarding_banks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `onboarding_banks` (
  `bid` int NOT NULL AUTO_INCREMENT,
  `cifid` int NOT NULL,
  `onboardinginfoid` int NOT NULL,
  `accountHolderName` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `accountNumber` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `ifscCode` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `bankName` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `branchName` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`bid`),
  KEY `cifid` (`cifid`),
  KEY `onboardinginfoid` (`onboardinginfoid`),
  CONSTRAINT `onboarding_banks_ibfk_17` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`),
  CONSTRAINT `onboarding_banks_ibfk_18` FOREIGN KEY (`onboardinginfoid`) REFERENCES `onboard_info` (`onboardinginfoid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `onboarding_banks`
--

LOCK TABLES `onboarding_banks` WRITE;
/*!40000 ALTER TABLE `onboarding_banks` DISABLE KEYS */;
INSERT INTO `onboarding_banks` VALUES (1,4,1,'Sint sunt quasi omni','892','Rerum eum ea nihil d','Olivia Brown','Renee Mooney','2026-08-29 07:23:12','2026-08-29 07:27:23',NULL),(2,1,2,'Test','123456','IFSC0001','SBI','Main','2026-08-29 07:37:52','2026-08-31 15:51:00',NULL);
/*!40000 ALTER TABLE `onboarding_banks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `onboarding_documents`
--

DROP TABLE IF EXISTS `onboarding_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `onboarding_documents` (
  `did` int NOT NULL AUTO_INCREMENT,
  `cifid` int NOT NULL,
  `onboardinginfoid` int NOT NULL,
  `documentType` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `fileName` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `bid` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `file_url` varchar(512) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`did`),
  KEY `cifid` (`cifid`),
  KEY `onboardinginfoid` (`onboardinginfoid`),
  KEY `bid` (`bid`),
  CONSTRAINT `onboarding_documents_ibfk_25` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`),
  CONSTRAINT `onboarding_documents_ibfk_26` FOREIGN KEY (`onboardinginfoid`) REFERENCES `onboard_info` (`onboardinginfoid`),
  CONSTRAINT `onboarding_documents_ibfk_27` FOREIGN KEY (`bid`) REFERENCES `onboarding_banks` (`bid`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `onboarding_documents`
--

LOCK TABLES `onboarding_documents` WRITE;
/*!40000 ALTER TABLE `onboarding_documents` DISABLE KEYS */;
INSERT INTO `onboarding_documents` VALUES (1,4,1,'PAN','Untitled.png',1,'2026-08-29 07:27:17','2026-08-31 16:01:38','2026-08-31 16:01:38',NULL),(2,1,2,'PAN','Untitled.png',2,'2026-08-29 07:38:08','2026-08-31 15:51:00','2026-08-31 15:51:00','/uploads/onboarding-documents/1787989088147-Untitled.png'),(3,4,1,'Experience Letter','WhatsApp Image 2026-04-13 at 7.16.07 PM_Sujith B R 22BFT046.jpeg',1,'2026-08-29 12:07:19','2026-08-29 12:07:19',NULL,'/uploads/onboarding-documents/1788005239558-WhatsApp-Image-2026-04-13-at-7-16-07-PM_Sujith-B-R-22BFT046.jpeg'),(4,4,1,'Experience Letter','dp.jpg',1,'2026-08-29 12:07:45','2026-08-29 12:07:45',NULL,'/uploads/onboarding-documents/1788005265311-dp.jpg');
/*!40000 ALTER TABLE `onboarding_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `onboarding_education_details`
--

DROP TABLE IF EXISTS `onboarding_education_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `onboarding_education_details` (
  `oeid` int NOT NULL AUTO_INCREMENT,
  `cifid` int NOT NULL,
  `qualification` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `institution` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `board` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `year` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `percentage` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`oeid`),
  KEY `cifid` (`cifid`)
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `onboarding_education_details`
--

LOCK TABLES `onboarding_education_details` WRITE;
/*!40000 ALTER TABLE `onboarding_education_details` DISABLE KEYS */;
INSERT INTO `onboarding_education_details` VALUES (91,1,'BSc','XYZ','XYZ','2016','75','2026-08-31 15:50:59','2026-08-31 15:50:59',NULL),(110,4,'Est sit incidunt','Officia elit ut eu','Quia vel similique c','Enim cupidatat enim','Aliquam molestiae in','2026-08-31 16:16:04','2026-08-31 16:16:04',NULL);
/*!40000 ALTER TABLE `onboarding_education_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `onboarding_equipments`
--

DROP TABLE IF EXISTS `onboarding_equipments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `onboarding_equipments` (
  `eqid` int NOT NULL AUTO_INCREMENT,
  `cifid` int NOT NULL,
  `onboardinginfoid` int NOT NULL,
  `laptop` tinyint(1) NOT NULL DEFAULT '0',
  `mouse` tinyint(1) NOT NULL DEFAULT '0',
  `keyboard` tinyint(1) NOT NULL DEFAULT '0',
  `entryCardRecognition` tinyint(1) NOT NULL DEFAULT '0',
  `headset` tinyint(1) NOT NULL DEFAULT '0',
  `welcomeKit` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`eqid`),
  KEY `cifid` (`cifid`),
  KEY `onboardinginfoid` (`onboardinginfoid`),
  CONSTRAINT `onboarding_equipments_ibfk_17` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`),
  CONSTRAINT `onboarding_equipments_ibfk_18` FOREIGN KEY (`onboardinginfoid`) REFERENCES `onboard_info` (`onboardinginfoid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `onboarding_equipments`
--

LOCK TABLES `onboarding_equipments` WRITE;
/*!40000 ALTER TABLE `onboarding_equipments` DISABLE KEYS */;
INSERT INTO `onboarding_equipments` VALUES (1,4,1,1,1,1,1,1,1,'2026-08-29 07:23:12','2026-08-29 07:28:05',NULL),(2,1,2,0,0,0,0,0,0,'2026-08-29 07:37:52','2026-08-31 15:51:00',NULL);
/*!40000 ALTER TABLE `onboarding_equipments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `onboarding_experience_details`
--

DROP TABLE IF EXISTS `onboarding_experience_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `onboarding_experience_details` (
  `oexid` int NOT NULL AUTO_INCREMENT,
  `cifid` int NOT NULL,
  `company` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `designation` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `totalExp` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reason` text COLLATE utf8mb4_general_ci,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`oexid`),
  KEY `cifid` (`cifid`)
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `onboarding_experience_details`
--

LOCK TABLES `onboarding_experience_details` WRITE;
/*!40000 ALTER TABLE `onboarding_experience_details` DISABLE KEYS */;
INSERT INTO `onboarding_experience_details` VALUES (91,1,'ABC','Exec','2020-01-01','2023-01-01','3','Growth','2026-08-31 15:50:59','2026-08-31 15:50:59',NULL),(110,4,'Quo cupiditate sed e','Tempor dolorum labor','2002-01-15','1979-10-17','Numquam ad mollitia','Rerum quo quo tempor','2026-08-31 16:16:04','2026-08-31 16:16:04',NULL);
/*!40000 ALTER TABLE `onboarding_experience_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `onboarding_health`
--

DROP TABLE IF EXISTS `onboarding_health`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `onboarding_health` (
  `hid` int NOT NULL AUTO_INCREMENT,
  `cifid` int NOT NULL,
  `onboardinginfoid` int NOT NULL,
  `takingTablets` tinyint(1) NOT NULL DEFAULT '0',
  `healthIssues` text COLLATE utf8mb4_general_ci,
  `bloodGroup` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `medicalAssistanceNeeded` tinyint(1) NOT NULL DEFAULT '0',
  `emergencyContactName` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `emergencyContactNumber` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`hid`),
  KEY `cifid` (`cifid`),
  KEY `onboardinginfoid` (`onboardinginfoid`),
  CONSTRAINT `onboarding_health_ibfk_17` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`),
  CONSTRAINT `onboarding_health_ibfk_18` FOREIGN KEY (`onboardinginfoid`) REFERENCES `onboard_info` (`onboardinginfoid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `onboarding_health`
--

LOCK TABLES `onboarding_health` WRITE;
/*!40000 ALTER TABLE `onboarding_health` DISABLE KEYS */;
INSERT INTO `onboarding_health` VALUES (1,4,1,1,'Yes','Esse cupid',1,'Nadine Bradshaw','+1 (758) 676-3804','2026-08-29 07:23:12','2026-08-29 07:28:05',NULL),(2,1,2,0,'No','O+',0,'Person','9000000003','2026-08-29 07:37:52','2026-08-31 15:51:00',NULL);
/*!40000 ALTER TABLE `onboarding_health` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `onboarding_records`
--

DROP TABLE IF EXISTS `onboarding_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `onboarding_records` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cifid` int NOT NULL,
  `status` enum('DRAFT','FINAL') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'DRAFT',
  `experienceDetails` json NOT NULL,
  `educationDetails` json NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `formData` json NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cifid` (`cifid`),
  CONSTRAINT `onboarding_records_ibfk_1` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`),
  CONSTRAINT `onboarding_records_chk_1` CHECK (json_valid(`experienceDetails`)),
  CONSTRAINT `onboarding_records_chk_2` CHECK (json_valid(`educationDetails`)),
  CONSTRAINT `onboarding_records_chk_3` CHECK (json_valid(`formData`))
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `onboarding_records`
--

LOCK TABLES `onboarding_records` WRITE;
/*!40000 ALTER TABLE `onboarding_records` DISABLE KEYS */;
INSERT INTO `onboarding_records` VALUES (11,1,'DRAFT','[{\"reason\": \"Growth\", \"company\": \"ABC\", \"endDate\": \"2023-01-01\", \"totalExp\": \"3\", \"startDate\": \"2020-01-01\", \"designation\": \"Exec\"}]','[{\"year\": \"2016\", \"board\": \"XYZ\", \"percentage\": \"75\", \"institution\": \"XYZ\", \"qualification\": \"BSc\"}]','2026-08-31 15:50:59','2026-08-31 15:50:59',NULL,'{\"kit\": {}, \"gender\": \"Male\", \"health\": {\"anyTablets\": \"No\", \"bloodGroup\": \"O+\", \"healthIssues\": \"No\", \"emergencyName\": \"Person\", \"emergencyNumber\": \"9000000003\", \"medicalAssistance\": \"No\"}, \"erpRole\": \"Admin\", \"lastName\": \"Candidate\", \"documents\": [], \"education\": [{\"year\": \"2016\", \"board\": \"XYZ\", \"percentage\": \"75\", \"institution\": \"XYZ\", \"qualification\": \"BSc\"}], \"firstName\": \"Test\", \"induction\": {}, \"panNumber\": \"ABCDE1234F\", \"department\": \"1\", \"experience\": [{\"reason\": \"Growth\", \"company\": \"ABC\", \"endDate\": \"2023-01-01\", \"totalExp\": \"3\", \"startDate\": \"2020-01-01\", \"designation\": \"Exec\"}], \"icebreaker\": {\"weekendActivity\": \"Reading\"}, \"officeTour\": {}, \"bankDetails\": {\"bankName\": \"SBI\", \"ifscCode\": \"IFSC0001\", \"branchName\": \"Main\", \"accountHolder\": \"Test\", \"accountNumber\": \"123456\"}, \"dateOfBirth\": \"1995-01-15\", \"designation\": \"Operations Executive\", \"officePhone\": \"9000000002\", \"employeeType\": \"Permanent\", \"sourceOfHire\": \"Referral\", \"currentSalary\": \"25000\", \"dateOfJoining\": \"2026-09-01\", \"maritalStatus\": \"Single\", \"officialEmail\": \"qa.onboard@example.com\", \"personalEmail\": \"qa.personal@example.com\", \"personalPhone\": \"9000000001\", \"reportingHead\": \"Manager\", \"currentAddress\": {\"city\": \"Bengaluru\", \"line1\": \"A\", \"state\": \"KA\", \"pincode\": \"560001\"}, \"permanentAddress\": {\"city\": \"Bengaluru\", \"line1\": \"A\", \"state\": \"KA\", \"pincode\": \"560001\"}}'),(13,4,'FINAL','[{\"reason\": \"Rerum quo quo tempor\", \"company\": \"Quo cupiditate sed e\", \"endDate\": \"1979-10-17\", \"totalExp\": \"Numquam ad mollitia\", \"startDate\": \"2002-01-15\", \"designation\": \"Tempor dolorum labor\"}]','[{\"year\": \"Enim cupidatat enim\", \"board\": \"Quia vel similique c\", \"percentage\": \"Aliquam molestiae in\", \"institution\": \"Officia elit ut eu\", \"qualification\": \"Est sit incidunt\"}]','2026-08-31 16:00:43','2026-08-31 16:15:44',NULL,'{\"kit\": {\"mouse\": true, \"laptop\": true, \"headset\": true, \"keyboard\": true, \"entryCard\": true, \"welcomeKit\": true}, \"gender\": \"Male\", \"health\": {\"anyTablets\": \"Yes\", \"bloodGroup\": \"Esse cupid\", \"healthIssues\": \"Yes\", \"emergencyName\": \"Nadine Bradshaw\", \"emergencyNumber\": \"+1 (758) 676-3804\", \"emergencyContact\": \"\", \"medicalAssistance\": \"Yes\"}, \"erpRole\": \"Team Member\", \"manager\": \"\", \"lastName\": \"Fulton\", \"nickName\": \"Reuben Brock\", \"referral\": \"\", \"documents\": [{\"fileUrl\": \"/uploads/onboarding-documents/1788005239558-WhatsApp-Image-2026-04-13-at-7-16-07-PM_Sujith-B-R-22BFT046.jpeg\", \"fileName\": \"WhatsApp Image 2026-04-13 at 7.16.07 PM_Sujith B R 22BFT046.jpeg\", \"documentType\": \"Experience Letter\"}, {\"fileUrl\": \"/uploads/onboarding-documents/1788005265311-dp.jpg\", \"fileName\": \"dp.jpg\", \"documentType\": \"Experience Letter\"}], \"education\": [{\"year\": \"Enim cupidatat enim\", \"board\": \"Quia vel similique c\", \"percentage\": \"Aliquam molestiae in\", \"institution\": \"Officia elit ut eu\", \"qualification\": \"Est sit incidunt\"}], \"firstName\": \"Amber\", \"induction\": {\"teamIntro\": true, \"hrPolicies\": true, \"leavePolicy\": true, \"companyIntro\": true, \"attendanceRules\": true, \"securityGuidelines\": true}, \"panNumber\": \"26\", \"permanent\": \"\", \"uanNumber\": \"325\", \"department\": 1, \"employeeId\": \"KHO-0002\", \"experience\": [{\"reason\": \"Rerum quo quo tempor\", \"company\": \"Quo cupiditate sed e\", \"endDate\": \"1979-10-17\", \"totalExp\": \"Numquam ad mollitia\", \"startDate\": \"2002-01-15\", \"designation\": \"Tempor dolorum labor\"}], \"icebreaker\": {\"coffeeOrTea\": \"Neither\", \"favoriteCake\": \"Et fugiat et ullamco\", \"favoriteFood\": \"Voluptatem consequat\", \"favoriteSong\": \"Consequuntur minus v\", \"dreamVacation\": \"Quia nemo sint itaq\", \"favoriteActor\": \"Est consequatur Mi\", \"favoriteColor\": \"Enim cillum quo anim\", \"favoriteMovie\": \"Ex porro eligendi de\", \"favoriteSports\": \"Ea omnis sunt sint q\", \"weekendActivity\": \"Enim optio aut ad v\"}, \"officeTour\": {\"hrCabin\": true, \"cafeteria\": true, \"reception\": true, \"meetingRoom\": true, \"workstation\": true}, \"superAdmin\": \"Super_admin\", \"bankDetails\": {\"bankName\": \"Olivia Brown\", \"ifscCode\": \"Rerum eum ea nihil d\", \"branchName\": \"Renee Mooney\", \"accountHolder\": \"Sint sunt quasi omni\", \"accountNumber\": \"892\"}, \"dateOfBirth\": \"1981-05-12\", \"designation\": \"Temporibus et ipsum \", \"officePhone\": \"+1 (553) 767-2427\", \"systemAdmin\": \"System Admin\", \"employeeType\": \"Trainee\", \"sourceOfHire\": \"Referal\", \"currentSalary\": \"0\", \"dateOfJoining\": \"1984-05-21\", \"maritalStatus\": \"Single\", \"officialEmail\": \"final.auto.code.4@example.com\", \"personalEmail\": \"fokikyheb@mailinator.com\", \"personalPhone\": \"+1 (922) 899-7924\", \"reportingHead\": \"Est amet in ratione\", \"currentAddress\": {\"city\": \"Eiusmod lorem recusa\", \"line1\": \"Delectus quo sunt \", \"line2\": \"Non ullamco facilis \", \"state\": \"Quia et aut mollitia\", \"pincode\": \"Cupidatat est est r\"}, \"permanentAddress\": {\"city\": \"Et in quas ipsa non\", \"line1\": \"Qui voluptate offici\", \"line2\": \"Aliquam commodo corr\", \"state\": \"In exercitationem pr\", \"pincode\": \"Aliquip repudiandae \"}}');
/*!40000 ALTER TABLE `onboarding_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `onboardings`
--

DROP TABLE IF EXISTS `onboardings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `onboardings` (
  `onboardingid` int NOT NULL AUTO_INCREMENT,
  `cifid` int NOT NULL,
  `onboardinginfoid` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `candidateId` int DEFAULT NULL,
  `jobApplicationId` int DEFAULT NULL,
  `status` enum('DRAFT','READY_FOR_VERIFICATION','IN_PROGRESS','COMPLETED','REJECTED') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'DRAFT',
  `officialEmail` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `officialPhone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `doj` date DEFAULT NULL,
  `employeeType` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `employeeRole` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hireSource` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `departmentId` int DEFAULT NULL,
  `designation` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reportingManager` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `photoUrl` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `uanno` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `aadharNo` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `panNo` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `salary` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `employeeCode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`onboardingid`),
  KEY `cifid` (`cifid`),
  KEY `onboardinginfoid` (`onboardinginfoid`),
  CONSTRAINT `onboardings_ibfk_19` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`),
  CONSTRAINT `onboardings_ibfk_20` FOREIGN KEY (`onboardinginfoid`) REFERENCES `onboard_info` (`onboardinginfoid`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `onboardings`
--

LOCK TABLES `onboardings` WRITE;
/*!40000 ALTER TABLE `onboardings` DISABLE KEYS */;
INSERT INTO `onboardings` VALUES (1,4,1,'2026-08-29 07:23:12','2026-08-29 07:23:12',NULL,4,NULL,'DRAFT',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,1,2,'2026-08-29 07:37:52','2026-08-29 07:37:52',NULL,1,NULL,'DRAFT',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,5,NULL,'2026-08-31 15:24:53','2026-08-31 15:24:53',NULL,5,5,'DRAFT','dummy.1788189893249@example.com','9000000001','2026-09-01',NULL,NULL,NULL,1,'Operations Executive','Manager',NULL,NULL,NULL,NULL,NULL,'KHO-999');
/*!40000 ALTER TABLE `onboardings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `openings`
--

DROP TABLE IF EXISTS `openings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `openings` (
  `jobid` int NOT NULL AUTO_INCREMENT,
  `code` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `jobTitle` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `departmentId` int NOT NULL,
  `openingCount` int NOT NULL,
  `requiredSkills` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `minExperience` int NOT NULL,
  `jobDescription` text COLLATE utf8mb4_general_ci,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `jobOpeningUrl` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`jobid`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `code_2` (`code`),
  UNIQUE KEY `code_3` (`code`),
  UNIQUE KEY `code_4` (`code`),
  UNIQUE KEY `code_5` (`code`),
  UNIQUE KEY `code_6` (`code`),
  UNIQUE KEY `code_7` (`code`),
  UNIQUE KEY `code_8` (`code`),
  UNIQUE KEY `code_9` (`code`),
  UNIQUE KEY `code_10` (`code`),
  UNIQUE KEY `code_11` (`code`),
  UNIQUE KEY `code_12` (`code`),
  UNIQUE KEY `code_13` (`code`),
  UNIQUE KEY `code_14` (`code`),
  UNIQUE KEY `code_15` (`code`),
  UNIQUE KEY `code_16` (`code`),
  UNIQUE KEY `code_17` (`code`),
  UNIQUE KEY `code_18` (`code`),
  UNIQUE KEY `code_19` (`code`),
  UNIQUE KEY `code_20` (`code`),
  UNIQUE KEY `code_21` (`code`),
  UNIQUE KEY `code_22` (`code`),
  KEY `departmentId` (`departmentId`),
  CONSTRAINT `openings_ibfk_1` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `openings`
--

LOCK TABLES `openings` WRITE;
/*!40000 ALTER TABLE `openings` DISABLE KEYS */;
INSERT INTO `openings` VALUES (1,'OP-001','Operations Executive',1,2,'SEO, Google Ads, Meta Ads',2,'Looking for a Digital Marketing Executive.',1,'2026-08-12 05:10:32','2026-08-29 06:34:49',NULL,NULL),(2,'JOB002','Ipsum nobis rerum i',1,3,'Sed esse voluptas qu',5,'lorem',1,'2026-08-12 09:48:24','2026-08-17 07:38:13','2026-08-17 07:38:13',NULL),(3,'WD-001','Front End Engineer',41,3,'lorem',0,'lorem',1,'2026-08-17 06:43:22','2026-08-29 12:17:45',NULL,NULL),(4,'OP-002','Ipsum nobis rerum i',1,5,'lorem',3,'Ipsum nobis rerum i',1,'2026-08-27 05:26:54','2026-08-29 12:17:56','2026-08-29 12:17:56','http://localhost:5173/cif-form?jobid=4');
/*!40000 ALTER TABLE `openings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `expiresAt` datetime NOT NULL,
  `isUsed` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  UNIQUE KEY `token_2` (`token`),
  UNIQUE KEY `token_3` (`token`),
  UNIQUE KEY `token_4` (`token`),
  UNIQUE KEY `token_5` (`token`),
  UNIQUE KEY `token_6` (`token`),
  UNIQUE KEY `token_7` (`token`),
  UNIQUE KEY `token_8` (`token`),
  UNIQUE KEY `token_9` (`token`),
  UNIQUE KEY `token_10` (`token`),
  UNIQUE KEY `token_11` (`token`),
  UNIQUE KEY `token_12` (`token`),
  UNIQUE KEY `token_13` (`token`),
  UNIQUE KEY `token_14` (`token`),
  UNIQUE KEY `token_15` (`token`),
  UNIQUE KEY `token_16` (`token`),
  UNIQUE KEY `token_17` (`token`),
  UNIQUE KEY `token_18` (`token`),
  UNIQUE KEY `token_19` (`token`),
  UNIQUE KEY `token_20` (`token`),
  UNIQUE KEY `token_21` (`token`),
  UNIQUE KEY `token_22` (`token`),
  UNIQUE KEY `token_23` (`token`),
  UNIQUE KEY `token_24` (`token`),
  UNIQUE KEY `token_25` (`token`),
  UNIQUE KEY `token_26` (`token`),
  UNIQUE KEY `token_27` (`token`),
  UNIQUE KEY `token_28` (`token`),
  UNIQUE KEY `token_29` (`token`),
  UNIQUE KEY `token_30` (`token`),
  UNIQUE KEY `token_31` (`token`),
  UNIQUE KEY `token_32` (`token`),
  UNIQUE KEY `token_33` (`token`),
  UNIQUE KEY `token_34` (`token`),
  UNIQUE KEY `token_35` (`token`),
  UNIQUE KEY `token_36` (`token`),
  UNIQUE KEY `token_37` (`token`),
  UNIQUE KEY `token_38` (`token`),
  UNIQUE KEY `token_39` (`token`),
  KEY `userId` (`userId`),
  CONSTRAINT `password_reset_tokens_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payrolls`
--

DROP TABLE IF EXISTS `payrolls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payrolls` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employeeId` int NOT NULL,
  `month` int NOT NULL,
  `year` int NOT NULL,
  `grossSalary` decimal(12,2) NOT NULL DEFAULT '0.00',
  `lopDays` decimal(8,2) NOT NULL DEFAULT '0.00',
  `workingDays` int NOT NULL DEFAULT '30',
  `netSalary` decimal(12,2) NOT NULL DEFAULT '0.00',
  `status` varchar(30) NOT NULL DEFAULT 'Draft',
  `paidAt` datetime DEFAULT NULL,
  `createdBy` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_payroll_employee_month_year` (`employeeId`,`month`,`year`),
  KEY `createdBy` (`createdBy`),
  KEY `idx_payroll_year_month` (`year`,`month`),
  CONSTRAINT `payrolls_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `payrolls_ibfk_2` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payrolls`
--

LOCK TABLES `payrolls` WRITE;
/*!40000 ALTER TABLE `payrolls` DISABLE KEYS */;
/*!40000 ALTER TABLE `payrolls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `moduleId` int NOT NULL,
  `action` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `permissionKey` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissionKey` (`permissionKey`),
  UNIQUE KEY `permissionKey_2` (`permissionKey`),
  UNIQUE KEY `permissionKey_3` (`permissionKey`),
  UNIQUE KEY `permissionKey_4` (`permissionKey`),
  UNIQUE KEY `permissionKey_5` (`permissionKey`),
  UNIQUE KEY `permissionKey_6` (`permissionKey`),
  UNIQUE KEY `permissionKey_7` (`permissionKey`),
  UNIQUE KEY `permissionKey_8` (`permissionKey`),
  UNIQUE KEY `permissionKey_9` (`permissionKey`),
  UNIQUE KEY `permissionKey_10` (`permissionKey`),
  UNIQUE KEY `permissionKey_11` (`permissionKey`),
  UNIQUE KEY `permissionKey_12` (`permissionKey`),
  UNIQUE KEY `permissionKey_13` (`permissionKey`),
  UNIQUE KEY `permissionKey_14` (`permissionKey`),
  UNIQUE KEY `permissionKey_15` (`permissionKey`),
  UNIQUE KEY `permissionKey_16` (`permissionKey`),
  UNIQUE KEY `permissionKey_17` (`permissionKey`),
  UNIQUE KEY `permissionKey_18` (`permissionKey`),
  UNIQUE KEY `permissionKey_19` (`permissionKey`),
  UNIQUE KEY `permissionKey_20` (`permissionKey`),
  UNIQUE KEY `permissionKey_21` (`permissionKey`),
  UNIQUE KEY `permissionKey_22` (`permissionKey`),
  UNIQUE KEY `permissionKey_23` (`permissionKey`),
  UNIQUE KEY `permissionKey_24` (`permissionKey`),
  UNIQUE KEY `permissionKey_25` (`permissionKey`),
  UNIQUE KEY `permissionKey_26` (`permissionKey`),
  UNIQUE KEY `permissionKey_27` (`permissionKey`),
  UNIQUE KEY `permissionKey_28` (`permissionKey`),
  UNIQUE KEY `permissionKey_29` (`permissionKey`),
  UNIQUE KEY `permissionKey_30` (`permissionKey`),
  UNIQUE KEY `permissionKey_31` (`permissionKey`),
  UNIQUE KEY `permissionKey_32` (`permissionKey`),
  UNIQUE KEY `permissionKey_33` (`permissionKey`),
  UNIQUE KEY `permissionKey_34` (`permissionKey`),
  UNIQUE KEY `permissionKey_35` (`permissionKey`),
  UNIQUE KEY `permissionKey_36` (`permissionKey`),
  UNIQUE KEY `permissionKey_37` (`permissionKey`),
  UNIQUE KEY `permissionKey_38` (`permissionKey`),
  UNIQUE KEY `permissionKey_39` (`permissionKey`),
  UNIQUE KEY `permissionKey_40` (`permissionKey`),
  UNIQUE KEY `permissionKey_41` (`permissionKey`),
  UNIQUE KEY `permissionKey_42` (`permissionKey`),
  UNIQUE KEY `permissionKey_43` (`permissionKey`),
  UNIQUE KEY `permissionKey_44` (`permissionKey`),
  KEY `moduleId` (`moduleId`),
  CONSTRAINT `permissions_ibfk_1` FOREIGN KEY (`moduleId`) REFERENCES `modules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_assignments`
--

DROP TABLE IF EXISTS `project_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_assignments` (
  `id` int NOT NULL,
  `projectOnboardId` int NOT NULL,
  `assignedToId` int NOT NULL,
  `reportingHeadId` int DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'In Progress',
  `assignedBy` int DEFAULT NULL,
  `assignedAt` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `projectOnboardId` (`projectOnboardId`),
  KEY `assignedToId` (`assignedToId`),
  KEY `reportingHeadId` (`reportingHeadId`),
  KEY `assignedBy` (`assignedBy`),
  CONSTRAINT `project_assignments_ibfk_21` FOREIGN KEY (`projectOnboardId`) REFERENCES `project_onboards` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `project_assignments_ibfk_22` FOREIGN KEY (`assignedToId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `project_assignments_ibfk_23` FOREIGN KEY (`reportingHeadId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `project_assignments_ibfk_24` FOREIGN KEY (`assignedBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_assignments`
--

LOCK TABLES `project_assignments` WRITE;
/*!40000 ALTER TABLE `project_assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_onboards`
--

DROP TABLE IF EXISTS `project_onboards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_onboards` (
  `id` int NOT NULL,
  `leadId` int DEFAULT NULL,
  `projectName` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `companyName` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `projectManagerIds` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `spocIds` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `serviceIds` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `serviceDetails` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `assignedToIds` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `reportingHeadId` int DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Pending',
  `createdBy` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `leadId` (`leadId`),
  KEY `createdBy` (`createdBy`),
  CONSTRAINT `project_onboards_ibfk_11` FOREIGN KEY (`leadId`) REFERENCES `leads` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `project_onboards_ibfk_12` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `project_onboards_chk_1` CHECK (json_valid(`projectManagerIds`)),
  CONSTRAINT `project_onboards_chk_2` CHECK (json_valid(`spocIds`)),
  CONSTRAINT `project_onboards_chk_3` CHECK (json_valid(`serviceIds`)),
  CONSTRAINT `project_onboards_chk_4` CHECK (json_valid(`serviceDetails`)),
  CONSTRAINT `project_onboards_chk_5` CHECK (json_valid(`assignedToIds`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_onboards`
--

LOCK TABLES `project_onboards` WRITE;
/*!40000 ALTER TABLE `project_onboards` DISABLE KEYS */;
INSERT INTO `project_onboards` VALUES (0,NULL,'dummy','dummy company','[3]','[3]','[2]','{\"0\":\"\\\"\",\"1\":\"\\\\\",\"2\":{\"0\":\"\\\"\",\"keywordCount\":\"3\",\"blogCount\":\"3\"},\"3\":\"{\",\"4\":\"\\\\\",\"5\":\"\\\\\",\"6\":\"\\\\\",\"7\":\"\\\"\",\"8\":\"1\",\"9\":\"\\\\\",\"10\":\"\\\\\",\"11\":\"\\\\\",\"12\":\"\\\"\",\"13\":\":\",\"14\":\"{\",\"15\":\"\\\\\",\"16\":\"\\\\\",\"17\":\"\\\\\",\"18\":\"\\\"\",\"19\":\"t\",\"20\":\"e\",\"21\":\"c\",\"22\":\"h\",\"23\":\"n\",\"24\":\"o\",\"25\":\"l\",\"26\":\"o\",\"27\":\"g\",\"28\":\"y\",\"29\":\"\\\\\",\"30\":\"\\\\\",\"31\":\"\\\\\",\"32\":\"\\\"\",\"33\":\":\",\"34\":\"\\\\\",\"35\":\"\\\\\",\"36\":\"\\\\\",\"37\":\"\\\"\",\"38\":\"W\",\"39\":\"o\",\"40\":\"r\",\"41\":\"d\",\"42\":\"P\",\"43\":\"r\",\"44\":\"e\",\"45\":\"s\",\"46\":\"s\",\"47\":\"\\\\\",\"48\":\"\\\\\",\"49\":\"\\\\\",\"50\":\"\\\"\",\"51\":\"}\",\"52\":\",\",\"53\":\"\\\\\",\"54\":\"\\\\\",\"55\":\"\\\\\",\"56\":\"\\\"\",\"57\":\"2\",\"58\":\"\\\\\",\"59\":\"\\\\\",\"60\":\"\\\\\",\"61\":\"\\\"\",\"62\":\":\",\"63\":\"{\",\"64\":\"\\\\\",\"65\":\"\\\\\",\"66\":\"\\\\\",\"67\":\"\\\"\",\"68\":\"k\",\"69\":\"e\",\"70\":\"y\",\"71\":\"w\",\"72\":\"o\",\"73\":\"r\",\"74\":\"d\",\"75\":\"C\",\"76\":\"o\",\"77\":\"u\",\"78\":\"n\",\"79\":\"t\",\"80\":\"\\\\\",\"81\":\"\\\\\",\"82\":\"\\\\\",\"83\":\"\\\"\",\"84\":\":\",\"85\":\"\\\\\",\"86\":\"\\\\\",\"87\":\"\\\\\",\"88\":\"\\\"\",\"89\":\"2\",\"90\":\"0\",\"91\":\"\\\\\",\"92\":\"\\\\\",\"93\":\"\\\\\",\"94\":\"\\\"\",\"95\":\",\",\"96\":\"\\\\\",\"97\":\"\\\\\",\"98\":\"\\\\\",\"99\":\"\\\"\",\"100\":\"b\",\"101\":\"l\",\"102\":\"o\",\"103\":\"g\",\"104\":\"C\",\"105\":\"o\",\"106\":\"u\",\"107\":\"n\",\"108\":\"t\",\"109\":\"\\\\\",\"110\":\"\\\\\",\"111\":\"\\\\\",\"112\":\"\\\"\",\"113\":\":\",\"114\":\"\\\\\",\"115\":\"\\\\\",\"116\":\"\\\\\",\"117\":\"\\\"\",\"118\":\"5\",\"119\":\"\\\\\",\"120\":\"\\\\\",\"121\":\"\\\\\",\"122\":\"\\\"\",\"123\":\"}\",\"124\":\",\",\"125\":\"\\\\\",\"126\":\"\\\\\",\"127\":\"\\\\\",\"128\":\"\\\"\",\"129\":\"5\",\"130\":\"\\\\\",\"131\":\"\\\\\",\"132\":\"\\\\\",\"133\":\"\\\"\",\"134\":\":\",\"135\":\"{\",\"136\":\"\\\\\",\"137\":\"\\\\\",\"138\":\"\\\\\",\"139\":\"\\\"\",\"140\":\"s\",\"141\":\"u\",\"142\":\"b\",\"143\":\"S\",\"144\":\"e\",\"145\":\"r\",\"146\":\"v\",\"147\":\"i\",\"148\":\"c\",\"149\":\"e\",\"150\":\"s\",\"151\":\"\\\\\",\"152\":\"\\\\\",\"153\":\"\\\\\",\"154\":\"\\\"\",\"155\":\":\",\"156\":\"[\",\"157\":\"\\\\\",\"158\":\"\\\\\",\"159\":\"\\\\\",\"160\":\"\\\"\",\"161\":\"P\",\"162\":\"o\",\"163\":\"s\",\"164\":\"t\",\"165\":\"e\",\"166\":\"r\",\"167\":\"\\\\\",\"168\":\"\\\\\",\"169\":\"\\\\\",\"170\":\"\\\"\",\"171\":\",\",\"172\":\"\\\\\",\"173\":\"\\\\\",\"174\":\"\\\\\",\"175\":\"\\\"\",\"176\":\"R\",\"177\":\"e\",\"178\":\"e\",\"179\":\"l\",\"180\":\"s\",\"181\":\"\\\\\",\"182\":\"\\\\\",\"183\":\"\\\\\",\"184\":\"\\\"\",\"185\":\"]\",\"186\":\"}\",\"187\":\"}\",\"188\":\"\\\\\",\"189\":\"\\\"\",\"190\":\"\\\"\"}','[]',NULL,'Pending',1,'2026-08-26 06:54:24','2026-08-29 06:33:32',NULL);
/*!40000 ALTER TABLE `project_onboards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recruitments`
--

DROP TABLE IF EXISTS `recruitments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recruitments` (
  `rid` int NOT NULL AUTO_INCREMENT,
  `cifid` int NOT NULL,
  `interviewDateTime` datetime DEFAULT NULL,
  `interviewMode` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hrScreeningFeedback` text COLLATE utf8mb4_general_ci,
  `technicalInterviewFeedback` text COLLATE utf8mb4_general_ci,
  `mdFeedback` text COLLATE utf8mb4_general_ci,
  `recruitmentStatus` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `statusChangeNote` text COLLATE utf8mb4_general_ci,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`rid`),
  KEY `cifid` (`cifid`),
  CONSTRAINT `recruitments_ibfk_1` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recruitments`
--

LOCK TABLES `recruitments` WRITE;
/*!40000 ALTER TABLE `recruitments` DISABLE KEYS */;
INSERT INTO `recruitments` VALUES (1,1,'2026-08-20 07:08:00','Offline','gud','gud','gud','Selected','gud','2026-08-26 04:08:41','2026-08-26 04:08:41',NULL),(2,4,'2026-08-06 19:40:00','Online','Nice ','Good','','Selected','round 1','2026-08-29 06:44:09','2026-08-29 06:47:47',NULL),(3,6,'2026-08-28 20:00:00','Offline','gud','gud','gud','Selected','','2026-08-31 09:19:49','2026-08-31 09:20:44',NULL),(4,5,'2026-08-30 22:41:00','Offline','','','','Interviewing','','2026-08-31 09:20:11','2026-08-31 10:40:40',NULL);
/*!40000 ALTER TABLE `recruitments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `token` text COLLATE utf8mb4_general_ci NOT NULL,
  `deviceId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `deviceName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `browser` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `os` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ipAddress` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `userAgent` text COLLATE utf8mb4_general_ci,
  `rotatedFromTokenId` int DEFAULT NULL,
  `lastUsedAt` datetime DEFAULT NULL,
  `expiresAt` datetime NOT NULL,
  `isRevoked` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `refresh_tokens_user_id` (`userId`),
  KEY `refresh_tokens_token` (`token`(768)),
  KEY `refresh_tokens_is_revoked` (`isRevoked`),
  KEY `refresh_tokens_expires_at` (`expiresAt`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (1,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzg2NTExMTIzLCJleHAiOjE3ODcxMTU5MjN9.9myqdHiGtFqcWI9EWt7GR1Q41GCwaZ16LoAxuslNSLM',NULL,'Desktop',NULL,NULL,'::1',NULL,NULL,'2026-08-12 05:05:23','2026-08-19 05:05:23',0,'2026-08-12 05:05:23','2026-08-12 05:05:23'),(2,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg2NTExMzQ2LCJleHAiOjE3ODcxMTYxNDZ9.s95y2eYHbWODkWtaDeyG3d6ICnVG4SHu8bMNyA4Kra4',NULL,'Desktop',NULL,NULL,'::1',NULL,NULL,'2026-08-12 05:09:06','2026-08-19 05:09:06',0,'2026-08-12 05:09:06','2026-08-12 05:09:06'),(3,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg2NTEyNTIzLCJleHAiOjE3ODcxMTczMjN9.uSQNzYg6XBOyWg-FrJyiVBWSgyGJJWnGV48rbRIfxWw',NULL,'Desktop','Electron','Windows','::1',NULL,NULL,'2026-08-12 05:28:43','2026-08-19 05:28:43',0,'2026-08-12 05:28:43','2026-08-12 05:28:43'),(4,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg2NTEyNTI5LCJleHAiOjE3ODcxMTczMjl9.78p-ktfeoPpkvCI6jHpuBNE87tJmdnefiXDqp5rt1DM',NULL,'Desktop','Chrome','Windows','::1',NULL,NULL,'2026-08-12 05:28:49','2026-08-19 05:28:49',1,'2026-08-12 05:28:49','2026-08-12 12:24:07'),(5,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg2NTE3MzM5LCJleHAiOjE3ODcxMjIxMzl9.agY41oKtOp5K9myiZ08PKXnqXDkTZF1eN9Jw4RpFJRg',NULL,'Desktop','Chrome','Windows','::1',NULL,NULL,'2026-08-12 06:48:59','2026-08-19 06:48:59',0,'2026-08-12 06:48:59','2026-08-12 06:48:59'),(6,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg2NTM3ODE1LCJleHAiOjE3ODcxNDI2MTV9.QCty1Ib690DEDDZY_0zDuPcCalRhSJXsdsDEcAtsEqQ',NULL,'Desktop','Chrome','Windows','::1',NULL,NULL,'2026-08-12 12:30:15','2026-08-19 12:30:15',0,'2026-08-12 12:30:15','2026-08-12 12:30:15'),(7,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg2NjgxNzM1LCJleHAiOjE3ODcyODY1MzV9.2e4ZjWQ7k3ke8HgD4N8623Ew1WaS-fuYx-WQsXZknfU',NULL,'Desktop','Chrome','Windows','::1',NULL,NULL,'2026-08-14 04:28:55','2026-08-21 04:28:55',0,'2026-08-14 04:28:55','2026-08-14 04:28:55'),(8,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg2Njg3MzQ2LCJleHAiOjE3ODcyOTIxNDZ9.__WSqpD9VBaUEBRU8xWkNqZbbUWaoiF133TPr0OUX6I',NULL,NULL,NULL,NULL,NULL,NULL,3,'2026-08-14 06:02:26','2026-08-21 06:02:26',0,'2026-08-14 06:02:26','2026-08-14 06:02:26'),(9,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg2Njg3MzQ2LCJleHAiOjE3ODcyOTIxNDZ9.__WSqpD9VBaUEBRU8xWkNqZbbUWaoiF133TPr0OUX6I',NULL,NULL,NULL,NULL,NULL,NULL,3,'2026-08-14 06:02:26','2026-08-21 06:02:26',0,'2026-08-14 06:02:26','2026-08-14 06:02:26'),(10,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg2OTM5NDUyLCJleHAiOjE3ODc1NDQyNTJ9.Gkc1SHVVIAgoEoG8VfW2Hb4m0Z8cfxzhzuknZHkkRzA',NULL,NULL,NULL,NULL,NULL,NULL,8,'2026-08-17 04:04:12','2026-08-24 04:04:12',0,'2026-08-17 04:04:12','2026-08-17 04:04:12'),(11,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg2OTM5NDUyLCJleHAiOjE3ODc1NDQyNTJ9.Gkc1SHVVIAgoEoG8VfW2Hb4m0Z8cfxzhzuknZHkkRzA',NULL,NULL,NULL,NULL,NULL,NULL,8,'2026-08-17 04:04:12','2026-08-24 04:04:12',0,'2026-08-17 04:04:12','2026-08-17 04:04:12'),(12,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg2OTM5NDY3LCJleHAiOjE3ODc1NDQyNjd9.ftqb6zBwzc1CXW9ebMTVhdRmGI4W7O8df5e6F8-o3mk',NULL,NULL,NULL,NULL,NULL,NULL,7,'2026-08-17 04:04:27','2026-08-24 04:04:27',1,'2026-08-17 04:04:27','2026-08-17 05:03:53'),(13,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg2OTM5NDY3LCJleHAiOjE3ODc1NDQyNjd9.ftqb6zBwzc1CXW9ebMTVhdRmGI4W7O8df5e6F8-o3mk',NULL,NULL,NULL,NULL,NULL,NULL,7,'2026-08-17 04:04:27','2026-08-24 04:04:27',1,'2026-08-17 04:04:27','2026-08-17 05:03:53'),(14,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg2OTQzMDM4LCJleHAiOjE3ODc1NDc4Mzh9.suhWqrgd_LUw7nwe12pJtXF4H11CLaZqSvx1H7zJG1s',NULL,'Desktop','Chrome','Windows','::1',NULL,NULL,'2026-08-17 05:03:58','2026-08-24 05:03:58',0,'2026-08-17 05:03:58','2026-08-17 05:03:58'),(15,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg3MDI2OTU0LCJleHAiOjE3ODc2MzE3NTR9.NmMubZ5gXFNmgNfhhurZVFptdWnk7uglcRB0SilW9WM',NULL,'Desktop','Chrome','Windows','::1',NULL,NULL,'2026-08-18 04:22:34','2026-08-25 04:22:34',0,'2026-08-18 04:22:34','2026-08-18 04:22:34'),(16,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg3MDM0NTEyLCJleHAiOjE3ODc2MzkzMTJ9.tlpOvq7ljPm6oHETGvgjP-rkJ82GFpmk3lvlLQpzF6w',NULL,'Desktop','Chrome','Windows','::1',NULL,NULL,'2026-08-18 06:28:32','2026-08-25 06:28:32',1,'2026-08-18 06:28:32','2026-08-18 09:14:24'),(17,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg3MDQ0NDY4LCJleHAiOjE3ODc2NDkyNjh9.4EXlcyMInbm0z5sVR1jnfFLAP8G6ymwsweSW-SqGSns',NULL,'Desktop','Chrome','Windows','::1',NULL,NULL,'2026-08-18 09:14:28','2026-08-25 09:14:28',0,'2026-08-18 09:14:28','2026-08-18 09:14:28'),(18,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg3MTE2ODkxLCJleHAiOjE3ODc3MjE2OTF9.Gc0Bw6138069u82onjkGXmzKvyQCpWoAXnbXQLXH_Ew',NULL,NULL,NULL,NULL,NULL,NULL,10,'2026-08-19 05:21:31','2026-08-26 05:21:31',0,'2026-08-19 05:21:31','2026-08-19 05:21:31'),(19,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg3MTE2ODkxLCJleHAiOjE3ODc3MjE2OTF9.Gc0Bw6138069u82onjkGXmzKvyQCpWoAXnbXQLXH_Ew',NULL,NULL,NULL,NULL,NULL,NULL,10,'2026-08-19 05:21:31','2026-08-26 05:21:31',0,'2026-08-19 05:21:31','2026-08-19 05:21:31'),(20,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg3NzE3MjA5LCJleHAiOjE3ODgzMjIwMDl9.odBy2vkDyQgDgxGbhPLYk7dFXVTA7F7Lloz4NgPotc0',NULL,'Desktop','Chrome','Windows','::1',NULL,NULL,'2026-08-26 04:06:49','2026-09-02 04:06:49',0,'2026-08-26 04:06:49','2026-08-26 04:06:49'),(21,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg3NzE4Nzg0LCJleHAiOjE3ODgzMjM1ODR9.TcAmxCIml-vsgazXMr9Uxn4eFKn7KZu5Agt8mU4yWS8',NULL,NULL,NULL,NULL,NULL,NULL,18,'2026-08-26 04:33:04','2026-09-02 04:33:04',0,'2026-08-26 04:33:04','2026-08-26 04:33:04'),(22,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg3NzE4Nzg0LCJleHAiOjE3ODgzMjM1ODR9.TcAmxCIml-vsgazXMr9Uxn4eFKn7KZu5Agt8mU4yWS8',NULL,NULL,NULL,NULL,NULL,NULL,18,'2026-08-26 04:33:04','2026-09-02 04:33:04',0,'2026-08-26 04:33:04','2026-08-26 04:33:04'),(23,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg3ODM5ODk3LCJleHAiOjE3ODg0NDQ2OTd9.fJQ94mwWCrZXOfJmJDhHQ1BhKWwIhdTLLVMIM0VQKT8',NULL,'Desktop','Chrome','Windows','::1',NULL,NULL,'2026-08-27 14:11:37','2026-09-03 14:11:37',0,'2026-08-27 14:11:37','2026-08-27 14:11:37'),(24,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg3ODg5NjE0LCJleHAiOjE3ODg0OTQ0MTR9.iHgErjZWcMppnTq1ApN22SmDMAKPtSS_e_55EZ_WVJs',NULL,NULL,NULL,NULL,NULL,NULL,20,'2026-08-28 04:00:14','2026-09-04 04:00:14',1,'2026-08-28 04:00:14','2026-08-28 07:07:12'),(25,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg3ODg5NjE0LCJleHAiOjE3ODg0OTQ0MTR9.iHgErjZWcMppnTq1ApN22SmDMAKPtSS_e_55EZ_WVJs',NULL,NULL,NULL,NULL,NULL,NULL,20,'2026-08-28 04:00:14','2026-09-04 04:00:14',1,'2026-08-28 04:00:14','2026-08-28 07:07:12'),(26,3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzg3OTAwODcyLCJleHAiOjE3ODg1MDU2NzJ9.NYF5q7dOabSwBsmgAPKpsGaZqsg57vR7uWL3GRaxCMk',NULL,'Desktop','Chrome','Windows','::1',NULL,NULL,'2026-08-28 07:07:52','2026-09-04 07:07:52',1,'2026-08-28 07:07:52','2026-08-28 07:08:32'),(27,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg3OTAxMDE5LCJleHAiOjE3ODg1MDU4MTl9.DKMksvbXaQMpvykdS8OUMNK3ajWoQQkAV16zwOmajaY',NULL,'Desktop','Chrome','Windows','::1',NULL,NULL,'2026-08-28 07:10:19','2026-09-04 07:10:19',0,'2026-08-28 07:10:19','2026-08-28 07:10:19'),(28,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg3OTE3ODk0LCJleHAiOjE3ODg1MjI2OTR9.mEwMHtpYDr1mEsxUvibDkjPBaWpPOkKfu2OCfwvqqng',NULL,NULL,NULL,NULL,NULL,NULL,21,'2026-08-28 11:51:34','2026-09-04 11:51:34',1,'2026-08-28 11:51:34','2026-08-28 11:51:38'),(29,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg3OTE3ODk0LCJleHAiOjE3ODg1MjI2OTR9.mEwMHtpYDr1mEsxUvibDkjPBaWpPOkKfu2OCfwvqqng',NULL,NULL,NULL,NULL,NULL,NULL,21,'2026-08-28 11:51:34','2026-09-04 11:51:34',1,'2026-08-28 11:51:34','2026-08-28 11:51:38'),(30,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg3OTE3OTY5LCJleHAiOjE3ODg1MjI3Njl9.HGWSYKYwsgTfv_2ni1aO_nYJ1_hpaXfhcI-dkYypYVE',NULL,'Desktop','Chrome','Windows','::1',NULL,NULL,'2026-08-28 11:52:49','2026-09-04 11:52:49',0,'2026-08-28 11:52:49','2026-08-28 11:52:49'),(31,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg3OTE5Njc5LCJleHAiOjE3ODg1MjQ0Nzl9.CfYMGuRNmd1UD014bAb6akoT0kf5ustYP9_JaUVFCRo',NULL,'Desktop','Chrome','Windows','::1',NULL,NULL,'2026-08-28 12:21:19','2026-09-04 12:21:19',1,'2026-08-28 12:21:19','2026-08-29 04:17:13'),(32,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg3OTc3MDQxLCJleHAiOjE3ODg1ODE4NDF9.UACpmd40Dp5tXNrIBp7DySonqX0qkc-ZTYhukuLmJGA',NULL,'Desktop','Chrome','Windows','::1',NULL,NULL,'2026-08-29 04:17:21','2026-09-05 04:17:21',1,'2026-08-29 04:17:21','2026-08-29 11:31:07'),(33,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg4MDAzMDc0LCJleHAiOjE3ODg2MDc4NzR9.DY9p4ySyqPu5FPyMQdM7yJc8Chh7tFHUhlqXJVXk9lk',NULL,'Desktop','Chrome','Windows','::1',NULL,NULL,'2026-08-29 11:31:14','2026-09-05 11:31:14',0,'2026-08-29 11:31:14','2026-08-29 11:31:14'),(34,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg4MTYzNzE0LCJleHAiOjE3ODg3Njg1MTR9.-GHWRMonq_t5JBmryEl9sPOogTfc0e95BK_4OSqldJY',NULL,NULL,NULL,NULL,NULL,NULL,33,'2026-08-31 08:08:34','2026-09-07 08:08:34',0,'2026-08-31 08:08:34','2026-08-31 08:08:34'),(35,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg4MTYzNzE0LCJleHAiOjE3ODg3Njg1MTR9.-GHWRMonq_t5JBmryEl9sPOogTfc0e95BK_4OSqldJY',NULL,NULL,NULL,NULL,NULL,NULL,33,'2026-08-31 08:08:34','2026-09-07 08:08:34',0,'2026-08-31 08:08:34','2026-08-31 08:08:34'),(36,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg4MTgzOTA4LCJleHAiOjE3ODg3ODg3MDh9.zgwUAIOLfzF88G_glZKw4CSq0GXgM6IzzZObNhkKVsQ',NULL,'Desktop','Edge','Windows','::1',NULL,NULL,'2026-08-31 13:45:08','2026-09-07 13:45:08',1,'2026-08-31 13:45:08','2026-08-31 15:25:52'),(37,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg4MTg5OTYxLCJleHAiOjE3ODg3OTQ3NjF9.WFQ1PZj7DSRnr_46L2LADBPVISQCWzlOGpFS8QfS9Ok',NULL,'Desktop','Edge','Windows','::1',NULL,NULL,'2026-08-31 15:26:01','2026-09-07 15:26:01',1,'2026-08-31 15:26:01','2026-08-31 17:03:09'),(38,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzg4MTk1ODIyLCJleHAiOjE3ODg4MDA2MjJ9.m-MjfmfKn6GYVkbW9pwbuZ5FxFDphT274bfvdrdBZwU',NULL,'Desktop','Edge','Windows','::1',NULL,NULL,'2026-08-31 17:03:42','2026-09-07 17:03:42',1,'2026-08-31 17:03:42','2026-08-31 17:03:46'),(39,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzg4MTk1OTAyLCJleHAiOjE3ODg4MDA3MDJ9.7T6j8b-f-NTfovfAkpcD9JwF3QaYF133gXmXgDtPfJM',NULL,'Desktop','Edge','Windows','::1',NULL,NULL,'2026-08-31 17:05:02','2026-09-07 17:05:02',1,'2026-08-31 17:05:02','2026-08-31 17:10:01'),(40,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzg4MTk2MjEzLCJleHAiOjE3ODg4MDEwMTN9.KErMAr-wTUJhnP0C23lractha_q1AZ9YvwuweCL4Rmw',NULL,'Desktop','Edge','Windows','::1',NULL,NULL,'2026-08-31 17:10:13','2026-09-07 17:10:13',1,'2026-08-31 17:10:13','2026-08-31 17:11:06'),(41,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzg4MTk2MjgzLCJleHAiOjE3ODg4MDEwODN9.r6gfG3eNgX4_GRYH1uuxxjBV9I18iTXg6FZLU3SKEnU',NULL,'Desktop','Edge','Windows','::1',NULL,NULL,'2026-08-31 17:11:23','2026-09-07 17:11:23',1,'2026-08-31 17:11:23','2026-08-31 17:12:10'),(42,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzg4MTk2MzM3LCJleHAiOjE3ODg4MDExMzd9.NW3fUnsG9TW_n1fwWSQy-9HzVAskz05En4A2QjQfn6Y',NULL,'Desktop','Edge','Windows','::1',NULL,NULL,'2026-08-31 17:12:17','2026-09-07 17:12:17',1,'2026-08-31 17:12:17','2026-08-31 17:38:27'),(43,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzg4MTk3OTQxLCJleHAiOjE3ODg4MDI3NDF9.1fWx3YgTqrobyitcTa5AwbzzXmWWyVhabNWPMiiJwHE',NULL,'Desktop','Edge','Windows','::1',NULL,NULL,'2026-08-31 17:39:01','2026-09-07 17:39:01',1,'2026-08-31 17:39:01','2026-08-31 17:40:38'),(44,4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzg4MTk4MDY0LCJleHAiOjE3ODg4MDI4NjR9.bTYcKLA7eMCeWspZNUX9bGN51df5_6HZ8vXy6ByeQPQ',NULL,'Desktop','Edge','Windows','::1',NULL,NULL,'2026-08-31 17:41:04','2026-09-07 17:41:04',0,'2026-08-31 17:41:04','2026-08-31 17:41:04');
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `roleId` int NOT NULL,
  `permissionId` int NOT NULL,
  PRIMARY KEY (`roleId`,`permissionId`),
  UNIQUE KEY `role_permissions_permissionId_roleId_unique` (`roleId`,`permissionId`),
  KEY `permissionId` (`permissionId`),
  CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permissionId`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `code` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `name_2` (`name`),
  UNIQUE KEY `code_2` (`code`),
  UNIQUE KEY `name_3` (`name`),
  UNIQUE KEY `code_3` (`code`),
  UNIQUE KEY `name_4` (`name`),
  UNIQUE KEY `code_4` (`code`),
  UNIQUE KEY `name_5` (`name`),
  UNIQUE KEY `code_5` (`code`),
  UNIQUE KEY `name_6` (`name`),
  UNIQUE KEY `code_6` (`code`),
  UNIQUE KEY `name_7` (`name`),
  UNIQUE KEY `code_7` (`code`),
  UNIQUE KEY `name_8` (`name`),
  UNIQUE KEY `code_8` (`code`),
  UNIQUE KEY `name_9` (`name`),
  UNIQUE KEY `code_9` (`code`),
  UNIQUE KEY `name_10` (`name`),
  UNIQUE KEY `code_10` (`code`),
  UNIQUE KEY `name_11` (`name`),
  UNIQUE KEY `code_11` (`code`),
  UNIQUE KEY `name_12` (`name`),
  UNIQUE KEY `code_12` (`code`),
  UNIQUE KEY `name_13` (`name`),
  UNIQUE KEY `code_13` (`code`),
  UNIQUE KEY `name_14` (`name`),
  UNIQUE KEY `code_14` (`code`),
  UNIQUE KEY `name_15` (`name`),
  UNIQUE KEY `code_15` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Super Admin','SUPER_ADMIN','Full system access',1,'2026-08-12 05:00:45','2026-08-31 16:55:05',NULL),(2,'CRM Executive','CRM_EXECUTIVE','Lead management for assigned users',1,'2026-08-28 06:53:56','2026-08-31 16:55:05',NULL),(3,'Manager','MANAGER','Project, task, and vendor operations',1,'2026-08-31 16:55:06','2026-08-31 16:55:06',NULL),(4,'HR','HR','Hiring, onboarding, payroll, and employee operations',1,'2026-08-31 16:55:06','2026-08-31 16:55:06',NULL);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequelizemeta`
--

LOCK TABLES `sequelizemeta` WRITE;
/*!40000 ALTER TABLE `sequelizemeta` DISABLE KEYS */;
INSERT INTO `sequelizemeta` VALUES ('20260829000100-add-file-url-to-onboarding-documents.js'),('20260831000100-add-form-data-to-onboarding-records.js'),('20260831000200-fix-employees-id-auto-increment.js'),('20260831000300-create-leave-management-tables.js'),('20260831000400-create-payrolls-table.js');
/*!40000 ALTER TABLE `sequelizemeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_categories`
--

DROP TABLE IF EXISTS `service_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `code` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `color` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `displayOrder` int DEFAULT '1',
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `name_2` (`name`),
  UNIQUE KEY `code_2` (`code`),
  UNIQUE KEY `name_3` (`name`),
  UNIQUE KEY `code_3` (`code`),
  UNIQUE KEY `name_4` (`name`),
  UNIQUE KEY `code_4` (`code`),
  UNIQUE KEY `name_5` (`name`),
  UNIQUE KEY `code_5` (`code`),
  UNIQUE KEY `name_6` (`name`),
  UNIQUE KEY `code_6` (`code`),
  UNIQUE KEY `name_7` (`name`),
  UNIQUE KEY `code_7` (`code`),
  UNIQUE KEY `name_8` (`name`),
  UNIQUE KEY `code_8` (`code`),
  UNIQUE KEY `name_9` (`name`),
  UNIQUE KEY `code_9` (`code`),
  UNIQUE KEY `name_10` (`name`),
  UNIQUE KEY `code_10` (`code`),
  UNIQUE KEY `name_11` (`name`),
  UNIQUE KEY `code_11` (`code`),
  UNIQUE KEY `name_12` (`name`),
  UNIQUE KEY `code_12` (`code`),
  UNIQUE KEY `name_13` (`name`),
  UNIQUE KEY `code_13` (`code`),
  UNIQUE KEY `name_14` (`name`),
  UNIQUE KEY `code_14` (`code`),
  UNIQUE KEY `name_15` (`name`),
  UNIQUE KEY `code_15` (`code`),
  UNIQUE KEY `name_16` (`name`),
  UNIQUE KEY `code_16` (`code`),
  UNIQUE KEY `name_17` (`name`),
  UNIQUE KEY `code_17` (`code`),
  UNIQUE KEY `name_18` (`name`),
  UNIQUE KEY `code_18` (`code`),
  UNIQUE KEY `name_19` (`name`),
  UNIQUE KEY `code_19` (`code`),
  UNIQUE KEY `name_20` (`name`),
  UNIQUE KEY `code_20` (`code`),
  UNIQUE KEY `name_21` (`name`),
  UNIQUE KEY `code_21` (`code`),
  UNIQUE KEY `name_22` (`name`),
  UNIQUE KEY `code_22` (`code`),
  UNIQUE KEY `name_23` (`name`),
  UNIQUE KEY `code_23` (`code`),
  UNIQUE KEY `name_24` (`name`),
  UNIQUE KEY `code_24` (`code`),
  UNIQUE KEY `name_25` (`name`),
  UNIQUE KEY `code_25` (`code`),
  UNIQUE KEY `name_26` (`name`),
  UNIQUE KEY `code_26` (`code`),
  UNIQUE KEY `name_27` (`name`),
  UNIQUE KEY `code_27` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_categories`
--

LOCK TABLES `service_categories` WRITE;
/*!40000 ALTER TABLE `service_categories` DISABLE KEYS */;
INSERT INTO `service_categories` VALUES (1,'Digital Marketing','DM','#2563EB',1,1,'2026-08-12 05:09:44','2026-08-12 06:28:33',NULL),(3,'Operations','OP','#eb24e4',3,1,'2026-08-13 05:46:28','2026-08-13 05:46:36',NULL),(4,'Web Development','WEB','#24e7eb',4,1,'2026-08-13 05:52:47','2026-08-13 05:52:47',NULL),(5,'Content','CONTENT','#e9944e',5,1,'2026-08-13 05:53:16','2026-08-13 05:53:16',NULL),(6,'Designer','DESIGNER','#eb4224',6,1,'2026-08-26 07:27:06','2026-08-26 07:27:15',NULL),(7,'Media','MEDIA','#24eb94',6,1,'2026-08-29 03:59:49','2026-08-29 04:00:10',NULL),(8,'asdfgh','asdfgh','#eb5524',1,1,'2026-08-29 12:15:09','2026-08-29 12:15:09',NULL);
/*!40000 ALTER TABLE `service_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `serviceCategoryId` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `code` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `displayOrder` int DEFAULT '1',
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `code_2` (`code`),
  UNIQUE KEY `code_3` (`code`),
  UNIQUE KEY `code_4` (`code`),
  UNIQUE KEY `code_5` (`code`),
  UNIQUE KEY `code_6` (`code`),
  UNIQUE KEY `code_7` (`code`),
  UNIQUE KEY `code_8` (`code`),
  UNIQUE KEY `code_9` (`code`),
  UNIQUE KEY `code_10` (`code`),
  UNIQUE KEY `code_11` (`code`),
  UNIQUE KEY `code_12` (`code`),
  UNIQUE KEY `code_13` (`code`),
  UNIQUE KEY `code_14` (`code`),
  UNIQUE KEY `code_15` (`code`),
  UNIQUE KEY `code_16` (`code`),
  UNIQUE KEY `code_17` (`code`),
  UNIQUE KEY `code_18` (`code`),
  UNIQUE KEY `code_19` (`code`),
  UNIQUE KEY `code_20` (`code`),
  UNIQUE KEY `code_21` (`code`),
  UNIQUE KEY `code_22` (`code`),
  UNIQUE KEY `code_23` (`code`),
  UNIQUE KEY `code_24` (`code`),
  UNIQUE KEY `code_25` (`code`),
  KEY `serviceCategoryId` (`serviceCategoryId`),
  CONSTRAINT `services_ibfk_1` FOREIGN KEY (`serviceCategoryId`) REFERENCES `service_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,1,'Website','SITE',1,1,'2026-08-04 07:44:25','2026-08-04 07:44:25',NULL),(2,1,'SEO','SEO',2,1,'2026-08-04 07:44:47','2026-08-04 07:44:47',NULL),(5,1,'SMM','SMM',3,1,'2026-08-13 06:52:56','2026-08-13 06:52:56',NULL),(6,6,'Graphics Designer','GD',1,1,'2026-08-26 07:27:51','2026-08-26 07:27:51',NULL),(7,7,'Photography','Photography',1,1,'2026-08-29 04:18:55','2026-08-29 04:18:55',NULL),(8,7,'Videoshoot','Videoshoot',2,1,'2026-08-29 04:19:15','2026-08-29 04:19:15',NULL),(9,8,'fghk','gh',1,1,'2026-08-29 12:15:42','2026-08-29 12:15:42',NULL);
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `userId` int NOT NULL,
  `roleId` int NOT NULL,
  PRIMARY KEY (`userId`,`roleId`),
  UNIQUE KEY `user_roles_roleId_userId_unique` (`userId`,`roleId`),
  KEY `roleId` (`roleId`),
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (1,1),(4,1),(3,2);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `firstName` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `lastName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `employeeRecord` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `username_2` (`username`),
  UNIQUE KEY `username_3` (`username`),
  UNIQUE KEY `username_4` (`username`),
  UNIQUE KEY `username_5` (`username`),
  UNIQUE KEY `username_6` (`username`),
  UNIQUE KEY `username_7` (`username`),
  UNIQUE KEY `username_8` (`username`),
  UNIQUE KEY `username_9` (`username`),
  UNIQUE KEY `username_10` (`username`),
  UNIQUE KEY `username_11` (`username`),
  UNIQUE KEY `username_12` (`username`),
  UNIQUE KEY `username_13` (`username`),
  UNIQUE KEY `username_14` (`username`),
  UNIQUE KEY `username_15` (`username`),
  UNIQUE KEY `username_16` (`username`),
  UNIQUE KEY `username_17` (`username`),
  UNIQUE KEY `username_18` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'fbcb72e0-85cd-4a50-8fe1-c26a4b44d914','Superadmin',NULL,'admin@gmail.com','Superadmin',NULL,'admin','$2b$10$cfw/OB7x0/I9q//ycdQQwe4VEGnPdgubHw1hUzVc4VaX3V9OZRZP6',1,'2026-08-12 05:05:18','2026-08-28 06:55:36',NULL),(3,'b266b1e5-5068-46de-96b5-83ce58f98343','Prabu','NS','prabuns@khosocial.com','Prabu',NULL,NULL,'$2b$10$FBfFGhtdcA4UQuiDupMHkuAP7.xthgB6jlojqrsqFXeStgIMIRDvG',1,'2026-08-28 06:55:10','2026-08-28 06:55:10',NULL),(4,'a9cae48c-6306-4f2e-b1f8-42f253023782','nandhu',NULL,'nandhu29696@gmail.com','Nandhu29',NULL,'Superadmin (admin@gmail.com)','$2b$10$LGFcvRM849ko.ypdJEK8y.Xj9QdymLGp5fR0/8uIaDqQ4Za5z/6gS',1,'2026-08-31 17:02:58','2026-08-31 17:02:58',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ventor_services`
--

DROP TABLE IF EXISTS `ventor_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ventor_services` (
  `vserid` int NOT NULL AUTO_INCREMENT,
  `vid` int NOT NULL,
  `service_type` int NOT NULL,
  `perpagecost` int NOT NULL,
  `perdaycost` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`vserid`),
  KEY `vid` (`vid`),
  KEY `service_type` (`service_type`),
  CONSTRAINT `ventor_services_ibfk_1` FOREIGN KEY (`vid`) REFERENCES `ventors` (`vid`),
  CONSTRAINT `ventor_services_ibfk_2` FOREIGN KEY (`service_type`) REFERENCES `services` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventor_services`
--

LOCK TABLES `ventor_services` WRITE;
/*!40000 ALTER TABLE `ventor_services` DISABLE KEYS */;
/*!40000 ALTER TABLE `ventor_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ventors`
--

DROP TABLE IF EXISTS `ventors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ventors` (
  `vid` int NOT NULL AUTO_INCREMENT,
  `ventor_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `ventor_email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `ventor_phone` varchar(15) COLLATE utf8mb4_general_ci NOT NULL,
  `ventor_company` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `service_name` int DEFAULT NULL,
  `service_type` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`vid`),
  UNIQUE KEY `ventor_email` (`ventor_email`),
  KEY `service_name` (`service_name`),
  KEY `service_type` (`service_type`),
  CONSTRAINT `ventors_ibfk_1` FOREIGN KEY (`service_name`) REFERENCES `service_categories` (`id`),
  CONSTRAINT `ventors_ibfk_2` FOREIGN KEY (`service_type`) REFERENCES `services` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventors`
--

LOCK TABLES `ventors` WRITE;
/*!40000 ALTER TABLE `ventors` DISABLE KEYS */;
INSERT INTO `ventors` VALUES (1,'Clarke','Clarke@gmail.com','9876543210','Clarke and Alford Trading',NULL,NULL,'2026-08-28 12:00:34','2026-08-29 03:58:37','2026-08-29 03:58:37');
/*!40000 ALTER TABLE `ventors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'kho_will'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-31 23:37:00
