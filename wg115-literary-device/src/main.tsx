import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import SvgApp from './SvgApp.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SvgApp />
  </StrictMode>,
)
