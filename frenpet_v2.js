const {ethers} = require('ethers');
const axios = require('axios');
//const delay = require('delay');
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}


(async () => {
    const provider = new ethers.providers.JsonRpcProvider("https://1rpc.io/base")
    const wallet = new ethers.Wallet('0x0000001010100101', provider); //change with your PK
    const frenID = 225; //change with your petid
    // donate 0x3257b007d649423647184fa5d358543916e1aaa9 :)

    const frenABI = [{"inputs":[],"name":"BonkCommitAlreadyUsed","type":"error"},{"inputs":[],"name":"BonkCommitRevealMismatch","type":"error"},{"inputs":[],"name":"BonkHasShield","type":"error"},{"inputs":[],"name":"BonkLevelError","type":"error"},{"inputs":[],"name":"BonkNotSelf","type":"error"},{"inputs":[{"internalType":"uint256","name":"petId","type":"uint256"}],"name":"BonkTooEarly","type":"error"},{"inputs":[],"name":"CanNotUnequip","type":"error"},{"inputs":[],"name":"InvalidBonkSignature","type":"error"},{"inputs":[{"internalType":"bytes32","name":"nonce","type":"bytes32"}],"name":"NeedToRevealBonkFirst","type":"error"},{"inputs":[],"name":"NoPendingBonk","type":"error"},{"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"address","name":"_contractOwner","type":"address"}],"name":"NotContractOwner","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"attacker","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"winner","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"loser","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"scoresWon","type":"uint256"}],"name":"Attack","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"attackerId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"targetId","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"nonce","type":"bytes32"},{"indexed":false,"internalType":"bytes32","name":"commit","type":"bytes32"}],"name":"BonkCommit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"attackerId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"targetId","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"commit","type":"bytes32"},{"indexed":false,"internalType":"bytes32","name":"reveal","type":"bytes32"}],"name":"BonkReveal","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"attackerId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"targetId","type":"uint256"}],"name":"BonkTooSlow","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"nftId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"deadId","type":"uint256"},{"indexed":false,"internalType":"string","name":"loserName","type":"string"},{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"},{"indexed":false,"internalType":"address","name":"killer","type":"address"},{"indexed":false,"internalType":"string","name":"winnerName","type":"string"}],"name":"PetKilled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"petId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"RedeemRewards","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"nftId","type":"uint256"},{"indexed":false,"internalType":"address","name":"giver","type":"address"},{"indexed":false,"internalType":"uint256","name":"itemId","type":"uint256"}],"name":"SellItem","type":"event"},{"inputs":[{"internalType":"uint256","name":"attackerId","type":"uint256"},{"internalType":"uint256","name":"targetId","type":"uint256"},{"internalType":"bytes32","name":"nonce","type":"bytes32"},{"internalType":"bytes32","name":"commit","type":"bytes32"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"bonkCommit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"attackerId","type":"uint256"},{"internalType":"bytes32","name":"reveal","type":"bytes32"}],"name":"bonkReveal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newBonkSigner","type":"address"}],"name":"setBonkSigner","outputs":[],"stateMutability":"nonpayable","type":"function"}];



    const contract = new ethers.Contract(
        '0x0e22B5f3E11944578b37ED04F5312Dfc246f443C',
        frenABI,
        wallet
    )

try {

  const url = 'https://api.frenpet.dievardump.com/';

  const getTARGETPET = {"query":"query MyQuery {\n  pets(\n    orderDirection: \"asc\"\n    orderBy: \"lastAttacked\"\n    where: {owner_not: \"0x0000000000000000000000000000000000000000\", level_gte: 30, lastAttacked_not: 0}\n  ) {\n    level\n    owner\n    id\n    lastAttacked\n  }\n}","operationName":"MyQuery"}


  const ambil_target = await axios.post(url, getTARGETPET);
  const data_commit = await axios.get('https://frenpet.xyz/api/bonk/commit/'+frenID);


 for (var idx in ambil_target.data.data.pets) {
  try {

    const functionGasFees = await contract.estimateGas.bonkCommit(frenID, ambil_target.data.data.pets[idx].id, data_commit.data.nonce, data_commit.data.commit, data_commit.data.signature);
    console.log('gas: ' + functionGasFees.toNumber());

    const txed = await contract.bonkCommit(frenID, ambil_target.data.data.pets[idx].id, data_commit.data.nonce, data_commit.data.commit, data_commit.data.signature);
    console.log('txHash bonkCommit:', txed.hash);

    await delay(10000); //delay 10 detik biar muncul reveal
    const data_reveal = await axios.get('https://frenpet.xyz/api/bonk/reveal/'+frenID);


    const txed2 = await contract.bonkReveal(frenID, data_reveal.data.reveal);
    console.log('txHash attack:', txed2.hash);
    process.exit(0);


  } catch (err) {
    console.error(`skipping attack for pet ${ambil_target.data.data.pets[idx].id}`);
    //console.log(err.code);
    continue;
  }
}

process.exit(0);
} catch (err) {
   console.log(err.code);

 }
})();