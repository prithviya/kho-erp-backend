-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3308
-- Generation Time: Aug 19, 2026 at 02:51 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kho-will`
--

-- --------------------------------------------------------

--
-- Table structure for table `cif_academics`
--

CREATE TABLE `cif_academics` (
  `academicid` int(11) NOT NULL,
  `cifid` int(11) NOT NULL,
  `degree` varchar(100) NOT NULL,
  `university` varchar(100) NOT NULL,
  `graduationYear` int(11) NOT NULL,
  `grade` varchar(10) NOT NULL,
  `city` varchar(100) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cif_academics`
--

INSERT INTO `cif_academics` (`academicid`, `cifid`, `degree`, `university`, `graduationYear`, `grade`, `city`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 1, 'B.E Computer Science', 'Anna University', 2020, 'A', 'Coimbatore', '2026-08-12 05:11:51', '2026-08-12 05:11:51', NULL),
(2, 2, 'Explicabo Id a dele', 'Sed ex suscipit repr', 2008, 'Minus ex n', 'Qui nobis ullamco Na', '2026-08-17 08:48:06', '2026-08-17 08:48:06', NULL),
(3, 3, 'Et libero cupidatat ', 'Porro vel voluptatib', 1907, 'Qui est de', 'Consequat Est minus', '2026-08-18 04:51:10', '2026-08-18 04:51:10', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cif_experiences`
--

CREATE TABLE `cif_experiences` (
  `eid` int(11) NOT NULL,
  `cifid` int(11) NOT NULL,
  `companyName` varchar(100) NOT NULL,
  `location` varchar(100) NOT NULL,
  `role` varchar(100) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date DEFAULT NULL,
  `totalExperience` float NOT NULL,
  `reasonForLeaving` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cif_experiences`
--

INSERT INTO `cif_experiences` (`eid`, `cifid`, `companyName`, `location`, `role`, `startDate`, `endDate`, `totalExperience`, `reasonForLeaving`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 1, 'ABC Technologies', 'Coimbatore', 'Digital Marketing Executive', '2022-01-10', '2024-05-31', 0, 'Career growth', '2026-08-12 05:11:59', '2026-08-12 05:11:59', NULL),
(2, 2, 'Laborum Sint aut er', 'Impedit tempore ma', 'Sed aspernatur delen', '1975-07-14', '1973-10-06', -1.77, NULL, '2026-08-17 08:48:06', '2026-08-17 08:48:06', NULL),
(3, 3, 'Non modi velit sit a', 'Omnis cillum vero ma', 'Sit numquam rem ea i', '2002-05-17', '1992-06-28', -9.88, NULL, '2026-08-18 04:51:10', '2026-08-18 04:51:10', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cif_languages`
--

CREATE TABLE `cif_languages` (
  `languageid` int(11) NOT NULL,
  `cifid` int(11) NOT NULL,
  `Speak` enum('basic','intermediate','fluent','native') NOT NULL,
  `Read` enum('basic','intermediate','fluent','native') NOT NULL,
  `Write` enum('basic','intermediate','fluent','native') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cif_languages`
--

INSERT INTO `cif_languages` (`languageid`, `cifid`, `Speak`, `Read`, `Write`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 1, 'basic', 'basic', 'basic', '2026-08-12 05:12:04', '2026-08-12 05:12:04', NULL),
(2, 2, 'basic', 'fluent', 'native', '2026-08-17 08:48:06', '2026-08-17 08:48:06', NULL),
(3, 3, 'fluent', 'native', 'fluent', '2026-08-18 04:51:10', '2026-08-18 04:51:10', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cif_personals`
--

CREATE TABLE `cif_personals` (
  `cifid` int(11) NOT NULL,
  `fullName` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phoneNumber` varchar(15) NOT NULL,
  `DOB` date NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `pinCode` varchar(10) NOT NULL,
  `gender` enum('Male','Female') NOT NULL,
  `maritalStatus` enum('Single','Married') NOT NULL,
  `portfolioLink` varchar(255) DEFAULT NULL,
  `resume` varchar(255) DEFAULT NULL,
  `appliedPosition` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cif_personals`
--

INSERT INTO `cif_personals` (`cifid`, `fullName`, `email`, `phoneNumber`, `DOB`, `address`, `city`, `state`, `pinCode`, `gender`, `maritalStatus`, `portfolioLink`, `resume`, `appliedPosition`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Gokul Kumar', 'gokul@example.com', '9876543210', '1995-05-15', 'Coimbatore', 'Coimbatore', 'Tamil Nadu', '641001', 'Male', 'Married', 'https://example.com', 'resume.pdf', 1, '2026-08-12 05:10:41', '2026-08-12 05:10:41', NULL),
(2, 'Shay Chan', 'riwuqowid@mailinator.com', '+1 (895) 857-99', '1996-10-17', 'Aut ut at facilis si', 'Quis sunt temporibus', 'Omnis est ipsam cor', 'Ut non con', 'Male', '', 'https://www.cymalipasoguhyk.ca', NULL, 1, '2026-08-17 08:48:06', '2026-08-17 08:48:06', NULL),
(3, 'Dustin Little', 'rybaduhefi@mailinator.com', '+1 (508) 749-18', '2005-10-17', 'Ullamco do aut aliqu', 'In adipisicing conse', 'Autem est sapiente e', 'Culpa veri', 'Female', '', 'https://www.wyfudaxyt.co', NULL, 3, '2026-08-18 04:51:10', '2026-08-18 04:51:10', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cif_references`
--

CREATE TABLE `cif_references` (
  `referenceid` int(11) NOT NULL,
  `cifid` int(11) NOT NULL,
  `referenceName` varchar(100) NOT NULL,
  `referenceEmail` varchar(100) NOT NULL,
  `referencePhone` varchar(15) NOT NULL,
  `consentConfirmed` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cif_references`
--

INSERT INTO `cif_references` (`referenceid`, `cifid`, `referenceName`, `referenceEmail`, `referencePhone`, `consentConfirmed`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(3, 3, 'Commodi praesentium ', 'fekoc@mailinator.com', '+1 (912) 209-62', 1, '2026-08-18 04:51:10', '2026-08-18 04:51:10', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cif_skills`
--

CREATE TABLE `cif_skills` (
  `skillid` int(11) NOT NULL,
  `cifid` int(11) NOT NULL,
  `skillName` varchar(100) NOT NULL,
  `skillLevel` enum('Beginner','Intermediate','Advanced','Expert') NOT NULL,
  `year` datetime NOT NULL,
  `provider` varchar(100) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cif_skills`
--

INSERT INTO `cif_skills` (`skillid`, `cifid`, `skillName`, `skillLevel`, `year`, `provider`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 1, 'Google Ads', 'Advanced', '2024-01-01 00:00:00', 'Google', '2026-08-12 05:11:46', '2026-08-12 05:11:46', NULL),
(2, 2, 'Est assumenda incidu', 'Advanced', '2000-12-31 18:30:00', 'Maxime a doloribus v', '2026-08-17 08:48:06', '2026-08-17 08:48:06', NULL),
(3, 3, 'Ullam et qui aliquam', 'Beginner', '2000-12-31 18:30:00', 'Nulla perspiciatis ', '2026-08-18 04:51:10', '2026-08-18 04:51:10', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cif_softwares`
--

CREATE TABLE `cif_softwares` (
  `softwareid` int(11) NOT NULL,
  `cifid` int(11) NOT NULL,
  `tools` varchar(100) NOT NULL,
  `levels` enum('Excellent','Good','Average') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cif_softwares`
--

INSERT INTO `cif_softwares` (`softwareid`, `cifid`, `tools`, `levels`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 1, 'Google Analytics', '', '2026-08-12 05:11:41', '2026-08-12 05:11:41', NULL),
(2, 2, 'Aut enim quas impedi', 'Good', '2026-08-17 08:48:06', '2026-08-17 08:48:06', NULL),
(3, 3, 'In esse ', 'Excellent', '2026-08-18 04:51:10', '2026-08-18 04:51:10', NULL),
(4, 3, 'voluptatibu', 'Good', '2026-08-18 04:51:10', '2026-08-18 04:51:10', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cif_submissions`
--

CREATE TABLE `cif_submissions` (
  `cifappid` int(11) NOT NULL,
  `cifid` int(11) NOT NULL,
  `appliedStatus` enum('Shortlist','Reject','Pending') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cif_submissions`
--

INSERT INTO `cif_submissions` (`cifappid`, `cifid`, `appliedStatus`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 2, 'Reject', '2026-08-19 07:53:29', '2026-08-19 07:53:29', NULL),
(2, 3, 'Shortlist', '2026-08-19 07:53:35', '2026-08-19 10:32:14', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `isActive`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Operations', 1, '2026-08-12 05:10:08', '2026-08-12 05:10:08', NULL),
(2, 'Content', 1, '2026-08-13 07:46:47', '2026-08-13 09:57:10', NULL),
(3, 'designer', 1, '2026-08-13 07:47:42', '2026-08-13 07:48:18', '2026-08-13 07:48:18'),
(9, 'dd', 1, '2026-08-13 07:55:41', '2026-08-13 07:56:48', '2026-08-13 07:56:48'),
(34, 'Geetha', 1, '2026-08-13 09:26:07', '2026-08-13 09:47:45', '2026-08-13 09:47:45'),
(40, 'Digital Marketing', 1, '2026-08-13 10:01:45', '2026-08-13 10:01:57', NULL),
(41, 'Web development', 1, '2026-08-14 04:32:44', '2026-08-14 04:32:44', NULL),
(42, 'Media', 1, '2026-08-14 04:35:35', '2026-08-14 04:35:35', NULL),
(43, 'Designs', 1, '2026-08-14 04:37:47', '2026-08-14 04:37:47', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
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
  `resumeSize` int(11) DEFAULT NULL,
  `education` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`education`)),
  `workExperience` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`workExperience`)),
  `skills` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`skills`)),
  `softwareTools` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`softwareTools`)),
  `languages` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`languages`)),
  `references` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`references`)),
  `consent` tinyint(1) NOT NULL DEFAULT 0,
  `status` varchar(50) NOT NULL DEFAULT 'Onboarding',
  `createdBy` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inductions`
--

CREATE TABLE `inductions` (
  `iid` int(11) NOT NULL,
  `cifid` int(11) NOT NULL,
  `onboardinginfoid` int(11) NOT NULL,
  `companyIntroduction` tinyint(1) NOT NULL DEFAULT 0,
  `hrPolicies` tinyint(1) NOT NULL DEFAULT 0,
  `attendanceRules` tinyint(1) NOT NULL DEFAULT 0,
  `leavePolicy` tinyint(1) NOT NULL DEFAULT 0,
  `securityGuidelines` tinyint(1) NOT NULL DEFAULT 0,
  `teamIntroduction` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leads`
--

CREATE TABLE `leads` (
  `id` int(11) NOT NULL,
  `companyName` varchar(150) NOT NULL,
  `contactPerson` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `requirement` text DEFAULT NULL,
  `budget` decimal(12,2) DEFAULT NULL,
  `leadSourceId` int(11) NOT NULL,
  `leadStatusId` int(11) NOT NULL,
  `assignedTo` int(11) DEFAULT NULL,
  `referralName` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `nextFollowupDate` date DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `leads`
--

INSERT INTO `leads` (`id`, `companyName`, `contactPerson`, `phone`, `email`, `requirement`, `budget`, `leadSourceId`, `leadStatusId`, `assignedTo`, `referralName`, `notes`, `nextFollowupDate`, `isActive`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(2, 'Morris Flowers Plc', 'Consectetur eius vol', '9638520741', 'dohibomode@mailinator.com', 'Enim ea atque sed la', 12000.00, 3, 2, 1, NULL, 'Minus ut ad consequat Corporis consequuntur alias quos proident do sed accusamus dolor libero consectetur distinctio Rerum', '1988-08-20', 1, '2026-08-12 05:29:48', '2026-08-17 04:16:07', NULL),
(3, 'Gibson Crawford Associates', 'Veniam quibusdam mo', '9876543210', 'deba@mailinator.com', 'Incididunt fuga Et ', 82000.00, 1, 6, 1, NULL, 'Vel dolor non error modi odio expedita excepturi et', '2026-08-17', 1, '2026-08-12 10:42:38', '2026-08-13 07:01:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `lead_history`
--

CREATE TABLE `lead_history` (
  `id` int(11) NOT NULL,
  `leadId` int(11) NOT NULL,
  `oldStatusId` int(11) DEFAULT NULL,
  `newStatusId` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `changedBy` int(11) NOT NULL,
  `createdAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lead_history`
--

INSERT INTO `lead_history` (`id`, `leadId`, `oldStatusId`, `newStatusId`, `notes`, `changedBy`, `createdAt`) VALUES
(1, 2, NULL, NULL, 'Lead Created', 1, '2026-08-12 05:29:48'),
(2, 2, 2, 2, 'Lead Updated', 1, '2026-08-12 06:30:04'),
(3, 3, NULL, NULL, 'Lead Created', 1, '2026-08-12 10:42:38'),
(4, 3, 3, 3, 'Lead Updated', 1, '2026-08-13 07:00:05'),
(5, 3, 4, 4, 'Lead Updated', 1, '2026-08-13 07:00:13'),
(6, 3, 5, 5, 'Lead Updated', 1, '2026-08-13 07:00:18'),
(7, 3, 5, 5, 'Lead Updated', 1, '2026-08-13 07:00:37'),
(8, 3, 6, 6, 'Lead Updated', 1, '2026-08-13 07:00:43'),
(9, 3, 7, 7, 'Lead Updated', 1, '2026-08-13 07:00:50'),
(10, 3, 6, 6, 'Lead Updated', 1, '2026-08-13 07:01:00'),
(11, 2, 2, 2, 'Lead Updated', 1, '2026-08-13 08:56:39'),
(12, 2, 2, 2, 'Lead Updated', 1, '2026-08-17 04:16:07');

-- --------------------------------------------------------

--
-- Table structure for table `lead_priorities`
--

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `lead_priorities`
--

INSERT INTO `lead_priorities` (`COL 1`, `COL 2`, `COL 3`, `COL 4`, `COL 5`, `COL 6`, `COL 7`, `COL 8`, `COL 9`, `COL 10`, `COL 11`) VALUES
('id', 'name', 'code', 'color', 'description', 'isActive', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt', 'deletedAt');

-- --------------------------------------------------------

--
-- Table structure for table `lead_services`
--

CREATE TABLE `lead_services` (
  `leadId` int(11) NOT NULL,
  `serviceId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lead_services`
--

INSERT INTO `lead_services` (`leadId`, `serviceId`) VALUES
(2, 1),
(2, 2),
(3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `lead_sources`
--

CREATE TABLE `lead_sources` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `code` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `displayOrder` int(11) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lead_sources`
--

INSERT INTO `lead_sources` (`id`, `name`, `code`, `description`, `isActive`, `displayOrder`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Email Campaign', 'EMAIL_CAMPAIGN', 'Lead generated from Email Campaign.', 1, 2, '2026-08-12 05:09:23', '2026-08-13 07:03:41', NULL),
(2, 'Whatsapp', 'WHATSAPP', '', 1, 1, '2026-08-13 07:03:14', '2026-08-13 07:03:14', NULL),
(3, 'Instagram', 'INSTA', '', 1, 3, '2026-08-13 07:03:56', '2026-08-13 07:04:58', NULL),
(4, 'Facebook', 'FB', '', 1, 4, '2026-08-13 07:04:48', '2026-08-13 07:05:06', NULL),
(5, 'LinkedIn', 'LINKEDIN', '', 1, 5, '2026-08-13 07:06:19', '2026-08-13 07:06:19', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `lead_statuses`
--

CREATE TABLE `lead_statuses` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `code` varchar(100) NOT NULL,
  `color` varchar(30) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `isDefault` tinyint(1) DEFAULT 0,
  `isClosed` tinyint(1) DEFAULT 0,
  `displayOrder` int(11) DEFAULT 1,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lead_statuses`
--

INSERT INTO `lead_statuses` (`id`, `name`, `code`, `color`, `description`, `isDefault`, `isClosed`, `displayOrder`, `isActive`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'On Hold', 'ON_HOLD', '#9e9e9e', 'Lead is temporarily on hold and will be revisited later.', 0, 0, 7, 1, '2026-08-12 05:09:30', '2026-08-13 06:59:01', NULL),
(2, 'New', 'NEW', '#2563EB', 'A new lead awaiting initial contact.', 1, 0, 1, 1, '2026-08-12 06:29:01', '2026-08-12 06:29:01', NULL),
(3, 'Contacted', 'CONTACTED', '#eb9824', ' Initial contact has been made with the lead.', 0, 0, 2, 1, '2026-08-13 06:55:28', '2026-08-13 06:55:28', NULL),
(4, 'Discussion', 'DISCUSSION', '#eb248e', '', 0, 0, 3, 1, '2026-08-13 06:57:10', '2026-08-13 06:57:10', NULL),
(5, 'Proposal', 'PROPOSAL', '#9124eb', 'A quotation or proposal has been shared with the lead.', 0, 0, 4, 1, '2026-08-13 06:57:32', '2026-08-13 06:57:42', NULL),
(6, 'Negotiation', 'NEGOTIATION', '#eb5524', '', 0, 0, 1, 1, '2026-08-13 06:58:41', '2026-08-13 07:01:21', NULL),
(7, 'Converted', 'CONVERTED', '#24eb94', '', 0, 0, 6, 1, '2026-08-13 06:59:36', '2026-08-13 07:01:31', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `modules`
--

CREATE TABLE `modules` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `code` varchar(100) NOT NULL,
  `route` varchar(255) DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `displayOrder` int(11) DEFAULT 0,
  `parentId` int(11) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `office_tours`
--

CREATE TABLE `office_tours` (
  `otid` int(11) NOT NULL,
  `cifid` int(11) NOT NULL,
  `onboardinginfoid` int(11) NOT NULL,
  `reception` tinyint(1) NOT NULL DEFAULT 0,
  `workstationSheet` tinyint(1) NOT NULL DEFAULT 0,
  `meetingRoom` tinyint(1) NOT NULL DEFAULT 0,
  `cafeteria` tinyint(1) NOT NULL DEFAULT 0,
  `hrCabin` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `onboardings`
--

CREATE TABLE `onboardings` (
  `onboardingid` int(11) NOT NULL,
  `cifid` int(11) NOT NULL,
  `onboardinginfoid` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `onboarding_banks`
--

CREATE TABLE `onboarding_banks` (
  `bid` int(11) NOT NULL,
  `cifid` int(11) NOT NULL,
  `onboardinginfoid` int(11) NOT NULL,
  `accountHolderName` varchar(150) NOT NULL,
  `accountNumber` varchar(50) NOT NULL,
  `ifscCode` varchar(20) NOT NULL,
  `bankName` varchar(150) NOT NULL,
  `branchName` varchar(150) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `onboarding_documents`
--

CREATE TABLE `onboarding_documents` (
  `did` int(11) NOT NULL,
  `cifid` int(11) NOT NULL,
  `onboardinginfoid` int(11) NOT NULL,
  `documentType` varchar(100) NOT NULL,
  `fileName` varchar(255) NOT NULL,
  `bid` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `onboarding_equipments`
--

CREATE TABLE `onboarding_equipments` (
  `eqid` int(11) NOT NULL,
  `cifid` int(11) NOT NULL,
  `onboardinginfoid` int(11) NOT NULL,
  `laptop` tinyint(1) NOT NULL DEFAULT 0,
  `mouse` tinyint(1) NOT NULL DEFAULT 0,
  `keyboard` tinyint(1) NOT NULL DEFAULT 0,
  `entryCardRecognition` tinyint(1) NOT NULL DEFAULT 0,
  `headset` tinyint(1) NOT NULL DEFAULT 0,
  `welcomeKit` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `onboarding_health`
--

CREATE TABLE `onboarding_health` (
  `hid` int(11) NOT NULL,
  `cifid` int(11) NOT NULL,
  `onboardinginfoid` int(11) NOT NULL,
  `takingTablets` tinyint(1) NOT NULL DEFAULT 0,
  `healthIssues` text DEFAULT NULL,
  `bloodGroup` varchar(10) DEFAULT NULL,
  `medicalAssistanceNeeded` tinyint(1) NOT NULL DEFAULT 0,
  `emergencyContactName` varchar(150) DEFAULT NULL,
  `emergencyContactNumber` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `onboard_info`
--

CREATE TABLE `onboard_info` (
  `onboardinginfoid` int(11) NOT NULL,
  `officialemail` varchar(255) NOT NULL,
  `officialphone` varchar(255) NOT NULL,
  `doj` date NOT NULL,
  `emptype` enum('Trainee','Permanent') NOT NULL,
  `erprole` enum('Admin','Superadmin','Manager','Team Member') NOT NULL,
  `hiresource` enum('Website','Direct','Referal') NOT NULL,
  `department` int(11) NOT NULL,
  `designation` varchar(100) NOT NULL,
  `reportHead` varchar(50) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `uanno` int(11) NOT NULL,
  `aadharno` int(11) NOT NULL,
  `panno` varchar(50) NOT NULL,
  `salary` int(11) NOT NULL,
  `eid` int(11) NOT NULL,
  `academicid` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `openings`
--

CREATE TABLE `openings` (
  `jobid` int(11) NOT NULL,
  `code` varchar(10) NOT NULL,
  `jobTitle` varchar(100) NOT NULL,
  `departmentId` int(11) NOT NULL,
  `openingCount` int(11) NOT NULL,
  `requiredSkills` varchar(255) NOT NULL,
  `minExperience` int(11) NOT NULL,
  `jobDescription` text DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `openings`
--

INSERT INTO `openings` (`jobid`, `code`, `jobTitle`, `departmentId`, `openingCount`, `requiredSkills`, `minExperience`, `jobDescription`, `isActive`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'OP-001', 'Digital Marketing Executive', 1, 2, 'SEO, Google Ads, Meta Ads', 2, 'Looking for a Digital Marketing Executive.', 1, '2026-08-12 05:10:32', '2026-08-18 09:42:53', NULL),
(2, 'JOB002', 'Ipsum nobis rerum i', 1, 3, 'Sed esse voluptas qu', 5, 'lorem', 1, '2026-08-12 09:48:24', '2026-08-17 07:38:13', '2026-08-17 07:38:13'),
(3, 'WD-001', 'Front End Engineer', 41, 3, 'lorem', 0, 'lorem', 1, '2026-08-17 06:43:22', '2026-08-18 10:22:41', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expiresAt` datetime NOT NULL,
  `isUsed` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL,
  `moduleId` int(11) NOT NULL,
  `action` varchar(100) NOT NULL,
  `permissionKey` varchar(150) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_assignments`
--

CREATE TABLE `project_assignments` (
  `id` int(11) NOT NULL,
  `projectOnboardId` int(11) NOT NULL,
  `assignedToId` int(11) NOT NULL,
  `reportingHeadId` int(11) DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'In Progress',
  `assignedBy` int(11) DEFAULT NULL,
  `assignedAt` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_onboards`
--

CREATE TABLE `project_onboards` (
  `id` int(11) NOT NULL,
  `leadId` int(11) DEFAULT NULL,
  `projectName` varchar(200) NOT NULL,
  `companyName` varchar(200) NOT NULL,
  `projectManagerIds` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`projectManagerIds`)),
  `spocIds` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`spocIds`)),
  `serviceIds` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`serviceIds`)),
  `serviceDetails` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`serviceDetails`)),
  `assignedToIds` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`assignedToIds`)),
  `reportingHeadId` int(11) DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Pending',
  `createdBy` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `recruitments`
--

CREATE TABLE `recruitments` (
  `rid` int(11) NOT NULL,
  `cifid` int(11) NOT NULL,
  `interviewDateTime` datetime DEFAULT NULL,
  `interviewMode` varchar(50) DEFAULT NULL,
  `hrScreeningFeedback` text DEFAULT NULL,
  `technicalInterviewFeedback` text DEFAULT NULL,
  `mdFeedback` text DEFAULT NULL,
  `recruitmentStatus` varchar(50) DEFAULT NULL,
  `statusChangeNote` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `token` text NOT NULL,
  `deviceId` varchar(255) DEFAULT NULL,
  `deviceName` varchar(255) DEFAULT NULL,
  `browser` varchar(100) DEFAULT NULL,
  `os` varchar(100) DEFAULT NULL,
  `ipAddress` varchar(50) DEFAULT NULL,
  `userAgent` text DEFAULT NULL,
  `rotatedFromTokenId` int(11) DEFAULT NULL,
  `lastUsedAt` datetime DEFAULT NULL,
  `expiresAt` datetime NOT NULL,
  `isRevoked` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `refresh_tokens`
--

INSERT INTO `refresh_tokens` (`id`, `userId`, `token`, `deviceId`, `deviceName`, `browser`, `os`, `ipAddress`, `userAgent`, `rotatedFromTokenId`, `lastUsedAt`, `expiresAt`, `isRevoked`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzg2NTExMTIzLCJleHAiOjE3ODcxMTU5MjN9.9myqdHiGtFqcWI9EWt7GR1Q41GCwaZ16LoAxuslNSLM', NULL, 'Desktop', NULL, NULL, '::1', NULL, NULL, '2026-08-12 05:05:23', '2026-08-19 05:05:23', 0, '2026-08-12 05:05:23', '2026-08-12 05:05:23'),
(2, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg2NTExMzQ2LCJleHAiOjE3ODcxMTYxNDZ9.s95y2eYHbWODkWtaDeyG3d6ICnVG4SHu8bMNyA4Kra4', NULL, 'Desktop', NULL, NULL, '::1', NULL, NULL, '2026-08-12 05:09:06', '2026-08-19 05:09:06', 0, '2026-08-12 05:09:06', '2026-08-12 05:09:06'),
(3, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg2NTEyNTIzLCJleHAiOjE3ODcxMTczMjN9.uSQNzYg6XBOyWg-FrJyiVBWSgyGJJWnGV48rbRIfxWw', NULL, 'Desktop', 'Electron', 'Windows', '::1', NULL, NULL, '2026-08-12 05:28:43', '2026-08-19 05:28:43', 0, '2026-08-12 05:28:43', '2026-08-12 05:28:43'),
(4, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg2NTEyNTI5LCJleHAiOjE3ODcxMTczMjl9.78p-ktfeoPpkvCI6jHpuBNE87tJmdnefiXDqp5rt1DM', NULL, 'Desktop', 'Chrome', 'Windows', '::1', NULL, NULL, '2026-08-12 05:28:49', '2026-08-19 05:28:49', 1, '2026-08-12 05:28:49', '2026-08-12 12:24:07'),
(5, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg2NTE3MzM5LCJleHAiOjE3ODcxMjIxMzl9.agY41oKtOp5K9myiZ08PKXnqXDkTZF1eN9Jw4RpFJRg', NULL, 'Desktop', 'Chrome', 'Windows', '::1', NULL, NULL, '2026-08-12 06:48:59', '2026-08-19 06:48:59', 0, '2026-08-12 06:48:59', '2026-08-12 06:48:59'),
(6, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg2NTM3ODE1LCJleHAiOjE3ODcxNDI2MTV9.QCty1Ib690DEDDZY_0zDuPcCalRhSJXsdsDEcAtsEqQ', NULL, 'Desktop', 'Chrome', 'Windows', '::1', NULL, NULL, '2026-08-12 12:30:15', '2026-08-19 12:30:15', 0, '2026-08-12 12:30:15', '2026-08-12 12:30:15'),
(7, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg2NjgxNzM1LCJleHAiOjE3ODcyODY1MzV9.2e4ZjWQ7k3ke8HgD4N8623Ew1WaS-fuYx-WQsXZknfU', NULL, 'Desktop', 'Chrome', 'Windows', '::1', NULL, NULL, '2026-08-14 04:28:55', '2026-08-21 04:28:55', 0, '2026-08-14 04:28:55', '2026-08-14 04:28:55'),
(8, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg2Njg3MzQ2LCJleHAiOjE3ODcyOTIxNDZ9.__WSqpD9VBaUEBRU8xWkNqZbbUWaoiF133TPr0OUX6I', NULL, NULL, NULL, NULL, NULL, NULL, 3, '2026-08-14 06:02:26', '2026-08-21 06:02:26', 0, '2026-08-14 06:02:26', '2026-08-14 06:02:26'),
(9, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg2Njg3MzQ2LCJleHAiOjE3ODcyOTIxNDZ9.__WSqpD9VBaUEBRU8xWkNqZbbUWaoiF133TPr0OUX6I', NULL, NULL, NULL, NULL, NULL, NULL, 3, '2026-08-14 06:02:26', '2026-08-21 06:02:26', 0, '2026-08-14 06:02:26', '2026-08-14 06:02:26'),
(10, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg2OTM5NDUyLCJleHAiOjE3ODc1NDQyNTJ9.Gkc1SHVVIAgoEoG8VfW2Hb4m0Z8cfxzhzuknZHkkRzA', NULL, NULL, NULL, NULL, NULL, NULL, 8, '2026-08-17 04:04:12', '2026-08-24 04:04:12', 0, '2026-08-17 04:04:12', '2026-08-17 04:04:12'),
(11, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg2OTM5NDUyLCJleHAiOjE3ODc1NDQyNTJ9.Gkc1SHVVIAgoEoG8VfW2Hb4m0Z8cfxzhzuknZHkkRzA', NULL, NULL, NULL, NULL, NULL, NULL, 8, '2026-08-17 04:04:12', '2026-08-24 04:04:12', 0, '2026-08-17 04:04:12', '2026-08-17 04:04:12'),
(12, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg2OTM5NDY3LCJleHAiOjE3ODc1NDQyNjd9.ftqb6zBwzc1CXW9ebMTVhdRmGI4W7O8df5e6F8-o3mk', NULL, NULL, NULL, NULL, NULL, NULL, 7, '2026-08-17 04:04:27', '2026-08-24 04:04:27', 1, '2026-08-17 04:04:27', '2026-08-17 05:03:53'),
(13, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg2OTM5NDY3LCJleHAiOjE3ODc1NDQyNjd9.ftqb6zBwzc1CXW9ebMTVhdRmGI4W7O8df5e6F8-o3mk', NULL, NULL, NULL, NULL, NULL, NULL, 7, '2026-08-17 04:04:27', '2026-08-24 04:04:27', 1, '2026-08-17 04:04:27', '2026-08-17 05:03:53'),
(14, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg2OTQzMDM4LCJleHAiOjE3ODc1NDc4Mzh9.suhWqrgd_LUw7nwe12pJtXF4H11CLaZqSvx1H7zJG1s', NULL, 'Desktop', 'Chrome', 'Windows', '::1', NULL, NULL, '2026-08-17 05:03:58', '2026-08-24 05:03:58', 0, '2026-08-17 05:03:58', '2026-08-17 05:03:58'),
(15, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg3MDI2OTU0LCJleHAiOjE3ODc2MzE3NTR9.NmMubZ5gXFNmgNfhhurZVFptdWnk7uglcRB0SilW9WM', NULL, 'Desktop', 'Chrome', 'Windows', '::1', NULL, NULL, '2026-08-18 04:22:34', '2026-08-25 04:22:34', 0, '2026-08-18 04:22:34', '2026-08-18 04:22:34'),
(16, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg3MDM0NTEyLCJleHAiOjE3ODc2MzkzMTJ9.tlpOvq7ljPm6oHETGvgjP-rkJ82GFpmk3lvlLQpzF6w', NULL, 'Desktop', 'Chrome', 'Windows', '::1', NULL, NULL, '2026-08-18 06:28:32', '2026-08-25 06:28:32', 1, '2026-08-18 06:28:32', '2026-08-18 09:14:24'),
(17, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg3MDQ0NDY4LCJleHAiOjE3ODc2NDkyNjh9.4EXlcyMInbm0z5sVR1jnfFLAP8G6ymwsweSW-SqGSns', NULL, 'Desktop', 'Chrome', 'Windows', '::1', NULL, NULL, '2026-08-18 09:14:28', '2026-08-25 09:14:28', 0, '2026-08-18 09:14:28', '2026-08-18 09:14:28'),
(18, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg3MTE2ODkxLCJleHAiOjE3ODc3MjE2OTF9.Gc0Bw6138069u82onjkGXmzKvyQCpWoAXnbXQLXH_Ew', NULL, NULL, NULL, NULL, NULL, NULL, 10, '2026-08-19 05:21:31', '2026-08-26 05:21:31', 0, '2026-08-19 05:21:31', '2026-08-19 05:21:31'),
(19, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg3MTE2ODkxLCJleHAiOjE3ODc3MjE2OTF9.Gc0Bw6138069u82onjkGXmzKvyQCpWoAXnbXQLXH_Ew', NULL, NULL, NULL, NULL, NULL, NULL, 10, '2026-08-19 05:21:31', '2026-08-26 05:21:31', 0, '2026-08-19 05:21:31', '2026-08-19 05:21:31');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `code` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `code`, `description`, `isActive`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Super admin', 'SUPER_ADMIN', 'Will ERP CRM all Access', 1, '2026-08-12 05:00:45', '2026-08-12 05:00:45', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `roleId` int(11) NOT NULL,
  `permissionId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `serviceCategoryId` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `code` varchar(100) NOT NULL,
  `displayOrder` int(11) DEFAULT 1,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `serviceCategoryId`, `name`, `code`, `displayOrder`, `isActive`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 1, 'Website', 'SITE', 1, 1, '2026-08-04 07:44:25', '2026-08-04 07:44:25', NULL),
(2, 1, 'SEO', 'SEO', 2, 1, '2026-08-04 07:44:47', '2026-08-04 07:44:47', NULL),
(5, 1, 'SMM', 'SMM', 3, 1, '2026-08-13 06:52:56', '2026-08-13 06:52:56', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `service_categories`
--

CREATE TABLE `service_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `code` varchar(100) NOT NULL,
  `color` varchar(30) DEFAULT NULL,
  `displayOrder` int(11) DEFAULT 1,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service_categories`
--

INSERT INTO `service_categories` (`id`, `name`, `code`, `color`, `displayOrder`, `isActive`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'DM', 'DM', '#2563EB', 1, 1, '2026-08-12 05:09:44', '2026-08-12 06:28:33', NULL),
(3, 'Operations', 'OP', '#eb24e4', 3, 1, '2026-08-13 05:46:28', '2026-08-13 05:46:36', NULL),
(4, 'Web Development', 'WEB', '#24e7eb', 4, 1, '2026-08-13 05:52:47', '2026-08-13 05:52:47', NULL),
(5, 'Content', 'CONTENT', '#e9944e', 5, 1, '2026-08-13 05:53:16', '2026-08-13 05:53:16', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `uuid` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `employeeRecord` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `uuid`, `firstName`, `lastName`, `email`, `username`, `phone`, `employeeRecord`, `password`, `isActive`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'fbcb72e0-85cd-4a50-8fe1-c26a4b44d914', 'admin', '', 'admin@gmail.com', NULL, NULL, NULL, '$2b$10$cfw/OB7x0/I9q//ycdQQwe4VEGnPdgubHw1hUzVc4VaX3V9OZRZP6', 1, '2026-08-12 05:05:18', '2026-08-12 05:05:18', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `userId` int(11) NOT NULL,
  `roleId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`userId`, `roleId`) VALUES
(1, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cif_academics`
--
ALTER TABLE `cif_academics`
  ADD PRIMARY KEY (`academicid`),
  ADD KEY `cifid` (`cifid`);

--
-- Indexes for table `cif_experiences`
--
ALTER TABLE `cif_experiences`
  ADD PRIMARY KEY (`eid`),
  ADD KEY `cifid` (`cifid`);

--
-- Indexes for table `cif_languages`
--
ALTER TABLE `cif_languages`
  ADD PRIMARY KEY (`languageid`),
  ADD KEY `cifid` (`cifid`);

--
-- Indexes for table `cif_personals`
--
ALTER TABLE `cif_personals`
  ADD PRIMARY KEY (`cifid`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `appliedPosition` (`appliedPosition`);

--
-- Indexes for table `cif_references`
--
ALTER TABLE `cif_references`
  ADD PRIMARY KEY (`referenceid`),
  ADD KEY `cifid` (`cifid`);

--
-- Indexes for table `cif_skills`
--
ALTER TABLE `cif_skills`
  ADD PRIMARY KEY (`skillid`),
  ADD KEY `cifid` (`cifid`);

--
-- Indexes for table `cif_softwares`
--
ALTER TABLE `cif_softwares`
  ADD PRIMARY KEY (`softwareid`),
  ADD KEY `cifid` (`cifid`);

--
-- Indexes for table `cif_submissions`
--
ALTER TABLE `cif_submissions`
  ADD PRIMARY KEY (`cifappid`),
  ADD KEY `cifid` (`cifid`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employeeCode` (`employeeCode`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `employeeCode_2` (`employeeCode`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `employeeCode_3` (`employeeCode`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `employeeCode_4` (`employeeCode`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD KEY `createdBy` (`createdBy`);

--
-- Indexes for table `inductions`
--
ALTER TABLE `inductions`
  ADD PRIMARY KEY (`iid`),
  ADD KEY `cifid` (`cifid`),
  ADD KEY `onboardinginfoid` (`onboardinginfoid`);

--
-- Indexes for table `leads`
--
ALTER TABLE `leads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `leadSourceId` (`leadSourceId`),
  ADD KEY `leadStatusId` (`leadStatusId`),
  ADD KEY `assignedTo` (`assignedTo`);

--
-- Indexes for table `lead_history`
--
ALTER TABLE `lead_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `leadId` (`leadId`),
  ADD KEY `changedBy` (`changedBy`);

--
-- Indexes for table `lead_services`
--
ALTER TABLE `lead_services`
  ADD PRIMARY KEY (`leadId`,`serviceId`),
  ADD UNIQUE KEY `lead_services_serviceId_leadId_unique` (`leadId`,`serviceId`),
  ADD KEY `serviceId` (`serviceId`);

--
-- Indexes for table `lead_sources`
--
ALTER TABLE `lead_sources`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `lead_statuses`
--
ALTER TABLE `lead_statuses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `modules`
--
ALTER TABLE `modules`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `office_tours`
--
ALTER TABLE `office_tours`
  ADD PRIMARY KEY (`otid`),
  ADD KEY `cifid` (`cifid`),
  ADD KEY `onboardinginfoid` (`onboardinginfoid`);

--
-- Indexes for table `onboardings`
--
ALTER TABLE `onboardings`
  ADD PRIMARY KEY (`onboardingid`),
  ADD KEY `cifid` (`cifid`),
  ADD KEY `onboardinginfoid` (`onboardinginfoid`);

--
-- Indexes for table `onboarding_banks`
--
ALTER TABLE `onboarding_banks`
  ADD PRIMARY KEY (`bid`),
  ADD KEY `cifid` (`cifid`),
  ADD KEY `onboardinginfoid` (`onboardinginfoid`);

--
-- Indexes for table `onboarding_documents`
--
ALTER TABLE `onboarding_documents`
  ADD PRIMARY KEY (`did`),
  ADD KEY `cifid` (`cifid`),
  ADD KEY `onboardinginfoid` (`onboardinginfoid`),
  ADD KEY `bid` (`bid`);

--
-- Indexes for table `onboarding_equipments`
--
ALTER TABLE `onboarding_equipments`
  ADD PRIMARY KEY (`eqid`),
  ADD KEY `cifid` (`cifid`),
  ADD KEY `onboardinginfoid` (`onboardinginfoid`);

--
-- Indexes for table `onboarding_health`
--
ALTER TABLE `onboarding_health`
  ADD PRIMARY KEY (`hid`),
  ADD KEY `cifid` (`cifid`),
  ADD KEY `onboardinginfoid` (`onboardinginfoid`);

--
-- Indexes for table `onboard_info`
--
ALTER TABLE `onboard_info`
  ADD PRIMARY KEY (`onboardinginfoid`),
  ADD UNIQUE KEY `officialemail` (`officialemail`),
  ADD UNIQUE KEY `officialphone` (`officialphone`),
  ADD KEY `department` (`department`),
  ADD KEY `eid` (`eid`),
  ADD KEY `academicid` (`academicid`);

--
-- Indexes for table `openings`
--
ALTER TABLE `openings`
  ADD PRIMARY KEY (`jobid`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `departmentId` (`departmentId`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissionKey` (`permissionKey`),
  ADD KEY `moduleId` (`moduleId`);

--
-- Indexes for table `project_assignments`
--
ALTER TABLE `project_assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `projectOnboardId` (`projectOnboardId`),
  ADD KEY `assignedToId` (`assignedToId`),
  ADD KEY `reportingHeadId` (`reportingHeadId`),
  ADD KEY `assignedBy` (`assignedBy`);

--
-- Indexes for table `project_onboards`
--
ALTER TABLE `project_onboards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `leadId` (`leadId`),
  ADD KEY `createdBy` (`createdBy`);

--
-- Indexes for table `recruitments`
--
ALTER TABLE `recruitments`
  ADD PRIMARY KEY (`rid`),
  ADD KEY `cifid` (`cifid`);

--
-- Indexes for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `refresh_tokens_user_id` (`userId`),
  ADD KEY `refresh_tokens_token` (`token`(768)),
  ADD KEY `refresh_tokens_is_revoked` (`isRevoked`),
  ADD KEY `refresh_tokens_expires_at` (`expiresAt`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`roleId`,`permissionId`),
  ADD UNIQUE KEY `role_permissions_permissionId_roleId_unique` (`roleId`,`permissionId`),
  ADD KEY `permissionId` (`permissionId`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `serviceCategoryId` (`serviceCategoryId`);

--
-- Indexes for table `service_categories`
--
ALTER TABLE `service_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`userId`,`roleId`),
  ADD UNIQUE KEY `user_roles_roleId_userId_unique` (`userId`,`roleId`),
  ADD KEY `roleId` (`roleId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cif_academics`
--
ALTER TABLE `cif_academics`
  MODIFY `academicid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cif_experiences`
--
ALTER TABLE `cif_experiences`
  MODIFY `eid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cif_languages`
--
ALTER TABLE `cif_languages`
  MODIFY `languageid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cif_personals`
--
ALTER TABLE `cif_personals`
  MODIFY `cifid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cif_references`
--
ALTER TABLE `cif_references`
  MODIFY `referenceid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cif_skills`
--
ALTER TABLE `cif_skills`
  MODIFY `skillid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cif_softwares`
--
ALTER TABLE `cif_softwares`
  MODIFY `softwareid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `cif_submissions`
--
ALTER TABLE `cif_submissions`
  MODIFY `cifappid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `inductions`
--
ALTER TABLE `inductions`
  MODIFY `iid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leads`
--
ALTER TABLE `leads`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `lead_history`
--
ALTER TABLE `lead_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `lead_sources`
--
ALTER TABLE `lead_sources`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `lead_statuses`
--
ALTER TABLE `lead_statuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `modules`
--
ALTER TABLE `modules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `office_tours`
--
ALTER TABLE `office_tours`
  MODIFY `otid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `onboardings`
--
ALTER TABLE `onboardings`
  MODIFY `onboardingid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `onboarding_banks`
--
ALTER TABLE `onboarding_banks`
  MODIFY `bid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `onboarding_documents`
--
ALTER TABLE `onboarding_documents`
  MODIFY `did` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `onboarding_equipments`
--
ALTER TABLE `onboarding_equipments`
  MODIFY `eqid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `onboarding_health`
--
ALTER TABLE `onboarding_health`
  MODIFY `hid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `onboard_info`
--
ALTER TABLE `onboard_info`
  MODIFY `onboardinginfoid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `openings`
--
ALTER TABLE `openings`
  MODIFY `jobid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `recruitments`
--
ALTER TABLE `recruitments`
  MODIFY `rid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `service_categories`
--
ALTER TABLE `service_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cif_academics`
--
ALTER TABLE `cif_academics`
  ADD CONSTRAINT `cif_academics_ibfk_1` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `cif_experiences`
--
ALTER TABLE `cif_experiences`
  ADD CONSTRAINT `cif_experiences_ibfk_1` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `cif_languages`
--
ALTER TABLE `cif_languages`
  ADD CONSTRAINT `cif_languages_ibfk_1` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `cif_personals`
--
ALTER TABLE `cif_personals`
  ADD CONSTRAINT `cif_personals_ibfk_1` FOREIGN KEY (`appliedPosition`) REFERENCES `openings` (`jobid`);

--
-- Constraints for table `cif_references`
--
ALTER TABLE `cif_references`
  ADD CONSTRAINT `cif_references_ibfk_1` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `cif_skills`
--
ALTER TABLE `cif_skills`
  ADD CONSTRAINT `cif_skills_ibfk_1` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `cif_softwares`
--
ALTER TABLE `cif_softwares`
  ADD CONSTRAINT `cif_softwares_ibfk_1` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `cif_submissions`
--
ALTER TABLE `cif_submissions`
  ADD CONSTRAINT `cif_submissions_ibfk_1` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`);

--
-- Constraints for table `inductions`
--
ALTER TABLE `inductions`
  ADD CONSTRAINT `inductions_ibfk_1` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`),
  ADD CONSTRAINT `inductions_ibfk_2` FOREIGN KEY (`onboardinginfoid`) REFERENCES `onboard_info` (`onboardinginfoid`);

--
-- Constraints for table `leads`
--
ALTER TABLE `leads`
  ADD CONSTRAINT `leads_ibfk_1` FOREIGN KEY (`leadSourceId`) REFERENCES `lead_sources` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `leads_ibfk_2` FOREIGN KEY (`leadStatusId`) REFERENCES `lead_statuses` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `leads_ibfk_3` FOREIGN KEY (`assignedTo`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `lead_history`
--
ALTER TABLE `lead_history`
  ADD CONSTRAINT `lead_history_ibfk_1` FOREIGN KEY (`leadId`) REFERENCES `leads` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `lead_history_ibfk_2` FOREIGN KEY (`changedBy`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `lead_services`
--
ALTER TABLE `lead_services`
  ADD CONSTRAINT `lead_services_ibfk_1` FOREIGN KEY (`leadId`) REFERENCES `leads` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `lead_services_ibfk_2` FOREIGN KEY (`serviceId`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `office_tours`
--
ALTER TABLE `office_tours`
  ADD CONSTRAINT `office_tours_ibfk_1` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`),
  ADD CONSTRAINT `office_tours_ibfk_2` FOREIGN KEY (`onboardinginfoid`) REFERENCES `onboard_info` (`onboardinginfoid`);

--
-- Constraints for table `onboardings`
--
ALTER TABLE `onboardings`
  ADD CONSTRAINT `onboardings_ibfk_1` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`),
  ADD CONSTRAINT `onboardings_ibfk_2` FOREIGN KEY (`onboardinginfoid`) REFERENCES `onboard_info` (`onboardinginfoid`);

--
-- Constraints for table `onboarding_banks`
--
ALTER TABLE `onboarding_banks`
  ADD CONSTRAINT `onboarding_banks_ibfk_1` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`),
  ADD CONSTRAINT `onboarding_banks_ibfk_2` FOREIGN KEY (`onboardinginfoid`) REFERENCES `onboard_info` (`onboardinginfoid`);

--
-- Constraints for table `onboarding_documents`
--
ALTER TABLE `onboarding_documents`
  ADD CONSTRAINT `onboarding_documents_ibfk_1` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`),
  ADD CONSTRAINT `onboarding_documents_ibfk_2` FOREIGN KEY (`onboardinginfoid`) REFERENCES `onboard_info` (`onboardinginfoid`),
  ADD CONSTRAINT `onboarding_documents_ibfk_3` FOREIGN KEY (`bid`) REFERENCES `onboarding_banks` (`bid`);

--
-- Constraints for table `onboarding_equipments`
--
ALTER TABLE `onboarding_equipments`
  ADD CONSTRAINT `onboarding_equipments_ibfk_1` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`),
  ADD CONSTRAINT `onboarding_equipments_ibfk_2` FOREIGN KEY (`onboardinginfoid`) REFERENCES `onboard_info` (`onboardinginfoid`);

--
-- Constraints for table `onboarding_health`
--
ALTER TABLE `onboarding_health`
  ADD CONSTRAINT `onboarding_health_ibfk_1` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`),
  ADD CONSTRAINT `onboarding_health_ibfk_2` FOREIGN KEY (`onboardinginfoid`) REFERENCES `onboard_info` (`onboardinginfoid`);

--
-- Constraints for table `onboard_info`
--
ALTER TABLE `onboard_info`
  ADD CONSTRAINT `onboard_info_ibfk_1` FOREIGN KEY (`department`) REFERENCES `departments` (`id`),
  ADD CONSTRAINT `onboard_info_ibfk_2` FOREIGN KEY (`eid`) REFERENCES `cif_experiences` (`eid`),
  ADD CONSTRAINT `onboard_info_ibfk_3` FOREIGN KEY (`academicid`) REFERENCES `cif_academics` (`academicid`);

--
-- Constraints for table `openings`
--
ALTER TABLE `openings`
  ADD CONSTRAINT `openings_ibfk_1` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`);

--
-- Constraints for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD CONSTRAINT `password_reset_tokens_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `permissions`
--
ALTER TABLE `permissions`
  ADD CONSTRAINT `permissions_ibfk_1` FOREIGN KEY (`moduleId`) REFERENCES `modules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `recruitments`
--
ALTER TABLE `recruitments`
  ADD CONSTRAINT `recruitments_ibfk_1` FOREIGN KEY (`cifid`) REFERENCES `cif_personals` (`cifid`);

--
-- Constraints for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permissionId`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `services_ibfk_1` FOREIGN KEY (`serviceCategoryId`) REFERENCES `service_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
