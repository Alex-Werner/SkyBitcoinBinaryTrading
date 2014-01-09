var settings = {};
settings.tickTimeout = 10000;
settings.buyatmarketprice = true;
settings.askconfirm = true;
settings.logEconomicsData = true;
settings.localStorageKey = "skybtctrading";
settings.key = "";
settings.secret = "";
settings.currency = "BTCUSD";
settings.fee = 0.45;
var app = {};
app.run = 0;

app.order = {};
app.order.enabled = 0;
app.order.amount = 0;
app.order.marketprice=1;
app.order.amountcurrency = "BTC";
app.order.takeProfit = 0;
app.order.stopLoss = 0;
app.order.market = {};
app.order.market.gap = 0;
app.order.market.totalgap = 0;
app.order.market.usdfee = 0;
app.order.currencypair = "USDBTC";
app.order.way = '';

var ticker = {};
ticker.trend = 0;//-1 down,0same,+1up
ticker.avg = {};
ticker.avg.value = 0;
var previousTicker = {};
var economicsData = {
};

/******* ARITHMETIC'S ************/
function convertToUSD(BTCPrice) {
    return BTCPrice * ticker.avg.value;

}
function convertToBTC(USDPrice) {
    return USDPrice / ticker.avg.value;
}
function aroundNumberBy(by, number) {
    return Math.round(number * by) / by;
}
/******* WIDGETS ************/

function log(datatolog) {
    var dt = new Date();
    var h = dt.getHours();
    var m = dt.getMinutes();
    var s = dt.getSeconds();
    $('#console').prepend(h + ':' + m + ':' + s + ' - ' + datatolog.toString() + '\r\n');
}
function launchModal(data) {
    app.order.enabled = 1;
    app.order.way = data.way;
    if(app.order.enabled==1)
    {

        renderTextModalData();

    }

    if (data.title !== 'undefined') {
        $('#SkyModalTitle').html(data.title);
    }

    $('#SkyModal').SkyModal_Open();
}
function launchException(e_num, e_message) {
    alert('Erreur N°' + e_num + ' : ' + e_message);
}
/******* CONTEXT SAVE DATA ************/

function logEconomicsData() {
    if (localStorage)
        localStorage[settings.localStorageKey] = JSON.stringify(economicsData);
}
function saveEconomicsData() {
    console.log(ticker);
    economicsData[ticker.now] = ticker;
    logEconomicsData();
}
function initLocalStorage() {
    if (typeof(localStorage[settings.localStorageKey]) == 'undefined') {
        localStorage[settings.localStorageKey.economicsData] = {};
        localStorage[settings.localStorageKey.economicsData] = JSON.stringify(economicsData);
    }
}
function updateOrderWithNewTicker()
{
    app.order.buy=ticker.buy.value;
    app.order.sell=ticker.sell.value;
}
/******* GRAPHIC DISPLAY ************/


function processRenderStock() {
    $('#graph').highcharts('StockChart', {


        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'Live Market Rate'
        },

        series: [
            {
                name: 'USD/BTC',
                data: (function () {
                    var data = [];

                    if (Object.keys(economicsData).length < 800) {

                        for (var i in economicsData) {
                            time = parseInt(i.substr(0, 13));
                            value = parseInt(economicsData[i].last.value);
                            data.push({x: time, y: value});

                        }
                    }
                    else {
                        for (var i = Object.keys(economicsData).length - 501; i < Object.keys(economicsData).length - 1; i++) {
                            time = parseInt(Object.keys(economicsData)[i].substr(0, 13));
                            value = parseInt(economicsData[Object.keys(economicsData)[i]].last.value);

                            data.push({x: time, y: value});
                        }
                    }
                    return data;
                })(),
                tooltip: {
                    valueDecimals: 2
                }
            }
        ]
    });
}
/******* TEXT DISPLAYERS ************/
function renderTextData() {

    $('.sellPrice').html(aroundNumberBy('100', ticker.sell.value));
    $('.buyPrice').html(aroundNumberBy('100', ticker.buy.value));

    //SET TRENDING
    switch (ticker.trend) {
        case 1:
            ('#rateTrend').removeClass();
            $('#rateTrend').addClass('priceUpTriangle');
            break;
        case 0:
            $('#rateTrend').removeClass();
            $('#rateTrend').addClass('priceSameTriangle');
            break;
        case -1:
            $('#rateTrend').removeClass();
            $('#rateTrend').addClass('priceDownTriangle');
            break;
    }
}
/**
 * Triggered when we set at 1 : order.enabled
 */
