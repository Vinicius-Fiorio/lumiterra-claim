require("dotenv").config();
const ethers  = require("ethers");
const { CONTRACT_ABI } = require("./utils/models");
const { PRIVATE_KEYS } = require("./utils/pks");

const PROVIDER = new ethers.JsonRpcProvider(`https://api.roninchain.com/rpc`);
const CONTRACT = new ethers.Contract("0x19f70ecd63f40f11716c3ce2b50a6d07491c12fe", CONTRACT_ABI, PROVIDER);

function sliceTransactions(array, number) {
  let result = [];
  for (let i = 0; i < array.length; i += number) {
    result.push(array.slice(i, i + number));
  }
  return result;
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
  const promises = new Array();

  let count = 0;
  while (count < PRIVATE_KEYS.length) {
    promises.push(claim(PRIVATE_KEYS[count]))
    count++;
  }
  
  const transactions = sliceTransactions(promises, process.env.SPLIT_TRANSACTIONS);

  let countTx = 0;
  while (countTx < transactions.length) {
    await Promise.all(transactions[countTx])

    countTx++;
  }
}

start()