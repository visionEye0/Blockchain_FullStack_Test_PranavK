import React from 'react'
import { Outlet, Link } from 'react-router-dom'

export default function App(){
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Full width header */}
      <header className="bg-white shadow">
        <div className="w-full px-10 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold">Crop Insurance DApp</Link>
          <nav className="space-x-4">
            <a href="#" className="text-sm text-gray-600">Docs</a>
          </nav>
        </div>
      </header>

      {/* Wider main content */}
      <main className="w-full px-10 py-8">
        <Outlet />
      </main>
    </div>
  )
}
