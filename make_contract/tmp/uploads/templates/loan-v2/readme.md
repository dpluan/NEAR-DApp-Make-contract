Setup

Marketplace contract: nft-market.ast3ros.testnet
Contract deploy address: dev-1655202849342-40981836249918
User 1 and owner of contract: ast3ros.testnet
User 2 borrow from user 1: ast3ros2.testnet

Deploy:

- near deploy --wasmFile out/loan-v2.wasm --accountId dev-1655202849342-40981836249918

Initiate: Deadline in Unix time: Nanoseconds - predecessor accounnt_id should be marketplace contract

- near call dev-1655202849342-40981836249918 new '{"owner_id":"ast3ros.testnet", "deadline": 1655181440000000000}' --accountId nft-market.ast3ros.testnet

Check contract state:

- near view dev-1655202849342-40981836249918 get_contract_info

Update deadline: only owner can update deadline

- near call dev-1655202849342-40981836249918 update_deadline '{"new_deadline": 1655253655000000000}' --accountId ast3ros.testnet

User 1: owner send loan amount to the contract

- near call dev-1655202849342-40981836249918 deposit_loan --accountId ast3ros.testnet --deposit 5

User 1 Add User 2: add other people to use the contract

- near call dev-1655202849342-40981836249918 add_user '{"user": "ast3ros2.testnet"}' --accountId ast3ros.testnet

User 2 deposit collateral amount: if they cannot pay on time, they lose the deposit

- near call dev-1655202849342-40981836249918 deposit_collateral --accountId ast3ros2.testnet --deposit 2

Borrowing: User 2 borrow the loan amount

- near call dev-1655202849342-40981836249918 borrowing --accountId ast3ros2.testnet

Settlement:
User 2 call: User 2 pay the loan amount, if they pay after deadline, the deposit will go to owner, the loan is repaid

- near call dev-1655202849342-40981836249918 settlement --accountId ast3ros2.testnet --deposit 5

User 1 call: After deadline no pay from user 2, user 1 claim the deposit:

- near call dev-1655202849342-40981836249918 settlement --accountId ast3ros.testnet
