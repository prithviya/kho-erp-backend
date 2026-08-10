-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 07, 2026 at 07:40 AM
-- Server version: 11.8.8-MariaDB-log
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u874184579_Willerp`
--

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
(1, 'Ayers and Knapp Plc', 'In ex adipisicing qu', '7418520963', 'nixesebida@mailinator.com', 'Iste id mollit eu ea', 64999.00, 1, 1, 1, NULL, 'Eum enim expedita dolor iusto voluptatem in sed et ex iure blanditiis optio laborum placeat velit nulla dolor', '2026-08-05', 1, '2026-08-04 07:55:32', '2026-08-04 07:55:32', NULL),
(2, 'Nash Rivera LLC', 'Nesciunt aliquid an', '9638520741', 'qeteso@mailinator.com', 'Est aut repellendus', 30000.00, 2, 2, 1, NULL, 'Molestiae velit provident earum officia autem maxime cupidatat sit voluptatem Qui rerum sed reprehenderit voluptatem', '2026-08-02', 1, '2026-08-04 07:57:10', '2026-08-04 07:58:06', NULL),
(3, 'Test', 'Gokul', '2332323232', 'a@a.in', '', 33221.00, 4, 3, NULL, NULL, '', NULL, 1, '2026-08-06 12:09:19', '2026-08-06 12:19:47', NULL);

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
(1, 1, NULL, NULL, 'Lead Created', 1, '2026-08-04 07:55:32'),
(2, 2, NULL, NULL, 'Lead Created', 1, '2026-08-04 07:57:10'),
(3, 2, 2, 2, 'Lead Updated', 1, '2026-08-04 07:58:06'),
(4, 3, NULL, NULL, 'Lead Created', 1, '2026-08-06 12:09:19'),
(5, 3, 2, 2, 'Lead Updated', 1, '2026-08-06 12:13:20'),
(6, 3, 2, 2, 'Lead Updated', 1, '2026-08-06 12:13:30'),
(7, 3, 3, 3, 'Lead Updated', 1, '2026-08-06 12:18:11'),
(8, 3, 3, 3, 'Lead Updated', 1, '2026-08-06 12:19:47');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

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
(3, 1),
(3, 2);

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
(1, 'Website', 'WEBSITE', '', 1, 1, '2026-08-04 07:53:36', '2026-08-04 07:53:36', NULL),
(2, 'Instagram', 'INSTA', '', 1, 2, '2026-08-04 07:53:51', '2026-08-04 07:53:51', NULL),
(3, 'Facebook', 'FB', '', 1, 3, '2026-08-04 07:54:26', '2026-08-04 07:54:26', NULL),
(4, 'Referral', 'REFERRAL', '', 1, 4, '2026-08-06 12:19:20', '2026-08-06 12:19:20', NULL);

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
(1, 'New', 'NEW', '#2563EB', 'A new lead awaiting initial contact.', 1, 0, 1, 1, '2026-08-04 07:48:57', '2026-08-04 07:50:02', NULL),
(2, 'Contacted', 'CONTACTED', '#00ad42', ' Initial contact has been made with the lead.', 0, 0, 2, 1, '2026-08-04 07:49:49', '2026-08-06 12:17:45', NULL),
(3, 'Proposal', 'PROPOSAL', '#b719cc', 'A quotation or proposal has been shared with the lead.', 0, 0, 3, 1, '2026-08-04 07:51:51', '2026-08-06 12:18:02', NULL);

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
(1, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg1ODI5MzI2LCJleHAiOjE3ODY0MzQxMjZ9.Aoj6hzrgZY6ANHHW8Vj_1zPplmlQ7aVTaFUxyowQgP4', NULL, 'Desktop', 'Chrome', 'Windows', '::1', NULL, NULL, '2026-08-04 07:42:06', '2026-08-11 07:42:06', 0, '2026-08-04 07:42:06', '2026-08-04 07:42:06'),
(2, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg1OTAyMjkyLCJleHAiOjE3ODY1MDcwOTJ9.9T6APdXY5luukn0HIQETnm0jQItkbA5J7t1xdAgA0rA', NULL, 'Desktop', 'Electron', 'Windows', '::1', NULL, NULL, '2026-08-05 03:58:12', '2026-08-12 03:58:12', 0, '2026-08-05 03:58:12', '2026-08-05 03:58:12'),
(3, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg1OTk0OTA4LCJleHAiOjE3ODY1OTk3MDh9.ifCdfi2Qgt5kkj4yC9wbgAzOoGtdQwWqCoi57cu-OxE', NULL, 'Desktop', 'Chrome', 'Windows', '::1', NULL, NULL, '2026-08-06 05:41:48', '2026-08-13 05:41:48', 0, '2026-08-06 05:41:48', '2026-08-06 05:41:48'),
(4, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg2MDExMDc5LCJleHAiOjE3ODY2MTU4Nzl9.fLKJbbRXFEs9ikM2jmgUePrKdxc6EEHKPyW9Y-couEI', NULL, NULL, NULL, NULL, NULL, NULL, 2, '2026-08-06 10:11:19', '2026-08-13 10:11:19', 0, '2026-08-06 10:11:19', '2026-08-06 10:11:19'),
(5, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg2MDExMDc5LCJleHAiOjE3ODY2MTU4Nzl9.fLKJbbRXFEs9ikM2jmgUePrKdxc6EEHKPyW9Y-couEI', NULL, NULL, NULL, NULL, NULL, NULL, 2, '2026-08-06 10:11:19', '2026-08-13 10:11:19', 0, '2026-08-06 10:11:19', '2026-08-06 10:11:19'),
(6, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg2MDE3NDI2LCJleHAiOjE3ODY2MjIyMjZ9.r8i2BKKVY9fyZknMSxwTJfxuoWfQW6gLd0lQKz5DUi0', NULL, 'Desktop', 'Chrome', 'Windows', '127.0.0.1', NULL, NULL, '2026-08-06 11:57:06', '2026-08-13 11:57:06', 0, '2026-08-06 11:57:06', '2026-08-06 11:57:06'),
(7, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzg2MDE3NDg3LCJleHAiOjE3ODY2MjIyODd9.EFZuQYxTB0cvwdLbBzMEHYxx1rWdiI9_37atI04P7Nk', NULL, 'Macintosh', 'Chrome', 'macOS', '127.0.0.1', NULL, NULL, '2026-08-06 11:58:07', '2026-08-13 11:58:07', 0, '2026-08-06 11:58:07', '2026-08-06 11:58:07');

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
(1, 'SUPER_ADMIN', 'SUPER_ADMIN', 'Will ERP over all Access', 1, '2026-08-04 07:40:17', '2026-08-04 07:40:17', NULL);

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
(2, 1, 'SEO', 'SEO', 2, 1, '2026-08-04 07:44:47', '2026-08-04 07:44:47', NULL);

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
(1, 'Digital Marketing', 'DM', '#024ef2', 1, 1, '2026-08-04 07:42:53', '2026-08-04 07:42:53', NULL),
(2, 'Designer', 'DESIGN', '#20926c', 2, 1, '2026-08-04 07:43:55', '2026-08-04 07:44:59', NULL);

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
(1, '3d542379-cb3c-4d56-bdd7-b7ee574d6fa0', 'admin', '', 'admin@gmail.com', NULL, NULL, NULL, '$2b$10$6jTe4cIPoR7CM6U6usns3OrNrX.V8TRwyH01783zjqFfU7JKvA7w.', 1, '2026-08-04 07:41:35', '2026-08-04 07:41:35', NULL);

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
  ADD UNIQUE KEY `employeeCode_5` (`employeeCode`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `employeeCode_6` (`employeeCode`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `employeeCode_7` (`employeeCode`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `employeeCode_8` (`employeeCode`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `employeeCode_9` (`employeeCode`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `employeeCode_10` (`employeeCode`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `employeeCode_11` (`employeeCode`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `employeeCode_12` (`employeeCode`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `employeeCode_13` (`employeeCode`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `employeeCode_14` (`employeeCode`),
  ADD UNIQUE KEY `employeeCode_15` (`employeeCode`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `employeeCode_16` (`employeeCode`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `employeeCode_17` (`employeeCode`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `employeeCode_18` (`employeeCode`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `employeeCode_19` (`employeeCode`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `employeeCode_20` (`employeeCode`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `employeeCode_21` (`employeeCode`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `employeeCode_22` (`employeeCode`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD KEY `createdBy` (`createdBy`);

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
  ADD UNIQUE KEY `code` (`code`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `code_2` (`code`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `code_3` (`code`),
  ADD UNIQUE KEY `name_4` (`name`),
  ADD UNIQUE KEY `code_4` (`code`),
  ADD UNIQUE KEY `name_5` (`name`),
  ADD UNIQUE KEY `code_5` (`code`),
  ADD UNIQUE KEY `name_6` (`name`),
  ADD UNIQUE KEY `code_6` (`code`),
  ADD UNIQUE KEY `name_7` (`name`),
  ADD UNIQUE KEY `code_7` (`code`),
  ADD UNIQUE KEY `name_8` (`name`),
  ADD UNIQUE KEY `code_8` (`code`),
  ADD UNIQUE KEY `name_9` (`name`),
  ADD UNIQUE KEY `code_9` (`code`),
  ADD UNIQUE KEY `name_10` (`name`),
  ADD UNIQUE KEY `code_10` (`code`),
  ADD UNIQUE KEY `name_11` (`name`),
  ADD UNIQUE KEY `code_11` (`code`),
  ADD UNIQUE KEY `name_12` (`name`),
  ADD UNIQUE KEY `code_12` (`code`),
  ADD UNIQUE KEY `name_13` (`name`),
  ADD UNIQUE KEY `code_13` (`code`),
  ADD UNIQUE KEY `name_14` (`name`),
  ADD UNIQUE KEY `code_14` (`code`),
  ADD UNIQUE KEY `name_15` (`name`),
  ADD UNIQUE KEY `code_15` (`code`),
  ADD UNIQUE KEY `name_16` (`name`),
  ADD UNIQUE KEY `code_16` (`code`),
  ADD UNIQUE KEY `name_17` (`name`),
  ADD UNIQUE KEY `code_17` (`code`),
  ADD UNIQUE KEY `name_18` (`name`),
  ADD UNIQUE KEY `code_18` (`code`),
  ADD UNIQUE KEY `name_19` (`name`),
  ADD UNIQUE KEY `code_19` (`code`),
  ADD UNIQUE KEY `name_20` (`name`),
  ADD UNIQUE KEY `code_20` (`code`),
  ADD UNIQUE KEY `name_21` (`name`),
  ADD UNIQUE KEY `code_21` (`code`),
  ADD UNIQUE KEY `name_22` (`name`),
  ADD UNIQUE KEY `code_22` (`code`),
  ADD UNIQUE KEY `name_23` (`name`),
  ADD UNIQUE KEY `code_23` (`code`);

--
-- Indexes for table `lead_statuses`
--
ALTER TABLE `lead_statuses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `code` (`code`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `code_2` (`code`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `code_3` (`code`),
  ADD UNIQUE KEY `name_4` (`name`),
  ADD UNIQUE KEY `code_4` (`code`),
  ADD UNIQUE KEY `name_5` (`name`),
  ADD UNIQUE KEY `code_5` (`code`),
  ADD UNIQUE KEY `name_6` (`name`),
  ADD UNIQUE KEY `code_6` (`code`),
  ADD UNIQUE KEY `name_7` (`name`),
  ADD UNIQUE KEY `code_7` (`code`),
  ADD UNIQUE KEY `name_8` (`name`),
  ADD UNIQUE KEY `code_8` (`code`),
  ADD UNIQUE KEY `name_9` (`name`),
  ADD UNIQUE KEY `code_9` (`code`),
  ADD UNIQUE KEY `name_10` (`name`),
  ADD UNIQUE KEY `code_10` (`code`),
  ADD UNIQUE KEY `name_11` (`name`),
  ADD UNIQUE KEY `code_11` (`code`),
  ADD UNIQUE KEY `name_12` (`name`),
  ADD UNIQUE KEY `code_12` (`code`),
  ADD UNIQUE KEY `name_13` (`name`),
  ADD UNIQUE KEY `code_13` (`code`),
  ADD UNIQUE KEY `name_14` (`name`),
  ADD UNIQUE KEY `code_14` (`code`),
  ADD UNIQUE KEY `name_15` (`name`),
  ADD UNIQUE KEY `code_15` (`code`),
  ADD UNIQUE KEY `name_16` (`name`),
  ADD UNIQUE KEY `code_16` (`code`),
  ADD UNIQUE KEY `name_17` (`name`),
  ADD UNIQUE KEY `code_17` (`code`),
  ADD UNIQUE KEY `name_18` (`name`),
  ADD UNIQUE KEY `code_18` (`code`),
  ADD UNIQUE KEY `name_19` (`name`),
  ADD UNIQUE KEY `code_19` (`code`),
  ADD UNIQUE KEY `name_20` (`name`),
  ADD UNIQUE KEY `code_20` (`code`),
  ADD UNIQUE KEY `name_21` (`name`),
  ADD UNIQUE KEY `code_21` (`code`),
  ADD UNIQUE KEY `name_22` (`name`),
  ADD UNIQUE KEY `code_22` (`code`),
  ADD UNIQUE KEY `name_23` (`name`),
  ADD UNIQUE KEY `code_23` (`code`);

--
-- Indexes for table `modules`
--
ALTER TABLE `modules`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `code` (`code`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `code_2` (`code`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `code_3` (`code`),
  ADD UNIQUE KEY `name_4` (`name`),
  ADD UNIQUE KEY `code_4` (`code`),
  ADD UNIQUE KEY `name_5` (`name`),
  ADD UNIQUE KEY `code_5` (`code`),
  ADD UNIQUE KEY `name_6` (`name`),
  ADD UNIQUE KEY `code_6` (`code`),
  ADD UNIQUE KEY `name_7` (`name`),
  ADD UNIQUE KEY `code_7` (`code`),
  ADD UNIQUE KEY `name_8` (`name`),
  ADD UNIQUE KEY `code_8` (`code`),
  ADD UNIQUE KEY `name_9` (`name`),
  ADD UNIQUE KEY `code_9` (`code`),
  ADD UNIQUE KEY `name_10` (`name`),
  ADD UNIQUE KEY `code_10` (`code`),
  ADD UNIQUE KEY `name_11` (`name`),
  ADD UNIQUE KEY `code_11` (`code`),
  ADD UNIQUE KEY `name_12` (`name`),
  ADD UNIQUE KEY `code_12` (`code`),
  ADD UNIQUE KEY `name_13` (`name`),
  ADD UNIQUE KEY `code_13` (`code`),
  ADD UNIQUE KEY `name_14` (`name`),
  ADD UNIQUE KEY `code_14` (`code`),
  ADD UNIQUE KEY `name_15` (`name`),
  ADD UNIQUE KEY `code_15` (`code`),
  ADD UNIQUE KEY `name_16` (`name`),
  ADD UNIQUE KEY `code_16` (`code`),
  ADD UNIQUE KEY `name_17` (`name`),
  ADD UNIQUE KEY `code_17` (`code`),
  ADD UNIQUE KEY `name_18` (`name`),
  ADD UNIQUE KEY `code_18` (`code`),
  ADD UNIQUE KEY `name_19` (`name`),
  ADD UNIQUE KEY `code_19` (`code`),
  ADD UNIQUE KEY `name_20` (`name`),
  ADD UNIQUE KEY `code_20` (`code`),
  ADD UNIQUE KEY `name_21` (`name`),
  ADD UNIQUE KEY `code_21` (`code`),
  ADD UNIQUE KEY `name_22` (`name`),
  ADD UNIQUE KEY `code_22` (`code`),
  ADD UNIQUE KEY `name_23` (`name`),
  ADD UNIQUE KEY `code_23` (`code`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD UNIQUE KEY `token_2` (`token`),
  ADD UNIQUE KEY `token_3` (`token`),
  ADD UNIQUE KEY `token_4` (`token`),
  ADD UNIQUE KEY `token_5` (`token`),
  ADD UNIQUE KEY `token_6` (`token`),
  ADD UNIQUE KEY `token_7` (`token`),
  ADD UNIQUE KEY `token_8` (`token`),
  ADD UNIQUE KEY `token_9` (`token`),
  ADD UNIQUE KEY `token_10` (`token`),
  ADD UNIQUE KEY `token_11` (`token`),
  ADD UNIQUE KEY `token_12` (`token`),
  ADD UNIQUE KEY `token_13` (`token`),
  ADD UNIQUE KEY `token_14` (`token`),
  ADD UNIQUE KEY `token_15` (`token`),
  ADD UNIQUE KEY `token_16` (`token`),
  ADD UNIQUE KEY `token_17` (`token`),
  ADD UNIQUE KEY `token_18` (`token`),
  ADD UNIQUE KEY `token_19` (`token`),
  ADD UNIQUE KEY `token_20` (`token`),
  ADD UNIQUE KEY `token_21` (`token`),
  ADD UNIQUE KEY `token_22` (`token`),
  ADD UNIQUE KEY `token_23` (`token`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissionKey` (`permissionKey`),
  ADD UNIQUE KEY `permissionKey_2` (`permissionKey`),
  ADD UNIQUE KEY `permissionKey_3` (`permissionKey`),
  ADD UNIQUE KEY `permissionKey_4` (`permissionKey`),
  ADD UNIQUE KEY `permissionKey_5` (`permissionKey`),
  ADD UNIQUE KEY `permissionKey_6` (`permissionKey`),
  ADD UNIQUE KEY `permissionKey_7` (`permissionKey`),
  ADD UNIQUE KEY `permissionKey_8` (`permissionKey`),
  ADD UNIQUE KEY `permissionKey_9` (`permissionKey`),
  ADD UNIQUE KEY `permissionKey_10` (`permissionKey`),
  ADD UNIQUE KEY `permissionKey_11` (`permissionKey`),
  ADD UNIQUE KEY `permissionKey_12` (`permissionKey`),
  ADD UNIQUE KEY `permissionKey_13` (`permissionKey`),
  ADD UNIQUE KEY `permissionKey_14` (`permissionKey`),
  ADD UNIQUE KEY `permissionKey_15` (`permissionKey`),
  ADD UNIQUE KEY `permissionKey_16` (`permissionKey`),
  ADD UNIQUE KEY `permissionKey_17` (`permissionKey`),
  ADD UNIQUE KEY `permissionKey_18` (`permissionKey`),
  ADD UNIQUE KEY `permissionKey_19` (`permissionKey`),
  ADD UNIQUE KEY `permissionKey_20` (`permissionKey`),
  ADD UNIQUE KEY `permissionKey_21` (`permissionKey`),
  ADD UNIQUE KEY `permissionKey_22` (`permissionKey`),
  ADD UNIQUE KEY `permissionKey_23` (`permissionKey`),
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
  ADD UNIQUE KEY `code` (`code`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `code_2` (`code`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `code_3` (`code`),
  ADD UNIQUE KEY `name_4` (`name`),
  ADD UNIQUE KEY `code_4` (`code`),
  ADD UNIQUE KEY `name_5` (`name`),
  ADD UNIQUE KEY `code_5` (`code`),
  ADD UNIQUE KEY `name_6` (`name`),
  ADD UNIQUE KEY `code_6` (`code`),
  ADD UNIQUE KEY `name_7` (`name`),
  ADD UNIQUE KEY `code_7` (`code`),
  ADD UNIQUE KEY `name_8` (`name`),
  ADD UNIQUE KEY `code_8` (`code`),
  ADD UNIQUE KEY `name_9` (`name`),
  ADD UNIQUE KEY `code_9` (`code`),
  ADD UNIQUE KEY `name_10` (`name`),
  ADD UNIQUE KEY `code_10` (`code`),
  ADD UNIQUE KEY `name_11` (`name`),
  ADD UNIQUE KEY `code_11` (`code`),
  ADD UNIQUE KEY `name_12` (`name`),
  ADD UNIQUE KEY `code_12` (`code`),
  ADD UNIQUE KEY `name_13` (`name`),
  ADD UNIQUE KEY `code_13` (`code`),
  ADD UNIQUE KEY `name_14` (`name`),
  ADD UNIQUE KEY `code_14` (`code`),
  ADD UNIQUE KEY `name_15` (`name`),
  ADD UNIQUE KEY `code_15` (`code`),
  ADD UNIQUE KEY `name_16` (`name`),
  ADD UNIQUE KEY `code_16` (`code`),
  ADD UNIQUE KEY `name_17` (`name`),
  ADD UNIQUE KEY `code_17` (`code`),
  ADD UNIQUE KEY `name_18` (`name`),
  ADD UNIQUE KEY `code_18` (`code`),
  ADD UNIQUE KEY `name_19` (`name`),
  ADD UNIQUE KEY `code_19` (`code`),
  ADD UNIQUE KEY `name_20` (`name`),
  ADD UNIQUE KEY `code_20` (`code`),
  ADD UNIQUE KEY `name_21` (`name`),
  ADD UNIQUE KEY `code_21` (`code`),
  ADD UNIQUE KEY `name_22` (`name`),
  ADD UNIQUE KEY `code_22` (`code`),
  ADD UNIQUE KEY `name_23` (`name`),
  ADD UNIQUE KEY `code_23` (`code`);

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
  ADD UNIQUE KEY `code_2` (`code`),
  ADD UNIQUE KEY `code_3` (`code`),
  ADD UNIQUE KEY `code_4` (`code`),
  ADD UNIQUE KEY `code_5` (`code`),
  ADD UNIQUE KEY `code_6` (`code`),
  ADD UNIQUE KEY `code_7` (`code`),
  ADD UNIQUE KEY `code_8` (`code`),
  ADD UNIQUE KEY `code_9` (`code`),
  ADD UNIQUE KEY `code_10` (`code`),
  ADD UNIQUE KEY `code_11` (`code`),
  ADD UNIQUE KEY `code_12` (`code`),
  ADD UNIQUE KEY `code_13` (`code`),
  ADD UNIQUE KEY `code_14` (`code`),
  ADD UNIQUE KEY `code_15` (`code`),
  ADD UNIQUE KEY `code_16` (`code`),
  ADD UNIQUE KEY `code_17` (`code`),
  ADD UNIQUE KEY `code_18` (`code`),
  ADD UNIQUE KEY `code_19` (`code`),
  ADD UNIQUE KEY `code_20` (`code`),
  ADD UNIQUE KEY `code_21` (`code`),
  ADD UNIQUE KEY `code_22` (`code`),
  ADD UNIQUE KEY `code_23` (`code`),
  ADD KEY `serviceCategoryId` (`serviceCategoryId`);

--
-- Indexes for table `service_categories`
--
ALTER TABLE `service_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `code` (`code`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `code_2` (`code`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `code_3` (`code`),
  ADD UNIQUE KEY `name_4` (`name`),
  ADD UNIQUE KEY `code_4` (`code`),
  ADD UNIQUE KEY `name_5` (`name`),
  ADD UNIQUE KEY `code_5` (`code`),
  ADD UNIQUE KEY `name_6` (`name`),
  ADD UNIQUE KEY `code_6` (`code`),
  ADD UNIQUE KEY `name_7` (`name`),
  ADD UNIQUE KEY `code_7` (`code`),
  ADD UNIQUE KEY `name_8` (`name`),
  ADD UNIQUE KEY `code_8` (`code`),
  ADD UNIQUE KEY `name_9` (`name`),
  ADD UNIQUE KEY `code_9` (`code`),
  ADD UNIQUE KEY `name_10` (`name`),
  ADD UNIQUE KEY `code_10` (`code`),
  ADD UNIQUE KEY `name_11` (`name`),
  ADD UNIQUE KEY `code_11` (`code`),
  ADD UNIQUE KEY `name_12` (`name`),
  ADD UNIQUE KEY `code_12` (`code`),
  ADD UNIQUE KEY `name_13` (`name`),
  ADD UNIQUE KEY `code_13` (`code`),
  ADD UNIQUE KEY `name_14` (`name`),
  ADD UNIQUE KEY `code_14` (`code`),
  ADD UNIQUE KEY `name_15` (`name`),
  ADD UNIQUE KEY `code_15` (`code`),
  ADD UNIQUE KEY `name_16` (`name`),
  ADD UNIQUE KEY `code_16` (`code`),
  ADD UNIQUE KEY `name_17` (`name`),
  ADD UNIQUE KEY `code_17` (`code`),
  ADD UNIQUE KEY `name_18` (`name`),
  ADD UNIQUE KEY `code_18` (`code`),
  ADD UNIQUE KEY `name_19` (`name`),
  ADD UNIQUE KEY `code_19` (`code`),
  ADD UNIQUE KEY `name_20` (`name`),
  ADD UNIQUE KEY `code_20` (`code`),
  ADD UNIQUE KEY `name_21` (`name`),
  ADD UNIQUE KEY `code_21` (`code`),
  ADD UNIQUE KEY `name_22` (`name`),
  ADD UNIQUE KEY `code_22` (`code`),
  ADD UNIQUE KEY `name_23` (`name`),
  ADD UNIQUE KEY `code_23` (`code`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD UNIQUE KEY `email_22` (`email`),
  ADD UNIQUE KEY `email_23` (`email`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `username_2` (`username`),
  ADD UNIQUE KEY `username_3` (`username`),
  ADD UNIQUE KEY `username_4` (`username`),
  ADD UNIQUE KEY `username_5` (`username`),
  ADD UNIQUE KEY `username_6` (`username`),
  ADD UNIQUE KEY `username_7` (`username`),
  ADD UNIQUE KEY `username_8` (`username`),
  ADD UNIQUE KEY `username_9` (`username`),
  ADD UNIQUE KEY `username_10` (`username`),
  ADD UNIQUE KEY `username_11` (`username`),
  ADD UNIQUE KEY `username_12` (`username`),
  ADD UNIQUE KEY `username_13` (`username`),
  ADD UNIQUE KEY `username_14` (`username`),
  ADD UNIQUE KEY `username_15` (`username`),
  ADD UNIQUE KEY `username_16` (`username`),
  ADD UNIQUE KEY `username_17` (`username`),
  ADD UNIQUE KEY `username_18` (`username`),
  ADD UNIQUE KEY `username_19` (`username`),
  ADD UNIQUE KEY `username_20` (`username`),
  ADD UNIQUE KEY `username_21` (`username`),
  ADD UNIQUE KEY `username_22` (`username`),
  ADD UNIQUE KEY `username_23` (`username`);

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
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leads`
--
ALTER TABLE `leads`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `lead_history`
--
ALTER TABLE `lead_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `lead_sources`
--
ALTER TABLE `lead_sources`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `lead_statuses`
--
ALTER TABLE `lead_statuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `modules`
--
ALTER TABLE `modules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
-- AUTO_INCREMENT for table `project_assignments`
--
ALTER TABLE `project_assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project_onboards`
--
ALTER TABLE `project_onboards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `service_categories`
--
ALTER TABLE `service_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `leads`
--
ALTER TABLE `leads`
  ADD CONSTRAINT `leads_ibfk_67` FOREIGN KEY (`leadSourceId`) REFERENCES `lead_sources` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `leads_ibfk_68` FOREIGN KEY (`leadStatusId`) REFERENCES `lead_statuses` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `leads_ibfk_69` FOREIGN KEY (`assignedTo`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `lead_history`
--
ALTER TABLE `lead_history`
  ADD CONSTRAINT `lead_history_ibfk_45` FOREIGN KEY (`leadId`) REFERENCES `leads` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `lead_history_ibfk_46` FOREIGN KEY (`changedBy`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `lead_services`
--
ALTER TABLE `lead_services`
  ADD CONSTRAINT `lead_services_ibfk_1` FOREIGN KEY (`leadId`) REFERENCES `leads` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `lead_services_ibfk_2` FOREIGN KEY (`serviceId`) REFERENCES `services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
-- Constraints for table `project_assignments`
--
ALTER TABLE `project_assignments`
  ADD CONSTRAINT `project_assignments_ibfk_85` FOREIGN KEY (`projectOnboardId`) REFERENCES `project_onboards` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `project_assignments_ibfk_86` FOREIGN KEY (`assignedToId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `project_assignments_ibfk_87` FOREIGN KEY (`reportingHeadId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `project_assignments_ibfk_88` FOREIGN KEY (`assignedBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `project_onboards`
--
ALTER TABLE `project_onboards`
  ADD CONSTRAINT `project_onboards_ibfk_43` FOREIGN KEY (`leadId`) REFERENCES `leads` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `project_onboards_ibfk_44` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

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
