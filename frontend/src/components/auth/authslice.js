import {createSlice,createAsyncThunk} from'@reduxjs/toolkit'
import authService from './authService'

//get user from localStorage
const user=JSON.parse(localStorage.getItem('user'))

const initialState={
    user:user?user:null,
    isError:false,
    isSuccess:false,
    isLoading:false,
    message:'',
    
}

//Register user
export const register=createAsyncThunk('auth/register',async (user,thunkAPI)=>
{
  try{
    return await authService.register(user)

  } 
  catch(error)
  {
    console.log(error.message);
    const message=(error.message&&error.response.data&&error.response.data.message)||error.message||error.toString()
    return thunkAPI.rejectWithValue(message)
  } 
})

//login user
export const login=createAsyncThunk('auth/login',async (user,thunkAPI)=>
{
  try{
    return await authService.login(user)

  } 
  catch(error)
  {
    console.log(error.message);
    const message=(error.message&&error.response.data&&error.response.data.message)||error.message||error.toString()
    return thunkAPI.rejectWithValue(message)
  } 
})

export const fetchUserProfile = createAsyncThunk(
  'auth/profile',
  async (_, thunkAPI) => {
    try {
      return await authService.fetchUser()
    } catch (error) {
      console.log(error.message);
      const message=(error.message&&error.response.data&&error.response.data.message)||error.message||error.toString()

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/edit-profile',
  async (userData, thunkAPI) => {
    try {
      return await authService.updateUser(userData)
    } catch (error) {
      console.log(error.message);
      const message=(error.message&&error.response.data&&error.response.data.message)||error.message||error.toString()
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const logout=createAsyncThunk('auth/logout',async(initialState)=>{
  try {
    console.log(initialState,"inital in slice");
    await authService.logout(initialState); 

   // return null; 
  } catch (error) {
    console.error('Logout error:', error.message);
    throw error; 
  }
});

  


export const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
        reset:(state)=>{
            state.isLoading=false
            state.isSuccess=false
            state.isError=false
            state.message=''
        },
       
    },
    extraReducers:(builder)=>{
        builder
        .addCase(register.pending,(state)=>{
            state.isLoading=true
        })
        .addCase(register.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isSuccess=true
            state.user=action.payload
        })
        .addCase(register.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.message=action.payload
            state.user=null
        })
        .addCase(login.pending,(state)=>{
            state.isLoading=true
        })
        .addCase(login.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isSuccess=true
            state.user=action.payload
        })
        .addCase(login.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.message=action.payload
            state.user=null
        })
        .addCase(logout.fulfilled,(state)=>
        {
          state.user = null;
          state.isSuccess = false;
          state.isError = false;
          state.message = '';
        })
        .addCase(fetchUserProfile.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(fetchUserProfile.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = action.payload;
        })
        .addCase(fetchUserProfile.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = action.payload;
        })
        .addCase(updateUserProfile.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(updateUserProfile.fulfilled, (state, action) => {
          state.isLoading = false;
          state.user = action.payload;
        })
        .addCase(updateUserProfile.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = action.payload;
        });
    }
})


export const {reset}=authSlice.actions
export default authSlice.reducer