#![cfg(test)]
use super::*;
// Add 'Ledger' to the imports below:
use soroban_sdk::{testutils::{Address as _, Ledger}, Env}; 

#[test]
fn test_buy_access_success() {
    let env = Env::default();
    // Updated 'register_contract' to 'register' to remove warnings
    let contract_id = env.register(CompuTeRentContract, ());
    let client = CompuTeRentContractClient::new(&env, &contract_id);

    let user = Address::generate(&env);
    env.mock_all_auths();

    client.buy_access(&user, &3600);
    assert!(client.verify_access(&user));
}

#[test]
fn test_verify_access_after_expiry() {
    let env = Env::default();
    let contract_id = env.register(CompuTeRentContract, ());
    let client = CompuTeRentContractClient::new(&env, &contract_id);

    let user = Address::generate(&env);
    env.mock_all_auths();

    client.buy_access(&user, &10);
    
    // This will now work because 'use soroban_sdk::testutils::Ledger' is at the top
    env.ledger().with_mut(|li| li.timestamp += 11);

    assert_eq!(client.verify_access(&user), false);
}

#[test]
fn test_get_time_left() {
    let env = Env::default();
    let contract_id = env.register(CompuTeRentContract, ());
    let client = CompuTeRentContractClient::new(&env, &contract_id);

    let user = Address::generate(&env);
    env.mock_all_auths();

    client.buy_access(&user, &500);
    assert_eq!(client.get_time_left(&user), 500);
}