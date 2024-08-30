/*
  Warnings:

  - You are about to drop the `VoteSlots` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `VoteSlots` DROP FOREIGN KEY `VoteSlots_poolId_fkey`;

-- DropTable
DROP TABLE `VoteSlots`;

-- CreateTable
CREATE TABLE `VoteSlot` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `account` VARCHAR(191) NOT NULL,
    `tradingFee` INTEGER NOT NULL,
    `voteWeight` INTEGER NOT NULL,
    `poolId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `VoteSlot` ADD CONSTRAINT `VoteSlot_poolId_fkey` FOREIGN KEY (`poolId`) REFERENCES `Pool`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
