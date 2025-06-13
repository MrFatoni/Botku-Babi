const WebSocket = require('ws');
const wsUrl = `wss://nbstream.binance.info/w3w/stream`;
const ws = new WebSocket(wsUrl);

// CODED BY GEMINI AI
const amount_buy = 1000; // USD
// for i in {1..20}; do bun binance-alpha-push.js; sleep 10m; done
const headers = {} //sniff https://www.binance.info/id/alpha/bsc/0xc71b5f631354be6853efe9c3ab6b9590f8302e81





// Event handler for connection open
ws.on('open', () => {
  console.log('Connected to WebSocket endpoint');
  ws.send('{"method":"SUBSCRIBE","params":["alpha@c9e42106e1f250389108d5890d9154bd","w3w@0xc71b5f631354be6853efe9c3ab6b9590f8302e81@56@kline_15m"],"id":1}');
  });
  
  // Function to monitor balance until it reaches target
  async function waitForBalanceTarget(targetBalance = 2.02, maxRetries = 100) {
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        let balance_zkj = await fetch('https://www.binance.info/bapi/defi/v1/private/wallet-direct/cloud-wallet/alpha', { headers });
        balance_zkj = await balance_zkj.json();
        const abalance_zkj = balance_zkj.data.list[0].free;
        console.log(`Balance ZKJ: ${abalance_zkj} (Target: ${targetBalance})`);
        
        if (abalance_zkj >= targetBalance) {
          console.log(`✅ Target balance reached! Current balance: ${abalance_zkj}`);
          return abalance_zkj;
        }
        
        console.log(`⏳ Balance under ${targetBalance}, checking again in 1 seconds... (Attempt ${retryCount + 1}/${maxRetries})`);
        await Bun.sleep(1000); // Wait 1 seconds before next check
        retryCount++;
        
      } catch (error) {
        console.error('❌ Error checking balance:', error);
        await Bun.sleep(1000); // Wait before retry on error
        retryCount++;
      }
    }
    
    throw new Error(`❌ Max retries (${maxRetries}) reached. Balance may not have reached target.`);
  }
  
  // Event handler for receiving messages
  ws.on('message', async(data) => {
  try {
    const message = JSON.parse(data);
    if (message.data) {
      
const current_price = message.data.k.c;
//const amount_buy = 1000; // USD
const buy_price = current_price * 1.01; // 1% above current price
const sell_price = current_price * 0.997; // 0.3% below current price

const quantity = amount_buy / buy_price;

      
      // Log trading parameters
      console.log(`\n🔄 NEW TRADE CYCLE`);
      console.log(`Current Price: ${current_price}`);
      console.log(`Buy Price (1% above): ${buy_price}`);
      console.log(`Quantity to buy: ${quantity}`);
      console.log(`Total amount: ${amount_buy} USD`);
      
      // Step 1: Place BUY order
const data_beli = JSON.stringify({
  "baseAsset": "ALPHA_173",
  "quoteAsset": "USDT",
  "side": "BUY",
  "price": Number(buy_price.toFixed(8)),
  "quantity": Number(quantity.toFixed(3)),
  "paymentDetails": [
      {
          "amount": Number(buy_price.toFixed(8)) * Number(quantity.toFixed(3)).toFixed(8),
          "paymentWalletType": "CARD"
      }
  ]
});
      
      console.log('\n📈 PLACING BUY ORDER...');
     // console.log(data_beli);
      
      let beli = await fetch('https://www.binance.info/bapi/asset/v1/private/alpha-trade/order/place', {
        method: 'POST',
        headers,
        body: data_beli
      });
      beli = await beli.json();
      console.log('📈 BUY ORDER RESPONSE:', beli);
      
      // Step 2: Wait for balance to reach target (2.02 or higher)
      console.log('\n⏳ WAITING FOR BALANCE TO REACH TARGET...');
      let final_balance = await waitForBalanceTarget(2.02); //buat cek doang
      final_balance = final_balance - 0.01;
      
      // Step 3: Place SELL order with the actual balance
      console.log('\n📉 PREPARING SELL ORDER...');

      const data_jual = JSON.stringify({
        'baseAsset': 'ALPHA_173',
        'quoteAsset': 'USDT',
        'side': 'SELL',
        'price': Number(sell_price.toFixed(8)),
        'quantity': Number(final_balance).toFixed(3),
        'paymentDetails': [
         {
        'amount': Number(final_balance).toFixed(3),
        'paymentWalletType': 'ALPHA'
         }
         ]
        })
      //console.log(data_jual);
      //await Bun.sleep(500);
      
      let jual = await fetch('https://www.binance.info/bapi/asset/v1/private/alpha-trade/order/place', {
        method: 'POST',
        headers,
        body: data_jual
      });
      jual = await jual.json();
      console.log('📉 SELL ORDER RESPONSE:', jual);
      
      // Trade completed
      console.log('\n✅ TRADE CYCLE COMPLETED!');
      console.log('DONE SAY');

     

// START LOG
const currentDate = new Date().toISOString().split('T')[0];
const filePath = `logs-swap/${currentDate}.txt`;

// Try to read existing file, default to "0" if file doesn't exist
let counterText;
try {
  counterText = await Bun.file(filePath).text();
} catch (error) {
  counterText = "0";
}

const currentValue = Number(counterText);
const amountBuy = Number(amount_buy);
const newValue = currentValue + amountBuy;

await Bun.write(filePath, newValue.toString());
console.log(`Volume ${currentDate}: ${newValue} USD`);
console.log(`Total double ${newValue*2} USD or ${Math.floor(Math.log2(newValue*2))} point`);
// END LOG
      process.exit(0);
      
    }
  } catch (error) {
    console.error('❌ Error in trade cycle:', error);
    process.exit(1);
  }
  });
  
  // Event handler for errors
  ws.on('error', (error) => {
  console.error('WebSocket error:', error);
  });
  
  // Event handler for connection close
  ws.on('close', () => {
  console.log('Disconnected from WebSocket');
  });




