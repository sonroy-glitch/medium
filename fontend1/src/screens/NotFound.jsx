import React from 'react'
import {useNavigate } from "react-router-dom"
const NotFound = () => {
 const navigate = useNavigate();
 function goHome(){
  navigate('/')
 }
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white text-center">
      <h1 className="text-9xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-4">Oops! It looks like you're lost in space.</p>
      <p className="text-lg mb-8">The page you're looking for can't be found.</p>
     
      <button
        onClick={goHome}
        className="px-6 py-3 bg-amber-300 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Take Me Home
      </button>
    </div>
    </div>
  )
}

export default NotFound