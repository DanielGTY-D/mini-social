import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import './index.css'
import "normalize.css";
import Register from './views/Register';
import AuthLayout from './layout/auth/AuthLayout';
import Login from './views/login'
import VerificationEmail from './views/verificationEmail'
import Home from './views/home'
import MainLayout from './layout/main/mainLayout'
import Profile from './views/Profile'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>

      <ReactQueryDevtools  />
      <BrowserRouter>
        <Routes>
          <Route path='auth' element={<AuthLayout />}>
            <Route path='register' element={<Register />} />
            <Route path='login' element={<Login />} />
            <Route path='verify' element={<VerificationEmail />} />
          </Route>

          <Route path='home' element={<MainLayout />}>
            <Route index element={<Home />} />
          </Route>

          <Route path='admin' element={<MainLayout />}>
            <Route path='profile/:id?' element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
