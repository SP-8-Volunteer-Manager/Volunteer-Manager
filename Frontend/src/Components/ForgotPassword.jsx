//import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Logo from '../assets/HBPR-logo.png'

function ForgotPassword({modalIsOpen, closeForgotPasswordModal}) {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
   
    const resetForm = () => {
        setEmail('');
        setMessage('');
        setError('');

    };
    useEffect(() => {
        if (!modalIsOpen) {
            resetForm(); // Reset the form when the modal is closed
        }
    }, [modalIsOpen]);

   

    const handlePasswordReset = async () => {
        if (email) {
            try {
                // Triggering Supabase API call to send a password reset email
                const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });

                const result = await response.json();
    
                if (!response.ok) {
                    setError('Failed to send reset email. Please try again.', result.error);
                    setMessage(''); // Clear the success message if there's an error
                } else {
                    // Reset form and hide the input field
                    resetForm();
                    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
                    if (forgotPasswordForm) {
                        forgotPasswordForm.style.display = 'none'; // Hide input field
                    }
                    setMessage('If the email is registered, a password reset link has been sent.', result.message);
                    setError(''); // Clear any previous errors
                }
            } catch (error) {
                console.error('Error sending password reset email:', error);
                setError('An unexpected error occurred.');
                setMessage(''); // Clear the success message if there's an error
            }
        } else {
            setError('Please enter an email');
            setMessage(''); // Clear the success message if there's an error
        }
    };
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setError('');
        
    };

    
    return (
        <>
        {modalIsOpen && (
            <div>
            <div className="modal show d-block" style={{ display: 'block', backgroundColor: 'black' }} role="dialog">
                <div className="modal-dialog modal-dialog-centered" role="document" >
                    <div className="modal-content rounded-4 shadow" >
                    <img src={Logo} className="img-fluid w-100 h-100  rounded-top-4 " alt="HBPR-logo" loading="lazy" />
                        <div className="modal-header p-5 pb-4 border-bottom-0">
                            
                            <h2 className="modal-title" id="forgotPasswordModalTitle">Forgot password</h2>
                            <button type="button" className="btn-close" aria-label="Close"  onClick={closeForgotPasswordModal}>
                                
                            </button>
                        
                        </div>
                        <div className="modal-body p-5 pt-0 mb-4">
                            <form id="forgotPasswordForm">
                                <div className="form-floating mb-3">
                                    <input 
                                        type="email" 
                                        className={`form-control ${error ? 'is-invalid' : ''}`}
                                        id="email" 
                                        placeholder="Enter your email" 
                                        value={email}
                                        onChange={handleEmailChange}
                                        required
                                    />
                                    
                                    <label htmlFor="email">Email Address</label>
                                    {error && <div className="invalid-feedback">{error}</div>}
            
                        
                                </div>
                                
                            
                            
                            
                                <button type="button" className="btn btn-lg btn-primary w-100 my-2 " onClick={handlePasswordReset}>
                                    Reset Password
                                </button>
                            </form>
                        {message && <p className="mt-3 text-success">{message}</p>}
                       
                        </div>
                    </div>
                
                </div>
                
            
                </div>
                <div className="modal-backdrop fade show"></div>
            </div>
        )}
        </>
    );
}

export default ForgotPassword;