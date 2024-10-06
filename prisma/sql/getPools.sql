-- @param {String} $1:dateMetrics
-- @param {String} $2:dateVolume
-- @param {String} $3:dateExchangeRate1
-- @param {String} $4:dateExchangeRate2
-- @param {Int} $5:limit

SELECT p.id, p.account, p.asset_currency, p.asset2_currency, p.balance , p.tradingFee
, dv.baseVolume, dv.counterVolume 
, er.targetCurrency AS targetCurrency1, er.rate AS rate1, er2.rate AS rate2, er2.targetCurrency AS targetCurrency2
, gpm.totalPoolVolume , gpm.feesGenerated , gpm.relativeAPR , gpm.grossAPR , gpm.totalValueLocked , gpm.poolYield , gpm.`date` 
FROM Pool p 
LEFT JOIN GlobalPoolMetrics gpm ON (gpm.poolId = p.id AND gpm.`date` LIKE ?)
LEFT JOIN DailyVolume dv ON (dv.poolId = p.id AND dv.dateTo LIKE ?)
LEFT JOIN ExchangeRate er ON (er.issuer = p.asset_issuer AND er.`timestamp` LIKE ?)
LEFT JOIN ExchangeRate er2 ON (er2.issuer = p.asset2_issuer AND er2.`timestamp` LIKE ?)
LIMIT ?;