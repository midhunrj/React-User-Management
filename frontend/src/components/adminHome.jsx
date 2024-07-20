import React, { useState, useEffect,useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUser, createUser, deleteUser, reset, logout,searchUser } from './admin-auth/adminauthslice';
import Spinner from './spinner';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import { FaSignOutAlt } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa'
import Swal from 'sweetalert2';
import {toast} from 'react-toastify'
import debounce from 'lodash.debounce'
import './adminHome.css';

function AdminHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, isLoading,adminToken } = useSelector((state) => state.adminauth);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    mobile: '',
    image:null
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [initialUserData, setInitialUserData] = useState({});
  // useEffect(() => {
  //   if (searchQuery.trim()) {
  //     dispatch(searchUser(searchQuery));
  //   } else {
  //     dispatch(fetchUsers());
  //   }
  // }, [searchQuery, dispatch]);
  useEffect(() => {
    if(!adminToken)
    {
      navigate('/admin')
    }
    dispatch(fetchUsers());
    return () => {
      dispatch(reset());
    };
  }, [dispatch,adminToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };


  const validateForm = () => {
    if (!userData.name) {
     // Swal.fire('Validation Error', 'Name is required', 'error');
     toast.error('name field is required')
      return false;
    }
    if (!userData.email) {
      // Swal.fire('Validation Error', 'Email is required', 'error');
      toast.error('email field cannot be empty')
      return false;
    }
   else if (!/\S+@\S+\.\S+/.test(userData.email)) {
    toast.error('Email should be valid')
    return false
  }
    if(emailExists(userData.email))
    {
      toast.error('There is already an email exists with this id')
     return false
    }
    if (!userData.mobile) {
      //Swal.fire('Validation Error', 'Mobile number is required', 'error');
      toast.error('mobile field is required')
      return false;
    } else if (!/^\d{10}$/.test(userData.mobile)) {
      toast.error('Mobile number must be 10 digits')
      return false
    }
    
    return true;
  };

  const emailExists=(email)=>{
      if (editingUser && editingUser.email === email) {
        return false;
      }
      
    return users.find(user=>user.email===email)
  }

  // const validateImage = (file) => {
  //   const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
  //   if (!validTypes.includes(file.type)) {
  //     toast.error('Invalid file type. Only JPG, PNG, and GIF files are allowed.');
  //     return false;
  //   }
  //   return true
  // }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm())
    {
       return
    }

    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('mobile', userData.mobile);
    if (userData.image) {
      formData.append('image', userData.image);
    }


    if (editingUser) {
      formData.append('id', editingUser._id);
     // dispatch(updateUser({ ...userData, id: editingUser._id }))
     console.log(formData,"formdata");
     if (JSON.stringify(initialUserData) !== JSON.stringify(userData)) {
     dispatch(updateUser(formData) )
     .then(()=>
      {
        toast.success('user updated successfully','success')
      });
    }
    } else {
      dispatch(createUser(userData));
    }
    setUserData({ name: '', email: '', mobile: '' });
    setEditingUser(null);
    setShowModal(false);
  };

  const handleCreate=()=>{
    dispatch(reset())
    setUserData({name:'',email:'',mobile:'',password:''})
    setEditingUser(null);
    setShowModal(true)
  }
  const handleEdit = (user) => {
    setEditingUser(user);
    setUserData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      image:user.image || null,
    });
    setInitialUserData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      image: user.image || null,
    });
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    setUserData({ ...userData, image: e.target.files[0] });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    dispatch(fetchUsers());
  };
  const handleDelete = (userId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteUser(userId)).then(() => {
          Swal.fire('Deleted!', 'User has been deleted.', 'success');
        }).catch((error) => {
          Swal.fire('Error', 'Failed to delete user', 'error');
        });
      }
    });
    // dispatch(deleteUser(userId))
    // .then(()=>
    // {
    //   dispatch(fetchUsers())
    // });
   //dispatch(reset())
  };

  // const handleSearch = (e) => {
  //   setSearchQuery(e.target.value);
  //   dispatch(searchUser({ searchQuery: e.target.value }));
  // };

  const debouncedSearch = useCallback(debounce((query) => {
    dispatch(searchUser(query));
  }, 1000), [dispatch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
   // dispatch(searchUser({search:searchQuery}))
    console.log(searchQuery,"in searchchange");
    debouncedSearch(searchQuery)
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log(searchQuery,"in submit search");
    dispatch(searchUser(searchQuery ));
  };
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset())
    navigate('/admin');
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="admin-home">
    <button className="logout-button" onClick={onLogout}>
      <FaSignOutAlt /> Logout
    </button>
    <h2>Admin Dashboard</h2>
    <Form onSubmit={handleSearchSubmit} className="mb-3 search-form">
        <div className="search-input-wrapper">
          <Form.Control
            type="text"
            placeholder="Search users"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery && (
            <button type="button" className="clear-search-button" onClick={handleClearSearch}>
              <FaTimes />
            </button>
          )}
        </div>
        <Button variant="primary" type="submit" className="mt-2">
          Search
        </Button>
      </Form>
    {/* <Button variant="primary" onClick={handleCreate}>
      Create User
    </Button> */}
    {users.length === 0 ? (
        <p>No users found</p>
      ) : (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Mobile</th>
          <th>image</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.mobile}</td>
            <td>
                <img
                  src={user.image ? `/uploads/${user.image}` : '/uploads/empty-dp.jpeg'}
                  alt="Profile"
                  className="profile-thumbnail"
                />
              </td>
            <td>
              <Button variant="warning" onClick={() => handleEdit(user)}>
                Edit
              </Button>
              <Button variant="danger" onClick={() => handleDelete(user._id)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
      )}

    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{editingUser ? 'Edit User' : 'Create User'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              
            />
          </Form.Group>
          <Form.Group controlId="formEmail" className="mt-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              
            />
          </Form.Group>
          <Form.Group controlId="formMobile" className="mt-2">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              type="text"
              name="mobile"
              value={userData.mobile}
              onChange={handleInputChange}
              
              />
          </Form.Group>
          <Form.Group controlId="formImage" className="mt-2">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control type="file" name="image" onChange={handleFileChange} />
              {editingUser && editingUser.image && (
                <div className="mt-2">
                  <img
                    src={`/uploads/${editingUser.image}`}
                    alt="Profile"
                    className="profile-thumbnail"
                  />
                </div>
              )}
            </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  </div>
);
}

export default AdminHome;
