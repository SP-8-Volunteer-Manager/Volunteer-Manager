import { useState, useEffect } from 'react'
import axios from 'axios';
import { BrowserRouter, Routes, Route} from 'react-router-dom'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
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



function App() {
  const [count, setCount] = useState(0)

  const fetchAPI = async () =>{
    const response = await axios.get("http://localhost:8080/api");
    console.log(response.data.f);
  };

  useEffect(() => {
    fetchAPI();
  },[]);

  return (
    <>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">
          <Routes>
            
            <Route path="/" element={<Navigation />}>
              <Route index element={<Home />} />
              <Route path="aboutUs" element={<AboutUs />} />
              <Route path="myPortal" element={<MyPortal />} />
              <Route path="contactUs" element={<ContactUs />} />
              <Route path="/signUp" element={<SignUpPage />} />
              <Route path="*" element={<ErrorPage />} />
            </Route>
            <Route path="/login" element={<Login />} /> 
            
        
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
  

