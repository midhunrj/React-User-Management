import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function IsAdmin({children}) {
    const navigate=useNavigate()
  const {adminToken}=useSelector((state)=>state.adminauth)

  useEffect(()=>{
    if(!adminToken)
    {
     navigate('/admin')
    }
    
  },[])

  if(adminToken)
    {
        return children
    }
}

export default IsAdmin