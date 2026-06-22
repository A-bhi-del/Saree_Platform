import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { SareeProvider } from './context/SareeContext.jsx'
import { RequestProvider } from './context/RequestContext.jsx'
import { FavouriteProvider } from './context/FavouriteContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <SareeProvider>
        <RequestProvider>
          <FavouriteProvider>
            <App />
          </FavouriteProvider>
        </RequestProvider>
      </SareeProvider>
    </AuthProvider>
  </BrowserRouter>,
)
