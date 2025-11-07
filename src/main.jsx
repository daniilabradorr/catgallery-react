import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')).render(
<React.StrictMode>
{/* uso el StrictMode que me informaod que ayuda a detectar efectos y patrones inseguros*/}
<App />
</React.StrictMode>
)