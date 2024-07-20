import React,{useEffect, useState} from 'react'
import './home.css'
import { useSelector, useDispatch } from 'react-redux'
//import { increment,decrement,wordChange } from './auth/authslice'
import { useNavigate } from 'react-router-dom'

function Home() {
 // const dispatch = useDispatch()
  const navigate=useNavigate()
  const { user } = useSelector((state) => state.auth)
 // const [word,setWord]=useState('')
  useEffect(()=>{
    if(!user)
    {
      navigate('/')
    }
  },[user])
  // const wordchange=()=>{
  //   dispatch(wordChange(word))
  // }
  return (
    <div className='home-container'>
      <div className='home-content'>
        <h1>Welcome to Your Home page</h1>
        <p>This is your personalized dashboard. Here are some things you can do:</p>

        <p>View and manage your profile</p>

        {/* <span>{counter}</span>
        <button onClick={handleIncrement}>+</button>
        <buton onClick={handledecrement}>-</buton> */}
        {/* <input type='text' placeholder='Enter a word' onChange={(e)=>setWord(e.target.value)}/>
      <button onClick={wordchange} className='btn-block '>new wird</button> */}
      </div>
    </div>
  )
}

export default Home