const e = require('express');
const supabase = require('../config/supabaseClient');
const bcrypt = require('bcryptjs');

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
const checkuserexists = async (req, res) => {
  const {username} = req.body;
  try {
    const { data: existingUser } = await supabase
    .from('User')
    .select('username') // Only select the username
    .eq('username', username)
    .single();
    console.log('--checkuserexists--');
    console.log(existingUser);

   if (existingUser) {
      return res.status(200).json({ error:"Y", message: 'Username already exists'});
   }
   else{
    return res.status(200).json({ error:"N", message: ''});

   }
  }
  catch{
    return res.status(500).json({ error:"Y", message: 'Error on user lookup'});
  }
}

const rollback = async (user, volunteer, task, shift, userid, volid) => {
  if (task === true)
  {
    const { error } = await supabase
    .from('task_prefer')
    .delete()
    .eq('volunteer_id', volid);
    if (error)
    {
      return res.status(500).json({ message: 'Error rollback task', error: error.message });
    }
    console.log("Task Rollback Succcessful")
  }

  if (shift === true)
    {
      const { error } = await supabase
      .from('shift_prefer')
      .delete()
      .eq('volunteer_id', volid);
      if (error)
      {
        return res.status(500).json({ message: 'Error rollback shift', error: error.message });
      }
      console.log("Shift Rollback Succcessful")
    }

    if (volunteer === true)
      {
        const { error } = await supabase
        .from('volunteer')
        .delete()
        .eq('id', volid);
        if (error)
        {
          return res.status(500).json({ message: 'Error rollback volunteer', error: error.message });
        }
        console.log("Volunteer Rollback Succcessful")
      }

      if (user === true)
        {
          const { error } = await supabase
          .from('User')
          .delete()
          .eq('id', userid);
          if (error)
          {
            return res.status(500).json({ message: 'Error rollback User', error: error.message });
          }
          console.log("User Rollback Succcessful")
        }
        console.log("Rollback Complete")
}

