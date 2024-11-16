import React, { useState, useEffect } from "react";
import StateDropdown from '../Components/StateDropdown';

import API_BASE_URL from '../config';
import Select from 'react-select';



function SignUpPage() {

    const[usercheckerror, setUserCheckError] = useState('');
    const[usermsg, setUserMsg] = useState('');
    const [scheduleOptions, setScheduleOptions] = useState([]);
    const [taskOptions, setTaskOptions] = useState([]);
    

    const intialValues = { username: "", password: "", confirmPassword: "",
         email: "", firstName: "", lastName: "", inputName: "", 
         address: "", city: "", state: "", zip: "",
         phoneNumber: "", 
         
         receivesms: false, receiveemail: false, 
         emailoptin: false,
         smsoptin: false,
         schedPref:   [],
        taskPref:   []
         
    };
    const [formValues, setFormValues] = useState(intialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);



    // Fetch options for schedule and task preferences
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const scheduleResponse = await fetch(`${API_BASE_URL}/api/admin/scheduleOptions`);
                if (!scheduleResponse.ok) {
                    throw new Error(`Failed to fetch schedule options, status: ${scheduleResponse.status}`);
                }
                const scheduleData = await scheduleResponse.json();
                //console.log('schedule data', scheduleData);
                var schedTemp = scheduleData.map(option => ({
                    key: option.id,
                    value: option.id,
                    label: `${option.day} ${option.time}`
                }))
                //console.log("Sched Temp", schedTemp)
                setScheduleOptions(schedTemp);
                //console.log("After fetch shift", scheduleOptions)
                const taskResponse = await fetch(`${API_BASE_URL}/api/admin/taskOptions`);
                if (!taskResponse.ok) {
                    throw new Error(`Failed to fetch task options, status: ${taskResponse.status}`);
                }
                const taskData = await taskResponse.json();
                var taskTemp = taskData.map(option => ({
                    key: option.id,
                    value: option.id,
                    label: option.type_name
                }))
                setTaskOptions(taskTemp);
                //console.log("Task Temp", taskTemp)
                //console.log("After fetch task", taskOptions)
            } catch (error) {
                console.error('Error fetching options:', error);
            }
        };
        fetchOptions();
    }, []);

    // Handle changes to multiple select dropdowns
    const handleMultiSelectChange = (selectedOptions, field) => {
        setFormValues(prev => ({
            ...prev,
            [field]: selectedOptions || []
        }));
    };

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

      const handlePhone = (e) => {
        const { name, value } = e.target;
        let tempVal = value.replace(/[^0-9]/g, '');
        setFormValues({ ...formValues, [name]: tempVal });
      };

      const dropdownChange = (e) => {
        //console.log("Handle Change");
        const { name, value } = e.target;
        //console.log(name + " " +  value);
        setFormValues({ ...formValues, [name]: value });
      };

      const checkboxChange = (e) => {
        const { name, checked } = e.target;
        setFormValues({
            ...formValues,
            [name]: checked,
            ...(name === 'receivesms' && !checked ? { smsoptin: false } : {}),
            ...(name === 'receiveemail' && !checked ? { emailoptin: false } : {}),
        });
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
         if (!values.firstName) {
            errors.firstName = "First Name is required";
          }

          if (!values.lastName) {
            errors.lastName = "Last Name is required";
          }

          if (!values.inputName) {
            errors.inputName = "Please sign your name!";
          }

        //   console.log(values.phoneNumber.length);
        //   console.log(values.phoneNumber);
        console.log("ReceiveSMS: " + values.receivesms)
          if(values.phoneNumber) // phone exists
          {
            if(values.phoneNumber.length != 10)
            {
                errors.phoneNumber = "Must be exactly 10 digits"
            }
          }  // no phone number
          else if (values.receivesms === true)
            {
                errors.phoneNumber = "Phone number required for sms notifications";
            }

        

        
        if (values.receiveemail === false && values.receivesms === false)
        {
            errors.receiveemail = "Select at least one ";
        }

        if (values.receivesms === true && values.smsoptin === false)
        {
            errors.smsoptin = "SMS Opt-in required";
        }

        if (values.receiveemail === true && values.emailoptin === false)
        {
            errors.emailoptin = "Email Opt-in required";
        }

        

        if (!values.password) {
          errors.password = "Password is required";
        } 
        else if (values.password.length < 6) {
          errors.password = "Password must be 6 characters or more";
        }
        


          if(!values.confirmPassword)
            errors.confirmPassword = "Confirm Password is required";
        //   else if (values.confirmPassword.length < 8) {
        //     errors.confirmPassword = "Confirm Password must be 8 characters or more";
        //   }

            if (values.password && values.confirmPassword)
            {
                if(values.password != values.confirmPassword)
                    errors.confirmPassword = "Password and Confirm Password do not match";
            }

            if(values.receivesms === false && values.receiveemail === false)
            {
                errors.receiveemail = "Choose at least one communication method";
                errors.receivesms = "Choose at least one communication method";
            }


            //zip must be numeric and 5
            if (values.zip)
            {
                if(values.zip.length != 5)
                {
                    errors.zip = "Zip code must be 5 digits";
                }
            }

            if (values.schedPref.length == 0)
            {
                errors.schedPref = "Shift preference is required";
            }
        
            if (values.taskPref.length == 0)
            {
                errors.taskPref = "Task preference is required";
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
            lastName:formValues.lastName,
            address:formValues.address,
            city:formValues.city,
            state:formValues.state,
            zip:formValues.zip,
            phoneNumber:formValues.phoneNumber,
            
            receivesms:formValues.receivesms,
            receiveemail:formValues.receiveemail
        },
        schedulePreferences: formValues["schedPref"].map(pref => ({
            shift_id: pref.value 
        })),
        taskPreferences: formValues["taskPref"].map(pref => ({
            task_type_id: pref.value 
        }))};
           // console.log(signupData)
        return signupData;
    }
       // username: "", password: "", confirmPassword: "", email: "", firstName: "", lastName: "", inputName: "", address: "", city: "", state: "", zip: "",
       //  phoneNumber: "",  receivesms: false, receiveemail: false, smalldog: false, bigdog: false, cat: false, onetimeevent: false,
    const handleSignup = async () => {
            try{
                setLoading(true);
                const signupData = makeFormData();
                console.log(JSON.stringify(signupData));
                //console.log(JSON.stringify(formValues));
                const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(signupData),
                });
                const result = await response.json();
                console.log("Signup Response Received: ")
                console.log(result)
                console.log(response)
                if (response.ok) {
                    if (result.error)
                    {
                        console.log(result.message);
                        setUserMsg(result.message);
                    }
                } else{
                    setUserMsg("Unexpected error in signup");
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
                    <h1>Hi, there!</h1>
                    <p>The success of our organization is due largely to the number of outstanding volunteers we have. We appreciate your interest in pursuing volunteer opportunities with Homeward Bound.   We need you !! Please start the process by letting us know what areas you are interested in helping with and submit it using the button at the bottom of the page.
                    Applicants must be 18 years or older.</p>
                </div>
                <div className="p-5 rounded-5 " style={{backgroundColor: '#f0f6fd'}}>
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="row gx-5 gy-3 mb-3">
                        <div className="col-md-6">
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
                        
                        <div className="col-12">
                            <label htmlFor="inputAddress" className="form-label">Address</label>
                            <input type="text"
                                    name="address"
                                    value={formValues.address} 
                                    className="form-control"
                                    id="inputAddress" 
                                    placeholder="1234 Main St"
                                    onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="inputCity" className="form-label">City</label>
                            <input type="text" name="city" className="form-control" id="inputCity" onChange={handleChange}/>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="inputState" className="form-label">State</label>
                            <StateDropdown dropdownChange={dropdownChange}/>
                        </div>
                        <div className="col-md-2">
                            <label htmlFor="inputZip" className="form-label">Zip</label>
                            <input type="text" name="zip" className="form-control" id="inputZip" onChange={handleChange}/>
                            {formErrors.zip && (
                            <span className="error">{formErrors.zip}</span>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="inputPhoneNumber" className="form-label">Phone Number</label>
                            <input type="tel" name="phoneNumber" className="form-control" id="inputPhoneNumber" placeholder="Enter 10 digit phone number" onChange={handlePhone}/>
                            {formErrors.phoneNumber && (
                            <span className="error">{formErrors.phoneNumber}</span>
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
                       
                        <hr className="mt-5"/>

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

                        <hr className="mt-5"/>

                         <div className="col-md-12 mb-4">
                            
                            <p className="fw-bold mb-1"> Preferred communication method</p>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="checkSMS"
                                name="receivesms" 
                                value={formValues.receivesms} 
                                onChange={checkboxChange}/>
                                <label className="form-check-label" htmlFor="checkSMS">SMS notifications</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="checkEmail" 
                                name="receiveemail"
                                value={formValues.receiveemail}
                                onChange={checkboxChange}/>
                                <label className="form-check-label" htmlFor="checkEmail">Email notifications</label>
                            </div>
                            {formErrors.receiveemail && (
                            <span className="error">{formErrors.receiveemail}</span>
                            )}
                        </div> 

                        <div className="col-md-6">
                            <div className="form-check">
                                <p className="fw-bold mb-1"> Opt in to SMS messages</p>
                                <input className="form-check-input" type="checkbox" id="SMScheck" 
                                name="smsoptin" 
                                checked={formValues.smsoptin}
                                value={formValues.smsoptin} 
                                onChange={checkboxChange}
                                disabled={!formValues.receivesms}
                                required={formValues.receivesms}/>
                                <label className="form-check-label" htmlFor="SMScheck">
                                    By opting in you agree to receive SMS notifications about news, updates, volunteer activities.
                                </label>
                                {formErrors.smsoptin && (
                            <span className="error">{formErrors.smsoptin}</span>
                            )}
                            </div>
                        </div>


                        

                        <div className="col-md-6">
                            <div className="form-check">
                                <p className="fw-bold mb-1"> Opt in to email notifications</p>
                                <input className="form-check-input" type="checkbox" id="emailCheck"
                                name="emailoptin"
                                checked={formValues.emailoptin}
                                value={formValues.emailoptin}
                                onChange={checkboxChange}
                                disabled={!formValues.receiveemail}
                                required={formValues.receiveemail}/>
                                <label className="form-check-label" htmlFor="emailCheck">
                                    By opting in you agree to receive email notifications about news, updates, volunteer activities.
                                </label>
                                {formErrors.emailoptin && (
                            <span className="error">{formErrors.emailoptin}</span>
                            )}
                            </div>
                        </div>
                    
                        </div>
                        <hr className="mt-5"/>


                         {/* schedPref */}
                    <div className="col-12">
                        <label className="form-label">Schedule Preferences</label>
                        <Select
                            isMulti
                            options={scheduleOptions}
                            value={formValues["schedPref"]}
                            onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, "schedPref")}
                            
                        />
                        {formErrors.schedPref && (
                            <span className="text-danger">{formErrors.schedPref}</span>
                            )}
                    </div>

                        {/* Task Preferences */}
                    <div className="col-12">
                        <label style={{marginTop: '10px'}} className="form-label">Task Preferences</label>
                        <Select
                            isMulti
                            options={taskOptions}
                            value={formValues["taskPref"]}
                            onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, "taskPref")}
                            
                        />
                        {formErrors.taskPref && (
                            <span className="text-danger">{formErrors.taskPref}</span>
                            )}
                    </div>
                        <hr className="mt-5"/>

                        <div>
                            <p className="mt-5 mb-3">
                            Typing your name below will serve as legal signature. By signing below, I am attesting to the truthfulness of my answers. 
                            Falsification of any of the above information will be grounds for disallowing Volunteer Opportunities. 
                            Applicant must be 18 years of age or older. 
                            Homeward Bound reserves the right to refuse any applicant.
                            </p>
                            <div className="row g-5 align-items-center">
                                <div className="col-auto">
                                    <label htmlFor="signForm" className="col-form-label">Please enter your name and submit the application: *</label>
                                </div>
                                <div className="col-auto">
                                    <input type="text"
                                    name="inputName"
                                    value={formValues.inputName} 
                                    className="form-control"
                                    id="signForm" 
                                    onChange={handleChange} 
                                    required/>
                            {formErrors.inputName && (
                            <span className="error">{formErrors.inputName}</span>
                            )}
                                </div>
                            </div>
                            <div className="col-12 my-3">
                                <button type="submit" 
                                className="btn btn-primary"
                                disabled={loading}
                                >Sign Up</button>
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

export default SignUpPage;