import React,{useState,useEffect } from 'react'
 import { FaUserAlt,FaSignInAlt } from 'react-icons/fa'
 import {useSelector,useDispatch} from 'react-redux'
 import { useNavigate } from 'react-router-dom'
 import {toast} from 'react-toastify'
 import { register,reset } from './auth/authslice'
 import './login.css'
import { Link } from 'react-router-dom'
import Spinner from './spinner'
function Signup() {
    const[formData,setFormData]=useState({
        name:'',
        mobile:'',
        email:'',
        password:'',
        confirmPassword:''
    })
    const{name,mobile,email,password,confirmPassword}=formData
    const [errors, setErrors] = useState({});
    const navigate=useNavigate()
    const dispatch=useDispatch()

    const{user,isLoading,isError,isSuccess,message}=useSelector((state)=>
        state.auth)
    
        const validateForm = () => {
            const errors = {};
            if (!name) {
                errors.name = 'Name is required';
            }
            if (!mobile) {
                errors.mobile = 'Mobile number is required';
            } else if (!/^\d{10}$/.test(mobile)) {
                errors.mobile = 'Mobile number is invalid';
            }
            if (!email) {
                errors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(email)) {
                errors.email = 'Email is invalid';
            }
            if (!password) {
                errors.password = 'Password is required';
            } else if (password.length < 6) {
                errors.password = 'Password must be at least 6 characters';
            }
            if (!confirmPassword) {
                errors.confirmPassword = 'Confirm Password is required';
            } else if (password !== confirmPassword) {
                errors.confirmPassword = 'Passwords do not match';
            }
            return errors;
        };
    
        const onSubmit = (e) => {
            e.preventDefault();
            const validationErrors = validateForm();
            if (Object.keys(validationErrors).length > 0) {
                for (const error in validationErrors) {
                    toast.error(validationErrors[error]);
                }
            } else {
        // if(password!==confirmPassword)
        // {
        //     toast.error('passwords do not match')
        // }
        // else{
        
            const userData={
                name,
                mobile,
                email,
                password
            }
            dispatch(register(userData))

        }
    }
    useEffect(()=>{
     if(isError)
     {
        toast.error(message)
     }
     if(isSuccess||user)
     {
         navigate('/home')   
     }
     dispatch(reset())
    },[user,isError,isSuccess,message,navigate,dispatch])
    const onChange=(e)=>{
        setFormData((prevState)=>({
            ...prevState,
            [e.target.name]:e.target.value
        }))
    }

    if(isLoading)
    {
        return <Spinner/>
    }
  return (
    <>
    <div className='login-container'>
    <div className='card'>
        <div className='card-header'>
    <h1><FaUserAlt/>Register</h1>
    <p>please create an account</p>
    
    
    <section className='form'>
        <form onSubmit={onSubmit}>
            <div className='form-group'>
            <input type="text" name='name' value={name}
            placeholder='Enter your name' onChange={onChange}/>
            </div>
            <div className='form-group'>
            <input type="number" name='mobile' value={mobile}
            placeholder='Enter your mobile' onChange={onChange}/>
            </div>
            <div className='form-group'>
            <input type="text" name='email' value={email}
            placeholder='Enter your email' onChange={onChange}/>
            </div>
            <div className='form-group'>
            <input type="text" name='password' value={password}
            placeholder='Enter your password' onChange={onChange}/>
            </div>
            <div className='form-group'>
            <input type="text" name='confirmPassword' value={confirmPassword}
            placeholder='Enter your password' onChange={onChange}/>
            </div>
            
                <button type="submit">Submit</button>
                <div className='py-3'>
                    <div>
                       Already registered ?<Link to='/'>Login</Link>
                    </div>
                </div>
                    </form>
    
    </section>
    </div>
    </div>
    </div>
    {isLoading && <Spinner />}
      {isSuccess && <p>Registration successful! Redirecting...</p>}
      {isError && <p>Error: {message}</p>}
    </>
    
  )
}

export default Signup