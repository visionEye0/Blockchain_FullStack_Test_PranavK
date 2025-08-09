import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getAllPolicies, getPolicyByUserId, postPolicy, postClaimPolicy } from '../api'
import { getWeb3, mintPolicyNFT, claimPolicy } from '../web3'
import config from '../config'
import contract_factory from "../blockchain/contractABIs/CropInsuranceNFT.json"

const CONTRACT_ABI = contract_factory.abi

export default function PolicyDetail() {
  const { id } = useParams()
  const [policy, setPolicy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [purchaseLoading, setPurchaseLoading] = useState(false)  // separate loading state
  const [claimLoading, setClaimLoading] = useState(false)        // separate loading state
  const [error, setError] = useState(null)
  const [account, setAccount] = useState(null)
  const [userPolicies, setUserPolicies] = useState([])

  useEffect(() => {
    if (!account) connect()
  }, [])
  
  useEffect(() => {
    if (account) loadPolicy()
  }, [account, id])
  
  async function loadPolicy() {
    setLoading(true)
    setError(null)
    try {
      const availRes = await getAllPolicies()
      let combined = availRes?.data ?? []
  
      if (account) {
        const userRes = await getPolicyByUserId(account)
        setUserPolicies(userRes?.data ?? [])
        combined = [...(userRes?.data ?? []), ...combined]
      }
  
      console.log("Combined policies:", combined)
      const found = combined.find(p => String(p._id || p.id) === String(id))
      console.log("Found policy:", found)
  
      setPolicy(found || null)
    } catch (err) {
      console.error(err)
      setError('Could not load policy')
      setPolicy(null)
    } finally {
      setLoading(false)
    }
  }
  

  async function connect() {
    try {
      const w3 = await getWeb3()
      const accounts = await w3.eth.getAccounts()
      if (accounts && accounts.length > 0) setAccount(accounts[0])
      else setError('No accounts found in wallet')
    } catch (err) {
      setError(err.message)
    }
  }

  function expirationDateCalculate(months) {
    const now = new Date();
    const futureDate = new Date(now);
    futureDate.setMonth(futureDate.getMonth() + months);
    return Math.floor(futureDate.getTime() / 1000); // seconds
  }

  async function handlePurchase() {
    if (!account) return setError('Connect your wallet first')
    if (!policy) return
    setPurchaseLoading(true)
    setError(null)
    try {
      const expirationDate = expirationDateCalculate(policy.duration_months)
      const metadata = {
        farmerId: account,
        cropType: policy.crop_type,
        coverageAmount: policy.coverage_amount,
        premium: policy.premium,
        expirationDate
      }

      const receipt = await mintPolicyNFT(CONTRACT_ABI, config.contractAddress, account, metadata)

      let tokenId
      if (receipt?.events?.Transfer?.returnValues) {
        tokenId = receipt.events.Transfer.returnValues.tokenId
      } else if (receipt?.events) {
        const transferEvent = Object.values(receipt.events).find(e => e.event === 'Transfer')
        tokenId = transferEvent?.returnValues?.tokenId
      }

      if (!tokenId) throw new Error('Could not retrieve tokenId from mint transaction')

      if (typeof tokenId === 'bigint') tokenId = tokenId.toString()

      await postPolicy({
        farmer_id: metadata.farmerId,
        crop_type: metadata.cropType,
        coverage_amount: metadata.coverageAmount,
        premium: metadata.premium,
        expiration_date: metadata.expirationDate,
        token_id: tokenId
      })

      alert(`Minted NFT with Token ID: ${tokenId} — refresh after block confirmation`)
      await loadPolicy()
    } catch (err) {
      console.error(err)
      setError('Purchase failed: ' + (err.message || err))
    } finally {
      setPurchaseLoading(false)
    }
  }

  async function handleClaim() {
    if (!account) return setError('Connect your wallet first')
    if (!policy || !policy.token_id) return setError('Policy has no token to claim')

    setClaimLoading(true)
    setError(null)

    try {
      await claimPolicy(CONTRACT_ABI, config.contractAddress, account, policy.token_id)
      await postClaimPolicy({
        farmer_id: account,
        token_id: policy.token_id
      })

      alert('Claim successful — blockchain + backend updated')
      await loadPolicy()
    } catch (err) {
      console.error(err)
      setError('Claim failed: ' + (err.message || err))
    } finally {
      setClaimLoading(false)
    }
  }

  if (loading) return <div>Loading policy...</div>
  if (!loading && !policy) return <div>Policy not found.</div>

  const statusClasses = {
    active: 'bg-green-600 text-white px-3 py-1 rounded font-semibold inline-block',
    claimed: 'bg-yellow-500 text-white px-3 py-1 rounded font-semibold inline-block'
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold">{policy.crop_type}</h2>
        <p className="text-sm text-gray-600">Coverage: ₹{policy.coverage_amount}</p>
        <p className="text-sm text-gray-600">Premium: ₹{policy.premium}</p>

        <p className="text-sm">
          Status: <span className={statusClasses[policy.status] || ''}>{policy.status}</span>
        </p>

        <p className="text-sm text-gray-600">Token: {policy.token_id ?? '—'}</p>
        <p className="text-sm text-gray-600">
          Expires:{' '}
          {policy.expiration_date
            ? new Date(policy.expiration_date * 1000).toLocaleString()
            : `${policy.duration_months} months`}
        </p>
      </div>

      {error && <div className="text-red-700">{error}</div>}

      <div className="flex gap-3">
        {!account ? (
          <button
            onClick={connect}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="text-sm text-gray-600">Connected: {account}</div>
        )}

        <button
          onClick={handlePurchase}
          disabled={purchaseLoading || claimLoading}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          {purchaseLoading ? 'Processing...' : 'Purchase (Mint NFT)'}
        </button>

        <button
          onClick={handleClaim}
          disabled={claimLoading || purchaseLoading || !policy.token_id}
          className="px-4 py-2 bg-yellow-600 text-white rounded"
        >
          {claimLoading ? 'Processing...' : 'Claim Insurance'}
        </button>
      </div>
    </div>
  )
}
