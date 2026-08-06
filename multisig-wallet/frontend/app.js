const loadingOverlay = document.getElementById("loadingOverlay");
const loadingText = document.getElementById("loadingText");

function showLoading(message) {
    loadingText.textContent = message || "İşleniyor...";
    loadingOverlay.classList.remove("hidden");
}

function hideLoading() {
    loadingOverlay.classList.add("hidden");
}
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
        await loadTransactions();
    
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

        document.getElementById("contractAddressDisplay").textContent = CONTRACT_ADDRESS;
        document.getElementById("balanceDisplay").textContent = ethers.formatEther(balance)+" ETH";
        document.getElementById("requireDisplay").textContent = required.toString();
        
        const ownersList = document.getElementById("ownersList");
        ownersList.innerHTML = "";
        owners.forEach((ownerAddress)=>{
            const li = document.createElement("li");
            li.textContent = ownerAddress;
            ownersList.appendChild(li);
        });

    }   catch(err){
        console.error("bilgi yüklenirken hata:",err);
    }
}

const submitTxForm = document.getElementById("submitTxForm");

submitTxForm.addEventListener("submit", async (event) =>{
    event.preventDefault();

    const toAddress = document.getElementById("txToAddress").value;
    const valueInEth = document.getElementById("txValue").value;

    try{
        showLoading("İşlem gönderiliyor...");
        const valueInWei = ethers.parseEther(valueInEth);
        const tx = await contract.submitTransaction(toAddress, valueInWei, "0x");
        console.log("işlem gönderildi, onay bekleniyor",tx.hash);

        await tx.wait();
        hideLoading();
        console.log("işlem onaylandı (blockcahine yazıldı)");

        alert("işlem başarıyla oluşturuldu!");
        submitTxForm.reset();

        await loadWalletInfo();
        await loadTransactions();
    } catch(err){
        hideLoading();
        console.error("işlem oluşturulurken hata:", err);
        alert("işlem oluşturulamadı: "+err.message);
    }
});

async function loadTransactions() {
    try {
        const txCount = await contract.getTransactionCount();
        const transactionsList = document.getElementById("transactionsList");
        transactionsList.innerHTML = "";

        for (let i = 0; i < txCount; i++) {
            const tx = await contract.getTransaction(i);
            const to = tx[0];
            const value = tx[1];
            const executed = tx[3];
            const numConfirmations = tx[4];

            const isConfirmedByMe = await contract.isConfirmed(i, userAddress);

            const div = document.createElement("div");
            div.style.border = "1px solid #ccc";
            div.style.padding = "10px";
            div.style.marginBottom = "10px";

            div.innerHTML = `
                <p><strong>İşlem #${i}</strong></p>
                <p>Alıcı: ${to}</p>
                <p>Miktar: ${ethers.formatEther(value)} ETH</p>
                <p>Onay: ${numConfirmations.toString()} / ${await contract.numConfirmationRequired()}</p>
                <p>Durum: ${executed ? "Çalıştırıldı ✅" : "Bekliyor ⏳"}</p>
            `;

            if (!executed) {
                if (!isConfirmedByMe) {
                    const confirmBtn = document.createElement("button");
                    confirmBtn.textContent = "Confirm";
                    confirmBtn.className = "confirm-btn"
                    confirmBtn.addEventListener("click", () => confirmTransaction(i));
                    div.appendChild(confirmBtn);
                } else{
                    const revokeBtn = document.createElement("button");
                    revokeBtn.textContent = "Revoke";
                    revokeBtn.className = "revoke-btn"
                    revokeBtn.addEventListener("click",() => revokeConfirmation(i));
                    div.appendChild(revokeBtn);
                }

                const executeBtn = document.createElement("button");
                executeBtn.textContent = "Execute";
                executeBtn.className = "execute-btn"
                executeBtn.addEventListener("click", () => executeTransaction(i));
                div.appendChild(executeBtn);
            }

            transactionsList.appendChild(div);
        }
    } catch (err) {
        console.error("İşlemler yüklenirken hata:", err);
    }
}

async function confirmTransaction(txIndex) {
    try {
        showLoading("Onaylanıyor...");
        const tx = await contract.confirmTransaction(txIndex);
        await tx.wait();
        alert("İşlem onaylandı!");
        await loadTransactions();
    } catch (err) {
        hideLoading();
        console.error("Onaylama hatası:", err);
        alert("Onaylama başarısız: " + err.message);
    }
}

async function revokeConfirmation(txIndex){
    try {
        showLoading("Onay geri çekiliyor...");
        const tx = await contract.revokeConfirmation(txIndex);
        await tx.wait();
        alert("Onay geri çekildi!");
        await loadTransactions();
    } catch(err){
        hideLoading();
        console.error("geri çekilme hatası:", err);
        alert("geri çekme başarısız: " + err.message);
    }
}

async function executeTransaction(txIndex) {
    try {
        showLoading("İşlem çalıştırılıyor...");
        const tx = await contract.executeTransaction(txIndex);
        await tx.wait();
        alert("İşlem çalıştırıldı!");
        await loadTransactions();
        await loadWalletInfo();
    } catch (err) {
        hideLoading();
        console.error("Çalıştırma hatası:", err);
        alert("Çalıştırma başarısız: " + err.message);
    }
}

const depositForm = document.getElementById("depositForm");

depositForm.addEventListener("submit",async (event)=>{
    event.preventDefault();

    const valueInEth = document.getElementById("depositValue").value;

    try{
        showLoading("ETH yatırılıyor...");
        const valueInWei = ethers.parseEther(valueInEth);

        const tx = await signer.sendTransaction({
            to: CONTRACT_ADDRESS,
            value : valueInWei
        });
        console.log("deposit gönderildi, onay ebkleniyor:",tx.hash);
        await tx.wait();
        hideLoading();
        console.log("deposit onaylandı");
        alert("ETH başarıyla yatırıldı!");
        depositForm.reset();

        await loadWalletInfo();
    }catch(err){
        console.error("deposit hatası:",err);
        alert("yatırma başarısız"+err.message);
    }
});

if (typeof window.ethereum !== "undefined") {
    window.ethereum.on("accountsChanged", async (accounts) => {
        console.log("Hesap değişti:", accounts);

        if (accounts.length === 0) {
            accountDisplay.textContent = "Bağlantı kesildi.";
            contract = undefined;
        } else {
            await connectWallet();
        }
    });

    window.ethereum.on("chainChanged", () => {
        window.location.reload();
    });
}