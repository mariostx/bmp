SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `profitabilitydb`
--

CREATE TABLE `profitability` (
  `id` int(255) NOT NULL UNIQUE,
  `date` date NOT NULL UNIQUE,
  `btc` decimal(20, 10),
  `eth` decimal(20, 10),
  `xrp` decimal(20, 10),
  `etc` decimal(20, 10),
  `ltc` decimal(20, 10)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- INSERT INTO `profitability` (`id`, `date`, `btc`) VALUES
-- (1, '2021/07/04', '0.293'),
-- (2, '2021/07/07', '0.282');

--
-- Indexes for table `profitability`
--
ALTER TABLE `profitability`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for table `profitability`
--
ALTER TABLE `profitability`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

CREATE TABLE `selected` (
    `id` int(255) NOT NULL UNIQUE,
    `profitabilityId` int NOT NULL,
    `created` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`profitabilityId`) REFERENCES profitability(`id`)
);

ALTER TABLE `selected`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

COMMIT;
