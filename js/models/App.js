var App = Class.extend({
    init:function(){
        this.tick = null;
        this.primaryExchange = config.primaryExchange;
        this.key = config.key;
        this.secret = config.secret;
        this.proxy = config.proxy;

        /* history.tickers sera sauvegardé en clé/valeur
            key : timestamp
            value : ask/bid/high/last/low

             We could get volume and volume current. But In a normalisation issue between all exchange's api
             we will calculate them ourself.
         */
        this.history = {}
        this.history.tickers=[];
        this.history.tickers.last=0;//The actual last timestamp.
    },
    reload: function(){
        this.getDepth();
        this.getTicker();
        this.getTrades();
    },
    getTicker:function()
    {
        this.tick = market.getNormalizedTicker();
        /*var self = this;
        market.getTicker().success(
            function(rawData){
            self.tick = rawData.contents.ticker;
        });*/
    },
    getDepth: function(){
        var self = this;
        market.getDepth().success(
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
        market.getTrades().success(
            function(rawData){
                console.log(rawData);
                self.history = rawData.contents;
            }
        )
    }
});
