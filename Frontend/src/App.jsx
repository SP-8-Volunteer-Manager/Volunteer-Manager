import { useState, useEffect } from 'react'
import axios from 'axios';
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'
import Navigation from './Components/Navigation'
import Home from './Home'
import Footer from './Components/Footer'
import AboutUs from './AboutUs'
import ErrorPage from './ErrorPage'
import ContactUs from './ContactUs'
import MyPortal from './MyPortal'
import Login from './Components/LogIn'
import SignUpPage from './SignUpPage';
import ScrollToTop from './Components/ScrollToTop';
import LoggedInNavigation from './Components/LoggedInNavigation';
import AdminDashboard from './AdminDashboard';
import VolunteerList from './VolunteerList';
import AdminEventList from './AdminEventList';



function App() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false)  // Track login state
  const fetchAPI = async () =>{
    const response = await axios.get("http://localhost:8080/api");
    console.log(response.data.f);
  };
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      setIsLoggedIn(false); // Perform logout
    }
  };
  
  useEffect(() => {
    fetchAPI();
  },[]);

  return (
    <>
      <BrowserRouter>
        <div className="container-fluid px-0">
          <ScrollToTop />
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
                <Route path="myPortal" element={<MyPortal />} />
                <Route path="contactUs" element={<ContactUs />} />
                <Route path="/signUp" element={<SignUpPage />} />
                <Route path="*" element={<ErrorPage />} />
              </Route>
              <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} /> 
            </>
            )}
          </Routes>
          <div className="mt-auto">
            <Footer />
          </div>
        </div>      
      </BrowserRouter>
    </>
      )
    };
    
    export default App
  

