import logo from './logo.svg';
//import './App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import RegisterPage from './pages/registerPage';
import LoginPage from './pages/loginPage';
import HomePage from './pages/homePage';
import ProfilePage from './pages/profilePage';
import AdminLogPage from './pages/AdminLogPage';
import AdminHomePage from './pages/AdminHomePage';
import IsAdmin from './components/middleware/isAdmin';
import IsUser from './components/middleware/isUser';

function App() {
  
  return (
    <>
    <Router>
    <div className='container'>
    
      <Routes>
        <Route path='/register' element={<RegisterPage/>}/>
     <Route path='/' element={<LoginPage/>}/>
     <Route path='/home' element={<IsUser><HomePage/></IsUser>}/>
     <Route path='/profile' element={<IsUser><ProfilePage/></IsUser>}/>
     <Route path='/admin' element={<AdminLogPage/>}/>
     <Route path='/admin/Home' element={<IsAdmin><AdminHomePage/></IsAdmin>}/>
      </Routes>
    </div>
    </Router>
    <ToastContainer/>
    </>
  );
}

export default App;
