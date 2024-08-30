/*
  Warnings:

  - The primary key for the `Pool` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Pool` table. All the data in the column will be lost.
  - You are about to drop the column `liquidity` on the `Pool` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Pool` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Pool` table. All the data in the column will be lost.
  - You are about to drop the column `tradingFee` on the `Pool` table. All the data in the column will be lost.
  - You are about to drop the `DailyPoolData` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `base` on table `Pool` required. This step will fail if there are existing NULL values in that column.
  - Made the column `counter` on table `Pool` required. This step will fail if there are existing NULL values in that column.
  - Made the column `baseVolume` on table `Pool` required. This step will fail if there are existing NULL values in that column.
  - Made the column `counterVolume` on table `Pool` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `DailyPoolData` DROP FOREIGN KEY `DailyPoolData_poolID_fkey`;

-- DropIndex
DROP INDEX `Pool_address_key` ON `Pool`;

-- AlterTable
ALTER TABLE `Pool` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `liquidity`,
    DROP COLUMN `name`,
    DROP COLUMN `status`,
    DROP COLUMN `tradingFee`,
    MODIFY `base` VARCHAR(191) NOT NULL,
    MODIFY `counter` VARCHAR(191) NOT NULL,
    MODIFY `baseVolume` DOUBLE NOT NULL,
    MODIFY `counterVolume` DOUBLE NOT NULL,
    ADD PRIMARY KEY (`address`);

-- DropTable
DROP TABLE `DailyPoolData`;

-- CreateTable
CREATE TABLE `DailyVolume` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date_from` VARCHAR(191) NOT NULL,
    `date_to` VARCHAR(191) NOT NULL,
    `base` VARCHAR(191) NOT NULL,
    `counter` VARCHAR(191) NOT NULL,
    `base_volume` DOUBLE NOT NULL,
    `base_volume_buy` DOUBLE NOT NULL,
    `base_volume_sell` DOUBLE NOT NULL,
    `counter_volume` DOUBLE NOT NULL,
    `counter_volume_buy` DOUBLE NOT NULL,
    `counter_volume_sell` DOUBLE NOT NULL,
    `first` DOUBLE NOT NULL,
    `high` DOUBLE NOT NULL,
    `last` DOUBLE NOT NULL,
    `low` DOUBLE NOT NULL,
    `unique_buyers` INTEGER NOT NULL,
    `unique_sellers` INTEGER NOT NULL,
    `trend_interval` INTEGER NOT NULL,
    `trend_latest_trades` DOUBLE NOT NULL,
    `exchanges` INTEGER NOT NULL,
    `poolAddress` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DailyVolume` ADD CONSTRAINT `DailyVolume_poolAddress_fkey` FOREIGN KEY (`poolAddress`) REFERENCES `Pool`(`address`) ON DELETE RESTRICT ON UPDATE CASCADE;
