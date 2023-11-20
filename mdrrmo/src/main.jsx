import React from 'react'
import ReactDOM from 'react-dom/client'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import App from './App.jsx'
import './App.css'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import AuthContextWrapper from './context/AuthContext';
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    
    queries: {
      refetchInterval: 50000, 
      refetchOnWindowFocus: true,
    },
    
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  
  <QueryClientProvider client= {queryClient}>
   <AuthContextWrapper>
   <ToastContainer />
    <App />
  </AuthContextWrapper>
  <ReactQueryDevtools initialIsOpen= {false}/>
  </QueryClientProvider>

  </React.StrictMode>
)
