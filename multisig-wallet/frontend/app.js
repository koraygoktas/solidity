const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const CONTRACT_ABI = [
    {
      "inputs": [
        { "internalType": "address[]", "name": "_owners", "type": "address[]" },
        { "internalType": "uint256", "name": "_numconfirmationRequired", "type": "uint256" }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "txIndes", "type": "uint256" }], "name": "ConfirmTransaction", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "balanca", "type": "uint256" }], "name": "Deposit", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "txIndes", "type": "uint256" }], "name": "ExecuteTransaction", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "txIndes", "type": "uint256" }], "name": "RevokeConfirmation", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "txIndex", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }, { "indexed": false, "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "SubmitTransaction", "type": "event" },
    { "inputs": [{ "internalType": "uint256", "name": "_txIndex", "type": "uint256" }], "name": "confirmTransaction", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "_txIndex", "type": "uint256" }], "name": "executeTransaction", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "name": "getOwners", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "_txIndex", "type": "uint256" }], "name": "getTransaction", "outputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }, { "internalType": "bool", "name": "executed", "type": "bool" }, { "internalType": "uint256", "name": "numConfirmations", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "getTransactionCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "address", "name": "", "type": "address" }], "name": "isConfirmed", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "isOwner", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "numConfirmationRequired", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "owners", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "_txIndex", "type": "uint256" }], "name": "revokeConfirmation", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "_to", "type": "address" }, { "internalType": "uint256", "name": "_value", "type": "uint256" }, { "internalType": "bytes", "name": "_data", "type": "bytes" }], "name": "submitTransaction", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "transactions", "outputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }, { "internalType": "bool", "name": "executed", "type": "bool" }, { "internalType": "uint256", "name": "numConfirmations", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "stateMutability": "payable", "type": "receive" }
];

let contract;

let provider;
let signer;
let userAddress;

const connectBtn = document.getElementById("connectBtn");
const accountDisplay = document.getElementById("accountDisplay");

connectBtn.addEventListener("click", connectWallet);

async function connectWallet() {
    if (typeof window.ethereum === "undefined") {
        alert("MetaMask bulunamadı! Lütfen MetaMask eklentisini yükleyin.");
        return;
    }

    try {
        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = await provider.getSigner();
        userAddress = await signer.getAddress();

        contract = new ethers.Contract(CONTRACT_ADDRESS,CONTRACT_ABI, signer);
        console.log("kontrat bağlandı:",CONTRACT_ADDRESS);
        await loadWalletInfo();
    
        accountDisplay.textContent = "Bağlı hesap: " + userAddress;
        console.log("Bağlandı:", userAddress);
    } catch (err) {
        console.error("Bağlantı hatası:", err);
        alert("Bağlantı başarısız oldu.");
    }
}

async function loadWalletInfo(){
    try{
        const owners = await contract.getOwners();
        const required = await contract.numConfirmationRequired();
        const balance = await provider.getBalance(CONTRACT_ADDRESS);

        console.log("Owners:",owners);
        console.log("Gereken onay sayısı:",required);
        console.log("Kontrat bakiyesi:",ethers.formatEther(balance),"ETH");
    }   catch(err){
        console.error("bilgi yüklenirken hata:",err);
    }
}