import React from 'react'
import { Link } from 'react-router-dom'

export default function PolicyCard({policy}){
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between">
        <div>
          <h3 className="font-semibold">{policy.crop_type}</h3>
          <p className="text-sm text-gray-500">Coverage: ₹{policy.coverage_amount}</p>
        </div>
        <div className="text-right">
          <p className={`text-sm ${policy.status === 'active'? 'text-green-600':'text-gray-500'}`}>{policy.status}</p>
          <p className="text-xs text-gray-400">Token: {policy.token_id ?? '—'}</p>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <Link to={`/policy/${policy._id || policy.id}`} className="text-indigo-600 text-sm">Details →</Link>
      </div>
    </div>
  )
}
