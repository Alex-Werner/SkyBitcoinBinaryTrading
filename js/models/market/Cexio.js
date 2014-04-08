var Cexio = Market.extend({
    init:function(options){
        this._super();
        this.nonce = new Crypto().getNonce(),
        this.hostUrl= this.proxy+"https://cex.io/api/";

        jQuery.extend(this,options);
        this.setAuthHeaders();
    },
    setAuthHeaders:function(){
        var self=this;
        jQuery.ajaxSetup({
            beforeSend: function(xhr){
                if(app.key==undefined || app.secret==undefined)
                    throw  "Keys ! Where are keeeeeeeeeys ! ?"
                xhr.setRequestHeader("key",app.key);
                xhr.setRequestHeader("signature",self.makeSign(self.data,app.secret));
                xhr.setRequestHeader("nonce",self.nonce);
            }
        })
    },
    makeSign: function(data, key){
        var sign = CryptoJS.HmacSHA256(data, key).toString();
        return sign;
    },
    getNormalizedTicker:function(){
          this.getTicker().success(
            function(rawData){
                var tick = rawData.contents;
                var normalizedTick = {};
                normalizedTick.last = tick.last;
                return normalizedTick;
            }
          );
    },
    getTicker:function()
    {
        return $.getJSON(this.proxy+"https://cex.io/api/ticker/GHS/BTC");
    },
    getDepth:function()
    {
        return $.getJSON(this.proxy+"https://cex.io/api/order_book/GHS/BTC");
    },
    getTrades:function()
    {
        return $.getJSON(this.proxy+"https://cex.io/api/trade_history/GHS/BTC");
    }

})