import React, { useState, useEffect } from "react";
import API_BASE_URL from '../config';



function CreateAdminUser() {

    const[usercheckerror, setUserCheckError] = useState('');
    const[usermsg, setUserMsg] = useState('');
    

    const intialValues = { username: "", password: "", confirmPassword: "",
         email: "", firstName: "", lastName: ""         
    };
    const [formValues, setFormValues] = useState(intialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);


    const submit = () => {
        //console.log(formValues);
        setUserMsg("");
        handleSignup();
      };
    
      //input change handler
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
      };

      const handleUserBlur = (e) => {
        const { name, value } = e.target;
       console.log("blur:" + value)
       if (value != "")
       {
          handleUserCheck();
       }
       else 
       {
            //formErrors.username == "Username is required";
            setUserCheckError("Username is required");
       }
      };
    
      //form submission handler
      const handleSubmit = (e) => {
        e.preventDefault();
        if (formValues.username == "")
            setUserCheckError("Username is required");
        setFormErrors(validate(formValues));
        setIsSubmitting(true);
        
      };
    
      //form validation handler
      const validate = (values) => {
        let errors = {};
        setUserMsg('');
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    
        if (!values.email) {
          errors.email = "Email is required";
        } else if (!regex.test(values.email)) {
          errors.email = "Invalid email format";
        }
        console.log("--formvalues");
        console.log(formValues);
        if (values.username == "") {
            errors.username = "Username is required";
        } else
        if (usercheckerror != "")
         {
             errors.username = usercheckerror;
         }         

        if (!values.password) {
          errors.password = "Password is required";
        } 
        else if (values.password.length < 6) {
          errors.password = "Password must be 6 characters or more";
        }
        


          if(!values.confirmPassword)
            errors.confirmPassword = "Confirm Password is required";

            if (values.password && values.confirmPassword)
            {
                if(values.password != values.confirmPassword)
                    errors.confirmPassword = "Password and Confirm Password do not match";
            }

            
            
            if(errors)
            {
                setUserMsg("Please fill required fields");
            }

        return errors;
      };
    
      useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmitting) {
            console.log("use effect submit")
          submit();
        }
      }, [formErrors]);
    function makeFormData() {
       var signupData = {
        volunteerData: {
            username:formValues.username,
            password:formValues.password,
            email:formValues.email,
            firstName:formValues.firstName,
            lastName:formValues.lastName
        }  
    };
           // console.log(signupData)
        return signupData;
    }
       // username: "", password: "", confirmPassword: "", email: "", firstName: "", lastName: "", inputName: "", address: "", city: "", state: "", zip: "",
       //  phoneNumber: "", receivesms: false, receiveemail: false, smalldog: false, bigdog: false, cat: false, onetimeevent: false,
    const handleSignup = async () => {
            try{
                setLoading(true);
                const signupData = makeFormData();
                console.log(JSON.stringify(signupData));
                //console.log(JSON.stringify(formValues));
                const response = await fetch(`${API_BASE_URL}/api/auth/createadminuser`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(signupData),
                });
                const result = await response.json();
                console.log("Admin Signup Response Received: ")
                console.log(result)
                console.log(response)
                if (response.ok) {
                    if (result.error)
                    {
                        console.log(result.message);
                        setUserMsg(result.message);
                    }
                } else{
                    setUserMsg("Unexpected error in admin signup");
                }
                
            }
             catch(error){
                console.log("Catch Block Error: ")
                console.log(error)
                throw error;
            }
            finally {
                setLoading(false);
            }
    };

    const handleUserCheck = async () => {
        console.log("Entering handle user check for: " + formValues.username)
        try{
            setUserCheckError('');
            const response = await fetch(`${API_BASE_URL}/api/auth/checkuserexists`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username: formValues.username}),
            });
            const result = await response.json();
            console.log(result);
            if (response.ok) {
                if (result.error == "Y")
                {
                    console.log(result.message);
                    setUserCheckError(result.message)
                }
            }
        }
         catch(error){
            setUserCheckError("Unexpected error user check");
        }
};

    return (

                 
        <section>
            <div className="container pb-5">
                <div>
                    <h3>Fill out the following form to create an admin user.</h3>
                </div>
                <div className="p-5 rounded-5 " style={{backgroundColor: '#f0f6fd'}}>
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="row gx-5 gy-3 mb-3">
                        {/* <div className="col-md-6">
                            <label htmlFor="inputFirstName" className="form-label">First Name *</label>
                            <input type="text"
                                    name="firstName"
                                    value={formValues.firstName} 
                                    className="form-control"
                                    id="inputFirstName" 
                                    onChange={handleChange} 
                                    required/>
                            {formErrors.firstName && (
                            <span className="error">{formErrors.firstName}</span>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="inputLastName" className="form-label">Last Name *</label>
                            <input type="text"
                                    name="lastName"
                                    value={formValues.lastName} 
                                    className="form-control"
                                    id="inputLastName" 
                                    onChange={handleChange} 
                                    required/>
                            {formErrors.lastName && (
                            <span className="error">{formErrors.lastName}</span>
                            )}
                        </div>

                        <hr className="mt-5"/> */}

                        <div className="col-md-6">
                            <label htmlFor="inputUsername" className="form-label">Username *</label>
                            <input type="text"
                                    name="username"
                                    value={formValues.username} 
                                    className="form-control"
                                    id="inputUsername" 
                                    onBlur={handleUserBlur}
                                    onChange={handleChange} />
                            {usercheckerror !='' && (
                            <span className="error">{usercheckerror}</span>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="inputEmail" className="form-label">Email *</label>
                            <input type="email"
                                    name="email"
                                    value={formValues.email} 
                                    className="form-control"
                                    id="inputEmail" 
                                    onChange={handleChange} 
                                    required/>
                            {formErrors.email && (
                            <span className="error">{formErrors.email}</span>
                            )}
                        </div>
                        <div className="col-md-6">
                        <label htmlFor="inputPassword" className="form-label">Password *</label>
                            <input type="password"
                                    name="password"
                                    value={formValues.password} 
                                    className="form-control"
                                    id="inputPassword" 
                                    onChange={handleChange} 
                                    required/>
                            {formErrors.password && (
                            <span className="error">{formErrors.password}</span>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="inputconfirmPassword" className="form-label">Confirm Password *</label>
                            <input type="password"
                                    name="confirmPassword"
                                    value={formValues.confirmPassword} 
                                    className="form-control"
                                    id="inputconfirmPassword" 
                                    onChange={handleChange} 
                                    required/>
                            {formErrors.confirmPassword && (
                            <span className="error">{formErrors.confirmPassword}</span>
                            )}
                        </div>

                    </div>
                        <hr className="mt-5"/>
                        <div>
                            <div className="col-12 my-3">
                                <button type="submit" 
                                className="btn btn-primary"
                                disabled={loading}
                                >Create User</button>
                            </div>
                            <span className="error">{usermsg}</span>
                            {loading ? (<p>Working...</p>) : ''}
                                                        

                        </div> 
                    </form>
                </div>
            </div>
            
        </section>
           
    );
};

export default CreateAdminUser;