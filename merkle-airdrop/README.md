# Merkle Airdrop

Whitelist'teki adreslerin, tüm listeyi zincirde saklamadan token claim
edebildiği bir airdrop kontratı. Amaç: **Merkle proof** mantığını uçtan
uca (off-chain ağaç üretimi -> on-chain doğrulama) görmek.

## Neden bu yaklaşım?

Naif yöntem: binlerce adresi bir `mapping(address => uint256)` içinde
tutup deploy etmek. Bu hem çok pahalı (her `SSTORE` ~20.000 gas) hem de
her yeni whitelist için kontratı yeniden deploy etmeyi gerektirir.

Merkle yaklaşımı: Tüm listeyi tek bir 32 byte'lık `merkleRoot`'a
sıkıştırırsın. Kullanıcı claim ederken kendi "kanıtını" (proof) getirir,
kontrat sadece birkaç `keccak256` işlemiyle bu kanıtı doğrular. Kontrat
listeyi hiç bilmez, sadece özetini bilir.

## Proje yapısı

contracts/
MerkleAirdrop.sol -> ana kontrat, proof doğrulaması elle yazıldı
MockERC20.sol -> test için basit token
scripts/
generate-merkle-tree.js -> whitelist'ten ağaç + proof üretir
data/
whitelist.json -> adres + miktar listesi (girdi)
merkleRoot.json -> üretilen root (çıktı)
proofs.json -> her adres için hazır proof (çıktı)
test/
MerkleAirdrop.test.js -> 4 senaryo: başarılı claim, çift claim,
listede olmayan adres, yanlış miktar

## Kurulum

```bash
npm install
```

## 1. Merkle ağacını üret

`data/whitelist.json` içindeki adresler Hardhat'in varsayılan test
hesaplarıyla (Account #1-4) eşleşecek şekilde ayarlandı, bu yüzden
testler ekstra ayar gerektirmeden çalışır. Gerçek adreslerini görmek
için `npx hardhat node` çalıştırıp çıktıdaki adresleri kullanabilirsin.

```bash
node scripts/generate-merkle-tree.js
```

Bu komut `data/merkleRoot.json` ve `data/proofs.json` dosyalarını üretir.

## 2. Derle ve test et

```bash
npx hardhat build
npx hardhat test
```

4 test senaryosunun da geçmesi lazım.

## Kontratta dikkat edilecek üç kritik nokta

1. **Çift hash'leme** (`keccak256(keccak256(abi.encode(...)))`): Tek
   katman kullanmak second-preimage saldırısına açık kapı bırakabilir.

2. **`sortPairs: true`**: Hem JS tarafında (merkletreejs) hem Solidity
   tarafında (`computedHash <= proofElement` kontrolü) hash'leri her
   zaman aynı sırayla birleştiriyoruz. Bu ikisi tutmazsa geçerli bir
   proof bile reddedilir — gerçek projelerde en sık yapılan hata budur.

3. **Checks-Effects-Interactions**: `hasClaimed[msg.sender] = true`
   satırı, token transferinden ÖNCE yapılıyor (reentrancy koruması).

## Nasıl çalışıyor (özet)

- Kontrat listeyi hiç bilmez, sadece `merkleRoot` (32 byte) bilir
- Kullanıcı `claim(amount, proof)` çağırırken kendi miktarını ve
  proof'unu kendisi sağlar
- Kontrat, verilen adres + miktardan bir leaf hash'i hesaplar, proof
  dizisindeki hash'lerle birleştirerek root'a tırmanır
- Elde edilen hash kayıtlı `merkleRoot`'a eşitse claim onaylanır —
  bu bir "arama" değil, tek bir eşitlik kontrolüdür

## Sıradaki adım fikirleri

- `claim` fonksiyonuna bir `deadline` ekleyip süre sonunda kalan
  token'ları owner'ın geri çekebilmesini sağla
- Aynı mantığı NFT whitelist mint için uyarla (miktar yerine tokenId)
- Merkle root'u güncellenebilir yap (yeni bir airdrop turu için) ve
  bunun güvenlik açısından risklerini düşün