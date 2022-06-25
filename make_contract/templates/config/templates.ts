export const fns = {
    counter: {
        impl_fns: {
            impl_from_for_account: 'impl From<VersionedAccount> for Account {\n'
                + 'fn from(account: VersionedAccount) -> Self {\n'
                + 'match account {\n'
                + 'VersionedAccount::Current(account) => account,\n'
                + 'VersionedAccount::V1(v1) => Account {\n'
                + 'vote: v1.vote,\n'
                + 'balance: v1.balance,\n'
                + 'bio: String::from("migrate bio"),\n'
                + 'last_change: 0\n'
                + '},\n'
                + 'VersionedAccount::V2(v2) => Account {\n'
                + 'vote: v2.vote,\n'
                + 'balance: v2.balance,\n'
                + 'bio: v2.bio,\n'
                + 'last_change: 0\n'
                + '}\n'
                + '}\n'
                + '}\n'
                + '}\n',


            impl_from_for_version_account: 'impl From<Account> for VersionedAccount {\n'
                + 'fn from(account: Account) -> Self {\n'
                + 'VersionedAccount::Current(account)\n'
                + '}\n'
                + '}\n',
        },
        contract_fns: {
            init: '#[init]\n'
                + 'pub fn new() -> Self {\n'
                + '{$contract_name} { \n'
                + 'value: 0,\n'
                + 'new_value: 0,\n'
                + 'accounts: LookupMap::new(StorageKey::AccountKey)\n'
                + '}\n'
                + '}\n',

            get_num: 'pub fn get_num(&self) -> u8 {'
                + 'self.value'
                + '}',

            get_new_num: 'pub fn get_new_num(&self) -> u8 {'
                + 'self.new_value'
                + '}',

            set_num: '#[payable]'
                + 'pub fn set_num(&mut self, new_value: u8) {'
                + 'self.value = new_value;'
                + '}',

            increment: 'pub fn increment(&mut self) {'
                + 'self.value += 1;'
                + '}',

            get_account: 'pub fn get_account(&self, account_id: AccountId) -> Account {'
                + 'let v_account = self.accounts.get(&account_id).unwrap();'

                + 'Account::from(v_account)'
                + '}',

            add_account: 'pub fn add_account(&mut self) {'
                + 'let v_account = self.accounts.get(&env::predecessor_account_id());'

                + 'if v_account.is_none() {'
                + 'let account = Account::default();'
                + 'let v_account = VersionedAccount::from(account);'
                + 'self.accounts.insert(&env::predecessor_account_id(), &v_account);'
                + '}'
                + '}',
        }
    },
    loan: {
        init: {
            struct: '#[init]\n'
                + 'pub fn new(owner_id: AccountId, deadline: Option<u64>) -> Self {\n'
                + 'Self {\n'
                + ' owner_id: owner_id,\n'
                + 'user_collateral: UnorderedMap::new(StorageKey::UserBalanceKey.try_to_vec().unwrap()),\n'
                + 'loan_amount: 0,\n'
                + 'deadline: deadline,\n'
                + 'settlement_status: false,\n'
                + '}\n'
                + '}\n',
        },
        functions: {

            update_deadline: 'pub fn update_deadline(&mut self, new_deadline: u64) {\n'
                + 'assert_eq!(\n'
                + 'self.owner_id,\n'
                + 'env::predecessor_account_id(),\n'
                + '"Only owner can update deadline"\n'
                + ');\n'

                + 'self.deadline = Some(new_deadline);\n'
                + '}\n',

            deposit_loan: '#[payable]\n'
                + 'pub fn deposit_loan(&mut self) {\n'
                + 'assert_eq!(\n'
                + 'self.owner_id,\n'
                + 'env::predecessor_account_id(),\n'
                + '"Only owner can loan to other"\n'
                + ');\n'
                + 'self.loan_amount += env::attached_deposit();\n'
                + '}\n',

            add_user: 'pub fn add_user(&mut self, user: AccountId) {\n'
                + 'assert_eq!(\n'
                + 'self.owner_id,\n'
                + 'env::predecessor_account_id(),\n'
                + '"Only owner can add other users"\n'
                + ');\n'
                + 'self.user_collateral.insert(&user, &0);\n'
                + ' }\n',

            deposit_collateral: '#[payable]\n'
                + 'pub fn deposit_collateral(&mut self) {\n'
                + 'let balance = env::attached_deposit();\n'
                + 'let user = env::predecessor_account_id();\n'
                + 'assert!(\n'
                + 'self.user_collateral.insert(&user, &balance).is_some(),\n'
                + '"Users need to be added by owner"\n'
                + ');\n'
                + '}\n',

            borrowing: ' #[payable]\n'
                + 'pub fn borrowing(&mut self) {\n'
                + 'assert!(self.loan_amount > 0, "There is no fund available to borrow");\n'
                + 'assert!(\n'
                + 'env::block_timestamp() <= self.deadline.unwrap(),\n'
                + '"Pass the deadline, cannot borrowing"\n'
                + ' );\n'
                + 'assert!(\n'
                + ' self.user_collateral\n'
                + ' .get(&env::predecessor_account_id())\n'
                + '.unwrap_or(0)\n'
                + '> 0,\n'
                + '"User need to deposit collateral first"\n'
                + ');\n'

                + 'let borrower = env::predecessor_account_id();\n'
                + 'let users = self.user_collateral.keys_as_vector();\n'
                + 'assert!(\n'
                + 'users.iter().any(|user| user == borrower),\n'
                + '"Borrower is not in the user list"\n'
                + ' );\n'
                + 'Promise::new(borrower).transfer(self.loan_amount);\n'
                + '}\n',

            settlement: '#[payable]\n'
                + 'pub fn settlement(&mut self) {\n'
                + 'if env::block_timestamp() <= self.deadline.unwrap() {\n'
                + 'self.paid_loan();\n'
                + 'self.settlement_status = true;\n'
                + '} else {\n'
                + 'if env::predecessor_account_id() != self.owner_id {\n'
                + 'self.paid_loan();\n'
                + '}\n'
                + 'self.settlement_status = false;\n'
                + '}\n'
                + 'self.return_deposit()\n'
                + '}\n',

            // View methods
            get_block_timestamp: 'pub fn get_block_timestamp(&self) -> u64 {\n'
                + ' let time = env::block_timestamp();\n'
                + ' time\n'
                + '}\n',

            get_contract_info: 'pub fn get_contract_info(&self) -> JsonContract {\n'
                + 'JsonContract {\n'
                + 'owner_id: self.owner_id.clone(),\n'
                + 'user_collateral: self.user_collateral.to_vec(),\n'
                + 'loan_amount: U128(self.loan_amount),\n'
                + 'deadline: U64(self.deadline.unwrap_or(0)),\n'
                + 'settlement_status: self.settlement_status,\n'
                + ' }\n'
                + '}\n'
        }
    }
}