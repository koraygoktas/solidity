# DAO Governance Platform

Ethereum blockchain üzerinde çalışan merkezi olmayan otonom organizasyon (DAO) yönetim sistemi.

## 🎯 Proje Hakkında

Token sahiplerinin öneri oluşturabildiği, oylama yapabildiği ve onaylanan kararları uygulayabildiği bir DAO platformu.

## ✨ Özellikler

- **Yönetim Tokeni**: ERC20 standardında oy hakkı veren token (1,000,000 adet)
- **Öneri Sistemi**: Öneri oluşturma, oylama ve uygulama
- **Zaman Bazlı Oylama**: 5 dakikalık oylama süresi
- **Delegasyon**: Oy hakkını kendinize veya başkasına devredebilme
- **Modern Arayüz**: Next.js ve Tailwind CSS ile yapılmış kullanıcı dostu arayüz
- **MetaMask Entegrasyonu**: Kolay cüzdan bağlantısı

## 🛠️ Teknolojiler

- Solidity 0.8.20
- Hardhat
- Next.js 16
- ethers.js
- Tailwind CSS
- OpenZeppelin

## 📦 Kurulum

### 1. Projeyi İndir
```bash
git clone https://github.com/koraygoktas/solidity/tree/main/dao-project
cd dao-project
```

### 2. Bağımlılıkları Yükle
```bash
npm install --legacy-peer-deps
cd frontend
npm install
cd ..
```

### 3. Ortam Değişkenlerini Ayarla

`.env` dosyası oluştur:
```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/API_KEY
PRIVATE_KEY=CUZDAN_PRIVATE_KEY
ETHERSCAN_API_KEY=ETHERSCAN_API_KEY
```

### 4. Kontratları Derle
```bash
npx hardhat compile
```

## 🚀 Kullanım

### Sepolia Test Ağına Deploy

1. **Sepolia ETH Al**: [Google Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)

2. **Deploy Et**:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

3. **Adresleri Güncelle**:
`frontend/contracts.json` dosyasına deploy edilen adresleri yaz.

4. **Oy Hakkını Aktifleştir**:
```bash
npx hardhat console --network sepolia
```
```javascript
const token = await ethers.getContractAt("GovernanceToken", "TOKEN_ADRESI");
const [owner] = await ethers.getSigners();
await token.delegate(owner.address);
```

5. **Frontend'i Başlat**:
```bash
cd frontend
npm run dev
```

6. **MetaMask'a Token Ekle**:
   - Sepolia ağını seç
   - Token import et (GovernanceToken adresi)
   - `http://localhost:3000` aç

## 📱 Kullanım Kılavuzu

### Öneri Oluşturma
1. Cüzdanını bağla
2. En az 100 DGOV tokenin olduğundan emin ol
3. Öneri açıklaması yaz
4. "Create Proposal" butonuna tıkla

### Oylama
1. Öneriyi listede bul
2. "Vote YES" veya "Vote NO" seç
3. MetaMask'ta işlemi onayla

### Öneri Uygulama
1. Oylama süresi dolsun (5 dakika)
2. Öneri kabul edildiyse "Execute" butonuna tıkla
3. İşlemi onayla

## ⚠️ Önemli Not

**Hardhat Localhost Zaman Sorunu**: Hardhat'te `block.timestamp` gerçek zamanda ilerlemez. Oylama süreleri doğal olarak dolmaz.

**Çözüm**: Manuel zaman ilerletme:
```javascript
await ethers.provider.send("evm_increaseTime", [301]);
await ethers.provider.send("evm_mine", []);
```

**Not**: Bu sorun sadece Hardhat localhost'ta var. Sepolia ve mainnet'te gerçek zaman çalışır.

## 📁 Proje Yapısı
```
dao-project/
├── contracts/          # Akıllı kontratlar
├── scripts/           # Deploy scriptleri
├── frontend/          # Next.js uygulaması
├── hardhat.config.js  # Hardhat ayarları
└── .env              # Ortam değişkenleri
```

## 🔐 Güvenlik

- `.env` dosyasını asla paylaşma
- Mainnet'e geçmeden önce audit yaptır
- Test ağında kapsamlı test yap

## 📝 Lisans

MIT

## 👨‍💻 Geliştirici

[koray göktaş] - [https://github.com/koraygoktas/]

---

⭐ Projeyi beğendiysen yıldız vermeyi unutma!