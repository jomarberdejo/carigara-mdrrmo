import React from 'react'
import ReactDOM from 'react-dom/client'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import App from './App.jsx'
import './App.css'

import AuthContextWrapper from './context/AuthContext';
import './index.css'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  
  <QueryClientProvider client= {queryClient}>
   <AuthContextWrapper>
   <ToastContainer />
    <App />
  </AuthContextWrapper>
  </QueryClientProvider>

  </React.StrictMode>
)
