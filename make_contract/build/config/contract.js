"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MARKET_CONTRACT = exports.ACCOUNT = exports.CWD_CONTRACT = void 0;
exports.CWD_CONTRACT = {
    LOAN_TEMPLATE_PATH: '/home/www-data/make_contract/templates/p2p_loan',
    PATH: '/home/www-data/make_contract/tmp/uploads/${contract_folder}/templates/p2p_loan',
    getPath: (pathConfig, folderContract) => {
        return pathConfig.replace('${contract_folder}', folderContract);
    },
    getPathOut: (folderContract) => {
        return `/home/www-data/make_contract/tmp/uploads/${folderContract}/templates/p2p_loan/out/p2p_loan.wasm`;
    }
};
exports.ACCOUNT = {
    PRIVATE_KEY: 'ed25519:4AuSztL2KiVYduLTLP7tpubr6o1zpRNwonWf1HTT3rvt3NXf5qSCH7c8tSC6PogttSGgY4e6FEv4i34fkdjZkXyu',
    ACCOUNT_ADDRESS: 'market-nfts.testnet',
};
exports.MARKET_CONTRACT = {
    NAME: 'market-nfts.testnet',
    METHODS_CONFIG: ['create_smart_contract']
};
//# sourceMappingURL=contract.js.map