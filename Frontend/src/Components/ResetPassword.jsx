import { useState, useEffect } from 'react';
import { useNavigate  } from 'react-router-dom'; 
import Logo from '../assets/HBPR-logo.png'
import API_BASE_URL from '../config';


function ResetPassword () {
  const [accessToken, setAccessToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const hash = location.hash;
    const params = new URLSearchParams(hash.slice(1)) // Remove the "#" character
    const recoveryToken = params.get('access_token');
    console.log("recovery token",recoveryToken);

    if (recoveryToken) {
        setAccessToken(recoveryToken);
    }else {
      
      console.error('No recovery token found in the URL');
    }
  }, [location]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }  
    
  
    try {
      // Call backend to update password
      const response = await fetch(`${API_BASE_URL}/api/auth/updatePassword`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({  newPassword }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setError('Failed to reset password. Please try again later.');
        return;
      }
      const data = await response.json();
        if (data.message) {
          alert('Password updated successfully!');
          navigate('/myPortal'); // Redirect to login page after success
        } else if (data.error) {
          alert('Error: ' + data.error);
        }
    } catch (error) {
      alert('An error occurred: ' + error.message);
    }
  };
  
  return (
    <div className="container">
      <img src={Logo} className="img-fluid w-100 h-100  rounded-4 " alt="HBPR-logo" loading="lazy" />
      <h1 className="my-3">Input New Password</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="resetPassword" className="form-label">New Password</label>
          <input
            id="resetPassword"
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="resetPassword" className="form-label">Confirm New Password</label>
          <input
            id="confirmNewPassword"
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" className="btn btn-primary my-3">Reset Password</button>
      </form>
    </div>
  );
};
    
export default ResetPassword;