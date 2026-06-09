-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 07, 2026 at 04:10 PM
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
-- Database: `flappybird`
--

-- --------------------------------------------------------

--
-- Table structure for table `scores`
--

CREATE TABLE `scores` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `score` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `scores`
--

INSERT INTO `scores` (`id`, `name`, `score`, `created_at`) VALUES
(11, 'das', 0, '2026-06-07 21:41:09'),
(12, 'Player', 0, '2026-06-07 21:41:34'),
(13, 'Player', 0, '2026-06-07 21:41:54'),
(14, 'Player', 15, '2026-06-07 21:42:10'),
(15, 'Player', 1, '2026-06-07 21:42:44'),
(16, 'Player', 0, '2026-06-07 21:42:46'),
(17, 'Player', 0, '2026-06-07 21:42:47'),
(18, 'Player', 1, '2026-06-07 21:42:49'),
(19, 'Player', 0, '2026-06-07 21:44:22'),
(20, 'Player', 0, '2026-06-07 21:47:30'),
(21, 'Player', 0, '2026-06-07 21:47:33'),
(22, 'Player', 7, '2026-06-07 21:55:41'),
(23, 'Player', 0, '2026-06-07 21:55:51'),
(24, 'Player', 0, '2026-06-07 21:55:54'),
(25, 'Player', 0, '2026-06-07 21:56:04');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `scores`
--
ALTER TABLE `scores`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `scores`
--
ALTER TABLE `scores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
