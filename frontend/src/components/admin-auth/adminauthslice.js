import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminAuthService from './adminauthservice';


// Admin login
export const login = createAsyncThunk('admin/login', async (adminData, thunkAPI) => {
  try {
    console.log(adminData,"admin py");
    return await adminAuthService.login(adminData);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);;
  }
});

// Admin logout
export const logout = createAsyncThunk('admin/logout', async (_, thunkAPI) => {
  try {
    await adminAuthService.logout();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// Fetch users
export const fetchUsers = createAsyncThunk('admin/home', async (_, thunkAPI) => {
  try {
    return await adminAuthService.fetchUsers();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});


export const searchUser = createAsyncThunk('admin/searchUser', async (searchQuery = '', thunkAPI) => {
  try {
    console.log("search in adminslice",searchQuery);
    return await adminAuthService.searchUsers(searchQuery);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// Create user
export const createUser = createAsyncThunk('admin/createUser', async (userData, thunkAPI) => {
  try {
    return await adminAuthService.createUser(userData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// Update user
export const updateUser = createAsyncThunk('admin/updateUser', async (formData, thunkAPI) => {
  try {
    console.log(formData,"admin update");
    return await adminAuthService.updateUser(formData);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// Delete user
export const deleteUser = createAsyncThunk('admin/deleteUser', async (userId, thunkAPI) => {
  try {
    console.log(userId,"deleting user");
     await adminAuthService.deleteUser(userId);
     return userId
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

const initialState = {
  users: [],
  adminToken: localStorage.getItem('adminToken') || null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
}; 

const adminauthSlice = createSlice({
  name: 'adminauth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(login.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(login.fulfilled, (state, action) => {
      state.adminToken = action.payload;
      state.isSuccess = true;
      state.isLoading = false;
    })
    .addCase(login.rejected, (state, action) => {
      state.isError = true;
      state.message = action.payload;
      state.isLoading = false;
    })
    .addCase(logout.fulfilled, (state) => {
      state.adminToken = null;
    })
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(searchUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload;
      })
      .addCase(searchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        console.log(state,"current state \n",action,"edit action");
        const index = state.users.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        console.log(action,"action");
        state.users = state.users.filter(user => user._id !== action.payload);
      });
  },
});

export const { reset } = adminauthSlice.actions;
export default adminauthSlice.reducer;
