-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-07-2020 a las 22:11:16
-- Versión del servidor: 10.3.16-MariaDB
-- Versión de PHP: 7.3.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `nodejs_posts`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `category`
--

CREATE TABLE `category` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `publish_date` varchar(255) NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `category`
--

INSERT INTO `category` (`id`, `name`, `description`, `publish_date`) VALUES
('1b2b6aa1-b589-44ab-a2e1-f6a08a29b46f', 'Updated Category Name', 'Category description', 'Fri Jul 17 2020 10:59:50 GMT-0700 (GMT-07:00)');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `likes`
--

CREATE TABLE `likes` (
  `id` varchar(255) NOT NULL,
  `user_fk` varchar(255) NOT NULL,
  `post_fk` varchar(255) NOT NULL,
  `like_date` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `likes`
--

INSERT INTO `likes` (`id`, `user_fk`, `post_fk`, `like_date`) VALUES
('4dae88b0-7d9a-4710-8350-1ee8ed7a9e49', 'bd2289ae-c58b-4912-9f9d-ee57d41413f3', '13db3dce-bb08-420c-ac84-dc5c74b8e73a', 'Fri Jul 17 2020 12:11:16 GMT-0700 (GMT-07:00)'),
('a18bef60-eefa-4ff9-8de4-9b3be06cd0cf', 'bd2289ae-c58b-4912-9f9d-ee57d41413f3', '13db3dce-bb08-420c-ac84-dc5c74b8e73a', 'Fri Jul 17 2020 12:10:57 GMT-0700 (GMT-07:00)');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `post`
--

CREATE TABLE `post` (
  `id` varchar(255) NOT NULL,
  `likes` int(255) NOT NULL DEFAULT 0,
  `show_post` int(1) NOT NULL DEFAULT 1,
  `description` varchar(255) NOT NULL,
  `publish_date` varchar(255) NOT NULL DEFAULT current_timestamp(),
  `content` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `version` int(255) NOT NULL DEFAULT 0,
  `title` varchar(255) NOT NULL,
  `category_fk` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `post`
--

INSERT INTO `post` (`id`, `likes`, `show_post`, `description`, `publish_date`, `content`, `image`, `version`, `title`, `category_fk`) VALUES
('13db3dce-bb08-420c-ac84-dc5c74b8e73a', 2, 0, 'This is the description', 'Fri Jul 17 2020 10:46:29 GMT-0700 (GMT-07:00)', 'New Content', 'This is the image', 2, 'Second Post Title', '1b2b6aa1-b589-44ab-a2e1-f6a08a29b46f'),
('e36525e8-5406-476a-b5e2-2a7ab9c766c0', 0, 1, 'This is the new description', 'Fri Jul 17 2020 10:50:47 GMT-0700 (GMT-07:00)', 'This is the content', 'This is the image', 0, 'Testing', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `register_date` varchar(255) NOT NULL,
  `hashed_password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `register_date`, `hashed_password`) VALUES
('866268c2-f71f-422c-8e44-7e48e9387ac4', 'Smith Schuster', 'smith@gmail.com', 'Fri Jul 17 2020 10:54:06 GMT-0700 (GMT-07:00)', 'sha1$a1315e4a$1$42c952ffe54df5f2d9c0ba0406d9eea46bd492ed'),
('bd2289ae-c58b-4912-9f9d-ee57d41413f3', 'James Conner', 'james@gmail.com', 'Fri Jul 17 2020 08:30:51 GMT-0700 (GMT-07:00)', 'sha1$142cec05$1$0b5985346763fde5dd9583d54c09bf0ea3502a0c');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_User` (`user_fk`),
  ADD KEY `FK_Post` (`post_fk`);

--
-- Indices de la tabla `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_Category` (`category_fk`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `FK_Post` FOREIGN KEY (`post_fk`) REFERENCES `post` (`id`),
  ADD CONSTRAINT `FK_User` FOREIGN KEY (`user_fk`) REFERENCES `user` (`id`);

--
-- Filtros para la tabla `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `FK_Category` FOREIGN KEY (`category_fk`) REFERENCES `category` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
