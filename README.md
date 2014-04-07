SkyBitcoinBinaryTrading
=======================

What is it ?
--------
Sky Bitcoin Binary Trading is a web-application connected with some echanges allowing to let your trade in a real easy way.
Immediate Buy, Immediate Sell, Stop Loss, Take Profit, Fee estimation, Total gain expectation, automatic trading bot, market indicators...
It's a tool for the day-trader and the long-term-holder wanting to keep a price on his assets.
Plan your strategy, see it being analysed by time in the StrategistTool.
Avoid your emotionnal mistakes and let the soft suggest you.
Manage your actual order (cancel, etc...)
Put "wise" bid order, but splitting your total amount in as many bids you will sell when X or Y condition is validated.
Automatize all transaction with the trading/trend bot
And more...

A Desktop version is planned (will be written in JS with NodeWebkit).

TODO LIST
===========================
TODO : the TODO LIST then DO the TodoListItems.

Changelog
=========================
V0.2.0a (07/04/2014):
- Added API connected with BTC-E. See "How To Use" for usable methods.

V0.1 : The v0.1 was some workaround. I'm currently re-writing the soft, preparing a v0.2.
v0.1 :
- Templating
- Adding Graph and connect at local rate database
- Connecting context (database) and localStorage to keep data longer than the session
- Basic calculation : Gives you from an amount and the market price, fee estimation, and stoploss/takeProfit info.
- Network : Can handle an order (at market price).


Can I Use It ?
===============

Actually (v0.2.0a), you can't really use this. Except maybe for the BTC-E Api... So no. But keep tracking, new stuff coming soon

What features are supported ?
=============================

Echanges supported :

BTC-E
~~Cex.io (next in preparation)~~

Features supported :

reload() : Automatically call the followed methods, and put data in App. Then App.history, App.ticker and App.orderbook are available

getTicker() : Get last tick from market and put result in App.tick;
getDepth() : Get last orderbook from market and put result in App.orderbook.asks and App.orderbook.bids
getTrades() : Get last history from market and put result in App.history

How To Use
===========

Install
-----------
There is two way, if you have a server, well just put all that files in it, specify your config, and enjoy.

If you are in your own pc. Well, use my proxy as this.proxy ="http://skyline-creations.fr/labs/proxy/proxy.php?url=",
this will allow to get data in JSONP instead of JSON (and cross-domain issue). If someone here have a better solution,
please, do not hesitate to tell me !

Configuration
-----------

Just go on config.js and specify your proper credentials + proxy



Contact-me
==================
I will me more than happy to discuss about everything around Bitcoin and Web. So if you want to contact me :
@obusco on twitter at any time, just send me a tweet and I will provide an email for more deep talk.

Also, if you seek for any Web or Software development agency accepting Bitcoin and Litecoin payment, it's here http://skyline-creations.fr/ :)
