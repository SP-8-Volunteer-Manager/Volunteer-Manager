import React from 'react';
import { NavLink , Outlet } from "react-router-dom";
import Logo from '../assets/logo.png'


function LoggedInNavigation() {
    return (
        <section className="container-fluid p-0">
            <div className="row">
                <div className="col-12 col-md-3 col-lg-2 p-0 bg-light" id="sidebar">
                    <div className="d-flex flex-column flex-shrink-0 navigation rounded-0" style={{height: '100vh'}}>
                        <div className='text-center py-3'>
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
                </div> 
            
                <div className="col-12 col-md-8 col-lg-10 p-3" id="content">
                    <Outlet />
                </div>
            </div>
        </section>
    );
  };
          
export default LoggedInNavigation;

    