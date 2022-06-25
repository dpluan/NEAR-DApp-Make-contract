export const CWD_CONTRACT = {
    // LOAN_TEMPLATE_PATH: '/home/hieutk/Documents/k5/x-team/make_contract/build/templates/loan-v2',
    // PATH: '/home/hieutk/Documents/k5/x-team/make_contract/build/tmp/uploads/${contract_folder}/templates/loan-v2',
    LOAN_TEMPLATE_PATH: '/home/www-data/make_contract/build/templates/loan-v2',
    PATH: '/home/www-data/make_contract/build/tmp/uploads/${contract_folder}/templates/loan-v2',
    getPath: (pathConfig, folderContract) => {
        return pathConfig.replace('${contract_folder}', folderContract)
    },
    getPathOut: (folderContract) => {
        return `/home/www-data/make_contract/build/tmp/uploads/${folderContract}/templates/loan-v2/out/loan-v2.wasm`
        // return `/home/hieutk/Documents/k5/x-team/make_contract/build/tmp/uploads/${folderContract}/templates/loan-v2/out/loan-v2.wasm`
    }
}
export const ACCOUNT = {
    // PRIVATE_KEY: 'ed25519:3kNoHXCVP6FHrkdVnBAJPY9PkrRyrHoJpCGJtUFkBpw6H4FfCmMYnXgwZofc3Mb1KiozcsRupSPtdVXRkPAEnap5',
    // ACCOUNT_ADDRESS: 'xteam.testnet',
    // PRIVATE_KEY: 'ed25519:56qXohBtWGyqircNHc5oXtDVGEMMZCocRpiaKgTeLRTdoAELbFLW1LnLkLwcRQarqoJpiSxmXXcGVzHkCGUk9tsp',
    // ACCOUNT_ADDRESS: 'xteam-market.testnet',
    PRIVATE_KEY: 'ed25519:4AuSztL2KiVYduLTLP7tpubr6o1zpRNwonWf1HTT3rvt3NXf5qSCH7c8tSC6PogttSGgY4e6FEv4i34fkdjZkXyu',
    ACCOUNT_ADDRESS: 'market-nfts.testnet',
}

export const MARKET_CONTRACT = {
    NAME: 'market-nfts.testnet',
    METHODS_CONFIG: ['create_smart_contract'],
    WEB_URL: 'http://45.76.185.234/home'
}

// /home/hieutk/Documents/k5/x-team/make_contract/build/tmp/uploads/loan_contract_1655601020084/templates/loan-v2