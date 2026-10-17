import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource-variable/figtree'
import '@fontsource-variable/source-serif-4'
// La hoja del rediseño va antes que Tailwind: así sus clases (.btn, .card…) dejan ganar a las utilidades
// (hidden, !min-h-…) cuando las dos aplican al mismo elemento.
import '@/styles/rediseno.css'
import '@/index.css'
import App from '@/App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
