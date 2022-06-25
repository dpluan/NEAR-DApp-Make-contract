export default {
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
}