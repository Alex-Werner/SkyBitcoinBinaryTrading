var Api = Class.extend({
    init: function(market){
        if(market=="btce")
        {
            this.marketPlace = new Btce();
        }
        else
        {
            this.marketPlace = "Not a Marketplace";
        }
    },
    getLastTick: function()
    {
        App.tick = this.marketPlace.getLastTick();
        console.log(App.tick);
    }

});