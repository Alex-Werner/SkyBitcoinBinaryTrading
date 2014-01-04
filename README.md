SkyBitcoinBinaryTrading
=======================

Trade with binary option on MtGOX. (Bitcoin platform)


How to use :
Run index.htm. Enter your secret/token. Enjoy.

What is it ?

Sky Bitcoin Binary Trading is a webapplication connected with mtgox to let you do in a easiest way some binary order.
Immediate Buy, Immediate Sell, Stop Loss, Take Profit, Fee estimation, Total gain expectation...
Plannificate a order at your wanted price.
Manage your actual order (as cancel).
Automatise transaction with a trending bot.


How contact me ?
@obusco on twitter :)

Changelog
=========================
v0.1 :
- Templating
- Adding Graph and connect at local rate database
- Connecting context (database) and localStorage to keep data longer than the session
- Basic calculation : Gives you from an amount and the market price, fee estimation, and stoploss/takeProfit info.
- Network : Can handle an order (at market price).


TODO LIST
===========================

- Handle market place price off
- Handle Current order (in local)
- Handle adding StopLoss and TakeProfit order + do not forget to keep ref id, to cancel one where the other is triggered
- Handle secret / apikey input
- Do a  "practice" of trade tool
- Set up a webserver with server-side information such as market data, settings; and client-side : secret, api.