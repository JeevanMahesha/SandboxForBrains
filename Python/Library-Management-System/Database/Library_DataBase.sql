-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 22, 2020 at 03:31 PM
-- Server version: 10.4.6-MariaDB
-- PHP Version: 7.3.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lms`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(20) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`) VALUES
(1, 'admin@admin.com', 'pbkdf2:sha256:150000$zgipcqdw$de685582842dfdf25041a52108340cd78b1cc41efb43b4660eb3b42736511527');

-- --------------------------------------------------------

--
-- Table structure for table `allbooks`
--

CREATE TABLE `allbooks` (
  `id` int(11) NOT NULL,
  `bookid` varchar(45) NOT NULL,
  `authorname` varchar(45) DEFAULT NULL,
  `bookname` varchar(45) DEFAULT NULL,
  `totalbook` int(11) DEFAULT NULL,
  `remainingbook` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `allbooks`
--

INSERT INTO `allbooks` (`id`, `bookid`, `authorname`, `bookname`, `totalbook`, `remainingbook`) VALUES
(1, 'LMSBOOKID0001', 'Goswami, Jaideva', 'Fundamentals of Wavelets', 228, 227),
(2, 'LMSBOOKID0002', 'Foreman, John', 'Data Smart', 235, 234),
(3, 'LMSBOOKID0003', 'Hawking, Stephen', 'God Created the Integers', 197, 196),
(4, 'LMSBOOKID0004', 'Dubner, Stephen', 'Superfreakonomics', 179, 179),
(5, 'LMSBOOKID0005', 'Said, Edward', 'Orientalism', 197, 197),
(6, 'LMSBOOKID0006', 'Vapnik, Vladimir', 'Nature of Statistical Learning Theory, The', 230, 229),
(7, 'LMSBOOKID0007', 'Menon, V P', 'Integration of the Indian States', 217, 217),
(8, 'LMSBOOKID0008', 'Mlodinow, Leonard', 'Drunkard\'s Walk, The', 197, 197),
(9, 'LMSBOOKID0009', 'Shih, Frank', 'Image Processing & Mathematical Morphology', 241, 241),
(10, 'LMSBOOKID0010', 'Konnikova, Maria', 'How to Think Like Sherlock Holmes', 240, 240),
(11, 'LMSBOOKID0011', 'Sebastian Gutierrez', 'Data Scientists at Work', 230, 230),
(12, 'LMSBOOKID0012', 'Vonnegut, Kurt', 'Slaughterhouse Five', 198, 198),
(13, 'LMSBOOKID0013', 'Villani, Cedric', 'Birth of a Theorem', 234, 234),
(14, 'LMSBOOKID0014', 'Sussman, Gerald', 'Structure & Interpretation of Computer Progra', 240, 240),
(15, 'LMSBOOKID0015', 'Eraly, Abraham', 'Age of Wrath, The', 238, 238),
(16, 'LMSBOOKID0016', 'Kafka, Frank', 'Trial, The', 198, 198),
(17, 'LMSBOOKID0017', 'Pratt, John', 'Statistical Decision Theory\'', 236, 236),
(18, 'LMSBOOKID0018', 'Nisbet, Robert', 'Data Mining Handbook', 242, 242),
(19, 'LMSBOOKID0019', 'Wells, H. G.', 'New Machiavelli, The', 180, 180),
(20, 'LMSBOOKID0020', 'Heisenberg, Werner', 'Physics & Philosophy', 197, 197),
(21, 'LMSBOOKID0021', 'Oram, Andy', 'Making Software', 232, 232),
(22, 'LMSBOOKID0022', 'Tao, Terence', 'Analysis, Vol I', 248, 248),
(23, 'LMSBOOKID0023', 'Conway, Drew', 'Machine Learning for Hackers', 233, 233),
(24, 'LMSBOOKID0024', 'Silver, Nate', 'Signal and the Noise, The', 233, 233),
(25, 'LMSBOOKID0025', 'McKinney, Wes', 'Python for Data Analysis', 233, 233),
(26, 'LMSBOOKID0026', 'Cormen, Thomas', 'Introduction to Algorithms', 234, 234),
(27, 'LMSBOOKID0027', 'Deb, Siddhartha', 'Beautiful and the Damned, The', 198, 198),
(28, 'LMSBOOKID0028', 'Camus, Albert', 'Outsider, The', 198, 198),
(29, 'LMSBOOKID0029', 'Doyle, Arthur Conan', 'Complete Sherlock Holmes, The - Vol I', 176, 176),
(30, 'LMSBOOKID0030', 'Doyle, Arthur Conan', 'Complete Sherlock Holmes, The - Vol II', 176, 176),
(31, 'LMSBOOKID0031', 'Smith, Adam', 'Wealth of Nations, The', 175, 175),
(32, 'LMSBOOKID0032', 'Follett, Ken', 'Pillars of the Earth, The', 176, 176),
(33, 'LMSBOOKID0033', 'Hitler, Adolf', 'Mein Kampf', 212, 212),
(34, 'LMSBOOKID0034', 'Capra, Fritjof', 'Tao of Physics, The', 179, 179),
(35, 'LMSBOOKID0035', 'Feynman, Richard', 'Surely You\'re Joking Mr Feynman', 198, 198),
(36, 'LMSBOOKID0036', 'Hemingway, Ernest', 'Farewell to Arms, A', 179, 179),
(37, 'LMSBOOKID0037', 'Forsyth, Frederick', 'Veteran, The', 177, 177),
(38, 'LMSBOOKID0038', 'Archer, Jeffery', 'False Impressions', 177, 177),
(39, 'LMSBOOKID0039', 'Pausch, Randy', 'Last Lecture, The', 197, 197),
(40, 'LMSBOOKID0040', 'Rand, Ayn', 'Return of the Primitive', 202, 202),
(41, 'LMSBOOKID0041', 'Crichton, Michael', 'Jurassic Park', 174, 174),
(42, 'LMSBOOKID0042', 'Steinbeck, John', 'Russian Journal, A', 196, 196),
(43, 'LMSBOOKID0043', 'Poe, Edgar Allen', 'Tales of Mystery and Imagination', 172, 172),
(44, 'LMSBOOKID0044', 'Dubner, Stephen', 'Freakonomics', 197, 197),
(45, 'LMSBOOKID0045', 'Capra, Fritjof', 'Hidden Connections, The', 197, 197),
(46, 'LMSBOOKID0046', 'Durant, Will', 'Story of Philosophy, The', 170, 170),
(47, 'LMSBOOKID0047', 'Deshpande, P L', 'Asami Asami', 205, 205),
(48, 'LMSBOOKID0048', 'Steinbeck, John', 'Journal of a Novel', 196, 196),
(49, 'LMSBOOKID0049', 'Steinbeck, John', 'Once There Was a War', 196, 196),
(50, 'LMSBOOKID0050', 'Steinbeck, John', 'Moon is Down, The', 196, 196),
(51, 'LMSBOOKID0051', 'Grisham, John', 'Brethren, The', 174, 174),
(52, 'LMSBOOKID0052', 'Naipaul, V. S.', 'In a Free State', 196, 196),
(53, 'LMSBOOKID0053', 'Heller, Joseph', 'Catch 22', 178, 178),
(54, 'LMSBOOKID0054', 'BBC', 'Complete Mastermind, The', 178, 178),
(55, 'LMSBOOKID0055', 'Dylan, Bob', 'Dylan on Dylan', 197, 197),
(56, 'LMSBOOKID0056', 'Gupta, Madan', 'Soft Computing & Intelligent Systems', 242, 242),
(57, 'LMSBOOKID0057', 'Stonier, Alfred', 'Textbook of Economic Theory', 242, 242),
(58, 'LMSBOOKID0058', 'Greene, W. H.', 'Econometric Analysis', 242, 242),
(59, 'LMSBOOKID0059', 'Bradsky, Gary', 'Learning OpenCV', 232, 232),
(60, 'LMSBOOKID0060', 'Tanenbaum, Andrew', 'Data Structures Using C & C++', 235, 235),
(61, 'LMSBOOKID0061', 'Forsyth, David', 'Computer Vision, A Modern Approach', 255, 255),
(62, 'LMSBOOKID0062', 'Taub, Schilling', 'Principles of Communication Systems', 240, 240),
(63, 'LMSBOOKID0063', 'Kanetkar, Yashwant', 'Let Us C', 213, 213),
(64, 'LMSBOOKID0064', 'Stroud, Jonathan', 'Amulet of Samarkand, The', 179, 179),
(65, 'LMSBOOKID0065', 'Dostoevsky, Fyodor', 'Crime and Punishment', 180, 180),
(66, 'LMSBOOKID0066', 'Brown, Dan', 'Angels & Demons', 178, 178),
(67, 'LMSBOOKID0067', 'Sen, Amartya', 'Argumentative Indian, The', 209, 209),
(68, 'LMSBOOKID0068', 'Ghosh, Amitav', 'Sea of Poppies', 197, 197),
(69, 'LMSBOOKID0069', 'Sen, Amartya', 'Idea of Justice, The', 212, 212),
(70, 'LMSBOOKID0070', 'Hansberry, Lorraine', 'Raisin in the Sun, A', 175, 175),
(71, 'LMSBOOKID0071', 'Woodward, Bob', 'All the President\'s Men', 177, 177),
(72, 'LMSBOOKID0072', 'Archer, Jeffery', 'Prisoner of Birth, A', 176, 176),
(73, 'LMSBOOKID0073', 'Nayar, Kuldip', 'Scoop!', 216, 216),
(74, 'LMSBOOKID0074', 'Deshpande, Sunita', 'Ahe Manohar Tari', 213, 213),
(75, 'LMSBOOKID0075', 'Dalrymple, William', 'Last Mughal, The', 199, 199),
(76, 'LMSBOOKID0076', 'Various', 'Social Choice & Welfare, Vol 39 No. 1', 235, 235),
(77, 'LMSBOOKID0077', 'Deshpande, P L', 'Radiowaril Bhashane & Shrutika', 213, 213),
(78, 'LMSBOOKID0078', 'Deshpande, P L', 'Gun Gayin Awadi', 212, 212),
(79, 'LMSBOOKID0079', 'Deshpande, P L', 'Aghal Paghal', 212, 212),
(80, 'LMSBOOKID0080', 'Garg, Sanjay', 'Maqta-e-Ghalib', 221, 221),
(81, 'LMSBOOKID0081', 'Kale, V P', 'Manasa', 213, 213),
(82, 'LMSBOOKID0082', 'Tharoor, Shashi', 'India from Midnight to Milennium', 198, 198),
(83, 'LMSBOOKID0083', 'Tharoor, Shashi', 'Great Indian Novel, The', 198, 198),
(84, 'LMSBOOKID0084', 'Lapierre, Dominique', 'O Jerusalem!', 217, 217),
(85, 'LMSBOOKID0085', 'Lapierre, Dominique', 'City of Joy, The', 177, 177),
(86, 'LMSBOOKID0086', 'Lapierre, Dominique', 'Freedom at Midnight', 167, 167),
(87, 'LMSBOOKID0087', 'Steinbeck, John', 'Winter of Our Discontent, The', 196, 196),
(88, 'LMSBOOKID0088', 'Russell, Bertrand', 'On Education', 203, 203),
(89, 'LMSBOOKID0089', 'Harris, Sam', 'Free Will', 203, 203),
(90, 'LMSBOOKID0090', 'Tharoor, Shashi', 'Bookless in Baghdad', 206, 206),
(91, 'LMSBOOKID0091', 'Gardner, Earle Stanley', 'Case of the Lame Canary, The', 179, 179),
(92, 'LMSBOOKID0092', 'Hawking, Stephen', 'Theory of Everything, The', 217, 217),
(93, 'LMSBOOKID0093', 'Drucker, Peter', 'New Markets & Other Essays', 176, 176),
(94, 'LMSBOOKID0094', 'Bodanis, David', 'Electric Universe', 201, 201),
(95, 'LMSBOOKID0095', 'Hugo, Victor', 'Hunchback of Notre Dame, The', 175, 175),
(96, 'LMSBOOKID0096', 'Steinbeck, John', 'Burning Bright', 175, 175),
(97, 'LMSBOOKID0097', 'Drucker, Peter', 'Age of Discontuinity, The', 178, 178),
(98, 'LMSBOOKID0098', 'Gordon, Richard', 'Doctor in the Nude', 179, 179),
(99, 'LMSBOOKID0099', 'Orwell, George', 'Down and Out in Paris & London', 179, 179),
(100, 'LMSBOOKID0100', 'Sen, Amartya', 'Identity & Violence', 219, 219),
(101, 'LMSBOOKID0101', 'Dalrymple, William', 'Beyond the Three Seas', 197, 197),
(102, 'LMSBOOKID0102', 'Iacoca, Lee', 'Talking Straight', 175, 175),
(103, 'LMSBOOKID0103', 'Maugham, William S', 'Maugham\'s Collected Short Stories, Vol 3', 171, 171),
(104, 'LMSBOOKID0104', 'Forsyth, Frederick', 'Phantom of Manhattan, The', 180, 180),
(105, 'LMSBOOKID0105', 'Maugham, William S', 'Ashenden of The British Agent', 160, 160),
(106, 'LMSBOOKID0106', 'Pirsig, Robert', 'Zen & The Art of Motorcycle Maintenance', 172, 172),
(107, 'LMSBOOKID0107', 'Fisk, Robert', 'Great War for Civilization, The', 197, 197),
(108, 'LMSBOOKID0108', 'Rand, Ayn', 'We the Living', 178, 178),
(109, 'LMSBOOKID0109', 'Aczel, Amir', 'Artist and the Mathematician, The', 186, 186),
(110, 'LMSBOOKID0110', 'Russell, Bertrand', 'History of Western Philosophy', 213, 213),
(111, 'LMSBOOKID0111', 'Sen, Amartya', 'Rationality & Freedom', 213, 213),
(112, 'LMSBOOKID0112', 'Huntington, Samuel', 'Clash of Civilizations and Remaking of the Wo', 228, 228),
(113, 'LMSBOOKID0113', 'Capra, Fritjof', 'Uncommon Wisdom', 197, 197),
(114, 'LMSBOOKID0114', 'Bach, Richard', 'One', 172, 172),
(115, 'LMSBOOKID0115', 'Braithwaite', 'To Sir With Love', 197, 197),
(116, 'LMSBOOKID0116', 'Naipaul, V S', 'Half A Life', 196, 196),
(117, 'LMSBOOKID0117', 'Nehru, Jawaharlal', 'Discovery of India, The', 230, 230),
(118, 'LMSBOOKID0118', 'Deshpande, P L', 'Apulki', 211, 211),
(119, 'LMSBOOKID0119', 'Russell, Bertrand', 'Unpopular Essays', 198, 198),
(120, 'LMSBOOKID0120', 'Forsyth, Frederick', 'Deceiver, The', 178, 178),
(121, 'LMSBOOKID0121', 'Woodward, Bob', 'Veil: Secret Wars of the CIA', 171, 171),
(122, 'LMSBOOKID0122', 'Deshpande, P L', 'Char Shabda', 214, 214),
(123, 'LMSBOOKID0123', 'Durrell, Gerald', 'Rosy is My Relative', 176, 176),
(124, 'LMSBOOKID0124', 'Maugham, William S', 'Moon and Sixpence, The', 180, 180),
(125, 'LMSBOOKID0125', 'Wells, H G', 'Short History of the World, A', 197, 197),
(126, 'LMSBOOKID0126', 'Maugham, William S', 'Trembling of a Leaf, The', 205, 205),
(127, 'LMSBOOKID0127', 'Gordon, Richard', 'Doctor on the Brain', 204, 204),
(128, 'LMSBOOKID0128', 'Singh, Simon', 'Simpsons & Their Mathematical Secrets', 233, 233),
(129, 'LMSBOOKID0129', 'Duda, Hart', 'Pattern Classification', 241, 241),
(130, 'LMSBOOKID0130', 'Friedman, Thomas', 'From Beirut to Jerusalem', 202, 202),
(131, 'LMSBOOKID0131', 'Singh, Simon', 'Code Book, The', 197, 197),
(132, 'LMSBOOKID0132', 'Fisk, Robert', 'Age of the Warrior, The', 197, 197),
(133, 'LMSBOOKID0133', 'Devlin, Keith', 'Numbers Behind Numb3rs, The', 202, 202),
(134, 'LMSBOOKID0134', 'Steinbeck, John', 'Life in Letters, A', 196, 196),
(135, 'LMSBOOKID0135', 'Gleick, James', 'Information, The', 233, 233),
(136, 'LMSBOOKID0136', 'Thomas, Joy', 'Elements of Information Theory', 229, 229),
(137, 'LMSBOOKID0137', 'Rashid, Muhammad', 'Power Electronics - Rashid', 235, 235),
(138, 'LMSBOOKID0138', 'Mohan, Ned', 'Power Electronics - Mohan', 237, 237),
(139, 'LMSBOOKID0139', 'Haykin, Simon', 'Neural Networks', 240, 240),
(140, 'LMSBOOKID0140', 'Steinbeck, John', 'Grapes of Wrath, The', 196, 196),
(141, 'LMSBOOKID0141', 'Deshpande, P L', 'Vyakti ani Valli', 211, 211),
(142, 'LMSBOOKID0142', 'Vapnik, Vladimir', 'Statistical Learning Theory', 228, 228),
(143, 'LMSBOOKID0143', 'Rutherford, Alex', 'Empire of the Mughal - The Tainted Throne', 180, 180),
(144, 'LMSBOOKID0144', 'Rutherford, Alex', 'Empire of the Mughal - Brothers at War', 180, 180),
(145, 'LMSBOOKID0145', 'Rutherford, Alex', 'Empire of the Mughal - Ruler of the World', 180, 180),
(146, 'LMSBOOKID0146', 'Rutherford, Alex', 'Empire of the Mughal - The Serpent\'s Tooth', 180, 180),
(147, 'LMSBOOKID0147', 'Rutherford, Alex', 'Empire of the Mughal - Raiders from the North', 180, 180),
(148, 'LMSBOOKID0148', 'Baz-Zohar, Michael', 'Mossad', 236, 236),
(149, 'LMSBOOKID0149', 'Corbett, Jim', 'Jim Corbett Omnibus', 223, 223),
(150, 'LMSBOOKID0150', 'Verne, Jules', '20000 Leagues Under the Sea', 190, 190),
(151, 'LMSBOOKID0151', 'Deshpande P L', 'Batatyachi Chal', 200, 200),
(152, 'LMSBOOKID0152', 'Deshpande P L', 'Hafasavnuk', 211, 211),
(153, 'LMSBOOKID0153', 'Deshpande P L', 'Urlasurla', 211, 211),
(154, 'LMSBOOKID0154', 'Kanetkar, Yashwant', 'Pointers in C', 213, 213),
(155, 'LMSBOOKID0155', 'Raymond, Eric', 'Cathedral and the Bazaar, The', 217, 217),
(156, 'LMSBOOKID0156', 'Franco, Sergio', 'Design with OpAmps', 240, 240),
(157, 'LMSBOOKID0157', 'Downey, Allen', 'Think Complexity', 230, 230),
(158, 'LMSBOOKID0158', 'West, Morris', 'Devil\'s Advocate, The', 178, 178),
(159, 'LMSBOOKID0159', 'Rand, Ayn', 'Ayn Rand Answers', 203, 203),
(160, 'LMSBOOKID0160', 'Rand, Ayn', 'Philosophy: Who Needs It', 171, 171),
(161, 'LMSBOOKID0161', 'Janert, Phillip', 'Data Analysis with Open Source Tools', 230, 230),
(162, 'LMSBOOKID0162', 'Sagan, Carl', 'Broca\'s Brain', 174, 174),
(163, 'LMSBOOKID0163', 'Bell, E T', 'Men of Mathematics', 217, 217),
(164, 'LMSBOOKID0164', 'Dawkins, Richard', 'Oxford book of Modern Science Writing', 240, 240),
(165, 'LMSBOOKID0165', 'Ranjan, Sudhanshu', 'Justice, Judiciary and Democracy', 224, 224),
(166, 'LMSBOOKID0166', 'Kautiyla', 'Arthashastra, The', 214, 214),
(167, 'LMSBOOKID0167', 'Palkhivala', 'We the People', 216, 216),
(168, 'LMSBOOKID0168', 'Palkhivala', 'We the Nation', 216, 216),
(169, 'LMSBOOKID0169', 'Sorabjee', 'Courtroom Genius, The', 217, 217),
(170, 'LMSBOOKID0170', 'Zaidi, Hussain', 'Dongri to Dubai', 216, 216),
(171, 'LMSBOOKID0171', 'Ackroyd, Peter', 'History of England, Foundation', 197, 197),
(172, 'LMSBOOKID0172', 'Dalrymple, William', 'City of Djinns', 198, 198),
(173, 'LMSBOOKID0173', 'Nariman', 'India\'s Legal System', 177, 177),
(174, 'LMSBOOKID0174', 'Sassoon, Jean', 'More Tears to Cry', 235, 235),
(175, 'LMSBOOKID0175', 'Dickinson, Peter', 'Ropemaker, The', 196, 196),
(176, 'LMSBOOKID0176', 'Brown, Dan', 'Angels & Demons', 170, 170),
(177, 'LMSBOOKID0177', 'Machiavelli', 'Prince, The', 173, 173),
(178, 'LMSBOOKID0178', 'Huxley, Aldous', 'Eyeless in Gaza', 180, 180),
(179, 'LMSBOOKID0179', 'Rowling, J K', 'Tales of Beedle the Bard', 184, 184),
(180, 'LMSBOOKID0180', 'Larsson, Steig', 'Girl with the Dragon Tattoo', 179, 179),
(181, 'LMSBOOKID0181', 'Larsson, Steig', 'Girl who kicked the Hornet\'s Nest', 179, 179),
(182, 'LMSBOOKID0182', 'Larsson, Steig', 'Girl who played with Fire', 179, 179),
(183, 'LMSBOOKID0183', 'Tao, Terence', 'Structure and Randomness', 252, 252),
(184, 'LMSBOOKID0184', 'Eddins, Steve', 'Image Processing with MATLAB', 241, 241),
(185, 'LMSBOOKID0185', 'Orwell, George', 'Animal Farm', 180, 180),
(186, 'LMSBOOKID0186', 'Dostoevsky, Fyodor', 'Idiot, The', 197, 197),
(187, 'LMSBOOKID0187', 'Dickens, Charles', 'Christmas Carol, A', 196, 196);

-- --------------------------------------------------------

--
-- Table structure for table `issuebook`
--

CREATE TABLE `issuebook` (
  `id` int(11) NOT NULL,
  `bookid` varchar(45) DEFAULT NULL,
  `userid` varchar(45) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `borrow_date` date DEFAULT NULL,
  `return_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `userid` varchar(45) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `usertype` varchar(45) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `nobookissue` int(11) DEFAULT NULL,
  `maxbook` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `allbooks`
--
ALTER TABLE `allbooks`
  ADD PRIMARY KEY (`id`,`bookid`),
  ADD UNIQUE KEY `bookid` (`bookid`);

--
-- Indexes for table `issuebook`
--
ALTER TABLE `issuebook`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bookid` (`bookid`),
  ADD KEY `userid` (`userid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`,`userid`),
  ADD UNIQUE KEY `userid` (`userid`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `allbooks`
--
ALTER TABLE `allbooks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=188;

--
-- AUTO_INCREMENT for table `issuebook`
--
ALTER TABLE `issuebook`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `issuebook`
--
ALTER TABLE `issuebook`
  ADD CONSTRAINT `issuebook_ibfk_1` FOREIGN KEY (`bookid`) REFERENCES `allbooks` (`bookid`),
  ADD CONSTRAINT `issuebook_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
