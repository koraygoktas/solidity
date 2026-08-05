# Manuel Test Notları

## Hardhat Console ile Manuel Test Adımları

### 1. Yerel blockchain ağını başlat (Terminal 1)
npx hardhat node

### 2. Console'u başlat ve ağa bağlan (Terminal 2)
npx hardhat console --network localhost

### 3. Console'a girince ilk çalıştırılacak satır (ethers'ı bağlamak için)
const { ethers } = await (await import("hardhat")).default.network.connect();

### 4. Test hesaplarını al
const [owner1, owner2, owner3] = await ethers.getSigners();