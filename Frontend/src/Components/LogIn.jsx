import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ForgotPassword from './ForgotPassword';
import API_BASE_URL from '../config';





function LogIn({ setIsLoggedIn, closeModal, reset, onResetDone  }) {
//add const for username and password
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    
    const[error, setError] = useState('');
    const navigate = useNavigate();

    const [modalIsOpen, setModalIsOpen] = useState(false);
   
    const resetForm = () => {
        setUsername('');
        setPassword('');
        setError('');

    };
    useEffect(() => {
        if (reset) {
            resetForm();
            onResetDone();
        }
    }, [reset, onResetDone]);

 
   
    const handleLogin = async () => {
        
        if(username && password){
            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
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
                resetForm();
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


    const  openForgotPasswordModal = () => {
       
        setModalIsOpen(true);// Open the "Forgot Password" modal
    };
    
    const closeForgotPasswordModal = () => {
        resetForm();
        setModalIsOpen(false);
    };
    
    return (
       
           <>
          
                <form>
                    
                    <div className="form-floating mb-3">
                        <input type="text" className="form-control rounded-3" id="floatingInput" 
                        placeholder="Your username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        />
                        <label htmlFor="floatingInput">Username</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input 
                            type="password" 
                            className="form-control rounded-3" 
                            id="floatingPassword" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                        <label htmlFor="floatingPassword">Password</label>
                        
                    </div>
                    
                    {/* Show the error message */}
                    {error && <div className="text-danger">{error}</div>}
                    
                    <button className="w-100 my-2 btn btn-lg btn-primary" type="button" onClick={handleLogin}>
                        Log in
                    </button>
                    
                    {/* Forgot Password Link */}
                    <div className="text-center mt-3">
                        <button 
                            type="button" 
                            className="btn btn-link" 
                            onClick={openForgotPasswordModal}>
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
                <ForgotPassword modalIsOpen={modalIsOpen} closeForgotPasswordModal={closeForgotPasswordModal} />
      
            </>
          
    
    );
};

export default LogIn;