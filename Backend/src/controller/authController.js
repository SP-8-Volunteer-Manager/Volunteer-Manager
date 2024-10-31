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
    const { username, password, email } = req.body; /// user date
    const {firstName, lastName,  address, phoneNumber, city, state, zip, carrier, receiveemail, receivesms} = req.body; //volunteer data
    const {shiftpref} = req.body;  // shift data
    const {taskpref} = req.body;   // task data
    // NOTE: This function will rollback in case of error

     try {
       // Check if user already exists, as a double check
       const { data: existingUser } = await supabase
         .from('User')
         .select('username') // Only select the username
         .eq('username', username)
         .single();
         console.log('---Signup--');
        // console.log(existingUser)
         if (existingUser) {
          console.log('Signup usercheck!!! How did the happen????');
          console.log(existingUser)
          return res.status(200).json({ error:"Y", message: 'Signup username already exists'});
        }

// ------------- Local user add outine ------
       // Hash the password
       //console.log(bcrypt);
      console.log("Add User")
      const hashedPassword = await bcrypt.hash(password, 10);
      // Add user to the database
      const { data, error } = await supabase
        .from('User')
        .insert([{ username, password_hash: hashedPassword, email, role: "volunteer" }])
        .select();
      // console.log(error)

      if (error != null) {
        return res.status(200).json({ message: 'Error adding user', error: error.message });
      }
      // get the id from the user table.
      //console.log(data);
      let userid = data[0].id;
      console.log("Created user: " + userid)


//----------------- insert into volunteer -------------------
    const { data:vdata, error: verror } = await supabase
        .from('volunteer')
        .insert([{ user_id: userid, first_name: firstName, last_name: lastName, phone: phoneNumber, address: address, 
          city: city, state: state, zip_code: zip, consent_for_sms: receivesms, carrier: carrier, receive_email: receiveemail, receive_phone: receivesms}])
        .select(); //state not working
       // get volunteer id
      if (verror != null) {
        console.log(verror);
        await rollback(true, false, false, false, userid, -1);
        return res.status(200).json({ message: 'Error adding volunteer', error: verror.message });
      }
      // volunteerid get
      let volid = vdata[0].id;
      console.log("Created volunteer: " + volid)


// populate task_pref
    // ------------- insert tasks pref ------------------
  console.log("Creating task preferences")
  for (let i = 0; i < taskpref.length; i++)
    {
        let taskname = taskpref[i];
        const { data:tdata, error:terror } = await supabase
        .from('task_type')
        .select('*')
        .eq('type_name', taskname)
        .single();
        if(!tdata){
          console.log(terror);
          await rollback(true, true, true, false, userid, volid);
          return res.status(200).json({ message: 'Read error, task_type table', error: terror.message });
          }
      //console.log(sdata)
       //insert into task preference 
      const { data: tdata2, error: terror2 } = await supabase
          .from('task_prefer')
          .insert([{ volunteer_id: volid, task_type_id: tdata.id }])
          .select();
      if(terror2 != null){
        console.log(terror2);
        await rollback(true, true, true, false, userid, volid);
        return res.status(200).json({ message: 'Insert error, task preference', error: terror2.message });
        }
    }

// ----------------- insert shift_pref---------------------------
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
          //console.log(sdata)
          //console.log(serror)
          if (serror != null){
            console.log(serror);
            await rollback(true, true, true, true, userid, volid);
            return res.status(200).json({ message: 'Error inserting to shift_pref table', error: serror.message });
            }
        //console.log(sdata)
        //console.log(`${sdata.id}  ${sdata.day} - ${sdata.time}`);
         //insert into shift preference 
        const { data: sdata2, error: serror2 } = await supabase
            .from('shift_prefer')
            .insert([{ volunteer_id: volid, shift_id: sdata.id }]);

        if (serror2 != null) {
          console.log(serror2)
          await rollback(true, true, true, true, userid, volid);
          return res.status(200).json({ message: 'Insert error, shift preference', error: serror.message });
          }
      }


      
    // ----------------- supabase sign up user with Supabase.auth 
    //-----------This code works once custom domain was created and integrated with supabase
    //  1. Create free domain with cloudns
    //  2. Create an account with resend and configure cloudns with information from resend
    //  3. Verify the domain in cloudns
    //  4. Integrate resend with supabase by choosing domain and creating api key
    //  5. The code below will work after that
    const { data: authdata, error: autherror } = await supabase.auth.signUp({
      email: email,
      password: password,
    })
    console.log(authdata)
    console.log(autherror)
    if (autherror) {
      return res.status(500).json({ message: 'Supabase signup error', error: autherror.message });
    }
    
      return res.status(200).json({message: "Successfully signed up", error: "N"});
            

    } catch (error) {  // global catch
      return res.status(500).json({ message: "Global signup exception"});
    }
  };

  //Login Function
  const login = async (req, res) => {
    console.log('Received request login');
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
      const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {

        return res.status(401).json({ message: 'Invalid email or password' });

      }

    
{/*
      if (password !== user.password_hash) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }*/}
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
    checkuserexists,
    signup,
    login,
    resetPassword
  };