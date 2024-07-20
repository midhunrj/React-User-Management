import axios from "axios";

const API_URL='/signup'

const LOG_URL='/login'
const fetch_URL='/profile'
const Update_URL='/edit-profile'
//register user

const register=async(userData)=>{
    const response=await axios.post(API_URL,userData)
console.log(response,"register response");
    if(response.data){
        localStorage.setItem('user',JSON.stringify(response.data))
    }
    return response.data
}
const logout=(usedata)=>{
    console.log("local storage deleting");
    localStorage.removeItem('user')
    console.log(usedata,"inital in service");
    //return localStorage
}

const login=async(userData)=>{
    const response=await axios.post(LOG_URL,userData)
      console.log(response,"response in login");
    if(response.data)
    {
        localStorage.setItem('user',JSON.stringify(response.data))
    }
    return response.data
}
const fetchUser=async()=>{
    const user=JSON.parse(localStorage.getItem('user'))
    //console.log('user local storage',user);
    const config={
        headers:{
            Authorization:`Bearer ${user.token}`
        },
    }
    const response=await axios.get(fetch_URL,config);
    return response.data;
}
const updateUser=async(userData)=>{
    const user=JSON.parse(localStorage.getItem('user'))
    const config={
        headers:{
            Authorization:`Bearer ${user.token}`,
            'Content-Type':'multipart/form-data'
        }
    }
    const response=await axios.post(Update_URL,userData,config)
    return response.data
}
const authService={
    register,
    logout,
    login,
    updateUser,
    fetchUser
}

export default authService