import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import PolicyList from './pages/PolicyList'
import PolicyDetail from './pages/PolicyDetail'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<PolicyList />} />
          <Route path="policy/:id" element={<PolicyDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)