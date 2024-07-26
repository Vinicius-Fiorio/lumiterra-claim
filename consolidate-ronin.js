require("dotenv").config();
const ethers  = require("ethers");
const { PRIVATE_KEYS } = require("./utils/pks");

const PROVIDER = new ethers.JsonRpcProvider(`https://api-gateway.skymavis.com/rpc?apikey=${process.env.RPC_KEY}`);

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function consolidate(wallet){
  const signer = new ethers.Wallet(wallet.pk, PROVIDER);

  try {
    const balance = await PROVIDER.getBalance(signer.address)
    
    const tx = await signer.sendTransaction({
      to: process.env.MAIN_ADDRESS,
      value: balance - ethers.parseEther("0.00042") //fee transaction
    })

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

    consolidate(PRIVATE_KEYS[count]);
    count++;
    controller++;
  }
}

start()