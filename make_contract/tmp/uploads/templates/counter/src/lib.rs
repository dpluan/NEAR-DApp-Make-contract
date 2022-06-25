// Counter smart contract workshop
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::LookupMap;
use near_sdk::serde::{Serialize, Deserialize};
use near_sdk::{near_bindgen, AccountId, env, BorshStorageKey, PanicOnDefault, BlockHeight};

pub use crate::macro_fns::*;

pub use crate::entities::*;

pub use crate::operations::*;

#[macro_use]
mod macro_fns;

mod entities;

mod operations;

//{$contract}


#[near_bindgen]
impl {$contract_name} {

    //{$functions}

}