import { useState, useEffect } from 'react';
import { useNavigate  } from 'react-router-dom'; 
import API_BASE_URL from '../config';


const ResetPassword = () => {
    const [accessToken, setAccessToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const hash = location.hash;
        const params = new URLSearchParams(hash.slice(1)); // Remove the "#" character
        const recoveryToken = params.get('access_token');
        console.log("recovery token",recoveryToken);

        if (recoveryToken) {
            setAccessToken(recoveryToken);
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
        <div>
          <h2>Reset Password</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Reset Password</button>
          </form>
        </div>
      );
    };
    
    export default ResetPassword;