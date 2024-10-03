/*
  Warnings:

  - Added the required column `targetCurrency` to the `ExchangeRate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ExchangeRate` ADD COLUMN `targetCurrency` VARCHAR(191) NOT NULL;
