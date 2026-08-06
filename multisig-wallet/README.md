# MultiSig Wallet

Solidity ile yazılmış, birden fazla sahibin (owner) onayıyla çalışan bir çoklu imza (multi-signature) cüzdan projesi. Hardhat ile geliştirildi, manuel olarak test edildi ve MetaMask ile bağlanan bir web arayüzü içerir.

## Nedir bu proje?

Bu cüzdan, tek bir kişinin private key'i çalınsa bile fonların güvende kalmasını sağlar. Önceden belirlenmiş owner adreslerinden **belirli bir sayısı** (örneğin 3 owner'dan en az 2'si) bir işlemi onaylamadan, o işlem gerçekleşemez.

**Akış:** bir owner işlem önerir (submit) → diğer owner'lar onaylar (confirm) → yeterli onay toplanınca herhangi bir owner işlemi çalıştırır (execute). Bir owner isterse onayını geri çekebilir (revoke).

## Özellikler

- Owner listesi ve gereken onay sayısı, deploy sırasında belirlenir (örn. 3 owner'dan 2'si — "2-of-3")
- `submitTransaction` — yeni işlem önerisi oluşturma
- `confirmTransaction` — bir işlemi onaylama
- `revokeConfirmation` — verilen onayı geri çekme
- `executeTransaction` — yeterli onay toplanınca işlemi çalıştırma
- Kontrata doğrudan ETH gönderilebilir (`receive`), otomatik `Deposit` event'i tetiklenir
- Tüm önemli aksiyonlar event olarak yayınlanır (Deposit, SubmitTransaction, ConfirmTransaction, RevokeConfirmation, ExecuteTransaction)
- Güvenlik kontrolleri: sadece owner'lar işlem yapabilir, var olmayan/çalıştırılmış işlemler üzerinde işlem yapılamaz, aynı kişi aynı işlemi iki kez onaylayamaz

## Proje yapısı

```
multisig-wallet/
├── contracts/
│   └── MultiSigWallet.sol      # Ana kontrat
├── frontend/
│   ├── index.html               # Web arayüzü
│   ├── app.js                   # MetaMask + ethers.js entegrasyonu
│   └── style.css                # Görsel tasarım
├── NOTES.md                     # Manuel test komutları (Hardhat console)
└── README.md
```

## Kurulum

```bash
npm install
```

## Yerel ağda çalıştırma

**1. Terminal — yerel blockchain'i başlat:**

```bash
npx hardhat node
```

Bu, 20 test hesabı (her birinde 10.000 sahte ETH) üreten yerel bir Ethereum ağı başlatır. Bu terminali açık bırak.

**2. Terminal — kontratı deploy et:**

```bash
npx hardhat console --network localhost
```

Console'da sırasıyla:

```javascript
const { ethers } = await (await import("hardhat")).default.network.connect();
const [owner1, owner2, owner3] = await ethers.getSigners();

const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
const wallet = await MultiSigWallet.deploy(
    [owner1.address, owner2.address, owner3.address],
    2
);

await wallet.getAddress(); // deploy edilen adresi verir
```

Detaylı manuel test komutları için `NOTES.md` dosyasına bakabilirsin.

## Web arayüzünü çalıştırma

1. MetaMask'e yerel ağı ekle:
   - Network Name: `Hardhat Localhost`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency: `ETH`
2. Yukarıdaki test hesaplarından birinin private key'ini (1. terminaldeki `npx hardhat node` çıktısından) MetaMask'e import et.
3. `frontend/index.html` dosyasını bir local server ile aç (örn. VSCode "Live Server" eklentisi).
4. Eğer kontrat adresi değiştiyse, `frontend/app.js` içindeki `CONTRACT_ADDRESS` değerini güncelle.
5. "Connect Wallet" butonuna tıkla ve MetaMask ile bağlan.

## Web arayüzü ile yapılabilenler

- Owner listesini, gereken onay sayısını ve kontrat bakiyesini görüntüleme
- Kontrata ETH yatırma (Deposit formu)
- Yeni işlem önerme (alıcı adres + miktar)
- Bekleyen işlemleri onaylama (Confirm), onayı geri çekme (Revoke), yeterli onay varsa çalıştırma (Execute)
- MetaMask hesap değişikliklerini otomatik algılama

## Kullanılan teknolojiler

- **Solidity** ^0.8.24 — akıllı kontrat
- **Hardhat 3** — geliştirme ortamı, yerel ağ, derleme
- **ethers.js v6** — blockchain ile iletişim (hem console hem frontend'de)
- **MetaMask** — cüzdan bağlantısı
- Düz **HTML / CSS / JavaScript** — frontend (framework yok)

## Notlar

- Test hesapları ve private key'ler Hardhat'in **sabit, herkese açık** test anahtarlarıdır — sadece yerel geliştirme için güvenlidir, gerçek ağlarda asla kullanılmamalıdır.
- `npx hardhat node` her yeniden başlatıldığında blockchain sıfırlanır; kontratın yeniden deploy edilmesi gerekir.