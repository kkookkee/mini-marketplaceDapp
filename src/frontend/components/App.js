import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navigation from './Navbar';
import Home from './Home';
import Create from './Create';
import MyListedItems from './MyListedItems';
import MyPurchases from './MyPurchases';
import MarketPlaceAbi from '../contractsData/Marketplace.json'
import MarketPlaceAddress from '../contractsData/Marketplace-address.json'
import NftAddress from '../contractsData/NFT-address.json'
import NftAbi from '../contractsData/NFT.json'
import { useState } from 'react'
import { ethers } from 'ethers'
import { Spinner } from 'react-bootstrap'

function App() {

  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [nft, setNFT] = useState({})
  const [marketplace, setMarketplace] = useState({})

  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    setAccount(accounts[0])
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload()
    })

    window.ethereum.on('accoutsChanged', async function (accounts) {
      setAccount(accounts[0])
      await web3Handler()
    })

    loadContracts(signer)
  }

  const loadContracts = async (signer) => {
    const marketplace = new ethers.Contract(MarketPlaceAddress.address, MarketPlaceAbi.abi, signer)
    setMarketplace(marketplace)
    const nft = new ethers.Contract(NftAddress.address, NftAbi.abi, signer)
    setNFT(nft)
    setLoading(false)
  }

  return (
    <BrowserRouter>
      <div className='App'>
        <>
          <Navigation web3Handler={web3Handler} account={account} />
        </>
        <div>
          {
            loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', minHeight: '80vh', alignItems:'center'}}>
                <Spinner animation='border' style={{ display: 'flex' }}/>
                <p className='mx-3 my-0'>Waiting for Metamask's connection...</p>
              </div>
            ) : (
              <Routes>
                <Route path="/" element={
                  <Home marketplace={marketplace} nft={nft}></Home>
                }></Route>
                <Route path="/create" element={
                  <Create marketplace={marketplace} nft={nft}></Create>
                }></Route>
                <Route path="/my-listed-items" element={
                  <MyListedItems marketplace={marketplace} nft={nft} account={account}></MyListedItems>
                }></Route>
                <Route path="/my-purchases" element={
                  <MyPurchases marketplace={marketplace} nft={nft} account={account}></MyPurchases>
                }></Route>
              </Routes>
            )
          }
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;