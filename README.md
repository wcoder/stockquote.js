stockquote.js
=============

The utility for receiving stock quotations of the companies, according to different services

## Example usage
```js
$.stockquote({
	service: "financecontent",
	company: ["AAPL"],
	callback: function (responseObject) {
		if (responseObject) {
			console.log(responseObject);
		} else {
			console.log("Error!");
		}
	}
});
```
 
## Documentation
> For script operation, the jQuery library is necessary
 
### Input data
>  All parameters are required

#### service
Data format: a line with characters lower or an uppercase.
Supported services:

|	Options			|	Full name			|	Site						|
--------------------|-----------------------|--------------------------------
|	google			|	Google Finance		|	http://finance.google.com	|
|	microsoft		|	Microsoft Finance	|	http://money.msn.com		|
|	financecontent	|	Finance Content		|	http://finanacecontent.com	|

#### company
Data format: not an empty array of lines with short names of the companies in an uppercase.

#### callback
Data format: the function obtained as the input paracop data on the requested company in the form of object.
 
 
### Output data
If it is successful:
 - one - `Object`
 - list - `Array of objects`

If error: `false`
 
Properties of returned object for each of the companies:
- FinanceContent.com
  + Ask
  + AskSize
  + Bid
  + BidSize
  + Change
  + ChangePercent
  + Exchange
  + ExchangeCode
  + ExchangeName
  + ExchangeShortName
  + High
  + ISIN
  + Img
  + Last
  + Low
  + Name
  + Open
  + PrevClose
  + Range
  + SharesOutstanding
  + ShortName
  + Ticker
  + TradeTime
  + Valoren
  + Volume
- Google Finance
  + Bid
  + Change
  + ChangePercent
  + ExchangeShortName
  + Img
  + Last
  + Name
  + Open (empty)
  + Range (empty)
  + Ticker
  + TradeTime
- Microsoft Finance
  + Bid
  + Change
  + ChangePercent
  + ExchangeShortName (empty)
  + Img
  + Last
  + Name
  + Open (empty)
  + Range (empty)
  + Ticker
  + TradeTime

---
&copy; Yauheni Pakala
