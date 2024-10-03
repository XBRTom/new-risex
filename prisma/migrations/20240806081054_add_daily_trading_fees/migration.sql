-- CreateTable
CREATE TABLE `DailyTradingFees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `poolId` INTEGER NOT NULL,
    `tradingFee` INTEGER NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DailyTradingFees` ADD CONSTRAINT `DailyTradingFees_poolId_fkey` FOREIGN KEY (`poolId`) REFERENCES `Pool`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
