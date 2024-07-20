import React, { useEffect } from 'react'
import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from './auth/authslice'
import './header.css'

function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const location = useLocation()

  // useEffect(()=>{
  // if(!user)
  // {
  //   console.log("redirect to logout");
  //   navigate('/')
  // }
  // },[])
  const onLogout = () => {
    console.log('logout')
  
    // dispatch(reset())
    dispatch(logout(user)).then(()=>
    navigate('/'))
   
  }

  return (
    <header className='header'>
      <div className='logo'>
        <FaSignInAlt/>
        {location.pathname === '/home' ? (
          
          <Link to='/profile'> go to Profile</Link>
        ) : (
          <Link to='/home'> Home</Link>
        )}
      </div>
      <div className='welcome-message'>
      {location.pathname === '/home' && 'Welcome to Home Page'}
        {location.pathname === '/profile' &&  'Welcome to Profile Page'}
        {location.pathname === '/' && 'Welcome to Login Page'}
        {location.pathname === '/register' && 'Welcome to Signup page'}
      </div>
      <ul>
        {user ? (
          <>
            <li>
              <button className='btn' onClick={onLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to='/'>
                <FaSignInAlt /> Login
              </Link>
            </li>
            <li>
              <Link to='/register'>
                <FaUser /> Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  )
}

export default Header
