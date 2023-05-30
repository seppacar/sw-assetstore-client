import {
    useConnectModal,
    ConnectButton,
} from '@rainbow-me/rainbowkit';
import { parseEther, toHex } from 'viem';
import { useAccount, useBalance, useNetwork, usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from "wagmi";

import { useEffect, useState } from 'react';
import { createTransaction, triggerValidateBlockchainTransaction } from '../../../services/apiService';


const WalletPayment = ({ orderDetails }) => {
    const [buttonText, setButtonText] = useState('Connect Wallet')
    const [sendAmount, setSendAmount] = useState('0')
    const [isBalanceEnough, setIsBalanceEnough] = useState(false)
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const { openConnectModal } = useConnectModal();
    const { address, isConnected } = useAccount();
    const { chain: activeChain } = useNetwork();
    const { data: balanceData } = useBalance({ address });


    // Prepare transaction
    const { config } = usePrepareSendTransaction({
        to: '0xE68706DA0cd6F62599ee0A960098F1bcd02B124e',
        value: parseEther(sendAmount.toString()),
        data: toHex(orderDetails._id),
        // onSuccess: () => {
        //     console.log('Success', data)
        // },
        onSuccess: () => {
            setIsButtonDisabled(false)
            setButtonText("Make Payment")
        },
        onError: (error) => {
            // Disable button on error preparing send transaction
            setError(error.message)
            setIsButtonDisabled(true)
            setButtonText("Some error occured !!!")
        },
        // onSettled: (data, error) => {
        //     console.log('Settled', [data, error])
        // }
    })
    // Send Transaction hook, opens payment popup over the connected wallet
    const { data, isLoading: isSendTransactionLoading, isSuccess: isSendTransactionSuccess, error: sendTransactionError, sendTransaction } = useSendTransaction(config)

    // WaitForTransaction hook, waits fo
    const { isLoading: isWaitForTransactionLoading, isSuccess: isWaitForTransactionSuccess, isError: isTransactionError } = useWaitForTransaction({
        hash: data?.hash,
    });

    const handleButtonClick = () => {
        if (!isConnected) {
            openConnectModal()
        }
        else if (isConnected && isBalanceEnough) {
            sendTransaction?.()
        }
    }



    // On wallet connection status change
    useEffect(() => {
        if (isConnected) {
            setButtonText('Make Payment')
        }
        else { }
    }, [isConnected])

    // On chain change
    useEffect(() => {
        // Set new send amount set for selected chain
        setSendAmount(orderDetails.amount[activeChain?.nativeCurrency.symbol] ?? 0)
    }, [activeChain, orderDetails])

    // On balance data change (also changes on chain change since balance data changes)
    useEffect(() => {
        setIsBalanceEnough(balanceData?.value > parseEther(orderDetails.amount.ETH.toString()))
    }, [balanceData, orderDetails])

    // New transaction triggerred send transaction data to server then validate with hash later
    useEffect(() => {
        if (isWaitForTransactionLoading) {
            // Create transactiondata object with required fields and push to server
            const transactionData = {
                orderId: orderDetails._id,
                method: "blockchain",
                data: {
                    chainId: activeChain.id,
                    chainName: activeChain.name,
                    transactionHash: data.hash,
                }
            }
            createTransaction(transactionData)
                .then((response) => {
                    console.log(response.data)
                })
                .catch((error) => {
                    console.log(error)
                })
                .finally(() => {
                })
        }
        else if (isWaitForTransactionSuccess) {
            triggerValidateBlockchainTransaction(data.hash)
                .then((response) => {
                    setIsLoading(true)
                })
                .catch((error) => {
                    console.log(error)
                    setError(error.response.data.error)
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isWaitForTransactionLoading, isWaitForTransactionSuccess])

    // If transaction were success post hash to server so we can validate
    if (isWaitForTransactionSuccess) {
        // Make validation at the server here
        if (isLoading) {
            return (<h3>Loading...</h3>)
        }
        else if (error) {
            return (<div>{error}</div>)
        }
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <h3>Transaction success validation triggered when 6 confirmations items will appear in userdashboard</h3>
            </div>
        )
    }
    // If transaction sent data to server than validate there
    // else if (isLoading) {
    //     return (<p>Loading...</p>)
    // }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h6>Injected cryptocurrency wallet payment option</h6>
            <div className='row'>
                <div className='col-lg-4'>{orderDetails.amount.ETH} Ethereum (ETH)</div>
                <div className='col-lg-4'>{orderDetails.amount.AVAX} Avalanche (AVAX)</div>
                <div className='col-lg-4'>{orderDetails.amount.MATIC} Polygon (MATIC)</div>
                <div className='col-lg-12'>
                    <b>Amount: </b>{sendAmount} {balanceData?.symbol}
                </div>
            </div>

            {/* Show account modal if connected */}
            {isConnected && <ConnectButton></ConnectButton>}
            <button
                className="btn btn-outline-success"
                onClick={handleButtonClick}
                disabled={isButtonDisabled || isSendTransactionLoading || isWaitForTransactionLoading || isSendTransactionSuccess}
            >
                {buttonText}
            </button>
            {error && (
                <div className="alert alert-success" role="alert">
                    {isTransactionError ? 'Error' : 'No Error'}
                </div>
            )}
            <div className="alert alert-success" role="alert">
                {isBalanceEnough ? 'enough' : 'not'}
            </div>
            {isWaitForTransactionLoading ? <p style={{ color: "green", fontSize: "13px" }}>Loading: <br />hash:{data?.hash}</p> : <p></p>}
            {isWaitForTransactionSuccess ? <p style={{ color: "green", fontSize: "13px" }}>Success: <br />hash:{data?.hash}</p> : <p></p>}
            {sendTransactionError && <p>{sendTransactionError.message}</p>}

        </div>
    )
}

export default WalletPayment