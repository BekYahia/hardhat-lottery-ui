import { useMoralis, useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "@/constants"
import { useEffect, useState } from "react"
import { useNotification } from "@web3uikit/core"
import { Bell, Info } from "@web3uikit/icons"
import { BigNumberish } from "ethers"

import Button from "@/components/Button"
import ListItem from "@/components/ListItem"

interface ContractAddress {
    [key:string] : string[]
}

export default function LotteryEntrance() {
    /* Hooks */
    const { chainId: chainIdHex, isWeb3Enabled, Moralis } = useMoralis()
    const dispatch = useNotification()

    const chainId = parseInt(chainIdHex!)
    const addresses : ContractAddress = contractAddress
    const raffleAddress = chainId in addresses ? addresses[chainId][0] : null

    const [entranceFee, setEntranceFee] = useState("0")
    const [numberOfPlayers, setNumberOfPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("")
    const [raffleState, setRaffleState] = useState(5)

    useEffect(() => {
        if(!isWeb3Enabled) return
        updateUI()

    }, [isWeb3Enabled])

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
            message: "Transaction Send!",
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
            isClosing: !!false,
            ...args,
        })
    }
    async function updateUI() {    
        setEntranceFee((await getEntranceFee())?.toString()!)
        setNumberOfPlayers((await getNumberOfPlayers() as BigNumberish).toString())
        setRecentWinner(await getRecentWinner() as string)
        setRecentWinner(await getRecentWinner() as string)
        setRecentWinner(await getRecentWinner() as string)
        setRaffleState(await getRaffleState() as number)
    }

    return <div className="font-sans">
        { raffleAddress
        ?   (<>
                <ul>
                    <ListItem name="chainID" value={chainId} />
                    <ListItem name="raffle address" value={raffleAddress} />
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
        : <p> No Raffle Address </p>}
    </div>
}

//TODO: raffle balance
//TODO: Liston to contract events and update the ui accordingly