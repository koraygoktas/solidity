# 🎨 SimpleNFT (SNFT) - ERC721 NFT Collection

![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=for-the-badge&logo=solidity)
![Hardhat](https://img.shields.io/badge/Hardhat-2.28.0-yellow?style=for-the-badge&logo=hardhat)
![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-5.4.0-4E5EE4?style=for-the-badge&logo=openzeppelin)
![ERC721](https://img.shields.io/badge/Standard-ERC721-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**SimpleNFT**, OpenZeppelin standartlarını kullanarak geliştirilmiş, **ERC721 uyumlu** bir NFT (Non-Fungible Token) projesidir. NFT basma (minting), transfer etme ve metadata yönetimi gibi temel NFT işlemlerini destekler.

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [NFT Nedir](#-nft-nedir)
- [Teknolojiler](#-teknolojiler)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [Smart Contract](#-smart-contract)
- [IPFS & Metadata](#-ipfs--metadata)
- [Test](#-test)
- [Deploy](#-deploy)
- [ERC721 Standartları](#-erc721-standartları)
- [OpenZeppelin Entegrasyonu](#-openzeppelin-entegrasyonu)
- [Use Cases](#-use-cases)
- [Güvenlik](#-güvenlik)
- [Gelecek Özellikler](#-gelecek-özellikler)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)
- [İletişim](#-iletişim)

## ✨ Özellikler

### 🎨 NFT İşlemleri
- **Mint (Basma)**: Yeni NFT'ler oluşturma
- **Transfer**: NFT sahipliğini transfer etme
- **Metadata**: IPFS URI ile metadata desteği
- **Owner Tracking**: Adrese göre NFT listeleme
- **Total Supply**: Toplam basılan NFT sayısı

### 🔒 Güvenlik & Standartlar
- ✅ **OpenZeppelin Contracts**: Audited ve güvenli kod
- ✅ **ERC721URIStorage**: Metadata yönetimi
- ✅ **Ownable**: Owner kontrolü
- ✅ **SafeMint**: Güvenli minting
- ✅ **Event Logging**: Tüm işlemler loglanıyor

### 🚀 Teknik Özellikler
- **Gas Optimized**: Verimli storage kullanımı
- **Scalable**: Sınırsız NFT basımı
- **Upgradeable Ready**: OpenZeppelin Upgrades ile uyumlu
- **ERC721 Compatible**: Tüm marketplaceler ile uyumlu

## 🎯 NFT Nedir?

### Non-Fungible Token (NFT)
NFT'ler, blockchain üzerinde **benzersiz** ve **değiştirilemez** dijital varlıklardır.

```
Fungible (Değiştirilebilir)    Non-Fungible (Benzersiz)
├── Token (ERC20)              ├── NFT (ERC721)
├── 1 KRP = 1 KRP              ├── NFT #1 ≠ NFT #2
├── Bölünebilir                ├── Bölünemez
└── Örnek: Para, Altın         └── Örnek: Sanat, Sertifika
```

### NFT Kullanım Alanları
- 🎨 **Dijital Sanat**: Bored Apes, CryptoPunks
- 🎮 **Gaming**: Axie Infinity, Decentraland
- 🎵 **Müzik**: Albümler, konser biletleri
- 📜 **Sertifikalar**: Diploma, katılım belgesi
- 🏠 **Gayrimenkul**: Dijital arsa, metaverse
- 🎫 **Ticket/Event**: Konser, spor biletleri

## 🛠 Teknolojiler

### Smart Contract Stack
- **Solidity** `^0.8.20` - Smart contract dili
- **OpenZeppelin** `^5.4.0` - Güvenli NFT implementasyonu
  - `ERC721.sol` - NFT standardı
  - `ERC721URIStorage.sol` - Metadata yönetimi
  - `Ownable.sol` - Access control
- **Hardhat** `^2.28.0` - Geliştirme ortamı
- **Ethers.js** `^6.x` - Blockchain etkileşimi

### Development Tools
- **Hardhat Toolbox** - Tüm geliştirme araçları
- **Chai** - Test framework
- **Dotenv** - Environment yönetimi
- **Hardhat Etherscan** - Contract verification

### External Services
- **IPFS** - Decentralized storage (metadata)
- **Pinata/NFT.Storage** - IPFS pinning service
- **Sepolia Testnet** - Test network
- **Etherscan** - Blockchain explorer

## 📦 Kurulum

### Gereksinimler

- Node.js >= 16.0.0
- npm veya yarn
- Git
- MetaMask (opsiyonel)
- IPFS account (Pinata/NFT.Storage)

### Adım 1: Projeyi Klonlayın

```bash
git clone https://github.com/koraygoktas/simple-nft.git
cd simple-nft
```

### Adım 2: Bağımlılıkları Yükleyin

```bash
npm install
```

OpenZeppelin otomatik yüklenecek:
```
✔ @openzeppelin/contracts@5.4.0
✔ @nomicfoundation/hardhat-toolbox@6.1.0
✔ hardhat@2.28.0
```

### Adım 3: Environment Dosyası

`.env` dosyası oluşturun:

```env
# Sepolia RPC (Infura veya Alchemy)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID

# Private Key (MetaMask - Test wallet)
PRIVATE_KEY=your_private_key_without_0x

# Etherscan API Key (verification için)
ETHERSCAN_API_KEY=your_etherscan_api_key
```

**⚠️ Güvenlik Uyarıları:**
- Asla gerçek cüzdan private key kullanmayın
- `.env` dosyasını `.gitignore`'a ekleyin
- Test cüzdanı ile çalışın

### Adım 4: Compile

```bash
npx hardhat compile
```

Çıktı:
```
✔ Compiled 15 Solidity files successfully
```

## 🚀 Kullanım

### Local Test Network

```bash
# Terminal 1: Hardhat node
npx hardhat node

# Terminal 2: Deploy
npx hardhat run scripts/deploy.js --network localhost
```

### NFT Minting Örneği

#### JavaScript (Hardhat Console)

```javascript
// Hardhat console'u aç
npx hardhat console --network localhost

// Contract'ı yükle
const SimpleNFT = await ethers.getContractFactory("SimpleNFT");
const nft = await SimpleNFT.attach("CONTRACT_ADDRESS");

// NFT mint et
const tx = await nft.mint(
  "0xRecipientAddress",
  "ipfs://QmYourMetadataHash"
);
await tx.wait();

// NFT'yi kontrol et
const owner = await nft.ownerOf(0);
const uri = await nft.tokenURI(0);
console.log("Owner:", owner);
console.log("Metadata:", uri);
```

#### Solidity Fonksiyon Çağrısı

```solidity
// Mint
await nft.mint(recipientAddress, metadataURI);

// Transfer
await nft.transferNFT(toAddress, tokenId);

// Owner'ın NFT'lerini getir
const tokens = await nft.tokensOfOwner(ownerAddress);

// Total supply
const total = await nft.totalSupply();
```

## 📜 Smart Contract

### Contract Mimarisi

```
SimpleNFT
├── Inheritance
│   ├── ERC721 (OpenZeppelin)
│   ├── ERC721URIStorage (OpenZeppelin)
│   └── Ownable (OpenZeppelin)
│
├── State Variables
│   └── _nextTokenId: uint256 (private)
│
├── Events
│   ├── NFTMinted(to, tokenId, tokenURI)
│   └── NFTTransferred(from, to, tokenId)
│
└── Functions
    ├── constructor() - Initialize
    ├── mint(to, uri) - NFT bas
    ├── transferNFT(to, tokenId) - NFT transfer
    ├── tokensOfOwner(owner) - NFT listesi
    ├── totalSupply() - Toplam sayı
    ├── tokenURI() - Metadata URI (override)
    └── supportsInterface() - ERC165 (override)
```

### Fonksiyonlar Detaylı

#### 1. Mint (NFT Basma)

```solidity
function mint(address to, string memory uri) public returns (uint256)
```

**Parametreler:**
- `to`: NFT alıcısının adresi
- `uri`: IPFS metadata URI'ı

**Dönen Değer:**
- `tokenId`: Basılan NFT'nin ID'si

**Örnek:**
```javascript
const tokenId = await nft.mint(
  "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "ipfs://QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB"
);
```

#### 2. Transfer NFT

```solidity
function transferNFT(address to, uint256 tokenId) public
```

**Parametreler:**
- `to`: Alıcı adresi
- `tokenId`: Transfer edilecek NFT ID

**Kontroller:**
- ✅ Sadece NFT sahibi transfer edebilir
- ✅ SafeTransfer ile güvenli transfer

**Örnek:**
```javascript
await nft.connect(owner).transferNFT(newOwner.address, 0);
```

#### 3. Tokens of Owner

```solidity
function tokensOfOwner(address owner) public view returns (uint256[] memory)
```

**Parametreler:**
- `owner`: NFT sahibinin adresi

**Dönen Değer:**
- `uint256[]`: NFT ID'lerinin array'i

**Örnek:**
```javascript
const myNFTs = await nft.tokensOfOwner("0xMyAddress");
console.log("My NFTs:", myNFTs); // [0, 2, 5, 7]
```

#### 4. Total Supply

```solidity
function totalSupply() public view returns (uint256)
```

**Dönen Değer:**
- Toplam basılan NFT sayısı

**Örnek:**
```javascript
const total = await nft.totalSupply();
console.log("Total NFTs:", total); // 42
```

### OpenZeppelin Overrides

```solidity
// tokenURI override (ERC721URIStorage)
function tokenURI(uint256 tokenId) 
    public view 
    override(ERC721, ERC721URIStorage) 
    returns (string memory)

// supportsInterface override (ERC165)
function supportsInterface(bytes4 interfaceId)
    public view
    override(ERC721, ERC721URIStorage)
    returns (bool)
```

**Neden Override:**
- Multiple inheritance çakışmasını çözmek
- Solidity'nin `super` call mekanizması

## 📦 IPFS & Metadata

### IPFS Nedir?

**IPFS (InterPlanetary File System)**: Merkezi olmayan dosya depolama sistemi

```
Merkezi (AWS)           IPFS (Decentralized)
├── Tek sunucu          ├── Dağıtık network
├── Kapatılabilir       ├── Sansür direnci
├── Link değişir        ├── Hash sabittir
└── ipfs.io/Qm...       └── ipfs://Qm...
```

### NFT Metadata Formatı

#### Standard JSON (OpenSea Compatible)

```json
{
  "name": "My First NFT #1",
  "description": "This is my first NFT on blockchain",
  "image": "ipfs://QmImageHashHere",
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Blue"
    },
    {
      "trait_type": "Rarity",
      "value": "Legendary"
    }
  ],
  "external_url": "https://myproject.com/nft/1"
}
```

### IPFS'e Metadata Yükleme

#### 1. Pinata.cloud Kullanarak

```bash
# 1. Pinata.cloud'da hesap aç
# 2. API Keys al
# 3. metadata.json oluştur
# 4. Upload et

# Örnek Upload (Pinata API)
curl -X POST "https://api.pinata.cloud/pinning/pinFileToIPFS" \
  -H "pinata_api_key: YOUR_API_KEY" \
  -H "pinata_secret_api_key: YOUR_SECRET" \
  -F "file=@metadata.json"
```

#### 2. NFT.Storage Kullanarak

```javascript
import { NFTStorage, File } from 'nft.storage'

const client = new NFTStorage({ token: 'YOUR_API_KEY' })

const metadata = await client.store({
  name: 'My NFT',
  description: 'Amazing NFT',
  image: new File([imageData], 'nft.png', { type: 'image/png' })
})

console.log('IPFS URL:', metadata.url)
// ipfs://bafyreib...
```

#### 3. Hardhat Script ile Mint

```javascript
// scripts/mintWithIPFS.js
async function main() {
  const metadataURI = "ipfs://QmYourMetadataHash";
  
  const SimpleNFT = await ethers.getContractFactory("SimpleNFT");
  const nft = await SimpleNFT.attach("CONTRACT_ADDRESS");
  
  const tx = await nft.mint(recipientAddress, metadataURI);
  await tx.wait();
  
  console.log("✅ NFT Minted with metadata:", metadataURI);
}
```

### Metadata Best Practices

| ✅ Yapılmalı | ❌ Yapılmamalı |
|-------------|---------------|
| IPFS kullan | HTTP links (değişebilir) |
| JSON standardına uy | Custom format |
| Image de IPFS'te | Merkezi hosting |
| Pin metadata | Geçici upload |
| Backup yap | Tek kopya |

## 🧪 Test

### Test Çalıştırma

```bash
# Tüm testler
npx hardhat test

# Verbose output
npx hardhat test --verbose

# Gas raporu
REPORT_GAS=true npx hardhat test

# Coverage
npx hardhat coverage
```

### Test Senaryoları

#### ✅ Deployment Tests
```javascript
✔ Should set the correct name and symbol
✔ Should set the correct owner
✔ Should start with 0 total supply
```

#### ✅ Minting Tests
```javascript
✔ Should mint NFT correctly
✔ Should emit NFTMinted event
✔ Should mint multiple NFTs
```

#### ✅ Transfer Tests
```javascript
✔ Should transfer NFT correctly
✔ Should emit NFTTransferred event
✔ Should fail if not owner
```

#### ✅ TokensOfOwner Tests
```javascript
✔ Should return all tokens of owner
✔ Should return empty array for no tokens
```

### Test Sonuçları

```
  SimpleNFT
    Deployment
      ✔ Should set the correct name and symbol (1234ms)
      ✔ Should set the correct owner (145ms)
      ✔ Should start with 0 total supply (89ms)
    Minting
      ✔ Should mint NFT correctly (234ms)
      ✔ Should emit NFTMinted event (178ms)
      ✔ Should mint multiple NFTs (456ms)
    Transfer
      ✔ Should transfer NFT correctly (345ms)
      ✔ Should emit NFTTransferred event (234ms)
      ✔ Should fail if not owner (123ms)
    TokensOfOwner
      ✔ Should return all tokens of owner (567ms)
      ✔ Should return empty array for no tokens (89ms)

  11 passing (3s)
```

## 🌐 Deploy

### Sepolia Testnet Deploy

#### 1. Environment Hazırlığı

```bash
# .env dosyası
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_test_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_key
```

#### 2. Sepolia Test ETH

- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Faucet](https://sepoliafaucet.com/)
- Minimum 0.1 ETH önerilir

#### 3. Deploy Script

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

#### 4. Deploy Çıktısı

```
🚀 Deploying SimpleNFT contract...
📝 Deploying with account: 0x1234...5678
💰 Account balance: 0.5 ETH

✅ SimpleNFT deployed to: 0xABCD...1234

📋 Save this address for frontend!
Contract Address: 0xABCD...1234

📋 Verification command:
npx hardhat verify --network sepolia 0xABCD...1234

🎨 Minting first NFT...
✅ First NFT minted to: 0x1234...5678
📊 Total Supply: 1
```

#### 5. Contract Verification

```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

Başarılı olursa:
```
✔ Contract verified on Etherscan
🔗 https://sepolia.etherscan.io/address/0xYourAddress#code
```

### OpenSea'da Görüntüleme

#### 1. Testnets OpenSea

```
https://testnets.opensea.io/assets/sepolia/CONTRACT_ADDRESS/TOKEN_ID
```

**Örnek:**
```
https://testnets.opensea.io/assets/sepolia/0xABCD1234/0
```

#### 2. Collection Sayfası

```
https://testnets.opensea.io/collection/simplenft-v2
```

#### 3. Metadata Refresh

- OpenSea bazen metadata'yı cache'ler
- "Refresh Metadata" butonuna basın
- 5-10 dakika bekleyin

## 📊 ERC721 Standartları

### ERC721 Core Functions

| Fonksiyon | Tip | Açıklama |
|-----------|-----|----------|
| `balanceOf(address)` | view | Adresteki NFT sayısı |
| `ownerOf(uint256)` | view | NFT sahibini döner |
| `safeTransferFrom(from, to, tokenId)` | write | Güvenli transfer |
| `transferFrom(from, to, tokenId)` | write | Transfer |
| `approve(to, tokenId)` | write | NFT için onay ver |
| `setApprovalForAll(operator, approved)` | write | Tüm NFT'ler için onay |
| `getApproved(tokenId)` | view | Onaylı adresi getir |
| `isApprovedForAll(owner, operator)` | view | Operator onaylı mı |

### ERC721 Events

```solidity
event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
```

### ERC721 Extensions

**SimpleNFT'de Kullanılanlar:**

| Extension | Açıklama |
|-----------|----------|
| `ERC721URIStorage` | Token URI storage |
| `Ownable` | Owner kontrolü |

**Diğer Popüler Extensions:**

| Extension | Açıklama | Kullanım |
|-----------|----------|----------|
| `ERC721Enumerable` | Token listeleme | Tüm NFT'leri iterate etme |
| `ERC721Burnable` | NFT yakma | Token'ları yok etme |
| `ERC721Pausable` | Pause/Unpause | Acil durum |
| `ERC721Royalty` | Royalty (telif) | Creator'a her satışta pay |

## 🔐 OpenZeppelin Entegrasyonu

### Neden OpenZeppelin?

```
Manuel Kod           OpenZeppelin
├── Bug riski        ├── Audited
├── Security açık    ├── Battle-tested
├── Zaman kaybı      ├── Ready-to-use
└── Test gerekli     └── Milyarlarca $ güvende
```

### Kullanılan OpenZeppelin Contracts

#### 1. ERC721.sol

```solidity
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
```

**Sağladıkları:**
- `_safeMint()`: Güvenli minting
- `_transfer()`: Transfer logic
- `balanceOf()`: Balance tracking
- `ownerOf()`: Owner tracking

#### 2. ERC721URIStorage.sol

```solidity
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
```

**Sağladıkları:**
- `_setTokenURI()`: URI kaydetme
- `tokenURI()`: URI okuma
- Metadata management

#### 3. Ownable.sol

```solidity
import "@openzeppelin/contracts/access/Ownable.sol";
```

**Sağladıkları:**
- `onlyOwner` modifier
- `owner()`: Owner adresini döner
- `transferOwnership()`: Owner değiştirme
- `renounceOwnership()`: Owner'lığı bırakma

### Inheritance Hiyerarşisi

```
SimpleNFT
    ├── ERC721
    │   └── ERC165 (interface support)
    ├── ERC721URIStorage
    │   └── ERC721
    └── Ownable
        └── Context (msg.sender helper)
```

### Override Pattern

```solidity
// Multiple inheritance override
function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage) // İkisini de belirt
    returns (string memory)
{
    return super.tokenURI(tokenId); // Parent'ı çağır
}
```

## 🎯 Use Cases

### 1. Digital Art Gallery

```javascript
// Artist mint eder
await nft.mint(artistAddress, "ipfs://QmArtwork1");
await nft.mint(artistAddress, "ipfs://QmArtwork2");

// Collector satın alır (marketplace'de)
await nft.transferNFT(collectorAddress, 0);

// Collection görüntüle
const myArt = await nft.tokensOfOwner(collectorAddress);
```

### 2. Event Tickets

```javascript
// Event organizer ticket basar
const eventMetadata = {
  name: "Concert Ticket #1",
  description: "VIP Seat - Row A",
  image: "ipfs://QmTicketDesign",
  attributes: [
    { trait_type: "Event", value: "Rock Concert" },
    { trait_type: "Date", value: "2024-06-15" },
    { trait_type: "Seat", value: "A-12" }
  ]
};

// Upload to IPFS, get URI
const uri = await uploadToIPFS(eventMetadata);

// Mint ticket
await nft.mint(attendeeAddress, uri);
```

### 3. Certificates & Diplomas

```javascript
// University diploma NFT
const diplomaMetadata = {
  name: "Computer Science Diploma",
  description: "Bachelor's Degree - 2024",
  image: "ipfs://QmDiplomaDesign",
  attributes: [
    { trait_type: "University", value: "ETH Zurich" },
    { trait_type: "Degree", value: "Bachelor of Science" },
    { trait_type: "Year", value: "2024" },
    { trait_type: "Student ID", value: "12345678" }
  ]
};

await nft.mint(studentAddress, diplomaURI);
```

### 4. Gaming Items

```javascript
// Game item NFT
const swordMetadata = {
  name: "Legendary Sword of Fire",
  description: "Rare weapon with +100 damage",
  image: "ipfs://QmSwordImage",
  attributes: [
    { trait_type: "Type", value: "Weapon" },
    { trait_type: "Rarity", value: "Legendary" },
    { trait_type: "Damage", value: 100 },
    { trait_type: "Element", value: "Fire" }
  ]
};

await nft.mint(playerAddress, swordURI);
```

## 🔒 Güvenlik

### Mevcut Güvenlik Önlemleri

#### ✅ 1. OpenZeppelin Audited Contracts

```solidity
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// ↑ Milyonlarca dollar'lık NFT'leri koruyan kod
```

#### ✅ 2. SafeMint

```solidity
_safeMint(to, tokenId);
// ↑ Receiver'ın contract olup olmadığını kontrol eder
```

#### ✅ 3. Ownership Checks

```solidity
require(ownerOf(tokenId) == msg.sender, "You don't own this NFT");
// ↑ Sadece owner transfer edebilir
```

#### ✅ 4. Reentrancy Protection

OpenZeppelin'in ERC721 zaten reentrancy safe:
- Checks-Effects-Interactions pattern
- Transfer hooks ile güvenli

### Best Practices

| ✅ Yapılmalı | ❌ Yapılmamalı |
|-------------|---------------|
| OpenZeppelin kullan | Sıfırdan yaz |
| SafeMint kullan | Direkt mint |
| Event emit et | Silent operations |
| Access control ekle | Public mint |
| Metadata IPFS'te | Merkezi server |

### Production İçin Ek Önemli

#### 1. Max Supply Limiti

```solidity
uint256 public constant MAX_SUPPLY = 10000;

function mint(address to, string memory uri) public {
    require(_nextTokenId < MAX_SUPPLY, "Max supply reached");
    // ...
}
```

#### 2. Minting Pausable

```solidity
import "@openzeppelin/contracts/security/Pausable.sol";

contract SimpleNFT is ERC721, Pausable {
    function mint() public whenNotPaused {
        // ...
    }
}
```

#### 3. Royalty Support (ERC2981)

```solidity
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract SimpleNFT is ERC721, ERC2981 {
    constructor() {
        _setDefaultRoyalty(owner(), 500); // %5 royalty
    }
}
```

#### 4. Whitelist/Allowlist

```solidity
mapping(address => bool) public whitelist;

function mint(address to, string memory uri) public {
    require(whitelist[msg.sender], "Not whitelisted");
    // ...
}
```

## 🚀 Gelecek Özellikler

### Phase 1: Core Improvements ✅
- [x] ERC721 implementasyonu
- [x] Metadata support
- [x] Transfer fonksiyonu
- [x] Owner tracking
- [x] OpenZeppelin entegrasyonu

### Phase 2: Advanced Features 🚧
- [ ] ERC721Enumerable (tüm NFT'leri listeleme)
- [ ] Royalty support (ERC2981)
- [ ] Batch minting (çoklu mint)
- [ ] Whitelist/presale system
- [ ] Max supply limit

### Phase 3: Ecosystem 📋
- [ ] Web3 frontend (React + ethers.js)
- [ ] IPFS auto-upload integration
- [ ] OpenSea collection setup
- [ ] Rarity calculator
- [ ] Metadata generator tool

### Phase 4: Production 🎯
- [ ] Professional audit
- [ ] Mainnet deploy
- [ ] Marketing & community
- [ ] Roadmap execution
- [ ] Partnerships

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz!

### Nasıl Katkıda Bulunulur

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/nft-royalties`)
3. Commit edin (`git commit -m 'feat: Add royalty support'`)
4. Push edin (`git push origin feature/nft-royalties`)
5. Pull Request açın

### Katkı Alanları

- 🐛 Bug reports
- ✨ Feature requests
- 📝 Documentation
- 🎨 Metadata templates
- 🧪 Test coverage
- 🔒 Security improvements

## 📄 Lisans

Bu proje [MIT License](LICENSE) altında lisanslanmıştır.

## 📧 İletişim

**Koray Göktaş**

- GitHub: [@koraygoktas](https://github.com/koraygoktas)
- Project Link: [https://github.com/koraygoktas/solidity/tree/main/simple-nft](https://github.com/koraygoktas//solidity/tree/main/simple-nft)

## 🙏 Teşekkürler

- **OpenZeppelin** - Güvenli NFT implementasyonu
- **Hardhat** - Developer tools
- **IPFS** - Decentralized storage
- **OpenSea** - NFT marketplace
- **Ethereum Foundation** - Blockchain technology

---

## 💡 Faydalı Kaynaklar

### NFT Öğrenme

- 📚 [ERC721 Standard](https://eips.ethereum.org/EIPS/eip-721)
- 🎨 [OpenSea Docs](https://docs.opensea.io/)
- 📦 [IPFS Docs](https://docs.ipfs.tech/)
- 🔐 [OpenZeppelin Docs](https://docs.openzeppelin.com/)

### Tools

- 🖼️ [NFT.Storage](https://nft.storage/) - Free IPFS hosting
- 📌 [Pinata](https://pinata.cloud/) - IPFS pinning
- 🎨 [Alchemy NFT API](https://www.alchemy.com/nft-api)
- 🔍 [Etherscan](https://etherscan.io/)

### Marketplaces

- 🌊 [OpenSea](https://opensea.io/)
- 🎭 [Rarible](https://rarible.com/)
- 🖼️ [Foundation](https://foundation.app/)
- 🏛️ [SuperRare](https://superrare.com/)

---

⭐ **Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!**

🎨 **Happy Minting!** ✨