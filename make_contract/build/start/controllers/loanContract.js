"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addContractToMarket = exports.deployContractLoan = exports.buildContract = exports.makeContract = void 0;
const Drive_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Drive"));
const contract_1 = global[Symbol.for('ioc.use')]("Config/contract");
const templates_1 = require("../../templates/config/templates");
const service_1 = require("../../app/service");
const makeContract = async (request) => {
    const body = request.body();
    let folderContract = '';
    const dt = (new Date()).getTime();
    folderContract = `loan_contract_${dt}`;
    const src_template = [
        'templates/p2p_loan/src/lib.rs',
        'templates/p2p_loan/Cargo.lock',
        'templates/p2p_loan/Cargo.toml',
    ];
    const handleGenerateContractFunctions = (contents, functions) => {
        functions.map(functionObj => {
            if (contents.includes('//{$functions}')) {
                contents = contents.replace('//{$functions}', templates_1.fns.loan.functions[functionObj] + '\n' + '//{$functions}');
            }
        });
        return contents;
    };
    for (const filePath of src_template) {
        try {
            if (await Drive_1.default.exists(filePath)) {
                const contents = await Drive_1.default.get(filePath);
                let stringContents = contents.toString();
                stringContents = handleGenerateContractFunctions(stringContents, body.functions);
                const newPath = `${folderContract}/${filePath}`;
                await Drive_1.default.put(newPath, stringContents, {});
            }
        }
        catch (e) {
            console.log(e);
            return { error: true };
        }
    }
    return folderContract;
};
exports.makeContract = makeContract;
const buildContract = (folderName) => {
    return new Promise((resolve) => {
        const pathToFolder = contract_1.CWD_CONTRACT.getPath(contract_1.CWD_CONTRACT.PATH, folderName);
        const { exec } = require('node:child_process');
        exec(`cp ${contract_1.CWD_CONTRACT.LOAN_TEMPLATE_PATH}/build.sh ${pathToFolder}`, { cwd: pathToFolder }, (error) => {
            if (error) {
                console.log(pathToFolder, error);
            }
            else {
                console.log('successful');
                exec(`./build.sh`, { cwd: pathToFolder }, async (error, stdout) => {
                    if (error) {
                        console.log(pathToFolder, error);
                    }
                    else {
                        resolve(stdout);
                    }
                });
            }
        });
    });
};
exports.buildContract = buildContract;
const deployContractBySubAccount = async (keyPair, newAccountId, pathFile) => {
    const nearAPI = require("near-api-js");
    const { connect, keyStores } = nearAPI;
    const fs = require('fs');
    const keyStore = new keyStores.InMemoryKeyStore();
    await keyStore.setKey('testnet', newAccountId, keyPair);
    const configSubAccount = (0, service_1.getConfig)(keyStore);
    const nearSubAccount = await connect(configSubAccount);
    const subAccount = await nearSubAccount.account(newAccountId);
    const resDeployed = await subAccount.deployContract(fs.readFileSync(pathFile));
    return resDeployed;
};
const deployContractLoan = async (newAccountId, folderName) => {
    const nearAPI = require("near-api-js");
    const { connect, keyStores, KeyPair, utils } = nearAPI;
    const pathFile = contract_1.CWD_CONTRACT.getPathOut(folderName);
    const keyStore = new keyStores.InMemoryKeyStore();
    const keyPairMaster = KeyPair.fromString(contract_1.ACCOUNT.PRIVATE_KEY);
    await keyStore.setKey("testnet", contract_1.ACCOUNT.ACCOUNT_ADDRESS, keyPairMaster);
    const config = (0, service_1.getConfig)(keyStore);
    const near = await connect(config);
    const account = await near.account(contract_1.ACCOUNT.ACCOUNT_ADDRESS);
    const keyPairSubAccount = KeyPair.fromRandom("ed25519");
    const publicSubKey = keyPairSubAccount.publicKey.toString();
    await account.createAccount(newAccountId, publicSubKey, utils.format.parseNearAmount('2'));
    const resDeployed = await deployContractBySubAccount(keyPairSubAccount, newAccountId, pathFile);
    return resDeployed;
};
exports.deployContractLoan = deployContractLoan;
const addContractToMarket = async (creator_id, contract_deploy_address, frontend_address, contract_name) => {
    const nearAPI = require("near-api-js");
    const { connect, keyStores, KeyPair } = nearAPI;
    const keyStore = new keyStores.InMemoryKeyStore();
    const keyPairMaster = KeyPair.fromString(contract_1.ACCOUNT.PRIVATE_KEY);
    await keyStore.setKey("testnet", contract_1.ACCOUNT.ACCOUNT_ADDRESS, keyPairMaster);
    const config = (0, service_1.getConfig)(keyStore);
    const near = await connect(config);
    const account = await near.account(contract_1.ACCOUNT.ACCOUNT_ADDRESS);
    const contract = new nearAPI.Contract(account, contract_1.MARKET_CONTRACT.NAME, {
        changeMethods: contract_1.MARKET_CONTRACT.METHODS_CONFIG,
    });
    await contract.create_smart_contract({
        creator_id, contract_deploy_address, frontend_address, contract_name
    });
};
exports.addContractToMarket = addContractToMarket;
//# sourceMappingURL=loanContract.js.map