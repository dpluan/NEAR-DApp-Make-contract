use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::json_types::{U128, U64};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, near_bindgen, AccountId, Balance, Promise};

#[derive(Deserialize, Serialize)]
#[serde(crate = "near_sdk::serde")]
struct JsonContract {
    pub owner_id: AccountId,
    pub user_collateral: Vec<(String, u128)>,
    pub loan_amount: U128,
    pub deadline: U64,
    pub settlement_status: bool,
}

#[derive(BorshDeserialize, BorshSerialize)]
#[near_bindgen]
struct Contract {
    pub owner_id: AccountId,                               // Lender
    pub user_collateral: UnorderedMap<AccountId, Balance>, // Borrower with deposit
    pub loan_amount: u128,
    pub deadline: Option<u64>,
    pub settlement_status: bool,
}

#[derive(BorshDeserialize, BorshSerialize)]
pub enum StorageKey {
    UserBalanceKey,
}

impl Default for Contract {
    fn default() -> Self {
        env::panic(b"Contract should be initialized before usage")
    }
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new(owner_id: AccountId, deadline: Option<u64>) -> Self {
        Self {
            owner_id: owner_id,
            user_collateral: UnorderedMap::new(StorageKey::UserBalanceKey.try_to_vec().unwrap()),
            loan_amount: 0,
            deadline: deadline,
            settlement_status: false,
        }
    }

    fn paid_loan(&mut self) {
        let loan_amount = self.loan_amount;
        assert!(
            env::attached_deposit() >= loan_amount,
            "The attached deposit is lower than the loan amount"
        );
        Promise::new(self.owner_id.clone()).transfer(loan_amount);
    }

    fn return_deposit(&mut self) {
        if self.settlement_status {
            self.return_to_users()
        } else {
            self.return_to_owners()
        }
    }

    fn return_to_users(&mut self) {
        let user_balance = &self.user_collateral;
        for user in user_balance.keys() {
            Promise::new(user.clone()).transfer(user_balance.get(&user).unwrap());
        }

        self.user_collateral = UnorderedMap::new(StorageKey::UserBalanceKey.try_to_vec().unwrap());
    }

    fn return_to_owners(&mut self) {
        let user_balance = &self.user_collateral;
        let mut return_balance = 0;
        for user in user_balance.keys() {
            return_balance += user_balance.get(&user).unwrap();
        }

        Promise::new(self.owner_id.clone()).transfer(return_balance);
        self.user_collateral = UnorderedMap::new(StorageKey::UserBalanceKey.try_to_vec().unwrap());
    }

//{$functions}
}
