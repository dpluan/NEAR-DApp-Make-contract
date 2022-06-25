
export const getConfig = (keyStore) => {
  return {
    networkId: "testnet",
    keyStore,
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
  };
}

// export const nearAccount = async () => {
//   const nearAPI = require("near-api-js");
//   const { connect, keyStores, KeyPair } = nearAPI;

//   const keyStore = new keyStores.InMemoryKeyStore();
//   // creates a public / private key pair using the provided private key
//   const keyPair = KeyPair.fromString(ACCOUNT.PRIVATE_KEY);
//   // adds the keyPair you created to keyStore
//   await keyStore.setKey("testnet", ACCOUNT.ACCOUNT_ADDRESS, keyPair);


//   const config = getConfig(keyStore)

//   // connect to NEAR
//   const near = await connect(config);

//   const account = await near.account(ACCOUNT.ACCOUNT_ADDRESS)

//   return account
// } 