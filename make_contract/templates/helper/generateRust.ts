import entities from "../../templates/config/entities";
export default {
     genrerateStruct: (name: string, attributes: any) => {
        let entity = ''
        let struct = entities.storage.struct.replace('$name', name)
        let attributeContent = ''

        entity = entities.storage.derive + '\n' + entities.storage.serde + '\n'
        
        attributes.map(attribute => {
            attributeContent += '\n' + entities.storage.initContent(attribute.name, attribute.type) + '\n'
        })

        struct = struct.replace('$content', attributeContent)

        entity += struct
        return entity
     },

     genrerateEnum: (name: string, attributes: any) => {
        let entity = ''
        let struct = entities.enum.struct.replace('$name', name)
        let attributeContent = ''

        entity = entities.enum.derive + '\n'
        
        attributes.map(attribute => {
            attributeContent += '\n' + entities.enum.initContent(attribute.name, attribute.type) + '\n'
        })

        struct = struct.replace('$content', attributeContent)

        entity += struct
        return entity
     },

     genrerateContract: (name: string, attributes: any) => {
        let entity = ''
        let contract = entities.contract.struct.replace('$name', name)
        let attributeContent = ''

        entity = entities.contract.header + '\n' + entities.contract.derive + '\n'
        
        attributes.map(attribute => {
            attributeContent += '\n' + entities.contract.initContent(attribute.name, attribute.type) + '\n'
        })

        contract = contract.replace('$content', attributeContent)

        entity += contract
        return entity
     }
}

/*
  /*
storage: {
        derive: '#[derive(BorshSerialize, BorshDeserialize, Default, Serialize, Deserialize)]',
        serde: '#[serde(crate = "near_sdk::serde")]',
        struct: 'pub struct $name {$content}',
        initContent: (name: string, dataType: string) => {
            return `pub ${name} ${dataType}, `
        }
    },
    enum: {
        derive: '#[derive(BorshSerialize, BorshDeserialize)]',
        struct: 'pub enum $name {$content}',
        initContent: (numName: string, objType: string) => {
            const obj = !!objType ? `(${objType})` : ''
            return numName + obj + ','
        }
    },
    contract: {
        header: '#[near_bindgen]',
        derive: '#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]',
        struct: 'pub struct $name {$content}',
        initContent: (name: string, dataType: string) => {
            return `${name} ${dataType}, `
        }
    }
  */