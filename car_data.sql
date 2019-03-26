-- --------------------------------------------------------
-- 主机:                           127.0.0.1
-- 服务器版本:                        10.3.10-MariaDB - mariadb.org binary distribution
-- 服务器操作系统:                      Win64
-- HeidiSQL 版本:                  9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- 导出 car_data 的数据库结构
CREATE DATABASE IF NOT EXISTS `car_data` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `car_data`;

-- 导出  表 car_data.analyze 结构
CREATE TABLE IF NOT EXISTS `analyze` (
  `id` varchar(20) COLLATE utf8_bin NOT NULL,
  `time` varchar(20) COLLATE utf8_bin NOT NULL,
  `start` varchar(20) COLLATE utf8_bin NOT NULL,
  `lng` double DEFAULT NULL,
  `lat` double DEFAULT NULL,
  `speed` float DEFAULT NULL,
  `limit` tinyint(4) DEFAULT NULL,
  `direction` float DEFAULT NULL,
  `state` varchar(5) COLLATE utf8_bin DEFAULT NULL,
  `alert` varchar(10) COLLATE utf8_bin DEFAULT NULL,
  `estimate` tinyint(4) DEFAULT NULL,
  `stano` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`,`time`,`start`),
  KEY `start` (`start`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- 数据导出被取消选择。
-- 导出  表 car_data.car_info 结构
CREATE TABLE IF NOT EXISTS `car_info` (
  `id` varchar(20) COLLATE utf8_bin NOT NULL,
  `company` varchar(20) COLLATE utf8_bin NOT NULL,
  `type` varchar(30) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`),
  KEY `company` (`company`),
  KEY `type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- 数据导出被取消选择。
-- 导出  表 car_data.fengjie_1_3 结构
CREATE TABLE IF NOT EXISTS `fengjie_1_3` (
  `id` varchar(20) COLLATE utf8_bin NOT NULL,
  `time` varchar(20) COLLATE utf8_bin NOT NULL,
  `lng` double NOT NULL,
  `lat` double NOT NULL,
  `speed` float DEFAULT NULL,
  `direction` float DEFAULT NULL,
  `state` varchar(5) COLLATE utf8_bin DEFAULT NULL,
  `stano` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`,`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- 数据导出被取消选择。
-- 导出  表 car_data.sanfen 结构
CREATE TABLE IF NOT EXISTS `sanfen` (
  `id` varchar(20) COLLATE utf8_bin NOT NULL,
  `time` varchar(20) COLLATE utf8_bin NOT NULL,
  `lng` double NOT NULL,
  `lat` double NOT NULL,
  `speed` float DEFAULT NULL,
  `direction` float DEFAULT NULL,
  `state` varchar(5) COLLATE utf8_bin DEFAULT NULL,
  `stano` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`,`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- 数据导出被取消选择。
-- 导出  表 car_data.zone 结构
CREATE TABLE IF NOT EXISTS `zone` (
  `id` varchar(50) COLLATE utf8_bin NOT NULL,
  `name` varchar(50) COLLATE utf8_bin NOT NULL,
  `lng` varchar(10000) COLLATE utf8_bin NOT NULL,
  `lat` varchar(10000) COLLATE utf8_bin NOT NULL,
  `type` varchar(10) COLLATE utf8_bin NOT NULL,
  `speed` varchar(10) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- 数据导出被取消选择。
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
