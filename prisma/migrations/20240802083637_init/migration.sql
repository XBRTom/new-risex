/*
  Warnings:

  - The primary key for the `Pool` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `address` on the `Pool` table. All the data in the column will be lost.
  - You are about to drop the column `base` on the `Pool` table. All the data in the column will be lost.
  - You are about to drop the column `baseVolume` on the `Pool` table. All the data in the column will be lost.
  - You are about to drop the column `counter` on the `Pool` table. All the data in the column will be lost.
  - You are about to drop the column `counterVolume` on the `Pool` table. All the data in the column will be lost.
  - You are about to drop the `DailyVolume` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `account` to the `Pool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `asset2_currency` to the `Pool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `asset2_issuer` to the `Pool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `asset_currency` to the `Pool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `balance` to the `Pool` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Pool` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `tradingFee` to the `Pool` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Pool` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `DailyVolume` DROP FOREIGN KEY `DailyVolume_poolAddress_fkey`;

-- AlterTable
ALTER TABLE `Pool` DROP PRIMARY KEY,
    DROP COLUMN `address`,
    DROP COLUMN `base`,
    DROP COLUMN `baseVolume`,
    DROP COLUMN `counter`,
    DROP COLUMN `counterVolume`,
    ADD COLUMN `account` VARCHAR(191) NOT NULL,
    ADD COLUMN `asset2_currency` VARCHAR(191) NOT NULL,
    ADD COLUMN `asset2_issuer` VARCHAR(191) NOT NULL,
    ADD COLUMN `asset_currency` VARCHAR(191) NOT NULL,
    ADD COLUMN `balance` DOUBLE NOT NULL,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD COLUMN `tradingFee` INTEGER NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `DailyVolume`;

-- CreateTable
CREATE TABLE `AuctionSlot` (
    `id` VARCHAR(191) NOT NULL,
    `account` VARCHAR(191) NOT NULL,
    `discountedFee` INTEGER NOT NULL,
    `expiration` INTEGER NOT NULL,
    `price_currency` VARCHAR(191) NOT NULL,
    `price_issuer` VARCHAR(191) NOT NULL,
    `price_value` VARCHAR(191) NOT NULL,
    `poolId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LPTokenBalance` (
    `id` VARCHAR(191) NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `issuer` VARCHAR(191) NOT NULL,
    `value` DOUBLE NOT NULL,
    `poolId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VoteSlot` (
    `id` VARCHAR(191) NOT NULL,
    `account` VARCHAR(191) NOT NULL,
    `tradingFee` INTEGER NOT NULL,
    `voteWeight` INTEGER NOT NULL,
    `poolId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AuctionSlot` ADD CONSTRAINT `AuctionSlot_poolId_fkey` FOREIGN KEY (`poolId`) REFERENCES `Pool`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LPTokenBalance` ADD CONSTRAINT `LPTokenBalance_poolId_fkey` FOREIGN KEY (`poolId`) REFERENCES `Pool`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VoteSlot` ADD CONSTRAINT `VoteSlot_poolId_fkey` FOREIGN KEY (`poolId`) REFERENCES `Pool`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
