   // load jquery and plugin at the same time. name it 'bundle'
   var timestamp = new Date().getTime();

   $script(['js/config.js?n='+timestamp,
       'js/models/Api.js?n='+timestamp,
       'js/models/App.js?n='+timestamp,
       'js/models/Ticker.js?n='+timestamp,
       'js/models/Market.js?n='+timestamp,
       'js/models/market/Btce.js?n='+timestamp], 'prerequisite')
   var self = this;

   $script.ready('prerequisite', function() {
       self.config = new Config();
       self.App = new App(config);

       self.market= new Btce({
           key :App.key,
           secret : App.secret
       });
       self.App.reload();
   });





