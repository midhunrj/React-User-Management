import React,{useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
function IsUser({children}) {
    const navigate=useNavigate()
    const{user}=useSelector((state)=>state.auth)
        useEffect(()=> {
          if(!user)
          {
            console.log("redirect in middleware");
           navigate('/')
          }
        
        },[])

        if(user)
        {
          return children
        }
          

}

export default IsUser