var Config = Class.extend({
    init:function()
    {
        this.primaryExchange = "cexio";
        this.proxy = "http://skyline-creations.fr/labs/proxy/proxy.php?url=";

        this.btce = {};
        this.btce.active = false;//Please just activate one market for now.
        this.btce.key = "your-key";
        this.btce.secret = "your-secret";
        this.btce.fee = "0.002";

        this.cexio = {};
        this.cexio.active =true;
        this.cexio.key ="your-key";
        this.cexio.secret ="your-secret";
        this.cexio.fee = "0.00";

        this.key = this[this.primaryExchange].key;
        this.secret = this[this.primaryExchange].secret;
        this.fee = this[this.primaryExchange].fee;

    }

})