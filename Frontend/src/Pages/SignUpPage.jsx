import React, { useState, useEffect } from "react";
import StateDropdown from '../Components/StateDropdown';
import CarrierDropdown from "../Components/CarrierDropdown";


function SignUpPage() {

    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const[error, setError] = useState('');
    const[email, setEmail] = useState('');

    const intialValues = { username: "", password: "", confirmPassword: "", email: "", firstName: "", lastName: "", inputName: "", address: ""};
    const [formValues, setFormValues] = useState(intialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = () => {
        console.log(formValues);
      };
    
      //input change handler
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
      };
    
      //form submission handler
      const handleSubmit = (e) => {
        console.log(formValues);
        e.preventDefault();
        setFormErrors(validate(formValues));
        setIsSubmitting(true);
      };
    
      //form validation handler
      const validate = (values) => {
        let errors = {};

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    
        if (!values.email) {
          errors.email = "Cannot be blank";
        } else if (!regex.test(values.email)) {
          errors.email = "Invalid email format";
        }
        if (!values.username) {
            errors.username = "Username cannot be blank";
          }

          if (!values.firstName) {
            errors.firstName = "First Name cannot be blank";
          }

          if (!values.lastName) {
            errors.lastName = "Last Name cannot be blank";
          }

          if (!values.inputName) {
            errors.inputName = "Please sign your name!";
          }

        if (!values.password) {
          errors.password = "Password cannot be blank";
        } else if (values.password.length < 8) {
          errors.password = "Password must be 8 characters or more";
        }
        

          if(!values.confirmPassword)
            errors.confirmPassword = "Confirm Password cannot be blank";
          else if (values.confirmPassword.length < 8) {
            errors.confirmPassword = "Confirm Password must be 8 characters or more";
          }

            if (values.password && values.confirmPassword)
            {
                if(values.password != values.confirmPassword)
                    errors.confirmPassword = "Confirm password mismatch";
            }

        return errors;
      };
    
      useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmitting) {
          submit();
        }
      }, [formErrors]);
    
    const handleSignup = async () => {
        //if(username && password){
            try{
                console.log(JSON.stringify({username, password, email}));
                const response = await fetch('http://localhost:8080/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({username, password, email}),
                });
                
                console.log('-----response-----');
                console.log(response);
                setError(response.status)
                if (!response.ok) {
                    if(response.status === 401){
                        setError('Invalid username or password');
                    }
                    if (response.status === 400)
                    {
                        setError("This username already exists");
                    }
                    return;
                }
                setError("User Created")
            } catch(error){
                setError(error.message);
            }
        //}else{
            //setError('Please enter username and password');
        //}
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
                            <input type="text" className="form-control" id="inputCity" />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="inputState" className="form-label">State</label>
                            <StateDropdown />
                        </div>
                        <div className="col-md-2">
                            <label htmlFor="inputZip" className="form-label">Zip</label>
                            <input type="text" className="form-control" id="inputZip" />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="inputPhoneNumber" className="form-label">Phone Number</label>
                            <input type="tel" className="form-control" id="inputPhoneNumber" placeholder="(000) 000-0000" />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="inputEmail4" className="form-label">Email *</label>
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
                                    onChange={handleChange} />
                            {formErrors.username && (
                            <span className="error">{formErrors.username}</span>
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
                            <label htmlFor="inputConfirmPassword" className="form-label">Confirm Password *</label>
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
                                <input className="form-check-input" type="checkbox" id="checkSMS" />
                                <label className="form-check-label" htmlFor="checkSMS">SMS notifications</label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="checkEmail" />
                                <label className="form-check-label" htmlFor="checkEmail">Email notifications</label>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-check">
                                <p className="fw-bold mb-1"> Opt in to SMS messages</p>
                                <input className="form-check-input" type="checkbox" id="gridCheck"/>
                                <label className="form-check-label" htmlFor="gridCheck">
                                    
                                    By opting in you agree to receive notifications about news, updates, volunteer activities.
                                </label>
                            </div>
                        </div>


                        <div className="col-md-6" >
                            <label htmlFor="PhoneCarrier" className="form-label">Choose Your Phone Carrier</label>
                            <CarrierDropdown></CarrierDropdown>
                        </div>
                    
                        </div>
                    
                        <hr className="mt-5"/>

                        <p className="fw-bold my-3">Date/Time Preference:</p>
                        <p className="fw-bold my-3">Morning</p>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="MondayAM" value="MondayAM" />
                            <label className="form-check-label" htmlFor="MondayAM">Monday</label>
                        </div>
                            <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="TuesdayAM" value="TuesdayAM" />
                            <label className="form-check-label" htmlFor="TuesdayAM">Tuesday</label>
                        </div>
                            <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="WednesdayAM" value="WednesdayAM" />
                            <label className="form-check-label" htmlFor="WednesdayAM">Wednesday</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="ThursdayAM" value="ThursdayAM" />
                            <label className="form-check-label" htmlFor="ThursdayAM">Thursday</label>
                        </div>
                            <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="FridayAM" value="FridayAM" />
                            <label className="form-check-label" htmlFor="FridayAM">Friday</label>
                        </div>
                            <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="SaturdayAM" value="SaturdayAM" />
                            <label className="form-check-label" htmlFor="SaturdayAM">Saturday</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="inlineCheckbox7" value="SundayAM" />
                            <label className="form-check-label" htmlFor="SundayAM">Sunday</label>
                        </div>
                            
                        <p className="fw-bold my-3">Afternoon</p>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="MondayPM" value="MondayPM" />
                            <label className="form-check-label" htmlFor="MondayPM">Monday</label>
                        </div>
                            <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="TuesdayPM" value="TuesdayPM" />
                            <label className="form-check-label" htmlFor="TuesdayPM">Tuesday</label>
                        </div>
                            <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="WednesdayPM" value="WednesdayPM" />
                            <label className="form-check-label" htmlFor="WednesdayPM">Wednesday</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="ThursdayPM" value="ThursdayPM" />
                            <label className="form-check-label" htmlFor="ThursdayPM">Thursday</label>
                        </div>
                            <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="FridayPM" value="FridayPM" />
                            <label className="form-check-label" htmlFor="FridayPM">Friday</label>
                        </div>
                            <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="SaturdayPM" value="SaturdayPM" />
                            <label className="form-check-label" htmlFor="SaturdayPM">Saturday</label>
                        </div>  
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="inlineCheckbox14" value="SundayPM" />
                            <label className="form-check-label" htmlFor="SundayPM">Sunday</label>
                        </div>

                        <hr className="mt-5"/>

                        <p className="fw-bold my-3">Task Preference:</p>
                    
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="smallDog" value="smallDog" />
                            <label className="form-check-label" htmlFor="smallDog">Small Dogs</label>
                        </div>
                            <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="bigDog" value="bigDog" />
                            <label className="form-check-label" htmlFor="bigDog">Big Dogs</label>
                        </div>
                            <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="cat" value="cat" />
                            <label className="form-check-label" htmlFor="cat">Cats</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="oneTimeEvent" value="oneTimeEvent" />
                            <label className="form-check-label" htmlFor="oneTimeEvent">One-time events</label>
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
                                    id="inputName" 
                                    onChange={handleChange} />
                            {formErrors.inputName && (
                            <span className="error">{formErrors.inputName}</span>
                            )}
                                </div>
                            </div>
                            {error}
                            <div className="col-12 my-3">
                                <button type="submit" className="btn btn-primary">Sign Up</button>
                            </div>
                        </div> 
                    </form>
                </div>
            </div>
            
        </section>
           
    );
};

export default SignUpPage;