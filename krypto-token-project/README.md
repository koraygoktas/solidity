# 🪙 KRYPTO Token (KRP) - ERC20 Token Project

![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=for-the-badge&logo=solidity)
![Hardhat](https://img.shields.io/badge/Hardhat-2.27.2-yellow?style=for-the-badge&logo=hardhat)
![ERC20](https://img.shields.io/badge/Standard-ERC20-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**KRYPTO Token (KRP)**, Ethereum blockchain üzerinde çalışan, **ERC20 standardına uygun** özel bir kripto para projesidir. Mint, burn, transfer gibi temel token fonksiyonlarını içerir ve **modern bir web arayüzü** ile kullanıcı dostu bir deneyim sunar.

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Demo & Canlı Arayüz](#-demo--canlı-arayüz)
- [Teknolojiler](#-teknolojiler)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [Smart Contract](#-smart-contract)
- [Web Arayüzü](#-web-arayüzü)
- [Test](#-test)
- [Deploy](#-deploy)
- [ERC20 Standartları](#-erc20-standartları)
- [Güvenlik](#-güvenlik)
- [Roadmap](#-roadmap)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)
- [İletişim](#-iletişim)

## ✨ Özellikler

### Smart Contract Özellikleri
- 🪙 **ERC20 Uyumlu**: Standart token fonksiyonları
- ⚡ **Mint (Token Basma)**: Owner yeni token basabilir
- 🔥 **Burn (Token Yakma)**: Herkes kendi tokenlarını yakabilir
- 📤 **Transfer**: Token gönderme işlemleri
- 🔐 **Approve/TransferFrom**: Yetki verme sistemi
- 👑 **Ownable**: Owner kontrolü
- 📊 **1,000,000 Initial Supply**: Başlangıç token miktarı

### Web Arayüzü Özellikleri
- 🦊 **MetaMask Entegrasyonu**: Tek tıkla bağlan
- 💰 **Canlı Bakiye Takibi**: Otomatik güncelleme (her 30 saniye)
- 📱 **Responsive Tasarım**: Mobil uyumlu modern arayüz
- 🎨 **Gradient & Glassmorphism**: Modern UI/UX
- 🔔 **Bildirim Sistemi**: Her işlem için görsel geri bildirim
- 👑 **Owner Panel**: Sadece owner için mint özelliği
- 🌐 **Sepolia Testnet**: Test ağında çalışır

## 🌐 Demo & Canlı Arayüz

### Web Arayüzü Özellikleri
- **Token Gönderme**: Başka adreslere KRP gönder
- **Token Yakma**: Tokenleri kalıcı olarak yok et
- **Token Basma** (Owner): Yeni token oluştur
- **Bakiye Görüntüleme**: Anlık bakiye ve toplam arz
- **Sepolia Testnet**: Ücretsiz test ağı desteği

### Ekran Görüntüleri

```
┌─────────────────────────────────────┐
│        🪙 KRYPTO                    │
│    Kendi kripto paranız - KRP      │
├─────────────────────────────────────┤
│  ● Bağlı | 0x1234...5678            │
│  📍 Contract: 0xd382...B74          │
├─────────────────────────────────────┤
│  Bakiyem      Toplam Arz     Token │
│    100.00      1000000        KRP  │
├─────────────────────────────────────┤
│  📤 Gönder   🔥 Yak    ⚡ Bas      │
└─────────────────────────────────────┘
```

## 🛠 Teknolojiler

### Backend (Smart Contract)
- **Solidity** `^0.8.20` - Smart contract dili
- **Hardhat** `^2.27.2` - Ethereum geliştirme framework'ü
- **Ethers.js** `^6.16.0` - Blockchain etkileşimi
- **Chai** `^4.5.0` - Test framework
- **Hardhat Toolbox** - Tüm geliştirme araçları

### Frontend (Web Interface)
- **HTML5/CSS3** - Yapı ve stil
- **JavaScript (ES6+)** - İnteraktif fonksiyonlar
- **Ethers.js** `5.7.2` (CDN) - Web3 kütüphanesi
- **Google Fonts** - Orbitron & Poppins fontları
- **Responsive Design** - Mobil uyumlu

### Blockchain
- **Sepolia Testnet** - Test ağı
- **MetaMask** - Cüzdan bağlantısı
- **Infura/Alchemy** - RPC provider

## 📦 Kurulum

### Gereksinimler

- Node.js >= 16.0.0
- npm veya yarn
- Git
- MetaMask browser eklentisi
- Sepolia test ETH

### Adım 1: Projeyi Klonlayın

```bash
git clone https://github.com/koraygoktas/krypto-token-project.git
cd krypto-token-project
```

### Adım 2: Bağımlılıkları Yükleyin

```bash
npm install
```

### Adım 3: Environment Ayarları

`.env` dosyası oluşturun:

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=your_metamask_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key (opsiyonel)
```

**⚠️ Önemli Notlar:**
- `PRIVATE_KEY` başında `0x` olmamalı
- `.env` dosyasını asla GitHub'a push etmeyin
- Test cüzdanı kullanın, gerçek varlıklar koymayın

### Adım 4: Contract'ı Derleyin

```bash
npx hardhat compile
```

## 🚀 Kullanım

### 1. Local Test Network

```bash
# Terminal 1: Hardhat node başlat
npx hardhat node

# Terminal 2: Deploy et
npx hardhat run scripts/deploy.js --network localhost
```

### 2. Sepolia Testnet'e Deploy

#### 2.1 Sepolia Test ETH Alın
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)

#### 2.2 Deploy Edin
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

#### 2.3 Deploy Çıktısı
```
🚀 KRYPTO Token deploy ediliyor...

✅ KRYPTO Token deploy edildi!
📍 Kontrat Adresi: 0xd382087e1323b79A2450E05FCe9dDa2E0d716B74
🪙 Initial Supply: 1000000 KRP

📋 Bu adresi krypto-token-dapp.html dosyasına yapıştırın!

👤 Owner: 0x1234...5678
💰 Owner Bakiye: 1000000.0 KRP

🔍 Etherscan'de görüntülemek için:
https://sepolia.etherscan.io/address/0xd382087e1323b79A2450E05FCe9dDa2E0d716B74
```

### 3. Web Arayüzünü Kullanma

#### 3.1 Contract Adresini Güncelleyin

`krypto-token-dapp.html` dosyasını açın ve contract adresini değiştirin:

```javascript
// KONTRAT ADRESİNİ DEPLOY SONRASI GİRİN!
const CONTRACT_ADDRESS = "0xYourContractAddress";
```

#### 3.2 HTML Dosyasını Açın

```bash
# Direkt browser'da açın
open krypto-token-dapp.html

# Veya local server ile (önerilen)
npx http-server .
```

#### 3.3 MetaMask'ı Bağlayın

1. "🦊 MetaMask Bağla" butonuna tıklayın
2. MetaMask'ta onaylayın
3. Sepolia ağına geçin (otomatik olur)
4. Bağlantı kuruldu! ✅

## 📜 Smart Contract

### Contract Yapısı

```solidity
KryptoToken
├── State Variables
│   ├── name: "Krypto"
│   ├── symbol: "KRP"
│   ├── decimals: 18
│   ├── totalSupply: uint256
│   ├── owner: address
│   ├── balanceOf: mapping(address => uint256)
│   └── allowance: mapping(address => mapping(address => uint256))
│
├── Events
│   ├── Transfer(from, to, value)
│   ├── Approval(owner, spender, value)
│   ├── Mint(to, amount)
│   └── Burn(from, amount)
│
├── Modifiers
│   └── onlyOwner()
│
└── Functions
    ├── constructor(initialSupply) - Token oluştur
    ├── transfer(to, value) - Token gönder
    ├── approve(spender, value) - İzin ver
    ├── transferFrom(from, to, value) - İzinli transfer
    ├── mint(to, amount) - Token bas (owner)
    ├── burn(amount) - Token yak
    └── _mint(to, amount) - Internal mint
```

### Fonksiyonlar Detaylı

#### 1. Transfer (Token Gönderme)
```solidity
function transfer(address _to, uint256 _value) public returns (bool)
```
**Kullanım:**
```javascript
await token.transfer("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", 
                     ethers.parseEther("100"));
```

#### 2. Approve (İzin Verme)
```solidity
function approve(address _spender, uint256 _value) public returns (bool)
```
**Kullanım:**
```javascript
await token.approve("0xSpenderAddress", ethers.parseEther("50"));
```

#### 3. TransferFrom (İzinli Transfer)
```solidity
function transferFrom(address _from, address _to, uint256 _value) public returns (bool)
```
**Kullanım:**
```javascript
await token.transferFrom("0xFromAddress", "0xToAddress", 
                         ethers.parseEther("25"));
```

#### 4. Mint (Token Basma - Sadece Owner)
```solidity
function mint(address _to, uint256 _amount) public onlyOwner
```
**Kullanım:**
```javascript
await token.mint("0xRecipient", ethers.parseEther("10000"));
```

#### 5. Burn (Token Yakma)
```solidity
function burn(uint256 _amount) public
```
**Kullanım:**
```javascript
await token.burn(ethers.parseEther("500"));
```

### Gas Optimizasyonları

- ✅ `uint256` yerine `uint8` (decimals için)
- ✅ Event logging ile state değişiklikleri izleniyor
- ✅ Internal `_mint()` fonksiyonu ile kod tekrarı önlendi
- ✅ Solidity 0.8.x ile otomatik overflow koruması

## 🌐 Web Arayüzü

### Özellikler

#### 1. MetaMask Bağlantısı
- Otomatik Sepolia ağı tespiti
- Chain switch önerisi
- Account değişikliğinde otomatik yenileme

#### 2. Token İşlemleri

**Transfer (Gönder):**
```html
Alıcı Adresi: 0x...
Miktar: 100 KRP
[Gönder Butonu]
```

**Burn (Yak):**
```html
Yakılacak Miktar: 50 KRP
[Yak Butonu]
```

**Mint (Bas - Sadece Owner):**
```html
Alıcı Adresi: 0x...
Miktar: 1000 KRP
[Bas Butonu] 👑
```

#### 3. Canlı Veri
- Bakiye: Her 30 saniyede otomatik güncelleme
- Total Supply: Anlık arz takibi
- Owner Badge: Owner için özel işaretleme

#### 4. Bildirimler
```
✅ Başarılı İşlemler
⚠️ Uyarılar
❌ Hatalar
⏳ İşlem Bekliyor
```

### Responsive Design

```css
Desktop (> 768px)
├── 3 Kolonlu Grid
├── Büyük Logo
└── Yan Yana Kartlar

Mobile (< 768px)
├── 1 Kolonlu Grid
├── Küçük Logo
└── Üst Üste Kartlar
```

### Color Scheme

```css
Primary: #6366f1 (Indigo)
Secondary: #ec4899 (Pink)
Accent: #8b5cf6 (Purple)
Background: #0f0f23 (Dark Navy)
Success: #10b981 (Green)
```

## 🧪 Test

### Test Çalıştırma

```bash
# Tüm testler
npx hardhat test

# Verbose mode
npx hardhat test --verbose

# Gas raporu
REPORT_GAS=true npx hardhat test

# Coverage
npx hardhat coverage
```

### Test Senaryoları

#### ✅ Deployment Tests
- Doğru isim ve sembol kontrolü
- Owner'a initial supply ataması
- Decimals (18) doğrulaması

#### ✅ Transfer Tests
- Başarılı token transferi
- Yetersiz bakiye hatası
- Sıfır adres koruması

#### ✅ Burn Tests
- Token yakma işlemi
- Total supply düşüşü kontrolü
- Event emisyonu

#### ✅ Mint Tests (Bonus)
- Owner mint yetkisi
- Non-owner rejection
- Total supply artışı

### Test Çıktısı

```
  KryptoToken
    Deployment
      ✔ Doğru isim ve sembol olmalı (234ms)
      ✔ Owner'a initial supply verilmeli (156ms)
    Transfer
      ✔ Token transferi yapılabilmeli (345ms)
      ✔ Yetersiz bakiyede hata vermeli (123ms)
    Burn
      ✔ Token yakılabilmeli (267ms)

  5 passing (1s)
```

## 🌐 Deploy

### Sepolia Testnet Deploy Adımları

#### 1. Environment Hazırlığı

```bash
# .env dosyası oluştur
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_private_key
```

#### 2. Test ETH Al

- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Faucet](https://www.infura.io/faucet/sepolia)
- Minimum 0.1 ETH önerilir

#### 3. Deploy

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

#### 4. Verify (Opsiyonel)

```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS 1000000
```

### Deploy Sonrası Checklist

- [ ] Contract adresi kopyalandı
- [ ] Etherscan'de görüntülendi
- [ ] HTML dosyasına adres eklendi
- [ ] MetaMask'ta token eklendi
- [ ] Test transferi yapıldı

### MetaMask'a Token Ekleme

1. MetaMask'ı aç
2. "Import tokens" tıkla
3. Contract adresini yapıştır: `0xYourAddress`
4. Otomatik: KRP - Krypto
5. "Add" tıkla
6. Bakiyenizi görün! 🎉

## 📊 ERC20 Standartları

### Temel ERC20 Fonksiyonları

| Fonksiyon | Tip | Açıklama |
|-----------|-----|----------|
| `name()` | view | Token adı |
| `symbol()` | view | Token sembolü |
| `decimals()` | view | Ondalık basamak |
| `totalSupply()` | view | Toplam arz |
| `balanceOf(address)` | view | Adres bakiyesi |
| `transfer(address, uint256)` | write | Transfer |
| `approve(address, uint256)` | write | İzin ver |
| `allowance(address, address)` | view | İzin miktarı |
| `transferFrom(address, address, uint256)` | write | İzinli transfer |

### Ek Fonksiyonlar (Bizim Implementasyonumuz)

| Fonksiyon | Erişim | Açıklama |
|-----------|--------|----------|
| `mint(address, uint256)` | onlyOwner | Token bas |
| `burn(uint256)` | public | Token yak |
| `owner()` | view | Owner adresi |

### ERC20 vs KryptoToken

```
Standard ERC20        KryptoToken (KRP)
├── transfer()       ✅ Var
├── approve()        ✅ Var
├── transferFrom()   ✅ Var
├── balanceOf()      ✅ Var
├── totalSupply()    ✅ Var
└── Standard         ✅ Uyumlu

Ek Özellikler
├── mint()           ✅ Owner yetkisi
├── burn()           ✅ Herkes yakabilir
└── onlyOwner        ✅ Modifier
```

## 🔒 Güvenlik

### Mevcut Güvenlik Önlemleri

#### ✅ 1. Input Validation
```solidity
require(_to != address(0), "Gecersiz adres");
require(balanceOf[msg.sender] >= _value, "Yetersiz bakiye");
```

#### ✅ 2. Overflow Protection
- Solidity 0.8.x otomatik overflow/underflow koruması
- SafeMath gerekmez

#### ✅ 3. Owner Control
```solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Sadece owner!");
    _;
}
```

#### ✅ 4. Event Logging
- Tüm önemli işlemler event ile loglanıyor
- Blockchain üzerinde şeffaf takip

### ⚠️ Production İçin Öneriler

#### 1. OpenZeppelin Kullanımı (Önerilen)
```solidity
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KryptoToken is ERC20, Ownable {
    constructor() ERC20("Krypto", "KRP") {
        _mint(msg.sender, 1000000 * 10**18);
    }
}
```

**Avantajlar:**
- ✅ Audited kod
- ✅ Battle-tested
- ✅ Standart uyumlu
- ✅ Gas optimized

#### 2. Pausable Mechanism
```solidity
import "@openzeppelin/contracts/security/Pausable.sol";

function transfer() public whenNotPaused {
    // ...
}
```

#### 3. Max Supply Limit
```solidity
uint256 public constant MAX_SUPPLY = 10_000_000 * 10**18;

function mint() public onlyOwner {
    require(totalSupply + amount <= MAX_SUPPLY);
    // ...
}
```

#### 4. Time Lock
```solidity
uint256 public unlockTime;

modifier whenUnlocked() {
    require(block.timestamp >= unlockTime);
    _;
}
```

#### 5. Professional Audit
- **SlowMist**
- **CertiK**
- **OpenZeppelin Audit**

### Güvenlik Best Practices

| ✅ Yapılmalı | ❌ Yapılmamalı |
|-------------|---------------|
| Test coverage %100 | Private key GitHub'a atma |
| Multiple test wallets | Mainnet'te test yapma |
| Gradual feature release | Audit olmadan launch |
| Bug bounty program | Upgradeability olmadan deploy |

## 🗺 Roadmap

### Phase 1: Temel Geliştirme ✅
- [x] ERC20 implementasyonu
- [x] Mint/Burn fonksiyonları
- [x] Web arayüzü
- [x] Sepolia deploy
- [x] Test coverage

### Phase 2: Geliştirmeler 🚧
- [ ] OpenZeppelin migration
- [ ] Advanced web dashboard
- [ ] Multi-wallet support (WalletConnect)
- [ ] Token staking mechanism
- [ ] Governance features

### Phase 3: Ekosistem 📋
- [ ] DEX liquidity pool (Uniswap)
- [ ] NFT marketplace entegrasyonu
- [ ] DAO yapısı
- [ ] Cross-chain bridge
- [ ] Mobile app

### Phase 4: Production 🎯
- [ ] Professional audit
- [ ] Mainnet deploy
- [ ] CEX listing
- [ ] Marketing campaign
- [ ] Community building

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen şu adımları izleyin:

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-token-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-token-feature`)
5. Pull Request açın

### Katkı Alanları

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation
- 🎨 UI/UX improvements
- 🧪 Test coverage
- 🔒 Security enhancements

### Commit Mesaj Formatı

```
feat: Yeni özellik
fix: Bug düzeltmesi
docs: Dokümantasyon
style: Formatting
refactor: Code refactoring
test: Test ekleme
chore: Maintenance
```

## 📄 Lisans

Bu proje [MIT License](LICENSE) altında lisanslanmıştır.

## 📧 İletişim

**Koray Göktaş**

- GitHub: [@koraygoktas](https://github.com/koraygoktas)
- Project Link: [https://github.com/koraygoktas/solidity/tree/main/krypto-token-project](https://github.com/koraygoktas/solidity/tree/main/krypto-token-project)
- Sepolia Contract: [0xd382087e1323b79A2450E05FCe9dDa2E0d716B74](https://sepolia.etherscan.io/address/0xd382087e1323b79A2450E05FCe9dDa2E0d716B74)

## 🙏 Teşekkürler

- **OpenZeppelin** - ERC20 standartları ve best practices
- **Hardhat** - Mükemmel developer experience
- **Ethers.js** - Web3 kütüphanesi
- **MetaMask** - Wallet provider
- **Ethereum Foundation** - Blockchain technology

---

## 💡 Ekstra Notlar

### Faydalı Linkler

- 📚 [Solidity Docs](https://docs.soliditylang.org/)
- 🔧 [Hardhat Docs](https://hardhat.org/docs)
- 🪙 [ERC20 Standard](https://eips.ethereum.org/EIPS/eip-20)
- 🦊 [MetaMask Docs](https://docs.metamask.io/)
- 🔍 [Sepolia Etherscan](https://sepolia.etherscan.io/)

### Sık Sorulan Sorular

**Q: Gerçek para mı?**  
A: Hayır, bu bir test token'ıdır. Sepolia testnet'te çalışır.

**Q: Mainnet'e deploy edebilir miyim?**  
A: Audit olmadan önerilmez. OpenZeppelin kullanın ve audit yaptırın.

**Q: Token'larımı nasıl görebilirim?**  
A: MetaMask'ta "Import tokens" ile contract adresini ekleyin.

**Q: Gas ücretleri ne kadar?**  
A: Sepolia'da ücretsiz test ETH kullanırsınız.

---

⭐ **Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!**

🚀 **Happy Coding & HODL!** 🪙