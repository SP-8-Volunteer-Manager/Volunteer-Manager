import React from 'react';
import { NavLink , Outlet } from "react-router-dom";
import Logo from '../assets/logo.png'


function LoggedInNavigation() {
    return (
      <section>
       

            <div className="d-flex flex-column flex-shrink-0 p-3 navigation rounded-0" style={{width: '280px',height: '100vh'}}>
                <div className='text-center '>
                    <img src={Logo} style={{width: '70%'}} alt="logo" ></img>
                </div>
               
                <hr />
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item">
                        <NavLink  className="nav-link" aria-current="page" to="/">Dashboard</NavLink >
                    </li>
                    <li className="nav-item">
                        <NavLink  className="nav-link" to="/aboutUs">My Profile</NavLink >
                    </li>
                    <li className="nav-item">
                        <NavLink  className="nav-link" to="myPortal">Volunteers List</NavLink >
                    </li>
                    <li className="nav-item">
                        <NavLink  className="nav-link" to="contactUs">Events</NavLink >
                    </li>
                    <li className="nav-item">
                        <NavLink  className="nav-link" to="LogOut">Log out</NavLink >
                    </li>
                </ul>
            
            </div>



           
            
       
        <Outlet />
      </section>
    );
  };
          
export default LoggedInNavigation;

    