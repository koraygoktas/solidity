// Contract Addresses
const SWAP_ADDRESS = "0xfb8A0B3e7b55Fe84C55A2731Dcb22008e55D8be3";
const TOKEN_ADDRESS = "0xf468c54C926b216a279362e09E966e958b9f8981";

// ABIs
const SWAP_ABI = [
    "function reserveETH() view returns (uint256)",
    "function reserveToken() view returns (uint256)",
    "function liquidityShares(address) view returns (uint256)",
    "function totalLiquidityShares() view returns (uint256)",
    "function getPrice() view returns (uint256)",
    "function getUserLiquidity(address) view returns (uint256, uint256, uint256)",
    "function addLiquidity(uint256) payable returns (uint256)",
    "function removeLiquidity(uint256) returns (uint256, uint256)",
    "function swapETHForToken(uint256) payable returns (uint256)",
    "function swapTokenForETH(uint256, uint256) returns (uint256)",
    "function getAmountOut(uint256, uint256, uint256) pure returns (uint256)",
    "event Swap(address indexed user, string swapType, uint256 inputAmount, uint256 outputAmount)",
    "event LiquidityAdded(address indexed provider, uint256 ethAmount, uint256 tokenAmount, uint256 shares)",
    "event LiquidityRemoved(address indexed provider, uint256 ethAmount, uint256 tokenAmount, uint256 shares)"
];

const TOKEN_ABI = [
    "function balanceOf(address) view returns (uint256)",
    "function approve(address, uint256) returns (bool)",
    "function allowance(address, address) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function name() view returns (string)"
];

// Global variables
let provider;
let signer;
let swapContract;
let tokenContract;
let userAddress;

// Initialize
document.addEventListener('DOMContentLoaded', init);

function init() {
    setupEventListeners();
    //checkWalletConnection();
}

// Event Listeners
function setupEventListeners() {
    // Connect Wallet
    document.getElementById('connectBtn').addEventListener('click', connectWallet);
    
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // Swap
    document.getElementById('swapInput').addEventListener('input', calculateSwapOutput);
    document.querySelectorAll('input[name="swapDirection"]').forEach(radio => {
        radio.addEventListener('change', handleSwapDirectionChange);
    });
    document.getElementById('swapBtn').addEventListener('click', executeSwap);
    document.getElementById('maxBtn').addEventListener('click', setMaxSwapAmount);
    
    // Liquidity
    document.getElementById('addEthAmount').addEventListener('input', calculateTokenAmount);
    document.getElementById('addLiquidityBtn').addEventListener('click', addLiquidity);
    document.getElementById('removeShares').addEventListener('input', calculateRemovePreview);
    document.getElementById('removeLiquidityBtn').addEventListener('click', removeLiquidity);
    document.getElementById('maxSharesBtn').addEventListener('click', setMaxShares);
}

// Check if wallet is already connected

/*async function checkWalletConnection() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                await connectWallet();
            }
        } catch (error) {
            console.error('Error checking wallet:', error);
        }
    }
}
*/
// Connect Wallet
async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask!');
        return;
    }

    try {
        showLoading('Connecting wallet...');
        
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        userAddress = await signer.getAddress();
        
        // Check network
        const network = await provider.getNetwork();
        if (network.chainId !== 11155111) {
            alert('Please switch to Sepolia Testnet!');
            return;
        }
        
        // Initialize contracts
        swapContract = new ethers.Contract(SWAP_ADDRESS, SWAP_ABI, signer);
        tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
        
        // Update UI
        updateWalletUI();
        await updatePoolStats();
        enableButtons();
        
        // Listen to account changes
        window.ethereum.on('accountsChanged', handleAccountChange);
        window.ethereum.on('chainChanged', () => window.location.reload());
        
        hideLoading();
        
    } catch (error) {
        console.error('Connection error:', error);
        showError('Failed to connect wallet: ' + error.message);
    }
}

function handleAccountChange(accounts) {
    if (accounts.length === 0) {
        window.location.reload();
    } else {
        connectWallet();
    }
}

// Update Wallet UI
async function updateWalletUI() {
    const balance = await provider.getBalance(userAddress);
    const tokenBalance = await tokenContract.balanceOf(userAddress);
    
    document.getElementById('connectBtn').classList.add('hidden');
    document.getElementById('walletInfo').classList.remove('hidden');
    document.getElementById('walletAddress').textContent = 
        userAddress.slice(0, 6) + '...' + userAddress.slice(-4);
    document.getElementById('walletBalance').textContent = 
        parseFloat(ethers.utils.formatEther(balance)).toFixed(4) + ' ETH';
}

