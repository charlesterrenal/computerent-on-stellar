#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, symbol_short};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Access(Address),
}

#[contract]
pub struct CompuTeRentContract;

#[contractimpl]
impl CompuTeRentContract {
    pub fn buy_access(env: Env, user: Address, duration: u64) {
        user.require_auth();
        let expiry = env.ledger().timestamp() + duration;
        env.storage().persistent().set(&DataKey::Access(user.clone()), &expiry);
        env.events().publish((symbol_short!("access"), user), expiry);
    }

    pub fn verify_access(env: Env, user: Address) -> bool {
        let expiry: u64 = env.storage().persistent().get(&DataKey::Access(user)).unwrap_or(0);
        env.ledger().timestamp() < expiry
    }

    pub fn get_time_left(env: Env, user: Address) -> u64 {
        let expiry: u64 = env.storage().persistent().get(&DataKey::Access(user)).unwrap_or(0);
        let now = env.ledger().timestamp();
        if now >= expiry { 0 } else { expiry - now }
    }
}

#[cfg(test)]
mod test;