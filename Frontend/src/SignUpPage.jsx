
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
                    <form className="row gx-5 gy-3 mb-3">
                        <div className="col-md-6">
                            <label forHTML="inputFirstName" className="form-label">First Name</label>
                            <input type="text" className="form-control" id="inputFirstName" />
                        </div>
                        <div className="col-md-6">
                            <label forHTML="inputLastName" className="form-label">Last Name</label>
                            <input type="text" className="form-control" id="inputLastName" />
                        </div>
                        <div className="col-md-6">
                            <label forHTML="inputPhoneNumber" className="form-label">Phone Number</label>
                            <input type="tel" className="form-control" id="inputPhoneNumber" placeholder="(000) 000-0000"/>
                        </div>
                        <div className="col-md-6">
                            <div className="form-check">
                            <p className="fw-bold mb-1"> Opt in to SMS messages</p>
                            <input className="form-check-input" type="checkbox" id="gridCheck" />
                            <label className="form-check-label" forHTML="gridCheck">
                                
                            By opting in you agree to receive notifications about news, updates, volunteer activities.
                            </label>
                            </div>
                        </div>
                        <div className="col-12">
                            <label forHTML="inputAddress" className="form-label">Address</label>
                            <input type="text" className="form-control" id="inputAddress" placeholder="1234 Main St" />
                        </div>
                        <div className="col-md-6">
                            <label forHTML="inputCity" className="form-label">City</label>
                            <input type="text" className="form-control" id="inputCity" />
                        </div>
                        <div className="col-md-4">
                            <label forHTML="inputState" className="form-label">State</label>
                            <select id="inputState" className="form-select">
                            <option selected>Choose...</option>
                            <option>...</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label forHTML="inputZip" className="form-label">Zip</label>
                            <input type="text" className="form-control" id="inputZip" />
                        </div>

                        <div className="col-md-6">
                            <label forHTML="inputEmail4" className="form-label">Email</label>
                            <input type="email" className="form-control" id="inputEmail4" />
                        </div>
                    
                        <div className="col-md-6">
                            <label forHTML="inputUsername" className="form-label">Username</label>
                            <input type="text" className="form-control" id="inputUsername" />
                        </div>
                        <div className="col-md-6">
                            <label forHTML="inputPassword4" className="form-label">Password</label>
                            <input type="password" className="form-control" id="inputPassword4" />
                        </div>
                        <div className="col-md-6">
                            <label forHTML="inputConfirmPassword" className="form-label">Confirm Password</label>
                            <input type="password" className="form-control" id="inputConfirmPassword" />
                        </div>
                    </form>
                       
                    <p className="fw-bold my-3">Date/Time Preference:</p>
                    <p className="fw-bold my-3">Morning</p>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="Monday" />
                        <label className="form-check-label" forHTML="inlineCheckbox1">Monday</label>
                    </div>
                        <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" id="inlineCheckbox2" value="Tuesday" />
                        <label className="form-check-label" forHTML="inlineCheckbox2">Tuesday</label>
                    </div>
                        <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" id="inlineCheckbox3" value="Wednesday" />
                        <label className="form-check-label" forHTML="inlineCheckbox3">Wednesday</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" id="inlineCheckbox4" value="Thursday" />
                        <label className="form-check-label" forHTML="inlineCheckbox1">Thursday</label>
                    </div>
                        <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" id="inlineCheckbox5" value="Friday" />
                        <label className="form-check-label" forHTML="inlineCheckbox2">Friday</label>
                    </div>
                        <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" id="inlineCheckbox6" value="Saturday" />
                        <label className="form-check-label" forHTML="inlineCheckbox3">Saturday</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" id="inlineCheckbox7" value="Sunday" />
                        <label className="form-check-label" forHTML="inlineCheckbox3">Sunday</label>
                    </div>
                        
                    <p className="fw-bold my-3">Afternoon</p>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" id="inlineCheckbox8" value="Monday2" />
                        <label className="form-check-label" forHTML="inlineCheckbox1">Monday</label>
                    </div>
                        <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" id="inlineCheckbox9" value="Tuesday2" />
                        <label className="form-check-label" forHTML="inlineCheckbox2">Tuesday</label>
                    </div>
                        <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" id="inlineCheckbox10" value="Wednesday2" />
                        <label className="form-check-label" forHTML="inlineCheckbox3">Wednesday</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" id="inlineCheckbox11" value="Thursday2" />
                        <label className="form-check-label" forHTML="inlineCheckbox1">Thursday</label>
                    </div>
                        <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" id="inlineCheckbox12" value="Friday2" />
                        <label className="form-check-label" forHTML="inlineCheckbox2">Friday</label>
                    </div>
                        <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" id="inlineCheckbox13" value="Saturday2" />
                        <label className="form-check-label" forHTML="inlineCheckbox3">Saturday</label>
                    </div>  
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" id="inlineCheckbox14" value="Sunday2" />
                        <label className="form-check-label" forHTML="inlineCheckbox3">Sunday</label>
                    </div>
                        
                        <div className="col-12 my-3">
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                        </div> 

            </div>
            
        </section>
           
    );
};


export default SignUpPage;