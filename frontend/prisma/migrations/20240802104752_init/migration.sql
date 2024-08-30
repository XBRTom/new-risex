/*
  Warnings:

  - You are about to drop the `daily_volume` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pools` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `AuctionSlot` DROP FOREIGN KEY `AuctionSlot_poolId_fkey`;

-- DropForeignKey
ALTER TABLE `LPTokenBalance` DROP FOREIGN KEY `LPTokenBalance_poolId_fkey`;

-- DropForeignKey
ALTER TABLE `VoteSlot` DROP FOREIGN KEY `VoteSlot_poolId_fkey`;

-- DropForeignKey
ALTER TABLE `daily_volume` DROP FOREIGN KEY `daily_volume_poolId_fkey`;

-- DropTable
DROP TABLE `daily_volume`;

-- DropTable
DROP TABLE `pools`;

-- CreateTable
CREATE TABLE `Pool` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `account` VARCHAR(191) NOT NULL,
    `asset_currency` VARCHAR(191) NOT NULL,
    `asset2_currency` VARCHAR(191) NOT NULL,
    `asset2_issuer` VARCHAR(191) NOT NULL,
    `balance` DOUBLE NOT NULL,
    `tradingFee` INTEGER NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Pool_account_key`(`account`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DailyVolume` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dateFrom` DATETIME(3) NOT NULL,
    `dateTo` DATETIME(3) NOT NULL,
    `base` VARCHAR(191) NOT NULL,
    `counter` VARCHAR(191) NOT NULL,
    `baseVolume` DOUBLE NOT NULL,
    `baseVolumeBuy` DOUBLE NOT NULL,
    `baseVolumeSell` DOUBLE NOT NULL,
    `counterVolume` DOUBLE NOT NULL,
    `counterVolumeBuy` DOUBLE NOT NULL,
    `counterVolumeSell` DOUBLE NOT NULL,
    `first` DOUBLE NOT NULL,
    `high` DOUBLE NOT NULL,
    `last` DOUBLE NOT NULL,
    `low` DOUBLE NOT NULL,
    `uniqueBuyers` INTEGER NOT NULL,
    `uniqueSellers` INTEGER NOT NULL,
    `trendInterval` DOUBLE NOT NULL,
    `trendLatestTrades` DOUBLE NOT NULL,
    `exchanges` INTEGER NOT NULL,
    `poolId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AuctionSlot` ADD CONSTRAINT `AuctionSlot_poolId_fkey` FOREIGN KEY (`poolId`) REFERENCES `Pool`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LPTokenBalance` ADD CONSTRAINT `LPTokenBalance_poolId_fkey` FOREIGN KEY (`poolId`) REFERENCES `Pool`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VoteSlot` ADD CONSTRAINT `VoteSlot_poolId_fkey` FOREIGN KEY (`poolId`) REFERENCES `Pool`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyVolume` ADD CONSTRAINT `DailyVolume_poolId_fkey` FOREIGN KEY (`poolId`) REFERENCES `Pool`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
