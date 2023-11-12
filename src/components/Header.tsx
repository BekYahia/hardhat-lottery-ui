import  { ConnectButton } from "@web3uikit/web3"

export default function AppHeader() {
  return <header className="max-w-screen-md mx-auto pt-14 pb-5 flex">
    <h1 className="font-bold text-3xl text-gray-700">Raffle Lottery</h1>
    <div className="ml-auto">
      <ConnectButton moralisAuth={false} />
    </div>
  </header>
}