"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Drive_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Drive"));
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
const templates_1 = require("../templates/config/templates");
const generateRust_1 = __importDefault(require("../templates/helper/generateRust"));
const loanContract_1 = require("./controllers/loanContract");
Route_1.default.post('/make_contract', async ({ request }) => {
    const body = request.body();
    const dt = (new Date()).getTime();
    const src_template = [
        'templates/counter/src/entities.rs',
        'templates/counter/src/lib.rs',
        'templates/counter/src/macro_fns.rs',
        'templates/counter/src/operations.rs',
        'templates/counter/build.sh',
        'templates/counter/Cargo.lock',
        'templates/counter/Cargo.toml',
    ];
    const handleEntities = (contents, entities) => {
        entities.map(entity => {
            if (entity.type == 'storage') {
                const entityContent = generateRust_1.default.genrerateStruct(entity.name, entity.attributes) + '\n' + '//{$entities}';
                contents = contents.replace('//{$entities}', entityContent);
            }
            if (entity.type == 'enum') {
                const entityContent = generateRust_1.default.genrerateEnum(entity.name, entity.attributes) + '\n' + '//{$entities}';
                contents = contents.replace('//{$entities}', entityContent);
            }
        });
        return contents;
    };
    const handleGenerateContractMain = (contents, contract) => {
        const contractString = generateRust_1.default.genrerateContract(contract.name, contract.attributes);
        return contents.replace('//{$contract}', contractString);
    };
    const handleGenerateContractFunctions = (contents, functions) => {
        functions.map(functionObj => {
            if (contents.includes('//{$functions}')) {
                contents = contents.replace('//{$functions}', templates_1.fns.counter.contract_fns[functionObj]) + '\n' + '//{$functions}';
            }
        });
        return contents;
    };
    const handleGenerateImplFunctions = (contents, functions) => {
        functions.map(functionObj => {
            if (contents.includes('//{$impl_entities}')) {
                contents = contents.replace('//{$impl_entities}', templates_1.fns.counter.impl_fns[functionObj]) + '\n' + '//{$impl_entities}';
            }
        });
        return contents;
    };
    src_template.forEach(async (filePath) => {
        try {
            if (await Drive_1.default.exists(filePath)) {
                const contents = await Drive_1.default.get(filePath);
                let stringContents = contents.toString();
                stringContents = handleGenerateContractMain(stringContents, body.contract);
                stringContents = handleEntities(stringContents, body.entities);
                stringContents = handleGenerateContractFunctions(stringContents, body.functions);
                stringContents = handleGenerateImplFunctions(stringContents, body.impl_entities);
                stringContents = stringContents.replace('{$contract_name}', body.contract.name || '');
                await Drive_1.default.put(`${dt}/${filePath}`, stringContents, {});
            }
        }
        catch (e) {
            console.log(e);
            return { error: true };
        }
    });
    return { success: true };
});
Route_1.default.post('/make_contract_loan', async ({ request }) => {
    const body = request.body();
    const attributes = body.contract.attributes;
    let creatorName = '';
    let contractName = '';
    attributes.map(attr => {
        if (attr.name == 'creator') {
            creatorName = attr.value;
        }
        if (attr.name == 'contract_name') {
            contractName = attr.value;
        }
    });
    const accountdeployed = 'sasas';
    await (0, loanContract_1.addContractToMarket)(creatorName, accountdeployed, 'http://45.76.185.234/home', contractName);
    return { success: true, smartcontract: accountdeployed, web: 'http://45.76.185.234/home', contract_name: contractName, creator_name: creatorName };
});
//# sourceMappingURL=routes.js.map