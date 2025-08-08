import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import { getAllPolicies, getUserPolicies, postPolicy } from '../api'
import { getWeb3, mintPolicyNFT, claimPolicy } from '../web3'
import config from '../config'
import contract_factory from "../blockchain/contractABIs/CropInsuranceNFT.json"

// Placeholders for ABI - replace with real ABI
const CONTRACT_ABI = contract_factory.abi

export default function PolicyDetail(){
  const { id } = useParams()
  const [policy, setPolicy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [txLoading, setTxLoading] = useState(false)
  const [error, setError] = useState(null)
  const [account, setAccount] = useState(null)

  useEffect(()=>{ loadPolicy() },[id])

  async function loadPolicy(){
    setLoading(true); setError(null)
    try{
      const [availRes, userRes] = await Promise.all([getAllPolicies(), getUserPolicies()])
      const combined = [...userRes.data, ...availRes.data]
      const found = combined.find(p => (p._id || p.id) === id)
      console.log("found ===== ", found)
      setPolicy(found || null)
    }catch(err){
      setError('Could not load policy')
    }finally{ setLoading(false) }
  }

  async function connect(){
    try{
      const w3 = await getWeb3()
      const accounts = await w3.eth.getAccounts()
      setAccount(accounts[0])
    }catch(err){
      setError(err.message)
    }
  }

  function expirationDateCalculate(months) {
    const now = new Date();
    const futureDate = new Date(now.getFullYear(), now.getMonth() + months, now.getDate());
    
    // Handle overflow (e.g., December + 3 months → March next year)
    if (futureDate.getMonth() !== (now.getMonth() + months) % 12) {
      futureDate.setFullYear(now.getFullYear() + Math.floor((now.getMonth() + months) / 12));
    }
  
    // Return Unix timestamp (seconds)
    return Math.floor(futureDate.getTime() / 1000);
  }

  async function handlePurchase(){
    if (!account) return setError('Connect your wallet first')
    if (!policy) return
    setTxLoading(true); setError(null)
    try{
      // prepare metadata for mint call - adapt as per your contract
      const metadata = { 
        farmerId: account, 
        cropType: policy.crop_type, 
        coverageAmount: policy.coverage_amount, 
        premium: policy.premium, 
        expirationDate: expirationDateCalculate(policy.duration_months)
      }
      await mintPolicyNFT(CONTRACT_ABI, config.contractAddress, account, metadata)
      await postPolicy({
        farmer_id: metadata.farmerId,
        crop_type: metadata.cropType,
        coverage_amount: metadata.coverageAmount,
        premium: metadata.premium,
        expiration_date: metadata.expirationDate
      })
      alert('Mint transaction submitted — refresh after block confirmation')
    }catch(err){
      console.error(err)
      setError('Purchase failed: ' + (err.message || err))
    }finally{ setTxLoading(false) }
  }

  async function handleClaim(){
    if (!account) return setError('Connect your wallet first')
    if (!policy || !policy.token_id) return setError('Policy has no token to claim')
    setTxLoading(true); setError(null)
    try{
      await claimPolicy(CONTRACT_ABI, config.contractAddress, account, policy.token_id)
      alert('Claim transaction submitted — check events for payout')
    }catch(err){
      console.error(err)
      setError('Claim failed: ' + (err.message || err))
    }finally{ setTxLoading(false) }
  }

  if (loading) return <div>Loading policy...</div>
  if (!policy) return <div>Policy not found.</div>

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold">{policy.crop_type}</h2>
        <p className="text-sm text-gray-600">Coverage: ₹{policy.coverage_amount}</p>
        <p className="text-sm text-gray-600">Premium: ₹{policy.premium}</p>
        <p className="text-sm text-gray-600">Status: {policy.status}</p>
        <p className="text-sm text-gray-600">Token: {policy.token_id ?? '—'}</p>
        <p className="text-sm text-gray-600">Expires: {policy.expiration_date ? new Date(policy.expiration_date).toLocaleString() : '—'}</p>
      </div>

      {error && <div className="text-red-700">{error}</div>}

      <div className="flex gap-3">
        {!account ? (
          <button onClick={connect} className="px-4 py-2 bg-indigo-600 text-white rounded">Connect Wallet</button>
        ) : (
          <div className="text-sm text-gray-600">Connected: {account}</div>
        )}

        <button onClick={handlePurchase} disabled={txLoading} className="px-4 py-2 bg-green-600 text-white rounded">{txLoading ? 'Processing...' : 'Purchase (Mint NFT)'}</button>

        <button onClick={handleClaim} disabled={txLoading || !policy.token_id} className="px-4 py-2 bg-orange-600 text-white rounded">{txLoading ? 'Processing...' : 'Claim Insurance'}</button>
      </div>

      <div className="text-sm text-gray-500 pt-4">Notes: Admin-predefined policies are fetched from the available-policies endpoint. User-owned policies come from the root API route and contain token ids when minted.</div>
    </div>
  )
}