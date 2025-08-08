import React, {useEffect, useState} from 'react'
import PolicyCard from '../components/PolicyCard'
import { getAllPolicies, getUserPolicies } from '../api'

export default function PolicyList(){
  const [available, setAvailable] = useState([])
  const [userPolicies, setUserPolicies] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState(null)

  useEffect(()=>{
    load()
  },[])

  async function load(){
    setLoading(true)
    setError(null)
    try{
      const [availRes, userRes] = await Promise.all([getAllPolicies(), getUserPolicies()])
      setAvailable(availRes.data || [])
      setUserPolicies(userRes.data || [])
    }catch(err){
      console.error(err)
      setError('Failed to load policies. Check API server and network.')
    }finally{ setLoading(false) }
  }

  const displayed = [...userPolicies, ...available].filter(p=>{
    if (filter === 'all') return true
    return p.status === filter
  })

  return (
    <div className="min-h-screen bg-gray-100 px-8 py-10">
      <div className="max-w-[2000px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-300 pb-5 mb-8">
          <h2 className="text-4xl font-bold tracking-tight text-gray-800">Policies</h2>
          <div className="flex items-center gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="claimed">Claimed</option>
            </select>
            <button
              onClick={load}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-lg shadow"
            >
              Refresh
            </button>
          </div>
        </div>
  
        {/* Status messages */}
        {loading && (
          <div className="p-8 bg-white rounded-lg shadow text-center text-gray-600 text-lg">
            Loading policies...
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-lg">
            {error}
          </div>
        )}
  
        {/* Policies grid */}
        <div className="grid grid-cols-3 gap-8">
          {displayed.map((p) => (
            <div
              key={p._id || p.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-200"
            >
              <PolicyCard policy={p} />
            </div>
          ))}
        </div>
  
        {/* Empty state */}
        {!loading && displayed.length === 0 && (
          <div className="mt-16 text-center text-gray-500 text-xl">
            No policies found.
          </div>
        )}
      </div>
    </div>
  );
  
  
}