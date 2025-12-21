// ⚠️ CONTRACT ADDRESS'İ DEPLOY SONRASI BURAYA YAZ!
const contractAddress = "0x7b935AD287f7EA73Aa0Be87499E8BDDf76B34fC6";

// Contract ABI
const contractABI = [
    "function mint(address to, string memory uri) public returns (uint256)",
    "function transferNFT(address to, uint256 tokenId) public",
    "function tokensOfOwner(address owner) public view returns (uint256[] memory)",
    "function totalSupply() public view returns (uint256)",
    "function balanceOf(address owner) public view returns (uint256)",
    "function ownerOf(uint256 tokenId) public view returns (address)",
    "function tokenURI(uint256 tokenId) public view returns (string memory)",
    "event NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI)",
    "event NFTTransferred(address indexed from, address indexed to, uint256 indexed tokenId)"
];

let provider;
let signer;
let contract;
let userAddress;

// Connect Wallet
document.getElementById('connectBtn').addEventListener('click', async function() {
    try {
        if (typeof window.ethereum === 'undefined') {
            showStatus('Please install MetaMask!', 'error');
            return;
        }

        await window.ethereum.request({ method: 'eth_requestAccounts' });
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        userAddress = await signer.getAddress();
        
        contract = new ethers.Contract(contractAddress, contractABI, signer);

        document.getElementById('connectBtn').style.display = 'none';
        document.getElementById('accountInfo').classList.remove('hidden');
        document.getElementById('account').textContent = 
            userAddress.slice(0, 6) + '...' + userAddress.slice(-4);
        
        document.getElementById('contractAddress').textContent = contractAddress;
        
        await updateInfo();
        showStatus('Wallet connected!', 'success');
        
        // Network değişikliğini dinle
        window.ethereum.on('chainChanged', function() {
            window.location.reload();
        });
        window.ethereum.on('accountsChanged', function() {
            window.location.reload();
        });
        
    } catch (error) {
        console.error(error);
        showStatus('Error connecting wallet: ' + error.message, 'error');
    }
});

// Mint NFT
document.getElementById('mintBtn').addEventListener('click', async function() {
    try {
        const address = document.getElementById('mintAddress').value;
        const uri = document.getElementById('tokenURI').value;

        if (!address || !uri) {
            showStatus('Please fill all fields', 'error');
            return;
        }

        if (!ethers.utils.isAddress(address)) {
            showStatus('Invalid address', 'error');
            return;
        }

        showStatus('Minting NFT...', 'info');
        
        const tx = await contract.mint(address, uri, {
            gasLimit: 300000,
            gasPrice: ethers.utils.parseUnits('1', 'gwei')
        });
        showStatus('Transaction sent! Waiting for confirmation...', 'info');
        
        const receipt = await tx.wait();
        
        // Get minted token ID from event
        const event = receipt.events.find(function(e) {
            return e.event === 'NFTMinted';
        });
        const tokenId = event.args.tokenId.toString();
        
        showStatus('NFT minted successfully! Token ID: ' + tokenId, 'success');
        
        document.getElementById('mintAddress').value = '';
        document.getElementById('tokenURI').value = '';
        
        await updateInfo();
        
    } catch (error) {
        console.error(error);
        showStatus('Error minting NFT: ' + error.message, 'error');
    }
});

// Transfer NFT
document.getElementById('transferBtn').addEventListener('click', async function() {
    try {
        const tokenId = document.getElementById('transferTokenId').value;
        const address = document.getElementById('transferAddress').value;

        if (!tokenId || !address) {
            showStatus('Please fill all fields', 'error');
            return;
        }

        if (!ethers.utils.isAddress(address)) {
            showStatus('Invalid address', 'error');
            return;
        }

        showStatus('Transferring NFT...', 'info');
        
        const tx = await contract.transferNFT(address, tokenId, {
            gasLimit: 100000,
            gasPrice: ethers.utils.parseUnits('1', 'gwei')
        });
        showStatus('Transaction sent! Waiting for confirmation...', 'info');
        
        await tx.wait();
        
        showStatus('NFT #' + tokenId + ' transferred successfully!', 'success');
        
        document.getElementById('transferTokenId').value = '';
        document.getElementById('transferAddress').value = '';
        
        await updateInfo();
        
    } catch (error) {
        console.error(error);
        showStatus('Error transferring NFT: ' + error.message, 'error');
    }
});

// Load My NFTs
document.getElementById('loadNFTsBtn').addEventListener('click', async function() {
    try {
        showStatus('Loading your NFTs...', 'info');
        
        const tokens = await contract.tokensOfOwner(userAddress);
        const nftList = document.getElementById('nftList');
        nftList.innerHTML = '';

        if (tokens.length === 0) {
            nftList.innerHTML = '<p>You don\'t own any NFTs yet.</p>';
            showStatus('No NFTs found', 'info');
            return;
        }

        for (let i = 0; i < tokens.length; i++) {
            const tokenId = tokens[i].toString();
            const uri = await contract.tokenURI(tokenId);
            
            const nftCard = document.createElement('div');
            nftCard.className = 'nft-card';
            nftCard.innerHTML = 
                '<h3>NFT #' + tokenId + '</h3>' +
                '<p><strong>Token ID:</strong> ' + tokenId + '</p>' +
                '<p><strong>URI:</strong> ' + uri + '</p>';
            
            nftList.appendChild(nftCard);
        }

        showStatus('Loaded ' + tokens.length + ' NFTs', 'success');
        
    } catch (error) {
        console.error(error);
        showStatus('Error loading NFTs: ' + error.message, 'error');
    }
});

// Refresh Info
document.getElementById('refreshBtn').addEventListener('click', updateInfo);

// Update Info
async function updateInfo() {
    try {
        const balance = await contract.balanceOf(userAddress);
        const totalSupply = await contract.totalSupply();
        
        document.getElementById('nftBalance').textContent = balance.toString();
        document.getElementById('totalSupply').textContent = totalSupply.toString();
        
    } catch (error) {
        console.error(error);
    }
}

// Show Status
function showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = 'status ' + type;
    statusDiv.classList.remove('hidden');
    
    setTimeout(function() {
        statusDiv.classList.add('hidden');
    }, 5000);
}