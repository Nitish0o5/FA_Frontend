import React from 'react'
import AppRouter from './routers/AppRouter'
import { MovieProvider } from './context/MovieContext'
import './App.css'

function App() {
  return (
    <MovieProvider>
      <AppRouter />
    </MovieProvider>
  )
}

export default App
