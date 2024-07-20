# How Configure & Execute Script
- Install [Node JS](https://nodejs.org/pt)
- Clone this repository or download a zip

```bash
npm i
```

## Get your API RPC KEY
- Create a application in [Mavis Console](https://developers.skymavis.com/console/applications/)
- Copy the API KEY like this: wTH0ZI45646tC7SfTWakT4I1m7BixLrc

## Edit .env file
- SPLIT_TRANSACTIONS: how many transactions per batch
- SECONDS_TO_WAIT: seconds to wait when fullfil batch
- RPC_KEY: your rpc key paste here, this in docs doesnt work

```shell
SPLIT_TRANSACTIONS=10 
SECONDS_TO_WAIT=5 
RPC_KEY=wTH0ZI45646tC7SfTWakT4I1m7BixLrc
```

## Edit utils/pks.js
Insert your private keys following the model
```js
const PRIVATE_KEYS = [
  { pk: "pk1"},
  { pk: "pk2"},
  { pk: "pk3"},
  { pk: "pk4"},
  { pk: "pk5"},
  { pk: "pk6"},
  { pk: "pk7"},
  { pk: "pk8"},
]


module.exports = {
  PRIVATE_KEYS
}
```

## Execute script
```shell
node claim
```

## Extra
Use Official [Disperse](https://scatter.roninchain.com/) from ronin chain