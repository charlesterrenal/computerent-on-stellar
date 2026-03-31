# CompuTeRent on Stellar

**CompuTeRent** is a decentralized physical infrastructure (DePIN) solution developed for the Stellar network. It enables users with hardware constraints to lease high-performance compute resources from local home server environments using XLM payments. The project leverages Soroban smart contracts for trustless access control and session management.

## Concept
- **Problem**: A Computer Engineering student in Manila, working on a low-spec laptop, cannot complete intensive AI model training or high-fidelity CAD rendering locally, leading to project delays or the high cost of centralized cloud providers like AWS.
- **Solution**: CompuTeRent allows the student to lease idle compute power from a local home lab by sending a micropayment to a Soroban smart contract, which autonomously grants and expires access based on real-time on-chain timestamps, offering a low-latency and cost-effective alternative through Stellar’s minimal transaction fees.

## UI Screenshots
### Home Page ![Home Page](/frontend/public/screenshots/Home%20Page.png)
### Freighter Wallet Pop-up ![Freighter Wallet Pop-up](/frontend/public/screenshots/Freighter%20Wallet%20Pop-up.png)
### Dashboard Overview ![Dashboard Overview](/frontend/public/screenshots/Dashboard%20Overview.png)
### Lease Selection ![Lease Selection](/frontend/public/screenshots/Lease%20Selection.png)
### Lease Information ![Lease Information](/frontend/public/screenshots/Lease%20Information.png)
### Stellar Expert Link ![Stellar Expert Link](/frontend/public/screenshots/Stellar%20Explorer%20Link.png)
<https://stellar.expert/explorer/testnet/contract/CBTI36VAFHUN57IQU77CLQ7HNICYH5TGJXUSJMSQQBUMQ4DDKS4TWQMZ>
### Stellar Features Used 
* **Soroban Smart Contracts**: Manages the logic for `buy_access` and `verify_access`, ensuring trustless coordination between the renter and the provider. 
* **XLM Transfers**: Utilized for near-instant, low-cost micro-leases of compute time. 

### Target Users
* **Who**: Computer Engineering and IT students (low-to-middle income) who require high-performance hardware for academic or side projects.  
* **Where**: Philippines (specifically Metro Manila and surrounding university hubs like PUP). 
* **Why**: They care because centralized cloud services are priced in USD and require credit cards, whereas CompuTeRent offers local, pay-as-you-go access via Stellar. 

### Core Feature
* **Compute Lease Flow:** 
	1. **User Action**: The student connects their Freighter wallet to the Bento UI and clicks "Lease Compute" for 1 hour. 
	2. **On-Chain Action**: A Soroban contract call executes, transferring XLM to the provider and storing the user's address with a 3600-second expiry timestamp. 
	3. **Result**: The server verifies the on-chain status and opens a secure SSH or Web-VNC port for the user, allowing them to begin their compute-intensive task immediately.

## Repository Structure
This repository is organized as a monorepo to maintain both the blockchain logic and the web application interface.
```
computerent-on-stellar/
├── contracts/
│   └── hello-world/
│       ├── src/
│       │   ├── lib.rs          <-- Contract logic (buy/verify access)
│       │   └── test.rs         <-- Unit tests
│       └── Cargo.toml
├── ui/
│   ├── public/
│   ├── src/
│   │   ├── app/                <-- Next.js App Router
│   │   ├── components/         <-- UI Components
│   │   └── lib/                <-- Stellar SDK & Wallet logic
│   ├── Dockerfile              <-- Multi-stage production build
│   ├── next.config.ts
│   └── package.json
├── docker-compose.yml          <-- Local & Production orchestration
├── .gitignore                  <-- Monorepo-wide ignore rules
└── README.md
```

## Technical Stack
* **Blockchain**: Stellar (Soroban Smart Contracts)
* **Smart Contract Language**: Rust
* **Frontend**: Next.js 15, Tailwind CSS, TypeScript
* **Wallet Integration**: Freighter SDK
* **Infrastructure**: Self-hosted on Proxmox VE (Ubuntu VM)
* **Deployment**: Docker, Cloudflare Tunnels, Nginx Proxy Manager

## Deployment and Infrastructure
The project is currently self-hosted on my private home lab environment.

### Containerization
The frontend is containerized using a multi-stage **Dockerfile**. This approach separates the build environment from the runtime environment, significantly reducing the final image size and improving deployment speed on the Proxmox host.

### Networking and SSL
To comply with security requirements for Web3 wallet interactions, the application is served over **HTTPS via a Cloudflare Tunnel**. This architecture allows the home-hosted service to be accessible at `computerent.charlesterrenal.com` without requiring manual port forwarding or exposing the local network's public IP address. **Nginx Proxy Manager (NPM)** is utilized as a *reverse proxy* to manage the internal routing of subdomains.

## Development Setup
### Running the Frontend Locally
1. Navigate to the UI directory: `cd ui`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Smart Contract ID
CBTI36VAFHUN57IQU77CLQ7HNICYH5TGJXUSJMSQQBUMQ4DDKS4TWQMZ

### Building with Docker
From the root directory of the monorepo, execute:
`docker compose up -d --build`

### Smart Contract Interaction (CLI)
To manually invoke the contract for testing purposes (e.g., purchasing 3600 seconds of access):
```
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source <SOURCE_ACCOUNT> \
  --network testnet \
  -- buy_access --user <USER_ADDRESS> --duration 3600
```

## References and Resources
* [Stellar Docs](https://developers.stellar.org/)
* [armlynobinguar's Github Repository for Stellar-Bootcamp-2026](https://github.com/armlynobinguar/Stellar-Bootcamp-2026)
* [armlynobinguar's Notion Student Guide](https://reminiscent-catcher-409.notion.site/Student-Guide-32ecde917bb8800d9166e62d6111993c)
* [Freighter Wallet](https://www.freighter.app/)
* [Cloudflare Tunnels](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
* [Nginx Proxy Manager](https://nginxproxymanager.com/)

#### This project was built for the "Build on Stellar Bootcamp Philippines"