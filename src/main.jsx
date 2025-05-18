import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Browserrouter from "react-router-dom"
createRoot(document.getElementById('root')).render(
  <Browserrouter>
  <App />
  </Browserrouter>
    
  
)
