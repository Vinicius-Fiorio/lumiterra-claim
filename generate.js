require("dotenv").config();
const fs = require("fs");
const { ethers, Mnemonic, HDNodeWallet } = require('ethers');

function generateRandomMnemonic() {
  const wallet = ethers.Wallet.createRandom();
  return wallet.mnemonic.phrase;
}

function generateMultipleKeysFromSeed(mnemonic, numberOfKeys) {
  try {
    const mnenomicInstance = Mnemonic.fromPhrase(mnemonic)
    const masterNode = HDNodeWallet.fromMnemonic(mnenomicInstance, "44'/60'/0'/0");

    for (let i = 0; i < numberOfKeys; i++) {
      const subwalletNode = masterNode.deriveChild(`${i}`);
      const privateKey = subwalletNode.privateKey;
      const publicKey = subwalletNode.address;

      fs.appendFileSync('paste_in_pks_file.txt', `{pk: "${privateKey}"},\n`, 'utf8');
      fs.appendFileSync('paste_in_scatter.txt', `${publicKey},0.021\n`, 'utf8');
    }

    return true
  } catch (error) {
    console.log(error)
  }

  return false
}

const mnemonic = generateRandomMnemonic();
fs.appendFileSync('seed_phrase.txt', `Seed to full wallet: ${mnemonic}\n`, 'utf8');

const isGenerated = generateMultipleKeysFromSeed(mnemonic, process.env.GENERATE_WALLETS);

console.log(isGenerated ? `\n\x1b[42mAddresses generated successfully\u001b[0m\n` : `\n\x1b[41mAddresses could not be generated\u001b[0m\n`)