// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap/dist/js/bootstrap.min.js";
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { Provider } from 'react-redux'
import { store } from './app/store.ts'

import { Home } from './pages/Home.tsx'
import OpenRoute from './components/OpenRoute.tsx'
import PrivateRoute from './components/PrivateRoute.tsx'
import { Layout } from './Layout.tsx'
import { Profile } from './components/dashboard/Profile.tsx'
import { Toaster } from 'react-hot-toast';

const router = createBrowserRouter([
  { path: "/", element: <OpenRoute><App /></OpenRoute> },
  // { path: "/login", element: <OpenRoute><Login /></OpenRoute> },
  {
    path: "/", element: <PrivateRoute><Layout /></PrivateRoute>,
    children: [
      { path: "/", element: <PrivateRoute><App /></PrivateRoute> },
      { path: "/home", element: <PrivateRoute><Home /></PrivateRoute> },
      { path: "/dashboard/profile", element: <PrivateRoute><Profile /></PrivateRoute> }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <Toaster position='top-center' />
    <RouterProvider router={router} />
  </Provider>,
)
