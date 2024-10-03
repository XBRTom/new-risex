/*
  Warnings:

  - You are about to alter the column `relativeAPR` on the `GlobalPoolMetrics` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,6)` to `Decimal(12,8)`.
  - You are about to alter the column `grossAPR` on the `GlobalPoolMetrics` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,6)` to `Decimal(12,8)`.
  - You are about to alter the column `totalValueLocked` on the `GlobalPoolMetrics` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,6)` to `Decimal(20,8)`.
  - You are about to alter the column `poolYield` on the `GlobalPoolMetrics` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,6)` to `Decimal(12,8)`.

*/
-- AlterTable
ALTER TABLE `GlobalPoolMetrics` MODIFY `relativeAPR` DECIMAL(12, 8) NULL,
    MODIFY `grossAPR` DECIMAL(12, 8) NULL,
    MODIFY `totalValueLocked` DECIMAL(20, 8) NULL,
    MODIFY `poolYield` DECIMAL(12, 8) NULL;
