var settings={};
settings.tickTimeout = 10000;
settings.buyatmarketprice=true;
settings.askconfirm=true;
settings.logEconomicsData=true;
settings.localStorageKey="skybtctrading";
settings.key="";
settings.secret="";
settings.currency="BTCUSD";
settings.fee=0.45;
var app={};
app.run=0;

app.order={};
app.order.amount=0;
app.order.amountcurrency="BTC";
app.order.takeProfit = 0;
app.order.stopLoss=0;

var ticker={};
var previousTicker={};
var economicsData={
};


function logEconomicsData()
{
    if(localStorage)
        localStorage[settings.localStorageKey]=JSON.stringify(economicsData);
}
function processData()
{
    console.log(ticker);
    economicsData[ticker.now]=ticker;
    logEconomicsData();
}
function processRender()
{
    document.title="("+ticker.avg.value+") SKYBTCTRADING";
    $('#buyPrice').html(ticker.sell.value);
    $('#buy-at-price').val(ticker.sell.value);

    $('#sellPrice').html(ticker.sell.value);
    $('#sell-at-price').val(ticker.buy.value);

    $('#market-avg').val(ticker.avg.value);

    if(app.run>0)
    {

        if(previousTicker.avg.value>previousTicker.avg.value){
            $('#market-avg').addClass('red');
        }
        else if(previousTicker.avg.value==previousTicker.avg.value){
            $('#market-avg').addClass('yellow');
        }
        else
        {
            $('#market-avg').addClass('green');

        }
    }

}

function log(datatolog)
{
    var dt = new Date();
    var h = dt.getHours();
    var m = dt.getMinutes();
    var s = dt.getSeconds();
    $('#console').prepend(h+':'+m+':'+s+' - '+datatolog.toString()+'\r\n');

}
function doAjax()
{
    var ticker = $.ajax({
        dataType: "json",
        url: "https://data.mtgox.com/api/2/BTCUSD/money/ticker",
        type:"GET",
        async:false,
        success:function(data) {
            ticker = data;
            log(data.data.last.value);

        }
    }).responseJSON.data;
    return ticker;
}


function getHistory()
{
    //https://data.mtgox.com/api/2/BTCUSD/money/wallet/history
}

function eventHandler()
{
    $('#amount').on('change', handleAmountChange);
    $('#currency').on('change',handleAmountChange);
}
function convertToUSD(BTCPrice){
    return BTCPrice * ticker.avg.value;

}
function convertToBTC(USDPrice)
{
    return USDPrice/ticker.avg.value;
}
function aroundNumberBy(by,number)
{
        return Math.round(number*by)/by;
}
//EVENTS
function handleAmountChange(){

    console.log("AMOUNT CHANGED");

    app.order.sell = ticker.sell.value;
    app.order.buy =ticker.buy.value;

    app.order.amount=$('#amount').val();

    if($('#currency').val()=='BTC')
    {
        app.order.amountcurrency= 'BTC';
    }
    else if($('#currency').val()=="USD")
    {
        app.order.amountcurrency= 'USD';
    }


    //CALCUL

    //FEE CALCULATION :

    if(app.order.amountcurrency=='BTC')
    {
        var feeUSDPrice =((app.order.amount*app.order.buy*settings.fee)/100);
        console.log('usd'+feeUSDPrice)
        console.log('usd'+aroundNumberBy('1000',feeUSDPrice));
        var feeBTCPrice = convertToBTC(feeUSDPrice);
        console.log('btc'+feeBTCPrice);
    }
    if(app.order.amountcurrency=='USD')
    {
        var feeUSDPrice =(app.order.amount*settings.fee)/100;
        var feeBTCPrice = convertToBTC(feeUSDPrice);

    }


    //TakeProfit
    app.order.takeProfit=$('#take-profit').val();

    if(app.order.amountcurrency=='BTC')
    {
        //Valueur a TP - Valeur d'aujourd'hui en USD
        var USDProfit =(app.order.amount*app.order.takeProfit) - (app.order.amount*app.order.buy);
        var BTCProfit = convertToBTC(feeUSDPrice);
        var PERCENTProfit = (((app.order.amount*app.order.takeProfit) / (app.order.amount*app.order.buy))-1)*100;
    }
    if(app.order.amountcurrency=='USD')
    {
        //Valueur a TP - Valeur d'aujourd'hui en USD
        var USDProfit =(app.order.amount*app.order.takeProfit) - (app.order.amount*app.order.buy);
        var BTCProfit = convertToBTC(feeUSDPrice);
        var PERCENTProfit = (((app.order.amount*app.order.takeProfit) / (app.order.amount*app.order.buy))-1)*100;
    }
    $('#take-profit-info').html('('+aroundNumberBy('100',USDProfit)+' $ / '+aroundNumberBy('100000',BTCProfit)+' BTC / '+aroundNumberBy('100',PERCENTProfit)+'%)');

    //StopLoss
    app.order.stopLoss=$('#stop-loss').val();
    if(app.order.amountcurrency=='BTC')
    {
        //Valueur a TP - Valeur d'aujourd'hui en USD
        var USDProfit =(app.order.amount*app.order.stopLoss) - (app.order.amount*app.order.sell);
        console.log("==>"+app.order.amount);
        var BTCProfit = convertToBTC(feeUSDPrice);

        var PERCENTProfit = (((app.order.amount*app.order.stopLoss) / (app.order.amount*app.order.sell))-1)*100;
    }
    if(app.order.amountcurrency=='USD')
    {
        //Valueur a TP - Valeur d'aujourd'hui en USD
        var USDProfit =(app.order.amount*app.order.stopLoss) - (app.order.amount*app.order.sell);
        var BTCProfit = convertToBTC(feeUSDPrice);
        var PERCENTProfit = (((app.order.amount*app.order.stopLoss) / (app.order.amount*app.order.sell))-1)*100;
    }
    console.log("==>"+BTCProfit);

    $('#stop-loss-info').html('('+aroundNumberBy('100',USDProfit)+' $ / '+aroundNumberBy('100000',BTCProfit)+' BTC / '+aroundNumberBy('100',PERCENTProfit)+'%)');


    $('#order-fee').val(aroundNumberBy('1000',feeUSDPrice)+' $ ('+aroundNumberBy('1000000',feeBTCPrice)+' Btc ['+settings.fee+'%])');

     /////!!!! IMPORTANT ! SIMULATION OVERRIDE D UN ACHAT !!
    var orderType='buy';

    if(settings.buyatmarketprice==true)
    {
        if(orderType=='buy')
        {
            console.log('Bonjour achete moi '+ticker.sell.value+' a '+app.order.amount+'(volume) et donne moi une référence number ! ');
            console.log('Ok ta ref number est F000007');
            console.log('Tu as désormais : '+app.order.amount+' btc en plus !');

        }
    }
    event.preventDefault()


}
//CORE
function stopEngine(){
    previousTicker=ticker;
    app.run++;
}
function engine(){

    ticker = doAjax();
    processData();
    getHistory();
    processRender();

    stopEngine();


}
function firstOpen()
{
        if(typeof(localStorage[settings.localStorageKey])=='undefined')
        {
            localStorage[settings.localStorageKey.economicsData]={};
            localStorage[settings.localStorageKey.economicsData]=JSON.stringify(economicsData);
        }
}
firstOpen();
economicsData=JSON.parse(localStorage[settings.localStorageKey]);
eventHandler();
processRenderStock();

