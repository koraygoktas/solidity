# 🏦 SafeBank - Secure Ethereum Banking Contract

![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=for-the-badge&logo=solidity)
![Hardhat](https://img.shields.io/badge/Hardhat-2.22.0-yellow?style=for-the-badge&logo=hardhat)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

SafeBank, Ethereum blockchain üzerinde güvenli para yatırma ve çekme işlemleri yapmanızı sağlayan basit ancak güvenli bir akıllı kontrat projesidir.

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Teknolojiler](#-teknolojiler)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [Test](#-test)
- [Deploy](#-deploy)
- [Contract Yapısı](#-contract-yapısı)
- [Güvenlik](#-güvenlik)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)
- [İletişim](#-iletişim)

## ✨ Özellikler

- 💰 **Güvenli Para Yatırma**: ETH yatırma işlemleri
- 💸 **Güvenli Para Çekme**: Bakiye kontrolü ile para çekme
- 👥 **Çoklu Kullanıcı Desteği**: Her kullanıcı için bağımsız bakiye yönetimi
- 🔒 **Güvenlik Kontrolleri**: Sıfır miktarlı işlemlere karşı koruma
- 📊 **Event Logging**: Her işlem için detaylı event kayıtları
- ✅ **Kapsamlı Test Coverage**: %100'e yakın test kapsama oranı

## 🛠 Teknolojiler

- **Solidity** `^0.8.20` - Smart contract geliştirme dili
- **Hardhat** `^2.22.0` - Ethereum geliştirme ortamı
- **Ethers.js** `^6.4.0` - Ethereum kütüphanesi
- **TypeScript** `^5.0.0` - Tip güvenli geliştirme
- **Chai** `^4.3.0` - Test framework
- **Solidity Coverage** `^0.8.0` - Test coverage analizi

## 📦 Kurulum

### Gereksinimler

- Node.js >= 16.0.0
- npm veya yarn
- Git

### Adımlar

1. Repository'yi klonlayın:
```bash
git clone https://github.com/koraygoktas/solidity/tree/main/SafeBankProject.git
cd SafeBankProject
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Contract'ı derleyin:
```bash
npm run compile
```

## 🚀 Kullanım

### Local Network'te Test

1. Hardhat node'u başlatın:
```bash
npx hardhat node
```

2. Contract'ı deploy edin:
```bash
npx hardhat run scripts/deploy.ts --network localhost
```

### Contract Fonksiyonları

#### 1. Para Yatırma (Deposit)
```solidity
function deposit() external payable
```
**Kullanım:**
```javascript
await safeBank.deposit({ value: ethers.parseEther("1.0") });
```

#### 2. Para Çekme (Withdraw)
```solidity
function withdraw(uint256 amount) external
```
**Kullanım:**
```javascript
await safeBank.withdraw(ethers.parseEther("0.5"));
```

#### 3. Bakiye Sorgulama (Get Balance)
```solidity
function getBalance(address user) external view returns(uint256)
```
**Kullanım:**
```javascript
const balance = await safeBank.getBalance(userAddress);
```

## 🧪 Test

Tüm testleri çalıştırın:
```bash
npm test
```

Test coverage raporu oluşturun:
```bash
npx hardhat coverage
```

### Test Senaryoları

✅ Para yatırma işlemi  
✅ Para çekme işlemi  
✅ Sıfır miktarlı yatırma reddi  
✅ Yetersiz bakiye ile çekme reddi  
✅ Çoklu kullanıcı bağımsızlığı  
✅ Event emisyonu kontrolü  

## 🌐 Deploy

### Local Network

```bash
npx hardhat run scripts/deploy.ts --network localhost
```

### Sepolia Testnet

1. `.env` dosyası oluşturun:
```env
SEPOLIA_URL=your_infura_or_alchemy_url
PRIVATE_KEY=your_private_key
```

2. `hardhat.config.ts` dosyasına Sepolia network ekleyin:
```typescript
sepolia: {
  url: process.env.SEPOLIA_URL,
  accounts: [process.env.PRIVATE_KEY]
}
```

3. Deploy edin:
```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

## 📊 Contract Yapısı

```solidity
SafeBank
├── Mapping: balances (address => uint256)
├── Events
│   ├── Deposit(address indexed user, uint256 amount)
│   └── Withdraw(address indexed user, uint256 amount)
└── Functions
    ├── deposit() - Para yatır
    ├── withdraw(uint256 amount) - Para çek
    └── getBalance(address user) - Bakiye sorgula
```

## 🔒 Güvenlik

### Uygulanan Güvenlik Önlemleri

- ✅ **Checks-Effects-Interactions Pattern**: Önce kontrol, sonra state değişikliği, son olarak external call
- ✅ **Input Validation**: Sıfır ve negatif değer kontrolleri
- ✅ **Balance Verification**: Çekim öncesi bakiye doğrulaması
- ✅ **Private Balances**: Bakiye bilgileri private mapping'de saklanır

### Güvenlik Notları

⚠️ **Uyarı**: Bu contract eğitim amaçlıdır. Production kullanımı için:
- Reentrancy Guard eklenmeli
- Access Control mekanizması uygulanmalı
- Professional audit yapılmalı
- OpenZeppelin kütüphaneleri kullanılmalı

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen şu adımları izleyin:

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

### Commit Mesaj Formatı

- `feat:` Yeni özellik
- `fix:` Bug düzeltmesi
- `docs:` Dokümantasyon
- `test:` Test ekleme/düzeltme
- `refactor:` Code refactoring

## 📄 Lisans

Bu proje [MIT License](LICENSE) altında lisanslanmıştır.

## 📧 İletişim

**Koray Göktaş**

- GitHub: [@koraygoktas](https://github.com/koraygoktas)
- Project Link: [https://github.com/koraygoktas/solidity/tree/main/SafeBankProject](https://github.com/koraygoktas/solidity/tree/main/SafeBankProject)

## 🙏 Teşekkürler

Bu projeyi inceleyen ve katkıda bulunan herkese teşekkürler!

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!