function renderTextModalData() {

    defineGapAndFees();

    if (app.order.way == 'sell') {
        $('#SkyModalCurrentRate').html(aroundNumberBy('100000', ticker.sell.value));
    }
    if (app.order.way == 'buy') {
        $('#SkyModalCurrentRate').html(aroundNumberBy('100000', ticker.buy.value));

    }
    if (app.order.amountcurrency == 'BTC') {
        console.log('convertToUSD' + app.order.amount);
        $('#SkyModalAmountConverted').html(aroundNumberBy('1000', convertToUSD(app.order.amount)) + '$');

    }
    if (app.order.amountcurrency == 'USD') {
        console.log('convertToBTC' + app.order.amount);
        $('#SkyModalAmountConverted').html(aroundNumberBy('100', convertToBTC(app.order.amount)) + 'B');
    }

    $('#SkyModalWay').html(app.order.way);
    $('#SkyModalAmount2').html(app.order.amount);
    $('#SkyModalCurrencyPair').html(app.order.amountcurrency);
    $('#SkyModalTotalFees').html(aroundNumberBy('100', app.order.market.totalfee));

    $('#SkyModalFee').html(aroundNumberBy('100', app.order.market.usdfee));
    $('#SkyModalTotalGap').html(aroundNumberBy('100', app.order.market.gap));


}


/******* NETWORK ************/

function getLastTicker() {
    var ticker = $.ajax({
        dataType: "json",
        url: "https://data.mtgox.com/api/2/BTCUSD/money/ticker",
        type: "GET",
        async: false,
        success: function (data) {
            ticker = data;
            log(data.data.last.value);

        }
    }).responseJSON.data;
    return ticker;
}

/********* ECONOMICS ARITHM' ********/
function defineGapAndFees() {


    var feeUSDPrice = 0;
    var feeBTCPrice = 0;
    if(app.order.marketprice)
    {

        if (app.order.amountcurrency == 'BTC') {
            feeUSDPrice = ((app.order.amount * app.order.buy * settings.fee) / 100);
            //feeBTCPrice = convertToBTC(feeUSDPrice);
        }
        if (app.order.amountcurrency == 'USD') {
            feeUSDPrice = (app.order.amount * settings.fee) / 100;
            //feeBTCPrice = convertToBTC(feeUSDPrice);

        }
    }else
    {

        if (app.order.amountcurrency == 'BTC') {
            feeUSDPrice = ((app.order.amount * app.order.price * settings.fee) / 100);
            //feeBTCPrice = convertToBTC(feeUSDPrice);
        }
        if (app.order.amountcurrency == 'USD') {
            feeUSDPrice = (app.order.amount * settings.fee) / 100;
            //feeBTCPrice = convertToBTC(feeUSDPrice);

        }
    }

    app.order.market.usdfee=parseInt(feeUSDPrice);
    console.log(parseInt(feeUSDPrice));
    app.order.market.gap = ticker.sell.value - ticker.buy.value;
    app.order.market.totalfee = app.order.market.gap + app.order.market.usdfee;
}
function defineTrend() {
    if (app.run > 0) {
        if (ticker.avg.value > previousTicker.avg.value) {
            ticker.trend = 1;
        }
        else if (ticker.avg.value == previousTicker.avg.value) {
            ticker.trend = 0;
        }
        else {
            ticker.trend = -1;

        }
    }


}
/********* USER INPUT ***************/
function changeCurrency() {
    console.log('U0 : Currency Changed');

    //CHANGE CURRENCY
    if ($('#SkyModalCurrency').val() == 'BTC')
        app.order.amountcurrency = 'BTC';
    else if ($('#SkyModalCurrency').val() == "USD")
        app.order.amountcurrency = 'USD';
    processUserInput();
}
function changeAmount() {
    console.log('U1 : Amount Changed');
    app.order.amount = $('#SkyModalAmount').val();
    processUserInput();

}
function changePrice() {
    console.log('U2 : Price Changed');
    app.order.price = $('#SkyModalPrice').val();
    processUserInput();

}
function changeStopLoss() {
    console.log('U3 : StopLoss Changed');
    app.order.stopLoss = $('#SkyModalStopLoss').val();
    processUserInput();

}
function changeTakeProfit() {
    console.log('U4 : TakeProfit Changed');
    app.order.takeProfi = $('#SkyModalTakeProfi').val();
    processUserInput();

}
function onInputChanged() {
    $('#SkyModalCurrency').on('change', changeCurrency);
    $('#SkyModalAmount').on('keyup', changeAmount);
    $('#SkyModalPrice').on('keyup', changePrice);
    $('#SkyModalStopLoss').on('keyup', changeStopLoss);
    $('#SkyModalTakeProfit').on('keyup', changeTakeProfit);
    processUserInput();

}
function onInputClick() {

}
/***
 * When we do something with OnInputChanged we call it.
 */
