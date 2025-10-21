
//quoteOrderQty itu jumlah USD
const data_beli = JSON.stringify({"side":"BUY","symbol":"x","quoteOrderQty":"x","type":"MARKET"})
let beli = await fetch("https://www.binance.com/bapi/mbx/v1/private/mbxgateway/order/place", {
    method: 'POST',
    headers,
    body: data_beli
  });
beli = await beli.json();
console.log(beli)
console.log(beli.data.executedQty)


await Bun.sleep(000); //5s

//jual quantity ambil dari json
const data_jual = JSON.stringify({
    "side": "SELL",
    "symbol": "x",
    "quantity": beli.data.executedQty,
    "type": "MARKET"
  })
console.log(data_jual)
let jual = await fetch("https://www.binance.com/bapi/mbx/v1/private/mbxgateway/order/place", {
    method: 'POST',
    headers,
    body: data_jual
  });
  jual = await jual.json();
console.log(jual)
