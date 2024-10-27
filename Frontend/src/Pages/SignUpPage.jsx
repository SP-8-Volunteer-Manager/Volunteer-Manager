import React, { useState, useEffect } from "react";
import StateDropdown from '../Components/StateDropdown';
import CarrierDropdown from "../Components/CarrierDropdown";
import ShiftCheckbox from "../Components/ShiftCheckbox";
//import { checkuserexists } from "../../../Backend/src/controller/authController";


function SignUpPage() {

    const[usercheckerror, setUserCheckError] = useState('');
    const[password, setPassword] = useState('');
    const[usermsg, setUserMsg] = useState('');
    const[email, setEmail] = useState('');

    const intialValues = { username: "", password: "", confirmPassword: "", email: "", firstName: "", lastName: "", inputName: "", address: "", city: "", state: "", zip: "",
         phoneNumber: "", carrier: "", receivesms: false, receiveemail: false, smalldog: false, bigdog: false, cat: false, onetimeevent: false,
         emailoptin: false,
         smsoptin: false,
         MondayAM : false, 
         TuesdayAM : false,  
         WednesdayAM : false,  
         ThursdayAM : false,  
         FridayAM : false,  
         SaturdayAM : false,  
         SundayAM : false,  
         MondayPM : false,  
         TuesdayPM : false,  
         WednesdayPM : false,  
         ThursdayPM : false,  
         FridayPM : false,  
         SaturdayPM : false,  
         SundayPM : false
    };
    const [formValues, setFormValues] = useState(intialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        setFormValues({ ...formValues, [name]: checked });
        console.log(name + " " +  checked);
      };
    
      //form submission handler
      const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));
        setIsSubmitting(true);
      };
    
      //form validation handler
      const validate = (values) => {
        let errors = {};

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    
        if (!values.email) {
          errors.email = "Email cannot be blank";
        } else if (!regex.test(values.email)) {
          errors.email = "Invalid email format";
        }
        if (!values.username) {
            errors.username = "Username cannot be blank";
        }
        if (usercheckerror != "")
        {
            errors.username = usercheckerror;
        }

        // if (values.username) {
        //     console.log('user check')
        //    const p =  checkUserExists(values.username)
        //    p.then()
        //    console.log(dta);
        // }
          if (!values.firstName) {
            errors.firstName = "First Name cannot be blank";
          }

          if (!values.lastName) {
            errors.lastName = "Last Name cannot be blank";
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

        if (values.receivesms === true)
        {
            if (!values.carrier)
            {
                errors.carrier = "Please choose a phone carrier";
            }
        }

        if (values.receivesms === false && values.carrier)
        {
            errors.carrier = "Reset Carrier Dropdown to \'Select Carrier\'";
        }

        if (values.receiveemail === false && values.receivesms === false)
        {
            errors.receiveemail = "Select at least one";
        }

        if (values.receivesms === true && values.smsoptin === false)
        {
            errors.smsoptin = "SMS Opt-in required";
        }

        if (values.receiveemail === true && values.emailoptin === false)
        {
            errors.emailoptin = "Email Opt-in required";
        }

        if (values.receiveemail === false && values.emailoptin === true)
        {
            errors.emailoptin = "Uncheck email opt in";
        }

        if (values.receivesms === false && values.smsoptin === true)
        {
            errors.smsoptin = "Uncheck sms opt in";
        }

        if (!values.password) {
          errors.password = "Password cannot be blank";
        } 
        else if (values.password.length < 6) {
          errors.password = "Password must be 6 characters or more";
        }
        


          if(!values.confirmPassword)
            errors.confirmPassword = "Confirm Password cannot be blank";
        //   else if (values.confirmPassword.length < 8) {
        //     errors.confirmPassword = "Confirm Password must be 8 characters or more";
        //   }

            if (values.password && values.confirmPassword)
            {
                if(values.password != values.confirmPassword)
                    errors.confirmPassword = "Confirm password mismatch";
            }

            if(values.receivesms === false && values.receiveemail === false)
            {
                errors.receiveemail = "Choose at least one of email or sms";
                errors.receivesms = "Choose at least one of email or sms";
            }

            if (values.smalldog === false && values.bigdog === false && values.cat === false && values.onetimeevent === false)
            {
                errors.onetimeevent = "Task preference is required";
            }

            //zip must be numeric and 5
            if (values.zip)
            {
                if(values.zip.length != 5)
                {
                    errors.zip = "Zip code must be 5 digits";
                }
            }

            if ( // am shift
                values.MondayAM === false && 
                values.TuesdayAM === false && 
                values.WednesdayAM === false && 
                values.ThursdayAM === false && 
                values.FridayAM === false && 
                values.SaturdayAM === false && 
                values.SundayAM === false && 
                // pm shift
                values.MondayPM === false && 
                values.TuesdayPM === false && 
                values.WednesdayPM === false && 
                values.ThursdayPM === false && 
                values.FridayPM === false && 
                values.SaturdayPM === false && 
                values.SundayPM === false
                ) {
                    errors.SundayPM = "Shift preference is required";
            }
            
            if(errors)
            {
                setUserMsg("Please fix errors and resubmit");
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
        var shiftData =[]
        if (formValues.MondayAM == true) shiftData.push({day:'Monday', time:'AM'});
        if (formValues.TuesdayAM == true) shiftData.push({day:'Tuesday', time:'AM'});
        if (formValues.WednesdayAM == true) shiftData.push({day:'Wednesday', time:'AM'});
        if (formValues.ThursdayAM == true) shiftData.push({day:'Thursday', time:'AM'});
        if (formValues.FridayAM == true) shiftData.push({day:'Friday', time:'AM'});
        if (formValues.SaturdayAM == true) shiftData.push({day:'Saturday', time:'AM'});
        if (formValues.SundayAM == true) shiftData.push({day:'Sunday', time:'AM'});

        if (formValues.MondayPM == true) shiftData.push({day:'Monday', time:'PM'});
        if (formValues.TuesdayPM == true) shiftData.push({day:'Tuesday', time:'PM'});
        if (formValues.WednesdayPM == true) shiftData.push({day:'Wednesday', time:'PM'});
        if (formValues.ThursdayPM == true) shiftData.push({day:'Thursday', time:'PM'});
        if (formValues.FridayPM == true) shiftData.push({day:'Friday', time:'PM'});
        if (formValues.SaturdayPM == true) shiftData.push({day:'Saturday', time:'PM'});
        if (formValues.SundayPM == true) shiftData.push({day:'Sunday', time:'PM'});
       
       // console.log(shiftData);
       var signupData = {
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
            carrier:formValues.carrier,
            receivesms:formValues.receivesms,
            receiveemail:formValues.receiveemail,
            smalldog:formValues.smalldog,
            bigdog:formValues.bigdog,
            cat:formValues.cat,
            onetimeevent:formValues.onetimeevent,
            shiftpref:shiftData};
           // console.log(signupData)
        return signupData;
    }
       // username: "", password: "", confirmPassword: "", email: "", firstName: "", lastName: "", inputName: "", address: "", city: "", state: "", zip: "",
       //  phoneNumber: "", carrier: "", receivesms: false, receiveemail: false, smalldog: false, bigdog: false, cat: false, onetimeevent: false,
    const handleSignup = async () => {
            try{
                const signupData = makeFormData();
                console.log(JSON.stringify(signupData));
                //console.log(JSON.stringify(formValues));
                const response = await fetch('http://localhost:8080/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(signupData),
                });
                const result = await response.json();

                if (response.ok) {
                    if (result.error == "Y")
                    {
                        console.log(result.message);
                        setUserMsg(result.message);
                    }

                    if (result.error == "N")
                        {
                            console.log(result.message);
                            setUserMsg(result.message);
                        }
                }
            }
             catch(error){
                throw error;
            }
    };

    const handleUserCheck = async () => {
        console.log("Entering handle user check")
        try{
            setUserCheckError('');
            const response = await fetch('http://localhost:8080/api/auth/checkuserexists', {
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
                    console.log("Error Set Hook: " + usercheckerror);
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
                                    onChange={handleChange} />
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
                                    onChange={handleChange} />
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
                                    onChange={handleChange} />
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
                                    onChange={handleChange} />
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
                                    onChange={handleChange} />
                            {formErrors.confirmPassword && (
                            <span className="error">{formErrors.confirmPassword}</span>
                            )}
                        </div>

                        <hr className="mt-5"/>

                         <div className="col-md-12 mb-4">
                            
                            <p className="fw-bold mb-1"> Prefered communication method</p>
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
                                value={formValues.smsoptin} 
                                onChange={checkboxChange}/>
                                <label className="form-check-label" htmlFor="SMScheck">
                                    By opting in you agree to receive SMS notifications about news, updates, volunteer activities.
                                </label>
                                {formErrors.smsoptin && (
                            <span className="error">{formErrors.smsoptin}</span>
                            )}
                            </div>
                        </div>


                        <div className="col-md-6" >
                            <label htmlFor="PhoneCarrier" className="form-label">Choose Your Phone Carrier</label>
                            <CarrierDropdown dropdownChange={dropdownChange}/>
                            {formErrors.carrier && (
                            <span className="error">{formErrors.carrier}</span>
                            )}
                        </div>

                        <div className="col-md-6">
                            <div className="form-check">
                                <p className="fw-bold mb-1"> Opt in to email notifications</p>
                                <input className="form-check-input" type="checkbox" id="emailCheck"
                                name="emailoptin"
                                value={formValues.emailoptin}
                                onChange={checkboxChange}/>
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


                        <p className="fw-bold my-3">Date/Time Preference:</p>
                        <p className="fw-bold my-3">Morning</p>
                        <ShiftCheckbox day="Monday" time="AM" checkboxChange={checkboxChange}/>
                        <ShiftCheckbox day="Tuesday" time="AM" checkboxChange={checkboxChange}/>
                        <ShiftCheckbox day="Wednesday" time="AM" checkboxChange={checkboxChange}/>
                        <ShiftCheckbox day="Thursday" time="AM" checkboxChange={checkboxChange}/>
                        <ShiftCheckbox day="Friday" time="AM" checkboxChange={checkboxChange}/>
                        <ShiftCheckbox day="Saturday" time="AM" checkboxChange={checkboxChange}/>
                        <ShiftCheckbox day="Sunday" time="AM" checkboxChange={checkboxChange}/>
                        
                            
                        <p className="fw-bold my-3">Afternoon</p>
                        <ShiftCheckbox day="Monday" time="PM" checkboxChange={checkboxChange}/>
                        <ShiftCheckbox day="Tuesday" time="PM" checkboxChange={checkboxChange}/>
                        <ShiftCheckbox day="Wednesday" time="PM" checkboxChange={checkboxChange}/>
                        <ShiftCheckbox day="Thursday" time="PM" checkboxChange={checkboxChange}/>
                        <ShiftCheckbox day="Friday" time="PM" checkboxChange={checkboxChange}/>
                        <ShiftCheckbox day="Saturday" time="PM" checkboxChange={checkboxChange}/>
                        <ShiftCheckbox day="Sunday" time="PM" checkboxChange={checkboxChange}/>
                        {formErrors.SundayPM && (
                            <span className="error">{formErrors.SundayPM}</span>
                            )}

                        <hr className="mt-5"/>

                        <p className="fw-bold my-3">Task Preference:</p>
                    
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="smallDog" name="smalldog" value={formValues.smalldog} 
                                onChange={checkboxChange}/>
                            <label className="form-check-label" htmlFor="smallDog">Small Dogs</label>
                        </div>
                            <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="bigDog" name="bigdog" value={formValues.bigdog} 
                                onChange={checkboxChange}/>
                            <label className="form-check-label" htmlFor="bigDog">Big Dogs</label>
                        </div>
                            <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="cat" name="cat" value={formValues.cat} 
                                onChange={checkboxChange}/>
                            <label className="form-check-label" htmlFor="cat">Cats</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="oneTimeEvent" name="onetimeevent" value={formValues.onetimeevent} 
                                onChange={checkboxChange}/>
                            <label className="form-check-label" htmlFor="oneTimeEvent">One-time events</label>
                        </div>
                        {formErrors.onetimeevent && (
                            <span className="error">{formErrors.onetimeevent}</span>
                            )}
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
                                    onChange={handleChange} />
                            {formErrors.inputName && (
                            <span className="error">{formErrors.inputName}</span>
                            )}
                                </div>
                            </div>
                            <div className="col-12 my-3">
                                <button type="submit" className="btn btn-primary">Sign Up</button>
                            </div>
                            <span className="error">{usermsg}</span>
                        </div> 
                    </form>
                </div>
            </div>
            
        </section>
           
    );
};

export default SignUpPage;