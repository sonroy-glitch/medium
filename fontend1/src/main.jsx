import React,{useEffect} from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {RecoilRoot} from "recoil";
import {BrowserRouter} from "react-router-dom"



ReactDOM.createRoot(document.getElementById('root')).render(
 <div className="sc">
  <BrowserRouter >
  <RecoilRoot>
    <App />
    </RecoilRoot>
  </BrowserRouter>
  </div>,
  
)
