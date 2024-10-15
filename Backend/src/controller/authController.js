const supabase = require('../config/supabaseClient');
const bcrypt = require('bcrypt');

const signup = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('User')
        .select('username') // Only select the username
        .eq('username', username)
        .single();
  
      if (existingUser) {
        return res.status(400).json({ message: 'Username already in use' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create the new user
      const { data, error } = await supabase
        .from('User')
        .insert([{ username, password_hash: hashedPassword }]);
  
      if (error) {
        throw error;
      }
  
      res.status(201).json({ message: 'User created successfully', user: data });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error: error.message });
    }
  };

  //Login Function
  const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Retrieve the user by username
      const { data: user, error: fetchError } = await supabase
        .from('User') // Make sure this matches your table name
        .select('username, password_hash')
        .eq('username', username)
        .single();
  
      if (fetchError || !user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // Compare the password with the hashed password stored in the database
      const isMatch = await bcrypt.compare(password, user.password_hash);
  
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      res.status(200).json({ message: 'Login successful', user: user /*, token */ });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error: error.message });
    }
  };
  
  module.exports = {
    signup,
    login,
  };
  