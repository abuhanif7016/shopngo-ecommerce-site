import './App.css'
import { useState, useEffect } from 'react'
import NavBar from './components/NavBar'
import Home from './components/Home'
import Electronics from './components/Electronics'
import Apparel from './components/Apparel'
import Beauty from './components/Beauty'
import Bags from './components/Bags'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    const path = window.location.pathname
    if (path === '/electronics') {
      setCurrentPage('electronics')
    } else if (path === '/apparel') {
      setCurrentPage('apparel')
    } else if (path === '/beauty') {
      setCurrentPage('beauty')
    } else if (path === '/bags') {
      setCurrentPage('bags')
    } else {
      setCurrentPage('home')
    }
  }, [])

  return (
    <>
      <NavBar />
      {currentPage === 'electronics' ? <Electronics /> : currentPage === 'apparel' ? <Apparel /> : currentPage === 'beauty' ? <Beauty /> : currentPage === 'bags' ? <Bags /> : <Home />}
    </>
  )
}

export default App
