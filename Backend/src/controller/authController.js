const { authLogin } = require('../supabase/authLogin'); // Import authLogin function
const { createAuthUser } = require('../supabase/createAuthUser'); // Import createAuthUser function
const { createDbUser } = require('../supabase/createDbUser'); // Import createDbUser function
const { supabase } = require('../config/supabaseClient'); // Assuming this exports the supabase instance
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
const checkuserexists = async (req, res) => {
  const {username} = req.body;
  try {
    const { data: existingUser } = await supabase
    .from('User')
    .select('username') // Only select the username
    .eq('username', username)
    .single();
    console.log('after usercheck');
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

//Signup Function
const signup = async (req, res) => {
    const { username, password, email } = req.body; /// user date
    const {firstName, lastName,  address, phoneNumber, city, state, zip, carrier, receiveemail, receivesms, smalldog, bigdog, cat, onetimeevent} = req.body; //volunteer data
    const {shiftpref} = req.body;
    // NOTE: This function does not implement supabase transactions as of now
    // Researching this currently, if all database calls work signup will be complete

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
       // Check if user already exists, as a double check
       const { data: existingUser } = await supabase
         .from('User')
         .select('username') // Only select the username
         .eq('username', username)
         .single();
        if (existingUser) {
          console.log('Signup usercheck!!! How did the happen????');
          return res.status(200).json({ error:"Y", message: 'Username already exists'});
        }
       // Hash the password
       //console.log(bcrypt);
      const hashedPassword = await bcrypt.hash(password, 10);
      // Add user to the database
      const { data, error } = await supabase
        .from('User')
        .insert([{ username, password_hash: hashedPassword, email, role: "volunteer" }])
        .select();
       
      if (error) {
        res.status(200).json({ message: 'Error adding user', error: error.message });
      }
      // get the id from the user table.
      console.log(data);
      let userid = data[0].id;
      console.log("Created user: " + userid)


// insert into volunteer
    const { data:vdata, error: verror } = await supabase
        .from('volunteer')
        .insert([{ user_id: userid, first_name: firstName, last_name: lastName, phone: phoneNumber, address: address, 
          city: city, state: state, zip_code: zip, consent_for_sms: receivesms, carrier: carrier, receive_email: receiveemail, receive_phone: receivesms}])
        .select(); //state not working
       // get volunteer id
      if (verror) {
        console.log(verror);
         res.status(500).json({ message: 'Error adding volunteer', error: verror.message });
      }
      // volunteerid get
      let volid = vdata[0].id;
      console.log("Created volunteer: " + volid)


// populate task_pref
    // insert tasks into 
  console.log("Creating task preferences")

    if (smalldog === true)
      {
        const { data: sddata, error: sderror } = await supabase
          .from('task_prefer')
          .insert({ volunteer_id: volid, task_id: 1 });
          //console.log("Task Preference " + volid + " taskid 1")
           if(sderror)
           {
             console.log(sderror);
             res.status(500).json({ message: 'Error inserting to task_pref table for small dog', error: sderror.message });
           }
      }
      if (bigdog === true)
        {
          const { data: bddata, error: bderror } = await supabase
            .from('task_prefer')
            .insert([{ volunteer_id: volid, task_id: 2 }]);
            //console.log("String inserted " + volid + " taskid 2")
            if (bderror)
            {
            console.log(bderror);
            res.status(500).json({ message: 'Error inserting to task_pref table for big dog', error: bderror.message });
            }
        }
  
      if (cat === true)
        {
          const { data: cdata, error: cerror } = await supabase
            .from('task_prefer')
            .insert([{ volunteer_id: volid, task_id: 3 }]);
            //console.log("Task Preference " + volid + " taskid 3")
            if(cerror)
            {
            console.log(cerror);
            res.status(500).json({ message: 'Error inserting to task_pref table for cat', error: cerror.message });
            }
        }
  
      if (onetimeevent === true)
        {
          const { data: otedata, error: oteerror } = await supabase
            .from('task_prefer')
            .insert([{ volunteer_id: volid, task_id: 4 }]);
            //console.log("String inserted " + volid + " taskid 4")
            if(oteerror){
            console.log(oteerror);
            res.status(500).json({ message: 'Error inserting to task_pref table for one time task', error: oteerror.message });
            }
        }



// insert shift_pref
// for each shiftPref array
// look up shift_id  of day and time
// isert (volid,shiftid)

console.log("Creating shift preferences")
//console.log(shiftpref)
      for (let i = 0; i < shiftpref.length; i++)
      {
          const { data:sdata, error:serror } = await supabase
          .from('shift')
          .select('*')
          .match({day:shiftpref[i].day, time : shiftpref[i].time})
          .single();
          if(serror){
            console.log(serror);
            res.status(500).json({ message: 'Error inserting to task_pref table for one time task', error: serror.message });
            }
        //console.log(sdata)
        //console.log(`${sdata.id}  ${sdata.day} - ${sdata.time}`);
         //insert into shift preference 
        const { data: sdata2, error: serror2 } = await supabase
            .from('shift_prefer')
            .insert([{ volunteer_id: volid, shift_id: sdata.id }]);
        if(serror2){
          console.log(serror);
          res.status(500).json({ message: 'Error inserting to task_pref table for one time task', error: serror.message });
          }
      }

      res.status(200).json({message: "Successfully signed up", error: "N"});
            

    } catch (error) {  // global catch
      console.log(error);
      res.status(500).json({ message: error.message});
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
 const post_signup = async (req, res) => {
  // Destructure email and password from req.body
  const { email, password, username } = req.body;
  try {
    // Await the authId from createAuthUser
    const authId = await createAuthUser(email, password); // Ensure you await this if it's a promise

    // Now call createDbUser with the authId, username, and email
    await createDbUser({ auth_id: authId, username, email });

    // Respond with success
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};


 const post_login = async (req, res) => {
  let {email,password}=req.body;

  try{
   let data = await authLogin(email,password);
  res.status(200).json({ message: 'User created successfully' });
  } catch(error){
    res.status(400).json({ message: 'Error creating user', error: error.message });
  }
};
  module.exports = {
    checkuserexists,
    signup,
    login,
    resetPassword,
    post_signup,
    post_login
  };