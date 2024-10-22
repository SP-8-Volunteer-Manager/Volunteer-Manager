import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function LogIn({ setIsLoggedIn, closeModal }) {
//add const for email and password
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const[error, setError] = useState('');
    const navigate = useNavigate();
    
   
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
        navigate('/forgot-password'); // Navigates to the "Forgot Password" page
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
      </>
          
    
    );
};

export default LogIn;