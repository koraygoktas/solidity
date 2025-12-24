# 🏦 InterestBank - Faizli Ethereum Bankacılık Kontratı

![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=for-the-badge&logo=solidity)
![Hardhat](https://img.shields.io/badge/Hardhat-2.27.2-yellow?style=for-the-badge&logo=hardhat)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Interest Rate](https://img.shields.io/badge/APY-5%25-blue?style=for-the-badge)

InterestBank, Ethereum blockchain üzerinde **otomatik faiz hesaplama** sistemi ile çalışan, merkezsiz bir bankacılık kontratıdır. Kullanıcılar ETH yatırarak yıllık **%5 faiz** kazanabilirler.

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Nasıl Çalışır](#-nasıl-çalışır)
- [Teknolojiler](#-teknolojiler)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [Test](#-test)
- [Deploy](#-deploy)
- [Contract Yapısı](#-contract-yapısı)
- [Faiz Hesaplama Formülü](#-faiz-hesaplama-formülü)
- [Güvenlik](#-güvenlik)
- [SafeBank'tan Farklar](#-safebanktan-farklar)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)
- [İletişim](#-iletişim)

## ✨ Özellikler

- 💰 **Otomatik Faiz Hesaplama**: Saniye bazında hassas faiz hesabı
- 📈 **%5 Yıllık Getiri (APY)**: Sabit faiz oranı
- ⏰ **Compound Interest**: Her işlemde faiz bakiyeye eklenir
- 👥 **Çoklu Kullanıcı**: Her kullanıcı için bağımsız hesap yönetimi
- 📊 **Detaylı Raporlama**: Toplam kazanç ve bekleyen faiz görüntüleme
- 🔒 **Güvenli Transfer**: `call()` metodu ile güvenli ETH transferi
- 📝 **Event Logging**: Tüm işlemler için detaylı event kayıtları
- ✅ **Kapsamlı Test**: 12 farklı senaryo ile test edildi

## 🎯 Nasıl Çalışır

### 1️⃣ Para Yatırma (Deposit)
```
Kullanıcı → 1 ETH yatırır
Sistem → Zaman damgası başlatır
Faiz Hesabı → Başlar ⏰
```

### 2️⃣ Faiz Birikmesi
```
Her saniye → Faiz hesaplanır
Formül → Bakiye × %5 × (Geçen Süre / 1 Yıl)
Örnek → 1 ETH × %5 × (6 ay / 1 yıl) = 0.025 ETH
```

### 3️⃣ Faiz Talep Etme (Claim Interest)
```
Kullanıcı → claimInterest() çağırır
Sistem → Biriken faizi bakiyeye ekler
Yeni Bakiye → Ana Para + Faiz 💰
```

## 🛠 Teknolojiler

- **Solidity** `^0.8.20` - Smart contract geliştirme
- **Hardhat** `^2.27.2` - Ethereum geliştirme framework'ü
- **Ethers.js** `^6.16.0` - Ethereum etkileşim kütüphanesi
- **TypeScript** `^5.9.3` - Tip güvenli geliştirme
- **Hardhat Network Helpers** - Zaman manipülasyonu için
- **Chai** `^4.5.0` - Test assertion kütüphanesi
- **Dotenv** - Environment değişken yönetimi

## 📦 Kurulum

### Gereksinimler

- Node.js >= 16.0.0
- npm veya yarn
- Git
- MetaMask (opsiyonel, frontend için)

### Adımlar

1. Repository'yi klonlayın:
```bash
git clone https://github.com/koraygoktas/solidity/InterestBankProject.git
cd InterestBankProject
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Environment dosyası oluşturun:
```bash
cp .env.example .env
```

`.env` içeriği:
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
```

4. Contract'ı derleyin:
```bash
npm run compile
```

## 🚀 Kullanım

### Local Network'te Hızlı Test

1. Hardhat node'u başlatın:
```bash
npx hardhat node
```

2. Yeni terminalde deploy edin:
```bash
npm run deploy
```

3. **Manuel test scripti** ile etkileşimli test:
```bash
npx hardhat run scripts/manualTest.ts --network localhost
```

Bu script ile:
- ✅ İstediğiniz miktarda ETH yatırabilirsiniz
- ⏰ İstediğiniz kadar zaman simüle edebilirsiniz
- 💰 Faiz hesaplamalarını gerçek zamanlı görebilirsiniz

### Contract Fonksiyonları

#### 1. Para Yatırma
```solidity
function deposit() external payable
```
**JavaScript Kullanımı:**
```javascript
await interestBank.deposit({ value: ethers.parseEther("1.0") });
```

#### 2. Para Çekme
```solidity
function withdraw(uint256 amount) external
```
**JavaScript Kullanımı:**
```javascript
await interestBank.withdraw(ethers.parseEther("0.5"));
```
⚠️ **Not:** Çekim yaparken biriken faiz otomatik olarak bakiyeye eklenir!

#### 3. Faiz Talep Etme
```solidity
function claimInterest() external
```
**JavaScript Kullanımı:**
```javascript
await interestBank.claimInterest();
```

#### 4. Biriken Faizi Görüntüleme
```solidity
function calculateInterest(address user) public view returns(uint256)
```
**JavaScript Kullanımı:**
```javascript
const interest = await interestBank.calculateInterest(userAddress);
console.log("Biriken Faiz:", ethers.formatEther(interest), "ETH");
```

#### 5. Hesap Bilgilerini Görüntüleme
```solidity
function getAccountInfo(address user) external view returns(
    uint256 balance,
    uint256 pendingInterest,
    uint256 totalInterestEarned,
    uint256 lastInterestTime
)
```
**JavaScript Kullanımı:**
```javascript
const [balance, pending, total, lastTime] = await interestBank.getAccountInfo(userAddress);
console.log("Bakiye:", ethers.formatEther(balance));
console.log("Bekleyen Faiz:", ethers.formatEther(pending));
console.log("Toplam Kazanç:", ethers.formatEther(total));
```

## 🧪 Test

### Tüm Testleri Çalıştırma
```bash
npm test
```

### Test Coverage
```bash
npx hardhat coverage
```

### Test Senaryoları

#### ✅ Temel Fonksiyonlar
- Para yatırma işlemi
- Para çekme işlemi
- Bakiye sorgulama

#### ✅ Faiz Hesaplamaları
- 1 yıllık faiz hesabı (%5 → 0.05 ETH / 1 ETH için)
- 6 aylık faiz hesabı (%2.5 → 0.025 ETH / 1 ETH için)
- Kısmi yıl hesaplamaları

#### ✅ İleri Seviye Senaryolar
- Biriken faiz ile para çekme
- Toplam kazanç takibi
- Çoklu kullanıcı bağımsızlığı
- Event emisyonu kontrolleri

#### ✅ Hata Kontrolleri
- Sıfır bakiye ile faiz talebi reddi
- Yetersiz bakiye ile çekim reddi

### Test Sonuçları

```
  InterestBank
    ✔ Should deploy with correct interest rate
    ✔ Should deposit ETH correctly
    ✔ Should calculate interest correctly after 1 year
    ✔ Should claim interest correctly
    ✔ Should calculate interest for partial year
    ✔ Should withdraw with accumulated interest
    ✔ Should track total interest earned
    ✔ Should handle multiple users independently
    ✔ Should emit InterestClaimed event
    ✔ Should reject claiming interest with zero balance
    ✔ Should get complete account info

  12 passing
```

## 🌐 Deploy

### Local Hardhat Network

```bash
npx hardhat run scripts/deploy.ts --network hardhat
```

### Sepolia Testnet

1. `.env` dosyasını düzenleyin (Infura/Alchemy API key ekleyin)

2. Sepolia test ETH alın: [Sepolia Faucet](https://sepoliafaucet.com/)

3. Deploy edin:
```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

4. Deploy çıktısı:
```
🚀 ===== InterestBank Deploy Başlıyor =====

📍 Deploy eden adres: 0x123...
💰 Hesap bakiyesi: 0.5 ETH
🌐 Network: sepolia (Chain ID: 11155111)

⏳ Contract deploy ediliyor...
⛏️  Transaction gönderildi, mining bekleniyor...

✅ Deploy başarılı!

📍 Contract Adresi: 0xABC...

📊 ===== Contract Bilgileri =====
💹 Yıllık Faiz Oranı: 5%
🔢 Rate Denominator: 10000
📅 Saniye/Yıl: 31536000
================================

🔗 Sepolia Etherscan'de Görüntüle:
   https://sepolia.etherscan.io/address/0xABC...
```

## 📊 Contract Yapısı

```
InterestBank
│
├── Structs
│   └── Account
│       ├── balance (uint256) - Ana bakiye
│       ├── lastInterestTime (uint256) - Son faiz zamanı
│       └── totalInterestEarned (uint256) - Toplam kazanç
│
├── Constants
│   ├── ANNUAL_INTEREST_RATE = 500 (5%)
│   ├── RATE_DENOMINATOR = 10000
│   └── SECONDS_PER_YEAR = 31536000
│
├── State Variables
│   └── mapping(address => Account) accounts
│
├── Events
│   ├── Deposit(address user, uint256 amount)
│   ├── Withdraw(address user, uint256 amount)
│   └── InterestClaimed(address user, uint256 interest)
│
└── Functions
    ├── deposit() - Para yatır
    ├── withdraw(uint256) - Para çek
    ├── claimInterest() - Faiz talep et
    ├── calculateInterest(address) - Faiz hesapla (view)
    ├── getAccountInfo(address) - Hesap bilgileri (view)
    ├── getBalance(address) - Bakiye sorgula (view)
    └── getTotalInterestEarned(address) - Toplam kazanç (view)
```

## 🧮 Faiz Hesaplama Formülü

### Matematiksel Formül

```
Faiz = (Bakiye × Faiz Oranı × Geçen Süre) / (Denominator × Yıl)
```

### Solidity İmplementasyonu

```solidity
interest = (balance * ANNUAL_INTEREST_RATE * timeElapsed) 
          / (RATE_DENOMINATOR * SECONDS_PER_YEAR);
```

### Örnek Hesaplamalar

#### Örnek 1: 1 Yıllık Yatırım
```
Bakiye: 1 ETH (10^18 wei)
Süre: 365 gün (31,536,000 saniye)
Oran: 500 / 10,000 = %5

Faiz = (1 × 500 × 31,536,000) / (10,000 × 31,536,000)
     = 0.05 ETH
```

#### Örnek 2: 6 Aylık Yatırım
```
Bakiye: 2 ETH
Süre: 182.5 gün (15,768,000 saniye)
Oran: %5

Faiz = (2 × 500 × 15,768,000) / (10,000 × 31,536,000)
     = 0.05 ETH
     
Yıllık Eşdeğer = 0.05 / 2 = %2.5 ✓
```

#### Örnek 3: 30 Günlük Yatırım
```
Bakiye: 10 ETH
Süre: 30 gün (2,592,000 saniye)
Oran: %5

Faiz = (10 × 500 × 2,592,000) / (10,000 × 31,536,000)
     ≈ 0.0411 ETH
     
Aylık Getiri = %0.411 ✓
```

### Hassasiyet ve Tolerans

Test kodlarında **tolerance** (tolerans) kullanılır çünkü:
- ⏰ Block timestamp'ler tam olarak kontrol edilemez
- 🔢 Integer division nedeniyle küçük yuvarlama farkları
- ⛽ Gas maliyetleri hesaplamalara etki edebilir

```javascript
const tolerance = ethers.parseEther("0.001"); // ±0.001 ETH
expect(actualValue).to.be.closeTo(expectedValue, tolerance);
```

## 🔒 Güvenlik

### Uygulanan Güvenlik Önlemleri

#### ✅ 1. Güvenli Transfer Pattern
```solidity
// ❌ YANLIŞ: transfer() kullanımı
payable(msg.sender).transfer(amount);

// ✅ DOĞRU: call() kullanımı (kullanılan)
(bool success, ) = payable(msg.sender).call{value: amount}("");
require(success, "transfer failed");
```

#### ✅ 2. Checks-Effects-Interactions Pattern
```solidity
// Önce kontroller
require(amount > 0);
require(balance >= amount);

// Sonra state değişikliği
balance -= amount;

// En son external call
payable(msg.sender).call{value: amount}("");
```

#### ✅ 3. Integer Overflow Protection
- Solidity 0.8.x otomatik overflow koruması
- Ekstra güvenlik için SafeMath gerekmez

#### ✅ 4. Input Validation
- Sıfır ve negatif değer kontrolleri
- Bakiye doğrulamaları
- Her işlemde validasyon

### ⚠️ Production İçin Gerekli İyileştirmeler

Bu contract eğitim amaçlıdır. **Production** kullanımı için:

#### 1. Reentrancy Guard
```solidity
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract InterestBank is ReentrancyGuard {
    function withdraw(uint256 amount) external nonReentrant {
        // ...
    }
}
```

#### 2. Access Control
```solidity
import "@openzeppelin/contracts/access/Ownable.sol";

contract InterestBank is Ownable {
    uint256 public interestRate;
    
    function setInterestRate(uint256 newRate) external onlyOwner {
        interestRate = newRate;
    }
}
```

#### 3. Pause Mechanism
```solidity
import "@openzeppelin/contracts/security/Pausable.sol";

contract InterestBank is Pausable {
    function deposit() external payable whenNotPaused {
        // ...
    }
}
```

#### 4. Rate Limiter
- Büyük çekim işlemlerinde sınırlama
- Daily withdrawal limit
- Anti-whale mekanizması

#### 5. Professional Audit
- Smart contract güvenlik şirketlerinden audit
- Bug bounty programı
- Community code review

### 🔐 Güvenlik Best Practices

- ✅ Kod açık kaynak ve incelenebilir
- ✅ Test coverage yüksek
- ✅ Events ile tüm işlemler loglanıyor
- ⚠️ Mainnet öncesi testnet'te kapsamlı test gerekli
- ⚠️ Initial audit yapılmadı (eğitim projesi)

## 🆚 SafeBank'tan Farklar

| Özellik | SafeBank | InterestBank |
|---------|----------|--------------|
| **Temel Fonksiyon** | Basit yatır/çek | Yatır/çek + Faiz |
| **Faiz Sistemi** | ❌ Yok | ✅ %5 APY |
| **Struct Kullanımı** | ❌ | ✅ Account struct |
| **Zaman Takibi** | ❌ | ✅ Block timestamp |
| **Event Çeşitliliği** | 2 event | 3 event |
| **View Fonksiyonlar** | 1 adet | 4 adet |
| **Matematiksel Hesap** | Basit | Compound interest |
| **Test Karmaşıklığı** | Düşük | Orta-Yüksek |
| **Gas Maliyeti** | Düşük | Orta (hesaplamalar nedeniyle) |
| **Kullanım Amacı** | Kripto cüzdan | DeFi bankacılık |

### Kod Karşılaştırması

**SafeBank (Basit):**
```solidity
mapping(address => uint256) private balances;

function deposit() external payable {
    balances[msg.sender] += msg.value;
}
```

**InterestBank (Gelişmiş):**
```solidity
struct Account {
    uint256 balance;
    uint256 lastInterestTime;
    uint256 totalInterestEarned;
}
mapping(address => Account) private accounts;

function deposit() external payable {
    if(accounts[msg.sender].balance > 0) {
        _calculateAndAddInterest(msg.sender);
    }
    accounts[msg.sender].balance += msg.value;
}
```

## 🎓 Öğrenme Kaynakları

Bu projeyi anlamak için:

1. **Solidity Temelleri**
   - Struct kullanımı
   - Mapping yapıları
   - Block timestamp (`block.timestamp`)

2. **DeFi Kavramları**
   - APY (Annual Percentage Yield)
   - Compound interest
   - Liquidity providing

3. **Testing**
   - Hardhat Network Helpers
   - Time manipulation
   - Chai assertions

4. **Best Practices**
   - Checks-Effects-Interactions
   - SafeTransfer patterns
   - Event logging

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen şu adımları izleyin:

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/awesome-interest-calculator`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add awesome calculator'`)
4. Branch'inizi push edin (`git push origin feature/awesome-interest-calculator`)
5. Pull Request açın

### İyileştirme Fikirleri

- 💡 Dinamik faiz oranı sistemi
- 💡 Multiple token support (ERC20)
- 💡 Vade sistemi (lock period)
- 💡 Bonus rewards
- 💡 Referral system
- 💡 Frontend interface (React + Web3)

## 📄 Lisans

Bu proje [MIT License](LICENSE) altında lisanslanmıştır.

## 📧 İletişim

**Koray Göktaş**

- GitHub: [@koraygoktas](https://github.com/koraygoktas)
- Project Link: [https://github.com/koraygoktas/solidity/tree/main/InterestBankProject](https://github.com/koraygoktas/solidity/tree/main/InterestBankProject)

## 🙏 Teşekkürler

- OpenZeppelin ekibine güvenlik best practices için
- Hardhat topluluğuna mükemmel developer tools için
- Ethereum Foundation'a blockchain teknolojisi için

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!

💡 **Eğitim Notu:** Bu contract eğitim ve öğrenme amaçlıdır. Production kullanımı için professional audit ve ek güvenlik önlemleri gereklidir.