-- CreateTable
CREATE TABLE `AmmInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `account` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NULL,
    `amount_issuer` VARCHAR(191) NULL,
    `amount_currency` VARCHAR(191) NULL,
    `amount2_currency` VARCHAR(191) NOT NULL,
    `amount2_issuer` VARCHAR(191) NOT NULL,
    `amount2_value` DOUBLE NOT NULL,
    `poolId` INTEGER NOT NULL,

    UNIQUE INDEX `AmmInfo_account_key`(`account`),
    INDEX `AmmInfo_poolId_fkey`(`poolId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AmmInfo` ADD CONSTRAINT `AmmInfo_poolId_fkey` FOREIGN KEY (`poolId`) REFERENCES `Pool`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
