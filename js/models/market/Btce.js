var Btce = Market.extend({
    init: function(options){
        this._super(),
            this.hostUrl = this.proxy+"https://btc-e.com",
            this.nonce = new Crypto().getNonce(),
            this.apiPath = "/tapi"

        jQuery.extend(this,options);
        this.setAuthHeaders();

    },
    setAuthHeaders:function(){
        var self = this;
        jQuery.ajaxSetup({
            beforeSend: function(xhr){
                if(app.key==undefined || app.secret==undefined)
                    throw "Keys is empty";
                xhr.setRequestHeader("Key",app.key);
                xhr.setRequestHeader("Sign",self.makeSign(self.data,app.secret));
                console.log(xhr);

            }
        })
    },
    makeSign: function(data, key){
        var sign = CryptoJS.HmacSHA512(data, key).toString();
        return sign;
    },
    getTicker:function()
    {
        return $.getJSON(this.proxy+"https://btc-e.com/api/2/btc_usd/ticker");
    },
    getDepth:function()
    {
        return $.getJSON(this.proxy+"https://btc-e.com/api/2/btc_usd/depth");

    },
    getTrades:function()
    {
        return $.getJSON(this.proxy+"https://btc-e.com/api/2/btc_usd/trades");

    }
    ,
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