function processUserInput() {
    if(app.order.enabled==1)
    {
        renderTextModalData();

    }
}
/********* ECONOMICS ORDER **********/
/*
 * way : Buy or Sell
 * type = order / now
 */
function startOrder(e) {
    way = e.data.way;
    type = e.data.type;
    $('#SkyModalCurrencyPair').html(app.order.currencypair);
    $('#SkyModalAmount').val(app.order.amount);
    $('#SkyModalAmount2').html(app.order.amount);
    $('#SkyModalTotalFees').html(aroundNumberBy('100', app.order.market.usdfee));
    $('#SkyModalTotalGap').html(aroundNumberBy('100', app.order.market.totalgap));

    if (way == 'buy') {
        $('#SkyModalCurrentRate').html(ticker.buy.value);
        $('#SkyModalWay').html('Buy');

        if (type == 'order') {
            launchModal({title: "BUYBTC - Order"})

        } else if (type == 'now') {
            launchModal({title: "BUYBTC - Immediate Buying"})
        }
        else {
            launchException(2, "Order type problem")

        }

    } else if (way == 'sell') {
        $('#SkyModalCurrentRate').html(ticker.sell.value);
        $('#SkyModalWay').html('Sell');

        if (type == 'order') {
            launchModal({title: "SELBTC - Order"})
        } else if (type == 'now') {
            launchModal({title: "SELLBTC - Immediate Selling"})
        }
        else {
            launchException(2, "Order type problem")

        }
    }
    else {
        launchException(1, "Order way problem")
    }
    console.log('Order launch way:' + way + ' type:' + type);

}

