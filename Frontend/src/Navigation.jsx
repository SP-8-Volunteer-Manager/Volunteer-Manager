import React from 'react';
import { Outlet, Link } from "react-router-dom";



function Navigation() {
    return (
      <section>
        <div className="container-fluid top m-0">
            <header className="d-flex flex-wrap justify-content-between pt-5 mb-5 border-bottom">
                        
                <div className="HBPR-logo"></div>
          
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/aboutUs">About Us</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/aboutUs">My Portal</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/aboutUs">Contact Us</Link>
                </li>
            </ul>
            </header>
            
        </div>
        <Outlet />
      </section>
    );
  };
          
export default Navigation;

      /*  <div className="container">
      <header className="my-4">
        <h1>Welcome to My Website</h1>
        <p>This is the home page of my simple React app.</p>
      </header>

      <section className="mb-4">
        <h2>About Us</h2>
        <p>
          We are a non-profit organization helping people through volunteer work.
          Our mission is to connect volunteers with meaningful tasks in the community.
        </p>
      </section>

      <section className="mb-4">
        <h2>How It Works</h2>
        <ul>
          <li>Sign up as a volunteer.</li>
          <li>Receive notifications for urgent tasks via SMS.</li>
          <li>Help out and make a difference!</li>
        </ul>
      </section>

      <footer className="mt-4">
        <p>Contact us at: info@example.com</p>
      </footer>
    </div>
*/
