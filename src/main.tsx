import { createRoot } from 'react-dom/client'
import "@github/spark/spark"
import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'
import "./main.css"

// Mount the app
const container = document.getElementById('root')
if (!container) {
  console.error('Root element not found')
} else {
  try {
    const root = createRoot(container)
    root.render(<App />)
    console.log('App mounted successfully')
  } catch (error) {
    console.error('Failed to mount app:', error)
    try {
      const root = createRoot(container)
      root.render(<ErrorFallback error={error as Error} />)
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError)
      container.innerHTML = `
        <div style="padding: 20px; background: #f8f9fa; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
          <div style="text-align: center;">
            <h1 style="color: #dc2626;">Critical Error</h1>
            <p style="color: #6b7280;">Unable to load the application. Please refresh the page.</p>
            <button onclick="window.location.reload()" style="margin-top: 16px; padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Refresh Page
            </button>
          </div>
        </div>
      `
    }
  }
}