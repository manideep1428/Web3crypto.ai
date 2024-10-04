import CryptoList from "@/components/trade/markets/cryptoPage"

export default function CryptoDashboard() {

  return (
    <div className="relative flex h-screen overflow-hidden">
      <main className="flex-1 overflow-hidden p-4 ">
          <CryptoList />
      </main>
    </div>
  )
}