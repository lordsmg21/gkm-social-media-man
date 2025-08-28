import { createRoot } from 'react-dom/client'
import "@github/spark/spark"
import "./main.css"
import App from './App.tsx'

// Mount the app
const container = document.getElementById('root')

if (container) {
  try {
    const root = createRoot(container)
    root.render(<App />)
    console.log('App mounted successfully')
  } catch (error) {
    console.error('Failed to render app:', error)
    container.innerHTML = `
          <div style="text-align: center; padding: 20px; font-family: Inter, sans-serif;">
            <p style="color: #ef4444; font-size: 18px; margin-bottom: 10px;">Failed to load application</p>
            <p style="color: #6b7280; font-size: 14px;">Please refresh the page and try again</p>
          </div>
        `
  }
} else {
  console.error('Root element not found')
}