engine();

setInterval(function(){engine();},settings.tickTimeout );





function processRenderStock(){
    $('#graph').highcharts('StockChart', {


        rangeSelector : {
            selected : 1
        },

        title : {
            text : 'Live Market Rate'
        },

        series : [{
            name : 'USD/BTC',
            data : (function() {
                var data = [];

                if(Object.keys(economicsData).length<800)
                {

                    for(var i in economicsData)
                    {
                        time = parseInt(i.substr(0,13));
                        value = parseInt(economicsData[i].last.value);
                        data.push({x:time, y:value});

                    }
                }
                else{
                    for(var i=Object.keys(economicsData).length-501; i<Object.keys(economicsData).length-1;i++)
                    {
                        time = parseInt(Object.keys(economicsData)[i].substr(0,13));
                        value = parseInt(economicsData[Object.keys(economicsData)[i]].last.value);

                        data.push({x:time, y:value});
                    }
                }
                return data;
            })(),
            tooltip: {
                valueDecimals: 2
            }
        }]
    });
}
function processRenderingChart(){
    var value=[1000,100,10,100];
    var chart;
    $('#graph').highcharts({
        chart: {
            type: 'spline',
            animation: Highcharts.svg, // don't animate in old IE
            marginRight: 10,
            events: {
                load: function() {
                    // set up the updating of the chart each second
                    var series = this.series[0];
                    setInterval(function() {
                        var x = (new Date()).getTime(), // current time
                            y = parseInt(ticker.last.value);
                        series.addPoint([x, y], true, true);
                    }, 5000);
                }
            }
        },
        title: {
            text: 'Live market rate'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 5000
        },
        yAxis: {
            title: {
                text: 'Value'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            formatter: function() {
                return '<b>'+ this.series.name +'</b><br/>'+
                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
                    Highcharts.numberFormat(this.y, 2);
            }
        },
        legend: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        series: [{
            name: 'USD/BTC',
            data:
                (function() {
                    var data = [];

                if(Object.keys(economicsData).length<50)
                        {

                            for(var i in economicsData)
                            {
                                time = parseInt(i.substr(0,13));
                                value = parseInt(economicsData[i].last.value);
                                data.push({x:time, y:value});
                            }
                        }
                console.log(data);
                        return data;
            })()






                /*(function() {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;

                    for (i = -19; i <= 0; i++) {
                        data.push({
                            x: time + i * 1000,
                            y: Math.random()
                        });
                    }
                    console.log(data);
                    return data;
                })()*/
        }]
    });



}