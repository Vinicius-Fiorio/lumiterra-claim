require("dotenv").config();
const ethers  = require("ethers");
const { CONTRACT_ABI } = require("./utils/models");
const { PRIVATE_KEYS } = require("./utils/pks");

const PROVIDER = new ethers.JsonRpcProvider(`https://api-gateway.skymavis.com/rpc?apikey=${process.env.RPC_KEY}`);
const CONTRACT = new ethers.Contract("0x19f70ecd63f40f11716c3ce2b50a6d07491c12fe", CONTRACT_ABI, PROVIDER);

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function claim(wallet){
  const signer = new ethers.Wallet(wallet.pk, PROVIDER);
  const contractSigner = CONTRACT.connect(signer);

  try {
    const tx = await contractSigner.mint("cbt");

    await tx.wait()
    console.log(`\x1b[42m${signer.address}\u001b[0m: ${tx.hash}`);
    return true
  } catch (error) {
    console.log(`\x1b[41m${signer.address}\u001b[0m: Cant execute transaction: ${error}\n\n`);
  }

  return false
}

async function start(){
  let count = 0;
  let controller = 0;
  while (count < PRIVATE_KEYS.length) {

    if(controller == process.env.SPLIT_TRANSACTIONS){
      controller = 0;

      await sleep(process.env.SECONDS_TO_WAIT * 1000);
    }

    claim(PRIVATE_KEYS[count]);
    count++;
    controller++;
  }
}

start()