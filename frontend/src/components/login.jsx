import React,{useState,useEffect} from 'react'
import './login.css'
import {Link} from 'react-router-dom'
import {useSelector,useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {toast} from 'react-toastify'
import { login,reset } from './auth/authslice'
import Spinner from './spinner'
function Login() {
    const[email,setEmail]=useState('')
    const[password,setPassword]=useState('')
    const [errors, setErrors] = useState({});
    const navigate=useNavigate()
    const dispatch=useDispatch()

    const{user,isLoading,isError,isSuccess,message}=useSelector((state)=>
        state.auth)
        useEffect(()=>{
            console.log("useeffect userlogin");
            if(isError)
            {
               toast.error(message)
            }
            if(user)
            {
                console.log("jumbalaka jumbalaka");
                navigate('/home')   
            }
            dispatch(reset())
           },[user,isError,navigate])


           const validateForm = () => {
            const errors = {};
            if (!email) {
                errors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(email)) {
                errors.email = 'Email is invalid';
            }
            if (!password) {
                errors.password = 'Password is required';
            }
            return errors;
        };
    
        const handleSubmit = (e) => {
            e.preventDefault();
            const validationErrors = validateForm();
            if (Object.keys(validationErrors).length > 0) {
                for (const error in validationErrors) {
                    toast.error(validationErrors[error]);
                }
            } else {
        const userData={
            email,
            password
        }

        dispatch(login(userData))
    }
}
    if(isLoading)
    {
        return <Spinner/>
    }
  return (
    <>
   { console.log("its user log return")}
        <div className='login-container '>
            <div className='row justify-content center'>
                <div className='col md-6'>
            <div className='card'>
                <div className='card-header'>
        <h1>Login page</h1>
        </div>
        <div className='card-body '>
       <form onSubmit={handleSubmit}>
       <div className='form-group'>
            <input type="text" name='email' value={email}
            placeholder='Enter your email' onChange={(e)=>
                setEmail(e.target.value)
                }/>
            </div>
            <div className='form-group'>
            <input type="text" name='name' value={password}
            placeholder='Enter your password' onChange={(e)=>
                setPassword(e.target.value)
                }/>
            </div>
            
            <button type='submit' className='log'>login</button>
            <div className='py-3'>
                <div>
                 New user?<Link to='/register'>Register</Link>
                </div>
            </div>
            
        </form>
        </div>
        </div>
        </div>
        </div> 
        </div>
    
    </>
  )
}

export default Login