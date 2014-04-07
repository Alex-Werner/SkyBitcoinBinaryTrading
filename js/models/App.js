var App = Class.extend({
    init:function(config){
        this.tick = null;
        this.key = config.key;
        this.secret = config.secret;
        this.proxy = config.proxy;
    },
    reload: function(){
        this.getDepth();
        this.getTicker();
        this.getTrades();
    },
    getTicker:function(){
        var self = this;
        market.tickerBTCUSD().success(
            function(rawData){
            self.tick = rawData.contents.ticker;
        });
    },
    getDepth: function(){
        var self = this;
        market.depthBTCUSD().success(
            function(rawData){
                console.log(rawData);
                self.orderbook = {
                    asks:rawData.contents.asks,
                    bids:rawData.contents.bids
                }
          });
    },
    getTrades: function(){
        var self=this;
        market.tradesBTCUSD().success(
            function(rawData){
                console.log(rawData);
                self.history = rawData.contents;
            }
        )
    }
});
