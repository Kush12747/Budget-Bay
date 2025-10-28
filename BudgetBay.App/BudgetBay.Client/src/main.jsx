import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import StripeProvider from './contexts/StripeContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <StripeProvider>
        <App />
        </StripeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
