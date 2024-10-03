-- CreateIndex
CREATE INDEX `DailyVolume_dateTo_idx` ON `DailyVolume`(`dateTo`);

-- CreateIndex
CREATE INDEX `ExchangeRate_issuer_idx` ON `ExchangeRate`(`issuer`);

-- CreateIndex
CREATE INDEX `ExchangeRate_timestamp_idx` ON `ExchangeRate`(`timestamp`);

-- CreateIndex
CREATE INDEX `GlobalPoolMetrics_date_idx` ON `GlobalPoolMetrics`(`date`);

-- CreateIndex
CREATE INDEX `Pool_asset_issuer_idx` ON `Pool`(`asset_issuer`);

-- CreateIndex
CREATE INDEX `Pool_asset2_issuer_idx` ON `Pool`(`asset2_issuer`);

-- RenameIndex
ALTER TABLE `GlobalPoolMetrics` RENAME INDEX `GlobalPoolMetrics_poolId_fkey` TO `GlobalPoolMetrics_poolId_idx`;
