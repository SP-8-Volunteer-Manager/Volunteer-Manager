import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ForgotPassword from './ForgotPassword';
import Modal from 'react-modal';

import Logo from '../assets/HBPR-logo.png'

Modal.setAppElement('#root');

function LogIn({ setIsLoggedIn, closeModal }) {
//add const for email and password
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const[error, setError] = useState('');
    const navigate = useNavigate();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);


    const handleClose = () => setShowModal(false);
   
    const handleLogin = async () => {
        if(username && password){
            try {
                const response = await fetch('http://localhost:8080/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({username, password}),
                });
                if (!response.ok) {
                    if(response.status === 401){
                        setError('Invalid username or password');
                    }else{
                    throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return;
                }
                //Setting user
                setIsLoggedIn(true);      
                closeModal();
                window.scrollTo(0, 0);
                navigate('/');
            } catch(error){
                setError(error.message);
            }
        }
        else{
            setError('Please enter username and password');
        }        
      };


    const handleForgotPassword = () => {
        
        setModalIsOpen(true);// Open the "Forgot Password" modal
    };
    
    const closeForgotPasswordModal = () => {
        setModalIsOpen(false);
    };

    return (
       
           <>
           
                <form>
                    
                    <div className="form-floating mb-3">
                        <input type="text" className="form-control rounded-3" id="floatingInput" 
                        placeholder="Your username" 
                        //value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        />
                        <label htmlFor="floatingInput">Username</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="password" className="form-control rounded-3" id="floatingPassword" 
                        placeholder="Password" 
                        //value={password}
                        onChange={(e) => setPassword(e.target.value)}/>
                        <label htmlFor="floatingPassword">Password</label>
                        
                    </div>
                    
                    {/* Show the error message */}
                    {error }
                    {/*<button className="w-100 my-2 btn btn-lg btn-primary" type="button" onClick={handleLogin}>Log in</button>*/}
                    <button className="w-100 my-2 btn btn-lg btn-primary" type="button" onClick={handleLogin}>Log in</button>
                    
                    {/* Forgot Password Link */}
                    <div className="text-center mt-3">
                        <button type="button" className="btn btn-link" onClick={handleForgotPassword}>
                            Forgot Password?
                        </button>
                    </div>

                    
                    
                       
                    {/*
                        <div className="form-check text-start my-3">
                        <input className="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault" />
                        <label className="form-check-label" for="flexCheckDefault">
                            Remember me
                        </label>
                        </div>
                        
                    */}    
                 
                </form>
                {/* Forgot password Modal */}
                <div className={`modal fade ${modalIsOpen ? 'show d-block' : ''}`} tabIndex="-1" style={{ display: modalIsOpen ? 'block' : 'none' }} role="dialog">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content rounded-4 shadow">
                        <img src={Logo} className="img-fluid w-100 h-100  rounded-top-4 " alt="HBPR-logo" loading="lazy" />
                            <div className="modal-header p-5 pb-4 border-bottom-0">
                                
                                <h2 className="fw-bold">Forgot password</h2>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"  onClick={closeForgotPasswordModal}></button>
                            
                            </div>
                            <div className="modal-body p-5 pt-0 mb-4">
                                {/* Pass closeModal and setIsLoggedIn to the Login component */}
                                <ForgotPassword />
                            </div>
                            
                            
                        </div>
                    </div>
                    
                </div>
                {showModal && <div className="modal-backdrop fade show"></div>}
      </>
          
    
    );
};

export default LogIn;