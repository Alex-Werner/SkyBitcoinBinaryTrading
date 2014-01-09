/* Exponential moving average : EMA 
Equal to = Price(t) * k + EMA(y) * (1-k)
t: today, y:yesterday, n : number of day in EMA, k: 2/N+1
var price = _.last(this.candles.close);
var k = 2 / (NumberOfDate + 1)
var ema, y;
var current = _.size(this.candles.close)


//    calculation (based on tick/day):
//  EMA = Price(t) * k + EMA(y) * (1 – k)
//  t = today, y = yesterday, N = number of days in EMA, k = 2 / (N+1)
TradingMethod.prototype.calculateEMA = function(type) {
  var price = _.last(this.candles.close);

  var k = 2 / (settings[type] + 1);
  var ema, y;

  var current = _.size(this.candles.close);

  if(current === 1)
    // we don't have any 'yesterday'
    y = price;
  else
    y = this.ema[type][current - 2];
  
  ema = price * k + y * (1 - k);
  
  if(!ema){
    //in case of empty ema value (e.g. bitcoincharts downtime) take the last ema value
    ema = _.last(this.ema[type]);
    log.debug('WARNING: Unable to calculate EMA on current candle. Using last defined value.');
  }
  
  this.ema[type].push(ema);
}


TradingMethod.prototype.calculateEMAdiff = function() {
  var shortEMA = _.last(this.ema.short);
  var longEMA = _.last(this.ema.long);

  var diff = 100 * (shortEMA - longEMA) / ((shortEMA + longEMA) / 2);
  this.ema.diff.push(diff);
}

  var diff = _.last(this.ema.diff).toFixed(3),
      price = _.last(this.candles.close).toFixed(8);


 if(diff > settings.buyTreshold) {
    log.debug('we are currently in uptrend (' + diff + ')');

    if(this.currentTrend !== 'up') {
      this.currentTrend = 'up';
      this.emit('advice', 'BUY', price, message);
    } else
      this.emit('advice', 'HOLD', price, message);

  } else if(diff < settings.sellTreshold) {
    log.debug('we are currently in a downtrend', message);

    if(this.currentTrend !== 'down') {
      this.currentTrend = 'down';
      this.emit('advice', 'SELL', price, message);
    } else
      this.emit('advice', 'HOLD', price, message);

  } else {
    log.debug('we are currently not in an up or down trend', message);
    this.emit('advice', 'HOLD', price, message);
  }
*/