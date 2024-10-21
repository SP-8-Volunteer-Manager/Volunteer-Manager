
function SignUpPage() {
    return (

                 
        <section>
            <div className="container pb-5">
                <div>
                    <h1>Hi, there!</h1>
                    <p>The success of our organization is due largely to the number of outstanding volunteers we have. We appreciate your interest in pursuing volunteer opportunities with Homeward Bound.   We need you !! Please start the process by letting us know what areas you are interested in helping with and submit it using the button at the bottom of the page.
                    Applicants must be 18 years or older.</p>
                </div>
                <div className="p-5 rounded-5 " style={{backgroundColor: '#f0f6fd'}}>
                    <form >
                        <div className="row gx-5 gy-3 mb-3">
                        <div className="col-md-6">
                            <label htmlFor="inputFirstName" className="form-label">First Name *</label>
                            <input type="text" className="form-control" id="inputFirstName" required/>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="inputLastName" className="form-label">Last Name *</label>
                            <input type="text" className="form-control" id="inputLastName" required/>
                        </div>
                        
                        <div className="col-12">
                            <label htmlFor="inputAddress" className="form-label">Address</label>
                            <input type="text" className="form-control" id="inputAddress" placeholder="1234 Main St" />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="inputCity" className="form-label">City</label>
                            <input type="text" className="form-control" id="inputCity" />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="inputState" className="form-label">State</label>
                            <select id="inputState" className="form-select">
                            <option selected>Choose...</option>
                            <option>...</option>
                            </select>
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
                            <input type="email" className="form-control" id="inputEmail4" required/>
                        </div>
                       
                        <hr className="mt-5"/>

                        <div className="col-md-6">
                            <label htmlFor="inputUsername" className="form-label">Username *</label>
                            <input type="text" className="form-control" id="inputUsername" required/>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="inputPassword4" className="form-label">Password *</label>
                            <input type="password" className="form-control" id="inputPassword4" required/>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="inputConfirmPassword" className="form-label">Confirm Password *</label>
                            <input type="password" className="form-control" id="inputConfirmPassword" required/>
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
                            <input className="form-check-input" type="checkbox" id="gridCheck" />
                            <label className="form-check-label" htmlFor="gridCheck">
                                
                                By opting in you agree to receive notifications about news, updates, volunteer activities.
                            </label>
                            </div>
                        </div>


                        <div className="col-md-6">
                            <label htmlFor="PhoneCarrier" className="form-label">Choose Your Phone Carrier</label>
                            <select className="form-select" aria-label="Choose phone carrier">
                                <option selected>Choose phone carrier</option>
                                <option value="AT&T">AT&T</option>
                                <option value="T-Mobile">T-Mobile</option>
                                <option value="Verizon">Verizon</option>
                                <option value="Mint-Mobile">Mint Mobile</option>
                                <option value="Sprint">Sprint</option>
                               
                            </select>
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
                                    <input type="text" id="inputName" className="form-control" required/>
                                </div>
                            </div>
                            
                            <div className="col-12 my-3">
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                        </div> 
                    </form>
                </div>
            </div>
            
        </section>
           
    );
};


export default SignUpPage;