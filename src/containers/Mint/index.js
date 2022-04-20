import { useState, useEffect } from "react"
import useAuth from "hooks/useAuth"
import { useWeb3React } from "@web3-react/core"
import { useAlert } from "react-alert"

import connectors from "configs/Wallets"

import {
  getPrice,
  mintNFT,
} from "utils/GetNFTContract"

import MintComponent from "components/Mint"

const Mint = () => {
  const { library, account } = useWeb3React()
  const { login, logout } = useAuth()
  const alert = useAlert()

  const [mintCount, setMintCount] = useState(1)
  const [txStatus, setTxStatus] = useState("")

  const [mintPrice, setMintPrice] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      if (!!account) {
        let mintPrice = await getPrice(library, account)
        setMintPrice(mintPrice)
      }
    }

    fetchData()
  }, [library, account])

  const alertInfo = (message) =>
    alert.info(message, {
      onOpen: () => {
        setTxStatus("Pending")
      },
    })

  const alertSuccess = (message) =>
    alert.success(message, {
      onOpen: () => {
        setTxStatus("Success")
      },
    })

  const alertError = (message) =>
    alert.error(message, {
      onOpen: () => {
        setTxStatus("Error")
      },
    })

  const onIncreaseMintCount = () => {
    setMintCount(mintCount + 1)
  }

  const onDecreaseMintCount = () => {
    if (mintCount > 1) {
      setMintCount(mintCount - 1)
    }
  }

  const onMint = async () => {
    if (txStatus !== "Pending" && !!account) {
      await mintNFT(
        library,
        account,
        alertInfo,
        alertSuccess,
        alertError,
        mintCount
      )
    }
  }

  return (
    <MintComponent
      account={account}
      mintCount={mintCount}
      mintPrice={mintPrice}
      walletConfig={connectors[0]}
      connector={login}
      disconnector={logout}
      onIncreaseMintCount={onIncreaseMintCount}
      onDecreaseMintCount={onDecreaseMintCount}
      onMint={onMint}
    />
  )
}

export default Mint
