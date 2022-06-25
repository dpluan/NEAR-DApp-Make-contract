/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Drive from '@ioc:Adonis/Core/Drive';
import Route from '@ioc:Adonis/Core/Route';
import { ACCOUNT, MARKET_CONTRACT } from 'Config/contract';
import { fns } from '../templates/config/templates';
import generateRust from '../templates/helper/generateRust';
import { addContractToMarket, buildContract, deployContractLoan, makeContract} from './controllers/loanContract';

Route.post('/make_contract', async ({ request }) => {
  const body = request.body()

  const dt = (new Date()).getTime()
  const src_template = [
    'templates/counter/src/entities.rs',
    'templates/counter/src/lib.rs',
    'templates/counter/src/macro_fns.rs',

    'templates/counter/src/operations.rs',
    'templates/counter/build.sh',

    'templates/counter/Cargo.lock',
    'templates/counter/Cargo.toml',
  ]


  const handleEntities = (contents: string, entities: any) => {
    entities.map(entity => {
      if (entity.type == 'storage') {
        const entityContent = generateRust.genrerateStruct(entity.name, entity.attributes) + '\n' + '//{$entities}'

        contents = contents.replace('//{$entities}', entityContent)
      }

      if (entity.type == 'enum') {
        const entityContent = generateRust.genrerateEnum(entity.name, entity.attributes) + '\n' + '//{$entities}'

        contents = contents.replace('//{$entities}', entityContent)
      }
    })

    return contents
  }

  const handleGenerateContractMain = (contents: string, contract: any) => {
    const contractString = generateRust.genrerateContract(contract.name, contract.attributes)
    return contents.replace('//{$contract}', contractString)
  }

  const handleGenerateContractFunctions = (contents: string, functions: any) => {
    functions.map(functionObj => {
      if (contents.includes('//{$functions}')) {
        contents = contents.replace('//{$functions}', fns.counter.contract_fns[functionObj]) + '\n' + '//{$functions}'
      }
    })
    return contents
  }

  const handleGenerateImplFunctions = (contents: string, functions: any) => {
    functions.map(functionObj => {
      if (contents.includes('//{$impl_entities}')) {
        contents = contents.replace('//{$impl_entities}', fns.counter.impl_fns[functionObj]) + '\n' + '//{$impl_entities}'
      }
    })
    return contents
  }


  src_template.forEach(async filePath => {
    try {
      if (await Drive.exists(filePath)) {

        const contents = await Drive.get(filePath)

        let stringContents = contents.toString()

        stringContents = handleGenerateContractMain(stringContents, body.contract)
        stringContents = handleEntities(stringContents, body.entities)
        stringContents = handleGenerateContractFunctions(stringContents, body.functions)
        stringContents = handleGenerateImplFunctions(stringContents, body.impl_entities)

        stringContents = stringContents.replace('{$contract_name}', body.contract.name || '')

        await Drive.put(`${dt}/${filePath}`, stringContents, {})
      }
    } catch (e: any) {
      console.log(e);

      return { error: true }
    }
  })


  return { success: true }
})

Route.post('/make_contract_loan', async ({ request }) => {
  const body = request.body()
  const attributes = body.contract.attributes
  let creatorName = ''
  let contractName = ''
  attributes.map(attr => {
    if (attr.name == 'creator') {
      creatorName = attr.value
    }
    if(attr.name == 'contract_name') {
      contractName = attr.value
    }
  })
  const dt = (new Date()).getTime()
  const accountdeployed = `${dt}-deploy.${ACCOUNT.ACCOUNT_ADDRESS}`

  const contractPath = await makeContract(request)
  await buildContract(contractPath)
  const resDeploy = await deployContractLoan(accountdeployed, contractPath)

  await addContractToMarket(creatorName, accountdeployed, MARKET_CONTRACT.WEB_URL, contractName)
  return { success: true, smartcontract: accountdeployed, web: MARKET_CONTRACT.WEB_URL, contract_name: contractName , creator_name: creatorName, hash: resDeploy.transaction.hash}
})
