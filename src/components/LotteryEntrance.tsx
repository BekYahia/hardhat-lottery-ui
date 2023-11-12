import { useMoralis, useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "@/constants"
import { useEffect, useState } from "react"
import { useNotification } from "@web3uikit/core"
import { Bell } from "@web3uikit/icons"
import Button from "@/components/Button"
import ListItem from "@/components/ListItem"

interface ContractAddress {
    [key:string] : string[]
}

export default function LotteryEntrance() {
    /* Hooks */
    const { chainId: chainIdHex, isWeb3Enabled, Moralis, web3 } = useMoralis()
    const dispatch = useNotification()

    const chainId = parseInt(chainIdHex!)
    const addresses : ContractAddress = contractAddress
    const raffleAddress = chainId in addresses ? addresses[chainId][0] : null

    const [entranceFee, setEntranceFee] = useState("0")
    const [numberOfPlayers, setNumberOfPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("")
    const [raffleState, setRaffleState] = useState(0)
    const [raffleBalance, setRaffleBalance] = useState("0")
    
    useEffect(() => {
        if(!isWeb3Enabled || !raffleAddress) return
        
        updateUI()
        const contract = raffleEvents()

        return () => {
            contract.then(e => e.removeAllListeners())
        }

    }, [isWeb3Enabled, chainId])
    

    async function raffleEvents() {
        const startBlockNumber = (await web3?.getBlockNumber())!
        const eth = Moralis.web3Library
        const contract = new eth.Contract(raffleAddress!, abi, web3?.getSigner())

        contract.on('RaffleEnter', (_event, listener) => {
            if(listener.blockNumber <= startBlockNumber) return

            handleNotification({
                type: "success",
                message: `Welcome to Raffle: ${listener.args.player}`,
            })
            updateUI()
            console.log("RaffleEnter", listener)
        })
        contract.on("WinnerPicked",  (_event, listener) => {
            if(listener.blockNumber <= startBlockNumber) return

            handleNotification({
                type: "success",
                title: "Raffle Winner",
                message: `The Raffle winner is ${listener.args.winner}`,
            })
            updateUI()
            console.log("WinnerPicked", listener)
        })

        return contract;
    }


    /* View Functions */
    const contractAttributes = {
        abi,
        contractAddress: raffleAddress!,
        params: {},
    }
    const { runContractFunction: enterRaffle, isLoading, isFetching} = useWeb3Contract({
        ...contractAttributes,
        functionName: "enterRaffle",
        msgValue: entranceFee,
    })
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        ...contractAttributes,
        functionName: "getEntranceFee",
    })
    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        ...contractAttributes,
        functionName: "getNumberOfPlayers",
    })
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        ...contractAttributes,
        functionName: "getRecentWinner",
    })
    const { runContractFunction: getRaffleState } = useWeb3Contract({
        ...contractAttributes,
        functionName: "getRaffleState",
    })

    async function handleSuccess(tx: any) {
        await tx.wait(1)
        handleNotification({
            type: "success",
            message: "Transaction Send, wait or confirmation!",
        })
        updateUI()
    }
    function handleError(error: any) {
        console.log(error)
        handleNotification({
            type: "error",
            message: error.message ?? "TX Failed!"
        })
        updateUI()
    }
    function handleNotification(args: any) {
        dispatch({
            position: "topR",
            title: "Raffle Entrance",
            icon: <Bell />,
            ...args,
        })
    }
    async function updateUI() {    
        setEntranceFee((await getEntranceFee())?.toString()!)
        setNumberOfPlayers((await getNumberOfPlayers())!.toString())
        setRecentWinner(await getRecentWinner() as string)
        setRaffleState(await getRaffleState() as number)
        web3?.getBalance(raffleAddress!).then(acc => setRaffleBalance(acc.toString()))
    }

    return <div className="font-sans">
        { raffleAddress
        ?   (<>
                <ul>
                    <ListItem name="chainID" value={chainId} />
                    <ListItem name="raffle address" value={raffleAddress} />
                    <ListItem name="raffle balance" value={`${Moralis.Units.FromWei(raffleBalance)}ETH`} />
                    <ListItem name="entrance fee" value={`${Moralis.Units.FromWei(entranceFee)}ETH`} />
                    <ListItem name="total players" value={numberOfPlayers} />
                    <ListItem name="recent winner" value={recentWinner} />
                    <ListItem name="raffle state" value={raffleState === 0 ? "Open" : "Calculating"} />
                </ul>
                
                <hr className="h-px my-5 bg-gray-200 border-0 dark:bg-gray-500" />

                <Button
                    loading={isLoading || isFetching}
                    title="Enter Raffle"
                    onClick={async () => {
                        await enterRaffle({
                        onSuccess: handleSuccess,
                        onError: handleError,
                    })
                }} />
            </>)
        : <p> Not supported Network <code className="font-semibold">{chainIdHex && parseInt(chainIdHex!)}</code>, use <code className="font-semibold">{ Object.keys(addresses) }</code> instead. </p>}
    </div>
}