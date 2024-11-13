import React from 'react';
import { NavLink , Outlet } from "react-router-dom";
import Logo from '../assets/logo.png'


function LoggedInNavigation({ onLogout }) {
    return (
        <section className="container-fluid p-0 d-flex flex-column flex-grow-1">
            <div className="row flex-grow-1">
                <div className="col-12 col-md-3 col-lg-2 p-0 ">
                    <div className="d-flex flex-column flex-shrink-0 navigation rounded-0 mx-1" style={{minHeight: '100%' }}>
                        <div className='text-center py-3'>
                            <img src={Logo} style={{width: '70%'}} alt="logo" ></img>
                        </div>
                    
                        <hr />
                        <ul className="nav nav-pills flex-column mb-auto">
                            <li className="nav-item">
                                <NavLink  className="nav-link rounded-0" aria-current="page" to="/">Dashboard</NavLink >
                            </li>
                          
                            <li className="nav-item">
                                <NavLink  className="nav-link rounded-0" to="volunteerList">Volunteers List</NavLink >
                            </li>
                            <li className="nav-item">
                                <NavLink  className="nav-link rounded-0" to="adminEventList">Events</NavLink >
                            </li>
                            <li className="nav-item">
                                <NavLink  className="nav-link rounded-0" to="createAdminUser">Create Admin User</NavLink >
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-link nav-link text-start" onClick={onLogout}>Log out</button>
                            </li>
                        </ul>
                    
                    </div>  
                </div> 
            
                <div className="col-12 col-md-8 col-lg-10 p-3 d-flex flex-column">
                    <Outlet />
                </div>
            </div>
        </section>
    );
  };
          
export default LoggedInNavigation;

    