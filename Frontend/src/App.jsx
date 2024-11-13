import { useState, useEffect } from 'react'
import axios from 'axios';
import { Routes, Route} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from './config'; 

import './App.css'

import Home from './Pages/Home'
import AboutUs from './Pages/AboutUs'
import ErrorPage from './Pages/ErrorPage'
import ContactUs from './Pages/ContactUs'
import MyPortal from './Pages/MyPortal'
import SignUpPage from './Pages/SignUpPage';
import AdminDashboard from './Pages/AdminDashboard';
import VolunteerDashboard from './Pages/VolunteerDashboard';
import MyProfile from './Pages/MyProfile';
import VolunteerList from './Pages/VolunteerList';
import AdminEventList from './Pages/AdminEventList';
import CreateAdminUser from './Pages/CreateAdminUser';


import Navigation from './Components/Navigation'
import Login from './Components/LogIn'
import LoggedInNavigation from './Components/LoggedInNavigation';
import ScrollToTop from './Components/ScrollToTop';
import Footer from './Components/Footer'
import VolunteerNavigation from './Components/VolunteerNavigation';
import TaskConfirmationPage from './Pages/TaskConfirmationPage';
import ResetPassword from './Components/ResetPassword';




function App() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false)  // Track login state
  
  const [userData, setUserData] = useState({})  // Track userdata
  const navigate = useNavigate(); // Initialize useNavigate
  console.log("Is loggedin= " + isLoggedIn + " as role: " + userData.role)

  const fetchAPI = async () => {
    try {
      console.log("---app.jsx fetchapi--")
      const response = await axios.get(`${API_BASE_URL}/`);
      console.log(response.data); // Check the response data

      // UserSetup
      // const rcdata = {userId: 155, username: "gbd", email: "georgerbd@gmailbrt.com", role: "volunteer"};
      // setUserData(rcdata)
      // setIsLoggedIn(true)
      

    } catch (error) {
      console.error("Error fetching data from backend:", error); // Log any errors
    }
  };
  

  const handleLogout = async() => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      try {
        const token = localStorage.getItem('access_token'); // Get the token from localStorage

        const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Add the token to the Authorization header
          },
        });

        if (response.ok) {
          setIsLoggedIn(false);
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          navigate('/'); // Redirect to home page after logging out
        } else {
          console.error('Error logging out:', response.statusText);
        }
      } catch (error) {
        console.error('Error logging out:', error);
      }
    }
  };
  
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(storedUser));
    } else {
      setIsLoggedIn(false);
      setUserData({});
    }
    fetchAPI();
  },[]);

  return (
    <>
      
        <div className="d-flex flex-column min-vh-100">
          <ScrollToTop />
         {/*} <div className="d-flex flex-grow-1"> {/* Ensure content area can grow */}
          <Routes>
          { // outer bracket
            isLoggedIn && userData.role == "admin" ?
           (
            // Routes for logged-in admin users
            <>
              {console.log("Admin view")}
            
              <Route path="/" element={<LoggedInNavigation onLogout={handleLogout} />}>
                <Route index element={<AdminDashboard userData={userData}/>} />
                
                <Route path="/volunteerList" element={<VolunteerList />} />
                <Route path="/adminEventList" element={<AdminEventList />} />
                <Route path="/createAdminUser" element={<CreateAdminUser />} />
                
                <Route path="*" element={<ErrorPage />} />
              </Route>
            </>
          ) 
          :     //else
          ( // nested ternary
            isLoggedIn && userData.role == "volunteer" ?
            (
             
             // Routes for logged-in volunteer users
             <>
              {console.log("Volunteer view")}
               <Route path="/" element={<VolunteerNavigation onLogout={handleLogout} />}>
                 <Route index element={<VolunteerDashboard userData={userData}/>} />
                 
                 <Route path="/myProfile" element={<MyProfile userData={userData}/>} />
                 <Route path="/contactUs" element={<ContactUs  />} />
                 
                 <Route path="*" element={<ErrorPage />} />
               </Route>
             </>
            )
          :
          (
            // Routes for guests (not logged in)
            <>
              {console.log("Not logged in view")}
            <Route path="/" element={<Navigation />}>
                <Route index element={<Home setIsLoggedIn={setIsLoggedIn} setUserData={setUserData}/>} />
                <Route path="aboutUs" element={<AboutUs />} />
                <Route path="myPortal"  element={<MyPortal setIsLoggedIn={setIsLoggedIn} setUserData={setUserData}/>}  />
                <Route path="contactUs" element={<ContactUs />} />
                <Route path="/signUp" element={<SignUpPage />} />
                <Route path="*" element={<ErrorPage />} />
                
              </Route>
              <Route path="/confirm/:taskId/:volunteerId" element={<TaskConfirmationPage />} />
              <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} /> 
              <Route path="/update-password/" element={<ResetPassword />} />
            </>
            )
          )            
            
            } // outer bracket

          </Routes>
          </div>
          <div className="mt-auto">
            <Footer />
          </div>
    </>
      )
    };
    
    export default App
  

