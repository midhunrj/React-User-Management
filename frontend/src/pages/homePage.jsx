import React from 'react'
import Header from '../components/Header'
import Profile from '../components/profile'
import Home from '../components/home'
import { useSelector } from 'react-redux'

function HomePage
() {
  const data=useSelector(state=>state.auth.data)
  return (
    <div>
      
        <Header/>
        <Home/>
</div>
  )
}

export default HomePage
