import Drive from "@ioc:Adonis/Core/Drive"
import { ACCOUNT, CWD_CONTRACT, MARKET_CONTRACT } from "Config/contract"
import { fns } from "../../templates/config/templates"
import { getConfig } from "../../app/service"


export const makeContract = async (request) => {
    const body = request.body()
    let folderContract = ''

    const dt = (new Date()).getTime()
    folderContract = `loan_contract_${dt}`

    const src_template = [
        'templates/loan-v2/src/lib.rs',
        'templates/loan-v2/Cargo.lock',
        'templates/loan-v2/Cargo.toml',
    ]


    const handleGenerateContractFunctions = (contents: string, functions: any) => {
        functions.map(functionObj => {
            if (contents.includes('//{$functions}')) {
                contents = contents.replace('//{$functions}', fns.loan.functions[functionObj] + '\n' + '//{$functions}')
            }
        })
        return contents
    }

    for (const filePath of src_template) {
        try {
            if (await Drive.exists(filePath)) {

                const contents = await Drive.get(filePath)

                let stringContents = contents.toString()

                stringContents = handleGenerateContractFunctions(stringContents, body.functions)


                const newPath = `${folderContract}/${filePath}`
                await Drive.put(newPath, stringContents, {})

            }
        } catch (e: any) {
            console.log(e);

            return { error: true }
        }
    }


    return folderContract

}


export const buildContract = (folderName) => {
    return new Promise((resolve) => {
        const pathToFolder = CWD_CONTRACT.getPath(CWD_CONTRACT.PATH, folderName)
        const { exec } = require('node:child_process');

        exec(`cp ${CWD_CONTRACT.LOAN_TEMPLATE_PATH}/build.sh ${pathToFolder}`, { cwd: pathToFolder }, (error) => {
            if (error) {
                console.log(pathToFolder, error); // an AbortError
            } else {
                console.log('successful')
                exec(`./build.sh`, { cwd: pathToFolder }, async (error, stdout) => {
                    if (error) {
                        console.log(pathToFolder, error); // an AbortError
                    } else {
                        resolve(stdout)
                    }
                });
            }


        });
    })

}

const deployContractBySubAccount = async (keyPair, newAccountId, pathFile) => {
    const nearAPI = require("near-api-js");
    const { connect, keyStores } = nearAPI;
    const fs = require('fs');

    const keyStore = new keyStores.InMemoryKeyStore();
    // adds the keyPair you created to keyStore
    await keyStore.setKey('testnet', newAccountId, keyPair);

    const configSubAccount = getConfig(keyStore)

    // connect to NEAR
    const nearSubAccount = await connect(configSubAccount);

    const subAccount = await nearSubAccount.account(newAccountId)

    const resDeployed = await subAccount.deployContract(fs.readFileSync(pathFile))

    return resDeployed
}

export const deployContractLoan = async (newAccountId, folderName) => {
    const nearAPI = require("near-api-js");
    const { connect, keyStores, KeyPair, utils } = nearAPI;

    const pathFile = CWD_CONTRACT.getPathOut(folderName)

    const keyStore = new keyStores.InMemoryKeyStore();
    // creates a public / private key pair using the provided private key
    const keyPairMaster = KeyPair.fromString(ACCOUNT.PRIVATE_KEY);
    // adds the keyPair you created to keyStore
    await keyStore.setKey("testnet", ACCOUNT.ACCOUNT_ADDRESS, keyPairMaster);

    const config = getConfig(keyStore)


    // connect to NEAR
    const near = await connect(config);

    const account = await near.account(ACCOUNT.ACCOUNT_ADDRESS)

    const keyPairSubAccount = KeyPair.fromRandom("ed25519");
    const publicSubKey = keyPairSubAccount.publicKey.toString();

    await account.createAccount(newAccountId, publicSubKey, utils.format.parseNearAmount('2'))

    // console.log(resCreated);

    // console.log('===========deploy============================================================\n');

    const resDeployed = await deployContractBySubAccount(keyPairSubAccount, newAccountId, pathFile)

    return resDeployed
}

export const addContractToMarket = async (creator_id, contract_deploy_address, frontend_address, contract_name) => {
    const nearAPI = require("near-api-js");
    const { connect, keyStores, KeyPair } = nearAPI;

    const keyStore = new keyStores.InMemoryKeyStore();
    // creates a public / private key pair using the provided private key
    const keyPairMaster = KeyPair.fromString(ACCOUNT.PRIVATE_KEY);
    // adds the keyPair you created to keyStore
    await keyStore.setKey("testnet", ACCOUNT.ACCOUNT_ADDRESS, keyPairMaster);

    const config = getConfig(keyStore)

    // connect to NEAR
    const near = await connect(config);

    const account = await near.account(ACCOUNT.ACCOUNT_ADDRESS)
    
    const contract = new nearAPI.Contract(account, MARKET_CONTRACT.NAME, {
        // Change methods can modify the state. But you don't receive the returned value when called.
        changeMethods: MARKET_CONTRACT.METHODS_CONFIG,
    });

    await contract.create_smart_contract({
        creator_id, contract_deploy_address, frontend_address, contract_name
    })
}
