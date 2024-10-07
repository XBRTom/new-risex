-- @param {Int} $1:limit
-- @param {Int} $2:offset

SELECT DISTINCT p.id, p.account, p.asset_currency, p.asset2_currency, p.balance, p.tradingFee,
    dv.baseVolume, dv.counterVolume,
    er.targetCurrency AS targetCurrency1, er.rate AS rate1,
    er2.rate AS rate2, er2.targetCurrency AS targetCurrency2,
    gpm.totalPoolVolume, gpm.feesGenerated, gpm.relativeAPR, gpm.grossAPR, gpm.totalValueLocked, gpm.poolYield, gpm.`date`
FROM Pool p
LEFT JOIN GlobalPoolMetrics gpm ON gpm.poolId = p.id AND gpm.`date` = (
    SELECT MAX(`date`) FROM GlobalPoolMetrics WHERE poolId = p.id
)
LEFT JOIN DailyVolume dv ON dv.poolId = p.id AND dv.dateTo = (
    SELECT MAX(dateTo) FROM DailyVolume WHERE poolId = p.id
)
LEFT JOIN ExchangeRate er ON er.issuer = p.asset_issuer AND er.`timestamp` = (
    SELECT MAX(`timestamp`) FROM ExchangeRate WHERE issuer = p.asset_issuer
)
LEFT JOIN ExchangeRate er2 ON er2.issuer = p.asset2_issuer AND er2.`timestamp` = (
    SELECT MAX(`timestamp`) FROM ExchangeRate WHERE issuer = p.asset2_issuer
)
LIMIT ? OFFSET ?;