const supabase = require('../config/supabaseClient');
const bcrypt = require('bcrypt');

//Validate Password Function
function validatePass(password){
  const minLength=8;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if(password.length === 0)
  {
    return "Password is empty";
  }

  if(password.length < minLength){
      return "Password must be longer than 8 characters";
  }
  if(!passwordRegex.test(password)){
      return "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character";
  }
  return "Password is valid";
}

//Signup Function
const signup = async (req, res) => {
    const { username, password, email } = req.body;
    console.log(req.body);

    //Validate Username using regex
    // //const usernameError = validateUsername(username);
    // const passwordError = validatePass(password);
  
    // // if (usernameError) {
    // //   return res.status(400).json({ message: usernameError });
    // // }
    
    // if (passwordError) {
    //   return res.status(400).json({ message: passwordError });
    // }

     try {
       // Check if user already exists
       const { data: existingUser } = await supabase
         .from('User')
         .select('username') // Only select the username
         .eq('username', username)
         .single();
         console.log('after db call');
        console.log(existingUser);
       if (existingUser) {
         return res.status(400).json({ message: 'Username already in use' });
       }
  
       // Hash the password
       //console.log(bcrypt);
     // const hashedPassword = await bcrypt.hash(password, 10).then(console.log(hashedPassword));
      // const salt = await bcrypt.genSalt();
      // const hashedPassword = await bcrypt.hash(password, salt).then(console.log(hashedPassword));
      //  res.status(201).json({ message: 'User created successfully', user: data });
      // Add user to the database
     
      const { data, error } = await supabase
        .from('User')
        .insert([{ username, password_hash: password, email, role: "volunteer" }]);
  
      if (error) {
        res.status(500).json({ message: 'Error adding user', error: error.message });
      }
  
       res.status(201).json({ message: 'User created successfully', user: data });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error creating user', error: error.message });
    }
  };

  //Login Function
  const login = async (req, res) => {
    console.log('Received request:', req.body);

    const { username, password } = req.body;
  
    try {
      // Retrieve the user by username
      const { data: user, error: fetchError } = await supabase
        .from('User') 
        .select('username, password_hash')
        .eq('username', username)
        .single();
  
      if (fetchError || !user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      // Compare the password with the hashed password stored in the database
      //const isMatch = await bcrypt.compare(password, user.password_hash);
  {/*if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    */}
      if (password !== user.password_hash) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      res.status(200).json({ message: 'Login successful', user: user /*, token */ });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error: error.message });
    }
  };

  // Function to send a password reset email
const resetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
      return res.status(400).json({ error: 'Email is required' });
  }

  try {
      // Supabase API call to send a password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
          return res.status(400).json({ error: 'Failed to send password reset email. Please try again.' });
      }

      return res.status(200).json({ message: 'If the email is registered, a password reset link has been sent.' });
  } catch (err) {
      console.error('Error sending password reset email:', err);
      return res.status(500).json({ error: 'Internal server error.' });
  }
};
  
  module.exports = {
    signup,
    login,
    resetPassword,
  };
  