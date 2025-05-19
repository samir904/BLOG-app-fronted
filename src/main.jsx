import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import {Toaster} from "react-hot-toast"
import{Provider} from "react-redux"
import store from './redux/store.js'
import ErrorBoundary from './utils/Errorboundary.jsx'
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
        <Toaster />
      </ErrorBoundary>
    </BrowserRouter>
  </Provider>
);