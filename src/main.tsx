import ReactDOM from 'react-dom/client'
import './assets/styles/index.scss'
import { App } from './App'
import { BrowserRouter } from 'react-router-dom'
import { UserContextProvider } from './context/userContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <UserContextProvider>
      <App />
    </UserContextProvider>
  </BrowserRouter>
)
