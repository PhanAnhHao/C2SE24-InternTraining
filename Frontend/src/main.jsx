import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import { store } from './redux/store.js';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <StrictMode>
            <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <App />
            </SnackbarProvider>
        </StrictMode>
    </Provider>,
)