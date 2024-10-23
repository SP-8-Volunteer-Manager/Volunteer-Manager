//import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handlePasswordReset = () => {
        //simulation of triggering an API call to send a password reset email
        setMessage('If the email is registered, a password reset link has been sent.');
    };

    return (
        <div className="container">
            <h2>Forgot Password</h2>
            <form>
                <div className="form-floating mb-3">
                    <input 
                        type="email" 
                        className="form-control" 
                        id="email" 
                        placeholder="Enter your email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="email">Email Address</label>
                </div>
                <button type="button" className="btn btn-primary w-100" onClick={handlePasswordReset}>
                    Reset Password
                </button>
            </form>

            {message && <p className="mt-3 text-success">{message}</p>}
        </div>
    );
}

export default ForgotPassword;