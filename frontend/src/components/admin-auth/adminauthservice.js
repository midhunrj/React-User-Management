import axios from 'axios';

const API_URL = '/admin';


// Admin login
const login = async (adminData) => {
  const response = await axios.post(`${API_URL}/login`, adminData);
  console.log(response.data,"response from server");
  if (response.data) {
    localStorage.setItem('adminToken', response.data);
  }
  return response.data;
};

// Admin logout
const logout = async () => {
  localStorage.removeItem('adminToken');
  //await axios.get(`${API_URL}/logout`);
}; 

// search user
const searchUsers = async (searchQuery = '') => {
  console.log("search in adminservice",searchQuery);
  const response = await axios.get(`${API_URL}/searchUser`, {
    params: { search: searchQuery }
  });
  return response.data;
};


const fetchUsers = async () => {
  const token=localStorage.getItem('adminToken')
  const response = await axios.get(`${API_URL}/home`,{
    headers:{
      'Authorization':`Bearer ${token}`
    }
  });
  console.log(response.data);
  return response.data;
};

// Create user
const createUser = async (userData) => {
  const response = await axios.post(`${API_URL}/createUser`, userData);
  return response.data;
};

// Update user
const updateUser = async (formData) => {
  console.log("bilk mikis");
  console.log(formData,"userdata");
  const config={headers: {
    'Content-Type': 'multipart/form-data',
  },}
  const response = await axios.put(`${API_URL}/updateUser/${formData.id}`, formData,config);
  console.log(response,"response from admin server");
  return response.data;
};

// Delete user
const deleteUser = async (userId) => {
  const response = await axios.delete(`${API_URL}/deleteUser/${userId}`);
  return response.data;
};

const adminAuthService = {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  login,
  logout,
  searchUsers
};

export default adminAuthService;
