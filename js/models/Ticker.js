var Ticker = Class.extend({
    init: function(vol,high,low,vol_cur,last,buy,sell,swap,updated,servertime)
    {
        this.vol = vol; //Volume sur timeframe
        this.high = high; // Plus haut atteint sur la timeframe (24h)
        this.low = low; // Plus bas atteint
        this.vol_cur = vol_cur; //Volume en USD
        this.last = last; //Le dernier prix
        this.buy=buy;//Prix achat
        this.sell = sell;//prix vente
        this.swap =swap;
        this.updated = updated; //Date du dernier update (timestamp)
        this.servertime=servertime; //Heure du serveur (needed ?)
    }
});