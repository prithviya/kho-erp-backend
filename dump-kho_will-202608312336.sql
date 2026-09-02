-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: kho_erp
-- ------------------------------------------------------
-- Server version	8.0.46

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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate_education`
--

LOCK TABLES `candidate_education` WRITE;
/*!40000 ALTER TABLE `candidate_education` DISABLE KEYS */;
INSERT INTO `candidate_education` VALUES (1,1,'BSA','Anna university',NULL,'2020','8','CBE','2026-09-02 02:12:00','2026-09-02 02:42:22',NULL);
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate_experience`
--

LOCK TABLES `candidate_experience` WRITE;
/*!40000 ALTER TABLE `candidate_experience` DISABLE KEYS */;
INSERT INTO `candidate_experience` VALUES (1,1,'FSL','CBE','Developer','2026-09-03','2026-10-01',0.08,NULL,'2026-09-02 02:12:00','2026-09-02 02:42:22',NULL);
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate_languages`
--

LOCK TABLES `candidate_languages` WRITE;
/*!40000 ALTER TABLE `candidate_languages` DISABLE KEYS */;
INSERT INTO `candidate_languages` VALUES (1,1,'Tamil','Fluent','Fluent','Fluent','2026-09-02 02:12:00','2026-09-02 02:12:00',NULL);
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate_references`
--

LOCK TABLES `candidate_references` WRITE;
/*!40000 ALTER TABLE `candidate_references` DISABLE KEYS */;
INSERT INTO `candidate_references` VALUES (1,1,'Test','admin@gmail.com','888888888',1,'2026-09-02 02:12:00','2026-09-02 02:12:00',NULL);
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
  PRIMARY KEY (`id`)
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate_software`
--

LOCK TABLES `candidate_software` WRITE;
/*!40000 ALTER TABLE `candidate_software` DISABLE KEYS */;
INSERT INTO `candidate_software` VALUES (1,1,'Google','Excellent','2026-09-02 02:12:00','2026-09-02 02:12:00',NULL);
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
  UNIQUE KEY `candidates_email_applied_position_unique` (`email`,`appliedPosition`),
  KEY `appliedPosition` (`appliedPosition`),
  CONSTRAINT `candidates_ibfk_1` FOREIGN KEY (`appliedPosition`) REFERENCES `openings` (`jobid`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidates`
--