// Update Pool Stats
async function updatePoolStats() {
    try {
        const reserveETH = await swapContract.reserveETH();
        const reserveToken = await swapContract.reserveToken();
        const price = await swapContract.getPrice();
        const userShares = await swapContract.liquidityShares(userAddress);
        
        document.getElementById('reserveETH').textContent = 
            parseFloat(ethers.utils.formatEther(reserveETH)).toFixed(4) + ' ETH';
        document.getElementById('reserveKRP').textContent = 
            parseFloat(ethers.utils.formatEther(reserveToken)).toFixed(2) + ' KRP';
        document.getElementById('price').textContent = 
            '1 ETH = ' + parseFloat(ethers.utils.formatEther(price)).toFixed(2) + ' KRP';
        document.getElementById('userShares').textContent = 
            parseFloat(ethers.utils.formatEther(userShares)).toFixed(4);
        
        // Update ratio info
        if (reserveETH.gt(0)) {
            const ratio = parseFloat(ethers.utils.formatEther(price)).toFixed(2);
            document.getElementById('ratioInfo').textContent = 
                `Current ratio: 1 ETH = ${ratio} KRP`;
        }
        
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// Enable Buttons
function enableButtons() {
    document.getElementById('swapBtn').disabled = false;
    document.getElementById('swapBtn').textContent = 'Swap';
    document.getElementById('addLiquidityBtn').disabled = false;
    document.getElementById('addLiquidityBtn').textContent = 'Add Liquidity';
    document.getElementById('removeLiquidityBtn').disabled = false;
    document.getElementById('removeLiquidityBtn').textContent = 'Remove Liquidity';
}

// Switch Tab
function switchTab(tabName) {
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
}

// Swap Direction Change
function handleSwapDirectionChange() {
    const direction = document.querySelector('input[name="swapDirection"]:checked').value;
    
    if (direction === 'ethToToken') {
        document.getElementById('fromLabel').textContent = 'From (ETH)';
        document.getElementById('toLabel').textContent = 'To (KRP)';
    } else {
        document.getElementById('fromLabel').textContent = 'From (KRP)';
        document.getElementById('toLabel').textContent = 'To (ETH)';
    }
    
    document.getElementById('swapInput').value = '';
    document.getElementById('swapOutput').value = '';
}

// Calculate Swap Output
async function calculateSwapOutput() {
    const input = document.getElementById('swapInput').value;
    if (!input || input <= 0) {
        document.getElementById('swapOutput').value = '';
        return;
    }
    
    try {
        const direction = document.querySelector('input[name="swapDirection"]:checked').value;
        const reserveETH = await swapContract.reserveETH();
        const reserveToken = await swapContract.reserveToken();
        
        if (reserveETH.eq(0) || reserveToken.eq(0)) {
            document.getElementById('swapOutput').value = 'No liquidity';
            return;
        }
        
        const inputAmount = ethers.utils.parseEther(input);
        
        // Apply 0.3% fee
        const feeAmount = inputAmount.mul(9970).div(10000); // 99.7%
        
        let output;
        if (direction === 'ethToToken') {
            output = await swapContract.getAmountOut(feeAmount, reserveETH, reserveToken);
        } else {
            output = await swapContract.getAmountOut(feeAmount, reserveToken, reserveETH);
        }
        
        document.getElementById('swapOutput').value = 
            parseFloat(ethers.utils.formatEther(output)).toFixed(6);
            
    } catch (error) {
        console.error('Error calculating output:', error);
        document.getElementById('swapOutput').value = 'Error';
    }
}

// Set Max Swap Amount
async function setMaxSwapAmount() {
    try {
        const direction = document.querySelector('input[name="swapDirection"]:checked').value;
        
        if (direction === 'ethToToken') {
            const balance = await provider.getBalance(userAddress);
            const maxAmount = balance.sub(ethers.utils.parseEther('0.01')); // Leave some for gas
            if (maxAmount.gt(0)) {
                document.getElementById('swapInput').value = 
                    parseFloat(ethers.utils.formatEther(maxAmount)).toFixed(4);
                calculateSwapOutput();
            }
        } else {
            const balance = await tokenContract.balanceOf(userAddress);
            document.getElementById('swapInput').value = 
                parseFloat(ethers.utils.formatEther(balance)).toFixed(2);
            calculateSwapOutput();
        }
    } catch (error) {
        console.error('Error setting max:', error);
    }
}

// Execute Swap
async function executeSwap() {
    const input = document.getElementById('swapInput').value;
    const output = document.getElementById('swapOutput').value;
    
    if (!input || !output || input <= 0) {
        showError('Please enter a valid amount', 'swapStatus');
        return;
    }
    
    try {
        const direction = document.querySelector('input[name="swapDirection"]:checked').value;
        const inputAmount = ethers.utils.parseEther(input);
        const minOutput = ethers.utils.parseEther(output).mul(995).div(1000); // 0.5% slippage
        
        showLoading('Swapping...', 'swapStatus');
        
        let tx;
        if (direction === 'ethToToken') {
            tx = await swapContract.swapETHForToken(minOutput, { value: inputAmount });
        } else {
            // Check allowance
            const allowance = await tokenContract.allowance(userAddress, SWAP_ADDRESS);
            if (allowance.lt(inputAmount)) {
                showLoading('Approving token...', 'swapStatus');
                const approveTx = await tokenContract.approve(SWAP_ADDRESS, ethers.constants.MaxUint256);
                await approveTx.wait();
            }
            
            showLoading('Swapping...', 'swapStatus');
            tx = await swapContract.swapTokenForETH(inputAmount, minOutput);
        }
        
        showLoading('Waiting for confirmation...', 'swapStatus');
        const receipt = await tx.wait();
        
        showSuccess(`Swap successful! <a href="https://sepolia.etherscan.io/tx/${receipt.transactionHash}" target="_blank">View TX</a>`, 'swapStatus');
        
        // Update UI
        await updatePoolStats();
        await updateWalletUI();
        document.getElementById('swapInput').value = '';
        document.getElementById('swapOutput').value = '';
        
        addTransaction('Swap', receipt.transactionHash);
        
    } catch (error) {
        console.error('Swap error:', error);
        showError('Swap failed: ' + (error.reason || error.message), 'swapStatus');
    }
}

// Calculate Token Amount for Liquidity
async function calculateTokenAmount() {
    const ethAmount = document.getElementById('addEthAmount').value;
    if (!ethAmount || ethAmount <= 0) {
        document.getElementById('addTokenAmount').value = '';
        return;
    }
    
    try {
        const reserveETH = await swapContract.reserveETH();
        const reserveToken = await swapContract.reserveToken();
        
        if (reserveETH.eq(0)) {
            // First liquidity - user can set any ratio
            return;
        }
        
        const ethAmountWei = ethers.utils.parseEther(ethAmount);
        const tokenAmount = ethAmountWei.mul(reserveToken).div(reserveETH);
        
        document.getElementById('addTokenAmount').value = 
            parseFloat(ethers.utils.formatEther(tokenAmount)).toFixed(2);
            
    } catch (error) {
        console.error('Error calculating token amount:', error);
    }
}

// Add Liquidity
async function addLiquidity() {
    const ethAmount = document.getElementById('addEthAmount').value;
    const tokenAmount = document.getElementById('addTokenAmount').value;
    
    if (!ethAmount || !tokenAmount || ethAmount <= 0 || tokenAmount <= 0) {
        showError('Please enter valid amounts', 'addLiquidityStatus');
        return;
    }
    
    try {
        const ethAmountWei = ethers.utils.parseEther(ethAmount);
        const tokenAmountWei = ethers.utils.parseEther(tokenAmount);
        
        showLoading('Checking allowance...', 'addLiquidityStatus');
        
        // Check and approve token
        const allowance = await tokenContract.allowance(userAddress, SWAP_ADDRESS);
        if (allowance.lt(tokenAmountWei)) {
            showLoading('Approving token...', 'addLiquidityStatus');
            const approveTx = await tokenContract.approve(SWAP_ADDRESS, ethers.constants.MaxUint256);
            await approveTx.wait();
        }
        
        showLoading('Adding liquidity...', 'addLiquidityStatus');
        const tx = await swapContract.addLiquidity(tokenAmountWei, { value: ethAmountWei });
        
        showLoading('Waiting for confirmation...', 'addLiquidityStatus');
        const receipt = await tx.wait();
        
        showSuccess(`Liquidity added! <a href="https://sepolia.etherscan.io/tx/${receipt.transactionHash}" target="_blank">View TX</a>`, 'addLiquidityStatus');
        
        // Update UI
        await updatePoolStats();
        await updateWalletUI();
        document.getElementById('addEthAmount').value = '';
        document.getElementById('addTokenAmount').value = '';
        
        addTransaction('Add Liquidity', receipt.transactionHash);
        
    } catch (error) {
        console.error('Add liquidity error:', error);
        showError('Add liquidity failed: ' + (error.reason || error.message), 'addLiquidityStatus');
    }
}

// Calculate Remove Preview
async function calculateRemovePreview() {
    const shares = document.getElementById('removeShares').value;
    if (!shares || shares <= 0) {
        document.getElementById('removePreview').textContent = 'You will receive: -';
        return;
    }
    
    try {
        const sharesWei = ethers.utils.parseEther(shares);
        const totalShares = await swapContract.totalLiquidityShares();
        const reserveETH = await swapContract.reserveETH();
        const reserveToken = await swapContract.reserveToken();
        
        if (totalShares.eq(0)) {
            return;
        }
        
        const ethAmount = sharesWei.mul(reserveETH).div(totalShares);
        const tokenAmount = sharesWei.mul(reserveToken).div(totalShares);
        
        document.getElementById('removePreview').textContent = 
            `You will receive: ${parseFloat(ethers.utils.formatEther(ethAmount)).toFixed(4)} ETH + ${parseFloat(ethers.utils.formatEther(tokenAmount)).toFixed(2)} KRP`;
            
    } catch (error) {
        console.error('Error calculating preview:', error);
    }
}

// Set Max Shares
async function setMaxShares() {
    try {
        const shares = await swapContract.liquidityShares(userAddress);
        document.getElementById('removeShares').value = 
            parseFloat(ethers.utils.formatEther(shares)).toFixed(4);
        calculateRemovePreview();
    } catch (error) {
        console.error('Error setting max shares:', error);
    }
}

// Remove Liquidity
async function removeLiquidity() {
    const shares = document.getElementById('removeShares').value;
    
    if (!shares || shares <= 0) {
        showError('Please enter a valid amount', 'removeLiquidityStatus');
        return;
    }
    
    try {
        const sharesWei = ethers.utils.parseEther(shares);
        
        showLoading('Removing liquidity...', 'removeLiquidityStatus');
        const tx = await swapContract.removeLiquidity(sharesWei);
        
        showLoading('Waiting for confirmation...', 'removeLiquidityStatus');
        const receipt = await tx.wait();
        
        showSuccess(`Liquidity removed! <a href="https://sepolia.etherscan.io/tx/${receipt.transactionHash}" target="_blank">View TX</a>`, 'removeLiquidityStatus');
        
        // Update UI
        await updatePoolStats();
        await updateWalletUI();
        document.getElementById('removeShares').value = '';
        document.getElementById('removePreview').textContent = 'You will receive: -';
        
        addTransaction('Remove Liquidity', receipt.transactionHash);
        
    } catch (error) {
        console.error('Remove liquidity error:', error);
        showError('Remove liquidity failed: ' + (error.reason || error.message), 'removeLiquidityStatus');
    }
}

// Transaction List
function addTransaction(type, hash) {
    const txList = document.getElementById('txList');
    
    // Remove empty state
    const emptyState = txList.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }
    
    const txItem = document.createElement('div');
    txItem.className = 'tx-item';
    txItem.innerHTML = `
        <span>${type}</span>
        <a href="https://sepolia.etherscan.io/tx/${hash}" target="_blank">
            ${hash.slice(0, 10)}...${hash.slice(-8)}
        </a>
    `;
    
    txList.insertBefore(txItem, txList.firstChild);
    
    // Keep only last 5 transactions
    while (txList.children.length > 5) {
        txList.removeChild(txList.lastChild);
    }
}

// UI Helpers
function showLoading(message = 'Loading...', elementId = null) {
    if (elementId) {
        const element = document.getElementById(elementId);
        element.className = 'status-message loading';
        element.textContent = message;
        element.classList.remove('hidden');
    }
}

function hideLoading(elementId = null) {
    if (elementId) {
        document.getElementById(elementId).classList.add('hidden');
    }
}

function showSuccess(message, elementId) {
    const element = document.getElementById(elementId);
    element.className = 'status-message success';
    element.innerHTML = message;
    element.classList.remove('hidden');
    
    setTimeout(() => {
        element.classList.add('hidden');
    }, 10000);
}

function showError(message, elementId) {
    const element = document.getElementById(elementId);
    element.className = 'status-message error';
    element.textContent = message;
    element.classList.remove('hidden');
    
    setTimeout(() => {
        element.classList.add('hidden');
    }, 5000);
}
