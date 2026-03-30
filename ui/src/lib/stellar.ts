import { isConnected, getAddress, signTransaction, setAllowed } from "@stellar/freighter-api";
import { 
  Account,
  TransactionBuilder, 
  Networks, 
  rpc, 
  nativeToScVal, 
  scValToNative,
  Contract,
  Address
} from "@stellar/stellar-sdk";

const CONTRACT_ID = "CBTI36VAFHUN57IQU77CLQ7HNICYH5TGJXUSJMSQQBUMQ4DDKS4TWQMZ"; 
const RPC_URL = "https://soroban-testnet.stellar.org";
const networkPassphrase = Networks.TESTNET;
const server = new rpc.Server(RPC_URL);

export const connectWallet = async () => {
  const connection = await isConnected();
  
  if (connection && connection.isConnected) {
    try {
      const { isAllowed } = await setAllowed();
      if (isAllowed) {
        const addressObj = await getAddress();
        if (addressObj.address) return addressObj.address;
      }
    } catch (e) {
      console.error("Freighter Connection Error:", e);
    }
  }

  alert("Freighter is not detected or locked. Please unlock it and ensure you are on Test Net.");
  return null;
};

export async function buyAccess(userAddress: string, duration: number) {
  const account = await server.getAccount(userAddress);
  const contract = new Contract(CONTRACT_ID);

const tx = new TransactionBuilder(account, { 
  fee: "1000", 
  networkPassphrase: Networks.TESTNET
})
    .addOperation(
      contract.call(
        "buy_access",
        nativeToScVal(Address.fromString(userAddress)),
        nativeToScVal(duration, { type: "u64" })
      )
    )
    .setTimeout(30)
    .build();

  const preparedTx = await server.prepareTransaction(tx);
  
  const { signedTxXdr } = await signTransaction(preparedTx.toXDR(), { 
    networkPassphrase
  });
  
  const sendResponse = await server.sendTransaction(
    TransactionBuilder.fromXDR(signedTxXdr, networkPassphrase)
  );

  return sendResponse;
}

export async function getTimeLeft(userAddress: string) {
  try {
    const contract = new Contract(CONTRACT_ID);
    
    const tx = new TransactionBuilder(
      new Account(userAddress, "0"), 
      { fee: "100", networkPassphrase }
    )
      .addOperation(
        contract.call("get_time_left", nativeToScVal(Address.fromString(userAddress)))
      )
      .setTimeout(30)
      .build();

    const simulation = await server.simulateTransaction(tx);
    
    if (rpc.Api.isSimulationSuccess(simulation) && simulation.result) {
      return Number(scValToNative(simulation.result.retval));
    }
  } catch (err) {
    console.error("Error fetching time left:", err);
  }
  return 0;
}