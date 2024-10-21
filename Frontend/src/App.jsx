import { useState, useEffect } from 'react'
import axios from 'axios';
import { Routes, Route} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

import './App.css'

import Home from './Pages/Home'
import AboutUs from './Pages/AboutUs'
import ErrorPage from './Pages/ErrorPage'
import ContactUs from './Pages/ContactUs'
import MyPortal from './Pages/MyPortal'
import SignUpPage from './Pages/SignUpPage';
import AdminDashboard from './Pages/AdminDashboard';
import VolunteerList from './Pages/VolunteerList';
import AdminEventList from './Pages/AdminEventList';
import ForgotPassword from './Pages/ForgotPassword';

import Navigation from './Components/Navigation'
import Login from './Components/LogIn'
import LoggedInNavigation from './Components/LoggedInNavigation';
import ScrollToTop from './Components/ScrollToTop';
import Footer from './Components/Footer'




function App() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false)  // Track login state
  const navigate = useNavigate(); // Initialize useNavigate
  
  const fetchAPI = async () =>{
    //const response = await axios.get("http://localhost:8080/api");
    //console.log(response.data.f);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      setIsLoggedIn(false); // Perform logout
      navigate('/'); // Redirect to home page after logging out

    }
  };
  
  useEffect(() => {
    fetchAPI();
  },[]);

  return (
    <>
      
        <div className="d-flex flex-column min-vh-100">
          <ScrollToTop />
         {/*} <div className="d-flex flex-grow-1"> {/* Ensure content area can grow */}
          <Routes>
            {isLoggedIn ? (
            // Routes for logged-in users
            <>
            
              <Route path="/" element={<LoggedInNavigation onLogout={handleLogout} />}>
                <Route index element={<AdminDashboard />} />
                
                <Route path="/volunteerList" element={<VolunteerList />} />
                <Route path="/adminEventList" element={<AdminEventList />} />
                
                <Route path="*" element={<ErrorPage />} />
              </Route>
            </>
          ) : (
            // Routes for guests (not logged in)
            <>
            <Route path="/" element={<Navigation />}>
                <Route index element={<Home setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="aboutUs" element={<AboutUs />} />
                <Route path="myPortal"  element={<MyPortal setIsLoggedIn={setIsLoggedIn} />}  />
                <Route path="contactUs" element={<ContactUs />} />
                <Route path="/signUp" element={<SignUpPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="*" element={<ErrorPage />} />
                
              </Route>
              <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} /> 
            </>
            )}
          </Routes>
          </div>
          <div className="mt-auto">
            <Footer />
          </div>
       {/* </div>  */  }  
     
    </>
      )
    };
    
    export default App
  