//Signup Function
const signup = async (req, res) => {
    // const { username, password, email } = req.body; /// user date
    // const {firstName, lastName,  address, phoneNumber, city, state, zip, receiveemail, receivesms} = req.body; //volunteer data
    const { volunteerData } = req.body;
    const {  schedulePreferences, taskPreferences } = req.body;
    var userid, volid;
    //console.log("Volunteer Data", volunteerData)

    // NOTE: This function will rollback in case of error

     try {
       // Check if user already exists, as a double check
       const { data: existingUser } = await supabase
         .from('User')
         .select('username') // Only select the username
         .eq('username', volunteerData.username)
         .single();
         console.log('---Signup--');
         //console.log(existingUser)
         if (existingUser) {
          console.log('Signup usercheck!!! How did the happen????');
          console.log(existingUser)
          return res.status(200).json({ error:"Y", message: 'Signup username already exists'});
        }

// ------------- Local user add outine ------
       // Hash the password
       //console.log(bcrypt);
      console.log("Add User")
      //const hashedPassword = await bcrypt.hash(volunteerData.password, 10);
      // Add user to the database
      //console.log("Just before user insert")
      const { data, error } = await supabase
        .from('User')
        .insert([{ username: volunteerData.username,
           //password_hash: hashedPassword, 
           email: volunteerData.email, role: "volunteer" }])
        .select();
       //console.log(error)

      if (error != null) {
        return res.status(200).json({ message: 'Error adding user', error: error.message });
      }
      // get the id from the user table.
      //console.log(data);
      userid = data[0].id;
      var useremail = data[0].email;
      var userrole = data[0].role;
      var userusername = data[0].username;

      console.log("Created user: " + userid)


//----------------- insert into volunteer -------------------
    const { data:vdata, error: verror } = await supabase
        .from('volunteer')
        .insert([{ user_id: userid, 
          first_name: volunteerData.firstName, 
          last_name: volunteerData.lastName, 
          phone: volunteerData.phoneNumber, 
          address: volunteerData.address, 
          city: volunteerData.city, 
          state: volunteerData.state, 
          zip_code: volunteerData.zip, 
          consent_for_sms: volunteerData.receivesms, 
          carrier: '',
          receive_email: volunteerData.receiveemail, 
          receive_phone: volunteerData.receivesms}])
        .select(); //state not working
       // get volunteer id
      if (verror != null) {
        console.log(verror);
        await rollback(true, false, false, false, userid, -1);
        return res.status(200).json({ message: 'Error adding volunteer', error: verror.message });
      }
      // volunteerid get
      volid = vdata[0].id;
      console.log("Created volunteer: " + volid)


    // ------------- insert tasks pref ------------------
  console.log("Creating task preferences")
        const taskUpdates = taskPreferences.map(pref => ({
            volunteer_id: volid,
            task_type_id: pref.task_type_id, 
        }));

        const { error: taskError } = await supabase
            .from('task_prefer')
            .insert(taskUpdates);

        if (taskError) 
        {
          await rollback(true, true, true, false, userid, volid);
          return res.status(200).json({ message: 'Insert error, task preference', error: taskError.message });
        }

// ----------------- insert shift_pref---------------------------
    console.log("Creating shift preferences")
    const scheduleUpdates = schedulePreferences.map(pref => ({
      volunteer_id: volid,
      shift_id: pref.shift_id, 
    }));

    const { error: scheduleError } = await supabase
      .from('shift_prefer')
      .insert(scheduleUpdates);

    if (scheduleError) 
    {
      await rollback(true, true, true, true, userid, volid);
      return res.status(200).json({ message: 'Insert error, shift preference', error: scheduleError.message });
    }
    
    // ----------------- supabase sign up user with Supabase.auth 
    //-----------This code works once custom domain was created and integrated with supabase
    //  1. Create free domain with cloudns
    //  2. Create an account with resend and configure cloudns with information from resend
    //  3. Verify the domain in cloudns
    //  4. Integrate resend with supabase by choosing domain and creating api key
    //  5. The code below will work after that
    const rcdata = {userId: userid, username: userusername, email: useremail, role: userrole}
    //console.log(rcdata)
    //await rollback(true, true, true, true, userid, volid);
    const { data: authdata, error: autherror } = await supabase.auth.signUp({
      email: volunteerData.email,
      password: volunteerData.password,
      options: {
        data: rcdata
      }
    })
    
    
    console.log(authdata)
    console.log(autherror)
    if (autherror) {
      return res.status(500).json({ message: 'Supabase signup error', error: autherror.message });
    }
    
      return res.status(200).json({message: "Successfully signed up. Please check your email for verification link", error: "N"});
            

    } catch (error) {  // global catch
      await rollback(true, true, true, true, userid, volid);
      return res.status(500).json({ message: "Global signup exception"});
    }
  };

  //Login Function
  const login = async (req, res) => {
    console.log('Received request login');
    const { username, password } = req.body;
    var em = ''
    try {
      // Retrieve the user by username
      const { data: user, error: fetchError } = await supabase
        .from('User')
        .select('id, username, email, role')
        .eq('username', username)
        .single();

      if (fetchError || !user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Compare the password with the hashed password stored in the database
      // const isMatch = await bcrypt.compare(password, user.password_hash);

      // if (!isMatch) {
      //   return res.status(401).json({ message: 'Invalid email or password' });
      // }
      // login to supabase
      em = user.email;
      const { data:authData, error:authError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password
      });
      if (authError) {
        return res.status(401).json({ message: 'Error signing in with Supabase', error: authError.message });
      }
    
    const rcdata = {
      userId: user.id, 
      username: user.username, 
      email: user.email, 
      role: user.role,
     
    }
   
    // Access the access_token from the session
    const accessToken = authData?.session?.access_token;
    const refreshToken = authData?.session?.refresh_token;
    if (accessToken) {
      
      // res.cookie('supabase_session', accessToken, {
      //   httpOnly: true, // This makes the cookie inaccessible from JS (helps with XSS attacks)
      //   secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      //   maxAge: 60 * 60 * 1000, // Cookie expiration (1 hour)
      //   sameSite: 'Strict' // For preventing CSRF attacks
      // });



    //console.log(rcdata)
      res.status(200).json({
            message: 'Login successful',
            accessToken: accessToken, // Sending the access token to the frontend
            refreshToken: refreshToken,
            user: rcdata
        });
    }
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error: error.message });
    }
  };
  const refreshToken = async (req, res) => {
     const { refreshToken } = req.body;     

    if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required.' });
    }

    try {
        const { data, error } = await supabase.auth.refreshSession({
            refresh_token: refreshToken,
        });
  
  
        if (error || !data?.session) {
          
            return res.status(401).json({ error: 'Token refresh failed. Please log in again.' });
        }

        res.json({
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
        });
    } catch (err) {
        console.error('Token refresh error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

  const logout = async (req, res) => {
   
    try {
      
      const token = req.headers['authorization']?.split(' ')[1]; // Extract token from the Authorization header
      
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
      }
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error) {
        console.error("Error fetching user:", error.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
      
      if (!user) {
        console.error("User not found for token:", token);
        return res.status(401).json({ message: 'No user found for the provided token' });
      }
  
      
      // If the user is authenticated, log them out
      const { error: logoutError } = await supabase.auth.signOut();
      
      if (logoutError) {
        return res.status(500).json({ message: 'Error logginddg out', error: logoutError.message });
      }
      return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Error logginaag out', error: error.message });
    }
  };
  // Function to send a password reset email
const forgotPassword = async (req, res) => {
  
  const { email } = req.body;
  

  if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return res.status(400).json({ error: 'Valid email is required.' });
}

  try {
      // Supabase API call to send a password reset email
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        email,
        { redirectTo: `${process.env.FRONTEND_URL}/updatePassword` }
      )
      if (error) {
          return res.status(400).json({ error: 'Failed to send password reset email. Please try again.' });
      }
     
      return res.status(200).json({ message: 'If the email is registered, a password reset link has been sent.' });
  } catch (err) {
      console.error('Error sending password reset email:', err);
      return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Update password using the reset token
const updatePassword = async (req, res) => {
  const accessToken = req.headers['authorization']?.split(' ')[1]; // Extract token from the Authorization header
  const { newPassword  } = req.body;
  // Set the accessToken to Supabase's auth client


  if (!accessToken || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
  }

  try {
    const supabaseAdmin = require('@supabase/supabase-js').createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Hash the new password
    //const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const { data: session, error: sessionError } = await supabase.auth.getUser(accessToken);
   


    if (sessionError || !session) {
      return res.status(400).json({ error: 'Invalid session or token' });
    }
    const userId = session.user.id;
    const email = session.user.email;
    // Update the password in Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword,
    });
    if (authError) {
      console.log(authError);
      return res.status(400).json({ error: 'Failed to update password in Supabase Auth. Please try again.' });
    }
    // Update the hashed password in the "User" table. Using supabase so removed it
    // const { data: userData, error: userError } = await supabase
    //   .from('User')
    //   .update({ password_hash: hashedPassword })  
    //   .eq('email', email); 

    // if (userError) {
    //   console.log(userError);
    //   return res.status(400).json({ error: 'Failed to update password in the User table. Please try again.' });
    // }

    return res.status(200).json({ message: 'Password has been successfully reset.' });
  } catch (err) {
    console.error('Error resetting password:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }

};

const createAdminUser = async (req, res) => {
  const { volunteerData } = req.body;
  var userid, volid;
  //console.log("Volunteer Data", volunteerData)

  // NOTE: This function will rollback in case of error

   try {
     // Check if user already exists, as a double check
     const { data: existingUser } = await supabase
       .from('User')
       .select('username') // Only select the username
       .eq('username', volunteerData.username)
       .single();
       console.log('---Signup--');
       //console.log(existingUser)
       if (existingUser) {
        console.log('Signup usercheck!!! How did the happen????');
        console.log(existingUser)
        return res.status(200).json({ error:"Y", message: 'Signup username already exists'});
      }

// ------------- Local user add outine ------
     // Hash the password
     //console.log(bcrypt);
    console.log("Add User")
    //const hashedPassword = await bcrypt.hash(volunteerData.password, 10);
    // Add user to the database
    //console.log("Just before user insert")
    const { data, error } = await supabase
      .from('User')
      .insert([{ username: volunteerData.username, 
        //password_hash: hashedPassword, 
        email: volunteerData.email, role: "admin" }])
      .select();
     //console.log(error)

    if (error != null) {
      return res.status(200).json({ message: 'Error adding user', error: error.message });
    }
    // get the id from the user table.
    //console.log(data);
    userid = data[0].id;
    var useremail = data[0].email;
    var userrole = data[0].role;
    var userusername = data[0].username;

    console.log("Created Admin user: " + userid)
  
  // ----------------- supabase sign up user with Supabase.auth 
  //-----------This code works once custom domain was created and integrated with supabase
  //  1. Create free domain with cloudns
  //  2. Create an account with resend and configure cloudns with information from resend
  //  3. Verify the domain in cloudns
  //  4. Integrate resend with supabase by choosing domain and creating api key
  //  5. The code below will work after that
  const rcdata = {userId: userid, username: userusername, email: useremail, role: userrole}
  //console.log(rcdata)
  const { data: authdata, error: autherror } = await supabase.auth.signUp({
    email: volunteerData.email,
    password: volunteerData.password,
    options: {
      data: rcdata
    }
  })
  
  
  console.log(authdata)
  console.log(autherror)
  if (autherror) {
    return res.status(500).json({ message: 'Supabase signup error', error: autherror.message });
  }
  
    return res.status(200).json({message: "Admin User Created. Please check your email for verification link", error: "N"});
          

  } catch (error) {  // global catch
    return res.status(500).json({ message: "Global create admin exception"});
  }
};
  
  module.exports = {
    checkuserexists,
    signup,
    login,
    logout,
    forgotPassword,
    updatePassword,
    createAdminUser,
    refreshToken  
  };