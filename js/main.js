   // load jquery and plugin at the same time. name it 'bundle'
   var timestamp = new Date().getTime();

   $script(['js/config.js?n='+timestamp,
       'js/models/Api.js?n='+timestamp,
       'js/models/App.js?n='+timestamp,
       'js/models/Crypto.js?n='+timestamp,
       'js/models/Ticker.js?n='+timestamp,
       'js/models/Market.js?n='+timestamp,
       'js/models/market/Btce.js?n='+timestamp,
        'js/models/market/Cexio.js?n='+timestamp], 'prerequisite')
   var self = this;

   $script.ready('prerequisite', function() {
       self.Run();
   });
   function Run(){
       this.config = new Config()
       this.app = new App();

        switch(this.config.primaryExchange)
        {
            case "cexio":
                this.market = new Cexio();
                break;
            case "btce":
                this.market = new Btce({
                    'Key':this.config.key,
                    'Sign':this.config.secret
                });
                break;
            default:
                throw "Have a Break, Have a kitkat...NEIN NEIN NEIN NEIN";
                break;
        }

       //Use to reload all data into App?
       //this.App.reload();
   }




