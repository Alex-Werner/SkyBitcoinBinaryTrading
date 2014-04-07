var Btce = Market.extend({
    init: function(options){
        this._super(),
            this.hostUrl = this.proxy+"https://btc-e.com",
            this.nonce = 0,
            this.fee = 0.002,
            this.apiPath = "/tapi"

        jQuery.extend(this,options);
        this.setAuthHeaders();

    },
    tradesBTCUSD: function(){

        return $.getJSON(this.proxy+"https://btc-e.com/api/2/btc_usd/trades");
    },
    tickerBTCUSD: function(){
        return $.getJSON(this.proxy+"https://btc-e.com/api/2/btc_usd/ticker");
    },
    depthBTCUSD: function(){
        return $.getJSON(this.proxy+"https://btc-e.com/api/2/btc_usd/depth");
    },
    setAuthHeaders:function(){
        var self = this;
        jQuery.ajaxSetup({
            beforeSend: function(xhr){
                if(App.key==undefined || App.secret==undefined)
                    throw "Keys is empty";
                xhr.setRequestHeader("Key",App.key);
                xhr.setRequestHeader("Sign",self.makeSign(self.data,App.secret));
            }
        })
    },
    makeSign: function(data, key){
        var sign = CryptoJS.HmacSHA512(data, key).toString();
        return sign;
    },
    sellRequest: function(pair,rate,amount){
        return this.request("Trade",
            {
                pair: pair,
                type:"sell",
                rate: rate,
                amount: amount
            });
    },
    buyRequest: function(pair, rate, amount){
        return this.request("Trade",
            {
                pair: pair,
                type:"buy",
                rate: rate,
                amount: amount
            });
    },
    getActiveOrders: function(pair)
    {
        return this.request("ActiveOrders",{
            pair:pair
        });
    },
    cancelOrder:function(order_id)
    {
        return this.request("CancelOrder",{
            order_id: order_id
        });
    }
});
