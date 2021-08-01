import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import 'styling/Root.css'
import App from './App'
import { AppProvider } from './context/AppContext'

ReactDOM.render(
    <StrictMode>
        <AppProvider>
            <App />
        </AppProvider>
    </StrictMode>,
    document.getElementById('root')
)
