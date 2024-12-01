//import { sign48 } from './anuku.js'
const { ethers } = require('ethers');
import { createPublicClient, encodeFunctionData, createWalletClient, http, parseAbi, parseEther, parseGwei } from 'viem'
import { bsc } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'




function sign48(privateKeyHex, txHashes) {
  if (!privateKeyHex) {
    throw new Error('Private key is required');
  }

  if (!Array.isArray(txHashes) || txHashes.length < 2) {
    throw new Error('At least two transaction hashes are required');
  }


  const arrayifiedHashes = txHashes.map(hash => ethers.utils.arrayify(ethers.utils.keccak256(hash)));
  const combinedHash = ethers.utils.keccak256(
    ethers.utils.concat(arrayifiedHashes)
  );

  const wallet = new ethers.utils.SigningKey(privateKeyHex);
  let signature = wallet.signDigest(combinedHash);
  signature = ethers.utils.joinSignature(signature).slice(0, -2) + '01';

  return signature;
}






 // i know u looking for this



const abi = parseAbi([
    "function yoink(address)",
    "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)",
    "function yoink(address token, uint256 jml)",
    "function fillQuoteEthToToken(address buyTokenAddress,address target,bytes swapCallData,uint256 feeAmount)"
  ]);

const privateKey = '0x.....'
const account = privateKeyToAccount(privateKey);
const wallet = createWalletClient({
  account,
  chain: bsc, 
  transport: http() 
}) 
const client = createPublicClient({
    chain: bsc,
    transport: http(),
  })


const nonce = await client.getTransactionCount({  
    address: account.address,
  })

/* for contract
const functionData = encodeFunctionData({
    abi,
    functionName: 'fillQuoteEthToToken',
    args: [
		"0x111111111117dC0aa78b770fA6A738034120C302", //token buy
		ambildata.to, //1inch router
		ambildata.data,
		ambildata.fee
	  ]
  }); */


  const txbuild = await wallet.prepareTransactionRequest({
    account,
    to: "0x0000000000000000000000000000000000000000",
    value: parseEther(`0`),
    gasPrice: parseGwei('1'),
    gas: 25000n,
   // data: functionData
  })
   
  const signature = await wallet.signTransaction(txbuild);

 
  const txbuild2 = await wallet.prepareTransactionRequest({
    account,
    to: "0x0000000000000000000000000000000000000001",
    value: parseEther(`0`),
    gasPrice: parseGwei('1'),
    gas: 25000n,
    nonce: nonce+1,
    data: '0x1337'
  })
   
  const signature2 = await wallet.signTransaction(txbuild2);
 
  let stackedTX = [];
  stackedTX.push(signature)
  stackedTX.push(signature2)

let request_bundle = await fetch(
    `https://puissant-builder.48.club/`, //flashbots
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          'id': 1,
          "jsonrpc": "2.0",
         "method": "eth_sendBundle",
          "params": [{
                "txs": stackedTX,
                // "maxTimestamp": block,
               // "48spSign": sign48(privateKey, stackedTX),
          }],
    
      })
      
    }
  );
  request_bundle = await request_bundle.json();
  console.log(request_bundle)
