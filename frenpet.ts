const {ethers} = require('ethers');
const axios = require('axios');

//while true; do bun frenpet.ts; sleep 5m; done


(async () => {
    const provider = new ethers.providers.JsonRpcProvider("https://1rpc.io/base")
    const wallet = new ethers.Wallet('PRIVKEY', provider);
    //new ethers.Wallet('xxx', provider)
    const frenID = 123123123123123; //change with your pet ID


    const frenABI = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"attacker","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"winner","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"loser","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"scoresWon","type":"uint256"}],"name":"Attack","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"nftId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"deadId","type":"uint256"},{"indexed":false,"internalType":"string","name":"loserName","type":"string"},{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"},{"indexed":false,"internalType":"address","name":"killer","type":"address"},{"indexed":false,"internalType":"string","name":"winnerName","type":"string"}],"name":"PetKilled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"petId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"RedeemRewards","type":"event"},{"inputs":[{"internalType":"uint256","name":"fromId","type":"uint256"},{"internalType":"uint256","name":"toId","type":"uint256"}],"name":"attack","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_deadId","type":"uint256"},{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"kill","outputs":[],"stateMutability":"nonpayable","type":"function"}]



    const contract = new ethers.Contract(
        '0x0e22B5f3E11944578b37ED04F5312Dfc246f443C',
        frenABI,
        wallet
    )

    var counter = 0;
    var done = 0;
    var errors = 0;

    while (true) {
        counter++;
try {

  const url = 'https://chubby-skate-production.up.railway.app/'; //change "level" below with your pet level
  const getTARGETPET = {"query":"query MyQuery {\n  pets(\n    where: {level: 12}\n    orderBy: \"lastAttacked\"\n    orderDirection: \"asc\"\n    first: 10\n  ) {\n    id\n    level\n    score\n    lastAttacked\n    status\n  }\n}","operationName":"MyQuery"};
  const ambil_target = await axios.post(url, getTARGETPET);
 //console.log(ambil_target.data.data)

 for(var idx in ambil_target.data.data.pets){

    const functionGasFees = await contract.estimateGas.attack(frenID, ambil_target.data.data.pets[idx].id)
    console.log('functionGasFees: ' + functionGasFees.toNumber())
    const txed = await contract.attack(frenID, ambil_target.data.data.pets[idx].id)
    console.log('txHash:', txed.hash);
 }
 done++;
 process.exit(0); //end


} catch (err) {
   console.error(`SKIP, ATTACK BELOM SIAP`);
   errors++;
   console.log(err);

 }
}
})();