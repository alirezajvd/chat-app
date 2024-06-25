import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import './index.css';
//import App from './App';
import LogIn from './pages/LogIn'
import SignUp from './pages/Signup';
import Home from './pages/Home';


const routes = [
  {
    path: "/",
    element: <Navigate to = "/LogIn" replace/>
  },
  {
    path: "/login",
    element: <LogIn/>
  },
  {
    path: "/signup",
    element: <SignUp />
  },
  {
    path: "/home",
    element: <Home />
  }
]
const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router = {router}/>
  </React.StrictMode>
);

