import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, updateUserProfile } from './auth/authslice';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import './profile.css';
//import './login.css';

function Profile() {
  const [image, setImage] = useState(null);
  const navigate=useNavigate()
  const [preview, setPreview] = useState('');
  const [showModal, setShowModal] = useState(false);
  const[initialUserData,setInitialUserData]=useState({})
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
  });

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const[errors,setErrors]=useState({})

  useEffect(() => {
    console.log(user);
    if(!user)
    {
      navigate('/')
    }
    else {
     // console.log(formData,"formdata");
      setFormData({
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        image:user.image
      });
      setInitialUserData({
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        image: user.image || null,
      });
      //setPreview(user.image || 'default-image-url');  placeholder URL
      dispatch(fetchUserProfile())
    }
  }, [user.token]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    console.log(image,"image change");
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) {
      errors.name = 'Name is required';
    }
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.mobile) {
      errors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      errors.mobile = 'Mobile number must be 10 digits';
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors=validateForm()
    if(Object.keys(validationErrors).length>0)
    {
      setErrors(validationErrors)
      Object.values(validationErrors).forEach((error) => {
        toast.error(error);
      });
    }
    else{
    const data = new FormData();
    data.append('image', image);
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('mobile', formData.mobile);
    dispatch(updateUserProfile(data));
    setShowModal(false);
    const dataChanged=JSON.stringify(initialUserData)!==JSON.stringify(formData)
    if(dataChanged)
    {
      dispatch(updateUserProfile(data)).then(()=>
    {setShowModal(false);
      toast.success('profile updated successfully')
    
    })}}
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="card-body text-center">
          <div className="profile-image-container">
            {/* <img
              src={!preview?"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAK0AAACUCAMAAADWBFkUAAAAMFBMVEWzs7P///+urq7W1tb7+/vp6enGxsb09PS5ubna2trt7e2/v7/m5ubPz8/i4uLKysrz9xPiAAADI0lEQVR4nO2b25aDIAxFJVK5efn/vx1r2+nFzgihcnA1+6HPe1EIIYlNIwiCIAiCIKyx1s6/hNaIglpjjO/dEI4gTKO6YLwLVLswteqOaS3a53+o0w+6So9d1TvCGvWEPnUV65JX6tXXVupLq7VdcDX6kh36d7JK+ak2XbLje9VlO/RVhTMK/Z+qFzq04i/UOL0hq9RYSTCjcNp0nTnVoTtsL+yCCXhdcnGuVegmyFagmyKL1qUhSXa+KIB5GdnIA3anBy5uVOh6BrYXnpLvWDRItrGr/DCGAbS4HUdW9RjZdeodhcYkOMSSVaqF2AamrUfIJt25j0CiAm0l4H8SELZ/v2w2mA5l2wIiLt92FFuxXXBiu5stIgvLsC0v+z1reyzb8rJHyxN4TweFqY7ybSEZ47Fsx22vamzpULYdOyQoV7p0RyG5XvdA6ZICP9gumKKrS1OWbOELgn/CrhRNcfm1hCtFHzvZtkXTMHZV6UbRkJt7ysrGhKbJCbfnpm9RMrdC6QzX5siWr+DmRNzyDzNeQ2fhVP4VyWqWXUB0T9lvB0RhiX3QSsfaK8y9gBq3Yh00WBOddf/iBhQYaS6qJ72Qmi5A+pA3UidVNHiiMS0tR/RHHgkpj1+Nns1OCrqIJuSLbnzQPaFdm4QxBY2oLb4S/YzAZDMr4qbCfB2y9Ha2fbUP0Jo3KGLUCn0vPBCxdQu/yf9j2xY5bPkKbSU3lZywBdoMuVXZbocw/J37S0wPoppvoaIuM1PDtXsmLmk0aM0rkQk5csD9BsW/Hjx8M1BIqCmgP86wiUVn4GeoFFxyR9IPmO/iyKa7njkBfO3Eb/RqV+64zSsThtzmnnFDsLT7ItO8WX1e//wm7Hs37WscRp3XKHtBm3HYYVtQY0Pbf9T0rtwPnf3cGhPZafT7qF6F/dh9xpdo8J/9/98LmzbXdz7/Lb8vliw85uzh85fl+y/qE+wv7KnhXVZ5GGb9KXd0hu3L2A4Zw2nZpM/nMr7P/E5bnf4+htoea23FVmzFVmzFVmzFVmy/1LbcS3dN+izx5FoY6SVpApIsKwiCIAjCHvwAbvwtuYN1z7kAAAAASUVORK5CYII=":
              `src="http://localhost:7486/uploads/${user.image}`}
              alt="Profile"
              className="rounded-circle img-fluid"
              style={{ width: '150px', height: '150px' }}
            /> */}
            <img
              src={image?URL.createObjectURL(image):`http://localhost:7486/uploads/${user.image}`}
              alt="Profile"
              className="rounded-circle img-fluid"
              style={{ width: '150px', height: '150px' }}
            />
            <button className="edit-button" onClick={handleShowModal}>
              ✎
            </button>
          </div>
          <h2 className="card-title mt-3">{user?.name}</h2>
          <p className="card-text">{user?.email}</p>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mt-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formMobile" className="mt-2">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="Number"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formImage" className="mt-2">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} />
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

export default Profile;
