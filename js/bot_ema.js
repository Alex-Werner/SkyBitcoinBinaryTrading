//TO REMEMBER : Need to work as a stand-alone
/*
 * PS : EMA is bullshit, but because many bot do take care of EMA, then... EMA works because people use EMA to predict things.
 *EMA STRAT :
 * Buy : EMA10 > EMA21
 * Sell : EMA10<EMA21
 *
 *Flipist :
 * Buy where there is heads
 * Sell where is tails.
 *
 */
// Why MA : Smoothing
// Why EMA and not SMA : Because we estimate than fresh data is more relevant than old. 
// Why not combine EMA10/21 and SMA : Well... If you can help me to figure this out... <3
// EMA10 : More react
//EMA21 : Backbone. 

var bot = {};
bot.type = "EMA";
bot.update = 0;
bot.candle = {};
bot.candle[ 0 ].last = "1000";
bot.candle[ 1 ].last = "990";
bot.candle[ 2 ].last = "990";
bot.candle[ 3 ].last = "985";
bot.candle[ 4 ].last = "985";
bot.candle[ 5 ].last = "970";
bot.candle[ 6 ].last = "960";
bot.candle[ 7 ].last = "985";
bot.candle[ 8 ].last = "995";
bot.candle[ 9 ].last = "1005";
bot.candle[ 10 ].last = "1010";
bot.EMA10 = 0;
bot.EMA21 = 0;



function getActualTime() {
	var d = new Date();
	var dh = d.getHours();
	var dm = d.getMinutes();
	var ds = d.getSeconds();

	return dh + ":" + dm + ":" + ds;
}

function log( message ) {
	var time = getActualTime();
	console.log( time + "-" + message );
}

function initBot() {
	log( "Activate bot from darkness" );

	this.lastCandle = bot.candle[ 0 ];
	this.candle = bot.candle[ 0 ];

}

function ema_update() {
	log( "Update EMA" );
	bot.update++;
	this.lastCandle = this.candle;
	this.candle = bot.candle[ bot.update ];
	calculateEMA( candle );
}

// Early calculation (tick/day):
//  EMA = Price(t) * k + EMA(y) * (1 – k)
//  t = today, y = yesterday, N = number of days in EMA, k = 2 / (N+1)
function calculateEMA( candle ) {

	//EMA10
	var k = 2 / ( 10 + 1 ) //EMA10
	EMA10 = getPrice( today ) * k * lastEMA10 * ( 1 - k );

	k = 2 / ( 10 + 1 )
	EMA = price( today ) * k
}

function getPrice( today ) {

}

function getEMAdiff( idx ) {

	EMALONG[ 144 ] = 938.0873556980567;
	EMASHORT[ 144 ] = 938.6810966266443;

	return 100 * ( EMASHORT[ 144 ] - EMALONG[ 144 ] ) / ( ( EMASHORT[ 144 ] + EMALONG[ 144 ] ) / 2 );
}

function updateTick() {
	var btcFiat = "USD";
	var HoursToKeep = 144;
	var TimeFrame = 3600; //3600 = 1hr
	var hour_fetch = parseInt( ( new Date() ).getTime() / ( TimeFrame * 1000 ) );
	var url = "https://data.mtgox.com/api/0/data/getTrades.php?Currency=" + btcFiat + "&since=" + ( hour_fetch * TimeFrame * 1000000 ).toString()
	//Get last 100 data
	//Store price

	var req = new XMLHttpRequest();
	req.onerror = function ( e ) {
		log( "Erreur" );
	}
	req.open( "GET", url )
	req.send( null );

	return url;

}