LOCK TABLES `candidates` WRITE;
/*!40000 ALTER TABLE `candidates` DISABLE KEYS */;
INSERT INTO `candidates` VALUES (1,'Nand','nand@gmail.com','8888888888','2008-08-07','Male','Married','CBE','CBE','TN','888888',NULL,NULL,NULL,NULL,'','http://localhost:5000/assets/resume/1788315120121-164669356.pdf',1,'2026-09-02 02:12:00','2026-09-02 02:12:00',NULL),(2,'Sample Candidate 1','sample1-1788315873610@example.com','9000000001','1998-01-15','Male','Single','Sample Street 1','Coimbatore','Tamil Nadu','641001',NULL,NULL,NULL,NULL,'https://example.com',NULL,NULL,'2026-09-02 02:24:33','2026-09-02 02:24:33',NULL),(3,'Sample Candidate 2','sample2-1788315873610@example.com','9000000002','1998-01-15','Female','Married','Sample Street 2','Coimbatore','Tamil Nadu','641001',NULL,NULL,NULL,NULL,'https://example.com',NULL,NULL,'2026-09-02 02:24:33','2026-09-02 02:24:33',NULL),(4,'Sample Candidate 3','sample3-1788315873610@example.com','9000000003','1998-01-15','Male','Married','Sample Street 3','Coimbatore','Tamil Nadu','641001',NULL,NULL,NULL,NULL,'https://example.com',NULL,NULL,'2026-09-02 02:24:33','2026-09-02 02:24:33',NULL),(5,'Sample Candidate 4','sample4-1788315873610@example.com','9000000004','1998-01-15','Female','Single','Sample Street 4','Coimbatore','Tamil Nadu','641001',NULL,NULL,NULL,NULL,'https://example.com',NULL,NULL,'2026-09-02 02:24:33','2026-09-02 02:24:33',NULL),(6,'Sample Candidate 5','sample5-1788315873610@example.com','9000000005','1998-01-15','Male','Married','Sample Street 5','Coimbatore','Tamil Nadu','641001',NULL,NULL,NULL,NULL,'https://example.com',NULL,NULL,'2026-09-02 02:24:33','2026-09-02 02:24:33',NULL),(7,'Sample Candidate 6','sample6-1788315873610@example.com','9000000006','1998-01-15','Female','Married','Sample Street 6','Coimbatore','Tamil Nadu','641001',NULL,NULL,NULL,NULL,'https://example.com',NULL,NULL,'2026-09-02 02:24:33','2026-09-02 02:24:33',NULL),(8,'Sample Candidate 7','sample7-1788315873610@example.com','9000000007','1998-01-15','Male','Single','Sample Street 7','Coimbatore','Tamil Nadu','641001',NULL,NULL,NULL,NULL,'https://example.com',NULL,NULL,'2026-09-02 02:24:33','2026-09-02 02:24:33',NULL),(9,'Sample Candidate 8','sample8-1788315873610@example.com','9000000008','1998-01-15','Female','Married','Sample Street 8','Coimbatore','Tamil Nadu','641001',NULL,NULL,NULL,NULL,'https://example.com',NULL,NULL,'2026-09-02 02:24:33','2026-09-02 02:24:33',NULL),(10,'Sample Candidate 9','sample9-1788315873610@example.com','9000000009','1998-01-15','Male','Married','Sample Street 9','Coimbatore','Tamil Nadu','641001',NULL,NULL,NULL,NULL,'https://example.com',NULL,NULL,'2026-09-02 02:24:33','2026-09-02 02:24:33',NULL),(11,'Sample Candidate 10','sample10-1788315873610@example.com','9000000010','1998-01-15','Female','Single','Sample Street 10','Coimbatore','Tamil Nadu','641001',NULL,NULL,NULL,NULL,'https://example.com',NULL,NULL,'2026-09-02 02:24:33','2026-09-02 02:24:33',NULL);
/*!40000 ALTER TABLE `candidates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'Operations',1,'2026-09-02 01:57:03','2026-09-02 01:57:03',NULL),(2,'Content',1,'2026-09-02 01:57:03','2026-09-02 01:57:03',NULL),(3,'Digital Marketing',1,'2026-09-02 01:57:03','2026-09-02 01:57:03',NULL),(4,'Web development',1,'2026-09-02 01:57:03','2026-09-02 01:57:03',NULL),(5,'Media',1,'2026-09-02 01:57:04','2026-09-02 01:57:04',NULL),(6,'Designs',1,'2026-09-02 01:57:04','2026-09-02 01:57:04',NULL);
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
  `employeeCode` varchar(30) NOT NULL,
  `jobPosition` varchar(255) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `dateOfBirth` date DEFAULT NULL,
  `city` varchar(120) DEFAULT NULL,
  `pinCode` varchar(20) DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `portfolioLink` varchar(500) DEFAULT NULL,
  `resumeOriginalName` varchar(255) DEFAULT NULL,
  `resumeStoredName` varchar(255) DEFAULT NULL,
  `resumeMimeType` varchar(120) DEFAULT NULL,
  `resumeSize` int DEFAULT NULL,
  `education` json NOT NULL,
  `workExperience` json NOT NULL,
  `skills` json NOT NULL,
  `softwareTools` json NOT NULL,
  `languages` json NOT NULL,
  `references` json NOT NULL,
  `consent` tinyint(1) NOT NULL DEFAULT '0',
  `status` varchar(50) NOT NULL DEFAULT 'Onboarding',
  `createdBy` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employeeCode` (`employeeCode`),
  UNIQUE KEY `email` (`email`),
  KEY `createdBy` (`createdBy`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'KHO-001','Software Engineer','Nand','nand@gmail.com','8888888888','2008-08-07','CBE','888888','Male',NULL,NULL,NULL,NULL,NULL,'[{\"year\": \"2020\", \"board\": \"Anna university\", \"percentage\": \"8\", \"institution\": \"Anna university\", \"qualification\": \"BSA\"}]','[{\"reason\": \"\", \"company\": \"FSL\", \"endDate\": \"2026-10-01\", \"totalExp\": \"0.08\", \"startDate\": \"2026-09-03\", \"designation\": \"Developer\"}]','[]','[{\"id\": 1, \"cifid\": 1, \"toolName\": \"Google\", \"createdAt\": \"2026-09-02T02:12:00.000Z\", \"deletedAt\": null, \"updatedAt\": \"2026-09-02T02:12:00.000Z\", \"candidateId\": 1, \"proficiencyLevel\": \"Excellent\"}]','[{\"id\": 1, \"cifid\": 1, \"createdAt\": \"2026-09-02T02:12:00.000Z\", \"deletedAt\": null, \"readLevel\": \"Fluent\", \"updatedAt\": \"2026-09-02T02:12:00.000Z\", \"speakLevel\": \"Fluent\", \"writeLevel\": \"Fluent\", \"candidateId\": 1, \"languageName\": \"Tamil\"}]','[{\"id\": 1, \"cifid\": 1, \"createdAt\": \"2026-09-02T02:12:00.000Z\", \"deletedAt\": null, \"updatedAt\": \"2026-09-02T02:12:00.000Z\", \"candidateId\": 1, \"referenceName\": \"Test\", \"referenceEmail\": \"admin@gmail.com\", \"referencePhone\": \"888888888\", \"consentConfirmed\": true}]',1,'Active',NULL,'2026-09-02 02:42:22','2026-09-02 02:42:22',NULL);
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
  PRIMARY KEY (`iid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inductions`
--

LOCK TABLES `inductions` WRITE;
/*!40000 ALTER TABLE `inductions` DISABLE KEYS */;
INSERT INTO `inductions` VALUES (1,1,1,1,1,0,1,0,0,'2026-09-02 02:41:27','2026-09-02 02:42:19',NULL);
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
  KEY `openingId` (`openingId`),
  CONSTRAINT `job_applications_ibfk_1` FOREIGN KEY (`openingId`) REFERENCES `openings` (`jobid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_applications`
--

LOCK TABLES `job_applications` WRITE;
/*!40000 ALTER TABLE `job_applications` DISABLE KEYS */;
INSERT INTO `job_applications` VALUES (1,1,NULL,'SHORTLISTED',NULL,NULL,'2026-09-02 02:12:00','2026-09-02 02:12:43',NULL);
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
  `notes` text,
  `changedBy` int NOT NULL,
  `createdAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `leadId` (`leadId`),
  KEY `changedBy` (`changedBy`),
  CONSTRAINT `lead_history_ibfk_1` FOREIGN KEY (`leadId`) REFERENCES `leads` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `lead_history_ibfk_2` FOREIGN KEY (`changedBy`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lead_history`
--

LOCK TABLES `lead_history` WRITE;
/*!40000 ALTER TABLE `lead_history` DISABLE KEYS */;
INSERT INTO `lead_history` VALUES (1,1,NULL,NULL,'Lead Created',1,'2026-09-02 02:29:36'),(2,1,4,4,'Lead Updated',1,'2026-09-02 02:29:50'),(3,1,3,3,'Lead Updated',1,'2026-09-02 02:30:02'),(4,1,7,7,'Lead Updated',1,'2026-09-02 02:30:11');
/*!40000 ALTER TABLE `lead_history` ENABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lead_services`
--

LOCK TABLES `lead_services` WRITE;
/*!40000 ALTER TABLE `lead_services` DISABLE KEYS */;
INSERT INTO `lead_services` VALUES (1,1),(1,4);
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
  `name` varchar(100) NOT NULL,
  `code` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `displayOrder` int DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lead_sources`
--

LOCK TABLES `lead_sources` WRITE;
/*!40000 ALTER TABLE `lead_sources` DISABLE KEYS */;
INSERT INTO `lead_sources` VALUES (1,'Email Campaign','EMAIL_CAMPAIGN','Lead generated from Email Campaign.',1,2,'2026-09-02 01:57:04','2026-09-02 01:57:04',NULL),(2,'Whatsapp','WHATSAPP','',1,1,'2026-09-02 01:57:04','2026-09-02 01:57:04',NULL),(3,'Instagram','INSTA','',1,3,'2026-09-02 01:57:04','2026-09-02 01:57:04',NULL),(4,'Facebook','FB','',1,4,'2026-09-02 01:57:04','2026-09-02 01:57:04',NULL),(5,'LinkedIn','LINKEDIN','',1,5,'2026-09-02 01:57:04','2026-09-02 01:57:04',NULL);
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
  `name` varchar(100) NOT NULL,
  `code` varchar(100) NOT NULL,
  `color` varchar(30) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `isDefault` tinyint(1) DEFAULT '0',
  `isClosed` tinyint(1) DEFAULT '0',
  `displayOrder` int DEFAULT '1',
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lead_statuses`
--

LOCK TABLES `lead_statuses` WRITE;
/*!40000 ALTER TABLE `lead_statuses` DISABLE KEYS */;
INSERT INTO `lead_statuses` VALUES (1,'On Hold','ON_HOLD','#9e9e9e','Lead is temporarily on hold and will be revisited later.',0,0,7,1,'2026-09-02 01:57:04','2026-09-02 01:57:04',NULL),(2,'New','NEW','#2563EB','A new lead awaiting initial contact.',1,0,1,1,'2026-09-02 01:57:04','2026-09-02 01:57:04',NULL),(3,'Contacted','CONTACTED','#eb9824','Initial contact has been made with the lead.',0,0,2,1,'2026-09-02 01:57:05','2026-09-02 01:57:05',NULL),(4,'Discussion','DISCUSSION','#eb248e','',0,0,3,1,'2026-09-02 01:57:05','2026-09-02 01:57:05',NULL),(5,'Proposal','PROPOSAL','#9124eb','A quotation or proposal has been shared with the lead.',0,0,4,1,'2026-09-02 01:57:05','2026-09-02 01:57:05',NULL),(6,'Negotiation','NEGOTIATION','#eb5524','',0,0,5,1,'2026-09-02 01:57:05','2026-09-02 01:57:05',NULL),(7,'Converted','CONVERTED','#24eb94','',0,1,6,1,'2026-09-02 01:57:05','2026-09-02 01:57:05',NULL);
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
  `companyName` varchar(150) NOT NULL,
  `contactPerson` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `requirement` text,
  `budget` decimal(12,2) DEFAULT NULL,
  `leadSourceId` int NOT NULL,
  `leadStatusId` int NOT NULL,
  `assignedTo` int DEFAULT NULL,
  `referralName` varchar(255) DEFAULT NULL,
  `notes` text,
  `nextFollowupDate` date DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `leadSourceId` (`leadSourceId`),
  KEY `leadStatusId` (`leadStatusId`),
  KEY `assignedTo` (`assignedTo`),
  CONSTRAINT `leads_ibfk_1` FOREIGN KEY (`leadSourceId`) REFERENCES `lead_sources` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `leads_ibfk_2` FOREIGN KEY (`leadStatusId`) REFERENCES `lead_statuses` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `leads_ibfk_3` FOREIGN KEY (`assignedTo`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leads`
--

LOCK TABLES `leads` WRITE;
/*!40000 ALTER TABLE `leads` DISABLE KEYS */;
INSERT INTO `leads` VALUES (1,'FSL','Nand','9999999999','na@gmail.com','test',3.00,2,7,1,NULL,'test','2026-09-18',1,'2026-09-02 02:29:36','2026-09-02 02:30:11',NULL);
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
INSERT INTO `leave_categories` VALUES (1,'CASUAL_LEAVE','Casual Leave','DAY',12.00,1,'2026-09-02 01:59:01','2026-09-02 02:37:02',NULL),(2,'LEAVE_WITHOUT_PAY','Leave Without Pay','DAY',12.00,1,'2026-09-02 01:59:01','2026-09-02 02:37:02',NULL),(3,'PERMISSION','Permission','HOUR',16.00,1,'2026-09-02 01:59:01','2026-09-02 02:37:02',NULL),(4,'ON_THE_DUTY','On The Duty','DAY',0.00,1,'2026-09-02 01:59:01','2026-09-02 02:37:03',NULL);
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
  KEY `userId` (`userId`),
  KEY `categoryId` (`categoryId`),
  KEY `approverId` (`approverId`),
  CONSTRAINT `leave_requests_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `leave_requests_ibfk_2` FOREIGN KEY (`categoryId`) REFERENCES `leave_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `leave_requests_ibfk_3` FOREIGN KEY (`approverId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_requests`
--

LOCK TABLES `leave_requests` WRITE;
/*!40000 ALTER TABLE `leave_requests` DISABLE KEYS */;
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
  `name` varchar(100) NOT NULL,
  `code` varchar(100) NOT NULL,
  `route` varchar(255) DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `displayOrder` int DEFAULT '0',
  `parentId` int DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  PRIMARY KEY (`otid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `office_tours`
--

LOCK TABLES `office_tours` WRITE;
/*!40000 ALTER TABLE `office_tours` DISABLE KEYS */;
INSERT INTO `office_tours` VALUES (1,1,1,1,0,1,1,0,'2026-09-02 02:41:27','2026-09-02 02:42:16',NULL);
/*!40000 ALTER TABLE `office_tours` ENABLE KEYS */;
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
  `accountHolderName` varchar(150) NOT NULL,
  `accountNumber` varchar(50) NOT NULL,
  `ifscCode` varchar(20) NOT NULL,
  `bankName` varchar(150) NOT NULL,
  `branchName` varchar(150) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`bid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `onboarding_banks`
--

LOCK TABLES `onboarding_banks` WRITE;
/*!40000 ALTER TABLE `onboarding_banks` DISABLE KEYS */;
INSERT INTO `onboarding_banks` VALUES (1,1,1,'test','55555555','sdfsdf345','dfgsd','sdfg','2026-09-02 02:41:27','2026-09-02 02:42:07',NULL);
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
  `documentType` varchar(100) NOT NULL,
  `fileName` varchar(255) NOT NULL,
  `file_url` varchar(512) DEFAULT NULL,
  `bid` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`did`),
  KEY `bid` (`bid`),
  CONSTRAINT `onboarding_documents_ibfk_1` FOREIGN KEY (`bid`) REFERENCES `onboarding_banks` (`bid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `onboarding_documents`
--

LOCK TABLES `onboarding_documents` WRITE;
/*!40000 ALTER TABLE `onboarding_documents` DISABLE KEYS */;
INSERT INTO `onboarding_documents` VALUES (1,1,1,'Aadhar','Spoofing cyber security.pdf','/uploads/onboarding-documents/1788316911403-Spoofing-cyber-security.pdf',1,'2026-09-02 02:41:51','2026-09-02 02:41:51',NULL);
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
  `qualification` varchar(150) DEFAULT NULL,
  `institution` varchar(200) DEFAULT NULL,
  `board` varchar(200) DEFAULT NULL,
  `year` varchar(20) DEFAULT NULL,
  `percentage` varchar(50) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`oeid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `onboarding_education_details`
--

LOCK TABLES `onboarding_education_details` WRITE;
/*!40000 ALTER TABLE `onboarding_education_details` DISABLE KEYS */;
INSERT INTO `onboarding_education_details` VALUES (6,1,'BSA','Anna university','Anna university','2020','8','2026-09-02 02:42:22','2026-09-02 02:42:22',NULL);
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
  PRIMARY KEY (`eqid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `onboarding_equipments`
--

LOCK TABLES `onboarding_equipments` WRITE;
/*!40000 ALTER TABLE `onboarding_equipments` DISABLE KEYS */;
INSERT INTO `onboarding_equipments` VALUES (1,1,1,1,0,0,1,0,0,'2026-09-02 02:41:27','2026-09-02 02:42:22',NULL);
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
  `company` varchar(200) DEFAULT NULL,
  `designation` varchar(150) DEFAULT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `totalExp` varchar(50) DEFAULT NULL,
  `reason` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`oexid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `onboarding_experience_details`
--

LOCK TABLES `onboarding_experience_details` WRITE;
/*!40000 ALTER TABLE `onboarding_experience_details` DISABLE KEYS */;
INSERT INTO `onboarding_experience_details` VALUES (6,1,'FSL','Developer','2026-09-03','2026-10-01','0.08',NULL,'2026-09-02 02:42:22','2026-09-02 02:42:22',NULL);
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
  `healthIssues` text,
  `bloodGroup` varchar(10) DEFAULT NULL,
  `medicalAssistanceNeeded` tinyint(1) NOT NULL DEFAULT '0',
  `emergencyContactName` varchar(150) DEFAULT NULL,
  `emergencyContactNumber` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`hid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `onboarding_health`
--

LOCK TABLES `onboarding_health` WRITE;
/*!40000 ALTER TABLE `onboarding_health` DISABLE KEYS */;
INSERT INTO `onboarding_health` VALUES (1,1,1,1,'Yes','O+',1,'asd','5555555555','2026-09-02 02:41:27','2026-09-02 02:41:39',NULL);
/*!40000 ALTER TABLE `onboarding_health` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `onboarding_info`
--

DROP TABLE IF EXISTS `onboarding_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `onboarding_info` (
  `onboardinginfoid` int NOT NULL AUTO_INCREMENT,
  `cifid` int NOT NULL,
  `officialemail` varchar(255) DEFAULT NULL,
  `officialphone` varchar(255) DEFAULT NULL,
  `doj` date DEFAULT NULL,
  `emptype` varchar(100) DEFAULT NULL,
  `erprole` varchar(100) DEFAULT NULL,
  `hiresource` varchar(100) DEFAULT NULL,
  `department` int NOT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `reportHead` varchar(50) DEFAULT NULL,
  `uanno` varchar(50) DEFAULT NULL,
  `aadharno` varchar(50) DEFAULT NULL,
  `panno` varchar(50) DEFAULT NULL,
  `salary` varchar(50) DEFAULT NULL,
  `eid` int NOT NULL,
  `academicid` int NOT NULL,
  `employeeId` varchar(30) DEFAULT NULL,
  `firstName` varchar(100) DEFAULT NULL,
  `lastName` varchar(100) DEFAULT NULL,
  `nickName` varchar(100) DEFAULT NULL,
  `personalEmail` varchar(150) DEFAULT NULL,
  `personalPhone` varchar(30) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `maritalStatus` varchar(20) DEFAULT NULL,
  `dateOfBirth` date DEFAULT NULL,
  `manager` varchar(120) DEFAULT NULL,
  `referral` varchar(120) DEFAULT NULL,
  `permanent` varchar(120) DEFAULT NULL,
  `systemAdmin` varchar(120) DEFAULT NULL,
  `superAdmin` varchar(120) DEFAULT NULL,
  `currentAddressLine1` varchar(255) DEFAULT NULL,
  `currentAddressLine2` varchar(255) DEFAULT NULL,
  `currentCity` varchar(100) DEFAULT NULL,
  `currentState` varchar(100) DEFAULT NULL,
  `currentPincode` varchar(20) DEFAULT NULL,
  `permanentAddressLine1` varchar(255) DEFAULT NULL,
  `permanentAddressLine2` varchar(255) DEFAULT NULL,
  `permanentCity` varchar(100) DEFAULT NULL,
  `permanentState` varchar(100) DEFAULT NULL,
  `permanentPincode` varchar(20) DEFAULT NULL,
  `favoriteCake` varchar(120) DEFAULT NULL,
  `favoriteColor` varchar(120) DEFAULT NULL,
  `favoriteSong` varchar(120) DEFAULT NULL,
  `favoriteMovie` varchar(120) DEFAULT NULL,
  `favoriteFood` varchar(120) DEFAULT NULL,
  `favoriteActor` varchar(120) DEFAULT NULL,
  `dreamVacation` varchar(120) DEFAULT NULL,
  `weekendActivity` varchar(120) DEFAULT NULL,
  `coffeeOrTea` varchar(50) DEFAULT NULL,
  `favoriteSports` varchar(120) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`onboardinginfoid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `onboarding_info`
--

LOCK TABLES `onboarding_info` WRITE;
/*!40000 ALTER TABLE `onboarding_info` DISABLE KEYS */;
INSERT INTO `onboarding_info` VALUES (1,1,'nand@gmail.com','8888888888','2026-09-11','Permanent','Manager','Referal',1,'Software Engineer','Superadmin Admin','0','0','5555555555','4444444',1,1,'KHO-001','Nand',NULL,NULL,'nand@gmail.com','8888888888','Male','Married','2008-08-07',NULL,NULL,NULL,'System Admin','Super_admin','CBE',NULL,'CBE','TN','888888','CBE',NULL,'CBE','TN','888888',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'e',NULL,NULL,'2026-09-02 02:41:27','2026-09-02 02:42:22',NULL);
/*!40000 ALTER TABLE `onboarding_info` ENABLE KEYS */;
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
  `status` enum('DRAFT','FINAL') NOT NULL DEFAULT 'DRAFT',
  `experienceDetails` json NOT NULL,
  `educationDetails` json NOT NULL,
  `formData` json NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cifid` (`cifid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `onboarding_records`
--

LOCK TABLES `onboarding_records` WRITE;
/*!40000 ALTER TABLE `onboarding_records` DISABLE KEYS */;
INSERT INTO `onboarding_records` VALUES (1,1,'FINAL','[{\"reason\": \"\", \"company\": \"FSL\", \"endDate\": \"2026-10-01\", \"totalExp\": \"0.08\", \"startDate\": \"2026-09-03\", \"designation\": \"Developer\"}]','[{\"year\": \"2020\", \"board\": \"Anna university\", \"percentage\": \"8\", \"institution\": \"Anna university\", \"qualification\": \"BSA\"}]','{\"kit\": {\"mouse\": false, \"laptop\": true, \"headset\": false, \"keyboard\": false, \"entryCard\": true, \"welcomeKit\": false, \"OfficialSim\": true}, \"gender\": \"Male\", \"health\": {\"anyTablets\": \"Yes\", \"bloodGroup\": \"O+\", \"healthIssues\": \"Yes\", \"emergencyName\": \"asd\", \"emergencyNumber\": \"5555555555\", \"emergencyContact\": \"\", \"medicalAssistance\": \"Yes\"}, \"erpRole\": \"MANAGER\", \"manager\": \"\", \"fullName\": \"Nand\", \"lastName\": \"\", \"nickName\": \"\", \"referral\": \"\", \"documents\": [{\"fileUrl\": \"/uploads/onboarding-documents/1788316911403-Spoofing-cyber-security.pdf\", \"fileName\": \"Spoofing cyber security.pdf\", \"documentType\": \"Aadhar\"}], \"education\": [{\"year\": \"2020\", \"board\": \"Anna university\", \"percentage\": \"8\", \"institution\": \"Anna university\", \"qualification\": \"BSA\"}], \"firstName\": \"Nand\", \"induction\": {\"teamIntro\": false, \"hrPolicies\": true, \"leavePolicy\": true, \"companyIntro\": true, \"attendanceRules\": false, \"securityGuidelines\": false}, \"panNumber\": \"5555555555\", \"permanent\": \"\", \"uanNumber\": \"\", \"department\": \"Web development\", \"employeeId\": \"KHO-001\", \"experience\": [{\"reason\": \"\", \"company\": \"FSL\", \"endDate\": \"2026-10-01\", \"totalExp\": \"0.08\", \"startDate\": \"2026-09-03\", \"designation\": \"Developer\"}], \"icebreaker\": {\"coffeeOrTea\": \"\", \"favoriteCake\": \"\", \"favoriteFood\": \"\", \"favoriteSong\": \"\", \"dreamVacation\": \"\", \"favoriteActor\": \"\", \"favoriteColor\": \"\", \"favoriteMovie\": \"\", \"favoriteSports\": \"\", \"weekendActivity\": \"e\"}, \"officeTour\": {\"hrCabin\": false, \"cafeteria\": true, \"reception\": true, \"meetingRoom\": true, \"workstation\": false}, \"superAdmin\": \"Super_admin\", \"bankDetails\": {\"bankName\": \"dfgsd\", \"ifscCode\": \"sdfsdf345\", \"branchName\": \"sdfg\", \"accountHolder\": \"test\", \"accountNumber\": \"55555555\"}, \"dateOfBirth\": \"2008-08-07\", \"designation\": \"Software Engineer\", \"officePhone\": \"\", \"systemAdmin\": \"System Admin\", \"employeeType\": \"Permanent\", \"sourceOfHire\": \"Referral\", \"currentSalary\": \"4444444\", \"dateOfJoining\": \"2026-09-11\", \"maritalStatus\": \"Married\", \"officialEmail\": \"nand@gmail.com\", \"personalEmail\": \"nand@gmail.com\", \"personalPhone\": \"8888888888\", \"reportingHead\": \"Superadmin Admin\", \"currentAddress\": {\"city\": \"CBE\", \"line1\": \"CBE\", \"line2\": \"\", \"state\": \"TN\", \"pincode\": \"888888\"}, \"permanentAddress\": {\"city\": \"CBE\", \"line1\": \"CBE\", \"line2\": \"\", \"state\": \"TN\", \"pincode\": \"888888\"}}','2026-09-02 02:41:27','2026-09-02 02:42:22',NULL);
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
  `candidateId` int DEFAULT NULL,
  `cifid` int DEFAULT NULL,
  `onboardinginfoid` int DEFAULT NULL,
  `jobApplicationId` int DEFAULT NULL,
  `status` enum('DRAFT','READY_FOR_VERIFICATION','IN_PROGRESS','COMPLETED','REJECTED') NOT NULL DEFAULT 'DRAFT',
  `officialEmail` varchar(150) DEFAULT NULL,
  `officialPhone` varchar(20) DEFAULT NULL,
  `doj` date DEFAULT NULL,
  `employeeType` varchar(100) DEFAULT NULL,
  `employeeRole` varchar(100) DEFAULT NULL,
  `hireSource` varchar(100) DEFAULT NULL,
  `departmentId` int DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `reportingManager` varchar(150) DEFAULT NULL,
  `photoUrl` varchar(255) DEFAULT NULL,
  `uanno` varchar(50) DEFAULT NULL,
  `aadharNo` varchar(50) DEFAULT NULL,
  `panNo` varchar(50) DEFAULT NULL,
  `salary` varchar(50) DEFAULT NULL,
  `employeeCode` varchar(50) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`onboardingid`),
  KEY `candidateId` (`candidateId`),
  KEY `jobApplicationId` (`jobApplicationId`),
  KEY `departmentId` (`departmentId`),
  CONSTRAINT `onboardings_ibfk_1` FOREIGN KEY (`candidateId`) REFERENCES `candidates` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `onboardings_ibfk_2` FOREIGN KEY (`jobApplicationId`) REFERENCES `job_applications` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `onboardings_ibfk_3` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `onboardings`
--

LOCK TABLES `onboardings` WRITE;
/*!40000 ALTER TABLE `onboardings` DISABLE KEYS */;
INSERT INTO `onboardings` VALUES (1,NULL,1,1,NULL,'DRAFT',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-09-02 02:41:27','2026-09-02 02:41:27',NULL);
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
  `code` varchar(10) NOT NULL,
  `jobTitle` varchar(100) NOT NULL,
  `departmentId` int NOT NULL,
  `openingCount` int NOT NULL,
  `requiredSkills` varchar(255) NOT NULL,
  `minExperience` int NOT NULL,
  `jobDescription` text,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `jobOpeningUrl` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`jobid`),
  UNIQUE KEY `code` (`code`),
  KEY `departmentId` (`departmentId`),
  CONSTRAINT `openings_ibfk_1` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `openings`
--

LOCK TABLES `openings` WRITE;
/*!40000 ALTER TABLE `openings` DISABLE KEYS */;
INSERT INTO `openings` VALUES (1,'WD-001','Software Engineer',4,3,'java',3,'test',1,'http://localhost:5173/cif-form?jobid=1','2026-09-02 02:09:24','2026-09-02 02:09:24',NULL);
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
  `token` varchar(255) NOT NULL,
  `expiresAt` datetime NOT NULL,
  `isUsed` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `userId` (`userId`),
  CONSTRAINT `password_reset_tokens_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  KEY `employeeId` (`employeeId`),
  KEY `createdBy` (`createdBy`),
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
  `action` varchar(100) NOT NULL,
  `permissionKey` varchar(150) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissionKey` (`permissionKey`),
  KEY `moduleId` (`moduleId`),
  CONSTRAINT `permissions_ibfk_1` FOREIGN KEY (`moduleId`) REFERENCES `modules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `id` int NOT NULL AUTO_INCREMENT,
  `projectOnboardId` int NOT NULL,
  `assignedToId` int NOT NULL,
  `reportingHeadId` int DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'In Progress',
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
  CONSTRAINT `project_assignments_ibfk_1` FOREIGN KEY (`projectOnboardId`) REFERENCES `project_onboards` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `project_assignments_ibfk_2` FOREIGN KEY (`assignedToId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `project_assignments_ibfk_3` FOREIGN KEY (`reportingHeadId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `project_assignments_ibfk_4` FOREIGN KEY (`assignedBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `id` int NOT NULL AUTO_INCREMENT,
  `leadId` int DEFAULT NULL,
  `projectName` varchar(200) NOT NULL,
  `companyName` varchar(200) NOT NULL,
  `projectManagerIds` json NOT NULL,
  `spocIds` json NOT NULL,
  `serviceIds` json NOT NULL,
  `serviceDetails` json DEFAULT NULL,
  `assignedToIds` json NOT NULL,
  `reportingHeadId` int DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Pending',
  `createdBy` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `leadId` (`leadId`),
  KEY `createdBy` (`createdBy`),
  CONSTRAINT `project_onboards_ibfk_1` FOREIGN KEY (`leadId`) REFERENCES `leads` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `project_onboards_ibfk_2` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_onboards`
--

LOCK TABLES `project_onboards` WRITE;
/*!40000 ALTER TABLE `project_onboards` DISABLE KEYS */;
INSERT INTO `project_onboards` VALUES (1,1,'test','FSL','[1]','[1]','[1, 4, 3]','{\"1\": {\"technology\": \"Shopify\"}, \"3\": {\"subServices\": [\"Reels\", \"Poster\"]}}','[]',NULL,'Pending',1,'2026-09-02 02:30:25','2026-09-02 02:30:25',NULL);
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
  `interviewMode` varchar(50) DEFAULT NULL,
  `hrScreeningFeedback` text,
  `technicalInterviewFeedback` text,
  `mdFeedback` text,
  `recruitmentStatus` varchar(50) DEFAULT NULL,
  `statusChangeNote` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`rid`),
  KEY `cifid` (`cifid`),
  CONSTRAINT `recruitments_ibfk_1` FOREIGN KEY (`cifid`) REFERENCES `candidates` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recruitments`
--

LOCK TABLES `recruitments` WRITE;
/*!40000 ALTER TABLE `recruitments` DISABLE KEYS */;
INSERT INTO `recruitments` VALUES (1,1,'2026-09-04 02:33:00','Online','test','','','Shortlisted','','2026-09-02 02:40:25','2026-09-02 02:40:25',NULL),(2,1,'2026-09-03 21:03:00','Online','test','asd','','Interviewing','','2026-09-02 02:40:40','2026-09-02 02:40:40',NULL),(3,1,'2026-09-03 15:33:00','Online','test','asd','','Selected','','2026-09-02 02:40:48','2026-09-02 02:40:48',NULL);
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
  `token` text NOT NULL,
  `deviceId` varchar(255) DEFAULT NULL,
  `deviceName` varchar(255) DEFAULT NULL,
  `browser` varchar(100) DEFAULT NULL,
  `os` varchar(100) DEFAULT NULL,
  `ipAddress` varchar(50) DEFAULT NULL,
  `userAgent` text,
  `rotatedFromTokenId` int DEFAULT NULL,
  `lastUsedAt` datetime DEFAULT NULL,
  `expiresAt` datetime NOT NULL,
  `isRevoked` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `refresh_tokens_user_id` (`userId`),
  KEY `refresh_tokens_token` (`token`(255)),
  KEY `refresh_tokens_is_revoked` (`isRevoked`),
  KEY `refresh_tokens_expires_at` (`expiresAt`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (1,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg4MzE0OTIyLCJleHAiOjE3ODg5MTk3MjJ9.uae3u_uKf9BOY1dv7b3uMNAyRNlmzhsypxWIGxUpmrI',NULL,'Desktop','Edge','Windows','::1',NULL,NULL,'2026-09-02 02:08:42','2026-09-09 02:08:42',0,'2026-09-02 02:08:42','2026-09-02 02:08:42'),(2,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg4MzE1MTUyLCJleHAiOjE3ODg5MTk5NTJ9.PWW8lZQedQiEYDE-VFpsuvKMN2HifuM8Ng5tAhxLv8o',NULL,'Desktop',NULL,'Windows','::1',NULL,NULL,'2026-09-02 02:12:32','2026-09-09 02:12:32',0,'2026-09-02 02:12:32','2026-09-02 02:12:32'),(3,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg4MzE1Mzg2LCJleHAiOjE3ODg5MjAxODZ9.0tr2HFmge3NGvt28OxFR5McK5s1SKnKDLYba1ZdJ5Co',NULL,'Desktop',NULL,'Windows','::1',NULL,NULL,'2026-09-02 02:16:26','2026-09-09 02:16:26',0,'2026-09-02 02:16:26','2026-09-02 02:16:26'),(4,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg4MzE1NTE2LCJleHAiOjE3ODg5MjAzMTZ9.x3Oz6Z_p67TUOqJmiXCXDsw1yyoHbVgq3aylzphF0HQ',NULL,NULL,NULL,NULL,NULL,NULL,3,'2026-09-02 02:18:36','2026-09-09 02:18:36',0,'2026-09-02 02:18:36','2026-09-02 02:18:36');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `name` varchar(100) NOT NULL,
  `code` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Super Admin','SUPER_ADMIN','Full system access',1,'2026-09-02 01:50:46','2026-09-02 01:50:46',NULL),(2,'CRM Executive','CRM_EXECUTIVE','Lead management for assigned users',1,'2026-09-02 01:50:46','2026-09-02 01:50:46',NULL),(3,'Manager','MANAGER','Project, task, and vendor operations',1,'2026-09-02 01:50:46','2026-09-02 01:50:46',NULL),(4,'HR','HR','Hiring, onboarding, payroll, and employee operations',1,'2026-09-02 01:50:46','2026-09-02 01:50:46',NULL),(5,'Team Member','TEAM_MEMBER','General team member role',1,'2026-09-02 01:50:46','2026-09-02 01:50:46',NULL);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_categories`
--

DROP TABLE IF EXISTS `service_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(100) NOT NULL,
  `color` varchar(30) DEFAULT NULL,
  `displayOrder` int DEFAULT '1',
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_categories`
--

LOCK TABLES `service_categories` WRITE;
/*!40000 ALTER TABLE `service_categories` DISABLE KEYS */;
INSERT INTO `service_categories` VALUES (1,'DM','DM','#2563EB',1,1,'2026-09-02 01:59:02','2026-09-02 01:59:02',NULL),(2,'Operations','OP','#eb24e4',3,1,'2026-09-02 01:59:02','2026-09-02 01:59:02',NULL),(3,'Web Development','WEB','#24e7eb',4,1,'2026-09-02 01:59:02','2026-09-02 01:59:02',NULL),(4,'Content','CONTENT','#e9944e',5,1,'2026-09-02 01:59:02','2026-09-02 01:59:02',NULL),(5,'Designer','DESIGNER','#eb4224',6,1,'2026-09-02 01:59:02','2026-09-02 01:59:02',NULL);
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
  `name` varchar(100) NOT NULL,
  `code` varchar(100) NOT NULL,
  `displayOrder` int DEFAULT '1',
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `serviceCategoryId` (`serviceCategoryId`),
  CONSTRAINT `services_ibfk_1` FOREIGN KEY (`serviceCategoryId`) REFERENCES `service_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,1,'Website','SITE',1,1,'2026-09-02 01:59:02','2026-09-02 01:59:02',NULL),(2,1,'SEO','SEO',2,1,'2026-09-02 01:59:02','2026-09-02 01:59:02',NULL),(3,1,'SMM','SMM',3,1,'2026-09-02 01:59:02','2026-09-02 01:59:02',NULL),(4,5,'Graphics Designer','GD',1,1,'2026-09-02 01:59:02','2026-09-02 01:59:02',NULL);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (1,1),(2,3);
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
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `employeeRecord` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'5f93cf91-95f4-443e-928e-9fbbfa74550e','Superadmin','Admin','admin@gmail.com','admin','0000000000',NULL,'$2b$10$nFwGSbauLJUFptZ5LWQ0MOyukT.MgiKG3ZpvZtkvu2.OiUL2zW1ia',1,'2026-09-02 02:07:32','2026-09-02 02:37:03',NULL),(2,'5d2f0fed-158a-449b-aac4-3e4d81668203','Nand',NULL,'nand@gmail.com','nand','8888888888','KHO-001','$2b$10$7BJt/lZOL.h5/Rkd.btRC.qhyB0Wq2FXCG7iYTvZjFsKZgaLbFHQ.',1,'2026-09-02 02:42:22','2026-09-02 02:42:22',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-02  8:16:33
