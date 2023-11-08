// a manual way to connect to wallet without using web3toolkit
import { useEffect } from "react"
import { useMoralis } from "react-moralis"

export default function AppHeader() {

    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis()

    useEffect(() => {
        if(isWeb3Enabled) return
        if(localStorage.getItem("connected")) enableWeb3()

    }, [isWeb3Enabled])

    useEffect(()=> {
        Moralis.onAccountChanged(account => {
            if(account) return;

            localStorage.removeItem("connected")
            deactivateWeb3()
        })
    }, [])

    return <header>

        {account
        ? <div>Connected to {account.slice(0, 7)}...{account.slice(account.length - 5)}</div> 
        : <button disabled={isWeb3EnableLoading} onClick={async () => {

            const connected = await enableWeb3()
            if(connected) localStorage.setItem("connected", "connected")
            
        }}>Connect</button>
        }

    </header>
}