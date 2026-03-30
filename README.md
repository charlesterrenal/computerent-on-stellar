# CompuTeRent on Stellar

**CompuTeRent** is a decentralized physical infrastructure (DePIN) solution built for the Stellar Smart Contract Bootcamp. It allows students and developers with limited hardware to rent high-performance compute time from local home servers using XLM micropayments.

## How it Works
The project uses a Soroban smart contract to manage access control. 
1. **Purchase:** A user sends a transaction to the contract specifying a duration.
2. **On-Chain Record:** The contract stores the user's wallet address and their session expiry timestamp.
3. **Provider Verification:** Any compute provider (a cloud host or a home lab) runs a lightweight listener. When a user attempts to connect, the provider queries the `verify_access` function on the Stellar blockchain. If the contract returns `true`, the session is authorized.

## Project Structure
- `contracts/hello-world`: The core Soroban smart contract logic.
- `src/lib.rs`: Contains the `buy_access` and `verify_access` functions.
- `src/test.rs`: Unit tests to ensure logic integrity.

## Tech Stack
- **Language:** Rust
- **Platform:** Soroban (Stellar Smart Contracts)
- **Identity:** Managed via Stellar CLI

## Interaction Guide
Since there is no Web UI yet, users interact with the contract using the **Stellar CLI**.

### 1. Purchase Compute Access
To buy 1 hour (3600 seconds) of compute time:
```bash
stellar contract invoke \
  --id <YOUR_CONTRACT_ID> \
  --source my-key \
  --network testnet \
  -- buy_access --user <YOUR_PUBLIC_ADDRESS> --duration 3600