/******** EVENTS *********************/
$('.sellBtn').click(function () {
    launchModal({way: 'sell', type: 'order'});
});//Si on click sur OneClic = now
$('.buyBtn').click(function () {
    launchModal({way: 'buy', type: 'order'});
});//Si on click sur OneClic = now
/***************** CORE *********************/
function getFormDataAndProcess() {

    app.order.sell = ticker.sell.value;
    app.order.buy = ticker.buy.value;

    app.order.amount = $('#amount').val();

    if ($('#currency').val() == 'BTC') {
        app.order.amountcurrency = 'BTC';
    }
    else if ($('#currency').val() == "USD") {
        app.order.amountcurrency = 'USD';
    }


    //CALCUL

    //FEE CALCULATION :

    if (app.order.amountcurrency == 'BTC') {
        var feeUSDPrice = ((app.order.amount * app.order.buy * settings.fee) / 100);
        var feeBTCPrice = convertToBTC(feeUSDPrice);
    }
    if (app.order.amountcurrency == 'USD') {
        var feeUSDPrice = (app.order.amount * settings.fee) / 100;
        var feeBTCPrice = convertToBTC(feeUSDPrice);

    }


    //TakeProfit
    app.order.takeProfit = $('#take-profit').val();

    if (app.order.amountcurrency == 'BTC') {
        //Valueur a TP - Valeur d'aujourd'hui en USD
        var USDProfit = (app.order.amount * app.order.takeProfit) - (app.order.amount * app.order.buy);
        var BTCProfit = convertToBTC(feeUSDPrice);
        var PERCENTProfit = (((app.order.amount * app.order.takeProfit) / (app.order.amount * app.order.buy)) - 1) * 100;
    }
    if (app.order.amountcurrency == 'USD') {
        //Valueur a TP - Valeur d'aujourd'hui en USD
        var USDProfit = (app.order.amount * app.order.takeProfit) - (app.order.amount * app.order.buy);
        var BTCProfit = convertToBTC(feeUSDPrice);
        var PERCENTProfit = (((app.order.amount * app.order.takeProfit) / (app.order.amount * app.order.buy)) - 1) * 100;
    }
    $('#take-profit-info').html('(' + aroundNumberBy('100', USDProfit) + ' $ / ' + aroundNumberBy('100000', BTCProfit) + ' BTC / ' + aroundNumberBy('100', PERCENTProfit) + '%)');

    //StopLoss
    app.order.stopLoss = $('#stop-loss').val();
    if (app.order.amountcurrency == 'BTC') {
        //Valueur a TP - Valeur d'aujourd'hui en USD
        var USDProfit = (app.order.amount * app.order.stopLoss) - (app.order.amount * app.order.sell);
        var BTCProfit = convertToBTC(feeUSDPrice);

        var PERCENTProfit = (((app.order.amount * app.order.stopLoss) / (app.order.amount * app.order.sell)) - 1) * 100;
    }
    if (app.order.amountcurrency == 'USD') {
        //Valueur a TP - Valeur d'aujourd'hui en USD
        var USDProfit = (app.order.amount * app.order.stopLoss) - (app.order.amount * app.order.sell);
        var BTCProfit = convertToBTC(feeUSDPrice);
        var PERCENTProfit = (((app.order.amount * app.order.stopLoss) / (app.order.amount * app.order.sell)) - 1) * 100;
    }

    app.order.market.usdfee = feeUSDPrice;

    $('#stop-loss-info').html('(' + aroundNumberBy('100', USDProfit) + ' $ / ' + aroundNumberBy('100000', BTCProfit) + ' BTC / ' + aroundNumberBy('100', PERCENTProfit) + '%)');


    $('#order-fee').val(aroundNumberBy('1000', feeUSDPrice) + ' $ (' + aroundNumberBy('1000000', feeBTCPrice) + ' Btc [' + settings.fee + '%])');

    /////!!!! IMPORTANT ! SIMULATION OVERRIDE D UN ACHAT !!
    var orderType = 'buy';

    if (settings.buyatmarketprice == true) {
        if (orderType == 'buy') {
            console.log('Bonjour achete moi ' + ticker.sell.value + ' a ' + app.order.amount + '(volume) et donne moi une référence number ! ');
            console.log('Ok ta ref number est F000007');
            console.log('Tu as désormais : ' + app.order.amount + ' btc en plus !');

        }
    }
    event.preventDefault()


}


function engine() {
    //Called every settings.tickTimeout
    ticker = getLastTicker();
    defineTrend();
    updateOrderWithNewTicker();
    //ALL ABOVE MIGHT BE DONE BEFORE ANY DISPLAY

    if (app.order.enabled == 1){
        renderTextModalData();

    }


    //processData();
    //getHistory();
    //processRender();
    //getFormDataAndProcess();

    renderTextData(); //Actualise le front text

    previousTicker = ticker;
    saveEconomicsData();
    app.run++;
}
$('#loadingProgress').css('width', '72%');
//ACT 1. Retablir le contexte :

initLocalStorage();
economicsData = JSON.parse(localStorage[settings.localStorageKey]);

//ACT 2 : RENDER JQWIDGETS !
setTimeout(function () {
    $('#loadingProgress').css('width', '75%');

    $('#HorizontalSplitter').jqxSplitter({  width: 1050, height: 850, orientation: 'horizontal', panels: [
        { size: 775, collapsible: false},
        { size: 75, collapsible: false}
    ] });
    $('#VerticalSplitter').jqxSplitter({ width: 1050, height: 850, orientation: 'vertical', panels: [
        { size: 875, collapsible: false},
        {size: 175, collapsible: false}
    ] });

    $("#accordion").jqxExpander({ width: 'auto'});
    $("#accordion2").jqxExpander({ width: 'auto'});
    $('#jqxTabs').jqxTabs({selectedItem: 5});
    $('#loadingProgress').css('width', '80%');


    //ACT 3. Dessiner le graph !
    setTimeout(function () {
        $('#loadingProgress').css('width', '82%');
        processRenderStock();
        $('#loadingProgress').css('width', '85%');

        //ACT 4: On recupère des valeur et on lance le tout.
        setTimeout(function () {
            $('#loadingProgress').css('width', '90%');
            //On appell tout les events fixes
            onInputChanged();

            engine();
            setInterval(function () {
                engine();
            }, settings.tickTimeout);

            $('#loadingProgress').css('width', '99%');
            $('#progressBar').css('display', 'none');
        }, 100);


    }, 100);


}, 100);





