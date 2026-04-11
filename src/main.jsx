import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RedstoneProvider } from '@prohetamine/redstone'
//import { RedstoneProvider } from '/Users/stas/Desktop/redstone'
import { StasPayProvider } from 'stas-pay'
import { NotifyProvider } from './components/notify.jsx'
import { ModalWindowProvider } from './components/modal-window/index.jsx'

const config = {
  metadata: {
    name: 'De2FA',
    description: 'Example DApp with React Redstone',
    url: 'https://de2fa.prohetamine.ru',
    icons: ['https://de2fa.prohetamine.ru/icon.svg']
  },
  projectId: '1febfd92481d4ea997711d2ac4a363c0',
  host: '/de2fa-testnet/'
}

createRoot(document.getElementById('root')).render(
  <RedstoneProvider config={config}>
    <StasPayProvider>
      <ModalWindowProvider>
        <NotifyProvider>
          <App />
        </NotifyProvider>
      </ModalWindowProvider>
    </StasPayProvider>
  </RedstoneProvider>
)
