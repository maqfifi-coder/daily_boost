import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './ui/App.jsx'
import Paywall from './ui/Paywall.jsx'
import Privacy from './ui/Privacy.jsx'
import Terms from './ui/Terms.jsx'
import Settings from './ui/Settings.jsx'
import './ui/styles.css'
import { registerSW } from './swRegistration.js'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/pro', element: <Paywall /> },
  { path: '/privacy', element: <Privacy /> },
  { path: '/terms', element: <Terms /> },
  { path: '/settings', element: <Settings /> },
])

registerSW()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
