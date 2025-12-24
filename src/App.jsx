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

  const handlePageChange = (page) => {
    setCurrentPage(page)
    const path = page === 'home' ? '/' : `/${page}`
    window.history.pushState(null, '', path)
  }

  useEffect(() => {
    let path = window.location.pathname;
    if (path === '/' && window.location.search.startsWith('?/')) {
      path = window.location.search.slice(1);
    }
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
      <NavBar setCurrentPage={handlePageChange} />
      {currentPage === 'electronics' ? <Electronics /> : currentPage === 'apparel' ? <Apparel /> : currentPage === 'beauty' ? <Beauty /> : currentPage === 'bags' ? <Bags /> : <Home />}
    </>
  )
}

export default App
