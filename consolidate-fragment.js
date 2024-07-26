require("dotenv").config();
const ethers  = require("ethers");
const { CONTRACT_ABI_FRAGMENT } = require("./utils/models");
const { PRIVATE_KEYS } = require("./utils/pks");

const PROVIDER = new ethers.JsonRpcProvider(`https://api-gateway.skymavis.com/rpc?apikey=${process.env.RPC_KEY}`);
const CONTRACT = new ethers.Contract("0xcc451977a4be9adee892f7e610fe3e3b3927b5a1", CONTRACT_ABI_FRAGMENT, PROVIDER);

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function consolidate(wallet){
  const signer = new ethers.Wallet(wallet.pk, PROVIDER);
  const contractSigner = CONTRACT.connect(signer);
  const balanceFragment = await CONTRACT.balanceOf(signer.address, 268650256);

  try {
    const tx = await contractSigner.safeTransferFrom(
      signer.address,
      process.env.MAIN_ADDRESS,
      268650256,
      Number(balanceFragment),
      "0x"
    );

    await tx.wait()
    console.log(`\x1b[42m${signer.address}\u001b[0m sent ${Number(balanceFragment)} to ${process.env.MAIN_ADDRESS}`);
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