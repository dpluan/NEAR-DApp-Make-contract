pub use crate::*;

//{$entities}

//{$impl_entities}

#[derive(BorshDeserialize, BorshSerialize, Default)]
pub struct OldCounter {
    pub value: u8,
    pub new_value: u8
}

#[derive(BorshSerialize, BorshDeserialize, Default, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct AccountV1 {
    pub vote: u8,
    pub balance: u8
}

#[derive(BorshSerialize, BorshDeserialize, Default, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct AccountV2 {
    pub vote: u8,
    pub balance: u8,
    pub bio: String
}

#[derive(BorshSerialize, BorshDeserialize, Default, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Account {
    pub vote: u8,
    pub balance: u8,
    pub bio: String,
    pub last_change: BlockHeight
}

#[derive(BorshSerialize, BorshDeserialize)]
pub enum VersionedAccount {
    V1(AccountV1),
    V2(AccountV2),
    Current(Account)
}

