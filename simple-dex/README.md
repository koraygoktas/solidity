# 🔄 SimpleSwap DEX

Basit bir DEX (Decentralized Exchange) implementasyonu - Automated Market Maker (AMM) kullanarak ETH/KRP token swap.

## 🎯 Özellikler

- ✨ **AMM (Automated Market Maker)** - Constant Product Formula (x*y=k)
- 💧 **Liquidity Pool Yönetimi** - LP token sistemi
- 🔄 **Bi-directional Swap** - ETH ↔ KRP
- 💰 **Trading Fee** - %0.3 fee (LP'lere dağıtılır)
- 🛡️ **Reentrancy Protection** - OpenZeppelin ReentrancyGuard
- ⚡ **Slippage Protection** - Minimum output garantisi

## 📊 Deployed Contracts (Sepolia Testnet)

- **KryptoToken (KRP):** [`0xf468c54C926b216a279362e09E966e958b9f8981`](https://sepolia.etherscan.io/address/0xf468c54C926b216a279362e09E966e958b9f8981)
- **SimpleSwap DEX:** [`0xfb8A0B3e7b55Fe84C55A2731Dcb22008e55D8be3`](https://sepolia.etherscan.io/address/0xfb8A0B3e7b55Fe84C55A2731Dcb22008e55D8be3)

## 🛠️ Teknolojiler

- Solidity ^0.8.20
- Hardhat (Development & Testing)
- OpenZeppelin Contracts (Security)
- Ethers.js v6
- Sepolia Testnet

## 🚀 Kurulum
```bash
# Projeyi klonla
git clone https://github.com/koraygoktas/simple-dex.git
cd simple-dex

# Bağımlılıkları yükle
npm install

# .env dosyası oluştur
cp .env.example .env
# .env dosyasını düzenle (RPC URL, Private Key, Etherscan API Key)
```

## ⚙️ Kullanım

### Compile
```bash
npx hardhat compile
```

### Deploy (Sepolia)
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Liquidity Ekle
```bash
# scripts/addLiquidity.js dosyasında adresleri güncelle
npx hardhat run scripts/addLiquidity.js --network sepolia
```

### Swap Yap
```bash
# scripts/swap.js dosyasında adresleri güncelle
npx hardhat run scripts/swap.js --network sepolia
```

### Test
```bash
npx hardhat test
```

## 📐 AMM Formülleri

### Constant Product Formula
```
x * y = k
```

- `x` = ETH reserve
- `y` = Token reserve  
- `k` = Constant (sabit kalır)

### LP Shares (İlk Liquidity)
```
shares = √(ETH × Token)
```

### Sonraki Liquidity
```
shares = min(
    (userETH × totalShares) / reserveETH,
    (userToken × totalShares) / reserveToken
)
```

### Swap Output Hesaplama
```
fee = 0.3%
inputAfterFee = input × (1 - fee)
output = (inputAfterFee × outputReserve) / (inputReserve + inputAfterFee)
```

## 🔒 Güvenlik

- ✅ **ReentrancyGuard** - Reentrancy attack koruması
- ✅ **Ownable** - Access control
- ✅ **Slippage Protection** - Minimum output kontrolü
- ✅ **Zero Address Check** - Geçersiz adres kontrolü
- ✅ **Integer Overflow Protection** - Solidity 0.8.x otomatik koruma

## 📖 Ana Fonksiyonlar

### `addLiquidity(uint256 tokenAmount)`

Pool'a ETH ve token ekler, karşılığında LP shares verir.

**Parametreler:**
- `tokenAmount`: Eklenecek token miktarı

**Returns:**
- `shares`: Alınan LP token miktarı

**Kullanım:**
```javascript
await token.approve(swapAddress, tokenAmount);
await simpleSwap.addLiquidity(tokenAmount, { value: ethAmount });
```

---

### `removeLiquidity(uint256 shares)`

LP shares yakarak pool'dan ETH ve token geri alır.

**Parametreler:**
- `shares`: Yakılacak LP share miktarı

**Returns:**
- `ethAmount`: Alınan ETH miktarı
- `tokenAmount`: Alınan token miktarı

---

### `swapETHForToken(uint256 minTokenAmount)`

ETH göndererek token satın alır.

**Parametreler:**
- `minTokenAmount`: Minimum alınacak token (slippage protection)

**Returns:**
- `tokenAmount`: Alınan token miktarı

**Kullanım:**
```javascript
await simpleSwap.swapETHForToken(minTokens, { value: ethAmount });
```

---

### `swapTokenForETH(uint256 tokenAmount, uint256 minETHAmount)`

Token göndererek ETH satın alır.

**Parametreler:**
- `tokenAmount`: Gönderilecek token miktarı
- `minETHAmount`: Minimum alınacak ETH (slippage protection)

**Returns:**
- `ethAmount`: Alınan ETH miktarı

**Kullanım:**
```javascript
await token.approve(swapAddress, tokenAmount);
await simpleSwap.swapTokenForETH(tokenAmount, minETH);
```

---

### `getPrice()`

Mevcut pool fiyatını döner (1 ETH = ? Token).

**Returns:**
- `price`: 1 ETH'nin token karşılığı

---

### `getUserLiquidity(address user)`

Kullanıcının pool'daki payını gösterir.

**Parametreler:**
- `user`: Sorgulanacak kullanıcı adresi

**Returns:**
- `ethAmount`: Kullanıcının ETH payı
- `tokenAmount`: Kullanıcının token payı
- `shares`: Kullanıcının LP share miktarı

## 🎓 Öğrendiklerim

Bu proje sürecinde şunları öğrendim:

- **AMM Mekanizması**: Constant Product Formula (x*y=k) nasıl çalışır
- **Liquidity Pool**: LP token sistemi ve liquidity management
- **Fee Distribution**: Trading fee'lerinin LP'lere nasıl dağıtıldığı
- **Slippage**: Fiyat değişimlerine karşı kullanıcı koruması
- **Impermanent Loss**: LP'lerin karşılaşabileceği risk
- **Smart Contract Security**: Reentrancy ve diğer attack vektörlerine karşı koruma

## 📂 Proje Yapısı
```
simple-dex/
├── contracts/
│   ├── SimpleSwap.sol       # Ana DEX contract
│   └── mocks/
│       └── MockERC20.sol    # Test için mock token
├── scripts/
│   ├── deploy.js            # Deploy script
│   ├── addLiquidity.js      # Liquidity ekleme
│   └── swap.js              # Test swap
├── test/
│   └── SimpleSwap.test.js   # Unit testler
├── hardhat.config.js
├── .env.example
└── README.md
```

## 🔍 Verify

Contract'ı Etherscan'de verify etmek için:
```bash
# KryptoToken
npx hardhat verify --network sepolia 0xf468c54C926b216a279362e09E966e958b9f8981 "KryptoToken" "KRP" "1000000000000000000000000"

# SimpleSwap
npx hardhat verify --network sepolia 0xfb8A0B3e7b55Fe84C55A2731Dcb22008e55D8be3 0xf468c54C926b216a279362e09E966e958b9f8981
```

## 📝 Lisans

MIT

## 👤 Yazar

**Koray Göktaş**

- GitHub: [@koraygoktas](https://github.com/koraygoktas)
- LinkedIn: [Koray Göktaş](https://www.linkedin.com/in/koray-g%C3%B6kta%C5%9F-06a12120a/)

## 🙏 Teşekkürler

- [OpenZeppelin](https://openzeppelin.com/) - Güvenli contract kütüphaneleri
- [Hardhat](https://hardhat.org/) - Development environment
- [Uniswap](https://uniswap.org/) - AMM inspiration

---

⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın!