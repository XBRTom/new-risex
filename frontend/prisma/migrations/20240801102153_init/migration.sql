-- CreateTable
CREATE TABLE `Pool` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `address` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `base` VARCHAR(191) NULL,
    `counter` VARCHAR(191) NULL,
    `baseVolume` DOUBLE NULL,
    `counterVolume` DOUBLE NULL,
    `liquidity` INTEGER NULL,
    `tradingFee` INTEGER NULL,
    `status` VARCHAR(191) NULL,

    UNIQUE INDEX `Pool_address_key`(`address`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DailyPoolData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` DATETIME(3) NOT NULL,
    `poolID` INTEGER NOT NULL,
    `volumeUSD` DOUBLE NOT NULL,
    `feesGenerated` DOUBLE NOT NULL,
    `tokenHoldings` DOUBLE NOT NULL,
    `shareOfFees` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DailyPoolData` ADD CONSTRAINT `DailyPoolData_poolID_fkey` FOREIGN KEY (`poolID`) REFERENCES `Pool`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
